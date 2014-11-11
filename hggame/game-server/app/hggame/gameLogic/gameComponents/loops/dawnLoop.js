var gb = require("../../../global").global;

/**
 * 游戏逻辑主循环（一）：黎明事件
 * */

exports.dawnLoop = function dawnLoop(game){
    game.runningInfo.timeInfo.period = game.runningInfo.timeInfo.PERIOD.DAWN;
    var DL = this;
    var timers = game.initInfo.timers;
    DL.step1(game);
    //推送黎明提示
    DL.step1 = function(game){
        game.sender.onAni("day");           //TODO push 白天动画
        setTimeout(function(){
            game.sender.onInfo("day",game.runningInfo.timeInfo.num);            //TODO push 白天到来信息
            setTimeout(function(){
                DL.step2(game);
            },timers.gap*2000);
        },timers.ani*1000);
    };
    //处理黎明信息
    DL.step2 = function(game){
        //TODO
//        DL.tools.DawnSklResFlesh(game);
//        DL.tools.DawnPrivateInfoPush(game);
//        DL.tools.DawnEffectPush(game);
//        DL.tools.DawnArrFlush(game);
        setTimeout(function(){
            if(game.runningInfo.fleshArr.lastNgtDeads.length > 0){
                DL.step3A(game);
            }else{
                DL.step3B(game);
            }
        },timers.gap*1000);
    };
    //有出局者
    DL.step3A = function(game){
        game.sender.onInfo("nightRes",game.runningInfo.fleshInfo.lastNgtOutInfoHtml);   //TODO 广播死亡信息
        game.sender.onDie(game.runningInfo.fleshArr.lastNgtDeadDetail);         //TODO 广播死亡效果
        var endCheck = gb.endCheck.alnWinCheck(game);
        if(endCheck.isEnd === true){
            gb.endManager(game,endCheck.winParty);        //TODO endManager
        }else{
            //外星人在黑夜出局
            if(game.runningInfo.fleshInfo.ngtAlnOut === true){
                var aln = game.runningInfo.playerListByPos[game.runningInfo.quickArr.alnPos];
                game.runningInfo.fleshInfo.ngtAlnOut = false;
                //已用先机
                if(aln.myJobFlags.isGuessUsed === true){
                    game.sender.onInfo("alnOut","外星人"+aln.myPosition+"号已经出局！不可使用先机猜词/选图...");   //TODO 广播提示
                    //夜晚[救世]发动
                    if(game.runningInfo.fleshArr.glbEvent.trigSaveForThisNgt === true){
                        game.runningInfo.fleshArr.glbEvent.trigSaveForThisNgt = false;
                        gb.loops.saverSaveLoop(game,gb.loops.saverSaveType.trigInNgt);
                    }else{
                       DL.step4(game);
                    }
                //未用先机
                }else{
                    game.sender.onInfo("alnOut","外星人"+aln.myPosition+"号已经出局！请先机猜词/选图...");  //TODO 广播提示
                    game.sender.onSkill("guess",aln.myPosition);    //TODO  点播技能发动提示
                    gb.loops.alienGuessLoop(game,gb.loops.alienGuessType.outInNgt);
                }
            //有出局者但无外星人出局
            }else{
                //夜晚[救世]发动
                if(game.runningInfo.fleshArr.glbEvent.trigSaveForThisNgt === true){
                    game.runningInfo.fleshArr.glbEvent.trigSaveForThisNgt = false;
                    gb.loops.saverSaveLoop(game,gb.loops.saverSaveType.trigInNgt);
                }else{
                    DL.step4(game);
                }
            }
        }
    };
    //无出局者
    DL.step3B = function(game){
        game.sender.onInfo("nightRes","这是一个平安夜...");         //TODO push 平安夜信息
        //夜晚[圣光普照]发动
        if(game.runningInfo.fleshArr.glbEvent.trigSaveForThisNgt === true){
            game.runningInfo.fleshArr.glbEvent.trigSaveForThisNgt = false;
            gb.loops.saverSaveLoop(game,gb.loops.saverSaveType.trigInNgt);
        }else{
            var endCheck = gb.endCheck.evenCheck(game);
            //平局条件到来
            if(endCheck.isEnd === true){
                gb.endManager(game,endCheck.winParty);        //TODO endManager
            }else{
                DL.step4(game);
            }
        }
    };
    //检查游戏是否结束，否则进入开枪流程
    DL.step4 = function(game){
        var endCheck = gb.endCheck.wwfWinCheck(game);
        if(endCheck.isEnd === true){
            gb.endManager(game,endCheck.winParty);
        }else{
            endCheck = gb.endCheck.fightEndCheck(game);
            if(endCheck.isEnd === true){
                gb.endManager(game,endCheck.winParty);
            }else{
                gb.loops.shootLoop(game);
            }
        }
    };
    DL.tools = {
        /**
         * 黎明技能结果刷新器（修改+推送）：
         * 1、潜行[寒光]是否成功（修改+推送）。2、[日月新天]
         * */
        DawnSklResFlesh: function (game) {

        },
        /**
         * 黎明个人信息推送器（推送）：
         * 1、媚女[色诱/倾城]信息（推送）。2、间谍[双面神通]信息。（推送）
         * */
        DawnPrivateInfoPush: function (game) {
            //1、第一次受到启迪者启迪的职业/降临的天使/觉醒的恶魔提示。
            var survivals = game.runningInfo.quickArr.survivals;
            for (var i = 0; i < survivals.length; i++) {
                var player = game.runningInfo.playerListByPos[survivals[i]];
                //外域和狼族不受启迪。
                if (player.myParty === gb.GameInfo.PartyInfo.THD || player.myParty === gb.GameInfo.PartyInfo.FTH) continue;
                //圣佛尊和鬼如来不受启迪。
                if (player.myJob === gb.GameInfo.JobInfo.getJobId("sfz") || player.myJob === gb.GameInfo.JobInfo.getJobId("grl")) continue;
                //天使和恶魔分为受启迪降临/觉醒 和 自然觉醒两种状态。
                if (player.myJob === gb.GameInfo.JobInfo.getJobId("agl")) {
                    if (player.myJobFlags.isAdvent === true && player.myJobFlags.isFirstAdvent === true) {
                        game.sender.onInfo("private", "你是天使，你已降临！", player.myPosition);   //TODO push 私有信息
                    }
                } else if (player.myJob === gb.GameInfo.JobInfo.getJobId("dmn")) {
                    if (player.myJobFlags.isAwake === true && player.myJobFlags.isFirstAwake === true) {
                        game.sender.onInfo("private", "你是恶魔，你已经觉醒！", player.myPosition);  //TODO push 私有信息
                    }
                } else
                //其他职业首次受到启迪
                if (player.myJobFlags.isEnlighten === true && player.onMeFlags.isFirstEnlightened === true) {
                    player.onMeFlags.isFirstEnlightened = false;
                    var info = "你受到启迪，获得启迪技能：" + player.thdSkl.colorName;
                    game.sender.onInfo("private", info, player.myPosition);     //TODO push 私有信息
                }
            }
            //2、媚女的[色诱]/[倾城绝媚]结果、潜行者[刀光魅影]结果、间谍[双面神通]效果、先知[占卜]效果、先知[洞彻天眼]效果、数学家[推演]结果、大侦探[侦查]/[绝对掌控]结果。
            var NgtInfoBuffer = game.runningInfo.fleshArr.thisNgtInfoSenderBuffer;
            for (i = 0; i < NgtInfoBuffer.length; i++) {
                var dawnInfoModel = NgtInfoBuffer[i];
                for (var j = 1; j < dawnInfoModel.targetsArr.length; i++) {
                    game.sender.onInfo("private", dawnInfoModel.infoArr[j] + "", dawnInfoModel.targetsArr[j]);     //TODO push 私有信息
                }
            }
        },
        /**
         * 黎明公共效果推送器（推送+效果）：
         * 1、祈福者[祈祷]发动
         * */
        DawnEffectPush: function () {

        },
        /**
         * 黎明队列修改器（修改）：
         * 1、革命家[日月新天]修改死亡结果
         * */
        DawnArrFlush:function(){

        }
    }
};
