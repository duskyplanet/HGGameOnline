var gb = require("../../../global").global;

/**
 * 检测平局天数是否到来
 * */
exports.evenCheck = function evenCheck(game){
    if(game.runningInfo.timeInfo.leftEvenStep > 0) return returnModel(false,null);  //平局条件未到
    if(game.runningInfo.party.alnExist === true){   //平局条件到了，外星人还在场，外星人胜利
        var alnAlive = false;
        var survivals = game.runningInfo.quickArr.survivals;
        for(var i = 0; i < survivals.length ; i++){
            var player = game.runningInfo.playerListByPos[survivals[i]];
            if(player.myParty === gb.GameInfo.PartyInfo.THD){
                alnAlive = true;
                break;
            }
        }
        if(alnAlive){returnModel(true,gb.GameInfo.EndInfo.THD);}
    }
    //狼族感染全场，狼族胜利
    if(game.runningInfo.party.wwfExist === true){
        var isAllInfected = true;
        var wwfAlive = false;
        for(i = 0; i< survivals.length ; i++){
            player = game.runningInfo.playerListByPos[survivals[i]];
            if(player.myParty === gb.GameInfo.PartyInfo.FTH){
                wwfAlive = true;
            }
            if(player.onMeFlags.isInfected !== true && player.myParty !== gb.GameInfo.PartyInfo.FTH){
                isAllInfected = false;
                break;
            }
        }
        if(isAllInfected && wwfAlive){returnModel(true,gb.GameInfo.EndInfo.FTH)}
    }
    //人鬼平局或三族平局
    if(game.runningInfo.party.wwfExist === true){
        return returnModel(true,gb.GameInfo.EndInfo.EVEN_HGW);
    }else{
        return returnModel(true,gb.GameInfo.EndInfo.EVEN_HG);
    }
};

/**
 * 检测外星人是否到达胜利条件
 * */
exports.alnWinCheck = function alnWinCheck(game){
    if(game.runningInfo.party.alnExist !== true) return returnModel(false,null);    //根本就没有外星人
    if(game.runningInfo.quickArr.survAlnNum <= 0) return returnModel(false,null);   //外星人已经挂了
    if(game.runningInfo.quickArr.survivals.length <= (game.runningInfo.ttlPlayerNum - 1)/2){
        return returnModel(true,gb.GameInfo.EndInfo.THD); //外星人存活且到达胜利人数
    }else{
        return returnModel(false,null);     //外星人存活且未到达胜利人数
    }
};

/**
 * 检测狼人是否到达胜利条件
 * */
exports.wwfWinCheck = function wwfWinCheck(game){
    if(game.runningInfo.party.wwfExist !== true) return returnModel(false,null);
    var survivals = game.runningInfo.quickArr.survivals;
    var isAllInfected = true;
    var wwfAlive = false;
    for(var i = 0; i< survivals.length ; i++){
        var player = game.runningInfo.playerListByPos[survivals[i]];
        if(player.myParty === gb.GameInfo.PartyInfo.FTH){
            wwfAlive = true;
        }
        if(player.onMeFlags.isInfected !== true && player.myParty !== gb.GameInfo.PartyInfo.FTH){
            isAllInfected = false;
            break;
        }
    }
    if(isAllInfected && wwfAlive){
        return returnModel(true,gb.GameInfo.EndInfo.FTH)
    }else{
        return returnModel(false,null);
    }
};

/**
 * 检测人鬼的死亡条件是否满足
 * */
exports.fightEndCheck = function fightEndCheck(game){
    var surHmnNum = game.runningInfo.quickArr.surHmnNum;
    var surGstNum = game.runningInfo.quickArr.surGstNum;
    if( surHmnNum > 0 && surGstNum > 0) return returnModel(false,null);
    if( surHmnNum <= 0 ){
        if(surGstNum <= 0){
            if(game.runningInfo.party.wwfExist === true){
                return returnModel(true,gb.GameInfo.EndInfo.EVEN_HGW);
            }else{
                return returnModel(true,gb.GameInfo.EndInfo.EVEN_HG);
            }
        }else{
            return returnModel(true,gb.GameInfo.EndInfo.GST);
        }
    }else{
        return returnModel(true,gb.GameInfo.EndInfo.HMN);
    }
};

var returnModel = function(isEnd,winParty){
    return{
        isEnd:isEnd,
        winParty:winParty
    }
};