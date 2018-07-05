/**
 * Created by Quyet Nguyen on 7/25/2016.
 */


// var NoHuEffect = cc.ParticleSystem.extend ({
//     ctor: function ()
//     {
//         this._super();
//         var thizzz = this;
//         if(cc.ParticleSystem.prototype.initWithTotalParticles.call(thizzz, 300))
//         {
//             //     // duration
//             thizzz.setDuration(0.1);
//
//             thizzz.setEmitterMode(cc.ParticleSystem.MODE_GRAVITY);
//
//             // Gravity Mode: gravity
//             thizzz.setGravity(cc.p(0, 10));
//
//             // Gravity Mode: speed of particles
//             thizzz.setSpeed(70);
//             thizzz.setSpeedVar(40);
//
//             // Gravity Mode: radial
//             thizzz.setRadialAccel(0);
//             thizzz.setRadialAccelVar(0);
//
//             // Gravity Mode: tangential
//             thizzz.setTangentialAccel(0);
//             thizzz.setTangentialAccelVar(0);
//
//             // angle
//             thizzz.setAngle(90);
//             thizzz.setAngleVar(360);
//
//             // emitter position
//             var winSize = cc.director.getWinSize();
//             thizzz.setPosition(winSize.width / 2, winSize.height / 2);
//             thizzz.setPosVar(cc.p(0,0));
//
//             // life of particles
//             thizzz.setLife(5.0);
//             thizzz.setLifeVar(2);
//
//             // size, in pixels
//             thizzz.setStartSize(15.0);
//             thizzz.setStartSizeVar(10.0);
//             thizzz.setEndSize(cc.ParticleSystem.START_SIZE_EQUAL_TO_END_SIZE);
//
//             // emits per second
//             thizzz.setEmissionRate(this.getTotalParticles() / this.getDuration());
//
//             // color of particles
//             // thizzz.setStartColor(cc.color(0, 0, 0, 255));
//             // thizzz.setStartColorVar(cc.color(0, 0, 0, 255));
//             // thizzz.setEndColor(cc.color(255, 255, 255, 255));
//             // thizzz.setEndColorVar(cc.color(255, 255, 255, 255));
//
//             // additive
//             thizzz.setBlendAdditive(false);
//         }
//     },
//
// });


var BaCayCardList = CardList.extend({
    dealCards: function (cards, animation) {
        this._super(cards, animation);
        for (var i = 0; i < this.cardList.length; i++) {
            this.cardList[i].setSpriteFrame("gp_card_up.png");
            // override select event to reveal card
            this.overrideReveal(this.cardList[i]);
        }
    },

    overrideReveal: function (card) {
        card.setSelected = function (selected, force) {
            if (force) {
                card.stopAllActions();
                card.setPosition(card.origin);
            }
            if (selected == true) {
                card.reveal();
            }
        };
        card.reveal = function () {
            if (card.revealed)
                return;
            card.revealed = true;
            var duration = 0.1;
            var oldScaleX = card.scaleX;
            var scaleDown = new cc.ScaleTo(duration, 0.0, card.scaleY);
            var revealAction = new cc.CallFunc(function () {
                card.setSpriteFrame("" + card.rank + s_card_suit[card.suit] + ".png");
            });
            var scaleUp = new cc.ScaleTo(duration, oldScaleX, card.scaleY);

            card.runAction(new cc.Sequence(scaleDown, revealAction, scaleUp));
            SoundPlayer.playSound("open_card");
        }
    },

    addCard: function (card) {
        this._super(card);
        this.overrideReveal(card);
    },

    revealAll: function (cards) {
        if (cards) {
            for (var i = 0; i < cards.length; i++) {
                var card = CardList.prototype.getCardWithId(cards[i]);

                this.cardList[i].rank = card.rank;
                this.cardList[i].suit = card.suit;
            }
        }
        for (var j = 0; j < this.cardList.length; j++)
            this.cardList[j].reveal();
    }
});

