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
exp.room = function(session, msg, app, cb) {
    var roomServers = app.getServersByType('room');
    if(!roomServers || roomServers.length === 0) {
        cb(new Error('can not find room servers.'));
        return;
    }
    //相同rid的玩家将被发配到同一个房间
    var room = dispatcher.dispatch(session.get('rid'), roomServers);
    cb(null, room.id);
};