/**
 * Created by QuyetNguyen on 11/30/2016.
 */


var RewardBankDialog = Dialog.extend({
    ctor : function () {
        this._super();

        this.initWithSize(cc.size(600,680));
        this.title.setString("Nhận thưởng");
        this.closeButton.visible = false;
        this.okTitle.setString("Nhận thưởng");
        this.cancelTitle.setString("Hủy");

        var textBgCapInsets = cc.rect(10,10,4,4);
        var textBgSize = cc.size(420, 60);
        var dy = 85.0;

        var bg1 = new ccui.Scale9Sprite("lobby-text-input.png",textBgCapInsets);
        bg1 .setPreferredSize(textBgSize);
        bg1.setPosition(this.getContentSize().width/2, this.getContentSize().height/2 + 120);
        this.addChild(bg1);

        var bg2 = new ccui.Scale9Sprite("lobby-text-input.png",textBgCapInsets);
        bg2 .setPreferredSize(textBgSize);
        bg2.setPosition(bg1.x, bg1.y - dy);
        this.addChild(bg2);

        var bg3 = new ccui.Scale9Sprite("lobby-text-input.png",textBgCapInsets);
        bg3 .setPreferredSize(textBgSize);
        bg3.setPosition(bg1.x, bg2.y - dy);
        this.addChild(bg3);

        var bg4 = new ccui.Scale9Sprite("lobby-text-input.png",textBgCapInsets);
        bg4 .setPreferredSize(textBgSize);
        bg4.setPosition(bg1.x, bg3.y - dy);
        this.addChild(bg4);

        var checkBox = new ccui.CheckBox("dialog-checkBox.png", "dialog-checkBox.png", "dialog-checkBoxCross.png", "dialog-checkBox.png", "dialog-checkBox.png", ccui.Widget.PLIST_TEXTURE);
        checkBox.setPosition(bg4.x - 176, bg4.y - 74);
        checkBox.setSelected(true);
        this.addChild(checkBox);

        var checkBoxLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Lưu thông tin");
        checkBoxLabel.setAnchorPoint(cc.p(0.0, 0.5));
        checkBoxLabel.setColor(cc.color("#4a8ed3"));
        checkBoxLabel.setPosition(checkBox.x + 30, checkBox.y);
        this.addChild(checkBoxLabel, 1);

        var listLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Tài khoản đã lưu");
        listLabel.setColor(cc.color("#4a8ed3"));
        listLabel.setPosition(bg4.x +104, checkBoxLabel.y);
        this.addChild(listLabel, 1);

        var listButton = new ccui.Widget();
        listButton.setContentSize(listLabel.getContentSize());
        listButton.setPosition(listLabel.getPosition());
        listButton.setTouchEnabled(true);
        this.addChild(listButton);


        var content = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Nội dung đổi thưởng", cc.TEXT_ALIGNMENT_CENTER, this.getContentSize().width);
        content.setColor(cc.color("#ffffff"));
        content.setPosition(bg1.x, bg1.y + 85);
        this.addChild(content, 1);

        var textInput1 = new newui.TextField(cc.size(bg1.getContentSize().width - 30, bg1.getContentSize().height - 10), cc.res.font.Roboto_Condensed_25);
        textInput1.setPlaceHolder("Tên tài khoản");
        textInput1.setTextColor(cc.color(255,255,255));
        textInput1.setPlaceHolderColor(cc.color(144, 144, 144));
        textInput1.setPosition(bg1.getPosition());
        this.addChild(textInput1, 2);

        var textInput2 = new newui.TextField(textInput1.getContentSize(), cc.res.font.Roboto_Condensed_25);
        textInput2.setPlaceHolder("Số tài khoản");
        textInput2.setTextColor(cc.color(255,255,255));
        textInput2.setPlaceHolderColor(cc.color(144, 144, 144));
        textInput2.setPosition(bg2.getPosition());
        this.addChild(textInput2, 2);

        var textInput3 = new newui.TextField(textInput1.getContentSize(), cc.res.font.Roboto_Condensed_25);
        textInput3.setPlaceHolder("Ngân hàng");
        textInput3.setTextColor(cc.color(255,255,255));
        textInput3.setPlaceHolderColor(cc.color(144, 144, 144));
        textInput3.setPosition(bg3.getPosition());
        this.addChild(textInput3, 2);

        var textInput4 = new newui.TextField(textInput1.getContentSize(), cc.res.font.Roboto_Condensed_25);
        textInput4.setPlaceHolder("Chi nhánh");
        textInput4.setTextColor(cc.color(255,255,255));
        textInput4.setPlaceHolderColor(cc.color(144, 144, 144));
        textInput4.setPosition(bg4.getPosition());
        this.addChild(textInput4, 2);

        textInput1.nextTextField = textInput2;
        textInput2.nextTextField = textInput3;
        textInput3.nextTextField = textInput4;
        textInput4.nextTextField = textInput1;

        this.tenTaiKhoan = textInput1;
        this.soTaiKhoan = textInput2;
        this.nganHang = textInput3;
        this.chiNhanh = textInput4;
        this.contentLabel = content;
        this.saveInfo = checkBox;

        var thiz = this;
        listButton.addClickEventListener(function () {
            var dialog = new RewardBankList();
            dialog._target = thiz;
            dialog.show();
        });
    },

    cancelButtonHandler : function () {
        this.hide();
    },

    okButtonHandler : function () {
        this.hide();
    },

    setInfo : function (cashOut, gold) {
        var text = "Bạn đang đổi thưởng "+cc.Global.NumberFormat1(gold) + "V thành "+cc.Global.NumberFormat1(cashOut) +"VNĐ\n Vui lòng nhập thông tin tài khoản ngân hàng";
        this.contentLabel.setString(text);
    }
});

