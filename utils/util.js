var api = require('../config/api.js')

var level = {
  '00': '业务员',
  '11': '一钻A',
  '12': '一钻B',
  '13': '一钻C',
  '14': '一钻D',
  '21': '二钻A',
  '22': '二钻B',
  '23': '二钻C',
  '24': '二钻D',
  '31': '三钻A',
  '32': '三钻B',
  '33': '三钻C',
  '34': '三钻D',
  '41': '四钻A',
  '42': '四钻B',
  '43': '四钻C',
  '44': '四钻D',
  '51': '五钻A',
  '52': '五钻B',
  '53': '五钻C',
  '54': '五钻D',
  '55': '五钻E'
}
var state = {
  '00': '注册未审核',
  '01': '注册已审核',
  '02': '注册未通过',
  '10': '一钻未审核',
  '11': '一钻已审核',
  '12': '一钻未通过',
  '20': '二钻未审核',
  '21': '二钻已审核',
  '22': '二钻未通过',
  '30': '三钻未审核',
  '31': '三钻已审核',
  '32': '三钻未通过',
  '40': '四钻未审核',
  '41': '四钻已审核',
  '42': '四钻未通过',
  '50': '五钻未审核',
  '51': '五钻已审核',
  '52': '五钻未通过'
}

var gender = {
  'MALE': '男',
  'FEMALE': '女'
}

var referee = {
  'REF': '自荐',
  'NO_REF': '合伙人推荐'
}

//校验银行卡号
function luhnCheck(bankno) {
  var lastNum = bankno.substr(bankno.length - 1, 1); //取出最后一位（与luhn进行比较）
  var first15Num = bankno.substr(0, bankno.length - 1); //前15或18位
  var newArr = new Array();
  for (var i = first15Num.length - 1; i > -1; i--) { //前15或18位倒序存进数组
    newArr.push(first15Num.substr(i, 1));
  }
  var arrJiShu = new Array(); //奇数位*2的积 <9
  var arrJiShu2 = new Array(); //奇数位*2的积 >9
  var arrOuShu = new Array(); //偶数位数组
  for (var j = 0; j < newArr.length; j++) {
    if ((j + 1) % 2 == 1) { //奇数位
      if (parseInt(newArr[j]) * 2 < 9) arrJiShu.push(parseInt(newArr[j]) * 2);
      else arrJiShu2.push(parseInt(newArr[j]) * 2);
    } else //偶数位
      arrOuShu.push(newArr[j]);
  }

  var jishu_child1 = new Array(); //奇数位*2 >9 的分割之后的数组个位数
  var jishu_child2 = new Array(); //奇数位*2 >9 的分割之后的数组十位数
  for (var h = 0; h < arrJiShu2.length; h++) {
    jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
    jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
  }

  var sumJiShu = 0; //奇数位*2 < 9 的数组之和
  var sumOuShu = 0; //偶数位数组之和
  var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
  var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
  var sumTotal = 0;
  for (var m = 0; m < arrJiShu.length; m++) {
    sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
  }

  for (var n = 0; n < arrOuShu.length; n++) {
    sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
  }

  for (var p = 0; p < jishu_child1.length; p++) {
    sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
    sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
  }
  //计算总和
  sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);

  //计算luhn值
  var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
  var luhn = 10 - k;

  if (lastNum == luhn) {
    　return true;
  } else {
    return false;
  }
}

// 获取流程节点
function getApproveFlow(flowno) {
  //substr(start,length)
  let flowFlag = flowno.substr(0, 2)
  let flows = {
    '01': {
      id: '01',
      parent: null,
      next: '030',
      subflows: {
        '010': {
          id: '010',
          name: '评审中(技术)',
          isbtns: ['011', '012'],
          isprivilege: ['ADMIN', 'TECHNICAL']
        },
        '011': {
          id: '011',
          name: '评审通过(技术)',
          isbtns: ['031', '032'],
          isprivilege: ['ADMIN', 'CONTRACT']
        },
        '012': {
          id: '012',
          name: '评审未通过(技术)',
          isbtns: ['011'],
          isprivilege: ['ADMIN', 'TECHNICAL']
        }
      }
    },
    '03': {
      id: '03',
      parent: '010',
      next: '050',
      subflows: {
        '030': {
          id: '030',
          name: '评审中(合同)',
          isbtns: ['031', '032'],
          isprivilege: ['ADMIN', 'CONTRACT']
        },
        '031': {
          id: '031',
          name: '评审通过(合同)',
          isbtns: ['051'],
          isprivilege: ['ADMIN', 'TECHNICAL']
        },
        '032': {
          id: '032',
          name: '评审未通过(合同)',
          isbtns: ['031'],
          isprivilege: ['ADMIN', 'CONTRACT']
        }
      }
    },
    '05': {
      id: '05',
      parent: '031',
      next: '070',
      subflows: {
        '050': {
          id: '050',
          name: '数据接入中',
          isbtns: ['051'],
          isprivilege: ['ADMIN', 'TECHNICAL']
        },
        '051': {
          id: '051',
          name: '数据已接入',
          isbtns: ['070'],
          isprivilege: ['ADMIN', 'FINANCE']
        }
      }
    },
    '07': {
      id: '07',
      parent: '051',
      next: '080',
      subflows: {
        '070': {
          id: '070',
          name: '开票中',
          isbtns: ['071'],
          isprivilege: ['ADMIN', 'FINANCE']
        },
        '071': {
          id: '071',
          name: '已开票',
          isbtns: ['072'],
          isprivilege: ['ADMIN', 'FINANCE']
        },
        '072': {
          id: '072',
          name: '打款中',
          isbtns: ['073'],
          isprivilege: ['ADMIN', 'FINANCE']
        },
        '073': {
          id: '073',
          name: '款已到',
          isbtns: [],
          isprivilege: ['ADMIN', 'FINANCE']
        }
      }
    },
    '08': {
      id: '08',
      parent: '073',
      next: null,
      subflows: {
        '080': {
          id: '080',
          name: '服务中',
          isbtns: ['082'],
          isprivilege: ['ADMIN', 'BUSINESS']
        },
        '081': {
          id: '081',
          name: '合同中止',
          isbtns: [],
          isprivilege: ['ADMIN', 'BUSINESS']
        },
        '082': {
          id: '082',
          name: '合同到期',
          isbtns: [],
          isprivilege: ['ADMIN', 'BUSINESS']
        }
      }
    }
  }
  return flows[flowFlag]['subflows'][flowno]
}

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function trimSpaceSymbol(value) {
  return value.replace(/\s+/g, "")
}

