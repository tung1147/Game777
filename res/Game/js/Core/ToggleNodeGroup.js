/**
 * Created by Quyet Nguyen on 7/5/2016.
 */

var ToggleNodeItem = ccui.Widget.extend({
    ctor : function (size) {
        this._super();
        this.setContentSize(size);
        this.setTouchEnabled(true);
        this.onSelect = null;
        this.onUnSelect = null;
    },
    select : function (isForce, ext) {
        if(this.onSelect){
            this.onSelect(isForce, ext);
        }
        this.setTouchEnabled(false);
    },

    unSelect : function (isForce, ext) {
        if(this.onUnSelect){
            this.onUnSelect(isForce, ext);
        }
        this.setTouchEnabled(true);
    }
});

var ToggleNodeGroup = ccui.Widget.extend({
    ctor : function () {
        this._super();
        this.mItem = [];
        this.itemClicked = null;
    },
    
    addItem : function (item) {
        this.mItem.push(item);
        this.addChild(item);
        var thiz = this;
        item.addClickEventListener(function (item) {
            thiz.onClickedItem(item);
        });
    },

    onClickedItem : function (item) {
        if(this.itemClicked){
            this.itemClicked.unSelect(false);
            this.itemClicked = null;
        }
        this.itemClicked = item;
        this.itemClicked.select(false);
    },
    
    selectItem : function (index, ext) {
        var item = this.mItem[index]
        if(this.itemClicked){
            this.itemClicked.unSelect(true, ext);
            this.itemClicked = null;
        }
        this.itemClicked = item;
        this.itemClicked.select(true, ext);
    },

    onEnter : function () {
        this._super();
        this.itemClicked = null;
        for(var i=0; i<this.mItem.length; i++){
            this.mItem[i].unSelect(true);
        }
    }
});