var GameInfo = require("../../basicGameInfo/GameInfo");
var hjcArr = require("../../../HJCUtils/HJCArray");
var ColorHelper = require("../../basicGameInfo/ColorHelper");
var Skills = require("./SkillsManager.js");

//exports.initSkills = function initSkills(myJob,game,myId,myParty,jobsInfo){
//    var bkl = "basicKill";
//    switch(GameInfo.JobInfo.jobAbbr[myJob]){
//        case "njb":{
//            return[bkl,null,null];
//        }break;
//        case "aln":{
//            jobsInfo.canGuess = true;
//            return[null,{
//                skillName:"先机",
//                skillEName:"firstKnow",
//                skillID:2,
//                move:function(){
//                    jobsInfo.canGuess = false;
//                    game.recorder.add("beforeGame",{job:"aln",aln:game.runningInfo.plyrList[myId]})
//                },
//                info:{
//                    name:"firstKnow",
//                    str:"--[先机]",
//                    html:ColorHelper.colorHtml(ColorHelper.getColorByJobId(GameInfo.JobInfo.getJobId("aln")),"--[先机]")
//                }
//            },
//                null]
//        }break;
//        case "mgl":{
//            jobsInfo.canKill = true;
//            return[bkl,
//                {   skillName:"色诱",
//                    skillEName:"seduce",
//                    skillID:3,
//                    move:function(tarId){
//                        var tarPlayer = game.runningInfo.plyrList[tarId];
//                        game.runningInfo.fleshArr.thisNightSkillBuffer[myId]={
//                            name:"seduce",
//                            srcPlayer:game.runningInfo.plyrList[myId],
//                            tarPlayer:tarPlayer,
//                            str:"--[色诱]-->",
//                            html:ColorHelper.colorHtml(ColorHelper.getColorByJobId(GameInfo.JobInfo.getJobId("mgl")),"--[色诱]-->")
//                        };
//                    }
//                }
//                ,null]
//        }break;
//        case "cmd":{
//
//        }break;
//        case "rst":{
//
//        }break;
//        case "ass":{
//            jobsInfo.haveAss = true;
//            return[bkl,
//                {   skillName:"刺杀",
//                    skillEName:"assassinate",
//                    skillID:4,
//                    move:function(tarId){
//                        var tarPlayer = game.runningInfo.plyrList[tarId];
//                        game.runningInfo.fleshArr.thisNightSkillBuffer[myId]={
//                            name:"assassinate",
//                            srcPlayer:game.runningInfo.plyrList[myId],
//                            tarPlayer:tarPlayer,
//                            str:"--[刺杀]-->",
//                            html:ColorHelper.colorHtml(ColorHelper.getColorByJobId(GameInfo.JobInfo.getJobId("ass")),"--[刺杀]-->")
//                        };
//                    }
//                }
//                ,null]
//        }break;
//        case "spy":{
//            return[bkl,
//                {   skillName:"情报",
//                    skillEName:"intelligence",
//                    skillID:5,
//                    info:{
//                        name:"intelligence",
//                        str:"--[情报]",
//                        html:ColorHelper.colorHtml(ColorHelper.getColorByJobId(GameInfo.JobInfo.getJobId("spy")),"--[情报]")
//                    }
//                }
//                ,null]
//        }break;
//        case "mgc":{
//            jobsInfo.lastCnfdPos = 0;
//            return[bkl,
//                {   skillName:"迷惑",
//                    skillEName:"confuse",
//                    skillID:6,
//                    move:function(tarId){
//                        var tarPlayer = game.runningInfo.plyrList[tarId];
//                        jobsInfo.lastCnfdPos = tarPlayer.myPosition;        //不能连续迷惑
//                        game.runningInfo.fleshArr.thisNightSkillBuffer[myId]={
//                            name:"confuse",
//                            srcPlayer:game.runningInfo.plyrList[myId],
//                            tarPlayer:tarPlayer,
//                            str:"--[迷惑]-->",
//                            html:ColorHelper.colorHtml(ColorHelper.getColorByJobId(GameInfo.JobInfo.getJobId("mgc")),"--[迷惑]-->")
//                        };
//                    }
//                }
//                ,null]
//        }break;
//        case "bgd":{
//            jobsInfo.lastPttdPos = 0;
//            return[bkl,
//                {   skillName:"护卫",
//                    skillEName:"protect",
//                    skillID:10,
//                    move:function(tarId){
//                        var tarPlayer = game.runningInfo.plyrList[tarId];
//                        jobsInfo.lastPttdPos = tarPlayer.myPosition;        //不能连续护卫
//                        game.runningInfo.fleshArr.thisNightSkillBuffer[myId]={
//                            name:"protect",
//                            srcPlayer:game.runningInfo.plyrList[myId],
//                            tarPlayer:tarPlayer,
//                            str:"--[护卫]-->",
//                            html:ColorHelper.colorHtml(ColorHelper.getColorByJobId(GameInfo.JobInfo.getJobId("bgd")),"--[护卫]-->")
//                        };
//                    }
//                }
//                ,null]
//        }break;
//        default :console.log("jobsManager发生致命逻辑错误：未发现可以分配的职业简称");
//            break;
//    }
//};

