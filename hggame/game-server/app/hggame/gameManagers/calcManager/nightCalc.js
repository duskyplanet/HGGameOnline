var GameInfo = require("../../basicGameInfo/GameInfo");
var hjcArr = require("../../../HJCUtils/HJCArray");
var PlayerInfo = require("../../gameLogic/player").info;
var endChecker = require("./endChecker").endChecker;
var ColorHelper = require("../../basicGameInfo/ColorHelper");
var Flesh = require("../../gameLogic/gameComponents/flesher.js");
var NgtProcessor = require("./nightSkillsProcessor.js");

var gb = require("../../global").global;


/** 执行黑夜逻辑 nightCalc**/
exports.calc = function calc(game){
    /**
     * 逻辑步骤
     * 0、初始化数据
     * 1、刷新玩家列表状态
     * 2、处理进入黑夜事件
     * 3、处理黑夜结束技能结算
     * 4、记录黑夜技能行动并刷新技能列表
     * 5、构造出局者以及开枪队列
     * 6、检查游戏结束事件
     * 7、推送黎明信息提示
     * 8、推送黎明技能效果提示
     * 9、计算下一个环节
     * **/

     /** 0 初始化数据 **/
    var calcSelf = this;
    calcSelf.ngtMoveStr = "";   //黑夜行动程序记录
    calcSelf.ngtMoveHtml = "";  //黑夜行动的显示记录
    var loopDecider = {         //
        isEnd:false,
        jmpShot:false,
        jmpSkp:false,
        jmpVot:false,
        pushNgtInfo:""
    }
    /** 1、刷新玩家列表状态 **/
    Flesh.enterNgtFlesh(game);
    /** 2、处理黑夜进入事件 **/
    NgtProcessor.nightEnterPreEvent(game);
    /** 3、处理黑夜结束技能结算 **/
    var processResult = NgtProcessor.nightSkillsProcess(game);
    /** 4、记录黑夜所有行动，刷新技能buffer(必要) **/
    var ngtMoveRecordMsg = tools.ngtSkillsPrinter(game);
    game.recorder.add("nightMove",ngtMoveRecordMsg);
    game.runningInfo.fleshArr.thisNgtSkillBuffer = [];

    /** 5、构造出局者队列、构造记录和推送的黑夜结果  **/
   return tools.ngtResultPrinter(processResult,game);
};

models = {
    deadInfo :function(deadPos,isCanShot){
        return {
            deadPos:deadPos,
            isCanShot:isCanShot
        };
    },
    ngtMoveMsg : function(ngtMoveStr,ngtMoveHtml){
        return {
            ngtMoveStr:ngtMoveStr,
            ngtMoveHtml:ngtMoveHtml
        }
    },
    ngtResultMsg:function(html,str){
        return{
            html:html,
            str:str
        }
    },
    finalReturn:function(recordStr,htmlStr,deathArr){
        return{
            recordStr:recordStr,
            htmlStr:htmlStr,
            deathArr:deathArr
        }
    }
}

var tools = {
    //记录黑夜技能
    ngtSkillsPrinter:function(game){
        var ngtMoveStr = "";
        var ngtMoveHtml ="";
        var lineItem = 1; var newLine = false;
        for(var i = 0; i<game.runningInfo.fleshArr.thisNgtSkillBuffer.length;i++){
            var skill = game.runningInfo.fleshArr.thisNgtSkillBuffer[i];
            //换行处理
            if(lineItem>3){newLine = true;lineItem = 1;}else{newLine = false;}
            var targetInfo = "";
            if(skill.target != null && skill.target != undefined){
                targetInfo = skill.target.myPosition+"号";
            }else if(skill.targets!=null && skill.targets!=undefined){
                for(var j = 0; j < skill.targets.length ;j++){
                    targetInfo += skill.targets[j].myPosition+"号/"
                }
                this.cutLast(targetInfo);
            }
            if(skill.isRepresentSkill){
                targetInfo += "（受代言）";
            }else if(skill.isProvokeGenerated){
                targetInfo += "（受煽动）";
            }
            ngtMoveStr += (newLine===true?"\n   ":"   ") +skill.me.myPosition+"号"+skill.str+targetInfo;
            ngtMoveHtml += (newLine===true?"<br/>   ":"   ") + skill.me.myPosition+"号"+skill.html+targetInfo;
            lineItem++;
        }
        return models.ngtMoveMsg(ngtMoveStr,ngtMoveHtml);
    },
    //打印黑夜结果
    ngtResultPrinter:function(processResult,game){
        var deadResult = [];
        //刷新内存
        game.runningInfo.fleshArr.thisDayCanSpkrs = [];
        game.runningInfo.fleshArr.lastNgtCanShoters = [];
        var deadPosList = processResult.deadPosList;
        //构造可发言者
        for(i = 0; i < game.runningInfo.quickArr.survivals.length; i++){
            var surPlayer =  game.runningInfo.playerListByPos[game.runningInfo.quickArr.survivals[i]];
            if(surPlayer.onMeFlags.isHypnosis != true || surPlayer.onMeFlags.HypnosisIsSpk != true){
                game.runningInfo.fleshArr.thisDayCanSpkrs.push(game.runningInfo.quickArr.survivals[i]);
            }
        }
        if( deadPosList.length>0){
            hjcArr.numSort(deadPosList);
            //构造死者和可开枪者队列
            for(i = 0; i<deadPosList.length; i++){
                var deadPlayer = game.runningInfo.playerListByPos[deadPosList[i]];
                if(deadPlayer.myParty === gb.GameInfo.PartyInfo.THD){
                    game.runningInfo.fleshInfo.ngtOutAlnPos = deadPosList[i];
                }
                if(deadPlayer.myState.isCanShot === true){
                    game.runningInfo.fleshArr.lastNgtCanShoters.push(deadPosList[i]);
                    deadResult.push(models.deadInfo(deadPosList[i],true));
                }else{
                    deadResult.push(models.deadInfo(deadPosList[i],false));
                }
            }
        }
        var recordStr = "";
        var htmlStr = "";
        var deathArr = [];
        if(deadResult.length <= 0){
            game.recorder.add("nightRes",{html:"平安夜...",str:"平安夜..."});
            game.runningInfo.timeInfo.leftEvenStep--;
            return models.ngtResultMsg("平安夜...","平安夜...");
        }else{
            game.runningInfo.timeInfo.leftEvenStep=4;
        }
        for(var i= 0;i<deadResult.length;i++){
            var tempRec = deadResult[i].isCanShot ===true?"出局（有技能有遗言）":"出局（无技能无遗言）";
            var tempHtml = deadResult[i].isCanShot ===true?"<font color='red'>（有技能有遗言）</font><br/>":"<font color='gray'>（无技能无遗言）</font><br/>";
            recordStr+= deadResult[i].deadPos+"号"+tempRec+"\n";
            htmlStr+= ("<font color='white'>"+deadResult[i].deadPos+"号出局</font>"+tempHtml);
            deathArr.push({pos:deadResult[i].deadPos,isCanShot:deadResult[i].isCanShot});
        }
        game.recorder.add("nightRes",{html:htmlStr,str:recordStr});
        //TODO 有待商榷
        game.runningInfo.fleshInfo.lastNgtOutInfoHtml = htmlStr;
        return models.finalReturn(recordStr,htmlStr,deathArr);
    },
    cutLast:function(str){return str.substring(0,str.length-2);}
}