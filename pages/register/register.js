var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp();
Page({
  data: {
    username: '',
    gender: '',
    genders: [
      { name: 'MALE', value: '男' },
      { name: 'FEMALE', value: '女' }
    ],
    mobile: '',
    certificate: '',
    weixinNo: '',
    registerType: '',
    registerTypes: [
      { name: 'NO_REF', value: '自荐' },
      { name: 'REF', value: '别人推荐' },
    ],
    refereeName: '',
    refereeMobile: '',
    password: '',
    confirmPassword: '',
    loginErrorCount: 0,
    fieldMaps: {
      username: '用户名',
      mobile: '手机号',
      certificate: '身份证号',
      weixinNo: '微信号',
      refereeName: '推荐人姓名',
      refereeMobile: '推荐人手机号',
      password: '密码',
      confirmPassword: '确认密码'
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
  startRegister: function () {
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
    // 当注册方式为非别人推荐时，去掉推荐人姓名和推荐人手机号的空值提示信息
    if ((!that.data.registerType
      || that.data.registerType === 'NO_REF')
      && (errors.includes(that.data.fieldMaps['refereeName'])
        || errors.includes(that.data.fieldMaps['refereeName']))) {
      errors.splice(0, 1)
    }
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
    // 校验身份证    
    if (!util.validPersonID(that.data.certificate)) {
      wx.showModal({
        title: '错误信息',
        content: '身份证号有误,请重新输入',
        showCancel: false
      });
      return false;
    }

    if (that.data.password.length < 3) {
      wx.showModal({
        title: '提示信息',
        content: '密码不得少于3位',
        showCancel: false
      });
      return false;
    }

    if (that.data.password != that.data.confirmPassword) {
      wx.showModal({
        title: '提示信息',
        content: '确认密码不一致',
        showCancel: false
      });
      return false;
    }
    wx.request({
      url: api.RegisterUrl,
      data: {
        username: that.data.username,
        password: that.data.password,
        mobile: that.data.mobile,
        certificate: that.data.certificate,
        weixinNo: that.data.weixinNo,
        gender: that.data.gender,
        registerType: that.data.registerType,
        refereeName: that.data.refereeName,
        refereeMobile: that.data.refereeMobile
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
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
            content: response.errMsg,
            showCancel: false
          });
        }
      }
    });
  },
  bindUsernameInput: function (e) {
    this.setData({
      username: e.detail.value
    });
  },
  genderChange: function (e) {
    let value = e.detail.value;
    this.setData({
      gender: value
    })
  },
  bindMobileInput: function (e) {
    let value = e.detail.value;
    this.setData({
      mobile: value
    })
  },
  bindCertificateInput: function (e) {
    let value = e.detail.value;
    this.setData({
      certificate: value
    })
  },
  bindWeixinNoInput: function (e) {
    let value = e.detail.value;
    this.setData({
      weixinNo: value
    })
  },
  bindRefereeNameInput: function (e) {
    let value = e.detail.value;
    this.setData({
      refereeName: value
    })
  },
  bindRefereeMobileInput: function (e) {
    let value = e.detail.value;
    this.setData({
      refereeMobile: value
    })
  },
  bindPasswordInput: function (e) {
    this.setData({
      password: e.detail.value
    });
  },
  bindConfirmPasswordInput: function (e) {
    this.setData({
      confirmPassword: e.detail.value
    });
  },
  registerTypeChange: function (e) {
    let value = e.detail.value;
    this.setData({
      registerType: value
    })
  },
  clearInput: function (e) {
    switch (e.currentTarget.id) {
      case 'clear-username':
        this.setData({
          username: ''
        });
        break;
      case 'clear-mobile':
        this.setData({
          mobile: ''
        });
        break;
      case 'clear-certificate':
        this.setData({
          certificate: ''
        });
        break;
      case 'clear-weixinno':
        this.setData({
          weixinNo: ''
        });
        break;
      case 'clear-refereename':
        this.setData({
          refereeName: ''
        });
        break;
      case 'clear-refereemobile':
        this.setData({
          refereeMobile: ''
        });
        break;
      case 'clear-password':
        this.setData({
          password: ''
        });
        break;
      case 'clear-confirm-password':
        this.setData({
          confirmPassword: ''
        });
        break;
      default:
    }
  }
})