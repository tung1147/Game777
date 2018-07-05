/**
 * Created by Quyet Nguyen on 3/21/2017.
 */

_arrPosHisotyVQ = [15, 189, 318, 431];

var STRING_VONG_LON = ["","500","1,000","2,000","5,000","10,000","20,000","50,000","100,000","200,000","500,000","100 EXP","Goodluck!"];

var STRING_VONG_NHO = ["","500","1,000","5,000", "10,000", "50,000","100,000","100 EXP","Thêm lượt"];


var HistoryVongQuay = Dialog.extend({
    ctor : function () {
        this._super();


        this.okButton.visible = false;
        this.cancelButton.visible = false;
        this.title.setString("Lịch sử");
        this.initWithSize(cc.size(600, 340));
        var listItem = new newui.TableView(cc.size(548, 230), 1);
        listItem.setPosition(cc.p(125, 100));
        this.addChild(listItem);
        this.listItem = listItem;
        var arrName = ["Giờ","ID","Vòng lớn" , "Vòng nhỏ"] ;
        for(var i = 0; i < 4; i++){
            var timeLaybel =  new cc.LabelTTF(arrName[i],cc.res.font.Roboto_Condensed, 20);
            timeLaybel.setAnchorPoint(cc.p(0,0.5));
            timeLaybel.setPosition(_arrPosHisotyVQ[i]+125,355);
            timeLaybel.setColor(cc.color(87, 110, 176,255));
            this.addChild(timeLaybel);
        }
        // for(var i= 0; i<20;i++){
        //     this.addItem("1","aaa",1000,1000);
        // }
    },
    onSFSExtension: function (messageType, content) {

        if(content.c == 505){
            var arr = content.p[1];
            for(var i = 0; i < arr.length; i++){
                var temp = arr[i];
                var name = temp[1];
                if (name.length > 15)
                    name = name.substring(0, 15) ;
                if (name.length > 3 && name != PlayerMe.username)
                    name = name.substring(0, name.length - 3) + "***";
                    this.addItem(temp[3],name,STRING_VONG_LON[temp[4]],STRING_VONG_NHO[temp[5]]);
            }
        }
    },
    addItem:function (timeCreate, userName,gold,gold2) {
        var container = new ccui.Widget();
        container.setContentSize(cc.size(548, 60));
        this.listItem.pushItem(container);
        var bg = new ccui.Scale9Sprite("activity_cell_bg.png", cc.rect(10, 10, 4, 4));
        bg.setPreferredSize(cc.size(548, 55));
        bg.setPosition(container.getContentSize().width/2, container.getContentSize().height/2);

        var timeLaybel =  new cc.LabelTTF(timeCreate,cc.res.font.Roboto_Condensed, 20);
        timeLaybel.setPosition(_arrPosHisotyVQ[0],30);
        bg.addChild(timeLaybel);
        timeLaybel.setAnchorPoint(cc.p(0,0.5));
        var nameLabel = new cc.LabelTTF(userName,cc.res.font.Roboto_Condensed, 20);
        nameLabel.setPosition(_arrPosHisotyVQ[1],30);
        bg.addChild(nameLabel);
        nameLabel.setAnchorPoint(cc.p(0,0.5));
        var goldLabel = new cc.LabelTTF(gold,cc.res.font.Roboto_Condensed, 20);
        goldLabel.setColor(cc.color(255, 194, 0,255));
        goldLabel.setPosition(_arrPosHisotyVQ[2],30);
        bg.addChild(goldLabel);
        goldLabel.setAnchorPoint(cc.p(0,0.5));


        var goldLabel2 = new cc.LabelTTF(gold2,cc.res.font.Roboto_Condensed, 20);
        goldLabel2.setColor(cc.color(255, 194, 0,255));
        goldLabel2.setPosition(_arrPosHisotyVQ[3],30);
        bg.addChild(goldLabel2);
        goldLabel2.setAnchorPoint(cc.p(0,0.5));

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

