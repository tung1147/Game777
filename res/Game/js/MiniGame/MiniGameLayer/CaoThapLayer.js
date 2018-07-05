/**
 * Created by QuyetNguyen on 12/20/2016.
 */

//var s_CaoThapLayer = null;

var CaoThapLayer = MiniGamePopup.extend({
    ctor: function () {
        this._super();
        this._boudingRect = cc.rect(30, 47, 930, 510);

        this.rolling = false;
        // this.timeRemainingInterval = null;
        // this.timeRemaining = 0;
        this.gameType = GameType.MiniGame_CaoThap;

        var bg = new cc.Sprite("#caothap_bg.png");
        bg.setAnchorPoint(cc.p(0, 0));
        this.setContentSize(bg.getContentSize());
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.addChild(bg);

        var highButton = new ccui.Button("caothap_up.png", "", "", ccui.Widget.PLIST_TEXTURE);
        highButton.setPosition(270, 292);
        highButton.setScale9Enabled(true);
        this.addChild(highButton);
        this.highButton = highButton;

        var lowButton = new ccui.Button("caothap_down.png", "", "", ccui.Widget.PLIST_TEXTURE);
        lowButton.setPosition(730, 292);
        lowButton.setScale9Enabled(true);
        this.addChild(lowButton);
        this.lowButton = lowButton;

        var startButton = new ccui.Button("caothap_startButton.png", "", "", ccui.Widget.PLIST_TEXTURE);
        startButton.setZoomScale(0.0);
        startButton.setScale9Enabled(true);
        startButton.setPosition(871.5, 114);
        this.addChild(startButton);
        this.startButton = startButton;

        var nextButton = new ccui.Button("caothap_nextButton.png", "", "", ccui.Widget.PLIST_TEXTURE);
        nextButton.setZoomScale(0.0);
        nextButton.setScale9Enabled(true);
        nextButton.setPosition(startButton.getPosition());
        nextButton.setVisible(false);
        this.addChild(nextButton);
        this.nextButton = nextButton;

        var coinIcon = new cc.Sprite("#caothap_coinIcon.png");
        coinIcon.setPosition(749, 90);
        this.addChild(coinIcon);

        var bankLabel = new cc.LabelBMFont("0", cc.res.font.Roboto_CondensedBold_30);
        bankLabel.setColor(cc.color("#ffea00"));
        bankLabel.setAnchorPoint(cc.p(1.0, 0.5));
        bankLabel.setPosition(725, 90);
        this.bankLabel = bankLabel;
        this.addChild(bankLabel, 1);

        // var timeLabel = new cc.LabelBMFont("", cc.res.font.Roboto_CondensedBold_30);
        // timeLabel.setPosition(500, 415);
        // this.timeLabel = timeLabel;
        // this.addChild(timeLabel, 1);

        var highLabel = new cc.LabelBMFont("CAO", cc.res.font.Roboto_CondensedBold_30);
        highLabel.setColor(cc.color("#c9ceff"));
        highLabel.setPosition(highButton.x, 192);
        this.addChild(highLabel, 1);

        var lowLabel = new cc.LabelBMFont("THẤP", cc.res.font.Roboto_CondensedBold_30);
        lowLabel.setColor(cc.color("#c9ceff"));
        lowLabel.setPosition(lowButton.x, highLabel.y);
        this.addChild(lowLabel, 1);

        var highValueLabel = new cc.LabelBMFont("0", cc.res.font.Roboto_Condensed_25);
        highValueLabel.setColor(cc.color("#ffea00"));
        highValueLabel.setPosition(highButton.x, 160);
        this.highValueLabel = highValueLabel;
        this.addChild(highValueLabel, 2);

        var lowValueLabel = new cc.LabelBMFont("0", cc.res.font.Roboto_Condensed_25);
        lowValueLabel.setColor(cc.color("#ffea00"));
        lowValueLabel.setPosition(lowButton.x, highValueLabel.y);
        this.lowValueLabel = lowValueLabel;
        this.addChild(lowValueLabel, 2);

        var card = new cc.Sprite("#gp_card_up.png");
        card.setScale(2 * cc.winSize.screenScale);
        card.setPosition(500, 260);
        this.addChild(card);
        this.card = card;

        var gameIdLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "", cc.TEXT_ALIGNMENT_LEFT);
        gameIdLabel.setColor(cc.color("#5366cb"));
        gameIdLabel.setScale(0.8);
        gameIdLabel.setPosition(lowButton.x, lowValueLabel.y - 25);
        this.addChild(gameIdLabel);
        this.gameIdLabel = gameIdLabel;

        this.initNoHu();
        this.initHistory();

        var thiz = this;
        lowButton.addClickEventListener(function () {
            thiz.onLowPredictClick();
        });

        highButton.addClickEventListener(function () {
            thiz.onHighPredictClick();
        });

        startButton.addClickEventListener(function () {
            thiz.onStartClick();
        });

        nextButton.addClickEventListener(function () {
            thiz.onLuotMoiBtClick();
        });

        this.setHighLowBtEnable(false);
    },

    onLuotMoiBtClick : function () {
        this._controller.sendLuotMoiRequest();
        SoundPlayer.playSound("mini_clickButton");
        this.setBettingSelectEnable(true);
        this.setReward(0,0);
    },

    onLowPredictClick: function () {
        if (this._controller.getTurnState() != 1)
            return;
        this.setRolling(true);
        this._controller.sendLowPredict();
        SoundPlayer.playSound("mini_clickButton");
    },

    onHighPredictClick: function () {
        if (this._controller.getTurnState() != 1)
            return;
        this.setRolling(true);
        this._controller.sendHighPredict();
        SoundPlayer.playSound("mini_clickButton");
    },

    onStartClick: function () {
        if (this._controller.getTurnState() != 0)
            return;
        this.setRolling(true);
        this._controller.sendInitGame(this.chipGroup.chipSelected.chipIndex);
        SoundPlayer.playSound("mini_clickButton");
        this.setBettingSelectEnable(false);
    },

    initNoHu: function () {
        this._kingCards = [];
        for (var i = 0; i < 3; i++) {
            var kingCard = new cc.Sprite("#caothap_kingCard_1.png");
            kingCard.setPosition(227 + i * 45, 429);
            this.addChild(kingCard, 1);
            this._kingCards.push(kingCard);
        }
    },

    setBankValue: function (value) {
        this.bankLabel.setString(cc.Global.NumberFormat1(value));
    },

    showResultCard: function (cardId) {
        this.setRolling(false);
        if(cardId < 0){
            this.card.setSpriteFrame("gp_card_up.png");
        }
        else{
            var card = CardList.prototype.getCardWithId(cardId);
            this.card.setSpriteFrame(card.rank + s_card_suit[card.suit] + ".png");
        }
    },

    playSoundLost : function () {
        SoundPlayer.playSound("thuaroi");
    },

    initHistory: function () {
        var historyList = new newui.TableView(cc.size(355, 48), 1);
        historyList.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        historyList.setReverse(true);
        historyList.setPosition(205, 65);
        // historyList.setMargin(margin, margin, 0, 0);
        // historyList.setPadding(padding);
        historyList.setScrollBarEnabled(false);
        this.addChild(historyList, 3);
        this.historyList = historyList;

        // for(var i=0;i<30;i++){
        //     this.addHistory(0);
        //     //this.addHistory( Math.floor((Math.random() * 13)));
        // }
    },

    initController: function () {
        this._controller = new CaoThapController(this);
    },

    pushKing: function (isK) {
        if (!isK) {
            for (var i = 0; i < 3; i++) {
                this._kingCards[i].setSpriteFrame("caothap_kingCard_1.png");
                this._kingCards[i].activated = false;
            }
        }
        else {
            var i = 0;
            while (this._kingCards[i].activated && i < 2)
                i++;
            this._kingCards[i].setSpriteFrame("caothap_kingCard_2.png");
            this._kingCards[i].activated = true;
        }
    },

    setRolling: function (isRolling) {
        this.rolling = isRolling;
        if (isRolling) {
            this._rollingSound = SoundPlayer.playSoundLoop("lucky_wheel");
        }
        else {
            SoundPlayer.stopSoundLoop(this._rollingSound);
            this._rollingSound = null;
        }
    },

    update: function (dt) {
        if (this.rolling) {
            // dang quay
            this.delta += dt;
            // if (this.delta < 0.1)
            //     return;
            var randNum = Math.floor(Math.random() * 51 + 4);
            var thiz = this;
            var texture = "" + Math.floor(randNum / 4) +
                s_card_suit[randNum % 4] + ".png";
            this.card.setSpriteFrame(texture);
            this.delta = 0;
        }
    },

    addHistory: function (cardValue, enforce) {
        var card = CardList.prototype.getCardWithId(cardValue);
        var cardIndex = card.rank;
        if (this.historyList.size() > 0) {
            var item = this.historyList.getItem(0);
            item.label.setColor(cc.color("#8d9de6"));
            item.lastCardSprite.setVisible(false);
        }


        var container = new ccui.Widget();
        container.setContentSize(39, 48);

        var cardString = "";
        if (cardIndex == 1)
            cardString = "A";
        else if (cardIndex == 11)
            cardString = "J";
        else if (cardIndex == 12)
            cardString = "Q";
        else if (cardIndex == 13)
            cardString = "K";
        else
            cardString = cardIndex.toString();

        var label = new cc.LabelBMFont(cardString, cc.res.font.Roboto_CondensedBold_30);
        label.setColor(cc.color("#7adfff"));
        label.setPosition(container.getContentSize().width / 2, container.getContentSize().height / 2);
        container.addChild(label);
        container.label = label;

        var lastCardSprite = new cc.Sprite("#caothap_history_lastCard.png");
        lastCardSprite.setPosition(label.getPosition());
        container.addChild(lastCardSprite);
        container.lastCardSprite = lastCardSprite;

        this.historyList.insertItem(container, 0);
        this.historyList.forceRefreshView();
        this.historyList.jumpToRight();
    },

    setReward: function (lowReward, highReward) {
        this.lowValueLabel.setString(cc.Global.NumberFormat1(lowReward));
        this.highValueLabel.setString(cc.Global.NumberFormat1(highReward));

        // this.highButton.enabled = highReward != 0;
        // this.highButton.setBright(highReward != 0);
        //
        // this.lowButton.enabled = lowReward != 0;
        // this.lowButton.setBright(lowReward != 0);
    },

    setGameId: function (gameId) {
        this.gameIdLabel.setString("ID: " + gameId);
    },

    setTimeRemaining: function (timeRemaining) {
        // var thiz = this;
        // this.timeRemaining = timeRemaining;
        // if (this.timeRemainingInterval) {
        //     clearInterval(this.timeRemainingInterval);
        // }
        // this.timeRemainingInterval = setInterval(function () {
        //     if (thiz.timeRemaining <= 0) {
        //         thiz.timeLabel.setString("");
        //         clearInterval(thiz.timeRemainingInterval);
        //         thiz.timeRemainingInterval = null;
        //     } else {
        //         thiz.timeLabel.setString(thiz.formatTime(thiz.timeRemaining));
        //         thiz.timeRemaining--;
        //     }
        // }, 1000);
    },

    formatTime: function (timeRemaining) {
        var minute = Math.floor(timeRemaining / 60);
        if (minute < 10) minute = "0" + minute;
        var second = timeRemaining % 60;
        if (second < 10) second = "0" + second;
        return minute + " : " + second;
    },

    setTipString: function (str) {

    },

    setLuotMoiBtVisible: function (visible) {
        this.startButton.visible = !visible;
        this.nextButton.visible = visible;
    },

    setLuotMoiBtEnable: function (enabled) {
        this.nextButton.enabled = enabled;
        this.startButton.enabled = enabled;
        this.nextButton.setBright(enabled);
        this.startButton.setBright(enabled);
    },

    setHighLowBtEnable: function (enabled) {
        this.setHighBtEnable(enabled);
        this.setLowBtEnable(enabled);
    },

    setHighBtEnable : function (enabled) {
        this.highButton.enabled = enabled;
        this.highButton.setBright(enabled);
    },

    setLowBtEnable : function (enabled) {
        this.lowButton.enabled = enabled;
        this.lowButton.setBright(enabled);
    },

    showJackpot: function () {
        var layer = new JackpotLayer();
        layer.show();
    },

    clearTurn: function () {
        this.bankLabel.setString("0");
        this.nextButton.visible = false;
        this.startButton.visible = true;
        this.historyList.removeAllItems();
        this.card.setSpriteFrame("gp_card_up.png");
        this.setHighLowBtEnable(false);
        this.setLuotMoiBtEnable(true);
        this.setReward(0,0);
        // if (this.timeRemainingInterval)
        //     clearInterval(this.timeRemainingInterval);
        //this.timeLabel.setString("");
    },

    onEnter: function () {
        this._super();
        this.scheduleUpdate();
        //s_CaoThapLayer = this;
    },

    onExit: function () {
        this._super();
        this.unscheduleUpdate();
        //s_CaoThapLayer = null;
    },

    // onError: function (param) {
    //     this._super(param);
    //
    //     //het tien
    //     this.setRolling(false);
    //     this.clearTurn();
    // }
});

// CaoThapLayer.showPopup = function () {
//     if (s_CaoThapLayer) {
//         return null;
//     }
//     var popup = new CaoThapLayer();
//     popup.show();
//     return popup;
// };