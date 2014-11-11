var ColorHelper = require("../../basicGameInfo/ColorHelper");
var GameInfo = require("../../basicGameInfo/GameInfo");
/**技能发动的类别**/
var SKILL_LAUNCH_TYPE = {
    SINGLE_TO_1:1,              //单次发动指向单体
    SINGLE_TO_n:2,              //单次发动指向多体
    SINGLE_TO_no:3,             //单次发动无指向
    EVERY_TO_1:4,               //多次发动指向单体
    EVERY_TO_n:5,               //多次发动指向多体
    EVERY_TO_no:6,               //多次发动无指向
    SINGLE_PSV:7,               //单次被动
    MULTI_PSV:8                //多次被动
};
exports.SKILL_LAUNCH_TYPE = SKILL_LAUNCH_TYPE;
/**技能发动的时机**/
var SKILL_LAUNCH_TIME = {
    NGT:1,                      //夜晚
    SPEECH:2,                   //发言环节
    BEFORE:3,                   //开始自动
    OTHER:10                    //其他多组合
};
exports.SKILL_LAUNCH_TIME = SKILL_LAUNCH_TIME;

var skillArr = [];

/**所有技能的基类**/
function BaseSkill(me,game){
    this.skillSelf = this;
    this.game = game;
    this.me = me;
    this.str = "";
    this.html = "";
}
//夜晚行动函数
BaseSkill.prototype.pushNightBuffer = function(targetPos,targetsPosArr,lastNight,specialParams){
    this.str = "—["+this.skillCnName+"]→";
    this.html = ColorHelper.colorHtml(ColorHelper.getColorByJobId(this.belongJob),this.str);
    this.colorName = ColorHelper.colorHtml(ColorHelper.getColorByJobId(this.belongJob),"["+this.skillCnName+"]");
    if(specialParams === undefined){
        if(targetPos!=null){
            this.target = this.game.runningInfo.playerListByPos[targetPos];
        }
        if(targetsPosArr!=null){
            this.targets = [];
            for(var i = 0;i<targetsPosArr.length;i++){
                this.targets.push(this.game.runningInfo.playerListByPos[targetsPosArr[i]]);
            }
        }
        this.lastNight = lastNight; //是上一个夜晚的技能
        if(this.lastNight){
            this.lastNight = true; //是上一个夜晚的技能
            this.game.runningInfo.fleshArr.lastNgtSkillBuffer.push(this.skillSelf);
        }else{
            this.game.runningInfo.fleshArr.thisNgtSkillBuffer.push(this.skillSelf);
        }
    }else{
        if(specialParams.skillName === "detect"){
            this.target = this.game.runningInfo.playerListByPos[specialParams.targetPos];
            this.targetJob = specialParams.targetJob;
            this.game.runningInfo.fleshArr.thisNgtSkillBuffer.push(this.skillSelf);
        }else if(specialParams.skillName === "hypnosis"){
            this.target = this.game.runningInfo.playerListByPos[targetPos];
            this.type = specialParams.type;
            this.game.runningInfo.fleshArr.thisNgtSkillBuffer.push(this.skillSelf);
        }else if(specialParams.skillName === "bless"){
            this.type = specialParams.type;
            this.game.runningInfo.fleshArr.thisNgtSkillBuffer.push(this.skillSelf);
        }else if(specialParams.skillName === "gamble"){
            this.guessNum = specialParams.guessNum;
            this.game.runningInfo.fleshArr.thisNgtSkillBuffer.push(this.skillSelf);
        }else if(specialParams.skillName === "psychic"){
            this.type = specialParams.type;
            this.game.runningInfo.fleshArr.thisNgtSkillBuffer.push(this.skillSelf);
        }
    }
    delete this.game;
};

