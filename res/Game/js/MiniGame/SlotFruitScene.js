/**
 * Created by QuyetNguyen on 12/20/2016.
 */
//var s_ChanLeLayer = null;

var TuyenItem = cc.Sprite.extend({

    ctor: function () {
        this._super("#slot_fruit_7.png");
        this.moveSpeed =  1500.0;
        var y1 = 500;//ban dau
        var y3 = -100;//cuoi
        var y2 = 30; //biendo*2
        this.y1 = y1;
        this.y2 = y2;
        this.y3 = y3;
        this.setPosition(100,y1);
        var s = Math.abs(y1 - y3) + y2*2 ;
        this.timeElapsed = 0.0;
        this.acceleration = -(this.moveSpeed*this.moveSpeed) / (s*2);
        this.maxTime = s*2 / this.moveSpeed;
        this.isRun = false;



        var scale1 = new cc.ScaleTo(0.2,1,1) ;
        var scale2 = new cc.ScaleTo(0.2,0,1) ;
        var scale3 = new cc.ScaleTo(0.2,-1,1) ;
        var scale4 = new cc.ScaleTo(0.2,0,1) ;
        var scale5 = new cc.ScaleTo(0.2,1,1) ;
        this.runAction(new cc.RepeatForever(new cc.Sequence(scale1,scale2,scale3,scale4,scale5)));

    },

    update:function (dt) {
        // if(this.isRun){
        //     this.timeElapsed += dt;
        //     if(this.timeElapsed >= this.maxTime){
        //         this.timeElapsed = this.maxTime;
        //         this.isRun = false;
        //
        //     }
        //     var y = this.y2  + this.moveSpeed*this.timeElapsed + (this.acceleration*this.timeElapsed*this.timeElapsed)/2;
        //     cc.log("aaa "+ y);
        //     var yNew = this.y1 + this.y2 -y;
        //     if(yNew < this.y3 - this.y2){
        //         yNew = 2*(this.y3 - this.y2)  -yNew;
        //     }
        //     this.setPosition(this.x,yNew);
        // }
    },

    onEnter : function () {
        this._super();
        this.scheduleUpdate();
    },
    onExit: function () {
        this._super();
        this.unscheduleUpdate();
    },

});
var ItemFruit = SlotItem.extend({
    ctor: function (idItem) {
        this._super();
        var withMay = 690;
        this.itemWidth = withMay/5;
        this.disHCell = 127;
        this.setContentSize(cc.size(this.itemWidth,this.disHCell));

        var num = "#slot_fruit_"+ idItem.toString()+".png";
        var spriteHoaQua = new cc.Sprite(num);
        spriteHoaQua.setPosition(cc.p(this.itemWidth/2,this.disHCell/2));
        spriteHoaQua.setVisible(true);
        this.addChild(spriteHoaQua);
        this.spriteHoaQua = spriteHoaQua;


        var slot_bg_win = new cc.Sprite("#slot_bg_win.png");
        slot_bg_win.setPosition(cc.p(this.itemWidth/2,this.disHCell/2));
        slot_bg_win.setVisible(false);
        this.addChild(slot_bg_win,-1);
        this.slot_bg_win = slot_bg_win;

        slot_bg_win.runAction(new cc.RepeatForever(
            new cc.Sequence(
                new cc.FadeTo(0.3,100),
                new cc.FadeTo(0.3,255)
            )
        ));


        var bg = new cc.Sprite("#slot_bg_item.png");
        bg.setPosition(cc.p(this.itemWidth/2,this.disHCell/2));
        bg.setVisible(false);
        this.bg = bg;
        this.addChild(bg,-2);
    },
    setWin:function (isWin,isLigth) {
        this.slot_bg_win.setVisible(isLigth);
        this.bg.setVisible(isWin);
    }
});
var SlotFruit = SlotLayer.extend({
    ctor: function () {
        this._super();
        this.nodeSlot.setContentSize(cc.size(792,418));
        this.arrResuft = [];
    },
    newItem:function (idItem) {
        return new ItemFruit(idItem);
    },
    showLineWin:function (line,mask) {

        for(var i = 0; i <  this.arrResuft.length; i++)
        {
            var isWin = false;
            var isLight = false;
           for(var j = 0; j < LINE_SLOT[line].length; j++){
               if(i == LINE_SLOT[line][j]){
                   isLight = ((mask >> j) & 1);
                   isWin = true;
                   // break;
               }
           }
            this.arrResuft[i].setWin(isWin,isLight);
            this.arrResuft[i].spriteHoaQua.setOpacity(isWin?255:150);
        }

    },
    initRandom:function () {
        this.clearAll();
        for (var i = 0; i < 5; i++) { // cot

            var subItem = [];
            for (var j = 0 ; j < 4; j++) { // hang
                var randomItem = Math.floor(Math.random()*6);
                var item = this.newItem(randomItem);
                item.createItem(i,j,0);
                item.isRunning = false;
                this.nodeSlot.addChild(item);

                subItem.push(item);

            }
            this.arrItems.push(subItem);
        }
    },
    clearAllItemInLine:function () {

        for(var i = 0; i <  this.arrResuft.length; i++)
        {

            this.arrResuft[i].setWin(false,false);
            this.arrResuft[i].spriteHoaQua.setOpacity(255);
        }

    }

});

