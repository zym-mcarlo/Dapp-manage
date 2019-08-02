<template>
  <el-container class="app">
    <el-header class="head">
      <p class="title">
        <img src="@/assets/image/logo.png" alt="" width="40">
        <span>P106-1 监控中心</span>
      </p>
    </el-header>
    <el-container style="height: calc(100% - 60px);">
      <el-aside width="30vw" style="min-width: 100px; position: relative;">
        <Aside></Aside>
      </el-aside>
      <el-main style="padding-right: 80px;">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Aside from './components/Aside'

export default {
  components: {
    Aside
  }
}
</script>

<style lang="stylus" scoped>
  @import '~@/assets/style/var'
  .app
    height 100vh
    .head
      background mainColor
      color #ffffff
    .title
      margin 0
      margin-left 6vw
      height 100%
      display flex
      align-items center
      font-size mainTitleSize
      img
        margin-right 14px
</style>
