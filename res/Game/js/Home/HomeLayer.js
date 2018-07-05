/**
 * Created by Quyet Nguyen on 6/30/2016.
 */

var _createDialogFunction = function (obj) {
    obj.show = function () {
        var runningScene = cc.director.getRunningScene();
        if(runningScene.popupLayer){
            var parentNode = runningScene.popupLayer;
        }
        else{
            var parentNode = runningScene;
        }
        parentNode.addChild(obj);
    };

    obj.hide = function () {
        obj.removeFromParent(true);
    }
};

var LoginDialog = Dialog.extend({
    ctor : function () {
        this._super();
        var thiz = this;

        this.okButton.visible = false;
        this.cancelButton.visible = false;
        this.title.setString("ĐĂNG NHẬP");
        this.initWithSize(cc.size(478, 448));

        /* login text field */
        var userNameBg = new ccui.Scale9Sprite("dialog-textinput-bg.png", cc.rect(10,10,4,4));
        userNameBg.setPreferredSize(cc.size(280, 44));
        userNameBg.setPosition(cc.p(this.getContentSize().width/2, 421));
        this.addChild(userNameBg);

        var passwordBg = new ccui.Scale9Sprite("dialog-textinput-bg.png", cc.rect(10,10,4,4));
        passwordBg.setPreferredSize(cc.size(280, 44));
        passwordBg.setPosition(cc.p(this.getContentSize().width/2, 351));
        this.addChild(passwordBg);

        this.userText = new newui.TextField(cc.size(270, 44), cc.res.font.Roboto_Condensed_18);
        this.userText.setPlaceHolder("Tài khoản");
        this.userText.setTextColor(cc.color("#c4e1ff"));
        this.userText.setPlaceHolderColor(cc.color("#909090"));
        this.userText.setMaxLength(32);
        this.userText.setPosition(userNameBg.getPosition());
        this.userText.setReturnCallback(function () {
            thiz.onLoginButonHandler();
            return false;
        });
        this.addChild(this.userText,1);

        this.passwordText = new newui.TextField(cc.size(270, 44), cc.res.font.Roboto_Condensed_18);
        this.passwordText.setPasswordEnable(true);
        this.passwordText.setPlaceHolder("Mật khẩu");
        this.passwordText.setTextColor(cc.color("#c4e1ff"));
        this.passwordText.setPlaceHolderColor(cc.color("#909090"));
        this.passwordText.setMaxLength(30);
        this.passwordText.setPosition(passwordBg.getPosition());
        this.passwordText.setReturnCallback(function () {
            thiz.onLoginButonHandler();
            return false;
        });
        this.addChild(this.passwordText,1);

        this.userText.nextTextField = this.passwordText;
        this.passwordText.nextTextField = this.userText;

        this.userText.setText(cc.Global.getSaveUsername());
        this.passwordText.setText(cc.Global.getSavePassword());

        var label1 = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "Lưu mật khẩu");
        label1.setAnchorPoint(1.0, 0.5);
        label1.setColor(cc.color("#4a8ed3"));
        label1.setPosition(this.getContentSize().width/2 - 15, 272);
        this.addChild(label1,1);

        this.checkBox = new ccui.CheckBox();
        this.checkBox.loadTextureBackGround("dialog-checkBox.png", ccui.Widget.PLIST_TEXTURE);
        this.checkBox.loadTextureFrontCross("dialog-checkBoxCross.png", ccui.Widget.PLIST_TEXTURE);
        this.checkBox.setPosition(label1.x - label1.getContentSize().width - 30 , label1.y);
        this.addChild( this.checkBox);
        this.checkBox.setSelected(cc.Global.GetSetting("savePassword", true));
        this.checkBox.addEventListener(function (target,event) {
            cc.Global.SetSetting("savePassword", event == ccui.CheckBox.EVENT_SELECTED);
        });

        var resetPassword = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "Quên mật khẩu?");
        resetPassword.setAnchorPoint(0.0, 0.5);
        resetPassword.setColor(cc.color("#4a8ed3"));
        resetPassword.setPosition(this.getContentSize().width/2 + 15, label1.y);
        this.addChild(resetPassword,1);

        var resetPasswordBt = new ccui.Widget();
        resetPasswordBt.setContentSize(resetPassword.getContentSize());
        resetPasswordBt.setPosition(resetPassword.x + resetPassword.getContentSize().width/2, resetPassword.y);
        resetPasswordBt.setTouchEnabled(true);
        this.addChild(resetPasswordBt);

        var loginBt = s_Dialog_Create_Button1(cc.size(284, 44), "ĐĂNG NHẬP");
        loginBt.setPosition(this.getContentSize().width/2, 204);
        loginBt.setZoomScale(0.02);
        this.addChild(loginBt);

        var regLabel = new cc.LabelBMFont("ĐĂNG KÝ", cc.res.font.Roboto_Condensed_18);
        regLabel.setColor(cc.color("#4c6080"));
        regLabel.setPosition(this.getContentSize().width/2, 134.0);
        this.addChild(regLabel, 1);

        var regButton = new ccui.Widget();
        regButton.setContentSize(regLabel.getContentSize());
        regButton.setPosition(regLabel.getPosition());
        regButton.setTouchEnabled(true);
        this.addChild(regButton);

        loginBt.addClickEventListener(function () {
           thiz.onLoginButonHandler();
        });

        regButton.addClickEventListener(function () {
            SceneNavigator.showSignup();
            thiz.hide();
        });
        resetPasswordBt.addClickEventListener(function () {
            var dialog = new ContactDialog();
            dialog.setTitle("Quên mật khẩu");
            dialog.show();
            thiz.hide();
        });
    },

    onLoginButonHandler : function () {
        var username = this.userText.getText();
        var password = this.passwordText.getText();
        if(!username && username.length == 0){
            MessageNode.getInstance().show("Bạn phải nhập tên tài khoản");
            return;
        }
        if(!password && password.length == 0){
            MessageNode.getInstance().show("Bạn phải nhập mật khẩu");
            return;
        }
        LoadingDialog.getInstance().show("Đang đăng nhập");
        LobbyClient.getInstance().loginNormal(username, password, this.checkBox.isSelected());
    }
});

