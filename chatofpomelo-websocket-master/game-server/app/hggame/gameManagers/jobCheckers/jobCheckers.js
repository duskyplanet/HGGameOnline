var GameInfo = require("../../basicGameInfo/GameInfo");

exports.checkAlienOut = function checkAlienOut(dies){
    var res = false;
    var alienOut = [];
    for(var i = 0; i<dies.length;i++){
        if(dies[i].myParty === GameInfo.PartyInfo.THD){
            res = true;
            alienOut.push(dies[i]);
        }
    }
    return {res:res,aliens:alienOut};
};