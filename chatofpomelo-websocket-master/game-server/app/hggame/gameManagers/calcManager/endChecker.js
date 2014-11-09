var GameInfo = require("../../basicGameInfo/GameInfo");
var hjcArr = require("../../../HJCUtils/HJCArray");
var PlayerInfo = require("../../gameLogic/player").info;
//var endPrinter = require("printManager/endPrinter").endPrinter;

exports.endChecker = endChecker;
function endChecker(game){
    var ttlNum = game.runningInfo.ttlPlyrNum;
    var survivals = game.runningInfo.quickArr.survivals;
    var survNum = survivals.length;
    var gstNum = game.runningInfo.quickArr.survGstNum;
    var hmnNum = game.runningInfo.quickArr.survHmnNum;
    var alnNum = game.runningInfo.quickArr.survAlnNum;
    var alreadySend = false;
    this.testPrinter = function(ttlNum,survivals,survNum,gstNum,hmnNum,alnNum){
        console.log("============endCheker做了一次结束检查：======");
        console.log("玩家总人数："+ttlNum);
        console.log("当前存活"+survNum+"人："+survivals);
        console.log("其中，人："+hmnNum+",鬼："+gstNum+",外星人："+alnNum);
        console.log("=============================================");
    };
    //检查平局
    //this.testPrinter(ttlNum,survivals,survNum,gstNum,hmnNum,alnNum);
    if(game.runningInfo.timeInfo.leftEvenStep<=0) {
        if (alnNum > 0) {
            //外星人胜利
            sendEnd(GameInfo.EndInfo.THD,game);
            return true;
        } else {
            sendEnd(GameInfo.EndInfo.EVE,game);
            return true;
        }
    }
    if(alnNum!=0){
        var victoryNum = Math.floor(ttlNum/2);
        if(survNum<=victoryNum){
            //外星人胜利
            sendEnd(GameInfo.EndInfo.THD,game);
        }else{
            return false;
        }
    }else{
        if(survivals.length <= 0) {
            sendEnd(GameInfo.EndInfo.EVE,game);return true;
        }else if(hmnNum <=0 ){
            sendEnd(GameInfo.EndInfo.GST,game);return true;
        }else if(gstNum <=0 ){
            sendEnd(GameInfo.EndInfo.HMN,game);return true;
        }else{
            return false;
        }
    }
    function sendEnd(vicParty){
        if(alreadySend == true) return;
        alreadySend  = true;
        game.runningInfo.timeInfo.perid = game.runningInfo.timeInfo.PERID.END;
        setTimeout(function(){
            endPrinter(vicParty,game);
        },1000);
    }
}