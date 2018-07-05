/**
 * Created by Quyet Nguyen on 6/30/2016.
 */

var IScene = cc.Scene.extend({
    sceneLayer:null,
    popupLayer:null,
    winSize:null,
    screenScale:null,
    ctor : function () {
        this._super();
        this.type = "IScene";
        this.winSize = cc.winSize;
        this.screenScale = this.winSize.width / 1280.0;

        this.sceneLayer = new cc.Node();
        this.addChild(this.sceneLayer, 0);

        this.popupLayer = new cc.Node();
        this.addChild(this.popupLayer, 100);

        this.messageLayer = new cc.Node();
        this.addChild(this.messageLayer, 101);

        this.floatButtonLayer = new cc.Node();
        this.addChild(this.floatButtonLayer, 2);
    },

    onExit : function () {
        if(this.miniGameLayer){
            this.miniGameLayer.removeAllChildren(false);
        }
        this._super();
        this.popupLayer.removeAllChildren(true);
        this.messageLayer.removeAllChildren(true);
    },

    onEnter : function () {
        this._super();
        cc.director.setClearColor(cc.color(0,0,0,0));
    }
});