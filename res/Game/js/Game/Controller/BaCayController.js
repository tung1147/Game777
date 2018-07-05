/**
 * Created by QuyetNguyen on 12/5/2016.
 */

var BaCayController = GameController.extend({
    ctor: function (view) {
        this._super();
        this.initWithView(view);
        this.isPlaying = false;
        SmartfoxClient.getInstance().addExtensionListener("100004", this._onUpdateJackpotHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("10", this._onChangeRoomStateHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("3", this._onDealCardHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("301", this._onRevealCardHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("8", this._onGameResultHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("100005", this._onNoHuBaCayHandler, this);
    },

    // onSFSExtension: function (messageType, content) {
    //     this._super(messageType, content);
    //     switch (content.c) {
    //         case "100004":
    //             this._view.performChangeRewardFund(content.p.data["2"]);
    //             break;
    //         // case "1":
    //         //     this.onChangeRoomState({1: content.p["1"]});
    //         //     break;
    //         case "10":
    //             this.onChangeRoomState(content.p);
    //             break;
    //         case "3":
    //             this.onDealCard(content.p);
    //             break;
    //         case "301":
    //             this.onRevealCard(content.p);
    //             break;
    //         case "8":
    //             this.onGameResult(content.p);
    //             break;
    //     }
    // },

    onJoinRoom: function (param) {
        this._super(param);
        var huThuongValue = param["11"]["2"];
        this._view.performChangeRewardFund(huThuongValue);

        this.onChangeRoomState(param);
    },

    _onUpdateJackpotHandler : function (cmd, content) {
        this._view.performChangeRewardFund(content.p.data["2"]);
    },

    _onChangeRoomStateHandler : function (cmd, content) {
        this.onChangeRoomState(content.p);
    },

    _onDealCardHandler : function (cmd, content) {
        this.onDealCard(content.p);
    },

    _onRevealCardHandler : function (cmd, content) {
        this.onRevealCard(content.p);
    },

    _onGameResultHandler : function (cmd, content) {
        this.onGameResult(content.p);
    },

    _onNoHuBaCayHandler : function (cmd, content) {
        this.onNoHuBaCay(content.p);
    },

    onNoHuBaCay: function (param){
        var data = param.data;
        var nameNo = data["u"];
        var money = data["2"];

        var thiz = this;
        thiz._view.showJackpot(nameNo,money);
    },

    onChangeRoomState: function (param) {
        var roomState = param["1"];
        var remainingTime = param["2"];
        switch (roomState) {
            case 0:
                this._view.setStateString("Đang đợi người chơi");
                break;
            case 1:
                this._view.setStateString("Chuẩn bị ván mới");
                break;
            case 2:
                this._view.setStateString("");
                break;
            case 3:
                this._view.setStateString("Game đã kết thúc");
                break;
        }

        this._view.setRevealBtVisible(roomState == 2 && this.isPlaying);
        if(roomState == 2 && !this.isPlaying){
            this._view.showErrorMessage("Bàn đang chơi, vui lòng chờ", this._view);
            this._view.creatCardListForOther([1,2,3]);
        }
        this._view.showTimeRemaining(remainingTime);
        if (roomState != 2)
            this._view.resetBoard();
    },

    onDealCard: function (param) {
        this.isPlaying = true;
        var cards = param["1"];
        this._view.dealCard(cards);
    },

    onRevealCard: function (param) {
        var userPoints = param["1"];
        var username = param["u"];
        var userCards = param["2"];

        if (username == PlayerMe.username){
            this._view.setRevealBtVisible(false);
            this._view.setResultString(userPoints, username);
        }

        this._view.revealCards(userCards, username);
    },

    onReconnect: function (param) {
        this._super(param);
        this.isPlaying = true;
        this._view.resetBoard();
        var stategame = param["1"]["1"];
        var remainTime = Math.floor(param["1"]["6"]/1000);
        this.onChangeRoomState({1: stategame, 2: remainTime});
        if(stategame == 2 || stategame == 3)
        {
            this._view.reappearCard(param["3"]);
            this._view.performChangeRewardFund(param["1"]["11"]["2"]);
            if (param["1"]["4"]) { // game ended
                var userInfo = param["1"]["5"];
                for (var i = 0; i < userInfo.length; i++) {
                    var username = userInfo[i]["u"];
                    this._view.revealCards(userInfo[i]["9"], username);
                    this._view.setResultString(userInfo[i]["10"], username);
                }
            }
        }
    },

    onGameResult: function (param) {
        this.isPlaying = false;
        for (var i = 0; i < param["3"].length; i++) {
            var data = param["3"][i];
            var cardArray = data["2"];
            var goldAfter = data["3"];
            var goldChange = data["4"];
            var resultString = data["10"];
            var username = data["u"];
            this._view.revealCards(cardArray, username);
            this._view.setResultString(resultString, username);
            this._view.performAssetChange(goldChange, goldAfter, username);
        }

        this._view.setRevealBtVisible(false);
    },

    sendRevealCard: function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("301", null);
    },

    getMaxSlot: function () {
        return 6;
    }
});