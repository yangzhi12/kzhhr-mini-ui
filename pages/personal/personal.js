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
    resume_attachmentlist: [],
    credit_attachmentlist: [],
    familylist: [],
    
    name: '',
    appellation: '',
    mobilefam: '',
    address: '',
    famtotal:0,
    resp:{}
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
      gender: userInfo.gender,
      gendername: util.getGenderName(userInfo.gender), 
      mobile: userInfo.mobile,
      certificate: userInfo.certificate,
      weixinno: userInfo.weixin_no,
      level: userInfo.level,
      levelname: util.getLevelName(userInfo.level),
      statename: userInfo.state,
      statename: util.getStateName(userInfo.state),
      isreferee: userInfo.register_type,
      registertype: util.getRefereeName(userInfo.register_type),
      refereename: userInfo.register_type === 'REF' ? userInfo.refereename : null,
      refereemobile: userInfo.register_type === 'REF' ? userInfo.refereemobile : null,
      email: userInfo.email || '',
      address: userInfo.address || '',
      bankaddress: userInfo.bankaddress || '',
      bankno: userInfo.bankno || '' ,
      // 个人简历
      resume_attachmentlist: userInfo.attachmentlist ? 
      userInfo.attachmentlist.filter(
        (item) => {
          return item.category === '000'
        }
      ) : [],
      // 个人征信
      credit_attachmentlist: userInfo.attachmentlist ?
        userInfo.attachmentlist.filter(
          (item) => {
            return item.category === '010'
          }
      ) : [],
      // 家庭成员
      familylist: userInfo.familylist
    })
  },
  // 显示大图
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
        let url = i.downloadurl
        imagepaths.push(url)
      })
      // 预览图片
      wx.previewImage({
        current: item.downloadurl,
        urls: imagepaths
      })
    } else {
      // 预览其他格式的文件 
      let url = item.downloadurl
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
  // 判断文件类型
  fileTypeIsImage: function (item) {
    return item.type === 'image'
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
