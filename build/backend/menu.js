"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const IF_DEBUG = process.env.IF_DEBUG === "1";
class MenuBuilder {
    mainWindow;
    constructor(mainWindow) {
        this.mainWindow = mainWindow;
    }
    buildMenu() {
        if (IF_DEBUG) {
            this.setupDevelopmentEnvironment();
        }
        const template = this.buildDefaultTemplate();
        const menu = electron_1.Menu.buildFromTemplate(template);
        electron_1.Menu.setApplicationMenu(menu);
        return menu;
    }
    setupDevelopmentEnvironment() {
        this.mainWindow.webContents.on("context-menu", (_, props) => {
            const { x, y } = props;
            electron_1.Menu.buildFromTemplate([
                {
                    label: "Inspect element",
                    click: () => {
                        this.mainWindow.webContents.inspectElement(x, y);
                    },
                },
            ]).popup({ window: this.mainWindow });
        });
    }
    buildDefaultTemplate() {
        const templateDefault = [
            {
                label: "程序",
                submenu: [
                    {
                        label: "重新加载",
                        accelerator: "Ctrl+R",
                        click: () => {
                            this.mainWindow.webContents.reload();
                        },
                    },
                    {
                        label: "退出",
                        accelerator: "Ctrl+W",
                        click: () => {
                            this.mainWindow.close();
                        },
                    },
                ],
            },
        ];
        const subMenuViewDev = {
            label: "开发者工具",
            submenu: [
                {
                    label: "打开开发者工具",
                    click: () => {
                        this.mainWindow.webContents.toggleDevTools();
                    },
                },
            ],
        };
        if (IF_DEBUG) {
            templateDefault.push(subMenuViewDev);
        }
        templateDefault.push({
            label: "关于",
            submenu: [
                {
                    label: "Elwina's Github",
                    click() {
                        electron_1.shell.openExternal("https://github.com/elwina");
                    },
                },
                {
                    label: "关于作者",
                    click() {
                        electron_1.dialog.showMessageBox({
                            message: "作者: 王宇轩\nDeveloer: Elwina\nEmail: elwina@yeah.net\n图形设计: 开欣\n推广：吴家盛\n鸣谢: 马楷晴 赵雨奇\nCopyRight: 2023-now",
                            type: "info",
                            title: "关于作者",
                        });
                    },
                },
            ],
        });
        return templateDefault;
    }
}
exports.default = MenuBuilder;
