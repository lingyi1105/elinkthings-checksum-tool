
// how to use common.js?
// import electronStore from './electronStore'
// Vue.use(electronStore)

import Store from 'electron-store'
export default {
    install(Vue/*, options*/) {

        Vue.prototype.$electronStoreSet = function (key, value) {
            let store = new Store()
            store.set(key, value)
        }
        Vue.prototype.$electronStoreGet = function (key) {
            let store = new Store()
            return store.get(key)
        }
        Vue.prototype.$electronStoreDelete = function (key) {
            let store = new Store()
            return store.delete(key)
        }

    }
}
