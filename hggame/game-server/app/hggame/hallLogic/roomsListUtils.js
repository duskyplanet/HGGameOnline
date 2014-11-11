var configs = require("../../../config/HGGameConfig").configs;
exports.RoomList = function RoomList(){
    this.list =  new Array(configs.maxRooms);
    this.set = function(index,obj){
        this.list[index] = obj;
    };
    this.get = function(index){
        return this.list[index];
    };
    this.count = function(){
        return this.list.length;
    };
    this.remove = function(index){
        this.list[index] = null;
    };
    this.findMin = function(){
        for(var i = 1; i<this.list.length;i++){
            if(this.list[i]==null||this.list[i]==undefined){
                return i;
            }
        }
        return 0;
    }
};