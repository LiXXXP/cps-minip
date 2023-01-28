<template>
  <view class="empty">
    <image src="../../static/empty/car.png"></image>
    <text>{{ choose[num] }}</text>
    <view class="callImg" v-if="num == 1">
      <image @click="call" class="call" src="@/static/index/call.png"></image>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    num: {
      type: Number,
      default: 1
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      choose: {
        1: '汽车配件正在调拨中，请稍后...',
        2: '还没有商品，快去选些吧~'
      }
    }
  },
  methods: {
    call() {
      wx.openCustomerServiceChat({
        extInfo: { url: 'https://work.weixin.qq.com/kfid/kfccd7fa209c64f15c8' },
        corpId: 'wwb9652ecd69ab1dd5',
        success(res) {}
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.empty {
  z-index: 1;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 28rpx;
  font-weight: 400;
  color: #606a78;
  background: #fff;
  position: fixed;
  top: 0;
  .callImg {
    width: 686rpx;
    height: 222rpx;
    position: absolute;
    bottom: 100rpx;
    left: 50%;
    margin-left: -343rpx;
  }
  .call {
    width: 686rpx;
    height: 222rpx;
  }
  > image {
    margin-bottom: 40rpx;
    width: 100rpx;
    height: 100rpx;
  }
}
</style>
