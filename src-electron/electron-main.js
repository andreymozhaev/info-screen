import { app, BrowserWindow, nativeTheme, screen, ipcMain } from "electron";
import path from "path";
import os from "os";

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

try {
  if (platform === "win32" && nativeTheme.shouldUseDarkColors === true) {
    require("fs").unlinkSync(
      path.join(app.getPath("userData"), "DevTools Extensions")
    );
  }
} catch (_) {}

let mainWindow;
let infoWindow;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, "icons/icon.png"), // tray icon
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
    autoHideMenuBar: true,
  });

  mainWindow.loadURL(process.env.APP_URL);

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on("devtools-opened", () => {
      mainWindow.webContents.closeDevTools();
    });
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
    if (platform !== "darwin") {
      app.quit();
    }
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.handle("myAPI:api-play", (event, data) => {
  const infoPath =
    process.env.NODE_ENV === "development"
      ? "http://localhost:9080/#/info"
      : `file://${__dirname}/index.html#info`;
  infoWindow = new BrowserWindow({
    x: data.x,
    y: data.y,
    webPreferences: { webSecurity: false },
    autoHideMenuBar: true,
    //fullscreen: true,
  });
  infoWindow.on("close", function () {
    infoWindow = null;
  });
  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    infoWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    infoWindow.webContents.on("devtools-opened", () => {
      infoWindow.webContents.closeDevTools();
    });
  }
  console.log(process.env.APP_URL);
  infoWindow.loadURL(process.env.APP_URL + '/#/info');
  return {
    message: "play",
  };
});

ipcMain.handle("myAPI:api-stop", () => {
  if (infoWindow) infoWindow.close();
  return {
    message: "stop",
  };
});

ipcMain.handle("myAPI:get-screens", () => {
  return {
    screens: screen.getAllDisplays(),
  };
});