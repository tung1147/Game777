/**
 * Created by QuyetNguyen on 11/9/2016.
 */
var newui = newui || {};
newui.Widget = ccui.Widget.extend({
    ctor : function (containerSize) {
        ccui.Widget.prototype.ctor.call(this);
        this.ignoreContentAdaptWithSize(true);

        this.setVirtualRendererSize(containerSize);
    },
    setVirtualRendererSize : function (containerSize) {
        this._vitualSize = cc.size(containerSize);
        this.setContentSize(containerSize);
    },
    getVirtualRendererSize : function () {
        if(this._vitualSize){
            return cc.size(this._vitualSize);
        }
        else{
            return ccui.Widget.prototype.getVirtualRendererSize.call(this);
        }
    }
});