var PlayerInfo = require("../player").info;
var endChecker = require("../../gameManagers/calcManager/endChecker").endChecker;
var hjcArr = require("../../../HJCUtils/HJCArray");

exports.Receiver = function Receiver(game){
    this.game = game;

    //投票
    this.voteTo = function(nick,tarPosition){
        if(game.runningInfo.timeInfo.perid === game.runningInfo.timeInfo.PERID.VOTE){
            var srcPos = game.quickQuery.getPositionById(game.quickQuery.getIdByNick(nick));
            //TODO 特警不能被投？
            if(typeof srcPos ==="number"){
                var voterId = hjcArr.position(game.runningInfo.quickArr.survivals,srcPos);
                game.runningInfo.listenArr.voteToArr[voterId] = tarPosition;
                //console.log(srcPos);
                //console.log(voterId);
            }
        }else{
            //TODO
            console.log("投票时间已过");
        }
    };

    //夜晚技能
    this.nightSkillTo = function(nick,msg) {
        var targets = msg.targets;
        var skillType = msg.type;
        var skillInfo = msg.info;
        var player = game.runningInfo.playerListByPos[game.quickQuery.getPosByNick(nick)];
        if(targets.length!= 0 && targets[0] == 99) return; //黑夜我不行动；
        if (skillType === 1) {
//            if (game.runningInfo.timeInfo.perid != game.runningInfo.timeInfo.PERID.NIGHT) {
//                console.log("第一技能默认晚上发动，在非晚上收到技能被忽略");
//                return;
//            }
            if (player.fstSkl != null) {
                player.fstSkl.move(targets,skillInfo);
            }
        } else if (skillType === 2) {
            if (player.secSkl != null) {
                player.secSkl.move(targets,skillInfo);
            }
        } else if (skillType === 3) {
            if (player.thdSkl != null) {
                player.thdSkl.move(targets,skillInfo);
            }
        }
    };

    //开枪带走
    this.shootTo = function(nick,tarPos){
        var myId = game.quickQuery.getIdByNick(nick);
        var me = game.runningInfo.plyrList[myId];
        game.runningInfo.listenArr.shootToArr[hjcArr.position(game.runningInfo.fleshArr.lastNgtCanShoters,me.myPosition)] = tarPos;
        if(tarPos===99){
            game.recorder.add("shootTo",{srcPos:me.myPosition});
        }else{
            var tarId = game.quickQuery.getIdByPosition(tarPos);
            var target = game.runningInfo.plyrList[tarId];
            if(me.state.canShot === false){
                console.log("receiver发生致命逻辑错误，接收到不能开枪玩家发动开枪技能！");
                return;
            }
            if(target.isAlive === false){
                console.log("receiver发生时差错误，被开枪对象已经死去！");
                return {code:201,info:"开枪对象已死去..."};
            }
            me.state.haveShot = true;
            target.die(PlayerInfo.DIE_OF.SHOOT_OUT,me.myPosition);
            endChecker(game);
            //TODO push被开枪出局者信息
            console.log("测试(push所有玩家)："+tarPos+"被开枪带走...");
            game.recorder.add("shootTo",{srcPos:me.myPosition,tarPos:tarPos});
            game.sender.someBodyShot(me.myPosition,tarPos);
        }
    };

    this.save =function(nick,restSecs){
        var realID = game.quickQuery.getIdByNick(nick);
        var srcPos = game.quickQuery.getPositionById(realID);
        if(typeof srcPos ==="number"){
            game.runningInfo.listenArr.speakOverArr[realID] = true;
            game.runningInfo.fleshArr.saveTimes[realID]+=speakTimeToSaveTime(restSecs);
            if( game.runningInfo.fleshArr.saveTimes[realID]>300){
                game.runningInfo.fleshArr.saveTimes[realID]=300;
            }
        }
        function speakTimeToSaveTime(restSecs){
            var step = Math.floor(restSecs/game.initInfo.timers.nextTurn);
            var rest = restSecs%game.initInfo.timers.nextTurn;
            if(step>=2){
                console.log("receiver收到过高的的预留时间值")
                return Math.ceil((game.initInfo.timers.nextTurn*5)/6);
            }else if(step === 1){
                return Math.ceil(game.initInfo.timers.nextTurn/2 + rest/3);
            }else{
                return Math.ceil(rest/2);
            }
        }
        game.sender.onSave(restSecs,game.runningInfo.fleshArr.saveTimes[realID],srcPos);
    };

    this.overPK =function(nick){
        var realID = game.quickQuery.getIdByNick(nick);
        var srcPos = game.quickQuery.getPositionById(realID);
        if(typeof srcPos ==="number"){
            game.runningInfo.listenArr.nextPKOver = true;
            game.sender.onPKOver(srcPos);
        }
    };

    this.changeAutoSave = function(nick,type){
        var srcId = game.quickQuery.getIdByNick(nick);
        if(typeof srcId ==="number"){
            game.runningInfo.fleshArr.saveAuto[srcId] = type;
        }
    };

    this.useSave = function(nick){
        var realID = game.quickQuery.getIdByNick(nick);
        var srcPos = game.quickQuery.getPositionById(realID);
        if(typeof srcPos ==="number"){
            game.sender.useSave(srcPos);
        }
    };

    this.overSave = function(nick,restTime){
        var realID = game.quickQuery.getIdByNick(nick);
        var srcPos = game.quickQuery.getPositionById(realID);
        if(typeof srcPos ==="number"){
            var saveId = hjcArr.position(game.runningInfo.fleshArr.thisDayCanSpkrs,srcPos);
            game.runningInfo.listenArr.speakOverArr[saveId] = true;
            game.runningInfo.fleshArr.saveTimes[realID] = restTime;
            game.sender.overSave(srcPos,restTime);
        }
    };

    this.lastWord = function(nick,lastWord,type){
        var realID = game.quickQuery.getIdByNick(nick);
        var srcPos = game.quickQuery.getPositionById(realID);
        if(typeof srcPos ==="number"){
            game.sender.onLastWord(srcPos,lastWord);
        }
        //1开枪者的遗言 2公决者的遗言
        if(type===2){
            game.runningInfo.listenArr.voteOuterLstWd = true;
        }
    }
};