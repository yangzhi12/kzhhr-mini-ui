App({
  onLaunch: function () {
    try {
      // this.globalData.userInfo = JSON.parse(wx.getStorageSync('userInfo'));
      this.globalData.token = wx.getStorageSync('token');
    } catch (e) {
      console.log(e);
    }
  },
  globalData: {
    userInfo: {
      nickname: '点击登录',
      avatar: '/static/images/default_avatar.png'
    },
    token: '',
  }
})