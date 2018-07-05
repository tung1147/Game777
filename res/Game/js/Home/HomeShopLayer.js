/**
 * Created by Quyet Nguyen on 4/4/2017.
 */

var HomeShopLayer = IDialog.extend({
    ctor : function () {
        this._super();
        this._bgColor = cc.color(0,0,0,0);
        this.setContentSize(cc.winSize);
        this.mTouch = cc.rect(0,0, cc.winSize.width, cc.winSize.height);
    },

    onEnter : function () {
        this._super();

        var thiz = this;

        var inventoryDialog = new InventoryDialog();
        inventoryDialog._moveEnable = true;
        inventoryDialog._bgColor = cc.color(0,0,0,0);
        inventoryDialog.show(this);
        inventoryDialog.setPositionX(cc.winSize.width - 235);
        inventoryDialog.closeButtonHandler = function () {
            thiz.hide();
        };
        inventoryDialog.onTouchDialog = function () {
            var p1 = inventoryDialog.getParent();
            var p2 = shopDialog.getParent();
            setTimeout(function () {
                p2.setLocalZOrder(0);
                p1.setLocalZOrder(1);
            }, 0);
        };

        var shopDialog = new ShopItemDialog();
        shopDialog._moveEnable = true;
        shopDialog._bgColor = cc.color(0,0,0,0);
        shopDialog.show(this);
        shopDialog.setPositionX(345);
        shopDialog.closeButtonHandler = function () {
            thiz.hide();
        };
        shopDialog.onTouchDialog = function () {
            var p1 = inventoryDialog.getParent();
            var p2 = shopDialog.getParent();
            setTimeout(function () {
                p1.setLocalZOrder(0);
                p2.setLocalZOrder(1);
            }, 0);
        };
    }
});