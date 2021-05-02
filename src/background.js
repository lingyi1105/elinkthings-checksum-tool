'use strict'

import { app, protocol, BrowserWindow, Menu, autoUpdater, dialog } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'

const isDevelopment = process.env.NODE_ENV !== 'production'
const path = require('path')

import Store from 'electron-store'
Store.initRenderer()
let appVersion = app.getVersion()

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

import menuMain from './menuMain'
let menuTemplate = menuMain.menuTemplate

let win
async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    show: false,
    // fullscreen: true,
    // width: 1200,
    // height: 900,
    // resizable: false,
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.maximize()
  win.show()
  // win.resizable = false

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);


  if (process.platform === "darwin") {
    let contents = win.webContents;
    const localShortcut = require('electron-localshortcut');
    localShortcut.register(win, "CommandOrControl+A", () => {
      contents.selectAll();
    });
    localShortcut.register(win, "CommandOrControl+C", () => {
      contents.copy();
    });
    localShortcut.register(win, "CommandOrControl+V", () => {
      contents.paste();
    });
  }

}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') {
  //   app.quit()
  // }
  app.quit()
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

app.setName('ElinkThings Checksum Tool')

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
const { ipcMain } = require('electron')
ipcMain.on('renderer_app_info', (event, cmd) => {
  if (cmd === 'app_version') {
    event.reply('main_app_info', 'app_version', appVersion)
    // console.log('app_version', appVersion)
  } else if (cmd === 'app_is_dev') {
    event.reply('main_app_info', 'app_is_dev', isDev)
  }
})

import autoUpdateMain from './autoUpdateMain'
autoUpdateMain.autoUpdateInit()