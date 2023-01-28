/*
 * @Author: Jin Biao
 * @Date: 2022-03-09 13:33:02
 * @LastEditTime: 2022-04-25 17:33:04
 * @Description: mimix组合套
 */
export default {
  data() {
    return {
      loadingType: 1, // 0加载前 1加载中 2没有更多
      isLoading: false, // 刷新数据
      loaded: false // 加载完毕
    }
  },
  methods: {
    // 是否登录
    isLogin() {
      return new Promise((resolve, reject) => {
        const userId = uni.getStorageSync('userId')
        if (!userId) {
          this.goPage('/pages/login/index')
          resolve(false)
        } else {
          resolve(true)
        }
      })
    },
    /**
     * 提示消息msg
     * @param {String} title
     */
    msg(title = '', param = {}) {
      if (!title) return
      uni.showToast({
        title,
        duration: param.duration || 1500,
        mask: param.mask || false,
        icon: param.icon || 'none'
      })
    },
    /**
     * goPage跳转页面
     * @param {String} url
     * @param {Object} options
     * @param {Boolean} options.login 是否检测登录
     */

    goPage(url, login = false, type = 'navigateTo') {
      if (login) {
        if (!uni.getStorageSync('accessToken') || !uni.getStorageSync('userId')) {
          url = '/pages/login/index'
        }
      }
      if (!url) {
        return
      }
      // 跳转类型
      if (type === 'navigateTo') {
        uni.navigateTo({
          url
        })
      }
      if (type === 'redirectTo') {
        uni.redirectTo({
          url
        })
      }
      if (type === 'reLaunch') {
        uni.reLaunch({
          url
        })
      }
      if (type === 'switchTab') {
        uni.switchTab({
          url
        })
      }
    },
    /**
     * 后退
     * @param {String} delta
     */
    goBack(index = 1) {
      uni.navigateBack({
        delta: index
      })
    },
    /**
     * 时间戳转换
     * @param {Number} data
     * @param {Number} type: 1 年月日 2 年月日时分秒 3 月日
     */
    dataConfirm(timeNum, type) {
      let str = ''
      if (timeNum) {
        const val = Number(timeNum)
        var date = new Date(val)
        const Y = date.getFullYear() + '-'
        const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        const D = (date.getDate() + 1 < 10 ? '0' + date.getDate() : date.getDate()) + ''
        const h = (date.getHours() + 1 < 10 ? '0' + date.getHours() : date.getHours()) + ':'
        const m = (date.getMinutes() + 1 < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
        const s = date.getSeconds() + 1 < 10 ? '0' + date.getSeconds() : date.getSeconds()
        if (type === 1) {
          str = Y + M + D
        } else if (type === 2) {
          str = Y + M + D + ' ' + h + m + s
        } else if (type === 3) {
          str = M + '月' + D + '日'
        }
      }
      return str
    }
  }
}
