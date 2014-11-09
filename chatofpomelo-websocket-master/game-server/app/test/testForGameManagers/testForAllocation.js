var allocateManager = require("../../hggame/gameManagers/alloctManager/alloctManager");

//test data
var params = {
    ttlNum :24,
    jobTurnUpList:[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],          //本局游戏“可以上场”的职业列表
    jobForcedList:[2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],         //本局游戏在“可以上场的前提下必须上场”的职业列表
    jobWantList:[],            //本局游戏在“可以上场的前提下玩家的职业申请”的列表
    alnType:2,                  //外星人登场情况：0不登场，1随机，2必上场
    wwfType:2,                   //狼族登场情况：0不上场，1随机，2必上场
    singleJob:true              //单职业模式
};

//run test
allocateManager.allocatePrinter(allocateManager.getAllocateResult(params));
