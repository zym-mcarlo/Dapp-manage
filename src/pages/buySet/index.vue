<template>
  <div class="home">
    <div class="card-group">
      <h1 class="title">单价&#38;结束日期</h1>
      <section class="content price-time">
        <div class="group" style="border-right: 1px solid #DCDFE6;">
          <p class="hint">单价</p>
          <el-input
            style="margin-top: 16px;"
            placeholder="请输入内容"
            v-model="singlePrice"
            :disabled="false">
          </el-input>
          <div class="btn">
            <el-button type="primary" @click="confirmModify_()" :icon="modifyState ? 'el-icon-loading' : ''">修改</el-button>
          </div>
        </div>
        <div class="group">
          <p class="hint">认购状态</p>
          <h3 class="con" v-if="buyState">已结束</h3>
          <div class="btn" v-else>
            <el-button type="primary" @click="endBuy_()" :icon="endBuyState ? 'el-icon-loading' : ''">结束认购</el-button>
          </div>
        </div>
      </section>
    </div>

    <div class="card-group">
      <h1 class="title">白名单</h1>
      <section class="content">
        <el-row type="flex">
          <el-input
            style="width: 50%;"
            v-model="walletInp"
            placeholder="请输入钱包地址"></el-input>
          <el-button
            type="primary"
            @click="addWhilteList_()"
            style="margin-left: 20px;"
            :icon="addState ? 'el-icon-loading' : 'el-icon-plus'"
            :disabled="!walletInp">添加</el-button>
          <el-button
            type="primary"
            @click="delWhilteList_()"
            :icon="removeState ? 'el-icon-loading' : 'el-icon-delete'"
            :disabled="!walletInp">删除</el-button>
        </el-row>
      </section>
    </div>
  </div>
</template>

<script>
import abiMbf from '@/assets/abi/MBFToken'
const BigNumber = require('bignumber.js')

export default {
  data () {
    let contractMbf = new this.$web3.eth.Contract(abiMbf, this.mbf)
    return {
      contractMbf: contractMbf,
      tableData: [],
      singlePrice: '',
      buyState: false,
      walletInp: '',

      modifyState: false,
      endBuyState: false,
      addState: false,
      removeState: false
    }
  },
  created () {
    this.init_()
  },
  computed: {
    wallet () {
      return this.$store.wallet
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
        this.getTargetPrice_()
        this.getBuyState_()
      }
    },
    getTargetPrice_ () { // 获取单价
      this.contractMbf.methods.targetPrice().call().then(res => {
        this.singlePrice = BigNumber(res).div(this.e18).toFixed()
      }).catch(err => {
        this.$notify({
          title: '获取单价失败',
          message: err.message,
          duration: 0,
          type: 'error'
        })
      })
    },
    getBuyState_ () { // 获取认购状态
      this.contractMbf.methods.finalized().call().then(res => {
        this.buyState = res
      }).catch(err => {
        this.$notify({
          title: '获取认购状态失败',
          message: err.message,
          duration: 0,
          type: 'error'
        })
      })
    },
    confirmModify_ () {
      this.$alert('确定要修改单价吗？', '修改单价', {
        confirmButtonText: '确定',
        type: 'warning',
        callback: action => {
          if (action === 'confirm') {
            this.modifyPrice_()
          }
        }
      })
    },
    modifyPrice_ () { // 修改单价
      this.modifyState = true
      let num = BigNumber(this.singlePrice).times(this.e18).toFixed()
      this.contractMbf.methods.setTargetPrice(num).send({
        from: this.wallet,
        gasPrice: this.gasPrice
      }).then(res => {
        this.modifyState = false
        this.$message({ message: '修改单价成功', type: 'success' })
        this.getTargetPrice_()
      }).catch(err => {
        this.modifyState = false
        this.$message({ message: err.message, type: 'error' })
      })
    },
    endBuy_ () { // 结束认购
      this.endBuyState = true
      this.contractMbf.methods.finalize().send({
        from: this.wallet,
        gasPrice: this.gasPrice
      }).then(res => {
        this.endBuyState = false
        this.getBuyState_()
        this.$message({ message: '结束认购成功', type: 'success' })
      }).catch(err => {
        this.endBuyState = false
        this.$message({ message: err.message, type: 'error' })
      })
    },
    addWhilteList_ () { // 添加白名单
      if (!this.walletInp) { return }
      this.addState = true
      this.contractMbf.methods.addMember(this.walletInp).send({
        from: this.wallet,
        gasPrice: this.gasPrice
      }).then(res => {
        this.addState = false
        this.$message({ message: '添加成功', type: 'success' })
      }).catch(err => {
        this.addState = false
        this.$message({ message: err.message, type: 'error' })
      })
    },
    delWhilteList_ () { // 删除白名单
      if (!this.walletInp) { return }
      this.removeState = true
      this.contractMbf.methods.removeMember(this.walletInp).send({
        from: this.wallet,
        gasPrice: this.gasPrice
      }).then(res => {
        this.removeState = false
        this.$message({ message: '删除成功', type: 'success' })
      }).catch(err => {
        this.removeState = false
        this.$message({ message: err.message, type: 'error' })
      })
    },
    getDai_ () {

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
      &.price-time
        display flex
        padding 0
        .group
          width 50%
          padding 30px
          .hint
            color mainTextColor
            font-size smallTitleSize
          .btn
            margin-top 30px
    .added-table
      margin-top 40px
      .table-title
        font-size plainTitleSize
        color mainTextColor
      .wallet
        font-size plainTextSize
        color plainTextColor
</style>
