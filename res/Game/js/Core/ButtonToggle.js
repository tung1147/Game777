/**
 * Created by Quyet Nguyen on 7/20/2016.
 */

var newui = newui || {};
newui.ButtonToggle = ccui.Widget.extend({
    ctor : function (imgOn, imgOff) {
        this._super();
        var spriteOn = new cc.Sprite(imgOn);
        var spriteOff = new cc.Sprite(imgOff);
        this.addChild(spriteOn);
        this.addChild(spriteOff);
        this.setContentSize(spriteOn.getContentSize());
        this.setTouchEnabled(true);
        spriteOn.setPosition(this.getContentSize().width/2, this.getContentSize().height/2);
        spriteOff.setPosition(spriteOn.getPosition());
        
        this.spriteOn = spriteOn;
        this.spriteOff = spriteOff;
        var thiz = this;
        this.addClickEventListener(function () {
            if(thiz.selected){
                thiz.select(false);
            }
            else{
                thiz.select(true);
            }
        });
        this.select(false);
    },
    select : function (selected) {
        this.selected = selected;
        if(selected){
            this.spriteOn.visible = true;
            this.spriteOff.visible = false;
            if(this.onSelect){
                this.onSelect(this, true);
            }
        }
        else{
            this.spriteOn.visible = false;
            this.spriteOff.visible = true;
            if(this.onSelect){
                this.onSelect(this, false);
            }
        }
    }
});