/**所有技能**/
    /** 1号技能-所有职业-[杀死] **/
    function BasicKill(me,game){
        BaseSkill.call(this,me,game);
        this.skillName = "basicKill";
        this.skillCnName = "杀死";
        this.skillLaunchType = SKILL_LAUNCH_TYPE.EVERY_TO_1;
        this.skillLaunchTime = SKILL_LAUNCH_TIME.NGT;
        this.belongJob = GameInfo.JobInfo.getJobId("njb");
        this.move = function(targets){
            this.pushNightBuffer(targets[0],null,false);
        };
    }
    BasicKill.prototype = new BaseSkill();
    exports.BasicKill = BasicKill;

    /** 3号技能-媚女郎-[色诱] **/
    function Seduce(me,game){
        BaseSkill.call(this,me,game);
        this.skillName = "seduce";
        this.skillCnName = "色诱";
        this.skillLaunchType = SKILL_LAUNCH_TYPE.SINGLE_TO_1;
        this.skillLaunchTime = SKILL_LAUNCH_TIME.NGT;
        this.belongJob = GameInfo.JobInfo.getJobId("mgl");
        this.move = function(targets){
            this.pushNightBuffer(targets[0],null,false);
        };
    }
    Seduce.prototype = new BaseSkill();
    exports.Seduce = Seduce;

    /** 4号技能-潜行者-[刺杀] **/
    function Assassinate(me,game){
        BaseSkill.call(this,me,game);
        this.skillName = "assassinate";
        this.skillCnName = "刺杀";
        this.skillLaunchType = SKILL_LAUNCH_TYPE.SINGLE_TO_1;
        this.skillLaunchTime = SKILL_LAUNCH_TIME.NGT;
        this.belongJob = GameInfo.JobInfo.getJobId("ass");
        this.move = function(targets){
            this.pushNightBuffer(targets[0],null,false);
        };
    }
    Assassinate.prototype = new BaseSkill();
    exports.Assassinate = Assassinate;

    /** 6号技能-魔术师-[迷惑] **/
    function Confuse(me,game){
        BaseSkill.call(this,me,game);
        this.skillName = "confuse";
        this.skillCnName = "迷惑";
        this.skillLaunchType = SKILL_LAUNCH_TYPE.EVERY_TO_1;
        this.skillLaunchTime = SKILL_LAUNCH_TIME.NGT;
        this.belongJob = GameInfo.JobInfo.getJobId("mgc");
        this.move = function(targets){
            this.pushNightBuffer(targets[0],null,false);
        };
    }
    Confuse.prototype = new BaseSkill();
    exports.Confuse = Confuse;

    /** 10号技能-守护者-[护卫] **/
    function Protect(me,game){
        BaseSkill.call(this,me,game);
        this.skillName = "protect";
        this.skillCnName = "护卫";
        this.skillLaunchType = SKILL_LAUNCH_TYPE.EVERY_TO_1;
        this.skillLaunchTime = SKILL_LAUNCH_TIME.NGT;
        this.belongJob = GameInfo.JobInfo.getJobId("gdn");
        this.move = function(targets){
            this.pushNightBuffer(targets[0],null,false);
        };
    }
    Protect.prototype = new BaseSkill();
    exports.Protect = Protect;

    /** 11号技能-先知-[占卜] **/
    function Predict(me,game){
        BaseSkill.call(this,me,game);
        this.skillName = "predict";
        this.skillCnName = "占卜";
        this.skillLaunchType = SKILL_LAUNCH_TYPE.SINGLE_TO_no;
        this.skillLaunchTime = SKILL_LAUNCH_TIME.NGT;
        this.belongJob = GameInfo.JobInfo.getJobId("fsr");
        this.move = function(){
            this.pushNightBuffer(null,null,false);
        };
    }
    Predict.prototype = new BaseSkill();
    exports.Predict = Predict;

    /** 12号技能-数学家-[推演] **/
    function Deduce(me,game){
        BaseSkill.call(this,me,game);
        this.skillName = "deduce";
        this.skillCnName = "推演";
        this.skillLaunchType = SKILL_LAUNCH_TYPE.SINGLE_TO_no;
        this.skillLaunchTime = SKILL_LAUNCH_TIME.NGT;
        this.belongJob = GameInfo.JobInfo.getJobId("mtm");
        this.move = function(targets){
            if(typeof targets ==="array"){
                    this.pushNightBuffer(targets[0],null,false);
            }else{
                this.pushNightBuffer(null,null,false);
            }
        };
    }
    Deduce.prototype = new BaseSkill();
    exports.Deduce = Deduce;

    /** 13号技能-挑拨者-[煽动] **/
    function Provoke(me,game){
        BaseSkill.call(this,me,game);
        this.skillName = "provoke";
        this.skillCnName = "煽动";
        this.skillLaunchType = SKILL_LAUNCH_TYPE.SINGLE_TO_n;
        this.skillLaunchTime = SKILL_LAUNCH_TIME.NGT;
        this.belongJob = GameInfo.JobInfo.getJobId("ist");
        this.move = function(targets){
            this.pushNightBuffer(null,targets,false);
        };
    }
    Provoke.prototype = new BaseSkill();
    exports.Provoke = Provoke;

    /** 16号技能-守护者-[鉴定] **/
    function Verify(me,game){
        BaseSkill.call(this,me,game);
        this.skillName = "verify";
        this.skillCnName = "鉴定";
        this.skillLaunchType = SKILL_LAUNCH_TYPE.EVERY_TO_1;
        this.skillLaunchTime = SKILL_LAUNCH_TIME.NGT;
        this.belongJob = GameInfo.JobInfo.getJobId("cnr");
        this.move = function(targets){
            if(paramChecker(arguments[0],"array",this.skillName)){
                this.pushNightBuffer(targets[0],null,false);
            }
        };
    }
    Verify.prototype = new BaseSkill();
    exports.Verify = Verify;

    /** 17号技能-通灵师-[还魂] **/
    function Psychic(me,game){
        BaseSkill.call(this,me,game);
        this.skillName = "psychic";
        this.skillCnName = "还魂";
        this.skillLaunchType = SKILL_LAUNCH_TYPE.EVERY_TO_1;
        this.skillLaunchTime = SKILL_LAUNCH_TIME.NGT;
        this.belongJob = GameInfo.JobInfo.getJobId("psy");
        this.move = function(targets,info){
            if(paramChecker(arguments[0],"array",this.skillName)){
                this.pushNightBuffer(targets[0],null,false,{type:info});
            }
        };
    }
    Psychic.prototype = new BaseSkill();
    exports.Psychic = Psychic;

