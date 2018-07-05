/**
 * Created by Quyet Nguyen on 7/25/2016.
 */

var s_taixiu_id = s_taixiu_id || [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
var s_taixiu_slot_position = s_taixiu_slot_position || [
        {x: 2, y: 332},
        {x: 200, y: 332},
        {x: 340, y: 332},
        {x: 480, y: 332},
        {x: 760, y: 332},
        {x: 900, y: 332},
        {x: 1040, y: 332},

        {x: 2, y: 112},

        {x: 200, y: 222},
        {x: 320, y: 222},
        {x: 440, y: 222},
        {x: 560, y: 222},
        {x: 680, y: 222},
        {x: 800, y: 222},
        {x: 920, y: 222},

        {x: 1040, y: 112},

        {x: 200, y: 112},
        {x: 320, y: 112},
        {x: 440, y: 112},
        {x: 560, y: 112},
        {x: 680, y: 112},
        {x: 800, y: 112},
        {x: 920, y: 112},

        {x: 2, y: 2},
        {x: 200, y: 2},
        {x: 340, y: 2},
        {x: 480, y: 2},
        {x: 620, y: 2},
        {x: 760, y: 2},
        {x: 900, y: 2},
        {x: 1040, y: 2}
    ];

var s_taixiu_slot_size = s_taixiu_slot_size || [
        {width: 193, height: 110},
        {width: 135, height: 110},
        {width: 135, height: 110},
        {width: 275, height: 110},
        {width: 135, height: 110},
        {width: 135, height: 110},
        {width: 193, height: 110},

        {width: 193, height: 215},

        {width: 115, height: 105},
        {width: 115, height: 105},
        {width: 115, height: 105},
        {width: 115, height: 105},
        {width: 115, height: 105},
        {width: 115, height: 105},
        {width: 115, height: 105},

        {width: 193, height: 215},

        {width: 115, height: 105},
        {width: 115, height: 105},
        {width: 115, height: 105},
        {width: 115, height: 105},
        {width: 115, height: 105},
        {width: 115, height: 105},
        {width: 115, height: 105},

        {width: 193, height: 105},
        {width: 135, height: 105},
        {width: 135, height: 105},
        {width: 135, height: 105},
        {width: 135, height: 105},
        {width: 135, height: 105},
        {width: 135, height: 105},
        {width: 193, height: 105}
    ];


var s_taixiu_result_position = s_taixiu_result_position ||
    [
        {x: 108, y: 96},
        {x: 260, y: 111},
        {x: 319, y: 171},
        {x: 255, y: 220},
        {x: 180, y: 183},
        {x: 107, y: 137},
        {x: 100, y: 228},
        {x: 192, y: 165},
        {x: 134, y: 306},
        {x: 260, y: 311},
        {x: 316, y: 258}
    ];

var TaiXiuBettingSlot = cc.Node.extend({
    ctor: function (idx, parentNode) {
        this._super();
        this._chips = [];
        this._chipNode = new cc.Node();
        this.addChild(this._chipNode);

        this.setAnchorPoint(cc.p(0.0, 0.0));
        this.setPosition(s_taixiu_slot_position[idx]);

        var size = s_taixiu_slot_size[idx];
        this.setContentSize(size);

        var bg = new cc.Sprite("#taixiu_winSprite.png");
        bg.setAnchorPoint(cc.p(0, 0));
        bg.setScale(size.width / bg.getContentSize().width, size.height / bg.getContentSize().height);
        bg.setPosition(cc.p(0, 0));
        this.addChild(bg);
        this.winSprite = bg;


        var slotGoldLabel = new cc.LabelBMFont("100", cc.res.font.Roboto_Condensed_25);
        slotGoldLabel.setColor(cc.color("#767eb6"));
        slotGoldLabel.setPosition(this.x + size.width * 0.25, this.y + 16);
        slotGoldLabel.setScale(20.0 / 25.0);
        parentNode.addChild(slotGoldLabel, 2);

        var userGoldLabel = new cc.LabelBMFont("100", cc.res.font.Roboto_CondensedBold_25);
        userGoldLabel.setColor(cc.color("#ffde00"));
        userGoldLabel.setPosition(this.x + size.width * 0.75, slotGoldLabel.y);
        userGoldLabel.setScale(20.0 / 25.0);
        parentNode.addChild(userGoldLabel, 2);

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
    reset: function () {
        // this._chipNode.removeAllChildren(true);
        this.winSprite.setVisible(false);
        this.removeChip();
        this.setSlotGold(0);
        this.setUserGold(0);
    },
    setSlotGold: function (gold) {
        this._slotGold = gold;

        this.slotGoldLabel.stopAllActions();
        if (gold > 0) {
            this.slotGoldLabel.visible = true;
            this.slotGoldLabel.setOpacity(255);
            this.slotGoldLabel.setString(cc.Global.NumberFormat2(gold));
            // var action = new quyetnd.ActionNumber(0.5, gold);
            // this.slotGoldLabel.runAction(action);
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
            this.userGoldLabel.setString(cc.Global.NumberFormat2(gold));
            // var action = new quyetnd.ActionNumber(0.5, gold);
            // this.userGoldLabel.runAction(action);
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
        var x = this.x + w;
        var y = this.y + h;

        return cc.p(x, y);
    },
    addChip: function (chipSprite) {
        this._chips.push(chipSprite);
    },
    removeChip: function () {
        this._chips = [];
    },
    slotWin: function (win) {
        if (win) {
            this.winSprite.setVisible(true);
        }
        else {
            this.winSprite.setVisible(false);
        }
    }
});

var TaiXiuScene = XocDiaScene.extend({
    ctor: function () {
        this._super();

        //this.hideDisk();
    },

    initController: function () {
        this._controller = new TaiXiuController(this);
    },

    initBettingSlot: function () {
        this.bettingSlot = [];

        var slotNode = new cc.Node();
        slotNode.setContentSize(cc.size(1280, 720));
        slotNode.setAnchorPoint(cc.p(0.5, 0.5));
        slotNode.setPosition(cc.winSize.width / 2, 325);
        slotNode.setScale(cc.winSize.screenScale);
        this.sceneLayer.addChild(slotNode);

        var chipNode = new cc.Node();
        chipNode.setPosition(cc.p(0, 0));
        slotNode.addChild(chipNode,1);
        this.chipNode = chipNode;

        var taiXiuBg = new cc.Sprite("#taixiu_bg.png");
        taiXiuBg.setAnchorPoint(cc.p(0, 0));
        taiXiuBg.setPosition(cc.p(0, 0));
        slotNode.setContentSize(taiXiuBg.getContentSize());
        slotNode.addChild(taiXiuBg);


        for (var i = 0; i < 31; i++) {
            var slot = new TaiXiuBettingSlot(i, slotNode);
            slotNode.addChild(slot);

            var thiz = this;
            (function () {
                var slotIndex = s_taixiu_id[i];
                slot.onTouchSlot = function () {
                    thiz.onTouchSlot(slotIndex);
                };
                thiz.bettingSlot[slotIndex] = slot;
            })();
        }


        var timer = new cc.ProgressTimer(new cc.Sprite("#xocdia_timer_2.png"));
        timer.setType(cc.ProgressTimer.TYPE_RADIAL);
        timer.setReverseDirection(true);
        timer.setPosition(cc.winSize.width - 165 * cc.winSize.screenScale, cc.winSize.height - 70 * cc.winSize.screenScale);
        timer.setPercentage(30.0);
        timer.setScale(0.65 * cc.winSize.screenScale);
        this.sceneLayer.addChild(timer);
        this.timer = timer;

        var timerBg = new cc.Sprite("#xocdia_timer_1.png");
        timerBg.setPosition(timer.getContentSize().width / 2, timer.getContentSize().height / 2);
        timer.addChild(timerBg, -1);

        var timeLabel = new cc.LabelTTF("100", cc.res.font.Roboto_CondensedBold, 40);
        timeLabel.setPosition(timer.getPosition());
        timeLabel.setColor(cc.color("#ffcf00"));
        timeLabel.setScale(cc.winSize.screenScale);
        this.sceneLayer.addChild(timeLabel);
        this.timeLabel = timeLabel;
    },

    _getSoundOpenDisk: function (result) {
        var soundArray = [];

        if (result[0] == result[1] && result[1] == result[2]) {
            //dong`
            soundArray.push("dong");
            var template = ["", "nhat", "nhi", "tam", "tu", "ngu", "luc"];
            soundArray.push(template[result[0]]);
        } else {
            // tong
            var tonghat = result[0] + result[1] + result[2];
            soundArray.push("tong");
            if (tonghat > 10) {
                soundArray.push("so_10");
                soundArray.push("so_" + (tonghat - 10));
            } else {
                soundArray.push("so_" + tonghat);
            }

            soundArray.push("space");
            soundArray.push(tonghat < 11 ? "xiu" : "tai");
        }

        return soundArray;
    },

    initHistory: function () {
        var padding = 2.0;
        var itemSize = cc.size(46.0, 160.0);
        var col = 16;
        var left = 52.0;

        var historyBg = new ccui.Scale9Sprite("xocdia_history_bg1.png", cc.rect(4, 4, 4, 4));
        historyBg.setPreferredSize(cc.size((itemSize.width + padding) * col + left, itemSize.height + padding * 2));
        historyBg.setAnchorPoint(cc.p(0, 0));
        //  historyBg.setPosition(cc.winSize.width/2, cc.winSize.height - historyBg.getContentSize().height/2);
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
            var x = left + itemSize.width / 2 + (itemSize.width + padding) * i;
            var y = padding + itemSize.height / 2;
            var bg = new ccui.Scale9Sprite("xocdia_history_bg2.png", cc.rect(4, 4, 4, 4));
            bg.setPreferredSize(itemSize);
            bg.setPosition(x, y);
            historyBg.addChild(bg);
        }

        this.historyNode = new cc.Node();
        this.historyNode.setContentSize(historyBg.getContentSize());
        this.historyNode.setAnchorPoint(cc.p(0, 0));
        historyBg.addChild(this.historyNode);

        this._historyData = [];

        //test

        // this._addHistory([1,1,1]);
        // this._addHistory([1,2,2]);
        // this._addHistory([1,2,3]);
        // this._addHistory([1,3,4]);
        // this._addHistory([1,4,5]);
        // this._addHistory([1,5,6]);
        // this._refreshHistory();
    },

    _addHistory: function (history) {
        this._historyData.push(history);
        if (this._historyData.length > 16) {
            this._historyData.splice(0, 1);
        }
    },

    _refreshHistory: function () {
        this.historyNode.removeAllChildren(true);

        var padding = 2.0;
        var itemSize = cc.size(46.0, 160.0);
        var left = 52.0;

        for (var i = 0; i < this._historyData.length; i++) {
            var data = this._historyData[i];
            var x = left + itemSize.width / 2 + (itemSize.width + padding) * i;

            var sumBg = new cc.Sprite("#taixiu_history_bg.png");
            sumBg.setPosition(x, 53);
            this.historyNode.addChild(sumBg, 0);

            var sum = 0;
            for (var j = 0; j < data.length; j++) {
                var sprite = new cc.Sprite("#taixiu_dice_history_" + data[j] + ".png");
                sprite.setPosition(x, 91 + 25 * j);
                this.historyNode.addChild(sprite, 0);

                sum += data[j];
            }

            if (sum > 10) {
                var label = new cc.LabelBMFont("TÀI", cc.res.font.Roboto_Condensed_25);
                label.setColor(cc.color("#00ccff"));
            }
            else {
                var label = new cc.LabelBMFont("XỈU", cc.res.font.Roboto_Condensed_25);
                label.setColor(cc.color("#ffde00"));
            }
            label.setScale(20.0 / 25.0);
            label.setPosition(x, 16.0);
            this.historyNode.addChild(label, 1);

            var sumLabel = new cc.LabelBMFont(sum.toString(), cc.res.font.Roboto_Condensed_25);
            sumLabel.setScale(20.0 / 25.0);
            sumLabel.setPosition(sumBg.getPosition());
            this.historyNode.addChild(sumLabel, 1);
        }
    },
   
    _addResultSprite: function (result) {
        /* add result */
        var arr = _get_random_array(result.length, s_taixiu_result_position.length);
        for (var i = 0; i < arr.length; i++) {
            var sprite = new cc.Sprite("#taixiu_dice_" + result[i] + ".png");
            sprite.setScale(0.75);
            sprite.setPosition(s_taixiu_result_position[arr[i]]);
            this.diskNode.addChild(sprite);
        }
    },

    _setFinishedSlot: function (slotId, win) {
        this.bettingSlot[slotId].slotWin(win);
    }
});