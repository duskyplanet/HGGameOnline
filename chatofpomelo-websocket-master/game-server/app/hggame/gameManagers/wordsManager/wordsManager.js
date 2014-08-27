//该类用于生成双阵营词汇和先机提示范围
var basicUtils =  require("../../../HJCUtils/basicUtils");
var hjcArr = require("../../../HJCUtils/HJCArray");
//wordsDB
var fun = require("./wordsDB/fun").words;
var history = require("./wordsDB/history").words;
var phrase = require("./wordsDB/phrase").words;

var standardDB = [fun,history,phrase];


exports.getWordsWithoutArgs = function(){
    var selectDB = rdmDB(standardDB);
    return rdmWords(selectDB);
};

function rdmDB(arr){
    var rdmRes = arr[basicUtils.randomInt(0,arr.length-1)];
    //让大词库有更高的几率被选中
    if(basicUtils.randomInt(0,200) > rdmRes.length){
        return rdmDB(arr);
    }else{
        return rdmRes;
    }
};

function rdmWords(selectDB){
    var selectWords = selectDB[basicUtils.randomInt(0,selectDB.length-1)];
    var wordsArr = selectWords.split("_");
    var alnWord = wordsArr[0];
    hjcArr.shuffle(wordsArr.splice(0,1));
    var hmnWord = wordsArr[0];
    var gstWord = wordsArr[1];
    return {
        alnWord:alnWord,
        hmnWord:hmnWord,
        gstWord:gstWord
    };
}

//测试
//getWordsWithoutArgs();
