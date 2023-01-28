<template>
  <view class="detail">
    <u-swiper
      :list="swiperList"
      keyName="image"
      showTitle
      radius="8"
      circular
      height="360rpx"
      imgMode="aspectFit"
      indicator
      @click="swiperBtn"
      @change="(e) => (currentNum = e.current)"
    >
      <view slot="indicator" class="indicator-num">
        <text class="indicator-num__text">{{ currentNum + 1 }}/{{ swiperList.length }}</text>
      </view>
    </u-swiper>
    <view class="parameter">
      <view class="title">{{ detailData.name || '暂无' }}<text>次日达</text></view>
      <view class="money">
        <template v-if="discountPrice.length > 0"> <text class="y">¥</text> {{ discountPrice[0].price }} </template>
        <template v-else>暂无售价</template>
        <text class="price"><text class="y">¥</text>{{ detailData.originPrice || '未知' }}</text>
      </view>
      <view class="share">
        <button open-type="share" class="btn">
          <image src="@/static/index/share.png"></image>
          <text>分享</text>
        </button>
      </view>
      <view class="illustrate">
        <view class="title"> <image src="@/static/index/parameter.png"></image>商品参数</view>
        <view class="name"
          >品牌名称：<text>{{ detailData.brand || '无' }}</text></view
        >
        <view class="name"
          >单车用量：<text>{{ detailData.usageTotal || '无' }}</text></view
        >
        <view class="name"
          >备注信息：<text>{{ detailData.remark || '无' }}</text></view
        >
        <!-- <view class="name">关联车型：<text>{{ detailData.carInfo || '无' }}</text></view> -->
      </view>
    </view>
    <image class="vip" src="@/static/index/vipTitle.png" @click="vip"></image>
    <view class="btnBg">
      <view class="img">
        <view @click="goPage('/pages/index/index', true, 'switchTab')">
          <image src="@/static/index/home.png"></image>首页
        </view>
        <view @click="call"> <image src="@/static/index/contact.png"></image><text>客服</text> </view>
        <view @click="goPage('/pages/product/cart')">
          <image src="@/static/index/cartImg.png"></image>购物车
          <u-badge v-if="cartBadge > 0" :value="cartBadge" absolute :offset="[-6, -8]"></u-badge>
        </view>
      </view>
      <view class="btn">
        <view :class="this.detailData.status == 2 || this.detailData.stockState == false ? 'sel' : ''" @click="addCard">
          加入购物车
        </view>
        <text
          :class="this.detailData.status == 2 || this.detailData.stockState == false ? 'sel' : ''"
          @click="addMoney"
        >
          立即购买
        </text>
      </view>
    </view>
    <!-- 商品sku -->
    <u-popup
      :show="skuShow"
      @close=";(skuShow = false), (skuType = true)"
      mode="bottom"
      closeOnClickOverlay
      closeable
      :round="20"
    >
      <view class="sku">
        <view class="num">
          <image :src="detailData.iconUri"></image>
          <view class="specification">
            <view class="name">{{ detailData.name || '暂无' }}</view>
            <text> {{ detailData.alias }} </text>
            <view class="money">
              <template> ¥ {{ selPrice.price || '暂无售价' }} </template>
              <u-number-box button-size="24" disabledInput v-model="pieces" @overlimit="numberChange"></u-number-box>
            </view>
          </view>
        </view>
        <view class="configure">
          商品参数
          <text
            :class="selPrice.condition == item.condition ? 'sel' : ''"
            v-for="(item, index) of discountPrice"
            :key="index"
            @click="selPrice = item"
          >
            {{ item.name }}
          </text>
          <text v-if="discountPrice.length === 0">无配件</text>
        </view>
        <view class="btn" @click="addOrder"> 确定 </view>
      </view>
    </u-popup>
    <!-- 客服 -->
    <gwin-feedback :bottom="190"></gwin-feedback>
  </view>
</template>

