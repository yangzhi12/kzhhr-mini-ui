// pages/personal/setpwd/setpassword.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    oldpassword: '',
    newpassword: '',
    confirmpassword: '',
    issaving: false,
    fieldMaps: {
      oldpassword: '原密码',
      newpassword: '新密码',
      confirmpassword: '确认新密码'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /**
   * 保存密码
   */
  savePwd: function () {
    let that = this
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
    if (that.data.newpassword != that.data.confirmpassword) {
      wx.showModal({
        title: '提示信息',
        content: '两次输入的新密码不一致',
        showCancel: false
      });
      return false;
    }
    if (!that.issaving) {
      // 如果正在保存则不多次提交
      that.setData({
        issaving: true
      })
      const header = util.reqHeader()
      const reqParams = Object.assign({},{
        id: that.data.id,
        oldpassword: that.data.oldpassword,
        newpassword: that.data.newpassword,
        confirmpassword: that.data.confirmpassword,
      })
      const reqSetpwd = util.sendRrquest(api.ModifyPwd, 'POST', reqParams, header)
      reqSetpwd.then(res => {
        that.setData({
          issaving: false
        })
        const response = res.data
        if (response.errno) {
          wx.showModal({
            title: '提示信息',
            content: response.errmsg,
            showCancel: false
          });
        } else {
          wx.showModal({
            title: '提示信息',
            content: '密码修改成功',
            showCancel: false,
            success: function () {
              wx.clearStorageSync()
              wx.reLaunch({
                url: '/pages/login/login'
              })
            }
          });
        }
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindOldPasswordInput: function (e) {
    let value = e.detail.value;
    this.setData({
      oldpassword: value
    })
  },
  bindNewPasswordInput: function (e) {
    let value = e.detail.value;
    this.setData({
      newpassword: value
    })
  },
  bindConfirmPasswordInput: function (e) {
    let value = e.detail.value;
    this.setData({
      confirmpassword: value
    })
  },
  clearInput: function (e) {
    switch (e.currentTarget.id) {
      case 'clear-password-old':
        this.setData({
          oldpassword: ''
        });
        break;
      case 'clear-password-new':
        this.setData({
          newpassword: ''
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