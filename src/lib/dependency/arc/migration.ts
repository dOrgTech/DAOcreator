// TODO: additional options (use DAOcreator, etc)
/* eslint-disable */

import {
  DAOMigrationParams,
  DAOMigrationCallbacks,
  DAOMigrationResult
} from "./types";
import { getWeb3, getNetworkName, getDefaultOpts } from "lib/dependency/web3";

const migrate = require("@daostack/migration/migrate-dao");
const addresses = require("@daostack/migration/migration.json");
const arcVersion = require("@daostack/migration/package.json").dependencies[
  "@daostack/arc"
];

export const migrateDAO = async (
  dao: DAOMigrationParams,
  callbacks: DAOMigrationCallbacks
): Promise<DAOMigrationResult | undefined> => {
  const web3 = await getWeb3();
  const opts = await getDefaultOpts();
  const network = await getNetworkName();

  const logTx = async ({ transactionHash, gasUsed }: any, msg: string) => {
    const tx = await web3.eth.getTransaction(transactionHash);

    if (tx != null) {
      const gasPrice = tx.gasPrice;
      const txCost = web3.utils.fromWei(
        (gasUsed * gasPrice).toString(),
        "ether"
      );
      callbacks.txComplete(msg, transactionHash, txCost);
    }
  };

  const prevState = callbacks.getState();
  let restartDeployment = true;

  if (Object.keys(prevState).length > 0) {
    restartDeployment = !(await callbacks.userApproval(
      "We found a deployment that's was in progress, pickup where you left off?"
    ));
  }

  // Report back to caller the version of Arc being used
  callbacks.info(`Using Arc Version: ${arcVersion}`);

  try {
    const migration = await migrate({
      migrationParams: dao,
      arcVersion,
      web3,
      spinner: {
        start: callbacks.info,
        fail: callbacks.error,
        info: callbacks.info
      },
      confirm: callbacks.userApproval,
      logTx,
      opts,
      previousMigration: { ...addresses[network] },
      customabislocation: undefined,
      restart: restartDeployment,
      getState: callbacks.getState,
      setState: callbacks.setState,
      cleanState: callbacks.cleanState
    });

    if (migration === undefined) {
      throw Error(
        "Something terrible has gone wrong! Please be sure to hit 'yes' on the prompts asking" +
          " for your approval. If this isn't your issue, please report this as a bug."
      );
    }

    // TODO: create an interface for the migration result
    const result = migration!.dao[arcVersion];
    console.log(result);

    return {
      arcVersion: arcVersion,
      name: result.name,
      Avatar: result.Avatar,
      DAOToken: result.DAOToken,
      Reputation: result.Reputation,
      Controller: result.Controller
    };
  } catch (e) {
    callbacks.migrationAborted(e.message);
    return undefined;
  }
};
