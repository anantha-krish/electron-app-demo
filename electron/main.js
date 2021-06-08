const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
var fs = require("fs");
const os = require("os-utils");
const { channels, constants } = require("../src/shared/Constants")

let mainWindow;

function createWindow() {
  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, "../index.html"),
      protocol: "file:",
      slashes: true,
    });
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      minWidth: 1024,
      minHeight: 768,
      //required to integrate node & react
      nodeIntegration: true
    },
    show: false,
  });
  mainWindow.removeMenu();
  mainWindow.loadURL(startUrl);

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
  mainWindow.once("ready-to-show", () => {
    mainWindow.maximize();
  });
}

app.on("ready", () => {
  createWindow();
  sendAppInfo();
  sendSysInfo();
  sendFileData();
});



function sendAppInfo() {
    ipcMain.on(channels.APP_VERSION, (event, data) => {
        if (data === constants.GET_APP_VERSION)
        event.sender.send(channels.APP_VERSION, { version: app.getVersion() });
    });
}

function sendSysInfo() {
    ipcMain.on(channels.SYS_INFO, (event, data) => {
        if (data === constants.GET_SYS_INFO) {
            os.cpuUsage(function (value) {
                let systemInfo = {};
                
                systemInfo.cpuUsage = (value * 100).toFixed(2);
                systemInfo.memUsage = (os.freememPercentage() * 100).toFixed(2);
                systemInfo.totalMem = Math.ceil(os.totalmem() / 1024);
                event.sender.send(channels.SYS_INFO, systemInfo);
            });
        }
    });
}

function sendFileData() {
    ipcMain.on(channels.FILE_DATA, (event, data) => {
        if (data === constants.GET_FILE_DATA) {
            fs.readFile("D:/electron js/sample.txt", (err, data) => {
                if (err) throw err
                event.sender.send(channels.FILE_DATA,data.toString())
            });
        }
    });
}

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});