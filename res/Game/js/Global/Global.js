/**
 * Created by Quyet Nguyen on 7/6/2016.
 */

String.prototype.insertAt=function(index, string) {
    return this.substr(0, index) + string + this.substr(index);
}
var cc = cc || {};
cc.Global = cc.Global || {};
cc.Global.NumberFormat1 = function (number) {
    var pret = Math.abs(number).toString();
    if(pret.length > 3){
        for(var i=pret.length-3; i>0;i-=3){
            pret = pret.insertAt(i,",");
        }
    }
    if(number < 0){
        return "-"+pret;
    }
    return pret;
};

var Number_Format_Type = ["", "K", "M", "B"];
cc.Global.NumberFormat2 = function (number) {
    var i = 0;
    while(number >= 1000){
        number = Math.floor(number/1000);
        i++;
    }
    return (number.toString() + Number_Format_Type[i]);
};

cc.Global.NumberFromString = function (str) {
    var numberText = str.replace(/[.,]/g,'');
    if(numberText && cc.Global.IsNumber(numberText)){
        return parseInt(numberText);
    }
    return null;
};

cc.Global.NumberFormatWithPadding = function (number, size) {
    if(size == undefined){
        size = 2;
    }
    if(number < 0){
        return number.toString();
    }
    var str = number.toString();
    while(str.length < size){
        str = "0"+str;
    }
    return str;
};

cc.Global.DateToString = function (d) {
    var timeString = cc.Global.NumberFormatWithPadding(d.getDate()) + "/" +
        cc.Global.NumberFormatWithPadding(d.getMonth() + 1) + "/" +
        (1900 + d.getYear()).toString() + "\n" +
        cc.Global.NumberFormatWithPadding(d.getHours()) + ":" +
        cc.Global.NumberFormatWithPadding(d.getMinutes()) + ":" +
        cc.Global.NumberFormatWithPadding(d.getSeconds());
    return timeString;
};

//cc.winSize.screenScale = cc.winSize.width / 1280.0;
cc.res = cc.res || {};
cc.res.font = cc.res.font || {};
if(cc.sys.isNative){
    cc.res.font.Roboto_Condensed = "res/fonts/Roboto-Condensed.ttf";
    cc.res.font.Roboto_CondensedBold = "res/fonts/Roboto-BoldCondensed.ttf";
    cc.res.font.UTM_AvoBold = "res/fonts/UTM-AvoBold.ttf";
}
else{
    cc.res.font.Roboto_Condensed = "Roboto-Condensed";
    cc.res.font.Roboto_CondensedBold = "Roboto-BoldCondensed";
    cc.res.font.UTM_AvoBold = "UTM-AvoBold";
}

cc.res.font.Roboto_Condensed_40 = "res/fonts/RobotoCondensed_40.fnt";
cc.res.font.Roboto_CondensedBold_40 = "res/fonts/RobotoBoldCondensed_40.fnt";
cc.res.font.UTM_AvoBold_40 = "res/fonts/UTMAvoBold_40.fnt";

cc.res.font.Roboto_Condensed_30 = "res/fonts/RobotoCondensed_30.fnt";
cc.res.font.Roboto_CondensedBold_30 = "res/fonts/RobotoBoldCondensed_30.fnt";
cc.res.font.UTM_AvoBold_30 = "res/fonts/UTMAvoBold_30.fnt";

cc.res.font.Roboto_Condensed_25 = "res/fonts/RobotoCondensed_25.fnt";
cc.res.font.Roboto_CondensedBold_25 = "res/fonts/RobotoBoldCondensed_25.fnt";
cc.res.font.UTM_AvoBold_25 = "res/fonts/UTMAvoBold_25.fnt";

cc.res.font.Roboto_BoldCondensed_36_Glow = "res/fonts/Roboto_BoldCondensed_36_Glow.fnt";
cc.res.font.videoPokerRewardFont = "res/fonts/videoPokerRewardFont.fnt";

cc.res.font.Roboto_Condensed_14 = "res/fonts/RobotoCondensed_14.fnt";
cc.res.font.Roboto_CondensedBold_14 = "res/fonts/RobotoBoldCondensed_14.fnt";

