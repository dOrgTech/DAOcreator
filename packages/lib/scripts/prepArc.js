const fs = require("fs")
const ncp = require("ncp").ncp
const path = require("path")
const rimraf = require("rimraf")
const optimizer = require("@daostack/migration/optimize-abis")

async function optimizeABIs () {
  optimizer.initDirectory()
  await optimizer.noBytecode()
  await optimizer.noWhitespace()
}

async function copyMigrationScript () {
  const toCopy = [
    "migrate-dao.js",
    "utils.js",
    "sanitize.js",
    "migration.json",
    "contracts-optimized/0.0.1-rc.33"
  ]
  const baseDir = path.dirname(require.resolve("@daostack/migration"))
  const destDir = path.join(__dirname, "../src/dependency/arc/src")

  // Remove all existing files in the destination directory
  fs.readdirSync(destDir).forEach(file => {
    rimraf.sync(path.join(destDir, file))
  })

  // Copy all required files to the destination directory
  toCopy.forEach(async (file) => {
    await new Promise((resolve, reject) => {
      // Create nested folders if there are any
      const dest = path.join(destDir, file)
      const dir = path.dirname(dest)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
      }

      ncp(path.join(baseDir, file), dest, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  })
}

async function run () {
  await optimizeABIs()
  await copyMigrationScript()
}

if (require.main === module) {
  run().catch(err => {
    console.log(err)
    process.exit(1)
  })
} else {
  module.exports = optimizeABIs
}
