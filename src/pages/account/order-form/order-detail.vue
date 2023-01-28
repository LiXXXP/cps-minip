<template>
  <!-- 订单详情 -->
  <view id="template" v-if="orderDetail">
    <!-- 订单状态 1 待支付 2 待发货  4 已发货 8 已取消 16 已完成 -->
    <view class="detail-header">
      <!-- 待付款展示 -->
      <view class="flex row-between" v-if="orderDetail.orderStatus === 1">
        <view class="noPayment-header-left">
          <view class="flex">
            <image src="@/static/member/detailIcon.png"></image>
            <text class="noPayment-header-left_text">等待买家付款</text>
            <view class="count-down">
              <u-count-down
                ref="countDown"
                @finish="countDownChange"
                :time="Number(orderDetail.orderAutoCancelAt)"
                format="HH:mm:ss"
              ></u-count-down>
            </view>
          </view>
          <view style="margin-top: 20rpx">
            <text class="bottom-text">逾期未付款，订单将自动取消</text>
          </view>
        </view>
        <view class="noPayment-header-right">
          <image src="@/static/member/Img-completed.png"></image>
        </view>
      </view>

      <!-- 已取消或完成头部 1 待支付 2 待发货  4 已发货 8 已取消 16 已完成-->
      <view class="flex row-between" v-else>
        <view class="noPayment-header-left">
          <view class="flex">
            <image v-if="orderDetail.orderStatus === 8" src="@/static/member/cancelicon.png"></image>
            <image
              v-if="orderDetail.orderStatus === 2 || orderDetail.orderStatus === 4"
              src="@/static/member/detailIcon.png"
            ></image>
            <image v-if="orderDetail.orderStatus === 16" src="@/static/member/successIcon.png"></image>
            <text v-if="orderDetail.orderStatus === 8" class="noPayment-header-left_text">已取消</text>
            <text v-if="orderDetail.orderStatus === 16" class="noPayment-header-left_text">已完成</text>
            <text v-if="orderDetail.orderStatus === 2" class="noPayment-header-left_text">等待卖家发货</text>
            <text v-if="orderDetail.orderStatus === 4" class="noPayment-header-left_text">卖家已发货</text>
          </view>
          <view style="margin-top: 16rpx">
            <text v-if="orderDetail.orderStatus === 8" class="bottom-text">订单已取消</text>
            <text v-if="orderDetail.orderStatus === 16 && !orderDetail.supportInfo.hasSupport"
