/**
 * Created by QuyetNguyen on 11/9/2016.
 */

var socket = socket || {};

socket.SFSSocket = socket.SFSSocket || {};
socket.SFSSocket.NotConnection = 0;
socket.SFSSocket.Connecting = 1;
socket.SFSSocket.Connected = 2;
socket.SFSSocket.ConnectFailure = 3;
socket.SFSSocket.LostConnection = 4;
socket.SFSSocket.Closed = 5;

socket.SFSSocket.StatusName = socket.SFSSocket.StatusName || {};
socket.SFSSocket.StatusName[socket.SFSSocket.NotConnection] = "NotConnected";
socket.SFSSocket.StatusName[socket.SFSSocket.Connecting] = "Connecting";
socket.SFSSocket.StatusName[socket.SFSSocket.Connected] = "Connected";
socket.SFSSocket.StatusName[socket.SFSSocket.ConnectFailure] = "ConnectFailure";
socket.SFSSocket.StatusName[socket.SFSSocket.LostConnection] = "LostConnection";
socket.SFSSocket.StatusName[socket.SFSSocket.Closed] = "Closed";

socket.SmartfoxClient = cc.Class.extend({
    ctor : function () {
        this.wsocket = null;
        this._waitingPing = false;
        this.socketStatus = socket.SFSSocket.NotConnection;

        var thiz = this;
        function onTimerTick() {
            thiz.updatePing();
        }
        setInterval(onTimerTick, 5000); // 5s
    },
    updatePing : function () {
        if(this.wsocket && this.socketStatus == socket.SFSSocket.Connected){
            if(this._waitingPing){
                //lost ping
                cc.log("[SFS] lost PING");
                this.closeSocket();
                this.setSocketStatus(socket.SFSSocket.LostConnection);
            }
            else{
                this.send(socket.SmartfoxClient.PingPong, null);
                this._sendPingTime = Date.now();
                this._waitingPing = true;
            }
        }
    },
    connect : function (url) {
        if(this.wsocket){
            this.close();
        }

        this.setSocketStatus(socket.LobbySocket.Connecting);

      //  var url = "ws://uat1.puppetserver.com:8888/websocket";
        var wsocket = new WebSocket(url);
        this.wsocket = wsocket;

        var thiz = this;

        this.wsocket.onopen = function (event) {
          //  cc.log("onOpen: "+event.type);
            if(thiz.socketStatus == socket.SFSSocket.Connecting){
                thiz._waitingPing = false;
                thiz.setSocketStatus(socket.SFSSocket.Connected);
            }
        };
        this.wsocket.onmessage = function (event) {
           // cc.log("onmessage: "+event.type);
            thiz.onRecvMessage(event.data);
        };
        this.wsocket.onerror = function (event) {
            thiz.closeSocket();
            if(thiz.socketStatus == socket.SFSSocket.Connecting){
                thiz.setSocketStatus(socket.SFSSocket.ConnectFailure);
            }
            else if(thiz.socketStatus == socket.SFSSocket.Connected){
                thiz.setSocketStatus(socket.SFSSocket.LostConnection);
            }
        };
        this.wsocket.onclose = function (event) {
            thiz.closeSocket();
            if(thiz.socketStatus == socket.SFSSocket.Connecting){
                thiz.setSocketStatus(socket.SFSSocket.ConnectFailure);
            }
            else if(thiz.socketStatus == socket.SFSSocket.Connected){
                thiz.setSocketStatus(socket.SFSSocket.LostConnection);
            }
        };
    },
    close : function () {
        this.closeSocket();
        if(this.socketStatus == socket.SFSSocket.Connected){
            this.setSocketStatus(socket.SFSSocket.Closed);
        }
    },

    closeSocket : function () {
        if(this.wsocket){
            this.resetSocket();
            if(this.wsocket.readyState == 0){ //connecting
                var ws = this.wsocket;
                ws.onopen = function () { //close when open
                    ws.close();
                };
            }
            else if(this.wsocket.readyState == 1){ //open
                this.wsocket.close();
            }
            this.wsocket = null;
        }
    },

    resetSocket : function () {
        if(this.wsocket){
            this.wsocket.onopen = 0;
            this.wsocket.onmessage = 0;
            this.wsocket.onerror = 0;
            this.wsocket.onclose = 0;
        }
    },
    setSocketStatus : function (status) {
        this.socketStatus = status;
        if(this.onEvent){
            //cc.log("sfs: status :"+socket.SFSSocket.StatusName[this.socketStatus]);
            this.onEvent(socket.SFSSocket.StatusName[this.socketStatus]);
        }
    },
    getStatus : function () {
        return this.socketStatus;
    },
    onRecvMessage : function (data) {
        if(this.onMessage){
            var content = JSON.parse(data);
            var action = content.a;
            if(action == socket.SmartfoxClient.PingPong){
                var latency = Date.now() - this._sendPingTime;
                cc.log("[SFS] Recv PING: "+latency.toString() + "ms");

                this._waitingPing = false;
            }
            else{
                var param = JSON.stringify(content.p);
                this.onMessage(action, param);
            }
        }
    },
    send : function (requestType, data) {
        if(this.wsocket && this.socketStatus == socket.SFSSocket.Connected){

            var controllerId = 0;
            if(requestType == socket.SmartfoxClient.CallExtension){
                controllerId = 1;
            }
            if(data){
                var param = JSON.parse(data);
            }
            else{
                var param = {};
            }
            var request = {
                a : requestType,
                c : controllerId,
                p : param
            };
            this.wsocket.send(JSON.stringify(request));

            //cc.log("send: "+data);
        }
    }
});

