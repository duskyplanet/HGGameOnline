var express = require('express');
var app = express();

app.configure(function(){
	app.use(express.methodOverride());
	app.use(express.bodyParser());
	app.use(app.router);
	app.set('view engine', 'jade');
	app.set('views', __dirname + '/public');
	app.set('view options', {layout: false});
	app.set('basepath',__dirname + '/public');
});

app.configure('development', function(){
	app.use(express.static(__dirname + '/public'));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
	var oneYear = 31557600000;
	app.use(express.static(__dirname + '/public', { maxAge: oneYear }));
	app.use(express.errorHandler());
});

function counter(interval,length,flag,interFnc,lastFnc,lastInterFlag,immFlag){
    var outFlag = flag;
    var actor = null;
    var restLength = length;
    if(outFlag === true){return;}
    if(immFlag&&(typeof interFnc === "function")){
        interFnc();
    }
    actor = setInterval(function(){
        eval("outFlag = "+ flag+";");
        if(outFlag === true){clearInterval(actor);return;}
        restLength -= interval;
        if(restLength<=0){
            if(typeof lastFnc === "function"){
                lastFnc();
            }
            if(lastInterFlag&&(typeof interFnc === "function")){
                interFnc();
            }
            clearInterval(actor);
        }else{
            if(typeof interFnc === "function"){
                interFnc();
            }
        }
    },interval*1000);
}

function simCounter(interval,length,flag,interFnc,lastFnc){
    counter(interval,length,flag,interFnc,lastFnc,false,false);
}

var speakTurn = function(speakId){
    console.log("推送消息:"+speakId+"号玩家请发言...");
};
var nightLoop = function(){
    console.log("进入黑夜了!")
};
var voteLoop = function(){
    console.log("开始投票了!")
};
//变量
var stopFlag = false;
var turnTime = 5;
var deafultTime = 15;
var maxSave = 50;
var speakOverNum = 0;

var daySpeakSender = function(){
    var speakers = [3,4,5,6,8,9];
    var speakerNum = speakers.length;
    var maxListenTime = (speakers.length-1) * turnTime + deafultTime+maxSave;
    //发言
    var sendNext = function(speakId){
        speakTurn(speakId);
        speakers.splice(0,1);
    };
    sendNext(speakers[0]);
    //依次发言
    var sendLooper = setInterval(function(){
        if(speakers.length>0){
            sendNext(speakers[0]);
        }else{
            clearInterval(sendLooper);
        }
    },turnTime*1000);
    //最后发言者发言结束监听器
    var endListener = setInterval(function(){
        if(speakerNum<=speakOverNum){
            console.log("监听到所有玩家都发言结束事件...");
            clearInterval(endListener);
            clearInterval(sendLooper);
            clearInterval(dayStopListener);
            voteLoop();
        }
    },200);
    //TODO总时间可能有问题
    var restLength = maxListenTime;
    var dayStopListener = setInterval(function(){
        if(stopFlag === true){
            clearInterval(dayStopListener);
            clearInterval(endListener);
            clearInterval(sendLooper);
            console.log("监听到跳过白天事件...");
            nightLoop();
            return;
        }
        restLength -= 0.2;
        if(restLength<=0){
            console.log("监听到最长发言时限已到...");
            clearInterval(dayStopListener);
            clearInterval(endListener);
            clearInterval(sendLooper);
            nightLoop();
        }
    },200);
};

//测试：
daySpeakSender();
//每个玩家发言defaultTime
setTimeout(function(){
    setInterval(function(){speakOverNum++},turnTime*1000);
},10000);
//突然有几个玩家在最后时刻全部点了save
setTimeout(function(){
    speakOverNum+=3;
},26000);
//在某个时刻突然监听到大主教发动技能
//setTimeout(function(){
//    stopFlag = true;
//},15000);

//计时器
var time =0;
setInterval(function(){
    time++;
    console.log(time+":"+speakOverNum);
},1000);

console.log("Web server has started.\nPlease log on http://127.0.0.1:3001/index.html");
app.listen(3001);
