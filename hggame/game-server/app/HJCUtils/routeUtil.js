var exp = module.exports;
var dispatcher = require('./dispatcher');

//exp.hall = function(session, msg, app, cb) {
//    var chatServers = app.getServersByType('hall');
//
//    if(!chatServers || chatServers.length === 0) {
//        cb(new Error('can not find hall servers.'));
//        return;
//    }
//
//    var res = dispatcher.dispatch(session.get('rid'), chatServers);
//
//    cb(null, res.id);
//};

exp.hall = function(session, msg, app, cb) {
    var hallServers = app.getServersByType('hall');
    if(!hallServers || hallServers.length === 0) {
        cb(new Error('can not find hall servers.'));
        return;
    }
    //hall已经确定，只可能是确定的一个
    cb(null, hallServers[0].id);
};

exp.game = function(session, msg, app, cb) {
    var gameServers = app.getServersByType('game');
    if(!gameServers || gameServers.length === 0) {
        cb(new Error('can not find game servers.'));
        return;
    }
    //相同rid的玩家将被发送到同一个gameServer
    var server = dispatcher.dispatch(session.get('rid'), gameServers);
    cb(null, server.id);
};