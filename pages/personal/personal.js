var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp()

Page({
  data: {
    id: '',
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
    isreferee: '',
    email:'',
    bankno:'',
    bankaddress:'',
    
    name: '',
    appellation: '',
    mobilefam: '',
    address: '',
    famtotal:0,
    resp:{},
    wiringdiagrams:[],
    contractfiles:[]

  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 页面渲染完成
  },
  onReady: function() {
    
  },
  onShow: function() {
    // 页面显示
    this.getPersonalInfo()
    this.getfamInfo()
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
      console.log(token)
      if (token) {
        wx.request({
          url: api.PersonalUrl,
          method: 'get',
          header: {
            'x-kzhhr-token': token
          },
          success: function (res) {
            if (res.statusCode === 200) {
              console.log(res.data);
              let response = res.data
              that.assignUIData(response)              
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
      id: userInfo.id,
      username: userInfo.username,
      gender:userInfo.gender,
      mobile: userInfo.mobile,
      certificate: userInfo.certificate,
      weixinno: userInfo.weixin_no,
      level: util.getLevelName(userInfo.level),
      state: util.getStateName(userInfo.state),
      isreferee: userInfo.register_type,
      registertype: util.getRefereeName(userInfo.register_type),
      refereename: userInfo.register_type === 'REF' ? userInfo.refereename : null,
      refereemobile: userInfo.register_type === 'REF' ? userInfo.refereemobile : null,
      email: userInfo.email,
      address: userInfo.address,
      bankaddress: userInfo.bankaddress,
      bankno: userInfo.bankno,
      wiringdiagrams: userInfo.wiringdiagrams,
      contractfiles: userInfo.contractfiles
    
    })
  },

  //查询家庭成员
  getfamInfo(){
    let that = this
    const token = wx.getStorageSync('token')
    if (token) {
      wx.request({
        url: api.PersonnalFam,
        method: 'get',
        header: {
          'x-kzhhr-token': token
        },
        success:function(res){
          console.log(res)
          let resp = res.data
          console.log(resp)
          let index = Object.keys(resp)
          console.log(index)
          that.setData({
            resp:resp,
            famtotal:resp.length,
          })    
        },
        fail:function(){
          wx.showModal({
            title: '提示信息',
            content: '查询家庭成员失败',
            showCancel: false
          })
        }
      })
    }
  },

  showZoomFile: function (e) {
    const dataset = e.currentTarget.dataset
    const items = dataset.files
    const item = dataset.file
    if (this.fileTypeIsImage(item)) {
      // 获取图片列表
      let images = items.filter(i => {
        return i.type === 'image'
      })
      let imagepaths = []
      images.map(i => {
        let url = i.path
        imagepaths.push(url)
      })
      // 预览图片
      wx.previewImage({
        current: item.path,
        urls: imagepaths
      })
    } else {
      // 预览其他格式的文件 
      let url = item.path
      wx.downloadFile({
        url: url,
        success(res) {
          const filePath = res.tempFilePath
          wx.openDocument({
            filePath,
            success(res) {
              console.log('打开文档成功')
            }
          })
        }
      })
    }
  },

  /**
   * 点击修改密码触发
   */
  setpassword: function (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/personal/setpwd/setpassword?id=${id}`
    })
  },
  /**
   * 点击完善资料时触发
   */
  modifyinfo: function (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/personal/modifyinfo/modifyinfo?id=${id}`
    })
  }
})
