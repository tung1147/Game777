/**
 * Created by QuyetNguyen on 12/20/2016.
 */
//var s_ChanLeLayer = null;

var VQ_ROTATE_NOMARL = 0;
var VQ_ROTATE_BEFORE = 1;
var VQ_ROTATE_TOSTOP = 2;

var VongQuayView = cc.Node.extend({
    isRunning:false,
    ctor: function (name) {
        this._super();

        var vong_quay = new cc.Sprite(name);
        this.addChild(vong_quay);

        this.vongquay = vong_quay;
        this.isRunning = false;
        this.accelerate = 9000.0;
        this.spin = 1.0;


        // this.startWithSpeed(1000);
        // var delay = new cc.DelayTime(6);
        // var orderAgain = new cc.CallFunc(function () {
        //     thiz.stopAtRotate(70);
        // });
        // thiz.runAction(new cc.Sequence(delay, orderAgain));
    },


    onFinishedRotate:function () {
        this.isRunning = false;

    },

    startWithSpeed:function (speed) {
        this.accelerate = 400.0;
        if (!this.isRunning){
            this.isRunning = true;
            this.rotateSpeed = Math.abs(speed);
            if(speed > 0){
                this.spin = 1.0;
            }
            else{
                this.spin = -1.0;
            }
            //this.spin = -1.0;
            this._status = VQ_ROTATE_NOMARL;
        }
    },
    stopForce:function (rotate) {
        this.vongquay.setRotation(rotate);
        this.onFinishedRotate();
    },
    stopAtRotate:function (rotate) {
        // if(!this.running){
        //
        // }
        if (this._status === VQ_ROTATE_NOMARL){
            var a = this.vongquay.getRotation();
            var ds = rotate - a;
            if(this.spin > 0){
                while (ds < 0){
                    ds += 360.0;
                }
            }
            else{
                while (ds > 0){
                    ds -= 360.0;
                }
            }
            ds = Math.abs(ds);

            this.rotateToStop = 0.5*this.rotateSpeed*this.rotateSpeed / this.accelerate;
            this.rotateBeforeStop = ds -  this.rotateToStop;
            while (this.rotateBeforeStop <= 0){
                this.rotateBeforeStop += 360.0;
            }
            this._status = VQ_ROTATE_BEFORE;
        }
    },
    update:function (dt) {
        if (this.isRunning){
            switch (this._status)
            {
                case VQ_ROTATE_NOMARL:
                    this.updateRotateNormal(dt);
                    break;
                case VQ_ROTATE_BEFORE:
                    this.updateRotateBeforeStop(dt);
                    break;
                case VQ_ROTATE_TOSTOP:
                    this.updateRotateToStop(dt);
                    break;
            }
        }
    },
    updateRotateToStop:function (time) {
        var dt = time;
        var dv = this.accelerate*dt;
        if (dv >= this.rotateSpeed){
            dt = this.rotateSpeed / this.accelerate;
            this.isRunning = false;
        }

        var ds = this.rotateSpeed* dt - dv*dt / 2;
        if (ds >= this.rotateToStop){
            ds = this.rotateToStop;
            this.isRunning = false;
        }

        this.rotateToStop -= ds;
        this.rotateSpeed -= dv;

        var rotate = this.vongquay.getRotation() + ds * this.spin;
        while(Math.floor(rotate) > 360){
            rotate -= 360 * this.spin;
        }
        // if (rotate > 360.0){
        //     rotate -= 360.0;
        // }
        this.vongquay.setRotation(rotate);

        if (!this.isRunning){
            this.onFinishedRotate();
        }
    },
    updateRotateBeforeStop:function (dt) {
        var ds = this.rotateSpeed*dt;
        if (ds >= this.rotateBeforeStop){
            ds = this.rotateBeforeStop;
            this._status = VQ_ROTATE_TOSTOP;
        }
        this.rotateBeforeStop -= ds;

        var rotate = this.vongquay.getRotation() + ds * this.spin;
        while(Math.floor(rotate) > 360){
            rotate -= 360 * this.spin;
        }
        // if (rotate > 360.0){
        //     rotate -= 360.0;
        // }
        this.vongquay.setRotation(rotate);
    },

    updateRotateNormal:function (dt) {
        var rotate = this.vongquay.getRotation() + this.rotateSpeed * dt * this.spin;
        while(Math.floor(rotate) > 360){
            rotate -= 360 * this.spin;
        }
        // if (rotate > 360.0){
        //     rotate -= 360.0;
        // }
        this.vongquay.setRotation(rotate);
    },
    onEnter : function () {
        this._super();
        this.scheduleUpdate();
    },
    onExit: function () {
        this._super();
        this.unscheduleUpdate();
    }

});

