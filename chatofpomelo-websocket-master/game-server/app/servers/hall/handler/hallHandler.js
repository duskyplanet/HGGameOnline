var hallName = "hall";

module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
    this.channelService = app.get('channelService');
    this.hall = this.channelService.getChannel(hallName, false);
};

var handler = Handler.prototype;

/**功能2.1 大厅内公共聊天接口*/
handler.hlChat = function(msg, session, next) {
    console.log("hall(hlChat) 玩家:"+session.uid+" 发送消息-"+msg.content);
	var nick = session.uid;
    var content = msg.content;
	var param = {
		msg: content,
		from: nick
	};
    this.hall.pushMessage('onHlChat', param);
	next(null, {
		code:200
	});
};


//测试用方法
function printProperties(obj){
    var propertiesArr = Object.getOwnPropertyNames(obj);
    console.log(propertiesArr);
}
