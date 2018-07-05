/**
 * Created by Quyet Nguyen on 7/25/2016.
 */

var CardSuit = CardSuit || {};
CardSuit.Spades = 0;
CardSuit.Clubs = 1;
CardSuit.Diamonds = 2;
CardSuit.Hearts = 3;

var s_card_suit = s_card_suit || [];
s_card_suit[CardSuit.Hearts] = "c";
s_card_suit[CardSuit.Diamonds] = "r";
s_card_suit[CardSuit.Clubs] = "t";
s_card_suit[CardSuit.Spades] = "b";

var Card = cc.Sprite.extend({
    ctor: function (rank, suit) {
        this.canTouch = true;
        this.rank = rank;
        this.suit = suit;
        this._super("#" + rank + s_card_suit[suit] + ".png");
        this.touchRect = cc.rect(0, 0, this.getContentSize().width, this.getContentSize().height);
        this.cardDistance = this.getContentSize().width;

        this.origin = cc.p();
        this.isTouched = false;
        this._cardSelected = false;
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
            onTouchEnded: function (touch, event) {
                thiz.onTouchEnded(touch, event);
            },
            onTouchMoved: function (touch, event) {
                thiz.onTouchMoved(touch, event);
            }
        }, this);
    },

    onExit: function () {
        this._super();
        cc.eventManager.removeListeners(this);
    },

    moveToOriginPosition: function () {
        if (!this.isTouched) {
            this.stopAllActions();
            var thiz = this;
            var beforeMove = new cc.CallFunc(function () {
                thiz.getParent().reorderChild(thiz, thiz.cardIndex + 100);
            });
            var afterMove = new cc.CallFunc(function () {
                thiz.getParent().reorderChild(thiz, thiz.cardIndex);
            });
            var move = new cc.MoveTo(0.2, cc.p(this.origin.x, this.origin.y));
            this.runAction(new cc.Sequence(beforeMove, move, afterMove));

            this._cardSelected = false;
        }
    },
    setSelected: function (selected, force) {
        if (force) {
            this.stopAllActions();
            this.setPosition(this.origin);
        }

        this._cardSelected = selected;
        if (selected) {
            this.y = this.origin.y + 50;
        }
        else {
            this.y = this.origin.y;
        }

    },
    isSelected: function () {
        // return (this.y > this.origin.y);
        return this._cardSelected;
    },
    onTouchBegan: function (touch, event) {
        if (this.canTouch && !this.isTouched) {
            var p = this.convertToNodeSpace(touch.getLocation());
            // var rect = this.getBoundingBox();
            if (cc.rectContainsPoint(this.touchRect, p)) {
                this.isTouched = true;
                this.isMoved = false;
                this.preTouchPoint = touch.getLocation();
                return true;
            }
        }
        return false;
    },
    onTouchEnded: function (touch, event) {
        this.isTouched = false;

        if (this.isMoved) {
            this.moveToOriginPosition();
            this.getParent().reorderChild(this, this.cardIndex);
        }
        else {
            // if(this.y > this.origin.y){
            //     this.y = this.origin.y;
            // }
            // else{
            //     this.y = this.origin.y + 50.0;
            // }

            this.setSelected(!this._cardSelected);
            this.getParent().onSelected(this, this.isSelected());
        }
    },
    onTouchMoved: function (touch, event) {
        var p = touch.getLocation();
        if (!this.isMoved) {
            if (cc.pDistance(this.preTouchPoint, p) < 5.0) {
                return;
            }
            else {
                this.getParent().reorderChild(this, 200);
                this.isMoved = true;
            }
        }

        this.x += (p.x - this.preTouchPoint.x)/this.getParent().getScale();
        this.y += (p.y - this.preTouchPoint.y)/this.getParent().getScale();
        this.preTouchPoint = p;

        var dx = this.x - this.origin.x;
        if (Math.abs(dx) > this.cardDistance) {
            if (dx > 0) {
                this.getParent().swapCardRight(this.cardIndex);
            }
            else {
                this.getParent().swapCardLeft(this.cardIndex);
            }
        }
    }
});

