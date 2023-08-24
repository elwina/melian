/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { readFile, writeFile } from 'node:fs/promises';
import { DateTime } from 'luxon';
import { readdir } from 'fs/promises';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

// ipcMain.on('ipc-example', async (event, arg) => {
//   const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
//   console.log(msgTemplate(arg));
//   event.reply('ipc-example', msgTemplate('pong'));
// });

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
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

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // 自定义部分

  const saveFileDialog = async (oldPath: string): Promise<string> => {
    if (!mainWindow) return '';

    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: '选择保存位置',
      defaultPath: oldPath,
      filters: [{ name: '样式配置文件', extensions: ['mstyle.json'] }],
    });

    if (!filePath) return '';
    return !canceled ? filePath : '';
  };

  ipcMain.handle(
    'saveConf',
    async (event, [oldPath, config]: [string, Record<string, any>]) => {
      let opath = app.getPath('downloads');
      if (oldPath !== '') opath = oldPath;
      const newpath = await saveFileDialog(opath);

      const wconfig = {
        version: app.getVersion(),
        ...config,
      };

      if (newpath === '') return '';
      writeFile(newpath, JSON.stringify(wconfig, null, 2), {
        encoding: 'utf-8',
      });

      return newpath;
    }
  );

  const openFileDialog = async (oldPath: string): Promise<string> => {
    if (!mainWindow) return '';

    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      title: '选择保存位置',
      defaultPath: oldPath,
      filters: [{ name: '配置文件', extensions: ['mstyle.json'] }],
    });

    return !canceled ? filePaths[0] : '';
  };
  ipcMain.handle('loadConf', async (event, [oldPath]: [string]) => {
    let opath = app.getPath('downloads');
    if (oldPath !== '') opath = oldPath;
    const newpath = await openFileDialog(opath);

    if (newpath === '') return { status: false, config: {} };
    const filedata = await readFile(newpath, {
      encoding: 'utf-8',
    });

    try {
      const data = JSON.parse(filedata);
      console.log(data);
      return { status: true, config: data, path: newpath };
    } catch {
      return { status: false, config: {}, path: '' };
    }
  });

  ipcMain.on('minimize', () => {
    mainWindow?.minimize();
  });

  ipcMain.on('maximize', () => {
    mainWindow?.maximize();
  });

  ipcMain.on('unmaximize', () => {
    mainWindow?.unmaximize();
  });

  ipcMain.on('restore', () => {
    mainWindow?.restore();
  });

  ipcMain.on('close', () => {
    mainWindow?.close();
    app.quit();
  });

  ipcMain.handle('loadExperiments', async () => {
    const appPath = app.isPackaged
      ? (process.env.PORTABLE_EXECUTABLE_DIR as string)
      : app.getAppPath();
    const files = await readdir(appPath);
    const experiments = files.filter((file) => file.endsWith('.melian.json'));
    const re = [];
    for (let i = 0; i < experiments.length; i++) {
      const filedata = await readFile(path.join(appPath, experiments[i]), {
        encoding: 'utf-8',
      });
      const data = JSON.parse(filedata);
      re.push(data);
    }
    return re;
  });

  // 结束自定义

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
