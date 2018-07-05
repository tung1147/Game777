/**
 * Created by Quyet Nguyen on 7/11/2016.
 */

var s_card_type = s_card_type || {};
s_card_type.CARD_VIETTEL = 1;
s_card_type.CARD_VINA = 2;
s_card_type.CARD_MOBI = 3;

var RewardSublayer = cc.Node.extend({
    ctor: function () {
        this._super();

        var _top = 720.0 - (120.0 * cc.winSize.screenScale);
        var _bottom = 130.0 * cc.winSize.screenScale;

        var itemList = new newui.TableView(cc.size(cc.winSize.width, _top - _bottom), 4);
        itemList.setDirection(ccui.ScrollView.DIR_VERTICAL);
        itemList.setScrollBarEnabled(false);
        itemList.setPadding(60);
        itemList.setMargin(10, 40, 0, 0);
        itemList.setPosition(cc.p(0, _bottom));
        this.addChild(itemList, 1);
        this.itemList = itemList;
    },
    requestReward: function (id) {
       // var msg = {command: "cashout", id: id};
        //LobbyClient.getInstance().send(msg);
    },
});

var s_card_money = s_card_money || ["50k", "100k", "200k", "500k"];
var RewardCardLayer = RewardSublayer.extend({
    ctor: function () {
        this._super();
        if (cc.Global.thecaoData) {
            for (var i = 0; i < cc.Global.thecaoData.length; i++) {
                this.addCard(
                    cc.Global.thecaoData[i]["providerCode"],
                    cc.Global.thecaoData[i]["id"],
                    cc.Global.thecaoData[i]["netValue"],
                    cc.Global.thecaoData[i]["price"]
                )
            }
        }
    },

    addCard: function (cardType, cardId, netValue, gold) {
        var thiz = this;
        var goldLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, cc.Global.NumberFormat1(gold));
        var goldBgWidth = goldLabel.getContentSize().width + 60.0;
        if (goldBgWidth < 170.0) {
            goldBgWidth = 170.0;
        }
        var goldBg = new ccui.Scale9Sprite("reward-gold-bg.png", cc.rect(50, 0, 4, 44));
        goldBg.setPreferredSize(cc.size(goldBgWidth, 44));

        // var cardMoney = null;
        if (cardType === "VTT") {
            var cardImg = new cc.Sprite("#reward-card-viettel.png");
            var cardName = "Viettel";
            var labalColor = cc.color("#034d4e");
        }
        else if (cardType === "VNP") {
            var cardImg = new cc.Sprite("#reward-card-vina.png");
            var cardName = "Vina";
            var labalColor = cc.color("#004cbe");
        }
        else {
            var cardImg = new cc.Sprite("#reward-card-mobi.png");
            var cardName = "Mobi";
            var labalColor = cc.color("#0052a5");
        }

        var container = new ccui.Widget();
        container.setContentSize(cc.size(cardImg.getContentSize().width, cardImg.getContentSize().height + 60.0));
        this.itemList.pushItem(container);

        cardImg.setPosition(container.getContentSize().width / 2, container.getContentSize().height - cardImg.getContentSize().height / 2);
        container.addChild(cardImg);
        // cardMoney.setPosition(cardImg.getPosition());
        // container.addChild(cardMoney);

        goldBg.setPosition(cardImg.x, goldBg.getContentSize().height / 2);
        container.addChild(goldBg);

        var cardValue = new cc.LabelTTF(cc.Global.NumberFormat1(netValue) + " VNĐ", cc.res.font.Roboto_CondensedBold, 30);
        if(cc.sys.isNative){
            if(cc.sys.os === cc.sys.IOS || cc.sys.os === cc.sys.ANDROID){
                cardValue.enableStroke(labalColor, 5);
            }
        }
        else{
            cardValue.enableStroke(labalColor, 5);
        }

        cardValue.setAnchorPoint(cc.p(1.0, 0.5));
        cardValue.setPosition(cardImg.x + 90, 90);
        container.addChild(cardValue);

        goldLabel.setPosition(goldBg.x + 20.0, goldBg.y);
        goldLabel.setColor(cc.color("#ffde00"));
        container.addChild(goldLabel);
        container.setTouchEnabled(true);
        container.addClickEventListener(function () {
            var itemName = cardName + " " + cc.Global.NumberFormat2(netValue);
            var dialog = new RewardDialog();
            dialog.setCardInfo(itemName, gold);
            dialog.show();
            dialog.okButtonHandler = function () {
                var phone = dialog.phoneText.getText();
                if(thiz.requestReward(cardId, phone)){
                    dialog.hide();
                }
            };
        });
    },

    requestReward : function (productId, phoneNumber) {
        if(!phoneNumber || phoneNumber == ""){
            MessageNode.getInstance().show("Bạn phải nhập số điện thoại");
            return false;
        }

        var request = {
            command : "cashout",
            productId : productId,
            telephone : phoneNumber.toString()
        }

        LobbyClient.getInstance().send(request);
        return true;
    }
});

