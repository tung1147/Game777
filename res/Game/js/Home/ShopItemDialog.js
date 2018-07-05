/**
 * Created by Quyet Nguyen on 4/4/2017.
 */

var ShopItemBuyDialog = Dialog.extend({
    ctor : function (info) {
        this._super();

        this._bgColor = cc.color(0,0,0,0);
        this.okButton.visible = false;
        this.cancelButton.visible = false;
        this.title.setString("Vật phẩm");
        this.initWithSize(cc.size(518, 348));

        this._initView(info);

        this._itemCount = 1;
        this._itemPrice = info.price;
        this._updateView();
    },
    _initView : function (info) {
        var thiz = this;
        var itemId = info.itemId;

        this.title.setString(info.itemName);

        var iconBg = new ccui.Scale9Sprite("shop_item_bg.png", cc.rect(20,20,4,4));
        iconBg.setPreferredSize(cc.size(100,100));
        iconBg.setPosition(197,306);
        this.addChild(iconBg);

        var icon = new InventoryItemIcon();
        icon.loadFromUrl(info.iconUrl);
        icon.setPosition(iconBg.getPosition());
        this.addChild(icon,2);

        var contentLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, info.itemContent, cc.TEXT_ALIGNMENT_LEFT, 350);
        contentLabel.setAnchorPoint(cc.p(0.0, 1.0));
        contentLabel.setPosition(262, 355);
        this.addChild(contentLabel,1);

        var buyBg = new cc.Sprite("#shop_buy_bg.png");
        buyBg.setPosition(this.getContentSize().width/2, contentLabel.y - contentLabel.getContentSize().height - 40);
        this.addChild(buyBg);

        var subBt = new ccui.Button("shop_buy_sub.png","","", ccui.Widget.PLIST_TEXTURE);
        subBt.setPosition(buyBg.x - 60, buyBg.y);
        this.addChild(subBt);
        subBt.addClickEventListener(function () {
            if(thiz._itemCount > 0){
                thiz._itemCount--;
                thiz._updateView();
            }
        });

        var addBt = new ccui.Button("shop_buy_add.png","","", ccui.Widget.PLIST_TEXTURE);
        addBt.setPosition(buyBg.x + 60, buyBg.y);
        this.addChild(addBt);
        addBt.addClickEventListener(function () {
            thiz._itemCount++;
            if(!thiz._updateView()){
                MessageNode.getInstance().show("Bạn không đủ tiền");
            }
        });

        var countLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "0");
        countLabel.setPosition(buyBg.getPosition());
        this.addChild(countLabel,1);

        var goldLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_20, "1,000");
        goldLabel.setColor(cc.color("#f4d501"));
        goldLabel.setAnchorPoint(cc.p(0.0, 0.5));
        goldLabel.setPosition(buyBg.x + 125, buyBg.y);
        this.addChild(goldLabel,1);

        var currentGold = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_20, "Số vàng còn lại: ");
        currentGold.setAnchorPoint(cc.p(1.0, 0.5));
        currentGold.setPosition(362, 140);
        this.addChild(currentGold,1);

        var currentGoldLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_20, "100,100");
        currentGoldLabel.setColor(cc.color("#f4d501"));
        currentGoldLabel.setAnchorPoint(cc.p(0.0, 0.5));
        currentGoldLabel.setPosition(362, 140);
        this.addChild(currentGoldLabel,1);

        var okButton = new ccui.Button("inventory_button.png", "", "", ccui.Widget.PLIST_TEXTURE);
        okButton.setScale9Enabled(true);
        okButton.setCapInsets(cc.rect(10,10,4,4));
        okButton.setContentSize(cc.size(180, 50));
        okButton.setPosition(buyBg.x, 190);
        okButton.setZoomScale(0.02);
        this.addChild(okButton);

        var okTitle = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "Mua");
        okTitle.setColor(cc.color("#682e2e"));
        okTitle.setPosition(okButton.getContentSize().width/2, okButton.getContentSize().height/2);
        okButton.getRendererNormal().addChild(okTitle);
        okButton.addClickEventListener(function () {
            if(thiz._itemCount <= 0){
                MessageNode.getInstance().show("Bạn phải chọn vật phẩm");
                return;
            }

            var items = [];
            for(var i=0;i<thiz._itemCount;i++){
                items.push(itemId);
            }
            var request = {
                command : "buyItem",
                items : items
            };

            LobbyClient.getInstance().send(request);

            //send request
            thiz.hide();
        });

        this.countLabel = countLabel;
        this.goldLabel = goldLabel;
        this.currentGoldLabel = currentGoldLabel;
    },
    
    _updateView : function () {
        var gold = this._itemCount * this._itemPrice;
        if(gold > PlayerMe.gold){
            this._itemCount--;
            this._updateView();
            return false;
        }
        else{
            var currentGold = PlayerMe.gold - gold;
            this.goldLabel.setString(cc.Global.NumberFormat1(gold) + " V");
            this.currentGoldLabel.setString(cc.Global.NumberFormat1(currentGold) + " V");
            this.countLabel.setString(this._itemCount.toString());
        }
        return true;
    }
});

