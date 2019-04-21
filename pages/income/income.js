var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp();
Page({
  data: {
    report: {
      '2019': 
        {
          'Q1': {
            levelname: '业务员',
            orders: 4,
            orderprice: 1000,
            income: 4000000,
            createtime: '2019-01-01'
          },
          'Q2': {
            levelname: '业务员',
            orders: 4,
            orderprice: 1000,
            income: 4000000,
            createtime: '2019-04-01'
          },
          'Q3': {
            levelname: '业务员',
            orders: 4,
            orderprice: 1000,
            income: 4000000,
            createtime: '2019-07-01'
          },
          'Q4': {
            levelname: '业务员',
            orders: 4,
            orderprice: 1000,
            income: 4000000,
            createtime: '2019-10-01'
          }
        },
      '2018':
      {
        'Q1': {
          levelname: '业务员',
          orders: 4,
          orderprice: 1000,
          income: 4000000,
          createtime: '2019-01-01'
        },
        'Q2': {
          levelname: '业务员',
          orders: 4,
          orderprice: 1000,
          income: 4000000,
          createtime: '2019-04-01'
        },
        'Q3': {
          levelname: '业务员',
          orders: 4,
          orderprice: 1000,
          income: 4000000,
          createtime: '2019-07-01'
        },
        'Q4': {
          levelname: '业务员',
          orders: 4,
          orderprice: 1000,
          income: 4000000,
          createtime: '2019-10-01'
        }
      },
      '2017':
      {
        'Q1': {
          levelname: '业务员',
          orders: 4,
          orderprice: 1000,
          income: 4000000,
          createtime: '2019-01-01'
        },
        'Q2': {
          levelname: '业务员',
          orders: 4,
          orderprice: 1000,
          income: 4000000,
          createtime: '2019-04-01'
        },
        'Q3': {
          levelname: '业务员',
          orders: 4,
          orderprice: 1000,
          income: 4000000,
          createtime: '2019-07-01'
        },
        'Q4': {
          levelname: '业务员',
          orders: 4,
          orderprice: 1000,
          income: 4000000,
          createtime: '2019-10-01'
        }
      }      
    },
    reporttitles: []
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 页面渲染完成
  },
  onReady: function () {
  },
  onShow: function () {
    // 页面显示
    this.getReport()
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  // 收益报表汇总
  getReport() {
    let that = this
    that.setData({
      reporttitle: Object.keys(that.data.report)
    })
    // let year = that.data.selectedyear
    // let data = {
    //   year: year,
    //   quarter: that.data.currentquarter.substr(1, 1)
    // }
    // try {
    //   const token = wx.getStorageSync('token')
    //   if (token) {
    //     wx.request({
    //       url: api.OrderStatQ,
    //       method: 'post',
    //       header: {
    //         'x-kzhhr-token': token
    //       },
    //       data: data,
    //       success: function (res) {
    //         if (res.statusCode === 200) {
    //           let response = res.data
    //           if (response.errorno) {
    //             wx.showModal({
    //               title: '提示信息',
    //               content: '服务异常',
    //               showCancel: false
    //             });
    //           } else {
    //             let data = response.data
    //             Object.keys(data).map(item => {
    //               if (item.substr(1, 1) === 'N') {
    //                 data[item] = that.getTwoDecimal(data[item])
    //               }
    //             })
    //             that.setData({ quarter: data })
    //           }
    //         } else {
    //           wx.showModal({
    //             title: '提示信息',
    //             content: '网络异常',
    //             showCancel: false
    //           });
    //         }
    //       }
    //     })
    //   }
    // } catch (error) {

    // }
  }
})