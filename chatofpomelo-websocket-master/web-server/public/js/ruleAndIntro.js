$(function(){
    /**background&intro**/
    var $backgroundContent =$("#backgroundContent");
    $backgroundContent.html(backgroundHtml);
    var $gameIntros =$("#gameIntros");
    $gameIntros.html(gameIntroHtml);
    /**gameRule**/
    var $rules_identity = $("#rules_identity");
    var $rules_course = $("#rules_course");
    var $rules_resultJdg = $("#rules_resultJdg");
    var $rules_ngtMove = $("#rules_ngtMove");
    var $rules_other = $("#rules_other");
    var $rules_buttons = $(".rules_btn");
    var $rules_contents = $(".rules_content");
    var $lines = $(".rules_line");
    for(var i = 0; i < $rules_buttons.length; i++){
        $($rules_buttons[i]).bind('click',i,function(event){
            var selectId = event.data;
            var $line = $(event.target).parent();
            clearAll();
            $line.attr('class','rules_line active');
            var $content = $line.next();
            $content.toggle(1000);
        });
    }
    function clearAll(){
        for( var i = 0; i < $lines.length;i++){
            $($lines[i]).attr('class','rules_line');
        }
    }
   $rules_identity.html(rulesIdentityHtml);
   $rules_course.html(rulesCourseHtml);
   $rules_resultJdg.html(rules_resultJdgHtml);
   $rules_ngtMove.html(rules_ngtMoveHtml);
   $rules_other.html(rules_otherJdgHtml);
});

var backgroundHtml = "      传说，在古老的东方大陆上，有一个神奇的国度，拥有着各种能力的人们世代在这里安居乐业。" +
    "<br/>      然而，一场突如其来的大灾难打破了这里的安宁：一种神秘的病毒开始在人群中传播，每当黑夜降临被感染的人群便会化成强壮的嗜血恶魔，无法控制自己的行为肆意残杀其他人类，他们便是"+ fontRed("“鬼族”")+"。"+
    "<br/>      鬼族为了生存混杂在人群中，并很好地伪装了自己。人类的伤亡越来越大，却始终无法找到一个有效的辨认方法。一时间，恐惧和猜忌蔓延在人群之中，中土大地危在旦夕……" +
    "<br/>      在这生死存亡之际，一位伟大的先知站了出来，他和上帝签订了一项契约，用自己的牺牲换来全人类的救赎。先知死后，他的血液变成为"+fontRed("一种神奇的颜料，用它写出来的字或者画出的画在人类和鬼族眼中会呈现出不同的结果。")+
    "<br/>      终于，人类空前地团结了起来，向鬼族宣战；而鬼族也不甘示弱，加紧了对人类的屠杀。就在硝烟燃起，人鬼大战正酣时，一群觊觎这块富饶土地很久的更加可怕的生物正悄悄地入侵……";

var gameIntroHtml = "      《人鬼殊途Online》是一款集娱乐、休闲、竞技为一体的多人在线游戏。游戏规则由浅入深，角色丰富多彩，集合四大阵营近四十款职业，玩法千变万化。在这里，你可以："+
    "<br/>" +
    "<br/>      ● 锻炼自己的推理和逻辑分析能力……" +
    "<br/>      ● 发挥自己的想象力，施展自己的口才和煽动力……"+
    "<br/>      ● 休闲娱乐，结识许多拥有共同爱好的朋友……"+
    "<br/>      ● 学到更多的知识，了解更多的领域……"+
    "<br/>      ● 领略团队合作的重要意义……"+
    "<br/>"+
    "<br/>      这里不是侦探小说，却充满了悬疑等待你的破解；这里不是恐怖电影，却暗藏杀机、危机四伏。不到最有一刻，你永远猜不到答案……是带领队友，众志成城，走向胜利？还是悄悄潜伏在敌人中，忍辱负重，力王狂澜？" +
    fontRed("Your Choice！尽在《人鬼殊途Online》~");

var rulesIdentityHtml = "<p>      系统将产生一对字数相等的平行词（或相似图片），并将其中之一分配给每一名玩家。"
    +"属于多数派的为“人类”，否则为“鬼”。例如：8位玩家参加游戏，系统产生平行词："+fontWaterGreen("“苹果”")+"（5人）  vs  "+fontOrange("“香蕉”")+"（3人）。则：获得"+fontWaterGreen("“苹果”")+
    "的玩家为“人类”,获得"+fontOrange("“香蕉”")+"的玩家为“鬼”。<br/><br/>如图：<br/><div id = 'rules_pic'></p></div><div id='rules_word'>平行词为字数相等、有关联的词汇，诸如："+
    "<br/>1、同义词："+vs("老鼠","耗子")+"；  "+ vs("男人","汉子")+
    "<br/>2、近义词："+vs("爱慕","仰慕")+"；  "+ vs("心不在焉","三心二意")+
    "<br/>3、反义词："+vs("兴高采烈","垂头丧气")+"；  "+ vs("聚合","分离")+
    "<br/>4、对应词："+vs("高富帅","白富美")+"；  "+ vs("湖南","湖北")+
    "<br/>5、同类别词："+vs("法兰西","英吉利")+"；  "+ vs("麦当劳","肯德基")+
    "<br/><br/>"+
    "相似图片，为有关联的图片，诸如：<br/>"+
    "<div id='rules_pix'></div></div>";

