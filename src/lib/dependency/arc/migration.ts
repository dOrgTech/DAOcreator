// TODO: additional options (use DAOcreator, etc)

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

  // Report back to caller the version of Arc being used
  callbacks.info(`Using Arc Version: ${arcVersion}`);

  try {
    const migration = await migrate({
      migrationParams: dao,
      web3,
      spinner: {
        start: callbacks.info,
        fail: callbacks.error
      },
      confirm: callbacks.userApproval,
      logTx,
      opts,
      previousMigration: { ...addresses[network] },
      customabislocation: undefined
    });

    // TODO: create an interface for the migration result
    const result = migration.dao[arcVersion];
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
    callbacks.migrationAborted(e);
    return undefined;
  }
};
