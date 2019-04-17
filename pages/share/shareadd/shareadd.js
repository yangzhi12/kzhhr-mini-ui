var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
Page({
  data: {
    address: '',
    name: '',
    latitude: '',
    longitude: '',
    peoples: '',    
    issaving: false,
    attachmentfiles: [],
    positionisok: false, // 标识地址是否成功定位
    locationing: false,  // 标识是否正在获取地址
    fieldMaps: {
      address: '所在位置'
    },
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
  // 参与人数
  bindpeoplesInput: function (e) {
    this.setData({
      peoples: e.detail.value
    })
  },
  clearInput: function (e) {
    switch (e.currentTarget.id) {
      case 'clear-peoples':
        this.setData({
          peoples: ''
        });
        break;
      default:
    }
  },
  saveShare: function () {
    const that = this;
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
    if (that.data.peoples.length === 0) {
      wx.showModal({
        title: '提示信息',
        content: '参与人数不能为空',
        showCancel: false
      });
      return false;
    }
    if (that.data.attachmentfiles.length === 0) {
      wx.showModal({
        title: '提示信息',
        content: '现场照片不能为空',
        showCancel: false
      });
      return false;
    }
    // 参与人数
    if (isNaN(that.data.peoples)) {
      wx.showModal({
        title: '错误信息',
        content: '参与人数有误,请重新输入',
        showCancel: false
      });
      return false;
    }
    that.setData({
      issaving: true
    })
    if (!that.issaving) {
      const token = wx.getStorageSync('token')
      wx.request({
        url: api.ShareAdd,
        data: {
          address: that.data.address,
          detailname: that.data.name,
          latitude: that.data.latitude,
          longitude: that.data.longitude,
          peoples: that.data.peoples,
          attachments: that.data.attachmentfiles
        },
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'x-kzhhr-token': token
        },
        success: function (res) {
          if (res.statusCode === 200) {
            let response = res.data
            if (!response.errno) {
              wx.showModal({
                title: '提示信息',
                content: '分享信息保存成功',
                showCancel: false,
                success(tipok) {
                  if (tipok.confirm) {
                    wx.navigateBack() // 路由出栈
                  }
                }
              });
            } else {
              wx.showModal({
                title: '提示信息',
                content: response.errmsg,
                showCancel: false
              });
              that.setData({
                issaving: false
              })
            }
          } else {
            wx.showModal({
              title: '提示信息',
              content: '网络异常',
              showCancel: false
            });
            that.setData({
              issaving: false
            })
          }
        }
      });
    } else {
      wx.showModal({
        title: '提示信息',
        content: '正在提交数据，请稍后...',
        showCancel: false
      });
      that.setData({
        issaving: false
      })
    }
  },
  uploadimage: function () {
    let that = this
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        let msgflag = res.errMsg
        if (msgflag.split(':').includes('ok')) {
          let files = res.tempFilePaths
          let tmpfiles = files.map((item, index) => {
            return Object.assign({}, { no: that.data.attachmentfiles.length + index + 1, path: item, category: '000' })
          })
          let requests = []
          tmpfiles.map((file, index) => {
            requests.push(util.fileuploadRrquest(api.FileUpload, file.path))
          })
          Promise.all(requests).then(res => {
            let attachmentfiles = []
            let r = res.map((url, index) => {
              if (url.errMsg.split(':').includes('ok')) {
                let d = url.data
                if (d.indexOf('http') !== -1) {
                  d = d.replace('http', 'https')
                  attachmentfiles = tmpfiles.map(file => {
                    return file.no === that.data.attachmentfiles.length + index + 1 ? Object.assign(file, { downloadurl: d }) : file
                  })
                }
              }
            })
            that.setData({
              attachmentfiles: that.data.attachmentfiles.concat(attachmentfiles)
            })
          })
        }
      }
    })
  },
  clearFile: function (e) {
    const no = e.currentTarget.id
    let files = this.data.attachmentfiles
    const curfiles = files.filter(file => {
      return `${file.no}` !== `${no}`
    })
    this.setData({
      attachmentfiles: curfiles
    })
  },
  // 显示大图
  showZoomFile: function (e) {
    const dataset = e.currentTarget.dataset
    const items = dataset.files
    const item = dataset.file
    let imagepaths = []
    items.map(i => {
      let url = i.path
      imagepaths.push(url)
    })
    // 预览图片
    wx.previewImage({
      current: item.path,
      urls: imagepaths
    })
  },
  // 手动定位
  locationAddress: function () {
    console.log(this.data.locationing)
    if (this.data.locationing) return
    this.curPosition()
  },
  // 获取地理位置
  curPosition: function () {
    // 选择位置
    const that = this
    that.setData({
      locationing: true,
      positionisok: false
    })
    wx.chooseLocation({
      complete(res) {
        let resflag = res.errMsg.split(':').includes('ok')
        if (resflag) {
          let {address, name, latitude, longitude} = res
          // 设置位置信息
          that.setData({
            address: address,
            name: name,
            latitude: latitude,
            longitude: longitude,
            positionisok: true,
            locationing: false
          })
        } else {
          that.setData({
            positionisok: false,
            locationing: false
          })
        }
      }
    })
  }
})