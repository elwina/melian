import { writeFile } from "node:fs/promises";
import { readFile } from "node:fs/promises";
import { execSync } from "node:child_process";

const args = process.argv.slice(2);
if (args.length !== 1) throw new Error("Invalid number of arguments");
const [newVersion] = args;

const fileList = ["./package.json"];

async function main() {
	for (const file of fileList) {
		let data: any = await readFile(file, "utf8");
		data = await JSON.parse(data);

		const { version } = data;
		data.version = newVersion;

		await writeFile(file, JSON.stringify(data, null, 2), "utf8");
		console.log(`Updated ${file} version from ${version} to ${newVersion}`);
	}

	await writeFile(
		"frontend/version.ts",
		`export const APP_VERSION = \"${newVersion}\";`,
		"utf8",
	);
	console.log(`Updated frontend/version.ts version to ${newVersion}`);
}

main();
