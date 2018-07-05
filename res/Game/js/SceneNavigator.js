/**
 * Created by Quyet Nguyen on 8/9/2016.
 */

var SceneNavigator = SceneNavigator || {};
SceneNavigator.toHome = function (message) {
    setTimeout(function () {
        LobbyClient.getInstance().close();
        SmartfoxClient.getInstance().close();
    }, 1.0);
    if(!cc.sys.isNative && window.parent.user_logout){
        window.parent.user_logout();
    }

    var homeScene = cc.director.getRunningScene();
    if (homeScene.type == "HomeScene") {
        homeScene.startHome();
    }
    else {
        homeScene = new HomeScene();
        homeScene.startHome();
        cc.director.replaceScene(homeScene);
    }

    if(message){
        MessageNode.getInstance().showWithParent(message, homeScene.messageLayer);
    }

    MiniGameNavigator.hideAll();
};

SceneNavigator.toAccountActiveView = function () {
    var dialog = new UserinfoDialog();
    dialog.selectTab = 2;
    dialog.show();
};

SceneNavigator.toLobby = function (message) {
    SmartfoxClient.getInstance().close();

    var homeScene = cc.director.getRunningScene();
    if (homeScene.type == "HomeScene") {
        homeScene.startGame();
    }
    else {
        homeScene = new HomeScene();
        homeScene.startGame();
        cc.director.replaceScene(homeScene);
    }

    if(message){
        MessageNode.getInstance().showWithParent(message, homeScene.messageLayer);
    }
};

SceneNavigator.toGame = function (message) {

};

SceneNavigator.toGame = function (gameId,message) {

};

SceneNavigator.toMiniGame = function (gameId, isReconnect) {
    MiniGameNavigator.showGame(gameId);
    if(isReconnect){
        LobbyClient.getInstance().postEvent("miniGameReconnect", null);
    }
};

SceneNavigator.showLoginNormal = function () {
    if(!cc.sys.isNative && window.parent.show_popup_login){
        window.parent.show_popup_login();
    }
    else{
        var dialog = new LoginDialog();
        dialog.show();
    }
};

SceneNavigator.showLoginFacebook = function () {
    if(!cc.sys.isNative && window.parent.login_facebook){
        window.parent.login_facebook();
    }
    else{
        FacebookPlugin.getInstance().showLogin();
    }
};

SceneNavigator.showSignup = function () {
    if(!cc.sys.isNative && window.parent.show_popup_login){
        window.parent.show_popup_login();
    }
    else{
        var dialog = new SignupDialog();
        dialog.show();
    }
};