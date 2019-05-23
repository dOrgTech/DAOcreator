import hash from "object-hash"
import * as R from "ramda"
import Web3 from "web3"
import { ContractOptions } from "web3-eth-contract"
import {
  getSchemeCallableParamsArray,
  getSchemeDefinition,
  getVotingMachineCallableParamsArray,
} from "./index"
import {
  DAO,
  DeploymentInfo,
  Founder,
  SchemeConfig,
  VotingMachineConfig,
} from "./types"

export const createDao = async (
  web3: Web3,
  updateStatus: (message: string) => void,
  deployedContractAddresses: any,
  naming: any,
  founders: Founder[],
  schemesIn: SchemeConfig[]
): Promise<DAO> => {
  const txSend = sendTx(web3)
  updateStatus(
    "Creating new organization. This requires 1 transaction. \n Step 1 of 4."
  )
  const addresses = deployedContractAddresses.base

  const gasPrice = web3.utils.fromWei(await web3.eth.getGasPrice(), "gwei")
  const block = await web3.eth.getBlock("latest")
  let nonce =
    (await web3.eth.getTransactionCount(web3.eth.defaultAccount as string)) - 1

  const opts: ContractOptions = {
    from: web3.eth.defaultAccount as string,
    gas: block.gasLimit - 100000, // TODO: fix
    gasPrice: web3.utils.toWei(gasPrice.toString(), "gwei"),
    data: "",
  }

  const daoCreator = new web3.eth.Contract(
    require("@daostack/arc/build/contracts/DaoCreator.json").abi,
    addresses.DaoCreator,
    opts
  )

  const [
    orgName,
    tokenName,
    tokenSymbol,
    founderAddresses,
    tokenDist,
    repDist,
    uController,
    cap, // TODO: Should probably be configurable by the user
  ] = [
    naming.daoName,
    naming.tokenName,
    naming.tokenSymbol,
    founders.map(({ address }) => address),
    founders.map(({ tokens }) => web3.utils.toWei(tokens.toString())),
    founders.map(({ reputation }) => web3.utils.toWei(reputation.toString())),
    addresses.UController,
    "0",
  ]
  const forgeOrg = daoCreator.methods.forgeOrg(
    orgName,
    tokenName,
    tokenSymbol,
    founderAddresses,
    tokenDist,
    repDist,
    uController,
    cap
  )

  const Avatar = await forgeOrg.call()

  let tx = await txSend(forgeOrg, ++nonce)
  console.log("Created new organization. With avatar address: " + Avatar)
  console.log(tx)

  const avatar = new web3.eth.Contract(
    require("@daostack/arc/build/contracts/Avatar.json").abi,
    Avatar,
    opts
  )

  const daoToken = await avatar.methods.nativeToken().call()
  const reputation = await avatar.methods.nativeReputation().call()

  const votingMachineConfigToHash = (
    votingMachineConfig: VotingMachineConfig
  ) => {
    const callableVotingParams = getVotingMachineCallableParamsArray(
      votingMachineConfig
    )
    const { typeName } = votingMachineConfig
    return hash({ typeName, callableVotingParams })
  }

  const initializedSchemes = R.map(schemeConfig => {
    return {
      schemeConfig,
      schemeContract: new web3.eth.Contract(
        require(`@daostack/arc/build/contracts/${
          schemeConfig.typeName
        }.json`).abi,
        addresses[schemeConfig.typeName],
        opts
      ),
      votingMachineHash:
        schemeConfig.votingMachineConfig != null
          ? votingMachineConfigToHash(schemeConfig.votingMachineConfig)
          : null,
    }
  }, schemesIn)

  const initializedVotingMachines: any = R.reduce(
    (acc, schemeConfig) => {
      if (schemeConfig.votingMachineConfig != null) {
        const votingMachineConfig = schemeConfig.votingMachineConfig
        const votingMachineContract = new web3.eth.Contract(
          require(`@daostack/arc/build/contracts/${
            votingMachineConfig.typeName
          }.json`).abi,
          addresses[votingMachineConfig.typeName],
          opts
        )
        return R.assoc(
          votingMachineConfigToHash(votingMachineConfig),
          {
            votingMachineContract,
            votingMachineCallableParamsArray: getVotingMachineCallableParamsArray(
              votingMachineConfig
            ),
            votingMachineAddress: addresses[votingMachineConfig.typeName],
            votingMachineTypeName: votingMachineConfig.typeName,
          },
          acc
        )
      } else {
        return acc
      }
    },
    {},
    schemesIn
  )

  console.log(
    "[Waiting for transactions] Setting parameters for voting machines"
  )

  const numberOfVotingMachines = R.keys(initializedVotingMachines).length

  updateStatus(
    "Initiating voting machine" +
      (numberOfVotingMachines > 1 ? "s." : ".") +
      ` This requires ${numberOfVotingMachines} transaction` +
      (numberOfVotingMachines > 1 ? "s." : ".") +
      "\n Step 2 of 4"
  )

  const parameterizedVotingMachines = await Promise.all(
    R.map(async votingMachineHash => {
      const {
        votingMachineAddress,
        votingMachineContract,
        votingMachineCallableParamsArray,
        votingMachineTypeName,
      }: any = initializedVotingMachines[votingMachineHash]
      const setParams = votingMachineContract.methods.setParameters.apply(
        null,
        votingMachineCallableParamsArray
      )

      const votingMachineParametersKey = await setParams.call()

      const tx = await txSend(setParams, ++nonce)
      console.log(
        `${votingMachineTypeName} (${votingMachineHash.toString()}) parameters set (${votingMachineCallableParamsArray.join(
          " ,"
        )}).`
      )
      console.log(tx)

      return {
        votingMachineAddress,
        votingMachineHash,
        votingMachineParametersKey,
      }
    }, R.keys(initializedVotingMachines))
  )

  const schemeAddresses = R.map(
    ({ schemeConfig }) => addresses[schemeConfig.typeName],
    initializedSchemes
  )
  const schemePermissions = R.map(
    ({ schemeConfig }) =>
      getSchemeDefinition(schemeConfig.typeName).permissions,
    initializedSchemes
  )

  console.log("[Waiting for transactions] Setting parameters for schemes")

  const numberOfSchemes = R.keys(initializedSchemes).length

  updateStatus(
    "Initiating scheme" +
      (numberOfSchemes > 1 ? "s." : ".") +
      ` This requires ${numberOfSchemes} transaction` +
      (numberOfSchemes > 1 ? "s." : ".") +
      "\n Step 3 of 4"
  )

  const schemeParams = await Promise.all(
    R.map(async ({ schemeConfig, schemeContract, votingMachineHash }) => {
      let deploymentInfo: DeploymentInfo = {
        avatar: Avatar,
        daoToken,
        reputation,
      }

      if (votingMachineHash != null) {
        const { votingMachineAddress, votingMachineParametersKey } = R.find(
          parameterizedVotingMachine =>
            parameterizedVotingMachine.votingMachineHash === votingMachineHash,
          parameterizedVotingMachines
        ) as any
        deploymentInfo = {
          ...deploymentInfo,
          votingMachineAddress,
          votingMachineParametersKey,
        }
      }
      const schemeParameters = getSchemeCallableParamsArray(
        schemeConfig,
        deploymentInfo
      )
      const setParams = schemeContract.methods.setParameters.apply(
        null,
        schemeParameters
      )
      const schemeParametersKey = await setParams.call()

      const tx = await txSend(setParams, ++nonce)
      console.log(
        `${schemeConfig.typeName} parameters set (${schemeParameters.join(
          " ,"
        )}).`
      )
      console.log(tx)

      return schemeParametersKey
    }, initializedSchemes)
  )

  console.log("Setting DAO schemes...")

  updateStatus(
    "Finalizing the organization by adding scheme" +
      (numberOfSchemes > 1 ? "s" : "") +
      " to the organization. This requires 1 transaction." +
      "\n Step 4 of 4"
  )

  tx = await txSend(
    daoCreator.methods.setSchemes(
      Avatar,
      schemeAddresses,
      schemeParams,
      schemePermissions,
      "metaData"
    ),
    ++nonce
  )
  console.log("DAO schemes set.")
  console.log(tx)

  return {
    avatar: Avatar,
    tokenName,
    tokenSymbol,
    name: orgName,
    daoToken,
    reputation,
  }
}

