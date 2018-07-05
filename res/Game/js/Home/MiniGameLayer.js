/**
 * Created by Quyet Nguyen on 7/6/2016.
 */

var MiniGameCell = ccui.Widget.extend({
    ctor: function (size, gameId, gameName) {
        this._super();
        this.setContentSize(size);
        this.miniGameTab = [];
        this.allMiniLayer = [];

        var gameIcon = new cc.Sprite("#lobby-minigame" + (gameId) + ".png");
        gameIcon.setPosition(46, this.getContentSize().height / 2);
        this.addChild(gameIcon);

        var gameGold = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "0V");
        gameGold.setAnchorPoint(cc.p(0.0, 0.5));
        gameGold.setPosition(92.0, this.getContentSize().height / 2 - 18.0);
        gameGold.setColor(cc.color(255, 222, 0));
        this.addChild(gameGold);

        var gameNameLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, gameName);
        gameNameLabel.setAnchorPoint(cc.p(0.0, 0.5));
        gameNameLabel.setPosition(92.0, this.getContentSize().height / 2 + 18.0);
        this.addChild(gameNameLabel);

        this.gameGold = gameGold;
        this.gameId = gameId;
    },

    setGold: function (gold) {
        this.gameGold.setString(cc.Global.NumberFormat1(gold) + " V");
    }
});

