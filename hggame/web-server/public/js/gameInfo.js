var JOBS_INFO = {
    ABBR : ["njb",   "aln",   "mgl",   "ass", "spy", "mgc",   "cmd",   "rst",   "bsp",   "gdn",   "fsr", "mtm",   "ist",   "dct",   "spl",   "cnr",   "psy",   "dtt",   "spm",   "ins",   "msc",   "bls",   "lsr","gds",  "svr",   "arb",   "gbl", "cns",   "rvl",   "ctc",   "tfr",   "avg",   "psr",   "ldr",   "agt",   "agl", "dmn", "wwf", "msr",  "phr",    "arc",   "sfz",    "grl","trn"],
    NAME : ["无职业","外星人","媚女郎","刺客","间谍","魔术师","指挥官","抵抗军","大主教","守护者","先知","数学家","挑拨者","治愈者","机械师","验尸官","通灵师","大侦探","代言人","启迪者","音乐家","祈福者","屌丝","女神","救世主","仲裁者","赌徒","阴谋家","革命家","评论家","千面人","复仇者","伤逝者","引路人","暗语者","天使","恶魔","狼人","守财奴","药剂师","神箭手","圣佛尊","鬼如来","驯兽师"]
};

function getJobRulesById(selectId){
    var jobAbbr = JOBS_INFO.ABBR[selectId + 1];
    switch(jobAbbr){
        case "aln": return "外星人属于第三方，开局时无身份词汇/图片，夜晚不可杀人，死后无技言。"+
            "<br/>外星人的胜利条件：当场上存活玩家数降至总人数的一半或以下时，若外星人依旧存活，则外星人胜利，其他阵营皆输。<br/>补充说明：<br/>1、平局时如果外星人依旧在场，优先算外星人胜利。<br/>2、殇逝者出局时如果外星人在场，外星人即刻获胜。";
        case "mtm": return "1、游戏开始时数学家不获得己方阵营的身份词汇/图片。<br/>2、游戏开始时数学家自动获得一次<span class='color greenYellow'>[推演]</span>信息：自己和任意一名玩家的阵营关系。";
        case "dtt": return "游戏进入第一个夜晚时，大侦探将知晓所有在场的职业（不包含外星人和狼人）。";
        case "lsr": return "同一局游戏中，屌丝和女神必定同时登场，且开局时屌丝将会知道谁是自己的女神。";
        case "gds": return "同一局游戏中，屌丝和女神必定同时登场，且开局时女神的身份（玩家号码）将被屌丝知晓。";
        case "psr": return "殇逝者必属于人阵营（夜晚不可以使用<span class='color red'>[杀死]</span>，但拥有人类阵营的技言权利）。<br/>殇逝者开局时不获得任何身份词汇/图片。<br/>殇逝者出局时如果外星人在场，外星人即刻获胜。";
        case "agl": return "天使必属于人类阵营（获得人类阵营词汇/图片），但开局时其职业提示为：圣婴。<br/>圣婴状态的天使无任何技能，可被杀死，死后无技言。只有在降临条件到达时，天使才能获得其职业技能。<br/>降临条件：<br/>1、当场上存活的人类阵营玩家数量降至（除天使外的）一半或以下时。<br/>2、圣婴态天使受到启迪师<span class='color greenBlue'>[启迪]</span>后的黎明。<br/>3、游戏进入第三/四个黑夜(12人局/18人局)。";
        case "dmn": return "恶魔必属于鬼阵营（获得鬼阵营词汇/图片），但开局时其职业提示为：圣婴。<br/>圣婴状态的恶魔无任何技能，可被杀死，死后无技言。只有在觉醒条件到达时，恶魔才能获得其职业技能。<br/>觉醒条件：<br/>1、当场上存活的鬼阵营玩家数量降至（除恶魔外的）一半或以下时。<br/>2、圣婴态恶魔受到启迪师<span class='color greenBlue'>[启迪]</span>后的黎明。<br/>3、游戏进入第三/四个黑夜(12人局/18人局)。";
        case "wwf": return "游戏中会有少量狼人同时登场（狼人在第一个白天会知道所有同伴身份）。<br/>狼人属于狼族(第四方)，不获得身份词汇/图片，狼族胜利则其他所有阵营失败。<br/>狼人不受到职业启迪。<br/>凡狼人存在的游戏，第奇数夜晚将会出现月圆之夜（所有人都能知道），且狼人在月圆职业获得其职业技能。";
        case "sfz": return "御天圣母属于人类阵营，开局时获得人类阵营词汇/图片，并必与鬼狱魔僧同时登场。";
        case "grl": return "鬼狱魔僧属于鬼阵营，开局时获得鬼阵营词汇/图片，并必与御天圣母同时登场。";
        default :return "   测试用的第一职业技能图标";
    }
}

