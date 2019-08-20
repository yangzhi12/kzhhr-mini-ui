var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp();
Page({
  data: {
    quarter: {
      QT: 0,
      QN: 0,
      YT: 0,
      YN: 0,
      RT: 0,
      RN: 0
    },
    currentquarter: 'Q1',
    years: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029],
    selectedyear: 2019,
    yearsshow: true,
    share: [],
    stats: ['Q', 'Y', 'R']
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
    this.getShareIndex()
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  // 季度签单量汇总
  getShareStatQ() {
    let that = this
    let year = that.data.selectedyear
    let data = {
      year: year,
      quarter: that.data.currentquarter.substr(1, 1)
    }
    try {
      const token = wx.getStorageSync('token')
      if (token) {
        wx.request({
          url: api.ShareStatQ,
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
  getShareStatQList() {
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
          url: api.ShareStatQList,
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
                that.setData({ share: data })
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
    this.getShareIndex()
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
    this.getShareIndex()
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
  getShareIndex: function () {
    this.getShareStatQ() // 获取季度分享统计
    this.getShareStatQList() // 获取季度分享列表
  },
  // 显示大图
  showZoomFile: function (e) {
    const dataset = e.currentTarget.dataset
    const shareid = dataset.files
    const attachments = this.data.share.filter(item => {
      return item.id === shareid
    })
    const item = dataset.file
    let imagepaths = []
    attachments[0]['attachments'].map(i => {
      let url = i.downloadurl
      imagepaths.push(url)
    })
    // 预览图片
    wx.previewImage({
      current: item.downloadurl,
      urls: imagepaths
    })
  }
})