var RewardItemLayer = RewardSublayer.extend({
    ctor: function () {
        this._super();

        if (cc.Global.vatphamData) {
            for (var i = 0; i < cc.Global.vatphamData.length; i++) {
                this.addItem(
                    cc.Global.vatphamData[i]["id"],
                    cc.Global.vatphamData[i]["name"],
                    cc.Global.vatphamData[i]["netValue"] + " VND",
                    cc.Global.vatphamData[i]["price"],
                    cc.Global.vatphamData[i]["imageUrl"]
                );
            }
        }
    },

    addItem: function (itemId, itemName, itemMoney, gold, imgUrl) {
        var thiz = this;
        var goldLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, cc.Global.NumberFormat1(gold));
        var goldBgWidth = goldLabel.getContentSize().width + 60.0;
        if (goldBgWidth < 170.0) {
            goldBgWidth = 170.0;
        }
        var goldBg = new ccui.Scale9Sprite("reward-gold-bg.png", cc.rect(50, 0, 4, 44));
        goldBg.setPreferredSize(cc.size(goldBgWidth, 44));

        var itemBg = new ccui.Scale9Sprite("sublobby-cell-bg.png", cc.rect(10, 0, 4, 78));
        itemBg.setPreferredSize(cc.size(210, 276));
        var itemBgPadding = new cc.Sprite("#reward-item-bg-2.png");

       // var itemIcon = new cc.Sprite("#" + itemId + ".png");
        var itemIcon = new WebSprite(cc.size(itemBg.getContentSize().width, itemBg.getContentSize().width));
        itemIcon.loadDefault("#reward-item-default.png");
        itemIcon.reloadFromURL(imgUrl);

        var container = new ccui.Widget();
        container.setContentSize(cc.size(itemBg.getContentSize().width, itemBg.getContentSize().height + 60.0));
        this.itemList.pushItem(container);

        itemBg.setPosition(container.getContentSize().width / 2, container.getContentSize().height - itemBg.getContentSize().height / 2);
        container.addChild(itemBg);
        itemBgPadding.setPosition(itemBg.x, itemBg.y - 69);
        container.addChild(itemBgPadding);

        itemIcon.setPosition(itemBg.x, itemBg.y + 36);
        container.addChild(itemIcon);

        var itemNameLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, itemName,cc.TEXT_ALIGNMENT_CENTER, 180);
        //itemNameLabel.setDimensions(180,0);
     //   itemNameLabel.setAnchorPoint(cc.p(0.5,1.0));
        itemNameLabel.setPosition(itemBgPadding.x,itemBgPadding.y - 36);
        container.addChild(itemNameLabel);

        goldBg.setPosition(itemBg.x, goldBg.getContentSize().height / 2);
        container.addChild(goldBg);

        goldLabel.setPosition(itemBg.x + 20.0, goldBg.y);
        goldLabel.setColor(cc.color("#ffde00"));
        container.addChild(goldLabel);

        container.setTouchEnabled(true);
        container.addClickEventListener(function () {
            var dialog = new RewardDialog();
            dialog.setItemInfo(itemName, gold);
            dialog.show();
            dialog.okButtonHandler = function () {
                var phone = dialog.phoneText.getText();
                if(thiz.requestReward(itemId, phone)){
                    dialog.hide();
                }
            };
        });
    },
    requestReward : function (productId, phoneNumber) {
        if(!phoneNumber || phoneNumber == ""){
            MessageNode.getInstance().show("Bạn phải nhập số điện thoại");
            return false;
        }

        var request = {
            command : "cashout",
            productId : productId,
            telephone : phoneNumber.toString()
        }

        LobbyClient.getInstance().send(request);
        return true;
    }
});

