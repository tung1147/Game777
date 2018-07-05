/**
 * Created by Quyet Nguyen on 8/9/2016.
 */

// var VongQuayLayer = cc.Node.extend({
//     ctor : function () {
//         this._super();
//         this.state = 0;
//         this.rotateSpeed = 720.0;
//
//         var bg = new cc.Sprite("#vongquay_circle_bg.png");
//         bg.setPosition(cc.winSize.width/2, cc.winSize.height/2);
//         this.addChild(bg);
//
//         var circle = new cc.Sprite("#vongquay_circle.png");
//         circle.setPosition(circle.getContentSize().width/2, circle.getContentSize().height/2);
//         bg.addChild(circle);
//
//         var arrow = new cc.Sprite("#vongquay_arrow.png");
//         arrow.setPosition(circle.getPosition());
//         bg.addChild(arrow);
//
//         var okButton = new ccui.Button("vongquay_bt.png","","", ccui.Widget.PLIST_TEXTURE);
//         okButton.setZoomScale(0.03);
//         okButton.setPosition(circle.getPosition());
//         bg.addChild(okButton);
//
//         this.circle = circle;
//         var thiz = this;
//         okButton.addClickEventListener(function () {
//             thiz.okButtonHandler();
//         });
//     },
//     okButtonHandler : function () {
//         //this.circle.setRotation(45.0);
//         if(this.state == 0){
//             this.state = 1;
//         }
//         else if(this.state == 1){
//             this.stopAtRotate(90.0);
//         }
//     },
//     stopAtRotate : function (rotate) {
//         this.state = 2;
//         var s =  rotate - this.circle.getRotation();
//         while(s < 1500.0){
//             s += 360.0;
//         }
//         this.startRotate = this.circle.getRotation();
//         this.acceleration = -(this.rotateSpeed*this.rotateSpeed) / (s*2);
//         this.timeElapsed = 0.0;
//         this.maxTime = s*2 / this.rotateSpeed;
//     },
//     update : function (dt) {
//         if(this.state == 1){ //rotate
//             var rotate = this.circle.getRotation() + this.rotateSpeed*dt;
//             this.circle.setRotation(rotate);
//         }
//         else if(this.state == 2){ //to finished
//             this.timeElapsed += dt;
//             if(this.timeElapsed >= this.maxTime){
//                 this.timeElapsed = this.maxTime;
//                 this.onFinishedRotate();
//             }
//             var s = (this.rotateSpeed * this.timeElapsed) + (this.acceleration * this.timeElapsed * this.timeElapsed / 2);
//             var rotate = this.startRotate + s;
//             this.circle.setRotation(rotate);
//
//         }
//     },
//     onEnter : function () {
//         this._super();
//         this.scheduleUpdate();
//     },
//     onExit : function () {
//         this._super();
//         this.unscheduleUpdate();
//     },
//     onFinishedRotate : function () {
//         this.state = 0;
//     }
// });

var VongQuayScene = IGameScene.extend({
    // ctor : function () {
    //     this._super();
    //     var vongQuay = new VongQuayLayer();
    //     this.sceneLayer.addChild(vongQuay);
    // },
    // backButtonClickHandler : function () {
    //     this.exitToGame();
    // },
});