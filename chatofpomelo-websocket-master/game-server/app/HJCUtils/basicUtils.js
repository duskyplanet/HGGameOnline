exports.isString = function(str){
    if(typeof str == "string") return true;
    return false;
}

exports.isNumeric = function(num){
    if(typeof num == "number") return true;
    return false;
}

exports.isEmpty = function(obj){
    if(obj == undefined || obj == null || obj == "") return true;
    return false;
}

exports.randomInt =  function(num1,num2){
    return Math.floor(Math.random() * (num2 - num1 + 1) +num1);
}

exports.getProperties  = function (obj){
    return Object.getOwnPropertyNames(obj);
}