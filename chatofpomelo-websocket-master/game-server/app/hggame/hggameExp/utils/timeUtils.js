exports.doOnce = function(callback,delay){
    if(typeof delay != "number" || typeof callback != "function"){
        throw new Error("timeUtils：错误的参数形式");
    }
    setTimeout(callback,delay);
}

exports.doCircle = function(callback,delay,interval,times){
    if(typeof delay != "number" ||typeof interval != "number" || typeof callback != "function"){
        throw new Error("timeUtils：错误的参数形式");
    }
    if(times == undefined){
        setTimeout(function(){
            callback();
            setInterval(callback,interval);
        },delay);
    }else if(typeof times =="number"){
        if(times == 0)return;
        setTimeout(function(){
            callback();
            var rest = times - 1;
            var circle = setInterval(function(){
                if( rest> 0 ){ callback(); rest--;}
                else{clearInterval(circle);}
            },interval);
        },delay);
    }else return;
}