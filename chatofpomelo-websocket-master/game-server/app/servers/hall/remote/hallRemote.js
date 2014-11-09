var utils = require("../../../HJCUtils/basicUtils");
var hallName = "hall";
var hallManager = require("../../../hggame/hallLogic/hallManager");

module.exports = function(app) {
	return new HallRemote(app);
};

var HallRemote = function(app) {
	this.app = app;
	this.channelService = app.get('channelService');
    this.BackedSessionService = app.get('backendSessionService');
    this.hall = this.channelService.getChannel(hallName, true);
};

/**功能1.3 将重复登陆的前玩家踢出游戏*/
HallRemote.prototype.duplicateCheck = function(checkNick,cb){
    var self = this;
    hallManager.duplicateCheck(checkNick,function(ret) {
        if (ret.res === true) {
            var target = [
                {uid: checkNick, sid: ret.fid}
            ];
            self.channelService.pushMessageByUids("onDupli", {info: "对不起，您的账号在别处登录！"}, target);
            self.BackedSessionService.kickByUid(ret.fid, checkNick);//这里会触发leaveGame事件
            cb(ret.res);
        } else {
            cb(ret.res);
        }
    });
};

/**功能1.3 玩家上线并加入大厅*/
HallRemote.prototype.onLine = function(uid, fid, isDupli, cb) {
    var self = this;
    console.log("hall(online) 昵称："+uid);
    hallManager.onLine(uid,fid,function(ret){
        var msg = {
            route: 'onLine',
            user: {nick:uid,
                info:ret.data.myInfo4Show
            }
        };
        self.hall.pushMessage('onLine',msg,null,function(){
            if( !! self.hall) {self.hall.add(uid, fid);}
            delete ret.myInfo4Show;
            cb(ret);
        });
    });
};

/**功能2.2 玩家创建房间*/
HallRemote.prototype.createRoom = function(hoster, fid, msg, cb) {
    var self = this;
    hallManager.buildRoom(hoster,msg,function(ret){
        if(ret.code==201){
            cb(ret);
        }else{
            if( !! self.hall) { self.hall.leave(hoster, fid);}
            var rid = ret.data.rid;
            var rList = ret.data.rList;
            var paramA={
                route: 'onRmRld',
                roomList: rList
            };
            self.hall.pushMessage(paramA);
            var paramB={
                route: 'onLeave',
                userNick:hoster
            };
            self.hall.pushMessage(paramB);
            cb({code:200,rid:rid});
        }
    });
};

/**功能2.3 玩家进入房间*/
HallRemote.prototype.enterRoom = function(enterUser, fid, msg, callback) {
    var self = this;
    hallManager.enterRoom(enterUser,msg,function(ret){
        if(ret.code===201){
            callback(ret);
        }else{
            if( !! self.hall) { self.hall.leave(enterUser, fid);}
            var paramA={
                route: 'onRmChg',
                chgRm: ret.rmChg
            };
            self.hall.pushMessage(paramA);
            var paramB={
                route: 'onLeave',
                userNick:enterUser
            };
            self.hall.pushMessage(paramB);
            callback({code:200});
        }
    });
};

/**功能1.4 玩家因为离开游戏从而离开大厅(大厅需要发送离线广播,并更新onlineList)*/
HallRemote.prototype.offLine = function(uid, fid, rid, callback) {
    console.log("hall(offLine)——玩家 :"+uid+" 从 "+rid+" 断开游戏...");
    var self = this;
    hallManager.offLine(uid,rid,function(ret){
        if( !! self.hall) { self.hall.leave(uid, fid);}
        if(ret.condition===3){
            var msg = {
                route: 'offLine',
                userNick: uid
            };
            self.hall.pushMessage('offLine',msg,null,function(){
                callback({needRmLeave:false});
            });
        }else if(ret.condition===1){
            var param={
                route: 'onRmRld',
                roomList: ret.rList
            };
            self.hall.pushMessage('onRmRld',param,null,function(){
                callback({needRmLeave:true});
            });
        }else if(ret.condition===2){
            msg = {
                route: 'onRmChg',
                chgRm: ret.rmChg
            };
            self.hall.pushMessage('onRmChg',msg,null,function(){
                callback({needRmLeave:true});
            });
        }
    });
};

/**功能4.3 玩家离开房间重回大厅*/
HallRemote.prototype.returnHall = function(nick, fid, rid, deleteRoom, callback) {
    var self = this;
    console.log("hall(return) 昵称：" + nick);
    hallManager.returnHall(nick, rid, deleteRoom, function (ret) {
        var msg = {
            route: 'onEnter',
            user: {nick: nick,
                info: ret.data.myInfo4Show
            }
        };
        self.hall.pushMessage('onEnter', msg, null, function () {
            //删除了房间，发送onRmRld消息
            if(deleteRoom){
                var param={
                    route: 'onRmRld',
                    roomList: ret.data.roomList
                };
                self.hall.pushMessage('onRmRld',param,null,function(){
                    self.hall.add(nick, fid);
                    delete ret.myInfo4Show;
                    callback(ret);
                });
            }
            //更新了房间，发送onRmchg消息
            else{
                param={
                    route: 'onRmChg',
                    chgRm: ret.data.rmChg
                };
                self.hall.pushMessage('onRmChg',param,null,function(){
                    self.hall.add(nick, fid);
                    delete ret.myInfo4Show;
                    callback(ret);
                });
            }
        });
    });
}

/**功能4.5 某个房间改变现实状态*/
HallRemote.prototype.changeRoomInfo = function(rid, type, callback) {
    var self = this;
    console.log("hall(changeRoomInfo) 房间：" + rid);
    hallManager.changeRoomInfo( rid, type, function (ret) {
        if(ret.code===200){
            var param={
                route: 'onRmChg',
                chgRm: ret.rmChg
            };
            self.hall.pushMessage(param);
        }
        callback();
    });
};



