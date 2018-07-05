/**
 * Created by Quyet Nguyen on 7/11/2016.
 */

var InviteDialog = Dialog.extend({
    ctor: function () {
        this._super();

        this.okButton.visible = false;
        this.cancelButton.visible = false;
        this.title.setString("MỜI CHƠI");
        this.initWithSize(cc.size(718, 478));

        var listItem = new newui.TableView(cc.size(704, 417), 2);
        listItem.setScrollBarEnabled(false);
        listItem.setMargin(20, 20, 0, 0);
        listItem.setPadding(20.0);
        listItem.setPosition(105, 98);
        this.addChild(listItem);
        this.listItem = listItem;

        var noPlayerLabel = new cc.LabelBMFont("Hiện tại không có người chơi trong sảnh, vui lòng chờ", cc.res.font.Roboto_Condensed_30, this.getContentSize().width - 100);
        noPlayerLabel.setVisible(false);
        noPlayerLabel.setPosition(this.getContentSize().width/2, this.getContentSize().height/2);
        this.addChild(noPlayerLabel);
        this.noPlayerLabel = noPlayerLabel;

        // for(var i=0;i<100;i++){
        //     this.addItem("", "username", 10000);
        // }
    },

    onGetChannelUser: function (command, data) {
        this.listItem.removeAllItems();

        var users = data["users"];
        this.allUsers = [];

        for (var i = 0; i < users.length; i++) {
            this.addItem(users[i]["avtUrl"], users[i]["username"], users[i]["gold"]);
            this.allUsers.push(users[i]["username"]);
        }

        this.noPlayerLabel.setVisible(users.length <= 0);
    },

    addItem: function (avt, username, gold) {
        var displayUserName = username;
        var thiz = this;

        var container = new ccui.Widget();
        container.setContentSize(cc.size(322, 70));
        this.listItem.pushItem(container);

        var bg1 = new ccui.Scale9Sprite("dialob-invite-bg1.png", cc.rect(14, 14, 4, 4));
        bg1.setPreferredSize(container.getContentSize());
        bg1.setPosition(container.getContentSize().width / 2, container.getContentSize().height / 2);
        container.addChild(bg1);

        var avt = UserAvatar.createAvatarWithId(avt);
        avt.setScale(0.8);
        avt.setPosition(40, container.getContentSize().height / 2);
        container.addChild(avt);

        if (displayUserName.length > 3 && (displayUserName != PlayerMe.username)) {
            displayUserName = displayUserName.substring(0, displayUserName.length - 3) + "***";
        }
        var userLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, displayUserName, cc.TEXT_ALIGNMENT_LEFT);
        userLabel.setLineBreakWithoutSpace(true);
        userLabel.setDimensions(200, userLabel.getLineHeight());
        userLabel.setAnchorPoint(cc.p(0.0, 0.5));
        userLabel.setPosition(80, container.getContentSize().height / 2 + 14);
        container.addChild(userLabel);

        var goldLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, cc.Global.NumberFormat1(gold) + " V");
        goldLabel.setColor(cc.color("#ffde00"));
        goldLabel.setAnchorPoint(cc.p(0.0, 0.5));
        goldLabel.setPosition(userLabel.x, container.getContentSize().height / 2 - 14);
        container.addChild(goldLabel);

        var inviteBt = s_Dialog_Create_Button1(cc.size(58, 40), "MỜI");
        inviteBt.setPosition(279, avt.y);
        container.addChild(inviteBt);
        inviteBt.addClickEventListener(function () {
            thiz._requestInvite([username]);
            thiz.listItem.removeItem(container);
            if(thiz.listItem.size() <= 0){
                thiz.hide();
            }
        });
    },

    _requestInvite : function (users) {
        if (users.length > 0){
            LobbyClient.getInstance().send({command: "inviteUser", users: users});
        }
    },

    onEnter : function () {
        this._super();
        LobbyClient.getInstance().addListener("getChannelUsers", this.onGetChannelUser, this);
        LobbyClient.getInstance().send({command: "getChannelUsers"});
    },

    onExit: function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
    }
});