var RewardBankLayer = RewardSublayer.extend({
    ctor: function () {
        this._super();
        if (cc.Global.tienmatData) {
            for (var i = 0; i < cc.Global.tienmatData.length; i++) {
                this.addItem(cc.Global.tienmatData[i]["id"],
                    cc.Global.tienmatData[i]["netValue"],
                    cc.Global.tienmatData[i]["price"]);
            }
        }
    },
    addItem: function (itemId, netValue, price) {
        var bg = new cc.Sprite("#payment-inapp-bg.png");
        var container = new ccui.Widget();
        container.setContentSize(bg.getContentSize());
        bg.setPosition(container.getContentSize().width / 2, container.getContentSize().height/2);
        container.addChild(bg);

        var goldIcon = 1;
        var icon = new cc.Sprite("#payment-inapp-icon-" + goldIcon + ".png");
        icon.setPosition(bg.getPosition());
        container.addChild(icon);

        var goldLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, cc.Global.NumberFormat1(netValue) + "V");
        goldLabel.setAnchorPoint(cc.p(0.0, 0.5));
        goldLabel.setPosition(100, 108);
        goldLabel.setColor(cc.color("#ffde00"));
        container.addChild(goldLabel);

        var priceLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, cc.Global.NumberFormat1(price) + " VNĐ");
        priceLabel.setAnchorPoint(cc.p(1.0, 0.5));
        priceLabel.setPosition(260,25);
        container.addChild(priceLabel, 1);
        container.setTouchEnabled(true);

        this.itemList.pushItem(container);

        var thiz = this;
        container.setTouchEnabled(true);
        container.addClickEventListener(function () {
            //thiz.onClickedItem(itemId);
            var dialog = new RewardBankDialog();
            dialog.setInfo(netValue, price);
            dialog.show();
        });
    }
});

