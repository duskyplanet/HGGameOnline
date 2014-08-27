var hjcArr = require("../../../HJCUtils/HJCArray");
var basicUtils =  require("../../../HJCUtils/basicUtils");
var msgTranslator = require("../../gameManagers/msgManager/msgTranslator");

exports.Sender = function Sender(game){
    this.game = game;
    //工具方法：对指定id玩家push消息
    this.sendMsgByPos = function(route,msgOrMsgArr,posArr){
        if(basicUtils.isEmpty(posArr)){
            game.pusher.pusher.pushRoom(self.initInfo.rid,route,msgOrMsgArr);
        }else{
            var nicks = [];
            for(var i =0; i<idsArr.length;i++){
                nicks.push(self.quickQuery.getNickById(idsArr[i]));
            }
            pusher.pushArr(self.initInfo.rid,route,msgOrMsgArr,nicks);
        }
    };
    //工具方法：对所有参与玩家push消息
    this.sendAllPlayers = function(route,msgOrMsgArr){
        pusher.pushArr(self.initInfo.rid,route,msgOrMsgArr,game.runningInfo.quickArr.nickList);
    };

    this.idMsg = function(initAlloctRes,initWordsRes){
        var route = "onID";
        self.sendAllPlayers(route,msgTranslator.idMsg(initAlloctRes,initWordsRes));
    };
};