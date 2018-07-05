/**
 * Created by Quyet Nguyen on 7/25/2016.
 */

POSITION_PHOM_CENTER = 0;
POSITION_PHOM_LEFT = -1;
POSITION_PHOM_RIGHT = 1;

var TrashCardOnTable = cc.Node.extend({
    ctor: function (width_Phom,height_Phom,typeArrange) {

        this._super();
        this.cardList = []; // list of card sprites
        this.cardSize = null;
        this.setContentSize(cc.size(width_Phom,height_Phom));
        this.typeArrange = typeArrange;
        this.width_Phom = width_Phom;
        this.height_Phom = height_Phom;
    },
    setAnchor:function (anchor) {
      this.anchor = anchor;
    },
    setCardPosition: function (x, y) {
        //this.cardPosition = cc.p(x, y);
        this.cardPosition = cc.p(0, 0);
        this.setPosition(x, y);
    },

    removeCardById: function (id) {
        var card = CardList.prototype.getCardWithId(id);
        for (var i = 0; i < this.cardList.length; i++)
            if (this.cardList[i].rank == card.rank && this.cardList[i].suit == card.suit) {
                var retVal = this.cardList[i];
                retVal.setPosition(this.convertToWorldSpace(retVal.getPosition()));
                retVal.retain();
                retVal.removeFromParent(true);
                this.cardList.splice(i, 1);
                return retVal;
            }
        cc.log("card id " + id + " " + JSON.stringify(card));
        return null;
    },

    addCard: function (card, noAnimation) {
        var p = this.convertToNodeSpace(card.getPosition());
        card.setPosition(p);
        var animationDuration = 0.1;

        if (!this.cardSize)
            this.cardSize = card.getContentSize();

        card.canTouch = false;
        this.cardList.push(card);
        this.addChild(card, 0);
        card.setScale(this.height_Phom/this.cardSize.height);

        var moveAction = new cc.MoveTo(animationDuration, this.getNewPostionCard(this.cardList.length-1));

        var thiz = this;
        var delay = new cc.DelayTime(animationDuration);
        var orderAgain = new cc.CallFunc(function () {
            thiz.reOrder(noAnimation);
        });
        // if(noAnimation ){
        //     thiz.reOrder(noAnimation);
        // }
        // else{
        //     card.runAction(new cc.Sequence(moveAction, orderAgain));
        // }
        thiz.reOrder(noAnimation);

    },

    getNewPostionCard:function (i) {

        var tileCard = this.cardSize.width/this.cardSize.height;

        var distanceCard = 0 ;
        var lol =  this.cardList.length*this.height_Phom*tileCard - this.width_Phom;

        if(lol > 0){
            distanceCard =  lol/(this.cardList.length-1);
        }


        var y = this.getContentSize().height / 2;
        var x = 0;
        if(distanceCard<=0){
            //se
            if (this.typeArrange == POSITION_PHOM_CENTER)
            {
                //center
                var wSub = this.cardList.length * this.height_Phom *tileCard;
                var ogrFirst = -wSub / 2;
                x = ogrFirst + i * this.height_Phom * tileCard + this.height_Phom * tileCard / 2;

                //CCLOG("toa go %f", orgX);
            }
            else if (this.typeArrange == POSITION_PHOM_LEFT)
            {
                // can trai
                //float wSub = numberCard * _height_Phom *tileCard;
                var ogrFirst = - this.width_Phom/2 ;
                x = ogrFirst + i * this.height_Phom * tileCard + this.height_Phom * tileCard / 2;

            }
            else
            {
                // canphai
                var wSub = this.cardList.length * this.height_Phom *tileCard;
                var ogrFirst = this.width_Phom/2 - wSub;
                x = ogrFirst + i * this.height_Phom * tileCard + this.height_Phom * tileCard / 2;

            }

        }
        else {
            x = i*this.height_Phom*tileCard - i*distanceCard + this.height_Phom*tileCard/2 - this.width_Phom/2;
        }
        return cc.p(x,y);
    },

    reOrder: function (noAnimation) {
        if (this.cardList.length > 0) {

            var tileCard = this.cardSize.width/this.cardSize.height;

            var distanceCard = 0 ;
            var lol =  this.cardList.length*this.height_Phom*tileCard - this.width_Phom;

            if(lol > 0){
                distanceCard =  lol/(this.cardList.length-1);
            }


            var y = this.getContentSize().height / 2;
            for (var i = 0; i < this.cardList.length; i++) {

                var x = 0;
                if(distanceCard<=0){
                    //se
                    if (this.typeArrange == POSITION_PHOM_CENTER)
                    {
                        //center
                        var wSub = this.cardList.length * this.height_Phom *tileCard;
                        var ogrFirst = -wSub / 2;
                        x = ogrFirst + i * this.height_Phom * tileCard + this.height_Phom * tileCard / 2;

                        //CCLOG("toa go %f", orgX);
                    }
                    else if (this.typeArrange == POSITION_PHOM_LEFT)
                    {
                        // can trai
                        //float wSub = numberCard * _height_Phom *tileCard;
                        var ogrFirst = - this.width_Phom/2 ;
                        x = ogrFirst + i * this.height_Phom * tileCard + this.height_Phom * tileCard / 2;

                    }
                    else
                    {
                        // canphai
                        var wSub = this.cardList.length * this.height_Phom *tileCard;
                        var ogrFirst = this.width_Phom/2 - wSub;
                        x = ogrFirst + (this.cardList.length-i-1) * this.height_Phom * tileCard + this.height_Phom * tileCard / 2;

                    }

                }
                else {
                    x = i*this.height_Phom*tileCard - i*distanceCard + this.height_Phom*tileCard/2 - this.width_Phom/2;
                }

                var card = this.cardList[i];
                if(card.origin){
                    card.origin = cc.p(x, y);
                    card.cardIndex = i;
                    if (noAnimation)
                        card.setPosition(card.origin);
                    else
                        card.moveToOriginPosition();
                }
            }
        }
    },

    addNewCard: function (card, posFrom) {
        var cardSprite = new Card(card.rank, card.suit);
        cardSprite.setPosition(posFrom);
        cardSprite.canTouch = false;
        this.addCard(cardSprite,false);
    },

    addCardObj: function (card) {
        var cardSprite = new Card(card.rank, card.suit);
        cardSprite.setPosition(this.getParent().getPosition());
        cardSprite.canTouch = false;

        var p = this.convertToNodeSpace(cardSprite.getPosition());
        cardSprite.setPosition(p);
        var animationDuration = 0.3;

        if (!this.cardSize)
            this.cardSize = cardSprite.getContentSize();
        var dx = this.cardSize.width * this.height_Phom/this.cardSize.height;
        cardSprite.setScale(this.height_Phom/this.cardSize.height);
        // var width = 4 * dx;
        // var x = this.cardPosition.x - width / 2 + dx / 2;
        // x += this.cardList.length * dx;
        //
        // var moveAction = new cc.MoveTo(animationDuration, cc.p(x, this.cardPosition.y));
        // var scaleAction = new cc.ScaleTo(animationDuration, 0.5);
        // cardSprite.runAction(new cc.EaseBackIn(new cc.Spawn(moveAction, scaleAction)));
        cardSprite.canTouch = false;
        this.cardList.push(cardSprite);
        this.addChild(cardSprite, 0);

    },



    addCardWithoutAnimation: function (cards) {
        if (!this.cardSize) {
            this.cardSize = cards[0].getContentSize();
        }
        this.cardList.concat(cards);

        var dx = this.cardSize.width * this.cardScale;
        var width = cards.length * dx;
        var x = this.getContentSize().width / 2 + dx / 2;
        var y = this.getContentSize().height / 2;

        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            card.setScale(this.cardScale);
            card.setPosition(x, y);
            this.addChild(card, 0);
            x += dx;
        }
    },
    addArrayCard: function (cards) {
       this.removeAll();

        for (var i = 0; i < cards.length; i++) {
            this.addCardObj(cards[i]);
        }
        this.reOrder();
    },

    removeAll: function () {
        this.cardList = [];
        this.removeAllChildren(true);
    }
});




