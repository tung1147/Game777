/**
 * Created by Quyet Nguyen on 7/5/2016.
 */

var s_lobby_group_name = s_lobby_group_name || [
    "tapsu",
    "binhdan",
    "thieugia",
    "daigia",
    "vip"
];

var LobbyLayer = cc.Node.extend({
    ctor : function () {
        this._super();
        LobbyClient.getInstance().addListener("updateAll", this.onUpdateAll, this);
        LobbyClient.getInstance().addListener("updateUserCount", this.onUpdateUserCount, this);
        LobbyClient.getInstance().addListener("inviteUser", this.onInviteReceived, this);

        //
        this.initListRoom();
        this.initListRoomXocDia();

        this.setContentSize(cc.size(1280, 720));
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        this.setScale(cc.winSize.screenScale);
    },

    initListRoomXocDia : function () {
        var roomXocDiaNode = new cc.Node();
        this.addChild(roomXocDiaNode);
        this.roomXocDiaNode = roomXocDiaNode;

        var left = 290.0;
        var right = 1280.0;
        var top = 550.0;
        var bottom = 143.0;

        var listGame = new newui.TableView(cc.size(right - left, top - bottom), 1);
        listGame.setPadding(20);
        listGame.setMargin(10,10,0,0);

        listGame.setDirection(ccui.ScrollView.DIR_VERTICAL);
        listGame.setBounceEnabled(true);
        listGame.setScrollBarEnabled(true);
        listGame.setPosition(left, bottom);
        roomXocDiaNode.addChild(listGame,1);
        this.listRoomXocDia = listGame;
    },

    initListRoom: function () {
        var roomNode = new cc.Node();
        this.addChild(roomNode);
        this.roomNode = roomNode;

        var left = 290.0 + 6;
        var right = 1280.0 - 6;
        var top = 550.0;
        var bottom = 193.0;

        var shadowBg = new cc.Sprite("#bg_chonban.png");
        shadowBg.setAnchorPoint(cc.p(0.5, 0.0));
        shadowBg.setPosition((right + left) / 2, bottom);
        roomNode.addChild(shadowBg, 1);

        var gameNav = new cc.Sprite("#home-gameNav-bg.png");
        gameNav.setPosition((right + left) / 2, 168);
        roomNode.addChild(gameNav,1);

        var dx = gameNav.getContentSize().width / 5;
        var x = gameNav.x - gameNav.getContentSize().width / 2 + dx / 2;

        var selectSprite = new ccui.Scale9Sprite("home-gameNav-selected.png", cc.rect(4,4,4,4));
        selectSprite.setPreferredSize(cc.size(dx, gameNav.getContentSize().height));
        selectSprite.setPosition(0, gameNav.y);
        roomNode.addChild(selectSprite, 2);

        var thiz = this;
        var mToggle = new ToggleNodeGroup();
        roomNode.addChild(mToggle,2);
        this.mToggle = mToggle;
        this.listGame = [];

        for(var i=0; i<s_lobby_group_name.length; i++){
            (function () {
                var icon1 = new cc.Sprite("#lobby-tab"+ (i+1) +".png");
                icon1.setPosition(x + dx * i, 180);
                roomNode.addChild(icon1,2);

                var icon2 = new cc.Sprite("#lobby-tabSelected"+ (i+1) +".png");
                icon2.setPosition(icon1.getPosition());
                roomNode.addChild(icon2,2);

                var listGame = new newui.TableView(cc.size(right - left, (top - bottom)), 5);
                listGame.setDirection(ccui.ScrollView.DIR_VERTICAL);
                listGame.setPadding(25);
                listGame.setPadding(25);
                listGame.setBounceEnabled(true);
                listGame.setMargin(10,10,0,0);
                listGame.setScrollBarEnabled(true);
                listGame.setPosition(left, bottom);
                listGame.groupName = s_lobby_group_name[i];
                listGame.idx = i;
                roomNode.addChild(listGame);
                thiz.listGame.push(listGame);

                var toggleItem = new ToggleNodeItem(selectSprite.getContentSize());
                toggleItem.setPosition(icon1.x, selectSprite.y);

                toggleItem.onSelect = function (isForce, byUpdateAll) {
                    if(byUpdateAll){
                        return;
                    }

                    icon1.visible = false;
                    icon2.visible = true;
                    listGame.visible = true;
                    selectSprite.stopAllActions();
                    if(isForce){
                        selectSprite.x = icon1.x;
                    }
                    else{
                        selectSprite.runAction(new cc.MoveTo(0.1, cc.p(icon1.x, selectSprite.y)));
                    }

                    if(!isForce){
                        var gameId = s_games_chanel_id[PlayerMe.gameType];
                        LobbyClient.getInstance().subscribe(gameId, listGame.groupName);
                    }
                };
                toggleItem.onUnSelect = function () {
                    icon1.visible = true;
                    icon2.visible = false;
                    listGame.visible = false;
                };
                mToggle.addItem(toggleItem);
            })();
        }
    },

    addRoomCell : function (roomList, serverId, roomId, betting, minMoney, userCount, metadata, maxUser) {
        if(this.updateRoomCell(roomList, serverId, roomId, userCount, metadata)){
            return null;
        }

        if(this.gameId == GameType.GAME_XocDia){
            var roomCell = new LobbyXocDiaCell();
        }
        else if(this.gameId == GameType.GAME_TaiXiu){
            var roomCell = new LobbyTaiXiuCell();
        }
        else{
            var roomCell = LobbyRoomCell.createCell(maxUser);
        }

      //  var roomCell = LobbyRoomCell.createCell(this.maxUsers);

        roomCell.serverId = serverId;
        roomCell.roomId = roomId;
        roomCell.setBetting(betting);
        roomCell.setUserCount(userCount);
        if(metadata){
            roomCell.setMetadata(metadata);
        }
        roomList.pushItem(roomCell);

        roomCell.addTouchCell(function () {
            if(PlayerMe.gold < minMoney && PlayerMe.gameType != s_games_chanel[GameType.GAME_Poker]){
                //MessageNode.getInstance().show("Bạn không đủ tiền vào phòng");
                var homeScene = cc.director.getRunningScene();
                if(homeScene.showPaymentDialog){
                    homeScene.showPaymentDialog();
                }
            }
            else{
                var serverInfo = LobbyClient.getInstance().SFSServerInfo[serverId];
                if(serverInfo){
                    PlayerMe.SFS.roomId = roomId;
                    SmartfoxClient.getInstance().findAndJoinRoom(serverInfo, null, null, roomId);
                }
                else{
                    MessageNode.getInstance().show("Không có thông tin máy chủ");
                }

                LoadingDialog.getInstance().show("Đang vào phòng");

                cc.log("join room");
            }
        });

        return roomCell;
    },

    updateRoomCell : function (roomList, serverId, roomId, userCount, metadata) {
        for(var i=0;i<roomList.size();i++){
            var item = roomList.getItem(i);
            if(item.serverId == serverId && item.roomId == roomId){
                item.setUserCount(userCount);
                if(metadata){
                    item.setMetadata(metadata);
                }
                return true;
            }
        }

        return false;
    },

    getRoomList : function (groupName) {
        if(this.gameId == GameType.GAME_XocDia || this.gameId == GameType.GAME_TaiXiu){
            return this.listRoomXocDia;
        }
        else{
            for(var i=0;i<this.listGame.length;i++){
                if(this.listGame[i].groupName == groupName){
                    return this.listGame[i];
                }
            }
        }

        return null;
    },

    startGame : function (gameId) {
        this.gameId = gameId;

        if(gameId == GameType.GAME_TaiXiu || gameId == GameType.GAME_XocDia){
            this.roomNode.setVisible(false);
            this.roomXocDiaNode.setVisible(true);
        }
        else{
            this.roomNode.setVisible(true);
            this.roomXocDiaNode.setVisible(false);
        }
    },

    startAnimation : function () {

    },

    onInviteReceived: function (command, data) {
        var thiz = this;

        if (!cc.Global.GetSetting("invite")){
            return;
        }

        if(this.ignoreAllInvite){
            return;
        }

        if(s_RecvInviteDialog){
            return;
        }

        data = data["data"];
        var roomId = data["roomId"];
        var serverInfo = LobbyClient.getInstance().createServerInfo(data);
        serverInfo.roomId = roomId;

        var dialog = new RecvInviteDialog();
        dialog.setInfo(data["userInvite"],s_games_display_name[s_games_chanel_id[data["gameType"]]],data["betting"]);
        dialog.setRoomInfo(serverInfo);
        dialog._ignoreHandler = function () {
            thiz.ignoreAllInvite = true;
        };
        dialog.showWithAnimationScale();
    },

    onUpdateAll : function (cmd, event) {
        cc.log(event);

        var data = event.data;
        this.maxUsers = data.maxUsers;

        var gameType = PlayerMe.gameType;
        if(gameType === data.gameType){
            var groups = data.groups;
            for(var i=0;i<groups.length;i++){
                var groupName = groups[i].group;
                var roomList = this.getRoomList(groupName);
                if(roomList){
                    var roomData = groups[i].rooms;
                    var idx = 1;

                    for(var j=0; j<roomData.length; j++){
                        var serverId = roomData[j].serverId;
                        var roomId = roomData[j].roomId;
                        var betting = roomData[j].betting;
                        var minMoney = roomData[j].minMoney;
                        var userCount = roomData[j].userCount;

                        var metadata = roomData[j].metadata;
                        var roomCell = this.addRoomCell(roomList, serverId, roomId, betting, minMoney, userCount, metadata,roomData[j].slots);
                        if(roomCell && roomCell.setIndex){
                            roomCell.setIndex(idx);
                        }
                        idx++;
                        // if(PlayerMe.gameType == s_games_chanel[GameType.GAME_Poker]){
                        //     var roomCell = this.addRoomCell(roomList, serverId, roomId, betting, minMoney, userCount, metadata,roomData[j].slots);
                        // }else {
                        //     var roomCell = this.addRoomCell(roomList, serverId, roomId, betting, minMoney, userCount, metadata,this.maxUsers);
                        // }
                    }
                }

            }

            var roomList = this.getRoomList(data["group"]);
            if(roomList.idx != undefined){
                this.mToggle.selectItem(roomList.idx);
            }
            roomList.runMoveEffect(3000,0.1,0.1);
        }
    },

    onUpdateUserCount : function (cmd, event) {
        var groups = event.data.groups;
        for(var i=0;i<groups.length;i++){
            var groupName = groups[i].group;
            var roomList = this.getRoomList(groupName);
            if(roomList){
                var roomData = groups[i].rooms;
                for(var j=0; j<roomData.length; j++){
                    //this.addRoomCell(roomList, roomData[j].serverId, roomData[j].roomId, roomData[j].betting, roomData[j].userCount);
                    this.updateRoomCell(roomList, roomData[j].serverId, roomData[j].roomId, roomData[j].userCount, roomData[j].metadata);
                }
            }

        }
    },

    setVisible : function (visible) {
        this._super(visible);
        if(!visible){
            // for(var i=0; i < this.listGame.length;i++){
            //     this.listGame[i].removeAllItems();
            // }
            // this.listRoomXocDia.removeAllItems();
        }
        else{
            this.ignoreAllInvite = false;
            for(var i=0; i < this.listGame.length;i++){
                this.listGame[i].removeAllItems();
            }
            this.listRoomXocDia.removeAllItems();

            this.mToggle.selectItem(0);
        }
    },

    onEnter : function () {
        this._super();
        this.mToggle.selectItem(0);
        this.ignoreAllInvite = false;
    },

    onExit : function () {
        this._super();
        for(var i=0; i < this.listGame.length;i++){
            this.listGame[i].removeAllItems();
        }
        this.listRoomXocDia.removeAllItems();
        if(this.visible == true){
            LobbyClient.getInstance().unSubscribe();
        }
        LobbyClient.getInstance().removeListener(this);
    }
});