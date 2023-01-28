<template>
  <!-- 企业信息 -->
  <view id="template">
    <view class="form">
      <u--form labelPosition="left" :model="corporateForm" ref="form1" labelWidth="120">
        <u-form-item label="单位名称" prop="subjectName" borderBottom>
          <u--input
            maxlength="50"
            v-model="corporateForm.subjectName"
            border="none"
            placeholder="请输入单位名称"
          ></u--input>
        </u-form-item>
        <u-form-item label="联系人姓名" prop="contactName" borderBottom>
          <u--input
            maxlength="50"
            v-model="corporateForm.contactName"
            border="none"
            placeholder="请输入联系人姓名"
          ></u--input>
        </u-form-item>
        <u-form-item label="联系方式" prop="contactPhone" borderBottom>
          <u--input v-model="corporateForm.contactPhone" border="none" placeholder="请输入联系方式"></u--input>
        </u-form-item>
        <u-form-item label="所在地区" prop="regionCn" borderBottom>
          <pickerAddress @change="change">
            <text
              style="font-size: 28rpx"
              :style="{ color: corporateForm.regionCn === '省市区县、乡镇等' ? defualtColor : activeColor }"
              >{{ corporateForm.regionCn }}</text
            >
          </pickerAddress>
        </u-form-item>
        <u-form-item label="详细地址" prop="address" borderBottom>
          <u--input
            maxlength="50"
            v-model="corporateForm.address"
            border="none"
            placeholder="请输入详细地址"
          ></u--input>
        </u-form-item>

        <u-gap height="16rpx" bgColor="#F8F8F8"></u-gap>
        <view class="form-upload">
          <view>
            <text>营业执照</text>
          </view>
          <view class="imgs-box flex row-left col-center" style="margin-top: 20rpx">
            <view v-for="(item, index) in corporateForm.licenseImages" :key="index" class="item-image">
              <view @click="handlerImage(index, 1)" class="del-icon">
                <u-icon name="close-circle" size="16"></u-icon>
              </view>
              <img style="margin-left: 15rpx" :src="item" />
            </view>
            <image
              v-if="corporateForm.licenseImages.length === 0 || corporateForm.licenseImages === null"
              :class="[disabledType ? 'onlyRead' : '']"
              style="margin-left: 15rpx"
              @click="chooseImage(1, 1)"
              src="@/static/member/upload.png"
            ></image>
          </view>
        </view>
        <u-gap height="16rpx" bgColor="#F8F8F8"></u-gap>
        <view class="form-upload">
          <view>
            <text>公司图片</text>
          </view>
          <view class="imgs-box flex row-left col-center" style="margin-top: 20rpx">
            <view v-for="(item, index) in corporateForm.companyImages" :key="index" class="item-image">
              <view @click="handlerImage(index, 2)" class="del-icon">
                <u-icon name="close-circle" size="16"></u-icon>
              </view>
              <img style="margin-left: 15rpx" :src="item" />
            </view>
            <image
              :class="[disabledType ? 'onlyRead' : '']"
              style="margin-left: 15rpx"
              v-if="corporateForm.companyImages.length < 3 || corporateForm.companyImages === null"
              @click="chooseImage(2, 3)"
              src="@/static/member/upload.png"
            ></image>
          </view>
        </view>
        <u-gap height="16rpx" bgColor="#F8F8F8"></u-gap>
      </u--form>
    </view>
    <view class="pim-footer">
      <view class="submit-btn">
        <u-button :disabled="disabledType" type="primary" color="#3B72FF" shape="circle" @click="submit">保存</u-button>
      </view>
    </view>
  </view>
</template>
<script>
import pickerAddress from './pickerAddress.vue'
import http from '@/api/account'
import { baseUrl } from '@/networking/config.js'
export default {
  data() {
    return {
      corporateForm: {
        address: '',
        regionCn: '省市区县、乡镇等',
        contactName: '',
        contactPhone: '',
        subjectName: '',
        companyImages: [],
        licenseImages: [],
        id: '',
        userId: ''
      },
      disabledType: false,
      defualtColor: '#B1B6BB',
      activeColor: '#000000',

      // 1是营业执照2是公司名称
      uploadType: Number
    }
  },
  components: {
    pickerAddress
  },
  created() {
    this.init()
  },
  methods: {
    // 初始化
    async init() {
      const params = {
        userId: uni.getStorageSync('userId')
      }
      const res = await http.EnterpriseInquiry(params)
      if (res.status.success) {
        this.corporateForm = res.body
        if (!res.body.regionCn) {
          this.corporateForm.regionCn = '省市区县、乡镇等'
        }
        if (!res.body.licenseImages) {
          this.corporateForm.licenseImages = []
        }
        if (!res.body.companyImages) {
          this.corporateForm.companyImages = []
        }
        this.corporateForm.userId = uni.getStorageSync('userId')
      }
    },
    // 省市区监听
    change(data) {
      this.corporateForm.regionCn = data.data.join(' ')
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
            console.log(res, '----res')
            if (that.uploadType === 1) {
              that.corporateForm.licenseImages.push(res.body.fileUrl)
            } else {
              that.corporateForm.companyImages.push(res.body.fileUrl)
            }
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
      if (type === 1) {
        this.corporateForm.licenseImages.splice(index, 1)
      } else {
        this.corporateForm.companyImages.splice(index, 1)
      }
    },
    submit() {
      if (!this.corporateForm.licenseImages.length) {
        this.corporateForm.licenseImages = null
      }
      if (!this.corporateForm.companyImages.length) {
        this.corporateForm.companyImages = null
      }
      // 有ID走update
      if (!/^1[3456789]\d{9}$/.test(this.corporateForm.contactPhone)) {
        uni.$u.toast('手机号格式错误')
        return
      } else if (this.corporateForm.id) {
        http.EnterpriseMaintenance(this.corporateForm).then((res) => {
          uni.$u.toast('保存成功')
          setTimeout(() => {
            uni.navigateBack({ delta: 1 })
          }, 1000)
        })
      } else {
        // 没有ID走新增接口
        http.EnterpriseAddition(this.corporateForm).then((res) => {
          uni.$u.toast('保存成功')
          setTimeout(() => {
            uni.navigateBack({ delta: 1 })
          }, 1000)
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.form {
  padding: 0 30rpx;
}
::v-deep {
  .u-form-item__body {
    border-bottom: none !important;
    margin: 20rpx 0 !important;
  }
  .u-form-item__body__left__content__label {
    font-size: 28rpx !important;
  }
  .u-input__content__field-wrapper__field {
    font-size: 28rpx !important;
  }
}
.form-upload {
  margin: 30rpx 0 30rpx;
}
.submit-btn {
  margin: 28rpx 32rpx;
}
.pim-footer {
  height: 164rpx;
  background: #ffffff;
  box-shadow: 0px -4px 12px 0px rgba(0, 0, 0, 0.06);
  border-radius: 0px 0px 20px 20px;
  backdrop-filter: blur(0px);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}
.imgs-box {
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
.onlyRead {
  pointer-events: none;
}
</style>
