/**
 * Created by QuyetNguyen on 12/20/2016.
 */
var MiniGamePopup = cc.Node.extend({
    ctor: function () {
        this._super();
        this.setScale(0.7);
        var x = 30 - Math.random() * 60;
        var y = 30 - Math.random() * 60;
        this.setPosition(cc.winSize.width / 2 + x, cc.winSize.height / 2 + y);

        this.initController();

        this.rewardFund = [];

        var closeButton = new ccui.Button("caothap_closeBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        closeButton.setPosition(895, 407);
        this.addChild(closeButton, 5);
        this.closeButton = closeButton;
        var tutorialButton = new ccui.Button("caothap_tutorialBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        tutorialButton.setPosition(769, 426);
        this.addChild(tutorialButton, 5);
        this.tutorialButton = tutorialButton;

        var historyButton = new ccui.Button("caothap_historyBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        historyButton.setPosition(694, 430);
        this.addChild(historyButton, 5);
        this.historyButton = historyButton;
        var jackpotLabel = new cc.LabelBMFont("", cc.res.font.Roboto_CondensedBold_30);
        jackpotLabel.setColor(cc.color("#ffea00"));
        jackpotLabel.setPosition(500, 462);
        this.jackpotLabel = jackpotLabel;
        this.addChild(jackpotLabel, 1);

        this.initChip(cc.p(91, 260));

        var thiz = this;
        closeButton.addClickEventListener(function () {
            thiz.closeButtonHandler();
            SoundPlayer.playSound("mini_clickButton");
        });

        historyButton.addClickEventListener(function () {
            var stat_board = new StatisticBoard(thiz.gameType);
            stat_board.showWithAnimationScale();
            SoundPlayer.playSound("mini_clickButton");
        });

        tutorialButton.addClickEventListener(function () {
            if (thiz.gameType){
                var tutorialDialog = TutorialDialog.getTutorial(thiz.gameType);
                tutorialDialog.show();
            }
            SoundPlayer.playSound("mini_clickButton");
        });

        this._controller.sendJoinGame();
    },

    onEnter: function () {
        this._super();

        var thiz = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                return thiz.onTouchBegan(touch, event);
            },
            onTouchMoved: function (touch, event) {
                thiz.onTouchMoved(touch, event);
            },
            onTouchEnded: function (touch, event) {
                thiz.onTouchEnded(touch, event);
            }
        }, this);
    },

    initController: function () {

    },

    onError: function (param) {
        //MessageNode.getInstance().show(LobbyClient.Error[param.code]["message"]);
        //SoundPlayer.stopSound("lucky_wheel");
        if(this._rollingSound){
            SoundPlayer.stopSoundLoop(this._rollingSound);
            this._rollingSound = null;
        }
        this.setBettingSelectEnable(true);
    },

    performChangeRewardFund: function (data) {
        this.rewardFund = data;
        if(this.chipGroup == undefined){
            return;
        }
        var betAmountID = this.chipGroup.chipSelected.chipIndex;
        if (!this.rewardFund || this.rewardFund.length < 3)
            return;
        this.jackpotLabel.setString(cc.Global.NumberFormat1(this.rewardFund[betAmountID - 1]["2"]));
    },

    onChangeAssets: function (gold, changeAmount) {
        // if (changeAmount == 0)
        //     return;
        //
        // var parent = this.getParent();
        //
        // var changeSprite = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "");
        // var changeText = (changeAmount >= 0 ? "+" : "") + cc.Global.NumberFormat1(changeAmount);
        // changeSprite.setString(changeText);
        // changeSprite.setColor(cc.color(changeAmount >= 0 ? "#ffde00" : "#ff0000"));
        // changeSprite.setPosition(50, 70);
        // parent.addChild(changeSprite, 420);
        //
        // changeSprite.runAction(new cc.Sequence(new cc.MoveTo(1.0, changeSprite.x, changeSprite.y + 50), new cc.CallFunc(function () {
        //     changeSprite.removeFromParent(true);
        // })));
    },

    initChip: function (centerPosition) {
        var chipGroup = new ChipGroup();
        this.addChild(chipGroup, 5);
        this.chipGroup = chipGroup;

        var thiz = this;
        var chip1 = new MiniLayerChip(1);
        chip1.setPosition(centerPosition.x + 21, centerPosition.y + 105);
       // chip1.setScale(cc.winSize.screenScale);
        chip1.originPoint = chip1.getPosition();
        chip1.onSelect = function () {
            thiz.onSelectChip(1);
        };
        chipGroup.addChip(chip1);

        var chip2 = new MiniLayerChip(2);
        chip2.setPosition(centerPosition.x, centerPosition.y);
       // chip2.setScale(cc.winSize.screenScale);
        chip2.originPoint = chip2.getPosition();
        chip2.onSelect = function () {
            thiz.onSelectChip(2);
        };
        chipGroup.addChip(chip2);

        var chip3 = new MiniLayerChip(3);
        chip3.setPosition(centerPosition.x + 19, centerPosition.y - 105);
      //  chip3.setScale(cc.winSize.screenScale);
        chip3.originPoint = chip3.getPosition();
        chip3.onSelect = function () {
            thiz.onSelectChip(3);
        };
        chipGroup.addChip(chip3);

        chipGroup.selectChipAtIndex(0);
    },

    onSelectChip: function (chipIndex) {
        if (this.rewardFund.length < 3)
            return;
        this.jackpotLabel.setString("" + cc.Global.NumberFormat1(this.rewardFund[chipIndex - 1]["2"]));
    },

    onExit: function () {
        this._super();
        //this._controller.releaseController();
    },

    onTouchBegan: function (touch, event) {
        if (this._touchStartPoint) {
            return false;
        }

        this._touchStartPoint = touch.getLocation();
        var p = this.convertToNodeSpace(this._touchStartPoint);
        if (cc.rectContainsPoint(this._boudingRect, p)) {
            MiniGameNavigator.focus(this);
            return true;
        }
        this._touchStartPoint = null;
        return false;
    },

    onTouchMoved: function (touch, event) {
        if (!this._touchStartPoint) {
            return;
        }
        var p = touch.getLocation();
        this.moveNode(cc.p(p.x - this._touchStartPoint.x, p.y - this._touchStartPoint.y));
        this._touchStartPoint = p;
    },

    onTouchEnded: function (touch, event) {
        this._touchStartPoint = null;
    },

    moveNode: function (ds) {
        this.x += ds.x;
        this.y += ds.y;

        var lb = this.convertToWorldSpace(cc.p(this._boudingRect.x, this._boudingRect.y));
        var rt = this.convertToWorldSpace(cc.p(this._boudingRect.x + this._boudingRect.width, this._boudingRect.y + this._boudingRect.height));

        if (lb.x < 0) {
            this.x -= lb.x;
        }
        if (rt.x > cc.winSize.width) {
            this.x -= (rt.x - cc.winSize.width);
        }
        if (lb.y < 0) {
            this.y -= lb.y;
        }
        if (rt.y > cc.winSize.height) {
            this.y -= (rt.y - cc.winSize.height);
        }
    },

    show: function () {
        var parent = this.getParent();
        if(parent){
            this.removeFromParent(false);
            parent.removeFromParent(false);
        }

        var bg = new cc.LayerColor(cc.color(0, 0, 0, 0));
        bg.addChild(this);

        var runningScene = cc.director.getRunningScene();
        if (runningScene) {
            if (runningScene.miniGameLayer) {
                runningScene.miniGameLayer.addChild(bg)
            }
            else {
                runningScene.addChild(bg);
            }

            // cc.eventManager.addListener({
            //     event: cc.EventListener.TOUCH_ONE_BY_ONE,
            //     swallowTouches:true,
            //     onTouchBegan : function () {
            //         return true;
            //     }
            // }, bg);
        }
    },
    changeLayerOrder : function (order) {
        var thiz = this;
        var mParent = thiz.getParent();
        if(mParent){
            mParent.setLocalZOrder(order);
        }
    },
    backToHomeScene: function () {
        MiniGameNavigator.hideGame(this.gameType);
    },

    hide: function () {
        this._controller.releaseController();
        var parent = this.getParent();
        if(parent){
            this.removeFromParent(true);
            parent.removeFromParent(true)
        }
        SoundPlayer.stopAllSound();
    },
    setBettingSelectEnable : function (enable) {
        if(this.chipGroup){
            this.chipGroup.setTouchEnable(enable);
        }
    },

    closeButtonHandler : function () {
       // this.hide();
        MiniGameNavigator.hideGame(this.gameType);
    }
});

