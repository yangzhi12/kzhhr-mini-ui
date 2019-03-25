var api = require('../config/api.js')

var level = {
  '00': '业务员',
  '10': '一钻',
  '20': '二钻',
  '30': '三钻',
  '40': '四钻',
  '50': '五钻'
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
  'NO_REF': '别人推荐'
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
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
        'X-Nideshop-Token': wx.getStorageSync('token')
      },
      success: function (res) {
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
              request(api.AuthLoginByWeixin,
                { code: code, userInfo: userInfo }, 'POST').then(res => {
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
      fail: function (err) {
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
  return new Promise(function (resolve, reject) {
    wx.checkSession({
      success: function () {
        resolve(true);
      },
      fail: function () {
        reject(false);
      }
    })
  });
}

/**
 * 调用微信登录
 */
function login() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        if (res.code) {
          resolve(res.code);
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
}

function getUserInfo() {
  return new Promise(function (resolve, reject) {
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        if (res.detail.errMsg === 'getUserInfo:ok') {
          resolve(res);
        } else {
          reject(res)
        }
      },
      fail: function (err) {
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
}
