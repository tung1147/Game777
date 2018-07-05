/**
 * Created by QuyetNguyen on 11/23/2016.
 */

/*TLMN*/
s_sfs_error_msg[1] = "Đánh bài không hợp lệ";
s_sfs_error_msg[2] = "Bạn không phải chủ phòng";
s_sfs_error_msg[3] = "Không đủ người chơi để bắt đầu";
s_sfs_error_msg[4] = "Bạn phải đánh quân bài nhỏ nhất";
s_sfs_error_msg[5] = "Bạn không thể bỏ lượt";
s_sfs_error_msg[6] = "Người chơi chưa sẵn sàng";
s_sfs_error_msg[7] = "Bạn chưa đến lượt";
s_sfs_error_msg[8] = "Bạn không có 4 đôi thông";
s_sfs_error_msg[9] = "Bạn không có đủ tiền";

s_defWin = [
    "Tứ quý 3",
    "Ba đôi thông chứa 3 bích",
    "Tứ quý 2",
    "Sáu đôi",
    "Năm đôi thông",
    "Sảnh rồng"
];

var TLMNGameController = GameController.extend({
    ctor : function (view) {
        this._super();
        this.initWithView(view);

        SmartfoxClient.getInstance().addExtensionListener("3", this._onStartGameHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("4", this._onDanhBaiThanhCongHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("5", this._onBoLuotHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("6", this._onNewTurnHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("7", this._onNextTurnHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("8", this._onGameFinishedHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("10", this._updateStatusHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("12", this._onChatChemHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("50", this._onUpdateCardReamin, this);
    },

    // onSFSExtension: function (messageType, content) {
    //     this._super(messageType, content);
    //     if (content.c == "10") {//update status
    //         this.onGameStatus(content.p["1"]);
    //     }
    //     else if (content.c == "3") { //start game
    //         this.onStartGame(content.p);
    //     }
    //     else if (content.c == "6") { //new turn
    //         this._view.removeCardOnTable();
    //         this.onUpdateTurn(content.p.u, this.timeTurn, true);
    //     }
    //     else if (content.c == "7") { //next turn
    //         this.onUpdateTurn(content.p.u, this.timeTurn, false);
    //     }
    //     else if (content.c == "5") { //bo luot
    //         var user = content.p.u;
    //         this._view.onBoLuot(user);
    //     }
    //     else if (content.c == "4") { //danh bai thanh cong
    //         this.onDanhBaiThanhCong(content.p);
    //     }
    //     else if (content.c == "8") { //ket qua
    //         this.onGameFinished(content.p);
    //     }
    //     else if (content.c == "12") { //chat chem
    //         this._view.onChatChem(content.p);
    //     }
    //     else if(content.c == "50") { // update card remain
    //         this.onUpdateCardReamain(content.p);
    //     }
    // },

    getMaxSlot : function () {
        if(this.isSolo){
            return 2;
        }
        return 4;
    },

    onJoinRoom : function (params) {
        this._super(params);
        this.updateGameInfo(params);

        var userInfo = params["5"];
        for(var i=0;i<userInfo.length;i++){
            this._view.updateCardRemaining(userInfo[i]["u"], userInfo[i]["8"]);
        }
    },

    onReconnect: function (params) {
        this._super(params);
        this._reconnectCardOnTable = null;
        this._reconnectTurnMe = false;

        this.updateGameInfo(params["1"]);

        var status = params["1"]["1"];
        if (status == 2) { //playing
            //add card me
            var cardData = params["3"];
            var cards = [];
            for (var i = 0; i < cardData.length; i++) {
                cards.push(CardList.prototype.getCardWithId(cardData[i]));
            }
            this._view.setCardMe(cards);
        }
        else {
            this._view.removeCardList();
            this._view.onUpdateTurn(".", 0, 0);
        }

        //update card remain
        var userInfo = params["1"]["5"];
        for(var i=0;i<userInfo.length;i++){
            this._view.updateCardRemaining(userInfo[i]["u"], userInfo[i]["8"]);
        }

        if(this._reconnectCardOnTable && this._reconnectTurnMe){
            this._view.suggestCardWithCards(this._reconnectCardOnTable);
            this._reconnectCardOnTable = null;
        }
    },

    onUserJoinRoom : function (param) {
        this._super(param);
        this._view.updateCardRemaining(param.u, 0);
    },

    onUpdateOwner : function (params) {
        this._super(params);

        if (this.gameStatus == 1 && this.isOwnerMe) {
            this._view.setStartBtVisible(true);
        }
    },

    //handler
    _updateStatusHandler : function(cmd, content){
        this.onGameStatus(content.p["1"]);
    },

    _onStartGameHandler : function(cmd, content){
        this.onStartGame(content.p);
        this._view.suggestCard();
    },

    _onNewTurnHandler : function(cmd, content){
        this._view.removeCardOnTable();
        this.onUpdateTurn(content.p.u, this.timeTurn, true);
        this._view.suggestCard();
    },

    _onNextTurnHandler : function(cmd, content){
        this.onUpdateTurn(content.p.u, this.timeTurn, false);
    },

    _onBoLuotHandler : function(cmd, content){
        var user = content.p.u;
        this._view.onBoLuot(user);
    },

    _onDanhBaiThanhCongHandler : function(cmd, content){
        this.onDanhBaiThanhCong(content.p);
    },

    _onGameFinishedHandler : function(cmd, content){
        this.onGameFinished(content.p);
    },

    _onChatChemHandler : function(cmd, content){
        this._view.onChatChem(content.p);
    },

    _onUpdateCardReamin : function(cmd, content){
        this.onUpdateCardReamain(content.p);
    },

    //process event
    onUpdateCardReamain : function (param) {
        this._view.updateCardRemaining(param.u, param["1"]);
    },

    updateGameInfo : function (params) {
        this.timeTurn = params["7"];

        var gameStatus = params["1"];
        this.onGameStatus(gameStatus);

        /* update card on table*/
        if (gameStatus == 2) { //playing
            var cardData = params["12"]["3"];
            if (cardData.length > 0) {
                var cards = [];
                for (var i = 0; i < cardData.length; i++) {
                    cards.push(CardList.prototype.getCardWithId(cardData[i]));
                }
                this._view.setCardOnTable(cards);

                this._reconnectCardOnTable = cards;
            }

            /* update turn */
            var username = params["12"]["u"];
            var currentTime = params["12"]["2"] / 1000;
            var newTurn = (cardData.length > 0) ? false : true;
            this.onUpdateTurn(username, currentTime, newTurn);

            this._reconnectTurnMe = (username === PlayerMe.username);
        }
    },

    onStartGame: function (params) {
        var cards = [];
        var cardData = params["1"];
        for (var i = 0; i < cardData.length; i++) {
            cards.push(CardList.prototype.getCardWithId(cardData[i]));
        }
        this._view.dealCards(cards);

        for(var i=0;i<this.playerSlot.length;i++){
            this._view.updateCardRemaining(this.playerSlot[i].username, cardData.length);
        }
    },

    onUpdateTurn : function (username, currentTime, newTurn) {
        if(newTurn){
            this._view.removeCardOnTable();
        }

        if (PlayerMe.username == username) {
            this._view.setDanhBaiBtVisible(true);
            if (newTurn) {
                this._view.setBoLuotBtVisible(false);
            }
            else{
                this._view.setBoLuotBtVisible(true);
            }
        }
        else {
            this._view.setDanhBaiBtVisible(false);
            this._view.setBoLuotBtVisible(false);
        }

        this._view.onUpdateTurn(username, currentTime, this.timeTurn);
    },

    onGameStatus: function (status) {
        this.gameStatus = status;
        if (status == 0) { //waiting
            this._view.setDanhBaiBtVisible(false);
            this._view.setXepBaiBtVisible(false);
            this._view.setBoLuotBtVisible(false);
            this._view.setStartBtVisible(false);
            this._view.removeCardList();
            this._view.removeCardOnTable();
        }
        else if (status == 1) { //ready
            this._view.setDanhBaiBtVisible(false);
            this._view.setXepBaiBtVisible(false);
            this._view.setBoLuotBtVisible(false);
            this._view.setStartBtVisible(false);
            this._view.removeCardList();
            this._view.removeCardOnTable();

            /* fix, dungtv sida */
            this.isSpectator = false;
            if (this.isOwnerMe) {
                this._view.setStartBtVisible(true);
            }
        }
        else if (status == 2) { //play
            if(this.isSpectator){
                this._view.showErrorMessage("Bàn đang chơi, vui lòng chờ");
            }
            else{
                this._view.setXepBaiBtVisible(true);
                this._view.setStartBtVisible(false);
            }
        }
        else if (status == 3) { //finish
            if(this.isSpectator){
                this._view.showErrorMessage("Bàn đang chơi, vui lòng chờ");
            }
            else{
                this._view.setDanhBaiBtVisible(false);
                this._view.setXepBaiBtVisible(false);
                this._view.setBoLuotBtVisible(false);
                this._view.setStartBtVisible(false);
                this._view.removeCardList();
                this._view.removeCardOnTable();
            }
        }
    },

    onDanhBaiThanhCong: function (param) {
        var username = param.u;
        var cards = [];
        var cardData = param["2"];
        for (var i = 0; i < cardData.length; i++) {
            cards.push(CardList.prototype.getCardWithId(cardData[i]));
        }

        if(PlayerMe.username == username){
            this._view.onDanhbaiMe(username, cards);
        }
        else{
            this._view.onDanhbaiOther(username, cards);
        }
    },

    onGameFinished: function (params) {
        this._view.onUpdateTurn(".",0,0);

        var winPlayer = params.u;
        var playerData = params["3"];
        var defWinType = params["4"];
        var player = [];
        for (var i = 0; i < playerData.length; i++) {
            var username = playerData[i].u;
            var gold = parseInt(playerData[i]["4"]);
            var title = null;

            var cardListData = playerData[i]["2"];
            var cardList = [];
            for(var j=0;j<cardListData.length;j++){
                cardList.push(CardList.prototype.getCardWithId(cardListData[j]));
            }

            if(username == winPlayer){
                title = s_defWin[defWinType] ? s_defWin[defWinType] : "Thắng";
            }
            else{
                title = "Thua " + cardList.length + " lá";
            }

            player[i] = {
                username : username,
                title : title,
                gold : gold,
                cardList : cardList,
                isWinner : username == winPlayer
            };

            //update gold
            var userGold = parseInt(playerData[i]["3"]);
            this._view.updateGold(username, userGold);
        }

        this._view.showFinishedDialog(player);
    },

    /* request */
    sendStartRequest: function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("3", null);
    },
    sendBoluotRequest: function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("5", null);
    },

    sendDanhBai: function (cards) {
        if (cards.length > 0) {
            var cardId = [];
            for (var i = 0; i < cards.length; i++) {
                cardId.push(CardList.prototype.getCardIdWithRank(cards[i].rank, cards[i].suit));
            }
            var param = {
                2: cardId
            };
            SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("4", param);
        }
        else {
            this._view.showErrorMessage("Bạn phải chọn quân bài đánh");
        }
    }
});