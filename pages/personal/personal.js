var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp()
Page({
  data: {
    username: '',
    gender: '',
    gendername: '',
    mobile: '',
    certificate: '',
    weixinno: '',
    refereename: '',
    refereemobile: '',
    level: '',
    levelname: '',
    state: '',
    statename: '',
    registertype: '',
    isreferee: ''
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 页面渲染完成
  },
  onReady: function() {},
  onShow: function() {
    // 页面显示
    this.getPersonalInfo()
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  },
  loginOut: function() {
    try {
      wx.clearStorageSync()
      wx.reLaunch({
        url: '/pages/login/login'
      })
    } catch (e) {
      // Do something when catch error
    }
  },
  // 查询个人资料
  getPersonalInfo () {
    let that = this
    try {
      const token = wx.getStorageSync('token')
      if (token) {
        wx.request({
          url: api.PersonalUrl,
          method: 'get',
          header: {
            'x-kzhhr-token': token
          },
          success: function (res) {
            if (res.statusCode === 200) {
              let response = res.data
              if (!response.errno) {
                let userInfo = response.data
                that.assignUIData(userInfo[0])
              } else {
                wx.showModal({
                  title: '提示信息',
                  content: response.errmsg,
                  showCancel: false
                });
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
  // 设置数据模型
  assignUIData (userInfo) {
    let _this = this
    // 设置用户名称
    _this.setData({
      username: userInfo.username,
      gender: util.getGenderName(userInfo.gender),
      mobile: userInfo.mobile,
      certificate: userInfo.certificate,
      weixinno: userInfo.weixin_no,
      level: util.getLevelName(userInfo.level),
      state: util.getStateName(userInfo.state),
      isreferee: userInfo.register_type,
      registertype: util.getRefereeName(userInfo.register_type),
      refereename: userInfo.register_type === 'REF' ? userInfo.refereename : null,
      refereemobile: userInfo.register_type === 'REF' ? userInfo.refereemobile : null
    })
  }
})
