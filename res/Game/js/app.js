


var HelloWorldLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        var winSize = cc.winSize;
        var thiz = this;

        var label = new cc.LabelTTF("testlabel", "res/fonts/Roboto-BoldCondensed.ttf", 30);
        label.x = cc.winSize.width/2;
        label.y = cc.winSize.height/2 + 100.0;
        this.addChild(label);

        // var button = new ccui.Button("10b.png","","", ccui.Widget.PLIST_TEXTURE);
        // button.x = winSize.width/2;
        // button.y = winSize.height/2;
        // button.addClickEventListener(function () {
        //     FacebookPlugin.getInstance().showLogin();
        // });
        // this.addChild(button);

        var text = new newui.TextField(cc.size(200,50), "res/fonts/Roboto-BoldCondensed.ttf", 30);
        text.setPlaceHolder("setPlaceHolder");
        text.setText("text");
        text.x = cc.winSize.width/2;
        text.y = cc.winSize.height/2;
        text.setReturnCallback(function () {
            label.setString(text.getText());
            text.setText("");
            return true;
        });
        this.addChild(text);

        return true;
    },
    
    onEvent : function (obj) {
        data = obj.getUserData().name;
        cc.log("onevent" + data);
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

