/**
 * Created by Quyet Nguyen on 4/6/2017.
 */

var AvatarDialog = IDialog.extend({
    ctor : function () {
       this._super();
       this.setContentSize(cc.size(470,460));
       this.setAnchorPoint(cc.p(0.5,0.5));
       this.mTouch = cc.rect(0,0,470,460);
       this._bgColor = cc.color(0,0,0,0);

       var bg = new ccui.Scale9Sprite("inventory_AvatarDialog_bg.png", cc.rect(20,20,4,4));
       bg.setPreferredSize(cc.size(470,460));
       bg.setAnchorPoint(cc.p(0,0));
       this.addChild(bg);

       var listItem = new newui.TableView(cc.size(450, 430), 4);
       listItem.setPosition(cc.p(10, 15));
       listItem.setMargin(20,20,0,0);
       listItem.setPadding(10);
       this.addChild(listItem);
       this.listItem = listItem;

       for(var i=0;i<30;i++){
           this.addItem("","");
       }
    },

    addItem : function (iconUrl, itemId) {
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
            var request = {
                command : "activeAvatar",
                userItemId : itemId,
                status : 0
            };
            LobbyClient.getInstance().send(request);
            container.setVisible(false);
        });
    },

    onFetchAvatar : function (cmd, data) {
        this.listItem.removeAllItems();
        var userItems = data["data"]["userItems"];
        for(var i=0;i<userItems.length;i++){
            var type = userItems[i]["type"];
            if(type == 2){
                var idItem = userItems[i]["userItemId"];
                var avt = userItems[i]["avatar"];
                this.addItem(avt, idItem);
            }
        }
    },

    onEnter : function () {
        this._super();
        LobbyClient.getInstance().addListener("fetchAvatar", this.onFetchAvatar, this);
        var request = {
            command : "fetchAvatar"
        };
        LobbyClient.getInstance().send(request);
    },
    onExit : function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
    }
});