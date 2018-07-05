/**
 * Created by VGA10 on 1/19/2017.
 */

var PK_POSITION_TOP = 0;
var PK_POSITION_LEFT = 1;
var PK_POSITION_BOTTOM = 2;
var PK_POSITION_RIGHT = 3;

var PK_TYPE_PLAYER_NOMARL = 0;
var PK_TYPE_PLAYER_DEALER = 1;
var PK_TYPE_PLAYER_SMALLBLIND = 2;
var PK_TYPE_PLAYER_BIGBLIND = 3;

var PK_STATUSME_STANDUP = 0;
var PK_STATUSME_SITDOWN = 1;

var PokerGamePlayer = GamePlayer.extend({
    ctor: function (playerIndex, handler) {
        this._super();
        // cc.Node.prototype.ctor.call(this);
        this.playerIndex = playerIndex;
        this._handler = handler;
        var btnSitDown = new ccui.Button("pk_btn_sitdown.png","","",ccui.Widget.PLIST_TEXTURE);
        var thiz = this;
        btnSitDown.setPosition(thiz.avt.getPosition());
        btnSitDown.visible = false;
        thiz.addChild(btnSitDown);
        this.btnSitDown = btnSitDown;

        var txtBetBg = new ccui.Scale9Sprite("pk_bg_txtbet.png",cc.rect(17,17,2,2));
        txtBetBg.setPosition(0,0);
        txtBetBg.setPreferredSize(cc.size(120,34));
        this.addChild(txtBetBg);
        this.txtBetBg = txtBetBg;

        var lblBet = new cc.LabelTTF("222222",cc.res.font.Roboto_Condensed,24);
        lblBet.setPosition(thiz.avt.getPositionX(), thiz.avt.getPositionY()+100);
        lblBet.setColor(cc.color(255,222,0,255));
        lblBet.visible = true;
        txtBetBg.addChild(lblBet);
        this.lblBet = lblBet;

        var iconBet = new cc.Sprite("#pk_xeng.png");
        iconBet.setPosition(19,17);
        this.iconBet = iconBet;
        txtBetBg.addChild(iconBet);

        var imgDeal = new cc.Sprite("#pk_icon_dealer.png");
        imgDeal.setPosition(thiz.avt.getPositionX(), thiz.avt.getPositionY()+42);
        imgDeal.visible = true;
        thiz.addChild(imgDeal);
        this.imgDeal = imgDeal;

        this.setVisbleSitDown(true);

        var cardList = new CardPoker(cc.size(130, 86));
        cardList.setPosition(thiz.avt.getPosition());

        this.addChild(cardList);
        cardList.setTouchEnable(false);
        this.cardList = cardList;


        var phomVituarl = new cc.Sprite("#pk_cardMask.png");
        phomVituarl.setVisible(false);
        // var phomVituarl = new CardSmall(cc.size(50,25));
        phomVituarl.setPosition(thiz.avt.getPositionX() -20,thiz.avt.getPositionY()-30);
        thiz.addChild(phomVituarl);
        this.phomVituarl = phomVituarl;

        var imgWin =  new cc.Sprite("#pk_bg_win.png");
        imgWin.setPosition(thiz.avt.getPosition());
        imgWin.visible = false;
        thiz.addChild(imgWin,-1);
        this.imgWin = imgWin;
        imgWin.runAction(new cc.RepeatForever(new cc.RotateBy(0.5,360)));
        var bg_nameHand = new ccui.Scale9Sprite("pk_bg_nameHand.png",cc.rect(16,16,2,2));
        bg_nameHand.setContentSize(160,34);
        bg_nameHand.setVisible(false);
        bg_nameHand.setPosition( thiz.avt.getPositionX(),thiz.avt.getPositionY()-55);
        this.addChild(bg_nameHand,2);
        this.bg_nameHand = bg_nameHand;

        var lblHandNomarl = new cc.LabelTTF("",cc.res.font.Roboto_Condensed,23);
        lblHandNomarl.setPosition(bg_nameHand.getContentSize().width/2, bg_nameHand.getContentSize().height/2);
        lblHandNomarl.setColor(cc.color(201,214,237,255));
        bg_nameHand.addChild(lblHandNomarl);
        this.lblHandNomarl = lblHandNomarl;


        var  lblHandWin = new cc.LabelTTF("", cc.res.font.Roboto_CondensedBold,30);
        lblHandWin.setPosition(thiz.avt.getPositionX(),thiz.avt.getPositionY() +55);
        lblHandWin.setColor(cc.color(255,228,0,255));
        this.addChild(lblHandWin,2);
        this.lblHandWin = lblHandWin;

        var bgText = new ccui.Scale9Sprite("dialog-textinput-bg.png",cc.rect(10, 10, 4, 4));
        bgText.setPreferredSize(cc.size(180, 60));
        bgText.setVisible(false);
        bgText.setPosition(thiz.avt.getPosition());
        this.addChild(bgText);
        this.bgText = bgText;
        this.userLabel.removeFromParent();
        var userLabel =  new cc.LabelTTF("",cc.res.font.Roboto_CondensedBold,20);
        this.infoLayer.addChild(userLabel);
        userLabel.setColor(cc.color(191, 242, 255,255));
         this.goldLabel.removeFromParent();
        var goldLabel =  new cc.LabelTTF("",cc.res.font.Roboto_CondensedBold,20);
        this.infoLayer.addChild(goldLabel);
        goldLabel.setColor(cc.color("#ffde00"));
        this.userLabel = userLabel;
        this.goldLabel = goldLabel;

        this.isOwnerSprite.setVisible(false);
        // this.setMoneyBet(1000);
    },
    setIsOwner : function(isOwner){
        this.isOwnerSprite.visible = false;
    },
    getTimeCurrent:function (timeMax) {
     return this.timer2.getPercentage()*timeMax/100;
    },
    setNameHand:function (nameHand,isWin) {

        if(isWin){
            this.lblHandWin.setString(nameHand);
            this.bg_nameHand.setVisible(false);
            this.lblHandNomarl.setString("");
        }else {
            this.lblHandWin.setString("");
            this.bg_nameHand.setVisible(true);
            this.lblHandNomarl.setString(nameHand);
        }

    },
    setIsMe:function (isMe) {
        if(isMe){
            this.cardList.setPosition(this.avt.getPositionX(),this.avt.getPositionY()+100);
            this.txtBetBg.setPosition(this.avt.getPositionX(),this.avt.getPositionY()+ 90+75);
            this.bg_nameHand.setPosition( this.avt.getPositionX(),this.avt.getPositionY()+100-55);
            this.lblHandWin.setPosition(this.avt.getPositionX(),this.avt.getPositionY()+100 +55);
            this.phomVituarl.setVisible(false);
        }else {
            this.cardList.setPosition(this.avt.getPosition());
            this.txtBetBg.setPosition(this.avt.getPositionX(),this.avt.getPositionY()+75);
            this.bg_nameHand.setPosition( this.avt.getPositionX(),this.avt.getPositionY()-55);
            this.lblHandWin.setPosition(this.avt.getPositionX(),this.avt.getPositionY() +55);

        }
    },
    setPositionInfo:function (posBase, posBet,posDel) {
        switch (posBase){
            case PK_POSITION_LEFT:
            {
                this.bgText.setPosition(this.avt.getPositionX() -140,this.avt.getPositionY());
                this.userLabel.setAnchorPoint(1,0.5);
                this.goldLabel.setAnchorPoint(1,0.5);
                this.userLabel.setPosition(this.bgText.getPositionX()+80, this.bgText.getPositionY() + 10);
                this.goldLabel.setPosition(this.bgText.getPositionX()+80, this.bgText.getPositionY() - 10);
                break;
            }
            case PK_POSITION_RIGHT:
            {
                this.bgText.setPosition(this.avt.getPositionX() +140 ,this.avt.getPositionY());
                this.userLabel.setAnchorPoint(0,0.5);
                this.goldLabel.setAnchorPoint(0,0.5);
                this.userLabel.setPosition(this.bgText.getPositionX()-80, this.bgText.getPositionY() + 10);
                this.goldLabel.setPosition(this.bgText.getPositionX()-80, this.bgText.getPositionY() - 10);
                break;
            }
            case PK_POSITION_TOP:
            {
                this.bgText.setPosition(this.avt.getPositionX(),this.avt.getPositionY()+70);
                this.userLabel.setAnchorPoint(0.5,0.5);
                this.goldLabel.setAnchorPoint(0.5,0.5);
                this.userLabel.setPosition(this.bgText.getPositionX(), this.bgText.getPositionY() + 10);
                this.goldLabel.setPosition(this.bgText.getPositionX(), this.bgText.getPositionY() - 10);
                break;
            }
            case PK_POSITION_BOTTOM:
            {
                this.bgText.setPosition(this.avt.getPositionX() ,this.avt.getPositionY() - 65);
                this.userLabel.setAnchorPoint(0.5,0.5);
                this.goldLabel.setAnchorPoint(0.5,0.5);
                this.userLabel.setPosition(this.bgText.getPositionX(), this.bgText.getPositionY() + 10);
                this.goldLabel.setPosition(this.bgText.getPositionX(), this.bgText.getPositionY() - 10);
                break;
            }
        };
        switch (posBet){
            case PK_POSITION_LEFT:{
                this.txtBetBg.setPosition(this.avt.getPositionX()-120,this.avt.getPositionY());
                break;
            }
            case PK_POSITION_RIGHT:{
                this.txtBetBg.setPosition(this.avt.getPositionX()+120,this.avt.getPositionY());
                break;
            }
            case PK_POSITION_TOP:{
                this.txtBetBg.setPosition(this.avt.getPositionX(),this.avt.getPositionY()+75);
                break;
            }
            case PK_POSITION_BOTTOM:{
                this.txtBetBg.setPosition(this.avt.getPositionX(),this.avt.getPositionY()-75);
                break;
            }
        }
        switch (posDel){
            case PK_POSITION_LEFT:{
                this.imgDeal.setPosition(this.avt.getPositionX()-50,this.avt.getPositionY()+20);
                break;
            }
            case PK_POSITION_RIGHT:{
                this.imgDeal.setPosition(this.avt.getPositionX()+50,this.avt.getPositionY()+20);
                break;
            }
            case PK_POSITION_TOP:{
                this.imgDeal.setPosition(this.avt.getPositionX()+50,this.avt.getPositionY()+50);
                break;
            }
            case PK_POSITION_BOTTOM:{
                this.imgDeal.setPosition(this.avt.getPositionX()+50,this.avt.getPositionY()-50);
                break;
            }
        }
    },
    fillInforAgain:function (infor) {
            if(infor.isPlaying )
            {
                if(infor.moneyBet > 0)
                {
                    this.setMoneyBet(infor.moneyBet);
                }
                this.phomVituarl.visible = true;
                this.updateAction(infor.idAction);
            }

    },
    setEnable : function (enable) {
        // this.goldLabel.setString("10.000");
        // this.userLabel.setString("123456789123456");
        // enable = true;
        this._super(enable);
        this.isOwnerSprite.setVisible(false);

        if(enable ){
            if(this.btnSitDown){
                this.btnSitDown.setVisible(false);
            }

        }
        if(!enable ){
            if( this.phomVituarl)
             this.phomVituarl.setVisible(false);
            this.lblBet.setString("");
            this.imgDeal.setVisible(false);
            //this.bgText.setVisible(false);
            this.bg_nameHand.setVisible(false);
            this.lblHandNomarl.setString("");
            this.lblHandWin.setString("");
            this.lblBet.setString("");
            this.txtBetBg.setVisible(false);
            this.cardList.removeAll();
            this.imgWin.setVisible(false);
        }

    },

    setUserNamePoker:function () {
      this.setUsername(this.username);
        this.userLabel.setColor(cc.color(191, 242, 255,255));
    },


    setType: function (type) {

            this.imgDeal.setVisible(true);
            if(type == PK_TYPE_PLAYER_DEALER){
                this.imgDeal.setSpriteFrame("pk_icon_dealer.png");
            }else if (type == PK_TYPE_PLAYER_SMALLBLIND){
                this.imgDeal.setSpriteFrame("pk_icon_smallBlind.png");
            }else if (type == PK_TYPE_PLAYER_BIGBLIND){
                this.imgDeal.setSpriteFrame("pk_icon_bigBlind.png");
            }
            else {
                this.imgDeal.setVisible(false);
            }

    },

    setCardVituarlVisible:function (isVisible) {
        this.phomVituarl.visible = isVisible;
    },
    setMoneyBet:function (moneyBet) {

        var withText = this.lblBet.getContentSize().width + 40;
        if(withText < 120){
            withText = 120;
        }
        this.txtBetBg.setPreferredSize(cc.size(withText,34));
        this.lblBet.setPosition(withText/2 + 11,17);
        this.txtBetBg.setVisible((moneyBet > 0)?true:false);
        this.lblBet.setString(cc.Global.NumberFormat1(moneyBet));
    },
    setInfo : function (info) {
        if(info){
            this.setGold(info.money);
            this.setMoneyBet(info.moneyBet);
            this.setType(info.typePlayer);
            if(info.idAction != PK_ACTION_PLAYER_FOLD && info.isPlaying && PlayerMe.username != this.username){
                this.phomVituarl.setVisible(true);
            }
            this.updateAction(info.idAction)
            this.setMoneyBet(info.moneyBet);

        }
    },

    updateAction:function (idAction) {
      if(idAction == PK_ACTION_PLAYER_CHECK)
      {
          this.userLabel.setString("CHECK");
          this.userLabel.setColor(cc.color(185, 230, 78,255));
      }
      else if(idAction == PK_ACTION_PLAYER_CALL){
          this.userLabel.setString("CALL");
          this.userLabel.setColor(cc.color(255, 174, 70,255));
      }
      else if(idAction == PK_ACTION_PLAYER_FOLD){
          this.userLabel.setString("FOLD");
          this.userLabel.setColor(cc.color(255, 147, 147,255));
      }
      else if(idAction == PK_ACTION_PLAYER_RAISE){
          this.userLabel.setString("RAISE");
          this.userLabel.setColor(cc.color(255, 174, 70,255));
      }
      else if(idAction == PK_ACTION_PLAYER_BET){
          this.userLabel.setString("BET");
          this.userLabel.setColor(cc.color(255, 174, 70,255));
      }
      else if(idAction == PK_ACTION_PLAYER_ALL_IN){

          this.userLabel.setColor(cc.color(255, 222, 0,255));
          this.userLabel.setString("ALL_IN");
      }
      else {
          this.userLabel.setColor(cc.color(191, 242, 255,255));
      }
    },



    // resetPlayView:function () {
    //   this.cardList.removeAll();
    //
    //     this.imgDeal.setVisible(false);
    //     this.imgWin.setVisible(false);
    //     this.lblHandNomarl.setString("");
    //     this.bg_nameHand.setVisible(false);
    //     this.lblHandWin.setString("");
    //     this.txtBetBg.setVisible(false);
    // },

    resetEndGame:function () {
        cc.log("resetEndGame 2");
        this.cardList.removeAll();
        this.lblBet.setString("");
        this.phomVituarl.setVisible(false);
        this.imgWin.setVisible(false);
        this.imgDeal.setVisible(false);
        this.stopTimeRemain();
        this.lblHandNomarl.setString("");
        this.lblHandWin.setString("");
        this.bg_nameHand.setVisible(false);
        this.txtBetBg.setVisible(false);
    },

    setVisbleSitDown:function (isVisible) {
        this.btnSitDown.visible = isVisible ;
        this.inviteBt.visible = !isVisible;
        // this.btnSitDown.visible = false ;
        // this.inviteBt.visible = false;
        // this.avt.visible = true;
    },

    
    setEffectWin:function (isWin) {
        this.imgWin.setVisible(isWin);
    }

});

