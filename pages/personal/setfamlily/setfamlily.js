var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    appellation:'',
    mobile:'',
    address: ''
  },

  bindFamlilyNameInput:function(e){
    this.setData({
      name:e.detail.value
    });
  },

  bindfamlilyAppellationInput: function (e) {
    this.setData({
      appellation: e.detail.value
    });
  },

  bindfamlilyAdressInput: function (e) {
    this.setData({
      address: e.detail.value
    });
  },

  bindfamlilyMobileInput: function (e) {
    this.setData({
      mobile: e.detail.value
    });
  },

  clearInput:function(e){
    switch (e.currentTarget.id){
      case 'clear-famlilyName':
        this.setData({
          name: ''
        });
      break;
      case 'clear-famlilyAppellation':
        this.setData({
          appellation:''
        });
      break;
      case 'clear-famlilyMobile':
        this.setData({
          mobile:''
        })
      break;
      case 'clear-famlilyAdress':
        this.setData({
          address:''
        })
      break;
      default:
    }
  },

  startSave: function () {
    let that = this
    if (that.data.name.length == 0) {
      wx.showModal({
        title: '提示信息',
        content: '姓名不能为空,请重新输入'
      })
      return false;
    }
    if (that.data.appellation.length == 0) {
      wx.showModal({
        title: '提示信息',
        content: '称谓不能为空,请重新输入'
      })
      return false;
    }
    if (!util.validLinkPhone(that.data.mobile)) {
      wx.showModal({
        title: '提示信息',
        content: '手机号输入有误,请重新输入'
      })
      return false;
    }
    if (that.data.address.length == 0) {
      wx.showModal({
        title: '提示信息',
        content: '联系地址不能为空,请重新输入'
      })
      return false;
    }
    const token = wx.getStorageSync('token')
    wx.request({
      url: api.AddsetFamlily,
      method: 'post',
      header: {
        'content-type': 'application/json',
        'x-kzhhr-token': token
      },
      data: {
        name: that.data.name,
        appellation: that.data.appellation,
        mobile: that.data.mobile,
        address: that.data.address
      },
      success: function () {
        wx.redirectTo({
          url: '../../personal/personal',
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})