/**
 * 验证手机号
 * @param {String} linkphone 联系电话
 * @return {Boolean} true 校验通过 false 校验不通过
 */
function validLinkPhone(linkphone) {
  if (linkphone) {
    return /^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(linkphone)
  }
  return true
}


/**
 * 身份证号码效验
 * @param {String} pid 身份证号
 * @return {Boolean} true 效验通过 false 效验不通过
 */
function validPersonID(pid) {
  let flag = false
  var pid0 = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  var pid1 = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
  if (pid.length === 18) {
    // 如果出生日期非法则直接返回
    let datestr = pid.substr(6, 4).concat('-', pid.substr(10, 2), '-', pid.substr(12, 2))
    if (isNaN(Date.parse(datestr))) return flag
    let pids = pid.split('')
    let reg = /^\d+$/
    let pd = 0
    // 第一、二步
    for (let i = 0; i < 17; i++) {
      if (reg.test(pids[i])) {
        flag = true
        pd += pids[i] * pid0[i]
      } else {
        flag = false
        break
      }
    }
    if (flag) {
      // 第三步
      let r = pd % 11
      // 第四步
      if ((pids[17] + '') === (pid1[r] + '')) {
        flag = true
      } else {
        flag = false
      }
    }
  }
  return flag
}

/**
 * 封封微信的的request
 */
function request(url, data = {}, method = "GET") {
  return new Promise(function(resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'X-Nideshop-Token': wx.getStorageSync('token')
      },
      success: function(res) {
        console.log("success");
        if (res.statusCode == 200) {
          if (res.data.errno == 401) {
            //需要登录后才可以操作
            let code = null;
            return login().then((res) => {
              code = res.code;
              return getUserInfo();
            }).then((userInfo) => {
              //登录远程服务器
              request(api.AuthLoginByWeixin, {
                code: code,
                userInfo: userInfo
              }, 'POST').then(res => {
                if (res.errno === 0) {
                  //存储用户信息
                  wx.setStorageSync('userInfo', res.data.userInfo);
                  wx.setStorageSync('token', res.data.token);

                  resolve(res);
                } else {
                  reject(res);
                }
              }).catch((err) => {
                reject(err);
              });
            }).catch((err) => {
              reject(err);
            })
          } else {
            resolve(res.data);
          }
        } else {
          reject(res.errMsg);
        }

      },
      fail: function(err) {
        reject(err)
        console.log("failed")
      }
    })
  });
}

function get(url, data = {}) {
  return request(url, data, 'GET')
}

function post(url, data = {}) {
  return request(url, data, 'POST')
}

/**
 * 检查微信会话是否过期
 */
function checkSession() {
  return new Promise(function(resolve, reject) {
    wx.checkSession({
      success: function() {
        resolve(true);
      },
      fail: function() {
        reject(false);
      }
    })
  });
}

/**
 * 调用微信登录
 */
function login() {
  return new Promise(function(resolve, reject) {
    wx.login({
      success: function(res) {
        if (res.code) {
          resolve(res.code);
        } else {
          reject(res);
        }
      },
      fail: function(err) {
        reject(err);
      }
    });
  });
}

function getUserInfo() {
  return new Promise(function(resolve, reject) {
    wx.getUserInfo({
      withCredentials: true,
      success: function(res) {
        if (res.detail.errMsg === 'getUserInfo:ok') {
          resolve(res);
        } else {
          reject(res)
        }
      },
      fail: function(err) {
        reject(err);
      }
    })
  });
}

