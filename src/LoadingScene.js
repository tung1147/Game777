/**
 * Created by Quyet Nguyen on 9/21/2016.
 */

var GameLaucherStatus = GameLaucherStatus || {};
GameLaucherStatus.GetUpdate = 0;
GameLaucherStatus.TestVersion = 1;
GameLaucherStatus.TestHashFiles = 2;
GameLaucherStatus.Updating = 3;
GameLaucherStatus.UpdateFailure = 4;
GameLaucherStatus.LoadResource = 5;
GameLaucherStatus.LoadScript = 6;
GameLaucherStatus.LoadAndroidExt = 7;
GameLaucherStatus.Finished = 8;

var __BYTES = 1024;
var __K_BYTES = __BYTES * 1024;
var __M_BYTES = __K_BYTES * 1024;
var __G_BYTES = __M_BYTES * 1024;

var LoadingScene = cc.Scene.extend({
    ctor : function () {
        this._super();
        var bg = new cc.Sprite("src/loading_bg.jpg");
        bg.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        this.addChild(bg);

        var label = new ccui.Text("Đang kiểm tra phiên bản", "arial", 30);
        label.setPosition(cc.winSize.width/2, 200);
        this.title = label;
        this.addChild(label);
    },

    nextScene : function () {
      //  SystemPlugin.getInstance().enableMipmapTexture("res/Card.png");
        cc.director.replaceScene(new HomeScene());
    },

    onEnter : function () {
        this._super();
        SystemPlugin.getInstance().startLaucher();

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyReleased: function (keyCode, e) {
                if(cc.sys.isNative){
                    if (parseKeyCode(keyCode) == cc.KEY.back) {
                        SystemPlugin.getInstance().exitApp();
                    }
                }
            }
        }, this);
    },

    onProcessStatus : function (status) {
        switch (status){
            case GameLaucherStatus.GetUpdate:
            {
                break;
            }
            case GameLaucherStatus.TestVersion:
            {
                break;
            }
            case GameLaucherStatus.TestHashFiles:
            {
                break;
            }
            case GameLaucherStatus.Updating:
            {
                this.title.setString("Đang tải cập nhật");
                break;
            }
            case GameLaucherStatus.UpdateFailure:
            {
                this.title.setString("Cập nhật thất bại");
                break;
            }
            case GameLaucherStatus.LoadResource:
            {
                this.title.setString("Đang tải tài nguyên");
                break;
            }
            case GameLaucherStatus.LoadScript:
            {
                this.title.setString("Đang vào game");
                break;
            }
            case GameLaucherStatus.LoadAndroidExt:
            {
                break;
            }
            case GameLaucherStatus.Finished:
            {
                this.nextScene();
                break;
            }
        }
    },

    onLoadResourceProcess : function (current, target) {
        this.title.setString("Đang tải tài nguyên[" + current + "/" + target + "]");
    },

    _formatBytesCount : function (bytes) {
        if (bytes < __BYTES) {
            return bytes.toString() + "B";
        }
        else if (bytes < __K_BYTES) {
            return (bytes / __BYTES).toFixed(2).toString() + "KB";
        }
        else if (bytes < __M_BYTES){
            return (bytes / __K_BYTES).toFixed(2).toString() + "MB";
        }
        else{
            return (bytes / __M_BYTES).toFixed(2).toString() + "GB";
        }
    },

    onUpdateDownloadProcess : function (current, target) {
        this.title.setString("Đang tải cập nhật[" + this._formatBytesCount(current) + "/" + this._formatBytesCount(target) + "]");
    }
});