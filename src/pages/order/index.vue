<template>
  <view class="order" v-if="moneyData && orderData">
    <view class="name">
      <!-- 无地址 -->
      <view class="noName" v-if="!address" @click="goPage('/pages/account/address/address?type=order')">
        <view class="map">
          <image src="@/static/index/map.png"></image>
          <text>请填写收货地址</text>
        </view>
        <image src="@/static/index/right.png"></image>
      </view>
      <!-- 选择 -->
      <view class="user" v-else @click="goPage('/pages/account/address/address?type=order')">
        <view class="location"><text v-if="address.defaulted">默认</text>{{ address.regionCn }}</view>
        <view class="address">{{ address.address }}</view>
        <view class="phone">{{ address.name }} {{ address.phone }}</view>
        <image src="@/static/index/right.png"></image>
      </view>
    </view>
    <image class="horn" src="@/static/index/Img-divider@2x.png"></image>
    <u-gap height="16rpx" bgColor="#F8F8F8"></u-gap>
    <!-- 商品 -->
    <view class="product">
      <view class="title" @click="payShow = true">
        支付方式
        <view class="right">
          {{ payMethodValue.name }}
          <image src="@/static/index/right.png"></image>
        </view>
      </view>
      <view class="list">
        <view class="card" v-for="(item, index) of moneyData.goodsOrderDetail" :key="index">
          <image :src="item.goodsImage"></image>
          <view class="cardRight">
            <view class="money">
              {{ item.goodsName }} <text>¥ {{ item.goodsPrice }}</text>
            </view>
            <view class="remark center">
              商品规格：{{ item.condition == 1 ? '7成新' : item.condition == 2 ? '8成新' : '9成新' }}
              <text>x{{ item.pieces }}</text>
            </view>
            <view class="remark"></view>
          </view>
        </view>

        <view class="sum"
          >共{{ piecesAll }}件 小计：<text>¥ {{ moneyData.goodsAmount }}</text></view
        >
      </view>
      <!-- 明细 -->
      <u-gap height="16rpx" bgColor="#F8F8F8"></u-gap>
      <view class="detailItem ft" v-if="false"> 发票<text>(商品明细-个人)</text> </view>
      <u-gap height="16rpx" bgColor="#F8F8F8"></u-gap>
      <view class="detailItem">
        商品金额<text>¥ {{ moneyData.goodsAmount }}</text>
      </view>
      <view class="detailItem">
        运费<text>¥ {{ moneyData.freight }}</text>
      </view>
      <u-gap height="16rpx" bgColor="#F8F8F8"></u-gap>
      <view class="detailItem">
        预计送达时间<text>{{ getTime() }}</text>
      </view>
      <image class="vipUser" @click="vip" src="@/static/index/vipUser.png"> </image>
    </view>
    <view class="addBtn">
      <view class="money"
        >实付：<text>¥ {{ moneyData.orderTotalAmount }}</text></view
      >
      <text @click="addOrder">提交订单</text>
    </view>
    <!-- 发票类型 -->
    <u-popup :show="billShow" @close="billShow = false" round="10" closeable closeOnClickOverlay>
      <view class="bill">
        <view class="list">
          <view class="title"> 发票类型 </view>
          <view class="option">
            <text>电子普通发票</text>
          </view>
          <view class="describe">
            电子发票即电子增值税发票，其法律效力基本用途及适用规定同纸质发票。会发送到您的邮箱地址
          </view>
        </view>
        <view class="list">
          <view class="title"> 发票类型 </view>
          <view class="combination">
            <view class="option">
              <text>个人</text>
            </view>
            <view class="option">
              <text>单位</text>
            </view>
          </view>
        </view>
        <view class="list">
          <view class="title"> 邮箱接收地址 </view>
          <u--input class="ipt" placeholder="请输入邮箱" border="none"></u--input>
        </view>
        <view class="btn"><text>确定</text></view>
      </view>
    </u-popup>
    <!-- 支付方式 -->
    <u-popup :show="payShow" @close="payShow = false" round="10" closeable closeOnClickOverlay>
      <view class="bill pay">
        <view class="title"> 支付方式 </view>
        <view class="combination">
          <view
            :class="payMethodValue.value == item.value ? 'option sel' : 'option'"
            v-for="(item, index) of payMethod"
            :key="index"
            @click="payMethodChange(item)"
          >
            <text>{{ item.name }}</text>
          </view>
        </view>
        <view class="btn" @click="payShow = false"><text>确定</text></view>
      </view>
    </u-popup>
    <!-- 客服 -->
    <gwin-feedback :bottom="200"></gwin-feedback>
  </view>
</template>

