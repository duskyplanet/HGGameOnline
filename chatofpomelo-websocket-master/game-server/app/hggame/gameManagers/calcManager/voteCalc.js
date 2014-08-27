var GameInfo = require("../../basicGameInfo/GameInfo");
var hjcArr = require("../../../HJCUtils/HJCArray");
var PlayerInfo = require("../../gameLogic/player").info;
var endChecker = require("./endChecker").endChecker;

var info = {
    VOTE_RES : {
        DIRECT_NIGHT : 1,
        PK_2 : 2,
        PK_3 : 3,
        VOTE_AG: 4,
        VOTE_OUT : 5
    }
};
exports.info = info;


exports.calc = function calc(game){
    var voterArr = game.runningInfo.quickArr.survivals;
    var resArr = game.runningInfo.listenArr.voteToArr;
    var cmdId = game.runningInfo.dayEvent.trigAuth===true?self.runningInfo.dayEvent.authId:null;
    //测试：
    //console.log(voterArr);console.log(resArr);console.log(cmdId);
    var voteChangArr = [];  //唱票数组
    var voteNumArr =[];       //得票排序数组
    var highestPositions = [];//最高票数组
    var result ="";          //投票结果
    //唱票
    this.changVote = function(){
        var surNum = voterArr.length;
        for(var i=0;i<surNum;i++){
            voteChangArr[i] = [];
        }
        for(i = 0; i<resArr.length;i++) {
            if(resArr[i] === 99) continue;
            var targetID = hjcArr.position(voterArr,resArr[i]);
            if(typeof targetID === "number"){
                voteChangArr[targetID].push(voterArr[i]);
            }
        }
        for(i=0;i<surNum;i++){
            voteNumArr[i] = { pos:voterArr[i],voteNum:voteChangArr[i].length}
        }
        if(cmdId!=null){
            var cmdVote = Math.ceil(surNum/2);
            var target = resArr[hjcArr.positions(voterArr,cmdId)[0]];
            if(typeof target==="number"){
                voteNumArr[hjcArr.positions(voterArr,target)[0]].voteNum+=(cmdVote-1);
            }
        }
        if(voteNumArr.length!=0){
            hjcArr.sortByPrpStrict(voteNumArr,["voteNum"]);
            voteNumArr.reverse();
        }
        for(i = 0;i<surNum;i++){
            if(voteNumArr[i].voteNum<=0){
                voteNumArr = voteNumArr.slice(0,i);
                break;
            }
        }
    };
    //统计最高票
    this.highest = function(){
        if(voteNumArr.length!=0){
            highestPositions.push(voteNumArr[0].pos);
        }
        for(i = 1; i<voteNumArr.length;i++){
            if(voteNumArr[i].voteNum === voteNumArr[0].voteNum){
                highestPositions.push(voteNumArr[i].pos);
            }else{
                break;
            }
        }
    };
    //打印投票结果
    this.printer = function(){
        for(i = 0;i<voteNumArr.length;i++){
            var arr = voteChangArr[hjcArr.positions(voterArr,voteNumArr[i].pos)[0]];
            for(var j = 0;j<arr.length;j++){
                result += arr[j]+"号、"
            }
            result=result.substring(0,result.length-1);
            result+=" -----> "+voteNumArr[i].pos+"号"+" (共"+voteNumArr[i].voteNum+"票)"+"\n";
        }
        var notVoter = false;
        for(i = 0;i<resArr.length;i++){
            if(resArr[i]===null||resArr[i]===99){
                notVoter = true;
                result += voterArr[i]+"号、";
            }
        }
        if(notVoter){
            result=result.substring(0,result.length-1);
            result +=" (未参与投票) "
        }
    };
    this.changVote();
    this.highest();
    this.printer();
    if(highestPositions.length === 0) {
        //平安日检测
        if(endChecker(game)) return true;
    }else if(highestPositions.length === 1){
        var voteOutPlayer = game.runningInfo.plyrList[game.quickQuery.getIdByPosition(highestPositions[0])];
        voteOutPlayer.die(PlayerInfo.DIE_OF.VOTE_OUT);
        if(endChecker(game)) return true;
    }
    if(hjcArr.allValues(resArr,[null,99])){
        return {info:"所有玩家弃票，3秒后游戏直接进入黑夜...",highestPositions:[]};
    }else return {info:result,highestPositions:highestPositions};
};