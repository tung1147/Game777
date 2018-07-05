/**
 * Created by Quyet Nguyen on 7/25/2016.
 */
var Sam = TienLen.extend({
    ctor: function () {
        this._super();

        this.timeRemaining = 0;
        this.timeInterval = null;
    },
    initButton : function () {
        this._super();

        var baosamBt = new ccui.Button("game-baosamBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        baosamBt.setPosition(cc.winSize.width - 110, 46);
        this.sceneLayer.addChild(baosamBt);
        baosamBt.visible = false;
        this.baosamBt = baosamBt;

        var huysamBt = new ccui.Button("game-huysamBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        huysamBt.setPosition(cc.winSize.width - 310, 46);
        this.sceneLayer.addChild(huysamBt);
        huysamBt.visible = false;
        this.huysamBt = huysamBt;

        var timeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_BoldCondensed_36_Glow, "");
        timeLabel.setPosition(cc.winSize.width / 2, 425);
        timeLabel.setScale(2.0);
        this.sceneLayer.addChild(timeLabel);
        this.timeLabel = timeLabel;

        var thiz = this;
        baosamBt.addClickEventListener(function () {
            thiz.sendBaoSamRequest();
        });

        huysamBt.addClickEventListener(function () {
            thiz.sendHuySamRequest();
        });
    },
    initController: function () {
        this._controller = new SamController(this);
    },
    initPlayer: function () {
        var playerMe = new GamePlayerMe();
        playerMe.stopTimeRemain();
        playerMe.setPosition(150, 50.0);
        this.sceneLayer.addChild(playerMe, 1);

        var progressTimerBaoSam = new cc.ProgressTimer(new cc.Sprite("#player-progress-3.png"));
        progressTimerBaoSam.setType(cc.ProgressTimer.TYPE_BAR);
        progressTimerBaoSam.setMidpoint(cc.p(0.0, 0.5));
        progressTimerBaoSam.setBarChangeRate(cc.p(1.0, 0.0));
        progressTimerBaoSam.setPercentage(0);
        progressTimerBaoSam.setPosition(cc.p(cc.winSize.width / 2, 220.0));
        this.progressTimerBaoSam = progressTimerBaoSam;
        this.sceneLayer.addChild(progressTimerBaoSam, 2);

        var player1 = new GamePlayer();
        player1.setPosition(cc.winSize.width - 120.0 * cc.winSize.screenScale, 320.0 * cc.winSize.screenScale);
        this.sceneLayer.addChild(player1, 1);
        player1.chatView.setAnchorPoint(cc.p(1.0, 0.0));
        player1.chatView.y += 20;

        var player2 = new GamePlayer();
        player2.setPosition(cc.winSize.width / 2 + 220 * cc.winSize.screenScale, cc.winSize.height - 140.0 / cc.winSize.screenScale);
        this.sceneLayer.addChild(player2, 1);
        player2.chatView.setAnchorPoint(cc.p(1.0, 1.0));

        var player3 = new GamePlayer();
        player3.setPosition(cc.winSize.width / 2 - 220 * cc.winSize.screenScale, player2.y);
        this.sceneLayer.addChild(player3, 1);
        player3.chatView.setAnchorPoint(cc.p(1.0, 1.0));

        var player4 = new GamePlayer();
        player4.setPosition(120.0 * cc.winSize.screenScale, player1.y);
        this.sceneLayer.addChild(player4, 1);
        player4.chatView.setAnchorPoint(cc.p(0.0, 0.0));
        player4.chatView.y += 20;

        this.playerView = [playerMe, player1, player2, player3, player4];

        var cardRemaining1 = new CardRemaining();
        cardRemaining1.setPosition(30, 70);
        player1.infoLayer.addChild(cardRemaining1);
        player1.cardRemaining = cardRemaining1;

        var cardRemaining2 = new CardRemaining();
        cardRemaining2.setPosition(130, 70);
        player2.infoLayer.addChild(cardRemaining2);
        player2.cardRemaining = cardRemaining2;

        var cardRemaining3 = new CardRemaining();
        cardRemaining3.setPosition(130, 70);
        player3.infoLayer.addChild(cardRemaining3);
        player3.cardRemaining = cardRemaining3;

        var cardRemaining4 = new CardRemaining();
        cardRemaining4.setPosition(130, 70);
        player4.infoLayer.addChild(cardRemaining4);
        player4.cardRemaining = cardRemaining4;

        for (var i = 1; i < this.playerView.length; i++) {
            var oneCardNotify = new cc.LabelBMFont("Báo 1", cc.res.font.Roboto_CondensedBold_30);
            oneCardNotify.setColor(cc.color("#ff0000"));
            oneCardNotify.setPosition(90, 110);
            this.playerView[i].infoLayer.addChild(oneCardNotify);
            oneCardNotify.setVisible(false);
            this.playerView[i].oneCardNotify = oneCardNotify;
            this.playerView[i].cardRemaining.setVisible(false);

            var oneNotifyBaoSam = new cc.LabelBMFont("Báo Sâm", cc.res.font.Roboto_CondensedBold_30);
            oneNotifyBaoSam.setColor(cc.color("#ff0000"));
            oneNotifyBaoSam.setPosition(80, 110);
            this.playerView[i].infoLayer.addChild(oneNotifyBaoSam);
            oneNotifyBaoSam.setVisible(false);
            this.playerView[i].oneNotifyBaoSam = oneNotifyBaoSam;

        }
    },

    setSamBtVisible: function (visible) {
        this.baosamBt.visible = this.huysamBt.visible = visible;
    },

    alertMessage: function (msg) {
        MessageNode.getInstance().show(msg);
    },

    showBaoSamTimeRemaining: function (timeRemaining) {
        if (timeRemaining > 0) {
            this.timeRemaining = timeRemaining;
            if (this.timeInterval) {
                clearInterval(this.timeInterval)
            }
            var thiz = this;
            thiz.timeLabel.setString(timeRemaining);
            thiz.timeRemaining--;
            this.timeInterval = setInterval(function () {
                if (thiz.timeRemaining <= 0) {
                    thiz.timeLabel.setString("");
                    clearInterval(thiz.timeInterval);
                } else {
                    thiz.timeLabel.setString(thiz.timeRemaining);
                    thiz.timeRemaining--;
                }
            }, 1000);
        } else {
            this.timeRemaining = 0;
            this.timeLabel.setString("");
        }
    },

    sendBaoSamRequest: function () {
        this._controller.sendBaoSamRequest();
    },
    sendHuySamRequest: function () {
        this._controller.sendHuySamRequest();
    },

    notifyOne: function (username) {
        // this.alertMessage("Người chơi " + username + " chỉ còn lại 1 lá");
        var slot = this.getSlotByUsername(username);
        if (slot) {
            slot.oneCardNotify.setVisible(true);
        }
    },
    notifyBaoSam: function (username, isbaosam) {
        var slot = this.getSlotByUsername(username);
        slot.oneNotifyBaoSam.setVisible(true);
        if (slot) {
            if(isbaosam)
                slot.oneNotifyBaoSam.setString("Báo Sâm");
            else
                slot.oneNotifyBaoSam.setString("Huỷ Sâm");

            var thiaaa = this;
            this.runAction(new cc.Sequence(new cc.DelayTime(2), new cc.CallFunc((function () {
                slot.oneNotifyBaoSam.setVisible(false);
            }))));
        }
    },
    hideAllNotifyOne: function () {
        for (var i = 1; i < this.playerView.length; i++) {
            this.playerView[i].oneCardNotify.setVisible(false);
        }
    }
});