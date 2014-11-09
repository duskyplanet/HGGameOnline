//var utils = require("../../../HJCUtils/basicUtils");
var Q = require("q");
var hallName = "hall";
var hjcArr = require("../../../HJCUtils/HJCArray");

var duplicArr = [];

module.exports = function(app) {
    return new Handler(app);
};
var Handler = function(app) {
    this.app = app;
};
var handler = Handler.prototype;


/**功能1.3 用户登录接口
 * 玩家登陆进游戏并进入大厅频道（保持长连接，当断开时会发送所在房间和大厅的离线广播）
 * 系统中uid对应客户端和后端服务器中的nick字段，系统中除了连接数据库（如登陆）外不直接使用登录名name字段
 * */
handler.onLine = function(msg, session, next) {
    console.log("connector(onLine) 昵称:"+msg.username);
    var self = this;
    var uid = msg.username;
    duplicateCheck(session,this.app,uid).then(function(ret){
        console.log("TEST:"+"entryHandler(duplicateCheck)："+ret);
        //将rid和uid绑定到session
        session.bind(uid);
        session.set('rid', hallName);
        session.push('rid', function(err) {
            if(err) {
                console.error('set rid for session service failed! error is : %j', err.stack);
            }
        });
        //绑定离线事件
        session.on('closed', leaveGame.bind(null,self.app));
        var waiter = setInterval(function(){
            console.log("查查");
            if(!hjcArr.exist(duplicArr,uid)){
                clearInterval(waiter);
                enterHall(self.app,session,ret,next);
            }
        },100);
        //加入大厅
    }).done();
};
/**方法：玩家加入大厅*/
var enterHall = function(app,session,isDupli,next){
    var uid = session.__session__.uid;
    var fid = app.get('serverId');
    app.rpc.hall.hallRemote.onLine(session,uid,fid,isDupli,function(ret){
        next(null,ret);
    });
};
/**方法：将重复登录的之前玩家踢出游戏*/
var duplicateCheck = function(session,app,nick){
    var deferred = Q.defer();
    app.rpc.hall.hallRemote.duplicateCheck(session, nick, function(ret){
        setTimeout(function(){
            deferred.resolve(ret);
        },300);
    });
    return deferred.promise;
};

/**功能2.2 接口：玩家创建新房间（将导致离开大厅广播、房间列表刷新广播）*/
handler.create = function(msg, session, next) {
    var hoster =session.__session__.uid;
console.log("cnntr(create)-- 玩家:"+hoster+"创建房间");
    var fid = this.app.get('serverId');
    var self = this;
    self.app.rpc.hall.hallRemote.createRoom(session, hoster, fid, msg, function(ret){
        if(ret.code==201){
            next(null, ret);
        }else{
            session.set('rid', ret.rid);
            session.push('rid', function(err) {
                if(err) {
                    console.error('set rid for session service failed! error is : %j', err.stack);
                }
                self.app.rpc.room.roomRemote.createRoom(session, hoster, fid, ret.rid, msg, function(ret1){
                    if(ret1.code!==200){
                        next(null, {code:201,info:"对不起暂时无法创建房间"});
                    }else{
                        delete msg.__route__;
                        next(null,{code:200,newRoom:{rid:ret.rid,roomInfo:msg}})
                    }
                });
            });
        }
    });
};

/**功能2.3：玩家加入房间（将导致离开大厅广播，单个房间刷新广播，进入房间广播）*/
handler.enter = function(msg, session, next){
    var self = this;
    var rid = msg.rid;
    var uid = session.__session__.uid;
    var fid = self.app.get('serverId');
console.log("cnntr(enter)-- 玩家:"+uid+"加入房间："+rid);
    self.app.rpc.hall.hallRemote.enterRoom(session,uid,fid,msg,function(ret){
        if(ret.code===201){
            next(null, ret);
        }else{
            session.set('rid', rid);
            session.push('rid', function(err) {
                if(err) {
                    console.error('set rid for session service failed! error is : %j', err.stack);
                }
                self.app.rpc.room.roomRemote.enterRoom(session, uid, fid, rid, function(ret1){
                    if(ret1.code!=200){
                        next(null, {code:201,info:"对不起暂时无法加入指定房间"});
                    }else{
                        next(null,ret1)
                    }
                });
            });
        }
    });
};

/**功能1.4：玩家断线（服务器未接到logout请求而直接断开session，如果在大厅则大厅需要广播离线通知，如果在房间内则房间需要广播离线通知）*/
function leaveGame(app,session){
    console.log("被调用了");
    var uid = session.uid;
    duplicArr.push(uid);
    var rid = session.get("rid");
    var fid = app.get('serverId');
    if(!session || !uid) {return;}
    //如果玩家在大厅，kickHall并更新onlineList，否则只更新onlineList
    app.rpc.hall.hallRemote.offLine(session,uid,fid,rid,function(ret){
        if(ret.needRmLeave===false){
            hjcArr.deleteValue(duplicArr,uid);
            return null;
        }else{
            app.rpc.room.roomRemote.leaveRoom(session, uid,rid, fid,function(){
                hjcArr.deleteValue(duplicArr,uid);
            });
        }
    });
}

/**功能4.3 接口：玩家离开房间，自动返回到大厅*/
handler.leaveRoom = function(msg, session, next) {
    var nick =session.__session__.uid;
    var rid = session.get("rid");
    console.log("cnntr(leave)-- 玩家:"+nick+"离开房间："+rid);
    var fid = this.app.get('serverId');
    var self = this;
    self.app.rpc.room.roomRemote.leaveRoom(session, nick,rid, fid,function(ret){
        session.set('rid', hallName);
        session.push('rid', function(err) {
            if(err) {
                console.error('set rid for session service failed! error is : %j', err.stack);
            }
            self.app.rpc.hall.hallRemote.returnHall(session, nick, fid, rid, ret.deleteRoom, function(ret1){
                 next(null,ret1);
            });
        });
    });
};

//玩家主动离开游戏
handler.quitGame = function(msg, session, next) {
    var uid =session.__session__.uid;
    console.log("cnntr(quitGame)-- 玩家:"+uid+"离开游戏：");
    var rid = session.get("rid");
    var fid = this.app.get('serverId');
    if(!session) {return;}
    this.app.rpc.hall.hallRemote.offLine(session,uid,fid,rid,function(ret){
        next(null,ret);
    });
};