var MiniGameLayer = cc.Node.extend({
    ctor: function () {
        this._super();
        LobbyClient.getInstance().addListener("miniGame", this.onSocketMessage, this);

        this.tabSelectedIndex = 0;
        this.allMiniLayer = [];

        this.initMiniGame();

        this.setContentSize(cc.size(1280, 720));
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        this.setScale(cc.winSize.screenScale);
    },

    initMiniGame: function () {
        var thiz = this;

        var top = 550.0;
        var bottom = 193.0;
        var left = 30.0;
        var right = 290.0;

        var miniGameBar = new cc.Sprite("#home-minigame-bar.png");
        miniGameBar.setPosition((right + left ) /2, 168);
        this.addChild(miniGameBar);

        var goldTitle = new cc.Sprite("#home-minigamebar-text1.png");
        goldTitle.setPosition(miniGameBar.getContentSize().width/2, miniGameBar.getContentSize().height/2);
        miniGameBar.addChild(goldTitle);
        this.goldTitle = goldTitle;

        var leftBt = new ccui.Button("home-minigame-leftBt.png","","", ccui.Widget.PLIST_TEXTURE);
        leftBt.setPosition(28.0, 34.0);
        miniGameBar.addChild(leftBt);

        var rightBt = new ccui.Button("home-minigame-leftBt.png","","", ccui.Widget.PLIST_TEXTURE);
        rightBt.setPosition(miniGameBar.getContentSize().width - leftBt.x, leftBt.y);
        rightBt.setFlippedX(true);
        miniGameBar.addChild(rightBt);

        var bg = new ccui.Scale9Sprite("home-minigame-bg.png", cc.rect(8, 0, 4, 384));
        bg.setPreferredSize(cc.size(right - left, top - bottom));
        bg.setAnchorPoint(cc.p(0, 0));
        bg.setPosition(left, bottom);
        this.addChild(bg);

        //add pageview
        var miniGameLayer = new ccui.PageView();
        miniGameLayer.setContentSize(cc.size(bg.getContentSize().width - 4, bg.getContentSize().height - 4));
        miniGameLayer.setAnchorPoint(cc.p(0.0, 0.0));
        miniGameLayer.setBounceEnabled(true);
        miniGameLayer.setPosition(left + 2, bottom + 2);
        this.addChild(miniGameLayer);
        this.miniGameLayer = miniGameLayer;

        for (var i = 0; i < 3; i++) {
            var listGame = new newui.TableView(miniGameLayer.getContentSize(), 1);
            listGame.setDirection(ccui.ScrollView.DIR_VERTICAL);
            listGame.setBounceEnabled(true);
            listGame.setScrollBarEnabled(false);
            miniGameLayer.addPage(listGame);
            this.allMiniLayer.push(listGame);

            for (var j = 0; j < s_mini_game_id.length; j++) {
                this.addMiniGame(s_mini_game_id[j], listGame);
            }
        }

        miniGameLayer.addEventListener(function () {
            var i = miniGameLayer.getCurrentPageIndex();
            thiz.selectTab(i, false);
        });

        leftBt.addClickEventListener(function () {
            thiz.selectTab(thiz.tabSelectedIndex - 1, true);
        });

        rightBt.addClickEventListener(function () {
            thiz.selectTab(thiz.tabSelectedIndex + 1, true);
        });
    },

    fetchHuThuong: function () {
        LobbyClient.getInstance().send({command: 53}); // hu thuong cao thap
        LobbyClient.getInstance().send({command: 262}); // hu thuong mini poker
        LobbyClient.getInstance().send({command: 716}); // hu thuong video poker
    },

    onSocketMessage: function (command, data) {
        data = data["data"];
        switch (data["cmd"]) {
            case 53:
                var huCaoThapList = data["511"];
                for (var i = 0; i < 3; i++) {
                    this.allMiniLayer[huCaoThapList[i]["506"] - 1].getItem(0).setGold(huCaoThapList[i]["512"]);
                }
                break;
            case 262:
                var huMiniList = data["515"];
                for (var i = 0; i < 3; i++) {
                    this.allMiniLayer[huMiniList[i]["511"] - 1].getItem(1).setGold(huMiniList[i]["514"]);
                }
                break;
            case 717:
                var huVideoList = data["1"];
                for (var i = 0; i < 3; i++) {
                    this.allMiniLayer[huVideoList[i]["1"] - 1].getItem(2).setGold(huVideoList[i]["2"]);
                }
                break;
        }
    },

    addMiniGame: function (gameId, listGame) {
        //cc.log("add miniGame: "+gameId);
        var size = cc.size(280.0, 92.0);
        var cell = new MiniGameCell(size, gameId, s_games_display_name[gameId]);
        listGame.pushItem(cell);

        cell.setTouchEnabled(true);
        cell.addClickEventListener(function () {
            var homeScene = cc.director.getRunningScene();
            homeScene.onTouchGame(gameId);
        });
    },

    selectTab: function (index, selectTab) {
        this.tabSelectedIndex = index;
        if(this.tabSelectedIndex < 0){
            this.tabSelectedIndex = 2;
        }
        else if(this.tabSelectedIndex > 2){
            this.tabSelectedIndex = 0;
        }

        if(selectTab){
            this.miniGameLayer.scrollToPage(this.tabSelectedIndex);
        }

        this.goldTitle.setSpriteFrame("home-minigamebar-text" + (this.tabSelectedIndex + 1) + ".png");
    },

    onEnter: function () {
        this._super();
        this.fetchHuThuong();
        this.selectTab(0, true);
        LobbyClient.getInstance().send({command: "subscribeMiniGame", gameType: "Mini_Poker"});
        LobbyClient.getInstance().send({command: "subscribeMiniGame", gameType: "Mini_Cao_Thap"});
        LobbyClient.getInstance().send({command: "subscribeMiniGame", gameType: "Video_Poker"});
    },

    onExit: function () {
        this._super();
        LobbyClient.getInstance().send({command: "unSubscribeMiniGame", gameType: "Mini_Poker"});
        LobbyClient.getInstance().send({command: "unSubscribeMiniGame", gameType: "Mini_Cao_Thap"});
        LobbyClient.getInstance().send({command: "unSubscribeMiniGame", gameType: "Video_Poker"});
        LobbyClient.getInstance().removeListener(this);
    },

    startAnimation: function () {
        this.allMiniLayer[this.tabSelectedIndex].runMoveEffect(-2000, 0.1, 0.1);
    }
});