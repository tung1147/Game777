/**
 * Created by QuyetNguyen on 12/1/2016.
 */

var WebSprite = cc.Node.extend({
    ctor : function (size) {
        this._super();
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this._fixSize = false;

        if(size){
            this._setFixSize(size);
        }
    },

    _setFixSize : function (size) {
        this._fixSize = true;
        this.setContentSize(size);
    },

    _setImageSprite : function (sprite) {
        if(this.imgSprite){
            this.imgSprite.removeFromParent(true);
            this.imgSprite = null;
        }

        if(this._fixSize){
            var ratioX = this.getContentSize().width / sprite.getContentSize().width;
            var ratioY = this.getContentSize().height / sprite.getContentSize().height;
            var ratio = ratioX < ratioY ? ratioX : ratioY;
            if(ratio < 1.0){
                sprite.setScale(ratio);
            }
        }
        else{
            this.setContentSize(sprite.getContentSize());
        }

        sprite.setPosition(this.getContentSize().width/2, this.getContentSize().height/2);
        this.addChild(sprite);
        this.imgSprite = sprite;
    },

    loadDefault : function (sprite) {
        if(sprite){
            var imgSprite = new cc.Sprite(sprite);
            this._setImageSprite(imgSprite);
        }
    },

    reloadFromURL : function (url) {
        var thiz = this;
        TextureDownloader.load(url, function (tex) {
            if(tex){
                var imgSprite = new cc.Sprite(tex);
                thiz._setImageSprite(imgSprite);
            }
        });
    }
});