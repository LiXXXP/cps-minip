<template>
  <!-- 地址详情 -->
  <view id="address-form">
    <view class="form">
      <u--form labelPosition="left" :model="corporateForm" :rules="rules" ref="form1" labelWidth="120">
        <u-form-item label="收货人" prop="name" borderBottom>
          <u--input maxlength="10" v-model="corporateForm.name" border="none" placeholder="请输入收货人"></u--input>
        </u-form-item>
        <u-form-item label="手机号码" prop="phone" borderBottom>
          <u--input v-model="corporateForm.phone" border="none" placeholder="请输入联系方式"></u--input>
        </u-form-item>
        <u-form-item label="所在地区" @click="adressShow = true" prop="regionCn" borderBottom>
          <picker-address @change="change">
            <text
              style="font-size: 30rpx"
              :style="{ color: corporateForm.regionCn === '省市区县、乡镇等' ? defualtColor : activeColor }"
              >{{ corporateForm.regionCn }}</text
            >
          </picker-address>
          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>
        <u-form-item label="详细地址" prop="address" borderBottom>
          <u--input
            maxlength="50"
            v-model="corporateForm.address"
            border="none"
            placeholder="请输入详细地址"
          ></u--input>
        </u-form-item>
      </u--form>
    </view>
    <u-gap height="16rpx" bgColor="#F8F8F8"></u-gap>
    <view class="default-switch">
      <u-cell-group>
        <u-cell size="large" title="设置默认地址" value="内容" label="提醒：每次下单会默认推荐该地址">
          <view slot="value" class="u-slot-value">
            <u-switch v-model="corporateForm.defaulted" @change="switchChange"></u-switch>
          </view>
        </u-cell>
      </u-cell-group>
    </view>
    <view class="pim-footer">
      <view class="submit-btn">
        <u-button type="primary" color="#3B72FF" shape="circle" @click="submit">保存</u-button>
      </view>
    </view>
  </view>
</template>
<script>
import pickerAddress from '../corporate-profile/pickerAddress.vue'
import http from '@/api/account'
export default {
  data() {
    return {
      adressShow: false,
      corporateForm: {
        address: '',
        name: '',
        phone: '',
        regionCn: '省市区县、乡镇等',
        defaulted: false,
        userId: ''
      },
      submitType: '',
      defualtColor: '#B1B6BB',
      activeColor: '#303133',
      rules: {
        name: {
          type: 'string',
          required: true,
          message: '请填写姓名',
          trigger: ['blur', 'change']
        }
      }
    }
  },
  components: {
    pickerAddress
  },
  onLoad: function (option) {
    if (option.type === 'update') {
      const data = JSON.parse(option.params)
      this.corporateForm = data
    }
    this.submitType = option.type
    this.corporateForm.userId = uni.getStorageSync('userId')
  },
  methods: {
    change(data) {
      this.corporateForm.regionCn = data.data.join(' ')
    },
    switchChange(e) {
      console.log(e)
    },
    submit() {
      if (!/^1[3456789]\d{9}$/.test(this.corporateForm.phone)) {
        uni.$u.toast('手机号格式错误')
        return
      } else if (this.submitType === 'add') {
        http.DeliveryAddressAddition(this.corporateForm).then((res) => {
          this.goNavigateBack()
        })
      } else {
        http.DeliveryAddressMaintenance(this.corporateForm).then((res) => {
          this.goNavigateBack()
        })
      }
    },
    // 返回列表页
    goNavigateBack() {
      uni.$u.toast('保存成功')
      setTimeout(() => {
        uni.navigateBack({ delta: 1 })
      }, 1000)
    }
  },
  mounted() {}
}
</script>
<style lang="scss" scoped>
.form {
  padding: 0 30rpx;
}
::v-deep {
  .u-form-item__body {
    min-height: 105rpx !important;
  }
  .u-line {
    border-color: #f6f6f6 !important;
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
.default-switch {
}
</style>
