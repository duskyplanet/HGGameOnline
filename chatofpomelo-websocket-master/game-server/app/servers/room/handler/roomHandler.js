var hallName = "hall";

module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
};

var handler = Handler.prototype;


handler.send = function(msg, session, next) {
	var nick = session.uid;
	var channelService = this.app.get('channelService');
	var param = {
		msg: msg.content,
		from: nick,
		target: msg.target,
        title:"新兵"
	};
	var hall = channelService.getChannel(hallName, false);
	if(msg.target == '*') {
        hall.pushMessage('onChat', param);
	}
//    //the target is specific user
//	else {
//		var tuid = msg.target;
//		var tsid = channel.getMember(tuid)['sid'];
//		channelService.pushMessageByUids('onChat', param, [{
//			uid: tuid,
//			sid: tsid
//		}]);
//	}
	next(null, {
		code:200,
        info:"already send..."
	});

//    console.log("-------------------------channelService属性------------------------------")
//    printProperties(channelService);
//    console.log(channelService);
//    console.log("-------------------------channel属性------------------------------")
//    printProperties(channel);
//    console.log(channel);
};

function printProperties(obj){
    var propertiesArr = Object.getOwnPropertyNames(obj);
    console.log(propertiesArr);
}