const sendTx = (web3: Web3) => (method: any, nonce: number) => {
  // if the transaction is replaced / speeded up (or other error)
  const subscribable = method.send({ nonce })

  subscribable.on("error", (error: any) => {
    console.log("Got this error:")
    console.error(error)
    console.log("However, we will continue waiting for the transaction.")
  })

  return Promise.race([
    new Promise((resolve, reject) => {
      subscribable.on("transactionHash", (hash: string) => {
        return pollTx(web3, hash)
          .then(resolve)
          .catch(reject)
      })
    }),
    new Promise((resolve, reject) => {
      subscribable.on("receipt", resolve)
    }),
    new Promise((resolve, reject) => {
      subscribable.on("confirmation", (_: any, receipt: any) =>
        resolve(receipt)
      )
    }),
  ])
}

const pollTx = (web3: Web3, hash: string): any =>
  web3.eth.getTransaction(hash).then((tx: any) => {
    console.log("pollTx res: " + JSON.stringify(tx))
    if (tx != null) {
      return Promise.resolve(tx)
    } else {
      return delay(5000).then(_ => pollTx(web3, hash))
    }
  })

function delay(time: number) {
  return new Promise(fulfill => {
    // eslint-disable-next-line
    setTimeout(fulfill, time)
  })
}
