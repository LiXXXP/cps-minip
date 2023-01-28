export default {
  data() {
    return {
      share: {
        title: '爱车件—原车配件，种类齐全品质优',
        path: '/pages/index/index'
      }
    }
  },
  onShareAppMessage(res) {
    // 发送给朋友
    return {
      title: this.share.title,
      path: this.share.path
    }
  },
  onShareTimeline(res) {
    // 分享到朋友圈
    return {
      title: this.share.title
    }
  }
}