class="bottom-text"
              >订单已完成</text
            >
            <!-- 已完成，待发货并且有售后并且是真实商品 -->
            <text
              v-if="
                (orderDetail.orderStatus === 2 || orderDetail.orderStatus === 16) &&
                orderDetail.supportInfo.hasSupport &&
                orderDetail.orderCategory === 1
              "
              class="bottom-text"
            >
              {{ supportStatusView(orderDetail.supportInfo.supportStatus) }}
            </text>
            <text v-if="orderDetail.orderStatus === 2 && !orderDetail.supportInfo.hasSupport" class="bottom-text">
              预计支付成功后24小时内发货
            </text>
            <text v-if="orderDetail.orderStatus === 4" class="bottom-text">商家正通知快递公司取件</text>
          </view>
        </view>
        <view class="noPayment-header-right">
          <image
            v-if="orderDetail.orderStatus === 1 || orderDetail.orderStatus === 8 || orderDetail.orderStatus === 16"
            src="@/static/member/Img-completed.png"
          ></image>
          <image v-else src="@/static/member/Icon-daifahuo.png"></image>
        </view>
      </view>
    </view>

    <view class="detail-content">
      <!-- 已发货展示或真实商品已完成展示 -->
      <view
        v-if="
          (orderDetail.orderStatus === 4 || orderDetail.orderStatus === 16) &&
          orderDetail.orderCategory === 1 &&
          orderDetail.expressNo
        "
        class="detail-map-box"
      >
        <view class="have-been-signed">
          <view class="flex row-between row-center">
            <view>
              <text v-if="orderDetail.orderStatus === 4">商家正通知快递公司取件</text>
              <text v-else class="u-cell-text">已签收</text>
            </view>
            <view @click="goMapDeatil()" class="flex">
              <text class="detail-message">详细信息</text>
              <image style="width: 40rpx; height: 40rpx" src="@/static/index/right.png" mode=""></image>
            </view>
          </view>
          <view style="margin-top: 15rpx">
            <text class="u-cell-text_time">{{ dataConfirm(orderDetail.receiptAt, 2) }}</text>
          </view>
        </view>
      </view>
      <u-gap height="16rpx" bgColor="#F8F8F8"></u-gap>
      <!-- 发货信息真实商品展示（非会员订单） -->
      <view class="user-information flex row-between col-center" v-if="orderDetail.orderCategory === 1">
        <view class="user-information-left">
          <view class="flex">
            <text class="user-information-left_adress">{{ orderDetail.address.regionCn }}</text>
          </view>
          <view style="margin-top: 20rpx">
            <text class="user-information-left_home">{{ orderDetail.address.detailAddress }}</text>
          </view>
          <view class="user-information-left_user flex">
            <text>{{ orderDetail.address.recipientName }}</text>
            <text style="margin-left: 20rpx">{{ orderDetail.address.recipientMobile }}</text>
          </view>
        </view>
        <!-- 地址 -->
        <view class="user-information-right">
          <image
            v-if="orderDetail.orderStatus === 1"
            @click="goAdress"
            src="@/static/member/righticon.png"
            mode=""
          ></image>
        </view>
      </view>
      <view v-if="orderDetail.orderCategory === 1" class="user-information-bottom_icon">
        <image src="@/static/member/Img-divider.png"></image>
      </view>

      <u-gap height="16rpx" bgColor="#F8F8F8"></u-gap>
      <!-- 商品列表 -->
      <view class="list-data">
        <view v-for="(item, index) of orderDetail.goodsList" :key="index">
          <view class="mode-payment flex row-between col-center">
            <view class="goodsName-title">
              <text>{{ item.goodsName }}</text>
            </view>
          </view>
          <view class="item-card-content flex row-between">
            <view style="margin-bottom: 20rpx">
              <image v-if="item.goodsImage" :src="item.goodsImage" style="width: 184rpx; height: 184rpx"></image>
              <image v-else src="@/static/member/noImg.png" style="width: 184rpx; height: 184rpx"></image>
            </view>
            <view class="item-card-content_right">
              <view class="right-item-box flex row-between col-center">
                <text class="item-card-title_text">品牌：{{ item.goodsBrand }}</text>
                <text class="item-card-title_textSmall">¥ {{ item.goodsPrice }}</text>
              </view>
              <view class="right-item-box flex row-between col-center">
                <text class="item-card-remark">规格: {{ conditionView(item.condition) }}</text>
                <text class="item-num">x{{ item.pieces }}</text>
              </view>
              <view class="right-item-boxflex row-between col-top">
                <text class="item-card-remark"></text>
              </view>
            </view>
          </view>
        </view>

        <!-- 小计 -->
        <view class="item-card-footer">
          <text>共{{ orderDetail.goodsList.length }}件 小计：</text>
          <text>¥ {{ orderDetail.goodsAmount }}</text>
        </view>
      </view>
      <u-gap height="16rpx" bgColor="#F8F8F8"></u-gap>
      <view>
        <u-cell-group>
          <u-cell :border="false">
            <view slot="title" class="u-slot-title">
              <text class="u-cell-title u-cell-ftw">支付方式</text>
            </view>
            <view slot="value" class="u-slot-value">
              <text class="u-cell-title u-cell-ftw">{{
                orderDetail.paymentMethod === 1 ? '在线支付' : '货到付款'
              }}</text>
              <!-- <image  src="@/static/member/righticon.png" mode=""></image> -->
            </view>
          </u-cell>
          <u-cell :border="false">
            <view slot="title" class="u-slot-title">
              <text class="u-cell-title u-cell-ftw">商品金额</text>
            </view>
            <view slot="value" class="u-slot-value">
              <text class="u-cell-title u-cell-ftw">¥ {{ orderDetail.goodsAmount }}</text>
            </view>
          </u-cell>
          <u-cell :border="false" v-if="orderDetail.orderCategory !== 2">
            <view slot="title" class="u-slot-title">
              <text class="u-cell-title u-cell-ftw">运费</text>
            </view>
            <view slot="value" class="u-slot-value">
              <text class="u-cell-title u-cell-ftw">¥ {{ orderDetail.freight }}</text>
            </view>
          </u-cell>
          <u-cell :border="false">
            <view slot="title" class="u-slot-title">
              <text class="u-cell-title u-cell-ftw">总金额</text>
            </view>
            <view slot="value" class="u-slot-value">
              <text class="u-cell-title u-cell-ftw">¥ {{ orderDetail.totalAmount }}</text>
            </view>
          </u-cell>
        </u-cell-group>
      </view>
      <u-gap height="16rpx" bgColor="#F8F8F8"></u-gap>
      <view style="margin-bottom: 30rpx">
        <u-cell-group :border="false">
          <u-cell>
            <view slot="title" class="u-slot-title">
              <text class="u-cell-title u-cell-ftw">订单编号：</text>
            </view>
            <view slot="value" class="u-slot-value">
              <text class="u-cell-title u-cell-ftw">{{ orderDetail.orderId }}</text>
            </view>
          </u-cell>
          <u-cell>
            <view slot="title" class="u-slot-title">
              <text class="u-cell-title u-cell-ftw">下单时间：</text>
            </view>
            <view slot="value" class="u-slot-value">
              <text class="u-cell-title u-cell-ftw">{{ dataConfirm(orderDetail.createAt, 2) }}</text>
            </view>
          </u-cell>

          <u-cell v-if="orderDetail.orderStatus === 16">
            <view slot="title" class="u-slot-title">
              <text class="u-cell-title u-cell-ftw">发货时间：</text>
            </view>
            <view slot="value" class="u-slot-value">
              <text class="u-cell-title u-cell-ftw">{{ dataConfirm(orderDetail.shipAt, 2) }}</text>
            </view>
          </u-cell>
          <u-cell v-if="orderDetail.orderStatus === 16">
            <view slot="title" class="u-slot-title">
              <text class="u-cell-title u-cell-ftw">签收时间：</text>
            </view>
            <view slot="value" class="u-slot-value">
              <text class="u-cell-title u-cell-ftw">{{ dataConfirm(orderDetail.receiptAt, 2) }}</text>
            </view>
          </u-cell>
        </u-cell-group>
      </view>
      <view v-if="!vipFlag" @click="goMember" class="member-card">
        <image src="@/static/member/vipTitlex2.png" style="width: 100%; height: 100%"></image>
      </view>
    </view>
    <view v-if="orderDetail.orderStatus !== 8" class="detail-footer flex row-between col-center">
      <view class="footer-left">
        <text>实付：</text>
        <text> ¥ </text>
        <text>{{ orderDetail.actualPayAmount }}</text>
      </view>
      <!-- 已取消或完成底部 1 待支付 2 待发货  4 已发货 8 已取消 16 已完成-->
      <view class="flex row-right">
        <view
          v-if="orderDetail.orderStatus === 1 || (orderDetail.paymentMethod === 2 && orderDetail.orderStatus === 2)"
          class="footer-right flex"
        >
          <view style="margin-right: 20rpx">
            <u-button @click="handlerCancellation(orderDetail.orderId)" shape="circle" text="取消订单"> </u-button>
          </view>
        </view>

        <view v-if="orderDetail.orderStatus === 1">
          <u-button shape="circle" type="primary" text="去支付" @click="orderPay"></u-button>
        </view>

        <view v-if="orderDetail.orderStatus === 4" class="footer-right flex">
          <view style="margin-right: 20rpx">
            <u-button @click="goMapDeatil()" shape="circle" size="small" text="查看物流"></u-button>
          </view>
          <view class="footer-btn">
            <u-button
              shape="circle"
              @click="confirmReceipt(orderDetail.orderId)"
              color="#3B72FF"
              size="small"
              text="确认收货"
            ></u-button>
          </view>
        </view>
        <view v-if="orderDetail.orderCategory === 1" class="footer-right flex">
          <view
            v-if="
              orderDetail.orderStatus === 16 &&
              (orderDetail.supportInfo.supportStatus === 4 || !orderDetail.supportInfo.hasSupport)
            "
            class="footer-right flex"
          >
            <view>
              <u-button @click="handlerRefund(orderDetail, 2)" shape="circle" text="申请退货"></u-button>
            </view>
          </view>
          <!-- 待发货-在线支付-当前售后状态为拒绝或者没有售后展示, -->
          <view
            v-if="
              orderDetail.orderStatus === 2 &&
              orderDetail.paymentMethod === 1 &&
              (orderDetail.supportInfo.supportStatus === 4 || !orderDetail.supportInfo.hasSupport)
            "
            class="footer-right flex"
          >
            <view>
              <u-button @click="handlerRefund(orderDetail, 1)" shape="circle" text="申请退款"></u-button>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 支付 -->
    <gwin-pay ref="payRef" :orderId="orderId"></gwin-pay>
    <view>
      <u-modal showCancelButton :show="modalShow" @confirm="confirm" :asyncClose="true" @cancel="modalShow = false">
        <view class="slot-content">
          <rich-text class="slot-content-text" :nodes="content"></rich-text>
        </view>
      </u-modal>
    </view>
  </view>
