// 这个translator 只需要返回msgArr，因为idArr是初始知道的
var GameInfo = require("../../basicGameInfo/GameInfo");

exports.idMsg = function(initAlloctRes,initWordsRes){
    var msgArr =[];
    for(var i = 0;i <initAlloctRes.partyList.length;i++){
        var word = "";
        if(initAlloctRes.partyList[i]===GameInfo.PartyInfo.HMN){
            word = initWordsRes.hmnWord;
        }else if(initAlloctRes.partyList[i]===GameInfo.PartyInfo.GST){
            word = initWordsRes.gstWord;
        }else if(initAlloctRes.partyList[i]===GameInfo.PartyInfo.THD){
            word = initWordsRes.alnWord;
        }
        msgArr.push({
            myId:word,
            myJob:GameInfo.JobInfo.getJobNameById(initAlloctRes.jobList[i])
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