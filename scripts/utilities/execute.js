const { spawn } = require('child_process');

async function execute(command, params) {
  const stegify = spawn(command, params);
  let data = "";
  for await (const chunk of stegify.stdout) {
    console.log('stdout chunk: ' + chunk);
    data += chunk;
  }
  let error = "";
  for await (const chunk of stegify.stderr) {
    console.error('stderr chunk: ' + chunk);
    error += chunk;
  }
  const exitCode = await new Promise((resolve, reject) => {
    stegify.on('close', resolve);
  });

  if (exitCode) {
    throw new Error(`subprocess error exit ${exitCode}, ${error}`);
  }
}

module.exports = {
  execute
}