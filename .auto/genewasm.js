const { exec, execSync, spawnSync, ChildProcess } = require('child_process');
const { copyFileSync } = require('fs');
const process = require('process');

async function main() {
  try {
    re = execSync('.\\gen1.bat', {
      cwd: 'wasm/gen1',
      env: { ...process.env, PATH: process.env.PATH },
      encoding: 'utf-8',
    });
    console.log(re.stdout ?? '');
    console.log(re.stderr ?? 'ok');
  } catch (e) {
    console.log(e.stdout);
    console.log(e.stderr);
  }
  copyFileSync('wasm/gen1/gen1.js', 'src/renderer/wasm/gen1.js');
}

main();
