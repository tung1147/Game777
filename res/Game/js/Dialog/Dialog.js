/**
 * Created by Quyet Nguyen on 7/11/2016.
 */

var s_Dialog_Create_Button1 = function (size, title) {
    var bt = new ccui.Button("dialog-button-1.png", "", "", ccui.Widget.PLIST_TEXTURE);
    bt.setScale9Enabled(true);
    bt.setCapInsets(cc.rect(10,10,4,4));
    bt.setContentSize(size);
    if(title){
        var btTitle = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, title);
        btTitle.setColor(cc.color("#682e2e"));
        btTitle.setPosition(size.width/2, size.height/2);
        bt.getRendererNormal().addChild(btTitle);
        bt.buttonTitleLabel = btTitle;
    }
    return bt;
};

var s_Dialog_Create_Button2 = function (size, title) {
    var bt = new ccui.Button("dialog-button-2.png", "", "", ccui.Widget.PLIST_TEXTURE);
    bt.setScale9Enabled(true);
    bt.setCapInsets(cc.rect(10,10,4,4));
    bt.setContentSize(size);
    if(title){
        var btTitle = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_18, title);
        btTitle.setColor(cc.color("#40485a"));
        btTitle.setPosition(size.width/2, size.height/2);
        bt.getRendererNormal().addChild(btTitle);
        bt.buttonTitleLabel = btTitle;
    }
    return bt;
};

var IDialog = cc.Node.extend({
    ctor : function () {
        this._super();
        this._isShow = false;
        this.mTouch = cc.rect(0,0,0,0);
        this.setAnchorPoint(cc.p(0.5, 0.5));

        this._maxLeft = 0;
        this._maxRight = cc.winSize.width;
        this._maxBottom = 0;
        this._maxTop = cc.winSize.height;

        // var colorLayer = new cc.LayerColor(cc.color(0,0,0,180), cc.winSize.width, cc.winSize.height);
        // this.addChild(colorLayer);
        //
        // var dialogNode = new cc.Node();
        // dialogNode.setAnchorPoint(cc.p(0.5, 0.5));
        // dialogNode.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        // this.addChild(dialogNode);
        // this = dialogNode;
    },
    adjustlel : function () {

    },
    show : function (rootNode) {
        this._isShow = true;
        var parentNode = this.getParent();
        if(parentNode){
            this.removeFromParent(true);
            parentNode.removeFromParent(true);
            parentNode = null;
        }

        if(!rootNode){
            rootNode = cc.director.getRunningScene();
        }

        if(rootNode){
            if(rootNode.popupLayer){
                parentNode = rootNode.popupLayer;
            }
            else{
                parentNode = rootNode;
            }

            this.setPosition(cc.winSize.width/2, cc.winSize.height/2);
            if(!this._bgColor){
                this._bgColor = cc.color(0,0,0,180);
            }
            var colorLayer = new cc.LayerColor(this._bgColor, cc.winSize.width, cc.winSize.height);
            colorLayer.addChild(this);
            parentNode.addChild(colorLayer);
        }
    },
    showWithAnimationScale : function () {
        Dialog.prototype.show.apply(this, arguments);

        var defaultScale = this.getScale();
        this.setScale(0.0);
        var scaleAction = new cc.EaseElasticOut(new cc.ScaleTo(0.7, defaultScale));
        this.runAction(scaleAction);
    },
    showWithAnimationMove : function () {
        Dialog.prototype.show.apply(this, arguments);

        this.y = cc.winSize.height + this.getContentSize().height/2;
        var moveAction = new cc.EaseBounceOut(new cc.MoveTo(0.7, cc.p(cc.winSize.width/2, cc.winSize.height/2)));
        this.runAction(moveAction);
    },
    hide : function () {
        this._isShow = false;
        var parent = this.getParent();
        if(parent){
            this.removeFromParent(true);
            parent.removeFromParent(true);
        }
    },

    isShow : function () {
        //return this._running;
        return this._isShow;
    },

    onTouchDialog : function () {

    },

    onExit : function () {
        this._super();
        this._isShow = false;
    },

    onEnter : function () {
        this._super();
        this._isShow = true;

        var thiz = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan : function (touch, event) {
                if(thiz._moveEnable){
                    var p = thiz.convertToNodeSpace(touch.getLocation());
                    if(cc.rectContainsPoint(thiz.mTouch, p)){
                        thiz.onTouchDialog();
                        return true;
                    }
                    return false;
                }
                else{
                    var p = thiz.convertToNodeSpace(touch.getLocation());
                    if(cc.rectContainsPoint(thiz.mTouch, p)){
                        thiz._touchInside = true;
                        thiz.adjustlel();
                    }
                    return true;
                }
                return false;
            },
            onTouchMoved : function (touch, event){
                if(thiz._moveEnable){
                    thiz.moveDialog(touch.getDelta());
                }
            },
            onTouchEnded : function (touch, event) {
                if(thiz._moveEnable){

                }
                else{
                    if(thiz._touchInside){
                        thiz._touchInside = false;
                        return;
                    }
                    var p = thiz.convertToNodeSpace(touch.getLocation());
                    if(!cc.rectContainsPoint(thiz.mTouch, p)){
                        thiz.hide();
                    }
                }
                cc.log(thiz._moveEnable);
            }
        }, this);
    },

    moveDialog : function (ds) {
        this.x += ds.x;
        this.y += ds.y;
        if(this.x < this._maxLeft){
            this.x = this._maxLeft;
        }
        if(this.x > this._maxRight){
            this.x = this._maxRight;
        }
        if(this.y < this._maxBottom){
            this.y = this._maxBottom;
        }
        if(this.y > this._maxTop){
            this.y = this._maxTop;
        }
    }
});

