
// how to use?
// import menuMain from './menuMain'
// let menuTemplate = menuMain.menuTemplate



const { app, shell } = require('electron')

let menuTemplate = [
    {
        label: '文件',
        role: 'fileMenu',
        submenu: [
            // {
            //     label: '保存接收数据',
            //     accelerator: 'Ctrl + S',
            //     click: function () {
            //         // win.webContents.send('writeFile');
            //     }
            // },
            // {
            //     label: '读取文件数据',
            //     accelerator: 'Ctrl + L',
            //     click: function () {
            //         // win.webContents.send('readFile');
            //     }
            // }
            // ,
            // {
            //     label: '保存配置信息',
            //     accelerator: 'Ctrl + 1',
            //     click: function () {
            //         // win.webContents.send('saveOptions');
            //     }
            // },
            // {
            //     label: '加载配置文件',
            //     accelerator: 'Ctrl + 2',
            //     click: function () {
            //         // win.webContents.send('loadOptions');
            //     }
            // },
            {
                label: '关闭',
                accelerator: 'Ctrl + W',
                click: function () {
                    app.quit();
                }
            }
        ]
    },
    // {
    //     label: '视图',
    //     role: 'viewMenu',
    //     submenu: [
    //         {
    //             label: '刷新端口列表',
    //             accelerator: 'Ctrl + R',
    //             click: function () {
    //                 // win.webContents.send('reloadPorts');
    //             }
    //         }
    //     ]
    // },
    {
        label: '帮助',
        role: 'help',
        accelerator: 'Ctrl + H',
        submenu: [
            // {
            //     label: '问题反馈',
            //     click: function () {
            //         // shell.openExternal('https://github.com/rymcu/nebula-helper/issues')
            //     }
            // },
            {
                label: '关于我们',
                click: function () {
                    shell.openExternal('http://www.elinkthings.com')
                }
            }
        ]
    }
]

export default {
    menuTemplate: menuTemplate
}
