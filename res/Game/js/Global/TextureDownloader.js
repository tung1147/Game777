/**
 * Created by Quyet Nguyen on 5/31/2017.
 */
var TextureDownloader = TextureDownloader || {};
//var s_TextureDownloaderCache = s_TextureDownloaderCache || {};

TextureDownloader.load = function (url, callback) {
    if(cc.sys.isNative){
        TextureDownloader._loadNative(url, callback);
    }
    else{
        TextureDownloader._loadWeb(url, callback);
    }
};

TextureDownloader._getUrlSec = function (url) {
    var url1 = url.substring(4, url.length);
    if(url1[0] === 's'){
        return url;
    }
    return ("https" + url1);
};

TextureDownloader._getUrlNotSec = function (url) {
    var url1 = url.substring(4, url.length);
    if(url1[0] !== 's'){
        return url;
    }
    return ("http" + url.substring(5, url.length));
};

TextureDownloader._loadNative = function (url, callback) {
    var urlNotSec = TextureDownloader._getUrlNotSec(url);
    var textureInCache = cc.textureCache.getTextureForKey(urlNotSec);
    if(textureInCache){
        callback(textureInCache);
    }

    var urlSec = TextureDownloader._getUrlSec(url);
    textureInCache = cc.textureCache.getTextureForKey(urlSec);
    if(textureInCache){
        callback(textureInCache);
    }

    quyetnd.ResourcesDownloader.loadTexture(urlNotSec, function (texture) {
        if(texture){
            callback(texture);
        }
        else{
            quyetnd.ResourcesDownloader.loadTexture(urlSec, function (texture) {
                callback(texture);
            });
        }
    });
};

TextureDownloader._loadWeb = function (url, callback) {
    var urlSec = TextureDownloader._getUrlSec(url);
    var textureInCache = cc.textureCache.getTextureForKey(urlSec);
    if(textureInCache){
        callback(textureInCache);
    }

    var urlNotSec = TextureDownloader._getUrlNotSec(url);
    textureInCache = cc.textureCache.getTextureForKey(urlNotSec);
    if(textureInCache){
        callback(textureInCache);
    }

    cc.loader.loadImg(urlSec, function (err, texture) {
        if(texture){
            cc.textureCache.cacheImage(url, texture);
            callback(texture);
        }
        else{
            cc.loader.loadImg(urlNotSec, function (err, texture) {
                if(texture){
                    cc.textureCache.cacheImage(url, texture);
                }
                callback(texture);
            });
        }
    });
};