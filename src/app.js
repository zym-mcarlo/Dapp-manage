import Vue from 'vue'
import router from './router'
import App from './app.vue'
import config from '@/assets/config'

import  './store'

import './element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/assets/style'

import Web3 from 'web3'

Vue.prototype.mbt = config.mbt
Vue.prototype.mbf = config.mbf
Vue.prototype.canUse = config.canUse
Vue.prototype.e18 = config.e18

if (web3) Vue.prototype.$web3 = new Web3(web3.currentProvider)

new Vue({
  el: '#app',
  router,
  created () {
    if (!web3) this.$message({ message: '浏览器没有安装 MetaMask', type: 'error' })
    if (!this.$web3) return
    this.$web3.eth.getAccounts((err, accounts) => {
      if (err) this.$message({ message: err, type: 'error' })
      this.$store.wallet = accounts && accounts[0]
    })
  },
  render: h => h(App)
})
