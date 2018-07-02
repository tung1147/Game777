/**
 * Created by QuyetNguyen on 11/10/2016.
 */

var cc = cc || {};
cc.Label = cc.Label || {};
cc.Label.createWithBMFont = function (fntFile, text, alignment, width, imageOffset) {
    return new cc.LabelBMFont(text, fntFile, width, alignment, imageOffset);
};

cc.LabelBMFont.prototype.getLineHeight = function () {
    return 0;
};

cc.LabelBMFont.prototype.setDimensions = function () {

};

var jsb = jsb || {};
jsb.fileUtils = jsb.fileUtils || {};
jsb.fileUtils.getStringFromFile = function (fileName) {
    var str =  cc.loader.getRes(fileName);
    return 0;
   // return fileName;
};

cc.PointZero = function () {
    return cc.p(0,0);
}

ccui.Button.prototype.getRendererNormal = function () {
    return this._buttonScale9Renderer;
};