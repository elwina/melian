import {
  app,
  Menu,
  shell,
  BrowserWindow,
  MenuItemConstructorOptions,
  dialog,
  ipcMain,
  MenuItem,
} from 'electron';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu(): Menu {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    const template =
      process.platform === 'darwin'
        ? this.buildDarwinTemplate()
        : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: this.mainWindow });
    });
  }

  buildDarwinTemplate(): MenuItemConstructorOptions[] {
    const subMenuProgram: DarwinMenuItemConstructorOptions = {
      label: 'Melian',
      submenu: [
        { label: '分割线', type: 'separator' },
        {
          label: '重新加载',
          accelerator: 'Ctrl+R',
          click: () => {
            this.mainWindow.webContents.reload();
          },
        },
        {
          label: '退出',
          accelerator: 'Ctrl+W',
          click: () => {
            this.mainWindow.close();
          },
        },
      ],
    };
    const subMenuEdit: DarwinMenuItemConstructorOptions = {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+Command+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'Command+V', selector: 'paste:' },
        {
          label: 'Select All',
          accelerator: 'Command+A',
          selector: 'selectAll:',
        },
      ],
    };
    const subMenuViewDev: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: () => {
            this.mainWindow.webContents.reload();
          },
        },
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          click: () => {
            this.mainWindow.webContents.toggleDevTools();
          },
        },
      ],
    };
    const subMenuViewProd: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
      ],
    };
    const subMenuWindow: DarwinMenuItemConstructorOptions = {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:',
        },
        { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: 'Bring All to Front', selector: 'arrangeInFront:' },
      ],
    };
    const subMenuAbout: MenuItemConstructorOptions = {
      label: 'About',
      submenu: [
        {
          label: "Elwina's Github",
          click() {
            shell.openExternal('https://github.com/elwina');
          },
        },
        {
          label: '关于作者',
          click() {
            dialog.showMessageBox({
              message:
                '作者: 王宇轩\nDeveloer: Elwina\nEmail: elwina@yeah.net\n图形设计: 开欣\n鸣谢: 马楷晴 赵雨奇\nCopyRight: 2023-now',
              type: 'info',
              title: '关于作者',
            });
          },
        },
      ],
    };
    const subMenuContest: MenuItemConstructorOptions = {
      label: 'About',
      submenu: [
        {
          label: '仅供竞赛使用!',
        },
      ],
    };

    const subMenuView =
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
        ? subMenuViewDev
        : subMenuViewProd;

    if (process.env.CONTEST) {
      return [subMenuProgram];
    }

    return [subMenuProgram, subMenuAbout];
  }

  buildDefaultTemplate() {
    const templateDefault: MenuItemConstructorOptions[] = [
      {
        label: '程序',
        submenu: [
          { label: '分割线', type: 'separator' },
          {
            label: '重新加载',
            accelerator: 'Ctrl+R',
            click: () => {
              this.mainWindow.webContents.reload();
            },
          },
          {
            label: '退出',
            accelerator: 'Ctrl+W',
            click: () => {
              this.mainWindow.close();
            },
          },
        ],
      },
    ];
    // {
    //   label: '&View',
    //   submenu:
    //     process.env.NODE_ENV === 'development' ||
    //     process.env.DEBUG_PROD === 'true'
    //       ? [
    //           {
    //             label: '&Reload',
    //             accelerator: 'Ctrl+R',
    //             click: () => {
    //               this.mainWindow.webContents.reload();
    //             },
    //           },
    //           {
    //             label: 'Toggle &Full Screen',
    //             accelerator: 'F11',
    //             click: () => {
    //               this.mainWindow.setFullScreen(
    //                 !this.mainWindow.isFullScreen()
    //               );
    //             },
    //           },
    //           {
    //             label: 'Toggle &Developer Tools',
    //             accelerator: 'Alt+Ctrl+I',
    //             click: () => {
    //               this.mainWindow.webContents.toggleDevTools();
    //             },
    //           },
    //         ]
    //       : [
    //           {
    //             label: 'Toggle &Full Screen',
    //             accelerator: 'F11',
    //             click: () => {
    //               this.mainWindow.setFullScreen(
    //                 !this.mainWindow.isFullScreen()
    //               );
    //             },
    //           },
    //         ],
    // },

    if (!process.env.CONTEST)
      templateDefault.push({
        label: '关于',
        submenu: [
          {
            label: "Elwina's Github",
            click() {
              shell.openExternal('https://github.com/elwina');
            },
          },
          {
            label: '关于作者',
            click() {
              dialog.showMessageBox({
                message:
                  '作者: 王宇轩\nDeveloer: Elwina\nEmail: elwina@yeah.net\n图形设计: 开欣\n鸣谢: 马楷晴 赵雨奇\nCopyRight: 2023-now',
                type: 'info',
                title: '关于作者',
              });
            },
          },
          {
            label: 'Win7关怀版',
            click() {
              dialog.showMessageBox({
                message:
                  '本版本为Win7关怀版，发布于2024年2月，不进行更新维护。',
                type: 'info',
                title: 'Win7关怀版',
              });
            },
          },
        ],
      });
    else {
      templateDefault.push({
        label: '关于',
        submenu: [
          {
            label: '仅供竞赛使用!',
          },
        ],
      });
    }

    return templateDefault;
  }
}