var CardList = cc.Node.extend({
    ctor: function (size) {
        this.canTouch = true;

        this._super();
        this.cardList = [];
        this.setContentSize(size);
        this.setAnchorPoint(cc.p(0.5, 0.5));
    },
    onSelected: function (card, isSelected) {

    },

    removeCardById: function (id) {
        var card = this.getCardWithId(id);
        for (var i = 0; i < this.cardList.length; i++)
            if (this.cardList[i].rank == card.rank && this.cardList[i].suit == card.suit) {
                var retVal = this.cardList[i];
                retVal.setPosition(this.convertToWorldSpace(retVal.getPosition()));
                retVal.retain();
                retVal.removeFromParent(true);
                retVal.canTouch = false;
                this.cardList.splice(i, 1);
                return retVal;
            }
        cc.log("card id " + id + " " + JSON.stringify(card));
        return null;
    },
    getCardWithId: function (cardId) {
        var rankCard = (cardId % 13) + 3;
        if (rankCard > 13) {
            rankCard -= 13;
        }
        return {
            rank: rankCard,
            suit: Math.floor(cardId / 13)
        };
    },
    getCardIdWithRank: function (rank, suit) {
        var rankCard = rank - 3;
        if (rankCard < 0) {
            rankCard = 13 + rankCard;
        }
        return ((suit * 13) + rankCard);
    },

    reArrangeCards: function (sortFunc) {
        if (!sortFunc) {
            this.cardList.sort(function (a, b) {
                return a.rank - b.rank;
            });
        } else {
            this.cardList.sort(sortFunc);
        }
        this.reOrder();
    },

    reOrder: function () {
        if (this.cardList.length > 0) {
            var width = this.cardSize.width * this.cardList.length;
            if (width > this.getContentSize().width) {
                width = this.getContentSize().width;
            }
            var dx = width / this.cardList.length;
            var x = this.getContentSize().width / 2 - width / 2 + dx / 2;
            var y = this.getContentSize().height / 2;
            for (var i = 0; i < this.cardList.length; i++) {
                var card = this.cardList[i];
                card.origin = cc.p(x, y);
                card.cardIndex = i;
                card.cardDistance = dx;
                this.reorderChild(card, i);
                card.moveToOriginPosition();
                x += dx;
            }
        }
    },
    reOrderWithoutAnimation: function () {
        if (this.cardList.length > 0) {
            var width = this.cardSize.width * this.cardList.length;
            if (width > this.getContentSize().width) {
                width = this.getContentSize().width;
            }
            var dx = width / this.cardList.length;
            var x = this.getContentSize().width / 2 - width / 2 + dx / 2;
            var y = this.getContentSize().height / 2;
            for (var i = 0; i < this.cardList.length; i++) {
                var card = this.cardList[i];
                card.origin = cc.p(x, y);
                card.cardIndex = i;
                card.cardDistance = dx;
                this.reorderChild(card, i);
                //card.moveToOriginPosition();
                card.setPosition(x, y);
                x += dx;
            }
        }
    },
    onEnter: function () {
        this._super();
        this.deckPoint = this.convertToNodeSpace(cc.p(cc.winSize.width / 2, cc.winSize.height / 2));
    },
    addNewCard: function (cardId) {
        for (var i = 0; i < cardId.length; i++) {
            var card = new Card(cardId[i].rank, cardId[i].suit);
            this.addCard(card);
        }
        this.reOrderWithoutAnimation();
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
    setTouchEnable: function (touch) {
        this.canTouch = touch;
        for (var i = 0; i < this.cardList.length; i++) {
            this.cardList[i].canTouch = this.canTouch;
        }
    },
    dealCards: function (cards, animation) {
        /*fix dealCards when reconnect*/
        if(!this.deckPoint){
            var thiz = this;
            setTimeout(function () {
                thiz.dealCards(cards,animation);
            }, 0.1);
            return;
        }

        this.removeAll();
        for (var i = 0; i < cards.length; i++) {
            var card = new Card(cards[i].rank, cards[i].suit);
            if (animation) {
                card.setPosition(this.deckPoint);
            }
            this.addCard(card);
        }

        var width = this.cardSize.width * this.cardList.length;
        if (width > this.getContentSize().width) {
            width = this.getContentSize().width;
        }
        var dx = width / this.cardList.length;
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
    containsWithCard: function (card) {
        var cardRect = card.getCardBounding();

        for (var i = 0; i < this.cardList.length; i++) {
            if (this.cardList[i] != card) {
                var rect = this.cardList[i].getCardBounding();
                if (cc.rectIntersectsRect(cardRect, rect)) {
                    return this.cardList[i];
                }
            }
        }
        return null;
    },
    swapCardLeft: function (index) {
        if (index > 0) {
            var cardMove = this.cardList[index];
            var cardSwap = this.cardList[index - 1];
            this.swapCard(cardMove, cardSwap);
        }
    },
    swapCardRight: function (index) {
        if (index < this.cardList.length - 1) {
            var cardMove = this.cardList[index];
            var cardSwap = this.cardList[index + 1];
            this.swapCard(cardMove, cardSwap);
        }
    },
    swapCard: function (card1, card2) {
        var _origin = card1.origin;
        var _cardIndex = card1.cardIndex;

        card1.origin = card2.origin;
        card1.cardIndex = card2.cardIndex;

        card2.origin = _origin;
        card2.cardIndex = _cardIndex;

        card1.moveToOriginPosition();
        card2.moveToOriginPosition();

        this.cardList[card1.cardIndex] = card1;
        this.cardList[card2.cardIndex] = card2;
    },
    removeCard: function (cards) {
        var arrCard = [];
        for (var i = 0; i < cards.length; i++) {
            var rank = cards[i].rank;
            var suit = cards[i].suit;
            for (var j = 0; j < this.cardList.length; j++) {
                var card = this.cardList[j];
                if (card.rank == rank && card.suit == suit) {
                    var p = this.convertToWorldSpace(card.getPosition());
                    card.setPosition(p);
                    card.canTouch = false;
                    card.retain();
                    card.removeFromParent(true);
                    arrCard.push(card);
                    this.cardList.splice(j, 1);
                    break;
                }
            }
        }
        return arrCard;
    },
    removeAll: function () {
        this.removeAllChildren(true);
        this.cardList = [];
    },
    getCardAtIndex: function (index) {
        return this.cardList[index];
    },
    getCardByRank: function (rank, suit) {

    },
    getCardSelected: function () {
        var cardSelected = [];
        for (var i = 0; i < this.cardList.length; i++) {
            if (this.cardList[i].isSelected()) {
                cardSelected.push(this.cardList[i]);
            }
        }
        return cardSelected;
    }
});

var CardOnTable = cc.Node.extend({
    ctor: function () {
        this._super();
        this.cardList = [];
        this.cardSize = null;
        this.cardScale = 0.5;
        this.cardPosition = cc.p(cc.winSize.width / 2, cc.winSize.height / 2);
    },
    moveOldCard: function () {
        if (this.cardList.length == 2) {
            var arr = this.cardList[0];
            for (var i = 0; i < arr.length; i++) {
                arr[i].removeFromParent(true);
            }
            this.cardList.splice(0, 1);
        }
        if (this.cardList.length == 1) {
            var arr = this.cardList[0];
            for (var i = 0; i < arr.length; i++) {
                arr[i].y += 40.0;
                arr[i].setColor(cc.color(100, 100, 100));
            }
        }
    },
    addNewCardList: function (cards, startPosition) {
        //add
        var arrCard = [];
        for (var i = 0; i < cards.length; i++) {
            var card = new cc.Sprite("#" + cards[i].rank + s_card_suit[cards[i].suit] + ".png");
            card.setPosition(startPosition);
            arrCard.push(card);
        }
        this.addCard(arrCard);
        return arrCard;
    },
    addCardReconnect: function (cards) {
        var arrCard = [];
        for (var i = 0; i < cards.length; i++) {
            var card = new cc.Sprite("#" + cards[i].rank + s_card_suit[cards[i].suit] + ".png");
            arrCard.push(card);
        }
        this.addCardWithoutAnimation(arrCard);
        return arrCard;
    },
    addCard: function (cards) {
        var animationDuration = 0.3;
        if (!this.cardSize) {
            this.cardSize = cards[0].getContentSize();
        }
        this.cardList.push(cards);

        var dx = this.cardSize.width * this.cardScale;
        var width = cards.length * dx;
        var x = this.cardPosition.x - width / 2 + dx / 2;

        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            var moveAction = new cc.MoveTo(animationDuration, cc.p(x, this.cardPosition.y));
            var scaleAction = new cc.ScaleTo(animationDuration, 0.5);
            card.runAction(new cc.EaseBackIn(new cc.Spawn(moveAction, scaleAction)));
            //card.setScale(card.getScale() * this.cardScale);
            var rotate = 20.0 - Math.random() * 40.0;
            card.setRotation(rotate);
            this.addChild(card, 0);
            x += dx;
        }
    },
    addCardWithoutAnimation: function (cards) {
        if (!this.cardSize) {
            this.cardSize = cards[0].getContentSize();
        }
        this.cardList.push(cards);

        var dx = this.cardSize.width * this.cardScale;
        var width = cards.length * dx;
        var x = this.cardPosition.x - width / 2 + dx / 2;

        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            card.setPosition(x, this.cardPosition.y);
            card.setScale(0.5);
            var rotate = 20.0 - Math.random() * 40.0;
            card.setRotation(rotate);
            this.addChild(card, 0);
            x += dx;
        }
    },

    removeAll: function () {
        this.cardList = [];
        this.removeAllChildren(true);
    }
});