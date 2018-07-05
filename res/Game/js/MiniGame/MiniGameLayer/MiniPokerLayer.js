/**
 * Created by QuyetNguyen on 12/20/2016.
 */
//var s_MiniPokerLayer = null;
var MiniPokerLayer = MiniGamePopup.extend({
    ctor: function () {
        this._super();

        this.cardSprites = [];
        this.autoRoll = false;
        this.rolling = false;
        this.baseCardHeight = 0;
        this.cardHeight = 0;
        this.rollHeight = 0;
        this.rewards = [];
        this.rewardLayer = [];
        this.cardRollingSprites = [];
        this.gameType = GameType.MiniGame_Poker;

        this.initRewards();

        var bg = new cc.Sprite("#minipoker_bg.png");
        bg.setAnchorPoint(cc.p(0, 0));
        this.setContentSize(bg.getContentSize());
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.addChild(bg);

        this._boudingRect = cc.rect(30, 47, 930, 510);

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

        var autoRollButton = new ccui.Button("minipoker_quaytudong.png", "", "", ccui.Widget.PLIST_TEXTURE);
        autoRollButton.setZoomScale(0.0);
        autoRollButton.setPosition(650, 90);
        this.autoRollButton = autoRollButton;
        this.addChild(autoRollButton);

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
        //    this.setScale(0.5);

        var thiz = this;
        autoRollButton.addClickEventListener(function () {
            thiz.onAutoRollClick();
        });

        rollButton.addClickEventListener(function () {
            thiz.onRollClick();
        });
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

    update: function (dt) {
        if (!this.baseCardHeight || !this.cardHeight || !this.rolling)
            return;
        this.rollHeight -= 40;

        this.rollHeight = this.rollHeight > 0 ? this.rollHeight : this.rollHeight + this.cardHeight * 3;
        for (i = 0; i < 15; i++) {
            this.cardRollingSprites[i].visible = true;
            var newY = this.baseCardHeight + (i % 3 - 1) * this.cardHeight + this.rollHeight;
            newY = newY > this.baseCardHeight + this.cardHeight ? newY - 2 * this.cardHeight
                : newY;
            this.cardRollingSprites[i].setPositionY(newY);
        }
    },

    onEnter: function () {
        this._super();
        this.scheduleUpdate();
        //s_MiniPokerLayer = this;
    },

    onExit: function () {
        this._super();
        this.unscheduleUpdate();
        //s_MiniPokerLayer = null;
    },

    onAutoRollClick: function () {
        this.autoRoll = !this.autoRoll;
        this.autoRollButton.loadTextureNormal(this.autoRoll ? "minipoker_quaytudong_active.png"
            : "minipoker_quaytudong.png", ccui.Widget.PLIST_TEXTURE);
        var thiz = this;
        if (!this.rolling && this.autoRoll)
            thiz.onRollClick();

        SoundPlayer.playSound("mini_clickButton");

        if(this.autoRoll){

        }
        else{

        }
    },

    activateReward: function (id, rank) {
        var str = "";
        str = this.rewards[id] ? this.rewards[id] : "KHÔNG ĂN";
        if (rank) {
            switch (rank) {
                case 12:
                    str += " ÁT";
                    break;
                case 0:
                    str += " HAI";
                    break;
                case 1:
                    str += " BA";
                    break;
                case 2:
                    str += " BỐN";
                    break;
                case 3:
                    str += " NĂM";
                    break;
                case 4:
                    str += " SÁU";
                    break;
                case 5:
                    str += " BẢY";
                    break;
                case 6:
                    str += " TÁM";
                    break;
                case 7:
                    str += " CHÍN";
                    break;
                case 8:
                    str += " MƯỜI";
                    break;
                case 9:
                    str += " J";
                    break;
                case 10:
                    str += " Q";
                    break;
                case 11:
                    str += " K";
                    break;
            }
        }

        this.resultLabel.setString(str);
        if(this.rolling){
            SoundPlayer.playSound(this.rewards[id] ? "NormalWin" : "mini_slotLost");
        }
    },

    setRewardCards: function (rewardArrayIndex) {
        for (var i = 0; i < rewardArrayIndex.length; i++) {
            this.rewardLayer[i].setVisible(rewardArrayIndex[i]);
        }
    },

    onRollClick: function () {
        if(this.rolling){
            return;
        }
        this.rollCard();
        this._controller.sendRollRequest(this.chipGroup.chipSelected.chipIndex);
        SoundPlayer.playSound("mini_clickButton");
    },

    rollCard : function () {
        this.setRolling(true);
        this.setBettingSelectEnable(false);
        this.resultLabel.setString("");
    },

    initController: function () {
        this._controller = new MiniPokerController(this);
    },

    setCardArray: function (cardArray) {
        for (var i = 0; i < cardArray.length; i++) {
            var card = CardList.prototype.getCardWithId(cardArray[i]);
            this.cardSprites[i].setSpriteFrame("" + card.rank + s_card_suit[card.suit] + ".png");
        }
        this.setRolling(false);

        var thiz = this;
        if (this.autoRoll) {
            setTimeout(function () {
                thiz.onRollClick();
            }, 500);
        }
        else{
            this.setQuayBtEnable(true);
            this.setBettingSelectEnable(true);
        }
    },

    setRolling: function (isRolling) {
        this.rolling = isRolling;
        if (isRolling)
            for (var i = 0; i < 5; i++)
                this.rewardLayer[i].visible = false;
        for (var i = 0; i < 15; i++) {
            this.cardSprites[i % 5].visible = !isRolling;
            this.cardRollingSprites[i].visible = isRolling;
        }
        if (isRolling) {
            this._rollingSound = SoundPlayer.playSoundLoop("mini_flyCard");
        }
        else {
            SoundPlayer.stopSoundLoop(this._rollingSound);
            this._rollingSound = null;
        }
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

    showJackpot: function () {
        var layer = new JackpotLayer();
        layer.show();
    },
});

// MiniPokerLayer.showPopup = function () {
//     if (s_MiniPokerLayer) {
//         return null;
//     }
//     var popup = new MiniPokerLayer();
//     popup.show();
//     return popup;
// };