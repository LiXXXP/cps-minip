<template>
  <view class="account">
    <view class="my-header">
      <image
        style="width: 100%; height: 100%; position: absolute; z-index: -1"
        src="@/static/member/background.png"
      ></image>
      <view>
        <view class="my-header-title flex row-center">我的</view>
      </view>
      <view class="my-header-bottom flex row-center col-center">
        <view @click="handlerPersonalDetails" class="my-header-img">
          <u--image width="128rpx" height="128rpx" :src="avatarUrl" shape="circle"></u--image>
        </view>
        <view class="my-header-content">
          <view>
            <text class="my-nickname">{{ nickname }}</text>
          </view>
          <view class="my-header-button">
            <image
              v-if="vipStatus"
              @click="memberDetail"
              style="width: 132rpx; height: 44rpx"
              src="@/static/member/membershipbtn.png"
            ></image>
            <image
              v-else
              @click="goMember"
              style="width: 204rpx; height: 44rpx"
              src="@/static/member/nomembershipbtn.png"
            ></image>
          </view>
        </view>
        <view class="my-header-right">
          <image
            @click="handlerPersonalDetails"
            style="width: 40rpx; height: 40rpx"
            src="../../static/member/righticon.png"
          ></image>
        </view>
      </view>
    </view>

    <view class="content-nav">
      <view class="content-nav-top">
        <u-cell-group :border="false">
          <u-cell border="false" url="/pages/account/order-form/order-form">
            <view slot="title" class="u-slot-title-cell"> 我的订单 </view>
            <view slot="value" class="u-slot-value"> 全部订单 </view>
            <view slot="value">
              <image style="width: 40rpx; height: 40rpx" src="@/static/member/righticon.png"></image>
            </view>
          </u-cell>
        </u-cell-group>
      </view>

      <view class="content-nav-bottom">
        <u-grid col="5" :border="false">
          <u-grid-item v-for="(baseListItem, baseListIndex) in baseList" :key="baseListIndex">
            <view class="flex flex-column row-center" @click="tabsClick(baseListItem, baseListIndex)">
              <image style="width: 60rpx; height: 60rpx" :src="baseListItem.src"></image>
              <text class="grid-text">{{ baseListItem.title }}</text>
            </view>
          </u-grid-item>
        </u-grid>
        <u-toast ref="uToast" />
      </view>
    </view>

    <view class="content-nav" style="margin-top: 20rpx">
      <u-cell-group :border="false">
        <u-cell url="/pages/account/address/address">
          <view slot="title" class="u-slot-title"> 收货地址 </view>
          <view slot="value">
            <image style="width: 40rpx; height: 40rpx" src="../../static/member/righticon.png"></image>
          </view>
        </u-cell>
        <u-cell @click="call">
          <view slot="title" class="u-slot-title"> 我的开票 </view>
          <view slot="value">
            <image style="width: 40rpx; height: 40rpx" src="../../static/member/righticon.png"></image>
          </view>
        </u-cell>
        <u-cell url="/pages/account/corporate-profile/corporate-profile">
          <view slot="title" class="u-slot-title"> 企业信息 </view>
          <view slot="value">
            <image style="width: 40rpx; height: 40rpx" src="../../static/member/righticon.png"></image>
          </view>
        </u-cell>
        <u-cell :url="cellUrl">
          <view slot="title" class="u-slot-title"> 推荐人 </view>
          <view slot="value">
            <image style="width: 40rpx; height: 40rpx" src="../../static/member/righticon.png"></image>
          </view>
        </u-cell>
        <u-cell :border="false" url="/pages/account/setting/setting">
          <view slot="title" class="u-slot-title"> 设置 </view>
          <view slot="value">
            <image style="width: 40rpx; height: 40rpx" src="../../static/member/righticon.png"></image>
          </view>
        </u-cell>
      </u-cell-group>
    </view>
    <!-- 客服 -->
    <gwin-feedback></gwin-feedback>
  </view>
</template>

