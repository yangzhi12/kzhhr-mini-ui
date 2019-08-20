var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp();
Page({
  data: {
    process: 0,
    notifies: null,
    notices: null
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 页面渲染完成
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
  downloadfile: function () {
    const that = this
    // 下载合同
    try {
      const downloadTask = wx.downloadFile({        
        url: 'https://hhr.dianjuhui.com:3394/kzhhr/kzhhr/20190413/16/19/0/%E7%94%A8%E6%88%B7%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE.pdf',
        success(res) {
          if (res.statusCode === 200) {
            const filePath = res.tempFilePath
            wx.openDocument({
              filePath: filePath,
              fileType: 'pdf',
              success: function(res) {
                console.log('打开文档成功')
              }
            })
          }
        },
        fail(res) {
          wx.showModal({
            title: '提示信息',
            content: '下载失败',
            showCancel: false,
            success(tipok) { }
          })
        }
      })
      downloadTask.onProgressUpdate((res) => {
        that.setData({
          process: res.progress
        })
      })
    } catch (err) {
      wx.showModal({
        title: '提示信息',
        content: '网络异常',
        showCancel: false,
        success(tipok) {}
      })
    }
  },
  getNotifies: function () {
    // 获取最近10条通知公告信息
    let that = this
    const header = util.reqHeader()
    const reqNotify = util.sendRrquest(api.NotifyList, 'POST', {}, header)
    const reqNotice = util.sendRrquest(api.NoticeList, 'POST', {}, header)
    Promise.all([reqNotify, reqNotice]).then(res => {
      const notifiesRes = res[0].data
      const noticesRes = res[1].data
      if (!notifiesRes.errno) {
        that.setData({
          notifies: notifiesRes.data
        }) 
      }
      if (!noticesRes.errno) {
        that.setData({
          notices: noticesRes.data
        })
      }
    })
  },
  viewcontent: function (e) {
    const id = e.currentTarget.dataset.itemid
    wx.navigateTo({
      url: `/pages/focus/focuscontent/focuscontent?id=${id}`
    })
  }
})