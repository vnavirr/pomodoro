const { app, BrowserWindow, ipcMain, screen } = require("electron");
const path = require("path");
const Store = require("electron-store");

const store = new Store();

let win;
let mouseTrackInterval;

function createWindow() {
  win = new BrowserWindow({
    width: 320,
    height: 390,
    resizable: true,
    maximizable: false,
    fullscreenable: false,
    frame: false, 
    transparent: false,
    alwaysOnTop: true,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js")
    }
  });

  win.loadFile("index.html");
  ipcMain.on('window-close', () => win.close());
  ipcMain.on('window-minimize', () => win.minimize());

  // pomodoro count persistence
  ipcMain.handle('get-pomodoro-count', () => {
    return store.get('pomodoroCount', 0);
  });

  ipcMain.on('set-pomodoro-count', (event, count) => {
    store.set('pomodoroCount', count);
  });

  startMouseTracking();
}

function startMouseTracking() {
  let wasInside = true;

  mouseTrackInterval = setInterval(() => {

    if (!win || win.isDestroyed()) return;

    const cursor = screen.getCursorScreenPoint();
    const bounds = win.getBounds();

    const isInside = 
      cursor.x >= bounds.x &&
      cursor.x <= bounds.x + bounds.width &&
      cursor.y >= bounds.y &&
      cursor. y <= bounds.y + bounds.height;

    if (isInside !== wasInside) {
      wasInside = isInside;
      win.webContents.send(isInside ? 'cursor-enter' : 'cursor-leave');
    }

  }, 50);

}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});