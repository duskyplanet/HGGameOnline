var speakUtil =  require("../../../HJCUtils/speakMonitor").SpeakMonitor;
var speakMonitor = new speakUtil;
var gameManager = require("../../../hggame/gameLogic/gameManager");

module.exports = function(app) {
    return new Handler(app);
};

var Handler = function(app) {
    this.app = app;
    this.channelService = app.get('channelService');
};

var handler = Handler.prototype;

/**功能4.1 房间内聊天或发言接口*/
handler.rmChat = function(msg, session, next) {
    console.log("room(rmChat) 玩家:"+session.uid+" 发送消息-"+msg.content);
    var nick = session.uid;
    //服务器启用发言速度检测;
//    var canSpeak = speakMonitor.speak(nick);
//    if(canSpeak){
//        var roomChannel = this.channelService.getChannel(session.get("rid"),false);
//        var param = {
//            msg: msg.content,
//            nick: nick,
//            srcPos:msg.srcPos
//        };
//        roomChannel.pushMessage('onRmChat', param);
//        next(null, {
//            code:200
//        });
//    }else{
//        next(null, {
//            code:201,
//            info:"发言太快啦"
//        });
//    }
    //服务器端不检测发言速度
    var roomChannel = this.channelService.getChannel(session.get("rid"),false);
    var param = {
        msg: msg.content,
        nick: nick,
        srcPos:msg.srcPos
    };
    roomChannel.pushMessage('onRmChat', param);
    next(null, {
        code:200
    });
};

/**功能4.4 玩家准备或取消准备*/
handler.ready = function(msg, session, next) {
    console.log(msg);
    console.log("room(ready) 玩家:"+session.uid+" 准备状态变为-"+msg.type);
    var nick = session.uid;
    var rid = session.get("rid");
    this.app.rpc.room.roomRemote.ready(session, nick, rid, msg, function(){
        next(null, {
            code:200
        });
    });
};

/**功能4.5 房主开始游戏局*/
handler.begin = function(msg, session, next) {
    console.log("room(begin) 玩家:"+session.uid+" 开始了游戏...");
    var nick = session.uid;
    var rid = session.get("rid");
    //房主开始游戏时游戏居参数应该已经设定好了
    this.app.rpc.room.roomRemote.begin(session,nick, rid,msg,function(ret){
        next(null,ret);
    });
};

/**功能 玩家换座位*/
handler.changeSeat = function(msg, session, next) {
    console.log("room(changeSeat) 玩家:"+session.uid+" 换了位置...");
    var nick = session.uid;
    var rid = session.get("rid");
    //房主开始游戏时游戏居参数应该已经设定好了
    this.app.rpc.room.roomRemote.changeSeat(session,nick, rid,msg,function(ret){
        next(null,ret);
    });
};

/**功能 游戏开始时发生的所有事件*/
handler.game = function(msg, session, next) {
    console.log("room(game) 玩家:"+session.uid+"发送信息"+msg);
    var nick = session.uid;
    var rid = session.get("rid");
    gameManager.receive(nick,rid,msg,function(ret){
        next(null, {
            ret:ret
        });
    });
};


////测试用方法
//function printProperties(obj){
//    var propertiesArr = Object.getOwnPropertyNames(obj);
//    console.log(propertiesArr);
//}