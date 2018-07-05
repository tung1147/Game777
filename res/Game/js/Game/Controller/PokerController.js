/**
 * Created by VGA10 on 1/19/2017.
 */

PK_ACTION_PLAYER_VIEW = 0;
PK_ACTION_PLAYER_BET = 1;
PK_ACTION_PLAYER_ALL_IN = 2;
PK_ACTION_PLAYER_FOLD = 3;
PK_ACTION_PLAYER_RAISE = 4;
PK_ACTION_PLAYER_CALL = 5;
PK_ACTION_PLAYER_CHECK = 6;
PK_ACTION_PLAYER_NONE = 7;

PK_SUGGEST_NONE = 0;
PK_SUGGEST_FOLD = 1;
PK_SUGGEST_CHECK = 2;
PK_SUGGEST_CALL = 3;
PK_SUGGEST_CHECK_FOLD = 4;

S_TYPE_CARDS = ["HIGH CARD", "PAIR", "TWO PAIRS","THREE OF A KIND", "STRAIGHT","FLUSH","FULL HOUSE", "FOUR OF A KIND","STRAIGHT FLUSH", "ROYAL FLUSH"];


var PokerController = GameController.extend({
    ctor: function (view) {
        this.statusRoom = 0;
        this.turnId = 0;
        this._super();
        this.initWithView(view);

        SmartfoxClient.getInstance().addExtensionListener("653", this._onUserSitDownHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("10", this._updateStatusHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("651", this._onFinisRow, this);
        SmartfoxClient.getInstance().addExtensionListener("663", this._onTipHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("655", this._onTipCaveHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("656", this._onNewRoundHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("658", this._onUserStandupHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("7", this._onTurnChangedHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("3", this._onStartGameHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("11", this._onRoomOwnerChangedHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("659", this._onActionPlayer, this);
        SmartfoxClient.getInstance().addExtensionListener("660", this._onPreStart, this);
        SmartfoxClient.getInstance().addExtensionListener("8", this._onEndGame, this);
        SmartfoxClient.getInstance().addExtensionListener("661", this._onHandleSuggest, this);
        SmartfoxClient.getInstance().addExtensionListener("652", this._onDrawCard, this);
         SmartfoxClient.getInstance().addExtensionListener("657", this._onRegeditStandup, this);
        SmartfoxClient.getInstance().addExtensionListener("654", this._onUpdateMoney, this);
        // SmartfoxClient.getInstance().addExtensionListener("0", this._onupdateGoldRemain, this);
    },


    onUpdateGold:function (cmd, content) {
        this._super(cmd, content);
        this._view.setGoldRemain(true,content.p["2"]);
    },

    onChangeAsset: function (cmd, content) {

    },

    _updateStatusHandler : function(cmd, content){
        this.onGameStatus(content.p["1"]);
    },
    _createUserInfo : function (data) {
        if(!data){
            return {

                moneyBet:0,
                isPlaying:false,
                idAction:PK_ACTION_PLAYER_NONE,
                typePlayer:PK_TYPE_PLAYER_NOMARL,
            };
        }

        return {

            money:parseInt(data["10"]),
            moneyBet:data["12"],
            isPlaying:!data["2"],
            idAction:data["11"],
            typePlayer:PK_TYPE_PLAYER_NOMARL
        };
    },

    _updateTypePLayer : function (username, type) {
        for(var i=0;i<this.playerSlot.length;i++){
            if(this.playerSlot[i].username == username){
                this.playerSlot[i].info.typePlayer = type;
                this._view.setTypePlayer(username,type);
            }

        }
    },



    _updateRoomInfo : function (params) {
        if(params ){
            this._updateTypePLayer(params["3"],PK_TYPE_PLAYER_BIGBLIND);
            this._updateTypePLayer(params["2"],PK_TYPE_PLAYER_SMALLBLIND);
            this._updateTypePLayer(params["1"],PK_TYPE_PLAYER_DEALER);
            var cards = params["6"];
            if(cards.length>0){
                this._view.cardMix.removeAll();
                var cardObjs = [];
                for (var i = 0; i < cards.length; i++) {
                    cardObjs.push(CardList.prototype.getCardWithId(cards[i]));
                }
                this._view.cardMix.addCardReconnect(cardObjs);
            }

            var moneyPot = parseInt(params["9"]["1"]);
            this._view.lblPot.setString(cc.Global.NumberFormat1(moneyPot));
            this._view.timeMaxTurn = params["8"];


            // auto hien popup ngoi xuong

        }
    },



    _onUserStandupHandler : function (cmd, data) {
        // cc.log(data);
        var timeInfor = {
            timeRemain: 0,
            username: "",
        }
        if(data.p.u == PlayerMe.username){
            this._view.setGoldRemain(false,"0");
            this._view.gameTopBar.backBt.loadTextureNormal("ingame-backBt.png",ccui.Widget.PLIST_TEXTURE) ;
            this._view.allSlot[0].setIsMe(false);
            this._view.stateMe =  PK_STATUSME_STANDUP;
            timeInfor = this._view.getTimePlayerCurrent();
            if(timeInfor.timeRemain > 0)
            {
                cc.log("aaaaaa11");
            }
            var newSlot = [];
            for(var i=0;i<this.playerSlot.length;i++){
                var idx = this.playerSlot[i].userIndex;
                if(idx < 0){
                    idx += maxSlot;
                }
                newSlot[idx] = this.playerSlot[i];
            }
            this.playerSlot = newSlot;
        }
        var slot = this.getSlotPlayerByUsername(data.p.u);
        if(slot)
        {

            slot.info.moneyBet=0;
            slot.info.isPlaying=false;
            slot.info.idAction=PK_ACTION_PLAYER_NONE;
            slot.info.isDealer= PK_TYPE_PLAYER_NOMARL;
        }
        this._onUserExit(data.p.u);
        this._view.fillPlayerToSlot(this.playerSlot);
        this._view.updateInviteButton();
        for(var i=0;i<this.playerSlot.length;i++){
            this._view.allSlot[i].fillInforAgain(this.playerSlot[i].info);
        };
        if(data.p.u == PlayerMe.username && timeInfor.timeRemain > 0)
        {
            cc.log("aaaaaa");
            this._view.setTimeRemainOfPlayer(timeInfor.username,timeInfor.timeRemain)
        }
    },

    _onUserSitDownHandler: function (cmd, content) {
        this.onUserSitDown(content.p);
    },

    _onGameStatusHandler: function (cmd, content) {
        this.onGameStatus(content.p);
    },
    _onRoomOwnerChangedHandler: function (cmd, content) {
        this.onRoomOwnerChanged(content.p);
    },


    _onBetStatusHandler: function (cmd, content) {

    },
    _onFinisRow: function (cmd, content) {
        this.onFinisRow(content.p);
    },
    _onTipCaveHandler: function (cmd, content) {
        this.onTipCaveHandler(content.p);
    },
    _onTipHandler: function (cmd, content) {
        this.onTipHandler(content.p);
    },
    _onStartGameHandler: function (cmd, content) {
        this.onStartGame(content.p);
    },

    _onNewRoundHandler: function (cmd, content) {
        this.onNewRound(content.p);
    },
    _onPreStart: function (cmd, content) {
        this.onPreStart(content.p);
    },
    _onEndGame: function (cmd, content) {
        this.onEndGame(content.p);
    },
    _onHandleSuggest: function (cmd, content) {
        this.onHandleSuggest(content.p);
    },
    _onDrawCard: function (cmd, content) {
        this.onDrawCard(content.p);
    },
    _onRegeditStandup: function (cmd, content) {
        this.onRegeditStandup(content.p);
    },
    _onUpdateMoney: function (cmd, content) {
        this.onUpdateMoney(content.p);
    },

    _onTurnChangedHandler: function (cmd, content) {
        this.onTurnChanged(content.p);
    },
    _onActionPlayer:function (cmd, content) {
        this.onActionPlayer(content.p);
    },

    getSlotPlayerByUsername:function (username) {

        for(var i = 0; i < this.playerSlot.length; i++){
            if(this.playerSlot[i].username ==  username)
            {
                return this.playerSlot[i];
            }
        }
        return null;
    },
    onActionPlayer : function (param) {

        var username = param["u"];
        var money = parseInt(param["3"]);
        var moneyExchange = param["2"];
        var action = param["1"];

        this._view.updateActionPlayer(username, money, moneyExchange, action);
        var slot = this.getSlotPlayerByUsername(username);
        if(slot)
        {
            // var aaa = [];

            slot.info.idAction = action;
            slot.info.moneyBet = money;

        }
    },
    onInitJoin:function (param) {
        this._view.stateMe = PK_STATUSME_STANDUP;
        this._view.setMinBetting(param["8"]);
        this.numberSlot = param["19"];
        this._view.initPlayer(this.numberSlot);
        this._view.setMinMaxSitDown(parseInt(param["16"]),parseInt(param["15"]));

        var arrListPlayer = param["5"];
        for (var i =0; i < arrListPlayer.length; i++){
            var play = arrListPlayer[i];
            if(PlayerMe.username == play["u"] && play["4"] > -1){
                this._view.stateMe = PK_STATUSME_SITDOWN;

                break;
            }
        }
    },

    onJoinRoom : function (param) {

        this.onInitJoin(param);
        this._super(param);
        this.onUpdateMe(param);
        this._updateRoomInfo(param["12"]);
        var currenrt = param["ct"];
        if(currenrt ){
            this._view.setTimeRemainOfPlayer( currenrt["u"], currenrt["1"]/1000);
        }

        this._view.updateInviteButton();
        this._view.findSlotSitDown();
    },

    onUpdateMe:function (param) {
        var arrListPlayer = param["5"];
        for (var i =0; i < arrListPlayer.length; i++){
            var play = arrListPlayer[i];
            if(PlayerMe.username == play["u"] && play["4"] > -1){
                this._view.allSlot[0].setIsMe(true);
                break;
            }
        }
    },
    showGoldRemainReconnect:function (param,gold) {
        var arrListPlayer = param["5"];
        for (var i =0; i < arrListPlayer.length; i++){
            var play = arrListPlayer[i];
            if(PlayerMe.username == play["u"] && play["4"] > -1){
                this._view.setGoldRemain(true,gold);
                break;
            }
        }
    },
    onReconnect: function (param) {
        this.onInitJoin(param["1"]);
        this._super(param);
        this.statusRoom = param["1"]["1"];
        this.onUpdateMe(param["1"]);
        this.showGoldRemainReconnect(param["1"],param["2"]["3"]);
        this._updateRoomInfo(param["1"]["12"]);
        this._view.updateInviteButton();
        if(param["8"] && this._view.stateMe == PK_STATUSME_SITDOWN)
        {
            this._view.gameTopBar.backBt.loadTextureNormal("pk_standup_ac.png",ccui.Widget.PLIST_TEXTURE) ;
        }
        else if (this._view.stateMe == PK_STATUSME_SITDOWN)
        {
            this._view.gameTopBar.backBt.loadTextureNormal("pk_standup.png",ccui.Widget.PLIST_TEXTURE) ;
        }


        var currenrt = param["ct"];
        if(currenrt ){
            var arrButton =  currenrt["2"];
            this._view.handleButtons(arrButton);
            this._view.setTimeRemainOfPlayer( currenrt["u"], currenrt["1"]/1000);
        }
        if(param["7"]){
            this._view.tipBt.setVisible(param["7"]);
        }
        var cards = param["3"];
        if(cards.length>0){
            this._view.allSlot[0].cardList.removeAll();
            var cardObjs = [];
            for (var i = 0; i < cards.length; i++) {
                cardObjs.push(CardList.prototype.getCardWithId(cards[i]));
            }
            this._view.allSlot[0].cardList.dealCards(cardObjs,false);
        }
        if(param["4"]){
            var typeHand = param["4"]["1"];
            this._view.allSlot[0].setNameHand(S_TYPE_CARDS[typeHand],false);
            var cardsLight = param["4"]["2"];
            var cardsBorder = param["4"]["3"];
            var cLight = [];
            for (var j = 0; j < cardsLight.length; j++) {
                cLight.push(CardList.prototype.getCardWithId(cardsLight[j]));
            }
            var cBorder = [];
            for (var j = 0; j < cardsBorder.length; j++) {
                cBorder.push(CardList.prototype.getCardWithId(cardsBorder[j]));
            }
            this._view.allSlot[0].cardList.showBoderCards(cBorder);
            this._view.allSlot[0].cardList.showCardBlack(cLight);

            this._view.cardMix.showBoderCards(cBorder);
            this._view.cardMix.showCardBlack(cLight);
        }

    },

    onRoomOwnerChanged: function (param) {
        this.isOwnerMe = param.u == PlayerMe.username;
    },
    onHandleSuggest:function (param) {
        var action = param["1"];
        var idActive = param["2"];
        this._view.handleCheckBox(idActive,action);
    },

    onRegeditStandup:function (param) {
        var isSuccess = param[1];
        if(isSuccess){
            this._view.gameTopBar.backBt.loadTextureNormal("pk_standup_ac.png",ccui.Widget.PLIST_TEXTURE) ;
            MessageNode.getInstance().show("Đăng ký đứng lên khi hết ván thành công.");
        }
        else{
            this._view.gameTopBar.backBt.loadTextureNormal("pk_standup.png",ccui.Widget.PLIST_TEXTURE) ;

            MessageNode.getInstance().show("Bạn đã HỦY đứng lên khi hết ván");
        }
    },

    onUpdateMoney:function (param) {
        var userName = param["u"];
        var money = parseInt(param["1"]);

        var slot = this.getSlotPlayerByUsername(userName);
        if(slot){
            slot.info.money = money;

            if(param["reason"] && userName == PlayerMe.username){
                if(param["reason"] == 30){
                    var moneyEx = cc.Global.NumberFormat1(parseInt(param["2"]));
                    MessageNode.getInstance().show("Bạn đã tự động mua thêm " +  moneyEx+ " chip vào bàn");
                }
            }
        }
        var slotView = this._view.getSlotByUsername(userName);
        if(slotView){
            slotView.setGold(money);
        }

    },

    onDrawCard:function (param) {
        if(this.statusRoom!=2)
        {
            return;
        }
        var  thiz  = this;
       var typeHand = param["1"];
        var cardsLight = param["2"];
        var cardsBorder = param["3"];
        var cLight = [];
        for (var j = 0; j < cardsLight.length; j++) {
            cLight.push(CardList.prototype.getCardWithId(cardsLight[j]));
        }
        var cBorder = [];
        for (var j = 0; j < cardsBorder.length; j++) {
            cBorder.push(CardList.prototype.getCardWithId(cardsBorder[j]));
        }

        var timeDelay = 0.6;
        if(this.turnId == 1){
            timeDelay = 1.2;
        }
        this._view.stopActionByTag(111);
        var actionDraw = new cc.Sequence(
            new cc.DelayTime(timeDelay),
            new cc.CallFunc(function () {
                thiz._view.allSlot[0].cardList.showBoderCards(cBorder);
                thiz._view.allSlot[0].cardList.showCardBlack(cLight);
                thiz._view.allSlot[0].setNameHand(S_TYPE_CARDS[typeHand],false);
                thiz._view.cardMix.showBoderCards(cBorder);
                thiz._view.cardMix.showCardBlack(cLight);
            })
        );
        actionDraw.setTag(111);
        this._view.runAction(actionDraw);
    },

    onEndGame:function (param) {
        var  thiz = this;
        this._view.stopActionByTag(111);
        var timeRemain = param["18"]/1000;
        for(var i = 0; i < thiz.playerSlot.length; i++){

            thiz.playerSlot[i].info.isPlaying=false;
            thiz.playerSlot[i].info.idAction=PK_ACTION_PLAYER_NONE;
            thiz.playerSlot[i].info.isDealer= PK_TYPE_PLAYER_NOMARL;
        }

        var actionClearPlaew =new cc.Sequence(
            new cc.DelayTime(timeRemain),
            new cc.CallFunc(function () {
                for(var i = 0; i<thiz._view.allSlot.length; i++){
                    cc.log("call here");
                    thiz._view.allSlot[i].resetEndGame();
                }

            }));
        actionClearPlaew.setTag(222);
        this._view.runAction(actionClearPlaew);

        this._view.runAction(new cc.Sequence(
            new cc.DelayTime(2),
            new cc.CallFunc(function () {
                thiz._view.resetGame(timeRemain-2);
            }),
            new cc.DelayTime(timeRemain-2),
            new cc.CallFunc(function () {
                // for(var i = 0; i<thiz._view.allSlot.length; i++){
                //     cc.log("call here");
                //     thiz._view.allSlot[i].resetEndGame();
                // }
                for(var i = 0; i < thiz.playerSlot.length; i++){
                    thiz.playerSlot[i].info.moneyBet=0;
                    thiz.playerSlot[i].info.isPlaying=false;
                    thiz.playerSlot[i].info.idAction=PK_ACTION_PLAYER_NONE;
                    thiz.playerSlot[i].info.isDealer= PK_TYPE_PLAYER_NOMARL;
                }
                thiz._view.cardMix.removeAll();
            })
        ));


        this._view.handleButtons(null);

        //    update money
        var arrPlays = param["3"];
        this._view.runAction(new cc.Sequence(new cc.DelayTime(0.5), new cc.CallFunc(function () {
            SoundPlayer.playSound("pk_chips_bet_many2");
        })));

        for(var i = 0; i< arrPlays.length; i++){
            (function () {
            var temp = arrPlays[i];
            var username = temp["u"];
            var money = parseInt(temp["5"]);
            var isWin = temp["7"];
            var cards = [];
            var cardData = temp["2"];
            for (var j = 0; j < cardData.length; j++) {
                cards.push(CardList.prototype.getCardWithId(cardData[j]));
            }
            var slotController = thiz.getSlotPlayerByUsername(username);
            if(slotController){

                slotController.info.money = money;
            }
            var slotView = thiz._view.getSlotByUsername(username);
            if(slotView){
                slotView.setGold(money);
                slotView.setUserNamePoker();
                slotView.setMoneyBet(0);
                if(isWin){
                    var moneyWin = cc.Global.NumberFormat1(parseInt(temp["4"]));
                    thiz._view.runChipWin(slotView,moneyWin);
                    slotView.setEffectWin(isWin);
                    thiz._view.lblPot.setString("");


                }
                if(temp["6"]){
                        cc.log("co key 6");
                        var typeHand = temp["6"]["1"];
                    var cardsLight = temp["6"]["2"];
                    var cardsBorder =  temp["6"]["3"];
                    var cLight = [];
                    for (var j = 0; j < cardsLight.length; j++) {
                        cLight.push(CardList.prototype.getCardWithId(cardsLight[j]));
                    }
                    var cBorder = [];
                    for (var j = 0; j < cardsBorder.length; j++) {
                        cBorder.push(CardList.prototype.getCardWithId(cardsBorder[j]));
                    }
                        if(PlayerMe.username != username){
                            slotView.phomVituarl.setVisible(false);
                            slotView.cardList.addCardsPokerEndGame(cards);
                        }
                        slotView.setNameHand(S_TYPE_CARDS[typeHand],isWin );
                        if(isWin)
                        {


                            thiz._view.runAction(new cc.Sequence(
                                new cc.DelayTime(0.9),
                                new cc.CallFunc(function () {
                                    slotView.cardList.showBoderCards(cBorder);
                                    slotView.cardList.showCardBlack(cLight);
                                    thiz._view.cardMix.showBoderCards(cBorder);
                                    thiz._view.cardMix.showCardBlack(cLight);
                                })
                            ));
                        }
                        else {
                            slotView.cardList.showBoderCards(cBorder);
                            slotView.cardList.showCardBlack(cLight);
                        }
                }
            }
            })();
        }
    },

    onPreStart:function (param) {
        var bigBlind = param["3"];
        var smallBlind = param["2"];
        var dealer = param["1"];
        this._view.stopActionByTag(222);

        for(var i = 0; i<this._view.allSlot.length; i++){
            cc.log("resetEndGame 1");
            this._view.allSlot[i].resetEndGame();
            cc.log("resetEndGame 3");

        }
        this._view.setTypePlayer(bigBlind, PK_TYPE_PLAYER_BIGBLIND);
        this._view.setTypePlayer(smallBlind, PK_TYPE_PLAYER_SMALLBLIND);
        this._view.setTypePlayer(dealer,PK_TYPE_PLAYER_DEALER);
    },
    onNewRound: function (param) {

        var turnId = param["1"];
        this.turnId = turnId;
        var publicCards = param["2"];
        var  thiz = this;
        if(!param["3"])
        {
            SoundPlayer.stopAllSound();
            if(turnId==1)
            {
                SoundPlayer.playSound("pk_dealer_flop");
            }
            else if(turnId==2)
            {
                SoundPlayer.playSound("pk_dealer_turn");
            }
            else if(turnId==3)
            {
                SoundPlayer.playSound("pk_dealer_river");
            }
        }
        if(turnId==0)
        {
            this._view.cardMix.removeAll();
        }
        var pointCave = this._view.imgCave.getParent().convertToWorldSpace(this._view.imgCave.getPosition());
        if(publicCards.length>0){
            if(turnId==1){
                var cardObjs = [];
                for (var i = 0; i < publicCards.length; i++) {
                    cardObjs.push(CardList.prototype.getCardWithId(publicCards[i]));
                }

                for (var j = 0; j<cardObjs.length;j++){

                    (function () {
                        var jnew = j;
                        thiz._view.cardMix.runAction(new cc.Sequence(
                            new cc.DelayTime(j*0.5),
                            new cc.CallFunc(function () {
                                SoundPlayer.playSound("pk_card_deal");
                                cc.log("=========" + cardObjs[jnew].rank);
                                thiz._view.cardMix.addCardsPoker(cardObjs[jnew],pointCave);
                            })
                        ));

                    })();


                }
            }else {
                SoundPlayer.playSound("pk_card_deal");
                thiz._view.cardMix.addCardsPoker(CardList.prototype.getCardWithId(publicCards[0]),pointCave);
            }
        }


    },

    sendActionRequest: function (action, money) {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("659", {1: action, 2: money});
    },
    onTipHandler:function (param) {
        this._view.tipBt.setVisible(param["1"]);
    },
    onTipCaveHandler:function (param) {
        var moneyT = "+" + cc.Global.NumberFormat1(parseInt(param["1"]));
        var userName = param["u"];
        this._view.playerTip(userName,moneyT);
    },
    onFinisRow: function (param) {

        var  moneyPot = param["2"]["1"];
        this._view.updateMoneyPot(parseInt(moneyPot));
        this._view.resetMoneyBetAllSlot();
        for(var i = 0; i < this.playerSlot.length; i++){

            if(this.playerSlot[i].info.idAction != PK_ACTION_PLAYER_FOLD && this.playerSlot[i].info.idAction != PK_ACTION_PLAYER_ALL_IN)
            {
                this._view.allSlot[i].setUserNamePoker();
            }
            if(this.playerSlot[i].info.moneyBet > 0){
                this._view.takeMoneyFromSlot(this._view.allSlot[i], cc.Global.NumberFormat1(this.playerSlot[i].info.moneyBet));
            }
            this.playerSlot[i].info.moneyBet = 0;
        };

    },
    onStartGame: function (param) {
        var cards = param["1"];
        var cardObjs = [];
        for (var i = 0; i < cards.length; i++) {
            cardObjs.push(CardList.prototype.getCardWithId(cards[i]));
        }
        this._view.performDealCards(cardObjs, true);

    },

    onTurnChanged: function (param) {
        var username = param.u;
        var availableActions = param["2"];
        var minBet = param["3"];
        var maxBet = param["4"];
        this._view.onUpdateTurn(username);
        this._view.handleButtons(availableActions);
        if(username == PlayerMe.username){
            this._view.bettingPoker.setMinMaxAgain(minBet,maxBet);
        }

    },


    onUserJoinRoom: function (p) {
        // var slotIndex = p["4"];
        // var username = p["u"];
        // for(var i=0;i<this.playerSlot.length;i++){
        //     if(this.playerSlot[i].userIndex == slotIndex){
        //         this.playerSlot[i].username = username;
        //         break;
        //     }
        // }
        //
        // var userInfo = {
        //     index: slotIndex,
        //     username: username,
        //     gold: p["3"],
        //     avt: p["avtUrl"]
        // };
        //
        // this._view.userJoinRoom(userInfo);
    },

    onUserSitDown: function (param) {
        //this.onUserJoinRoom(param);
        var thiz = this;
        var slotIndex = param["4"];
        var username = param["u"];

        var gold = param["10"];
        var spectator = param["2"];
        var avt = param["avtUrl"];
        for(var i=0;i<this.playerSlot.length;i++){
         //   (function () {
            if(this.playerSlot[i].userIndex == slotIndex){
                this.playerSlot[i].username = username;
                //this.playerSlot[i].gold = gold;
                this.playerSlot[i].spectator = spectator;
                this.playerSlot[i].avt = avt;
                this.playerSlot[i].info = thiz._createUserInfo(param);
                break;
            }
            // })();
        }


        var timeInfor = {
            timeRemain: 0,
            username: "",
        };
        if(PlayerMe.username == param.u){
            this._view.allSlot[0].setIsMe(true);
            this._view.stateMe = PK_STATUSME_SITDOWN;
            this._view.gameTopBar.backBt.loadTextureNormal("pk_standup.png",ccui.Widget.PLIST_TEXTURE) ;

            timeInfor = this._view.getTimePlayerCurrent();
            if(timeInfor.timeRemain>0){

                cc.log("vvv1");
            }
            var maxSlot = this.getMaxSlot();
            var newSlot = [];
            for(var i=0;i<this.playerSlot.length;i++){
                var idx = this.playerSlot[i].userIndex - slotIndex;
                if(idx < 0){
                    idx += maxSlot;
                }
                newSlot[idx] = this.playerSlot[i];
            }
            this.playerSlot = newSlot;
            this._view.fillPlayerToSlot(this.playerSlot);
        }
        else{
            var userInfo = {
                index: slotIndex,
                username: username,
                gold: param["10"],
                avt: param["avtUrl"]
            };

            this._view.userJoinRoom(userInfo);
        }
        this._view.updateInviteButton();
        for(var i=0;i<this.playerSlot.length;i++){
            this._view.allSlot[i].fillInforAgain(this.playerSlot[i].info);
        }
        if(param.u == PlayerMe.username && timeInfor.timeRemain > 0)
        {
            cc.log("bbbbb");
            this._view.setTimeRemainOfPlayer(timeInfor.username,timeInfor.timeRemain)
        }
    },

    onGameStatus: function (status) {
        this.statusRoom = status;
    },

    getMaxSlot: function () {
        return this.numberSlot;
    },
    sendTipRequest: function ( money) {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("655", { 1: money});
    },
    sendSitDownRequest: function (index, betting, isAuto) {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("653", {1: index, 2: betting, 3: isAuto});
    },

    sendStartRequest: function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("3", null);
    },

    requestStandup : function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("657", null);
    },

    requestSuggest : function (idAction) {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("662", { 1: idAction});
    }
});