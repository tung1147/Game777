/**
 * Created by QuyetNguyen on 11/9/2016.
 */

newui.TextField = cc.Node.extend({
    ctor : function (size, fontName, arg3, arg4,arg5) {
        cc.Node.prototype.ctor.call(this);
        this.setContentSize(size);
        this.setAnchorPoint(cc.p(0.5,0.5));

        this._canAttachIME = true;
        this._canDetachIME = true;
        this._returnCallback = null;
        this._updateText = false;
        this._isPassword = false;
        this._textMaxLength = -1;
        this._alignment = 0;
        this._enable = true;

        this._inputText = "";
        this._placeHolderText = "";
        this.string = this._inputText;

        this._rectTouch = cc.rect(0,0, size.width, size.height);
        this._isAttachWithIME = false;

        if(fontName.endsWith(".fnt")){
            this.initWithBMFont(fontName, arg3);
        }
        else{
            this.initWithTTFFont(fontName,arg3,arg4,arg5);
        }
        this.textCursor.setVisible(false);

        this.updateText();
        this.setAlignment(0);
    },

    initWithBMFont : function (textFont, placeHolderFont) {
        if(!placeHolderFont){
            placeHolderFont = textFont;
        }
        var textLabel = new cc.LabelBMFont(this._inputText, textFont);
        var placeHolderLabel = new cc.LabelBMFont(this._placeHolderText, placeHolderFont);
        var textCursor = new cc.LabelBMFont("|", textFont);

        textLabel.setPosition(this.getContentSize().width/2, this.getContentSize().height/2);
        placeHolderLabel.setPosition(textLabel.getPosition());

        this.textLabel = textLabel;
        this.placeHolderLabel = placeHolderLabel;
        this.textCursor = textCursor;

        var clipping = new ccui.Layout();
        clipping.setContentSize(this.getContentSize());
        clipping.setClippingEnabled(true);
        this.addChild(clipping);

        clipping.addChild(textLabel);
        clipping.addChild(placeHolderLabel);
        this.addChild(textCursor);
    },

    initWithTTFFont : function (textFont, textSize, placeHolderFont, placeHolderSize) {
        if(!placeHolderFont){
            placeHolderFont = textFont;
        }
        if(!placeHolderSize){
            placeHolderSize = textSize;
        }
        var textLabel = new cc.LabelTTF(this._inputText, textFont, textSize);
        var placeHolderLabel = new cc.LabelTTF(this._placeHolderText, placeHolderFont, placeHolderSize);
        var textCursor = new cc.LabelTTF("|", textFont, textSize);

        textLabel.setPosition(this.getContentSize().width/2, this.getContentSize().height/2);
        placeHolderLabel.setPosition(textLabel.getPosition());

        this.textLabel = textLabel;
        this.placeHolderLabel = placeHolderLabel;
        this.textCursor = textCursor;

        var clipping = new ccui.Layout();
        clipping.setContentSize(this.getContentSize());
        clipping.setClippingEnabled(true);
        this.addChild(clipping);

        clipping.addChild(textLabel);
        clipping.addChild(placeHolderLabel);
        this.addChild(textCursor);
    },

    initTextFieldTouch : function () {
        var thiz = this;

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:false,
            onTouchBegan : function (touch, event) {
                if(!thiz._enable){
                    return false;
                }
                if(!thiz.checkVisible()){
                    return false;
                }
                if(!thiz._isAttachWithIME){
                    var p = thiz.convertToNodeSpace(touch.getLocation());
                    if(cc.rectContainsPoint(thiz._rectTouch, p)){
                        setTimeout(function(){
                            thiz.attachWithIME();
                        }, 0);
                        return true;
                    }
                }
                else{
                    setTimeout(function(){
                        thiz.detachWithIME();
                    }, 0);
                    return true;
                }
                return false;
            }
        }, thiz);

        // var eventListener = cc.EventListener.create({
        //     event: cc.EventListener.TOUCH_ONE_BY_ONE,
        //     swallowTouches:true,
        //     onTouchBegan : function (touch, event) {
        //         if(thiz._isAttachWithIME){
        //             setTimeout(function(){
        //                 thiz.detachWithIME();
        //             }, 0);
        //             return true;
        //         }
        //         return false;
        //     }
        // });
        //
        // cc.eventManager.addListener(eventListener, -1);
        // this.touchEventListener = eventListener;
    },

    update : function (dt) {
        if(this._updateText){
            this.updateText();
            this._updateText = false;
        }
    },

    updateText : function () {
        if(this._isPassword){
            var str = "";
            for(var i=0;i<this._inputText.length;i++){
                str += "*";
            }
            this.textLabel.setString(str);
        }
        else{
            this.textLabel.setString(this._inputText);
        }

        if(this._isAttachWithIME){
            this.textLabel.setVisible(true);
            this.placeHolderLabel.setVisible(false);
            var textLabelWidth = this.textLabel.getContentSize().width;
            if(textLabelWidth > this.getContentSize().width){
                this.textLabel.x = this.getContentSize().width - textLabelWidth * (1.0 - this.textLabel.getAnchorPoint().x);
            }
            else{
                this.textLabel.x = this.getContentSize().width * this.textLabel.getAnchorPoint().x;
            }

            var textRight = this.textLabel.x + this.textLabel.getContentSize().width * (1.0 - this.textLabel.getAnchorPoint().x);
            this.textCursor.setPosition(textRight + this.textCursor.getContentSize().width/2 + 1, this.textLabel.y);
        }
        else{
            if(this._inputText.length <= 0){
                this.textLabel.setVisible(false);
                this.placeHolderLabel.setVisible(true);
            }
            else{
                this.textLabel.setVisible(true);
                this.placeHolderLabel.setVisible(false);

                var textLabelWidth = this.textLabel.getContentSize().width;
                if(textLabelWidth > this.getContentSize().width){
                    this.textLabel.x = textLabelWidth * this.textLabel.getAnchorPoint().x;
                }
                else{
                    this.textLabel.x = this.getContentSize().width * this.textLabel.getAnchorPoint().x;
                }
            }
        }
    },

    checkVisible : function () {
        var node = this;
        while(node){
            if(!node.isVisible()){
                return false;
            }
            node = node.getParent();
        }
        return true;
    },

    setPasswordEnable : function (bool) {
        this._isPassword = bool;
    },

    setReturnCallback : function (func) {
        this._returnCallback = func;
    },

    setFocusListener : function (func) {
        this._focusListener = func;
    },

    setTextChangeListener : function (func) {
        this._textChangeListener = func;
    },

    setText : function (text) {
        this._inputText = text;
        this.string = text;
        this.updateText();
    },

    setEnable : function (enable) {
        this._enable = enable;
    },

    getText : function () {
        return this._inputText;
    },

    setMaxLength : function (length) {
        this._textMaxLength = length;
    },

    setPlaceHolder : function (text) {
        this._placeHolderText = text;
        this.placeHolderLabel.setString(text);
    },

    setPlaceHolderColor : function(color) {
        this.placeHolderLabel.setColor(color);
    },

    setTextColor : function(color) {
        this.textLabel.setColor(color);
    },

    setAlignment : function(alignment){
        this._alignment = alignment;
        if(this._alignment == 0){ //center
            this.textLabel.setAnchorPoint(cc.p(0.5, 0.5));
            this.placeHolderLabel.setAnchorPoint(cc.p(0.5, 0.5));
            this.placeHolderLabel.setPosition(this.getContentSize().width/2, this.getContentSize().height/2);
        }
        else if(this._alignment == 1){ //left
            this.textLabel.setAnchorPoint(cc.p(0.0, 0.5));
            this.placeHolderLabel.setAnchorPoint(cc.p(0.0, 0.5));
            this.placeHolderLabel.setPosition(0.0, this.getContentSize().height/2);
        }
        this.updateText();
    },

    showKeyboard : function(){

    },

    hideKeyboard : function(){

    },

    onEnter : function () {
        this._super();
        cc.imeDispatcher.addDelegate(this);
        this.scheduleUpdate();
        this.initTextFieldTouch();
    },

    onExit : function () {
        this._super();
        cc.imeDispatcher.removeDelegate(this);
        this.unscheduleUpdate();
        if(this.touchEventListener){
            cc.eventManager.removeListener(this.touchEventListener);
            this.touchEventListener = 0;
        }
        if(this._isAttachWithIME){
            this.detachWithIME();
        }
    },

    /* Keyboard Delegate */
    removeDelegate:function () {
        cc.imeDispatcher.removeDelegate(this);
    },

    attachWithIME:function () {
        var ret = cc.imeDispatcher.attachDelegateWithIME(this);
        if(ret){
           // this._isAttachWithIME = true;
          //  this._updateText = true;
        }
        cc.log("attachWithIME: " +ret);
        return ret;
    },

    detachWithIME:function () {
        var ret = cc.imeDispatcher.detachDelegateWithIME(this);
        if(ret){
           // this._isAttachWithIME = false;
          //  this._updateText = true;
        }
        cc.log("detachWithIME: " +ret);
        return ret;
    },

    tabKeyPressed : function () {
        if(this.nextTextField && this.nextTextField instanceof  newui.TextField){
            this.detachWithIME();
            this.nextTextField.attachWithIME();
        }
    },

    canAttachWithIME:function () {
        return this._canAttachIME;
    },

    canDetachWithIME:function () {
        return this._canDetachIME;
    },

    didAttachWithIME:function () {
        cc.log("didAttachWithIME");
        this._isAttachWithIME = true;
     //   this._updateText = true;

        this.textCursor.setVisible(true);
        var action = new cc.Sequence(new cc.Blink(0.3, 1), new cc.Blink(0.3, 0));
        this.textCursor.runAction(new cc.RepeatForever(action));
        this.updateText();

        if(this._focusListener){
            this._focusListener(true);
        }
    },

    didDetachWithIME:function () {
        cc.log("didDetachWithIME");
        this._isAttachWithIME = false;
       // this._updateText = true;

        this.textCursor.setVisible(false);
        this.textCursor.stopAllActions();
        this.updateText();

        if(this._focusListener){
            this._focusListener(false);
        }
    },

    deleteBackward:function () {
        var strLen = this._inputText.length;
        if (strLen === 0)
            return;

        // get the delete byte number
        var deleteLen = 1;    // default, erase 1 byte
        if (strLen <= deleteLen) {
            var newText = "";
        }
        else{
            var newText = this._inputText.substring(0, strLen - deleteLen);
        }

        if(this._textChangeListener && this._textChangeListener(newui.TextField.DELETE_TEXT, newText)){
            return;
        }

        this._inputText = newText;
        this.string = this._inputText;
        this._updateText = true;
    },

    insertText:function (text, len) {
        var sInsert = text;
        var pos = sInsert.indexOf('\n');
        if (pos > -1) {
            sInsert = sInsert.substring(0, pos);
        }

        if (sInsert.length > 0) {
            var newText = this._inputText + sInsert;
            if(this._textMaxLength > 0){
                if(newText.length > this._textMaxLength){
                    newText = newText.substring(0, this._textMaxLength);
                }
            }

            if(this._textChangeListener && this._textChangeListener(newui.TextField.INSERT_TEXT, newText)){
                return;
            }

            this._inputText = newText;
            this.string = this._inputText;
            this._updateText = true;
        }
        if (pos === -1){
            return;
        }

        if(this._returnCallback && this._returnCallback()){
            return;
        }
        this.detachWithIME();
    },

    getContentText:function () {
        return this._inputText;
    },

    // keyboardWillShow:function (info) {
    //     cc.log("keyboardWillShow");
    // },
    //
    // keyboardDidShow:function (info) {
    //     cc.log("keyboardDidShow");
    // },
    //
    // keyboardWillHide:function (info) {
    //     cc.log("keyboardWillHide");
    // },
    //
    // keyboardDidHide:function (info) {
    //     cc.log("keyboardDidHide");
    // }
});

newui.TextField.ALIGNMENT_CENTER = 0;
newui.TextField.ALIGNMENT_LEFT = 1;
newui.TextField.INSERT_TEXT = 1;
newui.TextField.DELETE_TEXT = 2;