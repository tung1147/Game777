/**
 * Created by Quyet Nguyen on 3/7/2017.
 */

var ViewNavigator = cc.Class.extend({
    ctor : function () {
       this._initListener();
    },

    _initListener : function () {
        LobbyClient.getInstance().addListener("login", this._onLoginFinished, this);
      //  LobbyClient.getInstance().addListener("error", this._onError, this);
       // LobbyClient.getInstance().addListener("LobbyStatus", this._onLobbyStatusHandler, this);
       // LobbyClient.getInstance().addListener("kicked", this._onKicked, this);
    },

    _removeListener : function (cmd, event) {
        LobbyClient.getInstance().removeListener(this);
        //cc.log("_removeListener 111");
    },

    _onLoginFinished : function (cmd, event) {
        if (event.status == 0) { //login ok
            this._removeListener();

            var lastSessionInfo = event.data.lastSessionInfo;
            if (lastSessionInfo.ip && lastSessionInfo.port) { // reconnect

            }
            else{
                this._onLoginSuccess();
            }
        }
    },

    // _onError : function (cmd, event) {
    //    // this._removeListener();
    // },
    //
    // _onKicked : function (cmd, event) {
    //  //   this._removeListener();
    // },
    //
    // _onLobbyStatusHandler : function (cmd, event) {
    //     if (event === "ConnectFailure" || event === "LostConnection") {
    //       //  this._removeListener();
    //     }
    // },

    _onLoginSuccess : function () {

    },

    execute : function () {
        var accessToken = cc.Global.GetSetting("accessToken","");
        if(accessToken !== ""){
            LoadingDialog.getInstance().show("Đang đăng nhập");
            LobbyClient.getInstance().tokenLogin(accessToken);
        }
        else{
            SceneNavigator.showLoginNormal();
        }

        // var loginType = cc.Global.GetSetting("lastLoginType", "");
        // if(loginType == "normalLogin"){
        //     var username = cc.Global.getSaveUsername();
        //     var password = cc.Global.getSavePassword();
        //     if(username != "" && password != ""){
        //         LoadingDialog.getInstance().show("Đang đăng nhập");
        //         LobbyClient.getInstance().loginNormal(username, password, true);
        //     }
        //     else{
        //         SceneNavigator.showLoginNormal();
        //     }
        // }
        // else if(loginType == "facebookLogin"){
        //     LoadingDialog.getInstance().show("Đang đăng nhập");
        //     FacebookPlugin.getInstance().showLogin();
        // }
        // else{
        //     SceneNavigator.showLoginNormal();
        // }
    }
});

var ViewNavigatorLobby = ViewNavigator.extend({
    ctor : function (gameId) {
        this._super();
        this.gameId = gameId;
    },

    _onLoginSuccess : function () {
        this._super();

        var homeScene = cc.director.getRunningScene();
        homeScene.onTouchGame(this.gameId);
    }
});

var ViewNavigatorManager = ViewNavigatorManager || {};
ViewNavigatorManager.execute = function () {
    // window.onhashchange = function () {
    //     ViewNavigatorManager.execute();
    // };

    window.addEventListener("storage",function(e) {
        if(e.key == "accessToken"){
            cc.log(e);
            if(e.newValue && e.newValue != ""){
                var view = new ViewNavigator();
                view.execute();
            }
            else{
               // cc.log("toHome");
                SceneNavigator.toHome();
            }
        }
    },true);

    var hash = window.location.hash;
    if(hash == "#lobby"){
        var view = new ViewNavigator();
        view.execute();
        return true;
    }
    else if(hash == "#tlmn"){
        var view = new ViewNavigatorLobby(GameType.GAME_TienLenMN);
        view.execute();
        return true;
    }
    else if(hash == "#tlmn_solo"){
        var view = new ViewNavigatorLobby(GameType.GAME_TLMN_Solo);
        view.execute();
        return true;
    }
    else if(hash == "#sam"){
        var view = new ViewNavigatorLobby(GameType.GAME_Sam);
        view.execute();
        return true;
    }
    else if(hash == "#sam_solo"){
        var view = new ViewNavigatorLobby(GameType.GAME_Sam_Solo);
        view.execute();
        return true;
    }
    else if(hash == "#bacay"){
        var view = new ViewNavigatorLobby(GameType.GAME_BaCay);
        view.execute();
        return true;
    }
    else if(hash == "#taixiu"){
        var view = new ViewNavigatorLobby(GameType.GAME_TaiXiu);
        view.execute();
        return true;
    }
    else if(hash == "#xocdia"){
        var view = new ViewNavigatorLobby(GameType.GAME_XocDia);
        view.execute();
        return true;
    }

    else if(hash == "#maubinh"){
        var view = new ViewNavigatorLobby(GameType.GAME_MauBinh);
        view.execute();
        return true;
    }

    return false;
};

