<template>
  <view class="shopping">
    <cart v-if="cartShow"></cart>
  </view>
</template>

<script>
import cart from './cart.vue'
export default {
  components: {
    cart
  },
  data() {
    return {
      cartShow: true
    }
  },
  async onShow() {
    // 是否登录
    if (!(await this.isLogin())) return
    this.cartShow = false
    setTimeout(() => {
      this.cartShow = true
    }, 100)
  }
}
</script>

<style lang="scss" scoped>
.shopping {
  width: 100%;
  height: 100%;
}
</style>
