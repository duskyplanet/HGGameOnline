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
        //TODO
        if(!!targetsPos){
            testPrint(type+"类型的信息-"+content,targetsPos);
        }else{
            testPrint(type+"类型的信息-"+content,"房间内所有人");
        }
        return;
        if(!!targetsPos){
            var info =  {
                route:"onInfo",
                msg:{type:type,content:content},
                targets:game.tools.getTargetsByPos(targetsPos)
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

    //提醒某个玩家开始执行技能
    //@params skillName：技能名称 srcPos：推送给的对象（技能发起者） targetPos：技能可以指向的目标（无目标不需要此参数）
    this.onSkill = function(skillName,srcPos,targetPos){
        //TODO
        if(!!targetPos){
            testPrint("请发动技能-"+skillName+"；目标："+targetPos,srcPos);
        }else{
            testPrint("请发动技能-"+skillName,srcPos);
        }
        return;
        var info =  {
            route:"onSkill",
            msg:{skillName:skillName},
            targets:game.tools.getTargetsByPos(targetPos)
        };
        self.pusher("players",
            info);
    };

    //提醒所有玩家某个技能发动
    //@params skillName：技能名称 srcPos：技能发起者（匿名技能无此项为null） effectiveTargets：受到影响的玩家（全局技能此项为null） publicInfo：所有人获得的提示
    this.onSkillEffect = function(skillName,srcPos,effectiveTargets,publicInfo){
        //TODO
        var info = srcPos === null?srcPos:"有人";
            info += info +("发动了技能-"+skillName);
            info += effectiveTargets===null?"给所有玩家":("给"+effectiveTargets);
            info += ("并提示："+publicInfo);
            testPrint(info,"所有人");
        return;
        var info =  {
            route:"onSkillEffect",
            msg:{skillName:skillName,srcPos:srcPos,effectiveTargets:effectiveTargets,publicInfo:publicInfo},
            rid: game.initInfo.rid
        };
        self.pusher("room",
            info);
    };

    //提醒所有玩家某个玩家发言
    //@params content：提醒内容 turnPos：发言玩家
    this.onTurn = function(content,turnPos) {
        //TODO
        testPrint(turnPos+content,"所有人");
        return;
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
        //TODO
        testPrint(type+"动画启动！","房内所有人");
        return;
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
        //TODO
        testPrint("游戏结束，结果："+vicParty,"房内所有人");
        return;
        console.log(msgTranslator.endInfo(game,vicParty));
        var info = {
            route:"onEnd",
            msg:{endInfo:msgTranslator.endInfo(game,vicParty),detailInfo:game.recorder.getGameDetailByColorHtml()},
            rid:game.initInfo.rid
        };
        self.pusher("room",
            info);
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
        //TODO
        testPrint("推送死亡信息："+deathArr,"所有人");
        return;
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

    //提醒指定玩家留遗言兵开枪
    //@params skillName：技能名称 srcPos：技能发起者（匿名技能无此项为null） effectiveTargets：受到影响的玩家（全局技能此项为null） publicInfo：所有人获得的提示
    this.onJY = function(outerArr){
        testPrint("请留遗言并开枪",outerArr);
        return;
        var info = {
            route:"onJY",
            msg:"请留遗言并开枪",
            targets:game.tools.getTargetsByPos(outerArr)
        };
        self.pusher("players",
            info);
    }
};

function testPrint(msg,targets){
    console.log("服务器给"+targets+"push了msg："+msg);
}