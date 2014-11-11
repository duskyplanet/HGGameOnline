var gb = require("../../../global").global;


/**
 * 游戏逻辑主循环（三）：发言环节循环
 */
exports.speakLoop = function speakLoop(game){
    game.runningInfo.timeInfo.period = game.runningInfo.timeInfo.PERIOD.SPEAK;
    var SPKL= this;
    var timers = game.initInfo.timers;
    SPKL.step1();
    SPKL.step1 = function(){
        if(SPKL.tools.jumpDayCheck(game)){
            game.sender.onInfo("notice","游戏只剩下两人未结束，且无人拥有改变白天局势的技能，游戏跳过发言和公决阶段，直接进入黑夜…");
            game.runningInfo.timeInfo.leftEvenStep --;
            var endCheck = gb.endCheck.evenCheck(game);
            if(endCheck.isEnd){
                gb.endManager(game,endCheck.winParty);
            }else{
                gb.loops.nightLoop(game);
            }
        }else{
            if(SPKL.tools.jumpSpeakCheck(game)){
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
                    SPKL.step2(game,firstSpeakerPos);
                },timers.gap*2000);
            }
        }
    };
    SPKL.step2 = function(game,firstSpeakerPos){


        var sendByTurn = setInterval(function(){

        },timers.defaultSpeak*1000);

        function findNext(firstSpeakerPos,lastSpeakerPos,game){
            sur
        }

        var listenSpeakOverArr = [];
        for(var i = 0; i< speakerNum; i++){
            self.runningInfo.listenArr.speakOverArr.push(false);  //玩家主动发起的是否发言已经结束(黑夜时已经刷新) //用于监听
            listenSpeakOverArr.push(false);                       //服务器监听的是否每个玩家最长发言时间已到        //用于计算
        }
        var canSpeakTimeArr = [];                                 //发言者队列不用预留所能发言的最长时间
        for(var j = 0; j< speakerNum; j++){
            canSpeakTimeArr.push(self.initInfo.timers.defaultSpeak+j*self.initInfo.timers.nextTurn);
        }
        //发言
        this.sendNext = function(speakId){
            //测试通过：推送某个玩家的发言提示
            console.log("测试(push所有玩家):"+speakId+"号玩家请发言...");
            self.sender.onTurn(speakId+"号玩家请发言...",speakId);
        };
        var nextOne = 0;//下一位发言者在speakers中的下标；
        that.sendNext(speakers[nextOne]);
        //依次发言
        this.sendLooper = setInterval(function(){
            nextOne = nextOne + 1;
            if(nextOne < speakers.length){
                that.sendNext(speakers[nextOne]);
            }else{
                clearInterval(that.sendLooper);
            }
        },self.initInfo.timers.nextTurn*1000);
        //每个玩家发言时间已到监听器
        var passTime = 0;
        this.everySpkEndWaiter = setInterval(function(){
            passTime += self.initInfo.timers.tick;
            for(var i = 0;i<speakers.length;i++){
                var speakerId = self.quickQuery.getIdByPosition(speakers[i]);
                if(listenSpeakOverArr[i] === true){continue;}                                                          //时间已到
                if( self.runningInfo.listenArr.speakOverArr[speakerId]===true) { listenSpeakOverArr[i]=true;continue;}          //玩家自己结束，时间已到
                if(passTime>=canSpeakTimeArr[i]){   //基本时间已到
                    if(self.runningInfo.fleshArr.saveAuto[speakerId]===false){
                        listenSpeakOverArr[i]=true;     //未启用预留，时间已到
                    }else{
                        //预留时间也到了
                        if(passTime>=(canSpeakTimeArr[i]+self.runningInfo.fleshArr.saveTimes[speakerId])){
                            listenSpeakOverArr[i]=true;
                            self.runningInfo.fleshArr.saveAuto[speakerId] = true;
                            self.runningInfo.fleshArr.saveTimes[speakerId] = 0;
                        }
                    }
                }
            }
        },self.initInfo.timers.tick*1000);
        //发言环节结束监听器
        var a = 0;
        this.spkTimeEndWaiter = setInterval(function(){
            //测试用：
            if(a==5){console.log("发言完结数组"+listenSpeakOverArr);console.log("预留时间数组"+self.runningInfo.fleshArr.saveTimes); a=0;}
            a++;
            if(hjcArr.allValue(listenSpeakOverArr,true)&&self.runningInfo.dayEvent.fstAid === false){
                that.nextStep("normal");
            }
        },self.initInfo.timers.tick*1000);
        //监听跳过白天事件和急救事件
        var aidPushed = false;
        this.jmpDayListener = setInterval(function(){
            if(self.runningInfo.loopFlag.jmpDay === true){
                that.nextStep("judge");
            }
//                if(self.runningInfo.dayEvent.fstAid === true){
//                    //推送(TODO)
//                    console.log("***监听到急救...");
//                    var aidId = self.runningInfo.dayEvent.fstAidId;
//                    if(aidPushed===false&&passTime>=(speakerNum*self.initInfo.timers.defaultSpeak)){
//                        //推送(TODO)
//                        console.log("被救起的aidId号玩家请发言...");
//                        aidPushed = true;
//                    }
//                }
        },self.initInfo.timers.tick*1000);

    };
    SPKL.tools ={
        //跳过白天：场上只剩下两名玩家，且游戏没有结束，且没有能够有白天发动的技能。
        jumpDayCheck:function(game){
            var survivals = game.runningInfo.quickArr.survivals;
            if(survivals.length !== 2 ) return false;
            if(game.runningInfo.glbEvent.trigMemorial) return true;
            var playerA = survivals[0];
            var playerB = survivals[1];
            //两者中有人被[催眠]/[诬陷]
            if(playerA.onMeFlags.isHypnosisVote || playerA.onMeFlags.isFramed || playerB.onMeFlags.isHypnosisVote || playerB.onMeFlags.isFramed) return false;
            //两者中有未发动技能的指挥官
            var cmdId = gb.GameInfo.JobInfo.getJobId("cmd");
            if((playerA.myJob === cmdId && !playerA.myJobFlags.isAuthorUsed)||(playerB.myJob === cmdId && !playerB.myJobFlags.isAuthorUsed)) return false;
            //两者中有未发动技能的大主教
            var bsp = gb.GameInfo.JobInfo.getJobId("bsp");
            if((playerA.myJob === bsp && !playerA.myJobFlags.isJudgeUsed)||(playerB.myJob === bsp && !playerB.myJobFlags.isJudgeUsed)) return false;
            //两者中有未发动技能的治愈者
            var dctId = gb.GameInfo.JobInfo.getJobId("dctId");
            if((playerA.myJob === bsp && !playerA.myJobFlags.isCureUsed)||(playerB.myJob === bsp && !playerB.myJobFlags.isCureUsed)) return false;
            //两者中有未发动技能的复仇者
            var avg = gb.GameInfo.JobInfo.getJobId("avg");
            if((playerA.myJob === bsp && !playerA.myJobFlags.isAvengeUsed)||(playerB.myJob === bsp && !playerB.myJobFlags.isAvengeUsed)) return false;
            //两者中有仲裁者
            var arb = gb.GameInfo.JobInfo.getJobId("arb");
            return !( playerA.myJob === bsp || playerB.myJob === bsp );
        },

        //场上玩家全部被禁言
        jumpSpeakCheck:function(game){
            var survivals = game.runningInfo.quickArr.survivals;
            var thisDayFrbSpeak = game.runningInfo.fleshArr.thisDayFrbSpeak;
            return survivals === thisDayFrbSpeak;
        }

        //findNextSpeaker(survivals,)
    }
};