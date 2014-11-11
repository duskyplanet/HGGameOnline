//var alloctManager = require("./alloctManager");
//var wordsManager = require("../gameManagers/wordsManager/wordsManager");
//var calcManager = require("../gameManagers/calcManager/calcManager");
//var jumpDayChecker = require("../gameManagers/calcManager/jumpDayChecker").jumpDayChecker;
//var nightCalc = require("../gameManagers/calcManager/nightCalc").calc;
//var voteCalc = require("../gameManagers/calcManager/voteCalc").calc;
//var alloctInfo = require("./alloctInfo").alloctInfo;
//var GameInfo = require("../basicGameInfo/GameInfo");
//var basicUtils =  require("../../HJCUtils/basicUtils");
//var Player = require("./player").player;
////var PlayerInfo = require("./player").info;
//var hjcArr = require("../../HJCUtils/HJCArray");
//var MyQ =  require("../../HJCUtils/HJCQ").HJCQ;
////组件

//var Receiver = require("./gameComponents/receiver").Receiver;
//var Recorder = require("./gameComponents/recorder").Recorder;
//var nightFlesher = require("./gameComponents/flesher").nightFlesh;
////JOB逻辑
//var jobCheckers = require("../gameManagers/jobCheckers/jobCheckers");
//var ColorHelper = require("../basicGameInfo/ColorHelper");
//var specialLoops = require("../gameManagers/specialLoopers/specialLoopers");

//全局引入
gb = require("../global").global;
var Sender = require("./gameComponents/sender").Sender;


