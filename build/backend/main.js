"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const electron_1 = require("electron");
// import log from "electron-log";
const promises_1 = require("node:fs/promises");
const promises_2 = require("node:fs/promises");
const menu_1 = __importDefault(require("./menu"));
try {
    require("electron-reloader")(module, { watchRenderer: false });
}
catch (err) {
    console.log(err);
}
let mainWindow = null;
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
    const RESOURCES_PATH = electron_1.app.isPackaged
        ? node_path_1.default.join(process.resourcesPath, "staticback")
        : node_path_1.default.join(__dirname, "../../staticback");
    console.log(RESOURCES_PATH);
    const getAssetPath = (...paths) => {
        return node_path_1.default.join(RESOURCES_PATH, ...paths);
    };
    mainWindow = new electron_1.BrowserWindow({
        width: 1024,
        height: 728,
        icon: getAssetPath("icon.png"),
        webPreferences: {
            preload: electron_1.app.isPackaged
                ? node_path_1.default.join(__dirname, "preload.js")
                : node_path_1.default.join(__dirname, "preload.js"),
        },
    });
    mainWindow.loadURL(node_path_1.default.join(__dirname, "../frontend/index.html"));
    console.log("load url");
    mainWindow.on("ready-to-show", () => {
        if (!mainWindow) {
            throw new Error('"mainWindow" is not defined');
        }
        if (process.env.START_MINIMIZED) {
            mainWindow.minimize();
        }
        else {
            mainWindow.maximize();
            mainWindow.show();
        }
    });
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
    // 自定义部分
    const saveFileDialog = async (oldPath) => {
        if (!mainWindow)
            return "";
        const { canceled, filePath } = await electron_1.dialog.showSaveDialog(mainWindow, {
            title: "选择保存位置",
            defaultPath: oldPath,
            filters: [{ name: "样式配置文件", extensions: ["me.json"] }],
        });
        if (!filePath)
            return "";
        return !canceled ? filePath : "";
    };
    electron_1.ipcMain.handle("saveConf", async (event, [oldPath, config]) => {
        let opath = electron_1.app.getPath("downloads");
        if (oldPath !== "")
            opath = oldPath;
        const newpath = await saveFileDialog(opath);
        const wconfig = {
            version: electron_1.app.getVersion(),
            ...config,
        };
        if (newpath === "")
            return "";
        (0, promises_1.writeFile)(newpath, JSON.stringify(wconfig, null, 2), {
            encoding: "utf-8",
        });
        return newpath;
    });
    const openFileDialog = async (oldPath) => {
        if (!mainWindow)
            return "";
        const { canceled, filePaths } = await electron_1.dialog.showOpenDialog(mainWindow, {
            title: "选择保存位置",
            defaultPath: oldPath,
            filters: [{ name: "配置文件", extensions: ["me.json"] }],
        });
        return !canceled ? filePaths[0] : "";
    };
    electron_1.ipcMain.handle("loadConf", async (event, [oldPath]) => {
        let opath = electron_1.app.getPath("downloads");
        if (oldPath !== "")
            opath = oldPath;
        const newpath = await openFileDialog(opath);
        if (newpath === "")
            return { status: false, config: {} };
        const filedata = await (0, promises_1.readFile)(newpath, {
            encoding: "utf-8",
        });
        try {
            const data = JSON.parse(filedata);
            console.log(data);
            return { status: true, config: data, path: newpath };
        }
        catch {
            return { status: false, config: {}, path: "" };
        }
    });
    electron_1.ipcMain.on("minimize", () => {
        mainWindow?.minimize();
    });
    electron_1.ipcMain.on("maximize", () => {
        mainWindow?.maximize();
    });
    electron_1.ipcMain.on("unmaximize", () => {
        mainWindow?.unmaximize();
    });
    electron_1.ipcMain.on("restore", () => {
        mainWindow?.restore();
    });
    electron_1.ipcMain.on("close", () => {
        mainWindow?.close();
        electron_1.app.quit();
    });
    electron_1.ipcMain.handle("loadExperiments", async () => {
        const appPath = electron_1.app.isPackaged
            ? process.env.PORTABLE_EXECUTABLE_DIR
            : electron_1.app.getAppPath();
        const files = await (0, promises_2.readdir)(appPath);
        const experiments = files.filter((file) => file.endsWith(".melian.json"));
        const re = [];
        for (let i = 0; i < experiments.length; i++) {
            const filedata = await (0, promises_1.readFile)(node_path_1.default.join(appPath, experiments[i]), {
                encoding: "utf-8",
            });
            const data = JSON.parse(filedata);
            re.push(data);
        }
        return re;
    });
    // // 结束自定义
    mainWindow.webContents.setWindowOpenHandler((edata) => {
        electron_1.shell.openExternal(edata.url);
        return { action: "deny" };
    });
    const menuBuilder = new menu_1.default(mainWindow);
    menuBuilder.buildMenu();
    // Remove this if your app does not use auto updates
    // eslint-disable-next-line
    // new AppUpdater();
    console.log("create window");
};
/**
 * Add event listeners...
 */
electron_1.app.on("window-all-closed", () => {
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
electron_1.app
    .whenReady()
    .then(() => {
    console.log("app ready");
    createWindow();
    electron_1.app.on("activate", () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (mainWindow === null)
            createWindow();
    });
})
    .catch(console.log);
