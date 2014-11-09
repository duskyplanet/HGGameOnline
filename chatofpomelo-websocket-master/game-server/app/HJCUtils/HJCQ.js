exports.HJCQ = function HJC_Q(){
    var self = this;
    this.doId = 0;
    this.tasks = [];
    this.tasksDelays = [];
    this.add = function(task,delay){
        if(typeof task != "function"){  throw new Error("myQ用法错误：add的第一个参数需要是函数"); }
        else{this.tasks.push(task);}
        if(delay!=undefined){
            if(typeof delay != "number"){ throw new Error("myQ用法错误：add的第二个参数需要是数字");}
            else{this.tasksDelays.push(delay);}
        }
    }
    this.do = function(){
        if(self.tasks.length != self.tasksDelays.length + 1 ){
            throw new Error("myQ用法错误：至少有一个任务,最后一个任务不应该赋时间");
        }
        self.tasks[self.doId]();
        if(self.doId+1===self.tasks.length) return;
        setTimeout(function(){
            self.doId++;
            self.do();
        },self.tasksDelays[self.doId])
    }
}
