exports.seatList = function seatList(scaleNum){
    this.list =  new Array(scaleNum+1);
    this.set = function(index,user){
        this.list[index] = user;
    };
    this.get = function(index){
        return this.list[index];
    };
    this.count = function(){
        return this.list.length;
    };
    this.findMin = function(){
        for(var i = 1; i<this.list.length;i++){
            if(this.list[i]==null||this.list[i]==undefined){
                return i;
            }
        }
        return 0;
    };
    this.findNextHoster = function(nick){
        for(var i = 1; i<this.list.length;i++){
            if(this.list[i]!=null&&this.list[i]!=undefined&&this.list[i].nick!=nick){
                return {name:this.list[i].nick,position:i};
            }
        }
        return null;
    };
    this.removeByNick = function(nick){
        var result = false;
        for(var i = 1; i<this.list.length;i++){
            if(!!this.list[i]){
                if(this.list[i].nick === nick){
                    this.list[i] = null;
                    result = true;
                    break;
                }
            }
        }
        return result;
    };
    this.getPositionByNick = function(nick){
        for(var i = 1; i<this.list.length ;i++){
            if(!!this.list[i]) {
                if (nick === this.list[i].nick) {
                    return i;
                }
            }
        }
        return 0;
    };
    this.getNickList = function(){
        var res = [null];
        for(var i = 1; i<this.list.length;i++ ){
            if(!!this.list[i]){
                res.push(this.list[i].nick);
            }else{
                res.push(null);
            }
        }
        return res;
    };
    this.getTargetsByPos = function(){
        var res = [null];
        for(var i =1; i<this.list.length;i++ ){
            if(!!this.list[i]){
                res.push({uid: this.list[i].nick, sid: this.list[i].fid});
            }else{
                res.push(null);
            }
        }
        return res;
    };
};