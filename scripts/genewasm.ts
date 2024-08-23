import { exec, execSync, spawnSync, ChildProcess } from "node:child_process";
import { copyFileSync } from "node:fs";
import process from "node:process";

async function main() {
	try {
		const re: any = execSync(".\\gen1.bat", {
			cwd: "wasm/gen1",
			env: { ...process.env, PATH: process.env.PATH },
			encoding: "utf-8",
		});
		console.log(re.stdout ?? "");
		console.log(re.stderr ?? "ok");
	} catch (e) {
		console.log(e.stdout);
		console.log(e.stderr);
	}
	copyFileSync("wasm/gen1/gen1.js", "frontend/wasm/gen1.wasm.js");
}

main();