//TODO　ＴＯＤＯ

    /** 18号技能-大侦探-[侦查] **/
    function Detect(me,game){
        BaseSkill.call(this,me,game);
        this.skillName = "detect";
        this.skillCnName = "侦查";
        this.skillLaunchType = SKILL_LAUNCH_TYPE.EVERY_TO_1;
        this.skillLaunchTime = SKILL_LAUNCH_TIME.NGT;
        this.belongJob = GameInfo.JobInfo.getJobId("dtt");
        this.move = function(targetPos,targetJob){      //★获得侦探技能方式的时候特别注意
            this.pushNightBuffer(null,null,false,{skillName:"detect",targetPos:targetPos,targetJob:targetJob});
        };
    }
    Detect.prototype = new BaseSkill();
    exports.Detect = Detect;

    /** 19号技能-代言人-[代言] **/
    function Represent(me,game){
        BaseSkill.call(this,me,game);
        this.skillName = "represent";
        this.skillCnName = "代言";
        this.skillLaunchType = SKILL_LAUNCH_TYPE.EVERY_TO_1;
        this.skillLaunchTime = SKILL_LAUNCH_TIME.NGT;
        this.belongJob = GameInfo.JobInfo.getJobId("spm");
        this.move = function(target){
            this.pushNightBuffer(target,null,false);
        };
    }
    Represent.prototype = new BaseSkill();
    exports.Represent = Represent;

    /** 20号技能-启迪者-[启迪] **/
    function Enlighten(me,game){
        BaseSkill.call(this,me,game);
        this.skillName = "enlighten";
        this.skillCnName = "启迪";
        this.skillLaunchType = SKILL_LAUNCH_TYPE.EVERY_TO_1;
        this.skillLaunchTime = SKILL_LAUNCH_TIME.NGT;
        this.belongJob = GameInfo.JobInfo.getJobId("ins");
        this.move = function(target){
            if(paramChecker(arguments[0],"number",this.skillName)){
                this.pushNightBuffer(target,null,false);
            }
        };
    }
    Enlighten.prototype = new BaseSkill();
    exports.Enlighten = Enlighten;

    /** 21号技能-音乐家-[催眠] **/
    function Hypnosis(me,game){
        BaseSkill.call(this,me,game);
        this.skillName = "hypnosis";
        this.skillCnName = "催眠";
        this.skillLaunchType = SKILL_LAUNCH_TYPE.EVERY_TO_1;
        this.skillLaunchTime = SKILL_LAUNCH_TIME.NGT;
        this.belongJob = GameInfo.JobInfo.getJobId("msc");
        this.move = function(target,type){  //★获得音乐家技能方式的时候特别注意
            if(paramChecker(arguments[0],"number",this.skillName)){
                this.pushNightBuffer(target,null,false,{skillName:"hypnosis",type:type});
            }
        };
    }
    Hypnosis.prototype = new BaseSkill();
    exports.Hypnosis = Hypnosis;

    /** 22号技能-祈福者-[祈祷] **/
    function Bless(me,game){
        BaseSkill.call(this,me,game);
        this.skillName = "bless";
        this.skillCnName = "祈福";
        this.skillLaunchType = SKILL_LAUNCH_TYPE.SINGLE_TO_no;
        this.skillLaunchTime = SKILL_LAUNCH_TIME.NGT;
        this.belongJob = GameInfo.JobInfo.getJobId("bls");
        this.move = function(type){         //★获得音乐家技能方式的时候特别注意
            if(paramChecker(arguments[0],"number",this.skillName)){
                this.pushNightBuffer(null,null,false,{skillName:"bless",type:type});
            }
        };
    }
    Bless.prototype = new BaseSkill();
    exports.Bless = Bless;

    /** 25号技能-救世主-[救世] **/
    function Save(me,game){
        BaseSkill.call(this,me,game);
        this.skillName = "save";
        this.skillCnName = "救世";
        this.skillLaunchType = SKILL_LAUNCH_TYPE.EVERY_TO_1;
        this.skillLaunchTime = SKILL_LAUNCH_TIME.NGT;
        this.belongJob = GameInfo.JobInfo.getJobId("svr");
        this.move = function(target){
            if(paramChecker(arguments[0],"number",this.skillName)){
                this.pushNightBuffer(target,null,false);
            }
        };
    }
    Save.prototype = new BaseSkill();
    exports.Save = Save;

    /** 27号技能-搏命家-[下注] **/
    function Gamble(me,game){
        BaseSkill.call(this,me,game);
        this.skillName = "gamble";
        this.skillCnName = "下注";
        this.skillLaunchType = SKILL_LAUNCH_TYPE.EVERY_TO_no;
        this.skillLaunchTime = SKILL_LAUNCH_TIME.NGT;
        this.belongJob = GameInfo.JobInfo.getJobId("gbl");
        this.move = function(guessNum){
            if(paramChecker(arguments[0],"number",this.skillName)){
                this.pushNightBuffer(null,null,false,{skillName:"gamble",guessNum:guessNum});
            }
        };
    }
    Gamble.prototype = new BaseSkill();
    exports.Gamble = Gamble;

    /** 28号技能-阴谋家-[诬陷] **/
    function Frame(me,game){
        BaseSkill.call(this,me,game);
        this.skillName = "frame";
        this.skillCnName = "诬陷";
        this.skillLaunchType = SKILL_LAUNCH_TYPE.EVERY_TO_1;
        this.skillLaunchTime = SKILL_LAUNCH_TIME.NGT;
        this.belongJob = GameInfo.JobInfo.getJobId("cns");
        this.move = function(target){
            if(paramChecker(arguments[0],"number",this.skillName)){
                this.pushNightBuffer(target,null,false);
            }
        };
    }
    Frame.prototype = new BaseSkill();
    exports.Frame = Frame;

    /** 29号技能-革命家-[牺牲] **/
    function Sacrifice(me,game){
        BaseSkill.call(this,me,game);
        this.skillName = "sacrifice";
        this.skillCnName = "牺牲";
        this.skillLaunchType = SKILL_LAUNCH_TYPE.SINGLE_TO_no;
        this.skillLaunchTime = SKILL_LAUNCH_TIME.NGT;
        this.belongJob = GameInfo.JobInfo.getJobId("rvl");
        this.move = function(){
            this.pushNightBuffer(null,null,false);
        };
    }
    Sacrifice.prototype = new BaseSkill();
    exports.Sacrifice = Sacrifice;

    /** 32号技能-复仇者-[玉碎] **/
    function Avenge(me,game){
        BaseSkill.call(this,me,game);
        this.skillName = "avenge";
        this.skillCnName = "玉碎";
        this.skillLaunchType = SKILL_LAUNCH_TYPE.SINGLE_TO_1;
        this.skillLaunchTime = SKILL_LAUNCH_TIME.NGT;
        this.belongJob = GameInfo.JobInfo.getJobId("avg");
        this.move = function(target){
            if(paramChecker(arguments[0],"number",this.skillName)){
                this.pushNightBuffer(target,null,false);
            }
        };
    }
    Avenge.prototype = new BaseSkill();
    exports.Avenge = Avenge;

    /** 35号技能-引路人-[明灯] **/
    function Light(me,game){
        BaseSkill.call(this,me,game);
        this.skillName = "light";
        this.skillCnName = "明灯";
        this.skillLaunchType = SKILL_LAUNCH_TYPE.MULTI_PSV;
        this.skillLaunchTime = SKILL_LAUNCH_TIME.OTHER;
        this.belongJob = GameInfo.JobInfo.getJobId("ldr");
        me.myJobFlags.isHaveLight = true;
    }
    Light.prototype = new BaseSkill();
    exports.Light = Light;

    /** 36号技能-暗语者-[私语] **/
    function Whisper(me,game){
        BaseSkill.call(this,me,game);
        this.skillName = "whisper";
        this.skillCnName = "私语";
        this.skillLaunchType = SKILL_LAUNCH_TYPE.EVERY_TO_no;
        this.skillLaunchTime = SKILL_LAUNCH_TIME.NGT;
        this.belongJob = GameInfo.JobInfo.getJobId("agt");
        this.move = function(target){
            if(paramChecker(arguments[0],"number",this.skillName)){
                this.pushNightBuffer(target,null,false);
            }
        };
    }
    Whisper.prototype = new BaseSkill();
    exports.Whisper = Whisper;

    /** 37号技能-天使-[神圣劝化] **/
    function Persuade(me,game){
        BaseSkill.call(this,me,game);
        this.skillName = "persuade";
        this.skillCnName = "圣神劝化";
        this.skillLaunchType = SKILL_LAUNCH_TYPE.EVERY_TO_1;
        this.skillLaunchTime = SKILL_LAUNCH_TIME.NGT;
        this.belongJob = GameInfo.JobInfo.getJobId("agl");
        this.move = function(target){
            if(paramChecker(arguments[0],"number",this.skillName)){
                this.pushNightBuffer(target,null,false);
            }
        };
    }
    Persuade.prototype = new BaseSkill();
    exports.Persuade = Persuade;

    /** 39号技能-恶魔-[嗜血屠戮] **/
    function Slaughter(me,game){
        BaseSkill.call(this,me,game);
        this.skillName = "slaughter";
        this.skillCnName = "嗜血屠戮";
        this.skillLaunchType = SKILL_LAUNCH_TYPE.EVERY_TO_1;
        this.skillLaunchTime = SKILL_LAUNCH_TIME.NGT;
        this.belongJob = GameInfo.JobInfo.getJobId("dmn");
        this.move = function(target){
            if(paramChecker(arguments[0],"number",this.skillName)){
                this.pushNightBuffer(target,null,false);
            }
        };
    }
    Slaughter.prototype = new BaseSkill();
    exports.Slaughter = Slaughter;

    /** 41号技能-狼人-[感染] **/
    function Infect(me,game){
        BaseSkill.call(this,me,game);
        this.skillName = "infect";
        this.skillCnName = "感染";
        this.skillLaunchType = SKILL_LAUNCH_TYPE.EVERY_TO_1;
        this.skillLaunchTime = SKILL_LAUNCH_TIME.NGT;
        this.belongJob = GameInfo.JobInfo.getJobId("wwf");
        this.move = function(target){
            if(paramChecker(arguments[0],"number",this.skillName)){
                this.pushNightBuffer(target,null,false);
            }
        };
    }
    Infect.prototype = new BaseSkill();
    exports.Infect = Infect;

    /** 44号技能-药剂师-[毒剂] **/
    function Poison(me,game){
        BaseSkill.call(this,me,game);
        this.skillName = "poison";
        this.skillCnName = "毒剂";
        this.skillLaunchType = SKILL_LAUNCH_TYPE.EVERY_TO_1;
        this.skillLaunchTime = SKILL_LAUNCH_TIME.NGT;
        this.belongJob = GameInfo.JobInfo.getJobId("phr");
        this.move = function(target){
            if(paramChecker(arguments[0],"number",this.skillName)){
                this.pushNightBuffer(target,null,false);
            }
        };
    }
    Poison.prototype = new BaseSkill();
    exports.Poison = Poison;


//test
//var s = new Persuade("me","game");
//var s2 = new BasicKill("me","game");
//s.move(3);
//s2.move(4,2);
//console.log(skillArr);
