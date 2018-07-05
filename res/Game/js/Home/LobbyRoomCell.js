/**
 * Created by QuyetNguyen on 11/25/2016.
 */

var LobbyRoomCell = ccui.Widget.extend({
    ctor : function () {
        this._super();
        var bg = new cc.Sprite("#lobby-roomBg.png");
        this.setContentSize(bg.getContentSize());
        bg.setPosition(this.getContentSize().width/2, this.getContentSize().height/2);
        this.addChild(bg);

        this.allSlot = [];
        this.slot = null;
        this.initSlot(2);
        this.initSlot(4);
        this.initSlot(5);
        this.initSlot(6);
        this.initSlot(9);

        var bettingLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_20, "1000");
        bettingLabel.setPosition(bg.x, bg.y - 2);
        bettingLabel.setColor(cc.color("#ffde00"));
        this.addChild(bettingLabel);
        this.bettingLabel = bettingLabel;
    },
    initSlot : function (maxSlot) {
        var slotNode = new cc.Node();
        this.addChild(slotNode);
        this.allSlot.push(slotNode);
        slotNode.maxSlot = maxSlot;
        slotNode.allSlot = [];

        for(var i=0;i<maxSlot;i++){
            var emptySprite = new cc.Sprite("#slot-empty-" + maxSlot + "-" +(i+1)+ ".png");
            emptySprite.setPosition(this.getContentSize().width/2, this.getContentSize().height/2);
            slotNode.addChild(emptySprite);
        }

        for(var i=0;i<maxSlot;i++){
            var activeSprite = new cc.Sprite("#slot-active-" + maxSlot +"-" + (i + 1) + ".png");
            activeSprite.setPosition(emptySprite.getPosition());
            slotNode.addChild(activeSprite);
            slotNode.allSlot.push(activeSprite);
        }
    },

    setMaxSlot : function (maxSlot) {
        var _maxSlot = maxSlot;
        if(_maxSlot > 9){
            _maxSlot = 9;
        }
        this.slot = null;

        for(var i=0;i<this.allSlot.length;i++){
            if(this.allSlot[i].maxSlot == _maxSlot){
                this.slot = this.allSlot[i].allSlot;
                this.allSlot[i].visible = true;
            }
            else{
                this.allSlot[i].visible = false;
            }
        }

        if(this.slot){

        }
    },

    addTouchCell : function (listener) {
        this.setTouchEnabled(true);
        this.addClickEventListener(listener);
    },

    setBetting : function (betting) {
        if(this.bettingLabel){
            this.bettingLabel.setString(cc.Global.NumberFormat1(betting));
        }
    },
    setUserCount : function (userCount) {
        if(userCount > 9){
            if(userCount == 30){
                userCount = 9;
            }
            else{
                userCount = 8;
            }
        }

        if(this.slot){
            for(var i=0;i<this.slot.length;i++){
                if(i < userCount){
                    this.slot[i].visible = true;
                }
                else{
                    this.slot[i].visible = false;
                }
            }
        }
    }
});

LobbyRoomCell.createCell = function (maxSlot) {
    var cell = new LobbyRoomCell();
    cell.setMaxSlot(maxSlot);
    return cell;
};

/* xoc dia */

