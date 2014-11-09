var hjcArr = require("../../../HJCUtils/HJCArray");

exports.nightFlesh = function nightFlesh(game){
    var fleshArr = game.runningInfo.fleshArr;
    var listenArr = game.runningInfo.listenArr;
    var dayEvent = game.runningInfo.dayEvent;
    fleshArr.lastNgtDeads =[];
    fleshArr.lastNgtCanShoters = [];
    fleshArr.lastNgtFrbSpkrs = [];
    //必须在黑夜首先填充好g
    fleshArr.thisNightSkillBuffer =  hjcArr.fill(game.runningInfo.ttlPlyrNum,null);
    fleshArr.thisDayCanSpkrs = [];  //黑夜calc构造
    fleshArr.dayJobInfo.infos =[];
    fleshArr.dayJobInfo.targetsPos =[];
    listenArr.shootToArr = [];      //shootLoop会构造
    listenArr.voteToArr = [];       //voteLoop会构造
    listenArr.speakOverArr =[];     //speakLoop会构造
    listenArr.nextPKOver = false;
    //黑夜为白天刷新标记
    dayEvent.trigAuth = false;
    dayEvent.trigBless = false;
};

/** 进入黑夜 玩家刷新当前状态 **/
exports.enterNgtFlesh = function enterNgtFlesh(game){
    var cursor = game.runningInfo.playerExistList;
    var playerList = game.runningInfo.playerListByPos;
    for(var i = 0; i < cursor.length; i++){
        if(cursor[i] != true) continue;
        var onMeFlags = playerList[i].onMeFlags;
        var myJobFlags = playerList[i].myJobFlags;
        //刷新别的职业在我身上的状态
        onMeFlags.isConfused = false;           //当夜尚未被魔术师[迷惑]            每夜刷新
        onMeFlags.isPersuaded = false;          //当夜尚未被天使[神圣劝化]          每夜刷新
        onMeFlags.isSlaughtered =false;         //当夜尚未被恶魔[嗜血屠戮]          每夜刷新
        onMeFlags.isToDmnBody = false;          //当夜技能尚未指向恶魔[邪魔附体]    每夜刷新
        onMeFlags.isProvoked =false;            //当夜尚未被挑拨者[煽动]（其他技能无效）            每夜刷新
        onMeFlags.isRepresent = false;          //当夜尚未被代言人[代言]              每夜刷新
        onMeFlags.isVerified = false;           //当夜尚未被验尸官加上活体[鉴定]      每夜刷新
        onMeFlags.isPsychic = false;            //当夜尚未被通灵师加上[通灵]标记      每夜刷新
        onMeFlags.isUndeadGst = false;           //活者当夜尚未被通灵师加上[不死亡灵]标记     每夜刷新
        onMeFlags.isHypnosis = false;            //当夜被尚未音乐家加上[催眠]标记             每夜刷新
        onMeFlags.isFramed = false;              //当夜尚未被阴谋家加上[诬陷]标记             每夜刷新
        onMeFlags.addShieldNum = 0;              //当晚被尚未被守护者叠加的[守护]层数          每夜刷新
        onMeFlags.shieldRemover = [];            //当晚尚未有消除我的[守护]buff、[下注]的额外生命、[顶级戒备]护盾的所有潜在凶手 每夜刷新
        onMeFlags.isBlessed = false;             //当天夜晚尚未被祈福者使用[祝福]导致该玩家不能出局 每夜刷新
        //我的技能产生的状态
        myJobFlags.thisNgtDeduceReceived = false;  //当夜尚未收到来自于我的[推演] 每夜刷新
    }
}