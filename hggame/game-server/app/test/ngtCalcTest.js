var Game = require("../hggame/gameLogic/game.js").Game;
var calcNgt = require("../hggame/gameManagers/calcManager/nightCalc.js").calc;
var Receiver = require("../hggame/gameLogic/gameComponents/receiver.js").Receiver;
var hjcArr = require("../HJCUtils/HJCArray");

//测试room：
var testRoomInfo = {
    rid : 1,               //房间id
    rName : "黄达斯的房间",         //房间名称
    rHoster:"黄达斯",             //房主
    rmode : 0,         //房间模式 0=无职业 1=标准局
    rScale : 1,       //房间规模：0=(6-12) 1=(12-18) 2=(18-24)
    rFbdIP : false,       //是否禁止id true=禁止
    rPswd : "pswd",          //密码 如果为空则无密码
    num : 1,                         //已经加入玩家列表
    state : 1,                       //房间状态 0=等待中，1= 已经开始
    userList : {
        getNickList: function(){return [null,"路人1","路人2","路人3","路人4","路人5","路人6","路人7","路人8",null,null,false];},
        getTargetsByPos : function(){return[null,{uid: "路人1", sid:"1"},{uid: "路人2", sid:"1"},{uid: "路人3", sid:"1"},{uid: "路人4", sid:"1"},{uid: "路人5", sid:"1"},{uid: "路人6", sid:"1"},{uid: "路人7", sid:"1"},{uid: "路人8", sid:"1"},null,null,null]
        }
    },//房间内座位
    readyList :[null,true,true,true,true,true,true,true,true,false,false,false],
    //房间内的准备情况；
    advanced : {
        gameMode:0,  //0：文字-文字 1：图片-文字 2：文字-语音 3：图片-语音
        speakTime:90,
        saveTime:30,
        jobWant:false,
        wantList:[],
        wordMode:1, //0：新手，1：标准
        wordChooseArr:[],
        picMode:0
    }
};
var g = new Game(testRoomInfo,null);
console.log(g);
//g.launchSkill("路人2",2,1);
//g.launchSkill("黄达斯",2,9);
//g.launchSkill("路人9",1,1);
//console.log(g);
//g.receivers.nightSkillTo("路人5",{type:2,targets:[6,4]});
//g.receivers.nightSkillTo("路人1",{type:1,targets:[6]});
//g.receivers.nightSkillTo("路人2",{type:1,targets:[8]});
//g.receivers.nightSkillTo("路人3",{type:1,targets:[8]});
//g.receivers.nightSkillTo("路人5",{type:2,targets:[6]});
//g.receivers.nightSkillTo("路人6",{type:1,targets:[1]});
//g.receivers.nightSkillTo("路人8",{type:2,targets:[6]});

////g.receivers.nightSkillTo("路人4",{type:2,targets:[8]});
//g.receivers.nightSkillTo("路人8",{type:2,targets:[5]});
//g.receivers.nightSkillTo("路人7",{type:2,targets:[5]});


//calcNgt(g);
