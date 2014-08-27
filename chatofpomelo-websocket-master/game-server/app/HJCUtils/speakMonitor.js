exports.SpeakMonitor = function SpeakMonitor(){
    this.time = 2000;
    this.speakers = new Array();
    this.findSpeaker = function(nick){

        var self = this;
        for(var i = 0;i<self.speakers.length;i++){
            if(nick === self.speakers[i]) return true;
        }
        return false;
    };
    this.speak = function(nick){
        var self = this;
        if(this.findSpeaker(nick)==false){
            self.speakers.push(nick);
            setTimeout(function(){
                self.resume(nick);
            },self.time);
            return true;
        }else{
            return false;
        }
    };
    this.resume = function(nick){
        var self = this;
        for(var i = 0;i<self.speakers.length;i++){
            if(nick === self.speakers[i]){
                self.speakers.splice(i,1);
                break;
            }
        }
    }
}