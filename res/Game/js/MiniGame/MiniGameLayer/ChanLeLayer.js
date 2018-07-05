/**
 * Created by QuyetNguyen on 12/20/2016.
 */
//var s_ChanLeLayer = null;
var s_miniGame_chip_position = s_miniGame_chip_position || [
    {x: 112, y: 365},
    {x: 91, y: 262},
    {x: 115, y: 154},
    {x: 192, y: 108},
    {x: 302, y:100}

];

var s_mntx_result_position = s_mntx_result_position || [
    {x: 60, y: 61},
    {x: 97, y: 48},
    {x: 41, y: 97},
    {x: 86, y: 86},
    {x: 62, y: 113},
    {x: 96, y: 125},
    {x: 125, y: 106},
    {x: 122, y: 67}
];

var s_money_betEx = s_money_betEx || [1000, 10000, 100000, 1000000, 10000000];
var ChanLeLayer = MiniGamePopup.extend({
    ctor: function () {
        this._super();
       // this._customAction = new cc.ActionManager();
        this._isUpdateTime = false;

        this.jackpotLabel.setVisible(false);
        this.baseCardHeight = 0;

        this.gameType = GameType.MiniGame_ChanLe;

        var thiz = this;
        this.moneyBet = 0;

        var bg = new cc.Sprite("#mm_bg_taixiu.png");
        bg.setAnchorPoint(cc.p(0, 0));
        this.setContentSize(bg.getContentSize());
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.addChild(bg);
        this.bg = bg;
        this.historyButton.removeFromParent(true);
        this.historyButton.setPosition(cc.p(918, 232));
        bg.addChild(this.historyButton);
        this.historyButton.addClickEventListener(function () {
            var rank = new HistoryChanLe();
            rank.showWithAnimationScale();
        });
        this.tutorialButton.removeFromParent(true);
        this.tutorialButton.setPosition(cc.p(918, 152));
        bg.addChild(this.tutorialButton);

        var bg_title = new cc.Sprite("#mntx_title.png");
        bg_title.setPosition(cc.p(bg_title.getContentSize().width/2 + 30, bg.getContentSize().height-10));
        bg.addChild(bg_title,-1);

        var btnRank = new ccui.Button("mntx_btn_bxh.png","","",ccui.Widget.PLIST_TEXTURE);

        btnRank.setPosition(cc.p(909, 309));
        btnRank.addClickEventListener(function () {

            var rank = new ThongKeChanLe();
            rank.showWithAnimationScale();

        });
        bg.addChild(btnRank);

        var gameIdLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "ID : 1231231233", cc.TEXT_ALIGNMENT_LEFT);
        gameIdLabel.setColor(cc.color(191, 242, 255,255));
        // gameIdLabel.setScale(0.8);
        gameIdLabel.setPosition(745, 150);
        this.addChild(gameIdLabel);
        this.gameIdLabel = gameIdLabel;

        // var coinIcon = new cc.Sprite("#caothap_coinIcon.png");
        // coinIcon.setPosition(549, 90);
        // this.addChild(coinIcon);

        var phoneBg = new ccui.Scale9Sprite("home-text-bg.png", cc.rect(12,12,4,4));
        phoneBg.setPreferredSize(cc.size(247, 55));
        phoneBg.setPosition(cc.p(513, 90));
        bg.addChild(phoneBg);

        this.moneyTF = new newui.TextField(cc.size(240, 55), cc.res.font.Roboto_Condensed_30);
        this.moneyTF.setPlaceHolder("Chọn mức cược");
        // this.phoneText.setDelegate()
        this.moneyTF.setTextColor(cc.color(255,255,255));
        this.moneyTF.setPlaceHolderColor(cc.color(190, 240, 253,255));
       // this.moneyTF.setMaxLength(30);
        this.moneyTF.setPosition(cc.p(513, 90));
        bg.addChild(this.moneyTF,1);
        this.moneyTF.setTextChangeListener(function (type, newText) {
            if(newText === ""){
                return false;
            }
            var numberText = newText.replace(/[.,]/g,'');


            if(cc.Global.IsNumber(numberText)){

                    if(parseInt(numberText)> PlayerMe.gold){
                        numberText = PlayerMe.gold.toString();
                    }
                    thiz.moneyTF.setText(cc.Global.NumberFormat1(parseInt(numberText)));
                    thiz.moneyBet = parseInt(numberText);


            }
            return true;
        });

        this._boudingRect = cc.rect(30, 47, 930, 510);

        var btnXoa = new ccui.Button("mntx_btn_xoa.png","","",ccui.Widget.PLIST_TEXTURE);

        btnXoa.setPosition(cc.p(766, 89));
        btnXoa.addClickEventListener(function () {
            thiz.setMoneyBet(0);
            thiz.moneyTF.setText("");
        });
        bg.addChild(btnXoa);
        this.gameState = -2;
        var btnTai = new ccui.Button("mntx_btn_tai.png","","",ccui.Widget.PLIST_TEXTURE);

        btnTai.setPosition(cc.p(734, 274));
        btnTai.addClickEventListener(function () {
            if(thiz.moneyBet<=0)
            {
                MessageNode.getInstance().show("Bạn chưa chọn mức cược");
            }
            else if(thiz.moneyBet < 1000){
                MessageNode.getInstance().show("Mức cược tối thiểu là 1,000 vàng");
            }

            else if(thiz.gameState == 1) {
                    thiz._controller.sendBetTaiXiu(1, thiz.moneyBet);
            }


        });
        this.setActiveBt(btnTai,false);
        this.btnTai = btnTai;
        bg.addChild(btnTai);
        var btnXiu = new ccui.Button("mntx_btn_xiu.png","","",ccui.Widget.PLIST_TEXTURE);

        btnXiu.setPosition(cc.p(288, 274));
        btnXiu.addClickEventListener(function () {

            if(thiz.moneyBet<=0)
            {
                MessageNode.getInstance().show("Bạn chưa chọn mức cược");
            }
            else if(thiz.moneyBet < 1000){
                MessageNode.getInstance().show("Mức cược tối thiểu là 1,000 vàng");
            }
            else if(thiz.gameState == 1){
                    thiz._controller.sendBetTaiXiu(2,thiz.moneyBet);
            }
        });
        bg.addChild(btnXiu);
        this.btnXiu = btnXiu;
        this.setActiveBt(btnXiu,false);

        var lblNumTai = new cc.LabelTTF("", cc.res.font.Roboto_Condensed, 20);
        lblNumTai.setPosition(105,29);
        lblNumTai.setAnchorPoint(1,0.5);
        lblNumTai.setColor(cc.color(1, 79, 174,255));
        btnTai.addChild(lblNumTai);

        var lblNumXiu = new cc.LabelTTF("", cc.res.font.Roboto_Condensed, 20);
        lblNumXiu.setPosition(105,29);
        lblNumXiu.setAnchorPoint(1,0.5);
        lblNumXiu.setColor(cc.color(180, 47, 53,255));
        btnXiu.addChild(lblNumXiu);
        this.lblNumXiu = lblNumXiu;
        this.lblNumTai = lblNumTai;

        var lblTotalTai = new  cc.LabelTTF ("", cc.res.font.Roboto_Condensed, 20);
        lblTotalTai.setColor(cc.color(191, 242, 255,255));
        lblTotalTai.setPosition(btnTai.getPositionX(), 368);
        bg.addChild(lblTotalTai);
        this.lblTotalTai = lblTotalTai;

        var lblTotalXiu =new cc.LabelTTF ("", cc.res.font.Roboto_Condensed, 20);
        lblTotalXiu.setColor(cc.color(191, 242, 255,255));
        lblTotalXiu.setPosition(btnXiu.getPositionX(), 368);
        bg.addChild(lblTotalXiu);
        this.lblTotalXiu = lblTotalXiu;


        var lblTai =new cc.LabelTTF ("", cc.res.font.Roboto_Condensed, 20);
        lblTai.setColor(cc.color(191, 242, 255,255));
        lblTai.setPosition(btnTai.getPositionX(), 180);
        bg.addChild(lblTai);
        this.lblTai = lblTai;


        var lblXiu = new cc.LabelTTF ("", cc.res.font.Roboto_Condensed, 20);
        lblXiu.setColor(cc.color(191, 242, 255,255));
        lblXiu.setPosition(btnXiu.getPositionX(), 180);
        bg.addChild(lblXiu);
        this.lblXiu = lblXiu;

        var wgResuft = new ccui.Widget();
        this.wgResuft = wgResuft;
        wgResuft.setContentSize(568,64);
        // wgResuft.setSizePercent(568,64);
        wgResuft.setPosition(510,432);

        bg.addChild(wgResuft);

        this.createAnimationNumber();

        this.initDisk();
        // var classicLabel =

        var lblTime = cc.Label.createWithBMFont(cc.res.font.Roboto_fonttime, "", cc.TEXT_ALIGNMENT_CENTER);
        lblTime.setPosition(this.diskSprite.getPosition());
        // lblTime.enableStroke(cc.color(25,74,135,255),4);
        // if( !cc.sys.isNative){
        //     lblTime.enableShadow(cc.color(0,0,0,255),4,4);
        // }

        lblTime.setColor(cc.color(255,222,0,255));
        this.bg.addChild(lblTime);
        this.lblTime = lblTime;



        this.effTai = new cc.Sprite("#mntx_effect_btntai.png");
        this.effTai.setPosition(btnTai.getPosition());
        this.effTai.setVisible(false);
        this.effTai.runAction(new cc.RepeatForever(
            new cc.Sequence(
                new cc.FadeTo(0.3,0),
                new cc.FadeTo(0.3,255)
            )
        ));
        bg.addChild(this.effTai);


        this.effXiu = new cc.Sprite("#mntx_effect_btnxiu.png");
        this.effXiu.setPosition(btnXiu.getPosition());
        this.effXiu.setVisible(false);
        this.effXiu.runAction(new cc.RepeatForever(
            new cc.Sequence(
                new cc.FadeTo(0.3,0),
                new cc.FadeTo(0.3,255)
            )
        ));
        bg.addChild(this.effXiu);

         // this.openDisk();
        //
        // this.runAction(new cc.Sequence(
        //     new cc.DelayTime(4),
        //
        //     new cc.CallFunc(function () {
        //
        //         thiz.closeDisk();
        //     })
        // ));
        // var test = [1,2,5];
        // this._addResultSprite(test);
    },

    _addResultSprite: function (result) {
        /* add result */
        var arr = _get_random_array(3, s_mntx_result_position.length);
        for (var i = 0; i < arr.length; i++) {
            var sprite = new cc.Sprite("#minitaixiu_dice_" + result[i] + ".png");
            sprite.setPosition(s_mntx_result_position[arr[i]]);
            this.diskNode.addChild(sprite);
        }
    },
    setTextTaiXiu:function (name) {
        var sprite = new cc.Sprite(name);
        sprite.setPosition(this.bg.getContentSize().width/2,this.bg.getContentSize().height/2);
        this.bg.addChild(sprite);
        sprite.runAction(new cc.Sequence(
            new cc.DelayTime(2),
            new cc.CallFunc(function () {
                sprite.removeFromParent(true);
            })
        ));
    },
    setMoneyBet:function (money) {
        this.moneyBet = money;
        this.moneyTF.setText(cc.Global.NumberFormat1(this.moneyBet));
    },

    initDisk: function () {
        var diskSprite = new cc.Sprite("#mntx_dia.png");
        diskSprite.setPosition(this.bg.getContentSize().width / 2 + 10, this.bg.getContentSize().height/2 +10);
        this.bg.addChild(diskSprite);
        this.diskSprite = diskSprite;
        var diskNode = new cc.Node();
        diskSprite.addChild(diskNode);
        this.diskNode = diskNode;

        var batSprite = new cc.Sprite("#mntx_bat.png");
        this.batSpritePosition = cc.p(diskSprite.getContentSize().width / 2, diskSprite.getContentSize().height / 2);
        batSprite.setPosition(this.batSpritePosition);
        diskSprite.addChild(batSprite);
        this.batSprite = batSprite;
    },

    shakeDisk: function () {
        this.diskNode.removeAllChildren(true);
        this.diskSprite.stopAllActions();
        this.batSprite.stopAllActions();

        // this.hideHistory();

        var thiz = this;
        // this.batSprite.runAction(new cc.MoveTo(1.0, this.batSpritePosition));
        this.diskSprite.runAction(new cc.Sequence(
            // new cc.EaseSineOut(new cc.MoveTo(1.0, cc.p(cc.winSize.width / 2, cc.winSize.height / 2))),
            new cc.DelayTime(0.2),
            new quyetnd.ActionShake2D(3.0, cc.p(10.0, 10.0))
        ));
    },

    openDisk: function (isEffect) {
        var thiz = this;
        if(isEffect)
        {
            SoundPlayer.playSound(["bellopen", "mobat"]);
            //this.diskNode.removeAllChildren(true);
            this.diskSprite.stopAllActions();
            this.batSprite.stopAllActions();
            /* mở bát */
            this.diskSprite.runAction(new cc.EaseSineOut(new cc.ScaleTo(0.7, 1.5)));
            this.batSpritePosition = this.batSprite.getPosition();
            this.batSprite.runAction(new cc.Sequence(
                new cc.DelayTime(0.9),
                new cc.EaseSineIn(new cc.MoveBy(1.0, cc.p(0.0, 160.0))),
                new cc.DelayTime(2.5),
                new cc.CallFunc(function () {
                    thiz.closeDisk(true);
                    // thiz.batSprite.setPosition(thiz.batSpritePosition);
                })
            ));
        }
        else{
            this.diskSprite.stopAllActions();
            this.batSprite.stopAllActions();
            this.diskSprite.setScale(1.5);
            this.batSprite.setPosition(cc.p(0.0, 450.0));
        }

    },

    closeDisk:function (isEffect) {
        var thiz = this;
        this.diskSprite.stopAllActions();
        this.batSprite.stopAllActions();
        if(isEffect){
            this.batSprite.runAction(new cc.EaseSineOut(new cc.MoveTo(1, thiz.batSpritePosition)));
            this.diskSprite.runAction(new cc.Sequence(
                new cc.DelayTime(1.2),
                new cc.CallFunc(function () {
                    thiz.diskSprite.runAction(new cc.EaseSineOut(new cc.ScaleTo(0.7, 1.0)));
                    //   thiz.batSprite.setPosition(thiz.batSpritePosition);
                    // thiz.batSprite.runAction(new cc.MoveTo(1.0,thiz.batSpritePosition));
                })

                //  new cc.EaseSineOut(new cc.ScaleTo(1, 0.34,0.34))

            ));
        }
        else{
            thiz.diskSprite.setScale(1.0);
            this.batSprite.setPosition(thiz.batSpritePosition);
        }

    },

    resetGame:function () {
        this.lblTai.setString("");
        this.lblXiu.setString("");
        this.lblTotalTai.setString("");
        this.lblTotalXiu.setString("");
        this.effTai.setVisible(false);
        this.effXiu.setVisible(false);
        this.spriteAni.setVisible(false);
        this.stopTime();
    },

    showEffectNumber:function () {
        this.spriteAni.setVisible(true);
        cc.log("==================" + this.wgResuft.getChildrenCount());
        this.spriteAni.setPosition(this.wgResuft.getPositionX()/2 + 20 + (this.wgResuft.getChildrenCount()-1)*50 , this.wgResuft.getPositionY() );
        // this.spriteAni.setPosition(200, 300);
    },
    hiddenEffectNumber:function () {
        this.spriteAni.setVisible(false);
    },
    createAnimationNumber:function () {
        var spriteAni = new cc.Sprite("#mntx_bg_itemselect.png");
        spriteAni.setPosition(this.wgResuft.getPositionX()/2 + (this.wgResuft.getChildrenCount()-1)*50 , this.wgResuft.getPositionY() );
        this.bg.addChild(spriteAni);
        spriteAni.setVisible(false);
        this.spriteAni = spriteAni;
        var lbl = new cc.LabelTTF("10",cc.res.font.Roboto_CondensedBold,20);
        lbl.setPosition(spriteAni.getContentSize().width/2, spriteAni.getContentSize().height/2);
        lbl.runAction(new cc.RepeatForever( new cc.Sequence(
            new cc.DelayTime(0.2),
            new cc.CallFunc(function () {
                var number = Math.floor(3 + Math.random()*18);
                if(number>10){
                    lbl.setColor(cc.color(0,204,255,255));

                }
                else{
                    lbl.setColor(cc.color(255,222,0,255));
                }
                lbl.setString(number);
            })
            )
        ));
        spriteAni.addChild(lbl);
    },
    drawResuft:function (arrNumer) {
        var thiz = this;
    },
    pushItemHistory:function (index,data) {
        var thiz = this;
        var lbl = new cc.LabelTTF (data.number, cc.res.font.Roboto_CondensedBold, 20);
        // var bgText = new cc.Sprite("#mntx_bg_hisItem.png");
        var bgText = new ccui.Button("mntx_bg_hisItem.png","","",ccui.Widget.PLIST_TEXTURE);
        bgText.addClickEventListener(function () {
            thiz.handleHistoryPhien(data);
        });
        if(data.number>10){
            lbl.setColor(cc.color(0,204,255,255));
            bgText.setColor(cc.color(0,204,255,255));
        }
        else{
            lbl.setColor(cc.color(255,222,0,255));
            bgText.setColor(cc.color(255,222,0,255));
        }
        bgText.addChild(lbl);
        lbl.setPosition(bgText.getContentSize().width/2, bgText.getContentSize().height/2);
        bgText.setPosition(cc.p(index*50, this.wgResuft.getContentSize().height/2));
        this.wgResuft.addChild(bgText);
    },
    handleHistoryPhien:function (data) {
      var aa = new HistoryPhien(data);
        aa.showWithAnimationScale();
    },
    setActiveBt : function(btn,enabled){
        btn.setBright(enabled);
        btn.setEnabled(enabled);
    },
    initChip: function (centerPosition) {

        var thiz = this;

        for(var i = 1; i < 6;i++)
        {
            (function () {
                var iNew = i;
                var chip1 = new ccui.Button("mm_btn"+iNew+"_2.png","mm_btn"+iNew+"_1.png","",ccui.Widget.PLIST_TEXTURE);
                chip1.setTitleText("+"+  cc.Global.NumberFormat2(s_money_betEx[iNew-1]));
                chip1.setTitleFontName(cc.res.font.Roboto_CondensedBold);
                chip1.setTitleFontSize(30);
                chip1.setPosition(s_miniGame_chip_position[iNew-1]);
                chip1.addClickEventListener(function () {
                    thiz.handleChip(iNew-1);
                });
                thiz.addChild(chip1,1);

            })();
        }


    },

    handleChip:function (index) {
        cc.log(index);
        this.moneyBet += s_money_betEx[index];
        if(this.moneyBet > PlayerMe.gold)
        {
            this.moneyBet = PlayerMe.gold;
        }
        this.setMoneyBet(this.moneyBet);
    },
    update: function (dt) {
        if(this._isUpdateTime){
            this.timer -= dt;
            if(this.timer>0){
                this.setTimeFomat();
            }
            else {
                this.stopTime();
            }
        }
    },
    startTime:function (time) {
        this.lblTime.setOpacity(255);
        this._isUpdateTime = true;
        this.timer = time;
    },
    stopTime:function () {
        this.lblTime.setColor(cc.color(255,222,0,255));
        this._isUpdateTime = false;
        this.timer = 0;
        this.lblTime.stopAllActions();
        this.lblTime.setString("");
        this.isCountDownSound = false;
    },
    setTimeFomat:function () {
        var number = Math.floor(this.timer);
        var minute = Math.floor(number/60);
        var second = number - minute*60;
        var stringSecon = (second > 9)?second:"0"+second;
        var stringTime = "0" + minute + ":" + stringSecon;
        this.lblTime.setString(stringTime);
        if(this.isCountDownSound && number <= 5)
        {
            this.lblTime.setColor(cc.color(255,0,0));
            this.lblTime.runAction(new cc.RepeatForever(
                new cc.Sequence(
                    new cc.FadeTo(0.2,50),
                    new cc.FadeTo(0.2,255)
                )
            ));
            this.isCountDownSound = false;
            this.playSoundBip();
        }
    },
    playSoundBip:function () {
        this.lblTime.runAction(new cc.RepeatForever(
            new cc.Sequence(
                new cc.CallFunc(function () {
                    SoundPlayer.playSound("countDownS");
                }),
                new cc.DelayTime(1)
            )
        ));
    },
    onEnter: function () {
        this._super();
        this.scheduleUpdate();
    },

    onExit: function () {
        this._super();
        this.unscheduleUpdate();
    },

    initController: function () {
        this._controller = new ChanLeController(this);
    }
});


