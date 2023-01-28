<template>
  <!-- 成为会员页 -->
  <view id="template">
    <view class="member-header">
      <image src="@/static/member/novip.png"></image>
      <view class="member-header-navbar flex row-around col-center">
        <view class="gateBack-icon">
          <u-icon @click="handlerGoback" name="arrow-left" color="#fff" size="28"></u-icon>
        </view>
        <view class="member-header-navbar_text"> 成为会员 </view>
        <view style="width: 44rpx; margin-right: 24rpx"></view>
      </view>
      <view class="member-header-card">
        <view class="card-text">
          <text class="small-text"> ¥ </text>
          <text class="big-text"> {{ price }} </text>
          <text class="small-text"> /年 </text>
        </view>
        <view class="card-text-bottom">
          <text>¥ {{ originPrice }}/年</text>
        </view>
      </view>
    </view>
    <view @click="paybtn" class="paybtn">
      <u-button
        class="ubtn"
        shape="circle"
        text="确认协议并支付"
        color=" linear-gradient(135deg, #FEDC7F 0%, #FEB65B 100%);"
      ></u-button>
    </view>
    <view class="agreement flex row-around col-center">
      <text>开通前请阅读</text>
      <navigator url="/pages/agreement/index" hover-class="navigator-hover">
        <text style="color: #606a78">《会员服务协议》</text>
      </navigator>
    </view>
    <view class="member-serve">
      <view class="flex col-center">
        <image style="width: 44rpx; height: 44rpx" src="@/static/member/member-icon.png" mode=""></image>
        <text class="member-serve-text">会员权益服务</text>
      </view>
      <view class="member-serve-item flex flex-wrap row-between col-center">
        <image style="width: 330rpx; height: 240rpx" src="@/static/member/vip-img1.png"></image>
        <image style="width: 330rpx; height: 240rpx" src="@/static/member/vip-img4.png"></image>
        <image style="width: 330rpx; height: 240rpx; margin-top: 26rpx" src="@/static/member/vip-img2.png"></image>
        <image style="width: 330rpx; height: 240rpx; margin-top: 26rpx" src="@/static/member/vip-img3.png"></image>
      </view>
    </view>
    <!-- 支付 -->
    <gwin-pay ref="payRef" orderType="2"></gwin-pay>
  </view>
</template>
<script>
import http from '@/api/account'
export default {
  data() {
    return {
      originPrice: '',
      price: '',
      vipFlag: uni.getStorageSync('vipFlag')
    }
  },

  onShow() {
    this.init()
  },
  methods: {
    async init() {
      const res = await http.MiniVipRightsInquiry()
      if (res.status.success) {
        // console.log(res)
        this.originPrice = res.body.originPrice
        this.price = res.body.price
      }
    },
    handlerGoback() {
      uni.navigateBack({
        delta: 1
      })
    },
    // 开通会员
    async paybtn() {
      this.$refs.payRef.payBtn()
    }
  },
  mounted() {}
}
</script>
<style lang="scss" scoped>
.member-header {
  width: 100%;
  height: 636rpx;
  position: relative;
  image {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
  }
  .member-header-navbar {
    width: 100%;
    position: relative;
    top: 88rpx;
  }
}
.gateBack-icon {
  width: 44rpx;
  height: 44rpx;
  margin-left: 24rpx;
}
.member-header-navbar_text {
  flex: 1;
  text-align: center;
  font-family: PingFangSC-Medium, PingFang SC;
  font-size: 34rpx;
  font-weight: 500;
  color: #ffffff;
}
.member-header-card {
  text-align: center;
  position: absolute;
  bottom: 80rpx;
  left: 260rpx;
  .card-text {
    .small-text {
      display: inline-block;
      margin-top: 25rpx;
      font-size: 36rpx;
      font-family: Roboto-Regular, Roboto;
      font-weight: 400;
      color: #7b4800;
    }
    .big-text {
      display: inline-block;
      margin-top: 25rpx;
      font-size: 80rpx;
      font-family: Roboto-Regular, Roboto;
      font-weight: 400;
      color: #7b4800;
      line-height: 42rpx;
    }
  }
}
.card-text-bottom {
  margin-top: 24rpx;
  text {
    font-size: 28rpx;
    font-weight: 400;
    color: #606a78;
    text-decoration: line-through;
  }
}
.paybtn {
  margin: 60rpx 32rpx 0 32rpx;
}
::v-deep {
  .u-button {
    font-size: 32rpx;
    font-weight: 600;
    color: #7b4800;
    height: 100rpx !important;
  }
  .u-button__text {
    font-size: 32rpx !important;
    font-weight: 600;
    color: #7b4800;
  }
}
.agreement {
  margin: 20rpx 206rpx 0 208rpx;
}
.agreement text:nth-of-type(1) {
  font-size: 24rpx;
  color: #b1b6bb;
}
.agreement text:nth-of-type(2) {
  font-size: 24rpx;
  color: #606a78;
}
.member-serve {
  margin: 60rpx 32rpx;
  .member-serve-text {
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #102a43;
  }
  .member-serve-item {
    margin-top: 32rpx;
  }
}
</style>
