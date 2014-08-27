var alloctManager = require("../gameManagers/alloctManager/alloctManager");
var wordsManager = require("../gameManagers/wordsManager/wordsManager");
var calcManager = require("../gameManagers/calcManager/calcManager");
var jumpDayChecker = require("../gameManagers/calcManager/jumpDayChecker").jumpDayChecker;
var nightCalc = require("../gameManagers/calcManager/nightCalc").calc;
var voteCalc = require("../gameManagers/calcManager/voteCalc").calc;
var alloctInfo = require("../gameManagers/alloctManager/alloctInfo").alloctInfo;
var GameInfo = require("../basicGameInfo/GameInfo");
var basicUtils =  require("../../HJCUtils/basicUtils");
var Player = require("./player").player;
//var PlayerInfo = require("./player").info;
var hjcArr = require("../../HJCUtils/HJCArray");
//组件
var Sender = require("./gameComponents/sender").Sender;
var Receiver = require("./gameComponents/receiver").Receiver;
var nightFlesher = require("./gameComponents/flesher").nightFlesh;

exports.Game = Game;
function Game(roomInfo,pusher){
    var self = this;
    this.pusher = pusher;
    //初始data
    this.initInfo = {
        rid:roomInfo.rid,
        rMode:roomInfo.rmode,
        readyList:roomInfo.readyList.list,          //饱和数组(带首null)，准备的玩家位置为true
        userNickList:roomInfo.userList.getNickList(),   //饱和数组(带首null)，存在玩家的位置有nick
        speakTime:roomInfo.advanced.speakTime,      //时间相关
        saveTime:roomInfo.advanced.saveTime,        //时间相关
        gameMode:roomInfo.advanced.gameMode,        //游戏模式 0：文字-文字 1：图片-文字 2：文字-语音 3：图片-语音
        jobWant:roomInfo.advanced.jobWant,          //true 开启职业竞选
        wantList:roomInfo.advanced.wantList,        //饱和数组，选职列表
        wordMode:roomInfo.advanced.wordMode,        //选词模式
        wordChooseArr:roomInfo.advanced.wordChooseArr,  //选词子模式
        picMode:roomInfo.advanced.picMode,
        timers:{                                    //游戏基础时间配置
            gap:3,                                      //环节承接时间：默认3秒
            ani:5,                                      //黑夜和白天的动画效果时间
            shootTime:8,                                //开枪时间：默认30.2秒
            nextTurn:3,                                //发言轮询间隔：默认30秒
            voteTime:10,                                //投票时间：默认20秒
            PKTime:5,                                   //PK发言时间：默认45秒
            LstWdTime:5,                                //遗言时间：默认30秒
            nightTime:5,                                //黑夜时间：默认30秒
            defaultSpeak:9,                             //发言时间：默认90秒（为nextTurn的3陪）
            defaultSave:3,                             //预留时间：开始默认30秒（为nextTurn的1陪）
            tick:0.2,
            tickNum:1/this.tick
        }
    };
    //游戏运行时数据:
    this.runningInfo = {
        plyrList : [],          //不饱和数组，运行时玩家列表
        ttlPlyrNum: 0,          //本轮参与玩家数量                                                         →[initArrays中初始化]
        timeInfo:{              //时间信息
            perid:1,
            num:1,
            leftEvenStep:4,
            PERID:{
                SPEAK:1,
                VOTE:2,
                NIGHT:3,
                SHOOT:4,
                PK_SPEAK:5,
                END:10,
            }
        },
        words:{},               //本轮游戏分配词语                                                         →[allocate中初始化]
        quickArr:{              //不饱和数组，快速访问表
            nickList:[],            //按照id的【只读】：昵称列表（id为玩家在游戏内存数组中的下标）         →[initArrays中初始化]
            positionList:[],        //按照id的【只读】: position列表（position为玩家在游戏中的实际位置）   →[initArrays中初始化]
            partyList:[],           //按照id的【只读】: 阵营列表                                           →[allocate中初始化]
            jobList:[],             //按照id的【只读】: 职业列表                                           →[allocate中初始化]
            jobExistList:[],        //按照职业号寻找对应的id玩家【只读】：二维数组                         →[allocate中初始化]
            survivals:[],            //玩家存活列表                                                        →[initArrays中初始化]
            survHmnNum:0,
            survGstNum:0,
            survAlnNum:0
        },
        fleshArr:{              //动态表，每个环节都要刷新
            lastNgtDeads:[],        //上个夜晚的死者
            lastNgtCanShoters:[],   //上个夜晚的死者中可以开枪遗言者(lastNgtDeads子集)
            lastNgtFrbSpkrs:[],     //这个白天中不能发言者（survivals子集）
            thisNightSkillBuffer:[], //这个夜晚的技能列表                                                 →[initArrays中初始化]
            thisDayCanSpkrs:[],     //这个白天中可以发言者（survivals子集）
            speakMaxTime:[],        //默认加预留，玩家能够用的最长时间（过了默认阶段，该值不能由玩家从外界控制）
            saveTimes:[],           //按照id排列的预留发言时间的数组                                       →[initArrays中初始化]
            saveAuto:[]             //按照id排列的是否自动启动预留时间的数组                               →[initArrays中初始化]
        },
        listenArr:{             //流程相关监听队列
            speakOverArr:[],        //这个白天玩家是否发言结束队列(由玩家外部请求)
            shootToArr:[] ,         //开枪玩家行动队列
            voteToArr:[],            //投票队列
            nextPKOver:false       //下一位PK发言结束
        },
        loopFlag:{               //大循环：A:ngt黑夜--->B:sht开枪(jmpSht?)--->C:spk发言(jmpSpk?jmpDay?)--->D:vot投票(jmpVot?)--->ngt黑夜
            jmpSht:false,        //跳过开枪//1、第一个白天；2、当夜无死者，或者有死者但其中没有能够开枪遗言者------>直接进入发言
            jmpSpk:false,        //跳过发言//极小概率事件：白天存活玩家全部被禁言------->直接进入投票
            jmpVot:false,         //跳过投票//1、第一个白天；2、大主教成功发动审判；3、祈福者成功发动祈福；-------->直接进入黑夜
            jmpDay:false         //跳过白天==跳过发言和投票//当白天只剩下两名玩家（游戏没有结束），且其中无人有未发动且能发动的：权威、审判、急救：------>跳过发言和投票进入黑夜
        },
        dayEvent:{              //白天环节控制事件
            dayStop:false,          //跳过白天环节
            fstAid:false,           //急救发动
            fstAidId:0,
            judge:false,             //审判发动
            trigAuth:false,         //权威发动
            authId:0,
            trigBless:false         //[祈福]发动
        }
    };
    //步骤一：初始化基本数组
    this.initArrays = function(){
        var userNickList = self.initInfo.userNickList;
        var readyList = self.initInfo.readyList;
        for(var i = 0;i<readyList.length;i++){
            if(readyList[i]===true){
                self.runningInfo.quickArr.nickList.push(userNickList[i]);
                self.runningInfo.quickArr.survivals.push(i);
                self.runningInfo.ttlPlyrNum++;
                self.runningInfo.quickArr.positionList.push(i);
                self.runningInfo.fleshArr.saveAuto.push(false);
                self.runningInfo.fleshArr.thisDayCanSpkrs.push(i);
                self.runningInfo.fleshArr.thisNightSkillBuffer.push(null);
                self.runningInfo.fleshArr.saveTimes.push(self.initInfo.timers.defaultSave);
            }
        }
    };
    //步骤二：分配阵营、词汇、职业
    this.allocate = function(){
        //基本局测试执行：[][][]为测试
        var initAlloctData = new alloctInfo(self.runningInfo.ttlPlyrNum,[],[],[]);
        var initAlloctRes = alloctManager.getAllocRes(initAlloctData);
        var initWordsRes = wordsManager.getWordsWithoutArgs();
//initAlloctRes.partyList = [1,1,1,1,1,1,1,2,2,2,2];
        self.runningInfo.quickArr.jobList = initAlloctRes.jobList;
        self.runningInfo.quickArr.partyList = initAlloctRes.partyList;
        self.runningInfo.quickArr.survHmnNum = initAlloctRes.HmnNum;
        self.runningInfo.quickArr.survGstNum = initAlloctRes.GstNum;
        self.runningInfo.quickArr.survAlnNum = initAlloctRes.alnNum;
//self.runningInfo.quickArr.survHmnNum = 7;
//self.runningInfo.quickArr.survGstNum = 4;
//self.runningInfo.quickArr.survAlnNum = 0;
        self.runningInfo.words = initWordsRes;
        var jobExistArr = new Array(GameInfo.JobInfo.getJobTtlNum());
        for(var i = 0;i<initAlloctRes.jobList.length;i++){
           if(basicUtils.isEmpty(jobExistArr[initAlloctRes.jobList[i]])){
               jobExistArr[initAlloctRes.jobList[i]] = [initAlloctRes.jobList[i]];
           }else{
               jobExistArr[initAlloctRes.jobList[i]].push(i);
           }
        }
        self.runningInfo.quickArr.jobExistList = jobExistArr;
        return initAlloctRes;
    };
    //步骤三：为玩家列表填充属性
    this.initPlyrListContent = function(initAlloctRes){
        for(var i = 0;i<self.runningInfo.ttlPlyrNum;i++){
            //测试用：if(i>=1){return;}
            var myJob = initAlloctRes.jobList[i];
            var myParty = initAlloctRes.partyList[i];
            //测试用：console.log(myJob+":"+myParty);
            self.runningInfo.plyrList[i] = new Player(self,myJob,myParty,i);
        }
    };

    //快速工具方法：
    this.quickQuery = {
        //1、工具方法：从玩家id获得position
        getPositionById : function(id){
            return self.runningInfo.quickArr.positionList[id];
        },
        //2、工具方法：从玩家position获得id
        getIdByPosition:function(position){
            var positionList = self.runningInfo.quickArr.positionList;
            for(var i = 0;i<positionList.length;i++){
                if(position === positionList[i]){
                    return i;
                }
            }
            console.log("game发生致命逻辑错误：找不到position对应的id");
        },
        //3、工具方法：从玩家id获得nick
        getNickById:function(id){
           return self.runningInfo.quickArr.nickList[id];
        },
        //4、工具方法：从玩家nick获得id
        getIdByNick : function(nick){
            var nickList = self.runningInfo.quickArr.nickList;
            for(var i = 0;i<nickList.length;i++){
                if(nickList[i]===nick){
                   return i;
                }
            }
            console.log("game发生致命逻辑错误：找不到id对应的昵称");
        }
    };

    this.sender = new Sender(self);

    //游戏逻辑推送执行:各种推送消息
    this.pushers ={
        //1、推送id消息

        //2、推送Day消息
        dayMsg:function(self){
            var route = "onDayCome";
            self.send(route,msgTranslator.dayComeMsg(self));
        },
        //3、推送下一个发言者turn到来消息
        speakTurn:function(speakerId){
            var route = "onSpeakTurn";
            self.send(route,msgtranslator.speakTurn(speakerId),self.runningInfo.quickArr.servivals);
        }
    };

    //游戏逻辑计算执行：初始化游戏玩家运行时数据

    this.runGame = function(){
        //步骤一：初始化基本数组
        self.initArrays();
        //步骤二：分配阵营、词汇、职业
        var initAlloctRes = self.allocate();
        //步骤三：为玩家列表填充属性
        self.initPlyrListContent(initAlloctRes);
        //步骤四：5秒后向玩家推送身份和职业信息
        setTimeout(function(){
            console.log("发送玩家词汇和职业....");
            //self.pushers.idMsg(initAlloctRes,self.runningInfo.words);
        },5000);
        self.loopers.voteLoop();
//        return;
//        self.loopers.nightLoop(false);
//        return;
//        console.log("测试(push所有玩家)：身份信息，10秒等待...");
        //步骤五:11秒后进入逻辑大循环
        setTimeout(function(){self.launchBigLoop()},10000);
    };

    //游戏逻辑计算大循环
    this.launchBigLoop = function(){
        //self.print();
        //TODO push：启动白天动画
        console.log("测试(push所有玩家)：启动白天动画，5秒等待...");
        setTimeout(function(){
            self.loopers.speakLoop();
        },self.initInfo.timers.ani*1000);
    };

    //各类基本&特殊自循环、监听器、推送器
    this.loopers ={

        //游戏逻辑计算子循环：C环节--发言
        speakLoop:function(){
            var that = this;
            self.runningInfo.timeInfo.perid = self.runningInfo.timeInfo.PERID.SPEAK;
            //TODO 回复
            var speakers = [].concat(self.runningInfo.fleshArr.thisDayCanSpkrs);
            // var speakers = hjcArr.circleShuffle(self.runningInfo.fleshArr.thisDayCanSpkrs);//本轮发言顺序
            if( self.runningInfo.timeInfo.num ===1){
                //TODO 推送发言顺序
                console.log("第一个白天无公决环节，3秒钟后从"+speakers[0]+"号开始依次发言...");
            }else{
                //TODO 推送发言顺序
                console.log("游戏继续，3秒钟后从"+speakers[0]+"号开始依次发言...");
            }
            //3秒后启动依次发言推送器
            setTimeout(function(){that.speakManager(speakers);},self.initInfo.timers.gap*1000);
        },

        //游戏逻辑计算子循环：D投票环节
        voteLoop : function(isPK,PKPos){
            var that = this;
            self.runningInfo.timeInfo.perid = self.runningInfo.timeInfo.PERID.VOTE;
            surNum = self.runningInfo.quickArr.survivals.length;
            self.runningInfo.listenArr.voteToArr = hjcArr.fill(surNum,null);
            if(isPK === false) {
                //TODO 推送可以投票玩家消息
                console.log("测试(push所有玩家）公决投票提醒：目标同前...");
            }else{
                //TODO 推送可以投票玩家消息
                console.log("测试(push需要计算玩家）公决投票提醒：目标："+PKPos);
                if(PKPos.length ===2 ){
                    for(i = 0;i<2;i++){
                        var nowId = hjcArr.position(self.runningInfo.quickArr.survivals,PKPos[i]);
                        self.runningInfo.listenArr.voteToArr[nowId] = 99;
                    }
                }
            }
            this.allEndListener = setInterval(function(){
//                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!");
//                console.log(self.runningInfo.listenArr.voteToArr);
                if(hjcArr.allNotValue(self.runningInfo.listenArr.voteToArr,null)){
                    nextStep();
                }
            },self.initInfo.timers.tick*1000);

            this.voteTimeEndListener = setInterval(function(){
               nextStep()
            },self.initInfo.timers.voteTime*1000);

            function nextStep(){
                clearInterval(that.allEndListener);
                clearInterval(that.voteTimeEndListener);
                if(isPK){
                    that.voteResManager(true);
                }else{
                    that.voteResManager(false);
                }
            }
        },

        //游戏逻辑计算自循环：D2 PK发言环节
        PKSpeakLoop :function(voteOuterPos){
            var that = this;
            var argsRetain = [].concat(voteOuterPos);
            var pkSpeakers = voteOuterPos;
            self.runningInfo.timeInfo.perid =  self.runningInfo.timeInfo.PERID.PK_SPEAK;
            this.sendNext = function(PKId){
                //TODO 推送某个玩家的发言提示
                console.log("测试(push所有玩家):"+PKId+"号玩家请PK发言...");
                pkSpeakers.splice(0,1);
            };
            that.sendNext(pkSpeakers[0]);
            var pastTime = 0;
            this.sendLooper = setInterval(function(){
                pastTime+=self.initInfo.timers.tick;
                if(pastTime>=self.initInfo.timers.PKTime){
                    pastTime = 0;
                    if(pkSpeakers.length>0){
                        that.sendNext(pkSpeakers[0]);
                    }else{
                        nextStep();
                    }
                }
                if(self.runningInfo.listenArr.nextPKOver ===true){
                    pastTime = 0;
                    self.runningInfo.listenArr.nextPKOver = false;
                    if(pkSpeakers.length>0){
                        that.sendNext(pkSpeakers[0]);
                    }else{
                        nextStep();
                    }
                }
            },self.initInfo.timers.tick*1000);
            function nextStep(){
                clearInterval(that.sendLooper);
                //TODO 推送给客户端：“所有PK发言结束,3秒后进入公决...”
                console.log("所有PK发言结束：3秒后再次进入公决...");
                setTimeout(function(){
                    that.voteLoop(true,argsRetain);
                },self.initInfo.timers.gap*1000);
            }
        },
        //游戏逻辑计算子循环：A黑夜环节
        nightLoop : function(){
            //TODO 推送：启动黑夜动画效果
            console.log("测试(push给所有玩家)：启动黑夜动画效果(5秒)...");
            var that = this;
            self.runningInfo.timeInfo.perid = self.runningInfo.timeInfo.PERID.NIGHT;
            setTimeout(function(){
               //TODO 推送: 黑夜到来消息，点亮技能按钮
                console.log("测试(push给所有玩家)：黑夜到来啦，请行动吧(5秒/30秒)...");
                nightFlesher(self);
                self.runningInfo.timeInfo.num++;
                setTimeout(function(){that.nightResManager();}
                ,self.initInfo.timers.nightTime*1000);
            },self.initInfo.timers.ani*1000);
        },

        //游戏逻辑计算子循环：B环节--开枪
        shootLoop : function(){
            var that = this;
            self.runningInfo.timeInfo.perid = self.runningInfo.timeInfo.PERID.SHOOT;
            var shooterIds = self.runningInfo.fleshArr.lastNgtCanShoters;
            var targets = self.runningInfo.quickArr.survivals;
            for(var i = 0;i<shooterIds.length;i++){
                self.runningInfo.listenArr.shootToArr.push(null);
            }
            //TODO：推送开枪队列可以开枪提醒
            console.log("测试(push给所有玩家)：3秒后死者请留遗言并开枪(30秒)");
            setTimeout(function(){
                //TODO: 给指定玩家推送可开枪队列,遗言提醒
                console.log("测试(pushTo-id:"+shooterIds+")目标："+targets+" 并留遗言...");
                that.shootResManager();
            },self.initInfo.timers.gap*1000);
        },

        //游戏逻辑特殊计算子循环：X1外星人出局先机
        fstKnowLoop : function(){

        },

        //白天依次发言推送器
        speakManager:function(speakers){
            var that = this;
            var speakerNum = speakers.length;       //发言人数
            var listenSpeakOverArr = [];
            for(var i = 0; i< speakerNum; i++){
                self.runningInfo.listenArr.speakOverArr.push(false);  //玩家主动发起的是否发言已经结束
                listenSpeakOverArr.push(false);                       //服务器监听的是否每个玩家最长发言时间已到
            }
            var canSpeakTimeArr = [];                                 //玩家所能发言的最长时间
            for(var j = 0; j< speakerNum; j++){
                var saveTime = self.runningInfo.fleshArr.saveAuto[j]===false?0:self.runningInfo.fleshArr.saveTimes[j];
                self.runningInfo.fleshArr.speakMaxTime.push(self.initInfo.timers.defaultSpeak+saveTime);
                canSpeakTimeArr.push(self.initInfo.timers.defaultSpeak+j*self.initInfo.timers.nextTurn);
            }
            //发言
            this.sendNext = function(speakId){
                //TODO 推送某个玩家的发言提示
                console.log("测试(push所有玩家):"+speakId+"号玩家请发言...");
                speakers.splice(0,1);
            };
            that.sendNext(speakers[0]);
            //依次发言
            this.sendLooper = setInterval(function(){
                if(speakers.length>0){
                    that.sendNext(speakers[0]);
                }else{
                    clearInterval(that.sendLooper);
                }
            },self.initInfo.timers.nextTurn*1000);
            //每个玩家发言时间已到监听器
            var passTime = 0;
            this.everySpkEndWaiter = setInterval(function(){
                passTime += self.initInfo.timers.tick;
                for(var i = 0;i<canSpeakTimeArr.length;i++){
                    if( self.runningInfo.listenArr.speakOverArr[i]===true) { listenSpeakOverArr[i]=true;continue;}
                    if( listenSpeakOverArr[i]===true) continue;
                    if(passTime>=canSpeakTimeArr[i]){
                        //基本时间到了
                        if(self.runningInfo.fleshArr.saveAuto[i]===false){
                            listenSpeakOverArr[i]=true;
                        }else{
                            //预留时间也到了
                            if(passTime>=(canSpeakTimeArr[i]+self.runningInfo.fleshArr.saveTimes[j])){
                                listenSpeakOverArr[i]=true;
                            }
                        }
                    }
                }
            },self.initInfo.timers.tick*1000);
            //发言环节结束监听器
            //var a = 0;
            this.spkTimeEndWaiter = setInterval(function(){
                //测试用：
                //if(a==5){console.log(listenSpeakOverArr); a=0;}
                //a++;

                if(hjcArr.allValue(listenSpeakOverArr,true)&&self.runningInfo.dayEvent.fstAid === false){
                   that.nextStep("normal");
                }
            },self.initInfo.timers.tick*1000);
            //监听跳过白天事件和急救事件
            var aidPushed = false;
            this.jmpDayListener = setInterval(function(){
                if(self.runningInfo.loopFlag.jmpDay === true){
                   that.nextStep("judge");
                }
//                if(self.runningInfo.dayEvent.fstAid === true){
//                    //推送(TODO)
//                    console.log("***监听到急救...");
//                    var aidId = self.runningInfo.dayEvent.fstAidId;
//                    if(aidPushed===false&&passTime>=(speakerNum*self.initInfo.timers.defaultSpeak)){
//                        //推送(TODO)
//                        console.log("被救起的aidId号玩家请发言...");
//                        aidPushed = true;
//                    }
//                }
            },self.initInfo.timers.tick*1000);
            this.nextStep = function(type){
                clearInterval(that.everySpkEndWaiter);
                clearInterval(that.spkTimeEndWaiter);
                clearInterval(that.jmpDayListener);
                if(type==="normal"){
                    if(self.runningInfo.timeInfo.num ===1){
                        //TODO 推送给客户端：“第一个白天不公决，3秒后进入黑夜...”
                        console.log("第一个白天不公决，3秒后进入黑夜...");
                        setTimeout(function(){
                            that.nightLoop();
                        },self.initInfo.timers.gap*1000);
                    }else if(self.runningInfo.dayEvent.trigBless === true){
                        //TODO 推送给客户端：“祈福者发动祝福，本轮无公决，3秒后进入黑夜...”
                        console.log("祈福者发动祝福，本轮无公决，3秒后进入黑夜...");
                        setTimeout(function(){
                            that.nightLoop();
                        },self.initInfo.timers.gap*1000);
                    }else{
                        //TODO 推送给客户端：“所有玩家都发言结束,3秒后进入公决...”
                        console.log("所有玩家都发言结束：3秒后进入公决...");
                        setTimeout(function(){
                            that.voteLoop(false);
                        },self.initInfo.timers.gap*1000);
                    }
                }else if(type==="judge"){
                    //TODO 推送给客户端：“审判发动：3秒后进入黑夜”
                    console.log("审判发动：游戏继续，3秒后进入黑夜");
                    setTimeout(function(){
                        that.nightLoop();
                    },self.initInfo.timers.gap*1000);
                }
            }
        },

        voteResManager:function(isPK){
            var that = this;
            var voteRes = voteCalc(self);
            if(voteRes===true) return;
            var strInfo = voteRes.info;
            var voteOuterPos = voteRes.highestPositions;
            if(isPK){
                PKNextStep();
            }else{
                nextStep();
            }
            function nextStep(){
                if(voteOuterPos.length === 0){
                    //TODO　推送３秒后进入黑夜提示
                    console.log("测试(push所有玩家)：游戏继续，"+strInfo);
                    self.runningInfo.timeInfo.leftEvenStep--;
                    setTimeout(function(){
                        that.nightLoop();
                    },self.initInfo.timers.gap*1000);
                }else if(voteOuterPos.length === 1){
                    //TODO　推送公决结果和３秒后进入黑夜提示
                    console.log("测试(push所有玩家)：游戏继续，"+strInfo+"\n"+""+voteOuterPos[0]+"被公决出局...请留遗言(5秒/30秒)...");
                    //TODO 推送黑夜提醒：3秒后进入黑夜..."
                    setTimeout(function(){
                        console.log("测试(push所有玩家)：游戏继续，3秒后进入黑夜......");
                        setTimeout(function(){
                            that.nightLoop();
                        },self.initInfo.timers.gap*1000);
                    },self.initInfo.timers.LstWdTime*1000);
                }else if(voteOuterPos.length <= 3){
                    //TODO　推送投票结果和PK提示
                    console.log("测试(push所有玩家)：游戏继续，"+strInfo+"\n"+voteOuterPos+"依次PK，各发言5/45秒，"+"3秒后进入PK...");
                    setTimeout(function(){
                        that.PKSpeakLoop(voteOuterPos);
                    },self.initInfo.timers.gap*1000);
                }else{
                    //TODO　推送投票结果和重新投票提示
                    console.log("测试(push所有玩家)：游戏继续，"+strInfo+"\n本轮多余3个玩家平票，投票作废，3秒后重新公决...");
                    setTimeout(function(){
                        that.voteLoop(false);
                    },self.initInfo.timers.gap*1000);
                }
            }
            function PKNextStep(){
                if(voteOuterPos.length === 0){
                    //TODO　推送３秒后进入黑夜提示
                    console.log("测试(push所有玩家)：游戏继续，"+strInfo);
                    self.runningInfo.timeInfo.leftEvenStep--;
                    setTimeout(function(){
                        that.nightLoop();
                    },self.initInfo.timers.gap*1000);
                }else if(voteOuterPos.length === 1){
                    //TODO　推送公决结果和３秒后进入黑夜提示
                    console.log("测试(push所有玩家)：游戏继续，"+strInfo+"\n"+""+voteOuterPos[0]+"被公决出局...请留遗言(5秒/30秒)...");
                    //TODO 推送黑夜提醒：3秒后进入黑夜..."
                    setTimeout(function(){
                        console.log("测试(push所有玩家)：游戏继续，3秒后进入黑夜......");
                        setTimeout(function(){
                            that.nightLoop();
                        },self.initInfo.timers.gap*1000);
                    },self.initInfo.timers.LstWdTime*1000);
                }else{
                    //TODO　推送平安日
                    console.log("测试(push所有玩家)："+strInfo+"\n再次出现平票，游戏继续，3秒钟后游戏进入黑夜...");
                    setTimeout(function(){
                        that.nightLoop();
                    },self.initInfo.timers.gap*1000);
                }
            }
        },

        nightResManager:function(){
            var that = this;
            var nightRes = nightCalc(self);
            if(nightRes === true) return;//游戏结束
            var strInfo = "";
            if(self.runningInfo.fleshArr.lastNgtDeads.length === 0){
                strInfo ="这是一个平安夜（游戏继续）...";
                self.runningInfo.timeInfo.leftEvenStep--;
                nextStep("speak",strInfo);
            }else if(self.runningInfo.fleshArr.lastNgtCanShoters.length ===0){
                strInfo = "黑夜结果（游戏继续）：\n" + nightRes;
                nextStep("speak",strInfo);
            }else{
                strInfo = "黑夜结果（游戏继续）：\n" + nightRes;
                nextStep("shoot",strInfo);
            }
            function nextStep(type,strInfo){
                //TODO 推送白天动画
                console.log("测试(push所有玩家):启动白天动画(5秒)...");
                setTimeout(function(){
                    //TODO 推送白天结果
                    console.log("测试(push所有玩家)："+strInfo);
                    if(type==="speak"){
                        that.speakLoop();
                    }else if(type==="shoot"){
                        that.shootLoop();
                    }
                },self.initInfo.timers.ani*1000);
            }
        },

        shootResManager:function(){
            var that = this;
            var allShootEndWaiter = setInterval(function(){
                if(hjcArr.allNotValue(self.runningInfo.listenArr.shootToArr,null)){
                    //所有玩家开枪结束，等待最后一个玩家开枪后执行的endCheck，如果游戏结束gameEndWaiter会停止自己，否则继续
                    setTimeout(function(){
                       nextStep();
                    },self.initInfo.timers.tick*1000);
                }
            },self.initInfo.timers.tick*1000);
            var shootTimeEndWaiter = setTimeout(function(){
                //最长开枪时限到
                nextStep();
            },self.initInfo.timers.shootTime*1000);
            var gameEndWaiter = setInterval(function(){
                if(self.runningInfo.timeInfo.perid === self.runningInfo.timeInfo.PERID.END){
                    //开枪造成游戏结束
                    stopAllWaiters();
                }
            },self.initInfo.timers.tick*1000);
            function stopAllWaiters(){
                clearInterval(allShootEndWaiter);
                clearInterval(gameEndWaiter);
                clearTimeout(shootTimeEndWaiter);
            }
            function nextStep(){
                stopAllWaiters();
                if(jumpDayChecker(self)){
                    //TODO 推送跳过白天信息
                    self.runningInfo.timeInfo.leftEvenStep--;
                    console.log("只剩下两人游戏不结束，3秒后直接进入黑夜...");
                    setTimeout(function(){
                        that.nightLoop();
                    },self.initInfo.timers.gap*1000);
                }else{
                   that.speakLoop();
                }
            }
        }
    };

    this.receivers = new Receiver(self);

    //入口函数
    console.log("测试(push所有玩家):游戏已经启动，进入4秒倒计时...");
    setTimeout(function(){
        self.runGame();
    },4000);

    this.print = function(){
        console.log("=====================打印游戏内存信息=============================");
        console.log(self.runningInfo);
        console.log(self.runningInfo.quickArr.jobExistList[0]);
    }
}

//测试：
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
        getNickList: function(){return [null,"黄达斯","路人2","路人3","路人4","路人5","路人6","路人7","路人8","路人9",null,false];}
    },//房间内座位
    readyList : {
        list:[null,true,true,true,true,false,false,true,true,true,null,false]
    }, //房间内的准备情况；
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

//var g = new Game(testRoomInfo,null);
//g.launchSkill("路人2",2,1);
//g.launchSkill("黄达斯",2,9);
//g.launchSkill("路人9",1,1);
//console.log(g.thisNightSkillBuffer);