exports.initSkills = function initSkills(me,game){
    //console.log(GameInfo.JobInfo.jobAbbr[me.myJob]);
    switch(GameInfo.JobInfo.jobAbbr[me.myJob]){
        case "njb": return [new Skills.BasicKill(me,game),null,null];break;
        case "aln": return [null,"先机",null];break; //TODO
        case "mgl": return [new Skills.BasicKill(me,game),new Skills.Seduce(me,game),null];break;
        case "ass": return [new Skills.BasicKill(me,game),new Skills.Assassinate(me,game),null];break;
        case "spy": return [new Skills.BasicKill(me,game),"谍报",null];break; //TODO
        case "mgc": return [new Skills.BasicKill(me,game),new Skills.Confuse(me,game),null];break;
        case "cmd": return [new Skills.BasicKill(me,game),"权威",null];break;
        case "rst": return [new Skills.BasicKill(me,game),"不屈",null];break;
        case "bsp": return [new Skills.BasicKill(me,game),"审判",null];break;
        case "gdn": return [new Skills.BasicKill(me,game),new Skills.Protect(me,game),null];break;
        case "fsr": return [new Skills.BasicKill(me,game),new Skills.Predict(me,game),null];break;
        case "mtm": return [new Skills.BasicKill(me,game),new Skills.Deduce(me,game),null];break;
        case "ist": return [new Skills.BasicKill(me,game),new Skills.Provoke(me,game),null];break;
        case "dct": return [new Skills.BasicKill(me,game),"救赎",null];break;
        case "spl": return [new Skills.BasicKill(me,game),"防弹",null];break;
        case "cnr": return [new Skills.BasicKill(me,game),new Skills.Verify(me,game),null];break;
        case "psy": return [new Skills.BasicKill(me,game),new Skills.Psychic(me,game),null];break;
        case "dtt": return [new Skills.BasicKill(me,game),new Skills.Detect(me,game),null];break;
        case "spm": return [new Skills.BasicKill(me,game),new Skills.Represent(me,game),null];break;
        case "ins": return [new Skills.BasicKill(me,game),new Skills.Enlighten(me,game),null];break;
        case "msc": return [new Skills.BasicKill(me,game),new Skills.Hypnosis(me,game),null];break;
        case "bls": return [new Skills.BasicKill(me,game),new Skills.Bless(me,game),null];break;
        case "lsr": return [new Skills.BasicKill(me,game),"信仰",null];break;
        case "gds": return [new Skills.BasicKill(me,game),"光辉",null];break;
        case "svr": return [new Skills.BasicKill(me,game),new Skills.Save(me,game),null];break;
        case "arb": return [new Skills.BasicKill(me,game),"仲裁",null];break;
        case "gbl": return [new Skills.BasicKill(me,game),new Skills.Gamble(me,game),null];break;
        case "cns": return [new Skills.BasicKill(me,game),new Skills.Frame(me,game),null];break;
        case "rvl": return [new Skills.BasicKill(me,game),new Skills.Sacrifice(me,game),null];break;
        case "ctc": return [new Skills.BasicKill(me,game),"舆论",null];break;
        case "tfr": return [new Skills.BasicKill(me,game),"汲取",null];break;
        case "avg": return [new Skills.BasicKill(me,game),new Skills.Avenge(me,game),null];break;
        case "psr": return ["良知","祭奠",null];break;
        case "ldr": return [new Skills.BasicKill(me,game),new Skills.Light(me,game),null];break;
        case "agt": return [new Skills.BasicKill(me,game),new Skills.Whisper(me,game),null];break;
        case "agl": return [new Skills.Persuade(me,game),"圣灵",null];break;
        case "dmn": return [new Skills.Slaughter(me,game),"魔体",null];break;
        case "wwf": return ["感染",new Skills.Seduce(me,game),null];break;
        case "msr": return [new Skills.BasicKill(me,game),"贪婪",null];break;
        case "phr": return [new Skills.BasicKill(me,game),"药剂",null];break;
        case "arc": return [new Skills.BasicKill(me,game),"强弓",null];break;
        case "sfz": return ["","",""];break;
        case "grl": return ["","",""];break;
        default :console.log("jobsManager发现不存在职业简称");
    }
};
//
//var obj ={
//    arr:["1","2"],
//    name:"hahah"
//};
//var pointer = obj;
//obj.arr =[];
//console.log(pointer);
//
//var obja = {name:"1"}
//var objb = {name:"2"}
////
//var arr = [obja,objb];
//var arr2 =arr;
//arr2[0].name ="2";
//console.log(arr);