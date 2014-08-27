//var utils = require("../../../HJCUtils/basicUtils");
var Q = require("q");
var hallName = "hall";

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
    console.log("cnntr(onLine) 昵称:"+msg.username);
    var self = this;
    var uid = msg.username;
    dupliCheck(session,this.app,uid).then(function(ret){
        //将rid和uid绑定到session
        session.bind(uid);
        session.set('rid', hallName);
        session.push('rid', function(err) {
            if(err) {
                console.error('set rid for session service failed! error is : %j', err.stack);
            }
        });
        //绑定离线事件
        session.on('closed', leaveGame.bind(null, self.app));
        //加入大厅
        enterHall(self.app,session,ret,next);
    }).done();
};
/**方法：玩家加入大厅*/
var enterHall = function(app,session,isDupli,next){
    var uid = session.__session__.uid;
    var fid = app.get('serverId');
    app.rpc.hall.hallRemote.onLine(session,uid,fid,isDupli,function(ret){
        next(null,ret);
    });
}
/**方法：将重复登录的之前玩家踢出游戏*/
var dupliCheck = function(session,app,nick){
    var deferred = Q.defer();
    app.rpc.hall.hallRemote.dupliCheck(session, nick, function(ret){
        setTimeout(function(){
            deferred.resolve(ret);
        },500);
    });
    return deferred.promise;
}

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
    var rid = msg.rid;
    var uid = session.__session__.uid;
    var fid = app.get('serverId');
    var self = this;
console.log("cnntr(enter)-- 玩家:"+uid+"加入房间："+rid);
    self.app.rpc.hall.hallRemote.enterRoom(session,uid,fid,msg,function(ret){
        if(ret.code=201){
            next(null, ret);
        }else{
            session.set('rid', rid);
            session.push('rid', function(err) {
                if(err) {
                    console.error('set rid for session service failed! error is : %j', err.stack);
                }
                self.app.rpc.room.roomRemote.enterRoom(session, uid, fid, rid, function(ret1){
                    if(ret1.code!==200){
                        next(null, {code:201,info:"对不起暂时无法加入指定房间"});
                    }else{
                        next(null,ret)
                    }
                });
            });
        }
    });
}

/**功能1.4：玩家断线（服务器未接到logout请求而直接断开session，如果在大厅则大厅需要广播离线通知，如果在房间内则房间需要广播离线通知）*/
var leaveGame = function(app,session){
    var uid = session.uid;
    var rid = session.get("rid");
    var fid = app.get('serverId');
    if(!session || !uid) {return;}
    //如果玩家在大厅，kickHall并根性onlineList，否则只更新onlineList
    app.rpc.hall.hallRemote.offLine(session,uid,fid,rid,function(){
        if(rid!=hallName){
            app.rpc.room.roomRemote.offLine(session,uid,fid,rid,null);
        }
    });
};

/**将玩家从自己的频道踢出去*/
var leaveChannel = function(session){
    if(!session || !session.uid) {
        return;
    }
    app.rpc.hall.hallRemote.kick(session, session.uid, app.get('serverId'), session.get("rid"), null, true);
};
/**将玩家加入到已经分配的频道*/
var enterChannel = function(self,session,next){
    self.app.rpc.hall.hallRemote.add(session, session.__session__.uid, self.app.get('serverId'), session.get("rid"),function(users){
        next(null, {
            users:users,
            rooms:testRoom
        });
    });
}
/**玩家创建频道*/
var createChannel = function(self,session,next){
    self.app.rpc.hall.hallRemote.create(session, session.__session__.uid, self.app.get('serverId'), session.get("rid"),function(users){
        next(null, {
            users:users,
            rooms:testRoom
        });
    });
}
