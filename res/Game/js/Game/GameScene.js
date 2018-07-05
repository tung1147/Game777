/**
 * Created by Quyet Nguyen on 7/21/2016.
 */

var GameTopBar = cc.Node.extend({
    ctor: function () {
        this._super();
        SmartfoxClient.getInstance().addListener(socket.SmartfoxClient.CallExtension, this.onExtensionCommand, this);

        var backBt = new ccui.Button("ingame-backBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        backBt.setPosition(54, 666);
        this.addChild(backBt);

        var settingBt = new ccui.Button("ingame-settingBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        settingBt.setPosition(1220, backBt.y);
        this.addChild(settingBt);

        var chatBt = new ccui.Button("ingame-chatBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        chatBt.setPosition(1120, backBt.y);
        this.addChild(chatBt);

        this.setAnchorPoint(0.0, 1.0);
        this.setContentSize(1280.0, 720.0);
        this.setPosition(0.0, 720.0);
        this.setScale(cc.winSize.screenScale);

        this.backBt = backBt;
        this.settingBt = settingBt;
        this.chatBt = chatBt;

    },
    onExit: function () {
        this._super();
        SmartfoxClient.getInstance().removeListener(this);
    },

    onExtensionCommand: function (messageType, contents) {

    }
});

// var s_sfs_error_msg = s_sfs_error_msg || [];
// /*TLMN*/
// s_sfs_error_msg[1] = "Đánh bài không hợp lệ";
// s_sfs_error_msg[2] = "Bạn không phải chủ phòng";
// s_sfs_error_msg[3] = "Không đủ người chơi để bắt đầu";
// s_sfs_error_msg[4] = "Bạn phải đánh quân bài nhỏ nhất";
// s_sfs_error_msg[5] = "Bạn không thể bỏ lượt";
// s_sfs_error_msg[6] = "Người chơi chưa sẵn sàng";
// s_sfs_error_msg[7] = "Bạn chưa đến lượt";
// s_sfs_error_msg[8] = "Bạn không có 4 đôi thông";
// s_sfs_error_msg[9] = "Bạn không có đủ tiền";
//
// /*PHOM*/
// s_sfs_error_msg[61] = "Không thể ăn bài";
// s_sfs_error_msg[62] = "Không thể hạ bài";
// s_sfs_error_msg[63] = "Không thể gửi bài";
// s_sfs_error_msg[64] = "Không thể bốc bài";

var IGameScene = IScene.extend({
    ctor: function () {
        this._super();

        this.miniGameLayer = new cc.Node();
        this.addChild(this.miniGameLayer, 1);

        this.initController();
        this.type = "GameScene";
        this.isOwnerMe = false;

        var bg = new cc.Sprite("res/game-bg.jpg");
        bg.x = cc.winSize.width / 2;
        bg.y = cc.winSize.height / 2;
        this.sceneLayer.addChild(bg);
        this.bg = bg;

        var gameTopBar = new GameTopBar();
        this.gameTopBar = gameTopBar;
        this.sceneLayer.addChild(gameTopBar);

        var thiz = this;
        gameTopBar.backBt.addClickEventListener(function () {
            thiz.backButtonClickHandler();
        });

        gameTopBar.settingBt.addClickEventListener(function () {
            thiz.onSettingButtonHandler();
        });

        gameTopBar.chatBt.addClickEventListener(function () {
            var dialog = new ChatDialog();
            dialog.onTouchMessage = function (message) {
                thiz.sendChatMessage(message);
            };
            dialog.onTouchEmotion = function (icon) {
                thiz.sendEmotion(icon);
            },
            dialog.show();
        });
    },
    initController: function () {

    },

    setOwner : function (username) {
        for (var i = 0; i < this.allSlot.length; i++) {
            if (this.allSlot[i].username == username) {
                this.allSlot[i].setIsOwner(true);
            }else{
                this.allSlot[i].setIsOwner(false);
            }
        }
    },

    showGameInfo: function (gameName, betAmount) {
        var nameTitle = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, gameName);
        nameTitle.setAnchorPoint(cc.p(0.0, 0.5));
        nameTitle.setPosition(96, 684);
        this.gameTopBar.addChild(nameTitle);

        var goldIcon = new cc.Sprite("#ingame-goldIcon.png");
        goldIcon.setPosition(109, 656);
        this.gameTopBar.addChild(goldIcon);

        var betTitle = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, cc.Global.NumberFormat1(betAmount));
        betTitle.setAnchorPoint(cc.p(0.0, 0.5));
        betTitle.setColor(cc.color("#ffde00"));
        betTitle.setPosition(126, 656);
        this.gameTopBar.addChild(betTitle);
    },

    getMaxSlot: function () {
        if (this.playerView) {
            return this.playerView.length;
        }
        return 0;
    },

    backButtonClickHandler: function () {
        if (LoadingDialog.getInstance().isShow()) {
            return;
        }
        if (this.popupLayer.getChildren().length > 0) {
            this.popupLayer.removeAllChildren();
            return;
        }

        if (this._controller) {
            this._controller.requestQuitRoom();
        }
    },
    exitToLobby: function (message) {
        var homeScene = new HomeScene();
        var gameId = s_games_chanel_id[PlayerMe.gameType];
        homeScene.startLobby(gameId);
        cc.director.replaceScene(homeScene);
        if (message) {
            MessageNode.getInstance().show(message, null, homeScene);
        }
        return homeScene;
    },
    exitToGame: function (message) {
        var homeScene = new HomeScene();
        homeScene.startGame();
        cc.director.replaceScene(homeScene);
        if (message) {
            MessageNode.getInstance().show(message, null, homeScene);
        }
        return homeScene;
    },

    onExit: function () {
        this._super();
        SoundPlayer.stopAllSound();
        if (this._controller) {
            this._controller.releaseController();
            this._controller = null;
        }
    },

    onEnter : function () {
        this._super();
        var thiz = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyReleased: function (keyCode, event) {
                if(cc.sys.isNative){
                    if (parseKeyCode(keyCode) === cc.KEY.back) {
                        thiz.backButtonClickHandler();
                    }
                }
                else{
                    if(keyCode === cc.KEY.escape){
                        thiz.backButtonClickHandler();
                    }
                }
            }
        }, this);

        MiniGameNavigator.showAll();
        FloatButton.getInstance().show(this.floatButtonLayer);
        FloatButton.getInstance().setVisible(true);
    },

    showErrorMessage: function (message, scene) {
        // if (scene) {
        //     MessageNode.getInstance().show(message, null, scene);
        // }
        // else {
        //     MessageNode.getInstance().show(message);
        // }
        MessageNode.getInstance().show(message, null, this.messageLayer);
    },

    onSettingButtonHandler : function () {
        var dialog = new SettingDialog();
        dialog.showWithAnimationMove();
    },

    sendChatMessage: function (message) {
        if (this._controller) {
            this._controller.sendChat(message);
        }
    },

    sendEmotion : function (icon) {
        if (this._controller) {
            this._controller.sendChatEmotion(icon);
        }
    },

    showLoading: function (message) {

    },

    updateGold: function (username, gold) {
        var goldNumber = gold;
        if (typeof gold === "string") {
            goldNumber = parseInt(gold);
        }
        for (var i = 0; i < this.allSlot.length; i++) {
            if (this.allSlot[i].username == username) {
                this.allSlot[i].setGold(goldNumber);
                return;
            }
        }
    },

    changeGoldEffect: function (username, deltaGold) {
        var slot = this.getSlotByUsername(username);
        if(slot){
            slot.runChangeGoldEffect(deltaGold);
        }
    },

    getSlotByUsername: function (username) {
        if(!this.allSlot){
            return null;
        }
        for (var i = 0; i < this.allSlot.length; i++) {
            if (this.allSlot[i].username == username) {
                return this.allSlot[i];
            }
        }
        return null;
    },

    fillPlayerToSlot: function (playerList) {
        this.allSlot = this.playerView;
        for (var i = 0; i < this.allSlot.length; i++) {
            this.allSlot[i] = this.playerView[i];
            var data = playerList[i];

            this.allSlot[i].stopTimeRemain();
            this.allSlot[i].userIndex = data.userIndex;

            if (data.username == "") {
                this.allSlot[i].setEnable(false);
            }
            else {
                this.allSlot[i].setEnable(true);
                this.allSlot[i].setUsername(data.username);
                this.allSlot[i].setGold(data.gold);
                this.allSlot[i].setAvatar(data.avt);
                this.allSlot[i].spectator = data.spectator;
                this.allSlot[i].setInfo(data["info"]);
            }
        }
    },

    userJoinRoom: function (info) {
        SoundPlayer.playSound("join_room");

        for (var i = 0; i < this.allSlot.length; i++) {
            if (info.index == this.allSlot[i].userIndex) {
                this.allSlot[i].setEnable(true);
                this.allSlot[i].userIndex = info.index;
                this.allSlot[i].stopTimeRemain();
                this.allSlot[i].setUsername(info.username);
                this.allSlot[i].setGold(info.gold);
                this.allSlot[i].setAvatar(info.avt);
                this.allSlot[i].setInfo(info["info"]);

                return;
            }
        }

        // var meIndex = this.allSlot[0].userIndex;
        // var slot = info.index - meIndex;
        // if(slot < 0){
        //     slot += this.allSlot.length;
        // }
        //
        // this.allSlot[slot].setEnable(true);
        // this.allSlot[slot].userIndex = info.index;
        // this.allSlot[slot].stopTimeRemain();
        // this.allSlot[slot].setUsername(info.username);
        // this.allSlot[slot].setGold(info.gold);
    },

    userExitRoom: function (username) {
        for (var i = 0; i < this.allSlot.length; i++) {
            if (this.allSlot[i].username == username) {
                this.allSlot[i].setEnable(false);
                this.allSlot[i].stopTimeRemain();
                break;
            }
        }
    },

    updateRegExitRoom: function (exit) {
        if (exit) {
            this.gameTopBar.backBt.loadTextureNormal("ingame-backBt-active.png", ccui.Widget.PLIST_TEXTURE);
        }
        else {
            this.gameTopBar.backBt.loadTextureNormal("ingame-backBt.png", ccui.Widget.PLIST_TEXTURE);
        }

    },

    onChatMessage: function (username, message) {
      //  cc.log("chat: " + username + " - " + message);
        for (var i = 0; i < this.allSlot.length; i++) {
            if (this.allSlot[i].username === username) {
                this.allSlot[i].chatView.show(message);
                break;
            }
        }
    },

    onChatEmotion : function (username, message) {
       // cc.log("onChatEmotion: " + username + " - " + message);
      //  cc.log("chat: " + username + " - " + message);
        for (var i = 0; i < this.allSlot.length; i++) {
            if (this.allSlot[i].username === username) {
                this.allSlot[i].showChatEmotion(message);
                break;
            }
        }
    },

    onSFSExtension: function () {

    },
    performChangeRewardFund: function (value) {
        if (this.huThuongValueLabel) {
            this.huThuongValueLabel.setString(cc.Global.NumberFormat1(value));
        }
    },
    performAssetChange: function (amount, goldAfter, username) {
        var slot = this.getSlotByUsername(username);
        if (slot){
            if(goldAfter !== null && goldAfter !== undefined){
                slot.setGold(goldAfter);
            }
        }

        // var changeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "");
        // changeLabel.setString(amount > 0 ? ("+" + amount) : amount);
        // changeLabel.setColor(cc.color(amount > 0 ? "#ffde00" : "#c52829"));
        // changeLabel.setPosition(slot.avt.getPosition());
        // if (username == PlayerMe.username)
        //     this.sceneLayer.addChild(changeLabel);
        // else
        //     slot.addChild(changeLabel);
        //
        // if (goldAfter)
        //     slot.setGold(goldAfter);
        //
        // var moveAction = new cc.MoveTo(1.0, slot.avt.x, slot.avt.y + 50);
        // var removeAction = new cc.CallFunc(function () {
        //     changeLabel.removeFromParent(true);
        // });
        // changeLabel.runAction(new cc.Sequence(moveAction, removeAction));
    }
});