var RewardAgencyLayer = cc.Node.extend({
    ctor: function () {
        this._super();
        this.setContentSize(cc.size(1280, 720));
        this.setAnchorPoint(cc.p(0.5,0.5));
        this.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        this.setScale(cc.winSize.screenScale);

        var agencyLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "Mã đại lý");
        agencyLabel.setColor(cc.color("#576eb0"));
        agencyLabel.setAnchorPoint(cc.p(0.0, 0.5));
        agencyLabel.setPosition(89, 576);
        this.addChild(agencyLabel);

        var nameLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "Tên");
        nameLabel.setColor(cc.color("#576eb0"));
        nameLabel.setAnchorPoint(cc.p(0.0, 0.5));
        nameLabel.setPosition(233, agencyLabel.y);
        this.addChild(nameLabel);

        var phoneLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "Điện thoại");
        phoneLabel.setColor(cc.color("#576eb0"));
        phoneLabel.setAnchorPoint(cc.p(0.0, 0.5));
        phoneLabel.setPosition(411, agencyLabel.y);
        this.addChild(phoneLabel);

        var addressLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "Địa chỉ");
        addressLabel.setColor(cc.color("#576eb0"));
        addressLabel.setAnchorPoint(cc.p(0.0, 0.5));
        addressLabel.setPosition(593, agencyLabel.y);
        this.addChild(addressLabel);

        var fbLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "Facebook");
        fbLabel.setColor(cc.color("#576eb0"));
        fbLabel.setAnchorPoint(cc.p(0.0, 0.5));
        fbLabel.setPosition(834, agencyLabel.y);
        this.addChild(fbLabel);

        var sendLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "Giao dịch");
        sendLabel.setColor(cc.color("#576eb0"));
        sendLabel.setAnchorPoint(cc.p(0.0, 0.5));
        sendLabel.setPosition(1027, agencyLabel.y);
        this.addChild(sendLabel);

        var itemList = new newui.TableView(cc.size(1280, 375), 1);
        itemList.setDirection(ccui.ScrollView.DIR_VERTICAL);
        itemList.setScrollBarEnabled(false);
        itemList.setPadding(5);
        itemList.setMargin(10, 10, 0, 0);
        itemList.setPosition(cc.p(0, 180));
        this.addChild(itemList, 1);
        this.itemList = itemList;

        // for(var i=0;i<30;i++){
        //     this.addItem("agency", "name", "phoneNumber", "address", "facebookLink");
        // }

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
            var dialog = new TransferGoldMerchantHistory();
            dialog.show();
        });

        var tutorialBt = new WidgetButton(tutorialLabel.getContentSize());
        tutorialBt.setPosition(tutorialLabel.getPosition());
        this.addChild(tutorialBt);
        tutorialBt.addClickEventListener(function () {
            var dialog = new TransferGoldTutorial();
            dialog.setTitle("Hướng dẫn chuyển vàng");
            dialog.setMessage(cc.Global.getStringRes()["TransferGold"]["MerchantTutorial"]);
            dialog.show();
        });
    },

    _createBg : function (size) {
        var itemBg = new ccui.Scale9Sprite("sublobby-cell-bg.png", cc.rect(10, 0, 4, 78));
        itemBg.setPreferredSize(size);
        itemBg.setAnchorPoint(cc.p(0.0, 0.5));
        return itemBg;
    },

    addItem: function (agency, name, phoneNumber, address, facebookLink) {
        var containerHeight = 58;

        var container = new ccui.Widget();
        container.setContentSize(this.itemList.getContentSize().width, containerHeight);
        this.itemList.pushItem(container);

        var bg1 = this._createBg(cc.size(146, containerHeight));
        bg1.setPosition(68, containerHeight/2);
        container.addChild(bg1);

        var bg2 = this._createBg(cc.size(176, containerHeight));
        bg2.setPosition(216, containerHeight/2);
        container.addChild(bg2);

        var bg3 = this._createBg(cc.size(178, containerHeight));
        bg3.setPosition(394, containerHeight/2);
        container.addChild(bg3);

        var bg4 = this._createBg(cc.size(239, containerHeight));
        bg4.setPosition(574, containerHeight/2);
        container.addChild(bg4);

        var bg5 = this._createBg(cc.size(192, containerHeight));
        bg5.setPosition(815, containerHeight/2);
        container.addChild(bg5);

        var bg6 = this._createBg(cc.size(203, containerHeight));
        bg6.setPosition(1009, containerHeight/2);
        container.addChild(bg6);

        var agencyLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, agency);
        agencyLabel.setAnchorPoint(cc.p(0.0, 0.5));
        agencyLabel.setPosition(89, bg1.y);
        container.addChild(agencyLabel);

        var nameLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, name);
        nameLabel.setAnchorPoint(cc.p(0.0, 0.5));
        nameLabel.setPosition(233, agencyLabel.y);
        container.addChild(nameLabel);

        var phoneLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, phoneNumber);
        phoneLabel.setAnchorPoint(cc.p(0.0, 0.5));
        phoneLabel.setPosition(411, agencyLabel.y);
        container.addChild(phoneLabel);

        var addressLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, address);
        addressLabel.setAnchorPoint(cc.p(0.0, 0.5));
        addressLabel.setPosition(593, agencyLabel.y);
        container.addChild(addressLabel);

        var fbLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, facebookLink);
        fbLabel.setAnchorPoint(cc.p(0.0, 0.5));
        fbLabel.setPosition(834, agencyLabel.y);
        container.addChild(fbLabel);

        var okButton = new ccui.Button("reward_transferGoldBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        okButton.setScale9Enabled(true);
        okButton.setCapInsets(cc.rect(10,10,4,4));
        okButton.setContentSize(cc.size(150,42));
        okButton.setAnchorPoint(cc.p(0.0, 0.5));
        okButton.setPosition(1027, agencyLabel.y);
        container.addChild(okButton);

        // var okLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "CHUYỂN VÀNG");
        // okLabel.setPosition(okButton.getContentSize().width/2, okButton.getContentSize().height/2);
        // okButton.getRendererNormal().addChild(okLabel);
        okButton.addClickEventListener(function () {
            var dialog = new RewardAgencyDialog();
            dialog.setDefaultAgency(agency);
            dialog.showWithAnimationScale();
        });
    },

    _onRecvListMerchant : function (cmd, data) {
        var items = data["data"]["merchants"];
        if(items.length > 0){
            for(var i=0;i<items.length;i++){
                this.addItem(
                    items[i]["username"],
                    items[i]["fullname"],
                    items[i]["telephone"],
                    items[i]["address"],
                    items[i]["facebookUrl"]);
            }
        }
    },

    onEnter: function () {
        this._super();
        LobbyClient.getInstance().addListener("fetchListMerchant", this._onRecvListMerchant, this);
    },

    onExit : function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
    },

    setVisible: function (visible) {
        this._super(visible);
        if(visible){
            this.itemList.removeAllItems();
            var request  = {
                command : "fetchListMerchant"
            };
            LobbyClient.getInstance().send(request);
        }
    }
});

