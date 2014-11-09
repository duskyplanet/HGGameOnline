exports.jumpDayChecker = function jumpDayChecker(self){
    var survNum = self.runningInfo.quickArr.survivals.length;
    if(survNum ===2){
        return true;
    }else if(survNum === 1){
        console.log("jumpDayCheck发现致命逻辑错误：只剩一人存活但是游戏未结束...(应该是开枪造成游戏结束了)");
        return false;
    }else{
        return false;
    }
};