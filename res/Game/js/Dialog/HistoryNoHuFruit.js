

var HistoryNoHuFruit = Dialog.extend({
    ctor: function () {
        this._super();

        this.bouldingWidth = 720;

        this.initWithSize(cc.size(720, 440));
        this.okButton.visible = false;
        this.cancelButton.visible = false;
        this.title.setString("LỊCH SỬ NỔ HŨ TRÁI CÂY");

        var listItem = new newui.TableView(cc.size(681, 380), 1);
        listItem.setPosition(cc.p(118, 100));
     //   listItem.setMargin(20,20,0,0);
     //   listItem.setPadding(10);
        this.addChild(listItem);
        this.listItem = listItem;
        // for(var i = 0; i < 20; i++){
        //     this.addItem("22/11/2016 14:04:48","1231231","1312");
        // }

    },

    addItem:function (timeCreate, userName,gold) {
        var container = new ccui.Widget();
        container.setContentSize(cc.size(680, 80));
        this.listItem.pushItem(container);
        var bg = new ccui.Scale9Sprite("activity_cell_bg.png", cc.rect(10, 10, 4, 4));
        bg.setPreferredSize(cc.size(680, 70));
        bg.setPosition(container.getContentSize().width/2, container.getContentSize().height/2);

        var timeLaybel =  new cc.LabelTTF(timeCreate,cc.res.font.Roboto_Condensed, 24);
        timeLaybel.setDimensions(150,0);
        // timeLaybel.setAnchorPoint(0,0.5);
        timeLaybel.setPosition(_arrPosHisotyMB[0],35);
        bg.addChild(timeLaybel);

        var nameLabel = new cc.LabelTTF(userName,cc.res.font.Roboto_Condensed, 24);
        nameLabel.setPosition(_arrPosHisotyMB[1],35);
        bg.addChild(nameLabel);

        var goldLabel = new cc.LabelTTF(gold,cc.res.font.Roboto_Condensed, 24);
        goldLabel.setAnchorPoint(1,0.5);
        goldLabel.setColor(cc.color(255, 194, 0,255));
        goldLabel.setPosition(_arrPosHisotyMB[2],35);
        bg.addChild(goldLabel);

        container.addChild(bg);
    },

    onSFSExtension: function (messageType, content) {

        if(content.c == 100001){
            var items = content.p["data"]["1"];
            for(var i=0;i<items.length;i++){
                var time = items[i]["1"];
                var name = items[i]["3"];
                if (name.length > 15)
                    name = name.substring(0, 15) ;
                if (name.length > 3 && name != PlayerMe.username)
                    name = name.substring(0, name.length - 3) + "***";
                var money =  items[i]["4"];//cc.Global.NumberFormat1(parseInt());

                this.addItem(time,name,money);
            }
        }
    },
    onEnter: function () {
        this._super();
        SmartfoxClient.getInstance().addListener(socket.SmartfoxClient.CallExtension, this.onSFSExtension, this);
       SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom( "1007", null);
    },
    onExit: function () {
        this._super();
        SmartfoxClient.getInstance().removeListener(this);
    },

});