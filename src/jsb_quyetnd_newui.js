/**
 * Created by Quyet Nguyen on 6/28/2016.
 */
newui.TableView.prototype._ctor = function (size, row) {
    this.initWithSize(size, row);
    return true;
};

newui.ListViewWithAdaptor.prototype._ctor = function (size) {
    this.initWithSize(size);
    return true;
};

newui.EditBox.prototype._ctor = function () {
    if(arguments.length == 1){
        this.initWithSize(arguments[0]);
        
    }
    else if(arguments.length == 3){
        this.initWithSizeAndBackgroundSprite(arguments[0], arguments[1], arguments[2]);
    }
    return true;
};

newui.EditBox.InputMode = newui.EditBox.InputMode || {};
newui.EditBox.InputMode.ANY = 0;
newui.EditBox.InputMode.EMAIL_ADDRESS = 1;
newui.EditBox.InputMode.NUMERIC = 2;
newui.EditBox.InputMode.PHONE_NUMBER = 3;
newui.EditBox.InputMode.URL = 4;
newui.EditBox.InputMode.DECIMAL = 5;
newui.EditBox.InputMode.SINGLE_LINE = 6;

newui.EditBox.ReturnType = newui.EditBox.ReturnType || {};
newui.EditBox.ReturnType.DEFAULT = 0;
newui.EditBox.ReturnType.DONE = 1;
newui.EditBox.ReturnType.SEND = 2;
newui.EditBox.ReturnType.SEARCH = 3;
newui.EditBox.ReturnType.GO = 4;

newui.EditBox.InputFlag = newui.EditBox.InputFlag || {};
newui.EditBox.InputFlag.PASSWORD = 0;
newui.EditBox.InputFlag.SENSITIVE = 1;
newui.EditBox.InputFlag.INITIAL_CAPS_WORD = 2;
newui.EditBox.InputFlag.INITIAL_CAPS_SENTENCE = 3;
newui.EditBox.InputFlag.INITIAL_CAPS_ALL_CHARACTERS = 4;

newui.TextField.ALIGNMENT_CENTER = 0;
newui.TextField.ALIGNMENT_LEFT = 1;
newui.TextField.INSERT_TEXT = 1;
newui.TextField.DELETE_TEXT = 2;

newui.TextField.prototype._ctor = function () {
    if(arguments.length == 2){ //bm font
        this.initWithBMFont(arguments[0], arguments[1]);
        return;
    }
    else if(arguments.length == 3){
        if(typeof arguments[1] === 'string'){
            if(arguments[1].endsWith(".fnt")){
                this.initWithBMFont(arguments[0], arguments[1], arguments[2]);
                return;
            }
            else{
                this.initWithTTFFont(arguments[0], arguments[1], arguments[2]);
                return;
            }
        }
    }
    else if(arguments.length == 4){
        this.initWithTTFFont(arguments[0], arguments[1], arguments[2], arguments[3]);
        return;
    }
    else if(arguments.length == 5){
        this.initWithTTFFont(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
    }

    cc.Node.prototype.init.call(this)
};

newui.Widget.prototype._ctor = function () {
    ccui.Widget.prototype.init.call(this);
    if(arguments.length == 1){
        this.setVirtualRendererSize(arguments[0]);
    }
};