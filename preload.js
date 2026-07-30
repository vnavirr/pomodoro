const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('windowControls', {
    close: () => ipcRenderer.send('window-close'),
    minimize: () => ipcRenderer.send('window-minimize'),
    onCursorEnter: (callback) => ipcRenderer.on('cursor-enter', callback),
    onCursorLeave: (callback) => ipcRenderer.on('cursor-leave', callback),
});

contextBridge.exposeInMainWorld('pomodoroStore', {
    getCount: () => ipcRenderer.invoke('get-pomodoro-count'),
    setCount: (count) => ipcRenderer.send('set-pomodoro-count', count),
});