var rules_resultJdgHtml = "     游戏胜负判定遵循：" +
    "<br/>1、人类阵营或鬼阵营中一方玩家全部出局 "+fontOrange("→")+" 另一方获胜。"+
    "<br/>2、在同一个环节中所有存活玩家全部出局 "+fontOrange("→")+" 人鬼平局。"+
    "<br/>3、连续两个昼夜（即：“白天→黑夜→白天→黑夜” 或者 “夜晚→白天→夜晚→白天”）均无玩家出局或复活 "+fontOrange("→")+" 人鬼平局。"+
    "<br/>"+fontRed("注意：")+
    "<br/>"+fontRed("★")+"如果有外星人（游戏中的第三方）或狼族（游戏中的第四方）在场，"+fontRed("优先遵循他们的胜利条件。")+
    "<br/>"+fontRed("★")+"在人鬼平局的时候，如果外星人依旧存活，"+fontRed("算外星人胜利")+"，其他阵营皆输。";

var rulesCourseHtml = "<p>游戏按照：白天 → 黑夜 → 白天 → 黑夜 → …… 交替进行直到一方胜利。"+
    "<br/>白天阶段：所有玩家依次发言一圈，结束后进行投票公决（每个人可选择投一票或不投票），当天得票最高者出局。"+
    "<br/>夜黑阶段：所有玩家可以根据对自己的身份判断而选择"+fontRed("“杀死一个目标”")+"或不行动，但只有鬼杀人才有效。"+
    "<br/>"+fontRed("说明：")+"：" +
    "<br/>"+fontRed("★")+"游戏的第一个白天没有公决阶段，直接进入黑夜，以后的每个白天都有公决阶段且只公决一人出局。"+
    "<br/>"+fontRed("★")+"黑夜被鬼阵营玩家杀死的人类玩家，在白天到来时优先发动技言，详见"+fontWaterGreen("【夜晚行动】")+"。"+
    "<br/>"+fontRed("★")+"黑夜白天，拥有特殊职业的玩家可以发动其“职业技能”，详见"+fontWaterGreen("【职业全解】")+"。"+
    "</p>";

var rules_ngtMoveHtml = "<p>"+fontWaterGreen("【技言权利】（人类的基本权利）")+"：" +
    "指人类在夜晚被鬼"+fontRed("[杀死]")+"，在天亮该玩家出局时可以留下遗言，并发动开枪技能和场上任意一位存活玩家同归于尽（在该也可以选择不开抢带人）。" +
    "<br/>"+fontWaterGreen("【杀人有效】（鬼的基本权利）")+"：" +
    "指在夜晚只有鬼使用" +fontRed("[杀死]")+"目标才会出局，而人类使用"+fontRed("[杀死]")+"不但无效而且会导致自己出局。"+
    "<br/><br/>"+
    "黑夜行动判定原则："+
    "<br/>1、鬼使用"+fontRed("[杀死]")+"既有效（目标必出局，即使鬼也可能被同伴误杀）。"+
    "<br/>2、人使用"+fontRed("[杀死]")+"必无效（目标不受任何影响，人类自己会出局，且无技能和遗言）。"+
    "<br/>3、黑夜未使用"+fontRed("[杀死]")+"的人类，若被鬼"+fontRed("[杀死]")+"白天会被系统宣布有技言权利。"+
    "<br/>说明：<br/>" +
    "普通玩家可以在黑夜在"+fontRed("“杀死”")+"和“不行动”中二选一，拥有特殊职业的玩家加上“职业技能”三选一。"+
    "<br/><br/>"+fontOrange("友情提醒：")+"<br/>"+fontOrange("       玩家首先需要通过白天全场的发言快速判断自己的身份（若和自己描述相似的玩家较多，则自己是人类的可能性大，反之鬼的可能性大），再根据自己的阵营选择行动方式。若是") +
    fontOrange("人类：白天要选择和多和同伴抱团，一起找出鬼并将其票除。黑夜千万不能使用")+fontRed("[杀死]")+fontOrange("，要选择“不行动”，即使鬼在夜晚")+fontRed("[杀死]")+fontOrange("你，也可以在白天开枪带走你怀疑的目标。")+
    fontOrange("若是鬼：则在白天要伪装好自己，往大多数人的阵营里面钻，避免树敌，夜晚则果断起刀")+fontRed("[杀死]")+fontOrange("人类，并嫁祸于别人。")+
    "</p>";
var rules_otherJdgHtml = "<p>其他-尚未添加内容</p>";

function fontRed(chars){
    return "<span class='red'>"+chars+"</span>";
}

function fontWaterGreen(chars){
    return "<span class='waterGreen'>"+chars+"</span>";
}

function fontOrange(chars){
    return "<span class='orange'>"+chars+"</span>";
}

function vs(word1,word2){
    return fontWaterGreen(word1)+"  vs  "+fontOrange(word2);
}