/**
 * Created by Administrator on 2014/7/1.
 */
var JobInfo = require(".././JobInfo").JobInfo;
var GameInfo = require(".././GameInfo").GameInfo;

exports.SlctData = function(_slctNum,_jobAppList,_jobMode,_chsMode,_chsList,_scoreMode){
    //玩家总人数
    this.slctNum = _slctNum;
    this.jobMode = _jobMode;                    //职业模式
    this.jobAppList = _jobAppList;             //上场职业列表
    this.chsMode = _chsMode;                   //开启竞选职业模式
    this.chsList = _chsList;                   //竞选职业列表
    this.scoreMode = _scoreMode;               //积分模式
}