var allocateManager = require("../../hggame/gameManagers/allocateManager/allocateManager");

//test data
var params = {
    ttlNum :12,
    jobTurnUpList:[2,3],          //本局游戏“可以上场”的职业列表
    jobForcedList:[],         //本局游戏在“可以上场的前提下必须上场”的职业列表
    jobWantList:[2],            //本局游戏在“可以上场的前提下玩家的职业申请”的列表
    alnType:1,                  //外星人登场情况：0不登场，1随机，2必上场
    wwfType:1,                   //狼族登场情况：0不上场，1随机，2必上场
    singleJob:false              //单职业模式
};

//run test
allocateManager.allocatePrinter(allocateManager.getAllocateResult(params));
