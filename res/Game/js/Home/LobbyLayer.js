/**
 * Created by Quyet Nguyen on 7/5/2016.
 */
var LobbyLayer = cc.Node.extend({
    ctor: function () {
        this._super();
        LobbyClient.getInstance().addListener("updateAll", this.onUpdateAll, this);
        LobbyClient.getInstance().addListener("inviteUser", this.onInviteReceived, this);

        var chatBar = new cc.Sprite("#home-minigame-bar.png");
        chatBar.setPosition(cc.winSize.width - 162.0 * cc.winSize.screenScale, 170.0);
        chatBar.setScale(cc.winSize.screenScale);
        this.addChild(chatBar);

        var chatIcon = new cc.Sprite("#lobby-chat-icon.png");
        chatIcon.setPosition(chatBar.x - (118 * cc.winSize.screenScale), chatBar.y);
        this.addChild(chatIcon);
        chatIcon.setScale(cc.winSize.screenScale);

        var sendButton = new ccui.Button("lobby-send-icon.png", "", "", ccui.Widget.PLIST_TEXTURE);
        sendButton.setPosition(chatBar.x + (118 * cc.winSize.screenScale), chatBar.y);
        sendButton.setScale(cc.winSize.screenScale);
        this.addChild(sendButton);

        var chatText = new newui.TextField(cc.size(190 * cc.winSize.screenScale, 55), cc.res.font.Roboto_Condensed, 20 * cc.winSize.screenScale);
        chatText.setAlignment(newui.TextField.ALIGNMENT_LEFT);
        chatText.setPlaceHolder("Nhập nội dung");
        chatText.setPlaceHolderColor(cc.color(34, 110, 155));
        chatText.setTextColor(cc.color(255, 255, 255));
        chatText.setPosition(chatBar.getPosition());
        //chatText.setScale(cc.winSize.screenScale);
        this.addChild(chatText, 1);

        var _top = 580.0;
        var _bottom = chatBar.y + chatBar.getContentSize().height / 2 * chatBar.getScaleY();
        var _right = cc.winSize.width - (20.0 * cc.winSize.screenScale);
        var _left = cc.winSize.width - (300.0 * cc.winSize.screenScale);

        var chatBg = new ccui.Scale9Sprite("home-minigame-bg.png", cc.rect(8, 0, 4, 384));
        chatBg.setPreferredSize(cc.size(_right - _left + 4.0, 384));
        chatBg.setAnchorPoint(cc.p(1.0, 0));
        chatBg.setPosition(_right, _bottom);
        this.addChild(chatBg);

        var chatList = new ccui.ListView();
        chatList.setContentSize(cc.size(_right - _left, 384));
        chatList.setDirection(ccui.ScrollView.DIR_VERTICAL);
        chatList.setScrollBarEnabled(false);
        chatList.setTouchEnabled(true);
        chatList.setBounceEnabled(true);
        chatList.setAnchorPoint(cc.p(1.0, 0));
        chatList.setPosition(cc.p(_right - 2, _bottom));
        this.addChild(chatList, 1);

        var thiz = this;
        this.chatText = chatText;
        this.chatList = chatList;

        sendButton.addClickEventListener(function () {
            thiz.sendChatHandler();
        });
        chatText.setReturnCallback(function () {
            var message = thiz.chatText.getText();
            if (message && message.length != 0) {
                thiz.sendChatHandler();
                return true;
            }
            return false;
        });

        //
        this.initListGame();
    },

    initListGame: function () {
        var gameTitle = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "Game name");
        gameTitle.setPosition(cc.winSize.width / 2, 540);
        gameTitle.setColor(cc.color(255, 222, 0));
        this.addChild(gameTitle, 1);
        this.gameTitle = gameTitle;

        var label1 = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Chọn mức cược");
        label1.setPosition(cc.winSize.width / 2, 486);
        this.addChild(label1, 1);

        var left = 310.0 * cc.winSize.screenScale;
        var right = cc.winSize.width - (310.0 * cc.winSize.screenScale);
        var top = 460.0;
        var bottom = 160.0;
        var itemHeight = 96.0 * cc.winSize.screenScale;
        var padding = (top - bottom - itemHeight * 2) / 3;

        var gameList = new newui.TableView(cc.size(right - left, top - bottom), 4);
        gameList.setPadding(padding);
        gameList.setMargin(padding, padding, 0, 0);
        gameList.setScrollBarEnabled(false);
        gameList.setDirection(ccui.ScrollView.DIR_VERTICAL);
        gameList.setPosition(left, bottom);

        this.addChild(gameList);

        this.gameList = gameList;
        cc.log("init lobby");
        for (var i = 0; i < 8; i++) {
            this.addCell(i, 1000, 10000);
        }
    },

    sendChatHandler: function () {
        var message = this.chatText.getText();
        if (message && message.length != 0) {
            this.chatText.setText("");
            this.addChatMessage("Me", message);
        }
    },

    addChatMessage: function (username, message) {
        //  cc.log(username + ": "+message);
        var textMesasge = new ccui.RichText();
        textMesasge.ignoreContentAdaptWithSize(false);
        textMesasge.width = this.chatList.getContentSize().width;

        var userText = new ccui.RichElementText(0, cc.color(39, 197, 255), 255, username + ": ", cc.res.font.Roboto_CondensedBold, 20 * cc.winSize.screenScale);
        var messageText = new ccui.RichElementText(1, cc.color(255, 255, 255), 255, message, cc.res.font.Roboto_Condensed, 20 * cc.winSize.screenScale);

        textMesasge.pushBackElement(userText);
        textMesasge.pushBackElement(messageText);
        textMesasge.formatText();

        var size = textMesasge.getContentSize();
        this.chatList.pushBackCustomItem(textMesasge);
        this.chatList.scrollToBottom(0.5, true);

        var padding = new ccui.Widget();
        padding.setContentSize(cc.size(textMesasge.width, 8.0));
        this.chatList.pushBackCustomItem(padding);
    },

    addCell: function (cellId, betting, minGold) {
        var cellBg = new cc.Sprite("#lobby-room-select-cell.png");
        cellBg.setPosition(cc.p(0, 0));
        cellBg.setAnchorPoint(cc.p(0, 0));

        var container = new ccui.Widget();
        container.setContentSize(cellBg.getContentSize());
        container.addChild(cellBg);
        container.setScale(cc.winSize.screenScale);
        this.gameList.pushItem(container);

        var iconId = Math.floor(cellId / 3) + 1;
        if (iconId > 3) {
            iconId = 3;
        }
        var goldIcon = new cc.Sprite("#lobby-gold-icon" + iconId + ".png");
        goldIcon.setPosition(cc.p(0, 0));
        goldIcon.setAnchorPoint(cc.p(0, 0));
        container.addChild(goldIcon);

        var goldLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, cc.Global.NumberFormat1(betting) + " V");
        goldLabel.setPosition(container.getContentSize().width / 2, 30);
        goldLabel.setColor(cc.color(255, 222, 0));
        container.addChild(goldLabel);

        container.setTouchEnabled(true);
        container.addClickEventListener(function () {
            LoadingDialog.getInstance().show("Đang tìm phòng chơi");
            LobbyClient.getInstance().requestGetServer(betting);
        });
    },
    startGame: function (gameId) {
        this.gameList.removeAllItems();
        this.chatList.removeAllItems();
        this.chatText.setText("");
        if (gameId >= 0) {
            this.gameTitle.setString(s_games_display_name[gameId]);
        }
    },
    startAnimation: function () {

    },
    onInviteReceived: function (command, data) {
        if (!cc.Global.GetSetting("invite")) {
            return;
        }
        data = data["data"];
        if (RecvInviteDialog.getInstance().isShow())
            return;
        RecvInviteDialog.getInstance().setInfo(data["userInvite"], s_games_display_name[s_games_chanel_id[data["gameType"]]], data["betting"]);
        var roomId = data["roomId"];
        var host = data["ip"];
        if (cc.sys.isNative) {
            var port = data["port"];
        }
        else {
            var port = data["webSocketPort"];
        }
        RecvInviteDialog.getInstance().setRoomInfo(roomId, host, port);
        RecvInviteDialog.getInstance().showWithAnimationScale();
    },
    onUpdateAll: function (cmd, event) {
        var data = event.data;
        var gameType = PlayerMe.gameType;
        if (gameType === data.gameType) {
            this.gameList.removeAllItems();
            var betting = data.bettings;
            for (var i = 0; i < betting.length; i++) {
                this.addCell(i, betting[i].betting, betting[i].minMoney);
            }
            this.gameList.runMoveEffect(3000, 0.1, 0.1);
        }
    },
    onExit: function () {
        this._super();
        if (this.visible == true) {
            LobbyClient.getInstance().unSubscribe();
        }
        LobbyClient.getInstance().removeListener(this);
    }
});