function getJobForbiddenById(selectId){
    var jobAbbr = JOBS_INFO.ABBR[selectId + 1];
    var forbidden = "<span class='color bold'>职业禁锢:</span><br/>";
    switch(jobAbbr){
        case "mgl": return forbidden+"1、媚女郎无法<span class ='color pink'>[色诱]</span>自己和已出局玩家。<br/>2、人类媚女郎从<span class ='color pink'>[色诱]</span>到鬼阵营玩家的当晚开始因为“堕落”而丧失技言权利；鬼媚女郎从误杀队友的下一晚开始因为“懊悔”而不能再使用<span class='red'>[杀死]</span>。";
        case "ass": return forbidden+"在自身存活的前提下，每局游戏潜行者限用一次</span><span class ='color lightYellow'>[刺杀]</span>。";
        case "spy": return forbidden+"1、间谍不知道己方阵营的词汇/图片。<br/>2、第一个夜晚间谍无己方阵营的基本权利(不能使用<span class='color red'>[杀死]</span>，且死后无技言)。";
        case "mgc": return forbidden+"魔术师不可以连续两晚<span class ='color magenta'>[迷惑]</span>同一名玩家。";
        case "cmd": return forbidden+"在自身存活的前提下，每局游戏指挥官限用一次<span class ='color blue'>[权威]</span>，且票权只能用在当天公决阶段。";
        case "rst": return forbidden+"每局游戏抵抗军只有一次<span class ='color orange'>[不屈]</span>机会。";
        case "bsp": return forbidden+"1、在自身存活的前提下，每局游戏大主教限用一次<span class ='color yellow'>[审判]</span>。<br/>2、误判将会导致大主教自己出局。";
        case "gdn": return forbidden+"守护者不可以连续两晚<span class ='color greenBlue'>[守卫]</span>同一名玩家。";
        case "fsr": return forbidden+"在自身存活的前提下，每局游戏先知限用一次<span class ='color orangeRed'>[占卜]</span>。";
        case "mtm": return forbidden+"为了获得<span class='color greenYellow'>[推演]</span>的能力，数学家需要放弃知晓所在阵营的词汇/图片信息。";
        case "ist": return forbidden+"1、在自身存活的前提下，每局游戏挑拨者限用一次<span class='color darkPurple'>[煽动]</span>。<br/>2、从成功发动<span class='color darkPurple'>[煽动]</span>的当晚开始，挑拨者丧失所在阵营的基本权利。";
        case "dct": return forbidden+"1、在自身存活的前提下，每局游戏治愈者限用一次<span class='color pink'>[急救]</span>。<br/>2、治愈者无法<span class='color pink'>[急救]</span>出局过久的目标（只能是上个公决阶段到这个白天之间的出局者）。<br/>3、<span class='color pink'>[急救]</span>不可指向已出局外星人。";
        case "spl": return forbidden+"每局游戏机械师只有一次<span class ='color lightBlue'>[防弹]</span>机会。";
        case "cnr": return forbidden+"1、验尸官不可以连续两晚<span class='color lightYellow'>[鉴定]</span>同一名玩家。<br/>2、验尸官不可以<span class='color lightYellow'>[鉴定]</span>自己。";
        case "psy": return forbidden+"<span class='color orangeRed'>[还魂]</span>不能作用于存活玩家，且两种效果只能选其一。";
        case "spm": return forbidden+"代言人不可以连续两晚<span class='color green'>[代言]</span>同一名玩家。";
        case "msc": return forbidden+"音乐家不可以连续两晚<span class='color orangeYellow'>[催眠]</span>同一名玩家。";
        case "bls": return forbidden+"在自身存活的前提下，每局游戏祈福者限用一次<span class ='color lightYellow'>[祈祷]</span>。";
        case "svr": return forbidden+"发动<span class ='color yellow'>[救世]</span>将导致救世主自己出局。";
        case "gbl": return forbidden+"搏命家通过<span class='color orange'>[下注]</span>获得的额外生命不可累加。";
        case "cns": return forbidden+"阴谋家不可以连续两晚<span class ='color magenta'>[诬陷]</span>同一名玩家。";
        case "tfr": return forbidden+"千面人只能<span class='color orange'>[汲取]</span>存活玩家的职业技能，且后<span class='color orange'>[汲取]</span>到的技能覆盖先<span class='color orange'>[汲取]</span>到的技能。";
        case "psr": return forbidden+"殇逝者在开局时不知道人类阵营的身份词汇/图片。";
        case "agt": return forbidden+"在自身存活的前提下，每局游戏暗语者限用一次<span class ='color lightRed'>[私语]</span>。";
        case "phr": return forbidden+"药剂师不可以连续两晚<span class ='color greenYellow'>[致残]</span>同一名玩家。";
        case "arc": return forbidden+"神箭手的<span class ='color skyBlue'>[强弓]</span>效果只能叠加一层。";
        case "sfz": return forbidden+"1、每局游戏在御天圣母存活的前提下限用一次<span class ='color yellow'>[正道皈依]</span>。<br/>2、<span class ='color yellow'>[正道皈依]</span>和<span class ='color yellow'>[神祗庇佑]</span>不可在同一晚使用。<br/>3、<span class ='color yellow'>[正道皈依]</span>和<span class ='color darkGreen'>[立地成魔]</span>在同一个夜晚指向同一目标则无效。";
        case "grl": return forbidden+"1、每局游戏在鬼狱魔僧存活的前提下限用一次<span class ='color darkGreen'>[立地成魔]</span>。<br/>2、<span class ='color darkGreen'>[立地成魔]</span>和<span class ='color darkGreen'>[嗜血屠戮]</span>不可在同一晚使用。<br/>3、<span class ='color darkGreen'>[立地成魔]</span>和<span class ='color yellow'>[正道皈依]</span>在同一个夜晚指向同一目标则无效。";;
        default :return "   测试用的第一职业技能图标";
    }
}

function getBasicSkillIcon(){
    return "<span class='skill basicKill'/>";
}

function getBasicSkillInfo(){
    return "每晚你可以<span class ='color red'>[杀死]</span>一名存活玩家，若你是鬼则目标出局（鬼阵营基本权利），若你是人则自己出局。"+
        "<br/>夜晚未行动却被<span class ='color red'>[杀死]</span>的人类阵营玩家白天有技言权利（人类阵营基本权利，即留下遗言并开枪带走一名存活玩家）。";
}

function getFirstSkillIconById(selectId){
    var jobAbbr = JOBS_INFO.ABBR[selectId + 1];
    switch(jobAbbr){
        case "aln": return "<span class='skill firstKnow'/>";
        case "mgl": return "<span class='skill seduce'/>";
        case "ass": return "<span class='skill assassin'/>";
        case "spy": return "<span class='skill intelligence'/>";
        case "mgc": return "<span class='skill confuse'/>";
        case "cmd": return "<span class='skill authority'/>";
        case "rst": return "<span class='skill resistance'/>";
        case "bsp": return "<span class='skill judge'/>";
        case "gdn": return "<span class='skill protect'/>";
        case "fsr": return "<span class='skill predict'/>";
        case "mtm": return "<span class='skill calculate'/>";
        case "ist": return "<span class='skill provoke'/>";
        case "dct": return "<span class='skill save'/>";
        case "spl": return "<span class='skill proof'/>";
        case "cnr": return "<span class='skill certify'/>";
        case "psy": return "<span class='skill psychic'/>";
        case "dtt": return "<span class='skill detect'/>";
        case "spm": return "<span class='skill represent'/>";
        case "ins": return "<span class='skill enlighten'/>";
        case "msc": return "<span class='skill hypnosis'/>";
        case "bls": return "<span class='skill bless'/>";
        case "lsr": return "<span class='skill belief'/>";
        case "gds": return "<span class='skill brilliance'/>";
        case "svr": return "<span class='skill redeem'/>";
        case "arb": return "<span class='skill arbitration'/>";
        case "gbl": return "<span class='skill gamble'/>";
        case "cns": return "<span class='skill frame'/>";
        case "rvl": return "<span class='skill sacrifice'/>";
        case "ctc": return "<span class='skill comment'/>";
        case "tfr": return "<span class='skill change'/>";
        case "avg": return "<span class='skill avenge'/>";
        case "psr": return "<span class='skill conscienceFST'/>";
        case "ldr": return "<span class='skill lead'/>";
        case "agt": return "<span class='skill argot'/>";
        case "agl": return "<span class='skill persuade'/>";
        case "dmn": return "<span class='skill slaughter'/>";
        case "wwf": return "<span class='skill infect'/>";
        case "msr": return "<span class='skill greed'/>";
        case "phr": return "<span class='skill poison'/>";
        case "arc": return "<span class='skill bow'/>";
        case "sfz": return "<span class='skill rebound'/>";
        case "grl": return "<span class='skill blood'/>";
        case "trn": return "<span class='skill smell'/>";
        default :return "   测试用的第一职业技能图标";
    }
}

