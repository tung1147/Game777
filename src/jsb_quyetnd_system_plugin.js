/**
 * Created by Quyet Nguyen on 6/24/2016.
 */

var SystemPlugin = (function() {
    var instance = null;
    var Clazz = cc.Class.extend({
        plugin: null,
        ctor: function() {
            if (instance) {
                throw "Cannot create new instance for Singleton Class";
            } else {
                this.plugin = new quyetnd.SystemPlugin();
                this.plugin.setTarget(this);
            }
        },

        getPackageName :function () {
            return this.plugin.getPackageName();
        },

        getVersionName : function () {
            return this.plugin.getVersionName();
        },

        getDeviceUUID : function () {
            return this.plugin.getDeviceUUID();
        },

        getDeviceUUIDWithKey : function (key) {
            return this.plugin.getDeviceUUIDWithKey(key);
        },

        buyIAPItem : function (itemBundle) {
            this.plugin.buyIAPItem(itemBundle);
        },

        iOSInitStore : function (itemList) {
            this.plugin.iOSInitStore(itemList);
        },
        
        //event
        onBuyItemFinishAndroid : function (returnCode, signature, json) {
            cc.log(returnCode + " - " + signature + " - " + json);
        },

        onBuyItemFinishIOS : function (returnCode, signature) {
            cc.log(returnCode + " - " + signature);
        },

        onRegisterNotificationSuccess : function (deviceId, token) {
            cc.log("onRegisterNotificationSuccess: "+deviceId + " - " + token);
        },
        exitApp : function () {
            this.plugin.exitApp();
        },
        enableMipmapTexture : function (texture) {
            this.plugin.enableMipmapTexture(texture);
        },
        showCallPhone : function (phoneNumber) {
            this.plugin.showCallPhone(phoneNumber);
        },
        androidRequestPermission : function (permissions, requestCode) {
            this.plugin.androidRequestPermission(permissions, requestCode);
        },
        androidCheckPermission : function (permission) {
            return this.plugin.androidCheckPermission(permission);
        },
        startLaucher : function () {
            this.plugin.startLaucher();
        },
        checkFileValidate : function (file) {
            return this.plugin.checkFileValidate(file);
        },
        showSMS : function (smsNumber, smsContent) {
            return this.plugin.showSMS(smsNumber, smsContent);
        },
        getCarrierName : function () {
            return this.plugin.getCarrierName();
        },
        getPushNotificationToken : function () {
            return this.plugin.getPushNotificationToken();
        },
        downloadFile : function (url, savePath, callback) {
            this.plugin.downloadFile.apply(this.plugin, arguments);
        }
    });

    Clazz.getInstance = function() {
        if (!instance) {
            instance = new Clazz();
        }
        return instance;
    }
    return Clazz;
})();