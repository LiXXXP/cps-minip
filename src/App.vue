<script>
export default {
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },

  methods: {
    // 是否登录
    isLogin() {
      const userId = uni.getStorageSync('userId')
      if (!userId) {
        this.goPage('/pages/login/index')
      }
    }
  }
}
</script>

<style lang="scss">
// 因APP使用了nvue 除APP外加载样式 进行过滤 防止报错
/*  #ifndef  APP-PLUS-NVUE */
// 公共css
@import './style/common.scss';
// 便捷css
@import './style/base.scss';
// iconfont
@import './style/iconfont.scss';
// uview scss
@import 'uview-ui/index.scss';
/*  #endif  */
</style>
