<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="/iconw.png"
          transition="scale-transition"
          width="40"
        />
        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="/name.png"
          width="200"
        />
      </div>

      <v-spacer></v-spacer>

      <v-col cols="1">
        <v-card-text class="center grey--text">
          {{versionApp}}
        </v-card-text>
      </v-col>


    </v-app-bar>



    <v-card-title>数据包生成</v-card-title>
    <v-card-text>
      <v-row
        align="center"
        class="mx-0"
      >
        <v-col
          class="d-flex"
          cols="1"
        >

          <v-text-field
            readonly
            label="包头"
            :value="packageDataA6.header"
          />
        </v-col>
        <v-col
          cols="1"
        >
          <v-text-field
            readonly
            label="length长度"
            :value="packageDataPayloadLengthA6"
          />
        </v-col>
        <v-col
          cols="3"
        >
          <v-text-field
            v-model="packageDataA6.payload"
            label="payload"
            clearable
            hint="16进制格式"
            placeholder="示例: 01 0A FF 55"
            :rules="hexRules"
            @change="payloadChangedA6"
          />
        </v-col>
        <v-col
          cols="1"
        >
          <v-text-field
            readonly
            label="sum校验和"
            :value="packageDataChecksumA6"
          />
        </v-col>
        <v-col
          cols="1"
        >
          <v-text-field
            readonly
            label="包尾"
            :value="packageDataA6.tail"
          />
        </v-col>
        <v-col
          cols="1"
        >
          <v-btn
            tile
            color="primary"
            @click="copyPackageA6"
            :disabled="!this.packageDataA6.checksum || this.packageDataA6.checksum.length===0"
          >
            复制到剪切板
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text>
      <v-row
        align="center"
        class="mx-0"
      >
        <v-col
          class="d-flex"
          cols="1"
        >

          <v-text-field
            readonly
            label="包头"
            :value="packageDataA7.header"
          />
        </v-col>
        <v-col
          cols="1"
        >
          <v-select
            v-model="packageDataA7.cidH"
            :items="['00', '01', '02']"
            label="cid高字节"
          ></v-select>
        </v-col>
        <v-col
          cols="1"
        >
          <v-text-field
            label="cid低字节"
            v-model="packageDataA7.cidL"
            clearable
            hint="16进制格式"
            placeholder="示例: 01"
            :rules="hexRules"
            @change="cidLChanged"
          />
        </v-col>
        <v-col
          cols="1"
        >
          <v-text-field
            readonly
            label="length长度"
            :value="packageDataPayloadLengthA7"
          />
        </v-col>
        <v-col
          cols="3"
        >
          <v-text-field
            v-model="packageDataA7.payload"
            label="payload"
            clearable
            hint="16进制格式"
            placeholder="示例: 01 0A FF 55"
            :rules="hexRules"
            @change="payloadChangedA7"
          />
        </v-col>
        <v-col
          cols="1"
        >
          <v-text-field
            readonly
            label="sum校验和"
            :value="packageDataChecksumA7"
          />
        </v-col>
        <v-col
          cols="1"
        >
          <v-text-field
            readonly
            label="包尾"
            :value="packageDataA7.tail"
          />
        </v-col>
        <v-col
          cols="1"
        >
          <v-btn
            tile
            color="primary"
            @click="copyPackageA7"
            :disabled="!this.packageDataA7.checksum || this.packageDataA7.checksum.length===0"
          >
            复制到剪切板
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>

    <v-col cols="12">
      <v-textarea
        id="textarea"
        readonly
        outlined
        no-resize
        clearable-icon
        class="purple-input"
        label="历史记录"
        :value=textareaValue
        height="400"
      />
    </v-col>
  </v-app>
</template>

<script>
let ipcRenderer = window.ipcRenderer
let clipboard = window.clipboard

