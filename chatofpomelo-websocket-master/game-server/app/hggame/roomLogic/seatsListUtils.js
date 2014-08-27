exports.seatList = function seatList(scaleNum){
    this.list =  new Array(scaleNum+1);
    this.set = function(index,user){
        this.list[index] = user;
    }
    this.get = function(index){
        return this.list[index];
    }
    this.count = function(){
        return this.list.length;
    }
    this.findMin = function(){
        for(var i = 1; i<this.list.length;i++){
            if(this.list[i]==null||this.list[i]==undefined){
                return i;
            }
        }
        return 0;
    }
    this.removeByNick = function(nick){
        var result = false;
        for(var i = 0; i<=this.list.length;i++){
            if(!!this.list[i]){
                if(this.list[i].nick === nick){
                    this.list[i] == null;
                    result = true;
                    break;
                }
            }
        }
        return result;
    }
}