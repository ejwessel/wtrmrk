const fs = require("fs-extra");
const archiver = require('archiver');
const extract = require('extract-zip')
const chalk = require('chalk')

const createArchive = (directoryToZip, outputPath) => new Promise((resolve, reject) => {
  const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  });
  const output = fs.createWriteStream(outputPath);
  archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
      // log warning
    } else {
      reject(err)
    }
  });
  archive.on('error', function (err) {
    reject(err)
  });
  output.on('end', function () {
    console.log('Data has been drained');
  });
  output.on('close', () => {
    console.log(`Created: "${chalk.green(outputPath)}", total bytes: ${chalk.yellow(archive.pointer())}.`);
    resolve();
  });

  archive.pipe(output);
  archive.directory(directoryToZip, false)
  archive.finalize();
})

async function unarchive(directoryToUnzip, outputPath) {
  try {
    await extract(directoryToUnzip, { dir: outputPath })
    console.log(`Extracted ${chalk.green(directoryToUnzip)} to ${chalk.green(outputPath)}`)
  } catch (err) {
    console.log(`Error Unarchiving ${err}`)
    throw err
  }
}

module.exports = {
  createArchive,
  unarchive
}