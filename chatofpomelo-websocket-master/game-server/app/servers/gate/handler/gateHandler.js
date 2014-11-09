var service = require("../../../db_service/service");

module.exports = function(app) {
    return new Handler(app);
};

var Handler = function(app) {
    this.app = app;
};
var handler = Handler.prototype;

/**功能1.2 接口：玩家登陆游戏*/
handler.queryEntry = function(msg, session, next) {
    console.log("gate(login) 登录名:"+msg.loginName);
    var logParams={
        self:this,
        name:msg.loginName,
        pswd: msg.passWord
    };
    service.login(logParams,function(ret){
        next(null, ret);
    })
};
/**功能1.1 接口：玩家注册账号*/
handler.regUser = function(msg, session, next) {
    console.log("gate(regUser) 登录名:"+msg.loginName+",昵称:"+ msg.nick+",性别:"+msg.gender);
    var regParams={
        name:   msg.loginName,
        pswd:   msg.passWord,
        nick:   msg.nick,
        email:  msg.email,
        inviCode: msg.inviCode,
        gender: msg.gender,
        phone: msg.phone,
        avatar : msg.avatar
    };
    service.regUser(regParams,function(ret){
        next(null, ret);
    })
};