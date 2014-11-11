// 这个translator 只需要返回msgArr，因为idArr是初始知道的
var GameInfo = require("../../basicGameInfo/GameInfo");
var hjcArr = require("../../../HJCUtils/HJCArray");

exports.idMsg = function(initAlloctRes,initWordsRes){
    var msgArr =[];
    for(var i = 0;i <initAlloctRes.partyList.length;i++){
        var word = "";
        var myJob = initAlloctRes.jobList[i];
        var myParty = initAlloctRes.partyList[i];
        if(myParty===GameInfo.PartyInfo.HMN){
            word = initWordsRes.hmnWord;
            if(myJob === GameInfo.JobInfo.getJobId("spy")){
                word = initWordsRes.gstWord;
            }
        }else if(myParty===GameInfo.PartyInfo.GST){
            word = initWordsRes.gstWord;
            if(myJob === GameInfo.JobInfo.getJobId("spy")){
                word = initWordsRes.hmnWord;
            }
        }else if(myParty===GameInfo.PartyInfo.THD){
            word = initWordsRes.alnWord;
        }
        msgArr.push({
            myId:word,
            myJob:initAlloctRes.jobList[i]
        });
    }
    return msgArr;
};

exports.dayComeMsg = function(game,jmpSht,jmpDay,spkrs){
    var self = this;
    this.gState = game.runningInfo;
    this.commonMsg = {
        day:self.gState.timeInfo.num,
        deads:self.gState.fleshArr.lastNgtDeads,
        shoters:self.gState.fleshArr.lastNgtCanShoters,
        restNum:self.gState.quickArr.servivals.length,
        jmpSht:jmpSht,
        jmpDay:jmpDay
    };
    if(jmpSht===true&&jmpDay===false){
        self.commonMsg.spkrs = spkrs;
        self.commonMsg.fbSpkrs = self.gState.fleshArr.lastNgtFrbSpkrs;
    }
};

exports.nightMoveMsg = function(game){
    var msgArr =[];
    for(var i = 0;i <game.runningInfo.quickArr.survivals.length;i++){
        var player = game.runningInfo.plyrList[game.quickQuery.getIdByPosition(game.runningInfo.quickArr.survivals[i])];
        msgArr.push(player.spellMyNightMoveMsg());
    }
console.log(msgArr);
    return msgArr;
};

exports.endInfo = function(game,vicParty){
    var infoArr = [];
    for(var i =0;i<game.runningInfo.plyrList.length;i++){
        infoArr.push(game.runningInfo.plyrList[i].getMyEndInfo(vicParty));
    }
    return {
        title:GameInfo.EndInfo.getEndNameByNum(vicParty),
        infoArr:infoArr
    }
};

exports.dayVoteTargets = function(survivals){
    var voteArr = [];
    for(var i=0;i<survivals.length;i++){
        var arr = [].concat(survivals);
        hjcArr.deleteValue(arr,survivals[i]);
        voteArr.push({voteTargets:arr});
    }
    return voteArr;
};

exports.dayPKVoteTargets = function(survivals,PKPos){
    var voteArr = [];
    if(PKPos.length === 2){
        for(var i=0;i<survivals.length;i++){
            if(survivals[i]===PKPos[0]||survivals[i]===PKPos[1]){
                continue;
            }
            var arr = [].concat(survivals);
            hjcArr.deleteValue(arr,survivals[i]);
            voteArr.push({voteTargets:PKPos});
        }
        return voteArr;
    }else{
        for(i=0;i<survivals.length;i++){
            arr = [].concat(survivals);
            hjcArr.deleteValue(arr,survivals[i]);
            voteArr.push({voteTargets:PKPos});
        }
        return voteArr;
    }
};