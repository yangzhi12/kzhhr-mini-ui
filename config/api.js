// const ApiRootUrl = 'https://hhr.dianjuhui.com:3393/api/';
const ApiRootUrl = 'http://localhost:8360/api/';

module.exports = {
  RegisterUrl: ApiRootUrl + 'user/register', //用户注册
  LoginUrl: ApiRootUrl + 'auth/login', //用户登录
  IndexUrl: ApiRootUrl + 'index/index', //首页数据接口
  AuthLoginByWeixin: ApiRootUrl + 'auth/loginByWeixin', //微信登录
  PersonalUrl: ApiRootUrl + 'user/info', //个人中心资料
  UserInfoURL: ApiRootUrl + 'user/getUserInfoById', //根据用户ID查询用户信息
  OrderStatQ: ApiRootUrl + 'contract/statq', //根据用户ID汇总季度签单量
  OrderStatQList: ApiRootUrl + 'contract/index' //根据用户ID获取签单列表
};