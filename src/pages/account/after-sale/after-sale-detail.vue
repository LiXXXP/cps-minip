<template>
  <!-- 申请退款 -->
  <view id="template">
    <!-- 待卖家收货状态下展示 -->
    <view v-if="detailObj.status === 8" class="pending-header">
      <text>请耐心等待，我们将在收到货物后7个工作日内处理退款</text>
    </view>
    <!-- 完成售后 -->
    <view v-if="detailObj.status === 16" class="pending-header">
      <text>退款已原路退回您的账号，请查收！</text>
    </view>
    <view class="refund-header flex row-between col-center">
      <text>订单号：{{ detailObj.orderId }}</text>
      <!-- 做判断显示状态 -->
      <text>{{ statusView(detailObj.status) }}</text>
    </view>
    <view class="refund-content">
      <view v-for="(item, index) in detailObj.goodsList" :key="index">
        <view>
          <!-- 单个商品展示 -->
          <view class="content-item-title flex col-center">
            <text class="content-item-title_left">{{ item.goodsName }}</text>
          </view>
          <view class="item-card-content flex row-between">
            <view>
              <image v-if="item.imageUri" :src="item.imageUri" style="width: 184rpx; height: 184rpx"></image>
              <image v-else src="@/static/member/noImg.png" style="width: 184rpx; height: 184rpx"></image>
            </view>
            <view class="item-card-content_right">
              <view class="right-item-box flex row-between col-center">
                <text class="item-card-title_text">品牌：{{ item.goodsBrand || '' }}</text>
                <text class="item-card-title_textSmall">¥ {{ item.goodsAmount }}</text>
              </view>
              <view class="right-item-box flex row-between col-center">
                <text class="item-card-remark">规格: {{ conditionView(item.condition) }}</text>
                <text class="item-num">x{{ item.goodsTotal }}</text>
              </view>
              <view class="right-item-boxflex row-between col-top">
                <text class="item-card-remark"></text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="refund-content-item_money flex col-center">
        <text>实付金额：</text>
        <text>¥ {{ detailObj.payAmount }}</text>
      </view>
      <u-gap height="16rpx" bgColor="#F9F9F9"></u-gap>
      <!-- 已拒绝状态下展示 -->
      <view class="deny-content" v-if="detailObj.status === 4">
        <view><text class="refund-upload-text">拒绝原因</text></view>
        <view>
          <text class="deny-content-text">
            {{ detailObj.review || '无' }}
          </text>
        </view>
      </view>
      <u-gap v-if="detailObj.status !== 4" height="16rpx" bgColor="#F9F9F9"></u-gap>
      <!-- 审核通过展示 v-if='status === '审核通过' || status === '待卖家收货',退款订单不显示-->
      <view v-if="(detailObj.status === 2 || detailObj.status === 8) && detailObj.category !== 1">
        <u--form labelPosition="left" :model="cscformData" ref="cscformData">
          <u-form-item labelWidth="80" label="快递公司" prop="expressCompany" borderBottom>
            <u--input
              inputAlign="right"
              v-model="cscformData.expressCompany"
              disabledColor="#ffffff"
              border="none"
              disabled
            ></u--input>
          </u-form-item>
          <u-form-item labelWidth="80" label="快递单号" prop="expressNo" borderBottom>
            <u--input
              inputAlign="right"
              v-model="cscformData.expressNo"
              disabledColor="#ffffff"
              placeholder="请填写快递单号"
              border="none"
              :disabled="detailObj.status === 8"
            ></u--input>
          </u-form-item>
        </u--form>
      </view>

      <!-- 审核通过不展示-->
      <view v-if="detailObj.status !== 2 || detailObj.category === 1">
        <view v-if="detailObj.category === 2" class="refund-content-cell flex row-between col-center">
          <text>申请退货数量</text>
          <text>{{ detailObj.itemTotal }}</text>
        </view>
        <view style="border-bottom: none" class="refund-content-cell flex row-between col-center">
          <text>{{ detailObj.category === 1 ? '申请退款金额' : '申请退货金额' }}</text>
          <text>¥ {{ detailObj.refundAmount }}</text>
        </view>
        <u-gap height="16rpx" bgColor="#F9F9F9"></u-gap>
        <view>
          <u--form labelPosition="left" :model="formData" ref="formData">
            <u-form-item
              labelWidth="80"
              :label="detailObj.category === 1 ? '退款原因' : '退货原因'"
              prop="reason"
              borderBottom
              @click="refundReason = true"
            >
              <u--input
                inputAlign="right"
                v-model="formData.reason"
                disabled
                disabledColor="#ffffff"
                border="none"
              ></u--input>
            </u-form-item>
            <u-form-item prop="formData.fileList1">
              <view class="refund-upload">
                <!-- 售后凭证-C端用户退货或退款的图片 -->
                <view><text class="refund-upload-text">售后凭证</text></view>
                <view class="refund-content-imgbox flex row-left col-center" style="margin-top: 24rpx">
                  <view style="margin-left: 20rpx" v-for="(item, index) in detailObj.images" :key="index">
                    <view class="refund-content-imgitem">
                      <image :src="item"></image>
                    </view>
                  </view>
                </view>
                <!-- 商家操作后返回给C端用户展示的图片凭证 （只有一张）-->
                <view v-if="detailObj.refundCertImage" style="margin-top: 24rpx">
                  <text class="refund-upload-text">退款凭证</text>
                </view>
                <view
                  v-if="detailObj.refundCertImage"
                  class="refund-content-imgbox flex row-left col-center"
                  style="margin-top: 24rpx"
                >
                  <view style="margin-left: 20rpx">
                    <view class="refund-content-imgitem">
                      <image :src="detailObj.refundCertImage"></image>
                    </view>
                  </view>
                </view>
              </view>
            </u-form-item>
          </u--form>
        </view>
      </view>
    </view>
    <!-- 审核通过展示提交 v-if='status === '审核通过' '-->
    <view v-if="detailObj.status === 2 && detailObj.category !== 1" class="refund-footer">
      <view class="submit-btn">
        <u-button type="primary" color="#3B72FF" shape="circle" @click="submit">提交</u-button>
      </view>
    </view>
  </view>
