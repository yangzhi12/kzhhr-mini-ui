var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    gender: '',
    gendername: '',
    mobile: '',
    weixinno: '',
    level: '',
    levelname: '',
    state: '',
    statename: '',
    email: '',
    bankno: '',
    bankaddress: '',
    address: '',
    contractfiles: [],
    wiringdiagrams: [],
    resp: [],
    itemname: {},
    itemapp: {},
    itemmobile: {},
    itemadress: {},

    id: 0,
    idno:0
  },

  // 阻止新增家庭成员再次上传
  preventNewFamlily:function(){
    console.log('test for newFamlily')
  },

  // 查询个人资料
  getPersonalInfo() {
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
          success: function(res) {
            if (res.statusCode === 200) {
              // console.log(res.data);
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
  assignUIData(userInfo) {
    let _this = this
    // 设置用户名称
    _this.setData({
      id: userInfo.id,
      username: userInfo.username,
      gender: userInfo.gender,
      gendername: util.getGenderName(userInfo.gender), 
      mobile: userInfo.mobile,
      weixinno: userInfo.weixin_no,
      level: userInfo.level,
      levelname: util.getLevelName(userInfo.level),
      state: userInfo.state,
      statename: util.getStateName(userInfo.state),
      email: userInfo.email,
      address: userInfo.address,
      bankaddress: userInfo.bankaddress,
      bankno: userInfo.bankno,
      // 个人简历
      resumes: [],
      // 个人征信
      credits: []
    })
  },

  startSubmit: function(res) {
    let reemail = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
    let that = this
    if (that.data.level > 0) {
      if (!reemail.test(that.data.email)) {
        wx.showModal({
          title: '提示信息',
          content: '邮箱输入有误，请重新输入',
        })
        return false;
      }
      if (!that.data.bankno) {
        wx.showModal({
          title: '提示信息',
          content: '银行卡号不能为空，请重新输入',
        })
        return false;
      }
      if (!util.luhnCheck(that.data.bankno)) {
        wx.showModal({
          title: '提示信息',
          content: '银行卡号输入有误，请重新输入',
        })
        return false;
      }
      if (!that.data.bankaddress) {
        wx.showModal({
          title: '提示信息',
          content: '开户行地址不能为空，请重新输入',
        })
        return false;
      }
    }
    if (that.data.level > 10) {
      // 个人简历不能为空
      if (that.data.contractfiles.length === 0) {
        wx.showModal({
          title: '错误信息',
          content: '请上传个人简历扫描件',
          showCancel: false
        });
        return false;
      }
    }
    if (that.data.level > 20) {
      if (!that.data.address) {
        wx.showModal({
          title: '提示信息',
          content: '家庭地址不能为空，请重新输入',
        })
        return false;
      }
    }
    if (that.data.level > 30) {
      if (that.data.resp.length == 0) {
        wx.showModal({
          title: '提示信息',
          content: '家庭成员信息不能为空，请重新输入',
        })
        return false;
      }
    } 
    if (that.data.level > 40) {
      // 个人征信证明不能为空
      if (that.data.wiringdiagrams.length === 0) {
        wx.showModal({
          title: '错误信息',
          content: '请上传个人征信证明扫描件',
          showCancel: false
        });
        return false;
      }
    }    
    const token = wx.getStorageSync('token')
    wx.request({
      url: api.CompleteFamlily,
      method: 'post',
      header: {
        'x-kzhhr-token': token
      },
      data: that.getData(),
      success: function() {
        wx.redirectTo({
          url: '../../personal/personal',
        })
      },
      fail: function () {
        wx.showModal({
          title: '提示信息',
          content: '网络异常',
          showCancel: false
        })
      }
    })
  },

  getData: function() {
    let that = this
    let data = {}
    // 当钻级大于0时,所需完善的资料为:邮箱、银行卡信息
    if (that.data.level > 0) {
      Object.assign(data, {
        email: that.data.email,
        bankno: that.data.bankno,
        bankaddress: that.data.bankaddress,
        level: that.data.level
      })
    }
    // 当钻级大于1时,所需完善的资料为:个人简历
    if (that.data.level > 1) {
      Object.assign(data, {
        resume_attachmentlist: that.data.contractfiles,
      })
    }
    // 当钻级大于2时,所需完善的资料为:家庭住址
    if (that.data.level > 2) {
      Object.assign(data, {
        address: that.data.address,
      })
    }
    // 当钻级大于3时,所需完善的资料为:家庭成员
    // if (that.data.level > 3) {
    //   Object.assign(data, {
        
    //   })
    // }
    // 当钻级大于4时,所需完善的资料为:个人征信
    if (that.data.level > 4) {
      Object.assign(data, {
        credit_attachmentlist: that.data.wiringdiagrams
      })
    }
    return data
  },
  nameChange: function(event) {
    let nameId = event.currentTarget.dataset.item.id
    let updatename = event.currentTarget.dataset.item.name
    let updateappellation = event.currentTarget.dataset.item.appellation
    let updateaddress = event.currentTarget.dataset.item.address
    let updatemobile = event.currentTarget.dataset.item.mobile
    wx.redirectTo({
      url: "../updatefamlily/updatefamlily?id=" + nameId + "&name=" + updatename + "&appel=" + updateappellation + "&address=" + updateaddress + "&mobile=" + updatemobile
    })
  },

  deletefaminfo:function(e){
    let that = this
    const token = wx.getStorageSync('token')
    let idnum = e.currentTarget.dataset.item.id
    wx.request({
      url: api.DeleteFamlily,
      method: 'post',
      header: {
        'content-type': 'application/json',
        'x-kzhhr-token': token
      },
      data: {
        id: idnum
      },
      success: function () {
        wx.redirectTo({
          url: "/pages/personal/modifyinfo/modifyinfo",
        })
      }
    })
  },

  getFamInfo() {
    let that = this
    const token = wx.getStorageSync('token')
    if (token) {
      wx.request({
        url: api.PersonnalFam,
        method: 'get',
        header: {
          'x-kzhhr-token': token
        },
        success: function(res,item) {
          let resp = res.data
          console.log(resp)
          that.setData({
            resp: resp,
            famtotal: resp.length,
            //idno:resp[item].id
          })
        }
      })
    }
  },


  bindEmailInput: function(e) {
    this.setData({
      email: e.detail.value
    });
  },

  bindBanknoInput: function(e) {
    this.setData({
      bankno: e.detail.value
    });
  },

  bindbankAddressInput: function(e) {
    this.setData({
      bankaddress: e.detail.value
    })
  },

  bindAddressInput: function(e) {
    this.setData({
      address: e.detail.value
    })
  },

  bindItemNameInput: function(e) {
    this.setData({
      itemname: e.detail.value
    })
  },

  bindItemAppInput: function(e) {
    this.setData({
      itemapp: e.detail.value
    })
  },

  bindItenMobileInput: function(e) {
    this.setData({
      itemmobile: e.detail.value
    })
  },

  bindItemAdressInput: function(e) {
    this.setData({
      itemadress: e.detail.value
    })
  },

  clearInput: function(e) {
    switch (e.currentTarget.id) {
      case 'clear-email':
        this.setData({
          email: ''
        });
        break;
      case 'clear-bankno':
        this.setData({
          bankno: ''
        });
        break;
      case 'clear-bankaddress':
        this.setData({
          bankaddress: ''
        });
        break;
      case 'clear-address':
        this.setData({
          address: ''
        });
        break;
      case 'clear-itemname':
        this.setData({
          itemname: ''
        })
        break;
      case 'clear-itemappellation':
        this.setData({
          itemapp: ''
        })
        break;
      case 'clear-itemmobile':
        this.setData({
          itemmobile: ''
        })
        break;
      case 'clear-itemaddress':
        this.setData({
          itemadress: ''
        })
        break;
      default:
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getPersonalInfo()
    this.getFamInfo()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  uploadcontract: function () {
    let that = this
    wx.chooseMessageFile({
      count: 10,
      type: 'all',
      success(res) {
        let msgflag = res.errMsg
        if (msgflag.split(':').includes('ok')) {
          let files = res.tempFiles
          files.map((item, index) => {
            return Object.assign(item, {
              no: that.data.contractfiles.length + index + 1
            })
          })
          let requests = []
          files.map(file => {
            requests.push(util.fileuploadRrquest(api.FileUpload, file.path))
          })
          Promise.all(requests).then(res => {
            let contractfiles = []
            let r = res.map((url, index) => {
              if (url.errMsg.split(':').includes('ok')) {
                let d = url.data
                if (d.indexOf('http') !== -1) {
                  d = d.replace('http', 'https')
                  contractfiles = files.map(file => {
                    return file.no === that.data.contractfiles.length + index + 1 ? Object.assign(file, {
                      downloadurl: d,
                      category: '000'
                    }) : file
                  })
                }
              }
            })
            that.setData({
              contractfiles: that.data.contractfiles.concat(contractfiles)
            })
          })
        }
      }
    })
  },
  uploadwiringdiagram: function () {
    let that = this
    wx.chooseMessageFile({
      count: 10,
      type: 'all',
      success(res) {
        let msgflag = res.errMsg
        if (msgflag.split(':').includes('ok')) {
          let files = res.tempFiles
          files.map((item, index) => {
            return Object.assign(item, {
              no: that.data.wiringdiagrams.length + index + 1
            })
          })
          let requests = []
          files.map(file => {
            requests.push(util.fileuploadRrquest(api.FileUpload, file.path))
          })
          Promise.all(requests).then(res => {
            let wiringdiagrams = []
            let r = res.map((url, index) => {
              if (url.errMsg.split(':').includes('ok')) {
                let d = url.data
                if (d.indexOf('http') !== -1) {
                  d = d.replace('http', 'https')
                  wiringdiagrams = files.map(file => {
                    return file.no === that.data.wiringdiagrams.length + index + 1 ? Object.assign(file, {
                      downloadurl: d,
                      category: '010'
                    }) : file
                  })
                }
              }
            })
            that.setData({
              wiringdiagrams: that.data.wiringdiagrams.concat(wiringdiagrams)
            })
          })
        }
      }
    })
  },
  clearFile: function (e) {
    const no = e.currentTarget.id
    let files = this.data.contractfiles
    const curfiles = files.filter(file => {
      return `${file.no}` !== `${no}`
    })
    this.setData({
      contractfiles: curfiles
    })
  },
  clearWiringdiagramFile: function (e) {
    const no = e.currentTarget.id
    let files = this.data.wiringdiagrams
    const curfiles = files.filter(file => {
      return `${file.no}` !== `${no}`
    })
    this.setData({
      wiringdiagrams: curfiles
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
  // 判断文件类型
  fileTypeIsImage: function (item) {
    return item.type === 'image'
  }
})