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

function getRoomsList(){
    return hallManager.getRoomsInfo();
}
function getFriendsList(){
    return "no data";
}

/**功能1.3 将重复登陆的前玩家踢出游戏*/
HallRemote.prototype.dupliCheck = function(checkNick,cb){
    var self = this;
    hallManager.dupliCheck(checkNick,function(ret){
        if(ret.res === true){
            if(ret.rid === hallName){
                var target = [{uid:checkNick,sid:ret.fid}]
                self.channelService.pushMessageByUids("onDupli",{info:"重复登陆"},target);
                self.BackedSessionService.kickByUid(ret.fid,checkNick);
            }else{
                //TODO 房间tick
            }
            cb(ret.res);
        }else{
            cb(ret.res);
        }
    })
}

/**功能1.3 玩家上线并加入大厅*/
HallRemote.prototype.onLine = function(uid, fid,isDupli, cb) {
    var self = this;
    console.log("hall(online) 昵称："+uid);
    hallManager.onLine(uid,fid,function(ret){
        if(!!isDupli){
            delete ret.myInfo4Show;
            cb(ret);
        }else{
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
        }
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
            }
            self.hall.pushMessage(paramA);
            var paramB={
                route: 'onLeave',
                leaver:{nick:hoster}
            }
            self.hall.pushMessage(paramB);
            cb({code:200,rid:rid});
        }
    });
};

/**功能2.3 玩家进入房间*/
HallRemote.prototype.enterRoom = function(enterUser, fid, msg, callback) {
    var self = this;
    hallManager.enterRoom(enterUser,msg,function(ret){
        if(ret.code==201){
            cb(ret);
        }else{
            if( !! self.hall) { self.hall.leave(enterUser, fid);}
            var chgRm = ret.rmChg;
            var paramA={
                route: 'onRmChg',
                chgRm: chgRm
            }
            self.hall.pushMessage(paramA);
            var paramB={
                route: 'onLeave',
                leaver:{nick:enterUser}
            }
            self.hall.pushMessage(paramB);
            cb({code:200});
        }
    });
};

/**功能1.4 玩家因为离开游戏从而离开大厅(大厅需要发送离线广播,并更新onlineList)*/
HallRemote.prototype.offLine = function(uid, fid, rid, callback) {
console.log("hall(offLine)——玩家 :"+uid+" 从 "+rid+" 断开游戏...");
    var self = this;
    hallManager.offLine(uid,rid,function(){
        if(rid == hallName){
            if( !! self.hall) { self.hall.leave(uid, fid);}
            var msg = {
                route: 'offLine',
                userNick: uid
            };
           self.hall.pushMessage('offLine',msg,null,function(){
                callback();
            });
        }
    });
};

