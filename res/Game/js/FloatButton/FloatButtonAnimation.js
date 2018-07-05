/**
 * Created by Quyet Nguyen on 8/19/2016.
 */

var FloatButtonShowAnimation = cc.CustomAction.extend({
    ctor : function (duration) {
        this._target = null;
        this._startPosition = null;
        this.targetPosition = cc.p(0.0);
        this.rotateAngle = 0.0;

        this._super();
        this.initWithDuration(duration);
    },
    onUpdate : function (dt) {
        var dx = this.targetPosition.x - this._startPosition.x;
        var dy = this.targetPosition.y - this._startPosition.y;
        var x = this._startPosition.x + dx * dt;
        var y = this._startPosition.y + dy * dt;

        var angle = (1.0 - dt) * this.rotateAngle;
        var p = cc.pRotateByAngle(cc.p(x,y), cc.p(0,0), cc.degreesToRadians(angle));
        this._target.setPosition(p);
    },

    onStartWithTarget : function (target) {
        this._target = target;
        this._startPosition = target.getPosition();
    }
});

var FloatButtonHideAnimation = FloatButtonShowAnimation.extend({
    ctor : function (duration) {
        this._super(duration);
    },
    onUpdate : function (dt) {
        var dx = this.targetPosition.x - this._startPosition.x;
        var dy = this.targetPosition.y - this._startPosition.y;
        var x = this._startPosition.x + dx * dt;
        var y = this._startPosition.y + dy * dt;

        var angle = dt * this.rotateAngle;
        var p = cc.pRotateByAngle(cc.p(x,y), cc.p(0,0), cc.degreesToRadians(angle));
        this._target.setPosition(p);
    },
});