var MiniGameNavigator = MiniGameNavigator || {};
MiniGameNavigator.allGame = [];

MiniGameNavigator.createGameLayer = function (gameId) {
    if(gameId === GameType.MiniGame_CaoThap){
        return new CaoThapLayer();
    }
    else if(gameId === GameType.MiniGame_Poker){
        return new MiniPokerLayer();
    }
    else if(gameId === GameType.MiniGame_VideoPoker){
        return new VideoPokerLayer();
    }
    else if(gameId === GameType.MiniGame_ChanLe){
        return new ChanLeLayer();
    }
    else if(gameId === GameType.GAME_VongQuayMayMan){

        return new VongQuayLayer();
    }
};

MiniGameNavigator.showAll = function () {
    // for(var i=0;i<MiniGameNavigator.allGame.length;i++){
    //     MiniGameNavigator.allGame[i].show();
    // }

    /*fix minitaixiu*/
    for(var i=0;i<MiniGameNavigator.allGame.length;){
        var miniGame = MiniGameNavigator.allGame[i];
        if(miniGame.gameType === GameType.MiniGame_ChanLe){
            miniGame.hide();
            miniGame.release();
            MiniGameNavigator.allGame.splice(i, 1);
        }
        else{
            miniGame.show();
            i++;
        }
    }
};

