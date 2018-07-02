/**
 * Created by QuyetNguyen on 1/17/2017.
 */

var quyetnd = quyetnd || {};
quyetnd.hotfixFunction = function () {
    cc.log("hotfixFunction");
    quyetnd.GamePaused = false;
    quyetnd.startUpdateBackground = function () {
        quyetnd._lastUpdateTime = Date.now();
        var frame_rate = 1000.0 / 60;

        var cb = function () {
            if(quyetnd._updateBackgroundFunc){
                window.clearTimeout(quyetnd._updateBackgroundFunc);
            }
            quyetnd.updateBackground();
            quyetnd._updateBackgroundFunc = window.setTimeout(cb, frame_rate);
        };
        quyetnd._updateBackgroundFunc = window.setTimeout(cb, frame_rate);
    };

    quyetnd.stopUpdateBackground = function () {
        if(quyetnd._updateBackgroundFunc){
            window.clearTimeout(quyetnd._updateBackgroundFunc);
            quyetnd.updateBackground();
        }
    };

    quyetnd.updateBackground = function () {
        var now = Date.now();
        var dt = (now - quyetnd._lastUpdateTime) / 1000;
        quyetnd._lastUpdateTime = now;
        var frame_rate = 1.0/ 60.0;

        while(dt > 0){
            var deltaTime = dt < frame_rate ? dt : frame_rate;
            cc.director._actionManager.update(deltaTime);
            cc.director._scheduler.update(deltaTime);
            dt -= frame_rate;
            cc.eventManager.dispatchEvent(cc.director._eventAfterUpdate);
        }
    };

    cc.director.pause = function () {
        //nothing
    };

    cc.game.pause = function () {
        if(quyetnd.GamePaused == false){
            quyetnd.GamePaused = true;
            quyetnd.startUpdateBackground();
            cc.log("pause");
        }

        // engine
        // if (this._paused) return;
        // this._paused = true;
        // // Pause audio engine
        // if (cc.audioEngine) {
        //     cc.audioEngine.stopAllEffects();
        //     cc.audioEngine.pauseMusic();
        // }
        // // Pause main loop
        // if (this._intervalId)
        //     window.cancelAnimationFrame(this._intervalId);
        // this._intervalId = 0;
    };

    cc.game.resume =  function () {
        if(quyetnd.GamePaused == true){
            quyetnd.GamePaused = false;
            quyetnd.stopUpdateBackground();
            cc.log("resume");
        }

        //engine
        if (!this._paused) return;
        this._paused = false;
        // Resume audio engine
        if (cc.audioEngine) {
            cc.audioEngine.resumeMusic();
        }
        // Resume main loop
        this._runMainLoop();
    };

    //fix mouse move out canvas (iframe)
    cc._canvas.addEventListener("mouseout", function (event) {
        var selfPointer = cc.inputManager;
        if(selfPointer._mousePressed){
            selfPointer._mousePressed = false;
            var pos = selfPointer.getHTMLElementPosition(cc._canvas);
            var location = selfPointer.getPointByEvent(event, pos);
            selfPointer.handleTouchesEnd([selfPointer.getTouchByXY(location.x, location.y, pos)]);

            var mouseEvent = selfPointer.getMouseEvent(location,pos,cc.EventMouse.UP);
            mouseEvent.setButton(event.button);
            cc.eventManager.dispatchEvent(mouseEvent);

            event.stopPropagation();
            event.preventDefault();
        }
    }, false);

    //yes
    window.onbeforeunload = function () {
        SmartfoxClient.getInstance().close();
        LobbyClient.getInstance().close();
    };
};