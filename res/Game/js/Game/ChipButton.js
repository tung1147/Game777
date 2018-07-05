/**
 * Created by Quyet Nguyen on 8/30/2016.
 */
var ChipGroup = cc.Node.extend({
    ctor : function () {
        this._super();
        this.allChips = [];
        this.chipSelected = null;
    },
    selectChipAtIndex : function (index,isForce) {
        this.selectChip(this.allChips[index], isForce);
    },
    selectChip : function (chip,isForce) {
        if(this.chipSelected){
            this.chipSelected.unSelect(isForce);
            this.chipSelected = null;
        }
        this.chipSelected = chip;
        if(this.chipSelected){
            this.chipSelected.select(isForce);
        }
    },
    addChip : function (chip) {
        this.allChips.push(chip);
        this.addChild(chip);
        chip.unSelect(true);
    },
    getChip : function (idx) {
        return this.allChips[idx];
    },
    setTouchEnable : function (enable) {
        for(var i=0;i<this.allChips.length;i++){
            this.allChips[i].setTouchEnable(enable);
        }
    }
});

var ChipButton = cc.Node.extend({
    ctor : function () {
        this._super();
        this._touchEnabled = true;
        this.selected = false;
        this.rectTouch = cc.rect();
    },
    onEnter : function () {
        this._super();
        var thiz = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan : function (touch, event) {
                return thiz.onTouchBegan(touch, event);
            }
        }, this);
    },
    onExit : function () {
        this._super();
        cc.eventManager.removeListeners(this);
    },
    onTouchBegan : function (touch, event) {
        if(!this._touchEnabled){
            return false;
        }
        if(!this.selected){
            var p = this.convertToNodeSpace(touch.getLocation());
            if(cc.rectContainsPoint(this.rectTouch, p)){
                this.getParent().selectChip(this, false);
                return true;
            }
        }
        return false;
    },
    select : function (isForce) {
        this.selected = true;
        if(this.onSelect){
            this.onSelect(isForce);
        }
    },
    unSelect : function (isForce) {
        this.selected = false;
        if(this.onUnSelect){
            this.onUnSelect(isForce);
        }
    },
    setTouchEnable : function (enable) {
        this._touchEnabled = enable;
    }
});