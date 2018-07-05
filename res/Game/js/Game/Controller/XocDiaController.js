/**
 * Created by QuyetNguyen on 12/5/2016.
 */


s_sfs_error_msg[91] = "Cược vượt quá cho phép";
s_sfs_error_msg[92] = "Cửa đặt không xác định";
s_sfs_error_msg[93] = "Bạn không đủ tiền để làm nhà cái";
s_sfs_error_msg[94] = "Bạn không phải nhà cái";
s_sfs_error_msg[95] = "Nhà cái đã tồn tại";
s_sfs_error_msg[96] = "Hết thời gian đặt cược";
s_sfs_error_msg[97] = "Bán cửa không thành công";
s_sfs_error_msg[98] = "Bạn đã bán cửa rồi";
s_sfs_error_msg[99] = "Số tiền bán cửa không hợp lệ";
s_sfs_error_msg[100] = "Hủy cược không thành công";
s_sfs_error_msg[101] = "Nhà cái không thể đặt cược";
s_sfs_error_msg[102] = "Hủy cái không thành công";

var XocDiaController = GameController.extend({
    ctor : function (view) {
        this._super();
        this.bettingSlotCount = 7;
        this.initWithView(view);
        this.slotGold = [];
        this.userGoldSlot = [];
        this._isRunning = false;

        SmartfoxClient.getInstance().addExtensionListener("8", this._onOpenDiskHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("10", this._onUpdateStatusHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("14", this._onDatCuocThanhCongHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("15", this._onHuyCuocThanhCongHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("21", this._onUpdateUserCountHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("202", this._onUpdateTongCuocHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("203", this._onFinishedGameHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("205", this._onDatLaiThanhCongHandler, this);
    },
    getMaxSlot : function () {
        return 1;
    },

    // onSFSExtension : function (messageType, content) {
    //     this._super(messageType, content);
    //     if(content.c == "10"){ //update status
    //         this._updateStatus(content.p);
    //     }
    //     else if(content.c == "14"){ // dat cuoc thanh cong
    //         this.onDatCuocThanhCong(content.p);
    //     }
    //     // else if(content.c == "202"){ //tong cua
    //     //     this._updateTongCuoc(content.p["1"]);
    //     // }
    //     else if(content.c == "21") { //update userCount
    //         this._updateUserCount(content.p["1"]);
    //     }
    //     else if(content.c == "8"){ //mở bát
    //         this.openDisk(content.p);
    //     }
    //     else if(content.c == "203"){ //thu tiền
    //         this.finishGame(content.p);
    //     }
    //     else if(content.c == "205"){ // đặt lại
    //         this.datLaiThanhCong(content.p);
    //     }
    //     else if(content.c == "15"){ // huy cuoc thanh cong
    //         this.huyCuocThanhCong(content.p);
    //     }
    // },

    onJoinRoom : function (params) {
        this._updateStatus(params["cs"]);

        this._updateChipValue(params["14"]);
        this._updateHistory(params["15"]);
        this._updateUserCount(params["uc"]);
        this._updateTongCuoc(params["16"]);
        var status = params["cs"]["1"];
        if(status == 5 || status == 1){
            this._view.showErrorMessage("Sắp bắt đầu ván mới");
        }
        this._isRunning = true;
    },

    onReconnect : function(params){
        this._updateStatus(params["2"]);

        this._updateChipValue(params["1"]["14"]);
        this._updateHistory(params["1"]["15"]);
        this._updateUserCount(params["1"]["uc"]);
        this._updateTongCuoc(params["1"]["16"]);

        var slotData = params["3"];
        if(slotData){
            for(var i=0;i<slotData.length;i++){
                var slotId = slotData[i]["1"];
                var userGold = slotData[i]["3"];
                this._updateUserGoldSlot(slotId, userGold);
                if(userGold > 0 && !this._isRunning){
                    this._addFakeChip(slotId, userGold, false);
                }
            }
        }
        this._isRunning = true;
    },

    /* handler */
    _onUpdateStatusHandler : function(cmd, content){
        this._updateStatus(content.p);
    },

    _onDatCuocThanhCongHandler : function(cmd, content){
        this.onDatCuocThanhCong(content.p);
    },

    _onUpdateTongCuocHandler : function (cmd, content) {
        this._updateTongCuoc(content.p["1"]);
    },

    _onUpdateUserCountHandler : function(cmd, content){
        this._updateUserCount(content.p["1"]);
    },

    _onOpenDiskHandler : function(cmd, content){
        this.openDisk(content.p);
    },

    _onFinishedGameHandler : function(cmd, content){
        this.finishGame(content.p);
    },

    _onDatLaiThanhCongHandler : function(cmd, content){
        this.datLaiThanhCong(content.p);
    },

    _onHuyCuocThanhCongHandler : function(cmd, content){
        this.huyCuocThanhCong(content.p);
    },

    openDisk : function (params) {
        var slots = params["2"];
        var winSlot = [];
        var loseSlot = [];
        for(var i=0;i<slots.length;i++){
            if(slots[i]["4"]){
                winSlot.push(slots[i]["1"]);
            }
            else{
                loseSlot.push(slots[i]["1"]);
            }
        }

        var data = {
            result : params["1"],
            winSlot : winSlot,
            loseSlot : loseSlot
        };

        this._view.openDisk(data);
    },

    finishGame : function (params) {
        this._view.setTongCuocLabel(params["4"]);
        this._view.setWinLabel(params["1"]);
    },

    onDatCuocThanhCong : function (params) {
        var chipId = params["2"];
        var slotId = params["6"][0]["1"];

        this._view.addChipToSlot(slotId, chipId, 1); //fromMe

        var allSlot = params["6"];
        for(var i=0; i<allSlot.length; i++){
            this._updateGoldSlot(allSlot[i]["1"], allSlot[i]["2"]);
            this._updateUserGoldSlot(allSlot[i]["1"], allSlot[i]["3"]);
        }

        this._view.setHuyCuocButtonVisible(true);
        this._view.setDatLaiButtonVisible(false);
    },

    datLaiThanhCong : function (param) {
        this._view.setHuyCuocButtonVisible(true);
        this._view.setDatLaiButtonVisible(false);
        this._view.datLaiThanhCong();

        var slots = param["6"];
        for(var i=0;i<slots.length;i++){
            var slotId = slots[i]["1"];
            var slotGold = slots[i]["2"];
            var userGold = slots[i]["3"];
            this._updateGoldSlot(slotId, slotGold);
            this._updateUserGoldSlot(slotId, userGold);

            if(userGold > 0){
               this._addFakeChip(slotId, userGold, true);
            }
        }
    },

    _addFakeChip : function(slotId, gold, animation){
        while(gold > 0){
            var chipSelected = this._chipValue[0];
            for(var i=0;i<this._chipValue.length;i++){
                var chip = this._chipValue[i];
                if(chip.gold > gold){
                    break;
                }

                chipSelected = chip;
            }
            gold -= chipSelected.gold;
            this._view.addChipToSlot(slotId, chipSelected.chipId, 1, null, animation ? false : true); //fromMe
        }
    },

    huyCuocThanhCong : function (param) {
        this._view.setHuyCuocButtonVisible(false);
        this._view.setDatLaiButtonVisible(false);
        this._view.huyCuocThanhCong();
        for(var i=0;i<this.bettingSlotCount;i++){
            this._updateUserGoldSlot(i, 0);
        }
    },

    //private
    _updateChipValue : function (chips) {
        this._chipValue = [];

        for(var i=0;i<chips.length;i++){
            this._view.setChipValue(chips[i]["1"], chips[i]["2"]);

            this._chipValue.push({
                chipId : chips[i]["1"],
                gold : chips[i]["2"]
            })
        }

        //sort chip values;
        this._chipValue.sort(function (a, b) {
            return (a.gold - b.gold);
        });
    },

    _updateStatus : function (statusObj) {
        var status = statusObj["1"];
        var currentTime = statusObj["3"] / 1000;
        var maxTime = statusObj["4"] / 1000;
        switch (status){
            case 1: //chuẩn bị ván mới
            {
                this.slotGold = [];
                this.userGoldSlot = [];
                this._view.setTimeRemaining(0, 0);
                this._view.hideDisk();
                this._view.resetGame();
                break;
            }
            case 2: //xóc đĩa
            {
                this.slotGold = [];
                this.userGoldSlot = [];
                this._view.setTimeRemaining(0, 0);
                this._view.shakeDisk();
                this._view.resetGame();
                break;
            }
            case 3: //đặt cược
            {
                this.slotGold = [];
                this.userGoldSlot = [];
                this._view.hideDisk();
                this._view.setTimeRemaining(currentTime, maxTime);
                this._view.playSoundDatCuoc();
                break;
            }
            case 4: //thời gian cái thừa thiếu
            {
                this._view.setTimeRemaining(0, 0);
                this._view.hideDisk();
                break;
            }
            case 5: // mở bát
            {
                this._view.setTimeRemaining(0, 0);
                this._view.hideDisk();
                break;
            }
        }

        this._view.setDatLaiButtonVisible(statusObj["2"]);
        this._view.setHuyCuocButtonVisible(statusObj["5"]);
    },

    _updateTongCuoc : function (tongCuoc) {
        for(var i=0;i<tongCuoc.length;i++){
            var slotId = tongCuoc[i]["1"];
            var gold = tongCuoc[i]["2"];
            if(this.slotGold[slotId] != undefined && gold > this.slotGold[slotId]){
                //cc.log("add fake chip");
                var chipCount = Math.floor(4 + Math.random() * 4);
                for(var i=0;i<chipCount;i++){
                    var chipId = Math.floor(Math.random() * 4);
                    this._view.addChipToSlot(slotId, chipId, 2);
                }
            }
            this._updateGoldSlot(slotId, gold);
        }
    },

    _updateGoldSlot : function (slotId, gold) {
        this._view.updateSlotGold(slotId, gold);
        this.slotGold[slotId] = gold;
    },

    _updateUserGoldSlot : function (slotId, gold) {
        this._view.updateUserGold(slotId, gold);
        this.userGoldSlot[slotId] = gold;

        var totalGold = 0;
        for(var i=0; i<this.bettingSlotCount; i++){
            if(this.userGoldSlot[i]){
                totalGold += this.userGoldSlot[i];
            }
        }
        if(totalGold > 0){
            this._view.setTongCuocLabel(totalGold);
        }
        else{
            this._view.setTongCuocLabel(-1);
        }
    },
    
    _updateHistory : function (historyList) {
        this._view.setHistory(historyList);
    },

    _updateUserCount : function (userCount) {
        this._view.updateUserCount(userCount);
    },

    //request
    requestDatCuoc : function (slotId, chipId) {
        var params = {
            1 : slotId,
            2 : chipId
        };
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("14", params);
    },
    requestDatlai : function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("205", {});
    },
    requestHuyCuoc : function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("15", {});
    }
});