import {
	app,
	Menu,
	shell,
	type BrowserWindow,
	type MenuItemConstructorOptions,
	dialog,
} from "electron";

const IF_DEBUG = process.env.IF_DEBUG === "1";

export default class MenuBuilder {
	mainWindow: BrowserWindow;

	constructor(mainWindow: BrowserWindow) {
		this.mainWindow = mainWindow;
	}

	buildMenu(): Menu {
		if (IF_DEBUG) {
			this.setupDevelopmentEnvironment();
		}

		const template = this.buildDefaultTemplate();

		const menu = Menu.buildFromTemplate(template);
		Menu.setApplicationMenu(menu);

		return menu;
	}

	setupDevelopmentEnvironment(): void {
		this.mainWindow.webContents.on("context-menu", (_, props) => {
			const { x, y } = props;

			Menu.buildFromTemplate([
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
		const templateDefault: MenuItemConstructorOptions[] = [
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

		const subMenuViewDev: MenuItemConstructorOptions = {
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
						shell.openExternal("https://github.com/elwina");
					},
				},
				{
					label: "关于作者",
					click() {
						dialog.showMessageBox({
							message:
								"作者: 王宇轩\nDeveloer: Elwina\nEmail: elwina@yeah.net\n图形设计: 开欣\n推广：吴家盛\n鸣谢: 马楷晴 赵雨奇\nCopyRight: 2023-now",
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
