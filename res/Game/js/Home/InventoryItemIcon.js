/**
 * Created by Quyet Nguyen on 4/4/2017.
 */

var InventoryItemIcon = cc.Node.extend({
    ctor : function () {
        this._super();
        var defaultItem = new cc.Sprite("#inventory_defaultItem.png");
        this.setContentSize(defaultItem.getContentSize());
        this.setAnchorPoint(cc.p(0.5, 0.5));
        defaultItem.setPosition(this.getContentSize().width/2, this.getContentSize().height/2);
        this.addChild(defaultItem);
        this.imgSprite = defaultItem;
    },

    _setItemWithTexture : function (texture) {
        if(this.imgSprite){
            this.imgSprite.removeFromParent(true);
            this.imgSprite = 0;
        }

        this.imgSprite = new cc.Sprite(texture);
        this.imgSprite.setPosition(this.getContentSize().width/2, this.getContentSize().height/2);
        this.addChild(this.imgSprite);

        var scaleX = this.getContentSize().width / this.imgSprite.getContentSize().width;
        var scaleY = this.getContentSize().height / this.imgSprite.getContentSize().height;
        var scale = scaleX < scaleY ? scaleX : scaleY;
        if(scale < 1.0){
            this.imgSprite.setScale(scale);
        }
    },
    
    loadFromUrl : function (url) {
        if(!url || url == ""){
            return;
        }

        var thiz = this;
        TextureDownloader.load(url, function (tex) {
            if(tex){
                thiz._setItemWithTexture(tex);
            }
        });
    }
});