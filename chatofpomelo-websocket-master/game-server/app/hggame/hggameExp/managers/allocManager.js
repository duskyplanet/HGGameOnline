var basicUtils = require("../utils/basicUtils");
var hjcArr = require("../utils/HJCArray");

var GameInfo = require(".././GameInfo").GameInfo;
var JobInfo = require(".././JobInfo").JobInfo;
var PartyInfo = require(".././PartyInfo").PartyInfo;

var modeMgr = require("./modeManager");
var SlctData = require("../runningData/slctData").SlctData;

var ttlNum;
var minGstNum;
var maxGstNum;
var jobMode;
var jobAppList;

var hmnNum;
var gstNum;
var alnNum;
var partyList;
var jobList;

exports.getAllocRes = getAllocRes;
var getAllocRes = function(_slctData){
    ttlNum =  _slctData.slctNum[0];
    minGstNum =  _slctData.slctNum[1];
    maxGstNum =  _slctData.slctNum[2];
    jobMode = _slctData.jobMode;
    if(basicUtils.isEmpty(jobMode)){
        jobAppList = _slctData.jobAppList;
    }else{
        jobAppList = modeMgr.getModeAllct(jobMode);
    }
    valiCheck();
    toAllctJob();
    toAllctNum();
console.log(jobList);
console.log(hmnNum);
console.log(gstNum);
console.log(alnNum);
console.log(partyList);
}

function valiCheck(){
    if(!basicUtils.isNumeric(ttlNum)||ttlNum>GameInfo.MaxTtlNum||ttlNum<GameInfo.MinTtlNum){
        throw new Error("allocManager:错误分配人数");
    }
    if(!basicUtils.isNumeric(minGstNum)||!basicUtils.isNumeric(maxGstNum)||maxGstNum<minGstNum){
        throw new Error("allocManager:错误分配人数");
    }
}

function toAllctJob(){
    var mustTP = [];
    var rdmTP = [];
    jobList = hjcArr.fill(ttlNum,null);
    for(var i = 0; i < jobAppList.length; i++){
        if(jobAppList[i]==modeMgr.FORB) continue;
        else if(jobAppList[i]==modeMgr.RNDM) rdmTP.push(i);
        else mustTP.push(i);
    }
    jobList.splice(0,mustTP.length);
    jobList = jobList.concat(mustTP);
    var restNum = ttlNum - mustTP.length;
    for(var i = 0; i < rdmTP.length;i++ ){
        if(restNum <= 0) break;
        if(Math.random()>=0.5){
            jobList[jobList.indexOf(null)] = rdmTP[i];
            restNum--;
            continue;
        }
    }
    alnNum = hjcArr.exist(jobList,JobInfo.getJobId("aln"))?1:0;
    hjcArr.replace(jobList,null,0);
    hjcArr.shuffle(jobList);
}

function toAllctNum(){
    if(minGstNum == maxGstNum){
        gstNum = minGstNum;
    }else{
        gstNum = basicUtils.randomInt(minGstNum,maxGstNum);
    }
    hmnNum = ttlNum - gstNum - alnNum;
    partyList = hjcArr.fill(hmnNum,PartyInfo.HMN).concat(hjcArr.fill(gstNum,PartyInfo.GST));
    if(alnNum == 1) partyList[partyList.length] = PartyInfo.THD;
    hjcArr.shuffle(partyList);
}

var sD = new SlctData([15,4,6],[0,1,1,1,2,2]);
getAllocRes(sD);