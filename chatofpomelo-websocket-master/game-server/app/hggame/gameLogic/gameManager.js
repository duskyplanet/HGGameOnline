var Game = require("./game").Game;
var gameList = [];

exports.startGame = function(roomInfo,pusher){
    gameList[roomInfo.rid] = new Game(roomInfo,pusher);
};