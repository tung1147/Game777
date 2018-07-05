/**
 * Created by Quyet Nguyen on 7/19/2016.
 */
var RewardDialog = Dialog.extend({
    ctor : function () {
        this._super();
        this.initWithSize(cc.size(600,420));
        this.title.setString("Nhận thưởng");
        this.closeButton.visible = false;
        this.okTitle.setString("Nhận thưởng");
        this.cancelTitle.setString("Hủy");

        var bg = new ccui.Scale9Sprite("lobby-text-input.png",cc.rect(10,10,4,4));
        bg.setPreferredSize(cc.size(420, 60));
        bg.setPosition(this.getContentSize().width/2, this.getContentSize().height/2 - 30);
        this.addChild(bg);

        // var phoneText = new newui.EditBox(cc.size(bg.getContentSize().width - 6, bg.getContentSize().height-2));
        // phoneText.setFont(cc.res.font.Roboto_Condensed, 30.0 * cc.winSize.screenScale);
        // phoneText.setPlaceholderFont(cc.res.font.Roboto_Condensed, 30.0 * cc.winSize.screenScale);
        // phoneText.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        // phoneText.setReturnType(cc.KEYBOARD_RETURNTYPE_DONE);
        // phoneText.setPlaceHolder("Nhập số điện thoại");
        // phoneText.setPosition(bg.getPosition());
        // this.addChild(phoneText, 1);


        var phoneText = new newui.TextField(cc.size(bg.getContentSize().width - 6, bg.getContentSize().height-2), cc.res.font.Roboto_Condensed_25);
        phoneText.setPlaceHolder("Nhập số điện thoại");
        phoneText.setTextColor(cc.color(255,255,255));
        phoneText.setPlaceHolderColor(cc.color(144, 144, 144));
        phoneText.setPosition(bg.getPosition());
        this.phoneText = phoneText;
        this.addChild(phoneText, 1);
    },
    setCardInfo : function (itemName, gold) {
        if(cc.sys.isNative){
            var goldstr = "<font color='#ffde00'>" + " " + cc.Global.NumberFormat1(gold) + " V" + " " + "</font>";
            var itemStr = "<font color='#17b0e2'>" + " " + itemName + "</font>";

            var textStr1 = "<font face='"+cc.res.font.Roboto_Condensed+"' size='30'>" + "Bạn muốn đổi" +goldstr + "</font>";
            var textStr2 = "<font face='"+cc.res.font.Roboto_Condensed+"' size='30'>" + "lấy" +itemStr + "</font>";

            var text = new ccui.RichText();
            text.initWithXML(textStr1, {});
            text.setPosition(this.getContentSize().width/2, this.getContentSize().height/2 + 80);
            this.addChild(text);

            var text2 = new ccui.RichText();
            text2.initWithXML(textStr2, {});
            text2.setPosition(text.x, text.y - 40);
            this.addChild(text2);
        }
        else{
            var text = "Bạn muốn đổi " + cc.Global.NumberFormat1(gold) + " V " + "lấy thẻ " + itemName;
            var label = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, text, cc.TEXT_ALIGNMENT_CENTER, 350.0);
            label.setPosition(this.getContentSize().width/2, this.getContentSize().height/2 + 60);
            this.addChild(label);
        }
    },
    setItemInfo : function (itemName, gold) {
        if(cc.sys.isNative){
            var goldstr = "<font color='#ffde00'>" + " " + cc.Global.NumberFormat1(gold) + " V" + " " + "</font>";
            var itemStr = "<font color='#17b0e2'>" + " " + itemName + "</font>";

            var textStr1 = "<font face='"+cc.res.font.Roboto_Condensed+"' size='30'>" + "Bạn muốn đổi" +goldstr + "</font>";
            var textStr2 = "<font face='"+cc.res.font.Roboto_Condensed+"' size='30'>" + "lấy" +itemStr + "</font>";

            var text = new ccui.RichText();
            text.initWithXML(textStr1, {});
            text.setPosition(this.getContentSize().width/2, this.getContentSize().height/2 + 80);
            this.addChild(text);

            var text2 = new ccui.RichText();
            text2.initWithXML(textStr2, {});
            text2.setPosition(text.x, text.y - 40);
            this.addChild(text2);
        }
        else{
            var text = "Bạn muốn đổi " + cc.Global.NumberFormat1(gold) + " vàng " + "lấy " + itemName;
            var label = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, text, cc.TEXT_ALIGNMENT_CENTER, 400.0);
            label.setPosition(this.getContentSize().width/2, this.getContentSize().height/2 + 60);
            this.addChild(label);
        }
    },
    cancelButtonHandler : function () {
        this.hide();
    }
});
