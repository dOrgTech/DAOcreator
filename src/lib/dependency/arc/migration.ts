// confirmation... yes/no
// steps...
// spinner (msg) -> error ? -> logTx (done message)

// TODO: additional options (use DAOcreator, etc)

import { DAOMigrationParams, DAOMigrationCallbacks } from "./types";
import { getWeb3 } from "lib/dependency/web3";
const migrate = require("@daostack/migration/migrate-dao");
const addresses = require("@daostack/migration/migration.json");
const arcVersion = require("@daostack/migration/package.json").dependencies[
  "@daostack/arc"
];

export const migrateDAO = async (
  dao: DAOMigrationParams,
  callbacks: DAOMigrationCallbacks
): Promise<any> => {
  const web3 = await getWeb3();

  // default opts for web3
  const block = await web3.eth.getBlock("latest");
  const opts = {
    from: web3.eth.defaultAccount,
    gas: block.gasLimit - 100000,
    gasLimit: undefined
  };

  // TODO: move this into web3 lib
  let network = await web3.eth.net.getNetworkType();
  if (network === "main") {
    network = "mainnet";
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

  // return arc version
  return migration.dao[arcVersion]; // name, Avatar, DAOToken, Reputation, Controller, Schemes

  // TODO: ensure etherscan verification
  // TODO: create an interface for the migration result
};
