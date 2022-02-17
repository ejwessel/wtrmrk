const fs = require("fs-extra");
const chalk = require('chalk')
const replace = require('replace-in-file');

function setupWorkspaces(spaces) {
  spaces.forEach(space => {
    if (!fs.existsSync(space)) {
      fs.mkdirSync(space)
      console.log(`Created ${chalk.green(space)}`)
    }
  })
}

async function fixSPDXErrors(filePath) {
  //remove spdx issues from flattened file
  const options = {
    files: filePath,
    from: /\/\/ SPDX-License-Identifier: MIT/g,
    to: '',
  };
  try {
    await replace(options)
  }
  catch (error) {
    console.error('Error handling SPDX:', error);
    throw error
  }
}

module.exports = {
  setupWorkspaces,
  fixSPDXErrors
}