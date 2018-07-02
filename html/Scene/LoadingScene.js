/**
 * Created by QuyetNguyen on 11/9/2016.
 */

var LoadingScene = cc.Scene.extend({
    ctor : function () {
        this._super();
        var bg = new cc.Sprite("res/loading_bg.jpg");
        bg.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        this.addChild(bg);

        // var logo = new cc.Sprite("#loading_logo.png");
        // logo.setPosition(bg.getPosition());
        // this.addChild(logo);
        //
        // var loadingText = new cc.Sprite("#loading_text_0.png");
        // loadingText.setPosition(bg.getPosition());
        // this.addChild(loadingText);
        //
        // var frames = [];
        // for(var i=0;i<20;i++){
        //     var spiteFrame = cc.spriteFrameCache.getSpriteFrame("loading_text_" + i + ".png");
        //     frames.push(spiteFrame);
        // }
        // var animation = new cc.Animation(frames, 0.1, 1);
        // loadingText.runAction(new cc.RepeatForever(new cc.Animate(animation)));


        var label = new cc.LabelTTF("", "arial", 20);
        label.setPosition(cc.winSize.width/2, 200);
        this.title = label;
        this.addChild(label);

        this.gameLaucher = new GameLaucher();
    },

    onEnter : function () {
        cc.director.replaceScene = cc.director.replaceScene || function (scene) {
            cc.director.runScene(scene);
        };

        this._super();
        this.schedule(this.startLoadResources, 0.3);
    },
    onExit : function () {
        this._super();
        this.gameLaucher.stop();
        this.gameLaucher = null;
    },
    startLoadResources : function () {
        this.unschedule(this.startLoadResources);
        this.gameLaucher.start();
    },

    nextScene : function () {
        if(cc._renderType === cc.game.RENDER_TYPE_WEBGL){
            var tex = cc.textureCache.getTextureForKey("res/Card.png");
            tex.generateMipmap();
            tex.setAntiAliasTexParameters();
            tex.setTexParameters(gl.LINEAR_MIPMAP_LINEAR, gl.LINEAR, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE);
        }

        this.backgroundLoading();
        cc.director.replaceScene(new HomeScene());
        //cc.director.replaceScene(new Phom());
    },

    updateLoadResources : function (current, target) {
        cc.log("updateLoadResources: "+current +"/"+target);
        this.title.setString("Đang tải "+current + "/"+target);
    },
    updateLoadTexture : function (current, target) {
        cc.log("updateLoadTexture: "+current +"/"+target);
        this.title.setString("Đang tải tài nguyên "+current + "/"+target);
    },
    onUpdateStatus : function (status) {
        cc.log("onUpdateStatus: "+status);
        if(status == LaucherStatus.OnLoadFinished){
            this.nextScene();
        }
    },

    backgroundLoading : function () {
        setTimeout(function () {
            cc.loader.load(s_sound,
                function (result, count, loadedCount) {

                }, function () {

                });
        }, 1000);
    },
});