var Poker = IGameScene.extend({
    timeMaxTurn:20,
    minBuy:0,
    maxBuy:0,
    ctor: function () {
        this._super();
        this.timeMaxTurn = 20;
        this.minBuy = 0;
        this.maxBuy = 0;

        this.stateMe = PK_STATUSME_STANDUP;
        var bgPoker = new cc.Sprite("res/gp_table.png");
        bgPoker.x = cc.winSize.width / 2;
        bgPoker.y = cc.winSize.height / 2;
        bgPoker.setScale(cc.winSize.screenScale);
        this.sceneLayer.addChild(bgPoker);
        this.bgPoker = bgPoker;
        this.initButton();
        this.minBetting = 0;
       // this.bg.removeFromParent(true);

        // var table_bg = new cc.Sprite("res/gp_table_poker.png");
        // table_bg.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        // table_bg.setScale(cc.winSize.screenScale);
        // this.sceneLayer.addChild(table_bg);
        var pad = -150;
        var cardMix = new CardPoker(cc.size(600, 100));
        cardMix.setPosition(this.bgPoker.getContentSize().width / 2, this.bgPoker.getContentSize().height / 2 - 20);
        cardMix.visible = true;
        this.bgPoker.addChild(cardMix);
        this.cardMix = cardMix;

        // cardMix.setAnchorPoint(0,0)

        var bg_pot = new cc.Sprite("#pk_bg_totalBet.png");
        bg_pot.setPosition(bgPoker.getContentSize().width/2,420+ pad);
        bgPoker.addChild(bg_pot,1);
        this.bg_pot = bg_pot;

        var lblPot = new cc.LabelTTF("",cc.res.font.Roboto_CondensedBold,25);
        lblPot.setColor(cc.color(255,222,0,255));
        lblPot.setPosition(bg_pot.getContentSize().width/2 + 15, bg_pot.getContentSize().height/2);
        bg_pot.addChild(lblPot);
        this.lblPot = lblPot;

        var thiz = this;

        var imgCave = new cc.Sprite("#pk_cave.png");
        imgCave.setPosition(bgPoker.getContentSize().width / 2, 590+ pad);
        bgPoker.addChild(imgCave);
        this.imgCave = imgCave;

        var caveBig = new cc.Sprite("#pk_cave_big.png");
        caveBig.setPosition(bgPoker.getContentSize().width / 2, 590+ pad);
        caveBig.runAction(new cc.RepeatForever(
            new cc.Sequence(
                new cc.FadeTo(1,0),
                new cc.FadeTo(0.7,255),
                new cc.DelayTime(0.2),
                new cc.FadeTo(1.2,0),
                new cc.DelayTime(3)
            )
        ));
        bgPoker.addChild(caveBig);

        var caveTextBG =  new cc.Sprite("#pk_bg_caveChat.png");
        caveTextBG.setPosition(cc.p(imgCave.getPositionX()-130,imgCave.getPositionY()+50));
        bgPoker.addChild(caveTextBG,2);
        caveTextBG.setVisible(false);

        var caveText = new cc.LabelTTF("", cc.res.font.Roboto_Condensed,22);
        caveText.setPosition(caveTextBG.getContentSize().width/2, caveTextBG.getContentSize().height/2);
        caveText.setColor(cc.color(102,200,255,255));
        caveTextBG.addChild(caveText);
        this.caveText = caveText;
        this.caveTextBG = caveTextBG;

        this.createHeart();

        var tipBt = new ccui.Button("pk_btn_tip.png", "", "", ccui.Widget.PLIST_TEXTURE);
        tipBt.setPosition(imgCave.getPositionX(), imgCave.getPositionY()-imgCave.getContentSize().height/2);
        tipBt.setVisible(false);
        this.tipBt = tipBt;
        bgPoker.addChild(tipBt);
        tipBt.addClickEventListener(function () {
            thiz._controller.sendTipRequest(thiz.minBetting);
        });

        var bettingPoker = new BettingPoker();
        this.addChild(bettingPoker);
        bettingPoker.setVisible(false);
        bettingPoker.btnConfirm.addClickEventListener(function () {
           thiz.handleButtonCofirm();
        });
        this.bettingPoker = bettingPoker;
        this.bettingPoker.setMinMaxAgain(100,1000);

        var countDown =  new CountDownPoker();
        countDown.setPosition(bgPoker.getContentSize().width/2,420+ pad);
        bgPoker.addChild(countDown,2);
        this.countDown = countDown;

        var vcl = new cc.LabelTTF("Vàng còn lại:", cc.res.font.Roboto_Condensed,24);
        vcl.setPosition(95,20);
        vcl.setColor(cc.color(187,201,255,255));
        this.vcl = vcl;
        this.sceneLayer.addChild(vcl);

        var lblVcl = new cc.LabelTTF("0", cc.res.font.Roboto_Condensed,24);
        lblVcl.setAnchorPoint(cc.p(0,0.5));
        lblVcl.setPosition(160,20);
        lblVcl.setColor(cc.color(255,216,0,255));
        vcl.setVisible(false);
        lblVcl.setVisible(false);
        this.lblVcl = lblVcl;
        this.sceneLayer.addChild(lblVcl);

        // var cardData = [1,2,3,4,5];
        //
         this.runAction(new cc.Sequence(new cc.DelayTime(2), new cc.CallFunc(function () {

        })));

    },

    setGoldRemain:function (isShow,gold) {
        if(isShow){
            this.lblVcl.setVisible(true);
            this.vcl.setVisible(true);
            this.lblVcl.setString(cc.Global.NumberFormat1(parseInt(gold)));
        }
        else{
            this.lblVcl.setVisible(false);
            this.vcl.setVisible(false);
        }
    },
    updateGold: function (username, gold) {

    },
    handleButtonCofirm:function () {
        this.hideAllButton();
        this.bettingPoker.setVisible(false);
        this._controller.sendActionRequest(this.bettingPoker.type,this.bettingPoker.gold);
    },
    setMinMaxSitDown:function (minbuy, maxbuy) {
        this.minBuy = minbuy;
        this.maxBuy = maxbuy;
        this.maxOld = maxbuy;
    },
    resetGame:function (time) {
       this.countDown.startCountDown(time);

    },
    updateMoneyPot:function (moneyPot) {
      this.lblPot.setString(cc.Global.NumberFormat1(moneyPot));
    },

    resetMoneyBetAllSlot:function () {
        for (var i = 0; i < this.allSlot.length; i++) {
            this.allSlot[i].setMoneyBet("");
        }
    },
    updateActionPlayer:function (username, money, moneyEXchang, idAction) {
        this.handleButtons(null);
        var slot = this.getSlotByUsername(username);
        if(slot){
            switch (idAction) {
                case PK_ACTION_PLAYER_BET :
                    SoundPlayer.playSound("pk_chips_bet");
                    break;
                case PK_ACTION_PLAYER_CALL :
                {
                    SoundPlayer.playSound("pk_call");
                    SoundPlayer.playSound("pk_chips_bet");
                }
                    break;
                case PK_ACTION_PLAYER_FOLD :
                    SoundPlayer.playSound("pk_fold");
                    break;
                case PK_ACTION_PLAYER_CHECK :
                    SoundPlayer.playSound("pk_check");
                    break;
                case PK_ACTION_PLAYER_RAISE : {
                    SoundPlayer.playSound("pk_raise");
                    SoundPlayer.playSound("pk_chips_bet");
                }
                    break;
                case PK_ACTION_PLAYER_ALL_IN :
                {
                    SoundPlayer.playSound("pk_allin");
                    SoundPlayer.playSound("pk_chips_bet");
                }
                    break;
            }
        }
        slot.stopTimeRemain();
        if(idAction == PK_ACTION_PLAYER_ALL_IN || idAction == PK_ACTION_PLAYER_CALL || idAction == PK_ACTION_PLAYER_RAISE || idAction == PK_ACTION_PLAYER_NONE|| idAction == PK_ACTION_PLAYER_BET)
        {
            slot.setMoneyBet(money);
            this.runChipBetting(slot);
        }
        else if(idAction == PK_ACTION_PLAYER_FOLD)
        {
            slot.phomVituarl.setVisible(false);

        }

        slot.updateAction(idAction);
    },

    initPlayer: function (numberSlot) {

       if( this.allSlot &&  this.allSlot.length > 0){
            for(var i = 0; i<  this.allSlot.length;i++){
                this.allSlot[i].removeFromParent(true);
            };
           this.allSlot = null;
        }

        this.playerView = [];
        var thiz = this;

        var sizeOrgX = this.bgPoker.getContentSize().width/2;
        var pad = -150;
        if(numberSlot == 5){
            var distanceX = 390;

            var higtRow1 = 170 + pad;
            var higtRow2 = 460+ pad;

            var player1 = new PokerGamePlayer(i, this);
            player1.setPosition(sizeOrgX - distanceX, higtRow1);
            player1.setPositionInfo(PK_POSITION_LEFT,PK_POSITION_RIGHT,PK_POSITION_RIGHT);
            this.bgPoker.addChild(player1, 1);

            var player2 = new PokerGamePlayer(i, this);
            player2.setPosition(sizeOrgX - distanceX, higtRow2);
            player2.setPositionInfo(PK_POSITION_LEFT,PK_POSITION_RIGHT,PK_POSITION_RIGHT);
            this.bgPoker.addChild(player2, 1);

            var player3 = new PokerGamePlayer(i, this);
            player3.setPosition(sizeOrgX + distanceX, higtRow2);
            player3.setPositionInfo(PK_POSITION_RIGHT,PK_POSITION_LEFT,PK_POSITION_LEFT);
            this.bgPoker.addChild(player3, 1);

            var player4 = new PokerGamePlayer(i, this);
            player4.setPosition(sizeOrgX + distanceX, higtRow1);
            player4.setPositionInfo(PK_POSITION_RIGHT,PK_POSITION_LEFT,PK_POSITION_LEFT);
            this.bgPoker.addChild(player4, 1);


            var player0 = new PokerGamePlayer(i, this);
            player0.setPosition(sizeOrgX, 55+ pad);
            player0.setPositionInfo(PK_POSITION_BOTTOM,PK_POSITION_TOP,PK_POSITION_TOP);
            this.bgPoker.addChild(player0, 1);

            this.playerView.push(player0);
            this.playerView.push(player1);
            this.playerView.push(player2);
            this.playerView.push(player3);
            this.playerView.push(player4);
        }
        else{
            var distanceX1 = 224;
            var distanceX2 = 390;
            var distanceX3 = 390;
            var distanceX4 = 165;

            var higtRow1 = 90+ pad;
            var higtRow2 = 220+ pad;
            var higtRow3 = 420+ pad;
            var higtRow4 = 555+ pad;

            var player1 = new PokerGamePlayer(i, this);
            player1.setPosition(sizeOrgX - distanceX1, higtRow1);
            player1.setPositionInfo(PK_POSITION_LEFT,PK_POSITION_RIGHT,PK_POSITION_RIGHT);
            this.bgPoker.addChild(player1, 1);

            var player2 = new PokerGamePlayer(i, this);
            player2.setPosition(sizeOrgX - distanceX2, higtRow2);
            player2.setPositionInfo(PK_POSITION_BOTTOM,PK_POSITION_RIGHT,PK_POSITION_RIGHT);
            this.bgPoker.addChild(player2, 1);

            var player3 = new PokerGamePlayer(i, this);
            player3.setPosition(sizeOrgX - distanceX3, higtRow3);
            player3.setPositionInfo(PK_POSITION_BOTTOM,PK_POSITION_RIGHT,PK_POSITION_RIGHT);
            this.bgPoker.addChild(player3, 1);

            var player4 = new PokerGamePlayer(i, this);
            player4.setPosition(sizeOrgX - distanceX4, higtRow4);
            player4.setPositionInfo(PK_POSITION_LEFT,PK_POSITION_BOTTOM,PK_POSITION_BOTTOM);
            this.bgPoker.addChild(player4, 1);

            var player5 = new PokerGamePlayer(i, this);
            player5.setPosition(sizeOrgX + distanceX4, higtRow4);
            player5.setPositionInfo(PK_POSITION_RIGHT,PK_POSITION_BOTTOM,PK_POSITION_BOTTOM);
            this.bgPoker.addChild(player5, 1);


            var player6 = new PokerGamePlayer(i, this);
            player6.setPosition(sizeOrgX + distanceX3, higtRow3);
            player6.setPositionInfo(PK_POSITION_BOTTOM,PK_POSITION_LEFT,PK_POSITION_LEFT);
            this.bgPoker.addChild(player6, 1);

            var player7 = new PokerGamePlayer(i, this);
            player7.setPosition(sizeOrgX + distanceX2, higtRow2);
            player7.setPositionInfo(PK_POSITION_BOTTOM,PK_POSITION_LEFT,PK_POSITION_LEFT);
            this.bgPoker.addChild(player7, 1);

            var player8 = new PokerGamePlayer(i, this);
            player8.setPosition(sizeOrgX + distanceX1, higtRow1);
            player8.setPositionInfo(PK_POSITION_RIGHT,PK_POSITION_LEFT,PK_POSITION_LEFT);
            this.bgPoker.addChild(player8, 1);


            var player0 = new PokerGamePlayer(i, this);
            player0.setPosition(sizeOrgX, 65+ pad);
            player0.setPositionInfo(PK_POSITION_BOTTOM,PK_POSITION_TOP,PK_POSITION_TOP);
            this.bgPoker.addChild(player0, 1);

            this.playerView.push(player0);
            this.playerView.push(player1);
            this.playerView.push(player2);
            this.playerView.push(player3);
            this.playerView.push(player4);
            this.playerView.push(player5);
            this.playerView.push(player6);
            this.playerView.push(player7);
            this.playerView.push(player8);
        }
        for (var i = 0; i < numberSlot; i++) {
            (function () {
                var idx = i;
                thiz.playerView[i].btnSitDown.addClickEventListener(function (){
                    thiz.showSitDownDialog(idx);
                });
            })();
            // var player = new PokerGamePlayer(i, this);
            // player.setPosition(playerPosition[i]);
            // this.sceneLayer.addChild(player, 1);

        }


    },
    runChipWin:function (slot,money) {

            var to = slot.avt.getParent().convertToWorldSpace(slot.avt.getPosition());
            var from = this.bg_pot.getParent().convertToWorldSpace(this.bg_pot.getPosition());
            this.moveChipWithText(from,to,money);

    },
    runChipBetting:function (slot) {

            var from = slot.avt.getParent().convertToWorldSpace(slot.avt.getPosition());
            var to = slot.iconBet.getParent().convertToWorldSpace(slot.iconBet.getPosition());
            this.move4Chip(from, to);

    },
    takeMoneyFromSlot:function (slot,money) {
        if(slot){
            var from = slot.iconBet.getParent().convertToWorldSpace(slot.iconBet.getPosition());
            var to = this.bg_pot.getParent().convertToWorldSpace(this.bg_pot.getPosition());
            this.moveChipWithText(from,to,money);
        }
    },
    initController: function () {
        this._controller = new PokerController(this);
    },

    initButton: function () {
        var thiz = this;


        var raiseBt = new ccui.Button("pk_btn_raise.png", "", "", ccui.Widget.PLIST_TEXTURE);
        raiseBt.setPosition(1160*cc.winSize.screenScale, 50);
        raiseBt.setScale(cc.winSize.screenScale);
        this.raiseBt = raiseBt;
        this.sceneLayer.addChild(raiseBt);

        var callBt = new ccui.Button("pk_btn_call.png", "", "", ccui.Widget.PLIST_TEXTURE);
        callBt.setPosition(1040*cc.winSize.screenScale, 50);
        callBt.setScale(cc.winSize.screenScale);
        this.callBt = callBt;
        this.sceneLayer.addChild(callBt);

        var checkBt = new ccui.Button("pk_btn_check.png", "", "", ccui.Widget.PLIST_TEXTURE);
        checkBt.setPosition(920*cc.winSize.screenScale, 50);
        checkBt.setScale(cc.winSize.screenScale);
        this.checkBt = checkBt;
        this.sceneLayer.addChild(checkBt);

        var foldBt = new ccui.Button("pk_btn_fold.png", "", "", ccui.Widget.PLIST_TEXTURE);
        foldBt.setPosition(795*cc.winSize.screenScale, 50);
        foldBt.setScale(cc.winSize.screenScale);
        this.foldBt = foldBt;
        this.sceneLayer.addChild(foldBt);

        var allinBt = new ccui.Button("pk_btn_allin.png","","",ccui.Widget.PLIST_TEXTURE);
        allinBt.setPosition(raiseBt.getPosition());
        allinBt.setScale(cc.winSize.screenScale);
        this.allinBt = allinBt;
        this.sceneLayer.addChild(allinBt);

        var betBt = new ccui.Button("pk_btn_Bet.png","","",ccui.Widget.PLIST_TEXTURE);
        betBt.setPosition(raiseBt.getPosition());
        betBt.setScale(cc.winSize.screenScale);
        this.betBt = betBt;
        this.sceneLayer.addChild(betBt);

        betBt.addClickEventListener(function () {
            thiz.bettingPoker.setTypeAgain(PK_ACTION_PLAYER_BET);
            thiz.bettingPoker.setVisible(true);

        });

        allinBt.addClickEventListener(function () {
            thiz._controller.sendActionRequest(PK_ACTION_PLAYER_ALL_IN,0);
        });

        foldBt.addClickEventListener(function () {
            thiz._controller.sendActionRequest(PK_ACTION_PLAYER_FOLD,0);
            thiz.handleButtons(null);
        });

        raiseBt.addClickEventListener(function () {
            thiz.bettingPoker.setTypeAgain(PK_ACTION_PLAYER_RAISE);
            thiz.bettingPoker.setVisible(true);
        });

        callBt.addClickEventListener(function () {
            thiz._controller.sendActionRequest(PK_ACTION_PLAYER_CALL,0);
            thiz.handleButtons(null);
        });

        checkBt.addClickEventListener(function () {
            thiz._controller.sendActionRequest(PK_ACTION_PLAYER_CHECK,0);
            thiz.handleButtons(null);
        });

        this.buttons = [betBt, raiseBt, callBt, checkBt, foldBt,allinBt];
        this.hideAllButton();

        var cbFold = new ccui.CheckBox();
        cbFold.loadTextureBackGround("pk_s_fold.png",ccui.Widget.PLIST_TEXTURE);
        cbFold.loadTextureFrontCross("pk_s_fold_at.png",ccui.Widget.PLIST_TEXTURE);
        cbFold.addEventListener(function () {
             thiz._controller.requestSuggest(PK_SUGGEST_FOLD);
        });
        cbFold.setPosition(foldBt.getPosition());
        cbFold.setScale(cc.winSize.screenScale);

        this.sceneLayer.addChild(cbFold);

        var cbCheck = new ccui.CheckBox();
        cbCheck.loadTextureBackGround("pk_s_check.png",ccui.Widget.PLIST_TEXTURE);
        cbCheck.loadTextureFrontCross("pk_s_check_at.png",ccui.Widget.PLIST_TEXTURE);
        cbCheck.addEventListener(function () {
            thiz._controller.requestSuggest(PK_SUGGEST_CHECK);
        });
        cbCheck.setPosition(checkBt.getPosition());
        cbCheck.setScale(cc.winSize.screenScale);
        this.sceneLayer.addChild(cbCheck);

        var cbChectOrFold = new ccui.CheckBox();
        cbChectOrFold.loadTextureBackGround("pk_s_foldCheck.png",ccui.Widget.PLIST_TEXTURE);
        cbChectOrFold.loadTextureFrontCross("pk_s_foldCheck_at.png",ccui.Widget.PLIST_TEXTURE);
        cbChectOrFold.addEventListener(function () {
            thiz._controller.requestSuggest(PK_SUGGEST_CHECK_FOLD);
        });
        cbChectOrFold.setPosition(callBt.getPosition());
        cbChectOrFold.setScale(cc.winSize.screenScale);
        this.sceneLayer.addChild(cbChectOrFold);


        var cbCallAny = new ccui.CheckBox();
        cbCallAny.loadTextureBackGround("pk_s_call.png",ccui.Widget.PLIST_TEXTURE);
        cbCallAny.loadTextureFrontCross("pk_s_Call_at.png",ccui.Widget.PLIST_TEXTURE);
        cbCallAny.addEventListener(function () {
            thiz._controller.requestSuggest(PK_SUGGEST_CALL);
        });
        cbCallAny.setPosition(raiseBt.getPosition());
        cbCallAny.setScale(cc.winSize.screenScale);
        this.sceneLayer.addChild(cbCallAny);

        this.cbFold = cbFold;
        this.cbCheck = cbCheck;
        this.cbChectOrFold = cbChectOrFold;
        this.cbCallAny = cbCallAny;

        this.checkBoxs = [cbFold, cbCheck, cbChectOrFold, cbCallAny];
         this.hideAllCheckBox();

    },

    handleCheckBox:function (idActive, arrAction) {
        cc.log("handleCheckBox");
        this.hideAllCheckBox();
        this.hideAllButton();
        this.bettingPoker.setVisible(false);

        for(var i = 0; i < arrAction.length; i++)
        {

            if(arrAction[i] == PK_SUGGEST_CHECK_FOLD){
                this.cbChectOrFold.setVisible(true);
                if(idActive == arrAction[i])
                {
                    this.cbChectOrFold.setSelected(true);
                }
            }else  if(arrAction[i] == PK_SUGGEST_CALL){
                this.cbCallAny.setVisible(true);
                if(idActive == arrAction[i])
                {
                    this.cbCallAny.setSelected(true);
                }
            }else  if(arrAction[i] == PK_SUGGEST_FOLD){
                this.cbFold.setVisible(true);
                if(idActive == arrAction[i])
                {
                    this.cbFold.setSelected(true);
                }
            }
            else  if(arrAction[i] == PK_SUGGEST_CHECK){
                this.cbCheck.setVisible(true);
                if(idActive == arrAction[i])
                {
                    this.cbCheck.setSelected(true);
                }
            }

        }
    },

    handleButtons:function(arrAction){
        this.hideAllButton();
        this.hideAllCheckBox();
        this.bettingPoker.setVisible(false);

    if(arrAction != null)
    {
        for(var i = 0; i < arrAction.length; i++)
        {

            if(arrAction[i] == PK_ACTION_PLAYER_RAISE)
            {
                this.raiseBt.setVisible(true);
            }
            else if (arrAction[i] == PK_ACTION_PLAYER_CALL)
            {
                this.callBt.setVisible(true);
            }
            else if (arrAction[i] == PK_ACTION_PLAYER_FOLD)
            {
                this.foldBt.setVisible(true);
            }
            else if (arrAction[i] == PK_ACTION_PLAYER_CHECK)
            {
                this.checkBt.setVisible(true);
            }
            else if (arrAction[i] == PK_ACTION_PLAYER_ALL_IN)
            {
                this.allinBt.setVisible(true);
            }
            else if (arrAction[i] == PK_ACTION_PLAYER_BET)
            {
                this.betBt.setVisible(true);
            }
        }
        if(this.raiseBt.isVisible() || this.betBt.isVisible())
        {
            // isVisiableBet = btnBet.isVisible();
            this.allinBt.setVisible(false);

        }
    }


},
    onUpdateTurn: function (username) {
        // cc.log("updateTurn: " + currentTime + ":" + maxTime + " - " + Date.now());
        for (var i = 0; i < this.allSlot.length; i++) {
            if (this.allSlot[i].username == username) {
                this.allSlot[i].showTimeRemain(this.timeMaxTurn, this.timeMaxTurn);
            }
            else {
                this.allSlot[i].stopTimeRemain();
            }
        }
    },

    setMinBetting:function (minBetting) {
        this.minBetting = minBetting;
    },


    createHeart:function () {
        var heart1 = new cc.Sprite("#pk_heart1.png");
        heart1.setPosition(cc.p(140,110));
        this.imgCave.addChild(heart1);
        heart1.setVisible(false);
        this.heart1 = heart1;
        var heart2 = new cc.Sprite("#pk_heart2.png");
        heart2.setPosition(cc.p(heart1.getContentSize().width/2,heart1.getContentSize().height/2));
        heart1.addChild(heart2,-1);

        var heart3 = new cc.Sprite("#pk_heart3.png");
        heart3.setPosition(cc.p(heart2.getPosition()));
        heart1.addChild(heart3,-2);
        var timeFadeHeart = 0.5;
        heart1.runAction(new cc.RepeatForever(
            new cc.Sequence(
                new cc.CallFunc(function () {
                //    1
                    heart2.runAction(new cc.FadeTo(timeFadeHeart,255));
                }),
                new cc.DelayTime(timeFadeHeart),
                new cc.CallFunc(function () {
                    heart3.runAction(new cc.FadeTo(timeFadeHeart,255));
                }),
                new cc.DelayTime(timeFadeHeart),
                new cc.CallFunc(function () {
                    heart3.runAction(new cc.FadeTo(timeFadeHeart,0));
                }),
                new cc.DelayTime(timeFadeHeart),
                new cc.CallFunc(function () {
                    heart2.runAction(new cc.FadeTo(timeFadeHeart,0));
                }),
                new cc.DelayTime(timeFadeHeart)
            )
        ));
    },

    hideAllButton: function () {
        for (var i = 0; i < this.buttons.length; i++) {
            this.buttons[i].setVisible(false);
        }
    },

    hideAllCheckBox:function () {
        for (var i = 0; i < this.checkBoxs.length; i++) {
            this.checkBoxs[i].setVisible(false);
            this.checkBoxs[i].setSelected(false);
        }
    },

    setTypePlayer: function (username, type) {
        cc.log("username"+ username);
        var  slot  = this.getSlotByUsername(username);
        if(slot)
        {
            cc.log("username" + username+ "==" + type);
            slot.setType(type);
        }
    },
    setTimeRemainOfPlayer:function (userName,timeRemain) {
        var  slot  = this.getSlotByUsername(userName);
        if(slot)
        {
            slot.showTimeRemain(timeRemain, this.timeMaxTurn);
        }
    },
    performDealCards: function (cards, animation) {
        var thiz = this;
        this.allSlot[0].cardList.removeAll();
        var pointCave = this.imgCave.getParent().convertToWorldSpace(this.imgCave.getPosition());
        if(cards.length>0){
            // this.allSlot[0].cardList.dealCards(cards, true,pointCave);
        }
        var m =0;
        for (var j = 0; j < 2; j++) {
            (function () {
                var jNew = j;

                        thiz.runAction(new cc.Sequence(
                            new cc.DelayTime(m*0.5),
                            new cc.CallFunc(function () {
                                if(cards.length>1) {
                                    thiz.allSlot[0].cardList.addCardsPoker(cards[jNew], pointCave);
                                }
                            })

                        ));
                        m++;




            })();



                    for(var k = 0; k< thiz.allSlot.length;k++)
                    {(function () {
                        var kNew = k;
                        if(thiz.allSlot[kNew].username !="" && thiz.allSlot[kNew].username !=PlayerMe.username){
                            thiz.allSlot[kNew].phomVituarl.setVisible(true);

                        }
                    })();
                    }

        // var m =0;
        // for (var j = 0; j < 2; j++) {
        //     (function () {
        //         var jNew = j;
        //         for(var k = 0; k< thiz.allSlot.length;k++)
        //         {(function () {
        //             var kNew = k;
        //             if(thiz.allSlot[kNew].info.isPlaying && PlayerMe.username != allSlot[kNew].username ){
        //                 thiz.runAction(new cc.Sequence(
        //                     new cc.DelayTime(m*0.2),
        //                     new cc.CallFunc(function () {
        //                         thiz.allSlot[kNew].phomVituarl.setVisible(true);
        //                         thiz.allSlot[kNew].phomVituarl.addCard(posCave,jNew);
        //                     })
        //
        //                 ));
        //                 m++;
        //             }
        //         })();
        //         }
        //
        //     })();
        }
        // this.allSlot[0].cardList.addCardReconnect(cards);


    },
    getTimePlayerCurrent:function () {
        var timeInfor = {
            timeRemain: 0,
            username: "",
        };
        for (var i = 0; i < this.allSlot.length; i++) {
            var timeOfPlayer = this.allSlot[i].getTimeCurrent(this.timeMaxTurn);
            if (timeOfPlayer>0){
                timeInfor.username = this.allSlot[i].username;
                timeInfor.timeRemain = timeOfPlayer;
                return timeInfor;
            }
        }
        return timeInfor
    },
    backButtonClickHandler: function () {
        if(this.stateMe ==  PK_STATUSME_STANDUP){
            this._controller.requestQuitRoom();

        }
        else{
            if (this._controller) {
                this._controller.requestStandup();
            }
        }
    },

    updateInviteButton : function () {
        if(this.allSlot[0].username == PlayerMe.username){
            for(var i = 0; i<this.allSlot.length; i++){
                if(this.allSlot[i].username == ""){
                    this.allSlot[i].setVisbleSitDown(false);
                }
            }
        }
        else{
            for(var i = 0; i<this.allSlot.length; i++){
                if(this.allSlot[i].username == ""){
                    this.allSlot[i].setVisbleSitDown(true);
                }
            }
        }
    },
    showSitDownDialog: function (index) {
        var thiz = this;
        if(this.minBuy > PlayerMe.gold)
        {
            // setTimeout(function () {
                // MessageNode.getInstance().show("Bạn không đủ vàng để chơi, vui lòng ra nạp vàng");
                var dialog = new MessageConfirmDialog();
                dialog.setMessage("Bạn không đủ vàng để chơi, vui lòng ra nạp vàng ?");
                dialog.okTitle.setString("Nạp vàng");
                dialog.okButtonHandler = function () {
                    thiz._exitToPayment = true;
                    thiz.backButtonClickHandler();
                    dialog.hide();
                };
                dialog.show(this.popupLayer);
            // }, 2);
        }
        else {
            var isMax = false;
            if(this.maxOld > PlayerMe.gold){
                if(PlayerMe.gold < this.maxOld/2){
                    isMax = true;
                }
                this.maxBuy = PlayerMe.gold;
            }
            var dialog = new PopupSitdown(this.maxBuy,this.minBuy,isMax);

            dialog.okButtonHandler = function () {
                thiz._controller.sendSitDownRequest(index,dialog.getGold(), dialog.cbAutoBuy.isSelected());
                dialog.hide();
            };
            dialog.show(this.popupLayer);
        }
    },
    exitToLobby: function (message) {
        var homeScene = this._super(message);
        if(this._exitToPayment){
            homeScene.paymentButtonHandler();
        }
        return homeScene;
    },
    findSlotSitDown:function () {
        var thiz = this;
        var isCanSit = false;
        for(var z = 0; z < this.allSlot.length; z++ )
        {

            if(this.allSlot[z].username == "")
            {
                //setTimeout(function () {
                    thiz.showSitDownDialog(z);
               // }, 0);
                isCanSit = true;
                break;
        }
        }
        if(!isCanSit)
        {
            this.runAction(new cc.Sequence(new cc.DelayTime(0.1), new cc.CallFunc(function(){
                MessageNode.getInstance().show("Hết ghế để ngồi, vui lòng sang bàn khác hoặc chờ!");
        })));

        };

    },
    move4Chip:function (from, to) {
        // var distance = cc.pDistance(from,to);
        // var timeRun = distance/380;
       var thiz = this;
        for(var i = 0; i < 4; i++ ){
            (function () {
                var a = i;
                var chip = new cc.Sprite("#pk_xeng.png");
                chip.setPosition(from);
                chip.setVisible(true);
                chip.runAction(new cc.Sequence(
                    new cc.DelayTime(0.1*i),
                    new cc.MoveTo(0.5, to),
                    new cc.CallFunc(function () {
                        chip.removeFromParent(true);
                    })
                ));
                thiz.sceneLayer.addChild(chip,10);
            })();

        }

    },
    moveChipWithText:function (from,to, money) {
        var distance = cc.pDistance(from,to);
        var timeRun = distance/380;
        var thiz = this;
                var chip = new cc.Sprite("#pk_xeng.png");
                chip.setPosition(from);
                chip.setVisible(true);
                chip.runAction(new cc.Sequence(
                    // new cc.DelayTime(0.1*i),
                    new cc.MoveTo(timeRun, to),
                    new cc.CallFunc(function () {

                        chip.removeFromParent(true);
                    })
                ));
                thiz.sceneLayer.addChild(chip,10);

            var lblMoney = new cc.LabelTTF("+" + money, cc.res.font.Roboto_CondensedBold,25);
            lblMoney.setAnchorPoint(0.0,0.5);
            lblMoney.setColor(cc.color(255,222,0,255));
            lblMoney.setPosition(from.x+30,from.y);
            // lblMoney.enableOutline(cc.color(0,0,0,255),1);
            this.sceneLayer.addChild(lblMoney,10);
            lblMoney.runAction(new cc.Sequence(
                new cc.MoveTo(timeRun,cc.p(to.x+30,to.y)),
                new cc.CallFunc(function () {
                    lblMoney.removeFromParent(true);
                })
            ));

    },
    playerTip:function(username,money){
        var slot = this.getSlotByUsername(username);
        if(slot){
            var thiz = this;
            var from = slot.avt.getParent().convertToWorldSpace(slot.avt.getPosition());
            var to = this.imgCave.getParent().convertToWorldSpace(cc.p(this.imgCave.getPositionX(),this.imgCave.getPositionY()-40));
            var timeRun = cc.pDistance(from,to)/500;
            var chip = new cc.Sprite("#pk_xeng.png");
            chip.setPosition(from);
            chip.setVisible(true);
            chip.runAction(new cc.Sequence(
                new cc.MoveTo(timeRun, to),
                new cc.CallFunc(function () {
                    chip.removeFromParent(true);
                    thiz.setTextTip(username);
                })
            ));
            this.heart1.setVisible(true);
            this.sceneLayer.addChild(chip,10);
            var lblMoney = new cc.LabelTTF( money, cc.res.font.Roboto_Condensed,20);
            lblMoney.setAnchorPoint(0.5,0.5);
            lblMoney.setColor(cc.color(255,222,0,255));
            lblMoney.setOpacity(255);
            lblMoney.setVisible(false);
            lblMoney.setPosition(this.imgCave.getPositionX(),this.imgCave.getPositionY() - 50);
            this.bgPoker.addChild(lblMoney,10);
            lblMoney.runAction(new cc.Sequence(
                new cc.DelayTime(timeRun),
                new cc.CallFunc(function () {
                    lblMoney.setVisible(true);
                    lblMoney.runAction(new cc.MoveTo(0.7,cc.p(thiz.imgCave.getPositionX(),thiz.imgCave.getPositionY() )));
                    lblMoney.runAction(new cc.FadeTo(0.7,100));
                }),
                new cc.DelayTime(1.2),
                // new cc.MoveTo(timeRun,cc.p(to.x,to.y-40)),
                new cc.CallFunc(function () {
                    lblMoney.removeFromParent(true);
                    thiz.heart1.setVisible(false);
                })
            ));


        }
    },
    setTextTip:function (name) {
        this.caveTextBG.setVisible(true);
        var thiz = this;
        if (name.length > 15)
            name = name.substring(0, 15) ;
        if (name.length > 3 )
            name = name.substring(0, name.length - 3) + "***";

        var txtTip = "    Thanks,\n" + name;
        this.caveText.setString(txtTip);
        this.caveTextBG.stopAllActions();
        this.caveTextBG.runAction(new cc.Sequence(
            new cc.DelayTime(2.5),
            new cc.CallFunc(function () {
                thiz.caveTextBG.setVisible(false);
            })
        ));
    }
});

