/**
 * Created by QuyetNguyen on 11/23/2016.
 */

/*PHOM*/
s_sfs_error_msg[61] = "Không thể ăn bài";
s_sfs_error_msg[62] = "Không thể hạ bài";
s_sfs_error_msg[63] = "Không thể gửi bài";
s_sfs_error_msg[64] = "Không thể bốc bài";

var PhomController = GameController.extend({
    ctor: function (view) {
        this._super();
        this.initWithView(view);
        this.timeTurn = 15;


        SmartfoxClient.getInstance().addExtensionListener("3", this._onStartGameHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("4", this._onDanhBaiThanhCongHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("7", this._onTurnChangedHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("8", this._onGameFinishedHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("10", this._onGameStatusHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("46", this._onStealAssetUpdate, this);
        SmartfoxClient.getInstance().addExtensionListener("101", this._onDrawDeckHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("103", this._onStealCardHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("104", this._onBalanceCardHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("106", this._onDelegateCard, this);
        SmartfoxClient.getInstance().addExtensionListener("108", this._onHaBaiHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("109", this._onStatusChangedHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("110", this._onUpdateDrawDeckHandler, this);
    },
    onUpdateOwner : function (params) {
        this._super(params);

        if (this.gameStatus == 1 && this.isOwnerMe) {
            this._view.setStartBtVisible(true);
        }
    },
    getMaxSlot: function () {
        return 4;
    },

    // onSFSExtension: function (messageType, content) {
    //     this._super(messageType, content);
    //     cc.log("mysfs : " + JSON.stringify(content));
    //     if (content.c == "10") {//update status
    //         this.onGameStatus(content.p["1"]);
    //     }
    //     else if (content.c == "3") { //start game
    //         this.onStartGame(content.p);
    //     }
    //     else if (content.c == "4") { // danh bai thanh cong
    //         this.onDanhBaiThanhCong(content.p);
    //     }
    //     else if (content.c == "7") { // change turn
    //         this.onTurnChanged(content.p);
    //     }
    //     else if (content.c == "103") { // an bai`
    //         this.onStealCard(content.p);
    //     }
    //     else if (content.c == "104") { // can bang bai
    //         this.onBalanceCard(content.p);
    //     }
    //     else if (content.c == "46") { // cong, tru tien an
    //         this.onStealAssetUpdate(content.p);
    //     }
    //     else if (content.c == "106") {// gui bai
    //         this.onDelegateCard(content.p);
    //     }
    //     else if (content.c == "108") {// ha bai
    //         this.onHaBai(content.p);
    //     }
    //     else if (content.c == "8") { // ket thuc van choi
    //         this.onGameFinished(content.p);
    //     }
    //     else if (content.c == "109") { // thay doi trang thai
    //         this.onStatusChanged(content.p);
    //     }
    //     else if (content.c == "101") { //boc bai
    //         this.onDrawDeck(content.p);
    //     }
    //     else if (content.c == "110") { // thong bao so bai boc con lai
    //         this.onUpdateDrawDeck(content.p);
    //     }
    // },

    /* handler */
    _onGameStatusHandler: function (cmd, content) {
        this.onGameStatus(content.p["1"]);
    },

    _onStartGameHandler: function (cmd, content) {
        this.onStartGame(content.p);
    },

    _onDanhBaiThanhCongHandler: function (cmd, content) {
        this.onDanhBaiThanhCong(content.p);
    },

    _onTurnChangedHandler: function (cmd, content) {
        this.onTurnChanged(content.p);
    },

    _onStealCardHandler: function (cmd, content) {
        this.onStealCard(content.p);
    },

    _onBalanceCardHandler: function (cmd, content) {
        this.onBalanceCard(content.p);
    },

    _onStealAssetUpdate: function (cmd, content) {
        this.onStealAssetUpdate(content.p);
    },

    _onDelegateCard: function (cmd, content) {
        this.onDelegateCard(content.p);
    },

    _onHaBaiHandler: function (cmd, content) {
        this.onHaBai(content.p);
    },

    _onGameFinishedHandler: function (cmd, content) {
        this.onGameFinished(content.p);
    },

    _onStatusChangedHandler: function (cmd, content) {
        this.onStatusChanged(content.p);
    },

    _onDrawDeckHandler: function (cmd, content) {
        this.onDrawDeck(content.p);
    },

    _onUpdateDrawDeckHandler: function (cmd, content) {
        this.onUpdateDrawDeck(content.p);
    },

    onGameStatus: function (param) {
        // this._view.onGameStatus(param);
        if (param != 2) {
            this._view.hideAllButton();
        }
        this._view.setDeckVisible(false);
        this.gameStatus = param;
        switch (param) {
            case 0: // waiting
                this._view.removeAllCards();
                break;
            case 1: // ready
                this._view.removeAllCards();
                this._view.setStartBtVisible(this.isOwnerMe);
                break;
            case 2: // playing
                this._view.setDeckVisible(true);
                this._view.setXepBaiBtVisible(true);
                break;
            case 3: // finish
                break;
        }
    },

    onJoinRoom: function (params) {
        this._super(params);
        this.timeTurn = params["7"];
        this.onInitJoin(params);
        this.onGameStatus(params["1"]);
        this._view.setXepBaiBtVisible(false);

    },
    onInitJoin:function (param) {


        var userData = param["5"];


        //surf through userData
        for (var i = 0; i < userData.length; i++) {
            var data = userData[i];
            var username = data["u"];

            // update my status
            // if (username == PlayerMe.username)
            //     this.onTurnChanged({s: userData[i]["s"], u: username});

            // trash cards
            if (data["10"]&& param["1"]==2)
                this._view.setTrashCardList(data["10"], username,true);

            if (data["11"]&& param["1"]==2) {
                var groupedCard = [];
                for (var k = 0; k < data["11"].length; k++)
                {

                    groupedCard = groupedCard.concat(data["11"][k]);
                }
                if (username == PlayerMe.username)
                    this._view.performHaBaiMeReconnect(groupedCard,true,data["12"]);
                else
                    this._view.performHaBaiOther(username, groupedCard, data["12"],true);

            }

        }


        var turnInfo = param["12"];
        if(turnInfo && param["1"]==2){
            this._view.showTimeRemainUser(turnInfo["u"], turnInfo["2"] / 1000, 15);
            this._view.performDrawDeckUpdate(turnInfo["3"]);
            if(turnInfo["2"] / 1000>0){
                this._view.showErrorMessage("Bàn đang chơi, vui lòng chờ");
            }
        }




    },
    onReconnect: function (param) {
        this._super(param);
        //this._view.onReconnect(param);
        this.onGameStatus(param["1"]["1"]);
       this._view.removeAllCards();
        // on-hand cards
        this._view.setCardList(param["3"]);
        // this.onInitJoin(param["1"]);
        var userData = param["1"]["5"];






        //surf through userData
        for (var i = 0; i < userData.length; i++) {
            var data = userData[i];
            var username = data["u"];

            // update my status
            if (username == PlayerMe.username && param["1"]["1"]==2)
                this.onTurnChanged({s: userData[i]["s"], u: username});

            // trash cards
            if (data["10"] && param["1"]["1"]==2)
                this._view.setTrashCardList(data["10"], username,true);

            // stolen cards
            if (data["11"] && param["1"]["1"]==2) {
                var groupedCard = [];
                for (var k = 0; k < data["11"].length; k++)
                {

                    groupedCard = groupedCard.concat(data["11"][k]);
                }
                if (username == PlayerMe.username)
                    this._view.performHaBaiMeReconnect(groupedCard,true,data["12"]);
                else
                    this._view.performHaBaiOther(username, groupedCard, data["12"],true);

            }
        }
        //update turn
        var turnInfo = param["1"]["12"];
        if(turnInfo){
            this._view.showTimeRemainUser(turnInfo["u"], turnInfo["2"] / 1000, 15);
            this._view.performDrawDeckUpdate(turnInfo["3"]);
        }

        // grouped card
        this._view.processGroupedCard(param["4"]);
    },

    onStartGame: function (param) {
        //this._view.onStartGame(param);
        var cards = [];
        var cardData = param["1"];
        var groupCardData = param["2"];
        for (var i = 0; i < cardData.length; i++)
            cards.push(CardList.prototype.getCardWithId(cardData[i]));
        this._view.performDealCards(cards, groupCardData);
    },

    onDanhBaiThanhCong: function (param) {
        //this._view.onDanhBaiThanhCong(param);
        var username = param.u;
        var card = CardList.prototype.getCardWithId(param["1"]);
        if (PlayerMe.username == username)
            this._view.performDanhBaiMe(card);
        else
            this._view.performDanhBaiOther(username, card);
    },

    onTurnChanged: function (param) {
        //this._view.onTurnChanged(param);
        var username = param.u;
        this._view.showTimeRemainUser(username, this.timeTurn);
        this._view.hideAllButton();
        if(this._view.cardList.cardList.length>0){
            this._view.setXepBaiBtVisible(true);
        }


        if (!param.s)
            return; // not my turn

        switch (param.s) {
            case 0:
                this._view.setXepBaiBtVisible(false);
                break;
            case 1:
                break;
            case 2: // luot boc bai
                this._view.setDrawBtVisible(true);
                break;
            case 3: // co the an bai
                this._view.setDrawBtVisible(true);
                this._view.setAnBaiBtVisible(true);
                break;
            case 4: // danh bai
                this._view.setDanhBaiBtVisible(true);
                break;
            case 5: // co luot ha bai
                this._view.setHaBaiBtVisible(true);
                this._view.setDanhBaiBtVisible(true);
                break;
            case 6: // co luot gui bai
                this._view.setDanhBaiBtVisible(true);
                this._view.setGuiBaiBtVisible(true);
                break;
            case 7: // u`
                this._view.setUBtVisible(true);
                this._view.setDanhBaiBtVisible(true);
                break;
            case 8:
                this._view.setXepBaiBtVisible(false);
                break;
        }
        // if(param.s>0){
        //     this._view.setXepBaiBtVisible(true);
        // }
        var thiz = this;
        if (param["3"] && param["3"].length > 0){
            this._view.runAction(new cc.Sequence(new cc.DelayTime(0.2),new cc.CallFunc(function () {
                    thiz._view.suggestCards(param["3"])
            }
            )));
        }

        if (param["4"] && param["4"].length > 0){
            this._view.runAction(new cc.Sequence(new cc.DelayTime(0.2),new cc.CallFunc(function () {
                    thiz._view.suggestCards(param["4"])
                }
            )));
        }
    },

    onStealCard: function (param) {
        var stealer = param["u1"];
        var stolenUser = param["u2"];
        var stolenCard = param["1"];
        var groupedCards = param["2"];

        this._view.performStealCard(stealer, stolenUser, stolenCard, groupedCards);
    },

    onBalanceCard: function (param) {
        //this._view.onBalanceCard(param);
        var cardId = param["1"];
        var fromUser = param["u1"];
        var toUser = param["u2"];
        this._view.performBalanceCard(fromUser, toUser, cardId);
    },

    onStealAssetUpdate: function (param) {
        var stealer = param["u1"];
        var stolenUser = param["u2"];
        var stealerAmount = param["s1"];
        var stolenAmount = param["s2"];
        var stealerBalance = param["m1"];
        var stolenBalance = param["m2"];

        this._view.performAssetChange(stealer, stealerAmount, stealerBalance);
        this._view.performAssetChange(stolenUser, -stolenAmount, stolenBalance);
    },

    onDelegateCard: function (param) {
        var fromUser = param["u"];
        var delegateData = param["1"];
        for (var i = 0; i < delegateData.length; i++) {
            var delegateInfo = delegateData[i];
            var sender = delegateInfo["u1"];
            var receiver = delegateInfo["u2"];
            var cards = delegateInfo["4"];
            var groupedCardAfter = [];
            for (var j = 0; j < delegateInfo["5"].length; j++)
                groupedCardAfter = groupedCardAfter.concat(delegateInfo["5"][j]);

            this._view.performDelegateCards(sender, receiver, cards, groupedCardAfter);
        }
    },

    onHaBai: function (param) {
        var username = param["u"];
        var groupedCards = param["11"];
        var stolenCards = param["12"];
        if (username == PlayerMe.username)
            this._view.performHaBaiMe(groupedCards,false);
        else
            this._view.performHaBaiOther(username, groupedCards, stolenCards,false);
    },

    onGameFinished: function (param) {
        //this._view.onGameFinished(param);
        this._view.setUBtVisible(false); // some case u` button still visible
        this._view.showTimeRemainUser(null); // stop all timer
        var userData = param["3"];
        var resultData = [];
        var resultStringArray = ["Bét ", "Ù Khan", "Ù Tròn", "Ù Thường", "Ù Đền",
            "Nhất ", "Nhì ", "Ba ", "Móm"];
        for (var i = 0; i < userData.length; i++) {
            var resultEntry = {};
            resultEntry.username = userData[i].u;
            resultEntry.gold = parseInt(userData[i]["4"]);
            resultEntry.cardList = userData[i]["2"];
            resultEntry.resultString = resultStringArray[userData[i]["5"]];
            resultEntry.isWinner = [1, 2, 3, 4, 5].indexOf(userData[i]["5"]) != -1;
            if ([0, 5, 6, 7].indexOf(userData[i]["5"]) != -1) {
                // them thong tin diem
                if (userData[i]["7"])
                    resultEntry.resultString += userData[i]["7"] + " điểm";
            }
            this._view.updateGold(userData[i].u, userData[i]["3"]);
            resultData.push(resultEntry);
        }

        this._view.showResultDialog(resultData);
    },

    onStatusChanged: function (param) {

    },

    onDrawDeck: function (param) {
        var username = param.u;
        var cardId = param["1"];
        var groupedCard = param["2"];
        if (username == PlayerMe.username)
            this._view.performDrawCardMe(cardId, groupedCard);
        else
            this._view.performDrawCardOther(username);
    },

    onUpdateDrawDeck: function (param) {
        this._view.performDrawDeckUpdate(param["1"]);
    },

    sendURequest: function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("109", null);
    },

    sendAnBaiRequest: function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("103", null);
    },

    sendGuiBaiRequest: function (cards) {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("106", {1: cards});
    },

    sendHaBaiRequest: function (cards) {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("108", {1: cards});
    },

    sendStartRequest: function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("3", null);
    },

    sendDanhBai: function (cardId) {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("4", {1: cardId});
    },
    sendDrawRequest: function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("101", null);
    }
});