var jobsManager = require("../gameManagers/jobsManager/jobsManager");
var hjcArr = require("../../HJCUtils/HJCArray");
var GameInfo = require("../basicGameInfo/GameInfo");

var info = {
    DIE_OF : {
        VOTE_OUT: 1,
        SHOOT_OUT: 2,
        KILLED_BY_GST: 3,
        HMN_KILLED_BY_SELF : 4,
        BY_SKILL  : 5
    }
}

exports.info = info;

exports.player = function Player(game,myJob,myParty,myid){
    var self = this;
    this.game = game;
    this.myId = myid;                                         //在plyrList中的位置
    this.myNick = game.runningInfo.quickArr.nickList[myid];            //昵称
    this.myPosition = game.runningInfo.quickArr.positionList[myid];    //实际位置
    this.myJob = myJob;                                     //职业序号
    this.myParty = myParty;
    this.dieOf = [];
    this.dieInfo = "";
    this.state = {              //状态
        isAlive:true,               //存活
        canShot:true,               //可以开枪
        haveShot:false              //已开过枪
    };
    this.bscKill = {
        skillName:"杀死",
        skillEName:"basicKill",
        move:function(tarId){
            var tarPlayer = tarId===null?null:self.game.runningInfo.plyrList[tarId];
            self.game.runningInfo.fleshArr.thisNightSkillBuffer[hjcArr.position(game.runningInfo.quickArr.survivals,self.myPosition)]={
                name:"basicKill",
                srcPlayer:self,
                tarPlayer:tarPlayer
            };
        }
    };
    this.fstSkl = null;
    this.secSkl = null;
    this.thdSkl = null;
    this.initPlayer = function(){
        var skills = jobsManager.initSkills(self.myJob,self.game,self.myId,self.myParty);
        if(skills[0]==="basicKill"){
            self.fstSkl = self.bscKill;
        }
        self.secSkl = skills[1];
        self.thdSkl = skills[2];
        if(self.myParty!= GameInfo.PartyInfo.HMN){
            self.state.canShot = false;
        }
    };
    this.initPlayer();
    this.die = function(type){
        switch (type){
            case info.DIE_OF.VOTE_OUT:{
                self.dieOf.push(info.DIE_OF.VOTE_OUT);
                self.clearQuickArr(false);
            }break;
            case info.DIE_OF.SHOOT_OUT:{
                self.dieOf.push(info.DIE_OF.SHOOT_OUT);
                self.clearQuickArr(false);
            }break;
            case info.DIE_OF.KILLED_BY_GST:{
                self.dieOf.push( info.DIE_OF.KILLED_BY_GST);
                if(self.state.isAlive === true){
                    self.clearQuickArr(true);
                }
            }break;
            case info.DIE_OF.HMN_KILLED_BY_SELF:{
                self.state.canShot = false;
                self.dieOf.push(info.DIE_OF.HMN_KILLED_BY_SELF);
                if(self.state.isAlive === true){
                    self.clearQuickArr(true);
                }
            }break;
        }
    };
    this.clearQuickArr = function(pushToArr){
        self.state.isAlive = false;
        hjcArr.deleteValue(self.game.runningInfo.quickArr.survivals,self.myPosition);
        //console.log(self.myPosition);
        //console.log(self.myParty);
        if(self.myParty === GameInfo.PartyInfo.HMN){
            self.game.runningInfo.quickArr.survHmnNum --;
        }else  if(self.myParty === GameInfo.PartyInfo.GST){
            self.game.runningInfo.quickArr.survGstNum --;
        }else if(self.myParty === GameInfo.PartyInfo.THD){
            self.game.runningInfo.quickArr.survAlnNum --;
        }
        if(pushToArr){
            self.game.runningInfo.fleshArr.lastNgtDeads.push(self);
        }
    }
};

