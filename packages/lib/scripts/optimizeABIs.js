const optimizer = require("@daostack/migration/optimize-abis")

async function optimizeABIs () {
  optimizer.initDirectory()
  await optimizer.noDuplicates()
  await optimizer.noBytecode()
  await optimizer.noWhitespace()
}

if (require.main === module) {
  optimizeABIs().catch(err => {
    console.log(err)
    process.exit(1)
  })
} else {
  module.exports = optimizeABIs
}
