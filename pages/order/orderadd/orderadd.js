var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
Page({
  data: {
    contractname: '',
    contractvalue: '',
    recommendvalue: '',
    contractstart: '',
    contractend: '',
    plan: '',
    plans: [],
    planitems: [{
      value: '0000000',
      name: '平台基础服务',
      checked: true
    }, {
      value: '1000000',
      name: '配电室带电巡检',
      checked: true
    }, {
      value: '1000100',
      name: '配电设施设备维保',
      checked: true
    }, {
      value: '1000200',
      name: '配电设备预防性试验',
      checked: true
    }, {
      value: '1000300',
      name: '配电设施设备应急抢修保障',
      checked: true
    }, {
      value: '1000400',
      name: '能效管理',
      checked: true
    }, {
      value: '2000000',
      name: '包含平台基础服务、线下维护服务、应急抢修保障',
      checked: true
    }],
    itemtypes: [],
    industries: [{
      id: '0100',
      name: '居民'
    }, {
      id: '1101',
      name: '一般工业'
    }, {
      id: '1102',
      name: '综合商业体'
    }, {
      id: '1103',
      name: '餐饮业'
    }, {
      id: '1104',
      name: '酒店住宿业'
    }, {
      id: '1105',
      name: '修理修配业'
    }, {
      id: '1106',
      name: '金融服务业'
    }, {
      id: '1107',
      name: '其他'
    }, {
      id: '1200',
      name: '大工业'
    }],
    industry: '1100',
    industryindex: 1,
    voltages: [
      {
        id: '00',
        name: '0.4kV'
      },
      {
        id: '01',
        name: '10kV'
      },
      {
        id: '02',
        name: '35kV'
      },
      {
        id: '03',
        name: '110kV'
      },
      {
        id: '04',
        name: '220kV'
      },
      {
        id: '05',
        name: '220kV以上'
      }
    ],
    voltage: '01',
    voltageindex: 1,
    substationtypes: [
      {
        value: '00',
        name: '室内配电站',
        checked: false
      },
      {
        value: '01',
        name: '室外配电站',
        checked: false
      }
    ],
    plannos: [
      {
        value: '00',
        name: '基础',
        checked: false
      },
      {
        value: '10',
        name: '定制',
        checked: false
      },
      {
        value: '20',
        name: '托管',
        checked: false
      }
    ],
    startdate: '',
    enddate: '',
    fieldMaps: {
      contractname: '客户名称',
      substationtype: '配电站形式',
      plan: '服务方案',
      startdate: '合同起止日期'
    },
    issaving: false,
    // contractfile: null,
    contractfiles: [],
    transformer: '',
    transformercount: '',
    substationtype: '',
    lowvoltagecount: '',
    wiringdiagrams: []
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
  // 绑定行业选择
  bindPickerIndustryChange: function (e) {
    this.setData({
      industryindex: e.detail.value,
      industry: this.data.industries[e.detail.value].id
    })
    this.autoCalculateValue()
  },
  // 绑定电压选择
  bindPickerVoltageChange: function (e) {
    this.setData({
      voltageindex: e.detail.value,
      voltage: this.data.voltages[e.detail.value].id
    })
  },
  // 变压器数量
  bindTransformerCountInput: function (e) {
    this.setData({
      transformercount: e.detail.value
    })
  },
  // 低压柜个数
  bindLowvoltageCountInput: function (e) {
    this.setData({
      lowvoltagecount: e.detail.value
    })
  },
  // 选择配电站形式时触发
  substationtypeChange: function (e) {
    this.setData({
      substationtype: e.detail.value
    })
  },
  // 选择方案时触发
  serviceplanChange: function (e) {
    let plan = e.detail.value
    let plans = this.data.planitems.filter(item => {
      let indexno = item['value'].substr(0, 2)
      return indexno === plan
    })
    // 设置服务产品待选列表
    this.setData({
      itemtypes: plans,
      plans: plans
    })
    // 遍历产品明细，初始化与后台服务接口参数plan(逗号分隔产品明细编号的字符串)
    let curplanitems = []
    this.data.itemtypes.map(item => {
      curplanitems.push(item.value)
    })
    this.setData({
      plan: curplanitems.join(',')
    })
    this.autoCalculateValue()
  },
  // 方案条款选择改变时触发
  itemtypesChange: function (e) {
    let selected = e.detail.value
    if (selected.length === 0) {
      let plannos = this.data.plannos.map(item => {
        return Object.assign(item, {
          value: item.value,
          name: item.name,
          checked: false
        })
      })
      this.setData({
        plannos: plannos,
        plans: []
      })
    }
    this.setData({
      plan: selected.join(',')
    })
    this.autoCalculateValue()
  },
  bindDateSelectedChange: function (e) {
    this.setData({
      startdate: e.detail.value
    })
    // 计算合同截止时间(间隔一年)
    let startdate = new Date(this.data.startdate)
    let enddate = util.formatTime(new Date(startdate.setYear(startdate.getFullYear() + 3)))
    this.setData({
      enddate: enddate.substr(0, 10)
    })
    this.autoCalculateValue()
  },
  bindContractnameInput: function (e) {
    let value = e.detail.value;
    this.setData({
      contractname: value
    })
  },
  bindTransformerInput: function (e) {
    let value = e.detail.value;
    this.setData({
      transformer: value
    })
    this.autoCalculateValue()
  },
  clearInput: function (e) {
    switch (e.currentTarget.id) {
      case 'clear-contractname':
        this.setData({
          contractname: ''
        });
        break;
      case 'clear-transformer':
        this.setData({
          transformer: ''
        });
        break;
      case 'clear-contractfile':
        this.setData({
          contractfile: null
        });
        break;
      case 'clear-transformercount':
        this.setData({
          transformercount: ''
        });
        break;
      case 'clear-lowvoltagecount':
        this.setData({
          lowvoltagecount: ''
        });
      default:
    }
  },
  // 根据变压器容量、所属行业、服务方案自动计算合同金额
  autoCalculateValue: function (e) {
    let that = this
    let industry = that.data.industry
    let transformer = that.data.transformer
    let plan = that.data.plan
    let startdate = that.data.startdate
    if (industry && transformer && plan && startdate) {
      // 如果变压器容量不为数字则退出
      if (!isNaN(transformer)) {
        try {
          const token = wx.getStorageSync('token')
          if (token) {
            wx.request({
              url: api.OrderMoney,
              method: 'post',
              header: {
                'x-kzhhr-token': token
              },
              data: {
                plan: plan.substr(0, 2),
                transformer: transformer,
                industry: industry
              },
              success: function (res) {
                if (res.statusCode === 200) {
                  let response = res.data
                  if (response.errorno) {
                  } else {
                    that.setData({
                      contractvalue: response.data.recommendfee * 3,
                      recommendvalue: response.data.recommendfee
                    })
                  }
                } else {
                }
              }
            })
          }
        } catch (error) {

        }
      }
    }
  },
  saveContract: function () {
    const that = this;
    let errors = [];
    // 设置合同起止时间（时间戳）
    if (that.data.startdate) {
      that.setData({
        contractstart: (new Date(that.data.startdate)).getTime(),
        contractend: (new Date(that.data.enddate)).getTime()
      })
    }
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
    // 变压器台数
    if (!that.data.transformercount) {
      wx.showModal({
        title: '错误信息',
        content: '变压器台数不能为空',
        showCancel: false
      });
      return false;
    }
    // 低压柜个数
    if (!that.data.lowvoltagecount) {
      wx.showModal({
        title: '错误信息',
        content: '低压柜个数不能为空',
        showCancel: false
      });
      return false;
    }
    // 变压器总容量
    if (!that.data.transformer) {
      wx.showModal({
        title: '错误信息',
        content: '变压器总容量不能为空',
        showCancel: false
      });
      return false;
    }
    // 变压器台数
    if (isNaN(that.data.transformercount)) {
      wx.showModal({
        title: '错误信息',
        content: '变压器台数有误,请重新输入',
        showCancel: false
      });
      return false;
    }
    // 低压柜个数
    if (isNaN(that.data.lowvoltagecount)) {
      wx.showModal({
        title: '错误信息',
        content: '低压柜个数有误,请重新输入',
        showCancel: false
      });
      return false;
    }
    // 变压器总容量为数字
    if (isNaN(that.data.transformer)) {
      wx.showModal({
        title: '错误信息',
        content: '变压器总容量有误,请重新输入',
        showCancel: false
      });
      return false;
    }
    // 合同附件不能为空
    if (that.data.contractfiles.length === 0) {
      wx.showModal({
        title: '错误信息',
        content: '请上传合同扫描件',
        showCancel: false
      });
      return false;
    }
    // 电气主接线图不能为空
    if (that.data.wiringdiagrams.length === 0) {
      wx.showModal({
        title: '错误信息',
        content: '请上传电气主接线图扫描件',
        showCancel: false
      });
      return false;
    }
    if (!that.data.contractvalue || !that.data.recommendvalue) {
      wx.showModal({
        title: '提示信息',
        content: '合同金额计算异常',
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
        url: api.OrderAdd,
        data: {
          contractname: that.data.contractname,
          industry: that.data.industry,
          voltage: that.data.voltage,
          transformer: that.data.transformer,
          plan: that.data.plan,
          contractvalue: that.data.contractvalue,
          recommendvalue: that.data.recommendvalue,
          contractstart: that.data.contractstart,
          contractend: that.data.contractend,
          contractfiles: that.data.contractfiles,
          substationtype: that.data.substationtype,
          transformercount: that.data.transformercount,
          lowvoltagecount: that.data.lowvoltagecount,
          wiringdiagrams: that.data.wiringdiagrams
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
                content: '合同保存成功',
                showCancel: false,
                success(tipok) {
                  if (tipok.confirm) {
                    // wx.redirectTo({
                    //   url: '/pages/order/order'
                    // })
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
            return Object.assign(item, { no: that.data.contractfiles.length + index + 1 })
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
                    return file.no === that.data.contractfiles.length + index + 1 ? Object.assign(file, { downloadurl: d, category: '000' }) : file
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
            return Object.assign(item, { no: that.data.wiringdiagrams.length + index + 1 })
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
                    return file.no === that.data.wiringdiagrams.length + index + 1 ? Object.assign(file, { downloadurl: d, category: '010' }) : file
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