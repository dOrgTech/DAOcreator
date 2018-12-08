import TypeValidation from "./typeValidation"
import * as rawWeb3 from "web3"
const Web3 = rawWeb3 as any

let web3: any
if (typeof web3 !== "undefined") {
  web3 = new Web3(web3.currentProvider)
} else {
  // TODO: set the provider you want
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
}

export const typeValidation = TypeValidation(web3)

/**
   THIS IS FOR WEB3 V1
''
import Web3 = require("web3")
import { Config } from "../config"

var web3 = new Web3(Web3.givenProvider || Config.web3.host)
console.log("Web3 version: " + web3.version)
**/
