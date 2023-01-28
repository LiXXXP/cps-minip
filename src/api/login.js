import Request from '../networking/request.js'

// 接口列表
export class Api {
  // 登录
  MiniLogin = async (params) => {
    const request = new Request({
      url: '/cps/v1/MiniLogin',
      method: 'post',
      isLoading: false,
      isMessage: true,
      isError: true,
      params: params
    })
    return await request.start()
  }

  // 新用户更新用户资料
  UserMaintenance = async (params) => {
    const request = new Request({
      url: '/cps/v1/UserMaintenance',
      method: 'post',
      isLoading: false,
      isMessage: true,
      isError: true,
      params: params
    })
    return await request.start()
  }
}
export default new Api()