cc.res.font.Roboto_Condensed_16 = "res/fonts/RobotoCondensed_16.fnt";
cc.res.font.Roboto_CondensedBold_16 = "res/fonts/RobotoBoldCondensed_16.fnt";

cc.res.font.Roboto_Condensed_18 = "res/fonts/RobotoCondensed_18.fnt";
cc.res.font.Roboto_CondensedBold_18 = "res/fonts/RobotoBoldCondensed_18.fnt";

cc.res.font.Roboto_Condensed_20 = "res/fonts/RobotoCondensed_20.fnt";
cc.res.font.Roboto_CondensedBold_20 = "res/fonts/RobotoBoldCondensed_20.fnt";

cc.res.font.Roboto_fonttime = "res/fonts/fonttime1.fnt";
cc.res.font.Roboto_fonttime = "res/fonts/fonttime1.fnt";

var GameType = GameType || {};
GameType.GAME_MauBinh = 0;
GameType.GAME_TienLenMN = 1;
GameType.GAME_Phom = 2;
GameType.GAME_Sam = 3;
GameType.GAME_BaCay = 4;
GameType.GAME_XocDia = 5;
GameType.GAME_TaiXiu = 6;
GameType.GAME_VongQuayMayMan = 7;
GameType.GAME_TLMN_Solo = 8;
GameType.GAME_Sam_Solo = 9;
GameType.GAME_Lieng = 10;
GameType.GAME_BaCayChuong = 11;
GameType.MiniGame_ChanLe = 12;
GameType.MiniGame_CaoThap = 13;
GameType.MiniGame_Poker = 14;
GameType.MiniGame_VideoPoker = 15;
GameType.GAME_Poker = 16;
GameType.GAME_SLOT_FRUIT = 17;

var s_game_available = s_game_available || {};
s_game_available[GameType.GAME_MauBinh] = true;
s_game_available[GameType.GAME_TienLenMN] = true;
s_game_available[GameType.GAME_Phom] = true;
s_game_available[GameType.GAME_Sam] = true;
s_game_available[GameType.GAME_BaCay] = true;
s_game_available[GameType.GAME_XocDia] = true;
s_game_available[GameType.GAME_TaiXiu] = true;
s_game_available[GameType.GAME_VongQuayMayMan] = true;
s_game_available[GameType.GAME_TLMN_Solo] = true;
s_game_available[GameType.GAME_Sam_Solo] = true;
s_game_available[GameType.GAME_Lieng] = false;
s_game_available[GameType.GAME_BaCayChuong] = false;
s_game_available[GameType.MiniGame_ChanLe] = true;
s_game_available[GameType.MiniGame_CaoThap] = true;
s_game_available[GameType.MiniGame_Poker] = true;
s_game_available[GameType.MiniGame_VideoPoker] = true;
s_game_available[GameType.GAME_Poker] = true;

var s_game_id = s_game_id || [
    [
        GameType.GAME_TLMN_Solo, GameType.GAME_TienLenMN,
        GameType.GAME_Poker, GameType.GAME_MauBinh,
        GameType.GAME_Sam_Solo, GameType.GAME_Sam,
        GameType.GAME_Phom, GameType.GAME_BaCay,
        GameType.GAME_XocDia, GameType.GAME_TaiXiu,
        GameType.MiniGame_ChanLe, GameType.MiniGame_Poker,
        GameType.MiniGame_VideoPoker, GameType.MiniGame_CaoThap,
        GameType.GAME_VongQuayMayMan
    ],
    [
        GameType.GAME_TLMN_Solo, GameType.GAME_TienLenMN,
        GameType.GAME_Poker, GameType.GAME_MauBinh,
        GameType.GAME_Sam_Solo, GameType.GAME_Sam,
        GameType.GAME_Phom, GameType.GAME_BaCay
    ],
    [
        GameType.MiniGame_CaoThap, GameType.MiniGame_Poker,
        GameType.MiniGame_ChanLe,GameType.MiniGame_VideoPoker,GameType.GAME_VongQuayMayMan
    ],
    [

    ],
    [
        GameType.GAME_TLMN_Solo, GameType.GAME_Sam_Solo,
        GameType.GAME_TaiXiu, GameType.GAME_XocDia
    ]
];

