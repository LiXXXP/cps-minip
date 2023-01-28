<template>
  <view id="blank">
    <view class="content">
      <view class="content-icon">
        <image src="@/static/member/Icon-No%20conten.png" mode="" style="width: 400rpx; height: 240rpx"></image>
        <text>您还没有收货地址哦！</text>
      </view>
      <view class="content-btn">
        <u-button
          @click="goAdderssDetailOfAdd('add')"
          color="#3B72FF"
          type="primary"
          shape="circle"
          text="新增收货地址"
        ></u-button>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {}
  },
  methods: {
    goAdderssDetailOfAdd(type, item) {
      uni.navigateTo({
        url: '/pages/account/address/address-detail?type=' + type
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  margin: 398rpx 175rpx;
  .content-icon {
    text-align: center;
    text {
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #606a78;
      line-height: 40px;
    }
  }
  .content-btn {
    margin-top: 40rpx;
  }
}
</style>
