/**
 * Created by Quyet Nguyen on 7/27/2016.
 */
PL_POSITION_TOP = 0;
PL_POSITION_LEFT = 1;
PL_POSITION_BOTTOM = 2;
PL_POSITION_RIGHT = 3;

var GamePlayer = cc.Node.extend({
    ctor: function () {
        this._super();
        this.setContentSize(cc.size(158, 120));
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.isMe = false;
        this.username = "";
        this.gold = 0;

        this.infoLayer = new cc.Node();
        this.addChild(this.infoLayer);

        var avt = UserAvatar.createAvatar();
        avt.setPosition(this.getContentSize().width / 2, 79);
        this.infoLayer.addChild(avt);

        var chatView = new PlayerMessageView();
        chatView.setPosition(avt.getPosition());
        this.infoLayer.addChild(chatView, 10);
        this.chatView = chatView;

        var isOwnerSprite = new cc.Sprite("#icon_owner.png");
        isOwnerSprite.setPosition(avt.x + 38,avt.y + 38);
        this.infoLayer.addChild(isOwnerSprite);
        this.isOwnerSprite = isOwnerSprite;

        var timer = new cc.ProgressTimer(new cc.Sprite("#player-progress-2.png"));
        timer.setType(cc.ProgressTimer.TYPE_RADIAL);
        timer.setPosition(avt.getPosition());
        timer.setPercentage(100.0);
        this.infoLayer.addChild(timer);
        this.timer = timer;

        var timer2 = new cc.ProgressTimer(new cc.Sprite("#player-progress-1.png"));
        timer2.setType(cc.ProgressTimer.TYPE_RADIAL);
       // timer2.setReverseDirection(true);
        timer2.setPosition(avt.getPosition());
        timer2.setPercentage(0.0);
        this.infoLayer.addChild(timer2);
        this.timer2 = timer2;

        var inviteBt = new ccui.Button("ingame_inviteBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        inviteBt.setPosition(avt.getPosition());
        this.addChild(inviteBt);

        var userLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_20, "PlayePlayePlaye");
        userLabel.setColor(cc.color("#63b0f1"));
        // userLabel.setLineBreakWithoutSpace(true);
        // userLabel.setDimensions(this.getContentSize().width, userLabel.getLineHeight());
        userLabel.setPosition(this.getContentSize().width / 2, 34);
        this.infoLayer.addChild(userLabel, 1);

        var goldLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "1.000V");
        goldLabel.setColor(cc.color("#ffde00"));
        goldLabel.setPosition(this.getContentSize().width / 2, 14);
        this.infoLayer.addChild(goldLabel, 1);


        var bgInfor = new ccui.Scale9Sprite("dialog-textinput-bg.png",cc.rect(10, 10, 4, 4));
        bgInfor.setPreferredSize(cc.size(180, 60));
        bgInfor.setVisible(false);
        bgInfor.setPosition(avt.getPosition());
        this.infoLayer.addChild(bgInfor);
        this.bgInfor = bgInfor;


        this.userLabel = userLabel;
        this.goldLabel = goldLabel;
        this.inviteBt = inviteBt;
        this.avt = avt;

        var thiz = this;
        inviteBt.addClickEventListener(function () {
            thiz.onInviteBtClick();
        });
        var infoBt = new ccui.Widget();
        infoBt.setContentSize(avt.getContentSize());
        infoBt.setPosition(avt.getPosition());
        this.infoLayer.addChild(infoBt);
        infoBt.setTouchEnabled(true);
        infoBt.addClickEventListener(function () {
            thiz.showInfoDialog();
        });
        this.setEnable(true);
    },
    setPositionInfo:function (postion) {
        switch (postion){
            case PK_POSITION_LEFT:
            {
                this.bgInfor.setPosition(this.avt.getPositionX() -140,this.avt.getPositionY());
                this.userLabel.setAnchorPoint(1,0.5);
                this.goldLabel.setAnchorPoint(1,0.5);
                this.userLabel.setPosition(this.bgInfor.getPositionX()+80, this.bgInfor.getPositionY() + 10);
                this.goldLabel.setPosition(this.bgInfor.getPositionX()+80, this.bgInfor.getPositionY() - 10);
                break;
            }
            case PK_POSITION_RIGHT:
            {
                this.bgInfor.setPosition(this.avt.getPositionX() +140 ,this.avt.getPositionY());
                this.userLabel.setAnchorPoint(0,0.5);
                this.goldLabel.setAnchorPoint(0,0.5);
                this.userLabel.setPosition(this.bgInfor.getPositionX()-80, this.bgInfor.getPositionY() + 10);
                this.goldLabel.setPosition(this.bgInfor.getPositionX()-80, this.bgInfor.getPositionY() - 10);
                break;
            }
            case PK_POSITION_TOP:
            {
                this.bgInfor.setPosition(this.avt.getPositionX(),this.avt.getPositionY()+70);
                this.userLabel.setAnchorPoint(0.5,0.5);
                this.goldLabel.setAnchorPoint(0.5,0.5);
                this.userLabel.setPosition(this.bgInfor.getPositionX(), this.bgInfor.getPositionY() + 10);
                this.goldLabel.setPosition(this.bgInfor.getPositionX(), this.bgInfor.getPositionY() - 10);
                break;
            }
            case PK_POSITION_BOTTOM:
            {
                this.bgInfor.setPosition(this.avt.getPositionX() ,this.avt.getPositionY() - 65);
                this.userLabel.setAnchorPoint(0.5,0.5);
                this.goldLabel.setAnchorPoint(0.5,0.5);
                this.userLabel.setPosition(this.bgInfor.getPositionX(), this.bgInfor.getPositionY() + 10);
                this.goldLabel.setPosition(this.bgInfor.getPositionX(), this.bgInfor.getPositionY() - 10);
                break;
            }
        };
    },
    onInviteBtClick: function () {
        this.showInviteDialog();
    },

    showChatMessage: function (message) {

    },
    setGold: function (gold) {
        this.goldLabel.setString(cc.Global.NumberFormat1(gold));
        this.gold = gold;
    },
    setUsername: function (name) {
        this.username = name;
        if (name.length > 15)
            name = name.substring(0, 15) ;
        if (name.length > 3 && name != PlayerMe.username)
            name = name.substring(0, name.length - 3) + "***";
        this.userLabel.setString(name);
    },
    setEnable: function (enable) {
        // this._isEnable = enable;
        if (enable) {
            this.infoLayer.visible = true;
            this.inviteBt.visible = false;
        }
        else {
            this.username = "";
            this.spectator = false;
            this.infoLayer.visible = false;
            this.inviteBt.visible = true;
           // this.isOwnerSprite.visible = false;
        }
    },
    setIsOwner : function(isOwner){
        this.isOwnerSprite.visible = isOwner;
    },
    showInviteDialog: function () {
        // cc.log("showInviteDialog");
        var dialog = new InviteDialog();
        dialog.show();
    },

    showInfoDialog: function () {
        // cc.log("showInfoDialog");
        // var dialog = new UserDialog();
        // dialog.setUsername(this.username);
        // dialog.setGold(this.gold);
        // if (this.avt) {
        //     dialog.setAvatar(this._avatarUrl);
        // }
        // dialog.showWithAnimationScale();
    },
    showChatEmotion : function (emotion) {
        var emotion = new cc.Sprite("#"+emotion);
        emotion.setScale(1.5);
        emotion.setPosition(this.avt.getPosition());
        this.addChild(emotion, 10);
        emotion.runAction(new cc.Sequence(
            new cc.DelayTime(3.0),
            new cc.CallFunc(function () {
                emotion.removeFromParent(true);
            })
        ));
    },
    setAvatar: function (avt) {
        this._avatarUrl = avt;
        if (this.avt) {
            this.avt.setAvatar(avt);
        }
    },
    runChangeGoldEffect: function (gold) {
        var goldNumber = gold;
        if (typeof gold === "string") {
            goldNumber = parseInt(gold);
        }
        var strGold = cc.Global.NumberFormat1(Math.abs(goldNumber)) + "V";
        if (gold >= 0) {
            strGold = "+" + strGold;
        }
        else {
            strGold = "-" + strGold;
        }
        var labelEffect = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, strGold);
        if (gold >= 0) {
            labelEffect.setColor(cc.color("#ffde00"));
        }
        else {
            labelEffect.setColor(cc.color("#ff0000"));
        }
        labelEffect.setPosition(this.userLabel.getPosition());
        this.infoLayer.addChild(labelEffect, 10);

        var effectDuration = 2.0;
        var moveAction = new cc.MoveBy(effectDuration, cc.p(0.0, 100.0));
        var finishedAction = new cc.CallFunc(function () {
            labelEffect.removeFromParent(true);
        });
        labelEffect.runAction(new cc.Sequence(moveAction, finishedAction));
    },
    showTimeRemain: function (currentTime, maxTime) {
        var startValue = 100.0 * (currentTime / maxTime);
        // var deltaValue = 100.0 - startValue;
        this.setProgressPercentage(startValue);
        var thiz = this;
        var action = new quyetnd.ActionTimer(currentTime, function (dt) {
            thiz.setProgressPercentage((1.0 - dt) * startValue);
        });
        if (this.timer) {
            this.timer.stopAllActions();
            this.timer.runAction(action);
        }
    },
    setProgressPercentage: function (percentage) {
        this.timer.setPercentage(percentage);
        this.timer2.setPercentage(percentage);
        // this.timer.setPercentage(100.0 - percentage);
        // this.timer2.setPercentage(percentage);
    },
    stopTimeRemain: function () {
        if (this.timer) {
            this.timer.stopAllActions();
            this.setProgressPercentage(0.0);
        }
    },

    setInfo : function (info) {

    }
});