function getFirstSkillInfoById(selectId){
    var jobAbbr = JOBS_INFO.ABBR[selectId + 1];
    var basicKill = "<span class ='color red'>[杀死]</span>";
    switch(jobAbbr){
        case "njb": return null;
        case "aln": return "开局时你可以选择其一：<br/>"+
            "1、获得范围提示(包含人鬼双阵营身份词汇/图片)和职业提示(选职模式中未登场的职业)。<br/>"+
            "2、无任何提示，但你若提前出局可以猜词/选图：若你在三次机会中猜出人鬼双方阵营词汇/两次机会中选出人鬼双方阵营图片，则你依然胜利，其他阵营皆输。";
        case "mgl": return "夜晚你可以放弃"+basicKill+"而选择<span class ='color pink'>[色诱]</span>一名存活玩家，黎明时你将知道其所在的阵营。";
        case "ass": return "夜晚你可以放弃"+basicKill+"而选择<span class ='color lightYellow'>[刺杀]</span>一名存活玩家，因被<span class ='color lightYellow'>[刺杀]</span>出局者都无技言。";
        case "spy": return "游戏开局时，你放弃己方阵营词汇/图片，以此换得对方阵营词汇/图片。";
        case "mgc": return "每晚你可以放弃"+basicKill+"而选择<span class ='color magenta'>[迷惑]</span>一名存活玩家，当晚其行使的一切技能(包括<span class ='color red'>[杀死]</span>)视为无效。<br/>补充说明：<br/>1、目标“行动无效”即相当于目标点击“不行动”。<br/>2、除所有神技外，魔术师的<span class ='color magenta'>[迷惑]</span>拥有最高优先级（<span class ='color magenta'>[迷惑]</span>指向的目标不可被<span class ='color green'>[代言]</span>和<span class ='color purple'>[煽动]</span>；使用<span class ='color magenta'>[迷惑]</span>的魔术师自身不受到<span class ='color magenta'>[迷惑]</span>和<span class ='color purple'>[煽动]</span>的影响。";
        case "cmd": return "你可以在白天自己的发言环节宣布为指挥官，并发动<span class ='color blue'>[权威]</span>。<br/>你会因为自己的德高望重的威严，在公决阶段手握场上存活玩家数量一半的票数权（向上取整且至少为两票）。";
        case "rst": return "白天若你成为被公决的对象，因不屈服于众人的决议，你将不必出局。<span class ='color orange'>[不屈]</span>发动之后的夜晚，抵抗军不能成为"+basicKill+"指向的对象。<br/>补充说明：<span class ='color orange'>[不屈]</span>由系统自动发动。";
        case "bsp": return "你可以在白天自己的发言环节宣布为大主教，并选择一名玩家发动<span class ='color yellow'>[审判]</span>，当天将无公决阶段而直接进入黑夜:<br/>1、若对方已出局：他（她）和你同阵营将被救活，否则你误判。<br/>2、若对方还存活：他（她）和你异阵营将被判死，否则你误判。<br/>补充说明：<br/>1、被<span class ='color yellow'>[审判]</span>出局者等同于被公决，可以留下遗言。<br/>2、被<span class ='color yellow'>[审判]</span>救活者不会恢复出局前的技言状态。<br/>3、<span class ='color yellow'>[审判]</span>不可指向于已出局外星人。";
        case "gdn": return "每晚你可以放弃"+basicKill+"而选择<span class='color greenBlue'>[守卫]</span>一名存活玩家（包括自己），当晚该玩家可以抵御（除神技外的）一次外来致死伤害。<br/>补充说明：<br/>1、人类黑夜自己起刀致死不属于外来伤害，<span class='color greenBlue'>[守卫]</span>无效。<br/>2、同时遭到"+basicKill+"、<span class ='color lightYellow'>[刺杀]</span>等多次伤害，<span class='color greenBlue'>[守卫]</span>无效，但<span class='color greenBlue'>[守卫]</span>优先抵挡来自职业技能造成的伤害。";
        case "fsr": return "某晚你可以放弃"+basicKill+"而选择进行一次<span class='color orangeRed'>[占卜]</span>，若使用在第一晚你将在黎明时知晓自己的阵营，否则你在黎明时获得如下信息：<br/>1、当晚场上各个阵营存活数量（人、鬼、外域、狼族）。<br/>2、天使、恶魔、圣佛尊、鬼如来、启迪者是否出场及当前状态。";
        case "mtm": return "每晚你可以放弃"+basicKill+"而选择进行一次<span class='color greenYellow'>[推演]</span>，黎明时你将知道场上随机一名存活玩家与上一次被<span class='color greenYellow'>[推演]</span>玩家的阵营异同关系。若某晚你未使用<span class='color greenYellow'>[推演]</span>或已经没有可<span class='color greenYellow'>[推演]</span>的目标，黎明时刻你会获得自己的身份词汇/图片，但因打破了推导的延续性你将永久失去<span class='color greenYellow'>[推演]</span>能力。";
        case "ist": return "某晚你可以放弃"+basicKill+"而选择两位存活玩家进行<span class='color darkPurple'>[煽动]</span>：<br/>当夜他们行使的一切技能（除神技和<span class ='color magenta'>[迷惑]</span>外）无效并视为相互使用了"+basicKill+"。<br/>补充说明：<br/>挑拨者自身不受<span class='color darkPurple'>[煽动]</span>。";
        case "dct": return "你可以在白天自己的发言环节宣布为治愈者，并选择一名已出局玩家发动<span class='color pink'>[急救]</span>，该玩家立刻复活，并能参与当天的发言（若未到其发言位置）和投票。";
        case "spl": return "白天若你成为出局者开枪带走的目标，因拥有钢铁般的身躯，你不必出局。<span class='color lightBlue'>[防弹]</span>发动的当天，机械师不能成为公决阶段的被投票对象。<br/>补充说明：<span class ='color lightBlue'>[防弹]</span>由系统自动发动。";
        case "cnr": return "每晚你可以放弃"+basicKill+"而选择<span class='color lightYellow'>[鉴定]</span>一名玩家：<br/>1、若他（她）已出局，你将获得其阵营信息。<br/>2、若他（她）尚且存活且死于当晚，凶手的名单将在白天公布于众。";
        case "psy": return "每晚你可以放弃"+basicKill+"而选择<span class='color orangeRed'>[还魂]</span>一名已出局玩家，并选择其一：<br/>1、他（她）可以在下一个白天参与发言。<br/>2、他（她）可以在下一个白天参与投票。";
        case "dtt": return "每晚你可以放弃"+basicKill+"而选择<span class='color skyBlue'>[侦查]</span>一名玩家（包含已出局玩家），黎明时知道其职业信息（包含外星人和狼人）。";
        case "spm": return "每晚你可以放弃"+basicKill+"而选择<span class='color green'>[代言]</span>一名存活玩家：<br/>当晚该玩家移除身上所受的一切外来效果（除神技和<span class ='color magenta'>[迷惑]</span>外），并叠加与你相同的一切外来效果（除神技外）。<br/>补充说明:<br/>代言人自身不受<span class='color green'>[代言]</span>。";
        case "ins": return "每晚你可以放弃"+basicKill+"而选择<span class='color greenBlue'>[启迪]</span>一名存活玩家：若该玩家有职业，黎明时即刻获得其启迪技能。<br/>补充说明:<br/>1、任何职业只可被<span class='color greenBlue'>[启迪]</span>一次，重复启迪效果不叠加。<br/>2、启迪者可以<span class='color greenBlue'>[启迪]</span> 自己，并获得启迪技能。<br/>3、外星人和狼人无启迪技能，不受<span class='color greenBlue'>[启迪]</span>影响。<br/>4、圣婴受到<span class='color greenBlue'>[启迪]</span>即刻降临为天使或觉醒为恶魔。";
        case "msc": return "每晚你可以放弃"+basicKill+"而选择<span class='color orangeYellow'>[催眠]</span>一名存活玩家，并选择其一：<br/>1、他（她）在下一个白天不能发动技能且不能参与发言。<br/>2、他（她）在下一个白天不能发动技能且不能参与公决投票。";
        case "bls": return "某晚你可以放弃"+basicKill+"而选择进行一次<span class='color lightYellow'>[祈祷]</span>，并选择如下之一：<br/>1、当天夜晚所有玩家无视致死伤害。<br/>2、下一个白天所有玩家无视致死伤害。<br/>补充说明：<br/>1、<span class='color lightYellow'>[祈祷]</span>成功发动的夜晚：所有致死伤害无效（神技除外），自杀性技能-<span class='color red'>[牺牲]</span>、<span class='color yellow'>[救世]</span>、<span class='color purple'>[玉碎]</span>无法成功发动。<br/>2、<span class='color lightYellow'>[祈祷]</span>成功发动的白天：所有开枪带人无效，当天无公决阶段，自杀性技能-<span class='color purple'>[玉碎]</span>无法成功发动。";
        case "lsr": return "若你和女神同阵营，只要她存活，<span class='color skyBlue'>[信仰]</span>将使你无视一切致死伤害（除神技外）；若你和女神异阵营，只要她出局，你将为其陪葬。<br/>补充说明：<br/><span class='color skyBlue'>[信仰]</span>由系统自动发动。";
        case "gds": return "若你和屌丝同阵营，只要你存活，你的<span class='color red'>[光辉]</span>将使屌丝无视一切致死伤害；若你和屌丝异阵营，只要你出局，屌丝将为你陪葬。<br/>补充说明：<br/><span class='color red'>[光辉]</span>由系统自动发动。";
        case "svr": return "某晚你可以放弃"+basicKill+"而选择发动<span class='color yellow'>[救世]</span>，或白天在你的发言环节可以宣布为救世主并发动<span class='color yellow'>[救世]</span>，你将即刻出局并无技言。<br/>若你是场上你所在阵营最后一名存活者，在你出局时可以指定任意3名已出局玩家(不包含自己)即刻复活。<br/>补充说明：<br/>1、因<span class='color yellow'>[救世]</span>而出局的优先级高于一切因外来伤害而出局的优先级。<br/>2、被<span class='color yellow'>[救世]</span>复活者不会恢复出局前的技言状态。<br/>3、<span class='color yellow'>[救世]</span>可以指定少于3人复活。";
        case "arb": return "白天公决阶段，若场上出现平票，你可以立刻宣布为仲裁者并发动<span class='color grey'>[裁决]</span>，并选择其一：<br/>1、本轮公决作废，直接进入黑夜。<br/>2、本轮公决有效，指定一名PK者立刻出局。";
        case "gbl": return "每晚你可以放弃"+basicKill+"而选择进行一次<span class='color orange'>[下注]</span>，你选择一个数字(0-9)，如果到下次进入黑夜时出局的玩家数量正好等于此数，你获得额外一条生命。<br/>补充说明：<br/>1、搏命家知道自己是额外的生命状态。<br/>2、搏命家的额外生命优先抵挡来自技能造成的伤害。";
        case "cns": return "每晚你可以放弃"+basicKill+"而选择<span class='color magenta'>[诬陷]</span>一名存活玩家，在下一个白天的公决阶段，该玩家自动获得额外的两票。<br/>补充说明：<br/>所有人都会在黎明时刻知道谁被<span class='color magenta'>[诬陷]</span>。";
        case "rvl": return "某晚你可以放弃"+basicKill+"而选择<span class='color red'>[牺牲]</span>，你会出局，但无论你所属何阵营出局时都会有技言。<br/>补充说明：<br/>因<span class='color red'>[牺牲]</span>而出局的优先级高于一切因外来伤害而出局的优先级。";
        case "ctc": return "你可以在白天自己的发言环节宣布为评论家，并发动<span class='color skyBlue'>[舆论]</span>，因为你的至理名言得到大家的认可，此后的白天发言都不受时限。";
        case "tfr": return "每晚你可以放弃"+basicKill+"而选择<span class='color orange'>[汲取]</span>一名存活玩家，从黎明开始你将获得其职业技能（若有），该职业技能将一直保持直到你再次成功使用<span class='color orange'>[汲取]</span>。<br/>补充说明：<br/>1、千面人重复<span class='color orange'>[汲取]</span>技能不会将状态刷新（比如使用次数限制）。<br/>2、千面人、殇逝者、外星人、狼人和所有神职不受<span class='color orange'>[汲取]</span>。";
        case "avg": return "某晚你可以放弃"+basicKill+"而选择一名存活玩家发动<span class='color purple'>[玉碎]</span>，白天在你的发言环节也可以宣布为复仇者并指定一名存活玩家发动<span class='color purple'>[玉碎]</span>，你和目标将即刻出局并无技言。<br/>补充说明:<br/>因<span class='color purple'>[玉碎]</span>而出局的优先级高于一切因外来伤害而出局的优先级。";
        case "psr": return "若你在夜晚出局，当晚所有对你造成伤害的玩家在以后的夜晚都不能行动。";
        case "ldr": return "<span class='color lightYellow'>[明灯]</span>使你天生拥有如下能力：<br/>1、若你属于人类阵营，则黑夜使用"+basicKill+"无效但不会导致自己死亡；白天开枪误带无效。<br/>2、若你属于鬼阵营，则黑夜使用"+basicKill+"无法误杀队友。";
        case "agt": return "游戏的第X个夜晚，你可以放弃"+basicKill+"而选择使用<span class='color lightRed'>[私语]</span>，黎明时刻将会有随机X个同阵营玩家知道他（她）们与你同阵营。<br/>补充说明：<br/>暗语者自身并不知道哪些玩家会收到<span class='color lightRed'>[私语]</span>。";
        case "agl": return "每晚你可以<span class='color white'>[神圣劝化]</span>一名存活玩家：<br/>1、若他（她）属于鬼阵营，其当晚指向性技能全部失效。<br/>2、若他（她）属于人类阵营，其当晚不会因为任何行动而导致自己死亡。<br/>补充说明：<br/><span class='color white'>[神圣劝化]</span>对神职无效，但若恶魔也<span class='color grey'>[魔王指定]</span>了天使，则两者同归于尽，无技言。";
        case "dmn": return "每晚你可以<span class='color grey'>[魔王指定]</span>一名存活玩家：<br/>1、若他（她）属于鬼阵营，将不受任何影响。<br/>2、若他（她）属于其他阵营，则无视一切保护效果而出局，且无技言权利。<br/>补充说明：<br/><span class='color grey'>[魔王指定]</span>对神职无效，但若天使也<span class='color white'>[神圣劝化]</span>了恶魔，则两者同归于尽，无技言。";
        case "wwf": return "月圆之夜，你可以选择<span class='darkGreen'>[感染]</span>一名玩家（被感染者自己不知道），当场存在狼族且除狼族外所有的存活玩家都被感染时，狼族即刻获胜。";
        case "msr": return "因为对财富的<span class='color lightYellow'>[贪婪]</span>，本局游戏守财奴失败不扣除积分，胜利获得双倍积分和金钱。（与双倍积分卡或双倍财富卡同时使用可以产生四倍效果）。";
        case "phr": return "每晚你可以放弃"+basicKill+"而选择<span class='color greenYellow'>[致残]</span>一名存活玩家（不包括自己），当晚和下一个黎明该玩家将丧失其所在阵营的基本权利。";
        case "arc": return "神箭手拥有<span class='color skyBlue'>[强弓]</span>蓄力、一击致命的能力：若你在白天公决环节选择“不投票”，则下一个公决环节你一票抵两票；若你在黑夜选择“不行动”，则下一个黑夜你可以使用两次"+basicKill+"。";
        case "sfz": return "每晚你可以对一名存活玩家使用<span class ='color yellow'>[神祗庇佑]</span>，该玩家永久获得如下能力：若在夜晚受到伤害，则有50%的概率移除该伤害并反弹给伤害来源（除神技外）。";
        case "grl": return "每晚你可以对一名存活玩家使用<span class ='color darkGreen'>[嗜血屠戮]</span>，该玩家永久获得如下能力：<br/>1、若有职业（不包括神职和殇逝者），则每晚在使用职业技能的同时也可以使用<span class ='color red'>[杀死]</span>。<br/>2、若无职业，则每晚有50%概率可以使用两次<span class ='color red'>[杀死]</span>。";
        case "trn": return "每个黎明若你存活，只要在你两边的玩家（依次直到存活者）中有与你阵营相异者，你训练有素的宠兽便会<span class='color orangeRed'>[警觉]</span>并向你发出提示。";
        default :return "测试用的第一技能详细解释";
    }
}