</template>

<script>
import http from '@/api/account'
export default {
  data() {
    return {
      borderShow: true,
      modalShow: false,
      content: '确定要取消订单吗？',
      orderStatus: '',
      addOrderPay: '',
      orderDetail: {},
      option: '',
      orderId: '',
      vipFlag: uni.getStorageSync('vipFlag')
    }
  },
  components: {},
  onLoad(option) {
    const that = this
    this.option = option
    this.init()
    // 获取订单信息
    this.addOrderPay = uni.getStorageSync('addOrderPay')
    uni.addInterceptor('navigateBack', {
      // 监听返回
      success(e) {
        that.watchRouter(e)
      }
    })
  },
  methods: {
    // 已完成详情头部展示内容
    supportStatusView(num) {
      let str = ''
      switch (num) {
        case 1:
          str = '待审核'
          break
        case 2:
          str = '审批通过'
          break
        case 4:
          str = '审批拒绝'
          break
        case 8:
          str = '待卖家收货'
          break
        case 16:
          str = '完成售后'
          break
        case 32:
          str = '退货拒绝'
          break
        default:
          str = ''
      }
      return str
    },
    watchRouter(e) {
      if (e.errMsg === 'navigateBack:ok') {
        // 选择地址时改变当前页
        const updateAdress = uni.getStorageSync('adress')
        this.orderDetail.address.regionCn = updateAdress.regionCn
        this.orderDetail.address.detailAddress = updateAdress.address
        this.orderDetail.address.recipientName = updateAdress.name
        this.orderDetail.address.recipientMobile = updateAdress.phone
      }
    },
    //  支付
    orderPay() {
      this.orderId = this.option.orderId
      this.$refs.payRef.payShow = true
    },
    // 页面初始化数据
    async init() {
      const res = await http.MiniOrderInquiry({
        orderId: this.option.orderId
      })
      if (res.status.success) {
        this.orderDetail = res.body
      }
    },
    // 开通会员
    goMember() {
      uni.navigateTo({
        url: '/pages/account/member/member'
      })
    },
    // 地址页
    goAdress() {
      uni.navigateTo({
        url: '/pages/account/address/address?pages=select'
      })
    },
    // 规格展示
    conditionView(num) {
      let str = ''
      switch (num) {
        case 1:
          str = '7成新'
          break
        case 2:
          str = '8成新'
          break
        case 4:
          str = '9成新'
          break
        default:
          str = '无'
      }
      return str
    },
    // 取消订单按钮
    handlerCancellation(orderId) {
      this.orderId = orderId
      this.modalShow = true
    },
    // 确定取消
    async confirm() {
      const res = await http.MiniOrderCancel({
        orderId: this.orderId
      })
      if (res.status.success) {
        uni.showToast({
          title: '取消成功',
          duration: 2000
        })
        setTimeout(() => {
          this.modalShow = false
          uni.navigateBack({
            delta: 1
          })
        }, 1000)
      }
    },
    // 确认收货
    async confirmReceipt(orderId) {
      const res = await http.MiniOrderConfirmReceipt({
        orderId: orderId
      })
      if (res.status.success) {
        uni.showToast({
          title: '已确认收货',
          duration: 2000
        })
        setTimeout(() => {
          uni.navigateBack({
            delta: 1
          })
        }, 1000)
      }
    },
    // 申请退货 type 1是退款 2退货
    handlerRefund(item, type) {
      uni.navigateTo({
        url: '/pages/account/refund/refund?orderId=' + item.orderId + '&type=' + type
      })
    },
    // 物流详情
    goMapDeatil() {
      uni.navigateTo({
        url:
          '/pages/account/map-detail/map-detail?expressNo=' +
          this.orderDetail.expressNo +
          '&orderId=' +
          this.orderDetail.orderId +
          '&status=' +
          this.orderDetail.orderStatus
      })
    },
    // 倒计时监听
    countDownChange() {
      this.init()
    }
  }
}
</script>
<style lang="scss" scoped>
@import './order-detail.scss';
</style>
