<template>
  <view>
    <!-- 订单状态 1 待支付 2成功   4失败-->
    <!-- 支付成功 -->
    <view v-if="orderData">
      <view class="title flex row-center" v-if="orderData.paymentStatus == 1">
        <image class="title-header-img" src="@/static/member/success.png" mode=""></image>
        <text>待支付</text>
      </view>
      <view class="title flex row-center" v-if="orderData.paymentStatus == 2">
        <image class="title-header-img" src="@/static/member/success.png" mode=""></image>
        <text>{{ option.type == 2 ? '提交成功' : '支付成功' }}</text>
      </view>
      <view class="title flex row-center" v-if="orderData.paymentStatus == 4">
        <image class="title-header-img" src="@/static/member/success.png" mode=""></image>
        <text>支付失败</text>
      </view>
      <view class="money-num">
        <text>¥</text>
        <text style="margin-left: 12rpx">{{ orderData.payAmount }}</text>
      </view>
      <view class="explain flex row-center" v-if="orderData.paymentStatus == 2">
        <text> 商家会在24小时内进行发货 请留意物流信息噢~ </text>
      </view>
      <view class="footer-btn flex row-between">
        <view>
          <u-button
            @click="goPage('/pages/index/index', true, 'switchTab')"
            type="primary"
            :plain="true"
            :hairline="true"
            text="返回首页"
            shape="circle"
          >
          </u-button>
        </view>
        <view
          ><u-button
            @click="goPage('/pages/account/order-form/order-form', true, 'reLaunch')"
            type="primary"
            text="查看订单"
            shape="circle"
          ></u-button
        ></view>
      </view>
    </view>
    <!-- 交易查询 -->
    <view v-if="!orderData">
      <view class="title flex row-center">
        <text></text>
      </view>
      <view class="money-num">
        <text>查询中</text>
        <text style="margin-left: 12rpx"></text>
      </view>
      <view class="explain flex row-center">
        <text> 正在查询订单支付结果... </text>
      </view>
    </view>
  </view>
</template>

<script>
import http from '@/api/product'
export default {
  data() {
    return {
      option: '',
      orderData: '',
      timeOrder: {},
      payShow: true
    }
  },
  onLoad(option) {
    this.option = option
    setTimeout(() => {
      this.getOrder()
    }, 2000)
  },
  methods: {
    getOrder() {
      http.MiniOrderPaymentInquiry({ orderId: this.option.orderId }).then((res) => {
        if (res.status.success) {
          this.orderData = res.body
          //  如果没支付成功 ，重复查询
          if (res.body.paymentStatus !== 2 && this.payShow) {
            this.payShow = false
            this.timeOrder = setInterval(() => {
              this.getOrder()
            }, 3000)
          }
        }
      })
    }
  },
  onUnload() {
    clearInterval(this.timeOrder)
  }
}
</script>

<style lang="scss" scoped>
.title {
  margin-top: 100rpx;
  text {
    font-size: 36rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #74c041;
    line-height: 44rpx;
    margin-left: 12rpx;
  }
  .title-header-img {
    width: 44rpx;
    height: 44rpx;
  }
}
.money-num {
  text-align: center;
  margin-top: 140rpx;
  text {
    font-size: 60rpx;
    font-family: Roboto-Regular, Roboto;
    font-weight: 400;
    color: #1a2234;
    line-height: 80rpx;
  }
}
.explain {
  width: 342rpx;
  margin-top: 40rpx;
  margin: auto;
  text-align: center;
  text {
    font-size: 28rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #606a78;
    line-height: 44rpx;
  }
}
.footer-btn {
  margin: 190rpx 60rpx;
}
.footer-btn view {
  width: 288rpx;
  height: 84rpx;
}
</style>
