// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

console.log('preload.js')

window.process.versions = process.versions

//在 vue 的 component 中我們就可以使用 window.ipcRenderer.on 與 window.ipcRenderer.send 與 ipcMain 傳遞訊息了 !
const {ipcRenderer} = require('electron')
window.ipcRenderer = ipcRenderer


const { clipboard } = require('electron')
window.clipboard = clipboard
