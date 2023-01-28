<template>
  <view>
    <view class="page-body">
      <view class="page-section page-section-gap">
        <map
          id="map"
          style="width: 100%; height: 100vh"
          :markers="markers"
          :polyline="polyline"
          @controltap="controltap"
          @updated="mapUpdate"
        >
        </map>
      </view>
    </view>
    <view class="icon-box">
      <image
        @click="handleIncludePoints"
        style="width: 60rpx; height: 60rpx"
        src="@/static/member/Icon-positioning.png"
        mode=""
      ></image>
    </view>
    <view class="logistics-information">
      <view class="logistics-information-header flex row-between col-center">
        <view>
          <text class="csctext">{{ logisticsInfo.expressCompany }} {{ expressNo }}</text></view
        >
        <view>
          <text @tap="copyText('431123456789')" style="margin-right: 24rpx" class="hanlder-text">复制 </text>
          <text style="color: #606a78"> | </text>
          <text @click="hanlderPhone(logisticsInfo.phone)" class="hanlder-text"> 打电话</text>
        </view>
      </view>
      <view class="steps">
        <u-steps dot :current="current" direction="column" inactiveColor="#EDEDED" activeColor="#3B72FF">
          <u-steps-item
            v-for="(item, index) in stepsList"
            :key="index"
            :title="item.title"
            :desc="item.desc"
            :error="item.error"
          >
          </u-steps-item>
        </u-steps>
      </view>
    </view>
  </view>
