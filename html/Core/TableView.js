/**
 * Created by QuyetNguyen on 11/9/2016.
 */
var newui = newui || {};
newui.TableView = newui.CustomScrollView.extend({
    ctor : function (size, columnCount) {
        this._super(size);

        this._allItems = [];
        this._padding = 0.0;
        this._marginLeft = 0.0;
        this._marginRight = 0.0;
        this._marginTop = 0.0;
        this._marginBottom = 0.0;
        this._direction = ccui.ScrollView.DIR_VERTICAL;
        this._refreshView = false;
        this._columnCount = columnCount;
    },

    setPadding : function (padding) {
        this._padding = padding;
        this._refreshView = true;
    },

    setMargin : function (top, bot, left, right) {
        this._marginTop = top;
        this._marginBottom = bot;
        this._marginLeft = left;
        this._marginRight = right;
        this._refreshView = true;
    },

    refreshView : function () {
        if(this._refreshView) {
            this.forceRefreshView();
        }
    },
    forceRefreshView : function () {
        if(this._direction === ccui.ScrollView.DIR_VERTICAL){
            if(this._columnCount == 1){
                this._refreshViewVerticalListView();
            }
            else{
                this._refreshViewVertical();
            }
        }
        else{
            if(this._columnCount == 1){
                this._refreshViewHorizontalListView();
            }
            else{
                this._refreshViewHorizontal();
            }
        }
        this._refreshView = false;
    },

    _refreshViewHorizontal : function () {
        cc.log("refreshViewVertical");
        var containerWidth = 0.0;
        var containerHeight = this.getContentSize().height;

        if(this._allItems.length > 0){
            var itemSize = this._allItems[0].getContentSize();
            itemSize = cc.size(itemSize.width * this._allItems[0].getScaleX(), itemSize.height * this._allItems[0].getScaleY());

            var row = this._columnCount;
            var col = Math.ceil(this._allItems.length / row);
            containerWidth = itemSize.width * col + this._padding*(col - 1) + this._marginLeft + this._marginRight;
            if(containerWidth < this.getContentSize().width){
                containerWidth = this.getContentSize().width;
            }
            var rowPadding = (containerHeight - this._marginTop - this._marginBottom - (row * itemSize.height)) / (row + 1);
            if(rowPadding < 0.0){
                rowPadding = 0.0;
            }
            if(this._isReverse){
                var x = containerWidth - this._marginRight - itemSize.width/2;
            }
            else{
                var x = this._marginLeft + itemSize.width/2;
            }
            var y = containerHeight - this._marginTop - itemSize.height/2 - rowPadding;
            for(var i=0; i<this._allItems.length;i++){
                var colIdx = Math.floor(i/row);
                var rowIdx = i % row;
                this._allItems[i].setAnchorPoint(cc.p(0.5, 0.5));
                if(this._isReverse){
                    this._allItems[i].setPosition(x - colIdx * (this._padding + itemSize.width), y - rowIdx * (rowPadding + itemSize.height));
                }
                else{
                    this._allItems[i].setPosition(x + colIdx * (this._padding + itemSize.width), y - rowIdx * (rowPadding + itemSize.height));
                }
            }
        }

        if(containerWidth < this.getContentSize().width){
            containerWidth = this.getContentSize().width;
        }
        this.setInnerContainerSize(cc.size(containerWidth, containerHeight));
    },

    _refreshViewHorizontalListView: function () {
        cc.log("_refreshViewHorizontalListView");
        var containerWidth = 0.0;
        var containerHeight = this.getContentSize().height;

        if(this._allItems.length > 0){
            var totalItemWidth = 0;
            for(var i=0;i<this._allItems.length;i++){
                totalItemWidth += this._allItems[i].getContentSize().width * this._allItems[i].getScaleX();
            }

            containerWidth = totalItemWidth + (this._padding) * (this._allItems.length - 1) + this._marginLeft + this._marginRight;
            if(containerWidth < this.getContentSize().width){
                containerWidth = this.getContentSize().width;
            }

            if(this._isReverse){
                var x = containerWidth - this._marginRight;
            }
            else{
                var x = this._marginLeft;
            }
            for(var i=0; i<this._allItems.length;i++){
                var item = this._allItems[i];
                item.setAnchorPoint(cc.p(0.5, 0.5));
                var itemWidth = item.getContentSize().width * item.getScaleX();
                if(this._isReverse){
                    item.setPosition(x - itemWidth/2 , containerHeight/2);
                    x -= (itemWidth + this._padding);
                }
                else{
                    item.setPosition(x + itemWidth/2 , containerHeight/2);
                    x += (itemWidth + this._padding);
                }
            }
        }

        if(containerWidth < this.getContentSize().width){
            containerWidth = this.getContentSize().width;
        }
        this.setInnerContainerSize(cc.size(containerWidth, containerHeight));
    },

    _refreshViewVertical : function () {
        var containerWidth = this.getContentSize().width;
        var containerHeight = 0.0;

        if(this._allItems.length > 0){
            var itemSize = this._allItems[0].getContentSize();
            itemSize = cc.size(itemSize.width * this._allItems[0].getScaleX(), itemSize.height * this._allItems[0].getScaleY());

            var col = this._columnCount;
            var row = Math.ceil(this._allItems.length / this._columnCount);
            containerHeight = itemSize.height * row + this._padding*(row - 1) + this._marginTop + this._marginBottom;
            if(containerHeight < this.getContentSize().height){
                containerHeight = this.getContentSize().height;
            }
            var colPadding = (containerWidth - this._marginLeft - this._marginRight - (col * itemSize.width)) / (col + 1);
            if(colPadding < 0){
                colPadding = 0.0;
            }

            var x = this._marginLeft + colPadding + itemSize.width/2;
            if(this._isReverse){
                var y = this._marginBottom + itemSize.height/2;
            }
            else{
                var y = containerHeight - this._marginTop - itemSize.height/2;
            }

            for(var i=0; i<this._allItems.length;i++){
                var colIdx = i % col;
                var rowIdx = Math.floor(i / col);
                this._allItems[i].setAnchorPoint(cc.p(0.5, 0.5));
                if(this._isReverse){
                    this._allItems[i].setPosition(x + colIdx * (itemSize.width + colPadding), y + rowIdx * (itemSize.height + this._padding));
                }
                else{
                    this._allItems[i].setPosition(x + colIdx * (itemSize.width + colPadding), y - rowIdx * (itemSize.height + this._padding));
                }
            }
        }

        if(containerHeight < this.getContentSize().height){
            containerHeight = this.getContentSize().height;
        }
        this.setInnerContainerSize(cc.size(containerWidth, containerHeight));
    },

    _refreshViewVerticalListView : function () {
        cc.log("_refreshViewVerticalListView");
        var containerWidth = this.getContentSize().width;
        var containerHeight = 0.0;

        if(this._allItems.length > 0){
            var totalItemHeight = 0;
            for(var i=0;i<this._allItems.length;i++){
                totalItemHeight += this._allItems[i].getContentSize().height * this._allItems[i].getScaleY();
            }

            containerHeight = totalItemHeight + (this._padding) * (this._allItems.length - 1) + this._marginTop + this._marginBottom;
            if(containerHeight < this.getContentSize().height){
                containerHeight = this.getContentSize().height;
            }

            if(this._isReverse){
                var y = this._marginBottom;
            }
            else{
                var y = containerHeight - this._marginTop;
            }

            for(var i=0; i<this._allItems.length;i++){
                var item = this._allItems[i];
                item.setAnchorPoint(cc.p(0.5, 0.5));
                var itemHeight = item.getContentSize().height * item.getScaleY();
                if(this._isReverse){
                    item.setPosition(containerWidth/2, y + itemHeight/2);
                    y += (itemHeight + this._padding);
                }
                else{
                    item.setPosition(containerWidth/2, y - itemHeight/2);
                    y -= (itemHeight + this._padding);
                }
            }
        }

        if(containerHeight < this.getContentSize().height){
            containerHeight = this.getContentSize().height;
        }
        this.setInnerContainerSize(cc.size(containerWidth, containerHeight));
    },

    getRowItems :function(rowIndex){
        var items = [];
        if(this._direction == ccui.ScrollView.DIR_VERTICAL){
            for(var i=0;i<this._columnCount;i++){
                var idx = rowIndex*this._columnCount + i;
                if(idx < this._allItems.length){
                    items.push(this._allItems[idx]);
                }
            }
        }
        else{
            var col = Math.ceil(this._allItems.length / this._columnCount);
            for(var i=0; i<col; i++){
                var idx = rowIndex + i * this._columnCount;
                if(idx < this._allItems.length){
                    items.push(this._allItems[idx]);
                }
            }
        }

        return items;
    },

    setReverse : function (reverse) {
        this._isReverse = reverse;
        this._refreshView = true;
    },

    runMoveEffect : function (moveSpeed, delayPerColumn, delayPerRow) {
        this.forceRefreshView();
        if(this._allItems.length <= 0){
            return;
        }

        var row = this._columnCount;
        if(this._direction == ccui.ScrollView.DIR_HORIZONTAL){
            var col = Math.ceil(this._allItems.length / this._columnCount);
            row = Math.ceil(this._allItems.length / col);
        }
        else{
            row = Math.ceil(this._allItems.length / this._columnCount);
        }

        var itemSize = this._allItems[0].getContentSize();
        var dx = this.getContentSize().width + itemSize.width/2;
        var duration = dx/moveSpeed;
        if(moveSpeed < 0){
            dx = -dx;
            duration = -duration;
        }

        var delayTime1 = 0.0;
        var delayTime2 = 0.0;
        var maxDelayTime = 0.0;
        var thiz = this;
        for(var i=0; i<row; i++){
            var items = this.getRowItems(i);

            delayTime1 = 0.0;
            for(var j=0;j<items.length;j++){
                var item = items[j];
                item.x += dx;
                var delayTime = delayTime1 + delayTime2;
                if(delayTime > maxDelayTime){
                    maxDelayTime = delayTime;
                }
                item.stopAllActions();
                this.startItemAnimation(item);
                (function (item) {
                    item.runAction(new cc.Sequence(new cc.DelayTime(delayTime), new cc.EaseCircleActionOut(new cc.MoveBy(duration, cc.p(-dx, 0))), new cc.CallFunc(function () {
                        thiz.finishedItemAnimation(item);
                    })));
                })(item);

                delayTime1 += delayPerColumn;
            }
            delayTime2 += delayPerRow;
        }

        var thiz = this;
        thiz.setEnabled(false);
        this.runAction(new cc.Sequence(new cc.DelayTime(delayTime), new cc.CallFunc(function () {
            thiz.setEnabled(true);
        })));
    },

    startItemAnimation : function (item) {
       // cc.log("startItemAnimation: "+item);
    },
    finishedItemAnimation : function (item) {
       // cc.log("finishedItemAnimation: "+item);
    },

    setDirection : function (direction) {
        this._super(direction);
        this._refreshView = true;
    },

    insertItem : function (item, index) {
        item.setAnchorPoint(cc.p(0.5,0.5));
        this.addChild(item);

        this._allItems.splice(index, 0, item);
        this._refreshView = true;
    },

    getItem : function (index) {
        return this._allItems[index];
    },

    size : function () {
        return this._allItems.length;
    },

    removeAllItems : function () {
        this.removeAllChildrenWithCleanup(true);
        this._refreshView = true;
    },

    pushItem : function (item) {
        item.setAnchorPoint(cc.p(0.5,0.5));
        this.addChild(item);
        this._allItems.push(item);
        this._refreshView = true;
    },

    removeItem : function(item) {
        if(cc.isNumber(item)){
            this._allItems[item].removeFromParent(true);
            this._allItems.splice(item,1);
        }
        else{
            for(var i=0;i<this._allItems.length;i++){
                if(this._allItems[i] === item){
                    this._allItems[i].removeFromParent(true);
                    this._allItems.splice(i,1);
                    break;
                }
            }
        }
        this._refreshView = true;
    },

    setAnimationHandler : function (func) {
        this.animationHandler = func;
    },

    removeAllChildrenWithCleanup : function (cleanup) {
        this._allItems = [];
        //update container size
        this._super(cleanup);
    },

    _beforeVisit : function () {
        this.refreshView();
    }
});
