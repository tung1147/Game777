/**
 * Created by Quyet Nguyen on 7/11/2016.
 */




var LoadingDialog = (function() {
    var instance = null;
    var LoadingDialogClass = cc.Node.extend({
        ctor : function () {
            this._super();
            var colorLayer = new cc.LayerColor(cc.color(0,0,0,180), cc.winSize.width, cc.winSize.height);
            this.addChild(colorLayer);
            this.timeOut = 30.0;

            var loadingSpin = new cc.Sprite("#dialog-loading-spin.png");
            loadingSpin.setPosition(cc.winSize.width/2, cc.winSize.height/2);
            this.addChild(loadingSpin);
            this.loadingSpin = loadingSpin;

            var loadingMessage = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "Loading");
            loadingMessage.setPosition(cc.winSize.width/2, cc.winSize.height/2 - 100);
            this.addChild(loadingMessage);
            this.loadingMessage = loadingMessage;
        },
        onEnter : function () {
            this._super();
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches:true,
                onTouchBegan : function () {
                    return true;
                }
            }, this);

            this.loadingSpin.runAction(new cc.RepeatForever(new cc.RotateBy(1.0, 360.0)));
            this.timeOut = 30.0;
            this.scheduleUpdate();
        },
        onExit : function () {
            this._super();
            cc.eventManager.removeListeners(this);
            this.loadingSpin.stopAllActions();
            this.unscheduleUpdate();
        },
        show : function () {
            var parent = this.getParent();
            if(parent){
                parent.removeChild(this);
            }

            var mScene = cc.director.getRunningScene();
            if(mScene.popupLayer){
                mScene.popupLayer.addChild(this,10);
                //mScene.addChild(this,10);
            }
            else{
                mScene.addChild(this,10);
            }
            if(arguments.length == 1){
                this.setMessage(arguments[0]);
            }
        },
        setMessage : function (message) {
            this.loadingMessage.setString(message);
        },
        hide : function () {
            var parent = this.getParent();
            if(parent){
                parent.removeChild(this);
            }
        },
        isShow : function () {
            var parent = this.getParent();
            if(parent){
                return true;
            }
            return false;
        },
        update : function (dt) {
            if(this.timeOut < 0){
                this.hide();
                SceneNavigator.toHome("Hết thời gian kết nối máy chủ");
            }
            else{
                this.timeOut -= dt;
            }
        }
    });

    LoadingDialogClass.getInstance = function() {
        if (!instance) {
            instance = new LoadingDialogClass();
            instance.retain();
        }
        return instance;
    };

    return LoadingDialogClass;
})();