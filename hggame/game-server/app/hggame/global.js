exports.global = {
    loops:{
        dawnLoop:require("./gameLogic/gameComponents/loops/dawnLoop").dawnLoop,
        nightLoop:require("./gameLogic/gameComponents/loops/nightLoop").nightLoop,
        voteLoop:require("./gameLogic/gameComponents/loops/voteLoop").voteLoop,
        saverSaveLoop:require("./gameLogic/gameComponents/loops/saverSaveLoop").saverSaveLoop,
        shootLoop:require("./gameLogic/gameComponents/loops/shootLoop").shootLoop,
        saverSaveType:{
            trigInNgt:1,
            trigInDay:2
        },
        alienGuessLoop: require("./gameLogic/gameComponents/loops/alienGuessLoop").alienGuessLoop,
        alienGuessType:{
            outInNgt:1,
            outInShoot:2,
            outInSpeak:3,
            outInVote:4
        },
        speakLoop: require("./gameLogic/gameComponents/loops/speakLoop").speakLoop
    },
    GameInfo:require("./basicGameInfo/GameInfo"),
    endCheck:{
        evenCheck:require("./gameLogic/gameComponents/endChecks/endChecks").evenCheck,
        alnWinCheck:require("./gameLogic/gameComponents/endChecks/endChecks").alnWinCheck,
        wwfWinCheck:require("./gameLogic/gameComponents/endChecks/endChecks").wwfWinCheck,
        fightEndCheck:require("./gameLogic/gameComponents/endChecks/endChecks").fightEndCheck
    },
    endManager:require("./gameManagers/endManager").endManager,
    utils:{
        hjcArr:require("../HJCUtils/HJCArray"),
        basicUtils:require("../HJCUtils/basicUtils")
    },
    allocateManager:require("./gameManagers/allocateManager/allocateManager"),
    wordsManager:require("./gameManagers/wordsManager/wordsManager"),
    Player:require("./gameLogic/player").player
};