var RewardHistoryLayer = RewardSublayer.extend({
    ctor: function () {
        this._super();

        var margin = 60.0 * cc.winSize.screenScale;
        var padding = 2.0;
        this.width1 = 200.0 * cc.winSize.screenScale;
        this.width2 = 230.0 * cc.winSize.screenScale;
        this.width4 = 210.0 * cc.winSize.screenScale;
        this.width3 = cc.winSize.width - this.width1 - this.width2 - this.width4 - margin * 2 - padding * 3;
        this.x1 = margin + this.width1 / 2;
        this.x2 = this.x1 + this.width1 / 2 + this.width2 / 2 + padding;
        this.x3 = this.x2 + this.width2 / 2 + this.width3 / 2 + padding;
        this.x4 = this.x3 + this.width3 / 2 + this.width4 / 2 + padding;

        var timeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "THỜI GIAN");
        timeLabel.setColor(cc.color("#576eb0"));
        timeLabel.setPosition(this.x1, 576);
        this.addChild(timeLabel, 1);

        var typeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "LOẠI");
        typeLabel.setColor(cc.color("#576eb0"));
        typeLabel.setPosition(this.x2, 576);
        this.addChild(typeLabel, 1);

        var infoLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "THÔNG TIN");
        infoLabel.setColor(cc.color("#576eb0"));
        infoLabel.setPosition(this.x3, 576);
        this.addChild(infoLabel, 1);

        var statusLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "TRẠNG THÁI");
        statusLabel.setColor(cc.color("#576eb0"));
        statusLabel.setPosition(this.x4, 576);
        this.addChild(statusLabel, 1);

        var _top = 554.0;
        var _bottom = 126.0;
        var itemList = new newui.TableView(cc.size(cc.winSize.width, _top - _bottom), 1);
        itemList.setDirection(ccui.ScrollView.DIR_VERTICAL);
        itemList.setScrollBarEnabled(false);
        itemList.setPadding(10);
        itemList.setMargin(10, 10, 0, 0);
        itemList.setPosition(cc.p(0, _bottom));
        this.addChild(itemList, 1);
        this.itemList = itemList;

        // for(var i =0;i<20;i++){
        //     this.addItem("10:54:35\n24/10/2016", "Tín dụng 1200K", "Seri thẻ: 009129197386\nMã thẻ: 091979617362", 1);
        // }
        LobbyClient.getInstance().addListener("fetchOrderedItems", this.onRecvHistory, this);
    },
    onExit: function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
    },
    setVisible: function (visible) {
        this._super(visible);
        if (visible) {
            //request
            this.itemList.removeAllItems();
            var request = {
                command: "fetchOrderedItems"
            };
            LobbyClient.getInstance().send(request);
        }
    },
    onRecvHistory: function (cmd, data) {
        this.itemList.removeAllItems();
        var itemList = data.data;
        for (var i = 0; i < itemList.length; i++) {
            this.addItem(itemList[i].createdTime, itemList[i].productName, itemList[i].resultContent, itemList[i].status);
        }
    },
    addItem: function (time, type, info, status) {
        var d = new Date(time);
        var timeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, cc.Global.DateToString(d), cc.TEXT_ALIGNMENT_CENTER, this.width1);
        var typeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, type);
        var infoLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, info);
        var statusLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "Thành công");
        var height = 60.0;
        if (timeLabel.getContentSize().height > height) {
            height = timeLabel.getContentSize().height;
        }
        if (typeLabel.getContentSize().height > height) {
            height = typeLabel.getContentSize().height;
        }
        if (infoLabel.getContentSize().height > height) {
            height = infoLabel.getContentSize().height;
        }
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.itemList.getContentSize().width, height));
        this.itemList.pushItem(container);

        var bg1 = new ccui.Scale9Sprite("sublobby-cell-bg.png", cc.rect(10, 0, 4, 78));
        bg1.setPreferredSize(cc.size(this.width1, container.getContentSize().height));
        bg1.setPosition(this.x1, container.getContentSize().height / 2);
        container.addChild(bg1);

        var bg2 = new ccui.Scale9Sprite("sublobby-cell-bg.png", cc.rect(10, 0, 4, 78));
        bg2.setPreferredSize(cc.size(this.width2, container.getContentSize().height));
        bg2.setPosition(this.x2, container.getContentSize().height / 2);
        container.addChild(bg2);

        var bg3 = new ccui.Scale9Sprite("sublobby-cell-bg.png", cc.rect(10, 0, 4, 78));
        bg3.setPreferredSize(cc.size(this.width3, container.getContentSize().height));
        bg3.setPosition(this.x3, container.getContentSize().height / 2);
        container.addChild(bg3);

        var bg4 = new ccui.Scale9Sprite("sublobby-cell-bg.png", cc.rect(10, 0, 4, 78));
        bg4.setPreferredSize(cc.size(this.width4, container.getContentSize().height));
        bg4.setPosition(this.x4, container.getContentSize().height / 2);
        container.addChild(bg4);

        timeLabel.setPosition(bg1.getPosition());
        container.addChild(timeLabel, 1);

        typeLabel.setPosition(bg2.getPosition());
        container.addChild(typeLabel, 1);

        infoLabel.setPosition(bg3.getPosition());
        container.addChild(infoLabel, 1);

        statusLabel.setPosition(bg4.getPosition());
        container.addChild(statusLabel, 1);
        if (status == 0) { //thanh cong
            statusLabel.setString("Đã trả");
            statusLabel.setColor(cc.color("#ffde00"));

            var successIcon = new cc.Sprite("#reward-success-icon.png");
            container.addChild(successIcon);
            statusLabel.setPositionX(bg4.x - 30);
            successIcon.setPosition(statusLabel.x + statusLabel.getContentSize().width / 2 + successIcon.getContentSize().width / 2, statusLabel.y);
        }
        else if (status == 1) {
            statusLabel.setString("Chờ duyệt");
            statusLabel.setColor(cc.color("#9e9e9e"));
        }
        else {
            statusLabel.setString("Đã hủy");
            statusLabel.setColor(cc.color("#ff0000"));
        }
    }
});

