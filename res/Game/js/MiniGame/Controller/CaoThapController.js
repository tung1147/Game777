/**
 * Created by anhvt on 12/5/2016.
 */
var CaoThapController = MiniGameController.extend({
    ctor: function (view) {
        this._super();
        this.initWithView(view);

        /*
         Trang thai game
         0 = chua bat dau
         1 = con luot
         2 = het luot
         */
        this.turnState = 0;
        this.result = -1;
        this.rolling = false;
        this.timeRemaining = 0;
        this.gameGroup = "mini.caothap";
    },

    initWithView : function (view) {
        this._super(view);
        SmartfoxClient.getInstance().addExtensionListener("407", this._onInitGame, this);
        SmartfoxClient.getInstance().addExtensionListener("408", this._onFinishedGame, this);
    },

    _onInitGame : function (messageType, content) {
        var thiz = this;
        setTimeout(function () {
            thiz.onInitGame(content.p.data);
        }, 1000);
    },

    _onFinishedGame : function (messageType, content) {
        var thiz = this;
        setTimeout(function () {
            thiz.onPredictResult(content.p.data);
        }, 1000);
    },

    // onSFSExtension: function (messageType, content) {
    //     if (content.p.group != this.gameGroup){
    //         return;
    //     }
    //     this._super(messageType, content);
    //     var thiz = this;
    //     // var interval = null;
    //     switch (content.c) {
    //         case "407": // nhan thong tin la dau tien
    //             setTimeout(function () {
    //                 thiz.onInitGame(content.p.data);
    //             }, 1000);
    //             break;
    //
    //         case "408": // nhan ket qua cao thap
    //             setTimeout(function () {
    //                 thiz.onPredictResult(content.p.data);
    //             }, 1000);
    //             break;
    //         case "22" :
    //             this.onChangeAssets(content.p.data["1"],content.p.data["2"]);
    //             break;
    //     }
    // },

    onReconnect: function (param) {
        var data = param["data"];
        var gameId = data["2"]["1"];
        var resultCard = data["2"]["2"];
        var lowReward = data["2"]["5"];
        var highReward = data["2"]["4"];
        this.timeRemaining = Math.floor(data["2"]["6"] / 1000);
        var gameEnded = data["2"]["7"] != 1;
        var oldCards = data["3"];
        var kingCount = data["4"];
        var betId = data["5"];
        var bankString = data["6"];

        this._view.setBettingSelectEnable(false);
        this._view.setBankValue(parseInt(bankString));
        this._view.showResultCard(resultCard);
        this._view.setGameId(gameId);
        this.result = resultCard;
        this._view.setTimeRemaining(this.timeRemaining);
        this._view.setTipString(gameEnded ? "Bạn chọn sai, chúc bạn may mắn lần sau!" :
            "Quân tiếp theo cao hơn hay thấp hơn?");
        this._view.setHighLowBtEnable(!gameEnded);
        this.turnState = gameEnded ? 2 : 1;
        this.result = gameEnded ? -1 : resultCard;
        this._view.setReward(lowReward, highReward);
        this._view.setLuotMoiBtEnable(oldCards.length > 1);
        this._view.setLuotMoiBtVisible(oldCards.length > 1);
        for (var i = 0; i < oldCards.length - 1; i++){
            this._view.addHistory(oldCards[i], true);
        }

        for (var i = 0; i < kingCount; i++){
            this._view.pushKing(true);
        }

        if(data["2"]["sg"]){
            this._view.setHighBtEnable(data["2"]["sg"]["1"] ? true : false);
            this._view.setLowBtEnable(data["2"]["sg"]["2"] ? true : false);
        }
    },

    onSFSError: function (messageType, content) {
        if(this._super(messageType, content)){
            this.turnState = 0;
            this._view.setRolling(false);
            this._view.clearTurn();
        }
    },

    onSFSChangeAssets: function (messageType, content) {
        this.onChangeAssets(content.p["2"], content.p["1"]);
    },

    processData: function (data) {
        var gameId = data["1"];
        var bankValue = data["3"];
        var highReward = data["4"];
        var lowReward = data["5"];
        var timeRemaining = data["6"];
        //this._view.pushKing((resultCard % 13) == 10);
        this._view.setReward(lowReward, highReward);
        this._view.setGameId(gameId);
        this._view.setBankValue(bankValue);
        this.timeRemaining = Math.floor(timeRemaining / 1000);
        this._view.setTimeRemaining(this.timeRemaining);
        //this.setRolling(false);
    },

    onPredictResult: function (data) {
        if(!this._view){
            return;
        }

        var winType = data["9"]; // win(0), same(1), lose(2), bigwin(3)
        switch (winType) {
            case 0: // win
            case 1:
                this._view.setTipString("Quân tiếp theo cao hơn hay thấp hơn?");
                this.turnState = 1;
                break;
            case 2:
                this._view.setTipString("Bạn chọn sai, chúc bạn may mắn lần sau!");
                this._view.playSoundLost();
                this.turnState = 2;
                break;
            case 3:
                this._view.showJackpot();
                this.turnState = 1;
                break;
        }
        var resultCard = data["8"];
        this._view.showResultCard(resultCard);
        // in case out of time
        if (this.result != -1)
            this._view.addHistory(this.result);
        this._view.pushKing((resultCard % 13) == 10);
        this.result = resultCard;
        if (data["7"] == 1) {
            this.turnState = 1;
            this.result = data["8"];
            this._view.setHighLowBtEnable(true);
        }
        else {
            this.turnState = 2;
            this.result = -1;
            this.timeRemaining = 0;
            this._view.setTimeRemaining(0);
            this._view.setHighLowBtEnable(false);
        }
        this.processData(data);
        this._view.setLuotMoiBtVisible(true);
        this._view.setLuotMoiBtEnable(true);

        if(data["sg"]){
            this._view.setHighBtEnable(data["sg"]["1"] ? true : false);
            this._view.setLowBtEnable(data["sg"]["2"] ? true : false);
        }
    },

    onInitGame: function (data) {
        if(!this._view){
            return;
        }

        this._view.setLuotMoiBtEnable(false);
        this._view.setHighLowBtEnable(true);

        this.processData(data);
        var resultCard = data["2"];
        this._view.showResultCard(resultCard);
        this._view.pushKing((resultCard % 13) == 10);
        this.result = resultCard;
        this.turnState = 1;
        this._view.setTipString("Quân tiếp theo cao hơn hay thấp hơn?");

        if(data["sg"]){
            this._view.setHighBtEnable(data["sg"]["1"] ? true : false);
            this._view.setLowBtEnable(data["sg"]["2"] ? true : false);
        }
    },

    sendInitGame: function (betType) {
        if (this.turnState != 0) return;
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "407", {1: betType});
        this._view.setLuotMoiBtEnable(false);
        this._view.setHighLowBtEnable(false);
    },

    sendHighPredict: function () {
        if (this.turnState != 1) return;
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "408", {1: 1});
        //this.setRolling(true);
        this._view.setLuotMoiBtEnable(false);
        this._view.setHighLowBtEnable(false);
        this._view.addHistory(this.result);
        this.result = -1;
    },

    sendLowPredict: function () {
        if (this.turnState != 1) return;
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "408", {1: 2});
        //this.setRolling(true);
        this._view.setLuotMoiBtEnable(false);
        this._view.setHighLowBtEnable(false);
        this._view.addHistory(this.result);
        this.result = -1;
    },

    getTurnState: function () {
        return this.turnState;
    },

    // setRolling: function (isRolling) {
    //     this.rolling = isRolling;
    //     this._view.setRolling(isRolling);
    // },

    sendLuotMoiRequest: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "409", null);
        this._view.setTipString("");
        this.turnState = 0;
        // this.setRolling(false);
        this._view.clearTurn();
        this._view.pushKing(false);
    },

    sendJoinGame: function () {
        SmartfoxClient.getInstance().joinMiniGame(PlayerMe.miniGameInfo, "404");
    },

    requestQuitRoom: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "405", null);
    },

    sendGetTopRequest: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "402", null);
    },

    sendGetExplosionHistory: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "403", null);
    },

    sendGetUserHistory: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "401", null);
    }
});