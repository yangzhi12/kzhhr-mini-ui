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
    planitems:[{
      value: '0000000',
      name: '平台基础服务',
      checked: true
    },{
        value: '1000000',
        name: '配电室带电巡检',
        checked: true
    },{
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
    itemtypes:[],
    industries: [{
      id: '00',
      name: '居民'
    }, {
        id: '01',
        name: '一般工商业'
      }, {
        id: '02',
        name: '大工业'
      }],
    industry: '00',
    industryindex: 0,
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
      }
    ],
    voltage: '00',
    voltageindex: 0,
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
      plan: '服务方案',
      startdate: '合同起止日期'
    },
    issaving: false
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
    let enddate = util.formatTime(new Date(startdate.setYear(startdate.getFullYear() + 1)))
    this.setData({
      enddate: enddate.substr(0, 10)
    })   
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
      default:
    }
  },
  // 根据变压器容量、所属行业、服务方案自动计算合同金额
  autoCalculateValue: function (e) {
    console.log('dsadklsa')
    let that = this
    let industry = that.data.industry
    let transformer = that.data.transformer
    let plan = that.data.plan
    if (industry && transformer && plan) {
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
                      contractvalue: response.data.fee,
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
    var that = this;
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
    // 变压器总容量
    if (!that.data.transformer) {
      wx.showModal({
        title: '错误信息',
        content: '变压器总容量不能为空',
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
          contractend: that.data.contractend
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
                    wx.redirectTo({
                      url: '/pages/order/order'
                    })
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
  }
})