function redirect(url) {

  //判断页面是否需要登录
  if (false) {
    wx.redirectTo({
      url: '/pages/auth/login/login'
    });
    return false;
  } else {
    wx.redirectTo({
      url: url
    });
  }
}

function showErrorToast(msg) {
  wx.showToast({
    title: msg,
    image: '/static/images/icon_error.png'
  })
}

// no 为级别代号
function getLevelName(no) {
  return level[no]
}

// no 为档案状态代号
function getStateName(no) {
  return state[no]
}

// no 为注册方式代号
function getRefereeName(no) {
  return referee[no]
}

// gender 为性别代号
function getGenderName(no) {
  return gender[no]
}

// 逗号分隔金额
function getCommaMoney(s, type) {
  if (/[^0-9.]/.test(s)) return '0.00'
  if (s == null || s == 'null' || s == '') return '0.00'
  s = s.toString().replace(/^(\d*)$/, '$1.')
  s = (s + '00').replace(/(\d*\.\d\d)\d*/, '$1')
  s = s.replace('.', ',')
  var re = /(\d)(\d{3},)/
  while (re.test(s)) s = s.replace(re, '$1,$2')
  s = s.replace(/,(\d\d)$/, '.$1')
  if (type == 0) {
    var a = s.split('.')
    if (a[1] == '00') {
      s = a[0]
    }
  }
  return s
}

// 封装http请求
function sendRrquest(url, method, data, header) {
  let status = true
  let promise = new Promise(function(resolve, reject) {
    wx.getNetworkType({
      success: function(res) {
        // 返回网络类型2g，3g，4g，wifi, none, unknown
        let networkType = res.networkType
        if (networkType == "none") {
          wx.hideLoading();
          //没有网络连接
          wx.showModal({
            title: '提示',
            content: '网络连接失败,请检查您的网络设置',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                //返回res.confirm为true时，表示用户点击确定按钮
                console.log('表示用户点击确定按钮')

              }
            }
          })
          status = false;
        } else if (networkType == "unknown") {
          wx.hideLoading();
          //未知的网络类型
          wx.showModal({
            title: '提示',
            content: '未知的网络类型,请检查您的网络设置',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                //返回res.confirm为true时，表示用户点击确定按钮
                console.log('表示用户点击确定按钮')
              }
            }
          })
          status = false;
        } else {
          wx.request({
            url: url,
            data: data,
            method: method,
            header: header,
            success: resolve,
            fail: reject
          })
        }
      }
    })
    return status
  })
  return promise
}

// 封装文件上传
function fileuploadRrquest(url, filepath) {
  let status = true
  let promise = new Promise(function(resolve, reject) {
    wx.getNetworkType({
      success: function(res) {
        // 返回网络类型2g，3g，4g，wifi, none, unknown
        let networkType = res.networkType
        if (networkType == "none") {
          wx.hideLoading();
          //没有网络连接
          wx.showModal({
            title: '提示',
            content: '网络连接失败,请检查您的网络设置',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                //返回res.confirm为true时，表示用户点击确定按钮
                console.log('表示用户点击确定按钮')

              }
            }
          })
          status = false;
        } else if (networkType == "unknown") {
          wx.hideLoading();
          //未知的网络类型
          wx.showModal({
            title: '提示',
            content: '未知的网络类型,请检查您的网络设置',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                //返回res.confirm为true时，表示用户点击确定按钮
                console.log('表示用户点击确定按钮')
              }
            }
          })
          status = false;
        } else {
          wx.uploadFile({
            url: url,
            filePath: filepath,
            name: 'file',
            formData: {
              scene: 'kzhhr'
            },
            success: resolve,
            fail: reject
          })
        }
      }
    })
    return status
  })
  return promise
}

// 缓存写
function writeStorageSync(key, value) {
  let promise = new Promise(function(resolve, reject) {
    wx.setStorage({
      key: key,
      data: value,
      success: resolve,
      fail: reject
    });
  })
  return promise
}

// 封装Http请求头部
function reqHeader() {
  const token = wx.getStorageSync('token')
  const header = {
    'x-kzhhr-token': token
  }
  // if (arguments.length > 0 && typeof arguments[0] === 'object') {
  //   Object.assign(header, arguments[0])
  // }
  return header
}

// 树遍历
function traverseNodes(curnodes, nodes) {
  let tree = curnodes.map((node, index) => {
    let childrenNodes = nodes.filter(item => {
      return item.referee === node.id
    })
    Object.assign(curnodes[index], {
      children: childrenNodes
    })
    childrenNodes.length > 0 ? traverseNodes(childrenNodes, nodes) : null
    return node
  })
  return tree
}

module.exports = {
  formatTime,
  request,
  get,
  post,
  redirect,
  showErrorToast,
  checkSession,
  login,
  getUserInfo,
  trimSpaceSymbol,
  validPersonID,
  validLinkPhone,
  getLevelName,
  getStateName,
  getRefereeName,
  getGenderName,
  getApproveFlow,
  getCommaMoney,
  reqHeader,
  sendRrquest,
  fileuploadRrquest,
  writeStorageSync,
  traverseNodes,
  luhnCheck
}