<script>
import http from '@/api/product'
export default {
  data() {
    return {
      billShow: false,
      payShow: false,
      payMethod: [
        {
          name: '在线支付',
          value: 1
        },
        {
          name: '货到付款',
          value: 2
        }
      ],
      payMethodValue: {
        name: '在线支付',
        value: 1
      },
      orderData: [],
      piecesAll: 0,
      priceAll: 0,
      carriageAll: 0,
      expressAmountAll: 0,
      address: '',
      moneyData: ''
    }
  },
  onLoad() {
    // 获取订单
    this.getOrder()

    // 获取收货地址
    this.getAddress()
  },
  methods: {
    vip() {
      const vipFlag = uni.getStorageSync('vipFlag')
      if (vipFlag) {
        this.goPage('/pages/account/member-detail/member-detail')
      } else {
        this.goPage('/pages/account/member/member')
      }
    },
    // 获取收货地址
    async getAddress() {
      const res = await http.MiniDefaultAddressInquiry({
        userId: uni.getStorageSync('userId')
      })
      if (res.body.name) {
        res.body.defaulted = true
        this.address = res.body
      }
    },
    payMethodChange(item) {
      const vipFlag = uni.getStorageSync('vipFlag')
      if (vipFlag) {
        this.payMethodValue = item
        this.getMoney()
      } else {
        this.msg('非会员无法使用货到付款')
      }
    },
    addOrder() {
      if (!this.address) {
        this.msg('请选择收货地址')
        return
      }
      const goodsList = []
      this.orderData.forEach((item) => {
        goodsList.push({
          condition: item.orderCondition,
          goodsId: item.id,
          pieces: item.orderPieces
        })
      })
      const userId = uni.getStorageSync('userId')
      http
        .MiniOrderSubmit({
          addressId: this.address.id,
          goodsList: goodsList,
          miniUserId: userId,
          payMethod: this.payMethodValue.value,
          nonce: userId + Date.parse(new Date()) / 1000
        })
        .then((res) => {
          if (res.status.success) {
            this.msg('创建订单成功')
            uni.setStorageSync('addOrderPay', res.body)

            // 清空选中的购物车
            const shoppingCart = uni.getStorageSync('shoppingCart')
            for (const index in shoppingCart) {
              for (const i of this.orderData) {
                if (shoppingCart[index].time === i.time) {
                  shoppingCart.splice(index, 1)
                }
              }
            }
            uni.setStorageSync('shoppingCart', shoppingCart)
            // 在线支付 1
            if (this.payMethodValue.value === 1) {
              this.goPage('/pages/account/order-form/order-detail?orderId=' + res.body.orderId, true, 'redirectTo')
            } else {
              // 货到付款 2
              this.goPage(
                '/pages/account/order-form/payment-success?type=2&orderId=' + res.body.orderId,
                true,
                'reLaunch'
              )
            }
          }
        })
    },
    // 选择收货地址
    setAddress(val) {
      console.log(val)
      // 手机号加星 隐藏
      val.phone = val.phone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
      this.address = val
    },
    // 次日达时间
    getTime() {
      const time = Date.parse(new Date()) + 86400000
      var dt = new Date(time)
      var yy = dt.getFullYear()
      var mm = dt.getMonth() + 1
      var dd = dt.getDate()
      var hh = dt.getHours()
      var mi = dt.getMinutes()
      var ss = dt.getSeconds()
      var dy = dt.getDay()
      var wk = '星期' + '日一二三四五六'.charAt(dy)
      var sd = '上午'
      if (hh > 12) {
        hh = hh - 12
        sd = '下午'
      }
      return mm + '月' + dd + '日 '
    },
    // 获取订单
    async getOrder() {
      const order = uni.getStorageSync('addOrder')
      if (order) {
        this.orderData = order
        order.forEach((item) => {
          this.piecesAll += item.orderPieces
          this.priceAll += item.orderPrice * item.orderPieces
          this.carriageAll += item.carriage
          this.expressAmountAll += item.expressAmount * item.orderPieces
        })
      } else {
        this.msg('没有找到订单')
        this.goBack()
      }

      // 获取价格信息
      this.getMoney()
    },
    async getMoney() {
      // 获取价格信息
      const goodsList = []
      this.orderData.forEach((item) => {
        goodsList.push({
          condition: item.orderCondition,
          goodsId: item.id,
          pieces: item.orderPieces
        })
      })
      const money = await http.MiniOrderGoodsPriceInquiry({
        goodsList: goodsList,
        miniUserId: uni.getStorageSync('userId'),
        payMethod: this.payMethodValue.value
      })
      if (money) {
        this.moneyData = money.body
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.order {
  width: 100%;
  height: 100vh;
  overflow-y: scroll;

  .pay {
    .title {
      text-align: center;
      font-size: 32rpx;
      font-weight: 600;
      color: #1a2234;
      border-bottom: 1px solid #f5f5f5;
      padding: 28rpx 0;
      margin-top: 0 !important;
    }
    .combination {
      display: flex;
      padding: 0 38rpx;
    }
    .sel {
      color: #3b72ff !important;
      background: rgba(59, 114, 255, 0.1) !important;
      border: 2rpx solid #3b72ff !important;
    }
  }
  .bill {
    .btn {
      margin-top: 150rpx;
      width: 750rpx;
      height: 162rpx;
      background: #ffffff;
      box-shadow: 0rpx -4rpx 12rpx 0rpx rgba(0, 0, 0, 0.06);
      backdrop-filter: blur(0rpx);
      padding: 24rpx 0;
      text {
        width: 686rpx;
        height: 72rpx;
        background: #3b72ff;
        border-radius: 36rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 28rpx;
        font-weight: 500;
        color: #ffffff;
        margin: 30rpx auto;
      }
    }
    .list {
      padding: 0 32rpx 32rpx 32rpx;
      border-bottom: 1px solid #f5f5f5;
      .combination {
        display: flex;
      }
    }
    .option {
      width: 228rpx;
      height: 60rpx;
      background: #f5f5f5;
      border-radius: 30rpx;
      font-size: 28rpx;
      font-weight: 400;
      color: #1a2234;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 30rpx 20rpx 0 0;
    }
    .describe {
      font-size: 28rpx;
      font-weight: 400;
      color: #606a78;
      margin-top: 20rpx;
    }
    .ipt {
      margin: 20rpx 0;
    }
    .title {
      font-size: 32rpx;
      font-weight: 600;
      color: #1a2234;
      margin-top: 28rpx;
    }
  }
  .addBtn {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 750rpx;
    height: 162rpx;
    background: #ffffff;
    box-shadow: 0rpx -4rpx 12rpx 0rpx rgba(0, 0, 0, 0.06);
    backdrop-filter: blur(0rpx);
    padding: 20rpx 32rpx 44rpx 32rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > text {
      width: 172rpx;
      height: 72rpx;
      background: #3b72ff;
      border-radius: 36rpx;
      font-size: 28rpx;
      font-weight: 500;
      color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .money {
      font-size: 28rpx;
      font-weight: 400;
      color: #1a2234;
      text {
        font-size: 40rpx;
        font-weight: 900;
        color: #3b72ff;
      }
    }
  }
  .ft {
    font-weight: bold;
  }
  .vipUser {
    width: 686rpx;
    height: 222rpx;
    margin: 24rpx auto 200rpx;
  }
  .detailItem {
    padding: 30rpx 32rpx;
    font-size: 28rpx;
    color: #1a2234;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #f5f5f5;
    text {
      font-weight: 800;
      color: #1a2234;
    }
  }
  .product {
    padding-bottom: 70rpx;
    .list {
      padding: 30rpx 32rpx 9 39rpx;
      .card {
        display: flex;
        padding: 24rpx;
        border-bottom: 1rpx solid #f5f5f5;
        > image {
          width: 184rpx;
          height: 184rpx;
          border-radius: 20rpx;
          margin-right: 20rpx;
        }
        .cardRight {
          flex: 1;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .num {
            display: flex;
            justify-content: flex-end;
          }
          .remark {
            font-size: 28rpx;
            font-weight: 400;
            color: #606a78;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            /*! autoprefixer: off */
            -webkit-box-orient: vertical;
            /*autoprefixer: on */
          }
          .center {
            display: flex;
            justify-content: space-between;
          }
          .money {
            font-size: 28rpx;
            font-weight: 400;
            color: #1a2234;
            display: flex;
            justify-content: space-between;
            text {
              font-size: 29rpx;
              font-weight: 900;
            }
          }
        }
      }
      .sum {
        font-size: 28rpx;
        font-weight: 400;
        color: #1a2234;
        padding: 22rpx;
        text-align: right;
        text {
          font-size: 34rpx;
          font-weight: 900;
          color: #3b72ff;
        }
      }
    }
    .title {
      display: flex;
      width: 750rpx;
      height: 100rpx;
      background: #ffffff;
      font-size: 28rpx;
      font-weight: 500;
      color: #131313;
      justify-content: space-between;
      padding: 30rpx 32rpx;
      border-bottom: 1px solid #f5f5f5;
      .right {
        display: flex;
        font-weight: 400;
        image {
          width: 40rpx;
          height: 40rpx;
        }
      }
    }
  }
  .horn {
    width: 100%;
    height: 4rpx;
  }
  .name {
    padding: 32rpx 40rpx;
    .user {
      line-height: 60rpx;
      position: relative;
      image {
        width: 40rpx;
        height: 40rpx;
        position: absolute;
        right: 10rpx;
        top: 70rpx;
      }
      .phone {
        font-size: 28rpx;
        font-weight: 400;
        color: #606a78;
      }
      .address {
        font-size: 30rpx;
        font-weight: bold;
        color: #1a2234;
      }
      .location {
        font-size: 28rpx;
        font-weight: 400;
        color: #1a2234;
        text {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          width: 64rpx;
          height: 32rpx;
          background: #3b72ff;
          border-radius: 4rpx;
          font-size: 24rpx;
          color: #ffffff;
          margin-right: 20rpx;
        }
      }
    }
    .noName {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .map {
        display: flex;
        font-size: 28rpx;
        font-weight: 400;
        color: #1a2234;
        image {
          width: 40rpx;
          height: 40rpx;
          margin-right: 24rpx;
        }
      }
      > image {
        width: 40rpx;
        height: 40rpx;
      }
    }
  }
}
</style>
