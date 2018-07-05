/**
 * Created by QuyetNguyen on 12/7/2016.
 */

// var s_chat_message = s_chat_message || [
//         "Nhanh đi má !!!", "Bĩnh tĩnh em eei",
//         "Lại phải chia bài!", "Đen vd",
//         "Chết nè cưng !!!", "Mày hả bưởi ???",
//         "Tới luôn!", "Vô tư đê !!!",
//         "Mình xin!", " Đừng vội mừng!",
//         "Lâu vồn", "Lâu kệ tao",
//         "Ngu vồn!", "Đệch!",
//         "Nhào zo !!!", "Nhanh cmml!"
// ];

var ChatDialog = IDialog.extend({
    ctor : function () {
        this._super();
        var thiz = this;
        this.mTouch = cc.rect(0, 226, 958, 494);

        this.setContentSize(cc.size(958, cc.winSize.height));

        var bg = new ccui.Scale9Sprite("board_bg.png", cc.rect(105, 105, 147, 147));
        bg.setPreferredSize(cc.size(1154,700));
        this.addChild(bg);
        bg.setPosition(this.getContentSize().width/2, 480);

        var closeButton = new ccui.Button("chat_close_bt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        closeButton.setPosition(this.getContentSize().width/2, 230);
        this.addChild(closeButton);
        closeButton.addClickEventListener(function () {
             thiz.hide();
        });

        this.initAllChat();
        this.initAllEmotion();
    },
    initAllChat : function () {
        var right = 539;
        var left = 0;
        var top = 720;
        var bottom = 265;

        var listMessage = new newui.TableView(cc.size(right - left, (top - bottom)), 2);
        listMessage.setPadding(30);
        listMessage.setBounceEnabled(true);
        listMessage.setMargin(30,30,0,0);
        listMessage.setScrollBarEnabled(false);
        listMessage.setPosition(left, bottom);
        this.addChild(listMessage);

        var thiz = this;
        var s_chat_message = cc.Global.getStringRes()["ChatMessage"];
        for(var i=0;i<s_chat_message.length;i++){
            var bg = new ccui.Button("dialog_chat_bg.png", "","",ccui.Widget.PLIST_TEXTURE);
            bg.setCapInsetsNormalRenderer(cc.rect(50,0,4,60));
            bg.setScale9Enabled(true);
            bg.setContentSize(cc.size(240, 60));
            bg.setZoomScale(0.02);
            listMessage.pushItem(bg);

            var message = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, s_chat_message[i]);
            message.setPosition(bg.getContentSize().width/2, bg.getContentSize().height/2);
            bg.getRendererNormal().addChild(message);
            (function () {
                var msg = s_chat_message[i];
                bg.addClickEventListener(function () {
                    thiz._buttonHandler(msg);
                });
            })();
        }
    },

    initAllEmotion : function () {
        var right = 958;
        var left = 539;
        var top = 720;
        var bottom = 265;

        var listMessage = new newui.TableView(cc.size(right - left, (top - bottom)), 5);
        listMessage.setPadding(20);
        listMessage.setBounceEnabled(true);
        listMessage.setMargin(30,30,0,0);
        listMessage.setScrollBarEnabled(false);
        listMessage.setPosition(left, bottom);
        this.addChild(listMessage);

        var thiz = this;
        for(var i=0;i<42;i++){
            if(i === 4){
                continue;
            }

            (function () {
                var iconImg = "chat_icon_" + (i+1) + ".png";
                var icon = new ccui.Button(iconImg, "","",ccui.Widget.PLIST_TEXTURE);
                icon.setZoomScale(0.02);
                listMessage.pushItem(icon);

                icon.addClickEventListener(function () {
                    thiz._emotionHandler(iconImg);
                });
            })();
        }
    },

    _buttonHandler : function (message) {
        if(this.onTouchMessage){
            this.onTouchMessage(message);
        }
        this.hide();
    },

    _emotionHandler : function (img) {
        if(this.onTouchEmotion){
            this.onTouchEmotion(img);
        }
        this.hide();
    }
});