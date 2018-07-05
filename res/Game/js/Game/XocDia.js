/**
 * Created by Quyet Nguyen on 7/25/2016.
 */

var s_xocdia_slot_id = s_xocdia_slot_id || [1, 0, 4, 2, 6, 5, 3];
var s_xocdia_slot_position = s_xocdia_slot_position || [
        {x: 1011, y: 407},
        {x: 271, y: 407},
        {x: 150, y: 215},
        {x: 395, y: 215},
        {x: 640, y: 215},
        {x: 885, y: 215},
        {x: 1130, y: 215}
    ];

var s_xocdia_result_position = s_xocdia_result_position ||
    [
        {x: 218, y: 194},
        {x: 161, y: 219},
        {x: 175, y: 152},
        {x: 235, y: 144},
        {x: 276, y: 178},
        {x: 291, y: 231},
        {x: 190, y: 270},
        {x: 242, y: 248},
        {x: 278, y: 302},
        {x: 333, y: 262},
        {x: 342, y: 200},
        {x: 342, y: 146},
        {x: 289, y: 125},
        {x: 282, y: 82},
        {x: 231, y: 86},
        {x: 175, y: 95},
        {x: 125, y: 129},
        {x: 117, y: 177},
        {x: 99, y: 223},
        {x: 116, y: 279},
        {x: 180, y: 318},
        {x: 232, y: 332}

    ];

var _get_random_array = function (take, maxSize) {
    var arr = [];
    var min = 0;
    var max = maxSize - take;
    for (var i = 0; i < take; i++) {
        var number = min + Math.floor(Math.random() * (max - min));
        min = number + 1;
        max++;
        arr.push(number);
    }
    return arr;
};

var XocDiaBettingSlot = cc.Node.extend({
    ctor: function (idx, parentNode) {
        this._super();
        this._chips = [];
        this._chipNode = new cc.Node();
        this.addChild(this._chipNode);
        this._slotGold = 0;
        this._userGold = 0;

        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.setPosition(s_xocdia_slot_position[idx]);

        var bg = new cc.Sprite("#xocdia_slot_" + (idx + 1) + ".png");
        this.bg = bg;
        this.setContentSize(bg.getContentSize());
        bg.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2);
        this.addChild(bg);

        if (idx < 2) {
            var slotGoldLabel = new cc.LabelBMFont("10.00.000", cc.res.font.Roboto_Condensed_25);
            slotGoldLabel.setColor(cc.color("#392d2e"));
            slotGoldLabel.setPosition(this.x - this.getContentSize().width / 4, this.y - this.getContentSize().height / 2 + 25);
            parentNode.addChild(slotGoldLabel, 1);

            var userGoldLabel = new cc.LabelBMFont("1.00.000", cc.res.font.Roboto_CondensedBold_25);
            userGoldLabel.setColor(cc.color("#392d2e"));
            userGoldLabel.setPosition(this.x + this.getContentSize().width / 4, slotGoldLabel.y);
            parentNode.addChild(userGoldLabel, 1);
        }
        else {
            var slotGoldLabel = new cc.LabelBMFont("100.000", cc.res.font.Roboto_Condensed_25);
            slotGoldLabel.setColor(cc.color("#767eb6"));
            slotGoldLabel.setPosition(this.x - this.getContentSize().width / 4, this.y - this.getContentSize().height / 2 + 20);
            slotGoldLabel.setScale(20.0 / 25.0);
            parentNode.addChild(slotGoldLabel, 1);

            var userGoldLabel = new cc.LabelBMFont("100.000", cc.res.font.Roboto_CondensedBold_25);
            userGoldLabel.setColor(cc.color("#ffde00"));
            userGoldLabel.setPosition(this.x + this.getContentSize().width / 4, slotGoldLabel.y);
            userGoldLabel.setScale(20.0 / 25.0);
            parentNode.addChild(userGoldLabel, 1);
        }
        this.slotGoldLabel = slotGoldLabel;
        this.userGoldLabel = userGoldLabel;

        this.reset();
        //
        //add Touch
        var rectTouch = cc.rect(0, 0, this.getContentSize().width, this.getContentSize().height);
        var thiz = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var p = thiz.convertToNodeSpace(touch.getLocation());
                if (cc.rectContainsPoint(rectTouch, p)) {
                    if (thiz.onTouchSlot) {
                        thiz.onTouchSlot();
                    }
                    return true;
                }
                return false;
            },
        }, this);
    },
    setOpacity: function (opacity) {
        this._super(opacity);
        this.bg.setOpacity(opacity);
        this.slotGoldLabel.setOpacity(opacity);
        this.userGoldLabel.setOpacity(opacity);
    },
    reset: function () {
        this._chipNode.removeAllChildren(true);
        this.removeChip();
        this.setOpacity(255);

        this.setSlotGold(0);
        this.setUserGold(0);
    },
    setSlotGold: function (gold) {
        this._slotGold = gold;

        this.slotGoldLabel.stopAllActions();
        if (gold > 0) {
            this.slotGoldLabel.visible = true;
            this.slotGoldLabel.setOpacity(255);
            var action = new quyetnd.ActionNumber(0.5, gold);
            this.slotGoldLabel.runAction(action);
        }
        else {

            this.slotGoldLabel.setString("0");
            this.slotGoldLabel.visible = false;
        }
    },
    setUserGold: function (gold) {
        this._userGold = gold;
        this.userGoldLabel.stopAllActions();
        if (gold > 0) {
            this.userGoldLabel.visible = true;
            this.userGoldLabel.setOpacity(255);
            var action = new quyetnd.ActionNumber(0.5, gold);
            this.userGoldLabel.runAction(action);
        }
        else {
            this.userGoldLabel.setString("0");
            this.userGoldLabel.visible = false;
        }
    },
    getSlotPosition: function () {
        var padding = 50.0;

        var w = Math.random() * (this.getContentSize().width - padding * 2) + padding;
        var h = Math.random() * (this.getContentSize().height - padding * 2) + padding;
        var x = this.x - this.getContentSize().width / 2 + w;
        var y = this.y - this.getContentSize().height / 2 + h;

        return cc.p(x, y);
    },
    addChip: function (chipSprite) {
        this._chips.push(chipSprite);
    },
    removeChip: function () {
        this._chips = [];
    }
});

