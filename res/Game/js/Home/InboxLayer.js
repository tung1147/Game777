/**
 * Created by Quyet Nguyen on 7/13/2016.
 */

var s_text_color = s_text_color || cc.color("#ffffff");
var s_text_color_readed = s_text_color_readed || cc.color(120,120,120,255);

var InboxLayer = LobbySubLayer.extend({
    ctor : function () {
        this._super("#lobby-title-newMessage.png");

        // var title = new cc.Sprite("#lobby-title-newMessage.png");
        // title.setPosition(cc.winSize.width/2, 720.0 - 63 * cc.winSize.screenScale);
        // this.addChild(title);
        // title.setScale(cc.winSize.screenScale);

        var timeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "Thời gian");
        timeLabel.setColor(cc.color("#576eb0"));
        timeLabel.setPosition(185.0 * cc.winSize.screenScale, 576);

        var senderLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "Người gửi");
        senderLabel.setColor(cc.color("#576eb0"));
        senderLabel.setPosition(437.0 * cc.winSize.screenScale, 576);

        var titleLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "Nội dung");
        titleLabel.setColor(cc.color("#576eb0"));
        titleLabel.setPosition(892.0 * cc.winSize.screenScale, 576);

        this.addChild(timeLabel);
        this.addChild(senderLabel);
        this.addChild(titleLabel);

        var _top = 554.0;
        var _bottom = 0.0;

        var messageList = new newui.TableView(cc.size(cc.winSize.width, _top - _bottom), 1);
        messageList.setDirection(ccui.ScrollView.DIR_VERTICAL);
        messageList.setScrollBarEnabled(false);
        messageList.setPadding(10);
        messageList.setMargin(10,10,0,0);
        messageList.setPosition(cc.p(0, _bottom));
        this.addChild(messageList, 1);
        this.messageList = messageList;

        LobbyClient.getInstance().addListener("fetchMultiMessageInbox", this.onRecvMessageInbox, this);
        //LobbyClient.getInstance().addListener("markReadedMessageInbox", this.onMarkReadedMessageInbox, this);
        LobbyClient.getInstance().addListener("inboxMessage", this.onUpdateMessageCount, this);
    },
    addMessage : function (messageId, time, sender, title, content, status) {
        var textColor = s_text_color;
        if(status == 6){
            textColor = s_text_color_readed;
        }

        var container = new ccui.Widget();
        container.messageId = messageId;
        container.setContentSize(cc.size(this.messageList.getContentSize().width, 80));
        this.messageList.pushItem(container);

        var bg1 = new ccui.Scale9Sprite("sublobby-cell-bg.png",cc.rect(10, 0, 4, 78));
        bg1.setPreferredSize(cc.size(250 * cc.winSize.screenScale, 80));
        bg1.setPosition(185.0 * cc.winSize.screenScale, bg1.getContentSize().height/2);
        container.addChild(bg1);

        var bg2 = new ccui.Scale9Sprite("sublobby-cell-bg.png",cc.rect(10, 0, 4, 78));
        bg2.setPreferredSize(cc.size(250 * cc.winSize.screenScale, 80));
        bg2.setPosition(437.0 * cc.winSize.screenScale, bg1.y);
        container.addChild(bg2);

        var bg3 = new ccui.Scale9Sprite("sublobby-cell-bg.png",cc.rect(10, 0, 4, 78));
        bg3.setPreferredSize(cc.size(656 * cc.winSize.screenScale, 80));
        bg3.setPosition(892.0 * cc.winSize.screenScale, bg1.y);
        container.addChild(bg3);

        var d = new Date(time);
        var timeString = cc.Global.DateToString(d);
        var timeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, timeString, cc.TEXT_ALIGNMENT_CENTER, bg1.getContentSize().width);
        timeLabel.setPosition(bg1.getPosition());
        timeLabel.setColor(textColor);
        container.addChild(timeLabel);
        container.timeLabel = timeLabel;

        var senderLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, sender);
        senderLabel.setPosition(bg2.getPosition());
        senderLabel.setColor(textColor);
        container.addChild(senderLabel);
        container.senderLabel = senderLabel;

        var titleLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, title);
        titleLabel.setPosition(bg3.getPosition());
        titleLabel.setColor(textColor);
        container.titleLabel = titleLabel;
        container.addChild(titleLabel);

        container.setTouchEnabled(true);
        container.addClickEventListener(function () {
            var dialog = new MessageDialog();
            dialog.title.setString("Tin nhắn");
            dialog.setMessage(content);
            dialog.showWithAnimationScale();
            if(status === 1){
                var request = {
                    command : "markReadedMessageInbox",
                    messageId : messageId
                };
                LobbyClient.getInstance().send(request);

                timeLabel.setColor(s_text_color_readed);
                senderLabel.setColor(s_text_color_readed);
                titleLabel.setColor(s_text_color_readed);
            }
        });
    },
    
    onEnter : function () {
        this._super();
        this.requestAllMessage();
    },

    onExit : function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
    },

    requestAllMessage : function () {
        var msg = {
            command : "fetchMultiMessageInbox"
        };
        LobbyClient.getInstance().send(msg);
    },

    onUpdateMessageCount : function (cmd, data) {
        this.requestAllMessage();
    },

    onRecvMessageInbox : function (cmd, data) {
        var msg = data["data"]["messages"];
        if(msg && msg.length > 0){
            cc.log("onRecvMessageInbox");
            this.messageList.removeAllItems();
            for(var i=0;i<msg.length;i++){
                if(msg[i].type === 1){
                    this.addMessage(msg[i].messageId, msg[i].sendTime, msg[i].senderName, msg[i].title, msg[i].content, msg[i].status);
                }
            }
        }
    }

    // onMarkReadedMessageInbox : function (cmd, data) {
    //     var messageId = data["data"]["messageId"];
    //     for(var i=0;i<this.messageList.size();i++){
    //         var msgItem = this.messageList.getItem(i);
    //         if(msgItem.messageId === messageId){
    //             msgItem.timeLabel.setColor(s_text_color_readed);
    //             msgItem.senderLabel.setColor(s_text_color_readed);
    //             msgItem.titleLabel.setColor(s_text_color_readed);
    //         }
    //     }
    // }
});