/**
 * Created by VGA10 on 12/8/2016.
 * Rat la dep trai
 */

var VideoPokerController = MiniGameController.extend({
    ctor: function (view) {
        this._super();
        this.initWithView(view);
        this.turnState = 0;
        this.holdingList = [0, 0, 0, 0, 0];
        this.gameGroup = "mini.videopoker";
    },

    onSFSExtension: function (messageType, content) {
        if (content.p.group != this.gameGroup) {
            return;
        }
        this._super(messageType, content);
        var thiz = this;
        cc.log(content);
        switch (content.c) {
            case "251":
                this._view.setBankValue(parseInt(content.p["data"]["2"]));
                break;

            case "252": // ket qua luot dau tien
                setTimeout(function () {
                    thiz.onFirstRollResult(content.p.data);
                }, 1000);
                break;

            case "253":
                this._view.lblHD.setString("");
                setTimeout(function () {
                    thiz.onNextRollResult(content.p.data);
                }, 1000);
                break;

            case "254":
                this.onRequestDoubleResult(content.p.data);
                break;

            case "256":
                this._view.lblHD.setString("");
                this.onDoubleResult(content.p.data);
                break;
            case "22" :
                this.onChangeAssets(content.p.data["1"],content.p.data["2"]);
                break;
            case "255" :
                this._view.lblHD.setString("");
                this._view.setBettingSelectEnable(true);
                break;
        }
    },

    onFirstRollResult: function (param) {
        if(!this._view){
            return;
        }

        var gameId = param["1"];
        var cardArray = param["2"];
        var holdValue = param["3"]["1"];
        var resultId = param["3"]["2"];

        var holdArray = [];
        this.setTurnState(1);
        for (var i = 0; i < 5; i++)
            holdArray.push((holdValue >> i) & 1);
        this._view.setHoldArray(holdArray);
        this._view.setCardArray(cardArray);
        this._view.setFlashing(false, false);
        this._view.setQuayBtEnable(true);
        this._view.setNhanThuongBtEnable(false);
        this._view.lblHD.setString("Chọn quân bài muốn giữ lại");

    },

    onNextRollResult: function (param) {
        if(!this._view){
            return;
        }

        var cardArray = param["4"];
        var resultId = param["5"]["2"];
        var bankValue = param["6"];
        var rewardIndexes = param["5"]["1"];
        var rewardArray = [];
        this.setTurnState(resultId < 9 ? 2 : 0);
        this._view.setNhanThuongBtEnable(resultId < 9);
        for (var i = 0; i < 5; i++)
            rewardArray.push((rewardIndexes >> i) & 1);

        var thiz = this;
        var index = 0;
        this._view.activateReward(resultId);
        if (resultId == 0) {
            this._view.showJackpot();
        }
        this._view.setRewardCards(rewardArray);
        this._view.setHoldArray([0, 0, 0, 0, 0]);
        this._view.setCardArray(cardArray);
        this._view.setBankValue(bankValue);
        this._view.setFlashing(resultId < 9, resultId < 9);

        this._view.setQuayBtEnable(true);

        if(resultId>=9){
            this._view.setBettingSelectEnable(true);
        }
    },

    onRequestDoubleResult: function (param) {
        this._view.lblHD.setString("Chọn 1 lá bài to hơn");
        var firstCardId = param["1"];
        this.setTurnState(3);
        this._view.showDoubleTurn(firstCardId);
        this._view.activateReward(11);
        this._view.setFlashing(true, false);
        this._view.setRewardCards([0, 0, 0, 0, 0]);
        this._view.setQuayBtEnable(false);
        this._view.setNhanThuongBtEnable(false);
    },

    onDoubleResult: function (param) {
        var cardArray = [];
        cardArray.push(param["1"]);
        cardArray = cardArray.concat(param["4"]);
        var bankValue = param["6"];
        var choosenPos = param["3"];
        var resuft = param["5"];
        if(resuft == 1 || resuft == 0){ //hoa
            this._view.lblHD.setString("Nhân đôi " + cc.Global.NumberFormat1(parseInt(bankValue)) + " thành " +  cc.Global.NumberFormat1(2*parseInt(bankValue) ) );
        }
        else{
            this._view.setBettingSelectEnable(true);
        }

        this._view.setBankValue(bankValue);
        console.log(cardArray);
        if (param["5"] != 2) {
            this.setTurnState(2);
            this._view.setFlashing(true, true);
            this._view.setNhanThuongBtEnable(true);
        } else {
            this.setTurnState(0);
            this._view.setFlashing(false, false);
            this._view.setNhanThuongBtEnable(false);
        }
        this._view.revealDoubleResult(cardArray, choosenPos);
        this._view.setQuayBtEnable(true);


    },

    sendRollRequest: function (betType) {
        if (!this.checkRequestRolling()) return;
        // for (var i = 0; i < 5; i++)
        //     this._view.setRollCard(i, true);
        this._view.setHoldArray([0, 0, 0, 0, 0]);
        this._view.setFlashing(false, true);
        this._view.setQuayBtEnable(false);
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "251", {1: betType});
    },

    sendNextRollRequest: function (holdIndexes) {
        if (!this.checkRequestRolling())
            return;
        var holdValue = 0;
        if (holdIndexes.length == 5) {
            this.holdingList = holdIndexes;
            for (var i = 0; i < 5; i++) {
                holdValue = holdValue | (holdIndexes[i] << i);
                // if (!holdIndexes[i]) this._view.setRollCard(i, true);
            }
            //this.setRolling(true);
            this._view.setFlashing(false, true);
            this._view.setQuayBtEnable(false);
            SmartfoxClient.getInstance().sendExtensionRequest(-1, "253", {1: holdValue});
        }
    },

    sendDoubleRequest: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "254", null);
    },

    sendDoubleChoice: function (choice) {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "256", {1: choice});
    },

    checkRequestRolling: function () {
        //this.setRolling(this.turnState <= 1);
        if (this.turnState <= 1) {
            this._view.setNhanThuongBtEnable(false);
        }
        return this.turnState <= 1;
    },

    sendGetRewardRequest: function () {
        if (this.turnState == 2) {
            SmartfoxClient.getInstance().sendExtensionRequest(-1, "255", null);
            this._view.setRewardCards([0, 0, 0, 0, 0]);
        }
        if (this.turnState == 2 || this.turnState == 4) {
            this.holdingList = [0, 0, 0, 0, 0];
            this.setTurnState(0);
            this._view.resetBoard();
        }
    },

    getTurnState: function () {
        return this.turnState
    },

    sendJoinGame: function () {
        SmartfoxClient.getInstance().joinMiniGame(PlayerMe.miniGameInfo, "260");
    },

    onReconnect: function (param) {
        if(!param["data"]["10"]){
            return;
        }
        var data = param["data"]["10"];

        // var gameId = data["1"];
        var status = data["2"];
        this._view.setBettingSelectEnable(true);
        if(status == 2 || status == 3){
            this._view.lblHD.setString("");
        }else if(status == 1){
            this._view.lblHD.setString("Chọn quân bài muốn giữ lại");
        }
        if(status == 1 || status == 2 || status == 3){
            this._view.setBettingSelectEnable(false);
        }


        var bankString =   data["3"];
        var indexChip = 0;
        if(bankString == "10000"){
            indexChip = 1;
        }else if(bankString == "100000"){
            indexChip = 2;
        }
        this._view.chipGroup.selectChipAtIndex(indexChip,false);
        this._view.setBankValue(parseInt(bankString));
        if (data["5"]) {
            this.setTurnState(1);
            this._view.setCardArray(data["5"]);
            var holdIndexes = data["6"]["1"];
            for (var i = 0; i < 5; i++)
                this.holdingList[i] = ((holdIndexes >> i) & 1);
            this._view.setHoldArray(this.holdingList);

            return;
        }

        if (data["8"]) {
            this.setTurnState(2);
            this._view.setCardArray(data["8"]);
            var rewardIndexes = data["9"]["1"];
            var rewardArray = [];
            for (var i = 0; i < 5; i++)
                rewardArray.push((rewardIndexes >> i) & 1);
            this._view.setRewardCards(rewardArray);
            var rewardId = data["9"]["2"];
            this._view.activateReward(rewardId);
            this._view.setFlashing(rewardId < 9, rewardId < 9);
            if(status == 2 && rewardId < 9){
                this._view.setNhanThuongBtEnable(true);
            }
            return;
        }

        if (data["10"]) {
            switch (data["10"]["2"]) {
                case 1: // chua pick la'
                    this.setTurnState(3);
                    this._view.showDoubleTurn(data["10"]["1"]);
                    this._view.setFlashing(true, false);

                    break;

                case 2: // da pick la'
                    this.onDoubleResult(data["10"]);
                    break;
            }
        }
    },

    requestQuitRoom: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "261", null);
    },

    sendGetTopRequest: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "258", null);
    },

    sendGetExplosionHistory: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "259", null);
    },

    sendGetUserHistory: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "257", null);
    },

    setTurnState: function (state) {
        this.turnState = state;
        this._view.turnState = state;
    }
});