function getSecondSkillIconById(selectId){
    var jobAbbr = JOBS_INFO.ABBR[selectId + 1];
    switch(jobAbbr){
        case "psr": return "<span class='skill conscienceSND'/>";
        case "agl": return "<span class='skill persuadeEnlighten'/>";
        case "dmn": return "<span class='skill slaughterEnlighten'/>";
        case "wwf": return "<span class='skill beast'/>";
        case "sfz": return  "<span class='skill turnHmn'/>";
        case "grl": return  "<span class='skill turnGst'/>";
        default : return "测试用的第二职业技能图标";
    }
}

function getSecondSkillInfoById(selectId){
    var jobAbbr = JOBS_INFO.ABBR[selectId + 1];
    switch(jobAbbr){
        case "psr": return "若你在白天出局，场上所有玩家将即刻失去自己的职业技能。（包括神职）";
        case "agl": return "降临状态的天使在夜晚无视任何技能影响（包括效果和伤害）。";
        case "dmn": return "觉醒状态的恶魔在夜晚无视任何技能影响，且其他阵营玩家若对魔鬼使用任何技能将导致自己死亡（无技言）。";
        case "wwf": return "月圆之夜，你因变身为狼人而无视一切致死伤害（神技除外）。";
        case "sfz": return "某晚你可对一名存活玩家使用<span class='color yellow'>[正道皈依]</span>：若该玩家属于鬼阵营（非神职），则从黎明开始他（她）即刻加入人类阵营。<br/>补充说明：<br/>1、该玩家保持原有技言状态不变，胜负与人类阵营绑定。<br/>2、该玩家会在黎明时刻收到“加入人类阵营”通知。";
        case "grl":return "某晚你可对一名存活玩家使用<span class='color darkGreen'>[立地成魔]</span>：若该玩家属于人类阵营（非神职或殇逝者），则从黎明开始他（她）即刻加入鬼阵营。<br/>补充说明：<br/>1、该玩家保持原有技言状态不变，胜负与鬼阵营绑定。<br/>2、该玩家会在黎明时刻收到“加入鬼阵营”通知。";
 default :return "   测试用的第二技能详细解释";
    }
}

