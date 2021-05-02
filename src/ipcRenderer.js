
// how to use ipcRenderer.js?
// import common from './ipcRenderer'
// Vue.use(ipcRenderer)

export default {
    install(Vue/*, options*/) {

        let ipcRenderer = window.ipcRenderer
        if (!window.ipcRenderer) {
            let Obj = {
                on: function() {},
                send: function() {}
            }
            ipcRenderer = Object.create(Obj)
        }
        Vue.prototype.$getAppVersion = function () {
            ipcRenderer.send('renderer_app_info', 'app_version')
        }
        Vue.prototype.$getSerialPortList = function () {
            ipcRenderer.send('renderer_serialport', 'list')
        }
        Vue.prototype.$openSerialPort = function (path) {
            ipcRenderer.send('renderer_serialport', 'open', path)
        }
        Vue.prototype.$closeSerialPort = function () {
            ipcRenderer.send('renderer_serialport', 'close')
        }
        Vue.prototype.$writeSerialPort = function (data) {
            // console.log('writeSerialPort', data)
            ipcRenderer.send('renderer_serialport', 'write', data)
        }
        Vue.prototype.$simulation = function (data) {
            ipcRenderer.send('renderer_serialport', 'simulation', data)
        }
        Vue.prototype.$simulationCancel = function () {
            ipcRenderer.send('renderer_serialport', 'simulation_cancel')
        }
        Vue.prototype.$makeCmdData = function (cid, cmd, data) {
            let head = 0xA7, end = 0x7A, len = data.length+1
            let cidH = ((cid&0xff00)>>8), cidL = (cid&0xff)
            let sum = cidH + cidL + len + cmd
            for (let i=0; i<len-1; i++) {
                sum += data[i]
            }
            sum = sum&0xff;
            let sendData = [head, cidH, cidL, len, cmd]
            sendData = sendData.concat(data)
            sendData = sendData.concat([sum, end])
            // console.log('$makeCmdData', this.$toHexString(sendData))
            return sendData
        }
        Vue.prototype.$sendCmd = function (cid, cmd, data) {
            let head = 0xA7, end = 0x7A, len = data.length+1
            let cidH = ((cid&0xff00)>>8), cidL = (cid&0xff)
            let sum = cidH + cidL + len + cmd
            for (let i=0; i<len-1; i++) {
                sum += data[i]
            }
            sum = sum&0xff;
            let sendData = [head, cidH, cidL, len, cmd]
            sendData = sendData.concat(data)
            sendData = sendData.concat([sum, end])
            // console.log('sendData', this.$toHexString(sendData))
            this.$writeSerialPort(sendData)
        }
        Vue.prototype.$sendA6Cmd = function (cmd, data) {
            let head = 0xA6, end = 0x6A, len = data.length+1
            let sum = len + cmd
            for (let i=0; i<len-1; i++) {
                sum += data[i]
            }
            sum = sum&0xff;
            let sendData = [head, len, cmd]
            sendData = sendData.concat(data)
            sendData = sendData.concat([sum, end])
            // console.log('sendA6Cmd', this.$toHexString(sendData))
            this.$writeSerialPort(sendData)
        }
    }
}
