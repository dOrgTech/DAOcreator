import { DAO, NewDaoConfig } from "@daostack/arc.js"

export const createDao = (config: NewDaoConfig) => {
  console.log("CREATING DAO!")
  console.log(JSON.stringify(config))
  DAO.new(config)
}
