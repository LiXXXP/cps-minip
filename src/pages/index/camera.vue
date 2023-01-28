<template>
  <view class="cameraBg">
    <camera device-position="back" flash="auto" style="width: 100%; height: 100vh" @error="cameraError">
      <cover-image src="@/static/index/cameraBg.png" class="scan-img"> </cover-image>
      <cover-view class="scanBtn" v-if="scanShow">
        <cover-view class="beat" @click="scan">
          <cover-image class="beatImg" src="@/static/index/album.png"></cover-image>
          <cover-view> 相册 </cover-view>
        </cover-view>
        <cover-view class="album" @click="takePhoto">
          <cover-image class="albumImg" src="@/static/index/beat.png"></cover-image>
          <cover-view> 拍照 </cover-view>
        </cover-view>
      </cover-view>
    </camera>
  </view>
</template>

<script>
import http from '@/api/product'
export default {
  data() {
    return {
      scanShow: true
    }
  },
  methods: {
    cameraError() {
      uni.showModal({
        title: '提示',
        content: '您已拒绝授权使用相机，请前往设置中打开',
        success: (res) => {
          this.goBack()
        }
      })
    },
    // 相册
    scan() {
      // 选择图片
      uni.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album'],
        success: (res) => {
          this.compress(res.tempFilePaths[0])
        },
        fail: (err) => {
          console.log(err)
        }
      })
    },
    // 启动图片压缩
    compress(tempFilePaths) {
      const vm = this
      vm.scanShow = false
      uni.showLoading({
        title: '智能识别中...'
      })
      uni.compressImage({
        src: tempFilePaths,
        quality: 80,
        success: (imageRes) => {
          // 获取类型
          uni.getImageInfo({
            src: imageRes.tempFilePath,
            success(imageInfo) {
              // 转base64
              uni.getFileSystemManager().readFile({
                filePath: imageRes.tempFilePath,
                encoding: 'base64',
                success: (base) => {
                  // 返回base64格式
                  const base64Str = 'data:image/' + imageInfo.type + ';base64,' + base.data
                  vm.camera64(base64Str)
                },
                fail: (err) => {
                  console.log(err)
                }
              })
            }
          })
        }
      })
    },
    // 拿到图片开始进行识别
    camera64(base64Str) {
      http
        .ocr({
          imageCode: base64Str
        })
        .then((data) => {
          this.scanShow = true
          if (data.status.success) {
            uni.hideLoading()
            if (data.body.vin) {
              this.goPage('/pages/product/index?vin=' + data.body.vin, true, 'redirectTo')
            } else {
              this.msg('无法识别,请重新拍照')
            }
          }
        })
    },
    // 拍照
    takePhoto() {
      const ctx = uni.createCameraContext()
      ctx.takePhoto({
        quality: 'high',
        success: (res) => {
          this.compress(res.tempImagePath)
        },
        fail: (err) => {
          console.log(err)
        }
      })
    },
    error(e) {
      console.log(e.detail)
    }
  }
}
</script>

<style lang="scss" scoped>
.cameraBg {
  width: 100%;
  height: 100vh;
  position: fixed;
  .scan-img {
    width: 100%;
    height: 1624rpx;
    z-index: 1;
  }
  .scanBtn {
    width: 100%;
    z-index: 99999;
    position: fixed;
    bottom: 100rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .beat {
      position: absolute;
      bottom: 0rpx;
      left: 100rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 24rpx;
      font-weight: 400;
      color: #ffffff;
      .beatImg {
        width: 88rpx;
        height: 88rpx;
        margin-bottom: 30rpx;
      }
    }
    .album {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 24rpx;
      font-weight: 400;
      color: #ffffff;
      .albumImg {
        width: 120rpx;
        height: 120rpx;
        margin-bottom: 30rpx;
      }
    }
  }
}
</style>