</template>
<script>
import http from '@/api/account.js'
export default {
  data() {
    return {
      actions: [
        {
          name: '七天无理由退货'
        },
        {
          name: '做工问题'
        },
        {
          name: '未按约定时间发货'
        }
      ],
      formData: {
        reason: '',
        fileList1: []
      },
      detailObj: {},
      cscformData: {
        expressCompany: '诚运物流',
        expressNo: '',
        supportApplyId: ''
      }
    }
  },
  onLoad: function (option) {
    // 接收售后列表页参数
    this.cscformData.supportApplyId = option.id
  },
  methods: {
    // 页面初始化数据
    async init() {
      const res = await http.MiniSupportOrderInquiry({
        supportApplyId: this.cscformData.supportApplyId
      })
      if (res.status.success) {
        this.detailObj = res.body
        this.formData.reason = res.body.reason
        this.cscformData.expressNo = res.body.expressNo
      }
    },
    // 售后状态为审核通过提交
    async submit() {
      if (this.cscformData.expressNo) {
        const res = await http.MiniSupportOrderExpressNoMaintenance({
          expressCompany: this.cscformData.expressCompany,
          expressNo: this.cscformData.expressNo,
          supportApplyId: this.cscformData.supportApplyId
        })
        if (res.status.success) {
          uni.showToast({
            title: '提交成功',
            duration: 1000
          })
          setTimeout(() => {
            uni.navigateBack({
              delta: 1
            })
          }, 1500)
        }
      } else {
        uni.showToast({
          title: '请填写快递单号',
          icon: 'error',
          duration: 1000
        })
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
    }
  },
  mounted() {
    this.init()
  }
}
</script>
<style lang="scss" scoped>
#template {
}

.pending-header {
  height: 88rpx;
  background-image: url(../../../static/index/productBg.png);
  background-size: 100%;

  text {
    display: block;
    padding: 24rpx 30rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: #ffffff;
  }
}

.refund-header {
  height: 93rpx;
  border-bottom: 2rpx solid #f6f6f6;
  margin: 26rpx 32rpx;
}

.refund-header text:nth-of-type(1) {
  font-size: 32rpx;
  font-weight: 500;
  color: #1a2234;
}

.refund-header text:nth-of-type(2) {
  font-size: 28rpx;
  font-weight: 400;
  color: #3b72ff;
}

.refund-content {
  margin: 26rpx 32rpx;
}

.refund-content-imgitem {
  margin-top: 22rpx;

  image {
    width: 184rpx;
    height: 184rpx;
  }
}

.refund-content-item_money {
  height: 91rpx;
  border-top: 2rpx solid #f6f6f6;
  margin-top: 24rpx;

  text:nth-of-type(1) {
    font-size: 28rpx;
    font-weight: 400;
    color: #606a78;
  }

  text:nth-of-type(2) {
    font-size: 32rpx;
    font-weight: 400;
    color: #3b72ff;
  }
}

.refund-content-cell {
  height: 102rpx;
  border-bottom: 2rpx solid #f6f6f6;

  text {
    font-size: 28rpx;
    font-weight: 400;
    color: #1a2234;
  }
}

.refund-upload {
  margin-top: 32rpx;

  .refund-upload-text {
    font-size: 28rpx;
    font-weight: 500;
    color: #1a2234;
  }
}

.refund-content {
  margin-bottom: 180rpx;
}

.item-card-content {
  margin-top: 24rpx;

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
.deny-content {
  margin-bottom: 20rpx;

  view:nth-of-type(1) {
    margin-top: 30rpx;
  }

  view:nth-of-type(2) {
    margin-top: 24rpx;
    background: #f9f9f9;
    padding: 20rpx;
  }

  .deny-content-text {
    width: 99%;
    word-break: break-all;
    font-size: 28rpx;
    font-weight: 400;
    color: #1a2234;
  }
}

.content-item-title {
  height: 80rpx;
  border-bottom: 2rpx solid #f6f6f6;

  .content-item-title_left {
    width: 99%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 28rpx;
    font-weight: 500;
    color: #1a2234;
  }
}

.refund-footer {
  height: 164rpx;
  background: #ffffff;
  box-shadow: 0px -4px 12px 0px rgba(0, 0, 0, 0.06);
  border-radius: 0px 0px 20px 20px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
}

.submit-btn {
  margin: 28rpx 32rpx;
}
</style>