var s_mini_game_id = [GameType.MiniGame_CaoThap, GameType.MiniGame_Poker, GameType.MiniGame_VideoPoker];
var s_games_display_name = s_games_display_name || [];
s_games_display_name[GameType.GAME_TLMN_Solo] = "TLMN ĐẾM LÁ SOLO";
s_games_display_name[GameType.GAME_TienLenMN] = "TIẾN LÊN MIỀN NAM";
s_games_display_name[GameType.GAME_Sam] = "SÂM LỐC";
s_games_display_name[GameType.GAME_Sam_Solo] = "SÂM SOLO";
s_games_display_name[GameType.GAME_XocDia] = "XÓC ĐĨA";
s_games_display_name[GameType.GAME_TaiXiu] = "TÀI XỈU";
s_games_display_name[GameType.GAME_MauBinh] = "MẬU BINH";
s_games_display_name[GameType.GAME_Phom] = "PHỎM";
s_games_display_name[GameType.GAME_BaCay] = "BA CÂY NHẤT ĂN TẤT";
s_games_display_name[GameType.GAME_Lieng] = "LIÊNG";
s_games_display_name[GameType.GAME_BaCayChuong] = "BA CÂY CHƯƠNG";
s_games_display_name[GameType.MiniGame_CaoThap] = "Cao thấp";
s_games_display_name[GameType.MiniGame_Poker] = "MiniPoker";
s_games_display_name[GameType.MiniGame_VideoPoker] = "VideoPoker";
s_games_display_name[GameType.GAME_Poker] = "Poker";

var s_games_chanel = s_games_chanel || [];
s_games_chanel[GameType.GAME_TLMN_Solo] = "tlmn_solo";
s_games_chanel[GameType.GAME_TienLenMN] = "tlmn_tudo";
s_games_chanel[GameType.GAME_Sam] = "sam_tudo";
s_games_chanel[GameType.GAME_Sam_Solo] = "sam_solo";
s_games_chanel[GameType.GAME_XocDia] = "ShakeDisk";
s_games_chanel[GameType.GAME_TaiXiu] = "TaiXiu";
s_games_chanel[GameType.GAME_MauBinh] = "ChinesePoker";
s_games_chanel[GameType.GAME_Phom] = "Phom";
s_games_chanel[GameType.GAME_BaCay] = "ThreeCards";
s_games_chanel[GameType.GAME_Lieng] = "lieng";
s_games_chanel[GameType.GAME_BaCayChuong] = "bacaychuong";
s_games_chanel[GameType.GAME_Poker] = "Poker";

var s_games_chanel_id = s_games_chanel_id || {};
(function () {
    for(var i=0;i<s_games_chanel.length;i++){
        var gameName = s_games_chanel[i];
        if(gameName && gameName != ""){
            s_games_chanel_id[gameName] = i;
        }
    }
})();

var PlayerMe = PlayerMe || {};
PlayerMe.username = "quyetnd";
PlayerMe.password = "1234567";
PlayerMe.phoneNumber = "0123456789";
PlayerMe.gameType = "";
PlayerMe.gold = 1000;
PlayerMe.exp = 11000;
PlayerMe.vipExp = 1000;
PlayerMe.avatar = "";
PlayerMe.spin = 0;
PlayerMe.messageCount = 0;
PlayerMe.missionCount = 0;
PlayerMe.SFS = PlayerMe.SFS || {};

var GameConfig = GameConfig || {};
GameConfig.email = "c567vip@gmail.com";
GameConfig.hotline = "0903.229.747";
GameConfig.fanpage = "https://www.facebook.com/C567gamebaidoithuong/";
GameConfig.broadcastMessage = "";
GameConfig.DeviceIDKey = "";

var LevelData = null;
var VipData = null;
var StringData = null;

cc.Global.getStringRes = function () {
    if(!StringData){
        if(cc.sys.isNative){
            StringData = JSON.parse(jsb.fileUtils.getStringFromFile("res/data/String.json"));
        }
        else{
            StringData = cc.loader.getRes("res/data/String.json");
        }
    }
    return StringData;
};