var s_signup_title = "Không bắt buộc nhập số điện thoại.\nDùng để xác thực tài khoản khi cần hỗ trợ trong game";

var SignupDialog = Dialog.extend({
    ctor : function () {
        this._super();
        this.okButton.visible = false;
        this.cancelButton.visible = false;
        this.title.setString("ĐĂNG KÝ");
        this.initWithSize(cc.size(478, 587));
        var thiz = this;

        var titleLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, s_signup_title, cc.TEXT_ALIGNMENT_CENTER);
        titleLabel.setPosition(this.getContentSize().width/2, 560);
        titleLabel.setColor(cc.color("#4d5f7b"));
        this.addChild(titleLabel, 2);

        /* login text field */
        var userNameBg = new ccui.Scale9Sprite("dialog-textinput-bg.png", cc.rect(10,10,4,4));
        userNameBg.setPreferredSize(cc.size(280, 44));
        userNameBg.setPosition(cc.p(this.getContentSize().width/2, 495));
        this.addChild(userNameBg);

        var passwordBg = new ccui.Scale9Sprite("dialog-textinput-bg.png", cc.rect(10,10,4,4));
        passwordBg.setPreferredSize(cc.size(280, 44));
        passwordBg.setPosition(cc.p(this.getContentSize().width/2, 425));
        this.addChild(passwordBg);

        var phoneBg = new ccui.Scale9Sprite("dialog-textinput-bg.png", cc.rect(10,10,4,4));
        phoneBg.setPreferredSize(cc.size(280, 44));
        phoneBg.setPosition(cc.p(this.getContentSize().width/2, 355));
        this.addChild(phoneBg);

        this.userText = new newui.TextField(cc.size(270, 44), cc.res.font.Roboto_Condensed_18);
        this.userText.setPlaceHolder("Tài khoản");
        this.userText.setTextColor(cc.color("#c4e1ff"));
        this.userText.setPlaceHolderColor(cc.color("#909090"));
        this.userText.setMaxLength(32);
        this.userText.setPosition(userNameBg.getPosition());
        this.addChild(this.userText,1);

        this.passwordText = new newui.TextField(cc.size(270, 44), cc.res.font.Roboto_Condensed_18);
        this.passwordText.setPasswordEnable(true);
        this.passwordText.setPlaceHolder("Mật khẩu");
        this.passwordText.setTextColor(cc.color("#c4e1ff"));
        this.passwordText.setPlaceHolderColor(cc.color("#909090"));
        this.passwordText.setMaxLength(30);
        this.passwordText.setPosition(passwordBg.getPosition());
        this.addChild(this.passwordText,1);

        this.phoneText = new newui.TextField(cc.size(270, 44), cc.res.font.Roboto_Condensed_18);
        this.phoneText.setPlaceHolder("Số điện thoại");
        this.phoneText.setTextColor(cc.color("#c4e1ff"));
        this.phoneText.setPlaceHolderColor(cc.color("#909090"));
        this.phoneText.setMaxLength(30);
        this.phoneText.setPosition(phoneBg.getPosition());
        this.addChild(this.phoneText,1);

        this.userText.nextTextField = this.passwordText;
        this.passwordText.nextTextField = this.phoneText;
        this.phoneText.nextTextField = this.userText;

        var signupBt = s_Dialog_Create_Button1(cc.size(284, 44), "ĐĂNG KÝ");
        signupBt.setPosition(this.getContentSize().width/2, 210.0);
        this.addChild(signupBt);

        var toggleIcon1 = new cc.Sprite("#dialog-checkBox-2.png");
        toggleIcon1.setPosition(this.getContentSize().width/2 - 120, 280);
        this.addChild(toggleIcon1);
        var toggleLabel1 = new cc.LabelBMFont("Nam", cc.res.font.Roboto_Condensed_18);
        toggleLabel1.setAnchorPoint(cc.p(0.0, 0.5));
        toggleLabel1.setColor(cc.color("#72acd6"));
        toggleLabel1.setPosition(toggleIcon1.x + 30, toggleIcon1.y);
        this.addChild(toggleLabel1,1);

        var toggleIcon2 = new cc.Sprite("#dialog-checkBox-2.png");
        toggleIcon2.setPosition(this.getContentSize().width/2 + 30, toggleIcon1.y);
        this.addChild(toggleIcon2);
        var toggleLabel2 = new cc.LabelBMFont("Nữ", cc.res.font.Roboto_Condensed_18);
        toggleLabel2.setAnchorPoint(cc.p(0.0, 0.5));
        toggleLabel2.setColor(cc.color("#72acd6"));
        toggleLabel2.setPosition(toggleIcon2.x + 30, toggleIcon2.y);
        this.addChild(toggleLabel2,1);

        var toggleSelected = new cc.Sprite("#dialog-checkBoxCross-2.png");
        toggleSelected.setPosition(toggleIcon1.getPosition());
        this.addChild(toggleSelected);

        var toggleIcon = [toggleIcon1, toggleIcon2];
        var genderToggle = new ToggleNodeGroup();
        this.genderToggle = genderToggle;
        this.addChild(genderToggle);
        for(var i=0;i<toggleIcon.length;i++){
            (function () {
                var itemIdx = i;

                var toggleItem = new ToggleNodeItem(toggleIcon[i].getContentSize());
                toggleItem.setPosition(toggleIcon[i].getPosition());
                toggleItem.onSelect = function () {
                    toggleSelected.setPosition(toggleItem.getPosition());
                    thiz._male = (itemIdx == 0) ? true : false;
                };
                genderToggle.addItem(toggleItem);
            })();
        }

        signupBt.addClickEventListener(function () {
            var username = thiz.userText.getText();
            var password = thiz.passwordText.getText();
            if(!username && username.length == 0){
                MessageNode.getInstance().show("Bạn phải nhập tên tài khoản");
                return;
            }
            if(!password && password.length == 0){
                MessageNode.getInstance().show("Bạn phải nhập mật khẩu");
                return;
            }
            var phoneNumber = thiz.phoneText.getText();
            LoadingDialog.getInstance().show("Đang đăng ký");
            LobbyClient.getInstance().signup(username, password, phoneNumber, thiz._male);
        });


        var loginLabel = new cc.LabelBMFont("ĐĂNG NHẬP", cc.res.font.Roboto_Condensed_18);
        loginLabel.setColor(cc.color("#4c6080"));
        loginLabel.setPosition(this.getContentSize().width/2, 140.0);
        this.addChild(loginLabel, 1);

        var loginBt = new ccui.Widget();
        loginBt.setContentSize(loginLabel.getContentSize());
        loginBt.setPosition(loginLabel.getPosition());
        loginBt.setTouchEnabled(true);
        this.addChild(loginBt);
        loginBt.addClickEventListener(function () {
            SceneNavigator.showLoginNormal();
            thiz.hide();
        });
    },

    onEnter : function () {
        this._super();
        this.genderToggle.selectItem(0);
    }
});

