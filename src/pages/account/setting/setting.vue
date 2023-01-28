<template>
  <!-- 设置 -->
  <view id="template">
    <u-cell-group>
      <u-cell title="用户协议" isLink url="/pages/account/agreements/user-agreement"></u-cell>
      <u-cell title="隐私协议" isLink url="/pages/account/agreements/privacy-policy"></u-cell>
    </u-cell-group>
    <view class="goback">
      <u-button @click="goback()" color=" #F8F8F8" type="primary" shape="circle" text="退出"></u-button>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {}
  },
  methods: {
    goback() {
      uni.clearStorageSync()
      uni.reLaunch({
        url: '/pages/login/index'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .u-cell {
    padding: 20rpx 32rpx 0 !important;
  }
  .u-button__text {
    font-size: 28rpx !important;
    font-weight: 500 !important;
    color: #606a78 !important;
  }
  .u-line {
    border-color: #f6f6f6 !important;
  }
}
.goback {
  margin: 260rpx 32rpx;
}
</style>
