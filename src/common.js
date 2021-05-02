
// how to use common.js?
// import common from './common'
// Vue.use(common)

export default {
    install (Vue/*, options*/) {

        Vue.prototype.$strTrim= function (str) {
            return str.replace(/(^\s*)|(\s*$)/g, "")
        }

        Vue.prototype.$strTrimAll = function (str) {
            return str.replace(/\s/g,"")
        }

        Vue.prototype.$toHexStringCompact = bytes =>
            bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0').toUpperCase() + '', '')

        Vue.prototype.$toHexString = bytes =>
            bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0').toUpperCase() + ' ', '')

        Vue.prototype.$fromHexString = hexString =>
            new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)))

        Vue.prototype.$uint8ArrayToString = function (fileData) {
            let dataString = ""
            for (let i = 0; i < fileData.length; i++) {
                dataString += String.fromCharCode(fileData[i])
            }
            return dataString
        }
        Vue.prototype.$stringToUint8Array = function (str) {
            let arr = []
            for (let i = 0, j = str.length; i < j; ++i) {
                arr.push(str.charCodeAt(i))
            }
            return new Uint8Array(arr)
        }

        Vue.prototype.$isEmpty = function (obj) {
            if (typeof obj === 'undefined' || obj == null || obj === '') {
                return true
            } else {
                return false
            }
        }

        Vue.prototype.$getDateString = function (timestamp) {
            // return '2019-01-01'
            let time = new Date()
            if (timestamp) {
                time = new Date(timestamp)
            }
            let year = time.getFullYear()
            let month = time.getMonth() + 1
            let day = time.getDate()
            if (month < 10) {
                month = '0' + month
            }
            if (day < 10) {
                day = '0' + day
            }
            return year + '-' + month + '-' + day
        }

        Vue.prototype.$getTimeString = function (timestamp) {
            // return '12:34:56.875'
            if (timestamp == null) {
                return '-'
            }
            let time = new Date()
            if (timestamp) {
                time = new Date(timestamp)
            }
            let hour = time.getHours()
            let minute = time.getMinutes()
            let second = time.getSeconds()
            let millisecond = time.getMilliseconds()
            return hour.toString(10).padStart(2, '0') + ':' +
                minute.toString(10).padStart(2, '0') + ':' +
                second.toString(10).padStart(2, '0') + '.' +
                millisecond.toString(10).padStart(3, '0')
        }

        Vue.prototype.$getDateTimeString = function (timestamp) {
            // return '2019-01-01 12:34:56.875'
            if (timestamp == null) {
                return '-'
            }
            let time = new Date()
            if (timestamp) {
                time = new Date(timestamp)
            }
            let year = time.getFullYear()
            let month = time.getMonth() + 1
            let day = time.getDate()
            let hour = time.getHours()
            let minute = time.getMinutes()
            let second = time.getSeconds()
            let millisecond = time.getMilliseconds()
            return year + '-' +
                month.toString(10).padStart(2, '0') + '-' +
                day.toString(10).padStart(2, '0') + ' ' +
                hour.toString(10).padStart(2, '0') + ':' +
                minute.toString(10).padStart(2, '0') + ':' +
                second.toString(10).padStart(2, '0') + '.' +
                millisecond.toString(10).padStart(3, '0')
        }

        Vue.prototype.$formatFileSize = function (size) {
            if (size < 1024) {
                return size + 'B'
            }
            if (size < 1024 * 1024) {
                return (size / 1024).toFixed(2) + 'KB'
            }
            if (size < 1024 * 1024 * 1024) {
                return (size / 1024 / 1024).toFixed(2) + 'MB'
            }
            return (size / 1024 / 1024 / 1024).toFixed(2) + 'GB'
        }
    }
}
