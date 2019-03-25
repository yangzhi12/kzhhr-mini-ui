var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp();
Page({
  data: {
    mobile: '',
    password: '',
    loginErrorCount: 0,
    fieldMaps: {
      mobile: '手机号',
      password: '密码'
    }
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
  startLogin: function () {
    var that = this;
    let errors = [];
    // 空值校验
    Object.keys(that.data.fieldMaps).map(item => {
      let value = util.trimSpaceSymbol(that.data[item])
      if (value.length === 0) {
        let name = that.data.fieldMaps[item]
        errors.length ? errors : errors.push(name)
        return
      }
    })
    if (errors.length > 0) {
      wx.showModal({
        title: '提示信息',
        content: errors[0] + '不能为空',
        showCancel: false
      });
      return false;
    }
    // 合法性校验
    // 校验手机号
    if (!util.validLinkPhone(that.data.mobile)) {
      wx.showModal({
        title: '错误信息',
        content: '手机号有误,请重新输入',
        showCancel: false
      });
      return false;
    }
    wx.request({
      url: api.LoginUrl,
      data: {
        mobile: that.data.mobile,
        password: that.data.password
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.statusCode === 500) {
          wx.showModal({
            title: '提示信息',
            content: '网络错误500',
            showCancel: false
          });
        } else if (res.statusCode === 200) {
          let response = res.data
          if (!response.errno) {
            that.setData({
              'loginErrorCount': 0
            });
            wx.setStorage({
              key: "token",
              data: response.data.token,
              success: function () {
                wx.redirectTo({
                  url: '/pages/index/index'
                })
              }
            });
          } else {
            wx.showModal({
              title: '提示信息',
              content: response.errmsg || '登录异常',
              showCancel: false
            });
          }
        }        
      },
      fail: function (res) {
        let errmsg = res.errMsg
        let errmsgs = errmsg.split(':')
        let tips = '网络异常'
        switch (errmsgs[1]) {
          case 'fail timeout': 
            tips = '登录超时或网络异常';
            break;
          default:
        }
        wx.showModal({
          title: '提示信息',
          content: tips,
          showCancel: false
        });
      }
    });
  },
  bindMobileInput: function (e) {
    this.setData({
      mobile: e.detail.value
    });
  },
  bindPasswordInput: function (e) {
    this.setData({
      password: e.detail.value
    });
  },
  clearInput: function (e) {
    switch (e.currentTarget.id) {
      case 'clear-username':
        this.setData({
          mobile: ''
        });
        break;
      case 'clear-password':
        this.setData({
          password: ''
        });
        break;
      default:
    }
  }
})