exports.Game = Game;
function Game(roomInfo,pusher){
    var self = this;
    /**游戏初始化数据**/
    this.initInfo = {
        rid:roomInfo.rid,
        rMode:roomInfo.rmode,
        readyList:roomInfo.readyList,                   //饱和数组(带首null)，准备的玩家位置为true
        userNickList:roomInfo.userList.getNickList(),   //饱和数组(带首null)，存在玩家的位置有nick
        initTargets:roomInfo.userList.getTargetsByPos(),         //推送目标(饱和数组，带有null)
        gameMode:roomInfo.advanced.gameMode,        //游戏模式 0：文字-文字 1：图片-文字 2：文字-语音 3：图片-语音
        jobWant:roomInfo.advanced.jobWant,          //true 开启职业竞选
        wantList:roomInfo.advanced.wantList,        //饱和数组，选职列表
        wordMode:roomInfo.advanced.wordMode,        //选词模式
        wordChooseArr:roomInfo.advanced.wordChooseArr,  //选词子模式
        picMode:roomInfo.advanced.picMode,
        timers:{                                    //游戏基础时间配置
            gap:0.5,                                      //环节承接时间：默认半秒
            ani:5,                                      //黑夜和白天的动画效果时间
            shootTime:50,                                //开枪加遗言时间：默认51秒
            nextTurn:roomInfo.advanced.speakTime/3,                                //发言轮询间隔：默认90/3=30秒
            voteTime:30,                                //投票时间：默认30秒
            PKTime:45,                                   //PK发言时间：默认45秒
            LstWdTime:40,                                //遗言时间：默认40秒
            nightTime:30,                                //黑夜时间：默认30秒
            defaultSpeak:roomInfo.advanced.speakTime,                          //发言时间：默认90秒（为nextTurn的3陪）
            defaultSave:roomInfo.advanced.saveTime,                            //预留时间：开始默认60秒（为nextTurn的2陪）
            tick:0.2,                                                           //tick检查，0.2秒一次
            tickNum:1/this.tick
        }
    };
    /**游戏运行时数据**/
    this.runningInfo = {
        playerExistList : [],   //饱和数组，用于快速遍历位置玩家是否存在
        playerListByPos:[],     //饱和数组，专门用于获取
        gamerTargets:[],        //不饱和数组，参与游戏玩家（准备的玩家）的推送目标                                      →[initArrays中初始化]
        ttlPlayerNum: 0,          //本轮参与玩家数量                                                         →[initArrays中初始化]
        timeInfo:{              //时间信息
            period:1,
            num:1,
            leftEvenStep:4,
            PERIOD:{
                SPEAK:1,
                VOTE:2,
                PK_SPEAK:3,
                PK_VOTE:4,
                NIGHT:5,
                DAWN:6,
                SHOOT:7,
                ALN_GUESS:8,
                SAVE:9,
                END:10
            }
        },
        words:{},               //本轮游戏分配词语                                                         →[allocate中初始化]
        party:{
            alnExist:false,     //有外星人
            wwfExist:false      //有狼人
        },               //阵营信息
        quickArr:{              //不饱和数组，快速访问表
            nickList:[],            //按照Pos的饱和【只读】：昵称列表（含有首null）         →[initArrays中初始化]
            positionList:[],        //不饱和数组【只读】: 参与游戏的position列表，等同于gamerTargets的position集合（position为玩家在游戏中的实际位置）   →[initArrays中初始化]
            partyList:[],           //按照id的【只读】: 阵营列表                                           →[allocate中初始化]
            jobList:[],             //按照id的【只读】: 职业列表                                           →[allocate中初始化]
            jobExistList:[],        //按照职业号寻找对应的id玩家【只读】：二维数组                         →[allocate中初始化]
            survivals:[],            //玩家存活列表(不饱和数组)                                            →[initArrays中初始化]
            surHmnNum:0,
            surGstNum:0,
            surAlnNum:0,
            surWwfNum:0,
            alnPos:0                //如果存在外星人，外星人的号码
        },
        fleshArr:{              //动态表，每个环节都要刷新
            lastNgtDead:[],        //上个夜晚的死者数组
            lastNgtDeadDetail:[],  //上一个夜晚的死者情况数组
            lastNgtCanShoot:[],   //上个夜晚的死者中可以开枪遗言者(lastNgtDeads子集)
            thisDayFrbSpeak:[],     //这个白天中不能发言者（survivals子集）
            thisDayFrbVote:[],     //这个白天中不能投票者（survivals子集）
            lastNgtSkillBuffer:[],     //上一个夜晚可能延续的技能列表（[迷惑]、[催眠]）
            thisNgtSkillBuffer:[], //这个夜晚的技能列表  （按照id来的）                                               →[initArrays中初始化]
            thisNgtInfoSenderBuffer:[],   //这个夜晚的成功信息获取技能推送队列
            thisDawnEffectSenderBuffer:[],//这个黎明的技能发动启动通知
            thisDayCanSpeak:[],     //这个白天中可以发言者（survivals子集）
            saveTimes:[],           //按照id排列的预留发言时间的数组                                       →[initArrays中初始化]//TODO 貌似不要了
            saveAuto:[],             //按照id排列的是否自动启动预留时间的数组                               →[initArrays中初始化]//TODO 貌似不要了
            saveAutoArrByPos:[],    //☆按照玩家pos排列的饱和数组，true代表采用了自动保存，false代表未采用自动保存，null表示不存在玩家
            saveTimeArrByPos:[],    //☆按照玩家pos排列的饱和数组，数值代表玩家现在拥有的预留时间，null表示不存在玩家
            dayJobInfo:{targetsPosArr:[],infoArr:[]}      //信息类职业白天获得的信息
        },
        fleshInfo:{
            lastNgtOutInfoHtml:"",     //上一个夜晚出局的信息
            dawnGlobalInfoHtml:"",       //这个黎明的全局提示信息
            ngtAlnOut:false,              //☆夜晚有外星人出局，黎明需要先机判断（已刷新）
            delayGuess:false,               //☆开枪环节有外星人出局，需要进行延迟猜词（已刷新）
            thisDaySpeakPos:-1,              //☆这个白天发言已经到了几号？（已刷新）
            thisDaySpeakJumpers:[]          //☆这个白天因为特殊原因本来能发言却被踢出发言队列的人，如被复仇者玉碎的人（已经刷新）
        },
        listenArr:{             //流程相关监听队列
            speakOverArr:[],        //这个白天玩家是否发言结束队列(由玩家外部请求)//TODO 貌似不要了
            thisDaySpeakConditionByPos:[],    //☆这个白天的玩家发言情况，饱和数组，其中为true的代表已经发言完毕。
            shootToArr:[] ,         //开枪玩家行动队列 //TODO 貌似不要了（直接删除lastNgtCanShoot中的元素）
            voteToArr:[],            //投票队列
            nextPKOver:false,       //下一位PK发言结束
            voteOuterLstWd:false    //公决出局者是否已经遗言
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
        },
        glbEvent:{              //全局状态事件
            trigMemorial:false,      //伤逝者发动[祭奠]离场
            aglAdvent:false,         //有天使且降临
            dmnAwake:false,          //有恶魔且觉醒
            trigBlessForThisDay:false,  //[祈祷]成功在白天发动
            trigBlessForThisNgt:false,  //[祈祷]成功在黑夜发动
            blessEnlighten:false,        //[祈祷]是否受到启迪
            trigSaveForThisNgt:false,   //[救世]成功在黑夜发动
            trigSaveForThisDay:false,   //[救世]成功在白天发动
            trigJudgeForThisDay:false  //[审判]成功在白天发动
        }
    };
    /**步骤一：初始化基本数组**/
    this.initArrays = function(){
        var userNickList = self.initInfo.userNickList;
        var readyList = self.initInfo.readyList;
        for(var i = 0 ; i< readyList.length; i++){
            //这个位置有人，而且已经准备了
            if( readyList[i]===true && userNickList[i]!= null && userNickList[i]!=undefined){
                self.runningInfo.quickArr.nickList[i] =  userNickList[i];
                self.runningInfo.quickArr.survivals.push(i);
                self.runningInfo.gamerTargets.push(self.initInfo.initTargets[i]);
                self.runningInfo.ttlPlayerNum++;
                self.runningInfo.quickArr.positionList.push(i);
                self.runningInfo.fleshArr.saveAutoArrByPos.push(false);
                self.runningInfo.fleshArr.saveTimeArrByPos(self.initInfo.timers.defaultSave);
                self.runningInfo.fleshArr.thisDayCanSpeak.push(i);
                self.runningInfo.playerExistList[i] = true;
            }else{
                self.runningInfo.fleshArr.saveAutoArrByPos.push(null);
                self.runningInfo.fleshArr.saveTimeArrByPos(null);
                self.runningInfo.quickArr.nickList[i] = null;
                self.runningInfo.playerExistList[i] = false;
            }
        }
    };
    /**步骤二：分配阵营、词汇、职业**/
    this.allocate = function(){
        //基本局测试执行：
        var testParams = {
            ttlNum :7,
            jobTurnUpList:[2,3],          //本局游戏“可以上场”的职业列表
            jobForcedList:[],         //本局游戏在“可以上场的前提下必须上场”的职业列表
            jobWantList:[2],            //本局游戏在“可以上场的前提下玩家的职业申请”的列表
            alnType:1,                  //外星人登场情况：0不登场，1随机，2必上场
            wwfType:1,                   //狼族登场情况：0不上场，1随机，2必上场
            singleJob:false              //单职业模式
        };
        var allocateResult = gb.allocateManager.getAllocateResult(testParams);
        //TODO 临时修改数据
        allocateResult.jobList =   [1,0,0,0,2,3,0,0];
        allocateResult.partyList = [3,1,1,1,1,1,2,2];
        //TODO 临时打印数据
        //gb.allocateManager.allocatePrinter(allocateResult);
        var initWordsRes = gb.wordsManager.getWordsWithoutArgs();
        var quickArr = self.runningInfo.quickArr;
        quickArr.jobList = allocateResult.jobList;
        quickArr.partyList = allocateResult.partyList;
        quickArr.surHmnNum = allocateResult.hmnNum;
        quickArr.surGstNum = allocateResult.gstNum;
        quickArr.surAlnNum = allocateResult.alnNum;
        quickArr.surWwfNum = allocateResult.wwfNum;
        quickArr.alnPos = self.tools.getPosById(allocateResult.alnPos);
        self.runningInfo.party.alnExist = allocateResult.alnNum === 1;
        self.runningInfo.party.wwfExist = allocateResult.wwfNum >= 1;
        self.runningInfo.words = initWordsRes;
        var jobExistArr = new Array(gb.GameInfo.JobInfo.getJobTtlNum());
        for(var i = 0;i<allocateResult.jobList.length;i++){
           if(gb.utils.basicUtils.isEmpty(jobExistArr[allocateResult.jobList[i]])){
               jobExistArr[allocateResult.jobList[i]] = [allocateResult.jobList[i]];
           }else{
               jobExistArr[allocateResult.jobList[i]].push(i);
           }
        }
        self.runningInfo.quickArr.jobExistList = jobExistArr;
        return allocateResult;
    };
    /**步骤三：为玩家列表填充属性**/
    this.initPlayerListContent = function(allocateRes){
        var loop = self.runningInfo.playerExistList;
        var nextPos = 0;
        for(var i = 0;i<loop.length;i++){
            if(loop[i] === false) {
                self.runningInfo.playerListByPos[i]=null;
            }else{
                var myJob = allocateRes.jobList[nextPos];
                var myParty = allocateRes.partyList[nextPos];
                self.runningInfo.playerListByPos[i] = new gb.Player(self,myJob,myParty,i);
                nextPos++
            }
        }
    };

    /**逻辑相关工具方法**/
    this.tools = {
        getPosById:function(id){
            var findId = 0;
            for(var i = 0;i < self.runningInfo.playerExistList.length;i++){
                if(self.runningInfo.playerExistList[i] === true){
                    if(findId === id) return i;
                    findId ++;
                }
            }
            console.log("game.tools发生错误：找不到id对应的pos");
        },

        //通过玩家的昵称找位置
        getPosByNick : function(nick){
            var position = hjcArr.firstPosition(self.initInfo.userNickList,nick);
            if(position===-1){
                console.log("game发生致命逻辑错误：找不到昵称对应的pos");
            }return position;
        },
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
        },
        //按照pos数组获得推送目标数组
        getTargetsByPos:function(posArr){
            if(!Array.isArray(posArr)){
                console.log("game.tools发生错误:参数不合法");
                return;
            }
            var res = [];
            for(var i = 0;i<posArr.length;i++){
                res.push(self.initInfo.initTargets[posArr[i]]);
            }
            return res;
        },
        //按照ids数组获得推送目标数组
        getTargetsByIds:function(idsArr){
            if(!Array.isArray(idsArr)){console.log("game发送推送目标参数错误");return;}
            res = [];
            for(var i = 0;i<idsArr.length;i++){
                res.push(self.runningInfo.gamerTargets[idsArr[i]]);
            }
            return res;
        }
    };
    //游戏逻辑推送执行:各种推送消息（三大组件之一）
    this.sender = new Sender(self);
