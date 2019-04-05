var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
Page({
  data: {
    contractname: '',
    contractvalue: '',
    contractstart: '',
    contractend: '',
    plan: '',
    plans: [],
    planitems:[],
    itemtypes:[],
    industries: [{
      id: '00',
      name: '居民'
    }, {
        id: '01',
        name: '一般工商业'
      }, {
        id: '02',
        name: '大工业'
      }],
    industry: '01',
    industryindex: 0,
    voltages: [
      {
        id: '00',
        name: '0.4kV'
      },
      {
        id: '01',
        name: '10kV'
      },
      {
        id: '02',
        name: '35kV'
      },
      {
        id: '03',
        name: '110kV'
      },
      {
        id: '04',
        name: '220kV'
      }
    ],
    voltage: '00',
    voltageindex: 0
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 页面渲染完成
  },
  onReady: function () {

  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

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
                  Object.assign(data[i], { contractstatename: statename, contractvaluecomma: money })
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
  // 读取流程名称
  getApproveFlowNode: function (flowno) {
    return util.getApproveFlow('010')
  },
  // 绑定行业选择
  bindPickerIndustryChange: function (e) {
    this.setData({
      industryindex: e.detail.value,
      industry: this.data.industries[e.detail.value].id
    })
  },
  // 绑定电压选择
  bindPickerVoltageChange: function (e) {
    this.setData({
      voltageindex: e.detail.value,
      voltage: this.data.voltages[e.detail.value].id
    })
  }
})