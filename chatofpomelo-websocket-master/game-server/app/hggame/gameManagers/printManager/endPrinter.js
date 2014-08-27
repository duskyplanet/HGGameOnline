var GameInfo = require("../../basicGameInfo/GameInfo");
exports.endPrinter = function(vicParty,game){    //
    game.runningInfo.timeInfo.perid = game.runningInfo.timeInfo.PERID.END;
    //TODO 推送游戏结果
    console.log("游戏结束："+GameInfo.EndInfo.getEndNameByNum(vicParty));
};