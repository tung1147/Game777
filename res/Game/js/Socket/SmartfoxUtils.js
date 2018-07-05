/**
 * Created by QuyetNguyen on 12/27/2016.
 */
var SmartfoxUtils = SmartfoxUtils || {};

SmartfoxUtils.getRoomInfo = function (sfsArray) {
    var roomInfo = {};
    roomInfo.roomId = sfsArray[0];
    roomInfo.roomName = sfsArray[1];
    roomInfo.groupId = sfsArray[2];
    roomInfo.isGame = sfsArray[3];
    roomInfo.isHidden = sfsArray[4];
    roomInfo.isPasswordProtected = sfsArray[5];
    roomInfo.userCount = sfsArray[6];
    roomInfo.maxUsers = sfsArray[7];
    roomInfo.isMMORoom = (sfsArray.length == 14);

    var variableData = sfsArray[8];
    roomInfo.roomVariable = {};
    for(var i=0;i<variableData.length; i++){
        var item = SmartfoxUtils.getRoomVariable(variableData[i]);
        roomInfo.roomVariable[item.name] = item;
    }

    if(roomInfo.isGame){
        roomInfo.spectatorCount = sfsArray[9];
        roomInfo.maxSpectators = sfsArray[10];
    }
    return roomInfo;
};

SmartfoxUtils.getUserInfo = function (sfsArray) {
    var userInfo = {};
    userInfo.userId = sfsArray[0];
    userInfo.username = sfsArray[1];
    userInfo.privilegeId = sfsArray[2];
    userInfo.playerId = sfsArray[3];
    userInfo.userVariable = {};

    var data = sfsArray[4];
    for(var i=0;i<data.length;i++){
        var item = SmartfoxUtils.getUserVariable(data[i]);
        userInfo.userVariable[item.name] = item;
    }

    return userInfo;
};

SmartfoxUtils.getUserVariable = function (data) {
    var userVariable = {};
    userVariable.name = data[0];
    userVariable.value = data[1];
    return userVariable;
};

SmartfoxUtils.getRoomVariable = function (data) {
    var roomVariable = SmartfoxUtils.getUserVariable(data);
    roomVariable.isPrivate = data[3];
    roomVariable.isPersistent = data[4];
    return roomVariable;
};