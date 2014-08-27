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
    this.nightSkillTo = function(nick,type,tarPosition) {
        var plyr = game.runningInfo.plyrList[game.quickQuery.getIdByNick(nick)];
        var tarId = game.quickQuery.getIdByPosition(tarPosition);
        var res = true;
        if (type === 1) {
            if (game.runningInfo.timeInfo.perid != game.runningInfo.timeInfo.PERID.NIGHT) {
                console.log("第一技能默认晚上发动，在非晚上收到技能被忽略");
                return;
            }
            if (plyr.fstSkl != null) {
                plyr.fstSkl.move(tarId);
            } else {
                res = false;
            }
        } else if (type === 2) {
            if (plyr.secSkl != null) {
                plyr.secSkl.move(tarId);
            } else {
                res = false;
            }
        } else if (type === 3) {
            if (plyr.thdSkl != null) {
                plyr.thdSkl.move(tarId);
            } else {
                res = false;
            }
        }
        if (res == false) {
            console.log("game发生致命逻辑错误：允许前端" + nick + "玩家发动不存在技能：" + type);
            res = true;
        }
    };

    //开枪带走
    this.shootTo = function(nick,tarPos){
        var myId = game.quickQuery.getIdByNick(nick);
        var me = game.runningInfo.plyrList[myId];
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
        game.runningInfo.listenArr.shootToArr[hjcArr.position(game.runningInfo.fleshArr.lastNgtCanShoters,me.myPosition)] = tarPos;
        me.state.haveShot = true;
        target.die(PlayerInfo.DIE_OF.SHOOT_OUT);
        var endRes = endChecker(game);
        if(endRes === true) return;
        //TODO push被开枪出局者信息
        console.log("测试(push所有玩家)："+tarPos+"被开枪带走...");
    };

    this.save =function(nick,restSecs){
        var srcPos = game.quickQuery.getPositionById(game.quickQuery.getIdByNick(nick));
        if(typeof srcPos ==="number"){
            var saveId = hjcArr.position(game.runningInfo.fleshArr.thisDayCanSpkrs,srcPos);
            game.runningInfo.listenArr.speakOverArr[saveId] = true;
        }
    }
};