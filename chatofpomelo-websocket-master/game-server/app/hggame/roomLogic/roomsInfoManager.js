
var service = require("../../db_service/service");
var Q = require("q");
var seatList = require("./seatsListUtils").seatList
var Map = require("../../HJCUtils/HJCMap").Map;

//房间号与房间信息对应Map
var roomsMap = new Map;
var scaleNumList=[12,18,24];
var scaleInfoList =[ "/12(小)","/18(中)","/24(大)"];
var modeInfoList=["无职业","标准局","风云再起"];


//exports.AddNewRoom = AddNewRoom;
//function AddNewRoom(hoster,rid,params,callback){
//
//
//
//    var rid = roomList.findMin();
//    if(rid==0){
//        callback({code:201,info:"房间数量已达上限..."});
//    }
//    params.rid = rid;
//    var newRoom = new Room(hoster,params);
//    roomList.set(id,newRoom);
//    callback({code:200,data:{rid:params.rid,rList:getRoomList()}});
//}

//exports.getUserShowInfoQ = getUserShowInfo;
//function getUserShowInfo(nick){
//    var deferred = Q.defer();
//    service.getUserShowInfo(nick,function(ret){
//        deferred.resolve(ret);
//    });
//    return deferred.promise;
//}

//**方法：创建一个新房间*/
exports.createRoom = createRoom;
function createRoom(hoster,rid,roomInfo,cb){
    var room = new Room(hoster,roomInfo);
    service.getUserShowInfo(hoster,function(ret){
        if(ret.code!=200){
            cb(ret);
        }
        room.userList.set(1,{nick:hoster,info:ret.user});
        roomsMap.put(rid,room);
        cb({code:200});
    })
}

//**方法：玩家加入房间*/
exports.enterRoom = enterRoom;
function enterRoom(enterUser,rid,cb){
    service.getUserShowInfo(enterUser,function(ret){
        if(ret1.code!=200){
            cb(ret);
        }
        var roomInfo = userEnterRoom(ret.user,rid);
        cb({code:200,roomInfo:roomInfo,enterUserInfo:ret.user});
    })
}

//外部方法：玩家从房间断开游戏
exports.offLine = offLine;
function offLine(nick,rid,callback){
    userQuitRoom(nick,rid);
    callback()
}

/**内部方法：将指定玩家从指定房间踢出*/
function userQuitRoom(nick,rid){
    var roomInfo = roomsMap.get(rid);
    if(!!roomInfo){
        roomInfo.seatList.removeByNick(nick);
        roomInfo.num --;
        //TODO 如果房间人数为0
        //TODO 如果游戏已经开始，请发送GameManager的逻辑
        if(roomInfo.state === 1){

        }
    }
}

/**方法：玩家加入指定房间，刷新房间维护列表*/
function userEnterRoom(enterUserInfo,rid){
    var roomInfo = roomsMap.get(rid);
    if(!!roomInfo){
        var position = roomInfo.userList.findMin();
        roomInfo.userList.set(position,enterUserInfo);
        roomInfo.num ++;
        roomsMap.remove(rid);
        roomsMap.put(rid,roomInfo);
        return roomInfo;
    }
}

/**内部构件：房间内玩家所能看见的房间信息*/
function Room(hoster,params){
    this.id = params.id;                //房间id
    this.rName = params.rname;          //房间名称
    this.rHoster = hoster               //房主
    this.rmode = params.rmode;         //房间模式 0=无职业 1=标准局
    this.rScale = params.rScale;       //房间规模：0=(6-12) 1=(12-18) 2=(18-24)
    this.rFbdIP = params.rFbdIP;        //是否禁止id true=禁止
    this.rPswd = params.rPswd;          //密码 如果为空则无密码
    this.num = 1;                         //已经加入玩家列表
    this.state = 0;                       //房间状态 0=等待中，1= 已经开始
    this.userList = new seatList(scaleNumList[this.rScale]);//房间内座位
}

//var room = new Room("hoster",{id:1,rname:"房间名",rmode:1,rScale:0, rFbdIP:true ,rPswd:null})
//console.log(room);
