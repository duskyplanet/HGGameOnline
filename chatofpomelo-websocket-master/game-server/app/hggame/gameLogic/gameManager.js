var Game = require("./game").Game;
var gameList = [];

exports.startGame = function(roomInfo,pusher){
    gameList[roomInfo.rid] = new Game(roomInfo,pusher);
};

exports.clear = function(rid){
    gameList[rid] = null;
};

exports.receive = function(nick,rid,msg,callback){
    var game = gameList[rid];
    if(game===null||game===undefined){
        callback({code:201,info:"游戏局不存在或已结束"});
        return;
    }
    if(game.runningInfo.timeInfo.perid === game.runningInfo.timeInfo.PERID.END){
        callback({code:201,info:"游戏局已结束"});
        return;
    }
    var msgRoute = msg.route;
    switch(msgRoute){
        case "chgAutoSave":{
            game.receivers.changeAutoSave(nick,msg.type);
        }break;
        case "save":{
            game.receivers.save(nick,msg.saveTime);
        }break;
        case "overPK":{
            game.receivers.overPK(nick);
        }break;
        case "useSave":{
            game.receivers.useSave(nick);
        }break;
        case "overSave":{
            game.receivers.overSave(nick,msg.restSaveTime);
        }break;
        case "ngtMove":{
            if(game.runningInfo.timeInfo.perid != game.runningInfo.timeInfo.PERID.NIGHT){
                callback({code:201,info:"黑夜已过..."});
            }else{
                game.receivers.nightSkillTo(nick,msg);
            }
        }break;
        case "lastWord":{
            game.receivers.lastWord(nick,msg.lastWord,msg.type);
        }break;
        case "shot":{
            if(game.runningInfo.timeInfo.perid != game.runningInfo.timeInfo.PERID.SHOOT){
                callback({code:201,info:"开枪环节已过..."});
            }else{
                game.receivers.shootTo(nick,msg.shotTarget);
            }
        }break;
        case "vote":{
            if(game.runningInfo.timeInfo.perid != game.runningInfo.timeInfo.PERID.VOTE){
                callback({code:201,info:"投票环节已过..."});
            }else{
                game.receivers.voteTo(nick,msg.voteTarget);
            }
        }break;
        default: break;
    }
    callback({code:200});
};