socket.SmartfoxClient.NotConnection = socket.SFSSocket.NotConnection;
socket.SmartfoxClient.Connecting = socket.SFSSocket.Connecting;
socket.SmartfoxClient.Connected = socket.SFSSocket.Connected;
socket.SmartfoxClient.ConnectFailure = socket.SFSSocket.ConnectFailure;
socket.SmartfoxClient.LostConnection = socket.SFSSocket.LostConnection;
socket.SmartfoxClient.Closed = socket.SFSSocket.Closed;

socket.SmartfoxClient.Handshake = 0;
socket.SmartfoxClient.Login = 1;
socket.SmartfoxClient.Logout = 2;
socket.SmartfoxClient.GetRoomList = 3;
socket.SmartfoxClient.JoinRoom = 4;
socket.SmartfoxClient.AutoJoin = 5;
socket.SmartfoxClient.CreateRoom = 6;
socket.SmartfoxClient.GenericMessage = 7;
socket.SmartfoxClient.ChangeRoomName = 8;
socket.SmartfoxClient.ChangeRoomPassword = 9;
socket.SmartfoxClient.ObjectMessage = 10;
socket.SmartfoxClient.SetRoomVariables = 11;
socket.SmartfoxClient.SetUserVariables = 12;
socket.SmartfoxClient.CallExtension = 13;
socket.SmartfoxClient.LeaveRoom = 14;
socket.SmartfoxClient.SubscribeRoomGroup = 15;
socket.SmartfoxClient.UnsubscribeRoomGroup = 16;
socket.SmartfoxClient.SpectatorToPlayer = 17;
socket.SmartfoxClient.PlayerToSpectator = 18;
socket.SmartfoxClient.ChangeRoomCapacity = 19;
socket.SmartfoxClient.PublicMessage = 20;
socket.SmartfoxClient.PrivateMessage = 21;
socket.SmartfoxClient.ModeratorMessage = 22;
socket.SmartfoxClient.AdminMessage = 23;
socket.SmartfoxClient.KickUser = 24;
socket.SmartfoxClient.BanUser = 25;
socket.SmartfoxClient.ManualDisconnection = 26;
socket.SmartfoxClient.FindRooms = 27;
socket.SmartfoxClient.FindUsers = 28;
socket.SmartfoxClient.PingPong = 29;
socket.SmartfoxClient.SetUserPosition = 30;
//--- Buddy List API Requests -------------------------------------------------
socket.SmartfoxClient.InitBuddyList = 200;
socket.SmartfoxClient.AddBuddy = 201;
socket.SmartfoxClient.BlockBuddy = 202;
socket.SmartfoxClient.RemoveBuddy = 203;
socket.SmartfoxClient.SetBuddyVariables = 204;
socket.SmartfoxClient.GoOnline = 205;
//--- Game API Requests --------------------------------------------------------
socket.SmartfoxClient.InviteUser = 300;
socket.SmartfoxClient.InvitationReply = 301;
socket.SmartfoxClient.CreateSFSGame = 302;
socket.SmartfoxClient.QuickJoinGame = 303;
//only reponse code
socket.SmartfoxClient.UserEnterRoom = 1000,
    socket.SmartfoxClient.UserCountChange = 1001;
socket.SmartfoxClient.UserLost  = 1002;
socket.SmartfoxClient.RoomLost = 1003;
socket.SmartfoxClient.UserExitRoom = 1004;
socket.SmartfoxClient.ClientDisconnection = 1005;
socket.SmartfoxClient.ReconnectionFailure = 1006;
socket.SmartfoxClient.SetMMOItemVariables = 1007;

socket.SmartfoxClient.SocketStatus = 3000;