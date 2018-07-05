/**
 * Created by Quyet Nguyen on 7/1/2016.
 */

var InboxCountNode = cc.Node.extend({
    ctor : function () {
        this._super();
        this._initListener();

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

    _initListener : function () {
        LobbyClient.getInstance().addListener("inboxMessage", this._onInboxMessageHandler, this);
        LobbyClient.getInstance().addListener("markReadedMessageInbox", this._onInboxMessageHandler, this);
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

var LobbyTopBar = cc.Node.extend({
    ctor : function () {
        this._super();

        this.setAnchorPoint(0.0, 1.0);
        this.setContentSize(1280.0, 720.0);
        this.setPosition(0.0, 720.0);
        this.setScale(cc.winSize.screenScale);

        var backBt = new ccui.Button("top_bar_backBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        backBt.setPosition(54, 660);
        this.addChild(backBt);

        var callBt = new ccui.Button("top_bar_callBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        callBt.setPosition(200, backBt.y);
        this.addChild(callBt);

        var transferGoldBt = new ccui.Button("top_bar_goldBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        transferGoldBt.setPosition(347, backBt.y);
        this.addChild(transferGoldBt);

        var shopBt = new ccui.Button("top_bar_shopBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        shopBt.setPosition(493, backBt.y);
        this.addChild(shopBt);

        var activityBt = new ccui.Button("top_bar_activityBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        activityBt.setPosition(639, backBt.y);
        this.addChild(activityBt);

        var activityNotif = new ActivityCountNode();
        activityNotif.setPosition(70,80);
        activityBt.getRendererNormal().addChild(activityNotif);

        var inboxBt = new ccui.Button("top_bar_inboxBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        inboxBt.setPosition(786, backBt.y);
        this.addChild(inboxBt);

        var notif = new InboxCountNode();
        notif.setPosition(70,80);
        inboxBt.getRendererNormal().addChild(notif);

        var newsBt = new ccui.Button("top_bar_newsBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        newsBt.setPosition(932, backBt.y);
        this.addChild(newsBt);

        var rankBt = new ccui.Button("top_bar_rankBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        rankBt.setPosition(1078, backBt.y);
        this.addChild(rankBt);

        var settingBt = new ccui.Button("top_bar_settingBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        settingBt.setPosition(1224, backBt.y);
        this.addChild(settingBt);

        this._initMessageLabel();

        this.backBt = backBt;
        this.callBt = callBt;
        this.transferGoldBt = transferGoldBt;
        this.shopBt = shopBt;
        this.activityBt = activityBt;
        this.inboxBt = inboxBt;
        this.newsBt = newsBt;
        this.rankBt = rankBt;
        this.settingBt = settingBt;
    },

    _initMessageLabel : function () {
        var bg = new ccui.Scale9Sprite("top_bar_text_bg.png", cc.rect(4,4,4,4));
        bg.setPreferredSize(cc.size(1280, 56));
        bg.setAnchorPoint(cc.p(0,0));
        bg.setPosition(0, 550);
        this.addChild(bg);

        var messageBoxLeft = 0.0;
        var messageBoxRight = 1280.0;
        var messageBoxWidth = messageBoxRight - messageBoxLeft;

        var clippingMessage = new ccui.Layout();
        clippingMessage.setContentSize(messageBoxWidth, 56);
        clippingMessage.setClippingEnabled(true);
        clippingMessage.setClippingType(ccui.Layout.CLIPPING_SCISSOR);
        clippingMessage.setPosition(messageBoxLeft, bg.y);
        this.addChild(clippingMessage);

        var messageText = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "message");
        messageText.setColor(cc.color("#bbc9ff"));
        messageText.setAnchorPoint(0.0, 0.5);
        messageText.setPosition(0.0, clippingMessage.getContentSize().height/2);
        clippingMessage.addChild(messageText);

        this.messageText = messageText;
        this.messageBoxWidth = messageBoxWidth;

        this.setMessage("Sự kiện nhân đôi vàng, bắt đầu từ ngày 30/05/2015 - 01/06/2015");
    },
    
    setMessage : function (message) {
        var thiz = this;
        this.oldMessage = message;
        
        var messageText = this.messageText;
        var messageBoxWidth = this.messageBoxWidth + 10.0;

        messageText.stopAllActions();
        messageText.setString(message);
        messageText.x = messageBoxWidth;
        var moveWidth = messageBoxWidth + messageText.getContentSize().width;
        var duration = moveWidth / 75.0;
        var action = new cc.Sequence(new cc.MoveBy(duration, cc.p(-moveWidth, 0)), new cc.CallFunc(function () {
            thiz.setMessage(GameConfig.broadcastMessage);
        }));
        this.messageText.runAction(action);
    },
    refreshView : function () {
        this.setMessage(GameConfig.broadcastMessage);
    },

    onBroadcastMessage: function () {
        if(!this.oldMessage || this.oldMessage === ""){
            this.refreshView();
        }
    },

    onEnter : function () {
        this._super();
        this.refreshView();
        LobbyClient.getInstance().addListener("sendBroadcastMessage", this.onBroadcastMessage, this);
    },

    onExit : function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
    }
});