var CountDownPoker = cc.Node.extend({
    ctor:function (){
        this._super();
        this._timeCount = 0;
        var bg_CountDown =  new cc.Sprite("#pk_bg_countDown.png");
        this.addChild(bg_CountDown);
        bg_CountDown.setVisible(false);
        var icon_gold = new cc.Sprite("#pk_numBuy.png");
        icon_gold.setPosition(150,bg_CountDown.getContentSize().height/2);
        bg_CountDown.addChild(icon_gold);

        icon_gold.runAction(new cc.RepeatForever(new cc.RotateBy(1,360) ));

        var _txtCountDown = new cc.LabelTTF("adsfasdfsdfsadfsa", cc.res.font.Roboto_CondensedBold, 25);
        _txtCountDown.setColor(cc.color(255,222,0,255));
        _txtCountDown.setPosition(bg_CountDown.getContentSize().width/2 + 30,bg_CountDown.getContentSize().height/2);
        this._txtCountDown =  _txtCountDown;
        bg_CountDown.addChild(_txtCountDown,1);

        this.bg_CountDown = bg_CountDown;
    },
    startCountDown:function (time) {
        this._timeCount = time;
        this.scheduleUpdate();
        this.bg_CountDown.setVisible(true);
    },
    stopCountDown:function () {
        this.unscheduleUpdate();
        this.bg_CountDown.setVisible(false);
    },
    update : function (dt) {
        this._timeCount -= dt;
        if(this._timeCount < 0){
            this._timeCount = 0;
            this.bg_CountDown.setVisible(false);
        }
        this._txtCountDown.setString("Chờ ván mới bắt đầu (" + Math.floor(this._timeCount)  +"s)");
    }

});
// popup ngồi xuống
var PopupSitdown = Dialog.extend({
    ctor:function (maxBuy,minBuy, isMax) {
        this._super();
        this.title.setString("ĐỔI CHIP VÀO BÀN");
        this.initWithSize(cc.size(750, 500));

        var thiz = this;
        var lblMoney = new cc.LabelTTF("0",cc.res.font.Roboto_Condensed,30);
        lblMoney.setPosition(this.getContentSize().width/2, this.getContentSize().height/2 + 100);
        lblMoney.setColor(cc.color(255,255,0,255));
        this.addChild(lblMoney);
        this.lblMoney = lblMoney;

        var slider = new ccui.Slider("pk_pg_slider.png","",ccui.Widget.PLIST_TEXTURE);
        slider.loadSlidBallTextureNormal("pk_numBuy.png",ccui.Widget.PLIST_TEXTURE);
        slider.loadProgressBarTexture("bg_trong.png",ccui.Widget.PLIST_TEXTURE);
        slider.setPosition(this.getContentSize().width/2,this.getContentSize().height/2);
        slider.percent = (isMax)?100:50;
        var maxGold = maxBuy - minBuy;

        slider.addEventListener(function (selector, target) {
            if(target == ccui.Slider.EVENT_PERCENT_CHANGED){
                cc.log("persent:" + slider.percent);
                thiz.gold =  Math.floor(slider.percent*maxGold/100) + minBuy;
                thiz.lblMoney.setString(cc.Global.NumberFormat1(thiz.gold));
            }

        });

        this.addChild(slider);

        this.gold =  Math.floor(slider.percent*maxGold/100) + minBuy;
        thiz.lblMoney.setString(cc.Global.NumberFormat1(this.gold));

        var rightBut = new ccui.Button("pk_plus.png","","",ccui.Widget.PLIST_TEXTURE);
        rightBut.setPosition(this.getContentSize().width/2 + 300 ,this.getContentSize().height/2);
        this.addChild(rightBut);

        var leftBut = new ccui.Button("pk_minus.png","","",ccui.Widget.PLIST_TEXTURE);
        leftBut.setPosition(this.getContentSize().width/2-300, this.getContentSize().height/2);
        this.addChild(leftBut);

        var lblAuto = new cc.LabelTTF("Tự động đổi khi hết chip",cc.res.font.Roboto_Condensed,24);
        lblAuto.setColor(cc.color(119,203,238,255));
        lblAuto.setAnchorPoint(0,0.5);
        lblAuto.setPosition(400,280);
        this.addChild(lblAuto);

        var cbAutoBuy = new ccui.CheckBox();
        cbAutoBuy.loadTextureBackGround("home-checkBox.png",ccui.Widget.PLIST_TEXTURE);
        cbAutoBuy.loadTextureFrontCross("home-checkCross.png",ccui.Widget.PLIST_TEXTURE);
        cbAutoBuy.setSelected(true);
        cbAutoBuy.setPosition(370,280);
        this.addChild(cbAutoBuy);
        this.cbAutoBuy = cbAutoBuy;

        rightBut.addClickEventListener(function () {
            var percentCurr = slider.percent + 10;
            if(percentCurr > 100)
            {
                percentCurr = 100;
            }
            slider.percent = percentCurr;
            this.gold =  Math.floor(slider.percent*maxGold/100) + minBuy;
            thiz.lblMoney.setString(cc.Global.NumberFormat1(this.gold));
        });

        leftBut.addClickEventListener(function () {
            var percentCurr = slider.percent - 10;
            if(percentCurr < 0)
            {
                percentCurr = 0;
            }
            slider.percent = percentCurr;
            this.gold =  Math.floor(slider.percent*maxGold/100) + minBuy;
            thiz.lblMoney.setString(cc.Global.NumberFormat1(this.gold));
        });

        this.cancelButtonHandler = function () {
          thiz.hide();
        };
        this.cancelTitle.setString("Hủy");
        this.okTitle.setString("Đồng ý");
        this.cancelTitle.setScale(1.3);
        this.okTitle.setScale(1.3);
    },
    getGold:function () {
        return this.gold;
    }
});