var POS_BUT_DUP = [{x: 267, y: 166},    {x: 733, y: 166},      {x: 787, y: 310},{x: 681, y: 310},{x: 316, y: 310},{x: 212, y: 310}];
var POS_LAL_DUP = [{x: 267, y: 166},    {x: 733, y: 166},      {x: 787, y: 234},{x: 681, y: 234},{x: 316, y: 234},{x: 212, y: 234}];
var IMG_BUT_DUP = ["slot_x2_btn_do.png","slot_x2_btn_den.png", "slot_x2_x4t.png","slot_x2_x4b.png", "slot_x2_x4r.png", "slot_x2_x4c.png"];
var ID_BONUS = [5,6, 3,4, 2, 1];
var SelectLine =  cc.Node.extend({
    ctor:function () {
        this._super();
        var thiz = this;
        var dialogBg = new ccui.Scale9Sprite("dialog-bg.png", cc.rect(120,186,4,4));
        dialogBg.setPreferredSize(cc.size(1000,823));
        dialogBg.setAnchorPoint(cc.p(0,0));
        dialogBg.setPosition((cc.winSize.width - 1060)/2 , (cc.winSize.height-823)/2);

        var closeButton = new ccui.Button("dialog-button-close.png","","", ccui.Widget.PLIST_TEXTURE);
        closeButton.setPosition(cc.p(870,700));
        closeButton.addClickEventListener(function () {
            thiz.setLineSend();
        });


        this.addChild(dialogBg);
        dialogBg.addChild(closeButton);

        var nodeLine = new ccui.Widget();
        nodeLine.setContentSize(cc.size(700, 440));
        nodeLine.setPosition(1060/2,823/2);
        dialogBg.addChild(nodeLine)
        this.arrLine = [];
        this.arrNumLine = [];
        for(var i = 0; i < 20; i++){
            (function () {
                var xP =  40+ 140*(i%5) ;
                var yP =  80+ 110*Math.floor(i/5);
                var bg = new ccui.Button("slot_sl_bg.png", "", "", ccui.Widget.PLIST_TEXTURE);

                // var bg = new cc.Sprite("#slot_sl_bg.png");
                var lol = (3-Math.floor(i/5))*5;
                var num = lol + i%5;

                var bg_num = new cc.Sprite("#slot_sl_bg_num.png");
                bg_num.setPosition(bg.getContentSize().width/2, -20);
                bg.addChild(bg_num);

                var line = new cc.Sprite("#slot_sl_"+(num+1).toString() +".png");
                line.setTag(2);
                line.setPosition(bg.getContentSize().width/2, bg.getContentSize().height/2);
                bg.addChild(line);
                thiz.arrNumLine.push(num+1);
                var lbl = new cc.LabelTTF((num+1).toString(), cc.res.font.Roboto_CondensedBold,16);
                lbl.setColor(cc.color(111,133,168));
                bg_num.setTag(1);
                lbl.setPosition(bg_num.getContentSize().width/2, bg_num.getContentSize().height/2);
                bg_num.addChild(lbl);

                nodeLine.addChild(bg);
                bg.setPosition(cc.p(xP,yP));
                bg.addClickEventListener(function () {
                    thiz.handleClickLine(num);
                });
                thiz.arrLine.push({"line":bg,"isActive":true,"id":num});
            })();



        }
        var okChan = s_Dialog_Create_Button1(cc.size(122, 50), "CHẴN");
        dialogBg.addChild(okChan);
        okChan.addClickEventListener(function () {
            for(var i = 0; i < thiz.arrLine.length; i++){
                thiz.setActiveBt(thiz.arrLine[i],(thiz.arrLine[i]["id"]%2 == 0)?false:true);
            }

        });
        okChan.setPosition(222,150);

        var okLe = s_Dialog_Create_Button1(cc.size(122, 50), "LẺ");
        okLe.addClickEventListener(function () {
            for(var i = 0; i < thiz.arrLine.length; i++){
                thiz.setActiveBt(thiz.arrLine[i],(thiz.arrLine[i]["id"]%2 == 0)?true:false);
            }
        });
        dialogBg.addChild(okLe);
        okLe.setPosition(364,150);

        var okAll = s_Dialog_Create_Button1(cc.size(122, 50), "TẤT CẢ");
        dialogBg.addChild(okAll);
        okAll.addClickEventListener(function () {
            for(var i = 0; i < thiz.arrLine.length; i++){
                thiz.setActiveBt(thiz.arrLine[i],true);
            }
        });
        okAll.setPosition(505,150);


        var okDone = s_Dialog_Create_Button1(cc.size(122, 50), "XONG");
        dialogBg.addChild(okDone);
        okDone.addClickEventListener(function () {
            thiz.setLineSend();
        });
        okDone.setPosition(784,150);
          this.initView();
    },

    setLineReconnect:function (arrLineSeLect) {

        for(var j = 0; j < this.arrLine.length; j++){
               var isActive = false;
               for(var i = 0; i < arrLineSeLect.length; i++){
                 if(this.arrLine[j]["id"] == arrLineSeLect[i]-1){
                     isActive = true;
                    break;
                 }
                }
               this.setActiveBt(this.arrLine[j],isActive);
        }
        var thiz = this;
        this.arrNumLine = [];
        for(var i = 0; i < this.arrLine.length; i++){
            if(this.arrLine[i]["isActive"]){
                this.arrNumLine.push(this.arrLine[i]["id"]+1);
            }
        }
        // if(thiz._lineReconnect){
        //     thiz._lineReconnect();
        // }
    },
    setLineSend:function () {
        var thiz = this;
        this.arrNumLine = [];
        for(var i = 0; i < this.arrLine.length; i++){
            if(this.arrLine[i]["isActive"]){
                this.arrNumLine.push(this.arrLine[i]["id"]+1);
            }
        }
        this.setVisible(false);
        if(thiz._lineClickHandler){
            thiz._lineClickHandler();
        }
    },
    initView:function () {
        var thiz = this;
        this.mTouch = cc.rect(cc.winSize.width/2 - (800/2)*cc.winSize.screenScale,cc.winSize.height/2 - (623/2)*cc.winSize.screenScale ,800,623);
        var layerBlack = new cc.LayerColor(cc.color(0,0,0,127),cc.winSize.width,cc.winSize.height);
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
                    thiz.setLineSend();
                    // thiz.setVisible(false);
                    // thiz.removeFromParent(true);
                }
                return true;
            },
        }, this);
        this.addChild(layerBlack,-1);


    },
    getLines:function () {
        return this.arrNumLine;
    },
    setActiveBt : function(btnClick,enabled){
        btnClick["line"].setOpacity(enabled?255:80);
        // btnClick["line"].setEnabled(enabled);
        btnClick["line"].getChildByTag(1).setOpacity(enabled?255:80);
        btnClick["line"].getChildByTag(2).setOpacity(enabled?255:80);
        btnClick["isActive"] = enabled;
    },
    handleClickLine:function (num) {
        cc.log(num);
        var thiz = this;
        var numLineActive = 0;
        var btnClick = null;
        for(var i = 0; i < this.arrLine.length; i++){
            if(this.arrLine[i]["isActive"]){
                numLineActive++;
            }
            if(this.arrLine[i]["id"] == num){
                btnClick = this.arrLine[i];
            }
        }
        if(numLineActive>1){
            this.setActiveBt(btnClick,!btnClick["isActive"]);
            if(thiz._clickOneLine){
                thiz._clickOneLine(num,btnClick["isActive"]);
            }
        }else{

            // MessageNode.getInstance().show("Bạn phải chọn ít nhất 1 line!");
            if(thiz._clickOneLine){
                thiz._clickOneLine(num,true);
            }
            this.setActiveBt(btnClick,true);
        }

    }
});
var CardBobus = TrashCardOnTable.extend({
    ctor: function (width_Phom, height_Phom, typeArrange) {

        this._super(width_Phom, height_Phom, typeArrange);
    },

    addCard: function (card, noAnimation) {
        var oldParent = card.getParent();
        card.retain();
        if(oldParent){
            var p = oldParent.convertToWorldSpace(card.getPosition());
            card.removeFromParent(true);
        }
        else{
            var p = card.getPosition();
        }
        var newP = this.convertToNodeSpace(p);
        card.setPosition(newP);
        this.addChild(card);
        card.release();

        var animationDuration = 0.1;

        if (!this.cardSize)
            this.cardSize = card.getContentSize();

        card.canTouch = false;
        this.cardList.push(card);
        card.setScale(this.height_Phom / this.cardSize.height);
        // card.runAction(new cc.ScaleTo(0.1,this.height_Phom / this.cardSize.height));
        // var moveAction = new cc.MoveTo(animationDuration, this.getNewPostionCard(this.cardList.length - 1));

        // var thiz = this;
        // var delay = new cc.DelayTime(animationDuration);
        // var orderAgain = new cc.CallFunc(function () {
        //     thiz.reOrder(noAnimation);
        // });

        // thiz.runAction(new cc.Sequence(delay, orderAgain));
        this.reOrder(noAnimation);
    },
    removeCardFirst: function () {
        var retVal = this.cardList[0];
        retVal.removeFromParent(true);
        this.cardList.splice(0, 1);
        this.reOrder(false);
    },

});

