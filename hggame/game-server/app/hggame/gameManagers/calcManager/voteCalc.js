var GameInfo = require("../../basicGameInfo/GameInfo");
var hjcArr = require("../../../HJCUtils/HJCArray");
var PlayerInfo = require("../../gameLogic/player").info;
var endChecker = require("./endChecker").endChecker;
var ColorHelper = require("../../basicGameInfo/ColorHelper");

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


exports.calc = function calc(game,isPK){
    var voterArr = game.runningInfo.quickArr.survivals;
    var resArr = game.runningInfo.listenArr.voteToArr;
    var cmdId = game.runningInfo.dayEvent.trigAuth===true?self.runningInfo.dayEvent.authId:null;
    //测试：
    //console.log(voterArr);console.log(resArr);console.log(cmdId);
    var voteChangArr = [];  //唱票数组
    var voteNumArr =[];       //得票排序数组
    var highestPositions = [];//最高票数组
    var result ="";          //投票结果
    var resultHtml = "";       //用于前端显示的投票结果
    //唱票
    this.changVote = function(){
        var surNum = voterArr.length;
        for(var i=0;i<surNum;i++){
            voteChangArr[i] = [];
        }
        for(i = 0; i<resArr.length;i++) {
            if(resArr[i] === 99||resArr[i]===null) continue;
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
                result += arr[j]+"号、";
                resultHtml += "<font color='red'>"+arr[j]+"号</font>、"
            }
            result=result.substring(0,result.length-1);
            resultHtml=resultHtml.substring(0,resultHtml.length-1);
            result+=" -----> "+voteNumArr[i].pos+"号"+" (共"+voteNumArr[i].voteNum+"票)"+"\n";
            resultHtml+="<font color='white'> -----> </font>"+"<font color='#6495ed'>"+voteNumArr[i].pos+"号</font>"+" (共"+voteNumArr[i].voteNum+"票)"+"<br/>";
        }
        var notVoter = false;
        for(i = 0;i<resArr.length;i++){
            if(resArr[i]===null||resArr[i]===99){
                notVoter = true;
                result += voterArr[i]+"号、";
                resultHtml += "<font color='red'>"+voterArr[i]+"号</font>、"
            }
        }
        if(notVoter){
            result=result.substring(0,result.length-1);
            resultHtml=resultHtml.substring(0,resultHtml.length-1);
            result +=" (未参与投票) ";
            resultHtml +=" (未参与投票)";
        }
    };
    this.changVote();
    this.highest();
    this.printer();
    if(highestPositions.length === 0) {//全部放弃投票（必定进入黑夜）
        //平安日检测
        game.runningInfo.timeInfo.leftEvenStep--;
        if(endChecker(game)){
            game.recorder.add("voteRes",{type:0,isPK:isPK,isEnd:true});
            var pushStr = ColorHelper.colorHtml(ColorHelper.COLORS.DAY_COME,"所有玩家弃票，游戏结束...");
            game.sender.onInfo("day",pushStr);
            return true
        }else{
            game.recorder.add("voteRes",{type:0,isPK:isPK,isEnd:false});
            return {info:"所有玩家弃票，3秒后游戏直接进入黑夜...",highestPositions:[]};
        }
    }else if(highestPositions.length === 1){//票死出局
        var voteOutPlayer = game.runningInfo.plyrList[game.quickQuery.getIdByPosition(highestPositions[0])];
        voteOutPlayer.die(PlayerInfo.DIE_OF.VOTE_OUT);
        game.recorder.add("voteRes",{type:1,str:result,html:resultHtml,isPK:isPK,outer:highestPositions[0]});
        game.runningInfo.timeInfo.leftEvenStep = 4;
        if(endChecker(game)){
            pushStr = ColorHelper.colorHtml(ColorHelper.COLORS.NGT_COME,"唱票结果:<br/>"+resultHtml+"<br/>"+highestPositions[0]+"号被公决出局...游戏结束！");
            game.sender.voteRes(pushStr,highestPositions[0]);
            return true;
        }else{
            return {info:resultHtml,highestPositions:highestPositions};
        }
    }else if(highestPositions.length <= 3){//2/3平票
        game.recorder.add("voteRes",{type:2,str:result,html:resultHtml,isPK:isPK,evens:ColorHelper.colorHtml("#ff0000",highestPositions.join("、")+"号")});
        if(isPK){
            game.runningInfo.timeInfo.leftEvenStep--;
            if(endChecker(game)){
                game.sender.onInfo("day",ColorHelper.colorHtml(ColorHelper.COLORS.DAY_COME,"唱票结果:")+"<br/>"+resultHtml+"<br/>"+ColorHelper.colorHtml(ColorHelper.COLORS.DAY_COME,"游戏结束..."));
                return true;
            }else{
                return {info:resultHtml,highestPositions:highestPositions};
            }
        }else{
            return {info:resultHtml,highestPositions:highestPositions};
        }
    }else{
        return {info:resultHtml,highestPositions:highestPositions};
    }
};