var reward_tab_1 = reward_tab_1 || [
    "#reward-tab-1.png",
    "#reward-tab-2.png",
   // "#reward-tab-3.png",
    "#reward-tab-4.png",
    "#reward-tab-5.png"
];

var reward_tab_2 = reward_tab_2 || [
    "#reward-tab-selected-1.png",
    "#reward-tab-selected-2.png",
    //"#reward-tab-selected-3.png",
    "#reward-tab-selected-4.png",
    "#reward-tab-selected-5.png"
];

var RewardLayer = LobbySubLayer.extend({
    ctor: function () {
        this._super("#lobby-title-reward.png");
        LobbyClient.getInstance().addListener("cashout", this.onCashout, this);

        var allLayer = [new RewardCardLayer(), new RewardItemLayer(),
            new RewardAgencyLayer(), new RewardHistoryLayer()];
        for (var i = 0; i < allLayer.length; i++) {
            this.addChild(allLayer[i]);
        }

        this._initTab(reward_tab_1, reward_tab_2, allLayer);
    },

    onEnter: function () {
        this._super();
        this.mToggle.selectItem(0);
    },
    onExit : function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
    },

    onCashout : function () {
        var dialog = new MessageDialog();
        dialog.setMessage("Đổi thưởng thành công\n\nVui lòng kiểm tra mục nhận thưởng");
        dialog.showWithAnimationScale();
    }
});