var XocDiaScene = IGameScene.extend({
    ctor: function () {
        this._super();
        this.gameTopBar.chatBt.visible = false;
        this._historyData = [];
        this.chipTagMe = 100;
        this.chipTagOther = 200;
        this._shakeDisk = false;

        this.initView();

        this.initBettingSlot();

        //chip button
        // var chipNode = new cc.Node();
        // chipNode.setPosition(cc.p(0, 0));
        // this.sceneLayer.addChild(chipNode);
        // this.chipNode = chipNode;
        this.initChipButton();

        //history
        this.initHistory();
        this.initDisk();

        this.setUserCount(0);
    },

    showGameInfo : function (gameName,betAmount) {

    },

    update : function (dt) {
        if(this._shakeDisk){
            if(cc.Global.GetSetting("vibrator",true)){
                if(cc.sys.isNative){
                    cc.Device.vibrate(dt);
                }
                else{
                    cc.log("vibrator: " + dt);
                }
            }
        }
    },

    backButtonClickHandler : function () {
        var uGold = 0;
        for(var i = 0; i<this.bettingSlot.length;i++){
            uGold += this.bettingSlot[i]._userGold;
        }
        if(uGold > 0){
            var thiz = this;
            var dialog = new MessageConfirmDialog();
            dialog.setMessage("Bạn có muốn thoát game không ? \nNếu THOÁT bạn sẽ bị mất số vàng đã đặt cược");
            dialog.showWithAnimationScale();
            dialog.okButtonHandler = function () {
                if (thiz._controller) {
                    thiz._controller.requestQuitRoom();
                }
            };
        }
        else{
            if (this._controller) {
                this._controller.requestQuitRoom();
            }
        }
    },
    initView: function () {
        var playerMe = new GamePlayerMe();
        playerMe.setPosition(150, 50.0);
        this.sceneLayer.addChild(playerMe, 1);
        this.playerMe = playerMe;

        var playerButton = new ccui.Button("ingame-playerBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        playerButton.setPosition(160, this.gameTopBar.backBt.y);
        this.gameTopBar.addChild(playerButton);
        this.playerButton = playerButton;
        playerButton.addClickEventListener(function () {
            var dialog = new UserListDialog();
            dialog.show();
        });

        var userLabel = new cc.LabelBMFont("30", cc.res.font.Roboto_CondensedBold_18);
        userLabel.setColor(cc.color("#ffcf00"));
        userLabel.setPosition(playerButton.getContentSize().width / 2, 11);
        playerButton.getRendererNormal().addChild(userLabel);
        this.userLabel = userLabel;

        var datLaiButton = new ccui.Button("xocdia_batlaiBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        datLaiButton.setPosition(cc.winSize.width - 120 * cc.winSize.screenScale, 50 * cc.winSize.screenScale);
        datLaiButton.setScale(cc.winSize.screenScale);
        this.sceneLayer.addChild(datLaiButton);
        this.datLaiButton = datLaiButton;

        var huyCuocButton = new ccui.Button("xocdia_huyCuocButton.png", "", "", ccui.Widget.PLIST_TEXTURE);
        huyCuocButton.setPosition(datLaiButton.getPosition());
        huyCuocButton.setScale(cc.winSize.screenScale);
        this.sceneLayer.addChild(huyCuocButton);
        this.huyCuocButton = huyCuocButton;

        var resultBg1 = new ccui.Scale9Sprite("xocdia_result_bg_1.png", cc.rect(10, 10, 4, 4));
        resultBg1.setPreferredSize(cc.size(220 * cc.winSize.screenScale, 90 * cc.winSize.screenScale));
        resultBg1.setPosition(950 * cc.winSize.screenScale, 48 * cc.winSize.screenScale);
        this.sceneLayer.addChild(resultBg1);

        var resultBg2 = new ccui.Scale9Sprite("xocdia_result_bg_2.png", cc.rect(4, 0, 4, 2));
        resultBg2.setPreferredSize(cc.size(218 * cc.winSize.screenScale, 2));
        resultBg2.setPosition(resultBg1.getPosition());
        this.sceneLayer.addChild(resultBg2);

        var tongCuocLabal = new cc.LabelBMFont("Tổng cược : 1000", cc.res.font.Roboto_Condensed_25);
        tongCuocLabal.setScale(cc.winSize.screenScale);
        tongCuocLabal.setColor(cc.color("#bac2f9"));
        tongCuocLabal.setPosition(resultBg1.x, resultBg1.y + resultBg1.getContentSize().height / 4);
        tongCuocLabal.setVisible(false);
        this.sceneLayer.addChild(tongCuocLabal, 1);
        this.tongCuocLabal = tongCuocLabal;

        var winLabel = new cc.LabelBMFont("Thắng : 1000", cc.res.font.Roboto_Condensed_25);
        winLabel.setScale(cc.winSize.screenScale);
        winLabel.setColor(cc.color("#bac2f9"));
        winLabel.setPosition(resultBg1.x, resultBg1.y - resultBg1.getContentSize().height / 4);
        winLabel.setVisible(false);
        this.sceneLayer.addChild(winLabel, 1);
        this.winLabel = winLabel;

        var thiz = this;
        datLaiButton.addClickEventListener(function () {
            thiz._controller.requestDatlai();
        })
        huyCuocButton.addClickEventListener(function () {
            thiz._controller.requestHuyCuoc();
        })
    },
    initController: function () {
        this._controller = new XocDiaController(this);
    },
    playSoundDatCuoc: function () {
        SoundPlayer.playSound(Date.now() % 2 ? "moidatcuoc" : "batdaudatcuoc");
    },
    initBettingSlot: function () {
        this.bettingSlot = [];

        var slotNode = new cc.Node();
        slotNode.setContentSize(cc.size(1280, 720));
        slotNode.setAnchorPoint(cc.p(0.5, 0.5));
        slotNode.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/2));
        slotNode.setScale(cc.winSize.screenScale);
        this.sceneLayer.addChild(slotNode);

        var chipNode = new cc.Node();
        chipNode.setPosition(cc.p(0, 0));
        slotNode.addChild(chipNode,1);
        this.chipNode = chipNode;

        for (var i = 0; i < 7; i++) {
            var slot = new XocDiaBettingSlot(i, slotNode);
            slotNode.addChild(slot);

            var thiz = this;
            (function () {
                var slotIndex = s_xocdia_slot_id[i];
                slot.onTouchSlot = function () {
                    thiz.onTouchSlot(slotIndex);
                };

                thiz.bettingSlot[slotIndex] = slot;
            })();
        }

        var timer = new cc.ProgressTimer(new cc.Sprite("#xocdia_timer_2.png"));
        timer.setType(cc.ProgressTimer.TYPE_RADIAL);
        timer.setReverseDirection(true);
        timer.setPosition(640, 420);
        timer.setPercentage(30.0);
        slotNode.addChild(timer);
        this.timer = timer;

        var timerBg = new cc.Sprite("#xocdia_timer_1.png");
        timerBg.setPosition(timer.getContentSize().width / 2, timer.getContentSize().height / 2);
        timer.addChild(timerBg, -1);

        var timeLabel = new cc.LabelTTF("100", cc.res.font.Roboto_CondensedBold, 60);
        timeLabel.setPosition(timer.getPosition());
        timeLabel.setColor(cc.color("#ffcf00"));
        slotNode.addChild(timeLabel);
        this.timeLabel = timeLabel;
    },
    initChipButton: function () {
        var chipGroup = new ChipGroup();
        this.sceneLayer.addChild(chipGroup);
        this.chipGroup = chipGroup;
        var left = 310.0 * cc.winSize.screenScale;
        var dx = 110.0 * cc.winSize.screenScale;

        var chip1 = new XocDiaChip(1);
        chip1.setPosition(left + dx, 30.0 * cc.winSize.screenScale);
        chip1.setScale(cc.winSize.screenScale);
        chip1.originPoint = chip1.getPosition();
        chipGroup.addChip(chip1);

        var chip2 = new XocDiaChip(2);
        chip2.setPosition(chip1.x + dx, chip1.y);
        chip2.setScale(cc.winSize.screenScale);
        chip2.originPoint = chip2.getPosition();
        chipGroup.addChip(chip2);

        var chip3 = new XocDiaChip(3);
        chip3.setPosition(chip2.x + dx, chip1.y);
        chip3.setScale(cc.winSize.screenScale);
        chip3.originPoint = chip3.getPosition();
        chipGroup.addChip(chip3);

        var chip4 = new XocDiaChip(4);
        chip4.setPosition(chip3.x + dx, chip1.y);
        chip4.setScale(cc.winSize.screenScale);
        chip4.originPoint = chip4.getPosition();
        chipGroup.addChip(chip4);
    },

    initHistory: function () {
        var padding = 2.0;
        var itemSize = cc.size(46.0, 46.0);
        var row = 4;
        var col = 16;
        var left = 52.0;

        var historyBg = new ccui.Scale9Sprite("xocdia_history_bg1.png", cc.rect(4, 4, 4, 4));
        historyBg.setPreferredSize(cc.size((itemSize.width + padding) * col + left, itemSize.height * row + padding * (row + 1)));
        historyBg.setAnchorPoint(cc.p(0, 0));
        // historyBg.setPosition(cc.winSize.width/2, cc.winSize.height - historyBg.getContentSize().height/2);
        // this.sceneLayer.addChild(historyBg);

        var clippingNode = new ccui.Layout();
        clippingNode.setClippingEnabled(true);
        clippingNode.setAnchorPoint(cc.p(0.5, 1.0));
        clippingNode.setContentSize(historyBg.getContentSize());
        clippingNode.setPosition(cc.winSize.width / 2, cc.winSize.height);
        clippingNode.setScale(cc.winSize.screenScale);
        this.sceneLayer.addChild(clippingNode, 1);
        clippingNode.addChild(historyBg);
        this.historyBg = historyBg;

        var historyBt = new ccui.Button("xocdia_history_bt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        historyBt.setPosition(left / 2, historyBg.getContentSize().height / 2);
        historyBt.setZoomScale(0.0);
        historyBg.addChild(historyBt);
        var thiz = this;
        historyBt.addClickEventListener(function () {
            thiz.touchHistory();
        });

        var historyTouch = new ccui.Widget();
        historyTouch.setAnchorPoint(cc.p(0.0, 0.0));
        historyTouch.setContentSize(historyBg.getContentSize());
        historyTouch.setTouchEnabled(true);
        historyBg.addChild(historyTouch);
        historyTouch.addClickEventListener(function () {
            thiz.touchHistory();
        });
        this.historyTouch = historyTouch;

        for (var i = 0; i < col; i++) {
            for (var j = 0; j < row; j++) {
                var x = left + itemSize.width / 2 + (itemSize.width + padding) * i;
                var y = padding + itemSize.height / 2 + (itemSize.height + padding) * j;
                var bg = new ccui.Scale9Sprite("xocdia_history_bg2.png", cc.rect(4, 4, 4, 4));
                bg.setPreferredSize(itemSize);
                bg.setPosition(x, y);
                historyBg.addChild(bg);
            }
        }

        this.historyNode = new cc.Node();
        this.historyNode.setContentSize(historyBg.getContentSize());
        this.historyNode.setAnchorPoint(cc.p(0, 0));
        historyBg.addChild(this.historyNode);

        this._historyData = [];
    },

    touchHistory: function () {
        if (this.historyBg.showed) {
            this.hideHistory();
        }
        else {
            this.showHistory();
        }
    },

    showHistory: function () {
        var thiz = this;
        var left = 52.0;

        this.historyBg.showed = true;
        this.historyBg.stopAllActions();
        this.historyBg.runAction(new cc.Sequence(
            new cc.MoveTo(0.5, cc.p(0, 0)),
            new cc.CallFunc(function () {
                thiz.historyTouch.setTouchEnabled(true);
            })
        ));
    },

    hideHistory: function () {
        var thiz = this;
        var left = 52.0;
        this.historyTouch.setTouchEnabled(false);

        this.historyBg.showed = false;
        this.historyBg.stopAllActions();
        this.historyBg.runAction(new cc.Sequence(
            new cc.MoveTo(0.5, cc.p(this.historyBg.getContentSize().width - left, 0)),
            new cc.CallFunc(function () {

            })
        ));
    },

    initDisk: function () {
        var diskSprite = new cc.Sprite("#xocdia_dia.png");
        diskSprite.setPosition(cc.winSize.width / 2, cc.winSize.height + 100);
        this.sceneLayer.addChild(diskSprite);
        this.diskSprite = diskSprite;

        var diskNode = new cc.Node();
        diskSprite.addChild(diskNode);
        this.diskNode = diskNode;

        var batSprite = new cc.Sprite("#xocdia_bat.png");
        this.batSpritePosition = cc.p(diskSprite.getContentSize().width / 2, diskSprite.getContentSize().height / 2);
        batSprite.setPosition(this.batSpritePosition);
        diskSprite.addChild(batSprite);
        this.batSprite = batSprite;
    },

    _setFinishedSlot: function (slotId, win) {
        if (win) {
            this.bettingSlot[slotId].setOpacity(255);
        }
        else {
            this.bettingSlot[slotId].setOpacity(100);
        }
    },

    shakeDisk: function () {
        this.stopAllActions();
        this.diskNode.removeAllChildren(true);
        this.diskSprite.stopAllActions();
        this.batSprite.stopAllActions();

        this.hideHistory();

        this._shakeDisk = false;

        var thiz = this;
        this.batSprite.runAction(new cc.MoveTo(1.0, this.batSpritePosition));
        this.diskSprite.runAction(new cc.Sequence(
            new cc.EaseSineOut(new cc.MoveTo(1.0, cc.p(cc.winSize.width / 2, cc.winSize.height / 2))),
            new cc.DelayTime(0.2),
            new cc.CallFunc(function () {
                thiz._shakeDisk = true;
            }),
            new quyetnd.ActionShake2D(3.0, cc.p(10.0, 10.0)),
            new cc.CallFunc(function () {
                thiz._shakeDisk = false;
            })
        ));


    },

    hideDisk: function () {
        this._shakeDisk = false;
        //  this.stopAllActions();
        this.diskNode.removeAllChildren(true);
        this.diskSprite.stopAllActions();
        this.batSprite.stopAllActions();

        this.showHistory();

        this.diskSprite.runAction(new cc.MoveTo(1.0, cc.p(cc.winSize.width / 2, cc.winSize.height + 100)));
        this.batSprite.runAction(new cc.MoveTo(1.0, this.batSpritePosition));
    },

    openDisk: function (data) {
        this._shakeDisk = false;
        var thiz = this;

        this.stopAllActions();
        SoundPlayer.playSound(["bellopen", "mobat"]);
        this.diskNode.removeAllChildren(true);
        this.diskSprite.stopAllActions();
        this.batSprite.stopAllActions();

        this.hideHistory();

        var result = data.result;
        this._addResultSprite(result);

        var sounds = this._getSoundOpenDisk(result);
        /* mở bát */
        this.diskSprite.runAction(new cc.EaseSineOut(new cc.MoveTo(1.0, cc.p(cc.winSize.width / 2, cc.winSize.height / 2))));
        this.batSprite.runAction(new cc.Sequence(
            new cc.DelayTime(1.2),
            new cc.EaseSineIn(new cc.MoveBy(1.0, cc.p(0.0, 450.0))),
            new cc.CallFunc(function () {
                SoundPlayer.playSound(sounds);
                thiz._addHistory(result);
                thiz._refreshHistory();
            })
        ));

        /* thu tiền */
        var winSlot = data.winSlot;
        var loseSlot = data.loseSlot;
        this.runAction(new cc.Sequence(
            new cc.DelayTime(6.0),
            new cc.CallFunc(function () {
                thiz.hideDisk();

                for (var i = 0; i < winSlot.length; i++) {
                    thiz._setFinishedSlot(winSlot[i], true);
                }
                for (var i = 0; i < loseSlot.length; i++) {
                    thiz._setFinishedSlot(loseSlot[i], false);
                }
            }),
            new cc.DelayTime(1.0),
            new cc.CallFunc(function () {
                for (var i = 0; i < loseSlot.length; i++) {
                    thiz.thuTienSlot(loseSlot[i]);
                }
            }),
            new cc.DelayTime(1.0),
            new cc.CallFunc(function () {
                for (var i = 0; i < winSlot.length; i++) {
                    thiz.traTienSlot(winSlot[i]);
                }
            }),
            new cc.DelayTime(1.0),
            new cc.CallFunc(function () {
                for (var i = 0; i < winSlot.length; i++) {
                    thiz.traTienUser(winSlot[i]);
                }
            })
        ));
    },

    _addResultSprite: function (result) {
        /* add result */
        var arr = _get_random_array(4, s_xocdia_result_position.length);
        for (var i = 0; i < arr.length; i++) {
            if (i < result) {
                var sprite = new cc.Sprite("#xocdia_hat_do.png");
            }
            else {
                var sprite = new cc.Sprite("#xocdia_hat_trang.png");
            }

            sprite.setPosition(s_xocdia_result_position[arr[i]]);
            this.diskNode.addChild(sprite);
        }
    },

    _getSoundOpenDisk: function (result) {
        var soundArray = [];
        if (result == 0) {
            soundArray.push("ngua4");
        } else if (result == 4) {
            soundArray.push("xap4");
        } else if (result == 2) {
            soundArray.push("xap2");
        } else if (result == 1) {
            soundArray.push("xap1");
        } else if (result == 3) {
            soundArray.push("xap3");
        }

        soundArray.push(result % 2 ? "le" : "chan");
        return soundArray;
    },

    // _openDisk : function () {
    //     var thiz = this;
    //
    // },

    onEnter: function () {
        this._super();
        this.chipGroup.selectChipAtIndex(0, true);
        this.scheduleUpdate();
    },

    onTouchSlot: function (slotId) {
        if (this.chipGroup.chipSelected) {
            var chipId = this.chipGroup.chipSelected.chipIndex - 1;
            this._controller.requestDatCuoc(slotId, chipId);
        }
        else {
            this.showErrorMessage("Bạn phải chọn mức cược");
        }
    },

    addChipToSlot: function (slotIndex, chipIndex, from, tag, noAnimation) {
        //me = 1
        //other = 2
        //host = 3
        if (from == 1) { //me
            var chipPosition = this.chipGroup.getChip(chipIndex).getPosition();
        }
        else if (from == 2) { //other
            //from player button
            var chipPosition = this.playerButton.getWorldPosition();
        }
        else {  //host
            var chipPosition = cc.p(cc.winSize.width / 2, cc.winSize.height);
        }

        if (!tag) {
            if (from == 1) { //me
                tag = this.chipTagMe;
            }
            else if (from == 2) { //other
                tag = this.chipTagOther;
            }
            else {
                tag = 0;
            }
        }

        var slot = this.bettingSlot[slotIndex];
        var thiz = this;

        var addChipHandler = function () {
            var chip = new cc.Sprite("#xocdia-chipSelected-" + (chipIndex + 1) + ".png");
            chip.chipIndex = chipIndex;
            chip.chipTag = tag;
            chip.setPosition(thiz.chipNode.convertToNodeSpace(chipPosition));
            thiz.chipNode.addChild(chip);
            slot.addChip(chip);

            //move
            if(noAnimation){
                var p = slot.getSlotPosition();
                chip.setPosition(p);
                chip.setScale(0.3);
            }
            else{
                var p = slot.getSlotPosition();
                var duration = cc.pLength(cc.pSub(chip.getPosition(), p)) / 1000.0;
                var moveAction = new cc.Spawn(
                    new cc.MoveTo(duration, p),
                    new cc.ScaleTo(duration, 0.3)
                );
                chip.runAction(new cc.EaseSineOut(moveAction));
            }


            SoundPlayer.playSound("singlechip");
        };

        if (from == 1 || from == 3) { //me or host
            addChipHandler();
        }
        else {
            var delayTime = 0.5 + Math.random() * 1.5;
            this.runAction(new cc.Sequence(
                new cc.DelayTime(delayTime),
                new cc.CallFunc(addChipHandler)
            ));
        }
    },

    thuTienSlot: function (slotId) {
        var chips = this.bettingSlot[slotId]._chips;
        for (var i = 0; i < chips.length; i++) {
            (function () {
                var chip = chips[i];
                chips[i].runAction(new cc.Sequence(
                    new cc.MoveTo(0.5, cc.p(cc.winSize.width / 2, cc.winSize.height)),
                    new cc.CallFunc(function () {
                        chip.removeFromParent(true);
                    })
                ));
            })();
        }
        this.bettingSlot[slotId]._chips = [];
    },

    traTienSlot: function (slotId) {
        var chips = this.bettingSlot[slotId]._chips;
        var length = chips.length;
        for (var i = 0; i < length; i++) {
            this.addChipToSlot(slotId, chips[i].chipIndex, 3, chips[i].chipTag);
        }
    },

    traTienUser: function (slotId) {
        //cc.log("traTienUser: "+slotId);
        var chips = this.bettingSlot[slotId]._chips;
        var thiz = this;

        for (var i = 0; i < chips.length; i++) {
            (function () {
                var chip = chips[i];
                if (chip.chipTag == thiz.chipTagMe) {
                    //to me
                    chip.runAction(new cc.Sequence(
                        new cc.MoveTo(0.5, cc.p(50, 50)),
                        new cc.CallFunc(function () {
                            chip.removeFromParent(true);
                        }),
                        new cc.CallFunc(function () {
                            if (thiz.pendingGoldChange > 0) {
                                thiz.performChangeAsset(thiz.pendingGoldChange);
                                thiz.pendingGoldChange = null;
                            }
                        })
                    ));
                }
                else {
                    //to other
                    var p = thiz.playerButton.getWorldPosition();
                    chip.runAction(new cc.Sequence(
                        new cc.MoveTo(0.5, p),
                        new cc.CallFunc(function () {
                            chip.removeFromParent(true);
                        })
                    ));
                }
            })();
        }

        this.bettingSlot[slotId]._chips = [];
    },

    performChangeAsset: function (changeAmount) {
        var changeSprite = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "");
        var changeText = (changeAmount >= 0 ? "+" : "") + changeAmount;
        changeSprite.setString(changeText);
        changeSprite.setColor(cc.color(changeAmount >= 0 ? "#ffde00" : "#ff0000"));
        changeSprite.setPosition(50, 70);
        this.sceneLayer.addChild(changeSprite, 420);

        changeSprite.runAction(new cc.Sequence(new cc.MoveTo(1.0, changeSprite.x, changeSprite.y + 50), new cc.CallFunc(function () {
            changeSprite.removeFromParent(true);
        })));
    },

    resetGame: function () {
        for (var i = 0; i < this.bettingSlot.length; i++) {
            this.bettingSlot[i].reset();
        }

        this.chipNode.removeAllChildren(true);
        this.stopAllActions();

        this.setTongCuocLabel(-1);
        this.setWinLabel(-1);
        this._shakeDisk = false;
    },

    datLaiThanhCong: function () {

    },

    huyCuocThanhCong: function () {
        var tagMe = this.chipTagMe;
        var pTarget = this.chipNode.convertToNodeSpace(cc.p(50,50));

        for (var i = 0; i < this.bettingSlot.length; i++) {
            var chips = this.bettingSlot[i]._chips;
            for (var j = 0; j < chips.length; j++) {
                (function () {
                    var chip = chips[j];
                    if (chip.chipTag == tagMe) {
                        //to me
                        chip.runAction(new cc.Sequence(
                            new cc.MoveTo(0.5, pTarget),
                            new cc.CallFunc(function () {
                                chip.removeFromParent(true);
                            })
                        ));
                    }
                })();
            }
            this.bettingSlot[i]._chips = [];
        }
    },

    updateSlotGold: function (slotId, gold) {
        var slot = this.bettingSlot[slotId];
        if (!slot) {
            cc.log("slot null");
        }
        slot.setSlotGold(gold);
    },

    updateUserGold: function (slotId, gold) {
        var slot = this.bettingSlot[slotId];
        slot.setUserGold(gold);
    },

    updateUserCount: function (userCount) {
        this.userLabel.setString(userCount);
    },

    setTimeRemaining: function (currentTime, maxTime) {
        this.timer.stopAllActions();
        this.timeLabel.stopAllActions();
        if (maxTime <= 0.0) {
            this.timeLabel.setColor(cc.color("#ffcf00"));
            this.timer.setColor(cc.color("#ffcf00"));
            this.timeLabel.setString("0");
            this.timer.setPercentage(0.0);

            this.timeLabel.setVisible(false);
            this.timer.setVisible(false);

            return;
        }

        this.timeLabel.setVisible(true);
        this.timer.setVisible(true);

        var timerProgress = 100.0 * currentTime / maxTime;
        this.timer.runAction(new cc.ProgressFromTo(currentTime, timerProgress, 0.0));

        //this.timeLabel.setString(currentTime);
        this.timeLabel.runAction(new quyetnd.ActionTimeRemaining(currentTime));


        //this.timeLabel.runAction(new cc.RepeatForever(alertAction));

        var alertSoundAction = function (time) {
            var action = new cc.Sequence(
                new cc.CallFunc(function () {
                    SoundPlayer.playSound("countDownS");
                }),
                new cc.DelayTime(1.0)
            );

            return new cc.Repeat(action, Math.floor(time));
        };

        var thiz = this;
        if (currentTime > 5) {
            this.timeLabel.setColor(cc.color("#ffcf00"));
            this.timer.setColor(cc.color("#ffcf00"));

            this.timeLabel.runAction(new cc.Sequence(
                new cc.DelayTime(currentTime - 5),
                new cc.CallFunc(function () {
                    var alertAction = new cc.Sequence(
                        new cc.TintTo(0.2, 255, 0, 0),
                        new cc.TintTo(0.2, 255, 207, 0)
                    );
                    thiz.timeLabel.runAction(new cc.RepeatForever(alertAction));
                })
            ));

            this.timer.runAction(new cc.Sequence(
                new cc.DelayTime(currentTime - 5),
                new cc.CallFunc(function () {
                    var alertAction = new cc.Sequence(
                        new cc.TintTo(0.2, 255, 0, 0),
                        new cc.TintTo(0.2, 255, 207, 0)
                    );
                    thiz.timer.runAction(new cc.RepeatForever(alertAction));
                    thiz.timer.runAction(alertSoundAction(5.0));
                })
            ));
        }
        else {
            var alertAction = new cc.Sequence(
                new cc.TintTo(0.2, 255, 0, 0),
                new cc.TintTo(0.2, 255, 207, 0)
            );
            this.timeLabel.runAction(new cc.RepeatForever(alertAction.clone()));
            this.timer.runAction(new cc.RepeatForever(alertAction));
            thiz.timer.runAction(alertSoundAction(currentTime));
        }
    },

    setChipValue: function (chipId, gold) {
        this.chipGroup.getChip(chipId).setGold(gold);
    },

    setDatLaiButtonVisible: function (visible) {
        this.datLaiButton.setVisible(visible);
    },

    setHuyCuocButtonVisible: function (visible) {
        this.huyCuocButton.setVisible(visible);
    },

    _addHistory: function (history) {
        if (this._historyData.length == 0) {
            this._historyData.push(history);
            return;
        }

        var row = 4;
        var col = 16;
        var maxItem = row * col;

        var lastHistory = this._historyData[this._historyData.length - 1];
        if ((lastHistory % 2) != (history % 2)) {
            //fill empty
            var emptyCount = this._historyData.length % row;
            if (emptyCount > 0) {
                emptyCount = row - emptyCount;
                for (var i = 0; i < emptyCount; i++) {
                    this._historyData.push(-1);
                }
            }
        }
        this._historyData.push(history);

        if (this._historyData.length > maxItem) {
            this._historyData.splice(0, row);
        }
    },
    _refreshHistory: function () {
        var padding = 2.0;
        var itemSize = cc.size(46.0, 46.0);
        var row = 4;
        var left = 52.0;

        this.historyNode.removeAllChildren(true);
        for (var i = 0; i < this._historyData.length; i++) {
            if (this._historyData[i] >= 0) {
                var label = new cc.LabelBMFont(this._historyData[i].toString(), cc.res.font.Roboto_CondensedBold_25);

                var x = left + itemSize.width / 2 + (itemSize.width + padding) * Math.floor(i / row);
                var y = this.historyNode.getContentSize().height - padding - itemSize.height / 2 - (itemSize.height + padding) * (i % row);
                if (this._historyData[i] % 2) {
                    var historyIcon = new cc.Sprite("#xocdia_history_1.png");
                    label.setColor(cc.color("#ffffff"));
                }
                else {
                    var historyIcon = new cc.Sprite("#xocdia_history_2.png");
                    label.setColor(cc.color("#333333"));
                }
                historyIcon.setPosition(x, y);
                this.historyNode.addChild(historyIcon, 0);

                label.setPosition(x, y);
                this.historyNode.addChild(label, 1);
            }
        }
    },

    setHistory: function (history) {
        this._historyData = [];

        for (var i = 0; i < history.length; i++) {
            this._addHistory(history[i]);
        }
        //cc.log(this._historyData);
        this._refreshHistory();
    },

    setTongCuocLabel: function (gold) {
        if (gold < 0) {
            this.tongCuocLabal.setVisible(false);
        }
        else {
            this.tongCuocLabal.setVisible(true);
            this.tongCuocLabal.setString("Tổng cược: " + cc.Global.NumberFormat1(gold));
        }
    },

    setWinLabel: function (gold) {
        if (gold < 0) {
            this.winLabel.setVisible(false);
        }
        else {
            this.winLabel.setVisible(true);
            this.winLabel.setString("Thắng: " + cc.Global.NumberFormat1(gold));
            this.pendingGoldChange = gold;
        }
    },
    changeGoldEffect: function (username, deltaGold) {
        if(username == PlayerMe.username){
            this.playerMe.runChangeGoldEffect(deltaGold);
        }

    },
    updateGold: function (username, gold) {
        if(PlayerMe.username === username){
            this.playerMe.setGold(gold);
        }
    },

    setUserCount: function (count) {
        this.userLabel.setString(count);
    },


    /*ignore*/
    processPlayerPosition: function () {

    },
    updateOwner: function () {

    }
});