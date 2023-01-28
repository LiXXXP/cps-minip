<template>
  <view class="shopping">
    <view class="cart" v-if="shoppingCart.length > 0">
      <u-checkbox-group v-model="selCart" placement="column" @change.stop="checkboxChange">
        <view class="cartList" v-for="(item, index) of shoppingCart" :key="index">
          <view class="name" @click.stop="goPage('/pages/product/detail?id=' + item.id)">
            <view>
              <u-checkbox shape="circle" :label="item.name" :name="item.time"> </u-checkbox>
            </view>
            <image src="@/static/index/x.png" @click.stop="delCart(index)"></image>
          </view>
          <view class="card">
            <image :src="item.iconUri" @click.stop="goPage('/pages/product/detail?id=' + item.id)"></image>
            <view class="cardRight">
              <view class="money" @click.stop="goPage('/pages/product/detail?id=' + item.id)">
                品牌： {{ item.brand }} <text>¥ {{ item.orderPrice }}</text>
              </view>
              <view class="remark" @click.stop="goPage('/pages/product/detail?id=' + item.id)">
                商品规格：{{ item.orderCondition == 1 ? '7成新' : item.orderCondition == 2 ? '8成新' : '9成新' }}</view
              >
              <view class="num">
                <u-number-box
                  button-size="24"
                  disabledInput
                  v-model="item.orderPieces"
                  @change="boxNumberChange($event, item)"
                ></u-number-box>
              </view>
            </view>
          </view>
        </view>
      </u-checkbox-group>
    </view>
    <view class="order" v-if="shoppingCart.length != 0">
      <u-checkbox-group v-model="selAll" placement="row" @change.stop="checkboxAllChange">
        <u-checkbox shape="circle" name="all"> </u-checkbox>全选
      </u-checkbox-group>
      <view class="btn">
        实付：
        <text>¥ {{ priceAll.toFixed(2) }}</text>
        <view @click.stop="addOrder">结算</view>
      </view>
    </view>
    <!-- 无数据 -->
    <gwin-error num="2" v-if="shoppingCart.length == 0"></gwin-error>
    <!-- 客服 -->
    <gwin-feedback :bottom="shoppingCart.length > 0 ? 300 : 200"></gwin-feedback>
  </view>
</template>

<script>
export default {
  data() {
    return {
      selAll: [],
      value: '',
      shoppingCart: [],
      selCart: [],
      priceAll: 0
    }
  },
  computed: {},
  watch: {},
  created() {
    // 获取购物车
    this.getCart()
  },
  methods: {
    boxNumberChange(val, item) {
      setTimeout(() => {
        this.calculateTotal()
      }, 200)
    },
    // 添加订单
    addOrder() {
      if (this.selCart.length === 0) {
        this.msg('请选择一款配件，在结算')
        return
      }
      const order = []
      this.shoppingCart.forEach((item) => {
        this.selCart.forEach((list) => {
          if (item.time === list) {
            order.push(item)
          }
        })
      })

      uni.setStorageSync('addOrder', order)
      this.goPage(`/pages/order/index?type=cart`)
    },
    delCart(index) {
      this.shoppingCart.splice(index, 1)
      uni.setStorageSync('shoppingCart', this.shoppingCart)
      this.calculateTotal()
    },
    // 计算总价
    calculateTotal() {
      this.priceAll = 0
      this.shoppingCart.forEach((item) => {
        this.selCart.forEach((list) => {
          if (item.time === list) {
            this.priceAll += item.orderPieces * item.orderPrice
          }
        })
      })
      // 是否全选
      const selCart = this.shoppingCart.map((item) => {
        return item.time
      })
      if (selCart.length === this.selCart.length) {
        this.selAll = ['all']
      } else {
        this.selAll = []
      }
      // 更新购物车
      uni.setStorageSync('shoppingCart', this.shoppingCart)
    },
    // 全选
    checkboxAllChange(e) {
      if (e.length > 0) {
        this.selCart = this.shoppingCart.map((item) => {
          return item.time
        })
      } else {
        this.selCart = []
      }
      this.calculateTotal()
    },
    // 选择某个
    checkboxChange(e) {
      setTimeout(() => {
        this.calculateTotal()
      }, 200)
    },
    // 购物车
    getCart() {
      const cart = uni.getStorageSync('shoppingCart')
      if (cart) this.shoppingCart = cart
    }
  }
}
</script>

<style lang="scss" scoped>
.shopping {
  width: 100%;
  height: 100vh;
  background: #f8f8f8;
  position: relative;
  overflow-y: scroll;
  padding-bottom: 140rpx;
  .cart {
    padding: 0 32rpx;
  }
  .order {
    z-index: 999;
    position: fixed;
    bottom: 0;
    left: 0;
    border-bottom: 1rpx solid #f5f5f5;
    width: 100%;
    height: 122rpx;
    background: #ffffff;
    box-shadow: 0rpx -4rpx 12rpx 0rpx rgba(0, 0, 0, 0.06);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 44rpx 31rpx;
    > view:nth-child(1) {
      display: flex;
      flex-direction: row;
      font-size: 28rpx;
      font-weight: 400;
      color: #606a78;
    }
    .btn {
      font-size: 28rpx;
      font-weight: 400;
      color: #1a2234;
      display: flex;
      align-items: center;
      > text {
        font-size: 38rpx;
        font-weight: 900;
        color: #3b72ff;
      }
      > view {
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
        margin-left: 20rpx;
      }
    }
  }
  .cartList {
    width: 686rpx;
    background: #ffffff;
    border-radius: 20rpx;
    margin-top: 24rpx;
    .card {
      display: flex;
      padding: 24rpx;
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
          width: 430rpx;
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
        .money {
          font-size: 28rpx;
          font-weight: 400;
          color: #1a2234;
          display: flex;
          justify-content: space-between;
          text {
            font-weight: 900;
          }
        }
      }
    }
    .name {
      width: 100%;
      font-size: 28rpx;
      font-weight: 500;
      color: #1a2234;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2rpx solid #f6f6f6;
      padding: 24rpx;
      > view {
        display: flex;
      }
      image {
        width: 40rpx;
        height: 40rpx;
      }
    }
  }
}
::v-deep .u-number-box__plus {
  width: 50rpx;
  background: #fff !important;
  border: 1rpx solid #e0e0e0 !important;
}
::v-deep .u-number-box__minus {
  width: 50rpx;
  background: #fff !important;
  border: 1rpx solid #e0e0e0 !important;
}
::v-deep .uni-input-input {
  background: #fff !important;
  border-top: 1rpx solid #e0e0e0 !important;
  border-bottom: 1rpx solid #e0e0e0 !important;
}
</style>
