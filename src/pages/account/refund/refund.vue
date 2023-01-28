<template>
  <!-- 申请退款 -->
  <view id="template">
    <view class="refund-content">
      <!-- 单个商品展示 -->
      <view v-for="(item, index) in formData.orderDetail.goodsList" :key="index">
        <view class="refund-header flex row-between col-center">
          <text>{{ item.goodsName }}</text>
        </view>
        <view class="item-card-content flex row-between">
          <view>
            <image :src="item.goodsImage" style="width: 184rpx; height: 184rpx"></image>
          </view>
          <view class="item-card-content_right">
            <view class="right-item-box flex row-left col-center">
              <text class="item-card-title_text">品牌：{{ item.goodsBrand }}</text>
            </view>
            <view class="right-item-box flex row-between col-center">
              <text class="item-card-remark">规格: {{ conditionView(item.condition) }}</text>
              <text class="item-num">x{{ item.pieces }}</text>
            </view>
            <view class="right-item-boxflex row-between col-top">
              <text class="item-card-remark"> </text>
            </view>
          </view>
        </view>
      </view>
      <view class="refund-content-item_money flex col-center">
        <text>实付金额：</text>
        <text>¥ {{ formData.orderDetail.actualPayAmount }}</text>
      </view>
      <u-gap height="16rpx" bgColor="#F9F9F9"></u-gap>
      <view v-if="type === 2" class="refund-content-cell flex row-between col-center">
        <text>申请退货数量</text>
        <text>{{ formData.orderDetail.goodsList.length }}</text>
      </view>
      <view style="border-bottom: none" class="refund-content-cell flex row-between col-center">
        <text>{{ type === 1 ? '申请退款金额' : '申请退货金额' }}</text>
        <text>
          ¥{{
            formData.orderDetail.orderStatus === 2 ? formData.orderDetail.totalAmount : formData.orderDetail.goodsAmount
          }}
        </text>
      </view>
      <u-gap height="16rpx" bgColor="#F9F9F9"></u-gap>
      <view>
        <u--form labelPosition="left" :model="formData" :rules="rules" ref="formData">
          <u-form-item
            labelWidth="80"
            :label="type === 1 ? '退款原因' : '退货原因'"
            prop="reason"
            borderBottom
            @click="refundReason = true"
          >
            <u--input
              inputAlign="right"
              v-model="formData.reason"
              disabled
              disabledColor="#ffffff"
              placeholder="请选择"
              border="none"
            ></u--input>
            <u-icon slot="right" name="arrow-right"></u-icon>
          </u-form-item>
          <u-form-item prop="fileList1">
            <view class="refund-upload">
              <view><text class="refund-upload-text">售后凭证</text></view>
              <view style="margin-top: 24rpx">
                <view class="imgs-box flex row-left col-center" style="margin-top: 20rpx">
                  <view v-for="(item, index) in formData.fileList1" :key="index" class="item-image">
                    <view @click="handlerImage(index)" class="del-icon">
                      <u-icon name="close-circle" size="16"></u-icon>
                    </view>
                    <img style="margin-left: 15rpx" :src="item" />
                  </view>
                  <image
                    v-if="formData.fileList1.length < 3"
                    @click="chooseImage()"
                    src="@/static/member/upload.png"
                  ></image>
                </view>
              </view>
            </view>
          </u-form-item>
        </u--form>
        <u-action-sheet
          @select="sexSelect"
          :show="refundReason"
          :actions="actions"
          title="请选择退货原因"
          @close="refundReason = false"
        >
        </u-action-sheet>
      </view>
    </view>
    <view class="refund-footer">
      <view class="submit-btn">
        <u-button :disabled="disabledType" type="primary" color="#3B72FF" shape="circle" @click="submit">提交</u-button>
      </view>
    </view>
  </view>
