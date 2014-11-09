var jobsManager = require("../gameManagers/jobsManager/jobsManager");
var hjcArr = require("../../HJCUtils/HJCArray");
var GameInfo = require("../basicGameInfo/GameInfo");
var ColorHelper = require("../basicGameInfo/ColorHelper");

/** 玩家死因 **/
var info = {
    DIE_OF : {
        VOTE_OUT: 1,            //被公决出局
        SHOOT_OUT: 2,           //被开枪带走
        KILLED_BY_GST: 3,       //被[杀死]技能杀死于夜晚
        KILLED_BY_ASS  : 5,     //被刺杀
        HMN_KILLED_BY_SELF : 14, //自杀[自己起刀]
        SKILL_KILL_SELF: 16      //自杀（使用技能：[牺牲][救世][复仇]）
    }
};

exports.info = info;

exports.player = Player;
function Player(game,myJob,myParty,myPos){
    var self = this;
    this.game = game;
    this.myNick = game.runningInfo.quickArr.nickList[myPos];//昵称
    this.myPosition = myPos;    //实际位置
    this.myJob = myJob;                                     //职业序号
    this.myParty = myParty;
    this.dieInfo = [];
    /**我的基本状态**/
    this.myState = {
        isAlive:true,               //是否存活
        isCanShot:true,             //死后是否可以技言（人类基本权利）
        isHaveShot:false,            //死后已经技言
        isCanKill:true              //是否还可以使用[杀死]（是否点亮）
    };
    /**其他职业施加在我身上的技能状态**/
    this.onMeFlags = {
        isConfused:false,           //被魔术师[迷惑]                每夜刷新
        isReversed:false,           //阵营交换
        isPersuaded:false,          //当夜被天使[神圣劝化]          每夜刷新
        isSlaughtered:false,        //当夜被恶魔[嗜血屠戮]          每夜刷新
        isToDmnBody:false,           //当夜技能指向恶魔[邪魔附体]    每夜刷新
        isProvoked:false,           //当夜被挑拨者[煽动]（其他技能无效）            每夜刷新
        isRepresent:false,           //当夜被代言人[代言]            每夜刷新
        isVerified:false,            //当夜被验尸官加上活体[鉴定]          每夜刷新
        isPsychic:false,            //当夜被通灵师加上[通灵]标记           每夜刷新
        PsychicIsSpk:true,          //被[通灵]方式 true=有言 false=有票
        isUndeadGst:false,           //活者当夜通灵师加上[不死亡灵]标记         每夜刷新
        isHypnosisSpk:false,            //当夜被音乐家加上[催眠]标记        每夜刷新
        isHypnosisVote:false,       //当夜被音乐家加上[催眠]标记禁票        每夜刷新
        isFramed:false,             //当夜被阴谋家加上[诬陷]标记禁言        每夜刷新
        addShieldNum:0,              //当晚被守护者叠加的[守护]层数       每夜刷新
        isLighted:false,                //被引路人加上[心灵之光]
        shieldRemover:[],            //当晚消除我的[守护]buff、[下注]的额外生命、[顶级戒备]护盾的所有潜在凶手 每夜刷新
        isBlessed:false,             //当天夜晚或者白天因为祈福者使用[祝福]导致该玩家不能出局
        isFirstEnlightened:true,    //是否是第一次受到启迪（该字段用于黎明时是否需要推送启迪信息）
        isInfected :false           //是否被狼人感染
    };
    /**我的技能状态**/
    this.myJobFlags= {
        /**专属于外星人*/
        isGuessUsed:false,          //先机已经使用
        isAdvent:false,             //天使已经将领
        isFirstAdvent:true,          //是否是刚刚降临；
        isAwake:false,              //恶魔已经觉醒
        isFirstAwake:true,          //是否是刚刚觉醒；
       // canBeEnlighten:true,        //我的职业是否可以被启迪者[启迪]
        isEnlighten:false,           //我的职业是否已经被启迪者[启迪]
        lastConfuseTargetPos:-1,      //上一个夜晚[迷惑]对象，专属魔术师 计算时刷新
        lastRepresentTargetPos:-1,    //上一个夜晚[代言]对象，专属于代言人 计算时刷新
        isProvokeUsed:false,          //[煽动]已经使用过，专属挑拨者
        isPredictUsed:false,           //[占卜]已经使用过，专属先知
        /**专属指挥官**/
        isAuthorUsed:false,             //[权威]/[至高王权]已经使用过
        /**专属大主教**/
        isJudgeUsed:false,             //[审判]/[无上神威]已经使用过
        /**专属治愈者*/
        isCureUsed:false,             //[救赎]/[真爱永生]已经使用过
        /**专属数学家**/
        isDeduceStop:false,             //[推演]能力已经丧失
        thisNgtDeduceReceived:false,     //当夜收到来自于我的[推演] 每夜刷新
        lastRdmDeducePos:-1,         //上一个夜晚自动的[推演]目标
        alreadyDeducePos:[],             //已经[推演]过得目标
        /**专属验尸官*/
        lastVerifyPos:-1,                //上一个夜晚[鉴定]的目标
        /**专属暗语者*/
        isWhisperUsed:false,                //私语已经使用
        /**专属通灵师*/
        lastPsychicPos:-1,                  //上一个夜晚的[通灵]目标
        /**专属音乐家*/
        lastHypnosisPos:-1,                  //上一个夜晚的[催眠]目标
        /**专属阴谋家*/
        lastFramePos:-1,                   //上一个夜晚的[诬陷]目标
        /**专属守护者*/
        lastProtectPos:-1,                   //上一个夜晚的[守卫]目标
        isHaveTopAlert:false,               //是否拥有[顶级戒备]的护盾
        /**专属祈福者*/
        isBlessUsed:false,                   //已经使用了[祈祷]
        /**专属搏命家*/
        winLives:0,                     //通过[下注]获得的额外生命值
        guess:null,                      //上一个夜晚的[下注]信息
        /**专属于引路人*/
        isHaveLight:false,               //拥有明灯效果
        /**专属于革命家*/
        isLaunchedSacrifice:false,        //如果启动[牺牲]有效，将以最高优先级出局
        isSacrificeUsed:false,              //[牺牲]已经使用
        /**专属于救世主*/
        isLaunchedSave:false,          //如果启动[救世]有效，将以最高优先级出局
        isSaveUsed:false,              //[救世]已经使用
        /**专属于复仇者*/
        isLaunchedAvenge:false,          //如果启动[复仇]有效，将以最高优先级出局
        isAvengeUsed:false,              //[玉碎]已经使用
        /**专属于屌丝*/
        myGoddessPos:-1,                   //女神的Pos
        /**专属于女神*/
        myLoserPos:-1,                  //屌丝的Pos
        /**专属于潜行者*/
        isAssassinateUsed:false             //是否使用[刺杀]
    };
    this.fstSkl = null;
    this.secSkl = null;
    this.thdSkl = null;
    this.initPlayer = function(){
        var skills = jobsManager.initSkills(self,game);
        self.fstSkl = skills[0];
        self.secSkl = skills[1];
        self.thdSkl = skills[2];
        if(self.myParty != GameInfo.PartyInfo.HMN){
            self.myState.isCanShot = false;
        }
    };
    this.initPlayer();
    delete this.game;
    /**玩家死亡函数
     * @return boolean:该玩家是否是一个新的死亡者
     * **/
    this.die = function(DieType,killer,game){
        //第一步，为玩家装载死因和凶手
        self.dieInfo.push(getDieTypeModel(DieType,killer));
        //该种方式出局将永久丧失技能和遗言权利
        if(DieType === info.DIE_OF.HMN_KILLED_BY_SELF || DieType === info.DIE_OF.SKILL_KILL_SELF || DieType === info.DIE_OF.KILLED_BY_ASS ){
            self.myState.isCanShot = false;
        }
        if( self.myState.isAlive === true){
            self.myState.isAlive = false;
            hjcArr.deleteValue(game.runningInfo.quickArr.survivals,self.myPosition);
            if(self.myParty === GameInfo.PartyInfo.HMN){
                game.runningInfo.quickArr.survHmnNum --;
            }else  if(self.myParty === GameInfo.PartyInfo.GST){
                game.runningInfo.quickArr.survGstNum --;
            }else if(self.myParty === GameInfo.PartyInfo.THD){
                game.runningInfo.quickArr.survAlnNum --;
            }else if(self.myParty === GameInfo.PartyInfo.FTH){
                game.runningInfo.quickArr.survWwfNum --;
            }
            return true;
        }else{
            return false;
        }
    };

    this.spellMyNightMoveMsg = function(){
        var msg = {};
        var tempSurvivals = [].concat(game.runningInfo.quickArr.survivals);
        var playerList = game.runningInfo.plyrList;
        hjcArr.deleteValue(tempSurvivals,self.myPosition);
        if(self.fstSkl.name="basicKill"){
            var able = true;
            //间谍第一晚不能行使技能
            if(self.myJob === GameInfo.JobInfo.getJobId("spy") && self.game.runningInfo.timeInfo.num === 1){
                able = false;
            }
            if(self.myJob === GameInfo.JobInfo.getJobId("mgl") && self.jobsInfo.canKill === false){
                able = false;
            }
            msg.sklBsc = {
                skillID:self.fstSkl.skillID,
                able:able,
                targets:tempSurvivals,
                forbidens:[]
            }
        }
        console.log(self.secSkl);
        if(self.secSkl!=null){
            if(self.secSkl.skillID === 3){            //色诱
                msg.sklJobA = {
                    skillID:self.secSkl.skillID,
                    able:true,
                    targets:tempSurvivals,
                    forbidens:[]
                }
            }else if(self.secSkl.skillID === 4){      //刺杀
                msg.sklJobA = {
                    skillID:self.secSkl.skillID,
                    able:self.jobsInfo.haveAss,
                    targets:tempSurvivals,
                    forbidens:[]
                }
            }else if(self.secSkl.skillID === 5){    //情报
                msg.sklJobA = {
                    skillID:self.secSkl.skillID,
                    able:false
                }
            }else if(self.secSkl.skillID === 6){      //迷惑
                msg.sklJobA = {
                    skillID:self.secSkl.skillID,
                    able:true,
                    targets:hjcArr.deleteValue(tempSurvivals,self.jobsInfo.lastCnfdPos),
                    forbidens:self.jobsInfo.lastCnfdPos===0?[]:self.tickDead(self.jobsInfo.lastCnfdPos,game)
                };
                self.jobsInfo.lastCnfdPos = 0;
            }else if(self.secSkl.skillID === 10){      //护卫
                msg.sklJobA = {
                    skillID:self.secSkl.skillID,
                    able:true,
                    targets:hjcArr.deleteValue([].concat(game.runningInfo.quickArr.survivals),self.jobsInfo.lastPttdPos),
                    forbidens:self.jobsInfo.lastPttdPos===0?[]:self.tickDead(self.jobsInfo.lastPttdPos,game)
                };
                self.jobsInfo.lastPttdPos = 0;
            }
        }
        return msg;
    };

    this.getMyEndInfo = function(vicParty){
        var res = "失败";
        if(vicParty===GameInfo.EndInfo.HMN && self.myParty===GameInfo.PartyInfo.HMN){
            res = "胜利";
        }else if(vicParty===GameInfo.EndInfo.GST && self.myParty===GameInfo.PartyInfo.GST){
            res = "胜利";
        }else if(vicParty===GameInfo.EndInfo.THD && self.myParty===GameInfo.PartyInfo.THD){
            res = "胜利";
        }else if(vicParty===GameInfo.EndInfo.EVE && (self.myParty===GameInfo.PartyInfo.HMN || self.myParty===GameInfo.PartyInfo.GST) ){
            res = "平局";
        }
        return {
            id:self.myPosition,
            nick:self.myNick,
            party:self.myParty,
            job:self.myJob,
            score:1,
            exp:5,
            money:2,
            res:res
        };
    };
};
//只有一个人
Player.prototype.tickDead = function(fbPos,game){
    var fbId = game.quickQuery.getIdByPosition(fbPos);
    var tarPlayer = game.runningInfo.plyrList[fbId];
    if(tarPlayer.state.isAlive){
        return [fbPos];
    }else{
        return [];
    }
};


function getDieTypeModel(dieType,killer){
    return {
        dieType:dieType,
        killer:killer
    };
}