<script>
import http from '@/api/account'
export default {
  data() {
    return {
      vipStatus: true,
      avatarUrl: '',
      nickname: '',
      referrerPhone: '',
      cellUrl: '',
      baseList: [
        {
          src: '../../static/member/icon1.png',
          title: '待付款'
        },
        {
          src: '../../static/member/icon2.png',
          title: '待发货'
        },
        {
          src: '../../static/member/icon3.png',
          title: '待收货'
        },
        {
          src: '../../static/member/icon4.png',
          title: '已完成'
        },
        {
          src: '../../static/member/icon5.png',
          title: '退货/售后'
        }
      ]
    }
  },

  async onShow() {
    // 是否登录
    if (!(await this.isLogin())) return
    this.init()
  },
  methods: {
    // 初始化
    async init() {
      const params = {
        id: uni.getStorageSync('userId')
      }
      const res = await http.UserInquiry(params)
      if (res.status.success) {
        this.vipStatus = res.body.vipFlag
        uni.setStorageSync('vipFlag', res.body.vipFlag)
        this.avatarUrl = res.body.avatarUrl
        this.nickname = res.body.nickname
        this.referrerPhone = res.body.referrerPhone
        this.cellUrl = '/pages/account/referrer/referrer?referrerPhone=' + this.referrerPhone
      }
    },
    call() {
      wx.openCustomerServiceChat({
        extInfo: { url: 'https://work.weixin.qq.com/kfid/kfccd7fa209c64f15c8' },
        corpId: 'wwb9652ecd69ab1dd5',
        success(res) {}
      })
    },
    // 开通会员
    goMember() {
      uni.navigateTo({
        url: '/pages/account/member/member'
      })
    },
    // 会员详情
    memberDetail() {
      uni.navigateTo({
        url: '/pages/account/member-detail/member-detail'
      })
    },
    // 跳转个人信息
    handlerPersonalDetails() {
      uni.navigateTo({
        url: '/pages/account/pim/pim'
      })
    },
    tabsClick(item, index) {
      const activeName = item.title
      if (index !== 4) {
        uni.navigateTo({
          url: '/pages/account/order-form/order-form?active=' + activeName
        })
      } else {
        uni.navigateTo({
          url: '/pages/account/after-sale/after-sale'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.account {
  height: 100vh;
  background: #f8f8f8;
}
.my-header {
  width: 100%;
  height: 384rpx;
  background: rgba(254, 234, 235, 0.3);
  background-size: 100%;
  position: relative;
  .my-header-title {
    padding-top: 100rpx;
    font-size: 32rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #131313;
    line-height: 44rpx;
  }
  .my-header-img {
    width: 160rpx;
    margin-left: 30rpx;
  }
  .my-header-content {
    text-align: left;
    flex: 1;
  }
  .my-header-right {
    width: 40rpx;
  }
}
.my-nickname {
  font-size: 32rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #1a2234;
}
.my-header-bottom {
  margin: 60rpx 32rpx;
}
.my-header-button {
  margin-top: 24rpx;
  display: flex;
}

.content-nav {
  margin: 0 32rpx;
  background: #ffffff;
  border-radius: 28rpx;
}
.content-nav-bottom {
  margin-top: 22rpx;
  width: 100%;
  height: 140rpx;
}
.u-slot-title {
  font-size: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #1a2234;
}
.u-slot-value {
  font-size: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #b1b6bb;
  line-height: 40rpx;
}
.u-slot-title-cell {
  font-size: 32rpx;
  font-weight: 500;
  color: #1a2234;
}
.grid-text {
  font-size: 24rpx;
  font-weight: 400;
  color: #1a2234;
  padding: 10rpx 0 20rpx 0rpx;
}
::v-deep {
  .u-cell-group {
    margin: 0 28rpx;
  }
  .u-cell__body {
    padding: 35rpx 0 !important;
  }
  .u-line {
    border-color: #f6f6f6 !important;
  }
}
button {
  text-align: left !important;
}
</style>
