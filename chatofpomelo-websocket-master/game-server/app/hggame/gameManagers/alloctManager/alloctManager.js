//该类用于分配游戏阵营和职业
var basicUtils =  require("../../../HJCUtils/basicUtils");
var hjcArr = require("../../../HJCUtils/HJCArray");
var GameInfo = require("../../basicGameInfo/GameInfo");
var ai = require("./alloctInfo").alloctInfo;

//初始信息
var ttlNum;
var minGstNum;
var maxGstNum;
var jobTurnUpList;          //本局游戏可以上场的职业
var jobForcedList;          //本局游戏在可以上场的前提下必须上场的职业
var jobWantList;            //本局游戏在可以上场的前提下玩家的职业申请列表
var wantJobs;               //本局游戏在可以上场的前提下被申请的职业列表

//分配结果
var hmnNum;
var gstNum;
var alnNum;
var jobAppList;             //最终能上场的职业
var partyList;              //最终阵营分配
var jobList;                //最终职业分配


exports.getAllocRes = function (alloctInfo){
    ttlNum = alloctInfo.plyrNum.ttlNum;
    minGstNum =  alloctInfo.plyrNum.gstMinNum;
    maxGstNum =  alloctInfo.plyrNum.gstMaxNum;
    jobTurnUpList = alloctInfo.jobTurnUpList;
    jobForcedList =alloctInfo.jobForcedList;
    jobWantList = alloctInfo.jobWantList;
    wantJobs = [];
    jobAppList = [];
    for(var i = 0; i< jobWantList.length;i++){
        var thisJob = jobWantList[i];
        if(hjcArr.exist(wantJobs,thisJob)===false){
            wantJobs.push(thisJob);
        }
    }
    toAllctJob();
    toAllctNum();
    return {
        partyList:partyList,
        jobList:jobList,
        HmnNum:hmnNum,
        GstNum:gstNum,
        alnNum:alnNum
    }
};

//分配职业
function toAllctJob(){
    var rdmTPjobs = [];
    var mustTPjobs = [];
    jobList = hjcArr.fill(ttlNum,null);
    //首先区分哪些职业必须被分配，哪些随机分配
    for(var i = 0; i<jobTurnUpList.length; i++){
        var thisJob = jobTurnUpList[i];
        if(hjcArr.exist(jobForcedList,thisJob)){
            mustTPjobs.push(thisJob);
        }else{
            if(hjcArr.exist(wantJobs,thisJob)&&!hjcArr.exist(jobForcedList,thisJob)){
                mustTPjobs.push(thisJob);
            }else{
                rdmTPjobs.push(thisJob);
            }
        }
    }
   //然后决定上场职业表
   if(mustTPjobs.length>=ttlNum){
        jobAppList = mustTPjobs.splice(0,ttlNum);
   }else{
        jobAppList = [].concat(mustTPjobs);
        var restNum = ttlNum - mustTPjobs.length;
        for(var i = 0;i<rdmTPjobs.length;i++){
            if(Math.random()>=0.5){
                jobAppList.push(rdmTPjobs[i]);
                restNum--;
            }
            if(restNum<=0) break;
        }
   }
   alnNum = hjcArr.exist(jobAppList,GameInfo.JobInfo.getJobId("aln"))?1:0;
   //提前分配被竞选的职业
   var alreadyAllct = [];
   if(wantJobs.length!=0){
       for(var i = 0;i<wantJobs.length;i++){
           var wantJob = wantJobs[i];
           if(hjcArr.exist(jobAppList,wantJob)){
               //console.log("提前分配"+wantJob);
               var positions = hjcArr.positions(jobWantList,wantJob);
               hjcArr.shuffle(positions);
               var position = positions[0];
               hjcArr.deleteValue(jobAppList,wantJob);
               jobList[position] = wantJob;
               alreadyAllct.push(position);
           }
       }
   };
    //再分配剩下的职业
   var restAlloctNum = ttlNum - alreadyAllct.length;
   for(var i = jobAppList.length; i<=restAlloctNum;i++){
        jobAppList.push(0);
   }
   hjcArr.shuffle(jobAppList);
   var next = 0;
   for(var i = 0;i<ttlNum;i++){
       if(jobList[i]==null){
           jobList[i] = jobAppList[next];
           next ++;
       }
   }
}
//分配阵营
function toAllctNum(){
    if(minGstNum == maxGstNum){
        gstNum = minGstNum;
    }else{
        gstNum = basicUtils.randomInt(minGstNum,maxGstNum);
    }
    hmnNum = ttlNum - gstNum - alnNum;
    partyList = hjcArr.fill(hmnNum,GameInfo.PartyInfo.HMN).concat(hjcArr.fill(gstNum,GameInfo.PartyInfo.GST));
    hjcArr.shuffle(partyList);
    if(alnNum === 1){
        partyList = partyList.concat([GameInfo.PartyInfo.THD]);
        var tempArr = hjcArr.positions(jobList,GameInfo.JobInfo.getJobId("aln"));
        var alnPosition = tempArr[0];
        hjcArr.swap(partyList,alnPosition,partyList.length-1);
    }
}


//for test
//var data = new ai(12,[1,2,3,4,5,6,7,8],[1,2,3],[0,0,0,0,0,0,4,4,4,4,7,9]);
//getAllocRes(data);
//console.log(partyList);
//console.log(jobList);
