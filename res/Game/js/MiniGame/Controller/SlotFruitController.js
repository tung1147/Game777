/**
 * Created by anhvt on 12/5/2016.
 */


// s_sfs_error_msg[10] = "Không đủ tiền để quay";
s_sfs_error_msg[0] = "Hack detected";

var SlotFruitController = cc.Class.extend({
    ctor: function (view) {

        this.initWithView(view);
    },

    initWithView: function (view) {
        this._view = view;
        this.gameGroup = "mini.jokerslot";
        SmartfoxClient.getInstance().addListener(socket.SmartfoxClient.SocketStatus, this.onSmartfoxSocketStatus, this);

        SmartfoxClient.getInstance().addExtensionListener("___err___", this.onSFSError, this);
        SmartfoxClient.getInstance().addExtensionListener("100000", this._onPerformChangeRewardFund, this);
        SmartfoxClient.getInstance().addExtensionListener("1008", this._onJoinGame, this);
        SmartfoxClient.getInstance().addExtensionListener("1010", this._onReconnect, this);
        SmartfoxClient.getInstance().addExtensionListener("1001", this._onResuftRotate, this);
        SmartfoxClient.getInstance().addExtensionListener("1009", this._onExitGame, this);
        SmartfoxClient.getInstance().addExtensionListener("1003", this._onNhanThuong, this);
        SmartfoxClient.getInstance().addExtensionListener("-1", this.onSFSChangeAssets, this);
        SmartfoxClient.getInstance().addExtensionListener("1002", this._onBonus, this);
        SmartfoxClient.getInstance().addExtensionListener("100005", this._onNohu, this);
        LobbyClient.getInstance().addListener("getLastSessionInfo", this.onGetLastSessionInfo, this);
    },

    releaseController: function () {
        this._view = null;
        SmartfoxClient.getInstance().removeListener(this);
        LobbyClient.getInstance().removeListener(this);

        this.requestQuitRoom();
    },

    onSFSError: function (messageType, content) {
        var params = content["p"];
        var gameName = params["groupName"];
        if(gameName === this.gameGroup){
            this._view.onError(params);

            return true;
        }
        return false;
    },

    onSFSChangeAssets: function (messageType, content) {
        var params = content.p;
        var reason = params["r"];
        if(reason >= 0){
            if(params["1"] !== null & params["1"] !== undefined){
                this._view.updateGold( params["1"]);
                this._view.changeGoldEffect( params["d"]);
            }
        }
    },

    onSmartfoxSocketStatus: function (type, eventName) {
        if (eventName === "LostConnection") {
            LoadingDialog.getInstance().show("Đang kết nối lại máy chủ");
            LobbyClient.getInstance().requestGetLastSessionInfo();
           // this._view.backToHomeScene();
        }
    },
    
        _onPerformChangeRewardFund : function (messageType, content) {
        if (content.p.group !== this.gameGroup){
            return;
        }

        this._view.performChangeRewardFund(content.p.data["1"]);
    },

    _onJoinGame : function(messageType, content){
        if (content.p.group !== this.gameGroup){
            return;
        }



       this._view.initHuThuong(content.p.data["pbs"]); // thay doi hu thuong
        cc.log(content);
        this._view.runAction(new cc.Sequence(new cc.DelayTime(0), new cc.CallFunc(function () {
            LoadingDialog.getInstance().hide();
        })));
    },
    
    _onReconnect : function (messageType, content) {
        if (content.p.group !== this.gameGroup){
            return;
        }
        this._view.initHuThuong(content.p.data["pbs"]);
        this.onReconnect(content.p["data"]);
        this._view.runAction(new cc.Sequence(new cc.DelayTime(0), new cc.CallFunc(function () {
            LoadingDialog.getInstance().hide();
        })));
    },
    _onNhanThuong:function (messageType, content) {
        this._view.onNhanThuong();
    },
    _onNohu:function (messageType, content) {

        this._view.showJackpot ();
    },
    _onBonus:function (messageType, content) {

        this.onBonus(content.p["data"]);
    },

    _onExitGame:function (messageType, content) {
        this._view.exitToGame();
    },
    _onResuftRotate:function (messageType, content) {
        cc.log("aaaa");
        if (content.p.group !== this.gameGroup){
            return;
        }
        this.onResuftRotate(content.p["data"]);
    },
    onSFSExtension: function (messageType, content) {
        // switch (content.c) {
        //
        //     case "100000":
        //         this._view.performChangeRewardFund(content.p.data["1"]);
        //         break;
        //     case "260": // thong tin game
        //         //this._view.setupMucCuoc(content.p.data["bts"]); // cac muc cuoc
        //         this._view.performChangeRewardFund(content.p.data["pbs"]); // thay doi hu thuong
        //         cc.log(content);
        //         break;
        //
        //     case "262": // reconnect
        //         this.onReconnect(content.p);
        //         break;
        // }
    },
    onResuftRotate:function (param) {
        this._view.lblID.setString("ID: "+ param[1]);
        var arrItem = param["2"];
        var arrLine = param["3"]["1"];

       // this._view.handleResuft(false,arrItem,arrLine,param["4"],param["5"]);
        this._view.handleResuftZ(false,param);
    },
    onReconnect: function (param) {
        var arrItem = param["10"]["2"];
        var arrLine = param["10"]["3"]["1"];
        this._view.lblID.setString("ID: "+  param["10"]["1"]);
       // this._view.handleResuft(true,arrItem,arrLine,param["10"]["4"],param["10"]["5"]);
        this._view.handleResuftZ(true,param["10"]);
        var arrLineSelect = param["10"]["8"];
        this._view.showNumLineReconnect(arrLineSelect,param["10"]["7"]-1);
    },
    onBonus:function (param) {
        this._view.onBonus(param[1],param[2],param[3]);
    },

    onChangeAssets: function (gold, changeAmount) {
        if (changeAmount < 0) {
            return;
        }
        this._view.onChangeAssets(gold, changeAmount);
    },

    onGetLastSessionInfo: function (command, eventData) {
        var info = eventData.data.lastSessionInfo;
        if (info && info.ip && info.port) {
            var serverInfo = LobbyClient.getInstance().createServerInfo(info);
            LoadingDialog.getInstance().show("Đang kết nối lại máy chủ");
            SmartfoxClient.getInstance().connect(serverInfo);
            return;
        }
        else {
            //LoadingDialog.getInstance().hide();
        }
        this._view.exitToGame();
    },

    requestQuitRoom: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "1009", null);
    },

    sendJoinGame: function () {

        SmartfoxClient.getInstance().joinMiniGame(PlayerMe.miniGameInfo, "1008");
    },
    sendRouteRequest:function (lineBets,indexBet) {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "1001", {2: lineBets, 1: indexBet});//,3:1
    },
    sendBonus:function (idBonus) {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "1002", {1: idBonus});
    },
    sendGetTopRequest: function () {
    },
    sendGiveGold:function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "1003", null);
    },

    sendGetExplosionHistory: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "1007", null);
    },
    sendHistory:function () {
        SmartfoxClient.getInstance().sendExtensionRequest(-1, "1005", null);
    },
    sendGetUserHistory: function () {
    }
});