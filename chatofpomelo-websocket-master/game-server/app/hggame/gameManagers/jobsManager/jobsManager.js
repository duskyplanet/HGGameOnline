var GameInfo = require("../../basicGameInfo/GameInfo");

exports.initSkills = function initSkills(myJob,game,myId,myParty){
    var bkl = "basicKill";
    switch(GameInfo.JobInfo.jobAbbr[myJob]){
        case "njb":{
            return[bkl,null,null];
        }break;
        case "aln":{
            return[null,null,null]
        }break;
        case "dgl":{
            return[bkl,
                {
                    skillName:"色诱",
                    skillEName:"liguid",
                    move:function(tarId){
                        game.thisNightSkillBuffer.push({
                            name:"liguid",
                            srcId:myId,
                            tarId:tarId
                        });
                    }
                }
                ,null]
        }break;
        case "cmd":{

        }break;
        case "rst":{

        }break;
        case "ast":{
            return[bkl,
                {
                    skillName:"刺杀",
                    skillEName:"assassin",
                    move:function(tarId){
                        game.thisNightSkillBuffer.push({
                            name:"assassin",
                            srcId:myId,
                            tarId:tarId
                        });
                    }
                }
                ,null]
        }break;
        default :console.log("jobsManager发生致命逻辑错误：未发现可以分配的职业简称");
            break;
    }
};
