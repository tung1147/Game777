/**
 * Created by VGA10 on 12/8/2016.
 * Rat la dep trai
 */
var TX_CUA_TAI = 1;
var TX_CUA_XIU = 2;

var ChanLeController = MiniGameController.extend({
    ctor: function (view) {
        this._super();
        this.initWithView(view);
        this.turnState = 0;
        this.holdingList = [0, 0, 0, 0, 0];
        this.gameGroup = "mini.taixiu";
    },

    onSFSExtension: function (messageType, content) {
        if (content.p.group != this.gameGroup ) {
            return;
        }
        this._super(messageType, content);
        var thiz = this;
        // cc.log(content);
        switch (content.c) {
            case "701":
                this.onBetSucess(content.p);
                break;
            case "708":
                this.onStateGame(content.p);
                break;
            case  "260":
                this.onJoinGame(content.p.data);
                break;
            case  "709":
                this.onOtherBet(content.p);
                break;
            case "711":
                this.onHistory(content.p);
                break;
            case "706":
                this.onResuft(content.p);
                break;
            case "713":
                this._view.gameIdLabel.setString("ID: "+ content.p[1]);
                break;
            case "705":
                this.onShowMoneyExchange(content.p);
                break;
            case "22" :
                this.onChangeAssets(content.p.data["1"],content.p.data["2"]);
                break;
        }
    },
    onShowMoneyExchange:function (param) {

        this._view.onChangeAssets("",(parseInt(param[1])>0)? parseInt(param[1]):0);
    },

    onJoinGame:function (param) {
        var state = param[1];
        var timeState = param[2]/1000;
        var timeRemain = param[8]/1000;

        var data = param[3];
        if(state == 3){
            MessageNode.getInstance().show("Bạn vui lòng đợi ván mới!");
            return;
        }
        this.handleStateGame(state,timeRemain,false);
        var moneyMeTai = parseInt(param["9"]);
        var moneyMeXiu = parseInt(param[10]);
        this._view.lblTai.setString((moneyMeTai>0)? "Đã cược: " +cc.Global.NumberFormat1(moneyMeTai):"");
        this._view.lblXiu.setString((moneyMeXiu>0)? "Đã cược: " +cc.Global.NumberFormat1(moneyMeXiu):"");
        for(var i = 0; i < data.length; i++){
            var idCua = data[i]["3"];
            var moneyTotal = data[i]["2"];
            var total =  parseInt(moneyTotal);
            var userCount = data[i]["1"];
            if(idCua == TX_CUA_TAI){

                this._view.lblTotalTai.setString((total>0)? cc.Global.NumberFormat1(total):"");
                this._view.lblNumTai.setString((userCount>0)? userCount:"");
            }else{

                this._view.lblTotalXiu.setString((total>0)? cc.Global.NumberFormat1(total):"");
                this._view.lblNumXiu.setString((userCount>0)? userCount:"");
            }
        }

    },
    onBetSucess:function (param) {
        var idCua = param[4][3];
        PlayerMe.gold = parseInt(param[3]);
        if(idCua==1){
            this._view.lblTotalTai.setString( cc.Global.NumberFormat1(parseInt(param[4][2])));
            this._view.lblTai.setString("Đã cược: " +cc.Global.NumberFormat1(parseInt(param[5])));
        }
        else{
            this._view.lblTotalXiu.setString(cc.Global.NumberFormat1(parseInt(param[4][2])));
            this._view.lblXiu.setString("Đã cược: " + cc.Global.NumberFormat1(parseInt(param[5])));
        }
    },
    onOtherBet:function (param) {
        var moneyTaiTong =  parseInt(param[1][2]);
        this._view.lblTotalTai.setString((moneyTaiTong==0)?"":cc.Global.NumberFormat1(moneyTaiTong));

        var numTai = param[1][1];
        this._view.lblNumTai.setString((numTai>0)? numTai:"");

        var moneyXiuTong =  parseInt(param[2][2]);
        this._view.lblTotalXiu.setString((moneyXiuTong==0)?"":cc.Global.NumberFormat1(moneyXiuTong));

        var numXiu = param[2][1];
        this._view.lblNumXiu.setString((numXiu>0)? numXiu:"");
      //  this._view.lblTai.setString((monetXiuMe==0)?"":("Đã cược: "+cc.Global.NumberFormat1(monetXiuMe)));
    },
    onResuft:function (param) {
        var thiz = this;

        var typeCua = param["data"][1];
        var nameCua = (typeCua == TX_CUA_TAI )?"#mntx_effect_tai.png":"#mntx_effect_xiu.png";
        var number = param["data"][2];
        var idVan = param["data"][3];
        var itemXucXac = param["data"][4];
        // this._view.setActiveBt(thiz._view.btnTai,true);
        // this._view.setActiveBt(thiz._view.btnXiu,true);

        this._view.runAction(new cc.Sequence(
            new cc.DelayTime(1),
            new cc.CallFunc(function () {
                cc.log("=================");
                thiz._view._addResultSprite(itemXucXac);
                if(typeCua == TX_CUA_TAI){
                    thiz._view.effTai.setVisible(true);
                    thiz._view.effXiu.setVisible(false);
                }
                else{
                    thiz._view.effXiu.setVisible(true);
                    thiz._view.effTai.setVisible(false);
                }

                // var sCua = new cc.Sprite(nameCua);
                // sCua.setPosition(100,0);
                // thiz._view.diskNode.addChild(sCua);
            }),
            new cc.DelayTime(2),
            new cc.CallFunc(function () {

                thiz._view.setTextTaiXiu(nameCua);
            })
        ));


    },

    onHistory:function (param) {
        var  thiz = this;
        var arr_his = param["data"];

        if(arr_his){
            var len = (arr_his.length>11)?11:arr_his.length;
            this._view.wgResuft.removeAllChildren();
            var z = 0;
            for(var i = arr_his.length - len; i < arr_his.length;i++){
                (function () {
                    var iNew = i;
                    var dataItemTx  = {
                      type : arr_his[iNew][1],
                      number : arr_his[iNew][2],
                        idVan : arr_his[iNew][3],
                    };
                    thiz._view.pushItemHistory((arr_his.length>11)?z:iNew,dataItemTx);
                    z++;

                })();
            }
        }
        if(this._view.gameState == 1 ){
            this._view.showEffectNumber();
        }
    },
    onStateGame:function (param) {
        var state = param[1];
        var timeState = param[2]/1000;
        this.handleStateGame(state,timeState,true);
    },
    handleStateGame:function (state, timeState,isEffect) {
        this._view.gameState = state;
        switch (state) {
            case -1:
                cc.log("===============chuan bi xoc lo");
                this._view.resetGame();
                break;
            case 0:
                cc.log("===============xoc lo");
                this._view.closeDisk(false);
                this._view.shakeDisk();
                break;
            case 1 :
            {
                cc.log("===============bat dau dat cuoc");
                this._view.setActiveBt(this._view.btnTai,true);
                this._view.setActiveBt(this._view.btnXiu,true);
                this._view.isCountDownSound = true;
                this._view.startTime(timeState);
                this._view.showEffectNumber();

            }


                break;
            case 2 :
                cc.log("===============thua thieu");
                this._view.isCountDownSound = false;
                this._view.setActiveBt(this._view.btnTai,false);
                this._view.setActiveBt(this._view.btnXiu,false);
                break;
            case 3 :
                cc.log("===============mo bat");
                this._view.openDisk(isEffect);
                this._view.hiddenEffectNumber();
                break;
        }
    },


    sendJoinGame: function () {
        SmartfoxClient.getInstance().joinMiniGame(PlayerMe.miniGameInfo, "702");
    },

    onReconnect: function (param) {
        var data = param["data"]["10"];
        var gameId = data["1"];
        var status = data["2"];
        var bankString = data["3"];
        this._view.setBankValue(parseInt(bankString));


    },

    requestQuitRoom: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "710", null);
    },

    sendBetTaiXiu: function (idCua, money) {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "701", {1: idCua, 2: money});
    },

    sendGetExplosionHistory: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "259", null);
    },

    sendGetUserHistory: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "257", null);
    },


});