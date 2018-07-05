/**
 * Created by Quyet Nguyen on 7/16/2016.
 */

var UserAvatar = cc.Node.extend({
    ctor : function () {
        this._super();
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this._setDefaultAvatar();
    },

    _setDefaultAvatar : function () {
        if(this.avatarImg){
            this.avatarImg.removeFromParent(true);
            this.avatarImg = 0;
        }

        this.avatarImg = new cc.Sprite("#avatarDefault.png");
        this.setContentSize(this.avatarImg.getContentSize());
        this.avatarImg.setPosition(this.getContentSize().width/2, this.getContentSize().height/2);
        this.addChild(this.avatarImg);
    },
    
    _setAvatarWithTexture : function (texture) {
        if(this.avatarImg){
            this.avatarImg.removeFromParent(true);
            this.avatarImg = 0;
        }

        this.avatarImg = new cc.Sprite(texture);
        this.avatarImg.setPosition(this.getContentSize().width/2, this.getContentSize().height/2);
        this.addChild(this.avatarImg);

        var scaleX = this.getContentSize().width / this.avatarImg.getContentSize().width;
        var scaleY = this.getContentSize().height / this.avatarImg.getContentSize().height;
        var scale = scaleX < scaleY ? scaleX : scaleY;
        if(scale < 1.0){
            this.avatarImg.setScale(scale);
        }
    },

    setAvatar : function (url) {
        if(!url || url == ""){
            return;
        }

        var thiz = this;
        TextureDownloader.load(url, function (tex) {
            if(tex){
                thiz._setAvatarWithTexture(tex);
            }
        });
    },
    
    setAvatarMe : function () {
        this.setAvatar(PlayerMe.avatar);
    }

    // _setAvatar : function (avatarImg) {
    //     this.avatarImg.setSpriteFrame(avatarImg);
    //     this.setContentSize(this.avatarImg.getContentSize());
    //     this.avatarImg.setPosition(this.getContentSize().width/2, this.getContentSize().height/2);
    // },

    // serAvatarId : function (avatarId) {
    //     this.avatarId = avatarId;
    //     if(avatarId >= 1 && avatarId <= 20){
    //         this._setAvatar("avatar"+ avatarId+".png");
    //     }
    //     else{
    //         this._setAvatar("avatarDefault.png");
    //     }
    // }
});

var UserAvatarMe = UserAvatar.extend({
    ctor : function () {
        this._super();
        LobbyClient.getInstance().addListener("inventory", this.onChangeRefeshUserInfo, this);
        LobbyClient.getInstance().addListener("updateItem", this.onChangeRefeshUserInfo, this);
        this.setAvatarMe();
    },

    onEnter : function () {
        this._super();
    },

    onExit : function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
    },

    onChangeRefeshUserInfo : function () {
        this.setAvatarMe();
    }
});

UserAvatar.createMe = function () {
    var avt = new UserAvatarMe();
    return avt;
};

UserAvatar.createAvatar = function () {
    var avt = new UserAvatar();
    return avt;
};

UserAvatar.createAvatarWithId = function (avatarId) {
    var avt = new UserAvatar();
    avt.setAvatar(avatarId);
    return avt;
};