function getEnlightenSkillIconById(selectId){
    var jobAbbr = JOBS_INFO.ABBR[selectId + 1];
    switch(jobAbbr){
        case "mgl": return "<span class='skill seduceEnlighten'/>";
        case "ass": return "<span class='skill assassinEnlighten'/>";
        case "spy": return "<span class='skill intelligenceEnlighten'/>";
        case "mgc": return "<span class='skill confuseEnlighten'/>";
        case "cmd": return "<span class='skill authorityEnlighten'/>";
        case "rst": return "<span class='skill resistanceEnlighten'/>";
        case "bsp": return "<span class='skill judgeEnlighten'/>";
        case "gdn": return "<span class='skill protectEnlighten'/>";
        case "fsr": return "<span class='skill predictEnlighten'/>";
        case "mtm": return "<span class='skill calculateEnlighten'/>";
        case "ist": return "<span class='skill provokeEnlighten'/>";
        case "dct": return "<span class='skill saveEnlighten'/>";
        case "spl": return "<span class='skill proofEnlighten'/>";
        case "cnr": return "<span class='skill certifyEnlighten'/>";
        case "psy": return "<span class='skill psychicEnlighten'/>";
        case "dtt": return "<span class='skill detectEnlighten'/>";
        case "spm": return "<span class='skill representEnlighten'/>";
        case "ins": return "<span class='skill enlightenEnlighten'/>";
        case "msc": return "<span class='skill hypnosisEnlighten'/>";
        case "bls": return "<span class='skill blessEnlighten'/>";
        case "lsr": return "<span class='skill beliefEnlighten'/>";
        case "gds": return "<span class='skill brillianceEnlighten'/>";
        case "svr": return "<span class='skill redeemEnlighten'/>";
        case "arb": return "<span class='skill arbitrationEnlighten'/>";
        case "gbl": return "<span class='skill gambleEnlighten'/>";
        case "cns": return "<span class='skill frameEnlighten'/>";
        case "rvl": return "<span class='skill sacrificeEnlighten'/>";
        case "ctc": return "<span class='skill commentEnlighten'/>";
        case "tfr": return "<span class='skill changeEnlighten'/>";
        case "avg": return "<span class='skill avengeEnlighten'/>";
        case "psr": return "<span class='skill conscienceEnlighten'/>";
        case "ldr": return "<span class='skill leadEnlighten'/>";
        case "agt": return "<span class='skill argotEnlighten'/>";
        case "msr": return "<span class='skill greedEnlighten'/>";
        case "phr": return "<span class='skill poisonEnlighten'/>";
        case "arc": return "<span class='skill bowEnlighten'/>";
        case "wwf":return"<span class='skill beastEnlighten'/>";
        case "sfz": return "<span class='skill sfzNirvana'/>";
        case "grl": return "<span class='skill grlNirvana'/>";
        case "trn": return "<span class='skill smellEnlighten'/>";
        default :return "   测试用的第一职业技能图标";
    }
}

