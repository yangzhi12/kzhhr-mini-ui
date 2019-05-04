var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
Page({
  data: {
    process: 0,
    id: null,
    notify: {
      id: '',
      title: '',
      createtime: '',
      content: '' 
    }
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 页面渲染完成
    console.log(options)
    this.setData({
      id: options.id
    })
  },
  onReady: function () {
    // 页面准备完毕
  },
  onShow: function () {
    // 页面显示
    this.getNotifies()
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  getNotifies: function () {
    // 获取最近10条通知公告信息
    let that = this
    const header = util.reqHeader()
    const reqNotify = util.sendRrquest(api.NotifyInfo, 'POST', {id: that.data.id}, header)
    reqNotify.then(res => {
      const notifyRes = res.data
      if (!notifyRes.errno) {
        that.setData({
          notify: notifyRes.data
        }) 
      }
    })
  }
})