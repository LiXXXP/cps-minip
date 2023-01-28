<template>
  <view class="shopping">
    <cart v-if="cartShow"></cart>
  </view>
</template>

<script>
import cart from '../shopping/cart.vue'
export default {
  components: {
    cart
  },
  data() {
    return {
      cartShow: true
    }
  },
  onShow() {
    this.cartShow = false
    setTimeout(() => {
      this.cartShow = true
    }, 100)
  }
}
</script>
