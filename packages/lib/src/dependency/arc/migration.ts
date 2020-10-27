import {
  DAOMigrationParams,
  DAOMigrationCallbacks,
  DAOMigrationResult
} from "./types";
import { getWeb3, getNetworkName, getDefaultOpts } from "../../dependency/web3";

const migrate = require("./src/migrate-dao");
const addresses = require("./src/migration.json");

export const migrateDAO = async (
  dao: DAOMigrationParams,
  callbacks: DAOMigrationCallbacks
): Promise<DAOMigrationResult | undefined> => {
  try {
    const web3 = await getWeb3();
    const opts = await getDefaultOpts();
    let network = await getNetworkName();

    if (network === 'private') {
      if (await web3.eth.net.getId() === 100) {
        network = 'xdai'
      } else if (await web3.eth.net.getId() === 77) {
        network = 'sokol'
      }
    }

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

    const sendTx = async (
      tx: any,
      msg: string
    ): Promise<{ receipt: any; result: any }> => {
      callbacks.info(msg);

      let gas = 0;
      const nonce = await web3.eth.getTransactionCount(web3.eth.defaultAccount);
      const blockLimit = await web3.eth.getBlock("latest").gasLimit;

      try {
        gas = await tx.estimateGas();
        if (gas * 1.1 < blockLimit - 100000) {
          gas *= 1.1;
        }
      } catch (error) {
        gas = blockLimit - 100000;
      }

      let result = tx.send({ gas, nonce });
      let receipt = await new Promise(resolve =>
        result.on("receipt", resolve).on("error", async (error: Error) => {
          callbacks.error("Transaction failed: " + error.message);
          resolve();
        })
      );

      if (receipt === "failed") {
        return sendTx(tx, "Retrying...");
      }

      result = await result;
      return { receipt, result };
    };

    const arcVersion = "0.1.2-rc.7";
    const getArcVersionNumber = (ver: string) => Number(ver.slice(-1));

    // If the user doesn't have a supported network chosen, abort
    if (addresses[network] === undefined) {
      throw Error(
        `The network you have chosen (${network}) isn't supported. ` +
          `Please select one of the supported networks: ${Object.keys(
            addresses
          )}`
      );
    }

    // Get the stored deployment state, and ask the user if they'd like to
    // resume it (if one exists)
    const prevState = callbacks.getState(network);
    let restartDeployment = true;

    if (Object.keys(prevState).length > 0) {
      restartDeployment = !(await callbacks.userApproval(
        "We found a deployment that's was in progress, pickup where you left off?"
      ));
    }

    // Report back to caller the version of Arc being used
    callbacks.info(`Using Arc Version: ${arcVersion}`);

    const migration = await migrate({
      arcVersion,
      getArcVersionNumber,
      migrationParams: dao,
      web3,
      spinner: {
        start: callbacks.info,
        fail: callbacks.error,
        succeed: callbacks.info
      },
      confirm: callbacks.userApproval,
      logTx,
      sendTx,
      opts,
      previousMigration: { ...addresses[network] },
      customabislocation: undefined,
      restart: restartDeployment,
      getState: callbacks.getState,
      setState: callbacks.setState,
      cleanState: callbacks.cleanState,
      optimizedAbis: true
    });

    if (migration === undefined) {
      throw Error(
        "Something terrible has gone wrong! Please be sure to hit 'yes' on the prompts asking" +
          " for your approval. If this isn't your issue, please report this as a bug."
      );
    }

    const result = migration!.dao[arcVersion];
    console.log(result);
    callbacks.migrationComplete(result);

    return {
      arcVersion: result.arcVersion,
      name: result.name,
      Avatar: result.Avatar,
      DAOToken: result.DAOToken,
      Reputation: result.Reputation,
      Controller: result.Controller,
      Schemes: result.Schemes,
      StandAloneContracts: result.StandAloneContracts
    };
  } catch (e) {
    callbacks.migrationAborted(e.message);
    return undefined;
  }
};
