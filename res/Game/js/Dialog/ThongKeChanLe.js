var ThongKeChanLe = IDialog.extend({
    ctor: function () {
        this._super();
        var historyNode = new cc.Node();
        this.addChild(historyNode, 3);
        this.historyNode = historyNode;

        var board_bg = new ccui.Scale9Sprite("board_bg.png", cc.rect(105, 105, 147, 147));
        board_bg.setAnchorPoint(cc.p(0, 0));
        this.addChild(board_bg);
        this.board_bg = board_bg;
        this.initWithSize(cc.size(1080, 590));
        var title = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "THỐNG KÊ");
        title.setPosition(this.getContentSize().width / 2, this.getContentSize().height - 138);
        title.setColor(cc.color("#ffde00"));
        this.addChild(title);

        var bg = new ccui.Scale9Sprite("lobby_xocdia_bg_1.png", cc.rect(4,4,4,4));
        bg.setPreferredSize(cc.size(840,220));
        // bg.setAnchorPoint(cc.p(0,0));
        bg.setPosition(this.getContentSize().width / 2, this.getContentSize().height/2-50);
        this.bg = bg;
        this.addChild(bg);
        this._initHistory();


        var lblXiu = new cc.LabelTTF("XỈU 0",cc.res.font.Roboto_CondensedBold,30);
        lblXiu.setColor(cc.color(255, 222, 0,255));
        lblXiu.setPosition(this.getContentSize().width / 2 - 237, 400);
        this.addChild(lblXiu);
        this.lblXiu = lblXiu;

        var lblTai = new cc.LabelTTF("TÀI 0",cc.res.font.Roboto_CondensedBold,30);
        lblTai.setPosition(this.getContentSize().width / 2 + 237, 400);
        lblTai.setColor(cc.color(119, 203, 238,255));
        this.addChild(lblTai);
        this.lblTai = lblTai;

    },
    onSFSExtension: function (messageType, content) {
        var pad = -35;
            if(content.c == 704){
                var arrHis =  content.p["1"];
                if(arrHis){
                    var itemSize = cc.size(48,188);
                    var countTai = 0;
                    var countXiu = 0;
                    var from = 0;
                    if(arrHis.length>15)
                    {
                        from = arrHis.length - 15;
                    }

                    for(var i = from; i < arrHis.length;i++ ){
                        var idCua = arrHis[i]["1"];
                        if(idCua == TX_CUA_TAI){
                            countTai++;
                        }
                        else{
                            countXiu++;
                        }
                        var total = arrHis[i]["2"];
                        var arrXucXac = arrHis[i]["4"];
                        cc.log("===========" + countTai);

                        var x = 45.0 + (itemSize.width + 2) * (i-from);


                        var sumBg = new cc.Sprite("#lobby_taixiu_history_bg_1.png");
                        sumBg.setPosition(x, 109+ pad);
                        this.bg.addChild(sumBg, 0);


                        for(var j=0;j<arrXucXac.length;j++){
                            var sprite = new cc.Sprite("#lobby_taixiu_dice_" + arrXucXac[j] + ".png");
                            sprite.setPosition(x, 153 + 28*j+ pad);
                            this.bg.addChild(sprite, 0);
                        }

                        if(total > 10){
                            var label = new cc.LabelBMFont("TÀI", cc.res.font.Roboto_Condensed_25);
                            label.setColor(cc.color("#00ccff"));
                        }
                        else{
                            var label = new cc.LabelBMFont("XỈU", cc.res.font.Roboto_Condensed_25);
                            label.setColor(cc.color("#ffde00"));
                        }
                        label.setScale(18.0/25.0);
                        label.setPosition(x, 72.0+ pad);
                        this.bg.addChild(label, 1);

                        var sumLabel = new cc.LabelBMFont(total.toString(), cc.res.font.Roboto_Condensed_25);
                        sumLabel.setScale(20.0/25.0);
                        sumLabel.setPosition(sumBg.getPosition());
                        this.bg.addChild(sumLabel, 1);

                    }

                    this.lblTai.setString("TÀI " + countTai);
                    this.lblXiu.setString("XỈU " + countXiu);
                }
            }
    },
    onEnter: function () {
        this._super();
        SmartfoxClient.getInstance().addListener(socket.SmartfoxClient.CallExtension, this.onSFSExtension, this);
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "704", null);
    },
    onExit: function () {
        this._super();
        SmartfoxClient.getInstance().removeListener(this);
    },
    _initHistory : function () {
        var itemSize = cc.size(48,45);
        var itemSize = cc.size(48,188);

        for(var i=0;i<16;i++){
            var bg = new ccui.Scale9Sprite("lobby_xocdia_bg_2.png",cc.rect(4,4,4,4));
            bg.setPreferredSize(itemSize);
            bg.setPosition(45 + (itemSize.width + 2) * i, 145-35);
            this.bg.addChild(bg);
        }


        this._historyData = [];
    },
    initWithSize: function (mSize) {
        this.board_bg.setPreferredSize(cc.size(mSize.width, mSize.height));
        this.setContentSize(this.board_bg.getContentSize());
    },
    _refreshHistory : function () {
        var itemSize = cc.size(48,188);
        this.historyNode.removeAllChildren(true);

        for(var i=0; i<this._historyData.length; i++){
            var x = 165.0 + (itemSize.width + 2) * i;
            var data = this._historyData[i];

            var sumBg = new cc.Sprite("#lobby_taixiu_history_bg_1.png");
            sumBg.setPosition(x, 109);
            this.historyNode.addChild(sumBg, 0);

            var sum = 0;
            for(var j=0;j<data.length;j++){
                var sprite = new cc.Sprite("#lobby_taixiu_dice_" + data[j] + ".png");
                sprite.setPosition(x, 153 + 28*j);
                this.historyNode.addChild(sprite, 0);

                sum += data[j];
            }

            if(sum > 10){
                var label = new cc.LabelBMFont("TÀI", cc.res.font.Roboto_Condensed_25);
                label.setColor(cc.color("#00ccff"));
            }
            else{
                var label = new cc.LabelBMFont("XỈU", cc.res.font.Roboto_Condensed_25);
                label.setColor(cc.color("#ffde00"));
            }
            label.setScale(18.0/25.0);
            label.setPosition(x, 72.0);
            this.historyNode.addChild(label, 1);

            var sumLabel = new cc.LabelBMFont(sum.toString(), cc.res.font.Roboto_Condensed_25);
            sumLabel.setScale(20.0/25.0);
            sumLabel.setPosition(sumBg.getPosition());
            this.historyNode.addChild(sumLabel, 1);
        }
    }
});