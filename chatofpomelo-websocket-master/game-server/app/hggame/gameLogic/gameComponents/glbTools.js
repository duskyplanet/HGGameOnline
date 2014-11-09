var GameInfo = require("../../basicGameInfo/GameInfo");
exports.getAliveLists = function getAliveLists(playList){
    var alvHmnList = [];
    var alvGstList = [];
    var alvAln = null;
    var alvWwfList = [];
    var alvHmnPosList = [];
    var alvGstPosList = [];
    var alvAlnPos = -1;
    var alvWwfPosList = [];
    for(var i = 0; i< playList.length;i++){
        if(playList[i]!=null && playList[i]!=undefined){
            if(playList[i].myState.isAlive){
                switch (playList[i].myParty){
                    case GameInfo.PartyInfo.HMN:{
                        alvHmnList.push(playList[i]);
                        alvHmnPosList.push(playList[i].myPosition);
                    }break;
                    case GameInfo.PartyInfo.GST:{
                        alvGstList.push(playList[i]);
                        alvGstPosList.push(playList[i].myPosition);
                    }break;
                    case GameInfo.PartyInfo.FTH:{
                        alvWwfList.push(playList[i]);
                        alvWwfPosList.push(playList[i].myPosition);
                    }break;
                    case GameInfo.PartyInfo.THD:{
                       alvAln = playList[i];
                       alvAlnPos = playList[i].myPosition;
                    }break;
                }
            }
        }
    }
    return {
        alvHmnList:alvHmnList,
        alvGstList:alvGstList,
        alvAln:alvAln,
        alvWwfList:alvWwfList,
        alvHmnPosList:alvHmnPosList,
        alvGstPosList:alvGstPosList,
        alvAlnPos:alvAlnPos,
        alvWwfPosList:alvWwfPosList
    }
};