var DuplicateGold =  cc.Node.extend({
   ctor:function () {
       this._super();
       this.initView();
       this.enableTouchZ = true;
   },
    initView:function () {
        var thiz = this;
        this.mTouch = cc.rect(cc.winSize.width/2 - (905/2)*cc.winSize.screenScale,cc.winSize.height/2 - (464/2)*cc.winSize.screenScale ,905,464);
        var layerBlack = new cc.LayerColor(cc.color(0,0,0,127),cc.winSize.width,cc.winSize.height);
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
                    // thiz.removeFromParent(true);
                }
                return true;
            },
        }, this);
        this.addChild(layerBlack);
        var bg = new ccui.Scale9Sprite("slot_bg_x2.png",cc.rect(113,113,4,4));
        bg.setPreferredSize(cc.size(995,754));
        bg.setScale(cc.winSize.screenScale);
        bg.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        this.bg = bg;
        this.addChild(bg);
        var lbl = new cc.LabelTTF("Đoán màu cây bài để X2 hoặc chất cây bài để X4 tiền thắng. \n                        Chọn nhận thưởng để dừng chơi.",cc.res.font.Roboto_Condensed,24);
        lbl.setPosition(500,529);
        bg.addChild(lbl);
        this.arrButtonBonus = [];
        this.arrLabelBonus = [];
        for(var i = 0; i < 6; i++){
            (function () {
                var iNew = i;
                var btnX = new ccui.Button(IMG_BUT_DUP[i], "", "", ccui.Widget.PLIST_TEXTURE);
                btnX.setPosition(POS_BUT_DUP[i]);
                btnX.addClickEventListener(function () {
                    thiz.handelBonusClick(iNew);
                });

                bg.addChild(btnX);


                thiz.arrButtonBonus.push(btnX);

                var lbl = new cc.LabelTTF("80",cc.res.font.Roboto_CondensedBold,24);
                lbl.setPosition(POS_LAL_DUP[i]);
                lbl.setColor(cc.color(255,222,0));
                bg.addChild(lbl);
                thiz.arrLabelBonus.push(lbl);

            })();

        }

        var btnClose = new ccui.Button("slot_close.png","","",ccui.Widget.PLIST_TEXTURE)
        btnClose.addClickEventListener(function () {
            thiz.setVisible(false);
        });
        btnClose.setPosition(877,636);
        bg.addChild(btnClose);

        var wgGive = new ccui.Widget();
        wgGive.setContentSize(cc.size(130,130));
        wgGive.setTouchEnabled(true);
        wgGive.setPosition(877,636);
        bg.addChild(wgGive);
        thiz.wgGive = wgGive;

        var btnGive = new cc.Sprite("#slot_btn_nt2.png");
        btnGive.setPosition(65,65);
        wgGive.addTouchEventListener(function (target,event) {
            if(event == ccui.Widget.TOUCH_ENDED){
              cc.log("touch here");
                thiz.setVisible(false);
                if(thiz._handeGiveClick()){
                    thiz._handeGiveClick();
                }
            } ;
            if(event == ccui.Widget.TOUCH_BEGAN)
            {
                btnGive.runAction(new cc.ScaleTo(0.2,1.1));
            }else{
                btnGive.stopAllActions();
                btnGive.runAction(new cc.ScaleTo(0.2,1));
            }
        });

        wgGive.addChild(btnGive);

        var bg_give = new ccui.Scale9Sprite("slot_x2_bg_money.png",cc.rect(10,10,4,4));
        bg_give.setPreferredSize(cc.size(380,50));
        bg_give.setPosition(500, 601);
        bg.addChild(bg_give);

        var lblMoney = new cc.LabelTTF("10.000",cc.res.font.Roboto_CondensedBold,30);
        lblMoney.setColor(cc.color(255,222,0));
        lblMoney.setPosition(190,25);
        bg_give.addChild(lblMoney);
        this.lblMoney = lblMoney;

        var bg_card = new ccui.Scale9Sprite("slot_bg_card.png",cc.rect(40,40,4,4));
        bg_card.setPreferredSize(cc.size(180,230));
        bg.addChild(bg_card);
        bg_card.setPosition(500,255);

        var cardDefualt = new cc.Sprite("#slot_cardup.png");
        cardDefualt.setPosition(500,255);
        bg.addChild(cardDefualt);
        this.cardDefualt = cardDefualt;




        var cardUp = new cc.Sprite("#slot_cardup.png");
        cardUp.setPosition(cardDefualt.getPosition());
        bg.addChild(cardUp);




        cardUp.setVisible(false);
        this.cardUp = cardUp;
        var scale1 = new cc.ScaleTo(0.5, 0.0, 1);
        var scale2 = new cc.ScaleTo(0.5, 1, 1);
        cardUp.runAction(new cc.RepeatForever( new cc.Sequence(scale1, scale2)));
        var bgTrash = new ccui.Scale9Sprite("bg_card_trash.png", cc.rect(10, 10, 4, 4));
        bgTrash.setPreferredSize(cc.size(680, 90));
        bgTrash.setPosition(500,440);
        bg.addChild(bgTrash);

        var cards = [1,2,2,2,2,1,2,2,2,2,1,2,2,2,2,1,2,2,2,2,1,2,2,2,2];
        var trashCards = new CardBobus(660,80,POSITION_PHOM_LEFT);
        // for (var j = 0; j < cards.length; j++) {
        //     var card = CardList.prototype.getCardWithId(cards[j]);
        //     trashCards.addCard(new Card(card.rank, card.suit),true);
        // }
        this.trashCards = trashCards;
        trashCards.setPosition(cc.p(680/2,5));
        bgTrash.addChild(trashCards);

    },
    setVisibleArrButton:function (isVisble) {
        for(var  i = 0; i < this.arrButtonBonus.length; i++)
            this.setActiveBt(this.arrButtonBonus[i],isVisble);
             this.enableTouchZ = isVisble;
    },

    setMoneyLabel:function (moneyWin) {
        //
            for(var i = 0; i < this.arrLabelBonus.length; i++){
                if(moneyWin != "0") {

                    var zzz = parseInt(moneyWin) * 4;
                    if (i == 0 || i == 1) {
                        zzz = parseInt(moneyWin) * 2;
                    }
                    if(this.arrLabelBonus[i].getString() == ""){
                        this.arrLabelBonus[i].setString("0");
                    }
                    var action = new quyetnd.ActionNumber(0.4, zzz);
                    this.arrLabelBonus[i].runAction(action);
                }
                else {
                    this.arrLabelBonus[i].setString("");
                }
            }
        // }

    },

    handelResuft:function (idCard,type,moneyWin) {
        var thiz = this;
        this.setCard(idCard) ;
        thiz.typezzz = type;
        this.lblMoney.runAction(new cc.Sequence(new cc.DelayTime(0.0),
        new cc.CallFunc(function () {

            if(type == 3){
                thiz.wgGive.setVisible(false);
                thiz.lblMoney.setString("Chúc bạn may mắn lần sau!");
                thiz.lblMoney.setColor(cc.color(255,255,255,255));
            }
            else {
                var action = new quyetnd.ActionNumber(0.3, parseInt(moneyWin));
                thiz.lblMoney.runAction(action);

                thiz.lblMoney.setColor(cc.color(255,222,0,255));
                // var goldMini = new  cc.ParticleSystem("res/SelectCard.plist");
                // goldMini.setPosition(cc.p(670, 621));
                // thiz.addChild(goldMini);
            }
              thiz.setMoneyLabel(moneyWin);

        }
        ),
            new cc.DelayTime(0.5),
            new cc.CallFunc(function () {
                thiz.setVisibleArrButton(thiz.typezzz!=3);
            })
        ));

        // setTimeout(function () {
        //
        // }, 0.4);


    },
    setMoney:function (moneyWin) {
        this.lblMoney.setString(cc.Global.NumberFormat1(parseInt(moneyWin)));
        this.lblMoney.setColor(cc.color(255,222,0,255));
        // this.bg.removeChildByTag(7);

        this.setMoneyLabel(moneyWin);

        this.cardUp.setVisible(false);
        this.cardDefualt.setVisible(true);
        // this.enableTouchZ = true;
        this.setVisibleArrButton(true);

    },
    setCard:function (idCard) {
        var thiz = this;
        this.cardUp.setVisible(false);
        var dataCard = CardList.prototype.getCardWithId(idCard);
        var cardNew = new Card(dataCard.rank, dataCard.suit);
        cardNew.setSpriteFrame("gp_card_up2.png");
        cardNew.canTouch = false;
        cardNew.setPosition(this.cardUp.getPosition());
        cardNew.setTag(7);
        var orgScale = this.cardDefualt.getContentSize().height/cardNew.getContentSize().height + 0.1;

        cardNew.setScale(orgScale);
        this.bg.addChild(cardNew,1);
        var nameCard = dataCard.rank + s_card_suit[dataCard.suit] + ".png";
        var changeFrame = new cc.CallFunc(function () {
            cardNew.setSpriteFrame(nameCard);
        });
        var scale1 = new cc.ScaleTo(0.2,0,orgScale) ;
        var scale2 = new cc.ScaleTo(0.2,orgScale,orgScale) ;
        cardNew.runAction(new cc.Sequence(scale1,changeFrame,scale2));

        thiz.runAction(new cc.Sequence(new cc.DelayTime(1),
            new cc.CallFunc(function () {

                if(thiz.trashCards.cardList.length>19){
                    thiz.trashCards.removeCardFirst();
                }
                thiz.cardDefualt.setVisible(true);
                thiz.trashCards.addCard(cardNew,false);

             })

        ));



    },
    handelBonusClick:function (i) {
        if(!this.enableTouchZ)
        {
            return;
        }
        // var goldMini = new  cc.ParticleSystem("res/ring2.plist");
        // goldMini.setPosition(cc.p(POS_BUT_DUP[i].x,POS_BUT_DUP[i].y));
        if(i!=5 && i!=0){
            // goldMini.setPosition(cc.p(POS_BUT_DUP[i].x,POS_BUT_DUP[i].y+20));
        }
        // this.bg.addChild(goldMini);

        this.setVisibleArrButton(false);
        this.cardDefualt.setVisible(false);
        this.cardUp.setVisible(false);//here
        var card = this.bg.getChildByTag(7);

        if(this._clickButHandler){
            this._clickButHandler(ID_BONUS[i]);
        }
    },
    show:function () {
        this.setVisible(true);
        this.wgGive.setVisible(true);


    },
    setActiveBt : function(btn,enabled){
        btn.setBright(enabled);
        btn.setEnabled(enabled);
    }
});