var BaCay = IGameScene.extend({
    ctor: function () {
        this._super();
        this.initScene();
        this.timeRemaining = 0;
        this.timeInterval = null;
    },

    initScene: function () {
        var table_bg = new cc.Sprite("res/gp_table.png");
        table_bg.setPosition(cc.winSize.width / 2, 320);
        table_bg.setScale(cc.winSize.screenScale);
        this.sceneLayer.addChild(table_bg);
        this.tabe_bg = table_bg;
        this.initPlayer();
        this.initButton();

        var stateString = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "", cc.TEXT_ALIGNMENT_CENTER);
        stateString.setColor(cc.color("#8e9bff"));
        stateString.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        this.sceneLayer.addChild(stateString);
        this.stateString = stateString;

        var huThuongBg = new ccui.Button("bacayhuthuong_bg.png", "","",ccui.Widget.PLIST_TEXTURE);
        huThuongBg.setScale9Enabled(true);//
        huThuongBg.setCapInsets(cc.rect(15, 15, 4, 4));
        huThuongBg.setContentSize(cc.size(322, 47));
        huThuongBg.addClickEventListener(function () {
            var huMau = new HistoryNoHu(false);
            huMau.show();
        });
        huThuongBg.setPosition(cc.winSize.width / 2, 280);
        this.sceneLayer.addChild(huThuongBg);

        var huThuongLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "HŨ BA CÂY : ");
        huThuongLabel.setPosition(huThuongBg.x - 75, huThuongBg.y);
        huThuongLabel.setColor(cc.color("#c1ceff"));
        this.sceneLayer.addChild(huThuongLabel);

        var huThuongValueLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "");
        huThuongValueLabel.setPosition(huThuongBg.x + 60, huThuongBg.y);
        huThuongValueLabel.setColor(cc.color("#ffde00"));
        this.sceneLayer.addChild(huThuongValueLabel);
        this.huThuongValueLabel = huThuongValueLabel;

        var timeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_40, "", cc.TEXT_ALIGNMENT_CENTER, 500);
        // timeLabel.setAnchorPoint(cc.p(0.5, 0.5));
        timeLabel.setScale(1.5);
        timeLabel.setPosition(cc.winSize.width/2, 420);
        this.sceneLayer.addChild(timeLabel);
        this.timeLabel = timeLabel;
