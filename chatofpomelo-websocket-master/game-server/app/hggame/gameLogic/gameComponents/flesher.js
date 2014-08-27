var hjcArr = require("../../../HJCUtils/HJCArray");

exports.nightFlesh = function nightFlesh(game){
    var fleshArr = game.runningInfo.fleshArr;
    var listenArr = game.runningInfo.listenArr;
    var dayEvent = game.runningInfo.dayEvent;
    fleshArr.lastNgtDeads =[];
    fleshArr.lastNgtCanShoters = [];
    fleshArr.lastNgtFrbSpkrs = [];
    //必须在黑夜首先填充好g
    fleshArr.thisNightSkillBuffer =  hjcArr.fill(game.runningInfo.quickArr.survivals.length,null);
    fleshArr.thisDayCanSpkrs = [];  //黑夜calc构造
    listenArr.shootToArr = [];      //shootLoop会构造
    listenArr.voteToArr = [];       //voteLoop会构造
    listenArr.speakOverArr =[];     //speakLoop会构造
    listenArr.nextPKOver = false;
    //黑夜为白天刷新标记
    dayEvent.trigAuth = false;
    dayEvent.trigBless = false;
};