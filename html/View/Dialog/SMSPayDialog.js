/**
 * Created by VGA10 on 9/28/2016.
 */

var SMSPayDialog = Dialog.extend({
    ctor: function () {
        this._super();
        this.initWithSize(cc.size(600, 360));
        this.title.setString("Chọn nhà mạng");
        this.okButton.visible = false;
        this.cancelButton.visible = false;

        this.selectedTelCo = {};
        this.bundleId = 0;
        this.smsSyntax = "";
        var thiz = this;

        var viettelBt = new ccui.Button("payment-card-viettel.png", "", "", ccui.Widget.PLIST_TEXTURE);
        viettelBt.setScale9Enabled(true);
        viettelBt.setCapInsets(cc.rect(10, 10, 4, 4));
        viettelBt.setContentSize(170, 60);
        viettelBt.setPosition(210, 320);
        viettelBt.select = function () {
            viettelBt.setOpacity(255);
        };
        viettelBt.deselect = function () {
            viettelBt.setOpacity(255 * 0.4);
        };
        viettelBt.addClickEventListener(function () {
            thiz.selectTelCo(0);
        });
        this.addChild(viettelBt);
        this.viettelBt = viettelBt;
        viettelBt.deselect();

        var mobiBt = new ccui.Button("payment-card-mobi.png", "", "", ccui.Widget.PLIST_TEXTURE);
        mobiBt.setScale9Enabled(true);
        mobiBt.setCapInsets(cc.rect(10, 10, 4, 4));
        mobiBt.setContentSize(170, 60);
        mobiBt.setPosition(400, 320);
        mobiBt.select = function () {
            mobiBt.setOpacity(255);
        };
        mobiBt.deselect = function () {
            mobiBt.setOpacity(255 * 0.4);
        };
        mobiBt.addClickEventListener(function () {
            thiz.selectTelCo(1);
        });
        this.addChild(mobiBt);
        mobiBt.deselect();
        this.mobiBt = mobiBt;

        var vinaBt = new ccui.Button("payment-card-vina.png", "", "", ccui.Widget.PLIST_TEXTURE);
        vinaBt.setScale9Enabled(true);
        vinaBt.setCapInsets(cc.rect(10, 10, 4, 4));
        vinaBt.setContentSize(170, 60);
        vinaBt.setPosition(590, 320);
        vinaBt.select = function () {
            vinaBt.setOpacity(255);
        };
        vinaBt.deselect = function () {
            vinaBt.setOpacity(255 * 0.4);
        };
        vinaBt.addClickEventListener(function () {
            thiz.selectTelCo(2);
        });
        this.addChild(vinaBt);
        vinaBt.deselect();
        this.vinaBt = vinaBt;

        var smsTitle = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "Gửi tin nhắn");
        smsTitle.setPosition(this.getContentSize().width/2, 270);
        this.addChild(smsTitle);

        var smsContent = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "SMS Content");
        smsContent.setColor(cc.color("#ffde00"));
        smsContent.setPosition(this.getContentSize().width/2, 240);
        this.addChild(smsContent);
        this.smsContent = smsContent;

        var smsGateway = cc.Global.SMSList[0].smsGateway;
        var smsPhoneNumber = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "Đến đầu số "+smsGateway);
        smsPhoneNumber.setPosition(this.getContentSize().width/2, 210);
        this.addChild(smsPhoneNumber);

        this.selectTelCo(0);
    },

    selectTelCo: function (telcoIndex) {
        if (this.selectedTelCo instanceof ccui.Button) {
            this.selectedTelCo.deselect();
        }
        switch (telcoIndex) {
            case 0:
                this.selectedTelCo = this.viettelBt;
                break;
            case 1:
                this.selectedTelCo = this.mobiBt;
                break;
            case 2:
                this.selectedTelCo = this.vinaBt;
                break;
        }

        this.selectedTelCo.select();
        this.buildSMSSyntax(this.bundleId,telcoIndex);
    },
    buildSMSSyntax: function (index, telco) {
        var syntax = "";
        switch (telco) {
            case 0:
                syntax = cc.Global.SMSList[index].vttContent.replace('username', PlayerMe.username);
                break;
            case 1:
                syntax = cc.Global.SMSList[index].vmsContent.replace('username', PlayerMe.username);
                break;
            case 2:
                syntax = cc.Global.SMSList[index].vnpContent.replace('username', PlayerMe.username);
        }
        this.smsContent.setString(syntax);

        // this.smsSyntax = syntax;
        // var smsHint = "<font face='" + cc.res.font.Roboto_Condensed + "' size='25'>" + "Cú pháp " +
        //     "<font color='#ffde00'>" + syntax
        //     + "</font>" + " gửi " + "<font color='#ffde00'>" + cc.Global.SMSList[0].smsGateway + "</font></font>";
        //
        // if (this.smsLabel)
        //     this.smsLabel.removeFromParent(true);
        // this.smsLabel = ccui.RichText.createWithXML(smsHint, {});
        // this.smsLabel.setPosition(400, 260);
        // this.addChild(this.smsLabel);
    }
});