var VongTo = VongQuayView.extend({
    ctor: function (name) {
        this._super(name);
        var thiz = this;
        this.arrPiece = [];
        for(var i = 0; i< 12;i++){
            var sp = new cc.Sprite("#vq_to"+i.toString()+".png");
            sp.setPosition(cc.p(sp.getContentSize().width/2,sp.getContentSize().height/2));
            thiz.arrPiece.push(sp);
            thiz.vongquay.addChild(sp);
            this.arrPiece[i].setVisible(false);
        }

    },
    onFinishedRotate:function () {
        this._super();
        for(var i = 0; i < this.arrPiece.length;i++){
                // this.arrPiece[i].setVisible((i== this.indexStop)?true:false);
            this.arrPiece[i].setVisible((i== this.indexStop)?true:false);
        }
        this.getParent().getParent().onFinishedRotate();
    },
    stopAtRotate:function (rotate) {
        this._super(rotate);
        this.indexStop = Math.floor(rotate/30);
    },
    resetVongQuay:function () {
        for(var i = 0; i < this.arrPiece.length;i++){
            this.arrPiece[i].setVisible(false);
        }
    }

});

var VongNho = VongQuayView.extend({
    ctor: function (name) {
        this._super(name);
        var thiz = this;
        this.piece = 7;
        this.arrPiece = [];
        this.touchRect = cc.rect(-this.vongquay.getContentSize().width/2,-this.vongquay.getContentSize().height/2,this.vongquay.getContentSize().width,this.vongquay.getContentSize().height);
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                return thiz.onTouchBegan(touch, event);
            }

        }, thiz.vongquay);

        for(var i = 0; i< 8;i++){
            var sp = new cc.Sprite("#vqnho_n"+i.toString()+".png");
            sp.setPosition(cc.p(sp.getContentSize().width/2,sp.getContentSize().height/2));
            thiz.arrPiece.push(sp);
            thiz.vongquay.addChild(sp);
            this.arrPiece[i].setVisible(false);
        }
        this.arrPiece[7].setVisible(true);
    },
    getIdPiece:function () {

            return  ID_VONG_NHO[this.piece];

    },
    onTouchBegan: function (touch, event) {

        var p = this.convertToNodeSpace(touch.getLocation());

        // var rect = this.getBoundingBox();
        if (cc.rectContainsPoint(this.touchRect, p)) {


           if(!this.isRunning){
               //cc.log("vao vong"+ cc.radiansToDegrees(cc.pAngleSigned(cc.p(1,0),p)));
               var p1 = this.vongquay.convertToNodeSpace(touch.getLocation());
               var p2 = cc.p(this.vongquay.getContentSize().width/2, this.vongquay.getContentSize().height/2);
               var p3 = cc.pSub(p1, p2);

               var gocTouch = cc.radiansToDegrees(cc.pAngleSigned(cc.p(1,0),p3) );
               if(gocTouch<0){
                   gocTouch += 360;
               }
               gocTouch += 45/2;
               var angle = Math.floor((gocTouch%360)/45) ;
               //var angle = Math.floor((-this.vongquay.getRotation()%360 )/45);
               // var total = 8;
               // if(angle> 0){
               //     total =  7;
               // }
               // var gocNew =  (total - angle) + gocTouch;
               // if(gocNew>7){
               //     gocNew = gocNew - 8;
               // }
               this.piece = angle;
               cc.log("gocNew: " + angle);
               for(var i = 0; i < this.arrPiece.length;i++){
                   this.arrPiece[i].setVisible((i== angle)?true:false);
               }
           }

            return true;
        }

        return false;
    },
    resetVongQuay:function () {
        // this.piece = -1;
        for(var i = 0; i < this.arrPiece.length;i++){
            this.arrPiece[i].setVisible(false);
        }
    }
});
//            100exp,50.000,500,200.000,10.000, 500.000, thanks, 1.000,100.000,2.000,20.000,5.000
var ID_VONG_TO = [11    ,7      ,1 ,9      ,5      ,10       ,12      ,2     ,8    ,3    ,6    ,4];
//             1k,500,them, 100exp,100k,50k, 10k,5k,
var ID_VONG_NHO = [102      ,101,108    ,107  ,106 ,105      ,104      ,103  ];
var ID_VONG_NHO2 = [108    ,107  ,106 ,105      ,104      ,103 ,102      ,101];
var VongQuayLayer = MiniGamePopup.extend({
    ctor: function () {

        this._super();
        this.setScale(1);
        this.arrVongTo = [];
        this.arrVongNho = [];
        this.arrBuy = [];
        this.pieceIndex = -1;
        this.soLuot = 0;
        this.gameType = GameType.GAME_VongQuayMayMan;

        var thiz = this;
        this.isQUay = false;
        var bg = new cc.Sprite("#bg_vongquay.png");
        bg.setAnchorPoint(cc.p(0, 0));
        this.setContentSize(bg.getContentSize());
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.addChild(bg);
        this._boudingRect = cc.rect(40, 46, 840, 440);

        var vongto =  new VongTo("#vongquay_to.png");
        vongto.setPosition(254,258);
        bg.addChild(vongto);
        this.vongto = vongto;

        var vongnho =  new VongNho("#vongquay_nho.png");
        vongnho.setPosition(254,258);
        bg.addChild(vongnho);
        this.vongnho = vongnho;

        var kim =  new cc.Sprite("#vongquay_arrow.png");
        kim.setPosition(cc.p(vongnho.getPositionX(),318));
        bg.addChild(kim);

        var rotateBt = new ccui.Button("vongquay_bt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        rotateBt.setPosition(vongnho.getPosition());
        bg.addChild(rotateBt);
        rotateBt.addClickEventListener(function () {
            if(!thiz.isQUay){
                return;
            }

           if(thiz.soLuot < 1)
           {
               MessageNode.getInstance().show("Bạn đã hết lượt quay. Mua để quay tiếp");
               return;
           }

            thiz.setActiveBt(rotateBt,false);
            thiz.vongto.resetVongQuay();
            thiz.vongto.startWithSpeed(1000);
            thiz.vongnho.startWithSpeed(-1000);
            thiz._controller.sendRotate( thiz.vongnho.getIdPiece());
        });
        this.rotateBt = rotateBt;
        var lblLuot = new cc.LabelTTF("0",cc.res.font.Roboto_Condensed,18);
        lblLuot.setColor(cc.color(164,106,60,255));
        lblLuot.setPosition( cc.p(rotateBt.getContentSize().width/2,rotateBt.getContentSize().height/2-15));
        rotateBt.addChild(lblLuot);
        this.lblLuot = lblLuot;

        this.closeButton.removeFromParent(true);
        this.closeButton.setPosition(cc.p(836, 323));
        bg.addChild(this.closeButton);

        this.tutorialButton.removeFromParent(true);
        this.tutorialButton.setPosition(cc.p(725, 292));
        bg.addChild(this.tutorialButton);
        this.historyButton.removeFromParent(true);
        this.historyButton.setPosition(cc.p(554, 292));
        bg.addChild(this.historyButton);
        this.historyButton.addClickEventListener(function () {
             var his = new HistoryVongQuay();
            his.show();
            thiz._controller.sendGetUserHistory();
        });
        var btnRank = new ccui.Button("vq_icon_xh.png","","",ccui.Widget.PLIST_TEXTURE);

        btnRank.setPosition(cc.p(640, 292));
        btnRank.addClickEventListener(function () {
            var rank = new RankVongQuay();
            rank.show();
            thiz._controller.sendGetRank();

        });
        bg.addChild(btnRank);

        // this.moneyTF = new newui.TextField(cc.size(240, 55), cc.res.font.Roboto_Condensed_30);
        // this.moneyTF.setPlaceHolder("vong ngoai");
        // this.moneyTF.setTextColor(cc.color(255,255,255));
        // this.moneyTF.setPlaceHolderColor(cc.color(190, 240, 253,255));
        //
        // this.moneyTF.setPosition(cc.winSize.width - 310*cc.winSize.screenScale, 150);
        // this.addChild(this.moneyTF);
        // var buyBt = new ccui.Button("game-xepbaiBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        // buyBt.setPosition(cc.winSize.width - 310*cc.winSize.screenScale, 100);
        // this.addChild(buyBt);
        // buyBt.addClickEventListener(function () {
        //
        //     thiz.vongto.startWithSpeed(1000);
        //     thiz.vongnho.startWithSpeed(-1000);
        //     var aa = thiz.moneyTF.getText() + ";"+ thiz.vongnho.getIdPiece();
        //     SmartfoxClient.getInstance().sendExtensionRequest(-1, "cvq", {1:thiz.vongnho.getIdPiece() ,2:aa  });
        // });

        var gameIdLabel =   cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "ID : 1231231233", cc.TEXT_ALIGNMENT_LEFT);
        gameIdLabel.setColor(cc.color(191, 242, 255,255));
        // gameIdLabel.setScale(0.8);
        gameIdLabel.setPosition(640, 243);
        bg.addChild(gameIdLabel);
        this.gameIdLabel = gameIdLabel;


        for(var i = 0; i < 3; i++){
            (function () {
                var buyBt = new  ccui.Button("vq_mua"+ (i+1).toString() +".png", "", "", ccui.Widget.PLIST_TEXTURE);
                buyBt.setPosition(cc.p(520 + i*124,160));
                var index = i;
                buyBt.addClickEventListener(function () {
                    cc.log("buy"+index);
                    thiz.buyLuot(index);
                });
                bg.addChild(buyBt);
            })();
        }


    },
    setActiveBt : function(btn,enabled){
        this.isQUay = enabled;
        // btn.setBright(enabled);
        btn.loadTextureNormal(enabled?"vongquay_bt.png":"vongquay_bt_2.png",ccui.Widget.PLIST_TEXTURE)
        // btn.setEnabled(enabled);
    },
    setResuft:function (idVongNho,idVongTo) {
        var index = this.getIndexVongTo(idVongTo);
        if(index==-1){
            return;
        }
        this.vongto.stopForce(index*30);

        var index2 = this.getIndexVongNho(idVongNho);
        if(index2==-1){
            return;
        }
        this.vongnho.stopForce(index2*45);
    },

    onFinishedRotate:function () {
      cc.log("onFinishedRotate");
    },
    onUpdateLuot:function (soLuot) {
        this.soLuot = soLuot;
        this.lblLuot.setString(soLuot.toString() + " lượt");
    },

    getIndexVongTo:function (index) {
        for(var i=0; ID_VONG_TO.length;i++ ){
            if(ID_VONG_TO[i] == index)
            {
                return  i;
            }
        }
      return  -1;
    },
    getIndexVongNho:function (index) {
        for(var i=0; ID_VONG_NHO2.length;i++ ){
            if(ID_VONG_NHO2[i] == index)
            {
                return  i;
            }
        }
        return  -1;
    },
    handelResuft:function (idVongNho,idVongTo ) {
        var index = this.getIndexVongTo(idVongTo);
        if(index==-1){
            return;
        }
        this.vongto.stopAtRotate(index*30);

        var index2 = this.getIndexVongNho(idVongNho);
        if(index2==-1){
            return;
        }
        this.vongnho.stopAtRotate(index2*45);
    },
    buyLuot:function (index) {

        if(this.arrBuy.length == 0){
            return;
        }
        var thiz = this;
        // var dialog = new MessageConfirmDialog();
        // dialog.setMessage("Bạn có muốn mua không ?");
        // dialog.showWithAnimationScale();
        // dialog.okButtonHandler = function () {
        //
        // };
        thiz._controller.sendBuyRotate(thiz.arrBuy[index]);
    },
    setBettingSelectEnable : function (enable) {
    },
    initChip: function (centerPosition) {

    },


    onEnter: function () {
        this._super();
        // this.timer = 0;
        // this.scheduleUpdate();
        //s_ChanLeLayer = this;
        var thiz = this;
    },

    handelJoinGame:function (arrVongNho,arrVongTo,arrBet) {

        this.arrVongTo = [];
        this.arrVongNho = [];
        this.arrBuy = [];

        for(var i = 0; i < arrVongNho.length; i++){
            this.arrVongNho.push(arrVongNho[i][1]);
        }
        for(var i = 0; i < arrVongTo.length; i++){
            this.arrVongTo.push(arrVongTo[i][1]);
        }
        for(var i = 0; i < arrBet.length; i++){
            this.arrBuy.push(arrBet[i][1]);
        }
    },

    onExit: function () {
        this._super();
        this.unscheduleUpdate();
        //s_ChanLeLayer = null;
    },

    initController: function () {
        this._controller = new VongQuayController(this);
    },

});