var NumberSlot  = ccui.Button.extend({
    ctor:function (s) {
        this._super("slot_bg_number2.png", "", "", ccui.Widget.PLIST_TEXTURE);
        var lblBel = new cc.LabelTTF(s, cc.res.font.Roboto_CondensedBold,18);
        lblBel.setColor(cc.color(95,115,217));
        lblBel.setPosition(cc.p(this.getContentSize().width/2, this.getContentSize().height/2));
        this.addChild(lblBel);
        this.lblBel = lblBel;

    },
    visibleNew:function (isVisible) {
        this.loadTextureNormal( (isVisible)?"slot_bg_number1.png":"slot_bg_number2.png",ccui.Widget.PLIST_TEXTURE) ;
        this.lblBel.setColor((isVisible)?cc.color(255,222,0):cc.color(95,115,217));
    },
});


var CoinNode = cc.Node.extend({
    ctor : function () {
        this._scaleStart = 0.5;
        this._scaleDelta = 0.1;

        this._scaleEnd = 0.7;
        this._scaleEndDelta = 0.4;

        this._rotateStart = -15.0;
        this._rotateDelta = 30.0;

        this._forceStart = 900.0;
        this._forceDelta = 700.0;

        this._torqueStart = -8.0;
        this._torqueDelta = 16.0;

        this._timeStart = 2.0;
        this._timeDelta = 1.0;

        // this._startPosition = cc.p(cc.winSize.width/2, cc.winSize.height+100);
        // this._startPositionDelta = cc.p(cc.winSize.width-300, 80);

        this._startPosition = cc.p(cc.winSize.width/2, cc.winSize.height/2);
        this._startPositionDelta = cc.p(100, 10);

        this._super();
        this._initPhysics();
        this.addAllCoin();
    },
    _initPhysics:function() {
        this.space = new cp.Space();
        this.space.gravity = cp.v(0, -2000);
        this.space.sleepTimeThreshold = 0.5;

        var floorShape = new cp.SegmentShape(this.space.staticBody, cp.v(0, 0), cp.v(cc.winSize.width*2, 0), 0);
        floorShape.setElasticity(1.2);
        floorShape.setFriction(1);
        floorShape.setLayers(~0);
        this.space.addStaticShape(floorShape);

        // debug
        // this._debugNode = new cc.PhysicsDebugNode(this.space);
        // this.addChild( this._debugNode, 1);

    },
    _addCoin : function () {

        var startScale = this._scaleStart + (Math.random() * this._scaleDelta);
        var endScale = this._scaleEnd + (Math.random() * this._scaleEndDelta);

        var force = this._forceStart + (Math.random() * this._forceDelta);
        var rotate = this._rotateStart + (Math.random() * this._rotateDelta);
        var torque = this._torqueStart + (Math.random() * this._torqueDelta);

        var dongshit =100- Math.random()*200;

        var forceVector = cc.pRotateByAngle(cc.p(dongshit, force), cc.p(0,0), cc.degreesToRadians(rotate));

        var time = this._timeStart + (Math.random() * this._timeDelta);
        var x = this._startPosition.x + (-this._startPositionDelta.x + Math.random() * this._startPositionDelta.x * 2);
        var y = this._startPosition.y + (-this._startPositionDelta.y + Math.random() * this._startPositionDelta.y * 2);

        var coin = new CoinSprite(this.space);
        coin.setPosition(x, y);
        coin.setScale(startScale);
        coin._force = cp.v(forceVector.x, forceVector.y);
        coin._torque = torque;

        coin.setScale(0.4+Math.random()*0.6);

        this.addChild(coin);
        coin.startWithDuration(time, endScale);


    },
    addAllCoin : function () {
        this.removeAllChildren();
        var n = 150 + Math.floor(Math.random()* 20);
        // var ran = Math.random()*1.5;
        var thiz = this;
        for(var i=0; i<n ;i++){
            // this.runAction(new cc.Sequence(new cc.DelayTime(ran),new cc.CallFunc(function () {
                thiz._addCoin();
            // })))

        }

        var thiz = this;
        var maxTime = this._timeStart + this._timeDelta + 5.0;
        this.runAction(new cc.Sequence(
            new cc.DelayTime(maxTime),
            new cc.CallFunc(function () {
                thiz.removeFromParent(true);
            })
        ));
    },
    update : function (dt) {
        this.space.step(dt);
    },

    onEnter : function () {
        this._super();
        this.scheduleUpdate();
    },

    onExit : function () {
        this._super();
        this.unscheduleUpdate();
    },
    show : function () {
        var runningScene = cc.director.getRunningScene();
        runningScene.addChild(this, 1000);
    }
});

var LINE_SLOT = [[1,4,7,10,13], [2,5,8,11,14],[0,3,6,9,12],[1,4,8,10,13],[1,4,6,10,13],
                [2,3,8,9,14],[0,5,6,11,12],[1,5,6,11,13],[2,5,7,11,14],[0,3,7,9,12],
                [1,3,7,11,13],[1,5,7,9,13],[0,4,8,10,12],[2,4,6,10,14],[0,3,7,11,14],
                [2,4,7,10,14],[1,5,8,11,13],[1,3,6,9,13],[0,4,7,10,12],[2,5,7,9,12]];