<script>
import http from '@/api/product'
export default {
  data() {
    return {
      cartBadge: 0,
      shoppingCart: [],
      option: '',
      skuShow: false,
      swiperList: [],
      imgSwiperList: [],
      detailData: '',
      discountPrice: [],
      pieces: 1,
      selPrice: {},
      skuType: true,
      currentNum: ''
    }
  },
  onLoad(option) {
    this.option = option
    this.getDetail()
  },
  onShow() {
    // 获取购物车
    this.getCart()
  },
  methods: {
    call() {
      wx.openCustomerServiceChat({
        extInfo: { url: 'https://work.weixin.qq.com/kfid/kfccd7fa209c64f15c8' },
        corpId: 'wwb9652ecd69ab1dd5',
        success(res) {}
      })
    },
    addMoney() {
      // 无售价
      if (this.discountPrice.length === 0) {
        this.msg('该商品暂不支持购买')
        return
      }
      if (this.detailData.status === 2) {
        this.msg('商品已下架')
        return
      }
      if (!this.detailData.stockState) {
        this.msg('暂无库存')
        return
      }
      this.skuType = true
      this.skuShow = true
    },
    numberChange(e) {
      if (e === 'minus') {
        this.msg('最少选购1个')
      }
      // 产品暂时取消
      // if (e === 'plus') {
      //   this.msg('已达最大限购数' + this.detailData.purchaseLimit + '个')
      // }
    },
    vip() {
      const vipFlag = uni.getStorageSync('vipFlag')
      if (vipFlag) {
        this.goPage('/pages/account/member-detail/member-detail')
      } else {
        this.goPage('/pages/account/member/member')
      }
    },
    // 轮播图
    swiperBtn(index) {
      uni.previewImage({
        urls: this.imgSwiperList
      })
    },
    // 添加订单
    addOrder() {
      this.skuShow = false
      // 添加购物车 参数   单价、数量、品类
      this.detailData.orderPrice = this.selPrice.price
      this.detailData.orderPieces = this.pieces
      this.detailData.orderCondition = this.selPrice.condition

      // 添加时间戳
      this.detailData.time = Date.parse(new Date()) / 1000
      // 前往订单
      if (this.skuType) {
        uni.setStorageSync('addOrder', [this.detailData])
        this.goPage(`/pages/order/index`)
      } else {
        // 加入购物车 震动 添加
        uni.vibrateShort({ success: function () {} })
        this.msg('已添加到购物车')

        if (this.shoppingCart.length > 0) {
          let is = true
          this.shoppingCart.forEach((item) => {
            // 是否有同名商品
            if (item.id === this.detailData.id && item.orderCondition === this.detailData.orderCondition) {
              // 是否有同规格商品
              item.orderPieces++
              is = false
            }
          })
          if (is) this.shoppingCart.push(JSON.parse(JSON.stringify(this.detailData)))
        } else {
          this.shoppingCart.push(JSON.parse(JSON.stringify(this.detailData)))
        }
        // 购物车数量
        this.cartBadge = 0
        this.shoppingCart.forEach((item) => {
          this.cartBadge += item.orderPieces
        })
        uni.setStorageSync('shoppingCart', this.shoppingCart)
      }
    },
    // 获取购物车
    getCart() {
      const cart = uni.getStorageSync('shoppingCart')
      if (cart) {
        this.shoppingCart = cart
        // 购物车数量
        this.cartBadge = 0
        cart.forEach((item) => {
          this.cartBadge += item.orderPieces
        })
      }
    },
    // 获取详情
    getDetail() {
      http
        .AutoPartsInquiry({
          id: this.option.id,
          vin: this.option.vin
        })
        .then((res) => {
          if (res.status.success) {
            this.detailData = res.body
            // 轮播图
            if (res.body.resourceUrls.length === 0) {
              res.body.resourceUrls.push('https://cdgwin-prod.cn-bj.ufileos.com/gwin-platform/gwin-cloud/not.png')
            }
            this.imgSwiperList = res.body.resourceUrls
            res.body.resourceUrls.forEach((item) => {
              const list = {
                image: item,
                title: this.detailData.oeName + ' | 位置：' + this.detailData.location
              }
              this.swiperList.push(list)
            })
            // 售价
            if (res.body.discount7Price) {
              this.discountPrice.push({
                condition: 1,
                name: '7成新',
                price: res.body.discount7Price
              })
            }
            if (res.body.discount8Price) {
              this.discountPrice.push({
                condition: 2,
                name: '8成新',
                price: res.body.discount8Price
              })
            }
            if (res.body.discount9Price) {
              this.discountPrice.push({
                condition: 4,
                name: '9成新',
                price: res.body.discount9Price
              })
            }
            if (this.discountPrice.length > 0) this.selPrice = this.discountPrice[0]
          }
        })
    },
    // 添加购物车
    addCard() {
      // 无售价
      if (this.discountPrice.length === 0) {
        this.msg('该商品暂不支持购买')
        return
      }
      // 1 已上架  2 已下架
      if (this.detailData.status === 2) {
        this.msg('商品已下架')
        return
      }
      if (!this.detailData.stockState) {
        this.msg('暂无库存')
        return
      }
      this.skuShow = true
      this.skuType = false
    }
  },
  onShareAppMessage(res) {
    return {
      title: '爱车件—原车配件，种类齐全品质优',
      path: '/pages/product/detail?id=' + this.option.id
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
.detail {
  background: #f8faff;
  width: 100%;
  min-height: 100vh;
  padding: 32rpx;
  ::v-deep .u-swiper__wrapper__item__wrapper__title {
    height: 56rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    /*! autoprefixer: off */
    -webkit-box-orient: vertical;
    /*autoprefixer: on */
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%);
  }
  ::v-deep swiper__wrapper {
    background: rgba(60, 125, 255, 0);
    box-shadow: 0px 4px 20px 0px rgba(153, 153, 153, 0.3);
  }
  ::v-deep .u-swiper__indicator {
    right: 20rpx;
    bottom: 6rpx;
  }
  .indicator-num {
    padding: 2px 0;
    background-color: rgba(0, 0, 0, 0.35);
    border-radius: 100px;
    width: 35px;
    @include flex;
    justify-content: center;

    &__text {
      color: #ffffff;
      font-size: 12px;
    }
  }
  .sku {
    padding: 40rpx 32rpx;
    .configure {
      padding: 40rpx 0;
      display: flex;
      align-items: center;
      text {
        margin-left: 20rpx;
        display: inline-block;
        width: 136rpx;
        height: 64rpx;
        border-radius: 32rpx;
        border: 2rpx solid #3b72ff;
        font-size: 28rpx;
        font-weight: 500;
        color: #3b72ff;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .sel {
        background: #3b72ff;
        color: #ffffff;
      }
    }
    .btn {
      width: 686rpx;
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
    .num {
      display: flex;
      border-bottom: 1rpx solid #f0f0f0;
      padding-bottom: 40rpx;
      > image {
        width: 176rpx;
        height: 176rpx;
        border-radius: 6rpx;
        margin-right: 24rpx;
      }
      .specification {
        flex: 1;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .money {
          width: 100%;
          display: flex;
          justify-content: space-between;
          font-size: 40rpx;
          color: #3b72ff;
          font-weight: bold;
        }
        .name {
          font-size: 32rpx;
          font-weight: 600;
          color: #1a2234;
        }
        > text {
          font-weight: 400;
          color: #b1b6bb;
          font-size: 24rpx;
        }
      }
    }
  }
  .btnBg {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 168rpx;
    background: #ffffff;
    box-shadow: 0rpx -4rpx 12rpx 0rpx rgba(0, 0, 0, 0.06);
    backdrop-filter: blur(0rpx);
    padding: 20rpx 32rpx;
    display: flex;
    .btn {
      flex: 1;
      display: flex;
      font-size: 28rpx;
      font-weight: 500;
      color: #ffffff;
      justify-content: space-between;
      .sel {
        background: #dddddd !important;
      }
      view {
        width: 196rpx;
        height: 72rpx;
        background: #3b72ff;
        border-radius: 36rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      text {
        width: 168rpx;
        height: 72rpx;
        background: linear-gradient(135deg, #5ecdff 0%, #3b5aff 100%);
        border-radius: 36rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .img {
      display: flex;
      justify-content: space-between;
      width: 250rpx;
      margin-right: 55rpx;
      button {
        display: flex;
        flex-direction: column;
      }
      > view {
        position: relative;
        font-size: 20rpx;
        font-weight: 400;
        color: #606a78;
        display: flex;
        flex-direction: column;
        align-items: center;
        text {
          font-size: 20rpx;
          font-weight: 400;
          color: #606a78;
        }
        image {
          width: 52rpx;
          height: 52rpx;
        }
      }
    }
  }
  .vip {
    width: 686rpx;
    height: 222rpx;
    margin: 32rpx 0 200rpx 0;
  }
  .parameter {
    margin-top: 32rpx;
    width: 686rpx;
    background: #ffffff;
    box-shadow: inset 0rpx -2rpx 0rpx 0rpx rgba(0, 0, 0, 0.1);
    border-radius: 16rpx;
    padding: 32rpx;
    position: relative;

    .illustrate {
      line-height: 64rpx;
      .name {
        font-size: 28rpx;
        font-weight: 400;
        color: #b1b6bb;
        text {
          color: #1a2234;
          margin-left: 10rpx;
        }
      }
      .title {
        display: flex;
        align-items: center;
        font-size: 28rpx;
        font-weight: 500;
        color: #1a2234;
        padding: 32rpx 0 10rpx 0;
        image {
          width: 40rpx;
          height: 40rpx;
          margin-right: 8rpx;
        }
      }
    }
    .share {
      position: absolute;
      right: 30rpx;
      top: 65rpx;
      font-size: 28rpx;
      font-weight: 400;
      color: #b1b6bb;
      display: flex;
      flex-direction: column;
      align-items: center;
      .btn {
        display: flex;
        align-items: center;
        flex-direction: column;
        text {
          font-size: 28rpx;
          font-weight: 400;
          color: #b1b6bb;
        }
      }

      image {
        width: 32rpx;
        height: 28rpx;
        margin-bottom: 10rpx;
      }
    }
    .money {
      margin-top: 20rpx;
      font-size: 36rpx;
      font-weight: 900;
      color: #3b72ff;
      > .y {
        font-size: 28rpx;
        font-weight: 400;
        color: #3b72ff;
        margin-right: 10rpx;
      }
      .price {
        color: #b1b6bb;
        font-size: 28rpx;
        font-weight: 900;
        margin-left: 20rpx;
        text-decoration: line-through;
        .y {
          font-size: 24rpx;
          font-weight: 400;
          margin-right: 10rpx;
        }
      }
      padding-bottom: 32rpx;
      border-bottom: 1rpx solid #dddddd;
    }
    .title {
      font-size: 36rpx;
      font-weight: 600;
      color: #1a2234;
      display: flex;
      align-items: center;
      text {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 92rpx;
        height: 44rpx;
        background: #3c7dff;
        border-radius: 8rpx;
        font-size: 20rpx;
        font-weight: 500;
        color: #ffffff;
        margin-left: 20rpx;
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