var HomeLayer = cc.Node.extend({
    ctor : function () {
        this._super();
        this.setScale(cc.winSize.screenScale);

        var barBg = new cc.Sprite("#bot_bar_bg.png");
        barBg.setAnchorPoint(cc.p(0,0));
        barBg.setPosition(cc.p(0,0));
        this.addChild(barBg);

        var barBg1 = new cc.Sprite("#login_bar_bg_1.png");
        barBg1.setAnchorPoint(cc.p(0,0));
        barBg1.setPosition(cc.p(0,0));
        this.addChild(barBg1);

        var barBg2 = new cc.Sprite("#login_bar_bg_2.png");
        barBg2.setAnchorPoint(cc.p(0,0));
        barBg2.setPosition(cc.p(0,0));
        this.addChild(barBg2);

        var logoBg = new cc.Sprite("#bot_bar_logo_bg.png");
        logoBg.setAnchorPoint(cc.p(0,0));
        logoBg.setPosition(cc.p(0,0));
        this.addChild(logoBg);

        var logo = new cc.Sprite("#bot_bar_logo.png");
        logo.setPosition(640, 98);
        this.addChild(logo);

        var fbButton = new ccui.Button("home-bg-bt.png","","", ccui.Widget.PLIST_TEXTURE);
        fbButton.setPosition(cc.p(640.0, 30));
        fbButton.setScale(cc.winSize.screenScale);
        this.addChild(fbButton);

        var loginBt = new ccui.Button("home-signin.png","","", ccui.Widget.PLIST_TEXTURE);
        loginBt.setPosition(cc.p(1155, 46));
        this.addChild(loginBt);

        var signupBt = new ccui.Button("home-signup.png","","", ccui.Widget.PLIST_TEXTURE);
        signupBt.setPosition(cc.p(122,48));
        this.addChild(signupBt);

        this.fbButton = fbButton;
        this.loginBt = loginBt;
        this.signupBt = signupBt;

        loginBt.addClickEventListener(function () {
            SceneNavigator.showLoginNormal();
        });

        signupBt.addClickEventListener(function () {
            SceneNavigator.showSignup();
        });
    }
});