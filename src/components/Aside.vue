<template>
  <div class="aside">
    <ul class="tab">
      <li :class="pageLocal === 'buySet' ? 'slct' : ''" @click="router_('buySet')">认购设置</li>
      <li :class="pageLocal === 'releasePrice' ? 'slct' : ''" @click="router_('releasePrice')">发放收益</li>
    </ul>
  </div>
</template>

<script>
import abi from '@/assets/abi/MBFToken'

export default {
  data () {
    return {
      pageLocal: 'buySet'
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler (to) {
        this.pageLocal  = to.name
      }
    }
  },
  methods: {
    router_ (pathName) {
      this.pageLocal = pathName
      this.$router.push({name: pathName})
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~@/assets/style/var'
  .tab
    border 1px solid border1
    position absolute
    right 20%
    top 20px
    border-radius plainRadius
    padding 0
    li
      padding 20px 30px
      font-size plainTitleSize
      cursor pointer
      &.slct
        background mainColor
        color #ffffff
</style>
