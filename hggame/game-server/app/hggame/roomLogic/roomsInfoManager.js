var gameManager = require("../gameLogic/gameManager");
var service = require("../../db_service/service");
var Q = require("q");
var seatList = require("./seatsListUtils").seatList
var Map = require("../../HJCUtils/HJCMap").Map;
var hjcArr = require("../../HJCUtils/HJCArray");

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
function createRoom(hoster,fid,rid,roomInfo,cb){
    var room = new Room(hoster,rid,roomInfo);
    service.getUserShowInfo(hoster,function(ret){
        if(ret.code!=200){
            cb(ret);
        }
        room.userList.set(1,{nick:hoster,info:ret.user,fid:fid});
        roomsMap.put(rid,room);
        cb({code:200});
    })
}

//**方法：玩家加入房间*/
exports.enterRoom = enterRoom;
function enterRoom(enterUser,fid,rid,cb){
    service.getUserShowInfo(enterUser,function(ret){
        if(ret.code!=200){
            cb(ret);
        }
        var roomInfo = userEnterRoom(enterUser,fid,ret.user,rid);
        cb({code:200,roomInfo:roomInfo,enterUserInfo:ret.user});
    })
}

//**外部方法：玩家准备*/
exports.ready = ready;
function ready(msg,rid,cb){
    var roomInfo = roomsMap.get(rid);
    roomInfo.readyList[msg.position] = msg.type;
    if(msg.type){roomInfo.readyNum++;}else{roomInfo.readyNum--;}
    roomsMap.remove(rid);
    roomsMap.put(rid,roomInfo);
    cb({type:msg.type,position:msg.position});
}

//**外部方法：房主开始*/
exports.begin = begin;
function begin(enterUser,rid,beginParams,pusher,cb){
    var minNum = 6;//最少玩家
    var roomInfo = roomsMap.get(rid);
    var ready = roomInfo.readyNum;
    if(ready>=minNum){
        //TODO 根据beginParams初始化开始游戏的参数，这里先直接附上初始值
        //roomInfo.advanced.speakTime = 30;
        //roomInfo.advanced.saveTime = 20;
        cb({code:200,info:{
            playerList:roomInfo.readyList,
            playNum:ready,
            jobMode:"",
            jobComp:[],
            jobRdm:[],
            speakTime: roomInfo.advanced.speakTime,
            saveTime:roomInfo.advanced.saveTime
        }});
        gameManager.startGame(roomInfo,pusher);
    }else{
        cb({code:201,info:"至少需要"+minNum+"个玩家准备..."});
    }
}

/**外部方法，玩家换座位*/
exports.changeSeat = changeSeat;
function changeSeat(changeUserNick,rid,changeParams,cb){
    var roomInfo = roomsMap.get(rid);
    var myPos = changeParams.myPos;
    var tarPos = changeParams.tarPos;
    if(roomInfo.userList.get(tarPos)!=undefined || roomInfo.userList.get(tarPos) == null){
        var me = roomInfo.userList.get(myPos);
        if(me==null||me==undefined){console.log("roomInfoManager发生致命逻辑错误，请求换位置的人不存在"); cb({code:201,info:"无法换座位！"});}
        roomInfo.userList.set(tarPos,me);
        if(roomInfo.readyList[tarPos] == true){
            roomInfo.readyNum --;
        }
        roomInfo.readyList[tarPos] = false;
        roomInfo.userList.set(myPos,null);
        roomsMap.remove(rid);
        roomsMap.put(rid,roomInfo);
        cb({code:200,enterUserInfo:me.info,srcPos:myPos,tarPos:tarPos});
    }else{
        cb({code:201,info:"座位已有人占！"});
    }
}

//**外部方法：离开房间*/
exports.leaveRoom = leaveRoom;
function leaveRoom(nick,rid,cb){
    var roomInfo = roomsMap.get(rid);
    var roomHoster = roomInfo.rHoster;
    if(nick===roomHoster){
        if(roomInfo.num<=1){
            //仅剩的房主离开游戏（不需要发送房间内离开广播）
            roomsMap.remove(rid);
            cb({deleteRoom:true,nextHoster:null});
        }else{
            //房主转给下面一个人
            var nextHoster = roomInfo.userList.findNextHoster(nick);
            roomInfo.rHoster = nextHoster.name;
            var leaverPosition = roomInfo.userList.getPositionByNick(nick);
            roomInfo.userList.removeByNick(nick);
            roomInfo.num --;
            roomsMap.remove(rid);
            roomsMap.put(rid,roomInfo);
            if(!!nextHoster){
                cb({deleteRoom:false,nextHoster:nextHoster.name,leaverPosition:leaverPosition});
            }
        }
    }else{
        //不是房主退出房间(房间内必定还有其他玩家，不需要删除房间，但是需要房间内离开广播，进入大厅函数)
        leaverPosition = roomInfo.userList.getPositionByNick(nick);
        roomInfo.userList.removeByNick(nick);
        roomInfo.num --;
        roomsMap.remove(rid);
        roomsMap.put(rid,roomInfo);
        cb({deleteRoom:false,nextHoster:null,leaverPosition:leaverPosition});
    }
}

//外部方法：玩家从房间断开游戏
exports.offLine = offLine;
function offLine(nick,rid,callback){
    userQuitRoom(nick,rid);
    callback()
}

//外部方法：游戏结束
exports.over = over;
function over(rid){
    var roomInfo = roomsMap.get(rid);
    for(var i = 1; i<roomInfo.readyList.length;i++){
        roomInfo.readyList[i] = false;
    }
    roomInfo.readyNum = 0;
    roomsMap.remove(rid);
    roomsMap.put(rid,roomInfo);
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
function userEnterRoom(enterUserINick,fid,enterUserInfo,rid){
    var roomInfo = roomsMap.get(rid);
    if(!!roomInfo){
        var position = roomInfo.userList.findMin();
        roomInfo.userList.set(position,{nick:enterUserINick,info:enterUserInfo,fid:fid});
        roomInfo.num ++;
        roomsMap.remove(rid);
        roomsMap.put(rid,roomInfo);
        roomInfo.myPosition = position;
        return roomInfo;
    }
}

/**内部构件：房间内玩家所能看见的房间信息*/
function Room(hoster,rid,params){
    this.rid = rid;                //房间id
    this.rName = params.rname;          //房间名称
    this.rHoster = hoster;     //房主
    this.rmode = params.rmode;         //房间模式 0=无职业 1=标准局
    this.rScale = params.rScale;       //房间规模：0=(6-12) 1=(12-18) 2=(18-24)
    this.rFbdIP = params.rFbdIP;        //是否禁止id true=禁止
    this.rPswd = params.rPswd;          //密码 如果为空则无密码
    this.num = 1;                         //已经加入玩家列表
    this.state = 0;                       //房间状态 0=等待中，1= 已经开始
    this.userList = new seatList(scaleNumList[this.rScale]);//房间内座位
    this.readyList = hjcArr.fill(scaleNumList[this.rScale]+1,false);    //房间内准备情况
    this.readyNum = 0;
    this.advanced ={
        speakTime:90,
        saveTime:30,
        gameMode:0,
        jobWant:false,
        wantList:[],
        wordMode:1,
        wordChooseArr:[],
        picMode:1
    }
}

//var room = new Room("hoster",{id:1,rname:"房间名",rmode:1,rScale:0, rFbdIP:true ,rPswd:null})
//console.log(room);