</template>
<script>
import http from '@/api/account'
import { baseUrl } from '@/networking/config.js'
export default {
  data() {
    return {
      refundReason: false,
      actions: [
        {
          name: '拍错/不喜欢/效果不好'
        },
        {
          name: '与商品描述不符'
        },
        {
          name: '有瑕疵'
        },
        {
          name: '其他'
        }
      ],
      formData: {
        reason: '',
        fileList1: [],
        orderId: '',
        orderDetail: {}
      },
      disabledType: false,
      type: '',
      rules: {
        reason: {
          type: 'string',
          required: true,
          message: '请选择退款原因',
          trigger: ['blur', 'change']
        }
        // fileList1: {
        //   type: 'string',
        //   required: true,
        //   message: '请上传凭证',
        //   trigger: ['blur', 'change']
        // }
      }
    }
  },
  // type 1是退款 2退货
  onLoad: function (option) {
    this.formData.orderId = option.orderId
    this.type = Number(option.type)
  },
  onShow() {
    this.init()
  },
  methods: {
    // 页面初始化数据
    async init() {
      const res = await http.MiniOrderInquiry({
        orderId: this.formData.orderId
      })
      if (res.status.success) {
        this.formData.orderDetail = res.body
      }
    },
    // 退款原因
    sexSelect(e) {
      this.formData.reason = e.name
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
    chooseImage(type, fileLength) {
      const that = this
      that.uploadType = type
      uni.chooseImage({
        count: fileLength,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          // 判断图片格式
          const tempStr = res.tempFilePaths[0].split('.')
          const lowerStr = tempStr[1].toLowerCase()
          if (lowerStr !== 'png' && lowerStr !== 'jpg' && lowerStr !== 'jpeg') {
            uni.showToast({
              title: '请上传PNG、JPG、JPEG格式的图片',
              icon: 'none',
              duration: 3000
            })
            return
          }
          if (res.tempFiles[0]['size'] > 20 * 1024 * 1024) {
            uni.showToast({
              title: '图片大小不能超过20M',
              icon: 'none',
              duration: 3000
            })
            return
          }
          uni.showLoading({
            title: '上传中...'
          })

          that.disabledType = true
          if (res.tempFiles[0]['size'] < 5 * 1024 * 1024) {
            // 图片小于5M不压缩，大于5M压缩
            that.uploadImgFile(res.tempFilePaths, that)
          } else {
            uni.compressImage({
              src: res.tempFilePaths[0],
              quality: 80,
              success: (res) => {
                console.log(res, '=========res')
                that.uploadImgFile(res.tempFilePath, that)
              }
            })
          }
        }
      })
    },
    uploadImgFile(filePath, that) {
      for (var i = 0; i < filePath.length; i++) {
        uni.uploadFile({
          url: baseUrl + 'cos/v1/FileUpload',
          filePath: filePath[i],
          name: 'file',
          formData: {
            channel: 'cps',
            fileName: Date.now() + '.png'
          },
          success: (response) => {
            that.disabledType = false
            const res = JSON.parse(response.data)
            that.formData.fileList1.push(res.body.fileUrl)
            uni.hideLoading()
          },
          fail: () => {
            uni.hideLoading()
          }
        })
      }
    },
    // 删除图片
    handlerImage(index, type) {
      this.formData.fileList1.splice(index, 1)
    },
    submit() {
      this.$refs.formData
        .validate()
        .then((res) => {
          const params = {
            certImages: this.formData.fileList1,
            miniUserId: uni.getStorageSync('userId'),
            orderId: this.formData.orderId,
            reason: this.formData.reason,
            supportCategory: this.type
          }
          http.MiniSupportSubmit(params).then((res) => {
            uni.showToast({
              title: '提交售后成功',
              duration: 2000
            })
            uni.navigateTo({
              url: '/pages/account/after-sale/after-sale'
            })
          })
        })
        .catch((errors) => {
          // uni.$u.toast('校验失败')
        })
    }
  },
  mounted() {}
}
</script>
<style lang="scss" scoped>
#template {
  margin: 26rpx 32rpx;
}

.refund-header {
  height: 93rpx;
  width: 99%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  border-bottom: 2rpx solid #f6f6f6;
}

.refund-header text:nth-of-type(1) {
  font-size: 28rpx;
  font-weight: 500;
  color: #1a2234;
}

.refund-header text:nth-of-type(2) {
  font-size: 28rpx;
  font-weight: 400;
  color: #606a78;
}

.refund-content-imgbox {
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
.item-num {
  font-size: 28rpx;
  color: #606a78;
  line-height: 48rpx;
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

.item-card-remark {
  font-size: 28rpx;
  color: #606a78;
  line-height: 48rpx;
}
::v-deep {
  .u-upload__wrap__preview {
    margin-left: 20rpx !important;
  }
}
.imgs-box {
  margin-top: 20rpx;
  image {
    width: 190rpx;
    height: 180rpx;
  }
}
.item-image {
  margin-left: 20rpx;
  position: relative;
  .del-icon {
    width: 30rpx;
    height: 30rpx;
    position: absolute;
    top: 1rpx;
    right: 0;
  }
}
</style>
