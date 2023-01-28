import Request from '../networking/request.js'

// 接口列表
export class Api {
	// 获取是否是会员
	UserInquiry = async (params) => {
	  const request = new Request({
	    url: '/cps/v1/UserInquiry',
	    method: 'post',
	    isLoading: false,
	    isMessage: true,
	    isError: true,
	    params: params
	  })
	  return await request.start()
	}
  // OCR识别
  ocr = async (params) => {
    const request = new Request({
      url: '/cps/v1/ImageRecognitionInquiry',
      method: 'post',
      isLoading: false,
      isMessage: true,
      isError: true,
      params: params
    })
    return await request.start()
  }

  // vin搜索
  VINInquiry = async (params) => {
    const request = new Request({
      url: '/cps/v1/VINInquiry',
      method: 'post',
      isLoading: false,
      isMessage: true,
      isError: false,
      params: params
    })
    return await request.start()
  }

  // 配件列表
  AutoPartsListInquiry = async (params) => {
    const request = new Request({
      url: '/cps/v1/AutoPartsListInquiry',
      method: 'post',
      isLoading: true,
      isMessage: true,
      isError: true,
      params: params
    })
    return await request.start()
  }

  // 配件详情
  AutoPartsInquiry = async (params) => {
    const request = new Request({
      url: '/cps/v1/AutoPartsInquiry',
      method: 'post',
      isLoading: true,
      isMessage: true,
      isError: true,
      params: params
    })
    return await request.start()
  }

  // 提交订单
  MiniOrderSubmit = async (params) => {
    const request = new Request({
      url: '/cps/v1/MiniOrderSubmit',
      method: 'post',
      isLoading: true,
      isMessage: true,
      isError: true,
      params: params
    })
    return await request.start()
  }

  // 订单支付
  MiniOrderPayment = async (params) => {
    const request = new Request({
      url: '/cps/v1/MiniOrderPayment',
      method: 'post',
      isLoading: true,
      isMessage: true,
      isError: true,
      params: params
    })
    return await request.start()
  }

  // 订单结果
  MiniOrderPaymentInquiry = async (params) => {
    const request = new Request({
      url: '/cps/v1/MiniOrderPaymentInquiry',
      method: 'post',
      isLoading: false,
      isMessage: true,
      isError: true,
      params: params
    })
    return await request.start()
  }

  // 订单价格
  MiniOrderGoodsPriceInquiry = async (params) => {
    const request = new Request({
      url: '/cps/v1/MiniOrderGoodsPriceInquiry',
      method: 'post',
      isLoading: false,
      isMessage: true,
      isError: true,
      params: params
    })
    return await request.start()
  }

  // 默认地址
  MiniDefaultAddressInquiry = async (params) => {
    const request = new Request({
      url: '/cps/v1/MiniDefaultAddressInquiry',
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
