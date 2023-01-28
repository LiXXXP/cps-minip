<template>
  <!-- 会员详情页 -->
  <view id="template">
    <view class="member-header">
      <view class="member-header-navbar flex row-around col-center">
        <view class="gateBack-icon">
          <u-icon @click="handlerGoback" name="arrow-left" color="#fff" size="28"></u-icon>
        </view>
        <view class="member-header-navbar_text"> 会员权益 </view>
        <view style="width: 44rpx; margin-right: 24rpx"></view>
      </view>
      <view class="member-header-card">
        <image style="width: 100%; height: 100%" src="@/static/member/vip.png"></image>
        <view class="member-header-card_user">
          <text class="small-text"> 尊敬的{{ mobile }}会员，你好！ </text>
        </view>
        <view @click="govipLogsheet" class="card-text flex col-center">
          <text class="small-text"> {{ vipEndtime }} 到期 </text>
          <view style="margin-top: 50rpx">
            <u-icon name="arrow-right" color="#7b4800" size="35rpx"></u-icon>
          </view>
        </view>
      </view>
    </view>
    <view class="paybtn">
      <u-button
        @click="goPage"
        shape="circle"
        text="点击前往首页使用服务"
        color=" linear-gradient(135deg, #FEDC7F 0%, #FEB65B 100%);"
      ></u-button>
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
  </view>
</template>
<script>
import http from '@/api/account'
export default {
  data() {
    return {
      mobile: '',
      vipEndtime: ''
    }
  },
  onShow() {
    this.init()
  },
  methods: {
    // 获取会员信息
    async init() {
      const params = {
        id: uni.getStorageSync('userId')
      }
      const res = await http.MemberInquiry(params)
      const phone = res.body.mobile
      this.mobile = phone.substring(0, 3) + '****' + phone.substring(7)
      // 日期转换
      this.vipEndtime = this.dataConfirm(res.body.vipEndtime, 1)
    },

    handlerGoback() {
      uni.navigateBack({
        delta: 1
      })
    },
    // 跳转首页。
    goPage() {
      uni.switchTab({
        url: '/pages/index/index'
      })
    },
    // 会员记录
    govipLogsheet() {
      uni.navigateTo({
        url: '/pages/account/member-detail/vip-history'
      })
    }
  },
  mounted() {}
}
</script>
<style lang="scss" scoped>
.member-header {
  width: 100%;
  height: 636rpx;
  background-image: url(../../../static/member/member-header.png);
  background-repeat: no-repeat;
  background-size: 100%;
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
  width: 686rpx;
  height: 400rpx;
  position: relative;
  top: 200rpx;
  left: 32rpx;
  .card-text {
    height: 94rpx;
    position: absolute;
    right: 40rpx;
    bottom: 32rpx;
    text-align: center;
  }
}
.member-header-card_user {
  width: 416rpx;
  height: 94rpx;
  position: absolute;
  left: 40rpx;
  top: 110rpx;
}
.small-text {
  display: inline-block;
  margin-top: 44rpx;
  font-size: 28rpx;
  font-family: Roboto-Regular, Roboto;
  font-weight: 400;
  color: #7b4800;
}
.paybtn {
  margin: 60rpx 32rpx 0 32rpx;
}
::v-deep {
  .u-button {
    font-size: 32rpx;
    font-weight: 600;
    color: #7b4800 !important;
    height: 100rpx !important;
  }
  .u-button__text {
    font-size: 32rpx !important;
    font-weight: 600;
    color: #7b4800;
  }
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