</template>
<script>
import http from '@/api/account.js'
export default {
  data() {
    return {
      stepsList: [],
      current: 0,
      map: {},
      // 设置开始结束或路程中间的icon图标以及弹窗说明
      markers: [],
      // 设置路线
      polyline: [],
      expressNo: '',
      orderId: '',
      status: '',
      logisticsInfo: {}
    }
  },
  onReady() {
    this.map = uni.createMapContext('map', this)
  },
  onLoad: function (option) {
    // console.log(option, '快递单号')
    this.expressNo = option.expressNo
    this.orderId = option.orderId
    this.status = option.status
    this.init()
  },
  methods: {
    async init() {
      const res = await http.LogisticsInquiry({ expressNo: this.expressNo, orderId: this.orderId })
      this.logisticsInfo = res.body
      this.stepsList[0] = {
        title: '[收货地址]' + this.logisticsInfo.destinationAddress,
        desc: this.logisticsInfo.phone,
        end: true
      }
      if (res.body.dataList && res.body.dataList.length > 0) {
        this.drawMarker()
        this.drawPolyline()
      }
    },
    // 包含起点终点
    handleIncludePoints() {
      const len = this.logisticsInfo.dataList.length
      const points = [
        {
          latitude: this.logisticsInfo.dataList[len - 1].location.split(',')[1],
          longitude: this.logisticsInfo.dataList[len - 1].location.split(',')[0]
        },
        {
          latitude: this.logisticsInfo.destinationLocation.split(',')[1],
          longitude: this.logisticsInfo.destinationLocation.split(',')[0]
        }
      ]
      this.map.includePoints({
        points: points,
        padding: [150]
      })
    },
    mapUpdate() {
      this.handleIncludePoints()
    },
    // 渲染标记点
    drawMarker() {
      const startMarker = {
        id: 1,
        width: 12,
        height: 12,
        latitude: '',
        longitude: '',
        iconPath: '../../../static/member/Icon-start.png',
        callout: {
          display: 'ALWAYS', // 不用点击就展示
          borderRadius: 10,
          padding: 10,
          content: '',
          color: '#ffffff',
          bgColor: '#3B72FF',
          fontSize: 15
        },
        anchor: {
          x: 0.5,
          y: 0.5
        }
      }
      const carMarker = {
        id: 2,
        width: 40,
        height: 40,
        latitude: '',
        longitude: '',
        iconPath: '../../../static/member/Icon-van.png',
        callout: {
          display: 'ALWAYS',
          borderRadius: 10,
          padding: 10,
          content: '',
          color: '#ffffff',
          bgColor: '#3B72FF',
          fontSize: 15
        },
        anchor: {
          x: 0.5,
          y: 0.5
        }
      }
      const endMarker = {
        id: 3,
        latitude: '',
        longitude: '',
        width: 12,
        height: 12,
        iconPath: '../../../static/member/Icon-end.png',
        callout: {
          display: 'ALWAYS',
          borderRadius: 10,
          padding: 10,
          content: '',
          color: '#ffffff',
          bgColor: '#3B72FF',
          fontSize: 15
        },
        anchor: {
          x: 0.5,
          y: 0.5
        }
      }

      const len = this.logisticsInfo.dataList.length
      if (this.logisticsInfo.dataList[len - 1].location !== '') {
        startMarker.longitude = this.logisticsInfo.dataList[len - 1].location.split(',')[0]
        startMarker.latitude = this.logisticsInfo.dataList[len - 1].location.split(',')[1]
        startMarker.callout.content = this.logisticsInfo.departureAddress
        carMarker.longitude = this.logisticsInfo.dataList[len - 1].location.split(',')[0]
        carMarker.latitude = this.logisticsInfo.dataList[len - 1].location.split(',')[1]
        carMarker.callout.content =
          '预计：' + this.dateConfirm({ value: Number(this.logisticsInfo.expectedTime) }, 2) + '送达'
      }

      endMarker.longitude = this.logisticsInfo.destinationLocation.split(',')[0]
      endMarker.latitude = this.logisticsInfo.destinationLocation.split(',')[1]
      endMarker.callout.content = this.logisticsInfo.destinationAddress

      this.markers.push(startMarker)
      this.markers.push(endMarker)
      this.markers.push(carMarker)
      // console.log(this.markers, 'markers')
    },
    // 渲染路线
    drawPolyline() {
      const len = this.logisticsInfo.dataList.length
      const historyRoute = {
        points: [],
        color: '#3B72FF',
        width: 10
      }

      const planRoute = {
        points: [
          {
            latitude: this.logisticsInfo.dataList[len - 1].location.split(',')[1],
            longitude: this.logisticsInfo.dataList[len - 1].location.split(',')[0]
          },
          {
            latitude: this.logisticsInfo.destinationLocation.split(',')[1],
            longitude: this.logisticsInfo.destinationLocation.split(',')[0]
          }
        ],
        color: '#A2BBFF',
        width: 10
      }
      for (let i = 0; i < len; i++) {
        if (len > 1 && this.logisticsInfo.dataList[i].location !== '') {
          historyRoute.points.push({
            latitude: this.logisticsInfo.dataList[i].location.split(',')[1],
            longitude: this.logisticsInfo.dataList[i].location.split(',')[0]
          })
        }
        this.stepsList.push({
          title:
            this.logisticsInfo.dataList[i].status +
            ' ' +
            this.dateConfirm({ value: Number(this.logisticsInfo.dataList[i].time) }, 1),
          desc: this.logisticsInfo.dataList[i].memo
        })
      }
      this.polyline.push(historyRoute)
      this.polyline.push(planRoute)
      // console.log(this.polyline, 'polyline')
    },
    // 点击复制订单号
    copyText(res) {
      uni.setClipboardData({
        data: res,
        success: () => {
          uni.showToast({
            title: '复制成功'
          })
        }
      })
    },
    hanlderPhone(phone) {
      uni.makePhoneCall({
        // 手机号
        phoneNumber: phone,
        // 成功回调
        success: (res) => {
          console.log('调用成功!')
        },
        // 失败回调
        fail: (res) => {
          console.log('调用失败!')
        }
      })
    },
    dateConfirm(obj, type) {
      let str = ''
      const val = obj.value
      if (type === 1) {
        str = this.dataConfirm(val, 2)
      } else {
        str = this.dataConfirm(val, 3)
      }
      return str
    }
  },
  mounted() {}
}
</script>
<style lang="scss" scoped>
.logistics-information {
  max-height: 500rpx;
  overflow: auto;
  position: fixed;
  left: 24rpx;
  right: 24rpx;
  bottom: 30rpx;
  background: #ffffff;
  border-radius: 20rpx;
}
.logistics-information-header {
  padding: 20rpx 24rpx;
  height: 100rpx;
  background: #f8fafb;
}
.csctext {
  font-size: 28rpx;
  font-weight: 500;
  color: #1a2234;
}
.hanlder-text {
  font-size: 28rpx;
  font-weight: 400;
  color: #606a78;
  margin-left: 26rpx;
}
.steps {
  margin: 30rpx 22rpx;
}
::v-deep {
  .u-steps-item {
    min-height: 100rpx !important;
  }
}
.icon-box {
  position: fixed;
  right: 20rpx;
  top: 20rpx;
  height: 60rpx;
  display: flex;
  justify-content: flex-end;
  z-index: 999;
}
</style>
