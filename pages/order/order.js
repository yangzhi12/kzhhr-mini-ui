var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp();
Page({
  data: {
    quarter: { Q1: 0, M1: 0, MR1: 0, Q2: 1, M2: 0, MR2: 0, Q3: 1, M3: 0, MR3: 0, Q4: 1, M4: 0, MR4: 0 },
    currentquarter: 'Q1',
    years: [2019, 2020, 2021, 2022, 2023, 2024,2025],
    selectedyear: 2019,
    yearsshow: true,
    contract: []
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 页面渲染完成
  },
  onReady: function () {

  },
  onShow: function () {
    // 页面显示
    this.setData({
      selectedyear: this.data.years[0],
      currentquarter: 'Q1'
    })
    this.getOrderIndex()
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  // 季度签单量汇总
  getOrderStatQ() {
    let that = this
    let year = that.data.selectedyear
    let data = {
      year: year
    }
    try {
      const token = wx.getStorageSync('token')
      if (token) {
        wx.request({
          url: api.OrderStatQ,
          method: 'post',
          header: {
            'x-kzhhr-token': token
          },
          data: data,
          success: function (res) {
            if (res.statusCode === 200) {
              let response = res.data
              if (response.errorno) {
                wx.showModal({
                  title: '提示信息',
                  content: '服务异常',
                  showCancel: false
                });
              } else {
                let data = response.data
                that.setData({ quarter: data })
                console.log(data)
              }
            } else {
              wx.showModal({
                title: '提示信息',
                content: '网络异常',
                showCancel: false
              });
            }
          }
        })
      }
    } catch (error) {

    }
  },
  // 季度签单量列表
  getOrderStatQList() {
    let that = this
    let quarter = that.getQuarterIndex(that.data.currentquarter)
    let year = that.data.selectedyear
    let data = {
      year: year,
      quarter: quarter
    }
    try {
      const token = wx.getStorageSync('token')
      if (token) {
        wx.request({
          url: api.OrderStatQList,
          method: 'post',
          header: {
            'x-kzhhr-token': token
          },
          data: data,
          success: function (res) {
            if (res.statusCode === 200) {
              let response = res.data
              if (response.errorno) {
                wx.showModal({
                  title: '提示信息',
                  content: '服务异常',
                  showCancel: false
                });
              } else {
                let data = response.data
                for (let i = 0; i < data.length; i++) {
                  let statename = util.getApproveFlow(data[i].contractstate)['name']
                  let money = util.getCommaMoney(data[i].contractvalue, 0)
                  let recommendmoney = util.getCommaMoney(data[i].recommendvalue, 0)
                  Object.assign(data[i], { contractstatename: statename, contractvaluecomma: money, recommendvaluecomma: recommendmoney})
                }
                that.setData({ contract: data })
              }
            } else {
              wx.showModal({
                title: '提示信息',
                content: '网络异常',
                showCancel: false
              });
            }
          }
        })
      }
    } catch (error) {

    }
  },
  //用户点击tab时调用
  titleClick: function (e) {
    this.setData({
      //拿到当前索引并动态改变
      currentquarter: e.currentTarget.dataset.idx,
      // 隐藏年份选择（如果显示则隐藏）
      yearsshow: true
    })
    this.getOrderStatQList()
  },
  titleYearClick: function (e) {
    this.setData({
      yearsshow: !this.data.yearsshow
    })
  },
  tapMenuItem: function (e) {
    this.setData({
      selectedyear: e.currentTarget.dataset.index,
      yearsshow: !this.data.yearsshow,
      currentquarter: 'Q1'
    })
    this.getOrderIndex()
  },
  getQuarterIndex: function (quarter) {
    let index = 1
    switch (quarter) {
      case 'Q1':
        index = 1
        break;
      case 'Q2':
        index = 2
        break;
      case 'Q3':
        index = 3
        break;
      case 'Q4':
        index = 4
        break;
      default:
    }
    return index;
  },
  // 我的签单数据
  getOrderIndex: function () {
    this.getOrderStatQ() // 获取季度签单统计
    this.getOrderStatQList() // 获取季度签单列表
  },
  // 读取流程名称
  getApproveFlowNode: function (flowno) {
    return util.getApproveFlow('010')
  }
})