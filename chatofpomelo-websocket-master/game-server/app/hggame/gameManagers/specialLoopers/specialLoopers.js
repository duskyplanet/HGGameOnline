var GameInfo = require("../../basicGameInfo/GameInfo");

exports.alienOutManager = alienOutManager;
function alienOutManager(diePosArr,game,cb){
    var alnPlayer = null;
    var cursor = game.runningInfo.playerExistList;
    for(var i = 0; i< diePosArr.length; i++){
        if(cursor[i]!=true) continue;
        var player = game.runningInfo.playerListByPos[i];
        if(player.myJob === GameInfo.PartyInfo.THD){
            alnPlayer = player;
            break;  //默认只有一个外星人
        }
    }
    if(alnPlayer === null){
        cb();
    }else{
        console.log("push外星人猜词");
        setTimeout(function(){
            console.log("push外星人木有猜对")
            cb();
        },5000)
    }
}