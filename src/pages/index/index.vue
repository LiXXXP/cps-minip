<template>
  <view class="index">
    <image class="titleBg" src="@/static/index/titleBg.png"></image>
    <view class="search">
      <view>
        <u--input
          placeholder="请输入17位车架号/VIN码查询"
          maxlength="17"
          border="none"
          fontSize="32rpx"
          v-model="vin"
          width="80%"
        ></u--input>
        <image src="@/static/index/search.png" @click.stop="search"></image>
      </view>
    </view>
    <view class="photo" @click="goPage('/pages/index/camera', true)">
      <image src="@/static/index/photo.png"></image>
    </view>
    <view class="photograph" @click="goPage('/pages/index/camera', true)">
      <image src="@/static/index/photograph.png"></image>拍照识别车架号/VIN码
    </view>
    <view class="service">
      <image src="@/static/index/service.png" @click="call"></image>
      <image @click="vip" src="@/static/index/vip.png"></image>
    </view>
    <!-- 客服 -->
    <gwin-feedback></gwin-feedback>
  </view>
</template>

<script>
import http from '@/api/product'
export default {
  data() {
    return {
      vin: '',
      vipFlag: false
    }
  },
  onShow() {
    this.init()
  },
  methods: {
    // 初始化获取会员状态
    async init() {
      const userId = uni.getStorageSync('userId')
      if (!userId) {
        return
      }
      const params = {
        id: uni.getStorageSync('userId')
      }
      const res = await http.UserInquiry(params)
      if (res.status.success) {
        this.vipFlag = res.body.vipFlag
      }
    },
    camera(base64Str) {
      uni.showLoading({
        title: '智能识别中...'
      })
      http
        .ocr({
          imageCode: base64Str
        })
        .then((data) => {
          if (data.status.success) {
            uni.hideLoading()
            if (data.body.vin) {
              this.goPage('/pages/product/index?vin=' + data.body.vin)
            } else {
              this.msg('无法识别,请重新拍照')
            }
          }
        })
    },
    async call() {
      // 是否登录
      if (!(await this.isLogin())) return
      wx.openCustomerServiceChat({
        extInfo: { url: 'https://work.weixin.qq.com/kfid/kfccd7fa209c64f15c8' },
        corpId: 'wwb9652ecd69ab1dd5',
        success(res) {}
      })
    },
    async vip() {
      // 是否登录
      if (!(await this.isLogin())) return
      if (this.vipFlag) {
        this.goPage('/pages/account/member-detail/member-detail')
      } else {
        this.goPage('/pages/account/member/member')
      }
    },

    // 搜索
    async search() {
      // 是否登录
      if (!(await this.isLogin())) return
      if (this.vin.length !== 17) {
        this.msg('请输入正确的17位车架号/VIN码')
        return
      }
      this.goPage('/pages/product/index?type=search&vin=' + this.vin)
    }
  },
  onShareAppMessage(res) {
    return {
      title: '爱车件—原车配件，种类齐全品质优',
      path: '/pages/index/index'
    }
  },
  onShareTimeline(res) {
    return {
      title: '爱车件—原车配件，种类齐全品质优'
    }
  }
}
</script>

<style lang="scss" scoped>
.index {
  position: fixed;
  width: 100%;
  height: 100vh;
  .service {
    display: flex;
    justify-content: space-between;
    padding: 0 50rpx;
    image {
      width: 306rpx;
      height: 300rpx;
    }
  }
  .titleBg {
    width: 750rpx;
    height: 444rpx;
  }
  .photo {
    margin-top: 68rpx;
    image {
      width: 590rpx;
      height: 422rpx;
      margin: 0 auto;
    }
  }
  .photograph {
    width: 650rpx;
    height: 112rpx;
    background: #3b72ff;
    box-shadow: 0rpx 8rpx 40rpx 0rpx rgba(221, 221, 221, 0.8);
    border-radius: 56rpx;
    font-size: 32rpx;
    font-weight: 500;
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 50rpx auto;
    image {
      width: 44rpx;
      height: 44rpx;
      margin-right: 16rpx;
    }
  }
  .search {
    margin: 0 auto;
    width: 650rpx;
    height: 112rpx;
    background: #ffffff;
    box-shadow: 0rpx 40rpx 80rpx 0rpx rgba(0, 10, 62, 0.05);
    border-radius: 20rpx;
    padding: 0 50rpx;
    font-size: 32rpx;
    position: absolute;
    top: 352rpx;
    left: 50%;
    margin-left: -325rpx;
    > view {
      width: 90%;
      height: 100%;
      align-items: center;
      display: flex;
      image {
        width: 40rpx;
        height: 40rpx;
        position: absolute;
        right: 50rpx;
        top: 35rpx;
      }
    }
  }
}
</style>
