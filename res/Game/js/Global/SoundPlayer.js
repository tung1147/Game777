/**
 * Created by QuyetNguyen on 12/19/2016.
 */

var SoundPlayer = SoundPlayer || {};
var s_sound_loop = s_sound_loop || {};

SoundPlayer._createURL = function (sound) {
    var soundUrl = "res/Sound/" + sound + ".mp3";
    return soundUrl;
};

SoundPlayer._playSingleSound = function (sound, loop, cb) {
    if (cc.Global.GetSetting("sound",false) == false){
        if(cb){
            cb();
        }
        return;
    }

    var soundUrl = SoundPlayer._createURL(sound);

    if(cc.sys.isNative){
        var audio = jsb.AudioEngine.play2d(soundUrl, loop);
        if(cb){
            jsb.AudioEngine.setFinishCallback(audio, function () {
                cb();
            });
        }
    }
    else{
        var audio = cc.audioEngine.playEffect(soundUrl, loop, cb);
    }
    return audio;
};

SoundPlayer._playMultiSound = function (soundList, index) {
    if(index >= soundList.length){
        return;
    }

    var audio = SoundPlayer._playSingleSound(soundList[index], false, function () {
        SoundPlayer._playMultiSound(soundList, (index + 1));
    });
};

SoundPlayer.playSound = function (sound, loop) {
    if(cc.isArray(sound)){
        if(sound.length == 1){
            SoundPlayer._playSingleSound(sound[0], false);
        }
        SoundPlayer._playMultiSound(sound, 0);
    }
    else{
        var soundLoop = loop ? true : false;
        var soundID = SoundPlayer._playSingleSound(sound, soundLoop);
        if(soundLoop){
            s_sound_loop[sound] = soundID;
        }
    }
};

SoundPlayer.stopSound = function (sound) {
    var soundId = s_sound_loop[sound];
    if(soundId !== null && soundId !== undefined){
        if(cc.sys.isNative){
            jsb.AudioEngine.stop(soundId);
        }
        else{
            cc.audioEngine.stopEffect(soundId);
        }
    }
    else{
        if(!cc.sys.isNative){
            //stop for web
            var soundUrl = SoundPlayer._createURL(sound);
            var ap = cc.audioEngine._audioPool;
            for(var p in ap){
                var list = ap[p];
                for(var i=0; i<list.length; i++){
                    var sound = list[i];
                    if(sound.src.endsWith(soundUrl)){
                        sound.stop();
                        return;
                    }
                }
            }
        }
    }
    s_sound_loop[sound] = null;
};

SoundPlayer.playSoundLoop = function (sound) {
    cc.log("playSoundLoop");
    var soundID = SoundPlayer._playSingleSound(sound, true);
    return soundID;
};

SoundPlayer.stopSoundLoop = function (soundId) {
    if(soundId !== null && soundId !== undefined){
        if(cc.sys.isNative){
            cc.log("stopSoundLoop");
            jsb.AudioEngine.stop(soundId);
        }
        else{
            cc.audioEngine.stopEffect(soundId);
        }
    }
};

SoundPlayer.stopAllSound = function () {
    s_sound_loop = {};
    if(cc.sys.isNative){
        jsb.AudioEngine.stopAll();
    }
    else{
        cc.audioEngine.stopAllEffects();
    }
};