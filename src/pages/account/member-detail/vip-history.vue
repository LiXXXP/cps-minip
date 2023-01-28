<template>
  <view id="template">
    <mescroll-body
      ref="mescrollRef"
      class="mescroll"
      :up="upOption"
      @init="mescrollInit"
      @down="downCallback"
      @up="upCallback"
    >
      <view v-for="(item, index) in dataList" :key="index" class="content-item">
        <view class="conten-item-header flex row-between col-center">
          <text>{{ item.memberName }}</text>
          <text :style="{ color: item.valid ? '#3b72ff' : '#B1B6BB' }">{{ validView(item.valid) }}</text>
        </view>
        <view class="conten-item-information flex row-between col-center">
          <view>
            <image src="@/static/member/vipImage.png" mode=""></image>
          </view>
          <view class="conten-item-information_right">
            <view
              ><text class="time"
                >有效期：{{ dataConfirm(item.startTime, 1) }}~{{ dataConfirm(item.endTime, 1) }}</text
              ></view
            >
            <view
              ><text class="time">购买时间：{{ dataConfirm(item.openTime, 1) }}</text></view
            >
            <view
              ><text class="money">¥ {{ item.price }}</text></view
            >
          </view>
        </view>
      </view>
    </mescroll-body>
  </view>
</template>
<script>
import http from '@/api/account'
export default {
  data() {
    return {
      status: 1,
      upOption: {
        page: {
          num: 0,
          size: 10
        },
        noMoreSize: 5,
        textNoMore: '已加载全部~'
      },
      dataList: []
    }
  },
  methods: {
    // 获取历史记录列表
    async upCallback(page) {
      const res = await http.MiniMemberOrderListInquiry({
        page: {
          pageNum: page.num,
          pageSize: page.size,
          returnCount: true
        },
        miniUserId: uni.getStorageSync('userId')
      })
      if (res.status.success) {
        const curPageLen = res.body.dataList.length
        const totalSize = res.body.page.count
        if (page.num === 1) this.dataList = [] // 如果是第一页需手动置空列表1
        this.dataList = this.dataList.concat(res.body.dataList) // 追加新数据
        this.mescroll.endBySize(curPageLen, totalSize)
      }
      ;() => {
        //  请求失败,隐藏加载状态
        this.mescroll.endErr()
      }
    },
    validView(val) {
      let str = ''
      if (val) {
        str = '生效中'
      } else {
        str = '已到期'
      }
      return str
    }
  }
}
</script>
<style lang="scss" scoped>
.template {
  background: #f8f8f8;
}
.content-item {
  height: 320rpx;
  margin: 24rpx 32rpx;
  background: #ffffff;
  .conten-item-header {
    height: 88rpx;
    border-bottom: 1rpx solid #f6f6f6;
    text:nth-of-type(1) {
      font-size: 28rpx;
      font-weight: 500;
      color: #1a2234;
    }
    text:nth-of-type(2) {
      font-size: 28rpx;
      font-weight: 400;
    }
  }
}
.conten-item-information {
  margin-top: 24rpx;
  image {
    width: 184rpx;
    height: 184rpx;
  }
  .conten-item-information_right {
    flex: 1;
    text-align: left;
    padding-left: 20rpx;
    text {
      display: block;
    }
  }
  .time {
    font-size: 28rpx;
    font-weight: 400;
    color: #606a78;
    margin-top: 8rpx;
  }
  .money {
    font-size: 32rpx;
    font-weight: 400;
    color: #1a2234;
    margin-top: 24rpx;
  }
}
</style>
