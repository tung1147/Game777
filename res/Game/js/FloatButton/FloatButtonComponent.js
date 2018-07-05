/**
 * Created by Quyet Nguyen on 8/19/2016.
 */

var FloatButtomComponent = cc.Node.extend({
    ctor : function (gameId) {
        this._super();
        this.gameId = gameId;

        var img = new cc.Sprite("#floatBt-game-" + gameId + ".png");
        this.addChild(img);
        this.rectTouch = cc.rect(-img.getContentSize().width/2, -img.getContentSize().height/2, img.getContentSize().width, img.getContentSize().height);
        if(gameId == GameType.MiniGame_ChanLe){
            var newCountLayer = new MiniTaiXiuNotification();
            newCountLayer.setPosition(cc.p(30, 30));
            this.addChild(newCountLayer);
        }

    },
    show : function (duration) {
        this.visible = true;
        this.setPosition(cc.p(0,0));
        var rotateAngle = 72.0;
        var moveAction = new FloatButtonShowAnimation(duration);
        moveAction.targetPosition = this.targetPosition;
        moveAction.rotateAngle = rotateAngle;
        this.setRotation(-rotateAngle);
        var rotateAction = new cc.RotateTo(duration, 0);
        var action = new cc.Spawn(moveAction,rotateAction);

        this.stopAllActions();
        this.runAction(new cc.EaseSineOut(action));
    },
    hide : function (duration) {
        var rotateAngle = 72.0;
        var moveAction = new FloatButtonHideAnimation(duration);
        moveAction.targetPosition = cc.p(0,0);
        moveAction.rotateAngle = rotateAngle;
        var rotateAction = new cc.RotateTo(duration, -rotateAngle);
        var action = new cc.EaseSineIn(new cc.Spawn(moveAction,rotateAction));
        var thiz = this;
        var finishedAction = new cc.CallFunc(function () {
            thiz.visible = false;
        });

        this.stopAllActions();
        this.runAction(new cc.Sequence(action, finishedAction));
    },
    onEnter : function () {
        this._super();
        this.isTouch = false;

        var thiz = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan : function (touch, event) {
                if(thiz.isTouch){
                    return false;
                }
                var b = thiz.onTouchBegan(touch, event);
                if(b){
                    thiz.isTouch = true;
                }
                return b;
            },
            onTouchEnded : function (touch, event) {
                thiz.isTouch = false;
                thiz.onTouchEnded(touch, event);
            }
        }, this);
    },
    onExit : function () {
        this._super();
        cc.eventManager.removeListeners(this);
    },
    onTouchBegan : function (touch, event){
        if(!cc.Global.NodeIsVisible(this)){
            return false;
        }
        var p = this.convertToNodeSpace(touch.getLocation());
        if(cc.rectContainsPoint(this.rectTouch, p)){
            return true;
        }
        return false;
    },
    onTouchEnded : function (touch, event){
        var p = this.convertToNodeSpace(touch.getLocation());
        if(cc.rectContainsPoint(this.rectTouch, p)){
           // cc.log("clicked");
            MiniGameNavigator.showGame(this.gameId);
           //  var homeScene = cc.director.getRunningScene();
           //  homeScene.onTouchGame(this.gameId);
        }
    },
});