var PhomCardList = CardList.extend({
    dealCards: function (cards, animation) {
        this._super(cards, animation);
        this.typeOrder = true;
    },
    setTypeOder:function () {
        this.typeOrder = !this.typeOrder;
    },
    reArrangeCards: function () {
        // chia ra 2 array, grouped va ungrouped
        var groupedCard = [];
        var ungroupedCard = [];
        for (var i = 0; i < this.cardList.length; i++) {
            var cardId = CardList.prototype.getCardIdWithRank(this.cardList[i].rank, this.cardList[i].suit);
            var index = this.groupedCard.indexOf(cardId);
            if (index != -1)
                groupedCard[index] = this.cardList[i];
            else
                ungroupedCard.push(this.cardList[i]);
        }
        if(this.typeOrder){
            ungroupedCard.sort(function (a, b) {
                return a.rank - b.rank;
            });
        }else {
            ungroupedCard.sort(function (a, b) {
                return a.suit - b.suit;
            });
        }


        this.cardList = [];
        this.cardList = groupedCard.concat(ungroupedCard);
        this.reOrder();
    },
    suggestCards: function (cards) {
        for (var i = 0; i < this.cardList.length; i++) {
            var cardSprite = this.cardList[i];
            var selected = cards.indexOf(CardList.prototype.getCardIdWithRank(cardSprite.rank,
                    cardSprite.suit)) != -1;
            cardSprite.setSelected(selected, true);
        }
    },
    getCardScale:function () {
        return this.cardList[0].getScale();
    },
    processGroupedCard: function (param) {
        var groupedCard = [];
        for (var i = 0; i < param.length; i++)
            groupedCard = groupedCard.concat(param[i]);
        this.groupedCard = groupedCard;

        for (var i = 0; i < this.cardList.length; i++) {
            var id = CardList.prototype.getCardIdWithRank(this.cardList[i].rank,
                this.cardList[i].suit);
            if (groupedCard.indexOf(id) != -1) {
                this.cardList[i].removeChildByTag(11,true) ;
                var dotSprite = new cc.Sprite("#card-dot.png");
                dotSprite.setTag(11);
                dotSprite.setPosition(this.cardList[i].width - 20,
                    this.cardList[i].height - 20);
                this.cardList[i].addChild(dotSprite);
            }
            else {
                this.cardList[i].removeAllChildren(true);
            }
        }
    }
});
var Phom = IGameScene.extend({
    ctor: function () {
        this._super();

        var table_bg = new cc.Sprite("res/gp_table.png");
        table_bg.setPosition(cc.winSize.width / 2, 320);
        table_bg.setScale(cc.winSize.screenScale);
        this.sceneLayer.addChild(table_bg);
        this.table_bg = table_bg;
        this.initPlayer();
        this.initButton();

        var cardList = new PhomCardList(cc.size(cc.winSize.width - 10, 200));
        cardList.setScale(1.0* cc.winSize.screenScale);
        cardList.setAnchorPoint(cc.p(0.5, 0.0));
        cardList.setPosition(cc.winSize.width / 2, 40.0);
        this.sceneLayer.addChild(cardList, 2);
        this.cardList = cardList;

        var drawDeck = new cc.Sprite("#gp_card_up.png");
        drawDeck.setPosition(table_bg.getContentSize().width / 2, table_bg.getContentSize().height/2 + 60);
        var drawDeckLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "");
        drawDeckLabel.setPosition(drawDeck.width / 2, drawDeck.height / 2);
        drawDeckLabel.setVisible(true);
        drawDeck.addChild(drawDeckLabel);
        drawDeck.setScale(0.7);
        this.drawDeckLabel = drawDeckLabel;
        this.drawDeck = drawDeck;
        this.table_bg.addChild(drawDeck);

        var cardArr = [];
        for (var i = 0; i< 8; i++){
            var card = CardList.prototype.getCardWithId(1);
            cardArr.push(card);
        }
        var cardArr2 = [];
        for (var i = 0; i< 4; i++){
            var card = CardList.prototype.getCardWithId(i);
            cardArr2.push(card);
        }
        var cardArr3 = [];
        for (var i = 0; i< 10; i++){

            cardArr3.push(i);
        }
        var thiz = this;
       //  cc.log("mobieeeeee");
       // this.runAction(new cc.Sequence(new cc.DelayTime(1), new cc.CallFunc(function () {
       //      cc.log("mobieeeeee");
       //      for(var i = 0; i< 1; i++){
       //          cc.log("mobieeeeee" + i);
       //          thiz.allSlot[i].setVisible(true);
       //          thiz.allSlot[i].dropCards.addArrayCard(cardArr);
       //          thiz.allSlot[i].trashCards.addArrayCard(cardArr2);
       //          thiz.allSlot[i].setUsername("nguyencongvan");
       //          thiz.allSlot[i].setGold(10000);
       //          thiz.allSlot[i].setEnable(true);
       //      };
       //      thiz.setCardList(cardArr3);
       //  })));



    },
    initController: function () {
        this._controller = new PhomController(this);
    },
    setTrashCardList: function (cards, username,noAnimation) {
        var slot = this.getSlotByUsername(username);
        slot.trashCards.removeAll();
        for (var j = 0; j < cards.length; j++) {
            var card = CardList.prototype.getCardWithId(cards[j]);
            slot.trashCards.addCard(new Card(card.rank, card.suit),noAnimation);
        }
    },

    setCardList: function (cards) {
        this.cardList.removeAll();
        for (var i = 0; i < cards.length; i++) {
            var card = CardList.prototype.getCardWithId(cards[i]);
            this.cardList.addCard(new Card(card.rank, card.suit));
        }
        this.cardList.reOrderWithoutAnimation();
    },

    setStolenCardsMe: function (cards) {
        for (var i = 0; i < this.cardList.cardList.length; i++) {
            var card = this.cardList.cardList[i];
            var cardId = CardList.prototype.getCardIdWithRank(card.rank, card.suit);
            if (cards.indexOf(cardId) != -1) {
                var borderSprite = new cc.Sprite("#boder_do.png");
                borderSprite.setPosition(card.width / 2, card.height / 2);
                card.addChild(borderSprite);
            }
        }
    },

    setStolenCardsOther: function (cards, username) {
        var slot = this.getSlotByUsername(username);
        slot.dropCards.removeAll();

        for (var i = 0; i < cards.length; i++) {
            var card = CardList.prototype.getCardWithId(cards[i]);
            var cardSprite = new Card(card.rank, card.suit);
            var redBorder = new cc.Sprite("#boder_do.png");
            redBorder.setPosition(cardSprite.width / 2, cardSprite.height / 2);
            cardSprite.addChild(redBorder);
            slot.dropCards.addCard(cardSprite,true);
        }
    },

    processGroupedCard: function (groupedCard) {
        this.cardList.processGroupedCard(groupedCard);
    },

    showResultDialog: function (resultData) {
        var dialog = new ResultDialog(resultData.length);

        for (var i = 0; i < resultData.length; i++) {
            var username = resultData[i].username;
            if (username.length > 3 && (username != PlayerMe.username)){
                username = username.substring(0,username.length - 3) + "***";
            }
            dialog.userLabel[i].setString(username);
            if (resultData[i].username == PlayerMe.username) {
                SoundPlayer.playSound(resultData[i].isWinner ? "winning" : "losing");
            }
            var goldStr = resultData[i].gold >= 0 ? "+" : "-";
            goldStr += (cc.Global.NumberFormat1(Math.abs(resultData[i].gold)) + " V");
            dialog.goldLabel[i].setString(goldStr);
            dialog.goldLabel[i].setColor(resultData[i].gold >= 0 ?
                cc.color("#ffde00") : cc.color("#ff0000"));
            dialog.contentLabel[i].setString(resultData[i].resultString);

            for (var j = 0; j < resultData[i].cardList.length; j++) {
                var cardData = CardList.prototype.getCardWithId(resultData[i].cardList[j]);
                var card = new Card(cardData.rank, cardData.suit);
                dialog.cardList[i].addCard(card,true);
            }

            dialog.cardList[i].reOrderWithoutAnimation();
        }

        dialog.show();
    },

    performHaBaiMe: function (groupedCards,noAnimation) {
        var removeList = [];
        for (var i = 0; i < groupedCards.length; i++) {
            var list = groupedCards[i];
            for (var j = 0; j < list.length; j++) {
                removeList.push(CardList.prototype.getCardWithId(list[j]));
            }
        }

        var arr = this.cardList.removeCard(removeList);
        for (var i = 0; i < arr.length; i++) {
            arr[i].removeChildByTag(11,true);
            this.playerView[0].dropCards.addCard(arr[i],noAnimation);
            arr[i].release();
        }
        this.playerView[0].dropCards.reOrder();
        this.cardList.reOrder();
    },

    performHaBaiMeReconnect: function (groupedCards,noAnimation,cardToMau) {

        for (var i = 0; i < groupedCards.length; i++) {


            var card = CardList.prototype.getCardWithId(groupedCards[i]);
            var cardSprite = new Card(card.rank, card.suit);

            var index = cardToMau.indexOf(groupedCards[i]);
            if (index != -1) {// from hands, create new sprite
                var borderSprite = new cc.Sprite("#boder_do.png");
                borderSprite.setPosition(objCard.width / 2, objCard.height / 2);
                cardSprite.addChild(borderSprite);
            }
            this.playerView[0].dropCards.addCard(cardSprite,true);
        }
    },

    performHaBaiOther: function (username, groupedCards, stolenCards,noAnimation) {
        var slot = this.getSlotByUsername(username);
        var stolenCardsId = [];
        var stolenCardsSprite = [];

        //index stolen cards
        for (var i = 0; i < slot.dropCards.cardList.length; i++) {
            stolenCardsId.push(
                CardList.prototype.getCardIdWithRank(slot.dropCards.cardList[i].rank,
                    slot.dropCards.cardList[i].suit)
            );
            // slot.dropCards.cardList[i].retain();
            // stolenCardsSprite.push(slot.dropCards.cardList[i]);
            // slot.dropCards.cardList[i].removeFromParent();

        }
        slot.dropCards.removeAll();

        //add to drop cards list
        for (var i = 0; i < groupedCards.length; i++) {
            for (var j = 0; j < groupedCards[i].length; j++) {
                var index = stolenCards.indexOf(groupedCards[i][j]);
                var card = CardList.prototype.getCardWithId(groupedCards[i][j]);
                var objCard = new Card(card.rank, card.suit);
                objCard.setPosition(slot.avt.getParent().convertToWorldSpace(slot.avt.getPosition()));
                slot.dropCards.addCard(objCard,false);
                if (index == -1) {// from hands, create new sprite

                }
                else { // from exist drop card
                    // stolenCardsSprite[index].setPosition(stolenCardsSprite[index].origin)
                    // slot.dropCards.addCard(stolenCardsSprite[index],false);
                    // stolenCardsSprite[index].release();
                    var borderSprite = new cc.Sprite("#boder_do.png");
                    borderSprite.setPosition(objCard.width / 2, objCard.height / 2);
                    objCard.addChild(borderSprite);
                }
            }
        }
        // slot.dropCards.reOrder(false);
    },
    performHaBaiOtherReconnect: function (username, groupedCards, stolenCards,noAnimation) {
        var slot = this.getSlotByUsername(username);
        var stolenCardsId = [];

        //index stolen cards
        for (var i = 0; i < slot.dropCards.cardList.length; i++) {
            stolenCardsId.push(
                CardList.prototype.getCardIdWithRank(slot.dropCards.cardList[i].rank,
                    slot.dropCards.cardList[i].suit)
            );
            // slot.dropCards.cardList[i].retain();
            // stolenCardsSprite.push(slot.dropCards.cardList[i]);
            // slot.dropCards.cardList[i].removeFromParent();

        }
        slot.dropCards.removeAll();

        //add to drop cards list
        for (var i = 0; i < groupedCards.length; i++) {
            for (var j = 0; j < groupedCards[i].length; j++) {
                var index = stolenCards.indexOf(groupedCards[i][j]);
                var card = CardList.prototype.getCardWithId(groupedCards[i][j]);
                var objCard = new Card(card.rank, card.suit);
                objCard.setPosition(slot.avt.getParent().convertToWorldSpace(slot.avt.getPosition()));
                slot.dropCards.addCard(objCard,false);
                if (index == -1) {// from hands, create new sprite

                }
                else { // from exist drop card
                    // stolenCardsSprite[index].setPosition(stolenCardsSprite[index].origin)
                    // slot.dropCards.addCard(stolenCardsSprite[index],false);
                    // stolenCardsSprite[index].release();
                    var borderSprite = new cc.Sprite("#boder_do.png");
                    borderSprite.setPosition(objCard.width / 2, objCard.height / 2);
                    objCard.addChild(borderSprite);
                }
            }
        }
        // slot.dropCards.reOrder(false);
    },
    performReorderCards: function () {
        this.cardList.reOrder();
    },
    performDelegateCards: function (sender, receiver, cards,
                                    groupedCardAfter) {
        var finalList = [];
        var receiverSlot = this.getSlotByUsername(receiver);

        //determine where to get sprites
        for (var j = 0; j < groupedCardAfter.length; j++) {
            if (cards.indexOf(groupedCardAfter[j]) == -1) {
                // from grouped card before
                var cardSprite = receiverSlot.dropCards.removeCardById(groupedCardAfter[j])
                // finalList.push(cardSprite);
                // cardSprite.release();
                receiverSlot.dropCards.addCard(cardSprite,true);
            }
            else {
                // from my deck
                if (sender == PlayerMe.username) {
                    var cardSprite = this.cardList.removeCardById(groupedCardAfter[j])
                    // finalList.push(cardSprite);
                    // cardSprite.release();
                    receiverSlot.dropCards.addCard(cardSprite,true);
                    cc.log("Removed card id " + groupedCardAfter[j] + " from my deck");
                }
                // from someone's deck
                else {
                    var card = CardList.prototype.getCardWithId(groupedCardAfter[j]);
                    var cardSprite = new Card(card.rank, card.suit);
                    var slotTemp = this.getSlotByUsername(sender);
                    cardSprite.setPosition( slotTemp.avt.getParent().convertToWorldSpace(slotTemp.avt.getPosition()));
                    finalList.push(cardSprite);
                    cc.log("Added card id " + groupedCardAfter[j]);
                    receiverSlot.dropCards.addCard(cardSprite,true);
                }
            }
        }

        for (var i = 0; i < finalList.length; i++) {
            //add back to receiver drop cards
            // receiverSlot.dropCards.addCard(finalList[i],true);
        }
        // receiverSlot.dropCards.reOrder();
        this.cardList.reOrder();
    },

    performAssetChange: function (username, changeAmount, balance) {
        this._super(changeAmount,balance,username);
        // var slot = this.getSlotByUsername(username);
        // if (balance)
        //     slot.setGold(balance);
        //
        // var changeSprite = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "");
        // var changeText = (changeAmount >= 0 ? "+" : "") + changeAmount;
        // changeSprite.setString(changeText);
        // changeSprite.setColor(cc.color(changeAmount >= 0 ? "#ffde00" : "#ff0000"));
        // changeSprite.setPosition(slot.avt.getPosition());
        // slot.addChild(changeSprite, 420);
        //
        // changeSprite.runAction(new cc.Sequence(new cc.DelayTime(1.0), new cc.CallFunc(function () {
        //     changeSprite.removeFromParent(true);
        // })));
    },

    performBalanceCard: function (from, to, card) {
        var fromUser = this.getSlotByUsername(from);
        var toUser = this.getSlotByUsername(to);
        var cardSprite = fromUser.trashCards.removeCardById(card);
        toUser.trashCards.addCard(cardSprite,false);
        cardSprite.release();
        fromUser.trashCards.reOrder();
    },
    performStealCard: function (stealer, stolenUser, stolenCard,
                                groupedCard) { // in case I'm stealer
        var stolenUserSlot = this.getSlotByUsername(stolenUser);
        var cardSprite = stolenUserSlot.trashCards.removeCardById(stolenCard);
        cardSprite.removeAllChildren(true); //purify card, amen
        stolenUserSlot.trashCards.reOrder();

        var borderSprite = new cc.Sprite("#boder_do.png");
        borderSprite.setPosition(cardSprite.width / 2, cardSprite.height / 2);
        cardSprite.addChild(borderSprite);

        if (stealer == PlayerMe.username) {
            cardSprite.setScale(this.cardList.getCardScale());

            this.cardList.addCard(cardSprite,false);
            cardSprite.release();
            this.cardList.processGroupedCard(groupedCard);
            this.cardList.reArrangeCards();
        }
        else {
            var stealerSlot = this.getSlotByUsername(stealer);
            stealerSlot.dropCards.addCard(cardSprite,false);
            // stealerSlot.dropCards.reOrder();
        }
    },
    performDrawCardMe: function (cardId, groupedCard) {
        var card = CardList.prototype.getCardWithId(cardId);
        var cardSprite = new Card(card.rank, card.suit);
        cardSprite.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        this.cardList.addCard(cardSprite,false);
        this.cardList.reOrder();
        this.cardList.processGroupedCard(groupedCard);
    },

    performDrawCardOther: function (username) {
        var slot = this.getSlotByUsername(username);
        var card = new cc.Sprite("#gp_card_up.png");
        this.sceneLayer.addChild(card);
        card.setScale(0.5);
        card.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        var moveAction = new cc.MoveTo(0.3, slot.avt.getParent().convertToWorldSpace(slot.avt.getPosition()));
        var removeAction = new cc.CallFunc(function () {
            card.removeFromParent(true);
        });

        card.runAction(new cc.Sequence(moveAction, removeAction));
    },
    performDrawDeckUpdate: function (cardCount) {
        if (cardCount)
            this.drawDeckLabel.setString(cardCount);
    },
    showTimeRemainUser: function (username, currentTime, maxTime) {
        maxTime = maxTime || currentTime;
        for (var i = 0; i < this.allSlot.length; i++) {
            if (this.allSlot[i].username == username)
                this.allSlot[i].showTimeRemain(currentTime, maxTime);
            else
                this.allSlot[i].stopTimeRemain();
        }
    },
    setDrawBtVisible: function (visible) {
        this.drawBt.visible = visible;
    },
    setAnBaiBtVisible: function (visible) {
        this.anbaiBt.visible = visible;
    },
    setDanhBaiBtVisible: function (visible) {
        this.danhbaiBt.visible = visible;
    },
    setHaBaiBtVisible: function (visible) {
        this.habaiBt.visible = visible;
    },
    setGuiBaiBtVisible: function (visible) {
        this.guibaiBt.visible = visible;
    },
    setUBtVisible: function (visible) {
        this.uBt.visible = visible;
    },
    suggestCards: function (cards) {
        this.cardList.suggestCards(cards);
    },
    performDanhBaiMe: function (card) {
        var arr = this.cardList.removeCard([card]);
        //

        this.playerView[0].trashCards.addCard(arr[0],false);
        this.cardList.reOrder();
        for (var i = 0; i < arr.length; i++) {
            arr[i].removeAllChildren(true);
            arr[i].release();
        }
    },
    performDanhBaiOther: function (username, card) {
        var slot = this.getSlotByUsername(username);
        slot.trashCards.addNewCard(card,slot.avt.getParent().convertToWorldSpace(slot.avt.getPosition()));
    },

    performDealCards: function (cards, groupedCards) {
        this.cardList.dealCards(cards, true);
        this.cardList.processGroupedCard(groupedCards);
    },
    initPlayer: function () {

        var withPhom = 280;

        var playerMe = new GamePlayerMe();
        playerMe.setPosition(150, 50.0);
        playerMe.setScale(cc.winSize.screenScale);
        playerMe.trashCards = new TrashCardOnTable(withPhom,80,POSITION_PHOM_CENTER);
        var pointNew = playerMe.convertToNodeSpace(cc.p(cc.winSize.width / 2, 190*cc.winSize.screenScale));
        playerMe.trashCards.setCardPosition( pointNew.x,pointNew.y);
        playerMe.dropCards = new TrashCardOnTable(withPhom,80,POSITION_PHOM_CENTER);
        playerMe.dropCards.setCardPosition(playerMe.trashCards.x, playerMe.trashCards.y + 70);
        playerMe.addChild(playerMe.dropCards);
        playerMe.addChild(playerMe.trashCards);

        this.sceneLayer.addChild(playerMe, 1);

        var player1 = new GamePlayer();
        player1.setPosition(this.table_bg.getContentSize().width/2 + 500 , this.table_bg.getContentSize().height/2);
        player1.trashCards = new TrashCardOnTable(withPhom,80,POSITION_PHOM_RIGHT);
        player1.trashCards.setCardPosition(player1.width / 2 - (withPhom/2+50), player1.height / 2 - 15);

        player1.dropCards = new TrashCardOnTable(withPhom,80,POSITION_PHOM_RIGHT);
        player1.dropCards.setCardPosition(player1.trashCards.x, player1.trashCards.y + 70);

        player1.addChild(player1.dropCards);
        player1.addChild(player1.trashCards);
        this.table_bg.addChild(player1, 1);
        player1.chatView.setAnchorPoint(cc.p(1.0, 0.0));

        var player2 = new GamePlayer();
        player2.setPosition(this.table_bg.getContentSize().width/2, this.table_bg.getContentSize().height+50);
        player2.trashCards = new TrashCardOnTable(withPhom,80,POSITION_PHOM_RIGHT);
        player2.trashCards.setCardPosition(player2.width / 2 - (withPhom/2+50), player2.height / 2 - 15);
        player2.dropCards = new TrashCardOnTable(withPhom,80,POSITION_PHOM_RIGHT);
        player2.dropCards.setCardPosition(player2.trashCards.x, player2.trashCards.y + 70);

        player2.addChild(player2.dropCards);
        player2.addChild(player2.trashCards);
        this.table_bg.addChild(player2, 1);
        // this.sceneLayer.addChild(player1, 1);
        player2.chatView.setAnchorPoint(cc.p(0.0, 1.0));

        var player3 = new GamePlayer();
        player3.setPosition(this.table_bg.getContentSize().width/2 - 500, player1.y);
        player3.trashCards = new TrashCardOnTable(withPhom,80,POSITION_PHOM_LEFT);
        player3.trashCards.setCardPosition(player3.width / 2 +  (withPhom/2+50), player3.height / 2 - 15);

        player3.dropCards = new TrashCardOnTable(withPhom,80,POSITION_PHOM_LEFT);
        player3.dropCards.setCardPosition(player3.trashCards.x, player3.trashCards.y + 70);
        player3.addChild(player3.dropCards);
        player3.addChild(player3.trashCards);

        player3.chatView.setAnchorPoint(cc.p(0.0, 0.0));

        this.table_bg.addChild(player3, 1);



        this.playerView = [playerMe, player1, player2, player3];

    },
    initButton: function () {
        var danhbaiBt = new ccui.Button("game-danhbaiBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        danhbaiBt.setPosition(cc.winSize.width - 310*cc.winSize.screenScale, 46);
        this.sceneLayer.addChild(danhbaiBt);

        var xepBaiBt = new ccui.Button("game-xepbaiBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        xepBaiBt.setPosition(cc.winSize.width - 710*cc.winSize.screenScale, danhbaiBt.y);
        this.sceneLayer.addChild(xepBaiBt);

        var uBt = new ccui.Button("game-uBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        uBt.setPosition(cc.winSize.width - 510*cc.winSize.screenScale, danhbaiBt.y);
        this.sceneLayer.addChild(uBt);

        var drawBt = new ccui.Button("game-bocbaiBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        drawBt.setPosition(cc.winSize.width - 110*cc.winSize.screenScale, danhbaiBt.y);
        this.sceneLayer.addChild(drawBt);

        var startBt = new ccui.Button("game-startBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        startBt.setPosition(drawBt.getPosition());
        this.sceneLayer.addChild(startBt);

        var habaiBt = new ccui.Button("game-habaiBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        habaiBt.setPosition(cc.winSize.width - 510*cc.winSize.screenScale, danhbaiBt.y);
        this.sceneLayer.addChild(habaiBt);

        var anbaiBt = new ccui.Button("game-anbaiBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        anbaiBt.setPosition(habaiBt.x, habaiBt.y);
        this.sceneLayer.addChild(anbaiBt);

        var guibaiBt = new ccui.Button("game-guibaiBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        guibaiBt.setPosition(anbaiBt.getPosition());
        this.sceneLayer.addChild(guibaiBt);


        var thiz = this;
        startBt.addClickEventListener(function () {
            thiz.sendStartRequest();
        });
        drawBt.addClickEventListener(function () {
            thiz.sendDrawRequest();
        });
        danhbaiBt.addClickEventListener(function () {
            thiz.sendDanhBai();
        });
        xepBaiBt.addClickEventListener(function () {
            thiz.xepBai();
        });
        habaiBt.addClickEventListener(function () {
            thiz.sendHaBaiRequest();
        });

        anbaiBt.addClickEventListener(function () {
            thiz.sendAnBaiRequest();
        });

        uBt.addClickEventListener(function () {
            thiz.sendURequest();
        });

        guibaiBt.addClickEventListener(function () {
            thiz.sendGuiBaiRequest();
        });

        this.danhbaiBt = danhbaiBt;
        this.uBt = uBt;
        this.xepBaiBt = xepBaiBt;
        this.drawBt = drawBt;
        this.startBt = startBt;
        this.anbaiBt = anbaiBt;
        this.habaiBt = habaiBt;
        this.guibaiBt = guibaiBt;


        this.danhbaiBt.setScale(cc.winSize.screenScale);
        this.uBt.setScale(cc.winSize.screenScale);
        this.xepBaiBt.setScale(cc.winSize.screenScale);
        this.drawBt.setScale(cc.winSize.screenScale);
        this.startBt.setScale(cc.winSize.screenScale);
        this.anbaiBt.setScale(cc.winSize.screenScale);
        this.habaiBt.setScale(cc.winSize.screenScale);
        this.guibaiBt.setScale(cc.winSize.screenScale);

        this.allButton = [danhbaiBt, uBt, xepBaiBt, drawBt,
            startBt, anbaiBt, habaiBt, guibaiBt];
        this.hideAllButton();
    },
    hideAllButton: function () {

        for (var i = 0; i < this.allButton.length; i++)
            this.allButton[i].visible = false;
    },
    xepBai: function () {
        this.cardList.setTypeOder();
        this.cardList.reArrangeCards();
    },
    sendURequest: function () {
        this._controller.sendURequest();
    },
    sendAnBaiRequest: function () {
        this._controller.sendAnBaiRequest();
    },
    sendGuiBaiRequest: function () {
        var guibaiList = this.cardList.getCardSelected();
        var data = [];
        for (var i = 0; i < guibaiList.length; i++) {
            data.push(CardList.prototype.getCardIdWithRank(guibaiList[i].rank, guibaiList[i].suit));
        }
        this._controller.sendGuiBaiRequest(data);
    },
    sendHaBaiRequest: function () {
        var habaiList = this.cardList.getCardSelected();
        var data = [];
        for (var i = 0; i < habaiList.length; i++) {
            data.push(CardList.prototype.getCardIdWithRank(habaiList[i].rank, habaiList[i].suit));
        }
        this._controller.sendHaBaiRequest(data);
    },
    sendStartRequest: function () {
        this._controller.sendStartRequest();
    },
    sendDanhBai: function () {
        // var cardArr = [];
        // for (var i = 0; i< 8; i++){
        //     var card = CardList.prototype.getCardWithId(1);
        //     cardArr.push(card);
        // }
        // var cardArr2 = [];
        // for (var i = 0; i< 4; i++){
        //     var card = CardList.prototype.getCardWithId(i);
        //     cardArr2.push(card);
        // }
        // var cardArr3 = [];
        // for (var i = 0; i< 10; i++){
        //
        //     cardArr3.push(i);
        // }
        // for(var i = 0; i< this.allSlot.length; i++){
        //     cc.log("mobieeeeee" + i);
        //     this.allSlot[i].setVisible(true);
        //     this.allSlot[i].dropCards.addArrayCard(cardArr);
        //     this.allSlot[i].trashCards.addArrayCard(cardArr2);
        //     this.allSlot[i].setUsername("nguyencongvan");
        //     this.allSlot[i].setGold(10000);
        //     this.allSlot[i].setEnable(true);
        // };

        var cards = this.cardList.getCardSelected();
        if (cards.length > 0) {
            var cardId = CardList.prototype.getCardIdWithRank(cards[0].rank, cards[0].suit);
            this._controller.sendDanhBai(cardId);
        } else
            MessageNode.getInstance().show("Bạn phải chọn 1 quân bài");
    },
    sendDrawRequest: function () {
        this._controller.sendDrawRequest();
    },
    setStartBtVisible: function (visible) {
        this.startBt.visible = visible;
    },
    removeAllCards: function () {
        this.cardList.removeAll();
        if (this.playerView) {
            for (var i = 0; i < this.playerView.length; i++) {
                this.playerView[i].trashCards.removeAll();
                this.playerView[i].dropCards.removeAll();
            }
        }
    },
    setDeckVisible: function (visible) {
        this.drawDeck.visible = visible;
        this.drawDeckLabel.visible = visible;
    },
    setXepBaiBtVisible: function (visible) {
        this.xepBaiBt.visible = visible;
    }
});
