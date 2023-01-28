<template>
  <view class="pay">
    <!-- 选择支付方式 -->
    <u-popup
      :show="payShow"
      @close="payShow = false"
      mode="bottom"
      height="600"
      border-radius="20"
      safe-area-inset-bottom
      closeOnClickOverlay
      closeable
    >
      <view class="payContent">
        <view class="title">支付</view>
        <br />
        <view class="payList">
          <image src="@/static/index/tenpay.png" mode="" />
          微信支付
        </view>
        <view class="payBtn">
          <u-button type="success" style="color: #fff !important" @click="payBtn">立即支付</u-button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import payHttp from '@/api/product'
import VipHttp from '@/api/account'
export default {
  props: {
    // 订单id
    orderId: {
      type: String,
      default: ''
    },
    // 会员订单 1商品支付  2会员支付
    orderType: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      // 是否显示支付
      payShow: false,
      paymentId: ''
    }
  },
  methods: {
    payBtn() {
      if (this.orderType === '1') {
        // 商品订单
        this.toPayOrder()
      } else {
        // 会员订单
        this.toPayVip()
      }
      this.payShow = false
    },
    // 支付
    payMent(order) {
      uni.requestPayment({
        provider: 'wxpay',
        timeStamp: order.body.timeStamp,
        nonceStr: order.body.nonceStr,
        paySign: order.body.paySign,
        package: 'prepay_id=' + order.body.prepayId,
        signType: 'RSA',
        success: (res) => {
          uni.showToast({
            title: '支付成功',
            duration: 3000,
            icon: 'none'
          })
          // 商品订单支付
          if (this.orderType === '1') {
            this.goPage('/pages/account/order-form/payment-success?orderId=' + this.paymentId, true, 'reLaunch')
          } else {
            // 会员支付
            uni.setStorageSync('vipFlag', true)
            this.goPage('/pages/account/member-detail/member-detail', true, 'redirectTo')
          }
        },
        fail: (err) => {
          console.log('支付失败fail:' + JSON.stringify(err))
          uni.showToast({
            title: '支付失败',
            duration: 2000,
            icon: 'none'
          })
        }
      })
    },
    // 创建会员订单
    async toPayVip() {
      uni.showToast({
        title: '正在拉起支付...',
        icon: 'loading',
        duration: 3000
      })
      const userId = uni.getStorageSync('userId')
      const order = await VipHttp.MiniMemberOrderSubmit({
        miniUserId: userId,
        nonce: userId + Date.parse(new Date()) / 1000
      })
      if (order.status.success) {
        this.paymentId = order.body.orderId
        this.payMent(order)
      } else {
        uni.showToast({
          title: '订单失败',
          icon: 'none',
          time: 3000
        })
      }
    },
    // 创建商品订单
    async toPayOrder() {
      this.paymentId = this.orderId
      uni.showToast({
        title: '正在拉起支付...',
        icon: 'loading',
        duration: 3000
      })
      const order = await payHttp.MiniOrderPayment({
        miniUserId: uni.getStorageSync('userId'),
        orderId: this.orderId
      })
      if (order.status.success) {
        this.payMent(order)
      } else {
        uni.showToast({
          title: '订单失败',
          icon: 'none',
          time: 3000
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pay {
  .payBtn {
    padding: 50rpx 50rpx;
    width: 100%;
    color: #fff;
  }

  .payList {
    display: flex;
    width: 100%;
    padding: 20rpx 50rpx;
    image {
      width: 50rpx;
      height: 40rpx;
      margin-right: 20rpx;
    }
  }

  .payContent {
    .title {
      font-size: 37rpx;
      text-align: center;
      height: 100rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
