var basicUtils = require("../utils/basicUtils");
var hjcArr = require("../utils/HJCArray");

var GameInfo = require(".././GameInfo").GameInfo;
var JobInfo = require(".././JobInfo").JobInfo;

var FORB = 0;
var RNDM = 1;
var TNUP = 2;
exports.FORB = FORB;
exports.RNDM = RNDM;
exports.TNUP = TNUP;


exports.getModeAllct = function(_jobMode){
    if(_jobMode=="standerd"){
        return hjcArr.fill(6,RNDM,JobInfo.getJobTtlNum(),FORB);
    }
    throw new Error("modeManager:不存在的职业模式");
}