/*
        thizzzzze = this;

        this.runAction(new cc.Sequence(new cc.DelayTime(2), new cc.CallFunc((function () {
            // var _emitter = ParticleExplosion.create();
            // // _emitter.setTexture(cc.TextureCache.addImage("bacayhuthuong_bg.png"));
            // // _emitter.setPosition(cc.winSize/2);
            //
            // thizzzzze._emitter = new cc.ParticleExplosion();
            // thizzzzze.sceneLayer.addChild(thizzzzze._emitter, 10);
            //
            // thizzzzze._emitter.texture = cc.textureCache.addImage("res/icon_gold_coin.png");
            // thizzzzze._emitter.shapeType = cc.ParticleSystem.STAR_SHAPE;
            // // thizzzzze._emitter.setColor(cc.Color(255, 255, 255, 255));
            // // color of particles
            // thizzzzze._emitter.setStartColor(cc.color(255, 255, 255, 255));
            // thizzzzze._emitter.setStartColorVar(cc.color(255, 255, 255, 255));
            // thizzzzze._emitter.setEndColor(cc.color(255, 255, 255, 255));
            // thizzzzze._emitter.setEndColorVar(cc.color(255, 255, 255, 255));
            //
            // thizzzzze._emitter.setAutoRemoveOnFinish(true);

            var _emitter = new NoHuEffect();
            thizzzzze.sceneLayer.addChild(_emitter, 10);

            _emitter.texture = cc.textureCache.addImage("res/icon_gold_coin.png");
            // _emitter.shapeType = cc.ParticleSystem.STAR_SHAPE;
            _emitter.setAutoRemoveOnFinish(true);

        }))));
        */
    },

    initPlayer: function () {

        var playerMe = new GamePlayerMe();
        playerMe.setPosition(cc.winSize.width/2, 50.0);

        playerMe.cardList = new BaCayCardList(cc.size(240, 100));
        playerMe.cardList.setPosition(cc.winSize.width / 2, 150.0);
        playerMe.resultLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_30, "", cc.TEXT_ALIGNMENT_CENTER);
        playerMe.resultLabel.setColor(cc.color("#8e9bff"));
        playerMe.resultLabel.setPosition(playerMe.cardList.x, playerMe.cardList.y + 80);
        playerMe.assetChangePos = cc.p(playerMe.avt.x, playerMe.avt.y - 30);
        playerMe.setIsOwner(false);
        this.sceneLayer.addChild(playerMe, 1);
        this.sceneLayer.addChild(playerMe.cardList, 2);
        this.sceneLayer.addChild(playerMe.resultLabel, 2);

        var player1 = new GamePlayer();
        player1.setPosition(cc.winSize.width - 144.0 * cc.winSize.screenScale, 240.0 * cc.winSize.screenScale);
        this.sceneLayer.addChild(player1, 1);

        var player2 = new GamePlayer();
        player2.setPosition(cc.winSize.width - 180.0 * cc.winSize.screenScale, cc.winSize.height - 270.00 / cc.winSize.screenScale);
        this.sceneLayer.addChild(player2, 1);

        var player3 = new GamePlayer();
        player3.setPosition(this.tabe_bg.x, this.tabe_bg.y + 250);
        this.sceneLayer.addChild(player3, 1);

        var player4 = new GamePlayer();
        player4.setPosition(180.0 * cc.winSize.screenScale, player2.y);
        this.sceneLayer.addChild(player4, 1);

        var player5 = new GamePlayer();
        player5.setPosition(144.0 * cc.winSize.screenScale, player1.y);
        this.sceneLayer.addChild(player5, 1);

        this.playerView = [playerMe, player1, player2, player3, player4, player5];

        for (var i = 1; i < this.playerView.length; i++) {
            var cardList = new BaCayCardList(cc.size(240, 100));
            cardList.setPosition(this.playerView[i].avt.x, 30);
            cardList.setScale(0.6);
            cardList.setTouchEnable(false);
            this.playerView[i].infoLayer.addChild(cardList,2);
            this.playerView[i].cardList = cardList;

            var resultLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "", cc.TEXT_ALIGNMENT_LEFT);
            resultLabel.setColor(cc.color("#8e9bff"));
            resultLabel.setAnchorPoint(cc.p(1,0.5));
            resultLabel.setPosition(this.playerView[i].avt.x - 45, this.playerView[i].avt.y);

            if(i == 4 || i == 5)
            {
                resultLabel.setAlignment(cc.TEXT_ALIGNMENT_RIGHT);
                resultLabel.setAnchorPoint(cc.p(0,0.5));
                resultLabel.setPosition(this.playerView[i].avt.x + 45, this.playerView[i].avt.y);
            }

            this.playerView[i].infoLayer.addChild(resultLabel);
            this.playerView[i].resultLabel = resultLabel;

            this.playerView[i].assetChangePos = cc.p(this.playerView[i].avt.x, this.playerView[i].avt.y - 30);
        }
    },

    initButton: function () {
        var thiz = this;
        var revealBt = new ccui.Button("game-lathetBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        revealBt.setPosition(cc.winSize.width - 420 * cc.winSize.screenScale, 46);
        this.sceneLayer.addChild(revealBt);
        this.revealBt = revealBt;
        this.setRevealBtVisible(false);
        this.revealBt.addClickEventListener(function () {
            thiz.onRevealBtClick();
        });
    },

    playResultSound: function (winner) {
        SoundPlayer.playSound(winner == PlayerMe.username ? "winning" : "losing");
    },

    onRevealBtClick: function () {
        this._controller.sendRevealCard();
    },

    //seconds
    showTimeRemaining: function (timeRemaining) {
        if (timeRemaining > 0) {
            this.timeRemaining = timeRemaining;
            if (this.timeInterval) {
                clearInterval(this.timeInterval)
            }
            var thiz = this;
            thiz.timeLabel.setString(timeRemaining);
            thiz.timeRemaining--;
            this.timeInterval = setInterval(function () {
                if (thiz.timeRemaining <= 0){
                    thiz.timeLabel.setString("");
                    clearInterval(thiz.timeInterval);
                }else{
                    thiz.timeLabel.setString(thiz.timeRemaining);
                    thiz.timeRemaining--;
                }
            }, 1000);
        }else{
            this.timeRemaining = 0;
            this.timeLabel.setString("");
        }
    },

    // performAssetChange: function (amount, goldAfter, username) {
    //     var slot = this.getSlotByUsername(username);
    //     var changeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "");
    //     changeLabel.setString(amount > 0 ? ("+" + cc.Global.NumberFormat1(amount)) : cc.Global.NumberFormat1(amount));
    //     changeLabel.setColor(cc.color(amount > 0 ? "#ffde00" : "#c52829"));
    //     changeLabel.setPosition(slot.assetChangePos);
    //     // if (username == PlayerMe.username)
    //     //     this.sceneLayer.addChild(changeLabel);
    //     // else
    //         slot.addChild(changeLabel);
    //
    //     slot.setGold(goldAfter);
    //     var moveAction = new cc.MoveTo(1.0, slot.assetChangePos.x, slot.assetChangePos.y + 50);
    //     var removeAction = new cc.CallFunc(function () {
    //         changeLabel.removeFromParent(true);
    //     });
    //     changeLabel.runAction(new cc.Sequence(moveAction, removeAction));
    // },

    revealCards: function (cards, username) {
        var slot = this.getSlotByUsername(username);
        if (slot.revealed)
            return;
        slot.cardList.revealAll(username == PlayerMe.username ? null : cards);
        slot.revealed = true;
    },

    setResultString: function (str, usr) {
        var slot = this.getSlotByUsername(usr);
        slot.resultLabel.setString(str);
    },

    setRevealBtVisible: function (isVisible) {
        this.revealBt.visible = isVisible;
    },

    initController: function () {
        this._controller = new BaCayController(this);
    },

    dealCard: function (cards) {
        var cardArray = [];
        for (var i = 0; i < cards.length; i++)
            cardArray.push(CardList.prototype.getCardWithId(cards[i]));
        this.playerView[0].cardList.dealCards(cardArray, true);

        for (var j = 1; j < this.playerView.length; j++) // dummy cards for other players
            if (this.playerView[j].username != "")
                this.playerView[j].cardList.dealCards(cardArray, true);
    },

    reappearCard: function (cards) {
        for (var j = 0; j < this.playerView.length; j++)
            if (this.playerView[j].username != "") {
                for (var i = 0; i < cards.length; i++) {
                    var card = CardList.prototype.getCardWithId(cards[i]);
                    var cardObject = new Card(card.rank, card.suit);
                    cardObject.setSpriteFrame("gp_card_up.png");
                    this.playerView[j].cardList.addCard(cardObject);
                }
                this.playerView[j].cardList.reOrderWithoutAnimation();
            }
    },

    resetBoard: function () {
        for (var i = 0; i < this.playerView.length; i++) {
            this.playerView[i].cardList.removeAll();
            this.playerView[i].resultLabel.setString("");
            this.playerView[i].revealed = false;
        }
    },

    setStateString: function (str) {
        this.stateString.setString(str);
    },

    creatCardListForOther: function(cards) {
        for (var j = 0; j < this.playerView.length; j++)
            if (this.playerView[j].username != PlayerMe.username) {
                for (var i = 0; i < cards.length; i++) {
                    var card = CardList.prototype.getCardWithId(cards[i]);
                    var cardObject = new Card(card.rank, card.suit);
                    cardObject.setSpriteFrame("gp_card_up.png");
                    this.playerView[j].cardList.addCard(cardObject);
                }
                this.playerView[j].cardList.reOrderWithoutAnimation();
            }
    },
    showJackpot: function (nameNo,money) {
        if(PlayerMe.username != nameNo)
            return;

        var textNo = "Chúc mừng " + nameNo + " nổ hũ \n " + cc.Global.NumberFormat1(parseInt(money));
        var lblText = new cc.LabelTTF(textNo,cc.res.font.Roboto_CondensedBold,45, cc.size(500, 0), cc.TEXT_ALIGNMENT_CENTER);
        lblText.setColor(cc.color(255,245,91,255));
        // lblText.setAlignment(cc.TEXT_ALIGNMENT_CENTER);
        lblText.enableStroke(cc.color(223,28,42,255),3);
        lblText.setPosition(cc.winSize.width/2, cc.winSize.height/2 + 70);
        lblText.setVisible(false);
        this.addChild(lblText);
        var thiz = this;
        this.runAction(new cc.Sequence(
            new cc.DelayTime(1.5),
            new cc.CallFunc(function () {
                lblText.setVisible(true);
                var layer = new JackpotLayer();
                layer.show();
            }),
            new cc.DelayTime(4),
            new cc.CallFunc(function () {
                lblText.removeFromParent(true);
            })
        ));

    },
});