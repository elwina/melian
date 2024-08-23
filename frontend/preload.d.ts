import { e } from "mathjs";

const electronHandler = {
	ipcRenderer: {
		sendMessage(channel: Channels, args: unknown[]) {
			ipcRenderer.send(channel, args);
		},
		on(channel: Channels, func: (...args: unknown[]) => void) {
			const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
				func(...args);
			ipcRenderer.on(channel, subscription);

			return () => {
				ipcRenderer.removeListener(channel, subscription);
			};
		},
		once(channel: Channels, func: (...args: unknown[]) => void) {
			ipcRenderer.once(channel, (_event, ...args) => func(...args));
		},
		invoke(channel: Channels, args: unknown[]) {
			return ipcRenderer.invoke(channel, args);
		},
		minimize() {
			ipcRenderer.send("minimize");
		},
		maximize() {
			ipcRenderer.send("maximize");
		},
		unmaximize() {
			ipcRenderer.send("unmaximize");
		},
		restore() {
			ipcRenderer.send("restore");
		},
		close() {
			ipcRenderer.send("close");
		},
	},
};

// 导出类型
export type ElectronHandler = typeof electronHandler;

declare global {
	// eslint-disable-next-line no-unused-vars
	interface Window {
		electron: typeof electronHandler;
	}
}
