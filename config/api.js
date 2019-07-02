const ApiRootUrl = 'http://127.0.0.1:8360';
//const FileServer = 'http://127.0.0.1:2392';

module.exports = {
  RegisterUrl: ApiRootUrl + '/api/user/register', //用户注册
  LoginUrl: ApiRootUrl + '/api/auth/login', //用户登录
  IndexUrl: ApiRootUrl + '/api/index/index', //首页数据接口
  AuthLoginByWeixin: ApiRootUrl + '/api/auth/loginByWeixin', //微信登录
  PersonalUrl: ApiRootUrl + '/api/user/info', //个人中心资料
  PersonnalFam: ApiRootUrl + '/api/user/fam', //家庭成员
  //PersonalId: ApiRootUrl + '/api/user/id',//家庭id
  AddsetFamlily: ApiRootUrl + '/api/user/addfamlily',//新增家庭成员
  DeleteFamlily: ApiRootUrl + '/api/user/deletefamlily',//删除家庭成员
  CompleteFamlily: ApiRootUrl + '/api/user/completefamlily',//完善个人信息
  UpdateFamlily: ApiRootUrl + '/api/user/updatefamlily',//修改家庭成员
  UserInfoURL: ApiRootUrl + '/api/user/getUserInfoById', //根据用户ID查询用户信息
  OrderStatQ: ApiRootUrl + '/api/contract/statq', //根据用户ID汇总季度签单量
  OrderStatQList: ApiRootUrl + '/api/contract/index', //根据用户ID获取签单列表
  OrderMoney: ApiRootUrl + '/api/contract/fee', //自动计算合同金额·
  OrderAdd: ApiRootUrl + '/api/contract/store', //新增保存合同
  //FileUpload: `${FileServer}/upload`, //文件上传
  //FileView: FileServer, //文件预览及下载URL
  ShareAdd: ApiRootUrl + '/api/share/store', //我的分享添加
  ShareStatQ: ApiRootUrl + '/api/share/statq', //根据用户ID汇总季度分享次数
  ShareStatQList: ApiRootUrl + '/api/share/index', //根据用户ID获取分享列表
  TrainAdd: ApiRootUrl + '/api/train/store', //我的培训添加
  TrainStatQ: ApiRootUrl + '/api/train/statq', //根据用户ID汇总季度培训次数
  TrainStatQList: ApiRootUrl + '/api/train/index', //根据用户ID获取培训列表
  TeamStatQ: ApiRootUrl + '/api/contract/statteamq', //根据用户ID汇总季度团队拓展数
  TeamStatQList: ApiRootUrl + '/api/contract/teamindex', //根据用户ID汇总季度团队列表
  IncomeList: ApiRootUrl + '/api/report/index', //根据用户ID查询收益
  NotifyList: ApiRootUrl + '/api/notify/indexnotify', //查询最新通知列表(最近10条)
  NoticeList: ApiRootUrl + '/api/notify/indexnotice', //查询最新公告列表(最近10条)
  NotifyInfo: ApiRootUrl + '/api/notify/info', //根据ID查询内容
  ModifyPwd: ApiRootUrl + '/api/user/modifypwd', //修改用户密码
};