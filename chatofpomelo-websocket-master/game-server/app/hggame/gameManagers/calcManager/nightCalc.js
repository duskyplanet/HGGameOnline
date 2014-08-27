var GameInfo = require("../../basicGameInfo/GameInfo");
var hjcArr = require("../../../HJCUtils/HJCArray");
var PlayerInfo = require("../../gameLogic/player").info;
var endChecker = require("./endChecker").endChecker;

exports.calc = function calc(game){
    var skillBuffer = game.runningInfo.fleshArr.thisNightSkillBuffer;
    var basicKillBuffer = [];

    //技能优先级排序
    this.skillSorter = function(){
        //优先级0：基础杀死
        for(var i = 0; i<skillBuffer.length;i++){
            if(skillBuffer[i]===null){continue;}
            if(skillBuffer[i].name ==="basicKill"){
                basicKillBuffer.push(skillBuffer[i]);
            }
        }
    };
    //技能执行
    this.execute = function(){
        //基础杀死
        for(i = 0; i < basicKillBuffer.length;i++){
            var srcPlayer = basicKillBuffer[i].srcPlayer;
            var tarPlayer =  basicKillBuffer[i].tarPlayer;
            if(tarPlayer===null){console.log("calcManager发生致命逻辑错误：basicKill指向不存在玩家！")}
            //构造出局者队列
            if(srcPlayer.myParty ===GameInfo.PartyInfo.HMN){
                srcPlayer.die(PlayerInfo.DIE_OF.HMN_KILLED_BY_SELF);
            }else if(srcPlayer.myParty ===GameInfo.PartyInfo.GST){
                tarPlayer.die(PlayerInfo.DIE_OF.KILLED_BY_GST);
            }
        }
    };
    //刷新内存
    var deadResult = [];
    this.fleshMem = function(){
        var deadList = game.runningInfo.fleshArr.lastNgtDeads;
        //构造可开枪队列
        game.runningInfo.fleshArr.thisDayCanSpkrs = game.runningInfo.quickArr.survivals;
        for(i = 0;i<deadList.length;i++){
            if(deadList[i].state.canShot === true){
                game.runningInfo.fleshArr.lastNgtCanShoters.push(deadList[i].myPosition);
                deadResult.push({
                    pos:deadList[i].myPosition,
                    info:"出局（有技能和遗言）"
                });
            }else{
                deadResult.push({
                    pos:deadList[i].myPosition,
                    info:"出局（无技能无遗言）"
                });
            }
        }

    };
    //打印黑夜结果
    this.spellNightInfo = function(){
        var resStr = "";
        if(deadResult.length>0){
            hjcArr.sortByPrpStrict(deadResult,["pos"]);
        }
        for(i= 0;i<deadResult.length;i++){
            resStr+= deadResult[i].pos+"号--"+deadResult[i].info+"\n";
        }
        return resStr;
    };

    //技能优先级排序
    this.skillSorter();
    //技能执行
    this.execute();
    //刷新内存
    this.fleshMem();

    //结果检查
    if(endChecker(game)){
        return true;
    }else{
        //打印黑夜结果
        return this.spellNightInfo();
    }
};