var Dialog = IDialog.extend({
    ctor : function () {
        this._super();
        this._marginLeft = 98.0;
        this._marginRight = 98.0;
        this._marginTop = 98.0;
        this._marginBottom = 98.0;

        var dialogBg = new ccui.Scale9Sprite("dialog-bg.png", cc.rect(120,186,4,4));
        dialogBg.setAnchorPoint(cc.p(0.0,0.0));
        this.addChild(dialogBg);

        var title = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "Title");
        title.setColor(cc.color("#c5e2ff"));
        this.addChild(title);

        var closeButton = new ccui.Button("dialog-button-close.png","","", ccui.Widget.PLIST_TEXTURE);
        this.addChild(closeButton);

        var okButton = s_Dialog_Create_Button1(cc.size(182, 60), "OK");
        this.addChild(okButton);

        var cancelButton = s_Dialog_Create_Button2(cc.size(182, 60), "CANCEL");
        this.addChild(cancelButton);

        this.dialogBg = dialogBg;
        this.title = title;
        this.closeButton = closeButton;
        this.okButton = okButton;
        this.cancelButton = cancelButton;
        this.okTitle = okButton.buttonTitleLabel;
        this.cancelTitle = cancelButton.buttonTitleLabel;

        var thiz = this;
        closeButton.addClickEventListener(function () {
            if(thiz.closeButtonHandler){
                thiz.closeButtonHandler();
            }
        });

        okButton.addClickEventListener(function () {
            if(thiz.okButtonHandler){
                thiz.okButtonHandler();
            }
        });

        cancelButton.addClickEventListener(function () {
            if(thiz.cancelButtonHandler){
                thiz.cancelButtonHandler();
            }
        });
    },

    initWithSize : function (mSize) {
        this.dialogBg.setPreferredSize(cc.size(mSize.width + this._marginLeft + this._marginRight, mSize.height + this._marginTop + this._marginBottom));
        this.setContentSize(this.dialogBg.getContentSize());

        this.title.setPosition(this.getContentSize().width/2, this.getContentSize().height - 127.0);
        this.closeButton.setPosition(this.getContentSize().width - 127.0, this.title.y);
        this.okButton.setPosition(this.getContentSize().width/2 - this.okButton.getContentSize().width/2 - 15.0, 156);
        this.cancelButton.setPosition(this.getContentSize().width/2 + this.cancelButton.getContentSize().width/2 + 15.0, 156);

        this.mTouch = cc.rect(this._marginLeft, this._marginBottom, mSize.width, mSize.height);

        this._maxLeft = mSize.width/2 + 4;
        this._maxRight = cc.winSize.width - mSize.width/2 - 4;
        this._maxBottom = mSize.height/2 + 4;
        this._maxTop = cc.winSize.height - mSize.height/2 - 4;
    },

    closeButtonHandler : function () {
        this.hide();
    }
});