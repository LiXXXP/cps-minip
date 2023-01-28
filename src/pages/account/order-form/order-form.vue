<template>
  <!-- 订单页 -->
  <view id="template">
    <view class="header-tabs">
      <u-tabs
        @change="tabChange"
        :current="current"
        :list="tabList"
        lineColor="#3B72FF"
        :activeStyle="{
          fontSize: '32rpx',
          color: '#3B72FF',
          fontWeight: 'bold'
        }"
        :inactiveStyle="{
          fontSize: '28rpx',
          fontWeight: 400,
          color: '#1A2234'
        }"
      ></u-tabs>
    </view>
    <mescroll-body
      ref="mescrollRef"
      class="mescroll"
      :up="upOption"
      @init="mescrollInit"
      @down="downCallback"
      @up="upCallback"
    >
      <view class="content">
        <!-- 循环content-item -->
        <view v-for="(item, index) in dataList" :key="index" class="content-item">
          <!-- item——header 状态获取dataList外层数据-->
          <text class="content-item-title_right">{{ statusView(item.orderStatus) }}</text>
          <!-- 获取 goodsList 每个名称循环-->
          <view v-for="(itemChildren, jindex) in item.goodsList" :key="jindex">
            <view class="content-item-title flex col-center">
              <text class="content-item-title_left">{{ itemChildren.goodsName }}</text>
            </view>
            <!-- item-content -->
            <view @click="goDetail(item)" class="item-card-content flex row-between">
              <view>
                <image
                  v-if="itemChildren.goodsIconUri"
                  :src="itemChildren.goodsIconUri"
                  style="width: 184rpx; height: 184rpx"
                ></image>
                <image v-else src="@/static/member/noImg.png" style="width: 184rpx; height: 184rpx"></image>
              </view>
              <view class="item-card-content_right">
                <view class="right-item-box flex row-between col-center">
                  <text class="item-card-title_text">品牌：{{ itemChildren.goodsBrand }}</text>
                  <text class="item-card-title_textSmall">¥ {{ itemChildren.goodsPrice }}</text>
                </view>
                <view class="right-item-box flex row-between col-center">
                  <text class="item-card-remark">规格: {{ conditionView(itemChildren.condition) }}</text>
                  <text class="item-num">x{{ itemChildren.goodsNum }}</text>
                </view>
                <view class="right-item-boxflex row-between col-top">
                  <text class="item-card-remark"></text>
                </view>
              </view>
            </view>
          </view>
          <!-- 卡片底部 -->
          <view class="content-item-footer flex row-between col-center">
            <view>
              <text class="item-card-remark">实付金额：</text>
              <text class="item-footer-money">¥ {{ item.orderTotalAmount }}</text>
            </view>
            <view v-if="item.orderStatus !== 8" class="flex">
              <view
                class="footer-btn"
                v-if="item.orderStatus === 1 || (item.orderStatus === 2 && item.paymentMethod === 2)"
              >
                <u-button @click="handlerCancellation(item)" size="mini" text="取消订单"></u-button>
              </view>
              <view class="footer-btn" v-if="item.orderStatus === 1">
                <u-button
                  color="#3B72FF"
                  type="primary"
                  size="mini"
                  text="去支付"
                  @click="goPage('/pages/account/order-form/order-detail?orderId=' + item.orderId)"
                ></u-button>
              </view>
              <view class="footer-btn" v-if="item.orderStatus === 4">
                <u-button @click="goMapDeatil(item)" size="mini" text="查看物流"></u-button>
              </view>
              <view class="footer-btn" v-if="item.orderStatus === 4">
                <u-button
                  @click="confirmReceipt(item)"
                  color="#3B72FF"
                  type="primary"
                  size="mini"
                  text="确认收货"
                ></u-button>
              </view>
            </view>
          </view>
        </view>
      </view>
    </mescroll-body>

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
      current: 0,
      borderShow: true,
      modalShow: false,
      content: '确定要取消订单吗？',
      tabList: [
        {
          name: '全部',
          code: 0
        },
        {
          name: '待付款',
          code: 1
        },
        {
          name: '待发货',
          code: 2
        },
        {
          name: '待收货',
          code: 4
        },
        {
          name: '已完成',
          code: 16
        },
        {
          name: '已取消',
          code: 8
        }
      ],
      upOption: {
        page: {
          num: 0,
          size: 10
        },
        noMoreSize: 5,
        textNoMore: '已加载全部~'
      },
      status: 0,
      dataList: [],
      // 当前订单ID
      orderId: ''
    }
  },
  onLoad: function (option) {
    this.tabList.forEach((item, index) => {
      if (item.name === option.active) {
        this.current = index
        this.status = item.code
      }
    })
  },
  methods: {
    // 上拉加载的回调
    async upCallback(page) {
      const res = await http.MiniOrderListInquiry({
        page: {
          pageNum: page.num,
          pageSize: page.size,
          returnCount: true,
          orderBy: 'com.id DESC'
        },
        miniUserId: uni.getStorageSync('userId'),
        status: this.status
      })
      if (res.status.success) {
        const curPageLen = res.body.dataList.length
        const totalSize = res.body.page.count
        if (page.num === 1) this.dataList = [] // 如果是第一页需手动置空列表1
        this.dataList = this.dataList.concat(res.body.dataList) // 追加新数据
        this.mescroll.endBySize(curPageLen, totalSize)
      }
      ;() => {
        //  请求失败,隐藏加载状态
        this.mescroll.endErr()
        // console.log('失败')
      }
    },
    tabChange(e) {
      this.current = e.index
      this.status = e.code
      this.dataList = []
      this.mescroll.resetUpScroll()
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
    // 状态展示
    statusView(val) {
      let str = ''
      switch (val) {
        case 1:
          str = '待付款'
          break
        case 2:
          str = '待发货'
          break
        case 4:
          str = '待收货'
          break
        case 8:
          str = '已取消'
          break
        case 16:
          str = '已完成'
          break
        default:
          str = ''
      }
      return str
    },
    goDetail(item) {
      const orderId = item.orderId
      uni.navigateTo({
        url: '/pages/account/order-form/order-detail?orderId=' + orderId
      })
    },
    // 取消订单按钮
    handlerCancellation(item) {
      this.orderId = item.orderId
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
          this.mescroll.resetUpScroll()
        }, 1000)
      }
    },
    // 确认收货
    async confirmReceipt(item) {
      const res = await http.MiniOrderConfirmReceipt({
        orderId: item.orderId
      })
      if (res.status.success) {
        uni.showToast({
          title: '已确认收货',
          duration: 2000
        })
        setTimeout(() => {
          this.mescroll.resetUpScroll()
        }, 1000)
      }
    },
    // 物流详情
    goMapDeatil(item) {
      console.log(item)
      uni.navigateTo({
        url:
          '/pages/account/map-detail/map-detail?expressNo=' +
          item.expressNo +
          '&orderId=' +
          item.orderId +
          '&status=' +
          item.orderStatus
      })
    }
  }
}
</script>
<style lang="scss" scoped>
#template {
  background: #f8f8f8;
}
.header-tabs {
  width: 100%;
  height: 92rpx;
  background: #ffffff;
  padding: 0 32rpx;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 999;
}
.content {
  margin: 115rpx 32rpx 20rpx;
}
.content-item {
  background: #ffffff;
  border-radius: 20rpx;
  position: relative;
  .content-item-title {
    height: 89rpx;
    margin: 24rpx;
    border-bottom: 2rpx solid #f6f6f6;
  }
}
.content-item-title_left {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 85%;
  font-size: 28rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #1a2234;
  line-height: 40rpx;
}
.content-item-title_right {
  position: absolute;
  top: 28rpx;
  right: 20rpx;
  font-size: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #3b72ff;
  line-height: 40rpx;
}
.item-card-content {
  margin: 24rpx;
  .item-card-content_right {
    flex: 1;
    margin-left: 20rpx;
  }
}
.item-card-content_right view:nth-of-type(1) {
  margin-top: 30rpx;
}
.item-card-content_right view:nth-of-type(2) {
  margin-top: 20rpx;
}
.right-item-boxflex > text {
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
}
.item-card-title_text {
  font-size: 28rpx;
  color: #1a2234;
  line-height: 40rpx;
}
.item-card-title_textSmall {
  font-weight: bold;
  font-size: 24rpx;
  color: #1a2234;
  line-height: 40rpx;
}
.item-card-remark {
  font-size: 28rpx;
  color: #606a78;
  line-height: 48rpx;
}
.item-num {
  font-size: 28rpx;
  color: #606a78;
  line-height: 48rpx;
}
.content-item-footer {
  height: 96rpx;
  border-top: 1rpx solid #f6f6f6;
  margin: 0 24rpx;
}
.item-footer-money {
  font-size: 32rpx;
  font-family: Roboto-Regular, Roboto;
  font-weight: bold;
  color: #1a2234;
  line-height: 44rpx;
}
.slot-content-text {
  font-size: 36rpx;
  font-weight: 500;
  color: #1a2234;
}
.footer-btn {
  margin: 10rpx;
}
::v-deep {
  .mescroll-empty {
    padding: 45% 29% !important;
  }
  .u-line {
    border-color: #f6f6f6 !important;
  }
  .u-button--mini {
    height: 56rpx !important;
    padding: 8rpx 14rpx !important;
  }
  .u-button__text {
    font-size: 26rpx !important;
  }
}
</style>