//    //游戏过程中的状态和行动记录（三大组件之一）
//    this.recorder = new Recorder(self);
//    //游戏过程中接受的外部操作（三大组件之一）
//    this.receivers = new Receiver(self);

    //游戏逻辑计算执行：初始化游戏玩家运行时数据

    this.runGame = function(){
        //步骤一：初始化基本数组
        self.initArrays();
        //步骤二：分配阵营、词汇、职业
        var allocateRes = self.allocate();
        //步骤三：为玩家列表填充属性
        self.initPlayerListContent(allocateRes);
        //步骤四：将初始信息以及状态记录下来
       //self.recorder.add("allocate",null);
        return;

        //步骤五：5秒后向玩家推送身份和职业信息
        setTimeout(function(){
            //通过测试：推送ID消息
           self.recorder.add("beforeGame",{job:"spy"});
           self.sender.idMsg(allocateRes,self.runningInfo.words);
        },3000);
//       Test
//       self.loops.voteLoop();
//        return;
//        self.loops.nightLoop(false);
//        return;
//        console.log("测试(push所有玩家)：身份信息，10秒等待...");
        //步骤五:11秒后进入逻辑大循环
        setTimeout(function(){self.launchBigLoop()},10000);
    };

    //游戏逻辑计算大循环
    this.launchBigLoop = function(){
        setTimeout(function(){
            self.loopers.speakLoop();
        },self.initInfo.timers.ani*1000);
    };

    //各类基本&特殊自循环、监听器、推送器
    this.loopers ={

        //游戏逻辑计算子循环：C环节--发言
        speakLoop:function(){
            if( self.runningInfo.timeInfo.perid===self.runningInfo.timeInfo.PERID.END){
                return;
            }
            self.runningInfo.timeInfo.perid = self.runningInfo.timeInfo.PERID.SPEAK;
            var that = this;
            //TODO 回复
            var speakers = [].concat(self.runningInfo.fleshArr.thisDayCanSpkrs);
            speakers = hjcArr.circleShuffle(self.runningInfo.fleshArr.thisDayCanSpkrs);//本轮发言顺序
            if( self.runningInfo.timeInfo.num ===1){
                //TEST 通过： 推送发言顺序
                console.log("第一个白天无公决环节，3秒钟后从"+speakers[0]+"号开始依次发言...");
                var pushStr = ColorHelper.colorHtml(ColorHelper.COLORS.SPLIT,"第一天")+"<br/>";
                pushStr += ColorHelper.colorHtml(ColorHelper.COLORS.DAY_COME,"第一个白天到来,3秒钟后从"+ColorHelper.colorHtml(ColorHelper.COLORS.ALERT,speakers[0]+"")+"号开始轮询发言（每人"+self.initInfo.timers.defaultSpeak+"秒）...<br/>");
                self.recorder.add("dayCome",1);
                self.sender.onInfo("day",pushStr);
            }else{
                //TODO 推送发言顺序
                //TEST 通过： 推送发言顺序
                console.log("游戏继续，3秒钟后从"+speakers[0]+"号开始轮询发言...");
                pushStr = ColorHelper.colorHtml(ColorHelper.COLORS.DAY_COME,"第"+self.runningInfo.timeInfo.num+"个白天到来,3秒钟后从"+ColorHelper.colorHtml(ColorHelper.COLORS.ALERT,speakers[0]+"")+"号开始依次发言（每人"+self.initInfo.timers.defaultSpeak+"秒）...<br/>");
                self.recorder.add("dayCome",self.runningInfo.timeInfo.num);
                self.sender.onInfo("day",pushStr);
            }
            //3秒后启动依次发言推送器
            setTimeout(function(){that.speakManager(speakers);},self.initInfo.timers.gap*1000);
        },

        //游戏逻辑计算子循环：D投票环节
        voteLoop : function(isPK,PKPos){
            if( self.runningInfo.timeInfo.perid===self.runningInfo.timeInfo.PERID.END){
                return;
            }
            self.runningInfo.timeInfo.perid = self.runningInfo.timeInfo.PERID.VOTE;
            var that = this;
            var surNum = self.runningInfo.quickArr.survivals.length;
            self.runningInfo.listenArr.voteToArr = hjcArr.fill(surNum,null);
            if(isPK === false) {
                //TODO 推送可以投票玩家消息
                console.log("测试(push所有玩家）公决投票提醒：目标同前...");
                self.sender.onVote();
            }else{
                //TODO 推送可以投票玩家消息
                console.log("测试(push需要计算玩家）PK投票提醒：目标："+PKPos);
                self.sender.onPKVote(PKPos);
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
                self.sender.counter(false);
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
            if( self.runningInfo.timeInfo.perid===self.runningInfo.timeInfo.PERID.END){
                return;
            }
            self.runningInfo.timeInfo.perid =  self.runningInfo.timeInfo.PERID.PK_SPEAK;
            var that = this;
            var argsRetain = [].concat(voteOuterPos);
            var pkSpeakers = voteOuterPos;
            this.sendNext = function(PKId){
                //TODO 推送某个玩家的发言提示
                console.log("测试(push所有玩家):"+PKId+"号玩家请PK发言（45秒）...");
                self.sender.onPKTurn(PKId+"号玩家请发言...",PKId);
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
                console.log("所有PK玩家都发言结束：3秒后进入公决...");
                self.sender.onInfo("day",ColorHelper.colorHtml(ColorHelper.COLORS.DAY_COME,"所有玩家PK结束，3秒后再次进入公决（30秒）..."));
                setTimeout(function(){
                    that.voteLoop(true,argsRetain);
                },self.initInfo.timers.gap*1000);
            }
        },
        /** 游戏逻辑计算子循环：黑夜环节开始（确定进入）→执行黑夜结束逻辑 **/
        nightLoop : function(){
            var that = this;
            //黑夜不会被跳过
            if( self.runningInfo.timeInfo.perid===self.runningInfo.timeInfo.PERID.END) return;
            self.runningInfo.timeInfo.perid = self.runningInfo.timeInfo.PERID.NIGHT;
            var q = new MyQ();
testPrint("测试(push给所有玩家)：启动黑夜动画效果("+self.initInfo.timers.ani+")...");
            q.add(function(){
                self.sender.onAni("night");
            },self.initInfo.timers.ani*1000);
testPrint("测试(push给所有玩家)：黑夜到来啦，请行动吧("+self.initInfo.timers.nightTime+")...");
            q.add(function(){
                self.sender.onNightCome();
                self.recorder.add("nightCome",self.runningInfo.timeInfo.num);
            },self.initInfo.timers.nightTime*1000)
testPrint("程序开始计算黑夜技能结果....");
            q.add(function(){
                that.nightResManager();
                self.runningInfo.timeInfo.num++;
                return;
            });
            q.do();
        },

        //游戏逻辑计算子循环：B环节--开枪
        shootLoop : function(){
            if( self.runningInfo.timeInfo.perid===self.runningInfo.timeInfo.PERID.END){
                return;
            }
            self.runningInfo.timeInfo.perid = self.runningInfo.timeInfo.PERID.SHOOT;
            var that = this;
            var shooterIds = self.runningInfo.fleshArr.lastNgtCanShoters;
            var targets = self.runningInfo.quickArr.survivals;
            for(var i = 0;i<shooterIds.length;i++){
                self.runningInfo.listenArr.shootToArr.push(null);
            }
            //TODO：推送开枪队列可以开枪提醒
            console.log("测试(push给所有玩家)：3秒后死者请留遗言并开枪(40秒)");
            self.sender.onInfo("shot",ColorHelper.colorHtml(ColorHelper.COLORS.DAY_COME,"3秒后死者请留遗言并开枪("+self.initInfo.timers.shootTime+")..."));
            setTimeout(function(){
                //TODO: 给指定玩家推送可开枪队列,遗言提醒
                console.log("测试(pushTo-id:"+shooterIds+")目标："+targets+" 并留遗言...");
                self.sender.onShot(shooterIds,targets);
                that.shootResManager();
            },self.initInfo.timers.gap*1000);
        },

        //游戏特殊循环逻辑（由于不同的职业造成）
        specialLoop:{
            afterNightLoop:function(nightRes,callback){
                var deathArr = nightRes.deathArr;
                var recordStr = nightRes.recordStr;
                var htmlStr = nightRes.htmlStr;
                var q = new MyQ();
                q.add(function(){
                    self.sender.onDie(deathArr);
                    self.sender.info
                },200);

                if(deathArr.length > 0){

                }
                specialLoops.alienOutManager
            },
            afterVoteDieLoop:function(die,goon){

            },
            afterVoteEvenLoop:function(goon){

            },
            afterShootOverLoop:function(goon){

            }
        },

        //白天依次发言推送器
        speakManager:function(speakers){            //speakers是从thisDayCanSpkrs复制过来的新数组，不能删减
            var that = this;
            var speakerNum = speakers.length;       //发言人数
            var listenSpeakOverArr = [];
            for(var i = 0; i< speakerNum; i++){
                self.runningInfo.listenArr.speakOverArr.push(false);  //玩家主动发起的是否发言已经结束(黑夜时已经刷新) //用于监听
                listenSpeakOverArr.push(false);                       //服务器监听的是否每个玩家最长发言时间已到        //用于计算
            }
            var canSpeakTimeArr = [];                                 //发言者队列不用预留所能发言的最长时间
            for(var j = 0; j< speakerNum; j++){
                canSpeakTimeArr.push(self.initInfo.timers.defaultSpeak+j*self.initInfo.timers.nextTurn);
            }
            //发言
            this.sendNext = function(speakId){
                //测试通过：推送某个玩家的发言提示
                console.log("测试(push所有玩家):"+speakId+"号玩家请发言...");
                self.sender.onTurn(speakId+"号玩家请发言...",speakId);
            };
            var nextOne = 0;//下一位发言者在speakers中的下标；
            that.sendNext(speakers[nextOne]);
            //依次发言
            this.sendLooper = setInterval(function(){
                nextOne = nextOne + 1;
                if(nextOne < speakers.length){
                    that.sendNext(speakers[nextOne]);
                }else{
                    clearInterval(that.sendLooper);
                }
            },self.initInfo.timers.nextTurn*1000);
            //每个玩家发言时间已到监听器
            var passTime = 0;
            this.everySpkEndWaiter = setInterval(function(){
                passTime += self.initInfo.timers.tick;
                for(var i = 0;i<speakers.length;i++){
                    var speakerId = self.quickQuery.getIdByPosition(speakers[i]);
                    if(listenSpeakOverArr[i] === true){continue;}                                                          //时间已到
                    if( self.runningInfo.listenArr.speakOverArr[speakerId]===true) { listenSpeakOverArr[i]=true;continue;}          //玩家自己结束，时间已到
                    if(passTime>=canSpeakTimeArr[i]){   //基本时间已到
                        if(self.runningInfo.fleshArr.saveAuto[speakerId]===false){
                            listenSpeakOverArr[i]=true;     //未启用预留，时间已到
                        }else{
                            //预留时间也到了
                            if(passTime>=(canSpeakTimeArr[i]+self.runningInfo.fleshArr.saveTimes[speakerId])){
                                listenSpeakOverArr[i]=true;
                                self.runningInfo.fleshArr.saveAuto[speakerId] = true;
                                self.runningInfo.fleshArr.saveTimes[speakerId] = 0;
                            }
                        }
                    }
                }
            },self.initInfo.timers.tick*1000);
            //发言环节结束监听器
            var a = 0;
            this.spkTimeEndWaiter = setInterval(function(){
                //测试用：
                if(a==5){console.log("发言完结数组"+listenSpeakOverArr);console.log("预留时间数组"+self.runningInfo.fleshArr.saveTimes); a=0;}
                a++;
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
                        console.log("所有玩家发言结束，3秒后进入黑夜...");
                        self.sender.onInfo("day",ColorHelper.colorHtml(ColorHelper.COLORS.DAY_COME,"所有玩家发言结束，3秒后进入黑夜..."));
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
                        self.sender.onInfo("day",ColorHelper.colorHtml(ColorHelper.COLORS.DAY_COME,"所有玩家发言结束，3秒后进入公决..."));
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
            var voteRes = voteCalc(self,isPK);
            if(voteRes===true) return;
            var strInfo = voteRes.info;
            var voteOuterPos = voteRes.highestPositions;
            if(isPK){
                PKNextStep();
            }else{
                nextStep();
            }
            function nextStep(){
                var pushStr ="";
                if(voteOuterPos.length === 0){
                    //TODO　推送３秒后进入黑夜提示
                    console.log("测试(push所有玩家)：游戏继续,无人上票，"+strInfo);
                    pushStr = ColorHelper.colorHtml(ColorHelper.COLORS.DAY_COME,"所有玩家弃票，游戏继续，3秒后直接进入黑夜...");
                    self.sender.onInfo("day",pushStr);
                    setTimeout(function(){
                        that.nightLoop();
                    },self.initInfo.timers.gap*1000);
                }else if(voteOuterPos.length === 1){
                    //TODO　推送公决结果和３秒后进入黑夜提示
                    console.log("测试(push所有玩家)：游戏继续，"+strInfo+"\n"+""+voteOuterPos[0]+"被公决出局...请留遗言(5秒/30秒)...");
                    pushStr = ColorHelper.colorHtml(ColorHelper.COLORS.NGT_COME,"唱票结果:")+"<br/>"+strInfo+"<br/>"+ColorHelper.colorHtml(ColorHelper.COLORS.NGT_COME,voteOuterPos[0]+"号被公决出局...等待请留遗言("+self.initInfo.timers.LstWdTime+"秒)...");
                    self.sender.voteRes(pushStr,voteOuterPos[0]);
                    self.runningInfo.listenArr.voteOuterLstWd = false;
                    var pastTime = 0;
                    var lastWdWaiter = setInterval(function(){
                        pastTime+=self.initInfo.timers.tick;
                        if(pastTime>=self.initInfo.timers.LstWdTime||self.runningInfo.listenArr.voteOuterLstWd === true){
                            clearInterval(lastWdWaiter);
                            //TODO 推送黑夜提醒：3秒后进入黑夜..."
                            console.log("测试(push所有玩家)：游戏继续，3秒后进入黑夜......");
                            pushStr = ColorHelper.colorHtml(ColorHelper.COLORS.DAY_COME,"游戏继续，3秒后进入黑夜...");
                            self.sender.counter(false);
                            self.sender.onInfo("day",pushStr);
                            setTimeout(function(){
                                that.nightLoop();
                            },self.initInfo.timers.gap*1000);
                        }
                    },self.initInfo.timers.tick*1000);

                }else if(voteOuterPos.length <= 3){
                    //TODO　推送投票结果和PK提示
                    console.log("测试(push所有玩家)：游戏继续，"+strInfo+"\n"+voteOuterPos+"依次PK，各发言5/45秒，"+"3秒后进入PK...");
                    self.sender.onInfo("day",ColorHelper.colorHtml(ColorHelper.COLORS.DAY_COME,"唱票结果:")+"<br/>"+strInfo+"<br/>"+ColorHelper.colorHtml("#ff0000",voteOuterPos.join("、")+"号")+"进入PK，依次发言"+self.initInfo.timers.PKTime+"秒，"+"3秒后进入PK...");
                    setTimeout(function(){
                        that.PKSpeakLoop(voteOuterPos);
                    },self.initInfo.timers.gap*1000);
                }else{
                    //TODO　推送投票结果和重新投票提示
                    console.log("测试(push所有玩家)：游戏继续，"+strInfo+"\n本轮多余3个玩家平票，投票作废，3秒后重新公决...");
                    pushStr = ColorHelper.colorHtml(ColorHelper.COLORS.DAY_COME,"唱票结果:")+"<br/>"+strInfo+"<br/>"+ColorHelper.colorHtml(ColorHelper.COLORS.DAY_COME,"本轮多余3个玩家平票，投票作废，3秒后重新公决...");
                    self.sender.onInfo("day",pushStr);
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
                    console.log("测试(push所有玩家)：游戏继续，"+strInfo+"\n"+""+voteOuterPos[0]+"被公决出局...请留遗言(5秒/30秒)...");
                    var pushStr = ColorHelper.colorHtml(ColorHelper.COLORS.NGT_COME,"唱票结果:")+"<br/>"+strInfo+"<br/>"+ColorHelper.colorHtml(ColorHelper.COLORS.NGT_COME,voteOuterPos[0]+"号被公决出局...等待请留遗言("+self.initInfo.timers.PKTime+"秒)...");
                    self.sender.voteRes(pushStr,voteOuterPos[0]);
                    self.runningInfo.listenArr.voteOuterLstWd = false;
                    var pastTime = 0;
                    var lastWdWaiter = setInterval(function(){
                        pastTime+=self.initInfo.timers.tick;
                        if(pastTime>=self.initInfo.timers.LstWdTime||self.runningInfo.listenArr.voteOuterLstWd === true){
                            clearInterval(lastWdWaiter);
                            //TODO 推送黑夜提醒：3秒后进入黑夜..."
                            console.log("测试(push所有玩家)：游戏继续，3秒后进入黑夜......");
                            pushStr = ColorHelper.colorHtml(ColorHelper.COLORS.DAY_COME,"游戏继续，3秒后进入黑夜...");
                            self.sender.counter(false);
                            self.sender.onInfo("day",pushStr);
                            setTimeout(function(){
                                that.nightLoop();
                            },self.initInfo.timers.gap*1000);
                        }
                    },self.initInfo.timers.tick*1000);
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
            var nightResult = nightCalc(self);
            that.specialLoop.afterNightLoop(nightResult,callback);
            var callbackFunction = function(){

            }


            var split = "<br/>"+ColorHelper.colorHtml(ColorHelper.COLORS.SPLIT,"第"+self.runningInfo.timeInfo.num+"天")+"<br/>";
            that.specialLoop.afterNightLoop(self.runningInfo.fleshArr.lastNgtDeads,function(){
                if(self.runningInfo.fleshArr.lastNgtDeads.length === 0){
                    strInfo = ColorHelper.colorHtml(ColorHelper.COLORS.NGT_COME,"<br/>...这是一个平安夜（游戏继续）...")+"<br/>"+split;
                    nextStep("speak",strInfo);
                }else{
                    if(self.runningInfo.fleshArr.lastNgtCanShoters.length ===0){
                        strInfo = "<br/>"+ColorHelper.colorHtml(ColorHelper.COLORS.NGT_COME,"...黑夜结果（游戏继续）：")+"<br/>"+nightResHtmlStr+"<br/>"+split;
                        nextStep("speak",strInfo);
                    }else{
                        strInfo ="<br/>"+ ColorHelper.colorHtml(ColorHelper.COLORS.NGT_COME,"...黑夜结果（游戏继续）：")+"<br/>"+nightResHtmlStr+"<br/>"+split;
                        nextStep("shoot",strInfo);
                    }
                }
            });
            function nextStep(type,strInfo){
                //测试通过：推送白天动画
                console.log("测试(push所有玩家):启动白天动画(5秒)...");
                self.sender.onAni("day");
                setTimeout(function(){
                    self.sender.dayJobInfo();
                },200);
                setTimeout(function(){
                    //测试通过：推送白天结果
                    console.log("测试(push所有玩家)："+strInfo);
                    self.sender.onInfo("nightRes",strInfo);
                    if(deathArr.length>=0){
                        setTimeout(function(){
                            //TODO 测试通过：推送白天结果
                            console.log("测试(push所有玩家)死亡结果："+deathArr);
                            self.sender.onDie(deathArr);
                        },200);
                    }
                    setTimeout(function(){
                        if(type==="speak"){
                            that.speakLoop();
                        }else if(type==="shoot"){
                            that.shootLoop();
                        }
                    },1000);//这里要延时一秒，否则连续两个onInfo消息push到客户端会导致无法解析。
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
                clearTimeout(shootTimeEndWaiter);
                clearInterval(gameEndWaiter);
            }
            function nextStep(){
                stopAllWaiters();
                self.sender.counter(false);
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

    //for test
    this.runGame()
//    //入口函数
//    console.log("测试(push所有玩家):游戏已经启动，进入4秒倒计时...");
//    setTimeout(function(){
//        self.runGame();
//    },4000);

    this.print = function(){
        console.log("=====================打印游戏内存信息=============================");
        console.log(self.runningInfo);
        console.log(self.runningInfo.quickArr.jobExistList[0]);
    }
}

var testPrint = function(str){
    console.log(str);
}