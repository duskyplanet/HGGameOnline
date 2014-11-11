var GameInfo = require("../../basicGameInfo/GameInfo");
var PlayerInfo = require("../../gameLogic/player").info;
var hjcArr = require("../../../HJCUtils/HJCArray");
var Skills = require("../jobsManager/SkillsManager.js");
var GLBTools = require("../../gameLogic/gameComponents/glbTools");
var constants = {
    BUDDHA_DIE : 3      //常量：圣佛与鬼佛的离场时间
};
/** 黑夜预处理事件 **/
exports.nightEnterPreEvent = nightEnterPreEvent;
function nightEnterPreEvent(game){
    if(game.runningInfo.glbEvent.trigMemorial === true) return;
    /** 1、搏命家下注成功？加生命值 **/
    /** 2、天使降临？恶魔觉醒？**/
    /** 3、圣佛与鬼佛离场？**/
}

/** 黑夜技能处理流程 **/
exports.nightSkillsProcess = nightSkillsProcess;
function nightSkillsProcess(game){

    var cursor = game.runningInfo.playerExistList;                          //用于遍历
    var thisNgtSkillBfr = game.runningInfo.fleshArr.thisNgtSkillBuffer;     //本夜晚接收到的技能数组
    var lastNgtSkillBfr = game.runningInfo.fleshArr.lastNgtSkillBuffer;     //上一个夜晚遗留的技能数组（[迷惑]、[催眠]）
    var nightNum = game.runningInfo.timeInfo.num;       //第几个夜晚
    var deadPosArr = [];                                //这个夜晚的出局者数组
    var initSkillBfr = {
        basicKillBfr:[],     //[杀死]技能数组
        confuseBfr:[],       //[迷惑]技能数组
        provokeBfr:[],       //[煽动]技能数组
        representBfr:[],       //[代言]技能数组
        seduceBfr:[],          //[色诱]技能数组
        predictBfr:[],          //[占卜]技能数组
        deduceBfr:[],          //[推演]技能数组
        verifyBfr:[],          //[鉴定]技能数组
        whisperBfr:[],          //[暗语]技能数组
        detectBfr:[],            //[侦查]技能数组
        psychicBfr:[],           //[通灵]技能数组
        hypnosisBfr:[],         //[催眠]技能数组
        frameBfr:[],           //[诬陷]技能数组
        protectBfr:[],         //[守护]技能数组
        blessBfr:[],            //[祈祷]技能数组
        gambleBfr:[],            //[下注]技能数组
        saveBfr:[],             //[救世]技能数组
        sacrificeBfr:[],       //[牺牲]技能数组
        avengeBfr:[],             //[玉碎]技能数组
        assassinateBfr:[]           //[刺杀]技能数组
    };
    var tempData = {
        skillPersuade:null,     //天使的[神圣劝化]
        skillSlaughter:null,      //恶魔的[嗜血屠戮]
        confuseUsers:[],           //[迷惑]的使用者
        provokeArr:[],            //受到[煽动]即将相互使用[杀死]的临时队列
        presentArr:[],            //受到[代言]即将施加于代言者相同技能的临时队列
        laterDieWithOutJYByGods:[] //受到天使和恶魔影响延迟出局的无JY队列
    };
//    /** 0、预处理*/
//    //0.1 清空上一个晚上的各个技能数组
//    game.runningInfo.fleshArr.lastNgtSkillBuffer = []; //清空上晚持续技能
//    game.runningInfo.fleshArr.thisNgtSkillBuffer = []; //清空上晚持续技能
//    game.runningInfo.fleshArr.thisNgtInfoSenderBuffer = [];
    /** 1、殇逝者[祭奠] */
    if(game.runningInfo.glbEvent.trigMemorial === true){
        //1.1只有basicKill需要处理
        for(var i = 0; i <  thisNgtSkillBfr.length; i++){
            if( thisNgtSkillBfr[i].skillName === "basicKill"){
                initSkillBfr.basicKillBfr.push(thisNgtSkillBfr[i]);
            }else{
                console.log("nightSklPrc逻辑错误：[祭奠]发生的黑夜收到职业技能...");
            }
        }
        //TODO [杀死]
    }else{
        /** 2 和天数相关事件 */
        //2.1 间谍[谍报] 当且只当第二个夜晚时（夜晚不可跳过），间谍获得其所在阵营的基本权利（不管死活）。
        for(i = 0; i < game.runningInfo.playerExistList.length; i++) {
            if (cursor[i] != true) continue;
            var player = game.runningInfo.playerListByPos[i];
            if (player.myJob === GameInfo.JobInfo.getJobId("spy")) {
                if (nightNum === 1) {
                    player.myState.isCanShot = false;
                } else if (nightNum === 2) {
                    if (player.myParty === GameInfo.PartyInfo.HMN) {
                        player.myState.isCanShot = true;
                    }
                }
            }
        }
        /** 3 将上一个夜晚的技能buffer加入到这个夜晚中去*/
        for(i = 0; i < lastNgtSkillBfr.length; i++){
            thisNgtSkillBfr.push(lastNgtSkillBfr[i]);
        }

        /** 4 和神职有关状态*/
        //4.1 装载persuade[神圣劝化]、slaughter[嗜血屠戮]、SkillName1[圣佛1技]、SkillName2[鬼佛1技]队列
        for(i = 0; i <  thisNgtSkillBfr.length; i++){
            var skill =  thisNgtSkillBfr[i];
            if(skill.skillName === "persuade"){     //天使需要已经降临、且[神圣劝化]对于恶魔(不论状态)、圣佛祖、鬼如来无效
                if(validCheck.checkPersuadeValid(skill)){
                    var targetJobAbbr = GameInfo.JobInfo.getJobNameById(skill.target.myJob);
                    if(targetJobAbbr === "dmn" || targetJobAbbr === "sfz" || targetJobAbbr === "grl") continue;
                    tempData.skillPersuade = skill;
                    skill.target.onMeFlags.isPersuaded = true;
                }
            }else if(skill.skillName === "slaughter"){ //恶魔需要已经觉醒、且[嗜血屠戮]对于天使(降临态)、圣佛祖、鬼如来无效
                if(validCheck.checkSlaughterValid(skill)){
                    targetJobAbbr  = GameInfo.JobInfo.getJobNameById(skill.target.myJob);
                    if(targetJobAbbr === "sfz" || targetJobAbbr === "grl") continue;
                    if(targetJobAbbr === "agl"){
                        if(game.runningInfo.glbEvent.aglAdvent === true) continue;
                    }
                    tempData.skillSlaughter = skill;
                    skill.target.onMeFlags.isSlaughtered = true;
                }
            }
            //TODO 其他神技
        }
        //4.2 检测[神圣劝化]与[嗜血屠戮]是否同指向或相互指向
        if(tempData.skillPersuade!=null && tempData.skillSlaughter!=null){
            var aglPos = tempData.skillPersuade.me.myPosition;
            var dmnPos = tempData.skillSlaughter.me.myPosition;
            var persuadeTargetPos = tempData.skillPersuade.target.myPosition;
            var slaughterTargetPos = tempData.skillSlaughter.target.myPosition;
            if(persuadeTargetPos === slaughterTargetPos){
                tempData.skillPersuade.target.onMeFlags.isSlaughtered = false;
                tempData.laterDieWithOutJYByGods.push(aglPos);
                tempData.laterDieWithOutJYByGods.push(dmnPos);
            }
            if(slaughterTargetPos === aglPos && persuadeTargetPos === dmnPos){
                tempData.laterDieWithOutJYByGods.push(aglPos);
                tempData.laterDieWithOutJYByGods.push(dmnPos);

            }
        }

        /** 5 指向性否定技能 */
        //5.1 装载confuse[迷惑]、provoke[煽动]、represent[代言]
        for(i = 0; i <  thisNgtSkillBfr.length; i++){
            skill =  thisNgtSkillBfr[i];
            if(skill.skillName === "confuse"){     //装载[迷惑]
                initSkillBfr.confuseBfr.push(skill);
            }else if(skill.skillName === "provoke"){  //装载[煽动]
                initSkillBfr.provokeBfr.push(skill);
            }else if(skill.skillName === "represent"){ //装载[代言]
                initSkillBfr.representBfr.push(skill);
            }
        }
        //5.1 处理[迷惑] 受职业禁锢、鬼魔被劝化无效(使用)、指向神职无效(使用)。不经过受[迷惑]不能发动检测预示：使用[迷惑]的玩家不受其他技能否定（包括[迷惑]自身）。
        for (i = 0; i < initSkillBfr.confuseBfr.length ; i++){
            skill =  initSkillBfr.confuseBfr[i];
            var isEnlighten = skill.me.myJobFlags.isEnlighten;
            if(validCheck.checkConfuseValid(skill)){
                tempData.confuseUsers.push(skill.me.myPosition);
                skill.me.myJobFlags.lastConfuseTargetPos = skill.target.myPosition;
                if(effectCheck.canLaunchByAgl(skill.me)){
                    if(effectCheck.normalSkillsToGods(game,skill,skill.target,true,tempData)){
                        if(isEnlighten){
                            if( Math.random() > 0.5){
                                skill.pushNightBuffer(skill.target,null,true); //触发[幻境深渊]
                            }
                        }
                        skill.target.onMeFlags.isConfused = true;
                    }
                }
            }
        }
        //5.2 处理[煽动] 受职业禁锢、被魔术师[迷惑]无效(未用)、对挑拨者无效(使用)、鬼挑被劝化无效(使用)、其中之一指向神职无效(使用)、其中之一指向使用[迷惑]玩家无效(使用)、其中之一指向挑拨者无效。
        for(i = 0; i < initSkillBfr.provokeBfr.length; i++){
            skill =  initSkillBfr.provokeBfr[i];
            if(validCheck.checkProvokeValid(skill)){
                if(effectCheck.canLaunchByMgc(skill.me)) {
                    //已经使用
                    skill.me.myJobFlags.isProvokeUsed = true;
                    if(skill.me.myJobFlags.isEnlighten!=true){//丧失基本权利
                        skill.me.myState.isCanShot = false;
                        skill.me.myState.isCanKill = false;
                    }
                    if(effectCheck.canLaunchByAgl(skill.me)){
                        var targetA = skill.targets[0];
                        var targetB = skill.targets[1];
                        if(effectCheck.normalSkillsToGods(game,skill,targetA,true,tempData)){
                            if(effectCheck.isEffectToMgc(tempData.confuseUsers,targetA)){
                                console.log(effectCheck.isEffectToIst(targetA));
                                if(effectCheck.isEffectToIst(targetA)){
                                    targetA.onMeFlags.isProvoked = true;
                                    tempData.provokeArr.push({me:targetA,target:targetB});
                                }
                            }
                        }
                        if(effectCheck.normalSkillsToGods(game,skill,targetB,true,tempData)){
                            if(effectCheck.isEffectToMgc(tempData.confuseUsers,targetB)){
                                if(effectCheck.isEffectToIst(targetB)) {
                                    targetB.onMeFlags.isProvoked = true;
                                    tempData.provokeArr.push({me: targetB, target: targetA});
                                }
                            }
                        }
                    }
                }
            }
        }
        //5.3 处理[代言] 受职业禁锢、被魔术师[迷惑]无效(未用)、被挑拨者[煽动]无效(未用)、指向代言人无效(使用)、鬼挑被劝化无效(使用)、指向神职无效(使用)。
        for(i = 0; i < initSkillBfr.representBfr.length; i++){
            skill =  initSkillBfr.representBfr[i];
            if(validCheck.checkRepresentValid(skill)){
                skill.me.myJobFlags.lastRepresentTargetPos = skill.target.myPosition;
                if(effectCheck.canLaunchByMgc(skill.me)) {
                    if(effectCheck.canLaunchByAgl(skill.me)){
                        if(effectCheck.canLaunchByIst(skill)){
                            if(effectCheck.normalSkillsToGods(game,skill,skill.target,true,tempData)){
                                if(effectCheck.isEffectToSpm(skill.target)){
                                    skill.target.onMeFlags.isRepresent = true;
                                    tempData.presentArr.push({me:skill.me,target:skill.target});
                                }
                            }
                        }
                    }
                }
            }
        }
        //5.4 加入[煽动]生成的[杀死]入夜晚技能队列
        for(i = 0; i < tempData.provokeArr.length; i++){
            var me = tempData.provokeArr[i].me;
            var target =tempData.provokeArr[i].target;
            skill = {me:me,target:target,isRepresentSkill:false}
            if(effectCheck.isEffectToRepresent(skill)){ //[煽动]可以阻止代言人发动[代言]，但对已经成功发动[代言]的目标无效
                var basicKill = new Skills.BasicKill(me,game);
                basicKill.isProvokeGenerated = true;
                basicKill.move([target.myPosition]);
            }
        }
        //5.5 加入[代言]生成的所有技能:[杀死]、[刺杀]、[守卫]、[鉴定]、[通灵(不死亡灵)]、[启迪(潜能迸发)]、[催眠]、[诬陷]、[感染]、[毒剂]
        for(i = 0; i < tempData.presentArr.length;i++){
            var spmPos = tempData.presentArr[i].me.myPosition;
            for(var j = 0; j <  thisNgtSkillBfr.length ; j++){
                skill =  thisNgtSkillBfr[j];
                var skillName = skill.skillName;
                if (!(skillName==="basicKill" || skillName==="assassinate" || skillName==="protect" || skillName==="verify" || skillName==="psychic"
                    && skillName==="enlighten" || skillName==="hypnosis" || skillName==="frame" || skillName==="infect" || skillName=== "poison" || skillName==="provoke")) continue;
                //双指向技能
                if(skillName === "provoke"){
                    if(skill.targets[1].myPosition === spmPos){
                        basicKill = new Skills.BasicKill(tempData.presentArr[i].target,game);
                        basicKill.move(skill.targets[2]);
                    }else  if(skill.targets[2].myPosition === spmPos){
                        basicKill = new Skills.BasicKill(tempData.presentArr[i].target,game);
                        basicKill.move(skill.targets[1]);
                    }
                }else{
                    if(skill.target.myPosition === spmPos){
                        tools.addSkillsToRepresent(tempData.presentArr[i],skill,game);
                    }
                }
            }
        }

        /** 6 信息获取类技能（无伤害、部分人知晓） */
        //6.1 装载seduce[色诱]/predict[占卜]/deduce[推演]/verify[鉴定]/whisper[私语]/detect[侦查]
        for(i = 0; i <  thisNgtSkillBfr.length; i++){
            skill =  thisNgtSkillBfr[i];
            if(skill.skillName === "seduce"){     //装载[色诱]
                initSkillBfr.seduceBfr.push(skill);
            }else if(skill.skillName === "predict"){  //装载[占卜]
                initSkillBfr.predictBfr.push(skill);
            }else if(skill.skillName === "deduce"){ //装载[推演]
                initSkillBfr.deduceBfr.push(skill);
            }else if(skill.skillName === "verify"){ //装载[鉴定]
                initSkillBfr.verifyBfr.push(skill);
            }else if(skill.skillName === "whisper"){ //装载[暗语]
                initSkillBfr.whisperBfr.push(skill);
            }else if(skill.skillName === "detect"){ //装载[侦查
                initSkillBfr.detectBfr.push(skill);
            }
        }
        //6.2 处理[色诱] 受职业禁锢、被魔术师[迷惑]无效（未用）、被挑拨者挑拨无效（未用）、鬼媚被劝化无效（使用）、指向神职无效（使用）。注：[代言]不能移除[色诱]。
        for(i = 0; i < initSkillBfr.seduceBfr.length; i++){
            skill =  initSkillBfr.seduceBfr[i];
            if(validCheck.checkSeduceValid(skill)){
                if(effectCheck.canLaunchByMgc(skill.me)) {
                    if(effectCheck.canLaunchByIst(skill)){
                        //已经使用
                        tools.mglUseSeduce(skill);
                        if(effectCheck.canLaunchByAgl(skill.me)){
                            if(effectCheck.normalSkillsToGods(game,skill,skill.target,true,tempData)){
                                tools.mglSeduceGst(skill);      //人媚验鬼无技言
                                tools.pushDawnInfo(game,skill);
                            }else{
                                tools.pushDawnNoInfo(game,skill);
                            }
                        }else{
                            tools.pushDawnNoInfo(game,skill);
                        }
                    }else{
                        tools.pushDawnNoInfo(game,skill);
                    }
                }else{
                    tools.pushDawnNoInfo(game,skill);
                }
            }
        }
        //6.3 处理[占卜] 受职业禁锢、被魔术师[迷惑]无效（未用）、被挑拨者挑拨无效（未用）。注：[神圣劝化]对鬼先知使用[占卜]无效，[占卜]不是指向性技能。
        for(i = 0; i < initSkillBfr.predictBfr.length; i++){
            skill =  initSkillBfr.predictBfr[i];
            if(validCheck.checkPredictValid(skill)){
                if(effectCheck.canLaunchByMgc(skill.me)) {
                    if(effectCheck.canLaunchByIst(skill)){
                        skill.me.myJobFlags.isPredictUsed = true;
                        tools.pushDawnInfo(game,skill);
                    }else{
                        tools.pushDawnNoInfo(game,skill);
                    }
                }else{
                    tools.pushDawnNoInfo(game,skill);
                }
            }else{
                tools.pushDawnNoInfo(game,skill);
            }
        }
        //6.4 处理[推演] 受职业禁锢、被魔术师[迷惑]无效（使用）、被挑拨者挑拨无效（使用）、鬼数学家被[神圣劝化]无效（未使用）。
        for(i = 0; i < initSkillBfr.deduceBfr.length; i++){
            skill =  initSkillBfr.deduceBfr[i];
            if(validCheck.checkDeduceValid(skill)){
                skill.me.myJobFlags.thisNgtDeduceReceived = true;//当夜我使用了[推演]，能力不会丧失
                if(effectCheck.canLaunchByMgc(skill.me)) {
                    if(effectCheck.canLaunchByIst(skill)){
                        if(effectCheck.canLaunchByAgl(skill.me)){
                            tools.pushDawnInfo(game,skill);
                        }else{
                            tools.pushDawnNoInfo(game,skill);
                        }
                    }else{
                        tools.pushDawnNoInfo(game,skill);
                    }
                }else{
                    tools.pushDawnNoInfo(game,skill);
                }
            }else{
                tools.pushDawnNoInfo(game,skill);
            }
        }
        //6.5 处理[鉴定] 受职业禁锢、被魔术师[迷惑]无效（未用）、被挑拨者挑拨无效（未用）、鬼验尸官被[神圣劝化]无效（未使用）、被代言人[代言]无效。注：[代言]能移除[鉴定]。
        for(i = 0; i < initSkillBfr.verifyBfr.length; i++){
            skill =  initSkillBfr.verifyBfr[i];
            if(validCheck.checkVerifyValid(skill)){
                skill.me.myJobFlags.lastVerifyPos = skill.target.myPosition;
                if(effectCheck.canLaunchByMgc(skill.me)) {
                    if(effectCheck.canLaunchByIst(skill)){
                        if(effectCheck.canLaunchByAgl(skill.me)){
                            if(effectCheck.isEffectToRepresent(skill)){
                                if(skill.target.myState.isAlive === true){
                                    //活者加标记
                                    skill.target.onMeFlags.isVerified = true;
                                }else{
                                    //死者推信息
                                    tools.pushDawnInfo(game,skill);
                                }
                            }else{
                                if(skill.target.myState.isAlive === false){
                                    tools.pushDawnNoInfo(game,skill);
                                }
                            }
                        }else{
                            if(skill.target.myState.isAlive === false){
                                tools.pushDawnNoInfo(game,skill);
                            }
                        }
                    }else{
                        if(skill.target.myState.isAlive === false){
                            tools.pushDawnNoInfo(game,skill);
                        }
                    }
                }else{
                    if(skill.target.myState.isAlive === false){
                        tools.pushDawnNoInfo(game,skill);
                    }
                }
            }else{
                if(skill.target.myState.isAlive === false){
                    tools.pushDawnNoInfo(game,skill);
                }
            }
        }
        //6.6 处理[私语] 受职业禁锢、被魔术师[迷惑]无效（未用）、被挑拨者挑拨无效（未用）、鬼暗语者被[神圣劝化]无效（使用）。
        for(i = 0; i < initSkillBfr.whisperBfr.length; i++){
            skill =  initSkillBfr.whisperBfr[i];
            if(validCheck.checkWhisperValid(skill)){
                if(effectCheck.canLaunchByMgc(skill.me)) {
                    if(effectCheck.canLaunchByIst(skill)){
                        skill.me.myJobFlags.isWhisperUsed = true;
                        if(effectCheck.canLaunchByAgl(skill.me)){
                            tools.pushDawnInfo(game,skill);
                        }
                    }
                }
            }
        }
        //6.7 处理[侦查] 受职业禁锢、被魔术师[迷惑]无效（未用）、被挑拨者挑拨无效（未用）、鬼大侦探被[神圣劝化]无效（未使用）。注：[代言]不能移除[侦查]。
        for(i = 0; i < initSkillBfr.detectBfr.length; i++){
            skill =  initSkillBfr.detectBfr[i];
            if(validCheck.checkDetectValid(skill)){
                if(effectCheck.canLaunchByMgc(skill.me)) {
                    if(effectCheck.canLaunchByIst(skill)){
                        if(effectCheck.canLaunchByAgl(skill.me)){
                            tools.pushDawnInfo(game,skill);
                        }else{
                            tools.pushDawnNoInfo(game,skill);
                        }
                    }else{
                        tools.pushDawnNoInfo(game,skill);
                    }
                }else{
                    tools.pushDawnNoInfo(game,skill);
                }
            }else{
                tools.pushDawnNoInfo(game,skill);
            }
        }
        //6.8 加入数学家的[推演]结束的身份推送

        /** 7 白天效果类技能（无伤害，所有人知晓） */
        //7.1 装载psychic[还魂]/hypnosis[催眠]/frame[诬陷]
        for(i = 0; i <  thisNgtSkillBfr.length; i++){
            skill =  thisNgtSkillBfr[i];
            if(skill.skillName === "psychic"){     //装载[还魂]
                initSkillBfr.psychicBfr.push(skill);
            }else if(skill.skillName === "hypnosis"){  //装载[催眠]
                initSkillBfr.hypnosisBfr.push(skill);
            }else if(skill.skillName === "frame"){ //装载[诬陷]
                initSkillBfr.frameBfr.push(skill);
            }
        }
        //7.2 处理[通灵] 受职业禁锢、被魔术师[迷惑]无效（未用）、被挑拨者挑拨无效（未用）、鬼通灵被劝化无效（使用）、指向神职无效（使用）,目标被[代言]无效（使用）。
        for(i = 0; i < initSkillBfr.psychicBfr.length; i++){
            skill = initSkillBfr.psychicBfr[i];
            if(validCheck.checkPsychicValid(skill)){
                skill.me.myJobFlags.lastPsychicPos = skill.target.myPosition;
                if(effectCheck.canLaunchByMgc(skill.me)) {
                    if(effectCheck.canLaunchByIst(skill)){
                        if(effectCheck.canLaunchByAgl(skill.me)){
                            if(effectCheck.normalSkillsToGods(game,skill,skill.target,true,tempData)){
                                if(skill.target.myState.isAlive){
                                    if(effectCheck.isEffectToRepresent(skill)){
                                        //[不死亡灵]标记
                                        skill.target.onMeFlags.isUndeadGst = true;
                                    }
                                }else{
                                    //死者[通灵]标记
                                    skill.target.onMeFlags.isPsychic = true;
                                }
                            }
                        }
                    }
                }
            }
        }
        //7.3 处理[催眠] 受职业禁锢、被魔术师[迷惑]无效（未用）、被挑拨者挑拨无效（未用）、鬼音乐家被劝化无效（使用）、指向神职无效（使用）,目标被[代言]无效（使用）。
        for(i = 0; i < initSkillBfr.hypnosisBfr.length; i++){
            skill =   initSkillBfr.hypnosisBfr[i];
            if(validCheck.checkHypnosisValid(skill)){
                skill.me.myJobFlags.lastHypnosisPos = skill.target.myPosition;
                if(effectCheck.canLaunchByMgc(skill.me)) {
                    if(effectCheck.canLaunchByIst(skill)){
                        if(effectCheck.canLaunchByAgl(skill.me)){
                            if(effectCheck.normalSkillsToGods(game,skill,skill.target,true,tempData)){
                                if(effectCheck.isEffectToRepresent(skill)){
                                    skill.target.onMeFlags.isHypnosis = true;
                                    skill.target.onMeFlags.thisHypnosisType = skill.type;
                                }
                            }
                        }
                    }
                }
            }
        }
        //7.3 处理[诬陷] 受职业禁锢、被魔术师[迷惑]无效（未用）、被挑拨者挑拨无效（未用）、鬼阴谋家被劝化无效（使用）、指向神职无效（使用）,目标被[代言]无效（使用）。
        for(i = 0; i < initSkillBfr.frameBfr.length; i++){
            skill =  initSkillBfr.frameBfr.frameBfr[i];
            if(validCheck.checkFrameValid(skill)){
                skill.me.myJobFlags.lastFramePos = skill.target.myPosition;
                if(effectCheck.canLaunchByMgc(skill.me)) {
                    if(effectCheck.canLaunchByIst(skill)){
                        if(effectCheck.canLaunchByAgl(skill.me)){
                            if(effectCheck.normalSkillsToGods(game,skill,skill.target,true,tempData)){
                                if(effectCheck.isEffectToRepresent(skill)){
                                    skill.target.onMeFlags.isFramed = true;
                                }
                            }
                        }
                    }
                }
            }
        }

        /** 8 对伤害技能有影响的技能：包括[守护]、[祈祷]、[赌博]*/
        //8.1 装载protect[守护]/bless[祈祷]/gamble[赌博]
        for(i = 0; i < thisNgtSkillBfr.length; i++){
            skill = thisNgtSkillBfr[i];
            if(skill.skillName === "protect"){     //装载[守护]
                initSkillBfr.protectBfr.push(skill);
            }else if(skill.skillName === "bless"){  //装载[祈祷]
                initSkillBfr.blessBfr.push(skill);
            }else if(skill.skillName === "gamble"){ //装载[赌博]
                initSkillBfr.gambleBfr.push(skill);
            }
        }
        //8.2 处理[守护] 受职业禁锢、被魔术师[迷惑]无效（未用）、被挑拨者挑拨无效（未用）、鬼守护者被劝化无效（使用）、指向神职无效（使用）,目标被[代言]无效（使用）。
        for(i = 0; i < initSkillBfr.protectBfr.length; i++){
            skill = initSkillBfr.protectBfr[i];
            if(validCheck.checkProtectValid(skill)){
                skill.me.myJobFlags.lastProtectPos = skill.target.myPosition;
                if(effectCheck.canLaunchByMgc(skill.me)) {
                    if(effectCheck.canLaunchByIst(skill)){
                        if(effectCheck.canLaunchByAgl(skill.me)){
                            if(effectCheck.normalSkillsToGods(game,skill,skill.target,true)){
                                if(effectCheck.isEffectToRepresent(skill)){
                                    if(skill.me.myJobFlags.isEnlighten){
                                    //[顶级戒备]效果
                                        skill.target.onMeFlags.addShieldNum = 100;
                                    }else{
                                        skill.target.onMeFlags.addShieldNum ++;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        //8.3 处理[祈祷] 受职业禁锢、被魔术师[迷惑]无效（未用）、被挑拨者挑拨无效（未用）、鬼祈福者被劝化无效（使用）。
        for(i = 0; i < initSkillBfr.blessBfr.length; i++){
            skill =  initSkillBfr.blessBfr[i];
            if(validCheck.checkBlessValid(skill)){
                skill.me.myJobFlags.isBlessUsed = true;
                if(effectCheck.canLaunchByMgc(skill.me)) {
                    if(effectCheck.canLaunchByIst(skill)){
                        if(effectCheck.canLaunchByAgl(skill.me)){
                            tools.addBlessEffect(game,skill);
                        }
                    }
                }
            }
        }
        //8.4 处理[搏命] 受职业禁锢、被魔术师[迷惑]无效（未用）、被挑拨者挑拨无效（未用）、鬼搏命家被劝化无效（使用）。
        for(i = 0; i < initSkillBfr.gambleBfr.length; i++){
            skill = initSkillBfr.gambleBfr[i];
            if(validCheck.checkGambleValid(skill)){
                skill.me.myJobFlags.lastProtectPos = skill.target.myPosition;
                if(effectCheck.canLaunchByMgc(skill.me)) {
                    if(effectCheck.canLaunchByIst(skill)){
                        if(effectCheck.canLaunchByAgl(skill.me)){
                            skill.target.myJobFlags.guess = {nowNum:game.runningInfo.quickArr.survivals.length,guessNum:skill.guessNum}
                        }
                    }
                }
            }
        }

        /** 9 自杀性否定技能*/
        //9.1 装载sacrifice[牺牲]、save[救世]、avenge[玉碎]
        for(i = 0; i < thisNgtSkillBfr.length; i++){
            skill = thisNgtSkillBfr[i];
            if(skill.skillName === "sacrifice"){     //装载[牺牲]
                initSkillBfr.sacrificeBfr.push(skill);
            }else if(skill.skillName === "save"){  //装载[救世]
                initSkillBfr.saveBfr.push(skill);
            }else if(skill.skillName === "avenge"){ //装载[复仇]
                initSkillBfr.avengeBfr.push(skill);
            }
        }
        //9.2 处理[牺牲] 受职业禁锢、被魔术师[迷惑]无效（未用）、被挑拨者挑拨无效（未用）、祈福者[祈福]本阵营（未用）。注：[牺牲]除了受[祈祷]影响不受任何伤害或保护技能影响。 从此处开始有伤害~
        for(i = 0; i < initSkillBfr.sacrificeBfr.length; i++){
            skill = initSkillBfr.sacrificeBfr[i];
            if(validCheck.checkSacrificeValid(skill)){
                if(effectCheck.canLaunchByMgc(skill.me)) {
                    if(effectCheck.canLaunchByIst(skill)){
                       if(effectCheck.isHarmfulByBlsr(skill.me)){
                            skill.me.myJobFlags.isSacrificeUsed = true;
                            skill.me.myJobFlags.isLaunchedSacrifice = true;
                            skill.me.die(PlayerInfo.DIE_OF.SKILL_KILL_SELF,skill.me.myPosition,game);
                            skill.me.myState.isCanShot = true;
                            skill.me.myState.isHaveShot = false;
                            deadPosArr.push(skill.me.myPosition);
                       }
                    }
                }
            }
        }
        //9.3 处理[救世] 受职业禁锢、被魔术师[迷惑]无效（未用）、被挑拨者挑拨无效（未用）、祈福者[祈福]本阵营（未用）。注：[救世]除了受[祈祷]影响不受任何伤害或保护技能影响。
        for(i = 0; i < initSkillBfr.blessBfr.length; i++){
            skill = initSkillBfr.blessBfr[i];
            if(validCheck.checkSaveValid(skill)){
                if(effectCheck.canLaunchByMgc(skill.me)) {
                    if(effectCheck.canLaunchByIst(skill)){
                        if(effectCheck.isHarmfulByBlsr(skill.me)){
                            skill.me.myJobFlags.isSaveUsed = true;
                            skill.me.myJobFlags.isLaunchedSave = true;
                            skill.me.myState.isCanShot = false;
                            tools.addSaveEffect(game,skill,deadPosArr);
                        }
                    }
                }
            }
        }
        //9.4 处理[玉碎] 受职业禁锢、被魔术师[迷惑]无效（未用）、被挑拨者挑拨无效（未用）、祈福者[祈福]本阵营（未用）、鬼复仇被劝化无效（已经使用，但无效）。
        for(i = 0; i < initSkillBfr.gambleBfr.length; i++){
            skill = initSkillBfr.gambleBfr[i];
            if(validCheck.checkAvengeValid(skill)){
                if(effectCheck.canLaunchByMgc(skill.me)) {
                    if(effectCheck.canLaunchByIst(skill)){
                        if(effectCheck.isHarmfulByBlsr(skill.me)){
                            //已使用
                            skill.me.myJobFlags.isAvengeUsed = true;
                            if(effectCheck.canLaunchByAgl(skill.me)){
                                //[玉碎]已经启动，自己死亡
                                skill.me.die(PlayerInfo.DIE_OF.SKILL_KILL_SELF,skill.me.myPosition,game);
                                //是否造成伤害？指向神职无效(使用),目标被[代言]无效(使用)、经过harmCanLaunch、harmCanEffect、→ 造成伤害 → harmRemoveShield检测 → 造成死亡。
                                if(effectCheck.normalSkillsToGods(game,skill,skill.target,false,tempData)){
                                    if(effectCheck.isEffectToRepresent(skill)){
                                        if(effectCheck.isHarmfulToLsr(game,skill)){
                                            //消除护盾
                                            if(harmLauncher.passProtect(skill,deadPosArr)){
                                                if(harmLauncher.passTopAlert(skill,deadPosArr)){
                                                    if(harmLauncher.passGambleLives(skill,deadPosArr)){
                                                        skill.me.die(PlayerInfo.DIE_OF.HMN_KILLED_BY_SELF,skill.me.myPosition,game);
                                                        deadPosArr.push(skill.target.myPosition);
                                                        harmLauncher.checkBrilliant(skill.target);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        /** 10 处理神技伤害 */
        //10.1 受到天使和恶魔影响延迟出局的无JY队列:包含对觉醒态恶魔使用技能的其他阵营玩家出局，互用技能的天使和恶魔 他们出局都是无JY的
        for( i = 0; i < tempData.laterDieWithOutJYByGods.length ; i++){
            var outerPos = tempData.laterDieWithOutJYByGods[i];
            var outPlayer = game.runningInfo.playerListByPos[outerPos];
            outPlayer.die(PlayerInfo.DIE_OF.SKILL_KILL_SELF,outerPos,game);
            deadPosArr.push(outerPos);
        }
        //10.2 被恶魔屠戮者
        if(tempData.skillSlaughter!= null){
            outPlayer = tempData.skillSlaughter.target;
            var dmn = tempData.skillSlaughter.me;
            outPlayer.die(PlayerInfo.DIE_OF.SKILL_KILL_SELF,dmn.myPosition,game);
            deadPosArr.push(outPlayer.myPosition);
        }

        /** 11 处理伤害技能 */
        //11.1 装载assassinate[刺杀]、basicKill[杀死]
        for(i = 0; i < thisNgtSkillBfr.length; i++){
            skill = thisNgtSkillBfr[i];
            if(skill.skillName === "assassinate"){     //装载[刺杀]
                initSkillBfr.assassinateBfr.push(skill);
            }else if(skill.skillName === "basicKill"){   //装载[杀死]
                initSkillBfr.basicKillBfr.push(skill);
            }
        }
        //11.2 处理[刺杀] 受职业禁锢、被魔术师[迷惑]无效（未用）、被挑拨者挑拨无效（未用）、鬼潜行者被劝化无效（已经使用，但无效）、祈福者[祈福]目标阵营（已经使用，但无效）。
        for(i = 0; i < initSkillBfr.assassinateBfr.length; i++){
            skill = initSkillBfr.assassinateBfr[i];
            if(validCheck.checkAssassinateValid(skill)){
                if(effectCheck.canLaunchByMgc(skill.me)) {
                    if(effectCheck.canLaunchByIst(skill)){
                        if(effectCheck.isHarmfulByBlsr(skill.me)){
                            //已使用
                            skill.me.myJobFlags.isAssassinateUsed = true;
                            if(effectCheck.canLaunchByAgl(skill.me)){
                                //是否造成伤害？指向神职无效(使用),目标被[代言]无效(使用)、经过harmCanLaunch、harmCanEffect、→ 造成伤害 → harmRemoveShield检测 → 造成死亡。
                                if(effectCheck.normalSkillsToGods(game,skill,skill.target,false,tempData)){
                                    if(effectCheck.isEffectToRepresent(skill)){
                                        if(effectCheck.isHarmfulToLsr(game,skill)){
                                            //消除护盾
                                            if(harmLauncher.passProtect(skill,deadPosArr)){
                                                if(harmLauncher.passTopAlert(skill,deadPosArr)){
                                                    if(harmLauncher.passGambleLives(skill,deadPosArr)){
                                                        if(skill.target.die(PlayerInfo.DIE_OF.KILLED_BY_ASS,skill.me.myPosition,game)){
                                                            deadPosArr.push(skill.target.myPosition);
                                                            harmLauncher.checkBrilliant(skill.target);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        //11.3 处理[杀死] 受职业禁锢、被魔术师[迷惑]无效（未用）、被挑拨者挑拨无效（未用）、鬼被劝化无效（无效）、人类被[劝化]无效、人类被[明灯]无效、祈福者[祈福]目标阵营（已经使用，但无效）。

        for(i = 0; i < initSkillBfr.basicKillBfr.length; i++){
            skill = initSkillBfr.basicKillBfr[i];
            if(validCheck.checkBasicKillValid(skill)){
                if(effectCheck.canLaunchByMgc(skill.me)) {
                    if(effectCheck.canLaunchByIst(skill)){
                        if(effectCheck.isHarmfulByBlsr(skill.me)){
                            if(effectCheck.canLaunchByAgl(skill.me)){
                                if(effectCheck.canHmnLaunchBasicKillByAgl(skill.me)){
                                    if(effectCheck.canHmnLaunchBasicKillByLdr(skill.me)){
                                        //是否造成伤害？指向神职无效(使用),目标被[代言]无效(使用)、经过harmCanLaunch、harmCanEffect、→ 造成伤害 → harmRemoveShield检测 → 造成死亡。
                                        if(effectCheck.normalSkillsToGods(game,skill,skill.target,false,tempData)){
                                            if(effectCheck.isEffectToRepresent(skill)){
                                                if(effectCheck.isHarmfulToLsr(game,skill)){
                                                    if(effectCheck.canGstLaunchBasicKillByLdr(skill)){
                                                        //消除护盾
                                                        if(harmLauncher.passProtect(skill,deadPosArr)){
                                                            if(harmLauncher.passTopAlert(skill,deadPosArr)){
                                                                if(harmLauncher.passGambleLives(skill,deadPosArr)){
                                                                    //鬼媚误刀
                                                                    tools.mglUseBasicKill(skill);
                                                                    if(skill.me.myParty === GameInfo.PartyInfo.HMN){
                                                                        if(skill.me.die(PlayerInfo.DIE_OF.HMN_KILLED_BY_SELF,skill.me.myPosition,game)){
                                                                            deadPosArr.push(skill.me.myPosition);
                                                                            harmLauncher.checkBrilliant(skill.target);
                                                                        }
                                                                    }else if(skill.me.myParty === GameInfo.PartyInfo.GST){
                                                                        if(skill.target.die(PlayerInfo.DIE_OF.KILLED_BY_GST,skill.me.myPosition,game)){
                                                                            deadPosArr.push(skill.target.myPosition);
                                                                            harmLauncher.checkBrilliant(skill.target);
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
//        for(i = 0;i<deadPosArr.length;i++){
//            console.log(deadPosArr[i]+"号：isCanShot:"+game.runningInfo.playerListByPos[deadPosArr[i]].myState.isCanShot+" isCanKill:"+game.runningInfo.playerListByPos[deadPosArr[i]].myState.isCanKill+"\n");
//        }
//        //console.log(game.runningInfo.playerListByPos[5].myJobFlags.isPredictUsed);
//        console.log(game.runningInfo.fleshArr.thisNgtInfoSenderBuffer);
        //x.1 推送[鉴定]信息给所有人

        //x+2 被加[通灵]死者推送队列 消息+效果
        //x+3 被加[不死亡灵]且死去的标记的检测 消息+效果
        //x+4 被加[催眠]且还存活的玩家 消息+效果
        //x+5 被加[诬陷]的玩家且存活 消息+效果
        //x+1 执行白天信息推送队列
        //y   良知造成的影响
        //y+1 启迪者启迪的各种影响
    }
    return{
        deadPosList:deadPosArr
    }
}

/** 技能合法性（返回fasle代表逻辑错误：夜晚不应该接收到这样的技能） */
validCheck = {
    //技能不能指向死者检测
    aliveCheck: function(target,skillName){
        if(target.myState.isAlive === false){
            console.log("nightSklPrc检测到错误："+skillName+"指向死者...");
            return false;
        }return true;
    },
    //技能不能指向自己检测
    selfCheck: function(skill,skillName){
        if(skill.target.myPosition === skill.me.myPosition){
            console.log("nightSklPrc检测到错误："+skillName+"不应该指向自己...");
            return false;
        }return true;
    },
    //[神圣劝化]使用合法性
    checkPersuadeValid : function(skill){
        if(!this.aliveCheck(skill.target,"[神圣劝化]")) return false;
        if(!this.selfCheck(skill,"[神圣劝化]")) return false;
        if(skill.me.myJobFlags.isAwake!=true){
            console.log("nightSklPrc检测到错误：[神圣劝化]发生的黑夜天使还未降临...");
            return false;
        }
        return true;
    },
    //[嗜血屠戮]使用合法性
    checkSlaughterValid : function(skill){
        if(!this.aliveCheck(skill.target,"[嗜血屠戮]")) return false;
        if(!this.selfCheck(skill,"[嗜血屠戮]")) return false;
        if(skill.me.myJobFlags.isAdvent!=true){
            console.log("nightSklPrc检测到错误：[嗜血屠戮]发生的黑夜恶魔还未觉醒...");
            return false;
        }
        return true;
    },
    //[迷惑]使用合法性
    checkConfuseValid : function(skill){
        if(!this.aliveCheck(skill.target,"[迷惑]")) return false;
        if(!this.selfCheck(skill,"[迷惑]")) return false;
        if(skill.target.myPosition === skill.me.myJobFlags.lastConfuseTargetPos && skill.me.myJobFlags.isEnlighten != true){
            console.log("nightSklPrc检测到错误：未受启迪的魔术师连续两晚[迷惑]同一个目标...");
            return false;
        }
        return true;
    },
    //[煽动]使用合法性
    checkProvokeValid : function(skill){
        if(!this.aliveCheck(skill.targets[0],"[煽动]")) return false;
        if(!this.aliveCheck(skill.targets[1],"[煽动]")) return false;
        if(skill.targets[0].myPosition === skill.me.myPosition || skill.targets[1].myPosition === skill.me.myPosition){
            console.log("nightSklPrc检测到错误：挑拨者[煽动]不应该指向自己...");
            return false;
        }
        if(skill.me.myJobFlags.isProvokeUsed){
            console.log("nightSklPrc检测到错误：挑拨者在无机会的情况下又一次使用了[煽动]...");
            return false;
        }else if(skill.targets.length!=2 || skill.targets[0] === skill.targets[1]){
            console.log("nightSklPrc检测到错误：挑拨者煽动目标参数不合法（需要两个不同位置号）...");
            return false;
        }return true;
    },
    //[代言]使用合法性
    checkRepresentValid : function(skill){
        if(!this.aliveCheck(skill.target,"[代言]")) return false;
        if(!this.selfCheck(skill,"[代言]")) return false;
        if(skill.target.myPosition === skill.me.myJobFlags.lastRepresentTargetPos && skill.me.myJobFlags.isEnlighten != true){
            console.log("nightSklPrc检测到错误：未受启迪的代言人连续两晚[代言]同一个目标...");
            return false;
        }return true;
    },
    //[色诱]使用合法性
    checkSeduceValid : function(skill){
        if(skill.me.myJobFlags.isEnlighten != true){
            if(!this.aliveCheck(skill.target,"[色诱]")) return false;
            if(skill.target.myPosition===skill.me.myPosition){
                console.log("nightSklPrc检测到错误：未受启迪的媚女郎[色诱]自己...");
                return false;
            }
            return true;
        } return true;
    },
    //[占卜]使用合法性
    checkPredictValid : function(skill){
        if(skill.me.myJobFlags.isEnlighten != true && skill.me.myJobFlags.isPredictUsed){
            console.log("nightSklPrc检测到错误：未受启迪的先知第二次使用[占卜]...");
            return false;
        } return true;
    },
    //[推演]使用合法性
    checkDeduceValid : function(skill){
        if(skill.me.myJobFlags.isEnlighten != true){
            if(skill.me.myJobFlags.isDeduceStop){
                console.log("nightSklPrc检测到错误：未受启迪的数学家在丧失[推演]能力后再次使用[推演]...");
                return false;
            }
            if(skill.target!=null){
                console.log("nightSklPrc检测到错误：未受启迪的数学家可以指定[推演]目标...");
                return false;
            }
            return true;
        }else{
            if(skill.target === null){
                console.log("nightSklPrc检测到错误：受启迪的数学家未指定[推演]目标...");
                return false;
            }
            if(skill.target.myPosition === skill.me.myPosition){
                console.log("nightSklPrc检测到错误：受启迪的数学家[推演]自己...");
                return false;
            }
            return true;
        }
    },
    //[鉴定]使用合法性
    checkVerifyValid : function(skill){
        if(skill.me.myJobFlags.isEnlighten != true){
            if(skill.me.myJobFlags.lastVerifyPos ===  skill.target.myPosition){
                console.log("nightSklPrc检测到错误：未受启迪的验尸官连续两晚[鉴定]同一个目标...");
                return false;
            }
            if(skill.me.myPosition ===  skill.target.myPosition){
                console.log("nightSklPrc检测到错误：未受启迪的验尸官[鉴定]自己...");
                return false;
            }
        } return true;
    },
    //[私语]使用合法性
    checkWhisperValid : function(skill){
        if(skill.me.myJobFlags.isWhisperUsed){
            console.log("nightSklPrc检测到错误：暗语者在无机会的情况下又一次使用了[私语]...");
            return false;
        } return true;
    },
    //[侦查]使用合法性
    checkDetectValid : function(skill){
        if((skill.me.target===null||skill.me.target===undefined)&& skill.me.myJobFlags.isEnlighten!=true){
            console.log("nightSklPrc检测到错误：大侦探在未受启迪时使用了职业指向性[侦查]...");
            return false;
        } return true;
    },
    //[还魂]使用合法性
    checkPsychicValid : function(skill){
        if(skill.me.myJobFlags.isEnlighten!=true){
            if(skill.target.myState.isAlive === true){
                console.log("nightSklPrc检测到错误：通灵者在未受到启迪时对存活者使用[通灵]...");
                return false;
            }
            if(skill.target.myPosition === skill.me.myJobFlags.lastPsychicPos){
                console.log("nightSklPrc检测到错误：通灵者在未受到启迪时连续两晚[通灵]同一个目标...");
                return false;
            }
            if(skill.target.myPosition === skill.me.myPosition){
                console.log("nightSklPrc检测到错误：通灵者在未受到启迪时对自己使用[通灵]...");
                return false;
            }
            return true;
        } return true;
    },
    //[催眠]使用合法性
    checkHypnosisValid : function(skill){
        if(skill.me.myJobFlags.isEnlighten!=true) {
            if (skill.target.myPosition === skill.me.myJobFlags.lastHypnosisPos) {
                console.log("nightSklPrc检测到错误：音乐家在未受到启迪时连续两晚[催眠]同一目标...");
                return false;
            }
            if(skill.type==="both"){
                console.log("nightSklPrc检测到错误：音乐家在未受到启迪时[催眠]效果选择“both”...");
                return false;
            }
        }
        return this.selfCheck(skill,"[催眠]");
    },
    //[诬陷]使用合法性
    checkFrameValid : function(skill){
        if(skill.me.myJobFlags.isEnlighten!=true && skill.target.myPosition === skill.me.myJobFlags.lastFramePos){
            console.log("nightSklPrc检测到错误：阴谋家在未受启迪时连续两晚[诬陷]同一个目标...");
            return false;
        }
        return this.selfCheck(skill,"[诬陷]");
    },
    //[守护]使用合法性
    checkProtectValid : function(skill){
        if(skill.me.myJobFlags.isEnlighten!=true){
            if(skill.target.myPosition === skill.me.myJobFlags.lastProtectPos){
                console.log("nightSklPrc检测到错误：守护者在未受启迪时连续两晚[守护]同一个目标...");
                return false;
            }
        }
        return true;
    },
    //[祈祷]使用合法性
    checkBlessValid : function(skill){
        if(skill.me.myJobFlags.isBlessUsed){
            console.log("nightSklPrc检测到错误：祈福者在无机会的情况下又一次使用了[祈祷]...");
            return false;
        }
        if(skill.type != "day" && skill.type != "night"){
            console.log("nightSklPrc检测到错误：祈福者[祈祷]的发动时机选择不合法...");
            return false;
        }
        return true;
    },
    //[下注]使用合法性
    checkGambleValid : function(skill){
        if(typeof  skill.guessNum !="number" || skill.guessNum<0 ||skill.guessNum>9){
            console.log("nightSklPrc检测到错误：搏命家的[下注]数字非法...");
            return false;
        }
        return true;
    },
    //[牺牲]使用合法性
    checkSacrificeValid : function(skill){
        if(skill.me.myJobFlags.isSacrificeUsed){
            console.log("nightSklPrc检测到错误：革命家在没有机会的情况下使用[牺牲]...");
            return false;
        }
        return true;
    },
    //[救世]使用合法性
    checkSaveValid : function(skill){
        if(skill.me.myJobFlags.isSaveUsed){
            console.log("nightSklPrc检测到错误：救世主在没有机会的情况下使用[救世]...");
            return false;
        }
        return true;
    },
    //[玉碎]使用合法性
    checkAvengeValid : function(skill){
        if(skill.me.myJobFlags.isAvengeUsed){
            console.log("nightSklPrc检测到错误：复仇者在没有机会的情况下使用[玉碎]...");
            return false;
        } if(skill.me.myPosition === skill.target.myPosition){
            console.log("nightSklPrc检测到错误：复仇者不应该对自己使用[玉碎]...");
            return false;
        }

        return true;
    },
    //[刺杀]使用合法性
    checkAssassinateValid : function(skill){
        if(skill.me.myJobFlags.isAssassinateUsed){
            console.log("nightSklPrc检测到错误：潜行者在没有机会的情况下使用[刺杀]...");
            return false;
        } if(skill.me.myPosition === skill.target.myPosition){
            console.log("nightSklPrc检测到错误：潜行者不应该对自己使用[刺杀]...");
            return false;
        }

        return true;
    },
    //[杀死]使用合法性
    checkBasicKillValid : function(skill){
        if(skill.me.myPosition === skill.target.myPosition && skill.isRepresentSkill!=true){
            console.log("nightSklPrc检测到错误：不应该对自己使用[杀死]...");
            return false;
        }
        if(skill.me.myState.canKill === false){
            console.log("nightSklPrc检测到错误：不能起刀的玩家使用[杀死]...");
            return false;
        }

        return true;
    }
};

/** 技能是否有效果（纯逻辑影响） */
effectCheck = {
    //普通职业技能指向神职导致无效检测，flag = true 时会计算导致自己死亡(只有自杀性技能才有flag = false)
    normalSkillsToGods : function(game,skill,target,flag,tempData){
        var targetJobAbbr = GameInfo.JobInfo.getJobNameById(target.myJob);
        if(targetJobAbbr === "agl"){
            if(game.runningInfo.glbEvent.aglAdvent === true) return false;
            else{
                if(skill.skillName != "provoke") return true;
            }
        }
        if(targetJobAbbr === "dmn"){
            if(flag){
                if(skill.me.myParty != GameInfo.PartyInfo.GST && skill.me.onMeFlags.isPersuaded != true) tempData.laterDieWithOutJYByGods.push(skill.me.myPosition);
            }
            return false;
        }
        return (targetJobAbbr !="sfz" && targetJobAbbr !="grl");
    },
    //普通职业技能是否能经过天使的[神圣劝化]而发起
    canLaunchByAgl : function(me){
        return (me.myParty == GameInfo.PartyInfo.HMN || me.onMeFlags.isPersuaded != true);
    },
    //普通职业技能是否能经过魔术师的[迷惑]而发动
    canLaunchByMgc : function(me){
        return (!me.onMeFlags.isConfused);
    },
    //[煽动]是否可以使用在使用了[迷惑]的玩家身上
    isEffectToMgc : function(confuseUsers,target){
        return !(hjcArr.exist(confuseUsers,target.myPosition));
    },
    //[煽动]不可使用在挑拨者自身
    isEffectToIst : function(target){
        return (target.myJob != GameInfo.JobInfo.getJobId("ist"));
    },
    //[代言]不可使用在代言人自身
    isEffectToSpm : function(target){
        if(target.myJob === GameInfo.JobInfo.getJobId("spm")) return false;
        return true;
    },
    //普通职业技能是否能经过挑拨者的[煽动]而发动
    canLaunchByIst : function(skill){
        if(skill.isProvokeGenerated === true){
            return true;        //这是[煽动]产生的[杀死]技能
        }else{
            if(skill.me.onMeFlags.isProvoked) return false;
            else return true;
        }
    },
    //普通技能是否能在可能被[代言]目标身上生效
    isEffectToRepresent : function(skill){
        if(skill.isRepresentSkill){         //如果这个就是一个代言人叠加给被代言人的技能，即使目标被代言，这个技能也要加上去
            return true;
        }else{
            if(skill.target.onMeFlags.isRepresent) return false;    //目标被代言了，加不上去
            else return true;
        }
    },
    //普通技能是否能在能通过祈福者的[祝福]而造成伤害
    isHarmfulByBlsr : function(target){
        return !target.onMeFlags.isBlessed;
    },
    //检测是否能对潜在的屌丝的[信仰]造成伤害
    isHarmfulToLsr :function(game,target){
        if(target.myJob != GameInfo.JobInfo.getJobId("lsr")) return true;
        else{
            var gds = game.runningInfo.playerListByPos[target.myJobFlags.myGoddessPos];
            return (gds.myState.isAlive != true || gds.myJob != target.myJob)
        }
    },
    //检测被[神圣劝化]的人类是否能起刀
    canHmnLaunchBasicKillByAgl:function(me){
        return !(me.myParty === GameInfo.PartyInfo.HMN && me.myState.isReversed === false && me.onMeFlags.isPersuaded);
    },
    //检测被[心灵之光]的人类是否能起刀
    canHmnLaunchBasicKillByLdr:function(me){
        return !(me.myParty === GameInfo.PartyInfo.HMN && me.myState.isReversed === false && me.onMeFlags.isLighted);
    },
    //检测被[心灵之光]的鬼是否能误刀
    canGstLaunchBasicKillByLdr:function(skill){
        if(skill.me.onMeFlags.isLighted!=true) return true;
        return !(skill.me.myParty === GameInfo.PartyInfo.GST && skill.target.myParty === GameInfo.PartyInfo.GST);
    }
};

/** 技能伤害执行者 */
harmLauncher = {
    //去除目标身上可能存在的一层守护效果，并加入潜在凶手队列，如果技能被消耗则返回false;
    passProtect : function(skill){
        if(skill.target.onMeFlags.addShieldNum >= 1){
            skill.target.onMeFlags.addShieldNum --;
            skill.me.onMeFlags.shieldRemover.push(skill.me.myPosition);
            return false;
        }return true;
    },
    //去除目标可能拥有的[顶级戒备]，并加入潜在凶手队列，如果技能被消耗则返回false;
    passTopAlert : function(skill){
        if(skill.target.myJob === GameInfo.JobInfo.getJobId("gdn") && skill.target.myJobFlags.isEnlighten === true && skill.target.myJobFlags.isHaveTopAlert){
            skill.target.myJobFlags.isHaveTopAlert = false;
            skill.me.onMeFlags.shieldRemover.push(skill.me.myPosition);
            return false;
        }return true;
    },
    //去除目标可能拥有的一层[下注]获得的生命，并加入潜在凶手队列，如果技能被消耗则返回false;
    passGambleLives : function(skill){
        if(skill.target.myJob === GameInfo.JobInfo.getJobId("gbl") && skill.target.myJobFlags.winLives >= 0){
            skill.target.myJobFlags.winLives --;
            skill.me.onMeFlags.shieldRemover.push(skill.me.myPosition);
            return false;
        }return true;
    },
    //检查出局者是否会发动[光辉]带人
    checkBrilliant:function(target){

    }
};

/** 子功能 */
var tools = {
    //为被代言人添加与代言人相同的可行效果[杀死]、[刺杀]、[守卫]、[鉴定]、[不死亡灵]、[启迪(潜能迸发)]、[催眠]、[诬陷]、[感染]、[毒剂]
    addSkillsToRepresent : function(representArr,skill,game){
        //因为代言只能指向活者(已检验)、所有代言移除的[鉴定]是指向活着的鉴定。
        //新技能必须通过new实现，不然只是指针
        var newSkill = null;
        switch(skill.skillName){
            case "basicKill":newSkill = new Skills.BasicKill(skill.me,game);break;
            case "assassinate":newSkill = new Skills.Assassinate(skill.me,game);break;
            case "protect":newSkill = new Skills.Protect(skill.me,game);break;
            //TODO 生成新技能可能出现的问题
//            case "verify":newSkill = new Skills.BasicKill(skill.me,game);break;
//            case "psychic":newSkill = new Skills.BasicKill(skill.me,game);break;
//            case "enlighten":newSkill = new Skills.BasicKill(skill.me,game);break;
//            case "hypnosis":newSkill = new Skills.BasicKill(skill.me,game);break;
//            case "frame":newSkill = new Skills.BasicKill(skill.me,game);break;
//            case"infect":newSkill = new Skills.BasicKill(skill.me,game);break;
//            case "poison":newSkill = new Skills.BasicKill(skill.me,game);break;
        }
        newSkill.move([representArr.target.myPosition]);
        newSkill.isRepresentSkill = true;
    },
    //媚女郎使用[色诱]可能修改自身状态(人媚验鬼丧失技言)
    mglUseSeduce : function(skill){
        if(!skill.me.myJobFlags.isEnlighten){
            if(skill.target.myParty === GameInfo.PartyInfo.GST){
                skill.me.myState.isCanKill = false;
            }
        }
    },
    //白昼消息推送入队
    pushDawnInfo : function(game,skill){
        var info = "你通过"+skill.colorName+"获知：<br/>";
        switch (skill.skillName){
            case "seduce":{
                info += skill.target.myPosition+"号属于"+GameInfo.PartyInfo.getPartyNameByNum(skill.target.myParty);
                game.runningInfo.fleshArr.thisNgtInfoSenderBuffer.push({
                    targetPos:[skill.me.myPosition],
                    info:info
                });
            }break;
            case "predict":{
                var dayNum = game.runningInfo.timeInfo.num;
                if(dayNum === 1){
                    info += "你属于"+GameInfo.PartyInfo.getPartyNameByNum(skill.me.myParty);
                }else{
                    info += this.getFsrSituationInfo(game);
                }
                game.runningInfo.fleshArr.thisNgtInfoSenderBuffer.push({
                    targetPos:[skill.me.myPosition],
                    info:info
                });
            }break;
            case "deduce":{
                if(skill.me.myJobFlags.isEnlighten){
                    info += skill.target.myPosition+"号与你"+(skill.target.myJob === skill.me.myJob)?"":"不"+"同阵营。";
                }else{
                    var returnObj = this.getMtmDeduceInfo(game,skill);
                    info += returnObj.result;
                    if(returnObj.needSendWord){
                        game.runningInfo.fleshArr.thisNgtInfoSenderBuffer.push({
                            targetPos:[skill.me.myPosition],
                            info:"你的身份词汇是："+GameInfo.getMyWordFromPartyNum(skill.me.myParty,game.runningInfo.words)
                        });
                    }
                }
                game.runningInfo.fleshArr.thisNgtInfoSenderBuffer.push({
                    targetPos:[skill.me.myPosition],
                    info:info
                });
            }break;
            case "verify":{
                info += "死者"+skill.target.targetPos+"号属于："+GameInfo.PartyInfo.getPartyNameByNum(skill.target.myParty);
                game.runningInfo.fleshArr.thisNgtInfoSenderBuffer.push({
                    targetPos:[skill.me.myPosition],
                    info:info
                });
            }break;
            case "whisper":{
                var pushObj = this.getWhisperPushObj(game,skill);
                game.runningInfo.fleshArr.thisNgtInfoSenderBuffer.push(pushObj);
            }break;
            case "detect":{
                pushObj = this.getDetectPushObj(game,skill);
                game.runningInfo.fleshArr.thisNgtInfoSenderBuffer.push(pushObj);
            }break;
            default :
                console.log("nightSklPrc检测到错误：不存在的黎明推送消息类型");
        }
    },
    //白昼未能获得消息提示推送入队
    pushDawnNoInfo : function(game,skill){
        var info = "夜晚你未能通过"+skill.colorName+"获得信息！";
        game.runningInfo.fleshArr.thisNgtInfoSenderBuffer.push({
            targetPos:[skill.me.myPosition],
            info:info
        });
    },
    //先知[占卜]获得局势信息
    getFsrSituationInfo:function(game){
        var quickArr = game.runningInfo.quickArr;
        var result =  "当晚场上存活的"+quickArr.survivals.length+"个玩家中有"+quickArr.survHmnNum+"个人类、"+quickArr.survGstNum+"个鬼...";
        if(quickArr.survAlnNum>0){ result += "<br/>外星人尚且存活..."; }
        if(quickArr.survWwfNum>0){ result += "<br/>还有"+quickArr.survWwfNum+"个狼人在场...";}
        var aglArr = quickArr.jobExistList[GameInfo.JobInfo.getJobId("agl")];
        var dmnArr = quickArr.jobExistList[GameInfo.JobInfo.getJobId("dmn")];
        var sfzArr = quickArr.jobExistList[GameInfo.JobInfo.getJobId("sfz")];
        var grlArr = quickArr.jobExistList[GameInfo.JobInfo.getJobId("grl")];
        var insArr = quickArr.jobExistList[GameInfo.JobInfo.getJobId("ins")];
        var jobArr = [dmnArr,sfzArr,grlArr,insArr];
        var jobNameArr = ["天使","恶魔","圣佛祖","鬼如来"];
        for(var i = 0; i< jobArr.length;i++){
            if(jobArr[i]!=undefined && aglArr[i].length!=0){
                var job = game.runningInfo.playerListByPos[jobArr[i][0]];
                if(job.myState.isAlive){
                    if(i===0){
                        if(job.myJobFlags.isAdvent){
                            result += "<br/>"+jobNameArr[i]+"登场且尚未降临...";
                        }else{
                            result += "<br/>"+jobNameArr[i]+"登场且已降临！";
                        }
                    }else if(i===1){
                        if(job.myJobFlags.isAwake){
                            result += "<br/>"+jobNameArr[i]+"登场且尚未觉醒...";
                        }else{
                            result += "<br/>"+jobNameArr[i]+"登场且尚未觉醒！";
                        }
                    }else{
                        result += "<br/>"+jobNameArr[i]+"登场且尚在场！";
                    }
                }else{
                    result += "<br/>"+jobNameArr[i]+"登场且已出局。";
                }
            }
        }
        if(insArr!=undefined&& insArr.length>0){
            var HumInsNum = 0;
            var GstInsNum = 0;
            for(i = 0; i<insArr.length;i++){
                if(insArr[i].myParty === GameInfo.PartyInfo.HMN){
                    HumInsNum++;
                }else{
                    GstInsNum++;
                }
            }
            result += "<br/>场上有"+(HumInsNum===0?"":"人类启迪者")+(GstInsNum===0?"":(HumInsNum===0?"鬼启迪者":"和鬼启迪者"));
        }
        return result;
    },
    //数学家[推演]获得局势信息
    getMtmDeduceInfo:function(game,skill){
        var result = "";
        var alreadyDeducedArr = skill.me.myJobFlags.alreadyDeducePos;
        var survivals = game.runningInfo.quickArr.survivals;
        var myPos = skill.me.myPosition;
        var canDeduceArr = hjcArr.deleteValues(survivals,alreadyDeducedArr.concat([myPos]));
        if(canDeduceArr.length!=0){
            hjcArr.shuffle(canDeduceArr);
            var selectDeducePos = canDeduceArr[0];
            var lastDeducePos = skill.me.myJobFlags.lastRdmDeducePos;
            result = "上一个推演"+skill.colorName+"目标"+lastDeducePos+"号与"+skill.colorName+selectDeducePos+"号"
                +(game.runningInfo.playerListByPos[lastDeducePos].myParty===game.runningInfo.playerListByPos[selectDeducePos].myParty?"":"不")+"同阵营。";
            skill.me.myJobFlags.alreadyDeducePos = alreadyDeducedArr.concat(selectDeducePos);
            skill.me.myJobFlags.lastRdmDeducePos = selectDeducePos;
            return {needSendWord:false,result:result}
        }else{
            result = "场上已经没有你能"+skill.colorName+"的存活目标";
            return {needSendWord:true,result:result}
        }
    },
    //构造暗语者的[私语]推送信息体
    getWhisperPushObj:function(game,skill){
        var alvLists = GLBTools.getAliveLists(game.runningInfo.playerListByPos);
        var myPartyAlvPosList;
        if(skill.me.myParty === GameInfo.PartyInfo.HMN){
            myPartyAlvPosList = alvLists.alvHmnPosList;
        }else{
            myPartyAlvPosList = alvLists.alvGstPosList;
        }
        myPartyAlvPosList = hjcArr.deleteValue(myPartyAlvPosList,skill.me.myPosition);
        var ngtNum = game.runningInfo.timeInfo.num;
        var decidePushPos = [];
        var decideInfo = skill.me.myPosition+"号通过"+skill.colorName+"让你获知：<br/>";
        if(ngtNum>=myPartyAlvPosList.length){
            decidePushPos = myPartyAlvPosList;
        }else{
            hjcArr.shuffle(myPartyAlvPosList);
            decidePushPos = myPartyAlvPosList.slice(0,ngtNum);
        }
        if(skill.me.myJobFlags.isEnlighten){
            decideInfo+= myPartyAlvPosList.join("、")+skill.me.myPosition+"号都属于同一个阵营。"
        }else{
            decideInfo+="你和他（她）同阵营。"
        }
        return {
            targetPos:decidePushPos,
            info:decideInfo
        }
    },
    //构造大侦探的[侦查]获得信息体
    getDetectPushObj:function(game,skill){
        var info = "你通过"+skill.colorName+"获得信息：<br/>";
        if(skill.target!=null && skill.target!=undefined){
            if(skill.target.myJob===0){
                info += skill.target.myPosition+"号无特殊职业。";
            }else{
                info += skill.target.myPosition+"号的职业是-"+GameInfo.JobInfo.getJobNameById(skill.target.myJob)+"。";
            }
        }else {
            info += "职业-"+GameInfo.JobInfo.getJobNameById(skill.targetJob)+"属于玩家"+game.runningInfo.quickArr.jobExistList[skill.targetJob].join("、")+"号";
        }
        return {
            targetPos:[skill.me.myPosition],
            info:info
        };
    },
    //救世主发动救世成功，全局提醒
    getSavePushObj:function(skill){
        return {
            targetPos:["room"],
            info:"夜晚"+skill.me.myPosition+"号发动"+skill.colorName+"成功！"
        };
    },
    //为祈福者的[祈祷]叠加效果
    addBlessEffect:function(game,skill){
        if(skill.type === "day"){
            game.runningInfo.glbEvent.trigBlessForThisDay = true;
        }else if(skill.type === "night"){
            game.runningInfo.glbEvent.trigBlessForThisNgt = true;
        }
        if(skill.me.myJobFlags.isEnlighten){
            var blessParty = skill.me.myParty;
            for(var i = 0; i < game.runningInfo.playerList;i++){
                var player = game.runningInfo.playerList[i];
                if(blessParty === player.myParty){
                    player.onMeFlags.isBlessed = true;
                }
            }
        }else{
            for(i = 0; i < game.runningInfo.playerList;i++){
                player = game.runningInfo.playerList[i];
                player.onMeFlags.isBlessed = true;
            }
        }
    },
    //为救世主的救世的[救世]叠加效果
    addSaveEffect:function(game,skill,deadPosArr){
        //截止到该方法调用之前，所有出局都未处理而被buffer在laterDieWithOutJYByGods中；
        var saverParty = skill.me.myParty;
        var isLaunched = false;
        if(saverParty ===GameInfo.PartyInfo.HMN && game.runningInfo.quickArr.survHmnNum === 1){
            isLaunched = true;
        }else if( saverParty === GameInfo.PartyInfo.GST && game.runningInfo.quickArr.survGstNum === 1){
            isLaunched = true;
        }
        if(!skill.me.myJobFlags.isEnlighten){
            skill.me.die(PlayerInfo.DIE_OF.SKILL_KILL_SELF,skill.me.myPosition,game);
            deadPosArr.push(skill.me.myPosition);
        }
        if(isLaunched){
            game.runningInfo.fleshArr.thisNgtInfoSenderBuffer.push(this.getSavePushObj(skill));
            game.runningInfo.fleshArr.thisDawnEffectSenderBuffer.push(models.dawnKillHinter("save",skill.me.myPosition));
        }
    },
    //鬼媚误刀效果    ★已测试通过
    mglUseBasicKill:function(skill){
        if(skill.me.myJob === GameInfo.JobInfo.getJobId("mgl") && skill.me.myParty === GameInfo.PartyInfo.GST && skill.target.myParty === GameInfo.PartyInfo.GST){
            skill.me.myState.isCanKill = false;
        }
    },
    //人媚验到鬼效果     ★已测试通过
    mglSeduceGst:function(skill){
        if(skill.me.myJob === GameInfo.JobInfo.getJobId("mgl") && skill.me.myParty === GameInfo.PartyInfo.HMN && skill.target.myParty === GameInfo.PartyInfo.GST){
            skill.me.myState.isCanShot= false;
        }
    }
};

/** 数据体模型 */
var models = {
    dawnKillHinter : function(skillName,tarPos){
        return {skillName:skillName,targetPos:tarPos};
    },
    dawnInfo : function(targetsArr,info,infoArr){
        if(info === null){
            return{
                targetsArr:targetsArr,
                infoArr:infoArr
            }
        }else{
            var realInfoArr = [];
            for(var i = 0; i < targetsArr.length; i++){
                realInfoArr.push(info);
            }
            return{
                targetsArr:targetsArr,
                infoArr:realInfoArr
            }
        }
    }
};
