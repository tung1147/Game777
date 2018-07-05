/**
 * Created by anhvt on 12/5/2016.
 */

s_sfs_error_msg[10] = "Không đủ tiền đặt cược";
s_sfs_error_msg[777] = "Tiền cược không hợp lệ";

var MiniGameController = cc.Class.extend({
    ctor: function () {

    },

    initWithView: function (view) {
        this._view = view;
        SmartfoxClient.getInstance().addListener(socket.SmartfoxClient.SocketStatus, this.onSmartfoxSocketStatus, this);
        SmartfoxClient.getInstance().addListener(socket.SmartfoxClient.CallExtension, this.onSFSExtension, this);
        SmartfoxClient.getInstance().addExtensionListener("___err___", this.onSFSError, this);
        SmartfoxClient.getInstance().addExtensionListener("100000", this._onPerformChangeRewardFund, this);
        SmartfoxClient.getInstance().addExtensionListener("260", this._onJoinGame, this);
        SmartfoxClient.getInstance().addExtensionListener("262", this._onReconnect, this);
        //SmartfoxClient.getInstance().addExtensionListener("0", this.onSFSChangeAssets, this);
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
        //this.onChangeAssets(content.p["2"], content.p["1"]);
    },

    onSmartfoxSocketStatus: function (type, eventName) {
        if (eventName === "LostConnection") {
            this._view.backToHomeScene();
        }
        else if(eventName === "ConnectFailure"){
            this._view.backToHomeScene();
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
        this._view.performChangeRewardFund(content.p.data["pbs"]); // thay doi hu thuong
        cc.log(content);
    },
    
    _onReconnect : function (messageType, content) {
        if (content.p.group !== this.gameGroup){
            return;
        }
        this.onReconnect(content.p);
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

    onReconnect: function (param) {

    },

    onChangeAssets: function (gold, changeAmount) {
        if (changeAmount < 0) {
            return;
        }
        this._view.onChangeAssets(gold, changeAmount);
    },

    onGetLastSessionInfo: function (command, eventData) {
        // var info = eventData.data.lastSessionInfo;
        // if (info && info.ip && info.port) {
        //     var serverInfo = LobbyClient.getInstance().createServerInfo(info);
        //     LoadingDialog.getInstance().show("Đang kết nối lại máy chủ");
        //     SmartfoxClient.getInstance().connect(serverInfo);
        //     return;
        // }
        // else {
        //     LoadingDialog.getInstance().hide();
        // }
        // this._view.backToHomeScene();
    },

    requestQuitRoom: function () {
    },

    sendJoinGame: function () {
    },

    sendGetTopRequest: function () {
    },

    sendGetExplosionHistory: function () {
    },

    sendGetUserHistory: function () {
    }
});