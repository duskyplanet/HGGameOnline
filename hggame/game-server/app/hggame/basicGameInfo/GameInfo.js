exports.JobInfo = {
    //          0       1        2        3      4      5        6        7        8        9        10     11       12       13       14       15       16       17       18       19      20        21       22    23     24        25      26      27       28       29       30       31       32       33       34       35     36     37     38      39        40        41       42      43
    jobAbbr : ["njb",   "aln",   "mgl",   "ass", "spy", "mgc",   "cmd",   "rst",   "bsp",   "gdn",   "fsr", "mtm",   "ist",   "dct",   "spl",   "cnr",   "psy",   "dtt",   "spm",   "ins",   "msc",   "bls",   "lsr","gds",  "svr",   "arb",   "gbl", "cns",   "rvl",   "ctc",   "tfr",   "avg",   "psr",   "ldr",   "agt",   "agl", "dmn", "wwf", "msr",  "phr",    "arc",   "sfz",    "grl",  "trn"],
    jobName : ["无职业","外星人","媚女郎","刺客","间谍","魔术师","指挥官","抵抗军","大主教","守护者","先知","数学家","挑拨者","治愈者","机械师","验尸官","通灵师","大侦探","代言人","启迪者","音乐家","祈福者","屌丝","女神","救世主","仲裁者","赌徒","阴谋家","革命家","评论家","千面人","复仇者","伤逝者","引路人","暗语者","天使","恶魔","狼人","守财奴","药剂师","神箭手","圣佛尊","鬼如来","驯兽师"],
    getJobTtlNum : function(){ return this.jobAbbr.length; },
    getJobId : function(abbr){
        for(var i = 0;i< this.jobAbbr.length;i++){
            if(abbr === this.jobAbbr[i]){
                return i;
            }
        }
        console.log("GameInfo错误：不存在的职业简称");
        return -1;
    },
    getJobNameById:function(id){
       if(typeof id != "number"||( id < 0 || id >= this.getJobTtlNum)){
           console.log("GameInfo错误：不存在的职业ID");
           return "不存在";
       }else{
           return this.jobName[id];
       }
    }
};

var PartyInfo = {
    HMN : 1,
    GST : 2,
    THD : 3,
    FTH : 4,
    getPartyNameByNum:function(num){
        if(num === this.HMN){
            return "人类阵营";
        }else if(num === this.GST){
            return "鬼阵营";
        }else if(num === this.THD){
            return "外域";
        }else if(num === this.FTH){
            return "狼族";
        }
    }
};
exports.PartyInfo = PartyInfo;

exports.EndInfo = {
    HMN : 1,
    GST : 2,
    THD : 3,
    FTH : 4,
    EVEN_HG : 5,
    EVEN_HGW : 6,
    getEndNameByNum:function(num){
        if(num === this.HMN){
            return "人类阵营胜利！";
        }else if(num === this.GST){
            return "鬼阵营胜利！";
        }else if(num === this.THD){
            return "外星人胜利！";
        }else if(num === this.FTH){
            return "狼族胜利！";
        }else if(num === this.EVEN_HG){
            return "人鬼平局！";
        }else if(num === this.EVEN_HGW){
            return "三族平局！";
        }
    }
};

exports.getMyWordFromPartyNum =  function(party,words,pics){
    if(words!=null || words!=undefined){
        if(party === PartyInfo.HMN){
            return words.hmnWord;
        }else if(party === PartyInfo.GST){
            return  words.gstWord;
        }else {
            return "无词汇"
        }
    }
};

exports.skillArrs = {
    1:"杀死",
    2:"先机",
    3:"色诱",
    4:"刺杀",
    5:"谍报",     //△开始
    6:"迷惑",
    7:"权威",//△发言
    8:"不屈",//△发言
    9:"审判",//△发言
    10:"守卫",
    11:"占卜",
    12:"推演",
    13:"煽动",
    14:"救赎",//△发言
    15:"防弹",//△开枪
    16:"鉴定",
    17:"还魂",
    18:"侦查",
    19:"代言",
    20:"启迪",
    21:"催眠",
    22:"祈祷",
    23:"信仰",
    24:"光辉",
    25:"救世",//△发言
    26:"裁决",//△公决
    27:"赌博",
    28:"诬陷",
    29:"牺牲",
    30:"舆论",//发言
    31:"汲取",
    32:"玉碎",
    33:"良知",
    34:"祭奠",
    35:"明灯",
    36:"私语",
    37:"神圣劝化",
    38:"圣灵再现",
    39:"嗜血屠戮",
    40:"邪魔附身",
    41:"感染",    //延迟逻辑
    42:"兽性",    //延迟逻辑
    43:"贪婪",    //延迟逻辑
    44:"毒剂",    //延迟逻辑
    45:"强弓",    //延迟逻辑
    46:"佛光护体",//延迟逻辑
    47:"立地成佛",//延迟逻辑
    48:"择日涅槃",//延迟逻辑
    49:"大杀特杀",//延迟逻辑
    50:"立地成鬼",//延迟逻辑
    51:"择日归去"//延迟逻辑
};