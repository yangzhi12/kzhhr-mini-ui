const ApiRootUrl = 'http://127.0.0.1:8360';
const FileServer = 'http://127.0.0.1:2392';
// const ApiRootUrl = 'https://hhr.dianjuhui.com:3393';
// const FileServer = 'https://hhr.dianjuhui.com:3394';

module.exports = {
  RegisterUrl: ApiRootUrl + '/api/user/register', //用户注册
  LoginUrl: ApiRootUrl + '/api/auth/login', //用户登录
  IndexUrl: ApiRootUrl + '/api/index/index', //首页数据接口
  AuthLoginByWeixin: ApiRootUrl + '/api/auth/loginByWeixin', //微信登录
  PersonalUrl: ApiRootUrl + '/api/user/info', //个人中心资料
  UserInfoURL: ApiRootUrl + '/api/user/getUserInfoById', //根据用户ID查询用户信息
  OrderStatQ: ApiRootUrl + '/api/contract/statq', //根据用户ID汇总季度签单量
  OrderStatQList: ApiRootUrl + '/api/contract/index', //根据用户ID获取签单列表
  OrderMoney: ApiRootUrl + '/api/contract/fee', //自动计算合同金额
  OrderAdd: ApiRootUrl + '/api/contract/store', //新增保存合同
  FileUpload: `${FileServer}/upload`, //文件上传
  FileView: FileServer, //文件预览及下载URL
  ShareAdd: ApiRootUrl + '/api/share/store', //我的分享添加
  ShareStatQ: ApiRootUrl + '/api/share/statq', //根据用户ID汇总季度分享次数
  ShareStatQList: ApiRootUrl + '/api/share/index', //根据用户ID获取分享列表
  TrainAdd: ApiRootUrl + '/api/train/store', //我的培训添加
  TrainStatQ: ApiRootUrl + '/api/train/statq', //根据用户ID汇总季度培训次数
  TrainStatQList: ApiRootUrl + '/api/train/index', //根据用户ID获取培训列表
  TeamStatQ: ApiRootUrl + '/api/contract/statteamq', //根据用户ID汇总季度团队拓展数
  TeamStatQList: ApiRootUrl + '/api/contract/teamindex', //根据用户ID汇总季度团队列表
};