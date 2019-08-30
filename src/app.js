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
Vue.prototype.gasPrice = config.gasPrice

if (window.web3) Vue.prototype.$web3 = new Web3(web3.currentProvider)

new Vue({
  el: '#app',
  router,
  created () {
    if (!window.web3) this.$notify({ title: '错误', message: '浏览器没有启用 MetaMask', duration: 0, type: 'error' })
    if (!this.$web3) return
    this.$web3.eth.getAccounts((err, accounts) => {
      if (err) this.$message({ message: err, type: 'error' })
      this.$store.wallet = accounts && accounts[0]
    })
  },
  render: h => h(App)
})
