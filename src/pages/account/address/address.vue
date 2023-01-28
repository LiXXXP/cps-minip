<template>
  <!-- 收货地址列表 -->
  <view id="address">
    <view v-if="dataList.length > 0">
      <view class="content">
        <view v-if="show">
          <u-swipe-action>
            <u-swipe-action-item
              v-for="(item, index) in dataList"
              :key="index"
              @click="handlerDel(item)"
              :autoClose="true"
              :options="options1"
            >
              <view class="swipe-action">
                <view class="swipe-action__content user-information flex row-between col-center">
                  <view @click="selectAddress(item)" class="user-information-left">
                    <view class="flex">
                      <text v-if="item.defaulted" class="user-information-left_icon">默认</text>
                      <text class="user-information-left-title">{{ item.regionCn }}</text>
                    </view>
                    <view class="adress-box">
                      <text class="user-information-left_adress">{{ item.address }}</text>
                    </view>
                    <view class="user-information-left_user flex">
                      <text>{{ item.name }}</text>
                      <text style="margin-left: 20rpx">{{ item.phone }}</text>
                    </view>
                  </view>
                  <view @click="goAdderssDetailOfAdd('update', item)" class="user-information-right">
                    <image src="@/static/member/update.png" mode=""></image>
                  </view>
                </view>
              </view>
            </u-swipe-action-item>
          </u-swipe-action>
        </view>
      </view>
      <view class="address-footer">
        <view class="submit-btn">
          <u-button type="primary" color="#3B72FF" shape="circle" @click="goAdderssDetailOfAdd('add')">
            新增收货地址</u-button
          >
        </view>
      </view>
    </view>
    <view v-else>
      <blank-view></blank-view>
    </view>
  </view>
</template>
<script>
import http from '@/api/account'
import blankView from './blank.vue'
export default {
  data() {
    return {
      dataList: [],
      options1: [
        {
          text: '删除',
          style: {
            backgroundColor: '#EE2437'
          }
        }
      ],
      show: true,
      selectAdress: '',
      option: ''
    }
  },
  components: {
    blankView
  },
  onLoad(option) {
    this.option = option
    if (option.pages) {
      this.selectAdress = option.pages
    }
  },
  onShow() {
    this.init()
  },
  methods: {
    // 初始化列表数据
    async init() {
      const res = await http.DestinationAddressListInquiry({
        userId: uni.getStorageSync('userId')
      })
      if (res.status.success) {
        this.dataList = res.body.dataList
      }
    },
    // 删除
    async handlerDel(item) {
      const res = await http.DeliveryAddressDeleting({
        id: item.id
      })
      if (res.status.success) {
        uni.$u.toast('删除成功')
        this.init()
        this.show = false
        setTimeout(() => {
          this.show = true
        }, 200)
      }
    },
    // 跳转新增修改页
    goAdderssDetailOfAdd(type, item) {
      // 修改收货地址详情
      let params = ''
      if (type === 'update') {
        params = JSON.stringify(item)
      }
      uni.navigateTo({
        url: '/pages/account/address/address-detail?params=' + params + '&type=' + type
      })
    },
    selectAddress(item) {
      // 从订单详情进入选择收货地址
      if (this.option.type === 'order') {
        const pages = getCurrentPages()
        const page = pages[pages.length - 2]
        page.$vm.setAddress(item)
        uni.navigateBack({
          delta: 1
        })
      } else {
        // 普通进入详情
        uni.setStorageSync('adress', item)
        if (this.selectAdress) {
          uni.navigateBack({
            delta: 1
          })
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
#address {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.content {
  flex: 1;
  overflow: auto;
  margin-bottom: 184rpx;
}
.user-information {
  padding: 25rpx 32rpx;
  border-bottom: 2rpx solid #f8f8f8;
}
.user-information-right {
  width: 50rpx;
  image {
    width: 40rpx;
    height: 40rpx;
  }
}
.user-information-left {
  flex: 1;
  text {
    display: block;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
  }
}
.user-information-left_icon {
  margin-right: 10rpx;
  font-size: 24rpx;
  color: #ffffff;
  line-height: 32rpx;
  background: #3b72ff;
  border-radius: 4rpx;
  padding: 3rpx 8rpx;
}
.user-information-left-title {
  font-size: 28rpx;
  font-weight: 400;
  color: #1a2234;
}
.user-information-left_adress {
  font-size: 36rpx;
  font-weight: bold;
  color: #1a2234;
}
.adress-box {
  margin-top: 15rpx;
}
.user-information-left_home {
  font-size: 34rpx;
  font-weight: bold;
  color: #1a2234;
}
.user-information-left_user {
  margin-top: 20rpx;
  text {
    font-size: 28rpx;
    font-weight: 400;
    color: #1a2234;
  }
}
.user-information-bottom_icon {
  image {
    width: 100%;
    height: 4rpx;
  }
}
.submit-btn {
  margin: 28rpx 32rpx;
}
.address-footer {
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
  .u-button__text {
    font-size: 28rpx !important;
    font-weight: 500 !important;
  }
}
</style>
