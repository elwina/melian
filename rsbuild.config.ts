import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
	plugins: [pluginReact()],
	source: {
		entry: {
			index: "./frontend/index.tsx",
		},
		alias: {
			"@static": "./static",
		},
	},
	dev: {
		assetPrefix: "./",
		writeToDisk: true,
		client: {
			protocol: "ws",
			host: "127.0.0.1",
		},
	},
	output: {
		assetPrefix: "./",
		distPath: {
			root: "build/frontend",
			js: "",
			jsAsync: "",
			css: "",
			cssAsync: "",
			svg: "",
			font: "",
			wasm: "",
			image: "",
			media: "",
		},
	},
	html: {
		template: "static/index.html",
		crossorigin: "anonymous",
	},
});
