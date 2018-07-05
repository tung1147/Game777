/**
 * Created by Quyet Nguyen on 3/21/2017.
 */

_arrPosRankVQ = [22, 157, 404];
var RankVongQuay = Dialog.extend({
    ctor : function () {
        this._super();


        this.okButton.visible = false;
        this.cancelButton.visible = false;
        this.title.setString("Bảng xếp hạng");
        this.initWithSize(cc.size(600, 340));

        var listItem = new newui.TableView(cc.size(544, 230), 1);
        listItem.setPosition(cc.p(125, 100));
        this.addChild(listItem);
        this.listItem = listItem;
        var arrName = ["Top","Người chơi","Vàng thắng"] ;
        for(var i = 0; i < 3; i++){
            var timeLaybel =  new cc.LabelTTF(arrName[i],cc.res.font.Roboto_Condensed, 20);
            timeLaybel.setPosition(_arrPosRankVQ[i]+125,355);
            timeLaybel.setColor(cc.color(87, 110, 176,255));
            this.addChild(timeLaybel);
        }
        // for(var i= 0; i<20;i++){
        //     this.addItem("1","aaa",1000);
        // }
    },
    onSFSExtension: function (messageType, content) {

        if(content.c == 506){
                var arr = content.p[1];
            for(var i= 0; i<arr.length;i++){
                var name = arr[i][1];
                if (name.length > 15)
                    name = name.substring(0, 15) ;
                if (name.length > 3 && name != PlayerMe.username)
                    name = name.substring(0, name.length - 3) + "***";

                this.addItem(i+1,name,arr[i][2]);
            }
        }
    },
    addItem:function (timeCreate, userName,gold) {
        var container = new ccui.Widget();
        container.setContentSize(cc.size(544, 60));
        this.listItem.pushItem(container);
        var bg = new ccui.Scale9Sprite("activity_cell_bg.png", cc.rect(10, 10, 4, 4));
        bg.setPreferredSize(cc.size(544, 55));
        bg.setPosition(container.getContentSize().width/2, container.getContentSize().height/2);

        var timeLaybel =  new cc.LabelTTF(timeCreate,cc.res.font.Roboto_Condensed, 20);
        // timeLaybel.setDimensions(150,0);
        // timeLaybel.setAnchorPoint(0,0.5);
        timeLaybel.setPosition(_arrPosRankVQ[0],30);
        bg.addChild(timeLaybel);

        var nameLabel = new cc.LabelTTF(userName,cc.res.font.Roboto_Condensed, 20);
        nameLabel.setPosition(_arrPosRankVQ[1],30);
        bg.addChild(nameLabel);

        var goldLabel = new cc.LabelTTF(cc.Global.NumberFormat1(parseInt(gold)),cc.res.font.Roboto_Condensed, 20);
        // goldLabel.setAnchorPoint(1,0.5);
        goldLabel.setColor(cc.color(255, 194, 0,255));
        goldLabel.setPosition(_arrPosRankVQ[2],30);
        bg.addChild(goldLabel);

        container.addChild(bg);
    },

    onEnter : function () {
        this._super();
        SmartfoxClient.getInstance().addListener(socket.SmartfoxClient.CallExtension, this.onSFSExtension, this);
    },



    onExit : function () {
        this._super();
        SmartfoxClient.getInstance().removeListener(this);
    }
});

