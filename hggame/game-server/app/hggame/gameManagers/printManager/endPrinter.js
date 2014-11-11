var GameInfo = require("../../basicGameInfo/GameInfo");
exports.endPrinter = function(vicParty,game){//
    //TODO 推送游戏结果
    var vicStr = GameInfo.EndInfo.getEndNameByNum(vicParty);
    console.log("游戏结束："+vicStr);
    game.recorder.add("end",vicStr);
    game.sender.onEnd(vicParty);
};