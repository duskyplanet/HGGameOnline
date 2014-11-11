var GameInfo = require("../../basicGameInfo/GameInfo");
var hjcArr = require("../../../HJCUtils/HJCArray");
var PlayerInfo = require("../../gameLogic/player").info;

exports.calc =  {
    VOTE_RES : {
        DIRECT_NIGHT : 1,
        PK : 2,
        VOTE_OUT : 3
    },

    NIGHT_RES:{
        PEACE_NGT : 1,
        NO_SHOOTERS:2,
        SHOOTERS:3
    },

    voteCalc :function(voterArr,resArr,cmdId){
//console.log(voterArr);console.log(resArr);console.log(cmdId);
        if(hjcArr.allValue(resArr,null)){
            return {code:this.VOTE_RES.DIRECT_NIGHT,info:"所有玩家弃票，游戏5秒后直接进入黑夜..."};
        }
        var surNum = voterArr.length;
        var voteChangArr = [];
        for(var i=0;i<surNum;i++){
            voteChangArr[i] = [];
        }
        for(i = 0; i<resArr.length;i++) {
            var targetID = hjcArr.positions(voterArr,resArr[i])[0];
            if(typeof targetID === "number"){
                voteChangArr[targetID].push(voterArr[i]);
            }
        }
        var voteNumArr =[];
        for(i=0;i<surNum;i++){
            voteNumArr[i] = { pos:voterArr[i],voteNum:voteChangArr[i].length}
        }
        if(cmdId!=null||cmdId!=undefined){
            var cmdVote = Math.ceil(surNum/2);
            var target = resArr[hjcArr.positions(voterArr,cmdId)[0]];
            if(typeof target==="number"){
                voteNumArr[hjcArr.positions(voterArr,target)[0]].voteNum+=(cmdVote-1);
            }
        }
        hjcArr.sortByPrpStrict(voteNumArr,["voteNum"]);
        voteNumArr.reverse();
        for(i = 0;i<surNum;i++){
            if(voteNumArr[i].voteNum<=0){
               voteNumArr = voteNumArr.slice(0,i);
               break;
            }
        }
        var highestPositions = [];
//console.log(voteNumArr);
        highestPositions.push(voteNumArr[0].pos);
        for(i = 1; i<voteNumArr.length;i++){
            if(voteNumArr[i].voteNum === voteNumArr[0].voteNum){
                highestPositions.push(voteNumArr[i].pos);
            }else{
                break;
            }
        }
        var result ="";
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
                if(resArr[i]===null){
                    notVoter = true;
                    result += voterArr[i]+"号、";
                }
            }
            if(notVoter){
                result=result.substring(0,result.length-1);
                result +=" (未参与投票) "
            }
        };
        this.printer();
        if(highestPositions.length===1){
            return {code:this.VOTE_RES.VOTE_OUT,info:result,highestPositions:highestPositions};
        }else{
            return {code:this.VOTE_RES.PK,info:result,highestPositions:highestPositions};
        }
    },

    voteEndChecker:function(game){
        var survivals = game.runningInfo.quickArr.survivals;
        var survNum = survivals.length;
        var ttlNum = game.runningInfo.ttlPlyrNum;
        var gstNum = game.runningInfo.quickArr.survGstNum;
        var hmnNum = game.runningInfo.quickArr.survHmnNum;
        var alnNum = game.runningInfo.quickArr.survAlnNum;
console.log(survivals);
console.log("rigin-ttl:"+ttlNum);
console.log("gst:"+gstNum);
console.log("hmn:"+hmnNum);
console.log("aln:"+alnNum);
        //检查平局
        if(game.runningInfo.timeInfo.leftEvenStep<=0) {
            if (alnNum > 0) {
                //外星人胜利
                return {isEnd: true, vicInfo: "外星人胜利", vicParty: GameInfo.PartyInfo.THD, evenParty: []}
            } else {
                return {isEnd: true, vicInfo: "平局！", vicParty: null, evenParty: [GameInfo.PartyInfo.HMN, GameInfo.PartyInfo.GST]}
            }
        }
        if(alnNum!=0){
            var victoryNum = Math.floor(ttlNum/2);
            if(survNum<=victoryNum){
                //外星人胜利
                return {isEnd:true,vicInfo:"外星人胜利！",vicParty:GameInfo.PartyInfo.THD,evenParty:[]}
            }else{
                return {isEnd:false}
            }
        }else{
            if(survivals.length <= 0) {
                return{isEnd: true, vicInfo: "平局！",vicParty:null,evenParty:[GameInfo.PartyInfo.HMN, GameInfo.PartyInfo.GST]}
            }else if(hmnNum <=0 ){
                return{isEnd: true, vicInfo: "鬼阵营胜利！",vicParty:GameInfo.PartyInfo.GST,evenParty:[]}
            }else if(gstNum <=0 ){
                return{isEnd: true, vicInfo: "人类阵营胜利！",vicParty:GameInfo.PartyInfo.HMN,evenParty:[]}
            }else{
                return{isEnd: false}
            }
        }
    },

    nightCalc:function(game){
        var skillBuffer = game.runningInfo.fleshArr.thisNightSkillBuffer;
        //技能排序
        var basicKillBuffer = [];
        for(var i = 0; i<skillBuffer.length;i++){
            if(skillBuffer[i]===null){continue;}
            if(skillBuffer[i].name ==="basicKill"){
                basicKillBuffer.push(skillBuffer[i]);
            }
        }
        //技能执行
        for(i = 0; i<basicKillBuffer.length;i++){
            var srcPlayer = basicKillBuffer[i].srcPlayer;
            var tarPlayer =  basicKillBuffer[i].tarPlayer;
            if(tarPlayer===null){console.log("calcManager发生致命逻辑错误：basicKill指向不存在玩家！")}
            if(srcPlayer.myParty ===GameInfo.PartyInfo.HMN){
                srcPlayer.die(PlayerInfo.DIE_OF.HMN_KILLED_BY_SELF);
            }else if(srcPlayer.myParty ===GameInfo.PartyInfo.GST){
                tarPlayer.die(PlayerInfo.DIE_OF.KILLED_BY_GST);
            }
        }

        var deadResult = [];

        //刷新本轮黑夜的list：
        var deadList = game.runningInfo.fleshArr.lastNgtDeads;
        game.runningInfo.fleshArr.thisDayCanSpkrs = game.runningInfo.quickArr.survivals;;
        for(i = 0;i<deadList.length;i++){
            if(deadList[i].state.canShot ===true){
                game.runningInfo.fleshArr.lastNgtCanShoters.push(deadList[i].myId);
                deadResult.push({
                    pos:deadList[i].myPosition,
                    info:"出局（有技能和遗言）"
                });
            }else{
                deadResult.push({
                    pos:deadList[i].myPosition,
                    info:"出局（无技能无遗言）"
                });
            }
        }
        //canSpkrs暂时就是survivals
//        for(i = 0;i< game.runningInfo.fleshArr.thisDayCanSpkrs.length;i++){
//            if( hjcArr.exist(deadList,game.runningInfo.fleshArr.thisDayCanSpkrs[i])){
//                game.runningInfo.fleshArr.thisDayCanSpkrs[i] = null;
//            }
//        }
//        hjcArr.deleteValue(game.runningInfo.fleshArr.thisDayCanSpkrs,null);
        if(deadResult.length>0){
            hjcArr.sortByPrpStrict(deadResult,["pos"]);
        }
        var resStr = "";
        for(i= 0;i<deadResult.length;i++){
            resStr+= deadResult[i].pos+"号--"+deadResult[i].info+"\n";
        }
        return resStr;
    },

    nightEndChecker :function(game){
        var ngtRes = this.voteEndChecker(game);
        if(ngtRes.isEnd ===true){
            return ngtRes;
        }else{
            if(game.runningInfo.fleshArr.lastNgtDeads.length === 0){
                return{isEnd:false,nextStep:this.NIGHT_RES.PEACE_NGT}
            }else if(game.runningInfo.fleshArr.lastNgtCanShoters.length === 0){
                return{isEnd:false,nextStep:this.NIGHT_RES.NO_SHOOTERS}
            }else{
                return{isEnd:false,nextStep:this.NIGHT_RES.SHOOTERS}
            }
        }
    }
};

//var voterArr =[3,4,5,6,7,8,9,10,11,12,13];
//var resArr = [9,9,9,9,null,9,3,3,4,9,9];
//var cmdId = 9;
//
//console.log(calc.voteCalc(voterArr,resArr,cmdId));