/**
 * Created by VGA10 on 12/8/2016.
 * Rat la dep trai
 */

var VQ_TYPE_NONE = 0;
var VQ_TYPE_GOLD = 1;
var VQ_TYPE_ADD = 2;
var VQ_TYPE_EXP = 3;
var VQ_TYPE_KT = 4;
var VQ_BUY_FIRST = 0;
var VQ_BUY_SECOND = 1;
var VQ_BUY_INGAME = 2;
s_sfs_error_msg[520] = "Bạn không đủ lượt quay!";
s_sfs_error_msg[521] = "Bạn chưa chọn cửa";
s_sfs_error_msg[522] = "Không đủ tiền để mua lượt";

var VongQuayController = MiniGameController.extend({
    ctor: function (view) {
        this._super();
        this.initWithView(view);

        this.gameGroup = "vongquay.mini";
    },
    onTouchBegan: function (touch, event) {

        return this._super(touch, event);
    },
    onSFSExtension: function (messageType, content) {
        if (content.p.group != this.gameGroup ) {
            return;
        }
        // this._super(messageType, content);
        var thiz = this;
        // cc.log(content);
        switch (content.c) {

            case  "260":
                this.onJoinGame(content.p);
                break;
            case  "262":
                this.onReconnect(content.p);
                break;

            case "503":
                this.onResuft(content.p);
                break;
            case "511":
               this.onStatusGame(content.p);
                break;
            case "509":
                this.onUpdateLuot(content.p);
                break;
            case "513":

                this._view.setActiveBt(thiz._view.rotateBt,content.p[1]);
                // this.onUpdateLuot();
                break;
            case "713":
                this._view.gameIdLabel.setString("ID: "+ content.p[1]);
                break;
            case "502":
                this.onBuySucess(content.p);
                break;
        }

    },
    _onJoinGame : function(messageType, content){

    },
    onShowMoneyExchange:function (param) {

      //  this._view.onChangeAssets("",(parseInt(param[1])>0)? parseInt(param[1]):0);
    },
    onReconnect:function (param) {
        cc.log("1");
        this.onJoinGame(param[1]);

    },
    onUpdateLuot:function (param) {
        this._view.onUpdateLuot( param[1]);

    },

    onStatusGame:function (param) {

        if(param[2] == null){
            return;
        }
    if(param[1] == 1){// choi xong
        // this._view.vongto.startWithSpeed(1000);
        // this._view.vongnho.startWithSpeed(-1000);
        this._view.setResuft(param[2][1],param[2][2]);

    }else
    {
        this._view.vongto.startWithSpeed(1000);
        this._view.vongnho.startWithSpeed(-1000);
        this._view.handelResuft(param[2][1],param[2][2]);
    }


    },
    onJoinGame:function (param) {
        var arrVongNho = param[1][1];
        var arrVongTo = param[1][2];
        var arrBet = param[1][3];
        this._view.handelJoinGame(arrVongNho,arrVongTo,arrBet);

    },
    onBuySucess:function (param) {
        MessageNode.getInstance().show("Bạn có thêm " + param["3"]["2"] + " lượt");
    },
    onOtherBet:function (param) {

    },
    onResuft:function (param) {
      this._view.handelResuft(param[1][1],param[1][2]);
    },

    onHistory:function (param) {

    },
    onStateGame:function (param) {

    },
    handleStateGame:function (state, timeState,isEffect) {

    },


    sendJoinGame: function () {
        SmartfoxClient.getInstance().joinMiniGame(PlayerMe.miniGameInfo, "510");
    },



    requestQuitRoom: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "507", null);
    },

    sendRotate: function (idCua) {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "503", {1: idCua});
    },

    sendBuyRotate: function (idCua) {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "502",  {1: idCua});
    },
    sendGiveMoney:function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "504",  null);
    },
    sendGetUserHistory: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "505", null);
    },
    sendGetRank: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "506", null);
    }

});