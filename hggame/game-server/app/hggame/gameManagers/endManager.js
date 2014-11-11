exports.endManager = function endManager(game,winParty){
    setTimeout(function(){
        console.log("结束了:"+winParty);
        game.sender.onEnd();
    },game.initInfo.timers.tick*1000);

};