/**
 * Created by QuyetNguyen on 11/30/2016.
 */

var s_RewardAgencyDialog_Tab = ["MIỀN BẮC", "MIỀN TRUNG", "MIỀN NAM"];

var RewardAgencyDialog = Dialog.extend({
    ctor : function () {
        this._super();
        var thiz = this;
        this._initTutorial();

        this.initWithSize(cc.size(678,458));
        this.title.setString("Chuyển vàng");
        this.okButton.visible = false;
        this.cancelButton.visible = false;

        var bg1 = new ccui.Scale9Sprite("dialog-textinput-bg.png",cc.rect(10,10,4,4));
        bg1.setPreferredSize(cc.size(280, 44));
        bg1.setPosition(587, 426);
        this.addChild(bg1);

        var bg2 = new ccui.Scale9Sprite("dialog-textinput-bg.png",cc.rect(10,10,4,4));
        bg2.setPreferredSize(cc.size(280, 44));
        bg2.setPosition(bg1.x, 356);
        this.addChild(bg2);

        var bg3 = new ccui.Scale9Sprite("dialog-textinput-bg.png",cc.rect(10,10,4,4));
        bg3.setPreferredSize(cc.size(280, 44));
        bg3.setPosition(bg1.x, 286);
        this.addChild(bg3);

        var agencyCode = new newui.TextField(cc.size(bg1.getContentSize().width - 20, bg1.getContentSize().height), cc.res.font.Roboto_Condensed_18);
        agencyCode.setPlaceHolder("Mã đại lý");
        agencyCode.setTextColor(cc.color("#c4e1ff"));
        agencyCode.setPlaceHolderColor(cc.color("#909090"));
        agencyCode.setPosition(bg1.getPosition());
        this.agencyCode = agencyCode;
        this.addChild(agencyCode);

        var goldText = new newui.TextField(cc.size(bg2.getContentSize().width - 20, bg2.getContentSize().height), cc.res.font.Roboto_Condensed_18);
        goldText.setPlaceHolder("Số vàng chuyển");
        goldText.setTextColor(cc.color("#c4e1ff"));
        goldText.setPlaceHolderColor(cc.color("#909090"));
        goldText.setPosition(bg2.getPosition());
      //  goldText.setMaxLength(16);
        goldText.setTextChangeListener(function (type, newString) {
            if(newString === ""){
                goldText.setText(newString);
            }
            else{
                var str = newString.replace(/[.,]/g,'');
                if(cc.Global.IsNumber(str)){
                    goldText.setText(cc.Global.NumberFormat1(parseInt(str)));
                }
            }
            thiz._updateFeeLabel();
            return true;
        });
        this.goldText = goldText;
        this.addChild(goldText);

        var contentText = new newui.TextField(cc.size(bg3.getContentSize().width - 20, bg3.getContentSize().height), cc.res.font.Roboto_Condensed_18);
        contentText.setPlaceHolder("Nội dung");
        contentText.setTextColor(cc.color("#c4e1ff"));
        contentText.setPlaceHolderColor(cc.color("#909090"));
        contentText.setPosition(bg3.getPosition());
        this.contentText = contentText;
        this.addChild(contentText);

        var feeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "Phí chuyển vàng");
        feeLabel.setColor(cc.color("#4d5f7b"));
        feeLabel.setPosition(bg1.x, 224);
        this.addChild(feeLabel);
        this.feeLabel = feeLabel;

        var okButton = new ccui.Button("dialog-button-1.png", "", "", ccui.Widget.PLIST_TEXTURE);
        okButton.setScale9Enabled(true);
        okButton.setCapInsets(cc.rect(10,10,4,4));
        okButton.setContentSize(cc.size(280, 44));
        okButton.setPosition(bg1.x, 160);
        this.addChild(okButton);

        var okLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "HOÀN THÀNH");
        okLabel.setColor(cc.color("#682e2e"));
        okLabel.setPosition(okButton.getContentSize().width/2, okButton.getContentSize().height/2);
        okButton.getRendererNormal().addChild(okLabel);
        okButton.addClickEventListener(function () {
            thiz._okButtonHandler();
        });
    },

    _initTutorial : function () {
        var itemList = new newui.TableView(cc.size(313, 397), 1);
        itemList.setDirection(ccui.ScrollView.DIR_VERTICAL);
        itemList.setScrollBarEnabled(false);
        itemList.setMargin(10, 10, 0, 0);
        itemList.setPosition(cc.p(112, 98));
        this.addChild(itemList, 1);

        var tutLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, cc.Global.getStringRes()["TransferGold"]["MerchantTutorial"], cc.TEXT_ALIGNMENT_LEFT, 300);
        //var container =
        itemList.pushItem(tutLabel);
    },

    _updateFeeLabel : function () {
        this.feeLabel.visible = false;
        var goldInput = cc.Global.NumberFromString(this.goldText.getText());
        if(!goldInput){
            return;
        }

        var goldFee = Math.round(parseInt(goldInput) * PlayerMe.transferGoldMerchantFee);
        if(goldFee <= 0){
            return;
        }

        this.feeLabel.visible = true;
        this.feeLabel.setString("Phí chuyển vàng " + cc.Global.NumberFormat1(goldFee) + " V");
    },

    _okButtonHandler : function () {
        var agency = this.agencyCode.getText();
        if(agency === ""){
            MessageNode.getInstance().show("Vui lòng nhập mã đại lý");
            return;
        }

        var goldStr = this.goldText.getText();
        goldStr = goldStr.replace(/[.,]/g,'');

        if(goldStr === ""){
            MessageNode.getInstance().show("Vui lòng nhập số vàng cần chuyển");
            return;
        }

        var content = this.contentText.getText();
        // if(content === ""){
        //     MessageNode.getInstance().show("Vui lòng nhập nội dung chuyển");
        //     return;
        // }

        if(!cc.Global.IsNumber(goldStr)){
            MessageNode.getInstance().show("Số vàng nhập không đúng định dạng");
            return;
        }

        var request = {
            command : "transferToMerchant",
            merchantName : agency,
            description : content,
            value : parseInt(goldStr)
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
        LobbyClient.getInstance().addListener("transferGold", this.onTransferGold, this);
        this._updateFeeLabel();
    },

    onExit : function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
    },
    
    setDefaultAgency : function (agency) {
        this.agencyCode.setText(agency);
    }
});