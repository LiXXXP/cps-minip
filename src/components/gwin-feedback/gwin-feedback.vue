<template>
  <view class="feedback">
    <view
      id="_drag_button"
      class="drag"
      :style="'left: ' + left + 'px; top:' + top + 'px;'"
      @touchstart="touchstart"
      @touchmove.stop.prevent="touchmove"
      @touchend="touchend"
      @click.stop.prevent="click"
      :class="{ transition: isDock && !isMove }"
    >
      <image src="@/static/index/feedback.png" @click="call"></image>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    isDock: {
      type: Boolean,
      default: true
    },
    existTabBar: {
      type: Boolean,
      default: true
    },
    bottom: {
      type: Number,
      default: 180
    }
  },
  data() {
    return {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      offsetWidth: 0,
      offsetHeight: 0,
      windowWidth: 0,
      windowHeight: 0,
      isMove: true,
      edge: 10,
      text: '按钮'
    }
  },
  mounted() {
    const sys = uni.getSystemInfoSync()

    this.windowWidth = sys.windowWidth
    this.windowHeight = sys.windowHeight

    // #ifdef APP-PLUS
    this.existTabBar && (this.windowHeight -= 50)
    // #endif
    if (sys.windowTop) {
      this.windowHeight += sys.windowTop
    }
    console.log(sys)

    const query = uni.createSelectorQuery().in(this)
    query
      .select('#_drag_button')
      .boundingClientRect((data) => {
        if (!data) return
        this.width = data.width
        this.height = data.height
        this.offsetWidth = data.width / 2
        this.offsetHeight = data.height / 2
        this.left = this.windowWidth - this.width - this.edge
        this.top = this.windowHeight - this.height - this.edge - 80
      })
      .exec()
  },
  methods: {
    async call() {
      // 是否登录
      if (!(await this.isLogin())) return
      wx.openCustomerServiceChat({
        extInfo: { url: 'https://work.weixin.qq.com/kfid/kfccd7fa209c64f15c8' },
        corpId: 'wwb9652ecd69ab1dd5',
        success(res) {}
      })
    },
    click() {
      this.$emit('btnClick')
    },
    touchstart(e) {
      this.$emit('btnTouchstart')
    },
    touchmove(e) {
      // 单指触摸
      if (e.touches.length !== 1) {
        return false
      }

      this.isMove = true

      this.left = e.touches[0].clientX - this.offsetWidth

      let clientY = e.touches[0].clientY - this.offsetHeight
      // #ifdef H5
      clientY += this.height
      // #endif
      const edgeBottom = this.windowHeight - this.height - this.edge

      // 上下触及边界
      if (clientY < this.edge) {
        this.top = this.edge
      } else if (clientY > edgeBottom) {
        this.top = edgeBottom
      } else {
        this.top = clientY
      }
    },
    touchend(e) {
      if (this.isDock) {
        const edgeRigth = this.windowWidth - this.width - this.edge

        if (this.left < this.windowWidth / 2 - this.offsetWidth) {
          this.left = this.edge
        } else {
          this.left = edgeRigth
        }
      }

      this.isMove = false

      this.$emit('btnTouchend')
    }
  }
}
</script>

<style>
button::after {
  border: none;
}
button {
  background-color: transparent;
  padding-left: 0;
  padding-right: 0;
  line-height: inherit;
  border-radius: 0;
}
</style>

<style lang="scss" scoped>
.drag {
  width: 100rpx;
  height: 100rpx;
  position: fixed;
  z-index: 999999;
  image {
    width: 100rpx;
    height: 100rpx;
  }

  &.transition {
    transition: left 0.3s ease, top 0.3s ease;
  }
}
</style>