var GamePlayerMe = GamePlayer.extend({
    ctor: function () {
        cc.Node.prototype.ctor.call(this);

        this.isMe = true;
        this.infoLayer = new cc.Node();
        this.addChild(this.infoLayer);

        this.setContentSize(cc.size(300, 100));
        this.setAnchorPoint(cc.p(0.5, 0.5));

        var avt = UserAvatar.createMe();
        avt.setPosition(60, 50);
        this.infoLayer.addChild(avt);

        var isOwnerSprite = new cc.Sprite("#icon_owner.png");
        isOwnerSprite.setVisible(false);
        isOwnerSprite.setPosition(avt.x + 38,avt.y+38);
        this.infoLayer.addChild(isOwnerSprite);
        this.isOwnerSprite = isOwnerSprite;

        var chatView = new PlayerMessageView();
        chatView.setPosition(avt.getPosition());
        chatView.setAnchorPoint(cc.p(0.0, 0.0));
        this.infoLayer.addChild(chatView, 10);
        this.chatView = chatView;

        var timer = new cc.ProgressTimer(new cc.Sprite("#player-progress-2.png"));
        timer.setType(cc.ProgressTimer.TYPE_RADIAL);
        timer.setPosition(avt.getPosition());
       // timer.setReverseDirection(true);
        timer.setPercentage(100.0);
        this.infoLayer.addChild(timer);
        this.timer = timer;

        var timer2 = new cc.ProgressTimer(new cc.Sprite("#player-progress-1.png"));
        timer2.setType(cc.ProgressTimer.TYPE_RADIAL);
        //timer2.setReverseDirection(true);
        timer2.setPosition(avt.getPosition());
        timer2.setPercentage(0.0);
        this.infoLayer.addChild(timer2);
        this.timer2 = timer2;

        var userLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_18, PlayerMe.username);
        userLabel.setColor(cc.color("#63b0f1"));
        userLabel.setAnchorPoint(cc.p(0.0, 0.5));
        userLabel.setLineBreakWithoutSpace(true);
        userLabel.setDimensions(194, userLabel.getLineHeight());
        userLabel.setPosition(107, 60);
        this.infoLayer.addChild(userLabel);

        // var goldIcon = new cc.Sprite("#ingame-goldIcon.png");
        // goldIcon.setPosition(120, 30);
        // this.infoLayer.addChild(goldIcon);

        var goldLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "99.999.999V");
        goldLabel.setAnchorPoint(cc.p(0.0, 0.5));
        goldLabel.setColor(cc.color("#ffde00"));
        goldLabel.setPosition(107, 40);
        this.infoLayer.addChild(goldLabel);

        this.userLabel = userLabel;
        this.goldLabel = goldLabel;
        this.avt = avt;
    },
    onEnter: function () {
        this._super();
        this.setGold(PlayerMe.gold);
    },
    setEnable: function (enable) {

    }
});