function getEnlightenSkillInfoById(selectId){
    var basicKill = "<span class ='color red'>[杀死]</span>";
    var jobAbbr = JOBS_INFO.ABBR[selectId + 1];
    switch(jobAbbr){
        case "njb": return null;
        case "aln": return "游戏开局时你可以选择其一：<br/>"+
            "1、获得范围提示(包含人鬼双阵营身份词汇/图片)和职业提示(选职模式中未登场的职业)。<br/>"+
            "2、无任何提示，但你若提前出局可以猜词/选图：你有三次机会，若能猜出人鬼双方阵营词汇/选出人鬼双方图片，则你依然胜利，其他阵营皆输。";
        case "mgl": return "媚女郎即刻无视职业禁锢影响，可以<span class ='color pink'>[色诱]</span>自己或已出局玩家，且永不会丧失技言权利或无法使用<span class='color red'>[杀死]</span>。";
        case "ass": return "潜行者即刻恢复一次<span class ='color lightYellow'>[刺杀]</span>机会，且只要行刺未曾失败过（目标为敌方阵营且出局无技言），则<span class ='color lightYellow'>[刺杀]</span>可持续使用。";
        case "spy": return "间谍即刻无视职业禁锢影响，获知人、鬼双方阵营词汇/图片，获知对方阵营的间谍身份（在多间谍模式下）。";
        case "mgc": return "魔术师即刻无视职业禁锢影响，可以连续两晚<span class ='color magenta'>[迷惑]</span>同一名玩家，且<span class ='color magenta'>[迷惑]</span>效果有50%概率持续两晚。";
        case "cmd": return "指挥官即刻恢复一次<span class ='color blue'>[权威]</span>机会，且<span class ='color blue'>[权威]</span>可以在白天任何环节发动，票权可用在当天公决和PK公决阶段。";
        case "rst": return "抵抗军即刻无视职业禁锢影响，获得无限次<span class ='color orange'>[不屈]</span>。";
        case "bsp": return "大主教即刻无视职业禁锢影响，恢复一次<span class ='color yellow'>[审判]</span>机会，且误判不会导致自己出局。";
        case "gdn": return "守护者即刻无视职业禁锢影响，可以连续两晚<span class='color greenBlue'>[守卫]</span>同一名玩家，且守护者自身附加一次被动护盾，可以抵挡黑夜外来致死伤害（除神技外）。";
        case "fsr": return "先知即刻无视职业禁锢影响，黎明时知晓自己所在阵营，可以无限次使用<span class='color orangeRed'>[占卜]</span>。";
        case "mtm": return "数学家即刻无视职业禁锢影响，黎明时知晓自己所在阵营词汇/图片，永久拥有<span class='color greenYellow'>[推演]</span>能力，且<span class='color greenYellow'>[推演]</span>目标可由自己指定（可以是存活或已出局玩家）。";
        case "ist": return "挑拨者即刻无视职业禁锢影响，恢复一次<span class='color darkPurple'>[煽动]</span>机会，且发动<span class='color darkPurple'>[煽动]</span>不会使自己丧失所在阵营的基本权利。";
        case "dct": return "治愈者即刻无视职业禁锢影响，恢复一次<span class='color pink'>[急救]</span>机会，且目标可以是在任何阶段出局的玩家（治愈者可在自己出局时<span class='color pink'>[急救]</span>自己）。";
        case "spl": return "机械师即刻无视职业禁锢影响，获得无限次<span class='color lightBlue'>[防弹]</span>。";
        case "cnr": return "验尸官即刻无视职业禁锢影响，可以连续两晚<span class='color lightYellow'>[鉴定]</span>同一名玩家，可以<span class='color lightYellow'>[鉴定]</span>自己。";
        case "psy": return "通灵师即刻无视职业禁锢影响，被<span class='color orangeRed'>[还魂]</span>者可以同时参与发言与投票，且<span class='color orangeRed'>[还魂]</span>可以施加在包括自己在内的存活玩家身上（若目标出局在当夜，次日自动得到<span class='color orangeRed'>[还魂]</span>效果）。";
        case "dtt": return "大侦探即刻起拥有两种<span class='color skyBlue'>[侦查]</span>方式，并可选择其一：<br/>1、指定任意一名玩家并知晓其拥有的职业。<br/>2、指定任意一个在场职业（不可指定外星人和狼人）并知晓其对应的玩家。";
        case "spm": return "代言人即刻无视职业禁锢影响，可以连续两晚<span class='color green'>[代言]</span>同一名玩家；且<span class='color green'>[代言]</span>效果变为：只移除己方玩家负面效果和敌方玩家正面效果，只附加给己方玩家正面效果和敌方玩家负面效果。";
        case "ins": return "启迪者的<span class='color greenBlue'>[启迪]</span>即刻改变效果：<br/>若目标为己方玩且尚未受启迪则获得启迪技能；若目标为敌方玩家则无效果（未受到启迪）或丧失启迪技能（已受到启迪）。";
        case "msc": return "音乐家即刻无视职业禁锢影响，可以连续两晚<span class='color orangeYellow'>[催眠]</span>同一名玩家，被<span class='color orangeYellow'>[催眠]</span>者在下一个白天不能发动白天技能，不能参与发言，不能参与公决投票。且<span class='color orangeYellow'>[催眠]</span>效果有50%概率持续两天。";
        case "bls": return "祈福者即刻无视职业禁锢影响，恢复一次<span class='color lightYellow'>[祈祷]</span>机会，并且在<span class='color lightYellow'>[祈祷]</span>成功发动的环节，只有己方玩家无视致死伤害。";
        case "lsr": return "即刻起，每个夜晚屌丝可以放弃使用"+basicKill+"而指定任意一名存活玩家成为自己新的女神，当夜开始自己受<span class='color skyBlue'>[信仰]</span>影响。(若当晚你的前任女神使用<span class='color red'>[光辉无限]</span>且指向你时，该行动无效)";
        case "gds": return "即刻起，每个夜晚女神可以放弃使用"+basicKill+"而指定任意一名存活玩家成为自己新的屌丝，当夜开始他（她）受<span class='color red'>[光辉]</span>影响。(若当晚你的前任屌丝使用<span class='color skyBlue'>[信仰永恒]</span>且指向你时，该行动无效)";
        case "svr": return "救世主即刻无视职业禁锢影响，发动<span class='color yellow'>[救世]</span>时自己自己不必出局，且若<span class='color yellow'>[救世]</span>指定目标是异阵营玩家，则复活无效。";
        case "arb": return "若公决阶段有得票最高者，仲裁者拥有如下权利：<br/>1、否定此次公决，直接进入黑夜。（每局游戏限用一次）<br/>2、得票最高者出局，并立刻发动下一次公决。（每局游戏限用一次）";
        case "gbl": return "搏命家即刻无视职业禁锢影响，通过<span class='color orange'>[下注]</span>获得的额外生命数量可以无限累加。";
        case "cns": return "阴谋家即刻无视职业禁锢影响，可以连续两晚<span class='color magenta'>[诬陷]</span>同一名玩家。被<span class='color magenta'>[诬陷]</span>的目标只获得额外的一票，但每有一个玩家投他，他都会获得两票。";
        case "rvl": return "革命家即刻恢复一次<span class='color red'>[牺牲]</span>机会(在被救活的情况下)，且<span class='color red'>[牺牲]</span>效果改变为：<br/>1、若你属于鬼阵营，<span class='color red'>[牺牲]</span>发动后的白天所有死去人类阵营玩家无技言。<br/>2、若你属于人类阵营，<span class='color red'>[牺牲]</span>发动后的白天所有死去人类阵营玩家开枪错带无效。";
        case "ctc": return "若你已经发动<span class='color skyBlue'>[舆论]</span>，则白天获得以下权利（二选一）：<br/>1、指定当天的发言顺序。<br/>2、当天无发言环节直接进入公决。（每局游戏限用一次）";
        case "tfr": return "千面人即刻无视职业禁锢影响，可以<span class='color orange'>[汲取]</span>已出局玩家的职业技能，且所有曾被<span class='color orange'>[汲取]</span>过得技能都会保留（可以选择任一发动）。";
        case "avg": return "复仇者即刻恢复一次<span class='color purple'>[玉碎]</span>机会(在被救活的情况下)，且<span class='color purple'>[玉碎]</span>效果改变为：复仇者、复仇者两侧玩家（若依旧存活）、<span class='color purple'>[玉碎]</span>指向目标即刻出局并无技言。";
        case "psr": return "伤逝者即刻获得人类阵营的身份词汇/图片，殇逝者的离场不影响外星人的胜负，且殇逝者的<span class='color greenBlue'>[良知]</span>和<span class='color greenBlue'>[普天同祭]</span>不影响人类阵营玩家。";
        case "ldr": return "引路人的<span class='color lightYellow'>[明灯]</span>效果即刻影响到其所在阵营的所有存活玩家。";
        case "agt": return "暗语者即刻无视职业禁锢影响，恢复一次<span class='color lightRed'>[私语]</span>机会，且<span class='color lightRed'>[私语]</span>效果改变为：包括暗语者在内的X+1名玩家将知道这X+1名玩家属于同阵营。";
        case "msr": return "即刻起，守财奴的<span class='lightYellow'>[贪婪]</span>效果改变为：<br/>失败不扣除积分，胜利获得三倍积分和金钱。（与双倍积分卡或双倍财富卡同时使用可以产生六倍效果）";
        case "phr": return "药剂师即刻无视职业禁锢影响，可以连续两晚<span class ='color greenYellow'>[致残]</span>同一名玩家，且<span class ='color greenYellow'>[致残]</span>效果有50%概率持续两晚。";
        case "arc": return "神箭手即刻无视职业禁锢影响，其<span class='skyBlue'>[强弓]</span>效果可以无限叠加。";
        case "wwf": return "当场上的狼族数量多于三个时（16人局及以上），狼人中会有一个“头狼”并拥有<span class='color darkGreen'>[狼族崛起]</span>。只要头狼存活，所有的黑夜都是月圆之夜。";
        case "sfz": return "游戏的前三个夜晚和第三个白天御天圣母无视一切致死伤害和效果（包括神技和信息获取类技能），第四个黎明御天圣母自动出局，无技言。";
        case "grl": return "游戏的前三个夜晚和第三个白天鬼狱魔僧无视一切致死伤害和效果（包括神技和信息获取类技能），第四个黎明鬼狱魔僧自动出局，无技言。";
        case "trn": return "即刻起，宠兽的能力得到提升，敌人将要冒着巨大的风险才能袭击到驯兽师。在驯兽师出局（所有人将得到提示）后的第二个白天，离驯兽师最近的一个异阵营玩家因<span class='color orange'>[致命伤口]</span>的重度感染而不治身亡（无技言）。";
      default :return "   测试用的启迪技能详细解释";
    }
}
function getJobIntro(selectId){
    var jobAbbr = JOBS_INFO.ABBR[selectId + 1];
    switch(jobAbbr){
        case "aln": return "        \"外星人\"并不来自于其他星球，他们是外域一个古老种族，相传远古的大瘟疫以及鬼族和狼族的产生就和外星人有关。<br/>"+
            "       如今，继承了外域大司长的遗志,<span class='color red'>戴瑞克·段</span>已经成长为一个合格的外星人统领。亲眼目睹过通径之门被毁灭的他深知人、鬼、狼三族联合的可怕力量。"+
            "虽然，外域通往中土大地的通径之门已不再能够容纳如此大量的外族军队，然而今非昔比，<span class='color red'>戴瑞克·段</span>早已只身潜入中土并且开始着手运量着一场更大的阴谋……<br/>"+
            "<br/><span class='color bold'>简明攻略：</span><br/>"+
            "       <span class='color detail'>作为游戏中孤独的第三方，外星人一直以来被认为是《人鬼殊途》中最难玩的角色。外星人应该恰当的运用好<span class='color purple'>[洞察先机]</span>的优势，"+
            "给出高涵盖性解释的同时加快猜词的进度。自己尽量少树敌，私下煽风点火加快其他玩家出局速度。抱团应注意尺度：过紧的和人类抱团容易被鬼杀死，过紧的和鬼抱团容易被人票除。总之当外星人切记一点：苟活，苟活，再苟活……胜利！</span>";
        case "mgl": return "<span style='font-size:30px'>职业：媚女郎（女性角色）<br/>尚无人预定，等待您的冠名！</span>";
        case "ass": return "<span style='font-size:30px'>职业：潜行者（女性角色）<br/>尚无人预定，等待您的冠名！</span>";
        case "spy": return "<span style='font-size:30px'>职业：间谍（男性角色）<br/>尚无人预定，等待您的冠名！</span>";
        case "mgc": return "<span style='font-size:30px'>职业：魔术师（男性角色）<br/>尚无人预定，等待您的冠名！</span>";
        case "cmd": return "<span style='font-size:30px'>职业：指挥官（男性角色）<br/>尚无人预定，等待您的冠名！</span>";
        case "rst": return "<span style='font-size:30px'>职业：抵抗军（男性角色）<br/>尚无人预定，等待您的冠名！</span>";

        case "bsp": return "<span style='font-size:30px'>职业：大主教<br/>已被曾瑜强(富兰克林*曾)预定，等待冠名。</span>";
        case "gdn": return "<span style='font-size:30px'>职业：守护者<br/>已被王梅亭(多闻天)预定，等待冠名。</span>";
        case "fsr": return "<span style='font-size:30px'>职业：先知（男性角色）<br/>尚无人预定，等待您的冠名！</span>";
        case "mtm": return "<span style='font-size:30px'>职业：数学家（女性角色）<br/>尚无人预定，等待您的冠名！</span>";
        case "ist": return "<span style='font-size:30px'>职业：挑拨者（男性角色）<br/>尚无人预定，等待您的冠名！</span>";
        case "dct": return "<span style='font-size:30px'>职业：治愈者（女性角色）<br/>尚无人预定，等待您的冠名！</span>";
        case "spl": return "<span style='font-size:30px'>职业：机械师（男性角色）<br/>尚无人预定，等待您的冠名！</span>";
        case "cnr": return "<span style='font-size:30px'>职业：验尸官（男性角色）<br/>尚无人预定，等待您的冠名！</span>";
        case "psy": return "<span style='font-size:30px'>职业：通灵师（男性角色）<br/>尚无人预定，等待您的冠名！</span>";
        case "dtt": return "<span style='font-size:30px'>职业：大侦探<br/>已被蔡彦芝预定，等待冠名。</span>";
        case "spm": return "<span style='font-size:30px'>职业：代言人<br/>已被陈杰预定，等待冠名。</span>";
        case "ins": return "<span style='font-size:30px'>职业：启迪者（女性角色）<br/>尚无人预定，等待您的冠名！</span>";
        case "msc": return "<span style='font-size:30px'>职业：音乐家<br/>（男性角色）尚无人预定，等待您的冠名！</span>";
        case "bls": return "<span style='font-size:30px'>职业：祈福者（女性角色）<br/>尚无人预定，等待您的冠名！</span>";
        case "lsr": return "<span style='font-size:30px'>职业：屌丝（男性角色）<br/>尚无人预定，等待您的冠名！</span>";
        case "gds": return "<span style='font-size:30px'>职业：女神（女性角色）<br/>尚无人预定，等待您的冠名！</span>";
        case "svr": return "<span style='font-size:30px'>职业：救世主（女性角色）<br/>尚无人预定，等待您的冠名！</span>";
        case "arb": return "<span style='font-size:30px'>职业：仲裁者（女性角色）<br/>尚无人预定，等待您的冠名！</span>";
        case "gbl": return "<span style='font-size:30px'>职业：搏命家（男性角色）<br/>尚无人预定，等待您的冠名！</span>";
        case "cns": return "<span style='font-size:30px'>职业：阴谋家（男性角色）<br/>尚无人预定，等待您的冠名！</span>";
        case "rvl": return "<span style='font-size:30px'>职业：革命家（男性角色）<br/>尚无人预定，等待您的冠名！</span>";
        case "ctc": return "<span style='font-size:30px'>职业：评论家（女性角色）<br/>尚无人预定，等待您的冠名！</span>";
        case "tfr": return "<span style='font-size:30px'>职业：千面人（男性角色）<br/>尚无人预定，等待您的冠名！</span>";
        case "avg": return "<span style='font-size:30px'>职业：复仇者（女性角色）<br/>尚无人预定，等待您的冠名！</span>";
        case "psr": return "<span style='font-size:30px'>职业：殇逝者（女性角色）<br/>尚无人预定，等待您的冠名！</span>";
        case "ldr": return "<span style='font-size:30px'>职业：引路人（女性角色）<br/>尚无人预定，等待您的冠名！</span>";
        case "agt": return "<span style='font-size:30px'>职业：暗语者（女性角色）<br/>尚无人预定，等待您的冠名！</span>";
        case "agl": return "<span style='font-size:30px'>职业：天使（女性角色）<br/>尚无人预定，等待您的冠名！</span>";
        case "dmn": return "<span style='font-size:30px'>职业：恶魔（男性角色）<br/>尚无人预定，等待您的冠名！</span>";
        case "wwf": return "<span style='font-size:30px'>职业：狼族（男性角色）<br/>尚无人预定，等待您的冠名！</span>";
        case "msr": return "<span style='font-size:30px'>职业：守财奴（女性角色）<br/>尚无人预定，等待您的冠名！</span>";
        case "phr": return "<span style='font-size:30px'>职业：药剂师（男性角色）<br/>尚无人预定，等待您的冠名！</span>";
        case "arc": return "<span style='font-size:30px'>职业：神箭手（男性角色）<br/>尚无人预定，等待您的冠名！</span>";
        case "sfz": return "<span style='font-size:30px'>职业：御天圣母（女性角色）<br/>尚无人预定，等待您的冠名！</span>";
        case "grl": return "<span style='font-size:30px'>职业：鬼狱魔僧（男性角色）<br/>尚无人预定，等待您的冠名！</span>";
        case "trn": return "<span style='font-size:30px'>职业：驯兽师（女性角色）<br/>尚无人预定，等待您的冠名！</span>";
        default :return "<span style='font-size:20px'>职业介绍~等待你的冠名!!</span>";
    }
}

