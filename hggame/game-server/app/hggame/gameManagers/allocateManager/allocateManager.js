gb = require("../../global").global;

var CONSTANT = {
    NOT_EXIST:0,
    RANDOM:1,
    FORCE_TURN_UP:2,
    MULTI_JOB_CHANCE:0.7
};

//分配结果
var ttlNum = 0;                 //总人数
var hmnNum = 0;                 //人的数量
var gstNum = 0;                 //鬼的数量
var alnNum = 0;                 //外星人数量（0 or 1）
var alnPos = 0;                 //如果有外星人，外星人的位置
var wwfNum = 0;                 //狼族数量
var wantJobs =[];               //本局游戏在“可以上场的前提下被申请的职业”的列表（是没有重复的）
var jobAppList = [];             //最终能上场的职业(还有所有职业Id)（不包含外星人和狼人）
var jobList =[];                 //最终获得职业（长度=玩家数）
var partyList=[];              //最终阵营分配（长度=玩家数）

exports.getAllocateResult = getAllocateResult;
function getAllocateResult(params){
    //step1:参数合法性检查\
    if(!validCheck(params)) return;
    //step2:决定外星人和狼人是否上场
    var alnExist = false;
    var wwfExist = false;
    if(params.ttlNum === 7){
        if(params.alnType === CONSTANT.FORCE_TURN_UP){
            alnExist = true;
        }else if(params.wwfType === CONSTANT.FORCE_TURN_UP){
            wwfExist = true;
        }else if(params.alnType === CONSTANT.RANDOM){
            if(params.wwfType === CONSTANT.RANDOM){
                if(Math.random() > 0.5){
                    alnExist = true;
                }else{
                    wwfExist = true;
                }
            }else{
                if(Math.random() > 0.5){
                    alnExist = true;
                }
            }
        }else if(params.wwfType === CONSTANT.RANDOM){
            if(Math.random() > 0.5){
                wwfExist = true;
            }
        }
    }else if(params.ttlNum != 6){
        if(params.alnType === CONSTANT.FORCE_TURN_UP){
            alnExist = true;
        }else if(params.alnType === CONSTANT.RANDOM){
            if(Math.random() > 0.5){
                alnExist = true;
            }
        }
        if(params.wwfType === CONSTANT.FORCE_TURN_UP){
            wwfExist = true;
        }else if(params.wwfType === CONSTANT.RANDOM){
            if(Math.random() > 0.5){
                wwfExist = true;
            }
        }
    }
    //step3：阵营数量分配
    decidePartyNum(params,alnExist,wwfExist);
    //step4：分配职业
    allocateJobs(params);
    //step5：分配阵营
    allocateParties();
    //step6：返回分配结果
    return{
        ttlNum:ttlNum,
        hmnNum:hmnNum,
        gstNum:gstNum,
        alnNum:alnNum,
        alnPos:alnPos,
        wwfNum:wwfNum,
        partyList:partyList,
        jobList:jobList
    }
}
//参数合法性检查
function validCheck(params){
    if(!(typeof  params.ttlNum === "number") || params.ttlNum < 6 || params.ttlNum > 24){
        console.log("Allocate错误：游戏总人数不合法...");return false;
    }
    if(!(typeof  params.alnType === "number") || (( params.alnType!= CONSTANT.NOT_EXIST) && (params.alnType!= CONSTANT.RANDOM ) && (params.alnType!=CONSTANT.FORCE_TURN_UP))){
        console.log("Allocate错误：外星人上场方式不合法...");return false;
    }
    if(!(typeof  params.wwfType === "number") || (( params.wwfType!= CONSTANT.NOT_EXIST ) && (params.wwfType!= CONSTANT.RANDOM ) && (params.wwfType!=CONSTANT.FORCE_TURN_UP))){
        console.log("Allocate错误：狼族上场方式不合法...");return false;
    }
    if(!(Array.isArray(params.jobTurnUpList) && Array.isArray(params.jobForcedList) && Array.isArray(params.jobWantList))){
        console.log("Allocate错误：上场队列参数不合法...");return false;
    }
    if(params.ttlNum === 6 && (params.alnType === CONSTANT.FORCE_TURN_UP || params.wwfType === CONSTANT.FORCE_TURN_UP)){
        console.log("Allocate错误：6人时外星人和狼人不可强制上场...");return false;
    }
    if(params.ttlNum === 7 && (params.alnType === CONSTANT.FORCE_TURN_UP && params.wwfType === CONSTANT.FORCE_TURN_UP)){
        console.log("Allocate错误：7人时外星人和狼人不可同时强制上场...");return false;
    }
    for(var i = 0; i< params.jobWantList.length;i++){
        var thisJob = params.jobWantList[i];
        if(gb.utils.hjcArr.exist(params.jobTurnUpList, thisJob) === false) continue;
        if(gb.utils.hjcArr.exist(wantJobs,thisJob) === false){
            wantJobs.push(thisJob);
        }
    }
    return true;
}
//阵营数量分配
function decidePartyNum(params,alnExist,wwfExist){
    ttlNum = params.ttlNum;
    var restNum = ttlNum;
    if(alnExist){
        restNum --;
        alnNum = 1;
    }
    if(wwfExist){
        if(restNum <= 8){
            wwfNum = 1;
        }else if(restNum <= 12){
            wwfNum = 2;
        }else if(restNum <= 19){
            wwfNum = 3;
        }else if(restNum >= 20){
            wwfNum  = 4;
        }else{
            console.log("Allocate错误：可上场狼族人数不合法...");
        }
        restNum -= wwfNum;
    }
    if(restNum == 6 || restNum == 7){
        gstNum = 2;
    }else if(restNum == 8 || restNum == 9){
        gstNum = 3;
    }else if(restNum == 10 || restNum == 11 || restNum == 12){
        gstNum = 4;
    }else if(restNum == 13 || restNum == 14){
        gstNum = 5;
    }else if(restNum == 15 || restNum == 16){
        gstNum = 6;
    }else if(restNum == 17 || restNum == 18 || restNum == 19){
        gstNum = 7;
    }else if(restNum == 20 || restNum == 21){
        gstNum = 8;
    }else if(restNum == 22 || restNum == 23 || restNum ==24){
        gstNum = 9;
    }else{
        console.log("Allocate错误：剩余可分配人数不合法...");
    }
    hmnNum = restNum - gstNum;
}
//分配职业
function allocateJobs(params){
    var randomTurnUpJobs = [];  //这两个队列无交集，不重复，但是还不是最终的结果
    var mustTurnUpJobs = [];    //这两个队列无交集，不重复，但是还不是最终的结果
    jobList = gb.utils.hjcArr.fill(ttlNum,null);
    //首先区分哪些职业必须被分配，哪些随机分配（这些都不包含狼人和外星人）
    for(var i = 0; i<params.jobTurnUpList.length; i++){
        var thisJob = params.jobTurnUpList[i];
        if(gb.utils.hjcArr.exist(params.jobForcedList,thisJob)){
            mustTurnUpJobs.push(thisJob);
        }else{
            if(gb.utils.hjcArr.exist(wantJobs,thisJob) && !gb.utils.hjcArr.exist(params.jobForcedList,thisJob)){
                mustTurnUpJobs.push(thisJob);
            }else{
                randomTurnUpJobs.push(thisJob);
            }
        }
    }
    //然后决定上场职业表
    if(mustTurnUpJobs.length >= ttlNum){
        jobAppList = mustTurnUpJobs.splice(0,ttlNum);
    }else{
        jobAppList = [].concat(mustTurnUpJobs);
        gb.utils.hjcArr.shuffle(randomTurnUpJobs);
        var restNumber = (gstNum + hmnNum) - mustTurnUpJobs.length;
        var nextRandom = 0;
        for(i = 0 ; i < restNumber; i++){
            if(nextRandom+1 >= randomTurnUpJobs.length) break;
            else{
                if(Math.random() >= 0.5 ){
                    jobAppList.push(randomTurnUpJobs[nextRandom]);
                    nextRandom++;
                }
            }
        }
    }
    //在竞选模式下，需要将外星人和狼人的位置预留
    if(wantJobs.length > 0){
        preNumForAlnAndWwf(params,(wwfNum+alnNum));
    }
    //提前分配被竞选的职业
    if(params.singleJob === true){
        //单职业模式下
        for(i = 0;i<wantJobs.length;i++){
            var wantJob = wantJobs[i];
            if(gb.utils.hjcArr.exist(jobAppList,wantJob)){
                //所有参选者
                var positions = gb.utils.hjcArr.positions(params.jobWantList,wantJob);
                gb.utils.hjcArr.shuffle(positions);
                var position = positions[0];
                gb.utils. hjcArr.deleteValue(jobAppList,wantJob);
                jobList[position] = wantJob;
            }
        }
    }else{
        //多职业模式下
        for(i = 0;i<wantJobs.length;i++){
            wantJob = wantJobs[i];
            if(gb.utils.hjcArr.exist(jobAppList,wantJob)){
                //所有参选者
                positions = gb.utils.hjcArr.positions(params.jobWantList,wantJob);
                gb.utils. hjcArr.deleteValue(jobAppList,wantJob);
                //必须单职业
                if(singleJobCheck(wantJob)){
                    gb.utils.hjcArr.shuffle(positions);
                    position = positions[0];
                    jobList[position] = wantJob;
                }else{
                    for(i = 0; i<positions.length; i++){
                        jobList[positions[i]] = wantJob;
                    }
                }
            }
        }
    }
    //在分配剩余职业
    var nulls = gb.utils.hjcArr.positions(jobList,null);
    gb.utils.hjcArr.shuffle(nulls);
    var nextNull = 0;
    for(i=0;i<jobAppList.length;i++){
        if(nextNull+1 >= nulls.length) break;
        jobList[nulls[nextNull]] = jobAppList[i];
        nextNull++;
    }
    //分配外星人职业
    if(alnNum === 1){
        jobList[nulls[nextNull]] = gb.GameInfo.JobInfo.getJobId("aln");
        alnPos = nulls[nextNull];
        nextNull++;
    }
    //分配狼人职业
    for(i=0;i<wwfNum;i++){
        jobList[nulls[nextNull]] = gb.GameInfo.JobInfo.getJobId("wwf");
        nextNull++;
    }
    //多职业模式下即使没有选职模式也可能出现多职业
    if(params.singleJob === false && params.jobTurnUpList.length > 0){
        nulls = gb.utils.hjcArr.positions(jobList,null);
        var canTurnUpJobs = [].concat(params.jobTurnUpList);
        for(i=0;i<nulls.length;i++){
            var chance = Math.random();
            if(chance > CONSTANT.MULTI_JOB_CHANCE){
                gb.utils.hjcArr.shuffle(canTurnUpJobs);
                var jobId = canTurnUpJobs[0];
                if(singleJobCheck(jobId)) continue;
                jobList[nulls[i]] =jobId;
            }
        }
    }
    //分配无职业
    nulls = gb.utils.hjcArr.positions(jobList,null);
    for(i=0;i<nulls.length;i++){
        jobList[nulls[i]] =gb.GameInfo.JobInfo.getJobId("njb");
    }
}
//分配阵营
function allocateParties(){
    partyList = gb.utils.hjcArr.fill(ttlNum,null);
    var jobInfo = gb.GameInfo.JobInfo;
    var restGstNum = gstNum;
    var restHmnNum = hmnNum;
    for(var i = 0; i < jobList.length; i++){
        if(jobList[i] === jobInfo.getJobId("aln")){
            partyList[i] = gb.GameInfo.PartyInfo.THD;
        }else if(jobList[i] ===   jobInfo.getJobId("wwf")){
            partyList[i] = gb.GameInfo.PartyInfo.FTH;
        }else if(jobList[i] ===   jobInfo.getJobId("sfz") || jobList[i] ===   jobInfo.getJobId("agl") || jobList[i] ===   jobInfo.getJobId("psr")){
            partyList[i] = gb.GameInfo.PartyInfo.HMN;
            restGstNum--;
        }else if(jobList[i] ===   jobInfo.getJobId("grl") || jobList[i] ===   jobInfo.getJobId("dmn")){
            partyList[i] = gb.GameInfo.PartyInfo.GST;
            restHmnNum--;
        }
    }
    var nulls = gb.utils.hjcArr.positions(partyList,null);
    gb.utils.hjcArr.shuffle(nulls);
    var nextPos = 0;
    for(i = 0; i < restGstNum; i++){
        partyList[nulls[nextPos]] = gb.GameInfo.PartyInfo.GST;
        nextPos++;
    }
    for(i = 0; i < restHmnNum; i++){
        partyList[nulls[nextPos]] = gb.GameInfo.PartyInfo.HMN;
        nextPos++;
    }
}
//为多重职业模式下预留外星人和狼族的位置
function preNumForAlnAndWwf(params,preNum){
    if(preNum > 0){
        var notWantPosNum = 0;
        for(var i = 0; i < params.ttlNum; i++){
            if(typeof  params.jobWantList[i] !== "number"){
                notWantPosNum++;
            }
        }
        var setNullNum = preNum - notWantPosNum;
        if(setNullNum > 0){
            var tempWantList = [].concat(params.jobWantList);
            var positions = gb.utils.hjcArr.shuffle(gb.utils.hjcArr.positionsNot(tempWantList,null));
            for(i = 0; i < setNullNum;i++){
                params.jobWantList[positions[i]] = null;
            }
        }
    }
}

exports.singleJobCheck = singleJobCheck;
function singleJobCheck(jobId){
    var jobInfo = gb.GameInfo.JobInfo;
    return(jobId ===   jobInfo.getJobId("sfz") || jobId===   jobInfo.getJobId("agl") || jobId ===   jobInfo.getJobId("psr")|| jobId===   jobInfo.getJobId("dmn") || jobId ===   jobInfo.getJobId("grl"))
}

exports.allocatePrinter = allocatePrinter;
function allocatePrinter(allocateRes){
    console.log("==========数量分配结果==========");
    console.log("总共"+allocateRes.ttlNum+"名玩家：人类（"+allocateRes.hmnNum+"）、鬼（"+allocateRes.gstNum+"）、外域（"+allocateRes.alnNum+"）、狼族（"+allocateRes.wwfNum+"）...");
    console.log("========阵营/职业分配结果=======");
    for(var i = 0; i < allocateRes.ttlNum; i++){
        console.log((i+1)+"号（"+gb.GameInfo.PartyInfo.getPartyNameByNum(allocateRes.partyList[i])+"-"+gb.GameInfo.JobInfo.getJobNameById(allocateRes.jobList[i])+"）");
    }
}

