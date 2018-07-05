/**
 * Created by VGA10 on 1/11/2017.
 */
var maubinh_wintypes = maubinh_wintypes ||
    ["","Sập ba chi","Binh lủng", "3 Sảnh","3 Thùng","Lục phé bôn","5 đôi 1 sám","12 lá đồng màu","13 lá đồng màu","Sảnh rồng", "Rồng cuốn"];

var maubinh_chitypes = maubinh_chitypes ||
    ["", "Mậu thầu", "Đôi", "Thú", "Xám", "Sảnh", "Thùng", "Cù lũ", "Tứ quý", "Thùng phá sảnh", "Sảnh rồng"];

var MauBinhController = GameController.extend({
    ctor: function (view) {
        this._super();
        this.initWithView(view);

        SmartfoxClient.getInstance().addExtensionListener("3", this._onStartGameHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("10", this._onGameStatusHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("451", this._onXepXongHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("452", this._onXepLaiHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("8", this._onGameFinishHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("100005", this._onNoHuHandler, this);
        SmartfoxClient.getInstance().addExtensionListener("100004", this._onUpdateJackpotHandler, this);

    },
    onUpdateOwner : function (params) {
        this._super(params);

        if (this.gameStatus == 1 && this.isOwnerMe) {
            this._view.setStartBtVisible(true);
        }
    },
    _onUpdateJackpotHandler : function (cmd, content) {
        this._view.performChangeRewardFund(content.p.data["2"]);
    },
    _onNoHuHandler: function (cmd, content) {
        this.onNoHuHandler(content.p);
    },
    _onStartGameHandler: function (cmd, content) {
        this.onStartGame(content.p);
    },

    _onGameStatusHandler: function (cmd, content) {
        this.onGameStatus(content.p);

    },

    _onXepXongHandler: function (cmd, content) {
        this.onXepXong(content.p);
    },

    _onXepLaiHandler: function (cmd, content) {
        this.onXepLai(content.p);
    },

    _onGameFinishHandler: function (cmd, content) {
       this.onGameFinish(content.p,false);
    },

    onStartGame: function (param) {
        var typeTrang = param["2"];
        this._view.performDealCards(param["1"], true,typeTrang);
    },
    onNoHuHandler: function (param) {

        var nameNo = param["data"]["u"];
        var money = param["data"]["2"];

        var thiz = this;
         thiz._view.showJackpot(nameNo,money);


    },

    onGameStatus: function (param) {
        this._view.hideAllButton();
        this.gameStatus = param["1"];
        cc.log(param);
        switch (param["1"]) {
            case 1:
                this._view.setStartBtVisible(this.isOwnerMe);
                this._view.cleanBoard();
                break;

            case 2:
                this._view.setIngameButtonVisible(true);
                this._view.showTimeRemaining(param["2"]);
                break;

            case 3:
                // xep xong
                this._view.onTimeOut();
                break;
        }

    },

    onXepXong: function (param) {
        var user = param["u"];
        this._view.onUserXepBaiStatus(user, true);

        if (user == PlayerMe.username) {
            var thangTrangMode = param["2"];
            if (thangTrangMode > 1) {
                this._view.performAnnounce(user, maubinh_wintypes[thangTrangMode]);
            }

        }
    },

    onReconnect: function (param) {
        this._super(param);
        var stateGame = param[1][1];
        this._view.performChangeRewardFund(param["1"]["11"]["2"]);
        var isShowArrange = param["4"];
        this.onGameStatus({1: param["1"]["1"], 2: Math.floor(param["1"]["13"] / 1000)});
        if(stateGame == 2 || stateGame == 3){
            this._view.performDealCards(param["3"],false,0);
            if(stateGame==2){ // dang xep
                this._view.xepLaiBt.setVisible(isShowArrange);
                this._view.showNodeArrangement(!isShowArrange);
            }
            else{
                this.onGameFinish(param["1"]["14"], true);
            }
        }


    },

    onXepLai: function (param) {
        var user = param["u"];
        this._view.onUserXepBaiStatus(user, false);
    },

    onGameFinish: function (param, isReconnect) {

        var thiz = this;
        var arrAction  = [];
        var delayUp = new cc.DelayTime(1);
        arrAction.push(delayUp);

        var phaseCurr = param["2"];
        var idPhaseCurr = phaseCurr["1"];
        var timeCurrent = phaseCurr["2"]/1000;
        var delayTCurr = new cc.DelayTime(timeCurrent);

        var phases = param["1"];

        for(var i = 0; i< phases.length; i++){
            (function () {
                var iNew = i;
                var phase = phases[iNew];
                var idPhase = phase["1"];
                var timePhase = phase["2"]/1000;
                var delayTime = new cc.DelayTime(timePhase);
                var arrResuft = phase["3"];
                var callFun = null;
                callFun = new cc.CallFunc(function () {
                 for(var k = 0; k< arrResuft.length;k++){
                    (function () {

                        var knew = k;
                        var exMoney = (arrResuft[knew]["3"])?arrResuft[knew]["3"]:"0";
                        var arrCard = arrResuft[knew]["1"];
                        var namePlayer = arrResuft[knew]["u"];
                        var moneyPlayer = (arrResuft[knew]["4"])?arrResuft[knew]["4"]:"0";

                        if(idPhase == 1){ //set lUng hoac toi tran
                            var rankChi = arrResuft[knew]["0"];
                            thiz._view.performLatBaiSpecial(namePlayer,arrCard,rankChi,exMoney,isReconnect);
                        }
                        else if(idPhase == 2 || idPhase == 3 || idPhase == 4){
                            var isReconnectNew = isReconnect;
                            if(idPhaseCurr < idPhase)
                            {
                                isReconnectNew = false;
                            }
                             var rankChi = arrResuft[knew]["10"];
                             var typeBaoLang = arrResuft[knew]["0"];
                             var txtSap = (typeBaoLang==1)?"Sập":"";
                             thiz._view.performSoChi(namePlayer, idPhase-2, rankChi, exMoney, arrCard,parseInt(moneyPlayer),txtSap,isReconnectNew);


                        }
                        else if(idPhase == 5){ // kieu dac biet
                            var rankChi = arrResuft[knew]["0"];
                            thiz._view.performPhase5(namePlayer,rankChi,exMoney,isReconnect);
                        }
                        else if(idPhase == 6){ // resuft
                            var winType = arrResuft[knew]["0"];
                            var soChiWin = arrResuft[knew]["6"];
                            var wholeCards = arrResuft[knew]["8"];
                            var moneyChange = arrResuft[knew]["5"];
                            thiz._view.addResultEntry(namePlayer, winType, soChiWin, wholeCards, parseInt(moneyPlayer), moneyChange);
                        }


                    })();

                }
                    if(idPhase == 6){
                        thiz._view.performShowResult(0);
                    }
                });
                if(callFun != null){
                    if(idPhase>= idPhaseCurr){
                        arrAction.push(callFun);
                        if(idPhase != 6){
                            arrAction.push((idPhase>idPhaseCurr)?delayTime:delayTCurr);
                        }
                    }else{
                        thiz._view.runAction(callFun);
                    }
                };

            })();

        };


        this._view.runAction(new cc.Sequence(arrAction));

        // var currentPhaseId = param["2"]["1"];
        // var currentPhaseTime = Math.floor(param["2"]["2"]);
        // var subPhases = param["1"];
        // var delayCount = 0;
        //
        // for (var i = 0; i < subPhases.length; i++) {
        //     // sp = subPhase
        //     var sp = subPhases[i];
        //     var spId = sp["1"];
        //     if (isReconnect && spId < currentPhaseId) {
        //     }
        //     else if (isReconnect && spId == currentPhaseId) {
        //         delayCount += currentPhaseTime;
        //     } else {
        //         delayCount += sp["2"];
        //     }
        //
        //     var matches = sp["3"];
        //     for (var j = 0; j < matches.length; j++) {
        //         var matchData = matches[j];
        //         var username = matchData["u"];
        //         var winType = matchData["0"];
        //         var exMoney = matchData["3"];
        //         var cardArray = matchData["1"];
        //         var newMoney = matchData["4"];
        //         var moneyChange = matchData["5"];
        //         var soChiWin = matchData["6"];
        //         var wholeCards = matchData["8"];
        //         var rankChi = matchData["10"];
        //         switch (spId) {
        //             case 1 : // so binh lung, thang trang
        //                 this._view.performRevealCard(username, cardArray, winType, exMoney, delayCount);
        //                 break;
        //             case 2: // so chi
        //             case 3:
        //             case 4:
        //                 this._view.performSoChi(username, spId - 2, rankChi, exMoney, cardArray, delayCount);
        //                 break;
        //             case 5 : // thang trang 2
        //                 this._view.performSummaryChange(username, winType, exMoney, delayCount);
        //                 break;
        //             case 6 : // hien thi bang ket qua
        //                 this._view.addResultEntry(username, winType, soChiWin, wholeCards, newMoney, moneyChange);
        //                 break;
        //         }
        //     }
        // }
        //
        // delayCount += 2000;
        // this._view.performShowResult(delayCount);
        // this._view.cleanBoard(delayCount += 2000);
    },

    sendXepBaiXong: function (cards) {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("451", {1: cards});
    },

    getMaxSlot: function () {
        return 4;
    },

    onJoinRoom: function (param) {
        var thiz =  this;
        this._super(param);

        var huThuongValue = param["11"]["2"];
        this._view.performChangeRewardFund(huThuongValue);

       // ve lai dang xep hay ko
        var cards = [1,1,1,1,1,
                     1,1,1,1,1,
                     1,1,1];
        var cardArray = [];
        for (var i = 0; i < cards.length; i++) {
            cardArray.push(CardList.prototype.getCardWithId(cards[i]));
        }
        var gameStatus = param["1"];
        this.gameStatus = gameStatus;
        if(gameStatus == 2){
            this._view.showErrorMessage("Bàn đang chơi, vui lòng chờ", this._view);
            var userInfo = param["5"];
            for(var i=0;i<userInfo.length;i++){
                var isSpector = userInfo[i]["2"] ;
                if(!isSpector){
                    var userName = userInfo[i]["u"] ;
                    var slot = thiz._view.getSlotByUsername(userName);
                    slot.cardList.dealCards(cardArray,false,false);
                    var isDone = userInfo[i]["5"] ;
                    if(isDone){
                        slot.cardList.setNameChi(MB_CHI_DAU,"Xếp xong",true);
                    }else{
                        slot.cardList.setNameChi(MB_CHI_DAU,"Đang xếp",false);
                    }

                }
            }
        }


    },

    sendStartRequest: function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("3", null);
    },

    sendXepBaiLai: function () {
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("452", null);
    }
});