var utils = require("../../../HJCUtils/basicUtils");
var roomsInfoManager = require("../../../hggame/roomLogic/roomsInfoManager");
var service = require("../../../db_service/service");

module.exports = function(app) {
	return new RoomRemote(app);
};

var RoomRemote = function(app) {
	this.app = app;
	this.channelService = app.get('channelService');
};
///**玩家加入某个频道（大厅或者房间）*/
//RoomRemote.prototype.enter = function(uid, sid, rid, cb) {
//console.log("hall(enter)——玩家："+uid+" 进入频道："+rid+"...");
//    if(rid==hallName){
//        var hall = this.channelService.getChannel(rid, true);
//        //向大厅内所有玩家广播某个玩家登陆
//        var param = {
//            route: 'onOnLine',
//            user: {nick:uid,
//                title:"新兵"}
//        };
//        hall.pushMessage(param);
//        if( !! hall) {hall.add(uid, sid);}
//        var data={
//            users: hall.getMembers(),
//            rooms : getRoomsList(),
//            friends : getFriendsList()
//        }
//        cb(200,data);
//    }else{
//        var room = this.channelService.getChannel(rid, false);
//        if(!room){
//            cb(2001,{info:"房间已经取消"});
//        }
//        //向房间内所有玩家广播某个玩家登陆
//        var param = {
//            route: 'onEnter',
//            user: uid
//        };
//        room.pushMessage(param);
//        if( !! room) { room.add(uid, sid);}
//        var data={
//            users: room.getMembers(),
//            rooms : getRoomsList(),
//            friends : getFriendsList()
//        }
//        cb(200,data);
//    }
//};

/**功能2.2 玩家创建房间（维护本频道房间信息列表）*/
RoomRemote.prototype.createRoom = function(hoster, fid, rid, msg, callback) {
    var self = this;
    console.log("room(create) 玩家："+hoster);
    roomsInfoManager.createRoom(hoster,rid,msg,function(ret){
        if(ret.code!==200){
            callback(ret);
        }else{
            var roomChannel = self.channelService.getChannel(rid,true);
            if(!!roomChannel){
                roomChannel.add(hoster,fid);
            }
            callback({code:200})
        }
    })
};

/**功能2.3 玩家加入房间（维护本频道房间信息列表，发送进入房间广播）*/
RoomRemote.prototype.enterRoom = function(enterUser, fid, rid, callback) {
    var self = this;
    console.log("room(enter) 玩家："+enterUser+"加入房间："+rid);
    roomsInfoManager.enterRoom(enterUser,rid,function(ret){
        if(ret.code!==200){
            callback(ret);
        }else{
            var room = self.channelService.getChannel(rid,false);
            if(!!room){
                var param = {
                    route:'onEnter',
                    enterUser:ret.enterUserInfo
                }
                room.pushMessage(param);
                room.add(enterUser,fid);
            }
            callback({code:200,roomInfo:ret.roomInfo})
        }
    })
};

/**功能1.4 玩家从因为断开游戏而从某个游戏房间离开*/
RoomRemote.prototype.offLine = function(uid, fid, rid, cb) {
console.log("room(offLine)——玩家 :"+uid+" 从 "+rid+" 断开游戏...");
    roomsInfoManager.offLine(uid,rid,function(){
        var room = this.channelService.getChannel(rid, false);
        if( !! room) {
            room.leave(uid, fid);
            //向玩家所在房间广播离线消息
            var msg = {
                route: 'offLine',
                userNick: uid
            };
            room.pushMessage('offLine',msg);
        }
    });
};

