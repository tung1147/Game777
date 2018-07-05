/**
 * Created by Quyet Nguyen on 6/30/2016.
 */

var s_homescene_first_run = true;

var HomeScene = IScene.extend({
    ctor: function () {
        this._super();
        this.miniGameLayer = new cc.Node();
        this.addChild(this.miniGameLayer, 1);

        this.type = "HomeScene";
        this.homeLocation = 0;

        LobbyClient.getInstance().addListener("login", this.onLoginHandler, this);
        LobbyClient.getInstance().addListener("LobbyStatus", this.onLobbyStatusHandler, this);
        LobbyClient.getInstance().addListener("ca", this.onChangeAsset, this);
        LobbyClient.getInstance().addListener("inboxMessage", this.onChangeRefeshUserInfo, this);
        LobbyClient.getInstance().addListener("getPlayNowServer", this.onGetPlayNowServer, this);

        // LobbyClient.getInstance().addListener("inventory", this.onChangeRefeshUserInfo, this);
        // LobbyClient.getInstance().addListener("updateItem", this.onChangeRefeshUserInfo, this);
        //LobbyClient.getInstance().addListener("markReadedMessageInbox", this.onChangeRefeshUserInfo, this);
        LobbyClient.getInstance().addListener("news", this.onNewsMessage, this);
        LobbyClient.getInstance().addListener("miniGameReconnect", this.onMiniGameReconnect, this);
        SmartfoxClient.getInstance().addExtensionListener("0", this.onSFSChangeGold, this);

        var bg = new cc.Sprite("res/game-bg.jpg");
        bg.x = cc.winSize.width / 2;
        bg.y = cc.winSize.height / 2;
        this.sceneLayer.addChild(bg);

        this.mainLayer = new cc.Node();
        this.sceneLayer.addChild(this.mainLayer);

        this.topBar = new LobbyTopBar();
        this.mainLayer.addChild(this.topBar);

        this.userInfo = new LobbyBottomBar();
        this.mainLayer.addChild(this.userInfo);

        this.homeLayer = new HomeLayer();
        this.mainLayer.addChild(this.homeLayer, 1);

        this.gameLayer = new GameLayer();
        this.mainLayer.addChild(this.gameLayer);

        this.lobbyLayer = new LobbyLayer();
        this.mainLayer.addChild(this.lobbyLayer);

        this.miniGame = new MiniGameLayer();
        this.mainLayer.addChild(this.miniGame);

        var thiz = this;
        this.topBar.backBt.addClickEventListener(function () {
            thiz.backButtonHandler();
        });
        this.topBar.newsBt.addClickEventListener(function () {
            thiz.newsButtonhandler();
        });
        this.topBar.rankBt.addClickEventListener(function () {
            thiz.rankButtonHandler();
        });
        this.topBar.callBt.addClickEventListener(function () {
            thiz.callButtonHandler();
        });
        this.topBar.settingBt.addClickEventListener(function () {
            thiz.settingButtonHandler();
        });
        this.topBar.inboxBt.addClickEventListener(function () {
            thiz.newsMesasgeButtonHandler();
        });
        this.topBar.activityBt.addClickEventListener(function () {
            thiz.activityButtonHandler();
        });
        this.topBar.shopBt.addClickEventListener(function () {
            thiz.shopButtonHandler();
        });
        this.topBar.transferGoldBt.addClickEventListener(function () {
            thiz.transferGoldButtonHandler();
        });
        this.userInfo.paymentBt.addClickEventListener(function () {
            thiz.paymentButtonHandler();
        });
        this.userInfo.rewardBt.addClickEventListener(function () {
            thiz.rewardButtonHandler();
        });
        this.userInfo.userinfoBt.addClickEventListener(function () {
            thiz.userInfoButtonHandler();
        });
        this.userInfo.playNowButtonHandler = function () {
            thiz.playNowButtonHandler();
        };

        this.homeLayer.fbButton.addClickEventListener(function () {
            SceneNavigator.showLoginFacebook();
        });

        this.startHome();
        //this.startGame();
        //this.startLobby();

        //
        FloatButton.getInstance().show(this.floatButtonLayer);

       // LobbyClient.getInstance().addListener("fetchProducts", this.onFetchProduct, this);
       // LobbyClient.getInstance().addListener("fetchCashinProductItems", this.onFetchCashin, this);
    },

    onFetchProduct: function (command, data) {
        // data = data["data"];
        // cc.Global.thecaoData = cc.Global.thecaoData || data["1"];
        // cc.Global.vatphamData = cc.Global.vatphamData || data["4"];
        // cc.Global.dailyData = cc.Global.dailyData || data["3"];
        // cc.Global.tienmatData = cc.Global.tienmatData || data["2"];
    },
    onFetchCashin: function (command, data) {
        //cc.log(JSON.stringify(data));
        // data = data["data"]["2"];
        // cc.Global.SMSList = [];
        // for (var i = 0; i < data.length; i++) {
        //     var currency = data[i]["currency"];
        //     var smsGateway = data[i]["detail"]["smsGateway"];
        //     var vmsContent = data[i]["detail"]["vmsContent"];
        //     var vnpContent = data[i]["detail"]["vnpContent"];
        //     var vttContent = data[i]["detail"]["vttContent"];
        //     var gold = data[i]["gold"];
        //     var id = data[i]["id"];
        //     var price = data[i]["price"];
        //     cc.Global.SMSList.push({
        //         currency: currency,
        //         smsGateway: smsGateway,
        //         vmsContent: vmsContent,
        //         vnpContent: vnpContent,
        //         vttContent: vttContent,
        //         gold: parseInt(gold.replace(",", "")),
        //         id: id,
        //         price: parseInt(price)
        //     });
        // }
    },
    onSFSChangeGold : function (messageType, data) {
        if(data.p.reason == 1){
            var goldChange = data["p"]["1"];
            if(goldChange < 0){
                MessageNode.getInstance().show("Bạn vừa bị trừ "+Math.abs(goldChange) + " Vàng vì thoát khỏi phòng", null, this);
            }
        }
    },

    _checkLogin : function () {
        if(this.homeLocation == 1){
            //MessageNode.getInstance().show("Bạn phải đăng nhập trước");
            SceneNavigator.showLoginNormal();
            return false;
        }
        return true;
    },

    onChangeAsset : function (cmd, data) {
        this.onChangeRefeshUserInfo();
        var userAssets = data["data"]["userAssets"];
        if(userAssets["gold"]){
            var deltaGold = userAssets["delta"];
            //var reason = userAssets["reason"];

            //if(deltaGold > 0){
                var changeText = (deltaGold >= 0 ? "+" : "") + cc.Global.NumberFormat1(deltaGold);
                var changeSprite = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, changeText);
                changeSprite.setColor(cc.color(deltaGold >= 0 ? "#ffde00" : "#ff0000"));
                changeSprite.setAnchorPoint(cc.p(0.0, 0.5));
                changeSprite.setPosition(100, 70);
                this.addChild(changeSprite, 420);

                changeSprite.runAction(new cc.Sequence(new cc.MoveBy(1.0, cc.p(0, 70)), new cc.CallFunc(function () {
                    changeSprite.removeFromParent(true);
                })));
            //}
        }
    },

    onChangeRefeshUserInfo : function (command, data) {
        this.userInfo.refreshView();
    },

    onNewsMessage : function (command, data) {
        //this.topBar.refreshView();
        var popupMsg = data["data"]["popup"];
        if(popupMsg && popupMsg != ""){
            //show popup
            var messageDialog = new MessageDialog();
            messageDialog.setMessage(popupMsg);
            messageDialog.showWithAnimationScale();
        }
    },

    onLoginHandler: function (command, data) {
        //  cc.log("onLoginHandler");
        if (data.status == 0) {
            this.userInfo.refreshView();
            this.miniGame.fetchHuThuong();

            // subscribe hu thuon
            LobbyClient.getInstance().send({command: "subscribeMiniGame", gameType: "Mini_Poker"});
            LobbyClient.getInstance().send({command: "subscribeMiniGame", gameType: "Mini_Cao_Thap"});
            LobbyClient.getInstance().send({command: "subscribeMiniGame", gameType: "Video_Poker"});
        }
    },

    onMiniGameReconnect : function () {
        if(this.homeLocation == 0 || this.homeLocation == 1){
            this.startGame();
        }
    },

    onLobbyStatusHandler: function () {
        //  cc.log("onLobbyStatusHandler");
    },
    startHome: function () {
        this.popupLayer.removeAllChildren();
        if (this.subLayer) {
            this.subLayer.removeFromParent(true);
            this.subLayer = 0;
            this.mainLayer.visible = true;
        }
        this.homeLayer.setVisible(true);
        this.gameLayer.setVisible(true);
        this.lobbyLayer.setVisible(false);
        this.userInfo.visible = false;
        if (this.homeLocation == 0 || this.homeLocation == 3) {
            this.gameLayer.startAnimation();
        }
        if (this.homeLocation == 0) {
            this.miniGame.startAnimation();
        }
        if(this.homeLocation != 1){
            this.homeLayer.y = -100.0;
            this.homeLayer.stopAllActions();
            this.homeLayer.runAction(new cc.EaseSineOut(new cc.MoveTo(0.3, cc.p(0, 0))));
            this.homeLocation = 1;
        }
        FloatButton.getInstance().setVisible(false);
    },
    startGame: function () {
        this.userInfo.startGame();
        PlayerMe.lastGroupSelected = null;
        this.popupLayer.removeAllChildren();
        if (this.homeLocation == 0 || this.homeLocation == 1) {
            this.userInfo.y = -100.0;
            this.userInfo.stopAllActions();
            this.userInfo.runAction(new cc.EaseSineOut(new cc.MoveTo(0.3, cc.p(0, 0))));
        }
        this.homeLayer.visible = false;
        this.gameLayer.visible = true;
        this.lobbyLayer.setVisible(false);
        this.userInfo.visible = true;
        this.userInfo.refreshView();
        //this.topBar.refreshView();
        if (this.homeLocation == 0 || this.homeLocation == 3) {
            this.gameLayer.startAnimation();
        }
        if (this.homeLocation == 0) {
            this.miniGame.startAnimation();
        }
        this.homeLocation = 2;
        FloatButton.getInstance().setVisible(true);
    },

    startLobby: function () {
        this.popupLayer.removeAllChildren();
        this.homeLayer.visible = false;
        this.gameLayer.visible = false;
        this.lobbyLayer.setVisible(true);
        this.userInfo.visible = true;
        this.userInfo.refreshView();
        if (arguments.length === 1) {
            var gameId = arguments[0];
            this.lobbyLayer.startGame(gameId);
            LobbyClient.getInstance().subscribe(gameId);
            if(gameId === GameType.GAME_TaiXiu || gameId === GameType.GAME_XocDia){
                this.userInfo.startGame();
            }
            else{
                this.currentLobbyId = gameId;
                this.userInfo.startLobby();
            }
        }
        else {
            this.userInfo.startGame();
            this.lobbyLayer.startGame(-1);
        }
        this.homeLocation = 3;
        FloatButton.getInstance().setVisible(true);
    },
    onTouchGame: function (gameId) {
        if (this._checkLogin() == false) {
            return;
        }

        if(!s_game_available[gameId]){
            MessageNode.getInstance().show("Game chưa ra mắt");
            return;
        }

        if (gameId == GameType.GAME_VongQuayMayMan ||
            gameId == GameType.MiniGame_CaoThap ||
            gameId == GameType.MiniGame_ChanLe ||
            gameId == GameType.MiniGame_Poker ||
            gameId == GameType.MiniGame_VideoPoker) {
            SceneNavigator.toMiniGame(gameId, false);
        }
        else {
            this.startLobby(gameId);
        }
    },

    startGameWithAnimation: function () {
        this.startGame();
    },

    backButtonHandler: function () {
        var thiz = this;
        if (LoadingDialog.getInstance().isShow()) {
            return;
        }
        if (this.popupLayer.getChildren().length > 0) {
            this.popupLayer.removeAllChildren();
            return;
        }
        if (this.subLayer) {
            this.subLayer.removeFromParent(true);
            this.subLayer = 0;
            this.mainLayer.visible = true;
            if (this.homeLocation == 2) {
                this.miniGame.startAnimation();
                this.gameLayer.startAnimation();
            }
            if (this.homeLocation == 3) {
                this.lobbyLayer.startAnimation();
                this.miniGame.startAnimation();
            }
            return;
        }
        if (this.homeLocation == 1) {
            //exit app
            SystemPlugin.getInstance().exitApp();
        }
        else if (this.homeLocation == 2) {
            //logout
            //to home
            var dialog = new MessageConfirmDialog();
            dialog.setMessage("Bạn muốn thoát game ?");
            dialog.okButtonHandler = function () {
                // if(cc.sys.isNative){
                //     SystemPlugin.getInstance().exitApp();
                // }
                // else{
                //     SceneNavigator.toHome();
                // }
                SceneNavigator.toHome();
            };
            dialog.cancelButtonHandler = function () {
                dialog.hide();
            };
            dialog.show();
        }
        else if (this.homeLocation == 3) {
            //to game
            LobbyClient.getInstance().unSubscribe();
            this.startGame();
        }
    },

    addSubLayer: function (subLayer) {
        if(this.subLayer){
            return;
        }
        
        var thiz = this;
        subLayer.backBt.addClickEventListener(function () {
            thiz.backButtonHandler();
        });
        subLayer.settingBt.addClickEventListener(function () {
            thiz.settingButtonHandler();
        });

        this.subLayer = subLayer;
        this.sceneLayer.addChild(subLayer);
        this.mainLayer.visible = false;
    },

    newsButtonhandler: function () {
        if (this._checkLogin() == false) {
            return;
        }
        this.addSubLayer(new NewsLayer());
    },

    rankButtonHandler: function () {
        if (this._checkLogin() == false) {
            return;
        }
        this.addSubLayer(new RankLayer());
    },

    settingButtonHandler: function () {
        var dialog = new SettingDialog();
        dialog.show();
    },

    callButtonHandler: function () {
        if(cc.sys.isNative){
            SystemPlugin.getInstance().showCallPhone(GameConfig.hotline);
        }
        else{
            var dialog = new ContactDialog();
            dialog.show();
        }

        // var request = cc.loader.getXMLHttpRequest();
        // request.open("GET", "google.com");
        // request.setRequestHeader( "Content-Type","text/plain;charset=UTF-8" );
        // request.d
        // request.onreadystatechange = function () {
        //     if (request.readyState == 4 && ( request.status >= 200 && request.status <= 207 ) ) {
        //         var httpStatus = request.statusText;
        //         cc.log( httpStatus );
        //         cc.log( request.responseText );
        //     }
        // };
        // request.send();
    },

    newsMesasgeButtonHandler: function () {
        if (this._checkLogin() == false) {
            return;
        }
        this.addSubLayer(new InboxLayer());
    },

    activityButtonHandler : function () {
        if (this._checkLogin() == false) {
            return;
        }
        var dialog = new ActivityDialog();
        dialog.show();
    },

    shopButtonHandler : function () {
        if (this._checkLogin() == false) {
            return;
        }
        var dialog = new HomeShopLayer();
        dialog.show();
    },

    rewardButtonHandler: function () {
        if (this._checkLogin() == false) {
            return;
        }
        this.addSubLayer(new RewardLayer());
    },

    paymentButtonHandler: function () {
        if (this._checkLogin() == false) {
            return;
        }
        this.addSubLayer(new PaymentLayer());
    },

    userInfoButtonHandler: function () {
        if (this._checkLogin() == false) {
            return;
        }
        var dialog = new UserinfoDialog();
        dialog.show();
    },

    playNowButtonHandler : function () {
        var request = {
            command : "getPlayNowServer",
            gameType : s_games_chanel[this.currentLobbyId]
        };
        LobbyClient.getInstance().send(request);
        LoadingDialog.getInstance().show("Đang tìm phòng chơi");
    },

    onGetPlayNowServer : function (cmd, data) {
        var serverInfo = LobbyClient.getInstance().createServerInfo(data["data"]);
        SmartfoxClient.getInstance().playNow(serverInfo, s_games_chanel[this.currentLobbyId]);
    },

    showPaymentDialog : function () {
        var thiz = this;
        var dialog = new MessageConfirmDialog();
        dialog.setMessage("Bạn không đủ vàng để chơi, vui lòng nạp vàng ?");
        dialog.okTitle.setString("Nạp vàng");
        dialog.okButtonHandler = function () {
            thiz.paymentButtonHandler();
            dialog.hide();
        };
        dialog.show(this.popupLayer);
    },

    transferGoldButtonHandler : function () {
        if (this._checkLogin() == false) {
            return;
        }
        if(PlayerMe.phoneNumber && PlayerMe.phoneNumber != ""){
            var dialog = new TransferGoldDialog();
            dialog.show();
        }
        else{
            var dialog = new MessageConfirmDialog();
            dialog.setMessage("Bạn phải xác thực tài khoản để chuyển vàng");
            dialog.showWithAnimationScale();
            dialog.okButtonHandler = function () {
                dialog.hide();
                SceneNavigator.toAccountActiveView();
            };
        }
    },

    onEnter: function () {
        this._super();
        var thiz = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            // onKeyPressed:  function(keyCode, event){
            //     cc.log("Key " + parseKeyCode(keyCode) + " was pressed!");
            // },
            onKeyReleased: function (keyCode, event) {
                if(cc.sys.isNative){
                    if (parseKeyCode(keyCode) === cc.KEY.back) {
                        thiz.backButtonHandler();
                    }
                }
                else{
                    if(keyCode === cc.KEY.escape){
                        thiz.backButtonHandler();
                    }
                }
            }
        }, this);

        if(s_homescene_first_run){
            s_homescene_first_run = false;
            cc.director.setDisplayStats(false);

            if(!cc.sys.isNative){
                s_homescene_first_run = false;
                if(ViewNavigatorManager.execute()){
                    this.homeLayer.y = 0;
                    this.homeLayer.stopAllActions();
                }
                else{
                    var accessToken = cc.Global.GetSetting("accessToken","");
                    if(accessToken != ""){
                        LoadingDialog.getInstance().show("Đang đăng nhập");
                        LobbyClient.getInstance().tokenLogin(accessToken);
                    }
                }
            }
            else{
                SystemPlugin.getInstance().enableMipmapTexture("res/Card.png");
                //mobile auto login
                var loginType = cc.Global.GetSetting("lastLoginType", "");
                if(loginType === "normalLogin"){
                    var username = cc.Global.getSaveUsername();
                    var password = cc.Global.getSavePassword();
                    if(username !== "" && password != ""){
                        LoadingDialog.getInstance().show("Đang đăng nhập");
                        LobbyClient.getInstance().loginNormal(username, password, true);
                    }
                }
                else if(loginType === "facebookLogin"){
                    LoadingDialog.getInstance().show("Đang đăng nhập");
                    FacebookPlugin.getInstance().showLogin();
                }
            }
        }

        MiniGameNavigator.showAll();
    },

    onExit: function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
        SmartfoxClient.getInstance().removeListener(this);

        //MiniGameNavigator.hideAll();
    }
});