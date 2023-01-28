const result = {
  // 订单列表
  body: {
    dataList: [
      {
        goodsList: [
          {
            goodsBrand: '品牌：东风本田',
            goodsIconUri: 'https://cdn.uviewui.com/uview/album/1.jpg',
            goodsId: 1,
            goodsName: '电子控制节气门',
            goodsNum: 1,
            goodsTotalAmount: 100,
            remark: 'SCREW-WASHER，4*12'
          },
          {
            goodsBrand: '品牌：丰田',
            goodsIconUri: 'https://cdn.uviewui.com/uview/album/1.jpg',
            goodsId: 1,
            goodsName: '发动机',
            goodsNum: 1,
            goodsTotalAmount: 200,
            remark: 'SCREW-WASHER，4*12'
          }
        ],
        orderCategory: 0,
        orderId: 0,
        orderStatus: 1,
        orderTotalAmount: 300.0,
        totalPieces: 2
      },
      {
        goodsList: [
          {
            goodsBrand: '品牌：东风本田',
            goodsIconUri: 'https://cdn.uviewui.com/uview/album/1.jpg',
            goodsId: 1,
            goodsName: '电子控制节气门',
            goodsNum: 1,
            goodsTotalAmount: 100,
            remark: 'SCREW-WASHER，4*12'
          }
        ],
        orderCategory: 0,
        orderId: 0,
        orderStatus: 2,
        orderTotalAmount: 100.0,
        totalPieces: 2,
        firstGoodsName: '电子控制节气门'
      }
    ],
    page: {
      count: 0,
      orderBy: 'string',
      pageNum: 0,
      pageSize: 0,
      returnCount: true
    }
  },
  status: {
    appName: 'string',
    duration: 0,
    errorCode: 'string',
    memo: 'string',
    replyCode: 'string',
    replyText: 'string',
    success: true
  }
}

export default result
