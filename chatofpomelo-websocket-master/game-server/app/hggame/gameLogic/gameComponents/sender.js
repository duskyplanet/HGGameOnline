var hjcArr = require("../../../HJCUtils/HJCArray");
var basicUtils =  require("../../../HJCUtils/basicUtils");
var msgTranslator = require("../../gameManagers/msgManager/msgTranslator");
var ColorHelper = require("../../basicGameInfo/ColorHelper");

exports.Sender = function Sender(game){
    var self = this;
    this.game = game;
    this.pusher = game.pusher;
    //工具方法：对指定id玩家push消息
    this.sendMsgByPos = function(route,msgOrMsgArr,posArr){
        if(basicUtils.isEmpty(posArr)){
            game.pusher.pusher.pushRoom(self.initInfo.rid,route,msgOrMsgArr);
        }else{
            var nicks = [];
            for(var i =0; i<idsArr.length;i++){
                nicks.push(self.quickQuery.getNickById(idsArr[i]));
            }
            pusher.pushArr(self.initInfo.rid,route,msgOrMsgArr,nicks);
        }
    };
    //工具方法：对所有参与玩家push消息
    this.sendAllPlayers = function(route,msgOrMsgArr){
        pusher.pushArr(self.initInfo.rid,route,msgOrMsgArr,game.runningInfo.quickArr.nickList);
    };

    //向所有玩家推送ID消息
    this.idMsg = function(initAlloctRes,initWordsRes){
        var info =  {
            route:"onID",
            msgs:msgTranslator.idMsg(initAlloctRes,initWordsRes,game.recorder),
            msg:null,
            rid:null,
            targets:game.quickQuery.getTargetsByPos(game.runningInfo.quickArr.survivals)
        };
        self.pusher("players",
            info);
    };

    //向指定玩家推送局势信息
    this.onInfo = function(type,content,targetsPos){
        if(!!targetsPos){
            var info =  {
                route:"onInfo",
                msgs:null,
                msg:{type:type,content:content},
                rid:null,
                targets:game.quickQuery.getTargetsByPos(targetsPos)
            };
            self.pusher("players",
                info);
        }else{
            info =  {
                route:"onInfo",
                msg:{type:type,content:content},
                rid:game.initInfo.rid
            };
            self.pusher("room",
                info);
        }
    };

    this.onSkill = function(){

    }

    //向room推送发言开始信息
    this.onTurn = function(content,turnPos) {
        var info = {
            route: "onTurn",
            msg: {content: ColorHelper.colorHtml(ColorHelper.COLORS.ON_TURN,content),turnPos:turnPos},
            rid: game.initInfo.rid
        };
        self.pusher("room",
            info);
    };

    this.onPKTurn = function(content,turnPos) {
        var info = {
            route: "onPKTurn",
            msg: {content: ColorHelper.colorHtml(ColorHelper.COLORS.ON_TURN,content),turnPos:turnPos},
            rid: game.initInfo.rid
        };
        self.pusher("room",
            info);
    };

    this.onSave = function(restTime,newSaveTime,saverPos) {
        var info = {
            route: "onSave",
            msg: {content: ColorHelper.colorHtml(ColorHelper.COLORS.ON_SAVE,saverPos+"号预留时间，结束了发言..."), restTime:restTime,newSaveTime:newSaveTime,saverPos:saverPos},
            rid: game.initInfo.rid
        };
        self.pusher("room",
            info);
    };

    this.onPKOver = function(saverPos) {
        var info = {
            route: "onPKOver",
            msg: {content: ColorHelper.colorHtml(ColorHelper.COLORS.ON_SAVE,saverPos+"号结束了PK发言...")},
            rid: game.initInfo.rid
        };
        self.pusher("room",
            info);
    };

    this.useSave = function(userPos){
        var info = {
            route: "onUseSave",
            msg: {content: ColorHelper.colorHtml(ColorHelper.COLORS.ON_USE_SAVE,userPos+"号启用了预留时间..."),userPos:userPos},
            rid: game.initInfo.rid
        };
        self.pusher("room",
            info);
    };

    this.overSave = function(overPos,restTime){
        var info = {
            route: "onOverSave",
            msg: {content:ColorHelper.colorHtml(ColorHelper.COLORS.ON_OVER_SAVE,overPos+"号结束了预留发言...") ,overPos:overPos,restTime:restTime},
            rid: game.initInfo.rid
        };
        self.pusher("room",
            info);
    };

    this.onAni = function(type){
        var info = {
            route: "onAni",
            msg: {type:type},
            rid: game.initInfo.rid
        };
        self.pusher("room",
            info);
    };

    this.onNightCome = function(){
        this.onInfo("night","<br/>"+ColorHelper.colorHtml(ColorHelper.COLORS.NGT_COME,"黑夜到来啦，请所有存活玩家行动吧（"+game.initInfo.timers.nightTime+"秒）！"));
        this.counter(true,"黑夜剩余",game.initInfo.timers.nightTime,"nightMove");
        var info = {
            route:"onNgtMove",
            msgs:msgTranslator.nightMoveMsg(game),
            msg:null,
            rid:null,
            targets:game.quickQuery.getTargetsByPos(game.runningInfo.quickArr.survivals)
        };
        self.pusher("players",
            info);
    };

    this.onEnd = function(vicParty){
        console.log(msgTranslator.endInfo(game,vicParty));
        var info = {
            route:"onEnd",
            msg:{endInfo:msgTranslator.endInfo(game,vicParty),detailInfo:game.recorder.getGameDetailByColorHtml()},
            rid:game.initInfo.rid
        };
        self.pusher("room",
            info);
        //TODO
        console.log(game.recorder.gameDetail);
        console.log(game.recorder.gameHtml);
    };

    this.onShot = function(shooterIds,targets){
        this.onInfo("day",ColorHelper.colorHtml(ColorHelper.COLORS.DAY_COME,"等待出局者遗言和开枪（"+game.initInfo.timers.shootTime+"秒）..."));
        this.counter(true,"技言剩余",game.initInfo.timers.shootTime,"shoot");
        var info = {
            route:"onShot",
            msgs:null,
            msg:{targets:targets},
            rid:null,
            targets:game.quickQuery.getTargetsByPos(shooterIds)
        };
        self.pusher("players",
            info);
    };

    this.someBodyShot = function(srcPos,tarPos){
        var info = {
            route:"onSbSht",
            msg:{srcPos:srcPos,tarPos:tarPos},
            rid:game.initInfo.rid
        };
        self.pusher("room",
            info);
    };

    this.onDie = function(deathArr){
        var info = {
            route:"onDie",
            msg:{deathArr:deathArr},
            rid:game.initInfo.rid
        };
        self.pusher("room",
            info);
    };

    this.onLastWord = function(srcPos,lastWord){
        var info = {
            route:"onLstWd",
            msg:{lastPos:ColorHelper.colorHtml(ColorHelper.COLORS.ON_LAST_WORD,srcPos+"号发表了遗言..."),content:lastWord},
            rid:game.initInfo.rid
        };
        self.pusher("room",
            info);
    };

    this.onVote = function(){
        this.onInfo("day",ColorHelper.colorHtml(ColorHelper.COLORS.DAY_COME,"等待所有玩家投票...<br/>"));
        this.counter(true,"公决剩余",game.initInfo.timers.voteTime,"vote");
        var info = {
            route:"onVote",
            msgs:msgTranslator.dayVoteTargets(game.runningInfo.quickArr.survivals),
            msg:null,
            rid:null,
            targets:game.quickQuery.getTargetsByPos(game.runningInfo.quickArr.survivals)
        };
        self.pusher("players",
            info);
    };

    this.onPKVote = function(PKPos){
        this.onInfo("day",ColorHelper.colorHtml(ColorHelper.COLORS.DAY_COME,"等待所有可投票玩家再次投票...<br/>"));
        this.counter(true,"公决剩余",game.initInfo.timers.voteTime,"vote");
        for(var i = 0;i< game.runningInfo.listenArr.voteToArr.length;i++){
            game.runningInfo.listenArr.voteToArr[i] = null;
        }
        if(PKPos.length ===2 ){
            var AID = hjcArr.position(game.runningInfo.quickArr.survivals,PKPos[0]);
            var BID = hjcArr.position(game.runningInfo.quickArr.survivals,PKPos[1]);
            game.runningInfo.listenArr.voteToArr[AID] = 99;
            game.runningInfo.listenArr.voteToArr[BID] = 99;
            var tempTar = [].concat(game.runningInfo.quickArr.survivals);
            hjcArr.deleteValue(tempTar,PKPos[0]);
            hjcArr.deleteValue(tempTar,PKPos[1]);
            var info = {
                route:"onVote",
                msgs:msgTranslator.dayPKVoteTargets(game.runningInfo.quickArr.survivals,PKPos),
                msg:null,
                rid:null,
                targets:game.quickQuery.getTargetsByPos(tempTar)
            };
        }else{
            info = {
                route:"onVote",
                msgs:msgTranslator.dayPKVoteTargets(game.runningInfo.quickArr.survivals,PKPos),
                msg:null,
                rid:null,
                targets:game.quickQuery.getTargetsByPos(game.runningInfo.quickArr.survivals)
            };
        }
        self.pusher("players",
            info);

    };

    this.voteRes = function(pushStr,voteOutPos){
        var that = this;
        setTimeout(function(){
            that.counter(true,"遗言剩余",game.initInfo.timers.LstWdTime,"lastWord");
        },200);
        var info = {
            route:"voteRes",
            msg:{voteOutPos:voteOutPos,content:pushStr},
            rid:game.initInfo.rid
        };
        self.pusher("room",
            info);
    };

    this.counter = function(type,content,secs,perid){
        var info = {
            route:"onCounter",
            msg:{type:type,content:content,secs:secs,perid:perid},
            rid:game.initInfo.rid
        };
        self.pusher("room",
            info);
    };

    this.dayJobInfo = function(){
        if(game.runningInfo.fleshArr.dayJobInfo.targetsPos.length<=0){
            return;
        }
        var info = {
            route:"onJobInfo",
            msgs:game.runningInfo.fleshArr.dayJobInfo.infos,
            msg:null,
            rid:null,
            targets:game.quickQuery.getTargetsByPos(game.runningInfo.fleshArr.dayJobInfo.targetsPos)
        };
        self.pusher("players",
            info);
    }

    /** 向指定玩家推送技言提醒：用于白天出局者有技言
     * */
    this.onJY = function(outerArr){

    }
};