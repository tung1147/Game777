/**
 * Created by Quyet Nguyen on 3/21/2017.
 */

var s_activity_tab_name = s_activity_tab_name || [
    "ĐIỂM DANH",
    "TÍCH LŨY ĐĂNG NHẬP",
    "ONLINE NHẬN QUÀ",
    "NHIỆM VỤ",
    "SỰ KIỆN"
];

var ActivityCountNode = InboxCountNode.extend({
    _initListener : function () {
        LobbyClient.getInstance().addListener("updateLandmarkCompleted", this.refreshView, this);
    },

    refreshView : function () {
        if(PlayerMe.missionCount <= 0){
            this.newsBg.visible = false;
        }
        else{
            this.newsBg.visible = true;
            if(PlayerMe.missionCount > 9){
                this.newLabel.setString("9+");
            }
            else{
                this.newLabel.setString(PlayerMe.missionCount.toString());
            }
        }
    }
});

var ActivityTab = ToggleNodeItem.extend({
    ctor : function (title) {
        this._super(cc.size(260, 60));

        var titleLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_18, title);
        titleLabel.setAnchorPoint(cc.p(0.0, 0.5));
        titleLabel.setPosition(cc.p(18, this.getContentSize().height / 2 + 10));
        this.addChild(titleLabel);
        this.titleLabel = titleLabel;

        var statusLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_16, "status");
        statusLabel.setAnchorPoint(cc.p(0.0, 0.5));
        statusLabel.setPosition(cc.p(titleLabel.x, this.getContentSize().height / 2 - 10));
        this.addChild(statusLabel);
        this.statusLabel = statusLabel;
    },
    setStatus : function (status) {
        this.statusLabel.setString(status);
    },
    select : function (isForce, ext) {
        this.titleLabel.setColor(cc.color("#682e2e"));
        this.statusLabel.setColor(cc.color("#682e2e"));
        this._super(isForce, ext);
    },
    unSelect : function (isForce, ext) {
        this.titleLabel.setColor(cc.color("#4c6080"));
        this.statusLabel.setColor(cc.color("#4c6080"));
        this._super(isForce, ext);
    }
});

var ActivityDialog = Dialog.extend({
    ctor : function () {
        this._super();
        LobbyClient.getInstance().addListener("fetchUserMissionInfo", this._onRecvActivityStatus, this);
        LobbyClient.getInstance().addListener("fetchUserMissionStatus", this._onRecvActivityStatus, this);

        this.okButton.visible = false;
        this.cancelButton.visible = false;
        this.title.setString("Hoạt động");
        this.initWithSize(cc.size(918, 578));
        this._initView();
    },

    _initView : function () {
        var allLayer = [
            new ActivityDiemDanhLayer(),
            new ActivityLoginLayer(),
            new ActivityOnlineLayer(),
            new ActivityQuestLayer(),
            new ActivityEventLayer()
        ];

        for(var i=0;i<allLayer.length;i++){
            // allLayer[i].setAnchorPoint(cc.p(0,0));
            // allLayer[i].setPosition(cc.p(this._marginLeft, this._marginBottom));
            this.addChild(allLayer[i]);
        }

        var selectSprite = new cc.Sprite("#activiti_tab_2.png");
        selectSprite.setPosition(210, 100);
        this.addChild(selectSprite);

        var mToggle = new ToggleNodeGroup();
        this.mToggle = mToggle;
        this.allTab = [];
        var thiz = this;
        this.addChild(mToggle);
        for(var i = 0; i<s_activity_tab_name.length; i++){
            (function () {
                var mNode = allLayer[i];

                var tab = new ActivityTab(s_activity_tab_name[i]);
                thiz.allTab.push(tab);
                tab.setPosition(thiz._marginLeft + tab.getContentSize().width/2, thiz._marginBottom + 480 - i * 60);
                tab.onSelect = function (isForce) {
                    mNode.setVisible(true);
                    if(isForce){
                        selectSprite.y = tab.y;
                    }
                    else{
                        selectSprite.stopAllActions();
                        selectSprite.runAction(new cc.MoveTo(0.1, cc.p(selectSprite.x, tab.y)));
                    }
                };

                tab.onUnSelect = function () {
                    mNode.setVisible(false);
                };
                mToggle.addItem(tab);
            })();
        }
    },

    _onRecvActivityStatus : function (cmd, data) {
        var type = data["data"]["typeMission"];
        var info = data["data"]["shortInfo"];
        if(type == 0){
            this.allTab[0].setStatus(info);
        }
        else if(type == 2){
            this.allTab[1].setStatus(info);
        }
        else if(type == 3){
            this.allTab[2].setStatus(info);
        }
        else if(type == 1){
            this.allTab[3].setStatus(info);
        }
    },

    onEnter : function () {
        this._super();
        this.mToggle.selectItem(0);

        for(var i=0;i<this.allTab.length;i++){
            this.allTab[i].setStatus("");
        }

        LobbyClient.getInstance().send({command : "fetchUserMissionInfo", typeMission : 0});
        LobbyClient.getInstance().send({command : "fetchUserMissionInfo", typeMission : 2});
        LobbyClient.getInstance().send({command : "fetchUserMissionStatus", typeMission : 3});
        LobbyClient.getInstance().send({command : "fetchUserMissionStatus", typeMission : 1});
    },

    onExit : function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
    }
});

var ActivityNotificationNode = cc.Node.extend({
    ctor : function () {
        this._super();
        LobbyClient.getInstance().addListener("inboxMessage", this._onInboxMessageHandler, this);

        var bg = new cc.Sprite("#top_bar_news_bg.png");
        bg.setPosition(cc.p(0,0));
        this.addChild(bg);
        this.newsBg = bg;

        var newLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "9+");
        newLabel.setPosition(bg.getContentSize().width/2, bg.getContentSize().height/2);
        newLabel.setColor(cc.color("#682e2e"));
        bg.addChild(newLabel);
        this.newLabel = newLabel;
    },

    refreshView : function () {
        if(PlayerMe.messageCount <= 0){
            this.newsBg.visible = false;
        }
        else{
            this.newsBg.visible = true;
            if(PlayerMe.messageCount > 9){
                this.newLabel.setString("9+");
            }
            else{
                this.newLabel.setString(PlayerMe.messageCount.toString());
            }
        }
    },

    _onInboxMessageHandler : function () {
        this.refreshView();
    },

    onEnter : function () {
        this._super();
        this.refreshView();
    },

    onExit : function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
    }
});