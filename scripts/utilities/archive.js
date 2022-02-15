const fs = require("fs-extra");
const archiver = require('archiver');

// async function setupArchiver() {
const setupArchiver = (instance) => new Promise((resolve) => {
  const filename = 'archive/data.zip'
  const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  });
  const output = fs.createWriteStream(filename);
  archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
      // log warning
    } else {
      // throw error
      throw err;
    }
  });
  archive.on('error', function (err) {
    throw err;
  });
  output.on('end', function () {
    console.log('Data has been drained');
  });
  archive.pipe(output);
  archive.directory('outputs/', false)
  archive.finalize();
})

module.exports = {
  setupArchiver
}