/**
 * Created by QuyetNguyen on 11/9/2016.
 */
var SystemPlugin = (function () {
    var instance = null;
    var Clazz = cc.Class.extend({
        plugin: null,
        ctor: function () {
            if (instance) {
                throw "Cannot create new instance for Singleton Class";
            } else {
                //init
            }
        },

        getPackageName: function () {
            //return "com.puppet.gamebai2";
            return "com.c567.webv2";
          //  return "com.songbaivip.fullhd";
        },

        getVersionName: function () {
            return "1.0.0";
        },

        getDeviceUUID: function () {
            var uniqueId = localStorage.getItem("___uniqueId___");
            if (!uniqueId) {
                function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
                }
                uniqueId = (function () {
                    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
                })();
                localStorage.setItem("___uniqueId___", uniqueId);
            }
            return uniqueId;
        },

        getDeviceUUIDWithKey: function (key) {
            return this.getDeviceUUID();
        },

        buyIAPItem: function (itemBundle) {

        },

        iOSInitStore: function (itemList) {

        },

        //event
        // onBuyItemFinishAndroid : function (returnCode, signature, json) {
        //
        // },
        //
        // onBuyItemFinishIOS : function (returnCode, signature) {
        //
        // },
        //
        // onRegisterNotificationSuccess : function (deviceId, token) {
        //
        // },
        exitApp: function () {

        },
        enableMipmapTexture: function (texture) {

        },
        showCallPhone: function (phoneNumber) {

        },
        androidRequestPermission: function (permissions, requestCode) {

        },
        androidCheckPermission: function (permission) {

        },
        startLaucher: function () {

        },
        checkFileValidate: function (file) {

        },
        showSMS: function (smsNumber, smsContent) {

        },
        getCarrierName: function () {

        },
        getPushNotificationToken: function () {

        },
        downloadFile: function (url, savePath, callback) {

        }
    });

    Clazz.getInstance = function () {
        if (!instance) {
            instance = new Clazz();
        }
        return instance;
    }
    return Clazz;
})();