var s_shop_tabName = s_shop_tabName || ["AVATAR", "VẬT PHẨM", "ĐỒ ĂN"];
var s_shop_tabId = s_shop_tabId || [2,1,3];

var ShopItemDialog = Dialog.extend({
    ctor : function () {
        this._super();
      //  this._moveEnable = true;
        //this._bgColor = cc.color(0,0,0,0);
        
        var thiz = this;
        LobbyClient.getInstance().addListener("fetchItem", this._onRecvItemData, this);

        this.okButton.visible = false;
        this.cancelButton.visible = false;
        this.title.setString("Cửa hàng");
        this.initWithSize(cc.size(686, 648));

        var _left = 106;
        var _right = 776;
        var _top = 572;
        var _bottom = 98;

        var tabBg = new ccui.Scale9Sprite("shop_tab_0.png", cc.rect(10,10,4,4));
        tabBg.setPreferredSize(cc.size(420, 50));
        tabBg.setPosition(this.getContentSize().width/2, 617);
        this.addChild(tabBg);

        var mToggle = new ToggleNodeGroup();
        this.addChild(mToggle);
        this.mToggle = mToggle;

        var dx = tabBg.getContentSize().width/ s_shop_tabName.length;
        var x = tabBg.x - tabBg.getContentSize().width/2 + dx / 2;
        for(var i=0;i<s_shop_tabName.length;i++){
            (function () {
                var icon = new ccui.Scale9Sprite("shop_tab_"+ (i+1).toString() +".png", cc.rect(10,10,4,4));
                icon.setPreferredSize(cc.size(dx, tabBg.getContentSize().height));
                icon.setPosition(x + dx*i, tabBg.y);
                thiz.addChild(icon);

                var tabLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, s_shop_tabName[i]);
                tabLabel.setPosition(icon.getPosition());
                thiz.addChild(tabLabel, 1);

                var tabIdx = i;

                var mItem = new ToggleNodeItem(icon.getContentSize());
                mItem.setPosition(icon.getPosition());
                mToggle.addItem(mItem);
                mItem.onSelect =  function () {
                    icon.visible = true;
                    tabLabel.setColor(cc.color("#ffffff"));
                    thiz._sendRefreshItem(tabIdx);
                };
                mItem.onUnSelect = function () {
                    icon.visible = false;
                    tabLabel.setColor(cc.color("#626ea5"));
                };
            })();
        }

        var listItem = new newui.TableView(cc.size(_right - _left, _top - _bottom), 6);
        listItem.setPosition(cc.p(_left, _bottom));
        listItem.setMargin(20,20,0,0);
        listItem.setPadding(10);
        this.addChild(listItem);
        this.listItem = listItem;

        // for(var i=0;i<30;i++){
        //     this.addItem("icon","name", "content", 200000, "id");
        // }
    },

    addItem : function (iconUrl, itemName, itemContent, price, itemId) {
        var thiz = this;

        var container = new ccui.Widget();
        container.setContentSize(cc.size(100,100));
        this.listItem.pushItem(container);

        var bg = new ccui.Scale9Sprite("shop_item_bg.png", cc.rect(20,20,4,4));
        bg.setPreferredSize(container.getContentSize());
        bg.setPosition(container.getContentSize().width/2, container.getContentSize().height/2);
        container.addChild(bg);

        var icon = new InventoryItemIcon();
        icon.loadFromUrl(iconUrl);
        icon.setPosition(bg.getPosition());
        container.addChild(icon);

        container.setTouchEnabled(true);
        container.addClickEventListener(function () {
            var info = {
                iconUrl:iconUrl,
                itemName:itemName,
                itemContent:itemContent,
                price:price,
                itemId:itemId
            };
            var dialog = new ShopItemBuyDialog(info);
            dialog.show();
            dialog.setPosition(thiz.getPosition());
        });
    },

    _onRecvItemData : function (cmd, data) {
        var items = data["data"]["items"];
        if(items.length > 0){
            this.listItem.removeAllItems();

            for(var i=0;i<items.length;i++){
                var avt = items[i]["avatar"];
                var name = items[i]["name"];
                var content = items[i]["description"];
                var price = items[i]["cost"];
                var idItem = items[i]["idItem"];
                this.addItem(avt,name,content,price,idItem);
            }
        }
    },

    _sendRefreshItem : function (tabIdx) {
        this.listItem.removeAllItems();
        var request = {
            command : "fetchItem",
            groupType : s_shop_tabId[tabIdx]
        };
        LobbyClient.getInstance().send(request);
    },

    onEnter : function () {
        this._super();
        this.mToggle.selectItem(1);
    },

    onExit : function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
    }
});