/**
 * Created by QuyetNguyen on 11/23/2016.
 */

s_sfs_error_msg[34] = "Không được để 2 cuối";
s_sfs_error_msg[32] = "Hết thời gian báo sâm";

var s_defWin_Sam = s_defWin_Sam || [];
s_defWin_Sam[0]= "Ăn trắng 5 đôi";
s_defWin_Sam[1]= "Ăn trắng 3 Xám";
s_defWin_Sam[2]= "Ăn trắng đồng màu";
s_defWin_Sam[3]= "Ăn trắng Tứ 2";
s_defWin_Sam[4]= "Ăn trắng sảnh rồng";
s_defWin_Sam[6]= "Ăn trắng sảnh";
s_defWin_Sam[15]= "Hòa";
s_defWin_Sam[16]= "Ăn sâm";
s_defWin_Sam[17]= "Bị bắt sâm";
s_defWin_Sam[18]= "Phạt báo 1";
s_defWin_Sam[19]= "Bị ăn trắng";
s_defWin_Sam[21]= "Bắt sâm";
// s_defWin_Sam[13]= "Thắng";
// s_defWin_Sam[20]= "Thua";

var SamController = TLMNGameController.extend({
    ctor : function (view) {
        this._super();
        this.initWithView(view);

        SmartfoxClient.getInstance().addExtensionListener("51", this._onUserCallSamHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("52", this._onUserFoldSamHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("53", this._onChangeSamStateHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("54", this._onNotifiOneHandler, this);
    },

    getMaxSlot : function () {
        if(this.isSolo){
            return 2;
        }
        return 5;
    },

    // onSFSExtension: function (messageType, content) {
    //     this._super(messageType, content);
    //   //  cc.log(JSON.stringify(content));
    //     if (content.c == "51") {
    //         this.onUserCallSam(content.p.u);
    //     }
    //     else if (content.c == "52") {
    //         this.onUserFoldSam(content.p.u);
    //     }
    //     else if (content.c == "53") {
    //         this.onChangeSamState(content.p["1"],content.p["2"]);
    //     }
    //     else if (content.c == "54") {
    //         this.onNotifiOne(content.p.u);
    //     }
    // },

    _onUserCallSamHandler : function (cmd, content) {
        this.onUserCallSam(content.p.u);
    },

    _onUserFoldSamHandler : function (cmd, content) {
        this.onUserFoldSam(content.p.u);
    },

    _onChangeSamStateHandler : function (cmd, content) {
        this.onChangeSamState(content.p["1"],content.p["2"]);
    },

    _onNotifiOneHandler : function (cmd, content) {
        this.onNotifiOne(content.p.u);
    },

    onUserCallSam : function (username) {

        if(username == PlayerMe.username)
        {
            var msg = "Bạn đã báo sâm thành công";
            this._view.alertMessage(msg);
        }
        else
        {
            this._view.notifyBaoSam(username, true);
        }
        this._view.setSamBtVisible(false);
    },

    onUserFoldSam : function (username) {
        if(username == PlayerMe.username)
        {
            var msg = "Bạn đã huỷ sâm thành công";
            this._view.alertMessage(msg);
        }
        else
        {
            this._view.notifyBaoSam(username, false);
        }

        if (PlayerMe.username == username){
            this._view.setSamBtVisible(false);
        }
    },

    onChangeSamState: function (state, timeRemaining) {
        this._view.setSamBtVisible(state == 1);

        if (state == 1){
            this._view.showBaoSamTimeRemaining(Math.round(timeRemaining/1000));
            this._view.setDanhBaiBtVisible(false);
            for(var i = 0; i < this._view.playerView.length; i++)
                this._view.playerView[i].stopTimeRemain();
        }
        else
            this._view.showBaoSamTimeRemaining(0);
    },

    onGameFinished : function (params) {
       // this._super(params);
        this._view.setDanhBaiBtVisible(false);
        this._view.setXepBaiBtVisible(false);
        this._view.setBoLuotBtVisible(false);
        this._view.setStartBtVisible(false);
        this._view.setSamBtVisible(false);

        this._view.onUpdateTurn(".",0,0);

        var winPlayer = params.u;
        var playerData = params["3"];
        var player = [];
        for (var i = 0; i < playerData.length; i++) {
            var username = playerData[i].u;
            var gold = parseInt(playerData[i]["4"]);
            var title = null;
            var defWinType = playerData[i]["5"];

            var cardListData = playerData[i]["2"];
            var cardList = [];
            for(var j=0;j<cardListData.length;j++){
                cardList.push(CardList.prototype.getCardWithId(cardListData[j]));
            }

            if(username == winPlayer){
                title = s_defWin_Sam[defWinType] ? s_defWin_Sam[defWinType] : "Thắng";
            }
            else{
                var msg = s_defWin_Sam[defWinType];
                title = msg ? msg : ("Thua " + cardList.length + " lá");
            }

            player[i] = {
                username : username,
                title : title,
                gold : gold,
                cardList : cardList,
                isWinner : username == winPlayer
            };

            //update gold
            var userGold = parseInt(playerData[i]["3"]);
            this._view.updateGold(username, userGold);
        }

        this._view.showFinishedDialog(player);

        this._view.hideAllNotifyOne();
    },

    onNotifiOne: function (username) {
        if (username != PlayerMe.username){
            this._view.notifyOne(username);
        }
    },

    sendBaoSamRequest:function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("51", {});
    },

    sendHuySamRequest:function(){
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("52",{});
    },

});