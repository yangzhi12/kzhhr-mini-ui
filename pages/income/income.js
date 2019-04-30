var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp();
Page({
  data: {
    report: {},
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
    let year = that.data.selectedyear
    try {
      const token = wx.getStorageSync('token')
      if (token) {
        wx.request({
          url: api.IncomeList,
          method: 'post',
          header: {
            'x-kzhhr-token': token
          },
          data: null,
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
                let titles = Object.keys(data)
                titles.map(item => {
                  let repyearsummary = data[item]['Q1']['incomevalue'] || 0 + data[item]['Q2']['incomevalue'] || 0 + data[item]['Q3']['incomevalue'] || 0 + data[item]['Q4']['incomevalue'] || 0
                  Object.assign(data[item], { repyearsummary: repyearsummary})
                })
                that.setData({ 
                  report: data,
                  reporttitle: titles
                })
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
  }
})