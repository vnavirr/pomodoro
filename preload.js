const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('windowControls', {
    close: () => ipcRenderer.send('window-close'),
    minimize: () => ipcRenderer.send('window-minimize'),
    onCursorEnter: (callback) => ipcRenderer.on('cursor-enter', callback),
    onCursorLeave: (callback) => ipcRenderer.on('cursor-leave', callback),
});