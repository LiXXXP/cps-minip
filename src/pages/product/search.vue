<template>
  <view class="productList">
    <view class="search">
      <view class="input">
        <image src="@/static/index/search2.png"></image>
        <u--input
          placeholder="请输入17位车架号/VIN码查询"
          border="none"
          v-model="vin"
          maxlength="17"
          @confirm="search"
          @blur="search"
        ></u--input>
      </view>
      <view class="scanCode" @click="goPage('/pages/index/camera')">
        <image src="@/static/index/scanCode.png"></image>
      </view>
    </view>
    <view class="history">
      <text>历史记录</text>
      <view @click="del">
        清空
        <image src="@/static/index/del.png"></image>
      </view>
    </view>
    <view class="searchList">
      <view class="list" v-for="(item, index) of searchList" :key="item.vin" @click="toSearch(item.vin)">
        <template v-if="index < 11">
          {{ item.carInfo }}
        </template>
      </view>
    </view>
  </view>
</template>

<script>
import http from '@/api/product'
export default {
  data() {
    return {
      allShow: false,
      searchList: [],
      option: '',
      vin: ''
    }
  },
  onLoad(option) {
    this.option = option
    // 获取本地搜索词
    this.getSearch()
  },
  methods: {
    toSearch(vin) {
      this.goPage('/pages/product/index?vin=' + vin, true, 'redirectTo')
    },
    del() {
      this.searchList = []
      uni.setStorageSync('searchList', [])
    },
    getSearch() {
      this.searchList = uni.getStorageSync('searchList')
    },

    // 搜索
    search() {
      if (this.vin.length !== 17) {
        this.msg('请输入正确的17位车架号/VIN码')
        return
      }
      this.goPage('/pages/product/index?type=search&vin=' + this.vin, true, 'redirectTo')
    }
  }
}
</script>

<style lang="scss" scoped>
.productList {
  background: #f8faff;
  position: fixed;
  width: 100%;
  height: 100%;
  .searchList {
    background: #f7faff;
    overflow-y: scroll;
    width: 100%;
    height: 100%;
    padding-bottom: 60rpx;
    .list {
      width: 686rpx;
      background: #ffffff;
      display: flex;
      align-items: center;
      padding: 16rpx 24rpx;
      margin: 0 auto 24rpx;
    }
  }
  .history {
    background: #f7faff;
    display: flex;
    justify-content: space-between;
    padding: 32rpx;
    text {
      font-size: 28rpx;
      font-weight: 500;
      color: #102a43;
    }
    > view {
      display: flex;
      align-items: center;
      color: #606a78;
      font-size: 28rpx;
      font-weight: 400;
      image {
        width: 24rpx;
        height: 28rpx;
        margin-left: 10rpx;
      }
    }
  }

  .search {
    display: flex;
    justify-content: space-between;
    padding: 20rpx 32rpx 0 32rpx;
    .input {
      width: 586rpx;
      height: 80rpx;
      background: #f7f8fa;
      border-radius: 16rpx;
      border: 2rpx solid #dddfe5;
      display: flex;
      justify-content: center;
      align-items: center;
      > image {
        width: 40rpx;
        height: 40rpx;
        margin: 0 16rpx 0 28rpx;
      }
    }
    .scanCode {
      width: 80rpx;
      height: 80rpx;
      background: #f7f8fa;
      border-radius: 16rpx;
      border: 2rpx solid #dddfe5;
      display: flex;
      justify-content: center;
      align-items: center;
      image {
        width: 40rpx;
        height: 40rpx;
      }
    }
  }
}
</style>