MiniGameNavigator.focus = function (view) {
    setTimeout(function () {
        var index = MiniGameNavigator.allGame.indexOf(view);
        MiniGameNavigator.allGame.splice(index, 1);
        MiniGameNavigator.allGame.push(view);

        for(var i=0;i<MiniGameNavigator.allGame.length;i++){
            MiniGameNavigator.allGame[i].changeLayerOrder(i);
        }
    }, 0);
};

MiniGameNavigator.hideAll = function () {
    for(var i=0;i<MiniGameNavigator.allGame.length;i++){
        MiniGameNavigator.allGame[i].hide();
        MiniGameNavigator.allGame[i].release();
    }
    MiniGameNavigator.allGame = [];
};

MiniGameNavigator.showGame = function (gameId, position) {
    for(var i=0;i<MiniGameNavigator.allGame.length;i++){
        var miniGame = MiniGameNavigator.allGame[i];
        if(miniGame.gameType === gameId){
            if(miniGame.isRunning()){
                cc.log("MiniGame " + gameId + " is running !!!");
            }
            else{
                miniGame.show();
                if(position){
                    miniGame.setPosition(position);
                }
            }
            return;
        }
    }

    var newMiniGame = MiniGameNavigator.createGameLayer(gameId);
    MiniGameNavigator.allGame.push(newMiniGame);
    newMiniGame.show();
    if(position){
        miniGame.setPosition(position);
    }
    newMiniGame.retain();
};

MiniGameNavigator.hideGame = function (gameId) {
    for(var i=0;i<MiniGameNavigator.allGame.length;i++){
        var miniGame = MiniGameNavigator.allGame[i];
        if(miniGame.gameType === gameId){
            MiniGameNavigator.allGame.splice(i, 1);
            miniGame.hide();
            miniGame.release();
            return;
        }
    }
};