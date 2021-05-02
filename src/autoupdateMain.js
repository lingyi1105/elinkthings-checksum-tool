

// how to use?
// import autoUpdateMain from './autoUpdateMain'
// autoUpdateMain.autoUpdateInit()


import {autoUpdater, dialog} from "electron"

// const server = 'https://update.electronjs.org'
// const url = `${server}/lingyi1105/device-emulator/${process.platform}-${process.arch}/${app.getVersion()}`
const server = 'https://res.ota.elinkthings.com'
const url = `${server}/device-emulator/update/auto-update-${process.platform}.json`

const isDev = require('electron-is-dev')

let autoUpdateInit = function() {

    console.log('url:', url)
    if (!isDev) {
        autoUpdater.setFeedURL({ url })

        // setInterval(() => {
        //   autoUpdater.checkForUpdates()
        // }, 60000)
        // autoUpdater.checkForUpdates()
        setTimeout(function () {
            autoUpdater.checkForUpdates()
        }, 60000)
    }


    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
        const dialogOpts = {
            type: 'info',
            buttons: ['Restart', 'Later'],
            title: 'Application Update',
            message: process.platform === 'win32' ? releaseNotes : releaseName,
            detail: 'A new version has been downloaded. Restart the application to apply the updates.'
        }

        dialog.showMessageBox(dialogOpts).then((returnValue) => {
            if (returnValue.response === 0) autoUpdater.quitAndInstall()
        })
    })

    autoUpdater.on('error', message => {
        console.error('There was a problem updating the application')
        console.error(message)
    })
}

export default {
    autoUpdateInit: autoUpdateInit
}
