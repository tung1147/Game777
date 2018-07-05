/**
 * Created by Quyet Nguyen on 4/6/2017.
 */

var WidgetButton = ccui.Widget.extend({
    ctor : function (contentSize) {
        this._super();
        if(contentSize){
            this.setContentSize(contentSize);
        }
        this.setTouchEnabled(true);
    }
});