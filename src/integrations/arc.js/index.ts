export * from "./typeConversions"
import {
  DAO,
  NewDaoConfig,
  ConfigService,
  InitializeArcJs,
} from "@daostack/arc.js"

let isInitialized = false

export const init = async () => {
  // Initialize the ArcJS library
  ConfigService.set("estimateGas", true)
  ConfigService.set("txDepthRequiredForConfirmation.kovan", 0)

  // TODO: If you use Kovan uncomment this line
  // ConfigService.set("network", "kovan") // Set the network used to Kovan

  await InitializeArcJs({
    watchForAccountChanges: true,
  })
  isInitialized = true
}

export const createDao = async (config: NewDaoConfig) => {
  if (!isInitialized) {
    await init()
  }
  console.log("CREATING DAO!")
  console.log(JSON.stringify(config))
  await DAO.new(config)
}
