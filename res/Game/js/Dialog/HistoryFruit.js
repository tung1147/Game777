
_arrPosFruit = [44, 162, 335, 436, 547, 659];
var HistoryFruit = Dialog.extend({
    ctor: function () {
        this._super();
        this.bouldingWidth = 800;

        this.initWithSize(cc.size(800, 480));
        this.okButton.visible = false;
        this.cancelButton.visible = false;
        this.title.setString("LỊCH SỬ ĐẶT CƯỢC");
        this._createHistory();

        //
        //     for(var j=0; j < 20; j++){
        //
        //         var obj = {
        //             phien : "222",
        //             time : "aaa",// cc.Global.DateToString(new Date(time)),
        //             betting:100,
        //             lineBet : 100,
        //             lineWin : 100,
        //             moneyWin:100
        //         };
        //         this.arrHis.push(obj);
        //     }
        //
        //
        // this.listHis.refreshView();


    },

    _createHistory : function () {
        var mSize = cc.size(800, 350);
        var dx = 0.0;
        var thiz = this;

        this.arrHis = [];


        var arrTitle = ["Phiên","Thời gian","Mức cược","Số dòng","Dòng thắng", "Vàng nhận"];

        for(var i =0; i < arrTitle.length; i++){
            var lblTitle = new cc.LabelTTF(arrTitle[i], cc.res.font.Roboto_Condensed,20);
            lblTitle.setColor(cc.color(87, 110, 176,255));
            lblTitle.setPosition(_arrPosFruit[i]+100,480);
            lblTitle.setAnchorPoint(cc.p(0,0.5));
            this.addChild(lblTitle);
        }

        var listTai = new newui.ListViewWithAdaptor(mSize);
        listTai.setPosition(dx+100 , 100);
        this.addChild(listTai);
        listTai.setCreateItemCallback(function () {
            return thiz._createCell();
        });
        listTai.setSizeCallback(function () {
            return thiz.arrHis.length;
        });
        listTai.setItemAdaptor(function (idx, view) {
            thiz._setData(view, thiz.arrHis[idx]);
        });
        this.listHis = listTai;
    },
    _setData : function (view, data) {
        view.phienLabel.setString(data["phien"]);
        view.timeLabel.setString(data["time"]);


        view.bettingLabel.setString(cc.Global.NumberFormat1(data["betting"]));



        view.lineLabel.setString(cc.Global.NumberFormat1(data["lineBet"].toString()));
        view.lineWinLabel.setString(cc.Global.NumberFormat1(data["lineWin"]));
        view.receiewLabel.setString(data["moneyWin"]);

    },
    _createCell : function () {

        // var _arrPos = [61, 211, 362, 477, 605, 733, 857];
        var _arrPos = _arrPosFruit ;
        var container = new ccui.Widget();
        container.setContentSize(cc.size(800, 67));

        var bg = new ccui.Scale9Sprite("activity_cell_bg.png", cc.rect(10, 10, 4, 4));
        bg.setPreferredSize(cc.size(750, 60));
        bg.setPosition(container.getContentSize().width/2, container.getContentSize().height/2);
        container.addChild(bg);
        var phienLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "time", cc.TEXT_ALIGNMENT_CENTER, 100);
        phienLabel.setAnchorPoint(cc.p(0,0.5));
        phienLabel.setPosition(_arrPos[0], 33);
        container.addChild(phienLabel);


        var timeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "time", cc.TEXT_ALIGNMENT_CENTER, 100);
        timeLabel.setPosition(_arrPos[1], 30);
        container.addChild(timeLabel);
        timeLabel.setAnchorPoint(cc.p(0,0.5));

        var bettingLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "time");
        bettingLabel.setPosition(_arrPos[2], timeLabel.y);
        bettingLabel.setColor(cc.color(255,222,0));
        container.addChild(bettingLabel);
        bettingLabel.setAnchorPoint(cc.p(0,0.5));

        var lineLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "time");
        lineLabel.setPosition(_arrPos[3], timeLabel.y);
        lineLabel.setColor(cc.color(255,222,0));
        container.addChild(lineLabel);
        lineLabel.setAnchorPoint(cc.p(0,0.5));

        var lineWinLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "time");
        lineWinLabel.setPosition(_arrPos[4], timeLabel.y);
        lineWinLabel.setColor(cc.color(255,222,0));
        container.addChild(lineWinLabel);
        lineWinLabel.setAnchorPoint(cc.p(0,0.5));


        var receiewLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "time");
        receiewLabel.setPosition(_arrPos[5], timeLabel.y);
        receiewLabel.setColor(cc.color(255,222,0));
        container.addChild(receiewLabel);
        receiewLabel.setAnchorPoint(cc.p(0,0.5));

        container.phienLabel = phienLabel;
        container.timeLabel = timeLabel;
        container.bettingLabel = bettingLabel;
        container.lineLabel = lineLabel;
        container.lineWinLabel = lineWinLabel;
        container.receiewLabel = receiewLabel;

        return container;
    },
    onSFSExtension: function (messageType, content) {


        if(content.c == 100003){
            var items = content.p["data"]["1"];
            for(var i=0;i<items.length;i++){

                var phien = items[i]["1"];
                var time = items[i]["2"];


                    var obj = {

                        phien : phien,
                        time :  time,//cc.Global.DateToString(new Date(time)),
                        betting : items[i]["3"],
                        lineBet : items[i]["5"],
                        lineWin:items[i]["6"],
                        moneyWin:items[i]["4"]
                    };
                    this.arrHis.push(obj);


            }

            this.listHis.refreshView();
        }
    },
    onEnter: function () {
        this._super();

       SmartfoxClient.getInstance().addListener(socket.SmartfoxClient.CallExtension, this.onSFSExtension, this);
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "1005", null);
    },
    onExit: function () {
        this._super();
        SmartfoxClient.getInstance().removeListener(this);
    },

});