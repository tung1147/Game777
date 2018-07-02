/**
 * Created by QuyetNguyen on 11/9/2016.
 */
var cc = cc || {};
cc.CustomAction = cc.ActionInterval.extend({
    ctor : function () {
        this._super();
    },

    stop:function () {
        if(this.onStop){
            this.onStop();
        }
    },
    update:function (dt) {
        if(this.onUpdate){
            this.onUpdate(dt);
        }
    },

    startWithTarget:function (target) {
        this._super(target);
        if(this.onStartWithTarget){
            this.onStartWithTarget(target);
        }
    }
});