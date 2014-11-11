var gb = require("../../../global").global;


/**
 * 游戏逻辑主循环（二）：开枪环节循环
 */
exports.shootLoop = function shootLoop(game){
    game.runningInfo.timeInfo.period = game.runningInfo.timeInfo.PERIOD.SHOOT;
    var SL= this;
    var timers = game.initInfo.timers;
    SL.isIntoStep3 = false;
    SL.step1();
    //开枪流程是否需要跳过
    SL.step1 = function(game){
        if(SL.tools.checkBless(game)){
            game.sender.onSkillEffect("dayBless",null,null,"[祈祷]发动，本轮开枪和公决环节跳过！"); //TODO 漫天祥云
            gb.loops.speakLoop(game);
        }else{
            if(game.runningInfo.fleshArr.lastNgtCanShoot.length > 0){
                game.sender.onInfo("wait","请等待出局者："+game.runningInfo.fleshArr.lastNgtCanShoot.join("、")+"号留遗言并开枪带人…");
                setTimeout(function(){
                    game.sender.onJY(game.runningInfo.fleshArr.lastNgtCanShoot);
                    SL.step2();
                },timers.gap*1000);
            }else{
                gb.loops.speakLoop(game);
            }
        }
    };
    SL.step2 = function(game){
        var totalTime = timers.shootTime;
        var tick = timers.tick;
        var pastTime = 0;
        var timeLimitFlag = false;  //开枪时间到标志
        var allOverFlag = false;    //所有开枪已结束标志

        var timeLimitWaiter = setInterval(function(){
            pastTime+=tick;
            if(SL.tools.checkEnd(game,stopAllWaiter)) return;
            if(allOverFlag){
                clearInterval(timeLimitWaiter);return;
            }
            if(pastTime >= totalTime){
                timeLimitFlag = true;
                stopAllWaiter();
                SL.step3()
            }
        },tick*1000);

        var allOverWaiter = setInterval(function(){
            if(SL.tools.checkEnd(game,stopAllWaiter)) return;
            if(timeLimitFlag){
                clearInterval(allOverWaiter);return;
            }
            if(game.runningInfo.fleshArr.lastNgtCanShoters.length <= 0){
                allOverFlag = true;
                stopAllWaiter();
                SL.step3()
            }
        },tick*1000);

        var stopAllWaiter = function(){
            clearInterval(timeLimitWaiter);
            clearInterval(allOverWaiter);
        }
    };
    SL.step3 = function(game){
        if(SL.isIntoStep3 === true) return;
        SL.isIntoStep3 = true;
        game.runningInfo.fleshArr.lastNgtCanShoot = [];
        //安全性检测
        setTimeout(function(){
            if(game.runningInfo.timeInfo.period === game.runningInfo.timeInfo.PERIOD.END) return;
            if(game.runningInfo.runningInfo.fleshInfo.delayGuess = true){
                game.runningInfo.runningInfo.fleshInfo.delayGuess = false;
                gb.loops.alienGuessLoop(gb.loops.alienGuessType.outInShoot);
            }else{
                gb.loops.speakLoop(game);
            }
        },timers.tick*2000);
    };
    SL.tools = {
        checkBless:function(game){
            return game.runningInfo.glbEvent.trigBlessForThisDay;
        },
        checkEnd:function(game,func){
            if(game.runningInfo.timeInfo.period === game.runningInfo.timeInfo.PERIOD.END){
                func();return true;
            }return false;
        }
    }
};