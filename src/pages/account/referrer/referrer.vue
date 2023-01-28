<template>
  <!-- 推荐人页面 -->
  <view id="template">
    <view class="referrer-header">
      <u--form labelPosition="left" :model="form" ref="form">
        <u-form-item labelWidth="100" label="推荐人手机号" prop="referrerPhone">
          <u--input
            :disabled="!btnShow"
            inputAlign="right"
            v-model="form.referrerPhone"
            border="none"
            placeholder="请输入手机号码"
          ></u--input>
        </u-form-item>
      </u--form>
    </view>
    <!-- 做判断referrerPhone初始化是否右值 -->
    <view v-if="btnShow" class="referrer-content">
      <text>保存后不支持修改，请谨慎操作</text>
    </view>
    <view v-if="btnShow" class="referrer-footer">
      <view class="submit-btn">
        <u-button type="primary" color="#3B72FF" shape="circle" @click="submit">保存</u-button>
      </view>
    </view>
  </view>
</template>
<script>
import http from '@/api/account'
export default {
  data() {
    return {
      form: {
        referrerPhone: '',
        id: uni.getStorageSync('userId')
      },
      btnShow: false
    }
  },
  onLoad(options) {
    const status = options.referrerPhone
    if (status && status !== 'null') {
      this.btnShow = false
      this.form.referrerPhone = options.referrerPhone
    } else {
      this.btnShow = true
    }
  },
  methods: {
    submit() {
      if (this.form.referrerPhone === '') {
        uni.navigateBack({ delta: 1 })
        return
      } else if (!/^1[3456789]\d{9}$/.test(this.form.referrerPhone)) {
        uni.$u.toast('手机号格式错误')
      } else {
        http.MiniUserReferrerAddition(this.form).then((res) => {
          uni.$u.toast('保存成功')
          setTimeout(() => {
            uni.navigateBack({ delta: 1 })
          }, 1000)
        })
      }
    }
  },
  mounted() {}
}
</script>
<style lang="scss" scoped>
#template {
  background: #f8f8f8;
  height: 100vh;
}
.referrer-header {
  padding: 24rpx 32rpx;
  background: #ffffff;
}
.referrer-content {
  margin: 30rpx 32rpx;
  text {
    font-size: 24rpx;
    font-weight: 400;
    color: #b1b6bb;
  }
}
.submit-btn {
  margin: 28rpx 32rpx;
}
::v-deep {
  .u-input {
    background: #ffffff !important;
  }
}
.referrer-footer {
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
</style>
