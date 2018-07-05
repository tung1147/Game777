/**
 * Created by Quyet Nguyen on 8/30/2016.
 *
 *
 */

var MiniPokerScene = MiniGameScene.extend({
    ctor: function () {
        this._super();

        this.autoRoll = false;
        this.delta = 0;
        this.baseCardHeight = 0;
        this.cardHeight = 0;
        this.rollHeight = 0;
        this.rolling = false;
        this.rewardFund = [];
        this.cardLayoutMargin = (870 * cc.winSize.screenScale - 590) / 6 + 115 - 80 * cc.winSize.screenScale;
        this.activeReward = {};
        this.rewardGroup = [];
        this.rewardCardSprites = [];
        this.stat_board = new StatisticBoard(GameType.MiniGame_Poker);

        this.initAvatarMe();
        this.initButton();
        this.initChip(cc.winSize.width / 2 + 100);

        this.cards = [];
        for (var i = 0; i < 5; i++)
            this.cards.push({rolling: false});

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
                if (!thiz.quaytudong)
                    return false;
                var p = thiz.quaytudong.convertToNodeSpace(touch.getLocation());
                if (cc.rectContainsPoint(
                        cc.rect(0, 0, thiz.quaytudong._getWidth(), thiz.quaytudong._getHeight()),
                        p
                    )) {
                    thiz.quaytudongClick();
                    return true;
                }
                return false;
            }
        }, this);

    },

    initController: function () {
        this._controller = new MiniPokerController(this);
    },

    initScene: function () {

        var thiz = this;

        var miniPokerLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "Mini Poker", cc.TEXT_ALIGNMENT_LEFT);
        miniPokerLabel.setAnchorPoint(cc.p(0.0, 0.5));
        miniPokerLabel.setPosition(15 + 105 * cc.winSize.screenScale, 720 - 48 * cc.winSize.screenScale);
        this.sceneLayer.addChild(miniPokerLabel);

        var classicLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Classic", cc.TEXT_ALIGNMENT_LEFT);
        classicLabel.setAnchorPoint(cc.p(0.0, 0.5));
        classicLabel.setPosition(15 + 105 * cc.winSize.screenScale, 720 - 15 - 70 * cc.winSize.screenScale);
        this.sceneLayer.addChild(classicLabel);

        var rollLayer = new cc.Sprite("#roll_bg.png");
        rollLayer.setPosition(cc.winSize.width / 2 + 167 * cc.winSize.screenScale, cc.winSize.height / 2);
        rollLayer.setScale(cc.winSize.screenScale, 0.9);
        this.sceneLayer.addChild(rollLayer);


        var cards_border = new ccui.Scale9Sprite("poker_cards_border.png", cc.rect(97, 97, 5, 3));
        cards_border.setPreferredSize(cc.size(870 * cc.winSize.screenScale, 275));
        cards_border.setPosition(cc.winSize.width / 2 + 167 * cc.winSize.screenScale, cc.winSize.height / 2 + 20);
        this.sceneLayer.addChild(cards_border);

        var resultLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "", cc.TEXT_ALIGNMENT_CENTER);
        resultLabel.setPosition(cc.winSize.width / 2 + 167 * cc.winSize.screenScale, cc.winSize.height / 2 + 155);
        resultLabel.setColor(cc.color("#ffde00"));
        this.resultLabel = resultLabel;
        this.sceneLayer.addChild(resultLabel);

        var huthuongLabel = new cc.Sprite("#minipoker_huthuong.png");
        huthuongLabel.setPosition(cc.winSize.width / 2 - 105 * cc.winSize.screenScale, cc.winSize.height / 2 - 115);
        this.sceneLayer.addChild(huthuongLabel);

        var huthuongValueLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_BoldCondensed_36_Glow, "1", cc.TEXT_ALIGNMENT_CENTER);
        huthuongValueLabel.setPosition(huthuongLabel.x, huthuongLabel.y - 40);
        this.huThuongValueLabel = huthuongValueLabel;
        this.sceneLayer.addChild(huthuongValueLabel);

        var quayBt = new ccui.Button("videoQuayBtn.png", "", "", ccui.Widget.PLIST_TEXTURE);
        quayBt.setPosition(cc.winSize.width / 2 + 167 * cc.winSize.screenScale, cc.winSize.height / 2 - 139);
        quayBt.setZoomScale(0);
        quayBt.setScale(4 / 5);
        this.quayBt = quayBt;
        this.sceneLayer.addChild(quayBt);

        this.initFlashing();

        quayBt.addClickEventListener(function () {
            thiz.onQuayBtClick();
        });

        var quaytudong = new cc.Sprite("#quaytudong.png");
        quaytudong.setPosition(cc.winSize.width / 2 + 434 * cc.winSize.screenScale, cc.winSize.height / 2 - 140);
        this.quaytudong = quaytudong;
        quaytudong.setScale(cc.winSize.screenScale);
        this.sceneLayer.addChild(quaytudong);

        var clippingcards_layout = new ccui.Layout();
        clippingcards_layout.setContentSize(cards_border._getWidth() - 140 * cc.winSize.screenScale, cards_border._getHeight() - 125);
        clippingcards_layout.setClippingEnabled(true);
        clippingcards_layout.setClippingType(ccui.Layout.CLIPPING_SCISSOR);
        clippingcards_layout.setPosition(cc.winSize.width / 2 + 240 * cc.winSize.screenScale - cards_border.width / 2, cc.winSize.height / 2 - 50);
        this.sceneLayer.addChild(clippingcards_layout);

        this.cardSprites = [];
        this.cardRollingSprites = [];
        this.baseCardHeight = clippingcards_layout.height / 2;
        for (i = 0; i < 5; i++) {
            var cardSprite = new cc.Sprite("#" + Math.floor(Math.random() * 13 + 1)
                + s_card_suit[Math.floor(Math.random() * 4)] + ".png");
            cardSprite.setPosition(i * (120 + 20 * cc.winSize.screenScale) * cc.winSize.screenScale + this.cardLayoutMargin, clippingcards_layout.height / 2);
            clippingcards_layout.addChild(cardSprite);
            var rewardSprite = new cc.Sprite("#card_selected.png");
            rewardSprite.setPosition(cardSprite.getPosition());
            clippingcards_layout.addChild(rewardSprite);
            rewardSprite.setScale(1.05 / 1.5);
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
            cardSprite.setPosition((i % 5) * (120 + 20 * cc.winSize.screenScale) * cc.winSize.screenScale + this.cardLayoutMargin,
                clippingcards_layout.height / 2 + (i % 3 - 1) * clippingcards_layout.height);
            clippingcards_layout.addChild(cardSprite);
            cardSprite.setOpacity(128);
            cardSprite.visible = false;
            this.cardRollingSprites.push(cardSprite);
        }

        this.stat_board = new StatisticBoard();
    },
    onSelectChip: function (chipIndex) {
        if (this.rewardFund.length < 3)
            return;
        this.huThuongValueLabel.setString("" + cc.Global.NumberFormat1(this.rewardFund[chipIndex - 1]["2"]));
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
        if (!this.baseCardHeight || !this.cardHeight || this.cards.length < 5
            || !this.rolling)
            return;
        this.rollHeight -= 40;

        this.rollHeight = this.rollHeight > 0 ? this.rollHeight : this.rollHeight + this.cardHeight * 3;
        for (i = 0; i < 15; i++) {
            if (!this.cards[i % 5].rolling) {
                continue;
            }
            this.cardRollingSprites[i].visible = true;
            var newY = this.baseCardHeight + (i % 3 - 1) * this.cardHeight + this.rollHeight;
            newY = newY > this.baseCardHeight + this.cardHeight ? newY - 2 * this.cardHeight
                : newY;
            this.cardRollingSprites[i].setPosition((i % 5) * (120 + 20 * cc.winSize.screenScale)
                * cc.winSize.screenScale + this.cardLayoutMargin, newY
            );
        }
    },
    initRewards: function () {
        var margin_left = 35 + 140 * cc.winSize.screenScale;
        var item_height = 50;

        var huthuong = new rewardItem("HŨ THƯỞNG");
        huthuong.setAnchorPoint(cc.p(0.0, 0.5));
        huthuong.setPosition(margin_left, 550);
        this.sceneLayer.addChild(huthuong);
        this.rewardGroup.push(huthuong);

        var thungphasanh = new rewardItem("THÙNG PHÁ SẢNH", 1000);
        thungphasanh.setAnchorPoint(cc.p(0.0, 0.5));
        thungphasanh.setPosition(margin_left, huthuong.getPositionY() - item_height);
        this.sceneLayer.addChild(thungphasanh);
        this.rewardGroup.push(thungphasanh);

        var tuquy = new rewardItem("TỨ QUÝ", 150);
        tuquy.setAnchorPoint(cc.p(0.0, 0.5));
        tuquy.setPosition(margin_left, thungphasanh.getPositionY() - item_height);
        this.sceneLayer.addChild(tuquy);
        this.rewardGroup.push(tuquy);

        var culu = new rewardItem("CỦ LŨ", 50);
        culu.setAnchorPoint(cc.p(0.0, 0.5));
        culu.setPosition(margin_left, tuquy.getPositionY() - item_height);
        this.sceneLayer.addChild(culu);
        this.rewardGroup.push(culu);

        var thung = new rewardItem("THÙNG", 20);
        thung.setPosition(margin_left, culu.getPositionY() - item_height);
        this.sceneLayer.addChild(thung);
        this.rewardGroup.push(thung);

        var sanh = new rewardItem("SẢNH", 13);
        sanh.setPosition(margin_left, thung.getPositionY() - item_height);
        this.sceneLayer.addChild(sanh);
        this.rewardGroup.push(sanh);

        var bala = new rewardItem("SÂM", 8);
        bala.setPosition(margin_left, sanh.getPositionY() - item_height);
        this.sceneLayer.addChild(bala);
        this.rewardGroup.push(bala);

        var haidoi = new rewardItem("HAI ĐÔI", 5);
        haidoi.setPosition(margin_left, bala.getPositionY() - item_height);
        this.sceneLayer.addChild(haidoi);
        this.rewardGroup.push(haidoi);

        var doijhoachon = new rewardItem("ĐÔI J HOẶC HƠN", 2.5);
        doijhoachon.setPosition(margin_left, haidoi.getPositionY() - item_height);
        this.sceneLayer.addChild(doijhoachon);
        this.rewardGroup.push(doijhoachon);
    },
    activateReward: function (id, rank) {
        if (this.activeReward instanceof rewardItem)
            this.activeReward.setActive(false);
        if (id < 9) {
            this.activeReward = this.rewardGroup[id];
            this.activeReward.setActive(true);
            if (id == 2 || id == 6 || id == 8) {
                var result = "";
                switch (id) {
                    case 2:
                        result += "TỨ QUÝ ";
                        break;
                    case 6:
                        result += "BA LÁ ";
                        break;
                    case 8:
                        result += "ĐÔI ";
                        break;
                }
                switch (rank) {
                    case 12:
                        result += "ÁT";
                        break;
                    case 0:
                        result += "HAI";
                        break;
                    case 1:
                        result += "BA";
                        break;
                    case 2:
                        result += "BỐN";
                        break;
                    case 3:
                        result += "NĂM";
                        break;
                    case 4:
                        result += "SÁU";
                        break;
                    case 5:
                        result += "BẢY";
                        break;
                    case 6:
                        result += "TÁM";
                        break;
                    case 7:
                        result += "CHÍN";
                        break;
                    case 8:
                        result += "MƯỜI";
                        break;
                    case 9:
                        result += "J";
                        break;
                    case 10:
                        result += "Q";
                        break;
                    case 11:
                        result += "K";
                        break;
                }
                this.resultLabel.setString(result);
            }
            else
                this.resultLabel.setString(this.activeReward.rewardNameLabel.getString());
        }
        else {
            this.activeReward = {};
            this.resultLabel.setString("Không ăn");
        }

    },
    quaytudongClick: function () {
        this.autoRoll = !this.autoRoll;
        this.quaytudong.setSpriteFrame(this.autoRoll ? "quaytudong_active.png" : "quaytudong.png");
        this._controller.setAutoRoll(this.autoRoll);
        if (!this.rolling && this.autoRoll)
            this.onQuayBtClick();
    },
    onQuayBtClick: function () {
        if (this.rolling)
            return;
        this._controller.sendRollRequest(this.chipGroup.chipSelected.chipIndex);
        this.setRolling(true);
    },

    initFlashing: function () {
        //add two particle groups
        var quayTopParticle = new cc.Sprite("#quayTopParticle1.png");
        quayTopParticle.setPosition(cc.winSize.width / 2 + 167 * cc.winSize.screenScale, cc.winSize.height / 2 - 111);
        quayTopParticle.setScale(4 / 5);
        this.quayTopParticle = quayTopParticle;
        this.sceneLayer.addChild(quayTopParticle);

        var quayBtmParticle = new cc.Sprite("#quayBtmParticle1.png");
        quayBtmParticle.setPosition(cc.winSize.width / 2 + 167 * cc.winSize.screenScale, cc.winSize.height / 2 - 175);
        quayBtmParticle.setScale(4 / 5);
        this.quayBtmParticle = quayBtmParticle;
        this.sceneLayer.addChild(quayBtmParticle);
    },
    setFlashing: function (isFlashing) {
        this.quayTopParticle.stopAllActions();
        this.quayBtmParticle.stopAllActions();
        if (isFlashing) {

            var quayTopFrames = [];
            for (var i = 1; i <= 2; i++) {
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
            //  this.quayTopAction.retain();

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
            // qbAction.retain();
            var quayBtmAction = new cc.RepeatForever(qbAction);
            // this.quayBtmAction.retain();

            this.quayTopParticle.runAction(quayTopAction);
            this.quayBtmParticle.runAction(quayBtmAction);
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

    setCardArray: function (cardArray) {
        for (var i = 0; i < cardArray.length; i++) {
            var card = CardList.prototype.getCardWithId(cardArray[i]);
            this.cardSprites[i].setSpriteFrame("" + card.rank + s_card_suit[card.suit] + ".png");
        }
        this.setRolling(false);
    },

    setRewardCards: function (indexArray) {
        for (var i = 0; i < indexArray.length; i++) {
            this.rewardCardSprites[i].visible = indexArray[i];
        }
    },

    setRollCard: function (index, isRolling) {
        for (var i = 0; i < 3; i++) {
            this.cardRollingSprites[i * 5 + index].visible = isRolling;
        }
        this.cardSprites[index].visible = !isRolling;
        this.cards[index].rolling = isRolling;
        if (!isRolling) {
            var duration = 0.1;
            var basex = this.cardSprites[index].getPositionX();
            var basey = this.cardSprites[index].getPositionY();
            cc.log("basey : " + basey);

            var move1 = new cc.MoveTo(duration, cc.p(basex, basey - 20));
            var move2 = new cc.MoveTo(duration, cc.p(basex, basey));

            this.cardSprites[index].runAction(new cc.Sequence(move1, move2));
        }
    },

    setRolling: function (isRolling) {
        this.rolling = isRolling;
        for (var i = 0; i < 5; i++)
            this.setRollCard(i, isRolling);
    }
});