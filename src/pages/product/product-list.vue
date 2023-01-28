<template>
  <view class="productList">
    <!-- 排序 -->
    <view class="sort" v-if="false">
      <view v-for="(item, index) in sortList" :key="index">
        <text :class="!item.current || 'sel'">
          {{ item.name }}
        </text>
        <image :src="!item.current ? '../../static/index/sort.png' : '../../static/index/sortSel.png'"></image>
      </view>
    </view>
    <!-- 商品分类 -->
    <template v-if="listData.length > 0">
      <view
        class="cartList"
        @click="goPage('/pages/product/detail?id=' + item.id + '&carInfo=' + option.carInfo + '&vin=' + option.vin)"
        v-for="(item, index) of listData"
        :key="index"
      >
        <image :src="item.iconUri"> </image>
        <view class="cartListItem">
          <view>{{ item.name }}</view>
          <view>{{ item.brand }}</view>
          <text><text>¥</text> {{ item.discount7Price || '暂无价格' }}</text>
        </view>
      </view>
    </template>
    <!-- 无数据 -->
    <gwin-error v-if="listData != null && listData.length == 0"></gwin-error>
    <!-- 客服 -->
    <gwin-feedback></gwin-feedback>
  </view>
</template>

<script>
import http from '@/api/product'
export default {
  data() {
    return {
      upOption: {
        page: {
          num: 0,
          size: 10
        },
        noMoreSize: 4
      },
      listData: null,
      sortList: [
        { name: '综合', type: 1, current: true },
        { name: '销量', type: 2, current: false },
        { name: '价格', type: 3, current: false }
      ],
      option: '',
      detailData: '',
      shoppingCart: []
    }
  },
  onLoad(option) {
    this.option = option
    // 获取列表
    this.getList()
  },
  methods: {
    async getList() {
      const res = await http.AutoPartsListInquiry({
        categoryId: this.option.categoryId,
        oeNo: this.option.oeNo,
        manufactor: this.option.manufactor,
        vin: this.option.vin
      })
      if (res.status.success) {
        if (res.body.dataList) {
          this.listData = res.body.dataList
        } else {
          this.listData = []
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.productList {
  .cartList {
    display: flex;
    padding: 32rpx;
    border-bottom: 1px solid #f5f5f5;
    position: relative;
    > image {
      width: 176rpx;
      height: 176rpx;
      border-radius: 8rpx;
    }
    .cartListItem {
      flex: 1;
      padding: 0 20rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      > view:nth-child(1) {
        font-size: 32rpx;
        font-weight: 600;
        color: #1a2234;
      }
      > view:nth-child(2) {
        font-size: 28rpx;
        font-weight: 400;
        color: #606a78;
      }
      > text {
        font-size: 40rpx;
        font-weight: 900;
        color: #3b72ff;
        text {
          font-size: 28rpx;
          font-weight: 400;
          color: #3b72ff;
          margin-right: 10rpx;
        }
      }
      image {
        width: 64rpx;
        height: 64rpx;
        position: absolute;
        right: 32rpx;
        top: 90rpx;
      }
    }
  }
  .sort {
    display: flex;
    justify-content: space-between;
    width: 100%;
    border-top: 1rpx solid #e4e5e6;
    border-bottom: 1rpx solid #e4e5e6;
    padding: 20rpx 80rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: #606a78;
    .sel {
      color: #3b72ff;
      font-weight: bold;
    }
    > view {
      display: flex;
      align-items: center;
      image {
        width: 16rpx;
        height: 20rpx;
        margin-left: 6rpx;
      }
    }
  }
}
</style>
