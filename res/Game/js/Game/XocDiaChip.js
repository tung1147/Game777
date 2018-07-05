/**
 * Created by QuyetNguyen on 10/5/2016.
 */

var xocdia_chip_color = xocdia_chip_color ||
    [
        "#ffffff",
        "#ffffff",
        "#ffffff",
        "#ffffff"
    ];

var XocDiaChip = ChipButton.extend({
    ctor : function (index) {
        this._super();
        this.chipIndex = index;

        var normalSprite = new cc.Sprite("#xocdia-chip-"+index+".png");
        var selectedSprite = new cc.Sprite("#xocdia-chipSelected-"+index+".png");
        this.addChild(normalSprite);
        this.addChild(selectedSprite);
        this.normalSprite = normalSprite;
        this.selectedSprite = selectedSprite;

        var label = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, "50V");
        label.setColor(cc.color(xocdia_chip_color[index-1]));
        this.addChild(label);
        this.label = label;

        var s = normalSprite.getContentSize();
        this.rectTouch = cc.rect(-s.width/2, -s.height/2, s.width, s.height);

        selectedSprite.visible = false;
    },
    select : function (isForce) {
        this._super();
        this.normalSprite.visible = false;
        this.selectedSprite.visible = true;
        this.label.setOpacity(255);
        var dy = 25.0 ;//* cc.winSize.screenScale;
        if(isForce){
            this.setPositionY(this.originPoint.y + dy);
        }
        else{
            this.stopAllActions();
            var moveAction = new cc.MoveTo(0.2, cc.p(this.x, this.originPoint.y + dy));
            this.runAction(new cc.EaseSineOut(moveAction));
        }

    },
    unSelect : function (isForce) {
        this._super();
        this.normalSprite.visible = true;
        this.selectedSprite.visible = false;
        this.label.setOpacity(125);
        if(isForce){
            this.setPositionY(this.originPoint.y);
        }
        else{
            this.stopAllActions();
            var moveAction = new cc.MoveTo(0.2, cc.p(this.x, this.originPoint.y));
            this.runAction(new cc.EaseSineOut(moveAction));
        }
    },
    
    setGold : function (gold) {
        this.label.setString(cc.Global.NumberFormat2(gold));
    }
});