//popup đăt cược
var BettingPoker = cc.Node.extend({
    minBuy:0,
    maxBuy:0,
    type:PK_ACTION_PLAYER_BET,
    ctor : function () {
        this._super();
        var bg = new cc.Sprite("#pk_bg_betting.png");
        bg.setAnchorPoint(1,0);
        bg.setPosition(cc.winSize.width,0);
        this.addChild(bg);
        this.mTouch = cc.rect(cc.winSize.width - bg.getContentSize().width,0,bg.getContentSize().width,bg.getContentSize().height);

        var slider = new ccui.Slider("pk_bg_slider.png","",ccui.Widget.PLIST_TEXTURE);
        slider.loadSlidBallTextureNormal("pk-slider-ball.png",ccui.Widget.PLIST_TEXTURE);
        slider.loadProgressBarTexture("bg_trong.png",ccui.Widget.PLIST_TEXTURE);
        slider.setRotation(-90);
        slider.setPosition(bg.getContentSize().width/2,bg.getContentSize().height/2+10);
        this.slider = slider;
        bg.addChild(slider);


        var lblGold = new cc.LabelTTF("100",cc.res.font.Roboto_CondensedBold,25);
        lblGold.setColor(cc.color(251,192,1,255));
        lblGold.setPosition(bg.getContentSize().width/2,655);
        bg.addChild(lblGold);
        this.lblGold = lblGold;

        var allIn = new cc.Sprite("#tg_allin.png");
        allIn.setPosition(lblGold.getPosition());
        bg.addChild(allIn);
        allIn.setVisible(false);
        this.allIn = allIn;

        var btnConfirm = new ccui.Button("pk_btn_conFirm.png","","",ccui.Widget.PLIST_TEXTURE);
        btnConfirm.setPosition(bg.getContentSize().width/2,54);
        bg.addChild(btnConfirm);



        var imgGold = new cc.Sprite("#pk_bg_slider_gold.png");
        var hightClip = imgGold.getContentSize().height;
        this.hightClip = hightClip;
        var clipping = new ccui.Layout();
        clipping.setContentSize(cc.size(130,0));
        clipping.setClippingEnabled(true);
        clipping.setClippingType(ccui.Layout.CLIPPING_SCISSOR);
        clipping.setPosition(bg.getContentSize().width/2 + 29,127);
        imgGold.setPosition(imgGold.getContentSize().width/2 - 10, imgGold.getContentSize().height/2);
        clipping.addChild(imgGold);
        bg.addChild(clipping);
        this.clipping = clipping;
        var  thiz = this;



        slider.percent = 0;
        this.gold =  this.minBuy;
        thiz.lblGold.setString(cc.Global.NumberFormat1(this.gold));


        slider.addEventListener(function (selector, target) {
            if(target == ccui.Slider.EVENT_PERCENT_CHANGED){
                var leng = thiz.slider.percent / 100 * thiz.hightClip ;
                thiz.clipping.setContentSize(cc.rect(0,0,50,leng));

                thiz.gold =  Math.floor(slider.percent*(thiz.maxBuy - thiz.minBuy)/100) + thiz.minBuy;
                thiz.lblGold.setString(cc.Global.NumberFormat1(thiz.gold));
                thiz.allIn.setVisible((thiz.slider.percent<100)?false:true);
                thiz.type = (thiz.slider.percent<100)?thiz.typeOld:PK_ACTION_PLAYER_ALL_IN;
                thiz.lblGold.setVisible(!thiz.allIn.isVisible());

            }

        });
        this.btnConfirm = btnConfirm;
    },

    setMinMaxAgain:function (minBuy,maxBuy) {
        this.maxBuy = maxBuy;
        this.minBuy = minBuy;
        this.gold =  minBuy;
        this.lblGold.setString(cc.Global.NumberFormat1(this.gold));
        this.slider.percent = 0;
        this.clipping.setContentSize(cc.size(130,0));
    },
    setTypeAgain:function (type) {
        this.type = type;
        this.typeOld = type;
    },
    onEnter : function () {
        this._super();

        var thiz = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan : function (touch, event) {
                if(!thiz.isVisible())
                {
                    return false;
                }

                var p = thiz.convertToNodeSpace(touch.getLocation());
                if(!cc.rectContainsPoint(thiz.mTouch, p)){
                    thiz.setVisible(false);
                }
                return true;
            },
            // onTouchEnded : function (touch, event) {
            //     var p = thiz.convertToNodeSpace(touch.getLocation());
            //     if(!cc.rectContainsPoint(thiz.mTouch, p)){
            //         thiz.hide();
            //     }
            // }
        }, this);
    }
});