function getJobContentById(selectId){
    var jobAbbr = JOBS_INFO.ABBR[selectId + 1];
    switch(jobAbbr){
        //第一职技+启迪技能+职业禁锢
        case "mgl":
        case "ass":
        case "spy":
        case "mgc":
        case "cmd":
        case "rst":
        case "bsp":
        case "gdn":
        case "fsr":
        case "ist":
        case "dct":
        case "spl":
        case "cnr":
        case "psy":
        case "spm":
        case "msc":
        case "bls":
        case "svr":
        case "gbl":
        case "cns":
        case "tfr":
        case "agt":
        case "phr":
        case "arc":
            return ["basic","first","forbidden","enlighten"];
        //第一职技+启迪技能
        case "ins":
        case "rvl":
        case "ctc":
        case "avg":
        case "ldr":
        case "msr":
        case "arb":
        case "trn":
        return ["basic","first","enlighten"];
        //职业规则+第一职技+启迪技能+职业禁锢
        case "mtm":return ["rule","basic","first","forbidden","enlighten"];
        //职业规则+第一职技+启迪技能
        case "dtt":
        case "lsr":
        case "gds":return ["rule","basic","first","enlighten"];
        //特殊：
        case "aln":return ["rule","first"];
        //第一技能+第二技能
        case "agl":
        case "dmn":return ["rule","first","second"];
        //第一技能+第二技能+启迪技能
        case "sfz":
        case "grl":
        case "wwf":
        case "psr":return ["rule","first","second","enlighten"];
    }
}