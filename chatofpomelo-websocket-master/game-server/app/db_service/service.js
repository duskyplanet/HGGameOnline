var dao = require("./dao");
var bscUtil = require("../HJCUtils/basicUtils");
var dispatcher = require('../util/dispatcher');

/**service服务：新用户注册*/
exports.regUser = regUser;
function regUser(params,callback){
    dao.queryUserByName(params.name,function(err,rows1){
        if(rows1.length!=0){
            callback({code:201,info:"对不起，登录名已被使用"});
            return;
        }else{
            console.log(params.nick);
            dao.queryUserByNick(params.nick,function(err,rows2){
                if(rows2.length!=0){
                    callback({code:201,info:"对不起，昵称已被使用"});
                    return;
                }else{
                    //TODO 根据邀请码决定初始的分数、等级、金钱、vip等级
                    var defaultScore = 0;
                    var defaultLevel = 1;
                    var defaultMoney = 100;
                    var defaultVip = 0;
                    var sqlParmas =[params.name,params.pswd,params.nick,params.email,params.inviCode,params.phone,
                        "",defaultScore,defaultLevel,params.gender,'新兵',defaultMoney,defaultVip]
                    dao.reg(sqlParmas,function(err,suc){
                        if(err){
                            callback({code:201,info:"对不起，暂时无法注册"});
                            return;
                        }
                        callback({code:200})
                    });
                }
            });
        }
    })
}

/**service服务：根据玩家的昵称获得其在大厅或房间内的显示信息*/
exports.getUserShowInfo = getUserShowInfo;
function getUserShowInfo(nick,callback){
     dao.sqlUserShowInfo(nick,function(err,data){
        if(err){
            callback({code:201,info:"查询出错"});
            return;
        }
        if(bscUtil.isEmpty(data)){
            callback({code:201,info:"用户不存在"});
            return;
        }
    callback({code:200,user:data});
    return;
    })
}

/**service服务：根据玩家的昵称获其自己显示的详细信息*/
exports.getMyInfo = getMyInfo;
function getMyInfo(nick,callback){
    dao.sqlGetMyInfo(nick,function(err,data){
        if(err){
            callback({code:201,info:"查询出错"});
            return;
        }
        if(bscUtil.isEmpty(data)){
            callback({code:201,info:"用户不存在"});
            return;
        }
        callback({code:200,user:data});
        return;
    })
}

/**service服务：玩家登陆，并返回给其合理的connector地址和端口*/
exports.login = login;
function login(params,callback){
    dao.queryUserByName(params.name,function(err,rows){
        if(rows.length==0){
            callback({code:201,info:"登录名不存在"});
            return;
        }else{
            dao.login(params.name,params.pswd,function(err,rows){
                if(rows.length==0){
                    callback({code:201,info:"登录名或密码错误"});
                    return;
                }else{
                    var connectors = params.self.app.getServersByType('connector');
                    if(!connectors || connectors.length === 0) {
                        callback({code:201,info:"对不起，暂时无法为您分配游戏分区"});
                        return;
                    }
                    var res = dispatcher.dispatch(rows[0].nick, connectors);
                    callback({code:200,
                                nick: rows[0].nick,
                                host: res.host,
                                port: res.clientPort
                    });
                }
            });
        }
    })
}
