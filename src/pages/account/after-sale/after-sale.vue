<template>
  <!-- 售后 -->
  <view id="template">
    <view class="header-tabs">
      <u-tabs
        :scrollable="false"
        @change="tabChange"
        :current="current"
        :list="tabList"
        :activeStyle="{
          color: '#3B72FF'
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
          <u-gap height="24rpx" bgColor="#F8F8F8"></u-gap>
          <text class="content-item-title_right">{{ statusView(item.status) }}</text>
          <!-- item——header -->
          <view v-for="(itemChildren, jindex) in item.goodsList" :key="jindex">
            <view class="content-item-title flex col-center">
              <text class="content-item-title_left">{{ itemChildren.goodsName }}</text>
            </view>
            <!-- item-content -->
            <view @click="goAfterSaleDetail(item)" class="item-card-content flex row-between">
              <view>
                <image
                  v-if="itemChildren.imageUri"
                  :src="itemChildren.imageUri"
                  style="width: 184rpx; height: 184rpx"
                ></image>
                <image v-else src="@/static/member/noImg.png" style="width: 184rpx; height: 184rpx"></image>
              </view>
              <view class="item-card-content_right">
                <view class="right-item-box flex row-between col-center">
                  <text class="item-card-title_text">品牌：{{ itemChildren.goodsBrand || '' }}</text>
                  <text class="item-card-title_textSmall">¥ {{ itemChildren.goodsAmount }}</text>
                </view>
                <view class="right-item-box flex row-between col-center">
                  <text class="item-card-remark">规格: {{ conditionView(itemChildren.condition) }}</text>
                  <text class="item-num">x{{ itemChildren.goodsTotal }}</text>
                </view>
                <view class="right-item-boxflex row-between col-top">
                  <text class="item-card-remark"> </text>
                </view>
              </view>
            </view>
          </view>
          <!-- 卡片底部 -->
          <view class="content-item-footer flex row-between col-center">
            <view>
              <text class="content-item-footer_time">{{ dataConfirm(item.createAt, 2) }}</text>
            </view>
            <view>
              <text class="item-card-remark">实付金额：</text>
              <text class=".content-item-footer_money">¥ {{ item.payAmount }}</text>
            </view>
          </view>
        </view>
        <u-gap height="16rpx" bgColor="#F8F8F8"></u-gap>
      </view>
    </mescroll-body>
  </view>
</template>
<script>
import http from '@/api/account.js'
export default {
  data() {
    return {
      current: 0,
      borderShow: true,
      tabList: [
        {
          name: '全部',
          code: 0
        },
        {
          name: '申请中',
          code: 1
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
      dataList: []
    }
  },
  onShow() {
    this.mescroll.resetUpScroll()
  },
  methods: {
    // 列表初始化 上拉加载的回调
    async upCallback(page) {
      const res = await http.MiniSupportOrderListInquiry({
        page: {
          pageNum: page.num,
          pageSize: page.size,
          returnCount: true,
          orderBy: 'csa.id DESC'
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
        this.mescroll.endErr()
      }
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
          str = '待处理'
          break
        case 2:
          str = '审批通过'
          break
        case 4:
          str = '已拒绝'
          break
        case 8:
          str = '待卖家收货'
          break
        case 16:
          str = '完成售后'
          break
        case 32:
          str = '退货拒收'
          break
        default:
          str = ''
      }
      return str
    },
    tabChange(e) {
      this.current = e.index
      this.status = e.code
      this.dataList = []
      this.mescroll.resetUpScroll()
    },
    // 跳转售后详情
    goAfterSaleDetail(item) {
      const id = item.id
      uni.navigateTo({
        url: '/pages/account/after-sale/after-sale-detail?id=' + item.id
      })
    }
  }
}
</script>
<style lang="scss" scoped>
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
  margin: 100rpx 32rpx 20rpx;
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
  width: 80%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 28rpx;
  font-weight: 500;
  color: #1a2234;
}
.content-item-title_right {
  position: absolute;
  top: 68rpx;
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
.content-item-footer_time {
  font-size: 28rpx;
  font-weight: 400;
  color: #b1b6bb;
}
.content-item-footer_money {
  font-size: 32rpx;
  font-family: Roboto-Regular, Roboto;
  font-weight: 400;
  color: #1a2234;
  line-height: 44rpx;
}
::v-deep {
  .mescroll-empty {
    padding: 45% 29% !important;
  }
}
</style>
