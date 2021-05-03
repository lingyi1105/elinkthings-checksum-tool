

// how to use?
// import autoUpdateMain from './autoUpdateMain'
// autoUpdateMain.autoUpdateInit()


import {app, autoUpdater, dialog} from "electron"

const server = 'https://update.electronjs.org'
const url = `${server}/lingyi1105/elinkthings-checksum-tool/${process.platform}-${process.arch}/${app.getVersion()}`

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
    } else {
        // autoUpdater.setFeedURL({ url })
        // setTimeout(funcapp.getVersion()tion () {
        //     autoUpdater.checkForUpdates()
        // }, 1000)
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

    autoUpdater.on('checking-for-update', () => {
        console.log('checking-for-update')
    })

    autoUpdater.on('update-available', () => {
        console.log('update-available')
    })

    autoUpdater.on('update-not-available', () => {
        console.log('update-not-available')
    })

    autoUpdater.on('error', message => {
        console.error('There was a problem updating the application')
        console.error(message)
    })
}

export default {
    autoUpdateInit: autoUpdateInit
}
