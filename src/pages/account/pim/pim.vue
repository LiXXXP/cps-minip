<template>
  <!-- 个人信息页 -->
  <view id="template">
    <view class="pim-header">
      <u-cell-group>
        <u-cell size="large" @click="chooseImage" title="头像">
          <u--image
            slot="value"
            class="u-slot-value"
            width="60px"
            height="60px"
            :src="userInfo.avatarUrl"
            shape="circle"
            errorIcon=""
          ></u--image>
        </u-cell>
      </u-cell-group>
    </view>
    <view class="pim-content">
      <view>
        <u-gap height="1" bgColor="#F8F8F8"></u-gap>
      </view>
      <view class="pim-form">
        <u--form labelPosition="left" :model="userInfo" ref="form1">
          <u-form-item label="昵称" prop="nickname" borderBottom>
            <u--input
              inputAlign="right"
              v-model="userInfo.nickname"
              border="none"
              placeholder="请输入昵称"
              maxlength="15"
            ></u--input>
          </u-form-item>
          <u-form-item label="姓名" prop="userName" borderBottom>
            <u--input
              inputAlign="right"
              v-model="userInfo.userName"
              border="none"
              placeholder="请输入姓名"
              maxlength="15"
            ></u--input>
          </u-form-item>
          <u-form-item label="性别" prop="gender" borderBottom @click="showSex = true">
            <u--input
              inputAlign="right"
              v-model="userInfo.gender"
              disabled
              disabledColor="#ffffff"
              placeholder="请选择性别"
              border="none"
            ></u--input>
            <u-icon slot="right" name="arrow-right"></u-icon>
          </u-form-item>
          <u-form-item labelWidth="80" label="出生日期" prop="birthday" borderBottom @click="dateOfBirthShow = true">
            <u--input
              inputAlign="right"
              v-model="userInfo.birthday"
              disabled
              disabledColor="#ffffff"
              placeholder="请选择"
              border="none"
            ></u--input>
            <u-icon slot="right" name="arrow-right"></u-icon>
          </u-form-item>
          <u-form-item labelWidth="80" label="手机号码" prop="mobile">
            <u--input inputAlign="right" v-model="userInfo.mobile" border="none" disabled></u--input>
          </u-form-item>
        </u--form>

        <u-action-sheet
          :show="showSex"
          :actions="actions"
          title="请选择性别"
          @close="showSex = false"
          @select="sexSelect"
        >
        </u-action-sheet>
        <view v-if="defaultTime">
          <u-datetime-picker
            :show="dateOfBirthShow"
            :minDate="315504000000"
            mode="date"
            v-model="defaultTime"
            @confirm="dateConfirm"
            @cancel="dateOfBirthShow = false"
          ></u-datetime-picker>
        </view>
      </view>
    </view>
    <view class="pim-footer">
      <view class="submit-btn">
        <u-button :disabled="disabledType" type="primary" color="#3B72FF" shape="circle" @click="submit">保存</u-button>
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
      showSex: false,
      dateOfBirthShow: false,
      defaultTime: '',
      userInfo: {
        avatarUrl: '',
        birthday: '',
        gender: '男',
        mobile: '',
        userName: '',
        nickname: '',
        id: uni.getStorageSync('userId')
      },
      disabledType: false,
      actions: [
        {
          name: '男'
        },
        {
          name: '女'
        }
      ],
      rules: {
        nickname: [
          {
            type: 'string',
            required: true,
            message: '请输入昵称',
            trigger: ['blur', 'change']
          }
        ],
        userName: [
          {
            type: 'string',
            required: true,
            message: '请输入姓名',
            trigger: ['blur', 'change']
          }
        ],
        gender: [
          {
            type: 'string',
            max: 1,
            required: true,
            message: '请选择男或女',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  onReady() {
    this.$refs.form1.setRules(this.rules)
  },
  created() {
    this.init()
  },
  methods: {
    // 初始化
    async init() {
      const params = {
        id: uni.getStorageSync('userId')
      }
      const res = await http.UserInquiry(params)
      if (res.status.success) {
        this.userInfo = res.body
        if (this.userInfo.gender === 1) {
          this.userInfo.gender = '男'
        } else if (this.userInfo.gender === 2) {
          this.userInfo.gender = '女'
        }
        // 转换时间格式
        if (this.userInfo.birthday) {
          const obj = {
            value: res.body.birthday
          }
          // inpu展示时间格式
          this.dateConfirm(obj)
          // 默认时间赋值
          this.defaultTime = Number(new Date(this.userInfo.birthday))
        } else {
          const obj = {
            value: Number(new Date())
          }
          // inpu展示时间格式
          this.dateConfirm(obj)
          this.defaultTime = Number(new Date())
        }
      }
    },
    chooseImage() {
      const that = this
      uni.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          uni.showLoading({
            title: '上传中...'
          })
          that.disabledType = true
          that.uploadImgFile(res.tempFilePaths[0], that)
        }
      })
    },
    uploadImgFile(filePath, that) {
      uni.uploadFile({
        url: baseUrl + 'cos/v1/FileUpload',
        filePath: filePath,
        name: 'file',
        formData: {
          channel: 'cps',
          fileName: Date.now() + '.png'
        },
        success: (response) => {
          that.disabledType = false
          const res = JSON.parse(response.data)
          that.userInfo.avatarUrl = res.body.fileUrl
          uni.hideLoading()
        },
        fail: () => {
          uni.hideLoading()
        }
      })
    },
    // 性别选择
    sexSelect(e) {
      this.userInfo.gender = e.name
    },
    submit() {
      this.$refs.form1
        .validate()
        .then((res) => {
          const params = {
            avatarUrl: this.userInfo.avatarUrl,
            birthday: new Date(this.userInfo.birthday).getTime(),
            gender: this.userInfo.gender === '男' ? '1' : '2',
            id: this.userInfo.id,
            mobile: this.userInfo.mobile,
            nickname: this.userInfo.nickname,
            userName: this.userInfo.userName
          }
          http.UserMaintenance(params).then((res) => {
            uni.$u.toast('保存成功')
            setTimeout(() => {
              const pages = getCurrentPages()
              const beforePage = pages[pages.length - 2]
              beforePage.data.refreshIfNeeded = true
              uni.navigateBack({ delta: 1 })
            }, 1000)
          })
        })
        .catch((errors) => {
          uni.$u.toast('请填写必填项')
        })
    },
    // 出生日期选择
    dateConfirm(obj) {
      this.userInfo.birthday = this.dataConfirm(obj.value, 1)
      this.dateOfBirthShow = false
    }
  }
}
</script>
<style lang="scss" scoped>
.pim-form {
  margin: 30rpx;
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
::v-deep {
  .u-input__content__field-wrapper {
    background: #ffffff !important;
  }
  .u-form-item__body {
    margin: 20rpx 0 !important;
  }
  .u-line {
    border-color: #f6f6f6 !important;
  }
  .u-form-item__body__left__content__label {
    font-size: 28rpx !important;
  }
  .u-input__content__field-wrapper__field {
    font-size: 28rpx !important;
  }
}
</style>
