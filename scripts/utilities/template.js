const { renderFile } = require('template-file')
const fs = require("fs-extra");
const chalk = require('chalk')

async function writeFileFromTemplate(data, templatePath, destinationPath) {
  try {
    //renderToFolder is not working...
    const renderedData = await renderFile(templatePath, data)
    fs.writeFileSync(destinationPath, renderedData)
    console.log(`Created: ${chalk.green(destinationPath)}`)
  } catch (err) {
    console.log(`Error templating ${err}`)
    throw err
  }
}

module.exports = {
  writeFileFromTemplate
}