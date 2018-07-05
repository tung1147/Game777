/**
 * Created by QuyetNguyen on 12/26/2016.
 */

var CoinSprite = cc.Sprite.extend({
    ctor : function (physicsSpace) {
        this._super("#coin.png");
        this.physicsSpace = physicsSpace;
    },

    _initPhysics : function() {
        var contentSize = this.getContentSize();

        var body = new cp.Body(1, 1);
        this.physicsSpace.addBody(body);
        body.p = cp.v(this.x, this.y);
        body.t = this._torque;
        body.setVel(this._force);

        var radius = (contentSize.width + contentSize.height) / 4 * this.getScale();
        var shape = new cp.CircleShape(body, radius, cp.v(0,0));
        shape.setElasticity(0.5);
        shape.setFriction(0.8);
        shape.group = 1;
        this.physicsSpace.addShape(shape);


        this.body = body;
        this.shape = shape;
    },

    _destroyPhysics : function () {
        if(this.physicsSpace){
            this.physicsSpace.removeShape(this.shape);
            this.physicsSpace.removeBody(this.body);

            this.shape = null;
            this.body = null;
            this.physicsSpace = null;
        }
    },

    update : function () {
        this.setPosition(this.body.p.x, this.body.p.y);
        this.setRotation(-cc.radiansToDegrees(this.body.a));
    },

    onEnter : function () {
        this._super();
        this.scheduleUpdate();
        this._initPhysics();
    },

    onExit : function () {
        this._super();
        this.unscheduleUpdate();
        this._destroyPhysics();
    },

    startWithDuration : function (duration, scaleTo) {
        var thiz = this;
        var fadeOutTime = 2.0 + Math.random() * 1.0;

        var scaleAction = new cc.ScaleTo(duration, scaleTo);
        var fadeAction = new cc.FadeOut(fadeOutTime);
        this.runAction(new cc.Sequence(
            scaleAction,
            fadeAction,
            new cc.CallFunc(function () {
                thiz.removeFromParent(true);
            })
        ));
    },
});

var JackpotLayer = cc.Node.extend({
    ctor : function () {
        this._scaleStart = 0.5;
        this._scaleDelta = 0.1;

        this._scaleEnd = 0.7;
        this._scaleEndDelta = 0.4;

        this._rotateStart = -15.0;
        this._rotateDelta = 30.0;

        this._forceStart = 900.0;
        this._forceDelta = 200.0;

        this._torqueStart = -8.0;
        this._torqueDelta = 16.0;

        this._timeStart = 2.0;
        this._timeDelta = 1.0;

        this._startPosition = cc.p(cc.winSize.width/2, 200);
        this._startPositionDelta = cc.p(40, 10);

        this._super();
        this._initPhysics();

        var jackpotSprite = new cc.Sprite("#nohu_fr1.png");
        jackpotSprite.setPosition(this._startPosition.x, this._startPosition.y + 20);
        this.addChild(jackpotSprite);
        this.jackpotSprite = jackpotSprite;

        var shakeAction = new quyetnd.ActionShake2D(1, cc.p(10, 0));
        var frames = [];
     //   frames.push(cc.spriteFrameCache.getSpriteFrame("nohu_fr1.png"));
        frames.push(cc.spriteFrameCache.getSpriteFrame("nohu_fr2.png"));
        frames.push(cc.spriteFrameCache.getSpriteFrame("nohu_fr3.png"));
        frames.push(cc.spriteFrameCache.getSpriteFrame("nohu_fr4.png"));
        var animation = new cc.Animation(frames, 0.1, 1);
        var animateAction = new cc.Animate(animation);

        var thiz = this;
        jackpotSprite.runAction(new cc.Sequence(
            shakeAction,
            new cc.CallFunc(function () {
                thiz.addAllCoin();
            }),
            animateAction,
            new cc.CallFunc(function () {
                jackpotSprite.setVisible(false);
            })
        ));
    },

    _initPhysics:function() {
        this.space = new cp.Space();
        this.space.gravity = cp.v(0, -1200);
        this.space.sleepTimeThreshold = 0.5;

        var floorShape = new cp.SegmentShape(this.space.staticBody, cp.v(0, 0), cp.v(cc.winSize.width*2, 0), 0);
        floorShape.setElasticity(1);
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

        var forceVector = cc.pRotateByAngle(cc.p(0, force), cc.p(0,0), cc.degreesToRadians(rotate));

        var time = this._timeStart + (Math.random() * this._timeDelta);
        var x = this._startPosition.x + (-this._startPositionDelta.x + Math.random() * this._startPositionDelta.x * 2);
        var y = this._startPosition.y + (-this._startPositionDelta.y + Math.random() * this._startPositionDelta.y * 2);

        var coin = new CoinSprite(this.space);
        coin.setPosition(x, y);
        coin.setScale(startScale);
        coin._force = cp.v(forceVector.x, forceVector.y);
        coin._torque = torque;

        this.addChild(coin);
        coin.startWithDuration(time, endScale);
    },

    addAllCoin : function () {

        var n = 50 + Math.floor(Math.random()* 20);
        for(var i=0; i<n ;i++){
            this._addCoin();
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