/**
 * Created by QuyetNguyen on 12/20/2016.
 */
//var s_VideoPokerLayer = null;
var VideoPokerLayer = MiniGamePopup.extend({
    ctor: function () {
        this._super();

        this.cardSprites = [];
        this.rolling = false;
        this.baseCardHeight = 0;
        this.cardHeight = 0;
        this.rollHeight = 0;
        this.rewards = [];
        this.rewardLayer = [];
        this.cardRollingSprites = [];
        this.holdingList = [0, 0, 0, 0, 0];
        this.holdLayers = [];
        this.gameType = GameType.MiniGame_VideoPoker;

        var thiz = this;


        var bg = new cc.Sprite("#videopoker_bg.png");
        bg.setAnchorPoint(cc.p(0, 0));
        this.setContentSize(bg.getContentSize());
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.addChild(bg);

        this.initRewards();

        var resultLabel = new cc.LabelBMFont("", cc.res.font.Roboto_CondensedBold_30);
        resultLabel.setColor(cc.color("#c9ceff"));
        resultLabel.setPosition(500, 370);
        this.resultLabel = resultLabel;
        this.addChild(resultLabel, 1);

        var gameIdLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "ID : 1231231233", cc.TEXT_ALIGNMENT_LEFT);
        gameIdLabel.setColor(cc.color("#5366cb"));
        gameIdLabel.setScale(0.8);
        gameIdLabel.setPosition(730, 135);
        this.addChild(gameIdLabel);
        this.gameIdLabel = gameIdLabel;

        var rollButton = new ccui.Button("minipoker_rollButton.png", "", "", ccui.Widget.PLIST_TEXTURE);
        rollButton.setZoomScale(0.0);
        rollButton.setScale9Enabled(true);
        rollButton.setPosition(870, 114);
        this.addChild(rollButton);
        this.rollButton = rollButton;

        var clippingCardLayout = new ccui.Layout();
        clippingCardLayout.setContentSize(750, 170);
        clippingCardLayout.setClippingEnabled(true);
        clippingCardLayout.setClippingType(ccui.Layout.CLIPPING_SCISSOR);
        clippingCardLayout.setPosition(180, 170);
        this.addChild(clippingCardLayout);
        this.cardHeight = clippingCardLayout.height;
        this.baseCardHeight = clippingCardLayout.height / 2;

        for (var i = 0; i < 5; i++) {
            var sprite = new cc.Sprite("#gp_card_up.png");
            sprite.setScale(1.4);
            sprite.setPosition(60 + 135 * i, clippingCardLayout.height / 2);
            clippingCardLayout.addChild(sprite);
            this.cardSprites.push(sprite);

            var rewardSprite = new cc.Sprite("#videopoker_rewardLayer.png");
            rewardSprite.setPosition(sprite.getPosition());
            rewardSprite.setScale(1.4);
            rewardSprite.setVisible(false);
            clippingCardLayout.addChild(rewardSprite);
            this.rewardLayer.push(rewardSprite);

            var holdSprite = new cc.Sprite("#videopoker_holdLayer.png");
            holdSprite.setPosition(sprite.getPosition());
            holdSprite.setScale(1.4);
            holdSprite.setVisible(false);

            var holdLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25,"HOLD");
            holdLabel.setColor(cc.color("#ffd509"));
            holdLabel.setPosition(holdSprite.width / 2, holdSprite.height/2);
            holdSprite.addChild(holdLabel);

            clippingCardLayout.addChild(holdSprite);
            this.holdLayers.push(holdSprite);
        }

        for (var i = 0; i < 15; i++) {
            var rollingSprite = new cc.Sprite("#card-motion" + (i % 3 + 1) + ".png");
            rollingSprite.setPosition(this.cardSprites[i % 5].x,
                clippingCardLayout.height / 2 + (i % 3 - 1) * clippingCardLayout.height);
            clippingCardLayout.addChild(rollingSprite, 4);
            rollingSprite.setOpacity(128);
            rollingSprite.setVisible(false);
            rollingSprite.setScale(1.4);
            this.cardRollingSprites.push(rollingSprite);
        }

        var coinIcon = new cc.Sprite("#caothap_coinIcon.png");
        coinIcon.setPosition(549, 90);
        this.addChild(coinIcon);

        var bankLabel = new cc.LabelBMFont("", cc.res.font.Roboto_CondensedBold_30);
        bankLabel.setColor(cc.color("#ffea00"));
        bankLabel.setAnchorPoint(cc.p(1.0, 0.5));
        bankLabel.setPosition(520, 90);
        this.bankLabel = bankLabel;
        this.addChild(bankLabel, 1);

        var nhanThuongBt = new ccui.Button("videopoker_nhanthuongBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        nhanThuongBt.setPosition(685, 90);
        nhanThuongBt.setScale9Enabled(true);
        this.nhanThuongBt = nhanThuongBt;
        this.addChild(nhanThuongBt, 1);
        this.setNhanThuongBtEnable(false);

        this._boudingRect = cc.rect(30, 47, 930, 510);

        this.rollButton.addClickEventListener(function () {
            thiz.onRollButtonClick();
        });
        nhanThuongBt.addClickEventListener(function () {
            thiz.onGetRewardButtonClick();
        });

        var lblHD = new cc.LabelTTF("", cc.res.font.Roboto_CondensedBold, 25);
        lblHD.setColor(cc.color(190,240,253));
        lblHD.setPosition(bg.getContentSize().width/2, 370);
        bg.addChild(lblHD);
        this.lblHD = lblHD;
        //   this.setScale(0.5);
    },

    onGetRewardButtonClick: function () {
        this._controller.sendGetRewardRequest();
    },

    onRollButtonClick: function () {
        if (this.rolling)
            return;
        var betType = this.chipGroup.chipSelected.chipIndex;
        switch (this._controller.getTurnState()) {
            case 0:
            case 4:
                this.setHoldArray([0, 0, 0, 0, 0]);
                this.setRolling(true);
                this.setBettingSelectEnable(false)
                this._controller.sendRollRequest(betType);
                break;

            case 1:
                this.setRolling(true);
                this._controller.sendNextRollRequest(this.holdingList);
                break;

            case 2:
                this._controller.sendDoubleRequest();
                break;
        }
    },

    resetBoard: function () {
        this.setFlashing(false, false);
        this.resultLabel.setString("");
        this.bankLabel.setString("0");
        this.setNhanThuongBtEnable(false);

        for (var i = 0; i < 5; i++) {
            this.holdingList[i] = false;
            this.holdLayers[i].visible = false;
            this.cardSprites[i].setSpriteFrame("gp_card_up.png");
        }
    },

    setHoldArray: function (holdArray) {
        for (var i = 0; i < 5; i++)
            this.holdLayers[i].visible = holdArray[i];
        this.holdingList = holdArray;
    },

    setBankValue: function (value) {
        this.bankLabel.setString(cc.Global.NumberFormat1(value));
    },

    update: function (dt) {
        if (!this.baseCardHeight || !this.cardHeight || !this.rolling)
            return;
        this.rollHeight -= 40;

        this.rollHeight = this.rollHeight > 0 ? this.rollHeight : this.rollHeight + this.cardHeight * 3;
        for (var i = 0; i < 15; i++) {
            var newY = this.baseCardHeight + (i % 3 - 1) * this.cardHeight + this.rollHeight;
            newY = newY > this.baseCardHeight + this.cardHeight ? newY - 2 * this.cardHeight
                : newY;
            this.cardRollingSprites[i].setPositionY(newY);
        }
    },

    activateReward: function (id, rank) {
        if (this._controller.getTurnState() != 2) {
            this.resultLabel.setString("");
            return;
        }
        var str = "";
        str = this.rewards[id] ? this.rewards[id] : "KHÔNG ĂN";
        // if (rank) {
        //     switch (rank) {
        //         case 12:
        //             str += " ÁT";
        //             break;
        //         case 0:
        //             str += " HAI";
        //             break;
        //         case 1:
        //             str += " BA";
        //             break;
        //         case 2:
        //             str += " BỐN";
        //             break;
        //         case 3:
        //             str += " NĂM";
        //             break;
        //         case 4:
        //             str += " SÁU";
        //             break;
        //         case 5:
        //             str += " BẢY";
        //             break;
        //         case 6:
        //             str += " TÁM";
        //             break;
        //         case 7:
        //             str += " CHÍN";
        //             break;
        //         case 8:
        //             str += " MƯỜI";
        //             break;
        //         case 9:
        //             str += " J";
        //             break;
        //         case 10:
        //             str += " Q";
        //             break;
        //         case 11:
        //             str += " K";
        //             break;
        //     }
        // }

        this.resultLabel.setString(str);
    },

    holdClick: function (holdIndex) {
        if (this._controller.getTurnState() === 1) {
            this.setHoldCard(holdIndex, !this.holdingList[holdIndex]);
            return true;
        }
        else if (this._controller.getTurnState() === 3) {
            if (holdIndex === 0){
                return false;
            }
            this._controller.sendDoubleChoice(holdIndex);
            return true;
        }
        return false;
    },

    showDoubleTurn: function (firstCardId) {
        var card = CardList.prototype.getCardWithId(firstCardId);
        this.cardSprites[0].setSpriteFrame("" + card.rank + s_card_suit[card.suit] + ".png");
        for (var i = 1; i < 5; i++) {
            this.cardSprites[i].setSpriteFrame("gp_card_up.png");
            this.holdLayers[i].setVisible(false);
        }
    },

    setHoldCard: function (index, isHold) {
        this.holdingList[index] = isHold;
        this.holdLayers[index].visible = isHold;
    },

    revealDoubleResult : function (cardArray,choosenPos) {
        this.setCardArray(cardArray);
        this.setHoldCard(choosenPos,true);
        SoundPlayer.playSound("open_card");
    },

    setFlashing: function (isX2enabled) {
        this.rollButton.loadTextureNormal(isX2enabled ? "videopoker_x2Button.png" : "minipoker_rollButton.png"
            , ccui.Widget.PLIST_TEXTURE);
    },

    setRewardCards: function (rewardArrayIndex) {
        for (var i = 0; i < rewardArrayIndex.length; i++) {
            this.rewardLayer[i].setVisible(rewardArrayIndex[i]);
        }
    },

    setCardArray: function (cardArray) {
        for (var i = 0; i < cardArray.length; i++) {
            var card = CardList.prototype.getCardWithId(cardArray[i]);
            this.cardSprites[i].setSpriteFrame("" + card.rank + s_card_suit[card.suit] + ".png");
        }
        this.setRolling(false);
    },

    setRolling: function (isRolling) {
        this.rolling = isRolling;
        if (isRolling)
            for (var i = 0; i < 5; i++)
                this.rewardLayer[i].visible = false;
        for (var i = 0; i < 15; i++) {
            this.cardSprites[i % 5].visible = (!isRolling || this.holdingList[i % 5]);
            this.cardRollingSprites[i].visible = (isRolling && !this.holdingList[i % 5]);
        }
        if (isRolling) {
            this._rollingSound = SoundPlayer.playSoundLoop("mini_flyCard");
        }
        else {
            SoundPlayer.stopSoundLoop(this._rollingSound);
            this._rollingSound = null;
        }
    },

    onEnter: function () {
        this._super();
        this.scheduleUpdate();
       //s_VideoPokerLayer = this;
       // var thiz = this;
    },

    onTouchBegan: function (touch, event) {
        for (var i = 0; i < this.cardSprites.length; i++) {
            var p = this.cardSprites[i].convertToNodeSpace(touch.getLocation());
            if (cc.rectContainsPoint(
                    cc.rect(0, 0, this.cardSprites[i]._getWidth(), this.cardSprites[i]._getHeight()),
                    p
                )) {
                if(this.holdClick(i)){
                    return true;
                }
                break;
            }
        }
        return this._super(touch, event);
    },

    onExit: function () {
        this._super();
        this.unscheduleUpdate();
        //s_VideoPokerLayer = null;
    },

    initController: function () {
        this._controller = new VideoPokerController(this);
    },

    initRewards: function () {
        this.rewards.push("Hũ thưởng");
        this.rewards.push("Thùng phá sảnh");
        this.rewards.push("Tứ quý");
        this.rewards.push("Cù lũ");
        this.rewards.push("Thùng");
        this.rewards.push("Sảnh");
        this.rewards.push("Xám cô");
        this.rewards.push("Hai đôi");
        this.rewards.push("Đôi");
    },

    onError: function (param) {
        this._super(param);

        //het tien
        this.setRolling(false);
        this.setQuayBtEnable(true);
    },

    setQuayBtEnable: function (enabled) {
        this.rollButton.enabled = enabled;
        this.rollButton.setBright(enabled);
    },

    setNhanThuongBtEnable : function(enabled){
        this.nhanThuongBt.setBright(enabled);
        this.nhanThuongBt.setEnabled(enabled);
    },

    showJackpot: function () {
        var layer = new JackpotLayer();
        layer.show();
    }
});

// VideoPokerLayer.showPopup = function () {
//     if (s_VideoPokerLayer) {
//         return null;
//     }
//     var popup = new VideoPokerLayer();
//     popup.show();
//     return popup;
// };

