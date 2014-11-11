/**
 * 高级计时器：
 * @param interval      每隔interval秒执行一次
 * @param length        一共执行length秒时间
 * @param flag          指向“停止变量”的指针，必须为字符串，当其为true时，计时器立刻停止
 * @param interFnc      每个时间间隔执行的函数（指针）
 * @param lastFnc       时间结束后执行的函数（指针）
 * @param lastInterFlag 是否在最后还执行一次时间间隔函数
 * @param immFlag       是否在开始立刻执行一次时间间隔函数
 */
exports.counter = counter;
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

exports.simCounter = simCounter;
function simCounter(interval,length,flag,interFnc,lastFnc){
    counter(interval,length,flag,interFnc,lastFnc,false,false);
}
