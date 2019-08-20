var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp();
Page({
  data: {    
    test: null,
    quarter: {
      QT: 0,
      QN: 0,
      QP: 0,
      YT: 0,
      YN: 0,
      YP: 0,
      RT: 0,
      RN: 0,
      RP: 0
    },
    currentquarter: 'Q1',
    years: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029],
    selectedyear: 2019,
    yearsshow: true,
    team: [],
    stats: ['Q', 'Y', 'R'],
    // relation: {
    //   id: 1,
    //   name: '张',
    //   children: [
    //     {
    //       id: 2,
    //       name: '2张'
    //     },
    //     {
    //       id: 3,
    //       name: '3张',
    //       children: [
    //         {
    //           id: 6,
    //           name: '6张31',
    //         },
    //         {
    //           id: 7,
    //           name: '7张32',
    //         }
    //       ]
    //     },
    //     {
    //       id: 4,
    //       name: '4张'
    //     },
    //     {
    //       id: 5,
    //       name: '5张',
    //     children: [
    //       {
    //         id: 8,
    //         name: '8张51',
    //       },
    //       {
    //         id: 9,
    //         name: '9张52',
    //         children: [
    //           {
    //             id: 10,
    //             name: '10张521',
    //             children: [
    //               {
    //                 id: 11,
    //                 name: '11张101',
    //               },
    //               {
    //                 id: 12,
    //                 name: '12张102',
    //               }
    //             ]
    //           },
    //           {
    //             id: 5,
    //             name: '10张522'
    //           }
    //         ]
    //       },
    //       {
    //         id: 13,
    //         name: '13张522',
    //         children: [
    //           {
    //             id: 14,
    //             name: '14张521',
    //             children: [
    //               {
    //                 id: 15,
    //                 name: '15张101',
    //               },
    //               {
    //                 id: 16,
    //                 name: '16张102',
    //               }
    //             ]
    //           },
    //           {
    //             id: 17,
    //             name: '17张522'
    //           }
    //         ]
    //       }
    //     ]
    //     }
    //   ]
    // }
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 页面渲染完成
  },
  onReady: function () {
  },
  onShow: function () {
    // 页面显示
    this.setData({
      selectedyear: this.data.years[0],
      currentquarter: 'Q1'
    })
    this.getOrderIndex()
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  // 季度签单量汇总
  getTeamStatQ() {
    let that = this
    let year = that.data.selectedyear
    let data = {
      year: year,
      quarter: that.data.currentquarter.substr(1, 1)
    }
    try {
      const token = wx.getStorageSync('token')
      if (token) {
        wx.request({
          url: api.TeamStatQ,
          method: 'post',
          header: {
            'x-kzhhr-token': token
          },
          data: data,
          success: function (res) {
            if (res.statusCode === 200) {
              let response = res.data
              if (response.errorno) {
                wx.showModal({
                  title: '提示信息',
                  content: '服务异常',
                  showCancel: false
                });
              } else {
                let data = response.data
                Object.keys(data).map(item => {
                  if (item.substr(1, 1) === 'N') {
                    data[item] = that.getTwoDecimal(data[item])
                  }
                })
                that.setData({ quarter: data })
              }
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
  // 季度签单量列表
  getOrderStatQList() {
    let that = this
    let quarter = that.getQuarterIndex(that.data.currentquarter)
    let year = that.data.selectedyear
    let data = {
      year: year,
      quarter: quarter
    }
    try {
      const token = wx.getStorageSync('token')
      if (token) {
        wx.request({
          url: api.TeamStatQList,
          method: 'post',
          header: {
            'x-kzhhr-token': token
          },
          data: data,
          success: function (res) {
            if (res.statusCode === 200) {
              let response = res.data
              if (response.errorno) {
                wx.showModal({
                  title: '提示信息',
                  content: '服务异常',
                  showCancel: false
                });
              } else {
                let data = response.data
                that.setData({ team: data })
                that.reduceTeam()
              }
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
  //用户点击tab时调用
  titleClick: function (e) {
    this.setData({
      //拿到当前索引并动态改变
      currentquarter: e.currentTarget.dataset.idx,
      // 隐藏年份选择（如果显示则隐藏）
      yearsshow: true
    })
    this.getOrderIndex()
  },
  titleYearClick: function (e) {
    this.setData({
      yearsshow: !this.data.yearsshow
    })
  },
  tapMenuItem: function (e) {
    this.setData({
      selectedyear: e.currentTarget.dataset.index,
      yearsshow: !this.data.yearsshow,
      currentquarter: 'Q1'
    })
    this.getOrderIndex()
  },
  getQuarterIndex: function (quarter) {
    let index = 1
    switch (quarter) {
      case 'Q1':
        index = 1
        break;
      case 'Q2':
        index = 2
        break;
      case 'Q3':
        index = 3
        break;
      case 'Q4':
        index = 4
        break;
      default:
    }
    return index;
  },
  // 我的签单数据
  getOrderIndex: function () {
    this.getTeamStatQ() // 获取季度签单统计
    this.getOrderStatQList() // 获取季度签单列表
  },
  // 读取流程名称
  getApproveFlowNode: function (flowno) {
    return util.getApproveFlow('010')
  },
  // 截取两位小树
  getTwoDecimal: function (number) {
    let value = Number(number).toFixed(2)
    return value
  },
  // 团队成员归并
  reduceTeam: function () {
    let index = -1
    const team = this.data.team
    const user = wx.getStorageSync('user')
    // 设置根节点
    let root = team.filter((item) => {
      return item.id === user.id
    })
    let tree = util.traverseNodes(root, team)
    this.setData({
      relation: tree[0]
    })
  }
})