var RewardBankList = Dialog.extend({
    ctor : function () {
        this._super();

        this.initWithSize(cc.size(600,500));
        this.title.setString("Tài khoản");
        this.okButton.visible = false;
        this.cancelButton.visible = false;

        var top = this.getContentSize().height - 178;
        var bottom = 100;
        var left = 100;
        var right = this.getContentSize().width - 100;

        var itemList = new newui.TableView(cc.size(right - left, top - bottom), 1);
        itemList.setDirection(ccui.ScrollView.DIR_VERTICAL);
        itemList.setScrollBarEnabled(false);
        itemList.setPadding(20);
        itemList.setMargin(20, 20, 0, 0);
        itemList.setPosition(cc.p(left, bottom));
        this.addChild(itemList, 1);
        this.itemList = itemList;

        // for(var i=0;i<10;i++){
        //     this.addItem("name" + i, "12345678" + i, "ngan hang" + i, "chi nhanh" + i);
        // }
    },

    onEnter : function () {
        this._super();
        //request item

    },
    
    addItem : function (tenTK, soTK, nganHang, chiNhanh) {
        var bg = new cc.Sprite("#account_cell_bg.png");
        var container = new ccui.Widget();
        container.setContentSize(bg.getContentSize());
        bg.setPosition(container.getContentSize().width/2, container.getContentSize().height/2);
        container.addChild(bg);
        this.itemList.pushItem(container);

        var l_nganHang = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, nganHang);
        l_nganHang.setAnchorPoint(cc.p(0.0, 0.5));
        l_nganHang.setColor(cc.color("#30beec"));
        l_nganHang.setPosition(60, 55);
        container.addChild(l_nganHang);

        var l_chiNhanh = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, chiNhanh);
        l_chiNhanh.setAnchorPoint(cc.p(0.0, 0.5));
        l_chiNhanh.setColor(cc.color("#9bacc7"));
        l_chiNhanh.setPosition(l_nganHang.x, 20);
        container.addChild(l_chiNhanh);

        var l_tenTK = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, tenTK);
        l_tenTK.setAnchorPoint(cc.p(0.0, 0.5));
        l_tenTK.setColor(cc.color("#9bacc7"));
        l_tenTK.setPosition(268, l_nganHang.y);
        container.addChild(l_tenTK);

        var l_soTK = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, soTK);
        l_soTK.setAnchorPoint(cc.p(0.0, 0.5));
        l_soTK.setColor(cc.color("#9bacc7"));
        l_soTK.setPosition(l_tenTK.x, l_chiNhanh.y);
        container.addChild(l_soTK);

        var thiz = this;
        container.setTouchEnabled(true);
        container.addClickEventListener(function () {
            if(thiz._target){
                thiz._target.tenTaiKhoan.setText(tenTK);
                thiz._target.soTaiKhoan.setText(soTK);
                thiz._target.nganHang.setText(nganHang);
                thiz._target.chiNhanh.setText(chiNhanh);
            }
            thiz.hide();
        });
    }
});
