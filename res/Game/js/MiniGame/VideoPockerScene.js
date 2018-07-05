/**
 * Created by Quyet Nguyen on 8/30/2016.
 */
var rewardItem = cc.Node.extend({
    widthInPixel: 240,
    ctor: function () {
        this._super();
        this.widthInPixel = 320 * cc.winSize.screenScale;
        this.initItem.apply(this, arguments);
    },
    initItem: function () {
        var bg = new ccui.Scale9Sprite("reward_bg.png", cc.rect(12, 12, 1, 1));
        bg.setPreferredSize(cc.size(this.widthInPixel, 40));
        this.bg = bg;
        this.addChild(bg);

        var bg_active = new ccui.Scale9Sprite("reward_bg_active.png", cc.rect(28, 28, 1, 1));
        bg_active.setPreferredSize(cc.size(this.widthInPixel + 15, 40 + 15));
        var fadeIn = new cc.FadeIn(0.5, cc.p(0, 0));
        var faceOut = new cc.FadeOut(0.5, cc.p(300, 300));
        bg_active.runAction(new cc.RepeatForever(new cc.Sequence(fadeIn, faceOut)));
        this.bg_active = bg_active;
        bg_active.visible = false;
        this.addChild(bg_active);

        var rewardNameLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "", cc.TEXT_ALIGNMENT_LEFT);
        rewardNameLabel.setAnchorPoint(cc.p(0.0, 0.5));
        rewardNameLabel.setPosition(-this.widthInPixel / 2 + 40, this.height / 2);
        rewardNameLabel.setString(arguments[0] || "");
        rewardNameLabel.setColor(cc.color("#ffffab"));
        this.addChild(rewardNameLabel);
        this.rewardNameLabel = rewardNameLabel;

        var rewardXLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "", cc.TEXT_ALIGNMENT_RIGHT);
        rewardXLabel.setAnchorPoint(cc.p(1.0, 0.5));
        rewardXLabel.setPosition(this.widthInPixel / 2 - 10, this.height / 2);
        rewardXLabel.setColor(cc.color("#1a8cbc"));
        if (arguments[1])
            rewardXLabel.setString("X" + arguments[1]);
        this.addChild(rewardXLabel);
        this.rewardXLabel = rewardXLabel;

        var rewardIcon = new cc.Sprite("#rewardIcon.png");
        rewardIcon.setPosition(-this.widthInPixel / 2 + 20, 0);
        this.addChild(rewardIcon);
    },
    setRewardName: function (str) {
        if (this.rewardNameLabel)
            this.rewardNameLabel.setString(str);
    },
    setRewardX: function (str) {
        if (this.rewardXLabel)
            this.rewardXLabel.setString(str);
    },
    setActive: function (isActive) {
        this.bg.visible = !isActive;
        this.bg_active.visible = isActive;
        this.rewardXLabel.setColor(cc.color(isActive ? "#ffff00" : "#1a8cbc"));
    }
});


