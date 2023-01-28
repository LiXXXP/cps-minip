import Request from '../networking/request.js'

// 【我的】模块接口列表
export class Api {
  // 会员信息查询
  MemberInquiry = async (params) => {
    const request = new Request({
      url: '/cps/v1/MemberInquiry',
      method: 'post',
      isLoading: true,
      isMessage: true,
      isError: true,
      params: params
    })
    return await request.start()
  }
  // 会员开通记录列表查询
  MiniMemberOrderListInquiry = async (params) => {
    const request = new Request({
      url: '/cps/v1/MiniMemberOrderListInquiry',
      method: 'post',
      isLoading: true,
      isMessage: true,
      isError: true,
      params: params
    })
    return await request.start()
  }
  // 会员订单提交
  MiniMemberOrderSubmit = async (params) => {
    const request = new Request({
      url: '/cps/v1/MiniMemberOrderSubmit',
      method: 'post',
      isLoading: true,
      isMessage: true,
      isError: true,
      params: params
    })
    return await request.start()
  }
  // 成为会员价格查询
  MiniVipRightsInquiry = async (params) => {
    const request = new Request({
      url: '/cps/v1/MiniVipRightsInquiry',
      method: 'post',
      isLoading: true,
      isMessage: true,
      isError: true,
      params: params
    })
    return await request.start()
  }
  // 个人信息查询
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
  // 个人信息修改
  UserMaintenance = async (params) => {
    const request = new Request({
      url: '/cps/v1/UserMaintenance',
      method: 'post',
      isLoading: true,
      isMessage: true,
      isError: true,
      params: params
    })
    return await request.start()
  }
  // 收货地址列表
  DestinationAddressListInquiry = async (params) => {
    const request = new Request({
      url: '/cps/v1/DestinationAddressListInquiry',
      method: 'post',
      isLoading: true,
      isMessage: true,
      isError: true,
      params: params
    })
    return await request.start()
  }
  // 收货地址新增
  DeliveryAddressAddition = async (params) => {
    const request = new Request({
      url: '/cps/v1/DeliveryAddressAddition',
      method: 'post',
      isLoading: true,
      isMessage: true,
      isError: true,
      params: params
    })
    return await request.start()
  }
  // 收货地址修改
  DeliveryAddressMaintenance = async (params) => {
    const request = new Request({
      url: '/cps/v1/DeliveryAddressMaintenance',
      method: 'post',
      isLoading: true,
      isMessage: true,
      isError: true,
      params: params
    })
    return await request.start()
  }
  // 收货地址删除
  DeliveryAddressDeleting = async (params) => {
    const request = new Request({
      url: '/cps/v1/DeliveryAddressDeleting',
      method: 'post',
      isLoading: true,
      isMessage: true,
      isError: true,
      params: params
    })
    return await request.start()
  }
  // 企业信息查询
  EnterpriseInquiry = async (params) => {
    const request = new Request({
      url: '/cps/v1/EnterpriseInquiry',
      method: 'post',
      isLoading: true,
      isMessage: true,
      isError: true,
      params: params
    })
    return await request.start()
  }
  // 企业信息新增
  EnterpriseAddition = async (params) => {
    const request = new Request({
      url: '/cps/v1/EnterpriseAddition',
      method: 'post',
      isLoading: true,
      isMessage: true,
      isError: true,
      params: params
    })
    return await request.start()
  }
  // 企业信息修改
  EnterpriseMaintenance = async (params) => {
    const request = new Request({
      url: '/cps/v1/EnterpriseMaintenance',
      method: 'post',
      isLoading: true,
      isMessage: true,
      isError: true,
      params: params
    })
    return await request.start()
  }
  // 推荐人保存
  MiniUserReferrerAddition = async (params) => {
    const request = new Request({
      url: '/cps/v1/MiniUserReferrerAddition',
      method: 'post',
      isLoading: true,
      isMessage: true,
      isError: true,
      params: params
    })
    return await request.start()
  }
  // 订单列表接口
  MiniOrderListInquiry = async (params) => {
    const request = new Request({
      url: '/cps/v1/MiniOrderListInquiry',
      method: 'post',
      isLoading: true,
      isMessage: true,
      isError: true,
      params: params
    })
    return await request.start()
  }
  // 订单列表取消订单
  MiniOrderCancel = async (params) => {
    const request = new Request({
      url: '/cps/v1/MiniOrderCancel',
      method: 'post',
      isLoading: true,
      isMessage: true,
      isError: true,
      params: params
    })
    return await request.start()
  }
  // 订单列表确认收货
  MiniOrderConfirmReceipt = async (params) => {
    const request = new Request({
      url: '/cps/v1/MiniOrderConfirmReceipt',
      method: 'post',
      isLoading: true,
      isMessage: true,
      isError: true,
      params: params
    })
    return await request.start()
  }
  // 订单详情
  MiniOrderInquiry = async (params) => {
    const request = new Request({
      url: '/cps/v1/MiniOrderInquiry',
      method: 'post',
      isLoading: true,
      isMessage: true,
      isError: true,
      params: params
    })
    return await request.start()
  }
  // 物流信息查询
  LogisticsInquiry = async (params) => {
    const request = new Request({
      url: '/cps/v1/LogisticsInquiry',
      method: 'post',
      isLoading: true,
      isMessage: true,
      isError: true,
      params: params
    })
    return await request.start()
  }
  // 售后申请提交接口
  MiniSupportSubmit = async (params) => {
    const request = new Request({
      url: '/cps/v1/MiniSupportSubmit',
      method: 'post',
      isLoading: true,
      isMessage: true,
      isError: true,
      params: params
    })
    return await request.start()
  }
  // 售后列表查询
  MiniSupportOrderListInquiry = async (params) => {
    const request = new Request({
      url: '/cps/v1/MiniSupportOrderListInquiry',
      method: 'post',
      isLoading: true,
      isMessage: true,
      isError: true,
      params: params
    })
    return await request.start()
  }
  // 售后详情查询
  MiniSupportOrderInquiry = async (params) => {
    const request = new Request({
      url: '/cps/v1/MiniSupportOrderInquiry',
      method: 'post',
      isLoading: true,
      isMessage: true,
      isError: true,
      params: params
    })
    return await request.start()
  }
  // 售后详情订单号提交
  MiniSupportOrderExpressNoMaintenance = async (params) => {
    const request = new Request({
      url: '/cps/v1/MiniSupportOrderExpressNoMaintenance',
      method: 'post',
      isLoading: true,
      isMessage: true,
      isError: true,
      params: params
    })
    return await request.start()
  }
}

export default new Api()
