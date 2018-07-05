/**
 * Created by Quyet Nguyen on 8/30/2016.
 */

var MiniGameChip = ChipButton.extend({
    ctor : function (index) {
        this._super();

        var normalSprite = new cc.Sprite("#minigame-chip-"+index+".png");
        var selectedSprite = new cc.Sprite("#minigame-chipSelected-"+index+".png");
        this.addChild(normalSprite);
        this.addChild(selectedSprite);
        this.normalSprite = normalSprite;
        this.selectedSprite = selectedSprite;
        this.chipIndex = index;

        var s = normalSprite.getContentSize();
        this.rectTouch = cc.rect(-s.width/2, -s.height/2, s.width, s.height);

        selectedSprite.visible = false;
    },
    select : function (isForce) {
        this._super();
        this.normalSprite.visible = false;
        this.selectedSprite.visible = true;

        if(isForce){
            this.setPositionY(this.originPoint.y + 40.0);
        }
        else{
            this.stopAllActions();
            var moveAction = new cc.MoveTo(0.2, cc.p(this.x, this.originPoint.y + 40.0 * cc.winSize.screenScale));
            this.runAction(new cc.EaseSineOut(moveAction));
        }
    },
    unSelect : function (isForce) {
        this._super();
        this.normalSprite.visible = true;
        this.selectedSprite.visible = false;

        if(isForce){
            this.setPositionY(this.originPoint.y);
        }
        else{
            this.stopAllActions();
            var moveAction = new cc.MoveTo(0.2, cc.p(this.x, this.originPoint.y));
            this.runAction(new cc.EaseSineOut(moveAction));
        }
    }
});