var s_RecvInviteDialog = null;
var RecvInviteDialog = Dialog.extend({
    ctor: function () {
        this._super();
        var thiz = this;
        this.okButton.visible = false;
        this.cancelButton.visible = false;

        this.initWithSize(cc.size(599, 278));
        this.title.setString("MỜI CHƠI");

        var ignoreBt = s_Dialog_Create_Button2(cc.size(180, 50), "TỪ CHỐI TẤT CẢ");
        ignoreBt.setPosition(this.getContentSize().width/2 - 200, 150);
        ignoreBt.setZoomScale(0.02);
        this.addChild(ignoreBt);
        ignoreBt.addClickEventListener(function () {
            thiz.ignoreButtonHandler();
        });

        var cancelBt = s_Dialog_Create_Button2(cc.size(180, 50), "HỦY BỎ");
        cancelBt.setPosition(this.getContentSize().width/2, 150);
        cancelBt.setZoomScale(0.02);
        this.addChild(cancelBt);
        cancelBt.addClickEventListener(function () {
            thiz.cancelButtonHandler();
        });

        var okButton = s_Dialog_Create_Button1(cc.size(180, 50), "ĐỒNG Ý");
        okButton.setPosition(this.getContentSize().width/2 + 200, 150);
        okButton.setZoomScale(0.02);
        this.addChild(okButton);
        okButton.addClickEventListener(function () {
            thiz.okButtonHandler();
        });

        var messageNode = new cc.Node();
        this.addChild(messageNode, 10);
        this.messageNode = messageNode;

        //this.setInfo(null, "gamename", 1000000);
        s_RecvInviteDialog = this;
    },

    onExit : function () {
        this._super();
        s_RecvInviteDialog = null;
    },

    setInfo: function (username, gameName, betting) {
        this.messageNode.removeAllChildren(true);
        if (username) {
            this.setInfoWithSender(username, gameName, betting);
        }
        else {
            this.setInfoWithoutSender(gameName, betting);
        }
    },

    setRoomInfo: function (serverInfo) {
        this.serverInfo = serverInfo;
    },

    setInfoWithSender: function (username, gameName, betting) {
        if (username.length > 3 && (username != PlayerMe.username)) {
            username = username.substring(0, username.length - 3) + "***";
        }

        var msgLabel = new ccui.RichText();
        msgLabel.pushBackElement(new ccui.RichElementText(0, cc.color("#ffffff"), 255, username + " ", cc.res.font.Roboto_CondensedBold, 18));
        msgLabel.pushBackElement(new ccui.RichElementText(0, cc.color("#ffffff"), 255, "Mời bạn vào chơi phòng ", cc.res.font.Roboto_Condensed, 18));
        msgLabel.pushBackElement(new ccui.RichElementText(0, cc.color("#ffffff"), 255, gameName + " ", cc.res.font.Roboto_Condensed, 18));
        msgLabel.pushBackElement(new ccui.RichElementText(0, cc.color("#ffde00"), 255, cc.Global.NumberFormat1(betting) + " V", cc.res.font.Roboto_Condensed, 18));

        msgLabel.setPosition(this.getContentSize().width/2 , 248);
        this.messageNode.addChild(msgLabel);
    },

    setInfoWithoutSender: function (gameName, betting) {
        var msgLabel = new ccui.RichText();
        msgLabel.pushBackElement(new ccui.RichElementText(0, cc.color("#ffffff"), 255, "Bạn nhận được lời mời chơi ", cc.res.font.Roboto_Condensed, 18));
        msgLabel.pushBackElement(new ccui.RichElementText(0, cc.color("#ffffff"), 255, gameName + " ", cc.res.font.Roboto_Condensed, 18));
        msgLabel.pushBackElement(new ccui.RichElementText(0, cc.color("#ffde00"), 255, cc.Global.NumberFormat1(betting) + " V", cc.res.font.Roboto_Condensed, 18));

        msgLabel.setPosition(this.getContentSize().width/2 , 248);
        this.messageNode.addChild(msgLabel);
    },

    cancelButtonHandler: function () {
        this.hide();
    },

    okButtonHandler: function () {
        PlayerMe.SFS.roomId = this.room;
        SmartfoxClient.getInstance().findAndJoinRoom(this.serverInfo, null, null, this.serverInfo.roomId);
        LoadingDialog.getInstance().show("Đang tìm phòng chơi");
        this.hide();
    },

    ignoreButtonHandler : function () {
        if(this._ignoreHandler){
            this._ignoreHandler();
        }
        this.hide();
    }
});