var VideoPockerScene = MiniGameScene.extend({
    ctor: function () {
        this._super();

        this.baseCardHeight = 0;
        this.cardHeight = 0;
        this.rollHeight = 0;
        this.rolling = false;
        this.rewardFund = [];
        this.cardLayoutMargin = (870 * cc.winSize.screenScale - 590) / 6 + 115 - 80 * cc.winSize.screenScale;
        this.turnState = 0;
        this.rewardGroup = [];
        this.activeReward = {};
        this.rewardCardSprites = [];
        this.cards = [];
        this.stat_board = new StatisticBoard(GameType.MiniGame_VideoPoker);
        for (var i = 0; i < 5; i++)
            this.cards.push({rolling: false});

        this.initAvatarMe();
        this.initButton();
        this.initChip(cc.winSize.width / 2 + 167 * cc.winSize.screenScale);

        this.holdLayers = [];
        this.holdingList = [false, false, false, false, false];

        this.initScene();
        this.initRewards();

        var thiz = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                // if (touch.getLocation().x < cc.winSize.width / 2) {
                //     thiz.adjustAdd();
                // }
                // else {
                //     thiz.adjustSub();
                // }
                // return true;
                for (i = 0; i < thiz.cardSprites.length; i++) {
                    var p = thiz.cardSprites[i].convertToNodeSpace(touch.getLocation());
                    if (cc.rectContainsPoint(
                            cc.rect(0, 0, thiz.cardSprites[i]._getWidth(), thiz.cardSprites[i]._getHeight()),
                            p
                        )) {
                        thiz.holdClick(i);
                        return true;
                    }
                }
                return false;
            }
        }, this);
    },

    initController: function () {
        this._controller = new VideoPokerController(this);
    },

    initScene: function () {

        var thiz = this;

        var miniPokerLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "Video Poker", cc.TEXT_ALIGNMENT_LEFT);
        miniPokerLabel.setAnchorPoint(cc.p(0.0, 0.5));
        miniPokerLabel.setPosition(15 + 105 * cc.winSize.screenScale, 720 - 48 * cc.winSize.screenScale);
        this.sceneLayer.addChild(miniPokerLabel);

        var classicLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Classic", cc.TEXT_ALIGNMENT_LEFT);
        classicLabel.setAnchorPoint(cc.p(0.0, 0.5));
        classicLabel.setPosition(15 + 105 * cc.winSize.screenScale, 720 - 15 - 70 * cc.winSize.screenScale);
        this.sceneLayer.addChild(classicLabel);

        var rollLayer = new cc.Sprite("#roll_bg.png");
        rollLayer.setPosition(cc.winSize.width / 2 + 167 * cc.winSize.screenScale, cc.winSize.height / 2);
        rollLayer.setScale(cc.winSize.screenScale, 1);
        this.sceneLayer.addChild(rollLayer);


        var cards_border = new ccui.Scale9Sprite("poker_cards_border.png", cc.rect(97, 97, 5, 3));
        cards_border.setPreferredSize(cc.size(870 * cc.winSize.screenScale, 325));
        cards_border.setPosition(cc.winSize.width / 2 + 167 * cc.winSize.screenScale, cc.winSize.height / 2 + 25);
        this.sceneLayer.addChild(cards_border);

        var resultLabel = cc.Label.createWithBMFont(cc.res.font.videoPokerRewardFont, "0", cc.TEXT_ALIGNMENT_CENTER);
        resultLabel.setPosition(cc.winSize.width / 2 + 167 * cc.winSize.screenScale, cc.winSize.height / 2 + 175);
        this.resultLabel = resultLabel;
        this.sceneLayer.addChild(resultLabel);

        var resultIcon = new cc.Sprite("#rewardIcon.png");
        resultIcon.setPosition(cc.winSize.width / 2 + 100 * cc.winSize.screenScale, resultLabel.getPositionY());
        resultIcon.setScale(1.2);
        this.sceneLayer.addChild(resultIcon);

        var huthuongLabel = new cc.Sprite("#minipoker_huthuong.png");
        huthuongLabel.setPosition(cc.winSize.width / 2 - 105 * cc.winSize.screenScale, cc.winSize.height / 2 - 130);
        this.sceneLayer.addChild(huthuongLabel);

        var huthuongValueLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_BoldCondensed_36_Glow, "1.000.000", cc.TEXT_ALIGNMENT_CENTER);
        huthuongValueLabel.setPosition(huthuongLabel.x, huthuongLabel.y - 40);
        this.huThuongValueLabel = huthuongValueLabel;
        this.sceneLayer.addChild(huthuongValueLabel);

        var quayBt = new ccui.Button("videoQuayBtn.png", "", "", ccui.Widget.PLIST_TEXTURE);
        quayBt.setPosition(cc.winSize.width / 2 + 167 * cc.winSize.screenScale, cc.winSize.height / 2 - 159);
        quayBt.setZoomScale(0);
        quayBt.setScale(4 / 5);
        this.quayBt = quayBt;
        this.sceneLayer.addChild(quayBt);

        this.initFlashing();

        quayBt.addClickEventListener(function () {
            thiz.onQuayBtClick();
        });

        var nhanthuongBt = new ccui.Button("btnNhanthuong.png", "", "", ccui.Widget.PLIST_TEXTURE);
        nhanthuongBt.setPosition(cc.winSize.width / 2 + 434 * cc.winSize.screenScale, cc.winSize.height / 2 - 160);
        this.nhanthuongBt = nhanthuongBt;
        nhanthuongBt.addClickEventListener(function () {
            thiz.nhanthuongClick();
        });
        nhanthuongBt.setScale(cc.winSize.screenScale);
        this.sceneLayer.addChild(nhanthuongBt);

        var clippingcards_layout = new ccui.Layout();
        this.clippingcards_layout = clippingcards_layout;
        clippingcards_layout.setContentSize(cards_border._getWidth() - 140 * cc.winSize.screenScale, cards_border._getHeight() - 100);
        clippingcards_layout.setClippingEnabled(true);
        clippingcards_layout.setClippingType(ccui.Layout.CLIPPING_SCISSOR);
        clippingcards_layout.setPosition(cc.winSize.width / 2 + 240 * cc.winSize.screenScale - cards_border.width / 2, cc.winSize.height / 2 - 88);
        this.sceneLayer.addChild(clippingcards_layout);

        this.cardSprites = [];
        this.cardRollingSprites = [];
        this.baseCardHeight = clippingcards_layout.height / 2;
        for (i = 0; i < 5; i++) {
            var cardSprite = new cc.Sprite("#gp_card_up.png");
            cardSprite.setPosition(i * (122 + 20 * cc.winSize.screenScale) * cc.winSize.screenScale + this.cardLayoutMargin,
                clippingcards_layout.height / 2 - 3);
            clippingcards_layout.addChild(cardSprite);
            cardSprite.setScale(1.5 * cc.winSize.screenScale);
            var rewardSprite = new cc.Sprite("#card_selected.png");
            rewardSprite.setPosition(cardSprite.getPosition());
            clippingcards_layout.addChild(rewardSprite);
            rewardSprite.setScale(1.05 * cc.winSize.screenScale);
            var fadeIn = new cc.FadeIn(0.5);
            var fadeOut = new cc.FadeOut(0.5);
            rewardSprite.runAction(new cc.RepeatForever(new cc.Sequence(fadeIn, fadeOut)));
            rewardSprite.visible = false;
            this.cardSprites.push(cardSprite);
            this.rewardCardSprites.push(rewardSprite);
        }
        this.cardHeight = clippingcards_layout.height;

        for (i = 0; i < 15; i++) {
            var cardSprite = new cc.Sprite("#card-motion" + (i % 3 + 1) + ".png");
            cardSprite.setPosition((i % 5) * (122 + 20 * cc.winSize.screenScale) * cc.winSize.screenScale + this.cardLayoutMargin,
                clippingcards_layout.height / 2 + (i % 3 - 1) * clippingcards_layout.height);
            clippingcards_layout.addChild(cardSprite);
            cardSprite.setScale(1.5 * cc.winSize.screenScale);
            cardSprite.setOpacity(128);
            cardSprite.visible = false;
            this.cardRollingSprites.push(cardSprite);
        }

        for (i = 0; i < 5; i++) {
            var cardHold = new cc.Sprite("#videopoker_hold.png");
            cardHold.setPosition(i * (122 + 20 * cc.winSize.screenScale) * cc.winSize.screenScale + this.cardLayoutMargin,
                clippingcards_layout.height / 2 - 10 * cc.winSize.screenScale);
            cardHold.setScale(182 / 265 * 1.5 * cc.winSize.screenScale);
            clippingcards_layout.addChild(cardHold);
            cardHold.visible = this.holdingList[i];
            this.holdLayers.push(cardHold);
        }
        this.stat_board = new StatisticBoard();
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
        if (!this.baseCardHeight || !this.cardHeight || !this.rolling)
            return;
        this.rollHeight -= 40;

        this.rollHeight = this.rollHeight > 0 ? this.rollHeight : this.rollHeight + this.cardHeight * 3;
        for (i = 0; i < 15; i++) {
            if (!this.cards[i % 5].rolling || this.holdingList[i % 5]) {
                continue;
            }
            this.cardRollingSprites[i].visible = true;
            var newY = this.baseCardHeight + (i % 3 - 1) * this.cardHeight + this.rollHeight;
            newY = newY > this.baseCardHeight + this.cardHeight ? newY - 2 * this.cardHeight
                : newY;
            this.cardRollingSprites[i].setPosition(
                (i % 5) * (122 + 20 * cc.winSize.screenScale) * cc.winSize.screenScale + this.cardLayoutMargin, newY
            );
        }
    },
    initRewards: function () {
        var margin_left = 35 + 140 * cc.winSize.screenScale;
        var item_height = 50;
        var huthuong = new rewardItem("hũ thưởng");
        huthuong.setAnchorPoint(cc.p(0.0, 0.5));
        huthuong.setPosition(margin_left, 550);
        this.sceneLayer.addChild(huthuong);
        this.rewardGroup.push(huthuong);

        var thungphasanh = new rewardItem("thùng phá sảnh", 50);
        thungphasanh.setAnchorPoint(cc.p(0.0, 0.5));
        thungphasanh.setPosition(margin_left, huthuong.getPositionY() - item_height);
        this.sceneLayer.addChild(thungphasanh);
        this.rewardGroup.push(thungphasanh);

        var tuquy = new rewardItem("tứ quý", 25);
        tuquy.setAnchorPoint(cc.p(0.0, 0.5));
        tuquy.setPosition(margin_left, thungphasanh.getPositionY() - item_height);
        this.sceneLayer.addChild(tuquy);
        this.rewardGroup.push(tuquy);

        var culu = new rewardItem("củ lũ", 9);
        culu.setAnchorPoint(cc.p(0.0, 0.5));
        culu.setPosition(margin_left, tuquy.getPositionY() - item_height);
        this.sceneLayer.addChild(culu);
        this.rewardGroup.push(culu);

        var thung = new rewardItem("thùng", 6);
        thung.setPosition(margin_left, culu.getPositionY() - item_height);
        this.sceneLayer.addChild(thung);
        this.rewardGroup.push(thung);

        //sanh , ba la, hai doi, doi j hoac hon

        var sanh = new rewardItem("sảnh", 4);
        sanh.setPosition(margin_left, thung.getPositionY() - item_height);
        this.sceneLayer.addChild(sanh);
        this.rewardGroup.push(sanh);

        var bala = new rewardItem("ba lá", 3);
        bala.setPosition(margin_left, sanh.getPositionY() - item_height);
        this.sceneLayer.addChild(bala);
        this.rewardGroup.push(bala);

        var haidoi = new rewardItem("hai đôi", 2);
        haidoi.setPosition(margin_left, bala.getPositionY() - item_height);
        this.sceneLayer.addChild(haidoi);
        this.rewardGroup.push(haidoi);

        var doijhoachon = new rewardItem("đôi j hoặc hơn", 1);
        doijhoachon.setPosition(margin_left, haidoi.getPositionY() - item_height);
        this.sceneLayer.addChild(doijhoachon);
        this.rewardGroup.push(doijhoachon);
    },

    onQuayBtClick: function () {
        if (this.rolling)
            return;
        var betType = this.chipGroup.chipSelected.chipIndex;
        switch (this.turnState) {
            case 0:
            case 4:
                this._controller.sendRollRequest(betType);
                this.setRolling(true);
                break;

            case 1:
                this._controller.sendNextRollRequest(this.holdingList);
                this.setRolling(true);
                break;

            case 2:
                this._controller.sendDoubleRequest();
                break;
        }
    },
    performChangeRewardFund: function (data) {
        // called when the reward fund is changed or user select another bet amount
        this._super(data);
        var betAmountID = this.chipGroup.chipSelected.chipIndex;
        if (!this.rewardFund || this.rewardFund.length < 3)
            return;
        this.huThuongValueLabel.setString(this.rewardFund[betAmountID - 1]["2"]);
    },
    nhanthuongClick: function () {
        this._controller.sendGetRewardRequest();
    },

    holdClick: function (holdIndex) {
        if (this.turnState == 1) {
            this.setHoldCard(holdIndex, !this.holdingList[holdIndex]);
        }
        else if (this.turnState == 3) {
            if (holdIndex == 0)
                return;
            this._controller.sendDoubleChoice(holdIndex);
        }
    },

    setHoldCard: function (index, isHold) {
        this.holdingList[index] = isHold;
        this.holdLayers[index].visible = isHold;
    },

    initFlashing: function () {
        //add two particle groups
        var quayTopParticle = new cc.Sprite("#quayTopParticle1.png");
        quayTopParticle.setPosition(cc.winSize.width / 2 + 167 * cc.winSize.screenScale, cc.winSize.height / 2 - 131);
        quayTopParticle.setScale(4 / 5);
        this.quayTopParticle = quayTopParticle;
        this.sceneLayer.addChild(quayTopParticle);

        var quayBtmParticle = new cc.Sprite("#quayBtmParticle1.png");
        quayBtmParticle.setPosition(cc.winSize.width / 2 + 167 * cc.winSize.screenScale, cc.winSize.height / 2 - 195);
        quayBtmParticle.setScale(4 / 5);
        this.quayBtmParticle = quayBtmParticle;
        this.sceneLayer.addChild(quayBtmParticle);

        //quay particle animation
    },

    setFlashing: function (isX2Enabled, isFlashing) {
        this.quayBt.loadTextureNormal(isX2Enabled ? "videoX2Btn.png" : "videoQuayBtn.png",
            ccui.Widget.PLIST_TEXTURE);
        this.quayTopParticle.stopAllActions();
        this.quayBtmParticle.stopAllActions();
        if (isFlashing) {
            if (isX2Enabled) {
                //x2 particle animation
                var x2TopFrames = [];
                for (var i = 1; i <= 2; i++) {
                    var str = "x2TopParticle" + i + ".png";
                    var spriteFrame = cc.spriteFrameCache.getSpriteFrame(str);
                    var animFrame = new cc.AnimationFrame();
                    animFrame.initWithSpriteFrame(spriteFrame, 1, null);
                    x2TopFrames.push(animFrame);
                }
                var x2TopAnimation = cc.Animation.create(x2TopFrames, 0.2, 2);
                var xtAction = cc.Animate.create(x2TopAnimation);
                //  xtAction.retain();
                var x2TopAction = new cc.RepeatForever(xtAction);
                // this.x2TopAction.retain();

                var x2BtmFrames = [];
                for (var i = 1; i <= 2; i++) {
                    var str = "x2BtmParticle" + i + ".png";
                    var spriteFrame = cc.spriteFrameCache.getSpriteFrame(str);
                    var animFrame = new cc.AnimationFrame();
                    animFrame.initWithSpriteFrame(spriteFrame, 1, null);
                    x2BtmFrames.push(animFrame);
                }
                var x2BtmAnimation = cc.Animation.create(x2BtmFrames, 0.2, 2);
                var xbAction = cc.Animate.create(x2BtmAnimation);
                var x2BtmAction = new cc.RepeatForever(xbAction);

                this.quayTopParticle.runAction(x2TopAction);
                this.quayBtmParticle.runAction(x2BtmAction);
            }
            else {
                var quayTopFrames = [];
                for (i = 1; i <= 2; i++) {
                    var str = "quayTopParticle" + i + ".png";
                    var spriteFrame = cc.spriteFrameCache.getSpriteFrame(str);
                    var animFrame = new cc.AnimationFrame();
                    animFrame.initWithSpriteFrame(spriteFrame, 1, null);
                    quayTopFrames.push(animFrame);
                }
                var quayTopAnimation = cc.Animation.create(quayTopFrames, 0.2, 2);
                var qtAction = cc.Animate.create(quayTopAnimation);
                //qtAction.retain();
                var quayTopAction = new cc.RepeatForever(qtAction);
                //this.quayTopAction.retain();

                var quayBtmFrames = [];
                for (var i = 1; i <= 2; i++) {
                    var str = "quayBtmParticle" + i + ".png";
                    var spriteFrame = cc.spriteFrameCache.getSpriteFrame(str);
                    var animFrame = new cc.AnimationFrame();
                    animFrame.initWithSpriteFrame(spriteFrame, 1, null);
                    quayBtmFrames.push(animFrame);
                }
                var quayBtmAnimation = cc.Animation.create(quayBtmFrames, 0.2, 2);
                var qbAction = cc.Animate.create(quayBtmAnimation);
                //qbAction.retain();
                var quayBtmAction = new cc.RepeatForever(qbAction);
                //  this.quayBtmAction.retain();

                this.quayTopParticle.runAction(quayTopAction);
                this.quayBtmParticle.runAction(quayBtmAction);
            }
        }
    },
    updateRewardFund: function () {
        var betAmountID = this.chipGroup.chipSelected.chipIndex;
        if (!this.rewardFund || this.rewardFund.length < 3)
            return;
        this.huThuongValueLabel.setString("" + cc.Global.NumberFormat1(this.rewardFund
                [betAmountID - 1]["2"]));
    },
    onSelectChip: function (chipIndex) {
        if (this.rewardFund.length < 3)
            return;
        this.huThuongValueLabel.setString("" + cc.Global.NumberFormat1(this.rewardFund[chipIndex - 1]["2"]));
    },
    activateReward: function (id) {
        if (this.activeReward instanceof rewardItem)
            this.activeReward.setActive(false);
        if (id < 9) {
            this.activeReward = this.rewardGroup[id];
            this.activeReward.setActive(true);
        }
        else {
            this.activeReward = {};
        }
    },

    resetBoard: function () {
        this.turnState = 0;
        this.setFlashing(false, false);
        this.activateReward(11);// deactive reward
        this.resultLabel.setString("0");

        for (var i = 0; i < 5; i++) {
            this.holdingList[i] = false;
            this.holdLayers[i].visible = false;
            this.cardSprites[i].setSpriteFrame("gp_card_up.png");
        }
    },

    setRolling: function (isRolling) {
        this.rolling = isRolling;
        for (var i = 0; i < 5; i++)
            this.setRollCard(i, isRolling);
    },

    setHoldArray: function (holdArray) {
        this.holdingList = holdArray;
        for (var i = 0; i < 5; i++)
            this.setHoldCard(i, holdArray[i]);
    },

    setCardArray: function (cardArray) {
        for (var i = 0; i < cardArray.length; i++) {
            var card = CardList.prototype.getCardWithId(cardArray[i]);
            this.cardSprites[i].setSpriteFrame("" + card.rank + s_card_suit[card.suit] + ".png");
        }

        this.setRolling(false);
    },

    showDoubleTurn: function (firstCardId) {
        var card = CardList.prototype.getCardWithId(firstCardId);
        this.cardSprites[0].setSpriteFrame("" + card.rank + s_card_suit[card.suit] + ".png");
        for (var i = 1; i < 5; i++) {
            this.cardSprites[i].setSpriteFrame("gp_card_up.png");
            this.holdLayers[i].setVisible(false);
        }
    },

    setRewardCards: function (indexArray) {
        for (var i = 0; i < indexArray.length; i++) {
            this.rewardCardSprites[i].visible = indexArray[i];
        }
    },

    setBankValue: function (value) {
        this.resultLabel.setString(cc.Global.NumberFormat1(value));
    },

    setRollCard: function (index, isRolling) {
        // prevent rolling if the card is holded
        if (this.holdingList[index] && isRolling)
            return;

        for (var i = 0; i < 3; i++) {
            this.cardRollingSprites[i * 5 + index].visible = isRolling;
        }
        this.cardSprites[index].visible = !isRolling;

        // perform stopping action on rolling cards only
        if (isRolling == false && this.cards[index].rolling) {
            var duration = 0.1;
            var basex = this.cardSprites[index].getPositionX();
            var basey = this.cardSprites[index].getPositionY();

            var move1 = new cc.MoveTo(duration, cc.p(basex, basey - 20));
            var move2 = new cc.MoveTo(duration, cc.p(basex, basey));

            this.cardSprites[index].runAction(new cc.Sequence(move1, move2));
            cc.log("stop roll");
        }
        this.cards[index].rolling = isRolling;
    }
});