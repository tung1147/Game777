/**
 * Created by Quyet Nguyen on 4/13/2017.
 */
var newui = newui || {};
newui.ListViewWithAdaptor = newui.CustomScrollView.extend({
    ctor : function (size) {
        this._super(size);

        this._allItems = null;
        this._sizeCallback = null;
        this._createCallback = null;
        this._itemAdaptor = null;
        this._padding = 0.0;
        this._marginLeft = 0.0;
        this._marginRight = 0.0;
        this._marginTop = 0.0;
        this._marginBottom = 0.0;
        this._direction = ccui.ScrollView.DIR_VERTICAL;

        this._lastIndex = -1;
    },

    setSizeCallback : function (c) {
        this._sizeCallback = c;
    },

    setCreateItemCallback : function (c) {
        this._createCallback = c;
    },

    setItemAdaptor : function (c) {
        this._itemAdaptor = c;
    },

    setPadding : function (padding) {
        this._padding = padding;
    },

    setMargin : function (top, bot, left, right) {
        this._marginTop = top;
        this._marginBottom = bot;
        this._marginLeft = left;
        this._marginRight = right;
    },

    refreshView : function () {
        this._lastIndex = -1;
        this._initItem();

        var n = this.getItemSize();
        var containerHeight = (n - 1) * this._padding + n * this._itemSize.height + this._marginTop + this._marginBottom;

        if (containerHeight < this.getContentSize().height){
            containerHeight = this.getContentSize().height;
        }

        this.setInnerContainerSize(cc.size(this.getContentSize().width, containerHeight));
    },

    getItemSize : function () {
        if(this._sizeCallback){
            return this._sizeCallback();
        }
        return 0;
    },

    forceRefreshView : function () {
        if (this._lastIndex < 0){
            return;
        }
        if (this.getItemSize() <= 0){
            return;
        }

        var _allItems = this._allItems;

        for (var i = 0; i < _allItems.length; i++){
            _allItems[i].setVisible(false);
        }

        var itemSize = this._lastIndex + _allItems.length;
        if (itemSize > this.getItemSize()){
            itemSize = this.getItemSize();
        }


        var y = this.getInnerContainerSize().height - this._marginTop - this._itemSize.height / 2 - (this._padding + this._itemSize.height) * this._lastIndex;

        for (var i = this._lastIndex; i < itemSize; i++){
            var item = _allItems[i - this._lastIndex];
            item.setVisible(true);
            if (this._itemAdaptor){
                this._itemAdaptor(i, item);
            }

            item.setPositionY(y);
            y -= (this._padding + item.getContentSize().height);
        }
    },

    _initItem : function () {
        if (!this._allItems){
            this._allItems = [];
            var _defaultItem = this._createCallback();
            this._allItems.push(_defaultItem);
            var _itemSize = _defaultItem.getContentSize();
            _itemSize.width *= _defaultItem.getScaleX();
            _itemSize.height *= _defaultItem.getScaleY();
            this._itemSize = _itemSize;

            var itemCount = Math.floor(this.getContentSize().height / _itemSize.height) + 2;

            for (var i = 1; i < itemCount; i++){
                var item = this._createCallback();
                this._allItems.push(item);
            }

            for (var i = 0; i < this._allItems.length; i++){
                this._allItems[i].setAnchorPoint(cc.p(0.5,0.5));
                this._allItems[i].setPosition(this.getContentSize().width/2, this.getContentSize().height/2);
                this._allItems[i].setVisible(false);
                this.addChild(this._allItems[i]);
            }

            this.refreshView();
            this._lastIndex = -1;
        }
    },

    _beforeRender : function () {
        this._initItem();

        var containerY = this.getInnerContainerPosition().y;
        if (containerY > 0.0){
            containerY = 0.0;
        }

        var viewTop = this.getInnerContainerSize().height + containerY - this.getContentSize().height - this._marginTop;
        var  cellSize = this._itemSize.height + this._padding;
        var a = Math.floor(viewTop / cellSize);
        if (a < 0){
            a = 0;
        }

        if (a !== this._lastIndex){
            this._lastIndex = a;
            this.forceRefreshView();
            cc.log("forceRefreshView");
        }
    }
});
