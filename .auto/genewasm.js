const { execSync } = require('child_process');
const { copyFileSync } = require('fs');

async function main() {
  execSync('tinygo build -o gen1.wasm -target wasm .', {
    cwd: 'wasm/gen1',
  });
  copyFileSync('wasm/gen1/gen1.wasm', 'assets/wasm/gen1.wasm');
}

async function main2() {
  execSync('go build -o gen1.wasm .', {
    cwd: 'wasm/gen1',
    env: {
      GOOS: 'js',
      GOARCH: 'wasm',
      GOCACHE: 'D:/.cache',
    },
  });
  copyFileSync('wasm/gen1/gen1.wasm', 'assets/wasm/gen1.wasm');
}

main2();
