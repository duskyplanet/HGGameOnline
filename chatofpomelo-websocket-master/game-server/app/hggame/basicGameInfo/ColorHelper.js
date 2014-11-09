var colors ={
    SPLIT:"white",
    DAY_COME:"#23dcfd",
    ON_TURN:"#23fd6b",
    ON_SAVE:"#a869fe",
    ON_USE_SAVE:"#ff9c00",
    ON_OVER_SAVE:"#a869fe",
    NGT_COME:"#ff2467",
    ALERT:"red",
    ON_LAST_WORD:"#777777"
};

exports.getColorByJobId = function(jobId){
    switch (jobId){
        //    jobName : ["无职业","外星人","媚女郎","刺客","间谍","魔术师","指挥官","抵抗军","大主教","保镖","先知","道士","挑拨者","医生","特警","验尸官","通灵师","侦探","代言人","启迪者","催眠师","祈福者","屌丝","女神","救世主","仲裁者","赌徒","阴谋家"],
        case 0: return "#ffffff"; break;    //无职业
        case 1: return "#7e00ff"; break;    //外星人
        case 2: return "#ff00cc"; break;    //媚女郎
        case 3: return "#555555"; break;    //刺客
        case 4: return "#00ff00"; break;    //间谍
        case 5: return "#aeaeae"; break;    //魔术师
        case 6: return "#0000ff"; break;    //指挥官
        case 7: return "#ff6600"; break;    //抵抗军
        case 8: return "#ffff00"; break;    //大主教
        case 9: return "#006666"; break;    //保镖
        case 10: return "#663300"; break;    //先知
        case 11: return "#00cccc"; break;    //道士
        case 12: return "#ff9999"; break;    //挑拨者
        case 13: return "#0000ff"; break;    //医生   //从这里开始颜色未定义
        case 14: return "#0000ff"; break;    //特警
        case 15: return "#0000ff"; break;    //验尸官
        case 16: return "#0000ff"; break;    //通灵师
        case 17: return "#0000ff"; break;    //侦探
        case 18: return "#0000ff"; break;    //代言人
        case 19: return "#0000ff"; break;    //启迪者
        case 20: return "#0000ff"; break;    //催眠师
        case 21: return "#0000ff"; break;    //祈福者
        case 22: return "#0000ff"; break;    //屌丝
        case 23: return "#0000ff"; break;    //女神
        case 24: return "#0000ff"; break;    //救世主
        case 25: return "#0000ff"; break;    //仲裁者
        case 26: return "#0000ff"; break;    //赌徒
        case 27: return "#0000ff"; break;    //阴谋家
        case 35: return "#ffffff"; break;    //天使
        default : console.log("未发现职业对应的颜色");
    }
};

exports.getColorByPartyId = function(partyID){
    switch (partyID){
        case 1: return "#ffffff"; break;
        case 2: return "#777777"; break;
        case 3: return "#7e00ff"; break;
        default : console.log("未发现阵营对应的颜色");
    }
};


exports.COLORS = colors;

exports.colorHtml = function colorHtml(type,content){
    if(type===colors.SPLIT){
        return "<font color='"+type+"'>= = = = = ="+content+"= = = = = =</font>";
    }else{
        return "<font color='"+type+"'>"+content+"</font>";
    }
};