LobbyXocDiaCell = ccui.Widget.extend({
    ctor : function () {
        this._super();

        var historyNode = new cc.Node();
        this.addChild(historyNode, 3);
        this.historyNode = historyNode;

        this._initView();
        this._initHistory();
    },

    _initView : function () {
        this.setContentSize(cc.size(940, 241));

        var bg = new ccui.Scale9Sprite("lobby_xocdia_bg_1.png", cc.rect(4,4,4,4));
        bg.setPreferredSize(this.getContentSize());
        bg.setAnchorPoint(cc.p(0,0));
        this.addChild(bg);

        var timer = new cc.ProgressTimer(new cc.Sprite("#lobby_xocdia_timer.png"));
        timer.setType(cc.ProgressTimer.TYPE_RADIAL);
        if(!cc.sys.isNative && cc._renderType === cc.game.RENDER_TYPE_WEBGL){
            timer._alwaysRefreshVertext = true;
        }
        timer.setReverseDirection(true);
        timer.setPosition(70, 159);
        timer.setPercentage(30.0);
        this.addChild(timer);
        this.timer = timer;

        var timerBg = new cc.Sprite("#lobby_xocdia_timer_bg.png");
        timerBg.setPosition(timer.getContentSize().width/2, timer.getContentSize().height/2);
        timer.addChild(timerBg,-1);

        var timeLabel = new cc.LabelBMFont("100", cc.res.font.Roboto_CondensedBold_25);
        timeLabel.setPosition(timer.getPosition());
        timeLabel.setColor(cc.color("#ffcf00"));
        this.addChild(timeLabel, 1);
        this.timeLabel = timeLabel;

        var userBg = new ccui.Scale9Sprite("lobby_xocdia_bg_3.png", cc.rect(8,8,4,4));
        userBg.setPreferredSize(cc.size(120, 44));
        userBg.setPosition(timer.x, 29);
        this.addChild(userBg);

        var userIcon = new cc.Sprite("#lobby_xocdia_userIcon.png");
        userIcon.setPosition(42, 29);
        this.addChild(userIcon);

        var userLabel = new cc.LabelBMFont("100", cc.res.font.Roboto_Condensed_25);
        userLabel.setPosition(66, 29);
        userLabel.setAnchorPoint(cc.p(0.0, 0.5));
        userLabel.setColor(cc.color("#ffcf00"));
        this.addChild(userLabel, 2);
        this.userLabel = userLabel;

        var roomName = new cc.LabelBMFont("PHÒNG 1", cc.res.font.Roboto_CondensedBold_25);
        roomName.setPosition(timer.x, 80);
        roomName.setColor(cc.color("#9ba5f3"));
        this.addChild(roomName, 1);
        this.roomName = roomName;

        var bettingIcon1 = new cc.Sprite("#lobby_xocdia_icon_1.png");
        bettingIcon1.setPosition(165, 26);
        this.addChild(bettingIcon1);

        var bettingIcon2 = new cc.Sprite("#lobby_xocdia_icon_1.png");
        bettingIcon2.setPosition(443, bettingIcon1.y);
        this.addChild(bettingIcon2);

        var bettingLabel1 = new cc.LabelBMFont("Thấp nhất", cc.res.font.Roboto_Condensed_25);
        bettingLabel1.setAnchorPoint(cc.p(0.0, 0.5));
        bettingLabel1.setColor(cc.color("#9ba5f3"));
        bettingLabel1.setPosition(190, bettingIcon1.y);
        this.addChild(bettingLabel1, 2);

        var bettingLabel2 = new cc.LabelBMFont("Cao nhất", cc.res.font.Roboto_Condensed_25);
        bettingLabel2.setAnchorPoint(cc.p(0.0, 0.5));
        bettingLabel2.setColor(cc.color("#9ba5f3"));
        bettingLabel2.setPosition(470, bettingIcon1.y);
        this.addChild(bettingLabel2, 2);

        var bettingMin = new cc.LabelBMFont("1000", cc.res.font.Roboto_CondensedBold_25);
        bettingMin.setAnchorPoint(cc.p(0.0, 0.5));
        bettingMin.setColor(cc.color("#ffde00"));
        bettingMin.setPosition(295, bettingIcon1.y);
        this.addChild(bettingMin, 1);
        this.bettingMin = bettingMin;

        var bettingMax = new cc.LabelBMFont("1000", cc.res.font.Roboto_CondensedBold_25);
        bettingMax.setAnchorPoint(cc.p(0.0, 0.5));
        bettingMax.setColor(cc.color("#ffde00"));
        bettingMax.setPosition(562, bettingIcon1.y);
        this.addChild(bettingMax, 1);
        this.bettingMax = bettingMax;

        var joinButton = new ccui.Button("lobby_xocdia_joinBt.png","","", ccui.Widget.PLIST_TEXTURE);
        joinButton.setZoomScale(0.0);
        joinButton.setPosition(840, 25);
        this.addChild(joinButton, 0);
        this.joinButton = joinButton;
    },

    _initHistory : function () {
        var itemSize = cc.size(48,45);

        for(var i=0;i<16;i++){
            for(var j=0;j<4;j++){
                var bg = new ccui.Scale9Sprite("lobby_xocdia_bg_2.png",cc.rect(4,4,4,4));
                bg.setPreferredSize(itemSize);
                var x = 165 + (itemSize.width + 2) * i;
                var y = 76.0 + (itemSize.height + 2) * j;
                bg.setPosition(x, y);
                this.addChild(bg);

            }
        }

        this._historyData = [];
    },

    _addHistory : function (history) {
        if(this._historyData.length <= 0){
            this._historyData.push(history);
            return;
        }

        var row = 4;
        var col = 16;
        var maxItem = row*col;

        var lastHistory = this._historyData[this._historyData.length - 1];
        if(lastHistory % 2 != history%2){
        //fill empty
            var emptyCount = this._historyData.length % row;
            if(emptyCount > 0){
                emptyCount = row - emptyCount;
                for(var i=0;i<emptyCount;i++){
                    this._historyData.push(-1);
                }
            }
        }

        this._historyData.push(history);

        if(this._historyData.length > maxItem){
            this._historyData.splice(0, row);
        }
    },

    _refreshHistory : function () {
        var row = 4;
        var itemSize = cc.size(48,45);

        this.historyNode.removeAllChildren(true);

        for(var i=0; i<this._historyData.length; i++){
            if(this._historyData[i] >= 0){
                var label = new cc.LabelBMFont(this._historyData[i].toString(), cc.res.font.Roboto_CondensedBold_25);

                var x = 165.0 + (itemSize.width + 2) * Math.floor(i/row);
                var y = 217.0 - (itemSize.height + 2) * (i%row);

                if(this._historyData[i] % 2){
                    var historyIcon = new cc.Sprite("#lobby_xocdia_history_1.png");
                    label.setColor(cc.color("#ffffff"));
                }
                else{
                    var historyIcon = new cc.Sprite("#lobby_xocdia_history_2.png");
                    label.setColor(cc.color("#333333"));
                }
                historyIcon.setPosition(x, y);
                this.historyNode.addChild(historyIcon, 0);

                label.setPosition(x, y);
                this.historyNode.addChild(label, 1);
            }
        }
    },

    _setTimeRemaining : function (currentTime, maxTime){
        this.timer.stopAllActions();
        this.timeLabel.stopAllActions();
        if(maxTime <= 0.0){
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

        var timerProgress = 100.0* currentTime / maxTime;
        this.timer.runAction(new cc.ProgressFromTo(currentTime, timerProgress, 0.0));

        this.timeLabel.runAction(new quyetnd.ActionTimeRemaining(currentTime));

        var thiz = this;
        if(currentTime > 5){
            this.timeLabel.setColor(cc.color("#ffcf00"));
            this.timer.setColor(cc.color("#ffcf00"));

            this.timeLabel.runAction(new cc.Sequence(
                new cc.DelayTime(currentTime - 5),
                new cc.CallFunc(function () {
                    var alertAction = new cc.Sequence(
                        new cc.TintTo(0.2, 255,0,0),
                        new cc.TintTo(0.2, 255,207,0)
                    );
                    thiz.timeLabel.runAction(new cc.RepeatForever(alertAction));
                })
            ));

            this.timer.runAction(new cc.Sequence(
                new cc.DelayTime(currentTime - 5),
                new cc.CallFunc(function () {
                    var alertAction = new cc.Sequence(
                        new cc.TintTo(0.2, 255,0,0),
                        new cc.TintTo(0.2, 255,207,0)
                    );
                    thiz.timer.runAction(new cc.RepeatForever(alertAction));
                })
            ));
        }
        else{
            var alertAction = new cc.Sequence(
                new cc.TintTo(0.2, 255,0,0),
                new cc.TintTo(0.2, 255,207,0)
            );
            this.timeLabel.runAction(new cc.RepeatForever(alertAction.clone()));
            this.timer.runAction(new cc.RepeatForever(alertAction));
        }
    },

    setBetting : function (betting) {

    },

    setUserCount : function (userCount) {
        this.userLabel.setString(userCount.toString());
    },

    addTouchCell : function (listener) {
        this.joinButton.addClickEventListener(listener);

        this.setTouchEnabled(true);
        this.addClickEventListener(listener);
    },

    setMetadata : function (data) {
        this.setHistory(data["4"]);
        this.bettingMin.setString(cc.Global.NumberFormat1(data["5"]));
        this.bettingMax.setString(cc.Global.NumberFormat1(data["6"]));
        var status = data["1"];
        if(status == 3){
            this._setTimeRemaining(data["2"] / 1000, data["3"] / 1000);
        }
        else{
            this._setTimeRemaining(0, 0);
        }
    },

    setIndex : function (idx) {
        this.roomName.setString("PHÒNG " + idx.toString());
    },

    setHistory : function (history) {
        this._historyData = [];
        for(var i=0;i<history.length;i++){
            this._addHistory(history[i]);
        }

        this._refreshHistory();
    }
});

LobbyTaiXiuCell = LobbyXocDiaCell.extend({
    ctor : function () {
        this._super();
    },

    _initHistory : function () {
        var itemSize = cc.size(48,188);

        for(var i=0;i<16;i++){
            var bg = new ccui.Scale9Sprite("lobby_xocdia_bg_2.png",cc.rect(4,4,4,4));
            bg.setPreferredSize(itemSize);
            bg.setPosition(165.0 + (itemSize.width + 2) * i, 145);
            this.addChild(bg);
        }
    },

    _addHistory : function (history) {
        this._historyData.push(history);
        if(this._historyData.length > 16){
            this._historyData.splice(0, 1);
        }
    },

    _refreshHistory : function () {
        var itemSize = cc.size(48,188);
        this.historyNode.removeAllChildren(true);

        for(var i=0; i<this._historyData.length; i++){
            var x = 165.0 + (itemSize.width + 2) * i;
            var data = this._historyData[i];

            var sumBg = new cc.Sprite("#lobby_taixiu_history_bg_1.png");
            sumBg.setPosition(x, 109);
            this.historyNode.addChild(sumBg, 0);

            var sum = 0;
            for(var j=0;j<data.length;j++){
                var sprite = new cc.Sprite("#lobby_taixiu_dice_" + data[j] + ".png");
                sprite.setPosition(x, 153 + 28*j);
                this.historyNode.addChild(sprite, 0);

                sum += data[j];
            }

            if(sum > 10){
                var label = new cc.LabelBMFont("TÀI", cc.res.font.Roboto_Condensed_25);
                label.setColor(cc.color("#00ccff"));
            }
            else{
                var label = new cc.LabelBMFont("XỈU", cc.res.font.Roboto_Condensed_25);
                label.setColor(cc.color("#ffde00"));
            }
            label.setScale(18.0/25.0);
            label.setPosition(x, 72.0);
            this.historyNode.addChild(label, 1);

            var sumLabel = new cc.LabelBMFont(sum.toString(), cc.res.font.Roboto_Condensed_25);
            sumLabel.setScale(20.0/25.0);
            sumLabel.setPosition(sumBg.getPosition());
            this.historyNode.addChild(sumLabel, 1);
        }
    }
});
