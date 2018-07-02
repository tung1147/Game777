/**
 * Created by QuyetNguyen on 11/9/2016.
 */

var newui = newui || {};
newui.EditBox = cc.EditBox.extend({
    ctor : function (size) {
        this._super(size, null, null, null);
        this.setContentSize(size);
    },

    initWithSize : function(size){

    },

    setBackgoundMargin : function(left,top,right,bottom){

    }
});

newui.EditBox.prototype.create = function (size) {
    return newui.EditBox(size);
};