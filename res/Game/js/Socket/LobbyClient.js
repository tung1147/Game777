/**
 * Created by Quyet Nguyen on 6/23/2016.
 *
 *
 *
 */

if (cc.sys.isNative) { //mobile
    var s_lobbyServer = s_lobbyServer || [
        {
            host: "42.112.25.164",
            //host: "vuabaivip.com",
            port: 9999
        }
    ];
}
else { //websocket
    var s_lobbyServer = s_lobbyServer || [
        //"wss://gbvcity.com/lagen2-lobby/websocket"
        //"ws://vuabaivip.com:8887/websocket"
        "ws://42.112.25.164:8887/websocket" // UAT
        //"ws://42.112.25.154:8887/websocket" //dev2 = khoi

    ];
}

var LobbyClient = (function () {
    var instance = null;

    var Clazz = cc.Class.extend({
        lobbySocket: null,
        ctor: function () {
            if (instance) {
                throw "Cannot create new instance for Singleton Class";
            } else {
                var thiz = this;

                this.allListener = {};
                this.serverIndex = 0;
                this.isKicked = false;
                this.loginHandler = null;
                this.isReconnected = false;
                this.isLogined = false;

                this.lobbySocket = new socket.LobbyClient(socket.LobbyClient.TCP);
                this.lobbySocket.onEvent = function (messageName, data) {
                    thiz.onEvent(messageName, data);
                };
                cc.director.getScheduler().scheduleUpdateForTarget(this, 0, false);

                this.addListener("LobbyStatus", this._onLobbyStatusHandler, this);
                this.addListener("error", this._onErrorHandler, this);
                this.addListener("popupMessage", this._onPopupMessage, this);
                this.addListener("kicked", this._onKickedHandler, this);
                this.addListener("login", this._onLoginHandler, this);
                this.addListener("register", this._onRegisterHandler, this);
                this.addListener("getGameServer", this._onGetGameServerHandler, this);
                this.addListener("verifyCode", this._onVerifyCodeHandler, this);
                this.addListener("verifyCodeBySms", this._onVerifyCodeBySmsHandler, this);
                this.addListener("ca", this._onChangeAssetHandler, this);
                this.addListener("inventory", this._onInventoryHandler, this);
                this.addListener("updateItem", this._onUpdateItemHandler, this);
                this.addListener("inboxMessage", this._onInboxMessageHandler, this);
                this.addListener("news", this._onNewsHandler, this);
                this.addListener("sendBroadcastMessage", this._onSendBroadcastMessage, this);
                this.addListener("markReadedMessageInbox", this._onMarkReadedMessageInboxHandler, this);
                this.addListener("fetchProducts", this._onFetchProductsHandler, this);
                this.addListener("fetchCashinProductItems", this._onFetchCashinProductItemsHandler, this);
                this.addListener("transferGold", this._onTransferGold, this);
                this.addListener("fetchTransferConfig", this._onFetchTransferConfig, this);
                this.addListener("updateLandmarkCompleted", this._onUpdateLandmarkCompleted, this);

                FacebookPlugin.getInstance().onLoginFinished = function (returnCode, userId, accessToken) {
                    if(returnCode == 0){
                        LoadingDialog.getInstance().show("Đang đăng nhập");
                        thiz.loginFacebook(accessToken);
                    }
                    else{
                        LoadingDialog.getInstance().hide();
                        if(returnCode > 0){
                            MessageNode.getInstance().show("Lỗi đăng nhập facebook");
                        }
                    }
                };

                if(cc.sys.isNative){
                    SystemPlugin.getInstance().onBuyItemFinishAndroid = function (returnCode, signature, json) {
                        thiz.onBuyItemFinishAndroid(returnCode, signature, json);
                    };

                    SystemPlugin.getInstance().onBuyItemFinishIOS = function (returnCode, data) {
                        thiz.onBuyItemFinishIOS(returnCode, data);
                    };
                }

            }
        },

        onBuyItemFinishAndroid : function (returnCode, signature, json) {
            LoadingDialog.getInstance().hide();
            if(returnCode === 0){
                var request = {
                    command : "cashin",
                    data: json,
                    signature: signature,
                    os : 2,
                    type : 3
                };
                this.send(request);
            }
        },

        onBuyItemFinishIOS : function (returnCode, data) {
            LoadingDialog.getInstance().hide();
            if(returnCode === 0){
                var request = {
                    command : "cashin",
                    data: data,
                    os : 1,
                    type : 3
                };
                this.send(request);
            }
        },

        update: function (dt) {
            if (this.isReconnected) {
                if (this.reconnectTimeout > 0.0) {
                    this.reconnectTimeout -= dt;
                }
                else {
                    //  this.onRequestTimeout();
                    this.isReconnected = false;
                }
            }
        },
        send: function (message) {
            if (this.lobbySocket) {
                cc.log(message);
                this.lobbySocket.send(JSON.stringify(message));
            }
        },
        close: function () {
            this.isReconnected = false;
            if (this.lobbySocket) {
                this.lobbySocket.close();
            }
        },
        connect: function () {
            if (this.lobbySocket) {
                this.isLogined = false;
                PlayerMe.avatar = "";

                if(this.serverIndex >= s_lobbyServer.length){
                    this.serverIndex = 0;
                }

                this.isKicked = false;
                if (cc.sys.isNative) {
                    this.lobbySocket.connect(s_lobbyServer[this.serverIndex].host, s_lobbyServer[this.serverIndex].port);
                }
                else {
                    this.lobbySocket.connect(s_lobbyServer[this.serverIndex]);
                }

                this.serverIndex++;
            }
        },
        onEvent: function (messageName, data) {
            if (messageName == "socketStatus") {
                this.postEvent("LobbyStatus", data);
            }
            else if (messageName == "message") {
                var messageData = JSON.parse(data);
                // if (messageData.command == "error") {
                //     LobbyClient.ErrorHandle(messageData.errorCode);
                // }

                this.postEvent(messageData.command, messageData);
            }
        },

        _onLobbyStatusHandler : function (cmd, event) {
            this.isLogined = false;
            if (event === "Connected") {
                this.isReconnected = false;
                if (this.loginHandler) {
                    this.loginHandler();
                }
            }
            else if (event === "ConnectFailure") {
                if (this.isReconnected) {
                    this.connect();
                }
                else {
                    LoadingDialog.getInstance().hide();
                    SceneNavigator.toHome("Mất kết nối máy chủ");
                }
            }
            else if (event === "LostConnection") {
                if (!this.isKicked) {
                    this.reconnect();
                }
            }
        },

        _onErrorHandler : function (cmd, event) {
            var errMsg = event["errorMessage"];
            if(errMsg && errMsg != ""){
                LoadingDialog.getInstance().hide();
                MessageNode.getInstance().show(errMsg);
            }
            else{
                LobbyClient.ErrorHandle(event.errorCode);
            }
        },

        _onPopupMessage : function (cmd, event) {
            var data = event.data;
            var title = data.title;
            if(!title || title == ""){
                title = "Thông báo";
            }
            var msg = data["message"];

            var dialog = new MessageDialog();
            dialog.setTitle(title);
            dialog.setMessage(msg);
            dialog.showWithAnimationScale();
        },

        _onKickedHandler : function (cmd, event) {
            this.isKicked = true;
            var runningScene = cc.director.getRunningScene();
            LoadingDialog.getInstance().hide();
            var message = "Bạn bị sút khỏi máy chủ";
            if (event.code == 1) {
                message = "Tài khoản đăng nhập tại thiết bị khác";
            }
            else if(event.code == 2){
                message = "Bạn bị kicked bởi admin";
            }
            else if(event.code == 5){
                message = "Tài khoản đã bị khóa";
            }

            SceneNavigator.toHome(message);
        },

        _onLoginHandler : function (cmd, event) {
            if (event.status == 0) {
                this.isLogined = true;
                if(this.lastRequestLogin){
                    cc.Global.SetSetting("lastLoginType", this.lastRequestLogin);
                }

                this.requestGetTransferGoldConfig();

               // this.onLoginEvent(event);
                PlayerMe.messageCount = 0;

                var data = event.data;
                PlayerMe.gold = data.userAssets.gold;
                PlayerMe.exp = data.userAssets.exp;
                PlayerMe.vipExp = data.userAssets.vipExp;
                PlayerMe.spin = data.userAssets.spin;
                PlayerMe.phoneNumber = data.telephone;
                PlayerMe.SFS.info = data.info;
                PlayerMe.SFS.signature = event.signature;
                var userinfo = JSON.parse(data.info);
                PlayerMe.username = userinfo.username;
                PlayerMe.gameType = "";
                PlayerMe.SFS.betting = 0;
                PlayerMe.accountType = data["type"];

                //server list
                var serverData = data["server"];
                if (serverData) {
                    this.SFSServerInfo = {};
                    for (var i = 0; i < serverData.length; i++) {
                        var serverInfo = this.createServerInfo(serverData[i]);
                        serverInfo.serverId = serverData[i].serverId;
                        this.SFSServerInfo[serverInfo.serverId] = serverInfo;
                    }
                }

                //minigame server
                var miniGameServer = data["miniGameInfo"];
                PlayerMe.miniGameInfo = this.createServerInfo(miniGameServer);

                var lastSessionInfo = data.lastSessionInfo;
                if (lastSessionInfo.ip && lastSessionInfo.port) { // reconnect
                    this.reconnectSmartfox(this.createServerInfo(lastSessionInfo));
                }
                else { // to Home
                    LoadingDialog.getInstance().hide();
                    SceneNavigator.toLobby();
                }

                if (this.loginSuccessHandler) {
                    this.loginSuccessHandler();
                    this.loginSuccessHandler = null;
                }

                //registerPush
                this.sendRegisterPush();
            }
            else{
                var message = event["statusMessage"];
                if(!message){
                    var errorHandler = LobbyClient.Error[event.status];
                    if(errorHandler){
                        message = errorHandler.message;
                    }
                }

                if(message){
                    SceneNavigator.toHome(message);
                }
                else{
                    SceneNavigator.toHome();
                }
            }
        },

        _onRegisterHandler : function (cmd, event) {
            if (this.loginSuccessHandler) {
                this.loginSuccessHandler();
                this.loginSuccessHandler = null;
            }
        },

        _onGetGameServerHandler : function (cmd, event) {
            var data = event.data;
            if (this.betting == data.betting) {
                PlayerMe.SFS.betting = data.betting;
                PlayerMe.gameType = data.gameType;

                if (cc.sys.isNative) {
                    var _port = data.port;
                }
                else {
                    var _port = data.webSocketPort;
                }
                SmartfoxClient.getInstance().findAndJoinRoom(data.host, _port, data.betting, data.gameType);
            }
        },

        _onVerifyCodeHandler : function (cmd, event) {
            PlayerMe.verify = true;
            PlayerMe.phoneNumber = event.data.telephone;
        },

        _onVerifyCodeBySmsHandler : function (cmd, event) {
            PlayerMe.verify = true;
            PlayerMe.phoneNumber = event.data.telephone;
        },

        _onChangeAssetHandler : function (cmd, event) {
            var userAssets = event["data"]["userAssets"];
            if(userAssets["gold"] != null &&  userAssets["gold"] != undefined){
                PlayerMe.gold = userAssets["gold"];
            }
            if(userAssets["exp"] != null && userAssets["exp"] != undefined){
                PlayerMe.exp = userAssets["exp"];
            }
            if(userAssets["vipexp"]!= null && userAssets["vipexp"]!= undefined){
                PlayerMe.vipExp = userAssets["vipexp"];
            }
        },

        _onInventoryHandler : function (cmd, event) {
            var items = event["data"];
            for (var i = 0; i < items.length; i++) {
                if (items[i].id == 1) {
                    PlayerMe.avatar = items[i]["avtUrl"];
                }
            }
        },

        _onUpdateItemHandler : function (cmd, event) {
            var data = event["data"];
            if(data && data["avtUrl"]){
                PlayerMe.avatar = data["avtUrl"];
            }
        },

        _onInboxMessageHandler : function (cmd, event) {
            PlayerMe.messageCount = event["data"]["numberMessUnread"];
        },

        _onUpdateLandmarkCompleted : function (cmd, event) {
            PlayerMe.missionCount = event["data"]["count"];
        },

        _onNewsHandler : function (cmd, event) {
            // var broadcast = event["data"]["broadcast"];
            // if (broadcast) {
            //     GameConfig.broadcastMessage = broadcast;
            // }
        },

        _onSendBroadcastMessage : function (cmd, event) {
            var broadcast = event["data"]["message"];
            if (broadcast) {
                GameConfig.broadcastMessage = broadcast;
            }
        },

        _onMarkReadedMessageInboxHandler : function (cmd, event) {
            var msgCount = event["data"]["numberMessUnread"];
            PlayerMe.messageCount = msgCount;
        },

        _onFetchCashinProductItemsHandler : function (cmd, event) {
            //SMS
            var data = event["data"]["2"];
            cc.Global.SMSList = [];
            for (var i = 0; i < data.length; i++) {
                var currency = data[i]["currency"];
                var smsGateway = data[i]["detail"]["smsGateway"];
                var vmsContent = data[i]["detail"]["vmsContent"];
                var vnpContent = data[i]["detail"]["vnpContent"];
                var vttContent = data[i]["detail"]["vttContent"];
                var gold = data[i]["gold"];
                var id = data[i]["id"];
                var price = data[i]["price"];
                cc.Global.SMSList.push({
                    currency: currency,
                    smsGateway: smsGateway,
                    vmsContent: vmsContent,
                    vnpContent: vnpContent,
                    vttContent: vttContent,
                    gold: gold,
                    id: id,
                    price: parseInt(price)
                });
            }

            //inApp
            cc.Global.inAppBillingData = event["data"]["3"];
            if(cc.sys.isNative && cc.sys.os === cc.sys.OS_IOS){
                var itemList = [];
                for(var i=0;i<cc.Global.inAppBillingData.length;i++){
                    itemList.push(cc.Global.inAppBillingData[i]["id"]);
                }
                SystemPlugin.getInstance().iOSInitStore(itemList);
            }
        },

        _onFetchProductsHandler : function (cmd, event) {
            cc.Global.thecaoData = event["data"]["1"];
            cc.Global.tienmatData = event["data"]["2"];
            cc.Global.dailyData = event["data"]["3"];
            cc.Global.vatphamData = event["data"]["4"];
        },

        _onTransferGold : function (cmd, event) {
            var msg =  event["message"];
            var status = event["status"];
            if(status === 0) {
                //chuyen tien thanh cong
                var dialog = new MessageDialog();
                dialog.setMessage(msg);
                dialog.showWithAnimationScale();
            }
            else {
                if(!msg){
                    msg = "Chuyển vàng không thành công";
                }
                MessageNode.getInstance().show(msg);
            }
        },

        _onFetchTransferConfig : function (cmd, event) {
            var data = event["data"];
            PlayerMe.transferGoldFee = data["fee"];
            PlayerMe.transferGoldMinAsset = data["minAsset"];
            PlayerMe.transferGoldMinValue = data["minValue"];
            PlayerMe.transferGoldMerchantFee = data["merchantFee"];
        },

        prePostEvent: function (command, event) {

        },

        onLoginEvent: function (event) {

        },

        postEvent: function (command, event) {
           // this.prePostEvent(command, event);
            var arr = this.allListener[command];
            if (arr) {
                this.isBlocked = true;
                for (var i = 0; i < arr.length;) {
                    var target = arr[i];
                    if (target) {
                        target.listener.apply(target.target, [command, event]);
                    }
                    else {
                        arr.splice(i, 1);
                        continue;
                    }
                    i++;
                }
                this.isBlocked = false;
            }
        },
        addListener: function (command, _listener, _target) {
            var arr = this.allListener[command];
            if (!arr) {
                arr = [];
                this.allListener[command] = arr;
            }
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] && arr[i].target === _target) {
                    return;
                }
            }
            arr.push({
                listener: _listener,
                target: _target
            });
        },
        removeListener: function (target) {
            for (var key in this.allListener) {
                if (!this.allListener.hasOwnProperty(key)) continue;
                var arr = this.allListener[key];
                for (var i = 0; i < arr.length;) {
                    if (arr[i] && arr[i].target == target) {
                        if (this.isBlocked) {
                            arr[i] = null;
                        }
                        else {
                            arr.splice(i, 1);
                            continue;
                        }
                    }
                    i++;
                }
            }
        },
        /*****/
        checkIMEI: function () {
            if (!PlayerMe.IMEI) {
                PlayerMe.IMEI = SystemPlugin.getInstance().getDeviceUUIDWithKey(PlayerMe.DeviceIDKey);
                if (!PlayerMe.IMEI) {
                    MessageNode.getInstance().show("Bạn phải đăng nhập tài khoản Google");
                    LoadingDialog.getInstance().hide();
                    return false;
                }
            }
            return true;
        },
        login: function (username, password, redirectFromSignup) {
            var thiz = this;

            this._username = username;
            this._password = password;

            this.loginHandler = function () {
                var loginRequest = {
                    type: "normal",
                    username: thiz._username,
                    password: thiz._password
                };
                thiz.sendLoginRequest(loginRequest);
            };
            if (redirectFromSignup) {
                LoadingDialog.getInstance().setMessage("Đang đăng nhập");
                this.loginHandler();
            }
            else {
                this.connect();
            }
        },
        loginNormal: function (username, password, isSave) {
            this.lastRequestLogin = "normalLogin";

            if (!this.checkIMEI()) {
                return;
            }

            var thiz = this;
            this.loginSuccessHandler = function () {
                if (isSave) {
                    cc.Global.setSaveUsername(username);
                    cc.Global.setSavePassword(password);
                }
                else {
                    cc.Global.setSaveUsername("");
                    cc.Global.setSavePassword("");
                }
            };
            this.login(username, password);
        },
        quickLogin: function () {
            this.lastRequestLogin = "quickLogin";
            if (!this.checkIMEI()) {
                return;
            }
            this.loginSuccessHandler = null;
        },
        loginFacebook: function (accessToken) {
            this.lastRequestLogin = "facebookLogin";
            if (!this.checkIMEI()) {
                return;
            }

            this.loginSuccessHandler = null;

            var thiz = this;
            this.loginHandler = function () {
                var loginRequest = {
                    type: "facebook",
                    //username: "",
                   // password: "",
                    accessToken: accessToken
                };
                thiz.sendLoginRequest(loginRequest);
            };

            this.connect();
        },

        tokenLogin : function (token) {
            this.lastRequestLogin = "tokenLogin";
            if (!this.checkIMEI()) {
                return;
            }

            this.loginSuccessHandler = null;

            var thiz = this;
            this.loginHandler = function () {
                var loginRequest = {
                    command: "login",
                    type: "token",
                    accessToken: token
                };
                thiz.sendLoginRequest(loginRequest);
            };

            this.connect();
        },
        sendLoginRequest : function (loginRequest) {
            loginRequest.command = "login";
            loginRequest.platformId = ApplicationConfig.PLATFORM;
            loginRequest.bundleId = SystemPlugin.getInstance().getPackageName();
            loginRequest.version = SystemPlugin.getInstance().getVersionName();
            loginRequest.imei = PlayerMe.IMEI;
            loginRequest.displayType = ApplicationConfig.DISPLAY_TYPE;

            cc.log(loginRequest);
            this.send(loginRequest);
        },
        signup: function (username, password, telephone, gender) {
            if (!this.checkIMEI()) {
                return;
            }
            this.loginSuccessHandler = null;
            var thiz = this;
            var _username = username;
            var _password = password;
            var _telephone = telephone;
            var _gender =  gender;

            this.loginHandler = function () {
                thiz.loginSuccessHandler = function () {
                    thiz.login(username, password, true);
                    if (cc.Global.GetSetting("savePassword", true)) {
                        cc.Global.setSavePassword(_password);
                        cc.Global.setSaveUsername(_username);
                    }
                };
                var signupRequest = {
                    command: "register",
                    platformId: ApplicationConfig.PLATFORM,
                    bundleId: SystemPlugin.getInstance().getPackageName(),
                    version: SystemPlugin.getInstance().getVersionName(),
                    imei: PlayerMe.IMEI,
                    username: _username,
                    password: _password
                };
                if(_telephone && _telephone != ""){
                    signupRequest.telephone = _telephone;
                }
                signupRequest.gender = _gender ? "male" : "female";
                thiz.send(signupRequest);
            };
            this.connect();
        },

        requestGetTransferGoldConfig : function () {
            var request = {
                command: "fetchTransferConfig"
            };
            this.send(request);
        },

        sendRegisterPush : function () {
            var token = SystemPlugin.getInstance().getPushNotificationToken();
            if(token && token != ""){
                var request = {
                    sandbox : true,
                    command : "registerPush",
                    token : token
                }
                this.send(request);
            }
        },
        reconnect: function () {
            var runningScene = cc.director.getRunningScene();
            if (runningScene.type == "HomeScene") {
                if (runningScene.homeLocation == 1) {
                    if (LoadingDialog.getInstance().isShow()) {
                        LoadingDialog.getInstance().hide();
                        SceneNavigator.toHome("Mất kết nối máy chủ");
                        // MessageNode.getInstance().show("Mất kết nối máy chủ");
                        // LobbyClient.getInstance().close();
                        // SmartfoxClient.getInstance().close();
                    }
                    return;
                }
                else {
                    //reconnect with loading
                    LoadingDialog.getInstance().show("Đang kết nối lại máy chủ");
                }
                // MessageNode.getInstance().show("Hết thời gian kết nối máy chủ");
            }
            else {
                //reconnect not loading
            }

            this.reconnectTimeout = 30.0;
            this.isReconnected = true;
            this.connect();
        },

        reconnectSmartfox: function (serverInfo) {
            if (SmartfoxClient.getInstance().isConnected()) {
                LoadingDialog.getInstance().hide();
            }
            else {
                LoadingDialog.getInstance().show("Đang kết nối lại máy chủ");
                SmartfoxClient.getInstance().connect(serverInfo);
            }
        },
        subscribe: function (gameId, group) {
            //      cc.log("send subscribeChannel: "+gameId);
            PlayerMe.gameType = s_games_chanel[gameId];
            var request = {
                command: "subscribeChannel",
                gameType: PlayerMe.gameType
            };
            if (PlayerMe.gameType == "ShakeDisk" || PlayerMe.gameType == "TaiXiu") {

            }
            else {
                if (group) {
                    PlayerMe.lastGroupSelected = group;
                }
                if (PlayerMe.lastGroupSelected) {
                    request.group = PlayerMe.lastGroupSelected;
                }
            }

            this.send(request);
        },
        unSubscribe: function () {
            var request = {
                command: "unsubscribeChannel",
                gameType: PlayerMe.gameType
            };
            this.send(request);
        },
        requestGetServer: function (betting) {
            this.betting = betting;
            var request = {
                command: "getGameServer",
                gameType: PlayerMe.gameType,
                betting: betting
            };
            this.send(request);
        },
        requestGetLastSessionInfo: function () {
            var request = {
                command: "getLastSessionInfo"
            };
            this.send(request);
        },
        
        createServerInfo : function (serverData) {
            var serverInfo = {};
            var host = serverData["host"];
            if(!host){
                host = serverData["ip"];
            }

            if (cc.sys.isNative) {
                var port = serverData.port;
                serverInfo.host = host;
                serverInfo.port = port;
                serverInfo.serverUrl = host + ":" + port;
            }
            else {
                var url = serverData["wssPath"];
                if(!url){
                    var port = serverData["websocketPort"];
                    if(!port){
                        port = serverData["webSocketPort"];
                    }
                    if(!port){
                        port = serverData.port;
                    }
                    url = "ws://" + host + ":" + port + "/websocket";
                }
                serverInfo.webSocketUrl = url;
                serverInfo.serverUrl = url;

                // var port = serverData["websocketPort"];
                // if(!port){
                //     port = serverData["webSocketPort"];
                // }
                // if(!port){
                //     port = serverData["port"];
                // }
                // var url = "ws://" + host + ":" + port + "/websocket";
                // serverInfo.webSocketUrl = url;
                // serverInfo.serverUrl = url;
            }
            return serverInfo;
        },
    });

    Clazz.getInstance = function () {
        if (!instance) {
            instance = new Clazz();
        }
        return instance;
    };

    return Clazz;
})();