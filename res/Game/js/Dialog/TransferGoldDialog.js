/**
 * Created by Quyet Nguyen on 4/5/2017.
 */

var s_transferGoldToggle = s_transferGoldToggle || ["Người gửi chịu phí", "Người nhận chịu phí"];

var TransferGoldTutorial = MessageDialog.extend({
    setMessage : function (message) {
        this.scrollView.removeAllItems();
        var messageLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, message, cc.TEXT_ALIGNMENT_LEFT, this.scrollView.getContentSize().width - 10);

        var height = messageLabel.getContentSize().height + 20.0;
        if(height <= this.scrollView.getContentSize().height){
            height = this.scrollView.getContentSize().height;
            this.scrollView.setEnabled(false);
        }
        else{
            this.scrollView.setEnabled(true);
            this.scrollHeight = height - this.scrollView.getContentSize().height;
            this.startAutoScroll(4.0);
        }

        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.scrollView.getContentSize().width - 10, height));
        container.addChild(messageLabel);
        messageLabel.setPosition(container.getContentSize().width/2, container.getContentSize().height/2);
        this.scrollView.pushBackCustomItem(container);
    },
});

var TransferGoldDialog = Dialog.extend({
    ctor : function () {
        this._super();
        this.okButton.visible = false;
        this.cancelButton.visible = false;
        this.title.setString("Chuyển vàng");
        this.initWithSize(cc.size(578,518));
        this._initView();
    },

    _initView : function () {
        var thiz = this;

        var bg1 = new ccui.Scale9Sprite("dialog-textinput-bg.png", cc.rect(10,10,4,4));
        bg1.setPreferredSize(cc.size(280, 44));
        bg1.setPosition(this.getContentSize().width/2, 489);
        this.addChild(bg1);

        var bg2 = new ccui.Scale9Sprite("dialog-textinput-bg.png", cc.rect(10,10,4,4));
        bg2.setPreferredSize(cc.size(280, 44));
        bg2.setPosition(this.getContentSize().width/2, 419);
        this.addChild(bg2);

        var recvUser = new newui.TextField(cc.size(262,44), cc.res.font.Roboto_Condensed_18);
        recvUser.setPlaceHolder("Người nhận");
        recvUser.setPlaceHolderColor(cc.color("#787878"));
        recvUser.setTextColor(cc.color("#c4e1ff"));
        recvUser.setPosition(bg1.getPosition());
        this.addChild(recvUser, 1);
        this.recvUser = recvUser;

        var goldTransfer = new newui.TextField(cc.size(262,44), cc.res.font.Roboto_Condensed_18);
        goldTransfer.setPlaceHolder("Số tiền chuyển");
        goldTransfer.setPlaceHolderColor(cc.color("#787878"));
        goldTransfer.setTextColor(cc.color("#fede01"));
        goldTransfer.setPosition(bg2.getPosition());
       // goldTransfer.setMaxLength(15);
        this.addChild(goldTransfer, 1);
        this.goldTransfer = goldTransfer;

        var userCorrectIcon = new cc.Sprite("#dialog_correct.png");
        userCorrectIcon.setPosition(recvUser.x + 120, recvUser.y);
        this.addChild(userCorrectIcon);
        userCorrectIcon.visible = false;
        this.userCorrectIcon = userCorrectIcon;

        var goldCorrectIcon = new cc.Sprite("#dialog_correct.png");
        goldCorrectIcon.setPosition(goldTransfer.x + 120, goldTransfer.y);
        this.addChild(goldCorrectIcon);
        goldCorrectIcon.visible = false;
        this.goldCorrectIcon = goldCorrectIcon;

        var label1 = new ccui.RichText();
        label1.pushBackElement(new ccui.RichElementText(0, cc.color("#ffffff"), 255, "Còn lại ", cc.res.font.Roboto_Condensed, 18));
        label1.pushBackElement(new ccui.RichElementText(1, cc.color("#ffde00"), 255, "100,000 V", cc.res.font.Roboto_CondensedBold, 18));
        label1.setPosition(cc.p(bg1.x, 360));
        this.addChild(label1, 1);
        this.label1 = label1;

        var label2 = new ccui.RichText();
        label2.pushBackElement(new ccui.RichElementText(0, cc.color("#77cbee"), 255, "Name ", cc.res.font.Roboto_CondensedBold, 18));
        label2.pushBackElement(new ccui.RichElementText(1, cc.color("#ffffff"), 255, "Nhận ", cc.res.font.Roboto_Condensed, 18));
        label2.pushBackElement(new ccui.RichElementText(2, cc.color("#ffde00"), 255, "100,000 V", cc.res.font.Roboto_CondensedBold, 18));
        label2.setPosition(cc.p(bg1.x, 330));
        this.addChild(label2, 1);
        this.label2 = label2;

        var  mToggle = new ToggleNodeGroup();
        this.addChild(mToggle);
        this.mToggle = mToggle;
        for(var i=0;i<s_transferGoldToggle.length;i++){
            (function () {
                var icon1 = new cc.Sprite("#dialog_toggle_1.png");
                icon1.setPosition(219 + 188 * i, 291);
                thiz.addChild(icon1);

                var icon2 = new cc.Sprite("#dialog_toggle_2.png");
                icon2.setPosition(icon1.getPosition());
                thiz.addChild(icon2);

                var label = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, s_transferGoldToggle[i]);
                label.setColor(cc.color("#72acd6"));
                label.setAnchorPoint(cc.p(0.0, 0.5));
                label.setPosition(icon1.x + 17, icon1.y);
                thiz.addChild(label, 1);

                var toggleItem = new ToggleNodeItem(icon1.getContentSize());
                toggleItem.feeType = i + 1;
                toggleItem.setPosition(icon2.getPosition());
                mToggle.addItem(toggleItem);
                toggleItem.onSelect = function () {
                    icon2.visible = true;
                    thiz._updateGold();
                };

                toggleItem.onUnSelect = function () {
                    icon2.visible = false;
                };
            })();
        }

        var okButton = new ccui.Button("dialog-button-1.png","","",ccui.Widget.PLIST_TEXTURE);
        okButton.setScale9Enabled(true);
        okButton.setCapInsets(cc.rect(10,10,4,4));
        okButton.setContentSize(cc.size(280, 44));
        okButton.setZoomScale(0.01);
        okButton.setPosition(this.getContentSize().width/2, 209);
        this.addChild(okButton);
        okButton.addClickEventListener(function () {
            thiz._onOkButtonHandler();
        });

        var okLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "CHUYỂN VÀNG");
        okLabel.setColor(cc.color("#682e2e"));
        okLabel.setPosition(okButton.getContentSize().width/2, okButton.getContentSize().height/2);
        okButton.getRendererNormal().addChild(okLabel);

        var padding = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18,"|");
         padding.setColor(cc.color("#72acd6"));
        padding.setPosition(this.getContentSize().width/2, 132);
        this.addChild(padding,1);

        var historyLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18,"LỊCH SỬ");
        historyLabel.setColor(cc.color("#72acd6"));
        historyLabel.setPosition(this.getContentSize().width/2 - 10 - historyLabel.getContentSize().width/2, padding.y);
        this.addChild(historyLabel,1);

        var tutorialLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18,"HƯỚNG DẪN");
        tutorialLabel.setColor(cc.color("#72acd6"));
        tutorialLabel.setPosition(this.getContentSize().width/2 + 10 + tutorialLabel.getContentSize().width/2, padding.y);
        this.addChild(tutorialLabel,1);

        var historyBt = new WidgetButton(historyLabel.getContentSize());
        historyBt.setPosition(historyLabel.getPosition());
        this.addChild(historyBt);
        historyBt.addClickEventListener(function () {
            var dialog = new TransferGoldHistory();
            dialog.show();
        });

        var tutorialBt = new WidgetButton(tutorialLabel.getContentSize());
        tutorialBt.setPosition(tutorialLabel.getPosition());
        this.addChild(tutorialBt);
        tutorialBt.addClickEventListener(function () {
            var dialog = new TransferGoldTutorial();
            dialog.setTitle("Hướng dẫn chuyển vàng");
            dialog.setMessage(cc.Global.getStringRes()["TransferGold"]["Tutorial"]);
            dialog.show();
        });

        recvUser.setFocusListener(function (focus) {
            if(focus){
                userCorrectIcon.visible = false;
            }
            else{
                thiz._updateName();
            }
        });

        goldTransfer.setFocusListener(function (focus) {
            if(focus){
                goldCorrectIcon.visible = false;
            }
            else{
                thiz._updateGold();
            }
        });

        goldTransfer.setTextChangeListener(function (type, newString) {
            if(newString === ""){
                goldTransfer.setText(newString);
            }
            else{
                var str = newString.replace(/[.,]/g,'');
                if(cc.Global.IsNumber(str)){
                    var goldInput = parseInt(str);
                    if(goldInput > PlayerMe.gold) {
                        goldInput = PlayerMe.gold;
                    }
                    goldTransfer.setText(cc.Global.NumberFormat1(goldInput));
                }
            }
            thiz._updateGold();
            return true;
        });
    },

    onCheckUsername : function (cmd, data) {
        var status = data["status"];
        this.userCorrectIcon.setVisible(true);
        if(status === 0){
            this.userCorrectIcon.setSpriteFrame("dialog_correct.png");
        }
        else{
            this.userCorrectIcon.setSpriteFrame("dialog_incorrect.png");
        }
    },

    _updateName : function () {
        var userName = this.recvUser.getText();
        this.label2.removeElement(0);
        this.label2.insertElement(new ccui.RichElementText(0, cc.color("#77cbee"), 255, userName + " ", cc.res.font.Roboto_CondensedBold, 18), 0);

        if(userName != ""){
            var request = {
                command : "checkUserExist",
                username : userName
            };
            LobbyClient.getInstance().send(request);
        }
    },

    _updateGold : function () {
        var goldStr = this.goldTransfer.getText();

        if(this.mToggle.itemClicked.feeType === 1){
            var sendFeeRate = PlayerMe.transferGoldFee;
            var recvFeeRate = 0;
        }
        else{
            var sendFeeRate = 0;
            var recvFeeRate = PlayerMe.transferGoldFee;
        }

        var gold = 0;
        this.goldCorrectIcon.setSpriteFrame("dialog_incorrect.png");

        if(goldStr === ""){
            this.goldCorrectIcon.visible = false;
        }
        else{
            this.goldCorrectIcon.visible = true;
            var goldInput = cc.Global.NumberFromString(goldStr);
            if(!gold){
                gold = goldInput;
                this.goldCorrectIcon.setSpriteFrame("dialog_correct.png");
            }

        }

        var sendFee = Math.round(gold * sendFeeRate);
        var currentGold = PlayerMe.gold - gold - sendFee;
        gold -= Math.round(gold * recvFeeRate);

        if(currentGold < PlayerMe.transferGoldMinAsset){
            gold = 0;
        }
        else if(goldInput < PlayerMe.transferGoldMinValue){
            gold = 0;
        }

        if(gold === 0){
            this.goldCorrectIcon.setSpriteFrame("dialog_incorrect.png");
            currentGold = PlayerMe.gold;
        }

        this.label1.removeElement(1);
        this.label1.insertElement(new ccui.RichElementText(1, cc.color("#ffde00"), 255, cc.Global.NumberFormat1(currentGold) + " V", cc.res.font.Roboto_CondensedBold, 18),1);

        this.label2.removeElement(2);
        this.label2.insertElement(new ccui.RichElementText(2, cc.color("#ffde00"), 255, cc.Global.NumberFormat1(gold) + " V", cc.res.font.Roboto_CondensedBold, 18),2);
    },

    _onOkButtonHandler : function () {
        var recvName = this.recvUser.getText();
        if(recvName === ""){
            MessageNode.getInstance().show("Vui lòng nhập tên người nhận");
            return;
        }

        var goldStr = this.goldTransfer.getText();
        if(goldStr === ""){
            MessageNode.getInstance().show("Vui lòng nhập số tiền chuyển");
            return;
        }

        if(!cc.Global.IsNumber(goldStr)){
            MessageNode.getInstance().show("Số tiền nhập không đúng");
            return;
        }

        var request = {
            command : "transferGold",
            toUsername : recvName,
            value : cc.Global.NumberFromString(goldStr),
            feeOnSender : this.mToggle.itemClicked.feeType === 1
        };
        LobbyClient.getInstance().send(request);
    },

    onTransferGold : function (cmd, data) {
        var status = data["status"];
        if(status === 0){
            this.hide();
        }
    },

    onEnter : function () {
        this._super();
        LobbyClient.getInstance().addListener("checkUserExist", this.onCheckUsername, this);
        LobbyClient.getInstance().addListener("transferGold", this.onTransferGold, this);

        this.mToggle.selectItem(0);

        this._updateName();
        this._updateGold();
    },

    onExit : function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
    }
});