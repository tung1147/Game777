/**
 * Created by QuyetNguyen on 11/15/2016.
 */

var LaucherStatus = LaucherStatus || {};
LaucherStatus.OnLoadNotRun = 0;
LaucherStatus.OnLoadResources = 1;
LaucherStatus.OnWaitingLoadResources = 2;
LaucherStatus.OnLoadTexture = 3;
LaucherStatus.OnLoadFonts = 4;
LaucherStatus.OnLoadSound = 5;
LaucherStatus.OnLoadFinished = 6;

var GameLaucher = cc.Class.extend({
    ctor : function () {
        this.itemLoaded = 0;
        this.status = LaucherStatus.OnLoadNotRun;
    },
    start : function () {
        cc.director.getScheduler().scheduleUpdate(this, 0, false);
        this.status = LaucherStatus.OnLoadResources;
    },
    stop : function () {
        cc.director.getScheduler().unscheduleUpdate(this);
    },
    setStatus : function (status) {
        this.status = status;
        var runningScene = cc.director.getRunningScene();
        if(runningScene.onUpdateStatus){
            runningScene.onUpdateStatus(this.status);
        }
    },
    update : function (dt) {
        switch (this.status){
            case (LaucherStatus.OnLoadResources):{
                this.updateLoadResources(dt);
                break;
            }
            case (LaucherStatus.OnLoadTexture):{
                this.updateLoadTexture(dt);
                break;
            }
            case (LaucherStatus.OnLoadFonts):{
                this.updateLoadFont();
                break;
            }
            case (LaucherStatus.OnLoadSound):{
                this.updateLoadSound();
                break;
            }
        }
    },
    updateLoadResources : function (dt) {
        this.setStatus(LaucherStatus.OnWaitingLoadResources);

        var thiz = this;
        cc.loader.load(s_resource,
        function (result, count, loadedCount) {
            var runningScene = cc.director.getRunningScene();
            if(runningScene.updateLoadResources){
                runningScene.updateLoadResources(loadedCount + 1, count);
            }
        }, function () {
            thiz.itemLoaded = 0;
            thiz.setStatus(LaucherStatus.OnLoadTexture);
        });
    },
    updateLoadTexture : function (dt) {
        if(this.itemLoaded >= s_texture.length){
            this.itemLoaded = 0;
            this.setStatus(LaucherStatus.OnLoadFonts);
        }
        else{
            var texture = s_texture[this.itemLoaded];
            this.itemLoaded++;
            cc.spriteFrameCache.addSpriteFrames(texture.plist, texture.img);

            var runningScene = cc.director.getRunningScene();
            if(runningScene.updateLoadTexture){
                runningScene.updateLoadTexture(this.itemLoaded, s_texture.length);
            }
        }
    },
    updateLoadFont : function () {
        this.itemLoaded = 0;
        this.setStatus(LaucherStatus.OnLoadSound);
    },
    updateLoadSound : function () {
        this.itemLoaded = 0;
        this.setStatus(LaucherStatus.OnLoadFinished);
        this.stop();
    }
});