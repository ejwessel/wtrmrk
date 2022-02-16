const fs = require("fs-extra");
const archiver = require('archiver');
const chalk = require('chalk')

const setupArchiver = (directoryToZip, outputPath) => new Promise((resolve, reject) => {
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
    console.log(`Created: "${outputPath}", total bytes: ${archive.pointer()}.`);
    resolve();
  });

  archive.pipe(output);
  archive.directory(directoryToZip, false)
  archive.finalize();
})

module.exports = {
  setupArchiver
}