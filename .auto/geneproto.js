const { execSync } = require('child_process');
const { copyFileSync } = require('fs');

async function main() {
  execSync('protoc -I . --go_out=. --go-vtproto_out=. --ts_out=. gen1.proto', {
    cwd: 'wasm/gen1',
  });
  copyFileSync('wasm/gen1/gen1.ts', 'src/renderer/proto/gen1.pb.ts');
}

main();
