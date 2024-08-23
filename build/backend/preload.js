"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electronHandler = {
    ipcRenderer: {
        sendMessage(channel, args) {
            electron_1.ipcRenderer.send(channel, args);
        },
        on(channel, func) {
            const subscription = (_event, ...args) => func(...args);
            electron_1.ipcRenderer.on(channel, subscription);
            return () => {
                electron_1.ipcRenderer.removeListener(channel, subscription);
            };
        },
        once(channel, func) {
            electron_1.ipcRenderer.once(channel, (_event, ...args) => func(...args));
        },
        invoke(channel, args) {
            return electron_1.ipcRenderer.invoke(channel, args);
        },
        minimize() {
            electron_1.ipcRenderer.send("minimize");
        },
        maximize() {
            electron_1.ipcRenderer.send("maximize");
        },
        unmaximize() {
            electron_1.ipcRenderer.send("unmaximize");
        },
        restore() {
            electron_1.ipcRenderer.send("restore");
        },
        close() {
            electron_1.ipcRenderer.send("close");
        },
    },
};
electron_1.contextBridge.exposeInMainWorld("electron", electronHandler);
