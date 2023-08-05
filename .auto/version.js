const { write, writeFile } = require('fs');
const { readFile } = require('fs/promises');
const { exec } = require('child_process');

const args = process.argv.slice(2);
if (args.length !== 1) throw new Error('Invalid number of arguments');
const [newVersion] = args;

fileList = [
  './package.json',
  './release/app/package.json',
  './release/app/package-lock.json',
];

fileList.forEach((file) => {
  readFile(file, 'utf8')
    .then((data) => JSON.parse(data))
    .then((data) => {
      const { version } = data;
      data.version = newVersion;
      writeFile(file, JSON.stringify(data, null, 2), 'utf8', (err) => {
        if (err) throw err;
        console.log(`Updated ${file} version from ${version} to ${newVersion}`);

        exec(`git add *; git commit -m "New Version ${newVersion}.";`);
      });
    })
    .catch((err) => {
      if (err) throw err;
    });
});
