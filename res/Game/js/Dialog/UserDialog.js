/**
 * Created by Quyet Nguyen on 7/11/2016.
 */

var UserDialog = Dialog.extend({
    ctor : function () {
        this._super();
        this.okButton.visible = false;
        this.cancelButton.visible = false;
        this.title.setString("Thông tin người chơi");
        this.initWithSize(cc.size(600,400));

        var avt = UserAvatar.createAvatar();
        avt.setPosition(cc.p(this.getContentSize().width/2, 320));
        this.addChild(avt);
        this.avt = avt;

        var userLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_30, "username", cc.TEXT_ALIGNMENT_CENTER);
        userLabel.setDimensions(580, userLabel.getLineHeight());
        userLabel.setPosition(cc.p(this.getContentSize().width/2, 250));
        this.addChild(userLabel);

        var goldLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "1.000.000 V");
        goldLabel.setColor(cc.color("#ffde00"));
        goldLabel.setPosition(cc.p(this.getContentSize().width/2, 215));
        this.addChild(goldLabel);

        this.userLabel = userLabel;
        this.goldLabel = goldLabel;
    },
    setUsername : function (username) {
        this.userLabel.setString(username);
    },
    setGold : function (gold) {
        this.goldLabel.setString(cc.Global.NumberFormat1(gold) +" V");
    },
    setAvatar : function (avt) {
        this.avt.setAvatar(avt);
    }
});