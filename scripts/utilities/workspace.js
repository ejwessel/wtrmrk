const fs = require("fs-extra");
const chalk = require('chalk')

function setupWorkspaces(spaces) {
  spaces.forEach(space => {
    if (!fs.existsSync(space)) {
      fs.mkdirSync(space)
      console.log(`Created ${chalk.green(space)}`)
    }
  })
}

module.exports = {
  setupWorkspaces
}