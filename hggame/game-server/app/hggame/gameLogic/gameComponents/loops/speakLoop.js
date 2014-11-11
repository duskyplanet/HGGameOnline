var gb = require("../../../global").global;


/**
 * 游戏逻辑主循环（三）：发言环节循环
 */
exports.speakLoop = function speakLoop(game){
    game.runningInfo.timeInfo.period = game.runningInfo.timeInfo.PERIOD.SPEAK;
    var SP= this;
    var timers = game.initInfo.timers;
    SP.step1();
    //step1:是否需要跳过白天发言
    SP.step1 = function(){
        //跳过白天
        if(SP.tools.jumpDayCheck(game)){
            setTimeout(function(){
                game.sender.onInfo("notice","游戏只剩下两人未结束，且无人拥有改变白天局势的技能，游戏跳过发言和公决阶段，直接进入黑夜…");
                game.runningInfo.timeInfo.leftEvenStep --;
                var endCheck = gb.endCheck.evenCheck(game);
                if(endCheck.isEnd){
                    gb.endManager(game,endCheck.winParty);
                }else{
                    gb.loops.nightLoop(game);
                }
            },timers.tick*1000);
        }else{
            setTimeout(function(){
                if(SP.tools.jumpSpeakCheck(game)){
                    game.sender.onInfo("notice","存活玩家均被禁言，游戏直接进入公决阶段…");
                    gb.loops.voteLoop(game);
                }else{
                    var survivals = game.runningInfo.quickArr.survivals;
                    var frbSpeakers = game.runningInfo.fleshArr.thisDayFrbSpeak;
                    var frbInfo = frbSpeakers.length===0?(""):(frbSpeakers.join("、")+"号被[催眠]禁止发言，");
                    var firstSpeakerPos = survivals[Math.floor(Math.random() * (survivals.length + 1))];
                    var info = "本轮"+frbInfo+"从"+firstSpeakerPos+"号开始轮询发言…";
                    game.sender.onInfo("notice",info);
                    setTimeout(function(){
                        SP.step2(game,firstSpeakerPos);
                    },timers.gap*1000);
                }
            },timers.tick*1000);
        }
    };
    //发言监听器
    SP.step2 = function(game,firstSpeakerPos){
        //刷新数据
        game.runningInfo.fleshInfo.thisDaySpeakPos = -1;
        game.runningInfo.fleshInfo.thisDaySpeakJumpers = [];
        game.runningInfo.listenArr.thisDaySpeakConditionByPos = SP.tools.buildConditions(game);
        //发言推送器
        SP.tools.sendSpeakHint(game,firstSpeakerPos);
        var speakTurner = setInterval(function(){
            var nextPos = SP.tools.findNextSpeaker(game.runningInfo.fleshArr.thisDayCanSpeak,game.runningInfo.fleshInfo.thisDaySpeakPos,game.runningInfo.fleshInfo.thisDaySpeakJumpers,firstSpeakerPos);
            if(nextPos!== -1){
                SP.tools.sendSpeakHint(game,nextPos);
                launchWaiter(nextPos);
            }else{
                clearInterval(speakTurner);
            }
        },timers.defaultSpeak*1000);

        var jumpDayChecker = setInterval(function(){
            if(game.runningInfo.glbEvent.trigJudgeForThisDay === true){
                game.runningInfo.glbEvent.trigJudgeForThisDay = false;
                stopAllWaiter();
                gb.loops.voteLoop(game,gb.loops.voteOutType.fromJudge);
            }
        },timers.tick*1000);

        var endGameChecker = setInterval(function(){
            if(game.runningInfo.timeInfo.perid === game.runningInfo.timeInfo.PERIOD.END){
                stopAllWaiter();
            }
        },timers.tick*1000);

        var allOverChecker = setInterval(function(){
            if(gb.utils.hjcArr.allValues(game.runningInfo.listenArr.thisDaySpeakConditionByPos,[null,true])){
                stopAllWaiter();
            }
            gb.loops.voteLoop(game,gb.loops.voteLoop(game));
        },timers.tick*1000);

       function stopAllWaiter(){
            clearInterval(speakTurner);
            clearInterval(jumpDayChecker);
            clearInterval(allOverChecker);
            clearInterval(endGameChecker)
        }

       function launchWaiter(nextPos){
            setTimeout(function(){
                if(game.runningInfo.listenArr.thisDaySpeakConditionByPos[nextPos]===false){
                    if(game.runningInfo.fleshArr.saveAutoArrByPos[nextPos] ===false){
                        game.runningInfo.listenArr.thisDaySpeakConditionByPos[nextPos] = true;
                    }else{
                        setTimeout(function(){
                            game.runningInfo.listenArr.thisDaySpeakConditionByPos[nextPos] = true;
                        }, game.runningInfo.fleshArr.saveTimeArrByPos[nextPos]*1000)
                    }
                }
            },timers.defaultSpeak*1000);
       }
    };
    SP.tools = {
        //跳过白天：场上只剩下两名玩家，且游戏没有结束，且没有能够有白天发动的技能。
        jumpDayCheck: function (game) {
            var survivals = game.runningInfo.quickArr.survivals;
            if (survivals.length !== 2) return false;
            if (game.runningInfo.glbEvent.trigMemorial) return true;
            var playerA = survivals[0];
            var playerB = survivals[1];
            //两者中有人被[催眠]/[诬陷]
            if (playerA.onMeFlags.isHypnosisVote || playerA.onMeFlags.isFramed || playerB.onMeFlags.isHypnosisVote || playerB.onMeFlags.isFramed) return false;
            //两者中有未发动技能的指挥官
            var cmdId = gb.GameInfo.JobInfo.getJobId("cmd");
            if ((playerA.myJob === cmdId && !playerA.myJobFlags.isAuthorUsed) || (playerB.myJob === cmdId && !playerB.myJobFlags.isAuthorUsed)) return false;
            //两者中有未发动技能的大主教
            var bsp = gb.GameInfo.JobInfo.getJobId("bsp");
            if ((playerA.myJob === bsp && !playerA.myJobFlags.isJudgeUsed) || (playerB.myJob === bsp && !playerB.myJobFlags.isJudgeUsed)) return false;
            //两者中有未发动技能的治愈者
            var dctId = gb.GameInfo.JobInfo.getJobId("dctId");
            if ((playerA.myJob === bsp && !playerA.myJobFlags.isCureUsed) || (playerB.myJob === bsp && !playerB.myJobFlags.isCureUsed)) return false;
            //两者中有未发动技能的复仇者
            var avg = gb.GameInfo.JobInfo.getJobId("avg");
            if ((playerA.myJob === bsp && !playerA.myJobFlags.isAvengeUsed) || (playerB.myJob === bsp && !playerB.myJobFlags.isAvengeUsed)) return false;
            //两者中有仲裁者
            var arb = gb.GameInfo.JobInfo.getJobId("arb");
            return !( playerA.myJob === bsp || playerB.myJob === bsp );
        },

        //场上玩家全部被禁言
        jumpSpeakCheck: function (game) {
            var survivals = game.runningInfo.quickArr.survivals;
            var thisDayFrbSpeak = game.runningInfo.fleshArr.thisDayFrbSpeak;
            return survivals.length === thisDayFrbSpeak.length;
        },

        //推送发言提示
        sendSpeakHint: function (game, pos) {
            game.runningInfo.fleshInfo.thisDaySpeakPos = pos;
            game.sender.onTurn("请发言", pos);
        },

        //寻找下一个发言者
        findNextSpeaker: function (speakArr, thisPos, jumpers, firstPos) {
            var speakArrThisTime = gb.utils.hjcArr.circleToHead(speakArr, firstPos);
            speakArrThisTime = gb.utils.hjcArr.deleteValues(speakArrThisTime, jumpers);
            for (var i = 0; i < speakArrThisTime.length; i++) {
                if (thisPos === speakArrThisTime[i] && i < (speakArrThisTime.length - 1)) {
                    if (gb.utils.hjcArr.exist(jumpers, speakArrThisTime[i + 1])) continue;
                    return speakArrThisTime[i + 1];
                }
            }
            return -1;
        },

        //构建白天发言情况监听器数组
        buildConditions: function (game) {
            var returnArr = [];
            for(var i = 0; i<game.runningInfo.playerExistList.length;i++){
                if(game.runningInfo.playerExistList[i] === true){
                    returnArr.push(false);
                }returnArr.push(null);
            }
            for(i = 0; i<returnArr.length;i++){
                if(gb.utils.hjcArr.exist(game.thisDayCanSpeak,i)){
                    returnArr[i] = false;
                } returnArr[i] =true;
            }
            return returnArr;
        }
    }
};