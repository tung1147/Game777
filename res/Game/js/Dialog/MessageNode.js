/**
 * Created by Quyet Nguyen on 7/11/2016.
 */

var MessageNode = (function() {
    var instance = null;
    var MessageNodeClass = cc.Node.extend({
        ctor : function () {
            this._super();
            // var colorLayer = new cc.LayerColor(cc.color(0,0,0,180), cc.winSize.width, cc.winSize.height);
            // this.addChild(colorLayer);

            var bg = new cc.Sprite("#dialog-message-bg.png");
            bg.setPosition(cc.winSize.width/2, cc.winSize.height/2);
            this.addChild(bg);

            var messageLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "Loading");
            messageLabel.setPosition(cc.winSize.width/2, cc.winSize.height/2);
            this.addChild(messageLabel);
            this.messageLabel = messageLabel;
        },
        onEnter : function () {
            this._super();
            var thiz = this;
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches:true,
                onTouchBegan : function () {
                    return true;
                },
                onTouchEnded : function () {
                    thiz.hide();
                }
            }, this);
        },
        onExit : function () {
            this._super();
            cc.eventManager.removeListeners(this);
            this.stopAllActions();
        },
        show : function (message,time,mScene) {
            var parent = this.getParent();
            if(parent){
                parent.removeChild(this);
            }

            if(!mScene){
                mScene = cc.director.getRunningScene();
            }

            if(mScene.messageLayer){
                mScene.messageLayer.addChild(this,1)
            }
            else{
                mScene.addChild(this,1);
            }
            if(time){
                this.setMessage(message);
                this.showWithTime(time);
            }
            else{
                this.setMessage(message);
                this.showWithTime(3.0);
            }
        },
        showWithParent : function (message, parent) {
            var _parent = this.getParent();
            if(_parent == parent){
                this.setMessage(message);
                this.showWithTime(3.0);
                return;
            }
            if(_parent ){
                _parent.removeChild(this);
            }

            this.setMessage(message);
            this.showWithTime(3.0);
            parent.addChild(this, 1);
        },
        showWithTime : function (time) {
            var thiz = this;
            this.stopAllActions();
            this.runAction(new cc.Sequence(new cc.DelayTime(time), new cc.CallFunc(function () {
                thiz.hide();
            })));
        },
        setMessage : function (message) {
            this.messageLabel.setString(message);
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
        }
    });

    MessageNodeClass.getInstance = function() {
        if (!instance) {
            instance = new MessageNodeClass();
            instance.retain();
        }
        return instance;
    }

    return MessageNodeClass;
})();