var PlayerMessageView = cc.Node.extend({
    ctor: function () {
        this._super();
        this.setAnchorPoint(cc.p(0.5, 0.5));

        var bg = new ccui.Scale9Sprite("ingame-chat-bg.png", cc.rect(20, 20, 4, 4));
        bg.setPreferredSize(cc.size(100, 100));
        this.setContentSize(bg.getContentSize());
        this.addChild(bg);
        bg.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2);
        this.bg = bg;

        var label = new cc.LabelBMFont("Message", cc.res.font.Roboto_Condensed_25, 300, cc.TEXT_ALIGNMENT_CENTER);
        label.setPosition(bg.getPosition());
        this.addChild(label);
        this.label = label;

        this.setVisible(false);
    },

    show: function (message) {
        this.setVisible(true);
        this.stopAllActions();

        var thiz = this;
        this.runAction(new cc.Sequence(
            new cc.DelayTime(5.0),
            new cc.CallFunc(function () {
                thiz.setVisible(false);
            })
        ));

        this.label.setString(message);
        this.bg.setPreferredSize(cc.size(this.label.getContentSize().width + 40, this.label.getContentSize().height + 20));
        this.setContentSize(this.bg.getContentSize());
        this.bg.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2);
        this.label.setPosition(this.bg.getPosition());
    }
});