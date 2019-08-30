<template>
  <div class="home">
    <div class="card-group">
      <h1 class="title">发放收益</h1>
      <section class="content">
        <div class="relevance" v-if="!isAuthentication">
          <el-button type="primary"
            style="position: absolute; top: 50%; left: 50%; transform: translate3d(-50%, -50%, 0);"
            @click="relevanceWallet_()" :icon="relevanceState ? 'el-icon-loading' : ''">关联钱包</el-button>
        </div>
        <div class="relevance" v-else>
          <div class="wallet-address">
            <img src="" alt="">
            <span>{{wallet}}</span>
          </div>
          <div class="input-group" style="margin-bottom: 20px;">
            <label for="">本期总收益</label>
            <el-input
              style="width: 40%;"
              v-model="allProfit"
              placeholder="请输入 DAI">
            </el-input>
          </div>
          <div class="input-group" style="margin-bottom: 20px;">
            <label for="">需存入的DAI</label>
            <span>{{needToSaveDai}}</span>
          </div>
          <div class="input-group">
            <label for="">DAI</label>
            <el-button v-if="!isAuthorization" type="primary" @click="authorization_()" :icon="authorizationState ? 'el-icon-loading' : ''">授权</el-button>
            <el-button v-else type="info" disabled>已授权</el-button>
          </div>

          <div class="input-group" style="margin-top: auto;">
            <label for=""></label>
            <el-button type="primary" @click="submit_()" :icon="submitState ? 'el-icon-loading' : ''">提交</el-button>
          </div>
        </div>
      </section>
    </div>

    <div class="card-group">
      <h1 class="title">发放收益记录</h1>
      <section class="content">
        <el-table
          :data="profitList"
          style="width: 100%">
          <el-table-column
            prop="date"
            label="日期"
            width="180">
          </el-table-column>
          <el-table-column
            prop="profit"
            label="该期总收益">
          </el-table-column>
        </el-table>
      </section>
    </div>
  </div>
</template>

<script>
import abiMbf from '@/assets/abi/MBFToken'
import abiMbt from '@/assets/abi/IERC20Token.json'
const BigNumber = require('bignumber.js')

export default {
  data () {
    let contractMbt = new this.$web3.eth.Contract(abiMbt, this.mbt)
    let contractMbf = new this.$web3.eth.Contract(abiMbf, this.mbf)
    return {
      contractMbt: contractMbt,
      contractMbf: contractMbf,
      profitList: [],
      isAuthentication: false,
      isAuthorization: false,
      allProfit: '',
      saveSinglePrice: '',

      relevanceState: false,
      authorizationState: false,
      submitState: false
    }
  },
  created () {
    this.init_()
  },
  computed: {
    wallet () {
      return this.$store.wallet
    },
    needToSaveDai () {
      return Number(BigNumber(this.allProfit).times(this.saveSinglePrice).toFixed()) || 0
    }
  },
  watch: {
    wallet () {
      this.init_()
    }
  },
  methods: {
    init_ () {
      if (this.wallet) {
        this.isAuthentication = true
        this.getAuthorizationState_()
        this.getProfitList_()
        this.getDAINum_()
      } else {
        this.isAuthentication = false
      }
    },
    getAuthorizationState_ () { // 获取授权状态
      this.contractMbt.methods.allowance(this.wallet, this.mbf).call().then(res => {
        this.isAuthorization = Number(res) > 0
      }).catch(err => {
        this.$notify({
          title: '获取授权状态失败',
          message: err.message,
          duration: 0,
          type: 'error'
        })
      })
    },
    getDAINum_ () { // 获取DAI single price
      this.contractMbf.methods.maxSupply().call().then(maxSupply => {
        this.contractMbf.methods.owner().call().then(owner => {
          this.contractMbf.methods.balanceOf(owner).call().then(balance => {
            this.saveSinglePrice = BigNumber(maxSupply).minus(balance).div(maxSupply).toFixed()
          }).catch(err => {
            this.$notify({ title: '获取 balance 失败', message: err.message, duration: 0, type: 'error' })
          })
        }).catch(err => {
          this.$notify({ title: '获取 owner 失败', message: err.message, duration: 0, type: 'error' })
        })
      }).catch(err => {
        this.$notify({ title: '获取 maxSupply 失败', message: err.message, duration: 0, type: 'error' })
      })
    },
    getProfitList_ () { // 获取发放收益记录
      this.profitList = []
      Promise.all([this.contractMbf.methods.historyProfitsArray().call(), this.contractMbf.methods.historyTimeArray().call()]).then(res => {
        for (let i = 0; i < res[0].length; i++) {
          this.profitList.push({
            date: new Date(res[1][i] * 1000).toLocaleString(),
            profit: BigNumber(res[0][i]).div(this.e18).toFixed()
          })
        }
      }).catch(err => {
        this.$notify({
          title: '获取收益记录失败',
          message: err.message,
          duration: 0,
          type: 'error'
        })
      })
    },
    relevanceWallet_ () { // 关联钱包
      this.relevanceState = true
      this.$web3.currentProvider.enable().then(res => {
        this.$store.wallet = res[0]
        this.getAuthorizationState_()
        this.isAuthentication = true
        this.relevanceState = false
      }).catch(err => {
        this.relevanceState = false
        this.$message({ message: err.message, type: 'error' })
      })
    },
    authorization_ () { // 授权
      this.authorizationState = true
      this.contractMbt.methods.approve(this.mbf, this.canUse).send({
        from: this.wallet,
        gasPrice: this.gasPrice
      }).then(res => {
        this.$message({ message: '授权成功', type: 'success' })
        this.authorizationState = false
        this.getAuthorizationState_()
      }).catch(err => {
        this.authorizationState = false
        this.$message({ message: err.message, type: 'error' })
      })
    },
    submit_ () { // 提交按钮
      this.submitState = true
      let ctkRequired = BigNumber(this.allProfit).times(this.e18).toFixed()
      this.contractMbf.methods.pay(ctkRequired).send({
        from: this.wallet,
        gasPrice: this.gasPrice
      }).then(res => {
        this.$message({ message: '提交成功', type: 'success' })
        this.submitState = false
      }).catch(err => {
        this.submitState = false
        this.$message({ message: err.message, type: 'error' })
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~@/assets/style/var'
  .card-group
    margin-bottom 10px
    h1.title
      font-size mainTitleSize
      color mainTextColor
      margin-left 16px
    .content
      padding 20px
      border 1px solid border1
      border-radius smallRadius
      .relevance
        height 260px
        position relative
        display flex
        flex-direction column
        justify-content space-between
    .input-group
      display flex
      align-items center
      color plainTextColor
      label
        flex 0 0 100px
        text-align right
        margin-right 10px
    .wallet-address
      margin-bottom auto
      color plainTextColor
</style>
