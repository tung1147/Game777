/**
 * Created by Quyet Nguyen on 4/4/2017.
 */

var InventoryTimeAction = cc.CustomAction.extend({
    ctor : function (duration) {
        this._super();
        this.initWithDuration(duration);
        this._time = duration;
    },

    _updateTarget : function () {
        var sec = this._currentNumber % 60;
        var min = Math.floor(this._currentNumber / 60) % 60;
        var hour = Math.floor(this._currentNumber / 3600);

        if(hour > 0){
            this._target.setString(cc.Global.NumberFormatWithPadding(hour) + ":" + cc.Global.NumberFormatWithPadding(min) + ":" + cc.Global.NumberFormatWithPadding(sec));
        }
        else{
            this._target.setString(cc.Global.NumberFormatWithPadding(min) + ":" + cc.Global.NumberFormatWithPadding(sec));
        }
    },

    onUpdate : function (dt) {
        var number = Math.floor(this._time * (1.0 - dt));
        if(this._currentNumber == number){
            return;
        }
        this._currentNumber = number;
        this._updateTarget();
    },

    onStartWithTarget : function (target) {
        this._target = target;
        this._currentNumber = Math.floor(this._time);
        this._updateTarget();
    }
});

var InventoryUseDialog = Dialog.extend({
    ctor : function (info) {
        this._super();

        this._bgColor = cc.color(0,0,0,0);
        this.okButton.visible = false;
        this.cancelButton.visible = false;
        this.title.setString("Vật phẩm");
        this.initWithSize(cc.size(478, 278));

        this._initView(info);
    },
    
    _initView : function (info) {
        var thiz = this;
        var itemId = info.itemId;

        this.title.setString(info.itemName);

        var iconBg = new ccui.Scale9Sprite("shop_item_bg.png", cc.rect(20,20,4,4));
        iconBg.setPreferredSize(cc.size(100,100));
        iconBg.setPosition(168,236);
        this.addChild(iconBg);

        var icon = new InventoryItemIcon();
        icon.loadFromUrl(info.iconUrl);
        icon.setPosition(iconBg.getPosition());
        this.addChild(icon,2);

        var contentLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, info.itemContent, cc.TEXT_ALIGNMENT_LEFT, 340);
        contentLabel.setAnchorPoint(cc.p(0.0, 1.0));
        contentLabel.setPosition(229, 277);
        this.addChild(contentLabel,1);

        var countLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "Số lượng: " + info.count.toString());
        countLabel.setAnchorPoint(cc.p(0.0, 1.0));
        countLabel.setPosition(contentLabel.x, contentLabel.y - contentLabel.getContentSize().height - 5);
        this.addChild(countLabel,1);

        var okButton = new ccui.Button("inventory_button.png", "", "", ccui.Widget.PLIST_TEXTURE);
        okButton.setScale9Enabled(true);
        okButton.setCapInsets(cc.rect(10,10,4,4));
        okButton.setContentSize(cc.size(180, 50));
        okButton.setPosition(this.getContentSize().width/2, 145);
        okButton.setZoomScale(0.02);
        this.addChild(okButton);

        var okTitle = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, "Sử dụng");
        okTitle.setColor(cc.color("#682e2e"));
        okTitle.setPosition(okButton.getContentSize().width/2, okButton.getContentSize().height/2);
        okButton.getRendererNormal().addChild(okTitle);
        okButton.addClickEventListener(function () {
            var request = {
                command : "changeStatusUserItem",
                idItem : itemId,
                //userItemId : itemId,
                status : 0 //active
            };

            LobbyClient.getInstance().send(request);

            //send request
            thiz.hide();
        });
    }
});

