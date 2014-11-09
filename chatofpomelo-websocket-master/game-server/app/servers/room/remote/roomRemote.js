var utils = require("../../../HJCUtils/basicUtils");
var roomsInfoManager = require("../../../hggame/roomLogic/roomsInfoManager");
var service = require("../../../db_service/service");
var gameManager = require("../../../hggame/gameLogic/gameManager");

module.exports = function(app) {
	return new RoomRemote(app);
};

var pushChannelService = null;
var mySelf = null;

var RoomRemote = function(app) {
	this.app = app;
    this.channelService = app.get('channelService');
    pushChannelService = this.channelService;
    mySelf = this;
    this.BackedSessionService = app.get('backendSessionService');
};

/**功能2.2 玩家创建房间（维护本频道房间信息列表）*/
RoomRemote.prototype.createRoom = function(hoster, fid, rid, msg, callback) {
    var self = this;
    console.log("room(create) 玩家："+hoster);
    roomsInfoManager.createRoom(hoster,fid,rid,msg,function(ret){
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
    roomsInfoManager.enterRoom(enterUser,fid,rid,function(ret){
        if(ret.code!==200){
            callback(ret);
        }else{
            var room = self.channelService.getChannel(rid,false);
            if(!!room){
                var msg = {
                    enterUser:{nick:enterUser,info:ret.enterUserInfo,position:ret.roomInfo.myPosition}
                };
                room.pushMessage('onEnterRoom',msg,null,function(){
                    room.add(enterUser,fid);
                    callback({code:200,roomInfo:ret.roomInfo})
                });
            }
        }
    })
};

/**功能1.4 玩家因为断开游戏而从某个游戏房间离开*/
RoomRemote.prototype.leaveGame = function(nick, rid,fid,callback) {
console.log("room(leaveGame)——玩家 :"+uid+" 从 "+rid+" 断开游戏...");
    var self = this;
    roomsInfoManager.leaveRoom(nick,rid,function(ret){
        var room = self.channelService.getChannel(rid, false);
        if( !room) {console.log("致命逻辑错误，退出不存在的房间");return;}
        room.leave(uid,fid);
        //情况一：断开者就是房主（房内无他人），不需要发送退房广播
        room.leave(nick,fid);
console.log(ret);
        if(ret.deleteRoom === true){
            callback();
        }else{
            var msg = {
                route: 'onLeaveRoom',
                userNick: nick,
                leaverPosition:ret.leaverPosition
            };
            room.pushMessage('onLeaveRoom',msg);
            //情况二：非房主玩家断开房间，需要给房间剩余玩家发送广播，不删除房间(RmChg)，并让玩家重回大厅；
            if(ret.nextHoster===null){
                callback();
            }else{
                //情况三：房主(还有他人)断开房间，需要给房间剩余玩家发送广播，给下一个房主点播成为房主，不删除房间(Rmg)，并让房主重回大厅；
                var msgHoster = {
                    route: 'chgHoster',
                    userNick: ret.nextHoster
                };
                room.pushMessage('chgHoster',msgHoster);
                callback();
            }
        }
    })
};

/**功能4.3 玩家离开房间*/
RoomRemote.prototype.leaveRoom = function(nick,rid,fid,callback) {
    var self = this;
    roomsInfoManager.leaveRoom(nick,rid,function(ret){
        var room = self.channelService.getChannel(rid, false);
        if( !room) {console.log("致命逻辑错误，退出不存在的房间");return;}
        //情况一：退出者就是房主（房内无他人），不需要发送退房广播，但是需要删除房间(RmRld)并让房主重回大厅；
        room.leave(nick,fid);
 console.log(ret);
        if(ret.deleteRoom === true){
            callback({deleteRoom:true});
        }else{
            var msg = {
                route: 'onLeaveRoom',
                userNick: nick,
                leaverPosition:ret.leaverPosition
            };
            room.pushMessage('onLeaveRoom',msg);
            //情况二：非房主玩家退出房间，需要给房间剩余玩家发送广播，不删除房间(RmChg)，并让玩家重回大厅；
            if(ret.nextHoster===null){
                callback({deleteRoom:false});
            }else{
                //情况三：房主(还有他人)退出房间，需要给房间剩余玩家发送广播，给下一个房主点播成为房主，不删除房间(Rmg)，并让房主重回大厅；
                var msgHoster = {
                    route: 'chgHoster',
                    userNick: ret.nextHoster
                };
                room.pushMessage('chgHoster',msgHoster);
                callback({deleteRoom:false});
            }
        }
    });
};

/**功能4.4 某个玩家改变准备状态*/
RoomRemote.prototype.ready = function(nick,rid,msg,callback) {
    var self = this;
    roomsInfoManager.ready(msg,rid,function(ret){
        var room = self.channelService.getChannel(rid, false);
        if( !room) {console.log("致命逻辑错误，在不存在的房间内准备");return;}
        var msg = {
            route: 'onReady',
            position: ret.position,
            type:ret.type
        };
        room.pushMessage('onReady',msg);
        callback();
    });
};

/**功能4.5 房主开始游戏*/
RoomRemote.prototype.begin = function(nick,rid,beginParams,callback) {
    var self = this;
    roomsInfoManager.begin(nick,rid,beginParams,pusher,function(ret){
        if(ret.code === 201){
            callback(ret);return;
        }
        //1、通知hall修改roomList并发送广播
        self.app.rpc.hall.hallRemote.changeRoomInfo(null,rid,"start",null);
        //2、通知房间内所有玩家游戏局即将开始
        var room = self.channelService.getChannel(rid, false);
        if( !room) {console.log("致命逻辑错误，在不存在的房间内准备");return;}
        var msg = {
           info:ret.info
        };
        room.pushMessage( 'onBegin',msg);
        callback({code:200});
    });
};

/**功能4.5 玩家改变座位*/
RoomRemote.prototype.changeSeat = function(nick,rid,changeParams,callback) {
    var self = this;
    roomsInfoManager.changeSeat(nick,rid,changeParams,function(ret){
        if(ret.code === 201){
            callback(ret);return;
        }
        var room = self.channelService.getChannel(rid, false);
        var msg = {
            enterUser:{nick:nick,info:ret.enterUserInfo,position:ret.tarPos},
            srcPos:ret.srcPos
        };
        room.pushMessage( 'onChangeSeat',msg);
        callback({code:200});
    });
};

var pusher = function(type,info){
    console.log("---------------推送信息-----------------");
    console.log(info);
    if(type==="room"){
        var room = pushChannelService.getChannel(info.rid, false);
        room.pushMessage(info.route,{msg:info.msg});
        if(info.route=="onEnd"){
            setTimeout(function(){
                gameManager.clear(info.rid);
                roomsInfoManager.over(info.rid);
                //1、通知hall修改room状态并发送广播
                mySelf.app.rpc.hall.hallRemote.changeRoomInfo(null,info.rid,"over",null);
            },500);
        }
    }else if(type==="players"){
        if(!!info.msg){
            pushChannelService.pushMessageByUids(info.route, info.msg, info.targets);
        }else{
            for(i = 0;i<info.targets.length;i++ ){
                pushChannelService.pushMessageByUids(info.route, info.msgs[i], [info.targets[i]]);
            }
        }
    }
};



