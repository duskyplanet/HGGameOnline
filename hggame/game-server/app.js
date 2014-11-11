var pomelo = require('pomelo');
var routeUtil = require('./app/util/routeUtil');

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'chatofpomelo-websocket');

// app configuration
app.configure('production|development', 'connector', function(){
	app.set('connectorConfig',
		{
			connector : pomelo.connectors.hybridconnector,
			heartbeat : 3,
			//useDict : true,
			useProtobuf : true
		});
});

app.configure('production|development', 'gate', function(){
	app.set('connectorConfig',
		{
			connector : pomelo.connectors.hybridconnector,
			useProtobuf : true
		});
});

// app configure
app.configure('production|development', function() {
	// route configures
	app.route('room', routeUtil.room);
    app.route('hall', routeUtil.hall);
	// filter configures
	app.filter(pomelo.timeout());
});

// start app
app.start();
//tester();

process.on('uncaughtException', function(err) {
	console.error(' Caught exception: ' + err.stack);
});

//just for test
function tester(){
    var game = require('./app/hggame/gameLogic/game').Game;
    var g;
    setTimeout(function(){
        g = new game(testRoomInfo,null);
    },5000);

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
            getNickList: function(){return [null,"ONE","TWO","THREE","FOUR","FIVE","SIX","SEVEN","EIGHT","NINE",null,"ELEVEN","TWELVE"];}
        },//房间内座位
        readyList : {
            list:[null,true,true,true,true,true,true,true,true,true,false,true,true]
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

    //计时器
    var time =0;
    setTimeout(function(){
        setInterval(function(){
            time++;
            console.log("时间："+time);
        },1000);},5000);


    //一号测试组：从第一个黑夜开始+顺序发言
    //使得game获得初始值：
    //initAlloctRes.partyList = [1,1,1,1,1,1,1,2,2,2,2];
    //self.runningInfo.quickArr.survHmnNum = 7;
    //self.runningInfo.quickArr.survGstNum = 4;
    //self.runningInfo.quickArr.survAlnNum = 0;
    setTimeout(function() {

        //第一夜刀人
        setTimeout(function () {
            g.receivers.nightSkillTo("ONE", 1, 11);
        }, 10000);
        setTimeout(function () {
            g.receivers.nightSkillTo("EIGHT", 1, 9);
        }, 10500);
        setTimeout(function () {
            g.receivers.nightSkillTo("NINE", 1, 2);
        }, 11000);
        //第二天开枪
        setTimeout(function () {
            g.receivers.shootTo("TWO",8);
        }, 23000);
        //第二天结束发言：
        setTimeout(function () {
            g.receivers.save("NINE",12);
            g.receivers.save("ELEVEN",12);
            g.receivers.save("TWELVE",12);
        }, 48000);

    //第二天投票
        setTimeout(function () {
            g.receivers.voteTo("THREE",11);
            g.receivers.voteTo("FOUR",11);
            g.receivers.voteTo("SIX",3);
            g.receivers.voteTo("SEVEN",3);
            g.receivers.voteTo("FIVE",11);
            g.receivers.voteTo("TWELVE",3);
            g.receivers.voteTo("ELEVEN",99);
        }, 54000);
    //第二天PK
        setTimeout(function () {
            g.receivers.voteTo("THREE",11);
            g.receivers.voteTo("FOUR",99);
            g.receivers.voteTo("SIX",99);
            g.receivers.voteTo("SEVEN",99);
        }, 72000);
        setTimeout(function () {
            g.receivers.voteTo("FIVE",99);
            g.receivers.voteTo("TWELVE",99);
            g.receivers.voteTo("ELEVEN",99);
        }, 73000);

    //第二天黑夜行动
        setTimeout(function () {
            g.receivers.nightSkillTo("THREE", 1, 4);
            g.receivers.nightSkillTo("TWELVE", 1, 7);
        }, 87000);

        setTimeout(function () {
            g.receivers.shootTo("SEVEN", 4);
        }, 102000);

        setTimeout(function () {
            g.receivers.voteTo("FIVE",12);
            g.receivers.voteTo("SIX",99);
            g.receivers.voteTo("TWELVE",5);
        }, 126000);

        setTimeout(function () {
            g.receivers.voteTo("FIVE",12);
            g.receivers.voteTo("SIX",12);
            g.receivers.voteTo("TWELVE",5);
        }, 148000);

        //第二天PK
    //
    //    setTimeout(function () {
    //        g.receivers.voteTo("ONE",12);
    //        g.receivers.voteTo("TWO",12);
    //        g.receivers.voteTo("THREE",12);
    //        g.receivers.voteTo("FOUR",11);
    //        g.receivers.voteTo("ELEVEN",12);
    //        g.receivers.voteTo("TWELVE",11);
    //    }, 40000);

    },5000);

    //setTimeout(function(){
    //    g.receiver.voteReceiver.voteTo("ONE",8);
    //},10000);
    //setTimeout(function(){
    //    g.receiver.voteReceiver.voteTo("TWO",8);
    //},11000);
    //setTimeout(function(){
    //    g.receiver.voteReceiver.voteTo("THREE",8);
    //},12000);
    //setTimeout(function(){
    //    g.receiver.voteReceiver.voteTo("EIGHT",1);
    //},13000);
    //setTimeout(function(){
    //    g.receiver.voteReceiver.voteTo("NINE",1);
    //},13500);

    //setTimeout(function(){
    //    g.receiver.nightSkillReceiver.skillTo("THREE",1,1);
    //},23500);
    //setTimeout(function(){
    //    g.receiver.nightSkillReceiver.skillTo("ONE",1,9);
    //},23600);
    //setTimeout(function(){
    //    g.receiver.nightSkillReceiver.skillTo("TWO",1,9);
    //},23700);
}


