<template>
  <view class="productList">
    <view class="search">
      <view class="input" @click="search">
        <image src="@/static/index/search2.png"></image>
        <u--input placeholder="请输入17位车架号/VIN码查询" border="none" v-model="vin" disabled></u--input>
      </view>
      <view class="scanCode" @click="goPage('/pages/index/camera')">
        <image src="@/static/index/scanCode.png"></image>
      </view>
    </view>
    <view class="information" v-if="vimData">{{ vimData.carInfo }}</view>
    <view class="listBg" v-if="vimData">
      <!-- 一级分类 -->
      <u-tabs
        :list="vimData.categoryFirstList"
        activeStyle="font-size: 38rpx;font-weight: 900;color: #131313;"
        inactiveStyle="color: #606A78;font-weight: 400;"
        lineWidth="0"
        lineHeight="0"
        keyName="categoryFirstName"
        :current="current"
        @click="getCategorySecondList"
      >
        <view slot="right" class="allRight" @click="allShow = !allShow">
          <image class="allImg" src="@/static/index/all.png"></image>
        </view>
      </u-tabs>
      <!-- 弹窗 -->
      <view class="tabsBg" v-if="allShow">
        <text
          v-for="(item, index) of vimData.categoryFirstList"
          :key="index"
          @click=";(currentText = item), (this.leftIndex = ''), (allShow = false), (current = index), this.getList()"
          >{{ item.categoryFirstName }}</text
        >
      </view>
      <view class="rgb" v-if="allShow" @click="allShow = false"></view>
      <!-- 列表 -->
      <view class="product">
        <!-- 左侧 -->
        <view class="list" v-if="vimData.categorySecondList">
          <scroll-view scroll-y="true">
            <text
              class="item"
              :class="leftIndex.id == item.id ? 'sel' : ''"
              v-for="(item, index) of vimData.categorySecondList"
              :key="index"
              @click=";(leftIndex = item), this.getList()"
            >
              <text>{{ item.categorySecondName }}</text>
            </text>
          </scroll-view>
        </view>
        <!-- 右侧 -->
        <view class="listImgBg">
          <view class="listTitle" v-if="leftIndex.categorySecondName">
            <text>{{ leftIndex.categorySecondName }}</text>
          </view>
          <view class="listImg">
            <view
              class="item"
              @click="
                goPage(
                  `/pages/product/product-list?oeNo=${item.oeNo}&categoryId=${vimData.categorySecondList[0].id}&manufactor=${vimData.manufactor}&carInfo=${vimData.carInfo}&vin=${vin}`
                )
              "
              v-for="(item, index) of vimData.oeList"
              :key="index"
            >
              <text>{{ item.name }}</text>
            </view>

            <!-- 无数据 -->
            <view class="empty" v-if="vimData.oeList.length == 0 || vimData.oeList === null">
              <image src="../../static/empty/car.png"></image>
              <text>汽车配件正在调拨中，请稍后...</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 无数据 -->
    <gwin-error v-if="vimData == null"></gwin-error>
    <!-- 客服 -->
    <gwin-feedback></gwin-feedback>
  </view>
</template>

