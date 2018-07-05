/**
 * Created by Quyet Nguyen on 7/11/2016.
 */
var SettingDialog = Dialog.extend({
    ctor : function () {
        this._super();
        var thiz = this;

        this.initWithSize(cc.size(518, 318));
        this.title.setString("Cài đặt");
       // this.closeButton.visible = false;
        this.okButton.visible = false;
        this.cancelButton.visible = false;

        var soundLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_14, "ÂM THANH");
        soundLabel.setPosition(this.getContentSize().width/2 - 130, 207);
        soundLabel.setColor(cc.color("#a6bde0"));
        this.addChild(soundLabel, 1);

        var vibratorLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_14, "RUNG");
        vibratorLabel.setPosition(this.getContentSize().width/2, soundLabel.y);
        vibratorLabel.setColor(cc.color("#a6bde0"));
        this.addChild(vibratorLabel, 1);

        var inviteLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_14, "NHẬN LỜI MỜI");
        inviteLabel.setPosition(this.getContentSize().width/2 + 130, vibratorLabel.y);
        inviteLabel.setColor(cc.color("#a6bde0"));
        this.addChild(inviteLabel, 1);

        var emailIcon = new cc.Sprite("#setting-email-icon.png");
        emailIcon.setPosition(580, 125);
        this.addChild(emailIcon);

        var emailLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, GameConfig.email);
        emailLabel.setAnchorPoint(cc.p(1.0, 0.5));
        emailLabel.setPosition(emailIcon.x - 20, emailIcon.y);
        emailLabel.setColor(cc.color("#4d5f7b"));
        this.addChild(emailLabel, 1);

        var versionLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "Ver " + SystemPlugin.getInstance().getVersionName());
        versionLabel.setAnchorPoint(cc.p(0.0, 0.5));
        versionLabel.setPosition(122, emailLabel.y);
        versionLabel.setColor(cc.color("#4d5f7b"));
        this.addChild(versionLabel, 1);

        var soundOnOff = new newui.ButtonToggle("#setting-sound-icon-2.png","#setting-sound-icon.png");
        soundOnOff.setPosition(soundLabel.x, 260);
        soundOnOff.onSelect = function (target,selected) {
            thiz._setSoundEnable(selected);
            if (!selected){
                SoundPlayer.stopAllSound();
            }
        };
        this.addChild(soundOnOff);

        var vibratorOnOff = new newui.ButtonToggle("#setting-vibrator-icon-2.png","#setting-vibrator-icon.png");
        vibratorOnOff.setPosition(vibratorLabel.x, soundOnOff.y);
        vibratorOnOff.onSelect = function (target,selected) {
            thiz._setVibratorEnable(selected);
        };
        this.addChild(vibratorOnOff);

        var inviteOnOff = new newui.ButtonToggle("#setting-invite-icon-2.png","#setting-invite-icon.png");
        inviteOnOff.setPosition(inviteLabel.x, soundOnOff.y);
        inviteOnOff.onSelect = function (target,selected) {
            thiz._setInviteEnable(selected);
        };
        this.addChild(inviteOnOff);

        this.soundOnOff = soundOnOff;
        this.vibratorOnOff = vibratorOnOff;
        this.inviteOnOff = inviteOnOff;

        this.soundLabel = soundLabel;
        this.vibratorLabel = vibratorLabel;
        this.inviteLabel = inviteLabel;
    },

    _setSoundEnable : function (enable, force) {
        cc.Global.SetSetting("sound",enable);
        this.soundLabel.setColor(cc.color(enable ? "#ffde00" : "#435878"));
        if(force){
            this.soundOnOff.select(enable);
        }
    },

    _setVibratorEnable : function (enable, force) {
        cc.Global.SetSetting("vibrator",enable);
        this.vibratorLabel.setColor(cc.color(enable ? "#ffde00" : "#435878"));
        if(force){
            this.vibratorOnOff.select(enable);
        }

        if(cc.sys.isNative){
            if(!this._isInitView && enable){
                cc.Device.vibrate(0.1);
            }
        }
    },

    _setInviteEnable : function (enable, force) {
        cc.Global.SetSetting("invite",enable);
        this.inviteLabel.setColor(cc.color(enable ? "#ffde00" : "#435878"));
        if(force){
            this.inviteOnOff.select(enable);
        }
    },

    onEnter : function () {
        this._super();

        this._isInitView = true;
        this._setSoundEnable(cc.Global.GetSetting("sound",true), true);
        this._setVibratorEnable(cc.Global.GetSetting("vibrator",true), true);
        this._setInviteEnable(cc.Global.GetSetting("invite",true), true);
        this._isInitView = false;
    }
});