var CardEx = Card.extend({
    ctor: function (rank, suit) {
        this._super(rank, suit);
        var thiz = this;

        var borderSprite = new cc.Sprite("#boder_vang.png");
        borderSprite.setScale(0.95);
        borderSprite.setVisible(false);
        borderSprite.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2);
        this.addChild(borderSprite);
        this.borderSprite = borderSprite;

        var cardblack =  new  cc.Sprite("#card-black.png");
        cardblack.setOpacity(100);
        cardblack.setScale(1.05);
        cardblack.setVisible(false);
        cardblack.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2);
        this.addChild(cardblack);
        this.cardblack = cardblack;
    },
});

var CardSmall = cc.Node.extend({
   ctor:function (size) {
       this._super();
       this.setContentSize(size);
       this.setAnchorPoint(cc.p(0.5, 0.5));
   },
   addCard:function (from, index) {
       if(index == 0)
       {
           this.removeAllChildren(true);
       }
       var card = new cc.Sprite("#gp_card_up.png");
       this.addChild(card);
       card.setPosition(this.convertToNodeSpace(from));
       var x = this.getContentSize().width / 2 -index*5;
       var y = this.getContentSize().height / 2;
       card.setScale(this.getContentSize().height / card.getContentSize().height);
       if(index==0)
       {
           card.setRotation(15);
       }
       var moveAction = new cc.MoveTo(0.2, cc.p(x, y));
       card.stopActionByTag(100);
       moveAction.setTag(100);
       card.runAction(moveAction);
   },
    addCardReconnect:function () {
       this.removeAll();
       for(var  i = 0;  i < 2;i++)
       {
           var card = new cc.Sprite("#gp_card_up.png");
           this.addChild(card);

           var x = this.getContentSize().width / 2 -i*5;
           var y = this.getContentSize().height / 2;
           card.setPosition(cc.p(x, y));
           card.setScale(this.getContentSize().height / card.getContentSize().height);
           if(index==0)
           {
               card.setRotation(15);
           }

       }

    },
    removeAll: function () {
        this.removeAllChildren(true);
    },
    setVisible:function (isVisible) {
        this._super(isVisible);
        // if(isVisible)
    }

});