<script>
import http from '@/api/product'
export default {
  data() {
    return {
      allShow: false,
      option: '',
      vin: '',
      vimData: '',
      current: 0,
      currentText: '',
      leftIndex: ''
    }
  },
  onLoad(option) {
    this.vin = option.vin
    this.option = option
    // 获取列表
    this.getList()
  },
  methods: {
    // tab菜单选择
    async getCategorySecondList(index) {
      this.currentText = index
      this.leftIndex = ''
      await this.getList()
    },
    setSearch() {
      const searchList = uni.getStorageSync('searchList')
      const list = {
        manufactor: this.vimData.manufactor,
        vin: this.vin,
        carInfo: this.vimData.carInfo
      }
      if (searchList) {
        searchList.forEach((item, index) => {
          if (item.manufactor === this.vimData.manufactor) {
            searchList.splice(index, 1)
          }
        })
        searchList.unshift(list)
        uni.setStorageSync('searchList', searchList)
      } else {
        uni.setStorageSync('searchList', [list])
      }
    },
    // 搜索
    search() {
      this.goPage('/pages/product/search', true, 'redirectTo')
    },
    // 获取列表
    async getList() {
      uni.showLoading({
        title: '正在分析配件...'
      })
      const res = await http.VINInquiry({
        vin: this.vin,
        categoryFirstId: this.currentText?.categoryFirstId,
        categorySecondId: this.leftIndex?.categorySecondId,
        manufactor: this.vimData?.manufactor,
        parameters: this.vimData?.parameters,
        type: this.vimData?.type
      })
      uni.hideLoading()
      if (res.status.success) {
        if (this.vimData === '') {
          this.vimData = res.body
        } else {
          if (res.body.categoryFirstList !== null) {
            this.vimData.categoryFirstList = res.body.categoryFirstList
          }
          if (res.body.categorySecondList !== null) {
            this.vimData.categorySecondList = res.body.categorySecondList
          }
          this.vimData.oeList = res.body.oeList
        }

        // 如果搜索进来 进入搜索词
        if (res.body.categoryFirstList && this.option.type === 'search') {
          this.setSearch()
        }
        // 初始化赋值tab第一个菜单
        if (this.currentText === '') {
          this.currentText = res.body.categoryFirstList[0]
        }

        // 初始化二级分类选中
        if (this.leftIndex === '') {
          this.leftIndex = this.vimData.categorySecondList[0]
        }
      } else {
        this.vimData = null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.productList {
  background: #f8faff;
  position: fixed;
  width: 100%;
  .empty {
    z-index: 1;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 28rpx;
    font-weight: 400;
    color: #606a78;
    background: #fff;
    top: 0;

    > image {
      margin-bottom: 40rpx;
      width: 100rpx;
      height: 100rpx;
    }
  }
  .sku {
    width: 750px;
    height: 542px;
    background: #ffffff;
    border-radius: 20px 20px 0px 0px;
  }
  .rgb {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    z-index: 90;
  }
  .product {
    display: flex;
    background: #f8faff;
    .listImgBg {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 0 32rpx;
      .listTitle {
        width: 100%;
        background: #eff4fd;
        border-radius: 0rpx 16rpx 16rpx 16rpx;
        border: 4rpx solid #ffffff;
        font-size: 24rpx;
        font-weight: 400;
        color: #606a78;
        padding: 20rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        /*! autoprefixer: off */
        -webkit-box-orient: vertical;
        /*autoprefixer: on */
        margin-bottom: 20rpx;
      }
    }
    .listImg {
      overflow-y: scroll;
      height: calc(100vh - 420rpx);
      .item {
        display: flex;
        padding: 20rpx;
        font-size: 28rpx;
        font-weight: 400;
        color: #1a2234;
        width: 476rpx;
        min-height: 80rpx;
        background: #ffffff;
        margin-bottom: 20rpx;
      }
    }
    .list {
      width: 220rpx;
      height: 73vh;
      display: flex;
      flex-direction: column;
      overflow-y: scroll;
      background: #eff4fd;
      .sel {
        background: #ffffff !important;
        font-size: 32rpx !important;
        font-weight: 600 !important;
        color: #3b72ff !important;
      }
      .item {
        display: inline-block;
        width: 220rpx;
        box-sizing: border-box;
        background: #eff4fd;
        font-size: 24rpx;
        font-weight: 400;
        color: #606a78;
        margin-right: 30rpx;
        height: 100rpx;
        display: flex;
        align-items: center;
        border-bottom: 1rpx solid #f5f5f5;
        text {
          display: inline-block;
          margin: 0 auto 0 20rpx;
          word-break: break-all;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      }
    }
  }

  .listBg {
    background: #f8faff;
    ::v-deep .u-tabs {
      margin: 15rpx 0;
    }
    .tabsBg {
      position: relative;
      top: -27rpx;
      width: 100%;
      background: #ffffff;
      z-index: 100;
      padding: 32rpx;
      height: auto;
      overflow-y: scroll;
      text {
        padding: 8rpx 28rpx;
        display: inline-block;
        background: #3b72ff;
        border-radius: 25rpx;
        font-size: 24rpx;
        font-weight: 400;
        color: #ffffff;
        margin-right: 20rpx;
        margin-bottom: 20rpx;
      }
    }
    .allRight {
      width: 80rpx;
      height: 80rpx;
      background: #ffffff;
      box-shadow: 8rpx 0rpx 40rpx 0rpx rgba(221, 221, 221, 0.8);
      border-radius: 16rpx 0rpx 0rpx 0rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      .allImg {
        width: 40rpx;
        height: 40rpx;
      }
    }
  }

  .information {
    font-size: 32rpx;
    color: #fff;
    background: url('@/static/index/productBg.png') no-repeat;
    background-size: 100% 100%;
    height: 88rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: #ffffff;
    padding: 0 40rpx;
    display: flex;
    align-items: center;
  }
  .search {
    display: flex;
    justify-content: space-between;
    padding: 20rpx 32rpx;
    .input {
      width: 586rpx;
      height: 80rpx;
      background: #f7f8fa;
      border-radius: 16rpx;
      border: 2rpx solid #dddfe5;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 999;
      > image {
        width: 40rpx;
        height: 40rpx;
        margin: 0 16rpx 0 28rpx;
      }
    }
    .scanCode {
      z-index: 999;
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

  ::v-deep .u-tabs__wrapper__nav__item {
    z-index: 5;
  }
}
</style>
