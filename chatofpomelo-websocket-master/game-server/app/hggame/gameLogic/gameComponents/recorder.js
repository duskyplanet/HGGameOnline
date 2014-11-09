var hjcArr = require("../../../HJCUtils/HJCArray");
var basicUtils =  require("../../../HJCUtils/basicUtils");
var msgTranslator = require("../../gameManagers/msgManager/msgTranslator");
var ColorHelper = require("../../basicGameInfo/ColorHelper");
var GameInfo = require("../../basicGameInfo/GameInfo");

exports.Recorder = function Recorder(game){
    var self = this;
    this.game = game;
    this.gameDetail="";
    this.gameHtml="";

    this.getWatcherData = function(){

    };
    this.getLosterData = function(){

    };
    this.getGameDetail = function(){
        return self.gameDetail;
    };
    this.getGameDetailByColorHtml = function(){
        return self.gameHtml;
    };
    this.wordsInfo = function(){
        var words = self.game.runningInfo.words;
        self.gameDetail+="人阵营获词："+words.hmnWord;
        self.gameDetail+="\n"+"鬼阵营获词："+words.gstWord;
        self.gameDetail+="\n"+"先机提示（若有）："+words.alnWord;
        self.gameHtml+="<br/>"+ColorHelper.colorHtml("#00ff00","人阵营获词：")+ColorHelper.colorHtml(ColorHelper.getColorByPartyId(GameInfo.PartyInfo.HMN),words.hmnWord);
        self.gameHtml+="<br/>"+ColorHelper.colorHtml("#00ff00","鬼阵营获词：")+ColorHelper.colorHtml(ColorHelper.getColorByPartyId(GameInfo.PartyInfo.GST),words.gstWord);
        self.gameHtml+="<br/>"+ColorHelper.colorHtml("#00ff00","先机提示（若有）：")+ColorHelper.colorHtml(ColorHelper.getColorByPartyId(GameInfo.PartyInfo.THD),words.alnWord);
    };
    this.add = function(type,content){
        switch(type){
            case "allocate":{
                self.wordsInfo();
                self.gameDetail += "\n"+"======阵营和职业分配======";
                self.gameHtml +="<br/>"+ "<p text-align='center'><font color='#00ff00' size='40'>=========阵营和职业分配=========</font></p><br/>";
                var playerList = self.game.runningInfo.plyrList;
                for(var i = 0; i < playerList.length; i++){
                    var thisPlayer = playerList[i];
                    self.gameDetail+= "\n"+ thisPlayer.myPosition+"号（"+thisPlayer.myNick+")"+ "  "+ GameInfo.PartyInfo.getPartyNameByNum(thisPlayer.myParty)+"  "+ GameInfo.JobInfo.getJobNameById(thisPlayer.myJob);
                    self.gameHtml+= "<br/>" + thisPlayer.myPosition+"号（"+ColorHelper.colorHtml("#00ffff",thisPlayer.myNick)+"）  "+ColorHelper.colorHtml(ColorHelper.getColorByPartyId(thisPlayer.myParty),GameInfo.PartyInfo.getPartyNameByNum(thisPlayer.myParty))+"  "+ColorHelper.colorHtml(ColorHelper.getColorByJobId(thisPlayer.myJob),GameInfo.JobInfo.getJobNameById(thisPlayer.myJob));
                }
                self.gameDetail+="\n"+"=========游戏开始=========";
                self.gameHtml+="<br/>"+ "<p text-align='center'><font color='#00ff00' size='40'>===========游戏开始===========</font></p>";
            }break;
            case "beforeGame":{
               if(content.job==="spy"){
                   playerList = self.game.runningInfo.plyrList;
                   for(i = 0; i < playerList.length; i++){
                       thisPlayer = playerList[i];
                       if(thisPlayer.myJob === GameInfo.JobInfo.getJobId("spy")){
                           self.gameDetail+="\n"+thisPlayer.myPosition+"号"+thisPlayer.secSkl.info.str;
                           self.gameHtml+="<br/>"+ thisPlayer.myPosition+"号"+thisPlayer.secSkl.info.html;
                       }
                    }
               }else if(content.job==="aln"){
                   var aln = content.srcPlayer;
                   self.gameDetail+="\n"+aln.myPosition+"号"+aln.secSkl.info.str;
                   self.gameHtml+="<br/>"+ aln.myPosition+"号"+aln.secSkl.info.html;
               }
            }break;
            case "dayCome":{
                self.gameDetail+="\n"+"-------第"+content+"个白天-------";
                self.gameHtml+="<br/>"+ "<p text-align='center'>"+ColorHelper.colorHtml(ColorHelper.COLORS.DAY_COME,"------------[第"+content+"个白天]------------")+"</p>";
                if(content===1){
                    self.gameDetail+="\n"+"无公决阶段直接进入黑夜...";
                    self.gameHtml+="<br/>"+ "无公决阶段直接进入黑夜...";
                }
            }break;
            case "nightCome":{
                self.gameDetail+="\n"+"-------第"+content+"个黑夜-------";
                self.gameHtml+="<br/>"+ "<p text-align='center'>"+ColorHelper.colorHtml(ColorHelper.COLORS.NGT_COME,"------------[第"+content+"个黑夜]------------")+"</p>";
            }break;
            case "nightMove":{
                self.gameDetail+="\n"+"黑夜行动：\n"+content.ngtMoveStr;
                self.gameHtml+="<br/>"+"黑夜行动："+"<br/>"+content.ngtMoveHtml;
            }break;
            case "nightRes":{
                self.gameDetail+="\n"+"黑夜结果：\n"+content.str;
                self.gameHtml+="<br/>"+"黑夜结果："+"<br/>"+content.html;
            }break;
            case "voteRes":{
                var perid = content.isPK?"PK":"投票";
                if(content.type===0){
                    var isEnd = content.isEnd;
                    var nextLoop = isEnd?"结束":"直接进入黑夜...";
                    self.gameDetail+="\n"+ perid+"结果：\n所有玩家弃票，游戏"+nextLoop;
                    self.gameHtml+="<br/>"+perid+"结果："+"<br/>"+"所有玩家弃票，游戏"+nextLoop;
                }else if(content.type===1){
                    self.gameDetail+="\n"+ perid+"唱票：\n"+content.str+"\n"+content.outer+"号被公决出局...";
                    self.gameHtml+="<br/>"+perid+"唱票："+"<br/>"+content.html+"<br/>"+content.outer+"号被公决出局...";
                }else if(content.type===2){
                    var infoStr = content.isPK?"再次平票，平安日无人被公决...":"平票，进入PK...";
                    self.gameDetail+="\n"+ perid+"唱票：\n"+content.str+"\n"+content.evens+infoStr;
                    self.gameHtml+="<br/>"+perid+"唱票："+"<br/>"+content.html+"<br/>"+content.evens+infoStr;
                }
            }break;
            case "shootTo":{
                var srcPos = content.srcPos;
                var tarPos = content.tarPos;
                if(tarPos===undefined){
                    self.gameDetail+="\n"+srcPos+"号[放弃开枪]";
                    self.gameHtml+="<br/>"+srcPos+"号"+ColorHelper.colorHtml("#ffffff","[放弃开枪]");
                }else{
                    self.gameDetail+="\n"+srcPos+"号--[带走]-->"+tarPos+"号";
                    self.gameHtml+="<br/>"+srcPos+"号"+ColorHelper.colorHtml("#ffffff","--[带走]-->")+tarPos+"号";
                }
            }break;
            case "end":{
                self.gameDetail+="\n"+content;
                self.gameHtml+="<br/><p text-align='center'><font color='#ff0000' size='40'>"+content+"</font></p>";
            }break;
            default :console.log("发现不存在的游戏记录情况："+type);
        }
    }
};