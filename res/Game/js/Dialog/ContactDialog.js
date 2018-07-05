/**
 * Created by QuyetNguyen on 1/6/2017.
 */

var ContactDialog = Dialog.extend({
    ctor : function () {
        this._super();
        this.okButton.visible = false;
        this.cancelButton.visible = false;
        this.title.setString("Liên hệ");
        this.initWithSize(cc.size(478, 278));
        this.showContactInfo();
    },

    setTitle : function (title) {
        this.title.setString(title);
    },

    showContactInfo : function () {
        var contactDial = new ccui.Button("contactDial.png", "", "", ccui.Widget.PLIST_TEXTURE);
        contactDial.setPosition(this.width/2 + 63, 189);
        this.addChild(contactDial);

        var contactFacebook = new ccui.Button("contactFacebook.png", "", "", ccui.Widget.PLIST_TEXTURE);
        contactFacebook.setPosition(this.width/2 - 63,contactDial.y);
        this.addChild(contactFacebook);

        var contactStr = "Vui lòng gọi vào hotline hoặc nhắn tin qua fanpage Facebook để được hỗ trợ trực tiếp";
        var contactLabel = new cc.LabelBMFont(contactStr,cc.res.font.Roboto_Condensed_18, 440, cc.TEXT_ALIGNMENT_CENTER);
        contactLabel.setPosition(this.width/2, 264);

        var dialLabel = new cc.LabelBMFont(GameConfig.hotline,cc.res.font.Roboto_Condensed_18);
        dialLabel.setPosition(contactDial.x,contactDial.y - 53);
        dialLabel.setColor(cc.color("#ffde00"));
        this.addChild(dialLabel);

        var facebookLabel = new cc.LabelBMFont("Nhắn tin",cc.res.font.Roboto_Condensed_18);
        facebookLabel.setPosition(contactFacebook.x,dialLabel.y);
        facebookLabel.setColor(cc.color("#ffde00"));
        this.addChild(facebookLabel);

        contactFacebook.addClickEventListener(function () {
            cc.Global.openURL(GameConfig.fanpage);
        });

        contactDial.addClickEventListener(function () {
            if(cc.sys.isNative){
                SystemPlugin.getInstance().showCallPhone(GameConfig.hotline);
            }
        });

        if(!cc.sys.isNative){
            contactDial.setEnabled(false);
        }

        this.addChild(contactLabel);
    }
});