var CardPoker = cc.Node.extend({
    ctor: function (size) {
        this.canTouch = false;

        this._super();
        this.cardList = [];
        this.setContentSize(size);
        this.setAnchorPoint(cc.p(0.5, 0.5));
    },
    addCardsPoker: function (cardID, from) {

        var cardAdd = new CardEx(cardID.rank, cardID.suit);
        cardAdd.setPosition(this.convertToNodeSpace(from));
        cardAdd.setSpriteFrame("gp_card_up.png");
        this.addCard(cardAdd);
        var width = this.cardSize.width * this.cardList.length;
        if (width > this.getContentSize().width) {
            width = this.getContentSize().width;
        }
        var dx = width / this.cardList.length + 7;
        var x = this.getContentSize().width / 2 - width / 2 + dx / 2;
        var y = this.getContentSize().height / 2;
        for (var i = 0; i < this.cardList.length; i++) {
            this.reorderChild(this.cardList[i], i);
            var card = this.cardList[i];
            card.origin = cc.p(x, y);
            card.cardDistance = dx;
            var moveAction = new cc.MoveTo(0.2, cc.p(x, y));
            card.stopActionByTag(100);
            moveAction.setTag(100);
            card.runAction(moveAction);
            x += dx;
        }
        var originScale = cardAdd.getScale();
        var changeSprite = new cc.CallFunc(function () {
            cardAdd.setSpriteFrame( cardID.rank + s_card_suit[cardID.suit] + ".png");
        });
        var scale1 = new cc.ScaleTo(0.2,0,originScale);
        var scale2 = new cc.ScaleTo(0.2,originScale,originScale);
        cardAdd.runAction(new cc.Sequence(
            new cc.DelayTime(0.5),
            scale1,changeSprite,scale2
        ));
    },
    reOrder: function (isAnimation) {
        if (this.cardList.length > 0) {
            var width = this.cardSize.width * this.cardList.length;
            if (width > this.getContentSize().width) {
                width = this.getContentSize().width;
            }
            var dx = width / this.cardList.length + 7;
            var x = this.getContentSize().width / 2 - width / 2 + dx / 2;
            var y = this.getContentSize().height / 2;
            for (var i = 0; i < this.cardList.length; i++) {
                var card = this.cardList[i];
                card.origin = cc.p(x, y);
                card.cardIndex = i;
                card.cardDistance = dx;
                this.reorderChild(card, i);
                if(isAnimation)
                {
                    card.moveToOriginPosition();
                }else {
                    card.setPosition(card.origin);
                }

                x += dx;
            }
        }
    },
    addCardsPokerEndGame: function (cards) {

        var  thiz = this;
        this.removeAll();
        for (var j = 0; j < cards.length; j++) {
            var card = new CardEx(cards[j].rank, cards[j].suit);
            card.setSpriteFrame("gp_card_up.png");

            this.addCard(card);
        }

        var width = this.cardSize.width * this.cardList.length;
        if (width > this.getContentSize().width) {
            width = this.getContentSize().width;
        }
        var dx = width / this.cardList.length + 4;
        var x = this.getContentSize().width / 2 - width / 2 + dx / 2;
        var y = this.getContentSize().height / 2;
        for (var i = 0; i < this.cardList.length; i++) {
            this.reorderChild(this.cardList[i], i);
            (function () {
                var card = thiz.cardList[i];
                card.origin = cc.p(x, y);
                card.cardDistance = dx;
                card.setPosition(x, y);
                x += dx;
                var originScale = card.getScale();
                var changeSprite = new cc.CallFunc(function () {
                    cc.log("c=+++++++++++++++"+ card.rank + s_card_suit[card.suit] + ".png");
                    card.setSpriteFrame( card.rank + s_card_suit[card.suit] + ".png");
                });
                var scale1 = new cc.ScaleTo(0.2,0,originScale);
                var scale2 = new cc.ScaleTo(0.2,originScale,originScale);
                card.runAction(new cc.Sequence(
                    new cc.DelayTime(0.1*i),
                    scale1,changeSprite,scale2
                ));
            })();

        }


    },
    addCard: function (card) {
        if (!this.cardSize) {
            this.cardSize = card.getContentSize();
            if (this.cardSize.height > this.getContentSize().height) {
                var ratio = this.getContentSize().height / this.cardSize.height;
                this.cardSize.width *= ratio;
                this.cardSize.height *= ratio;
            }
        }
        if (card.getContentSize().height > this.cardSize.height) {
            card.setScale(this.cardSize.height / card.getContentSize().height);
        }
        card.cardIndex = this.cardList.length;
        //card.origin = cc.p(0, 0);
        card.canTouch = this.canTouch;
        this.addChild(card, this.cardList.length);
        this.cardList.push(card);
    },
    addCardReconnect: function (cardId) {
        for (var i = 0; i < cardId.length; i++) {
            var card = new CardEx(cardId[i].rank, cardId[i].suit);
            this.addCard(card);
        }
        this.reOrder(false);
    },
    dealCards: function (cards, animation,posCave) {
        this.removeAll();
        for (var i = 0; i < cards.length; i++) {
            var card = new CardEx(cards[i].rank, cards[i].suit);
            if (animation) {
                card.setPosition(this.convertToNodeSpace(posCave));
            }

            this.addCard(card);
        }

        var width = this.cardSize.width * this.cardList.length;
        if (width > this.getContentSize().width) {
            width = this.getContentSize().width;
        }
        var dx = width / this.cardList.length+4;
        var x = this.getContentSize().width / 2 - width / 2 + dx / 2;
        var y = this.getContentSize().height / 2;
        for (var i = 0; i < this.cardList.length; i++) {
            this.reorderChild(this.cardList[i], i);
            var card = this.cardList[i];
            card.origin = cc.p(x, y);
            card.cardDistance = dx;
            if (animation) {
                card.visible = false;
                var delayAction = new cc.DelayTime(0.02 * i);
                var beforeAction = new cc.CallFunc(function (target) {
                    target.visible = true;
                }, card);
                var moveAction = new cc.MoveTo(0.2, cc.p(x, y));
                var soundAction = new cc.CallFunc(function () {
                    SoundPlayer.playSound("chia_bai");
                });
                card.runAction(new cc.Sequence(delayAction, soundAction, beforeAction, moveAction));
            }
            else {
                card.setPosition(x, y);
            }

            x += dx;
        }
    },
    onEnter: function () {
        this._super();
        this.deckPoint = this.convertToNodeSpace(cc.p(cc.winSize.width / 2, cc.winSize.height / 2));
    },
    setTouchEnable: function (touch) {
        this.canTouch = touch;
        for (var i = 0; i < this.cardList.length; i++) {
            this.cardList[i].canTouch = this.canTouch;
        }
    },
    removeAll: function () {
        this.removeAllChildren(true);
        this.cardList = [];
    },
    showBoderCards:function (cards) {
        var thiz = this;
        (function () {
            for(var i = 0; i< thiz.cardList.length;i++){
                var card = thiz.cardList[i];
                card.borderSprite.setVisible(false);
                for(var  j= 0; j< cards.length; j++){
                    if(cards[j].rank ==  card.rank && cards[j].suit == card.suit ){
                        card.borderSprite.setVisible(true);
                        break;
                    }
                }
            }
        })();

    },
    showCardBlack:function (cards) {
        var thiz = this;
        (function () {
            for(var i = 0; i< thiz.cardList.length;i++){
                var card = thiz.cardList[i];
                card.cardblack.setVisible(true);
                for(var  j= 0; j< cards.length; j++){
                    if(cards[j].rank ==  card.rank && cards[j].suit == card.suit ){
                        card.cardblack.setVisible(false);
                        break;
                    }
                }
            }
        })();


    }
});