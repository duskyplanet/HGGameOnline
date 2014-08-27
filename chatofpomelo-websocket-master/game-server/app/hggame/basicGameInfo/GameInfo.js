exports.JobInfo = {
    jobAbbr : ["njb","aln","dgl","cmd","rst","ast"],
    jobName : ["无职业","外星人","媚女郎","指挥官","抵抗军","潜行者"],
    getJobTtlNum : function(){ return this.jobAbbr.length; },
    getJobId : function(abbr){
        for(var i = 0;i< this.jobAbbr.length;i++){
            if(abbr==this.jobAbbr[i]){
                return i;
            }
        }
        console.log("JobInfo发生致命逻辑错误：发现不存在的职业简称！");
    },
    getJobNameById:function(id){
       return this.jobName[id];
    }
};
exports.PartyInfo = {
    HMN : 1,
    GST : 2,
    THD : 3,
    getPartyNameByNum:function(num){
        if(num === this.HMN){
            return "人类阵营";
        }else if(num === this.GST){
            return "鬼阵营";
        }else if(num === this.THD){
            return "第三方";
        }
    }
};
exports.EndInfo = {
    HMN : 1,
    GST : 2,
    THD : 3,
    EVE : 4,
    getEndNameByNum:function(num){
        if(num === this.HMN){
            return "人类阵营胜利";
        }else if(num === this.GST){
            return "鬼阵营胜利";
        }else if(num === this.THD){
            return "外星人胜利";
        }else if(num === this.EVE){
            return "人鬼平局";
        }
    }
};