cc.Global.GetLevel = function (exp) {
    if(!LevelData){
        if(cc.sys.isNative){
            LevelData = JSON.parse(jsb.fileUtils.getStringFromFile("res/data/LevelData.json"));
        }
        else{
            LevelData = cc.loader.getRes("res/data/LevelData.json");
        }
    }

    var preLevel = LevelData[0];
    for(var i=1;i<LevelData.length;i++){
        var obj = LevelData[i];
        if(exp >= preLevel.exp && exp < obj.exp){
            var expPer = 100.0 * (exp - preLevel.exp) / (obj.exp - preLevel.exp);
            return {
                level : i-1,
                expPer : expPer,
                content : preLevel.content
            };
        }
        preLevel = obj;
    }
    return {
        level : LevelData.length-1,
        expPer : 100.0,
        content : preLevel.content
    };
};
cc.Global.GetVip = function (exp) {
    if(!VipData){
        if(cc.sys.isNative){
            VipData = JSON.parse(jsb.fileUtils.getStringFromFile("res/data/VipData.json"));
        }
        else{
            VipData = cc.loader.getRes("res/data/VipData.json");
        }
    }

    var preLevel = VipData[0];
    for(var i=1;i<VipData.length;i++){
        var obj = VipData[i];
        if(exp >= preLevel.exp && exp < obj.exp){
            var expPer = 100.0 * (exp - preLevel.exp) / (obj.exp - preLevel.exp);
            return {
                level : i-1,
                expPer : expPer,
                content : preLevel.content
            };
        }
        preLevel = obj;
    }
    return {
        level : VipData.length-1,
        expPer : 100.0,
        content : preLevel.content
    };
};

cc.Global.GetLevelMe = function () {
    return cc.Global.GetLevel(PlayerMe.exp);
};
cc.Global.GetVipMe = function () {
    return cc.Global.GetVip(PlayerMe.vipExp);
};

cc.Global.GetSetting = function (setting, defaultValue) {
    var value = cc.sys.localStorage.getItem(setting);
    if(value){
        try {
            return JSON.parse(value);
        } catch (e) {
            return value;
        }
    }
    return defaultValue;
};
cc.Global.SetSetting = function (setting, value) {
    cc.sys.localStorage.setItem(setting, value);
};

var ApplicationConfig = ApplicationConfig || {};
ApplicationConfig.DISPLAY_TYPE = "room"; //room - betting
(function () {
    if(cc.sys.isNative){
        if(cc.sys.os === cc.sys.OS_IOS){
            ApplicationConfig.PLATFORM = 1;
        }
        else if(cc.sys.os === cc.sys.OS_ANDROID){
            ApplicationConfig.PLATFORM = 2;
        }
        else if(cc.sys.os === cc.sys.OS_WINRT){
            ApplicationConfig.PLATFORM = 3;
        }
        else if(cc.sys.os === cc.sys.OS_WINDOWS){
            ApplicationConfig.PLATFORM = 3;
        }
        else{
            ApplicationConfig.PLATFORM = 2;
        }
    }
    else{
        ApplicationConfig.PLATFORM = 4;
    }
})();

cc.Global.NodeIsVisible = function (node) {
    while(node){
        if(!node.visible){
            return false;
        }
        node = node.getParent();
    }
    return true;
};

cc.Global.getSaveUsername = function () {
    return cc.Global.GetSetting("username", "");
};

cc.Global.setSaveUsername = function (userName) {
    cc.Global.SetSetting("username", userName);
};

cc.Global.getSavePassword = function () {
    return cc.Global.GetSetting("password", "");
};

cc.Global.setSavePassword = function (passwords) {
    cc.Global.SetSetting("password", passwords);
};

cc.Global.IsNumber = function (str) {
    var numberText = str.replace(/[.,]/g,'');
    var re = new RegExp("^[0-9]+$");
    return re.test(numberText);
};

if(cc.sys.isNative){
    ccui.Slider.prototype._ctor = function (barTextureName, normalBallTextureName, resType) {
        this.init();
        if(barTextureName){
            this.loadBarTexture(barTextureName, resType);
        }
        if(normalBallTextureName){
            this.loadSlidBallTextureNormal(normalBallTextureName, resType);
        }
    };
}

cc.Global.openURL = function (url) {
    if(cc.sys.isNative){
        cc.Application.getInstance().openURL(url);
    }
    else{
        var win = window.open(url, '_blank');
        win.focus();
    }
};