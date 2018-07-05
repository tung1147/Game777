/**
 * Created by Quyet Nguyen on 8/30/2016.
 */

var CaoThapScene = MiniGameScene.extend({
    ctor: function () {
        this._super();

        this.initAvatarMe();
        this.initButton();
        this.initChip(cc.winSize.width / 2);
        this.stat_board = new StatisticBoard(GameType.MiniGame_CaoThap);

        this.initScene();
        this.delta = 0;

        this.result = 0;
        this.rewardFund = [];
        this.onCooldown = false;

        /*
         turnstate
         0 = chua bat dau
         1 = con luot
         2 = het luot
         */
        this.turnstate = 0;
        this.rolling = false;
        var thiz = this;

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                if (!thiz.card)
                    return false;
                var p = thiz.card.convertToNodeSpace(touch.getLocation());
                if (cc.rectContainsPoint(
                        cc.rect(0, 0, thiz.card._getWidth(), thiz.card._getHeight()),
                        p
                    )) {
                    thiz.onCardClick();
                    return true;
                }
                return false;
            }
        }, this);
    },

    initController: function () {
        this._controller = new CaoThapController(this);
    },

    onSelectChip: function (chipIndex) {
        if (this.rewardFund.length < 3)
            return;
        this.huThuongValueLabel.setString("" + this.rewardFund[chipIndex - 1]["2"]);
    },
    initScene: function () {
        var hiloLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "Hi - Lo", cc.TEXT_ALIGNMENT_LEFT);
        hiloLabel.setAnchorPoint(cc.p(0.0, 0.5));
        hiloLabel.setPosition(15 + 105 * cc.winSize.screenScale, 720 - 48 * cc.winSize.screenScale);
        this.sceneLayer.addChild(hiloLabel);

        var hiloLabel_vn = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Cao - Thấp", cc.TEXT_ALIGNMENT_LEFT);
        hiloLabel_vn.setAnchorPoint(cc.p(0.0, 0.5));
        hiloLabel_vn.setPosition(15 + 105 * cc.winSize.screenScale, 720 - 15 - 70 * cc.winSize.screenScale);
        this.sceneLayer.addChild(hiloLabel_vn);

        var huThuongLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Hũ Thưởng", cc.TEXT_ALIGNMENT_CENTER);
        huThuongLabel.setPosition(100, 565);
        this.sceneLayer.addChild(huThuongLabel);

        var huThuongValueLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "1.000.000.000", cc.TEXT_ALIGNMENT_CENTER);
        huThuongValueLabel.setPosition(100, 525);
        huThuongValueLabel.setColor(cc.color("#ffde00"));
        this.huThuongValueLabel = huThuongValueLabel;
        this.sceneLayer.addChild(huThuongValueLabel);

        var huThuongValueIcon = new cc.Sprite("#ingame-goldIcon.png");
        huThuongValueIcon.setPosition(100, 460);
        huThuongValueIcon.setScale(1.4);
        this.sceneLayer.addChild(huThuongValueIcon);

        var bankValueIcon = new cc.Sprite("#ingame-goldIcon.png");
        bankValueIcon.setPosition(cc.winSize.width / 2, 670);
        bankValueIcon.setScale(1.4);
        this.sceneLayer.addChild(bankValueIcon);

        var bankValueLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "0", cc.TEXT_ALIGNMENT_CENTER);
        bankValueLabel.setPosition(cc.winSize.width / 2, 630);
        bankValueLabel.setColor(cc.color("ffde00"));
        this.sceneLayer.addChild(bankValueLabel);
        this.bankValueLabel = bankValueLabel;

        var tipLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_30, "", cc.TEXT_ALIGNMENT_CENTER);
        tipLabel.setPosition(cc.winSize.width / 2, huThuongLabel.getPositionY());
        this.sceneLayer.addChild(tipLabel);
        this.tipLabel = tipLabel;

        var timeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_40, "", cc.TEXT_ALIGNMENT_CENTER);
        timeLabel.setPosition(cc.winSize.width / 2, tipLabel.getPositionY() - 50);
        timeLabel.setColor(cc.color("#ffde00"));
        this.sceneLayer.addChild(timeLabel);
        this.timeLabel = timeLabel;

        var highBt = new ccui.Button("minigame-highBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        highBt.setScale(cc.winSize.screenScale);
        highBt.setZoomScale(0.05);
        highBt.setPosition(cc.winSize.width / 2 - 240 * cc.winSize.screenScale, 344);
        this.sceneLayer.addChild(highBt);
        this.highBt = highBt;

        var highValueLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_30, "0", cc.TEXT_ALIGNMENT_CENTER);
        highValueLabel.setPosition(highBt.getPositionX(), highBt.getPositionY() - 105 * cc.winSize.screenScale);
        highValueLabel.setColor(cc.color("#ffde00"));
        this.highValueLabel = highValueLabel;
        this.sceneLayer.addChild(highValueLabel);

        var highTip = new cc.Sprite("#klacaonhat.png");
        highTip.setPosition(highValueLabel.getPositionX(), highValueLabel.getPositionY() - 40);
        this.sceneLayer.addChild(highTip);

        var lowBt = new ccui.Button("minigame-lowBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        lowBt.setScale(cc.winSize.screenScale);
        lowBt.setZoomScale(0.05);
        lowBt.setPosition(cc.winSize.width / 2 + 240 * cc.winSize.screenScale, highBt.y);
        this.sceneLayer.addChild(lowBt);
        this.lowBt = lowBt;

        var lowValueLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_30, "0", cc.TEXT_ALIGNMENT_CENTER);
        lowValueLabel.setPosition(lowBt.getPositionX(), highValueLabel.getPositionY());
        lowValueLabel.setColor(cc.color("#ffde00"));
        this.lowValueLabel = lowValueLabel;
        this.sceneLayer.addChild(lowValueLabel);

        var lowTip = new cc.Sprite("#alathapnhat.png");
        lowTip.setPosition(lowValueLabel.getPositionX(), highTip.getPositionY());
        this.sceneLayer.addChild(lowTip);

        var luotMoiBt = new ccui.Button("luotmoi.png", "", "", ccui.Widget.PLIST_TEXTURE);
        luotMoiBt.setScale(cc.winSize.screenScale);
        luotMoiBt.setPosition(cc.winSize.width - 150 * cc.winSize.screenScale, 60);
        luotMoiBt.visible = false;
        this.sceneLayer.addChild(luotMoiBt);
        this.luotMoiBt = luotMoiBt;

        var questionIcon = new cc.Sprite("#question.png");
        questionIcon.setPosition(cc.winSize.width - 100, 525);
        this.sceneLayer.addChild(questionIcon);

        var card = new cc.Sprite("#gp_card_up.png");
        card.setScale(2 * cc.winSize.screenScale);
        card.setPosition(cc.winSize.width / 2, highBt.y);
        this.sceneLayer.addChild(card);
        this.card = card;

        var bg1 = new ccui.Scale9Sprite("minigame-bg1.png", cc.rect(20, 20, 4, 4));
        bg1.setPosition(cc.winSize.width / 2, 655);
        bg1.setPreferredSize(cc.size(350, 94));
        this.sceneLayer.addChild(bg1);

        var bg2 = new ccui.Scale9Sprite("minigame-bg1.png", cc.rect(20, 20, 4, 4));
        bg2.setPreferredSize(cc.size(94, 350));
        bg2.setPosition(100, 323);
        this.sceneLayer.addChild(bg2);

        var bg3 = new ccui.Scale9Sprite("minigame-bg1.png", cc.rect(20, 20, 4, 4));
        bg3.setPreferredSize(bg2.getPreferredSize());
        bg3.setPosition(cc.winSize.width - 100, bg2.y);
        this.sceneLayer.addChild(bg3);

        this.kingCards = [];
        for (var i = 0; i < 3; i++) {
            var kingCard = new cc.Sprite("#minigame-kingCard1.png");
            kingCard.setPosition(bg2.x, 230 + 80 * i);
            kingCard.activated = false;
            this.kingCards.push(kingCard);
            this.sceneLayer.addChild(kingCard);
        }

        var size = cc.size(bg3.getContentSize().width - 4, bg3.getContentSize().height - 4);
        var clippingNode = new ccui.Layout();
        clippingNode.setContentSize(size);
        clippingNode.setClippingEnabled(true);
        clippingNode.setClippingType(ccui.Layout.CLIPPING_SCISSOR);
        clippingNode.setPosition(bg3.x - size.width / 2, bg3.y - size.height / 2);
        this.sceneLayer.addChild(clippingNode);

        var margin = 20.0;
        var padding = 10.0;
        var cardHeight = 123.0;
        this.cardScale = 0.7;
        this.historyMove = cc.p(bg3.x, bg3.y + size.height / 2 - margin - (cardHeight * this.cardScale / 2));
        this.historyListMoveTo = cc.p(0.0, -(cardHeight * this.cardScale + padding));

        var historyList = new newui.TableView(size, 1);
        historyList.setMargin(margin, margin, 0, 0);
        historyList.setPadding(padding);
        historyList.setScrollBarEnabled(false);
        clippingNode.addChild(historyList);
        this.historyList = historyList;

        var thiz = this;
        luotMoiBt.addClickEventListener(function () {
            thiz.onLuotMoiBtClick();
        });
        highBt.addClickEventListener(function () {
            thiz.onHighBtClick();
        });
        lowBt.addClickEventListener(function () {
            thiz.onLowBtClick();
        });
    },
    addHistory: function (data,force) {
        var list = this.historyList;
        var thiz = this;

        var duration = 0.5;
        data = CardList.prototype.getCardWithId(data);
        var cardImg = "#" + data.rank + s_card_suit[data.suit] + ".png";

        if (force){
            list.stopAllActions();
            list.jumpToTop();
            list.setPosition(this.historyListMoveTo.x,this.historyListMoveTo.y);
            list.y = 0;
            var card = new cc.Sprite(cardImg);
            card.setScale(thiz.cardScale);
            list.insertItem(card, 0);
            return;
        }

        var cardMove = new cc.Sprite(cardImg);
        cardMove.setPosition(this.card.getPosition());
        cardMove.setScale(this.card.getScale());
        var moveAction = new cc.Spawn(new cc.MoveTo(duration, this.historyMove), new cc.ScaleTo(duration, this.cardScale));
        var finishAction = new cc.CallFunc(function () {
            cardMove.removeFromParent(true);
        });
        this.sceneLayer.addChild(cardMove);
        cardMove.runAction(new cc.Sequence(moveAction, finishAction));

        list.stopAllActions();
        list.jumpToTop();
        var move2 = new cc.MoveTo(duration, this.historyListMoveTo);
        var finished2 = new cc.CallFunc(function () {
            list.y = 0;
            var card = new cc.Sprite(cardImg);
            card.setScale(thiz.cardScale);
            list.insertItem(card, 0);
        });
        list.runAction(new cc.Sequence(move2, finished2));
    },
    onEnter: function () {
        this._super();
        this.scheduleUpdate();
    },
    onExit: function () {
        this._super();
        this.unscheduleUpdate();
    },
    update: function (dt) {
        if (this.rolling) {
            // dang quay
            this.delta += dt;
            // if (this.delta < 0.1)
            //     return;
            var randNum = Math.floor(Math.random() * 51 + 4);
            var thiz = this;
            thiz.setCard(randNum);
            this.delta = 0;
        }
    },
    onCardClick: function () {
        if (this._controller.turnState == 0) {
            this._controller.sendInitGame(this.chipGroup.chipSelected.chipIndex);
        }
    },
    onLuotMoiBtClick: function () {
        this._controller.sendLuotMoiRequest();
    },

    clearTurn: function () {
        this.bankValueLabel.setString("0");
        this.luotMoiBt.visible = false;
        this.historyList.removeAllItems();
        this.card.setSpriteFrame("gp_card_up.png");
        this.timeLabel.setString("");
    },

    onHighBtClick: function () {
        if (this._controller.turnState != 1 || this.rolling)
            return;
        this._controller.sendHighPredict();
    },

    onLowBtClick: function () {
        if (this._controller.turnState != 1 || this.rolling)
            return;
        this._controller.sendLowPredict();
    },
    setCard: function (cardNum) {
        // if (cardNum < 4 || cardNum > 55)
        //     cc.log(cardNum);
        this.card.setSpriteFrame("" + Math.floor(cardNum / 4) +
            s_card_suit[cardNum % 4] + ".png");
    },
    setRolling: function (isRolling) {
        this.rolling = isRolling;
    },

    setTimeRemaining: function (seconds) {
        if (seconds > 0)
            this.timeLabel.setString("" + Math.floor(seconds / 60) + ":" + seconds % 60);
        else
            this.timeLabel.setString("");
    },

    setGameId : function (gameId) {

    },

    performChangeRewardFund: function (data) {
        this._super(data);
        var betAmountID = this.chipGroup.chipSelected.chipIndex;
        if (!this.rewardFund || this.rewardFund.length < 3)
            return;
        this.huThuongValueLabel.setString(this.rewardFund[betAmountID - 1]["2"]);
    },

    pushKing: function (isK) {
        if (!isK) {
            for (var i = 0; i < 3; i++) {
                this.kingCards[i].setSpriteFrame("minigame-kingCard1.png");
                this.kingCards[i].activated = false;
            }
        }
        else {
            var i = 0;
            while (this.kingCards[i].activated && i < 2)
                i++;
            this.kingCards[i].setSpriteFrame("minigame-kingCard2.png");
            this.kingCards[i].activated = true;
        }
    },
    setBankValue: function (value) {
        this.bankValueLabel.setString(cc.Global.NumberFormat1(value));
    },
    setReward: function (lowValue, highValue) {
        this.lowValueLabel.setString(cc.Global.NumberFormat1(lowValue));
        this.highValueLabel.setString(cc.Global.NumberFormat1(highValue));
    },
    showResultCard: function (cardId) {
        var card = CardList.prototype.getCardWithId(cardId);
        this.card.setSpriteFrame(card.rank + s_card_suit[card.suit] + ".png");
    },
    setLuotMoiBtVisible: function (visible) {
        this.luotMoiBt.visible = visible;
    },
    setTipString: function (str) {
        this.tipLabel.setString(str);
    }
});