var ARR_BET_SLOT = [100,1000,10000];
var SlotFruitScene = IScene.extend({
    ctor: function () {
        this._super();
        this.isHaveData = true;
        this.isAutoRotate = false;
        var bg = new cc.Sprite("res/game-bg.jpg");
        bg.x = cc.winSize.width / 2;
        bg.y = cc.winSize.height / 2;
        this.sceneLayer.addChild(bg);

        this.initView();
        this.setTextHuThuong("1000000");
        this.setTextBet("10.000");
        this.setTextWin("");
        this.initController();
        this.runAction(new cc.Sequence(new cc.DelayTime(0), new cc.CallFunc(function () {
        LoadingDialog.getInstance().show("Loading...");
        })));
        this._controller.sendJoinGame();
        this.enableAutoRotate(false);
        // this.onBigwin();

    },

    initView:function () {

        var thiz = this;
        var bgSlot =  new cc.Sprite("res/slot_bg.png");
        bgSlot.x = cc.winSize.width / 2;
        bgSlot.y = cc.winSize.height / 2;
        this.sceneLayer.addChild(bgSlot);
        this.bgSlot = bgSlot;

        var slotfui = new SlotFruit();
        slotfui.setPosition(cc.p(157,145));
        bgSlot.addChild(slotfui);
        var thiz = this;
        slotfui._finishedHandler = function () {
            thiz.onFinishQuay();
        };
        this.slotfui = slotfui;
        var btnQuay = new ccui.Button("slot_btnRotate.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnQuay.setPosition(cc.p(925,80));
        bgSlot.addChild(btnQuay);
        this.btnQuay = btnQuay;

        btnQuay.addClickEventListener(function () {
            thiz.enableAutoRotate(false);
            thiz.rotateRequest();
        });


        var btnGive = new ccui.Button("slot_btn_nt1.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnGive.setPosition(cc.p(925,80));
        bgSlot.addChild(btnGive);
        btnGive.setVisible(false);
        this.btnGive = btnGive;

        btnGive.addClickEventListener(function () {
            if(thiz.nodeBigWin != undefined && thiz.nodeBigWin != null){
                thiz.nodeBigWin.removeFromParent(true);
                thiz.nodeBigWin = null;
            }
            thiz.enableAutoRotate(false);
            thiz.btnX2.setVisible(false);
            btnGive.setVisible(false);
            thiz._controller.sendGiveGold();



        });

        var btnStop = new ccui.Button("slot_btn_stop.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnStop.setPosition(cc.p(925,80));
        bgSlot.addChild(btnStop);
        btnStop.setVisible(false);
        this.btnStop = btnStop;

        btnStop.addClickEventListener(function () {
            thiz.handelStopButton();
        });


        var btnAuto = new ccui.Button("slot_btnAuto.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnAuto.setPosition(cc.p(804,80));
        bgSlot.addChild(btnAuto);
        this.btnAuto = btnAuto;
        this.isAutoRotate = false;
        btnAuto.addClickEventListener(function () {
            thiz.clickAutoQuay();
        });

        var slot_chambi = new cc.Sprite("#slot_chambi.png");
        slot_chambi.setPosition(btnAuto.getPosition());
        slot_chambi.runAction(new cc.RepeatForever(
            new cc.RotateBy(1,360)));
        this.slot_chambi = slot_chambi;
        bgSlot.addChild(slot_chambi);

        var btn20Row = new ccui.Button("slot_btn_row.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btn20Row.setPosition(cc.p(200,65));
        bgSlot.addChild(btn20Row);
        var lblRowNumber = new cc.LabelTTF("20", cc.res.font.Roboto_CondensedBold, 24);
        lblRowNumber.setPosition(btn20Row.getContentSize().width/2,btn20Row.getContentSize().height/2+15);
        btn20Row.addChild(lblRowNumber);

        this.btn20Row = btn20Row;

        this.lblRowNumber = lblRowNumber;

        var lblDong = new cc.LabelTTF("DÒNG", cc.res.font.Roboto_CondensedBold, 24);
        lblDong.setPosition(btn20Row.getContentSize().width/2,btn20Row.getContentSize().height/2-15);
        btn20Row.addChild(lblDong);

        btn20Row.addClickEventListener(function () {
            thiz.selectLine.setVisible(true);
            thiz.enableAutoRotate(false);

        });

        this.initLabel();

        var btnX2 = new ccui.Button("slot_btnX2.png", "", "", ccui.Widget.PLIST_TEXTURE);
        btnX2.setPosition(cc.p(1060,150));
        bgSlot.addChild(btnX2);
        btnX2.setVisible(false);
        this.btnX2 = btnX2;

        var slot_btnx2_bg = new cc.Sprite("#slot_btnx2_bg.png");
        slot_btnx2_bg.setPosition(cc.p(btnX2.getContentSize().width/2,btnX2.getContentSize().height/2));
        btnX2.addChild(slot_btnx2_bg);
        slot_btnx2_bg.runAction(new cc.RepeatForever(
            new cc.Sequence(
                new cc.FadeTo(0.5,30),
                new cc.FadeTo(0.5,255)
            )
        ));

        btnX2.addClickEventListener(function () {
            if(thiz.nodeBigWin != undefined && thiz.nodeBigWin != null){
                thiz.nodeBigWin.removeFromParent(true);
                thiz.nodeBigWin = null;
            }
            thiz.dup.show(true);
            thiz.enableAutoRotate(false);
        });

        this.initTopBar();

        this.initLine();
        var dup = new DuplicateGold();
        thiz.addChild(dup,3);
        this.dup = dup;
        dup._clickButHandler = function (i) {
            cc.log(i);
            thiz._controller.sendBonus(i);
        };
        dup._handeGiveClick = function () {
            thiz._controller.sendGiveGold();
        };
        dup.setVisible(false);

        var selectLine = new SelectLine();
        this.addChild(selectLine);
        selectLine._lineClickHandler = function () {
            thiz.stopAllActions();
            thiz.clearAllLine();
            thiz.onSetTextBet();

            for(var i = 0; i < thiz.arrNum.length; i++){
                thiz.arrNum[i].visibleNew(false);
            }
            var lines = selectLine.getLines();
            for(var i = 0; i < lines.length; i++){
                    thiz.arrNum[lines[i]-1].visibleNew(true);

            }

        };
        // selectLine._lineReconnect = function () {
        //     thiz.onSetTextBet();
        // },
        selectLine._clickOneLine = function (line,isShow) {
            thiz.arrNum[line].visibleNew(isShow);
        };
        selectLine.setVisible(false);
        this.selectLine = selectLine;
        this.initBetButtons();
        var playerMe = new GamePlayerMe();
        playerMe.setPosition(150, 50.0);
        this.addChild(playerMe, 1);
        this.playerMe =  playerMe;

        var lblMoneyLine =  new cc.LabelBMFont("",  "res/fonts/Roboto_GoldSlot.fnt");
        lblMoneyLine.setPosition(thiz.bgSlot.getContentSize().width/2,thiz.bgSlot.getContentSize().height/2-15);
        thiz.bgSlot.addChild(lblMoneyLine);
        this.lblMoneyLine = lblMoneyLine;



    },
    enableAutoRotate:function (isEnable) {
        // this.setActiveBt(this.btnAuto,!isEnable);
        this.isAutoRotate = isEnable;
        this.slot_chambi.setVisible(isEnable);


    },
    rotateRequest:function () {
        if(this.nodeBigWin != undefined && this.nodeBigWin != null){
            this.nodeBigWin.removeFromParent(true);
            this.nodeBigWin = null;
        }
        this.lblMoneyLine.stopAllActions();
        this.lblMoneyLine.setString("");
        this.activeButtonNewGame(false);
        this.isHaveData = false;
        this.slotfui.rotate();
        this.clearLineDraw();
        this.stopAllActions();
        this._controller.sendRouteRequest(this.indexBet+1,this.selectLine.getLines());
    },
    initLine:function () {
        this.arrLine = [];
        for(var i = 0; i< 20;i++){
            var line = new cc.Sprite("#slot_line" + (i+1).toString()+ ".png");
            line.setPosition(cc.p(line.getContentSize().width/2,line.getContentSize().height/2));
            line.setVisible(false);
            this.bgSlot.addChild(line);
            this.arrLine.push(line);
        }
        this.arrNum = [];
        for(var i = 0; i < 20; i++){
            var buttonNumer = new NumberSlot((i+1).toString());
            buttonNumer.setPosition(cc.p((i%2==0)?85:925,535 - Math.floor(i/2)*41));
            this.bgSlot.addChild(buttonNumer);
            this.arrNum.push(buttonNumer);
            buttonNumer.visibleNew(true);
        }
    },

    setTextHuThuong:function (value) {

        this.lblHu.stopAllActions();
        this.txtHu.setString("Hũ thưởng  "+ value);
        var a = this.txtHu.getContentSize().width/2;
        this.txtHu.setString("Hũ thưởng");
        var posX =  290/2 - (a - this.txtHu.getContentSize().width);
        // this.lblHu.setString(value);
        var zz =  parseInt(value);
        var yy = parseInt(this.lblHu.getString().replace(/[.,]/g,''));
        if(yy != zz)
        {
            var action = new quyetnd.ActionNumber(0.3,zz);
            this.lblHu.runAction(action);
        }

        this.txtHu.setPosition(posX,this.txtHu.getPositionY());
        this.lblHu.setPosition(posX+4,this.txtHu.getPositionY());
    },
    setTextBet:function (value) {
        this.lblBet.setString("Tổng Cược: "+ value);
        var posX =  225/2 - (this.lblBet.getContentSize().width/2 - this.txtBet.getContentSize().width);
        this.lblBet.setString(value);
        this.txtBet.setPosition(posX,this.txtBet.getPositionY());
        this.lblBet.setPosition(posX+2,this.txtBet.getPositionY());
    },
    setTextWin:function (value) {
        this.lblWin.setString("Thắng: "+ value);
        var posX =  220/2 - (this.lblWin.getContentSize().width/2 - this.txtWin.getContentSize().width);
        this.lblWin.setString(value);
        this.txtWin.setPosition(posX,this.txtWin.getPositionY());
        this.lblWin.setPosition(posX+2,this.txtWin.getPositionY());
    },
    onNhanThuong:function () {
        this.setTextWin("0");
        var thiz = this;
        var from = this.lblWin.getParent().convertToWorldSpace(this.lblWin.getPosition());
        var to = this.playerMe.avt.getParent().convertToWorldSpace(this.playerMe.avt.getPosition());
        this.move4Chip(from, to);
        this.btnX2.setVisible(false);
        this.btnGive.setVisible(false);
        this.activeButtonNewGame(true);

        //var randeom = Math.floor(Math.random()*8);
        // if(randeom !=2){
        //     return;
        // }
        // for(var i = 0; i < 5; i++){
        //     (function () {
        //         var iNew = i;
        //         thiz.btnX2.runAction(new cc.Sequence(
        //             new cc.DelayTime(iNew*0.2),
        //             new cc.CallFunc(function () {
        //                 var coin =  new CoinNode();
        //                 coin.show();
        //             })
        //         ))
        //
        //     })();
        // }
    },
    initLabel:function () {
        //hu thuong

        var bgHu = new ccui.Button("slot_bg_hu.png", "", "", ccui.Widget.PLIST_TEXTURE);
        bgHu.setScale9Enabled(true);
        bgHu.setCapInsets(cc.rect(12, 0, 4, 46));
        bgHu.setContentSize(cc.size(290, 46));
        bgHu.setPosition(cc.p(504,560));
        this.bgSlot.addChild(bgHu,100);
        bgHu.addClickEventListener(function () {
           cc.log("Lich su no hu");
            var his = new HistoryNoHuFruit();
            his.show();
        });



        // var bgHu = new ccui.Scale9Sprite("slot_bg_hu.png",cc.rect(12, 0, 4, 46));
        // bgHu.setPreferredSize(cc.size(290, 46));
        // bgHu.setPosition(cc.p(504,560));
        // this.bgSlot.addChild(bgHu,100);

        var txtHu = new cc.LabelTTF("Hũ thưởng", cc.res.font.Roboto_Condensed,24);
        txtHu.setColor(cc.color(186,194,249,255));
        txtHu.setAnchorPoint(cc.p(1,0.5));
        txtHu.setPosition(142,23);
        bgHu.addChild(txtHu);
        this.txtHu = txtHu;

        var lblHu = new cc.LabelTTF("10.000", cc.res.font.Roboto_CondensedBold,24);
        lblHu.setColor(cc.color(255,222,0,255));
        lblHu.setAnchorPoint(cc.p(0,0.5));
        lblHu.setPosition(144,23);
        bgHu.addChild(lblHu);
        this.lblHu = lblHu;

        // muc cuoc
        var bgBet = new ccui.Scale9Sprite("slot_bg_hu.png",cc.rect(12, 0, 4, 46));
        bgBet.setPreferredSize(cc.size(220, 46));
        bgBet.setPosition(cc.p(504-115,140));
        this.bgSlot.addChild(bgBet);

        var txtBet = new cc.LabelTTF("Tổng Cược:", cc.res.font.Roboto_Condensed,24);
        txtBet.setColor(cc.color(186,194,249,255));
        txtBet.setAnchorPoint(cc.p(1,0.5));
        txtBet.setPosition(108,23);
        this.txtBet = txtBet;
        bgBet.addChild(txtBet);

        var lblBet = new cc.LabelTTF("10.000", cc.res.font.Roboto_CondensedBold,24);
        lblBet.setColor(cc.color(255,222,0,255));
        lblBet.setAnchorPoint(cc.p(0,0.5));
        lblBet.setPosition(110,23);
        bgBet.addChild(lblBet);
        this.lblBet = lblBet;

        // tien win
        var bgWin = new ccui.Scale9Sprite("slot_bg_hu.png",cc.rect(12, 0, 4, 46));
        bgWin.setPreferredSize(cc.size(220, 46));
        bgWin.setPosition(cc.p(504+110,140));
        this.bgSlot.addChild(bgWin);

        var txtWin = new cc.LabelTTF("Thắng:", cc.res.font.Roboto_Condensed,24);
        txtWin.setColor(cc.color(186,194,249,255));
        txtWin.setAnchorPoint(cc.p(1,0.5));
        txtWin.setPosition(100,23);
        this.txtWin = txtWin;
        bgWin.addChild(txtWin);

        var lblWin = new cc.LabelTTF("10.000", cc.res.font.Roboto_CondensedBold,24);
        lblWin.setColor(cc.color(255,222,0,255));
        lblWin.setAnchorPoint(cc.p(0,0.5));
        lblWin.setPosition(102,23);
        bgWin.addChild(lblWin);
        this.lblWin = lblWin;

        var lblID = new cc.LabelTTF("", cc.res.font.Roboto_CondensedBold,24);
        lblID.setColor(cc.color(225,177,255,255));
        lblID.setPosition(504,85);
        this.bgSlot.addChild(lblID);
        this.lblID = lblID;
    },
    initBetButtons:function () {
        var  thiz = this;
        this.arrButBet = [];
        for(var i = 0; i< 3;i++){
            (function () {
                var inew = i;
                var btnBet = new ccui.Button("slot_bet_a1.png", "", "", ccui.Widget.PLIST_TEXTURE);
                btnBet.setPosition(cc.p(-50,250 + i*121));
                btnBet.addClickEventListener(function () {
                    thiz.setlectButtonBet(inew);
                });
                thiz.bgSlot.addChild(btnBet);
                btnBet.setVisible(false);
                thiz.arrButBet.push(btnBet);
            })();

        }

    },
    setActiveBt : function(btn,enabled){
        btn.setBright(enabled);
        btn.setEnabled(enabled);
    },

    onSetTextBet:function () {
        cc.log("tuye");
        this.setTextBet(cc.Global.NumberFormat1(this.selectLine.getLines().length*ARR_BET_SLOT[this.indexBet]));
        this.lblRowNumber.setString(this.selectLine.getLines().length.toString() );
    },

    setlectButtonBet:function (index) {
        this.enableAutoRotate(false);
        this.indexBet = index;
        for(var i = 0; i< this.arrButBet.length;i++){
            var name = ((i==index)?"slot_bet_a":"slot_bet_d")+(i+1).toString()+".png";
            this.arrButBet[i].loadTextureNormal( name,ccui.Widget.PLIST_TEXTURE) ;
        }
        this.onSetTextBet();
        if(this.arrHuThuong.length > 2){
            this.setTextHuThuong(parseInt(this.arrHuThuong[index]));
        }
    },
    initTopBar:function () {
        var thiz = this;
        var backBt = new ccui.Button("ingame-backBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        backBt.setPosition(54, 666);
        this.addChild(backBt);
        backBt.addClickEventListener(function () {
           thiz._controller.requestQuitRoom();
        });

        var settingBt = new ccui.Button("ingame-settingBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        settingBt.setPosition(1220, backBt.y);
        settingBt.addClickEventListener(function () {
            var dialog = new SettingDialog();
            dialog.showWithAnimationMove();
        });
        this.addChild(settingBt);

        var hisBt = new ccui.Button("slot_btn_his.png", "", "", ccui.Widget.PLIST_TEXTURE);
        hisBt.setPosition(1120, backBt.y);
        hisBt.addClickEventListener(function () {
            var his = new HistoryFruit();
            his.show();
        });
        this.addChild(hisBt);

        var tutorialBt = new ccui.Button("slot_btn_tutorial.png", "", "", ccui.Widget.PLIST_TEXTURE);
        tutorialBt.setPosition(1020, backBt.y);
        tutorialBt.addClickEventListener(function () {

            var tutorialDialog = TutorialDialog.getTutorial(GameType.GAME_SLOT_FRUIT);
            tutorialDialog.show();
            SoundPlayer.playSound("mini_clickButton");
        });
        this.addChild(tutorialBt);
    },
    exitToGame: function (message) {
        var homeScene = new HomeScene();
        homeScene.startGame();
        cc.director.replaceScene(homeScene);
        if (message) {
            MessageNode.getInstance().show(message, null, homeScene);
        }
        return homeScene;
    },
    handleResuft:function(isReconnect,arrItem,obArrLine,moneyWin,isX2){
        this.isHaveData = true;
        this.moneyWin = moneyWin;
        this.dup.setMoney(moneyWin);
        this.isX2 = isX2;
        if(moneyWin == null){
            this.moneyWin = "0";
        }
        if(isX2 == null){
            this.isX2 = false;
        }



        var thiz =  this;

        this.obArrLine = obArrLine;
        this.arrItem = arrItem;
        if(arrItem.length > 0){
            this.btnStop.setVisible(true);
        }
        if(isReconnect){
            this.slotfui.showNotEffect(arrItem);
            thiz.onFinishQuay();
        }else {
            this.slotfui.stopSlotWithResuft(arrItem);
        }

    },
    handleResuftZ:function(isReconnect,param){

        // var arrItem = param["2"];
        // var arrLine = param["3"]["1"];
        //
        // this._view.handleResuft(false,arrItem,arrLine,param["4"],param["5"]);

        this.dataSlot = param;
        var arrItem = param["2"];
        var moneyWin = param["4"];
        var isX2 = param["5"];
        this.isHaveData = true;
        this.dup.setMoney(moneyWin);
        if(moneyWin == null){
            this.moneyWin = "0";
        }

        var thiz =  this;

        if(arrItem.length > 0){
            this.btnStop.setVisible(true);
        }
        if(isReconnect){
            this.slotfui.showNotEffect(arrItem);
            thiz.onFinishQuay();
        }else {
            this.slotfui.stopSlotWithResuft(arrItem);
        }

    },
    handelStopButton:function () {
        this.enableAutoRotate(false);
        this.slotfui.stopNow(this.dataSlot["2"]);
    },
    onFinishQuay:function () {

        var moneyWin =   this.dataSlot["4"];
        this.setTextWin(cc.Global.NumberFormat1(parseInt(moneyWin)));
        if(parseInt(moneyWin) > 10*this.selectLine.getLines().length*ARR_BET_SLOT[this.indexBet])
        {
            this.onBigwin();
        }
        var isX2 = this.dataSlot["5"];
        if(isX2 == null || isX2 == undefined){
            isX2 = false;
        }
        if(isX2){
            this.btnX2.setVisible(true);
            this.btnGive.setVisible(true);
        }
        else{
            this.activeButtonNewGame(true);
        }
         this.btnStop.setVisible(false);

        var  thiz =  this;
         this.runAction(new cc.Sequence(new cc.CallFunc(function () {
                thiz.showAllLineWin();
            }),
            new cc.DelayTime(this.isAutoRotate?0.5:1),
            new cc.CallFunc(function () {
               thiz.clearAllLine();
                }),
            new cc.CallFunc(function () {
               thiz.showOneLine();
            })
              ));

        if(this.isAutoRotate){
            this.runAction(new cc.Sequence(new cc.DelayTime(2.7),new cc.CallFunc(function () {
                if(!thiz.isHaveData){
                    return;
                }
                if(thiz.isAutoRotate){
                    thiz.setTextWin("0");
                    thiz.btnGive.setVisible(false);
                    thiz.rotateRequest();
                }

            })));

        }
    },
    clearLineDraw:function () {
        for(var i = 0;i<20;i++){
            this.arrLine[i].setVisible(false);
            // this.arrNum[i].visibleNew(false);

        }
    },
    clearAllLine:function () {
        this.clearLineDraw();
        this.slotfui.clearAllItemInLine();
    },

    showNumLineReconnect:function (arrLine,index) {
        this.indexBet = index;
        this.setlectButtonBet(index);
        this.selectLine.setLineReconnect(arrLine);
        this.onSetTextBet();
        for(var i = 0; i < this.arrNum.length; i++){
            this.arrNum[i].visibleNew(false);
        }
        for(var i = 0; i < arrLine.length; i++){
            this.arrNum[arrLine[i]-1].visibleNew(true);
        }
    //
    //     for(var i = 0; i < arrLine.length; i++){
    //         this.arrNum[arrLine-1].visibleNew(true);
    //     }
    },

    showAllLineWin:function(){
        var obArrLine = this.dataSlot["3"]["1"];

        for(var i = 0; i < obArrLine.length  ; i++){
            var line = obArrLine[i];
            var idLine =  line["1"]-1;
            this.arrLine[idLine].setVisible(true);
            this.arrNum[idLine].visibleNew(true);
            this.slotfui.showLineWin(idLine,line["3"]);
        }
        this.lblMoneyLine.stopAllActions();
        this.lblMoneyLine.setString("0");
        if(parseInt(this.dataSlot["4"])== 0){
            this.lblMoneyLine.setString("");
        }
        else{
            this.lblMoneyLine.runAction(new quyetnd.ActionNumber(0.25, parseInt(this.dataSlot["4"])));
        }

    },
    showOneLine:function () {
        var thiz = this;
        var arrAction  = [];
        var obArrLine = this.dataSlot["3"]["1"];
        var money1Line = 0;
        for(var i = 0; i < obArrLine.length  ; i++){

            (function () {
                var iNew = i;
                var line = obArrLine[iNew];
                var idLine =  line["1"]-1;
                money1Line += parseInt(line["4"]);
                var zzz = money1Line;
                var actionLine = new cc.CallFunc(function () {
                    thiz.arrLine[idLine].setVisible(true);
                    thiz.lblMoneyLine.stopAllActions();
                    if(iNew==0 ){
                        thiz.lblMoneyLine.setString("0");
                    }
                    if(obArrLine.length>1)
                    {
                        thiz.lblMoneyLine.runAction(new quyetnd.ActionNumber(0.25, zzz));
                    }
                    else {
                        thiz.lblMoneyLine.setString(cc.Global.NumberFormat1(zzz));
                    }


                    thiz.slotfui.showLineWin(idLine,line["3"]);
                });
               var clearzzz =  new cc.CallFunc(function () {
                    thiz.clearAllLine();
                });
                var delayTime = new cc.DelayTime(1);

                arrAction.push(actionLine);
                arrAction.push(delayTime);
                arrAction.push(clearzzz);
            })();

        }
        if(arrAction.length!=0){
            this.runAction(new cc.RepeatForever(new cc.Sequence(arrAction)));
        }


    },
    initHuThuong: function (data) {
        // LoadingDialog.getInstance().hide();
        this.arrHuThuong = [];

        for(var i =0; i < data.length; i++){
            this.arrHuThuong.push(data[i]["2"]);
        }
        this.setlectButtonBet(0);
        this.showArrButtonBet();
        this.slotfui.initRandom();
    },
    performChangeRewardFund:function (data) {
        if(this.arrHuThuong.length>0){
            for(var i =0; i < this.arrHuThuong.length; i++){
                this.arrHuThuong[i] = data[i][2];
            }
            this.setTextHuThuong(parseInt(this.arrHuThuong[this.indexBet]));
        }

    },
    showArrButtonBet:function () {
        for (var  i = 0; i < this.arrButBet.length; i ++){
            this.arrButBet[i].setVisible(true);
        }
    },
    clickAutoQuay:function () {
        if(!this.isHaveData){
            return;
        }
        if(this.isAutoRotate){
            return;
        };
        this.enableAutoRotate(true);

        this.rotateRequest();
    },
    onBonus:function(idCard,type,moneyWin){
        this.dup.handelResuft(idCard,type,moneyWin);
        this.setTextWin(cc.Global.NumberFormat1(parseInt(moneyWin)));
        if(type == 3){
            this.btnX2.setVisible(false);
            this.btnGive.setVisible(false);

            this.activeButtonNewGame(true);
        }

    },

    updateGold: function ( gold) {
        var goldNumber = gold;
        if (typeof gold === "string") {
            goldNumber = parseInt(gold);
        }

        this.playerMe.setGold(goldNumber);

    },
    changeGoldEffect: function ( deltaGold) {
      if(parseInt(deltaGold)>0){
          this.playerMe.runChangeGoldEffect(deltaGold);
      }

    },
    onEnter: function () {
        this._super();
        this.scheduleUpdate();
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
                    new cc.DelayTime(0.05*i),
                    new cc.EaseSineIn(new cc.MoveTo(0.7, to)),
                    new cc.CallFunc(function () {
                        chip.removeFromParent(true);
                    })
                ));
                thiz.sceneLayer.addChild(chip,10);
            })();

        }

    },
    onExit: function () {
        this._super();
        this.unscheduleUpdate();
        this._controller.releaseController();
    },
    showJackpot: function () {
        var layer = new JackpotLayer();
        layer.show();
    },
    activeButtonNewGame:function (isActive) {
      this.setActiveBt(this.btn20Row,isActive);
        this.setActiveBt(this.btnQuay,isActive);
        for(var  i = 0;i < this.arrButBet.length; i++)
        this.setActiveBt(this.arrButBet[i],isActive);
    },
    onError:function(params){
        if(params["code"] == 10){
            this.slotfui.clearAll();
            this.activeButtonNewGame(true);
            this.enableAutoRotate(false);
        }
    },

    onBigwin:function () {
      var nodeBigWin = new cc.Node();
        //this.nodeBigWin = nodeBigWin;
        var spriHom = new cc.Sprite("#slot_hom_do.png");
        var cardBg = new cc.Sprite("#slot_bg_hom.png");
        cardBg.setPosition(spriHom.getContentSize().width/2, spriHom.getContentSize().height/2+50);
        spriHom.addChild(cardBg,-1);



        cardBg.runAction(new cc.RepeatForever(new cc.RotateBy(2,360)));

        var spWin = new cc.Sprite("#slot_winbig.png");
        spWin.setPosition(spriHom.getContentSize().width/2+50, spriHom.getContentSize().height/2+10);
        spriHom.runAction(new cc.RepeatForever(
            new cc.Sequence(
                new cc.ScaleTo(0.5,0.95),
                new cc.ScaleTo(0.5,1)
            )
        ));
        spWin.setScale(0.4);
        spriHom.addChild(spWin);
        // spriHom.setAnchorPoint(0.5,1);
        spriHom.setPosition(cc.winSize.width/2,cc.winSize.height);
        spriHom.runAction(new cc.EaseBounceOut(new cc.MoveTo(1,cc.p(cc.winSize.width/2,cc.winSize.height/2-50))));
        nodeBigWin.addChild(spriHom);
        spriHom.runAction(new cc.Sequence(new cc.DelayTime(0.4),new cc.CallFunc(function () {
            spWin.runAction(new cc.ScaleTo(0.5,1));
            var coin = new CoinNode();
            coin.show();
        })));
        var lblMoneyW = new cc.LabelTTF("0",cc.res.font.Roboto_CondensedBold,45);
        lblMoneyW.setPosition(spriHom.getContentSize().width/2+10, spriHom.getContentSize().height/2-60);
        lblMoneyW.setColor(cc.color(255,240,0,255));
        var action = new quyetnd.ActionNumber(2, 200000);
        lblMoneyW.runAction(action);
        spriHom.addChild(lblMoneyW);

        this.addChild(nodeBigWin,2);

        nodeBigWin.runAction(new cc.Sequence(new cc.DelayTime(5),new cc.CallFunc(function () {
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches:true,
                onTouchBegan : function (touch, event) {

                    nodeBigWin.removeFromParent(true);

                    return true;
                },
            }, nodeBigWin);
        }),
            new cc.DelayTime(3),
            new cc.CallFunc(function () {
                nodeBigWin.removeFromParent(true);
            })
        ));




    },

    initController: function () {
        this._controller = new SlotFruitController(this);
    }
});


