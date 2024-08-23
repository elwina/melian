import path from "node:path";
import { app, BrowserWindow, shell, ipcMain, dialog } from "electron";
// import log from "electron-log";
import { readFile, writeFile } from "node:fs/promises";
import { DateTime } from "luxon";
import { readdir } from "node:fs/promises";
import MenuBuilder from "./menu";

try {
	require("electron-reloader")(module, { watchRenderer: false });
} catch (err) {
	console.log(err);
}

let mainWindow: BrowserWindow | null = null;
//
// if (process.env.NODE_ENV === "production") {
// 	const sourceMapSupport = require("source-map-support");
// 	sourceMapSupport.install();

// const isDebug =
// 	process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true";

// if (isDebug) {
// 	require("electron-debug")();
// }

const createWindow = async () => {
	const RESOURCES_PATH = app.isPackaged
		? path.join(process.resourcesPath, "staticback")
		: path.join(__dirname, "../../staticback");

	console.log(RESOURCES_PATH);

	const getAssetPath = (...paths: string[]): string => {
		return path.join(RESOURCES_PATH, ...paths);
	};

	mainWindow = new BrowserWindow({
		width: 1024,
		height: 728,
		icon: getAssetPath("icon.png"),
		webPreferences: {
			preload: app.isPackaged
				? path.join(__dirname, "preload.js")
				: path.join(__dirname, "preload.js"),
		},
	});

	mainWindow.loadURL(path.join(__dirname, "../frontend/index.html"));

	console.log("load url");

	mainWindow.on("ready-to-show", () => {
		if (!mainWindow) {
			throw new Error('"mainWindow" is not defined');
		}
		if (process.env.START_MINIMIZED) {
			mainWindow.minimize();
		} else {
			mainWindow.maximize();
			mainWindow.show();
		}
	});

	mainWindow.on("closed", () => {
		mainWindow = null;
	});

	// 自定义部分

	const saveFileDialog = async (oldPath: string): Promise<string> => {
		if (!mainWindow) return "";

		const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
			title: "选择保存位置",
			defaultPath: oldPath,
			filters: [{ name: "样式配置文件", extensions: ["me.json"] }],
		});

		if (!filePath) return "";
		return !canceled ? filePath : "";
	};

	ipcMain.handle(
		"saveConf",
		async (event, [oldPath, config]: [string, Record<string, any>]) => {
			let opath = app.getPath("downloads");
			if (oldPath !== "") opath = oldPath;
			const newpath = await saveFileDialog(opath);

			const wconfig = {
				version: app.getVersion(),
				...config,
			};

			if (newpath === "") return "";
			writeFile(newpath, JSON.stringify(wconfig, null, 2), {
				encoding: "utf-8",
			});

			return newpath;
		},
	);

	const openFileDialog = async (oldPath: string): Promise<string> => {
		if (!mainWindow) return "";

		const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
			title: "选择保存位置",
			defaultPath: oldPath,
			filters: [{ name: "配置文件", extensions: ["me.json"] }],
		});

		return !canceled ? filePaths[0] : "";
	};
	ipcMain.handle("loadConf", async (event, [oldPath]: [string]) => {
		let opath = app.getPath("downloads");
		if (oldPath !== "") opath = oldPath;
		const newpath = await openFileDialog(opath);

		if (newpath === "") return { status: false, config: {} };
		const filedata = await readFile(newpath, {
			encoding: "utf-8",
		});

		try {
			const data = JSON.parse(filedata);
			console.log(data);
			return { status: true, config: data, path: newpath };
		} catch {
			return { status: false, config: {}, path: "" };
		}
	});

	ipcMain.on("minimize", () => {
		mainWindow?.minimize();
	});

	ipcMain.on("maximize", () => {
		mainWindow?.maximize();
	});

	ipcMain.on("unmaximize", () => {
		mainWindow?.unmaximize();
	});

	ipcMain.on("restore", () => {
		mainWindow?.restore();
	});

	ipcMain.on("close", () => {
		mainWindow?.close();
		app.quit();
	});

	ipcMain.handle("loadExperiments", async () => {
		const appPath = app.isPackaged
			? (process.env.PORTABLE_EXECUTABLE_DIR as string)
			: app.getAppPath();
		const files = await readdir(appPath);
		const experiments = files.filter((file) => file.endsWith(".melian.json"));
		const re: any = [];
		for (let i = 0; i < experiments.length; i++) {
			const filedata = await readFile(path.join(appPath, experiments[i]), {
				encoding: "utf-8",
			});
			const data = JSON.parse(filedata);
			re.push(data);
		}
		return re;
	});

	// // 结束自定义

	mainWindow.webContents.setWindowOpenHandler((edata) => {
		shell.openExternal(edata.url);
		return { action: "deny" };
	});

	const menuBuilder = new MenuBuilder(mainWindow);
	menuBuilder.buildMenu();

	// Remove this if your app does not use auto updates
	// eslint-disable-next-line
	// new AppUpdater();
	console.log("create window");
};

/**
 * Add event listeners...
 */

app.on("window-all-closed", () => {
	// Respect the OSX convention of having the application in memory even
	// after all windows have been closed
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app
	.whenReady()
	.then(() => {
		console.log("app ready");
		createWindow();
		app.on("activate", () => {
			// On macOS it's common to re-create a window in the app when the
			// dock icon is clicked and there are no other windows open.
			if (mainWindow === null) createWindow();
		});
	})
	.catch(console.log);
