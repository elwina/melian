const { write, writeFile } = require('fs/promises');
const { readFile } = require('fs/promises');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
if (args.length !== 1) throw new Error('Invalid number of arguments');
const [newVersion] = args;

fileList = [
  './package.json',
  './release/app/package.json',
  './release/app/package-lock.json',
];

async function main() {
  for (const file of fileList) {
    let data = await readFile(file, 'utf8');
    data = await JSON.parse(data);

    const { version } = data;
    data.version = newVersion;
    if (file === './release/app/package-lock.json') {
      console.log(data);
      data.packages[''].version = newVersion;
    }
    await writeFile(file, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${file} version from ${version} to ${newVersion}`);
  }

  execSync(`git add *`);
  execSync(`git commit -m "New Version ${newVersion}."`);
  console.log(`Committed changes.`);
}

main();