export default {
  name: 'App',
  components: {
    // HelloWorld,
  },
  data: () => ({
    versionApp: '',
    //
    textareaValue: '',
    packageDataA6: {
      header: 'A6',
      length: '',
      payload: '',
      checksum: '',
      tail: '6A'
    },
    packageDataA7: {
      header: 'A7',
      cidH: '00',
      cidL: '',
      length: '',
      payload: '',
      checksum: '',
      tail: '7A'
    },
    hexRules: [
      v => !!v || '不能为空',
      v => (v && v.length <= 40) || '过多字符',
      v => {
        let reg = /^([0-9a-f]{2})( [0-9a-f]{2})*$/i
        if (!reg.test(v)) return '非法格式'
        else return true
      }
    ],
  }),
  computed: {
    packageDataChecksumA6() {
      // let payload = this.packageDataA6.payload.replace(/(^\s*)|(\s*$)/g, "")
      let payload = this.packageDataA6.payload

      if (!this.checkHex(payload)) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.packageDataA6.checksum = ''
        return ''
      }
      let len = parseInt(this.packageDataA6.length, 16)
      let sum = len


      let arr = payload.split(' ')
      // console.log('len', len)
      // console.log('arr', arr)
      // console.log('arr.length', arr.length)
      for (let i=0; i<arr.length; i++) {
        sum += parseInt(arr[i], 16)
      }
      // console.log('sum', sum)
      sum = sum&0xFF;
      sum = sum.toString(16).padStart(2, '0').toUpperCase()
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.packageDataA6.checksum = sum
      return sum
    },
    packageDataChecksumA7() {
      // let payload = this.packageDataA7.payload.replace(/(^\s*)|(\s*$)/g, "")
      let payload = this.packageDataA7.payload

      if (!this.checkHex(payload)) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.packageDataA7.checksum = ''
        return ''
      }
      let cidH = this.packageDataA7.cidH
      let cidL = this.packageDataA7.cidL
      let len = parseInt(this.packageDataA7.length, 16)
      let sum = len

      if (!this.checkHex(cidL)) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.packageDataA7.checksum = ''
        return ''
      }
      sum = parseInt(cidH, 16) + parseInt(cidL, 16) + len

      let arr = payload.split(' ')
      // console.log('len', len)
      // console.log('arr', arr)
      // console.log('arr.length', arr.length)
      for (let i=0; i<arr.length; i++) {
        sum += parseInt(arr[i], 16)
      }
      // console.log('sum', sum)
      sum = sum&0xFF;
      sum = sum.toString(16).padStart(2, '0').toUpperCase()
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.packageDataA7.checksum = sum
      return sum
    },
    packageDataPayloadLengthA6() {
      //去掉收尾空格
      let payload = this.packageDataA6.payload//.replace(/(^\s*)|(\s*$)/g, "")
      if (!this.checkHex(payload)) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.packageDataA6.length = 0
        return '00'
      }
      // console.log('value', value)
      let arr = payload.split(' ')
      // console.log('arr', arr)
      // console.log('arr.length', arr.length)
      if (arr.length) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.packageDataA6.length = arr.length
        return arr.length.toString(16).padStart(2, '0')
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.packageDataA6.length = 0
      return ''
    },
    packageDataPayloadLengthA7() {
      //去掉收尾空格
      let payload = this.packageDataA7.payload//.replace(/(^\s*)|(\s*$)/g, "")
      if (!this.checkHex(payload)) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.packageDataA7.length = 0
        return '00'
      }
      // console.log('value', value)
      let arr = payload.split(' ')
      // console.log('arr', arr)
      // console.log('arr.length', arr.length)
      if (arr.length) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.packageDataA7.length = arr.length
        return arr.length.toString(16).padStart(2, '0')
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.packageDataA7.length = 0
      return ''
    }
  },
  mounted() {
    console.log('app home mounted():')
    // this.versionApp = this.$store.state.appVersion

    this.$getAppVersion()

  },
  created() {
    ipcRenderer.on('main_app_info', (event, paramCmd, param) => {
      if (paramCmd === 'app_version') {
        this.versionApp = param
      } else if (paramCmd === 'app_is_dev') {
        console.log('app_is_dev', param)
      }
    })
    // console.log('app home created():')
  },

  methods: {
    checkHex(value) {
      // console.log('checkHex()', value)
      if (!value || value.length === 0)
        return false
      value = value.replace(/(^\s*)|(\s*$)/g, "")
      if (!value || value.length === 0)
        return false
      if (value.length > 40)
        return false


      let reg = /^([0-9a-f]{2})( [0-9a-f]{2})*$/i
      return reg.test(value)
    },
    cidLChanged() {
      let value = this.packageDataA7.cidL.toUpperCase().replace(/(^\s*)|(\s*$)/g, "")
      if (value.length >= 2) {
        this.packageDataA7.cidL = value.slice(0, 2)
      }
    },
    payloadChangedA6() {
      if (!this.packageDataA6.payload) return
      let value = this.packageDataA6.payload.toUpperCase().replace(/(^\s*)|(\s*$)/g, "")
      // console.log('payloadChangedA6()', value)
      this.packageDataA6.payload = value
    },
    payloadChangedA7() {
      if (!this.packageDataA7.payload) return
      let value = this.packageDataA7.payload.toUpperCase().replace(/(^\s*)|(\s*$)/g, "")
      // console.log('payloadChangedA7()', value)
      this.packageDataA7.payload = value
    },
    copyPackageA6() {
      let value = this.packageDataA6.header
      value += ' ' + this.packageDataA6.length.toString(16).padStart(2, '0').toUpperCase()
      value += ' ' + this.packageDataA6.payload + ' ' + this.packageDataA6.checksum + ' ' + this.packageDataA6.tail
      this.textareaValueOutput(value, true)
      clipboard.writeText(value)
      // console.log('copyPackageA6()', clipboard.readText())
    },
    copyPackageA7() {
      let value = this.packageDataA7.header
      value += ' ' + this.packageDataA7.cidH + ' ' + this.packageDataA7.cidL
      value += ' ' + this.packageDataA7.length.toString(16).padStart(2, '0').toUpperCase()
      value += ' ' + this.packageDataA7.payload + ' ' + this.packageDataA7.checksum + ' ' + this.packageDataA7.tail
      this.textareaValueOutput(value, true)
      clipboard.writeText(value)
      // console.log('copyPackageA7()', clipboard.readText())
    },
    textareaValueOutput(value, newline, noTimestamp) {
      if (newline) this.line++
      if (!this.line || this.line > 1000) {
        this.line = 0
        // this.textareaValue = ''
        // for (let i=0; i<800; i++) {
        //   let n = this.textareaValue.indexOf('[', 0)
        //   this.textareaValue = this.textareaValue.slice(n + 1)
        // }
        let m = this.textareaValue.length
        let n = 0
        for (let i=0; i<200; i++) {
          n = this.textareaValue.lastIndexOf('\n', m)
          m = n - 1
        }
        this.textareaValue = this.textareaValue.slice(n + 1)
      }
      const textarea = document.getElementById('textarea');
      textarea.scrollTop = textarea.scrollHeight;
      this.textareaValue = (noTimestamp?'':this.$getTimeString(new Date())) + '    ' + value + (newline?'\n':'') + this.textareaValue
    },
  }

}
</script>