var InventoryDialog = Dialog.extend({
    ctor : function () {
        this._super();
      //  var thiz = this;
        //this._moveEnable = true;
       // this._bgColor = cc.color(0,0,0,0);
        this.okButton.visible = false;
        this.cancelButton.visible = false;
        this.title.setString("Kho đồ");
        this.initWithSize(cc.size(466, 648));

        this.initItemListView();
        this.initUsedItemView();
    },

    initItemListView : function () {
        var _left = 106;
        var _right = 556;
        var _top = 558;
        var _bottom = 98;

        var listItem = new newui.TableView(cc.size(_right - _left, _top - _bottom), 4);
        listItem.setPosition(cc.p(_left, _bottom));
        listItem.setMargin(20,20,0,0);
        listItem.setPadding(10);
        this.addChild(listItem, 1);
        this.listItem = listItem;

        // for(var i=0;i<30;i++){
        //     this.addItem("","name","content", 10,"itemId");
        // }
    },

    addItem : function (iconUrl, itemName, itemContent, count, itemId) {
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

        if(count > 1){
            var countLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "x"+count.toString());
            countLabel.setAnchorPoint(cc.p(1.0, 0.0));
            countLabel.setPosition(92,6);
            container.addChild(countLabel);
        }

        container.setTouchEnabled(true);
        container.addClickEventListener(function () {
            var info = {
                iconUrl:iconUrl,
                itemName:itemName,
                itemContent:itemContent,
                count:count,
                itemId:itemId
            };
            var dialog = new InventoryUseDialog(info);
            dialog.show();
          //  dialog.setPosition(thiz.getPosition());
        });
    },

    initUsedItemView : function () {
        var _left = 119;
        var _right = 543;
        var _top = 657;
        var _bottom = 575;

        var usedItemBg = new ccui.Scale9Sprite("shop_item_bg.png", cc.rect(20,20,4,4));
        usedItemBg.setPreferredSize(cc.size(_right - _left + 4, _top - _bottom + 4));
        usedItemBg.setPosition((_right + _left) / 2, (_top + _bottom) / 2);
        this.addChild(usedItemBg);

        var listUsedItem = new newui.TableView(cc.size(_right - _left, _top - _bottom), 1);
        listUsedItem.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        listUsedItem.setPosition(cc.p(_left, _bottom));
        listUsedItem.setBounceEnabled(false);
        this.addChild(listUsedItem, 1);
        this.listUsedItem = listUsedItem;

        for(var i=0;i<4;i++){
            this.addUsedItem(null, null);
        }
    },

    addUsedItem : function (iconUrl, time) {
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.listUsedItem.getContentSize().width/4, this.listUsedItem.getContentSize().height));

        if(this.listUsedItem.size() > 0){
            var padding = new cc.Sprite("#inventory_used_padding.png");
            padding.setPosition(0, container.getContentSize().height/2);
            container.addChild(padding);
        }

        if(iconUrl != null){
            var icon = new InventoryItemIcon();
            icon.loadFromUrl(iconUrl);
            icon.setScale(0.62);
            icon.setPosition(container.getContentSize().width/2, 53);
            container.addChild(icon);

            if(time){
                var timeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_16, "time");
                timeLabel.setPosition(icon.x, 16);
                container.addChild(timeLabel);
                timeLabel.runAction(new InventoryTimeAction(time / 1000));
            }
        }

        this.listUsedItem.pushItem(container);
    },

    onFetchUserItem : function (cmd, data) {
        this.listItem.removeAllItems();
        var userItems = data["data"]["userItems"];
        var items = {};
        for(var i=0;i<userItems.length;i++){
            var type = userItems[i]["type"];
            if(type != 2){
                var idItem = userItems[i]["idItem"];
                if(items[idItem]){
                    items[idItem].count++;
                }
                else{
                    var name = userItems[i]["name"];
                    var description = userItems[i]["description"];
                    var avt = userItems[i]["avatar"];

                    items[idItem] = {
                        idItem : idItem,
                        name: name,
                        description: description,
                        avt: avt,
                        count: 1
                    }
                }
            }
        }

        for (var key in items) {
            if (!items.hasOwnProperty(key)) continue;
            var item = items[key];
            this.addItem(item["avt"], item["name"], item["description"],item["count"],item["idItem"]);
        }

        //item used
        this.listUsedItem.removeAllItems();
        var usedItems = data["data"]["userItemActive"];
        var itemUsedCount = 0;
        for(var i=0;i<usedItems.length;i++){
            var type = usedItems[i]["type"];
            if(type != 2){
                itemUsedCount++;
                var avt = usedItems[i]["avatar"];
                var timeRemaining = usedItems[i]["timeRemaining"];
                this.addUsedItem(avt, timeRemaining);
            }
        }

        var n = 4 - itemUsedCount;
        for(var i=0;i<n;i++){
            this.addUsedItem(null, null);
        }
        if(n > 0){
            this.listUsedItem.setBounceEnabled(false);
        }
        else{
            this.listUsedItem.setBounceEnabled(true);
        }
    },

    onChangeStatusUserItem : function (cmd, data) {
        this.fetchUserItem();
    },

    onBuyItem : function () {
        this.fetchUserItem();
    },

    fetchUserItem : function () {
        var request = {
            command : "fetchUserItem"
        };
        LobbyClient.getInstance().send(request);
    },

    onEnter : function () {
        this._super();
        LobbyClient.getInstance().addListener("fetchUserItem", this.onFetchUserItem, this);
        LobbyClient.getInstance().addListener("changeStatusUserItem", this.onChangeStatusUserItem, this);
        LobbyClient.getInstance().addListener("buyItem", this.onBuyItem, this);
        this.fetchUserItem();
    },

    onExit : function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
    }
});

var ChangeAvatarDialog = Dialog.extend({
    ctor : function () {
        this._super();
    }
});
