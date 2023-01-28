<template>
  <view class="login">
    <view class="title">
      <view class="title-header">您好！欢迎使用汽配件 </view>
      <view class="title-text"> 汽配件在手，采购配件不用愁～ </view>
    </view>
    <image class="logo" src="@/static/logo.png"></image>
    <view class="login-btn">
      <u-button
        v-if="isLogin.length === 0"
        iconColor="#3B72FF"
        color="#3B72FF"
        text="微信用户一键登录"
        @click="isCheck()"
      ></u-button>
      <u-button
        v-else
        :hairline="false"
        iconColor="#3B72FF"
        color="#3B72FF"
        openType="getPhoneNumber"
        @getphonenumber="getPhoneNumber"
        text="微信用户一键登录"
      ></u-button>
    </view>
    <view class="tcp">
      <u-checkbox-group v-model="isLogin">
        <u-checkbox shape="circle" name="true"></u-checkbox>
        我已同意并知晓
        <text @click.stop="goPage('/pages/account/agreements/user-agreement')">《用户协议》</text>及
        <text @click.stop="goPage('/pages/account/agreements/privacy-policy')">《隐私政策》</text>
      </u-checkbox-group>
    </view>
  </view>
</template>

<script>
import http from '@/api/login'
export default {
  data() {
    return {
      isLogin: [],
      loginCode: ''
    }
  },
  mounted() {
    // 获取用户
    this.login()
  },
  methods: {
    getUserProfile(e) {
      console.log(e, 'eeeeee')
      uni.getUserProfile({
        desc: '用于完善会员资料',
        success: (userData) => {
          console.log(userData, 'userData')
        },
        fail: (err) => {
          console.log(err)
        }
      })
    },
    // 是否协议
    isCheck() {
      if (this.isLogin.length === 0) {
        this.msg('请先同意用户协议')
        return
      }
    },
    // 授权登录
    async getPhoneNumber(e) {
      if (e.detail.errMsg === 'getPhoneNumber:ok') {
        uni.showLoading({
          title: '登录中...'
        })
        const res = await http.MiniLogin({
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          code: this.loginCode,
          channelId: 'cps'
        })
        uni.hideLoading()
        if (res.status.success) {
          uni.setStorageSync('userInfo', res.body)
          uni.setStorageSync('userId', res.body.userId)
          uni.setStorageSync('accessToken', res.body.accessToken)

          // 是否是新用户 更新资料
          if (res.body.isNewUser) {
            uni.showModal({
              title: '获取头像信息',
              content: '更新您的微信头像作为资料',
              success(showModal) {
                if (showModal.confirm) {
                  uni.getUserProfile({
                    desc: '用于完善用户资料',
                    success: (userData) => {
                      uni.showLoading({
                        title: '更新中...'
                      })
                      // 更新资料
                      http
                        .UserMaintenance({
                          id: res.body.userId,
                          nickname: userData.userInfo.nickName,
                          avatarUrl: userData.userInfo.avatarUrl
                        })
                        .then((user) => {
                          uni.hideLoading()
                          uni.switchTab({
                            url: '/pages/index/index'
                          })
                        })
                    },
                    fail: (err) => {
                      console.log(err)
                      uni.switchTab({
                        url: '/pages/index/index'
                      })
                    }
                  })
                } else if (showModal.cancel) {
                  uni.switchTab({
                    url: '/pages/index/index'
                  })
                }
              }
            })
          } else {
            uni.switchTab({
              url: '/pages/index/index'
            })
          }
        }
      } else {
        this.msg('授权失败，联系管理员')
      }
    },
    login() {
      const vm = this
      uni.login({
        provider: 'weixin',
        success(res) {
          console.log(res, 'login信息')
          if (res.errMsg === 'login:ok') {
            vm.loginCode = res.code
          } else {
            vm.msg('获取用户失败')
          }
        },
        fail(err) {
          console.log('失败： ', err)
        }
      })
    }
  },
  onShareAppMessage(res) {
    return {
      title: '爱车件—原车配件，种类齐全品质优',
      path: '/pages/index/index'
    }
  },
  onShareTimeline(res) {
    return {
      title: '爱车件—原车配件，种类齐全品质优'
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100vh;
  background: url('https://cdgwin-prod.cn-bj.ufileos.com/gwin-platform/gwin-cloud/bg.png') no-repeat;
  background-size: 100% 100%;
  padding: 0 60rpx;
  box-sizing: border-box;
  .tcp {
    width: 100%;
    position: absolute;
    bottom: 60rpx;
    left: 0;
    padding: 0 60rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: #606a78;
    display: flex;
    align-items: center;
    > view {
      display: flex;
      align-items: center;
    }
    text {
      color: #3b72ff;
    }
  }

  .title-header {
    font-size: 48rpx;
    font-weight: 600;
    color: #1d2129;
    padding-top: 196rpx;
  }
  .title-text {
    font-size: 32rpx;
    font-weight: 400;
    color: #606a78;
    padding-top: 24rpx;
  }
  .login-btn {
    width: 80vw;
    display: flex;
    justify-content: center;
  }
  .logo {
    width: 480rpx;
    height: 240rpx;
    margin: 126rpx auto 150rpx;
  }
}
</style>
