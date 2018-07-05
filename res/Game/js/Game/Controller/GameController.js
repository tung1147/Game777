/**
 * Created by QuyetNguyen on 11/23/2016.
 */

var s_sfs_error_msg = s_sfs_error_msg || [];

var GameController = cc.Class.extend({
    ctor: function () {

    },
    initWithView: function (view) {
        this._view = view;
        SmartfoxClient.getInstance().addListener(socket.SmartfoxClient.SocketStatus, this.onSmartfoxSocketStatus, this);
        SmartfoxClient.getInstance().addListener(socket.SmartfoxClient.UserExitRoom, this.onSmartfoxUserExitRoom, this);
        SmartfoxClient.getInstance().addListener(socket.SmartfoxClient.CallExtension, this.onSFSExtension, this);
        SmartfoxClient.getInstance().addListener(socket.SmartfoxClient.GenericMessage, this.onSmartfoxRecvChatMessage, this);

        SmartfoxClient.getInstance().addExtensionListener("0", this.onUpdateGold, this);
        SmartfoxClient.getInstance().addExtensionListener("-1", this.onChangeAsset, this);
        SmartfoxClient.getInstance().addExtensionListener("1", this._onJoinRoomHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("2", this._onUserJoinRoomHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("9", this.onUserExit, this);
        SmartfoxClient.getInstance().addExtensionListener("11", this._onUpdateOwnerHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("13", this._onReconnectHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("19", this.onExitGame, this);

        SmartfoxClient.getInstance().addExtensionListener("___err___", this.onError, this);
        SmartfoxClient.getInstance().addExtensionListener("ping", this.onPingHandler, this);

        LobbyClient.getInstance().addListener("getLastSessionInfo", this.onGetLastSessionInfo, this);
    },

    releaseController: function () {
        SmartfoxClient.getInstance().removeListener(this);
        LobbyClient.getInstance().removeListener(this);
        this._view = null;
    },

    onSmartfoxSocketStatus: function (type, eventName) {
        if (eventName == "LostConnection") {
            LoadingDialog.getInstance().show("Đang kết nối lại máy chủ");
            LobbyClient.getInstance().requestGetLastSessionInfo();
        }
    },

    onSmartfoxUserExitRoom: function (messageType, contents) {
        // if(PlayerMe.SFS.userId ==  contents.u){
        //     this._view.exitToLobby();
        // }
    },

    onSmartfoxRecvChatMessage: function (event, data) {
        if(data["m"] === "[emoji]" && data["p"]["emojiName"]){
            this._view.onChatEmotion(data.p.userName, data["p"]["emojiName"]);
        }
        else{
            this._view.onChatMessage(data.p.userName, data.m);
        }
    },

    onSFSExtension: function (messageType, content) {
        // if(content.c == "ping"){
        //     SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("ping", null);
        // }
        // else if(content.c == "0"){ //update gold
        //     this.onUpdateGold(content.p);
        // }
        // if(content.c == "1"){ //startGame
        //     this.onJoinRoom(content.p);
        // }
        // else if (content.c == "13"){//reconnect
        //     this.onReconnect(content.p);
        // }
        // else if (content.c == "2"){ //user joinRoom
        //     this.onUserJoinRoom(content.p);
        // }
        // else if (content.c == "9"){ //user exit
        //     this.onUserExit(content.p);
        // }
        // else if(content.c == "11"){ // update owner
        //     this.onUpdateOwner(content.p.u);
        // }
        // else if(content.c == "19"){ // exit room
        //    this.onExitGame(content.p);
        // }
        // else if(content.c == "___err___"){ //error chem
        //     this.onError(content.p);
        // }

        // if(this._view.onSFSExtension){
        //     this._view.onSFSExtension(messageType, content);
        // }
    },

    onPingHandler: function (cmd, content) {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("ping", null);
    },

    onUpdateGold: function (cmd, content) {
        var params = content.p;

        this._view.updateGold(params.u, params["2"]);
        if (params.u == PlayerMe.username) {
            PlayerMe.gold = parseInt(params["2"]);
        }
    },

    onChangeAsset: function (cmd, content) {
        var params = content.p;
        var reason = params["r"];
        if(reason >= 0){
            if(params["1"] !== null & params["1"] !== undefined){
                this._view.updateGold(params["un"], params["1"]);
                this._view.changeGoldEffect(params["un"], params["d"]);
            }
        }
    },

    onUserExit: function (cmd, content) {
        var params = content.p;
        if (params.u != PlayerMe.username) {
            this._onUserExit(params.u);
        } else {
            var message = null;
            switch (params.reason) {
                case 3:
                    message = "Bạn bị kick do không bắt đầu ván chơi";
                    break;
                case 4: // het tien
                    {
                        var homeScene = this._view.exitToLobby(null);
                        homeScene.showPaymentDialog();
                        return;
                    }
            }
            this._view.exitToLobby(message);
        }
    },
    _onUserExit : function (username) {
        for(var i=0;i<this.playerSlot.length;i++){
            if(this.playerSlot[i].username == username){
                this.playerSlot[i].username = "";
            }
        }
        this._view.userExitRoom(username);
    },

    onError: function (cmd, content) {

    },

    onExitGame: function (cmd, content) {
        var param = content.p;
        this._view.updateRegExitRoom(param["1"]);
        if (param["1"]) {
            MessageNode.getInstance().show("Bạn đã đăng ký thoát phòng thành công !");
        }
        else {
            MessageNode.getInstance().show("Bạn đã hủy đăng ký thoát phòng thành công !");
        }
    },

    _onJoinRoomHandler: function (cmd, content) {
        this.onJoinRoom(content.p);
    },

    _onReconnectHandler: function (cmd, content) {
        this.onReconnect(content.p);
    },

    _onUpdateOwnerHandler: function (cmd, content) {
        this.onUpdateOwner(content.p.u);
    },

    _onUserJoinRoomHandler: function (cmd, content) {
        this.onUserJoinRoom(content.p);
    },

    onJoinRoom: function (params) {
        this._processPlayerPosition(params["5"]);
    },

    onReconnect: function (params) {
        this._processPlayerPosition(params["1"]["5"]);
    },

    onUpdateOwner: function (params) {
        if (PlayerMe.username == params) {
            this.isOwnerMe = true;
        }
        else {
            this.isOwnerMe = false;
        }

        this._view.setOwner (params);
    },

    onUserJoinRoom: function (p) {
        var slotIndex = p["4"];
        var username = p["u"];
        for(var i=0;i<this.playerSlot.length;i++){
            if(this.playerSlot[i].userIndex == slotIndex){
                this.playerSlot[i].username = username;
                break;
            }
        }

        var userInfo = {
            index: slotIndex,
            username: username,
            gold: p["3"],
            avt: p["avtUrl"]
        };

        this._view.userJoinRoom(userInfo);
    },

    _createUserInfo : function (data) {
        if(!data){
            return {
                gold: 0,
                spectator: false
            };
        }
        return {
            gold : data["3"],
            spectator : data["2"]
        };
    },

    _processPlayerPosition: function (players) {
        //find me
        var meIndex = 0;
        this.isSpectator = false;
        for (var i = 0; i < players.length; i++) {
            if (players[i].u == PlayerMe.username) {
                meIndex = players[i]["4"];
                if (meIndex < 0){
                    meIndex = 0;
                }
                this.isSpectator = players[i]["2"];
                var regExt = players[i]["regExt"];
                this._view.updateRegExitRoom(regExt);
                break;
            }
        }

        this.playerSlot = [];
        var maxSlot = this.getMaxSlot();
        for (var i = 0; i < maxSlot; i++) {
            var slot = i - meIndex;
            if (slot < 0) {
                slot += maxSlot;
            }
            this.playerSlot[slot] = {
                userIndex: i,
                username: "",
                avt: "",
                gold: 0,
                spectator: false,
                info: this._createUserInfo(null)
            };
        }

        for (var i = 0; i < players.length; i++) {
            if (players[i]["4"] < 0){
                continue;
            }
            var slot = players[i]["4"] - meIndex;
            if (slot < 0) {
                slot += maxSlot;
            }

            this.playerSlot[slot].username = players[i]["u"];
            this.playerSlot[slot].avt = players[i]["avtUrl"];
            this.playerSlot[slot].gold = players[i]["3"];
            this.playerSlot[slot].spectator = players[i]["2"];
            this.playerSlot[slot].info = this._createUserInfo(players[i]);

            // this.playerSlot[slot] = {
            //     userIndex : players[i]["4"],
            //     username : players[i]["u"],
            //     gold : players[i]["3"],
            //     spectator : players[i]["2"]
            // }
        }

        this._view.fillPlayerToSlot(this.playerSlot);

        //update owner
        var ownerPlayer = null;
        for (var i = 0; i < players.length; i++) {
            if (players[i]["1"] == true) {
                ownerPlayer = players[i].u;
                if (PlayerMe.username == ownerPlayer) {
                    this.isOwnerMe = true;
                }
                else {
                    this.isOwnerMe = false;
                }
                break;
            }
        }
        //this._view.updateOwner(ownerPlayer);
        this.onUpdateOwner(ownerPlayer);
    },

    //lobby client
    onGetLastSessionInfo: function (command, eventData) {
        var info = eventData.data.lastSessionInfo;
        if (info && info.ip && info.port) {
            var serverInfo = LobbyClient.getInstance().createServerInfo(info);
            this._view.showLoading("Đang kết nối lại máy chủ");
            SmartfoxClient.getInstance().connect(serverInfo);
            return;
        }
        this._view.exitToLobby();
    },

    //request
    requestQuitRoom: function () {
        SmartfoxClient.getInstance().sendExtensionRequest(PlayerMe.SFS.roomId, "19", null);
    },

    sendChat: function (message) {
        var content = {
            t: 0, //public message
            r: PlayerMe.SFS.roomId,
            u: PlayerMe.SFS.userId,
            m: message,
            p: {
                userName: PlayerMe.username
            }
        };
        SmartfoxClient.getInstance().send(socket.SmartfoxClient.GenericMessage, content);
    },

    sendChatEmotion : function (icon) {
        var content = {
            t: 0, //public message
            r: PlayerMe.SFS.roomId,
            u: PlayerMe.SFS.userId,
            m: "[emoji]",
            p: {
                userName: PlayerMe.username,
                emojiName : icon
            }
        };
        SmartfoxClient.getInstance().send(socket.SmartfoxClient.GenericMessage, content);
    }
});