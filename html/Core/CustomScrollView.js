/**
 * Created by Quyet Nguyen on 4/13/2017.
 */

var newui = newui || {};
newui.CustomScrollView = ccui.ScrollView.extend({
    ctor : function (size) {
        this._super();

        this._parentIsPageView = false;
        this._checkParentPageView = false;
        this._moveByTouch = false;
        this._propagateTouchEvents = false;
        this._contentRect = cc.rect(0,0,size.width, size.height);

        this.setContentSize(size);
        this.setBounceEnabled(true);
        this.setScrollBarEnabled(false);
    },

    _beforeVisit : function () {

    },

    _afterVisit : function () {

    },

    _beforeRender : function () {

    },

    _afterRender : function () {

    },

    _initMouseScrollEvent : function () {
        var thiz = this;
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseScroll: function (event) {
                if(event._eventAlready === true){
                    return false;
                }

                var location = event.getLocation();
                if(thiz._testPointInView(location) && thiz.isRunning() && !thiz._isInterceptTouch && !this._moveByTouch){
                    var delta = cc.sys.isNative ? event.getScrollY() * 6 : -event.getScrollY();
                    var p = thiz.convertToNodeSpace(location);
                    if(cc.rectContainsPoint(thiz._contentRect, p)){
                        var ret = thiz.onMouseScrolling(delta);
                        if(ret){
                            event._eventAlready = true;
                        }
                        return ret;
                    }
                }
                return false;
            }
        }, this);
    },

    _checkViewVisible : function () {
        var node = this;
        while(node){
            if(!node.isVisible()){
                return false;
            }
            node = node.getParent();
        }
        return true;
    },

    _testPointInView : function (p) {
        if(this._checkViewVisible() == false){
            return false;
        }

        if(this.hitTest(p) && this.isClippingParentContainsPoint(p)){
            return true;
        }
        return false;
    },

    _handlePressLogic: function (touch) {
        this._super(touch);
        if (this._parentIsPageView){
            ccui.Layout.prototype.interceptTouchEvent.call(this, ccui.Widget.TOUCH_BEGAN, this, touch);

            this._startPoint = touch.getLocation();
            this._moveThis = false;
            this._moveParent = false;
            this._moveByTouch = true;
        }
    },

    _handleMoveLogic: function (touch) {
        if (this._parentIsPageView){
            if (!this._moveThis && !this._moveParent){
                var p =  cc.pSub(touch.getLocation(), this._startPoint);
                if (Math.abs(p.x) > Math.abs(p.y)){
                    this._moveParent = true;
                }
                else{
                    this._moveThis = true;
                }
            }
            if (this._moveThis){
                this._super(touch);
            }
            else if (this._moveParent){
                ccui.Layout.prototype.interceptTouchEvent.call(this, ccui.Widget.TOUCH_MOVED, this, touch);
            }
        }
        else{
            this._super(touch);
        }
    },

    _handleReleaseLogic: function (touch) {
        if (this._parentIsPageView){
            ccui.Layout.prototype.interceptTouchEvent.call(this, ccui.Widget.TOUCH_ENDED, this, touch);
        }
        this._super(touch);
    },

    onMouseScrolling : function (delta) {
        if(!this._enabled){
            return false;
        }

        if(this._direction === ccui.ScrollView.DIR_VERTICAL){
            var maxDelta = this.getContentSize().height/10;
        }
        else{
            var maxDelta = this.getContentSize().width/10;
        }
        if(Math.abs(delta) > maxDelta){
            if(delta > 0){
                delta = maxDelta;
            }
            else{
                delta = -maxDelta;
            }
        }


        if(this._direction === ccui.ScrollView.DIR_VERTICAL){
            var pDelta = cc.p(0, delta);
        }
        else{
            var pDelta = cc.p(-delta, 0);
        }

        /* sida */
        var outOfBoundary = this._getHowMuchOutOfBoundary(pDelta);
        if(!this._fltEqualZero(outOfBoundary)) {
            pDelta.x += outOfBoundary.x;
            pDelta.y += outOfBoundary.y;
        }

        this._autoScrolling = false;
        this._moveInnerContainer(pDelta, true);

        return true;
    },

    _createRenderCmd: function(){
        if(cc._renderType === cc.game.RENDER_TYPE_WEBGL)
            return new newui.CustomScrollView.WebGLRenderCmd(this);
        else
            return new newui.CustomScrollView.CanvasRenderCmd(this);
    },

    setParent : function (parent) {
        this._super(parent);
        this._parentIsPageView = false;
        if (this._direction === ccui.ScrollView.DIR_VERTICAL){
            if (parent instanceof ccui.Layout){
                parent = parent.getParent();
                if (parent instanceof ccui.PageView){
                    this._parentIsPageView = true;
                }
            }
        }
    },

    visit : function (parentCmd) {
        if(!this._checkViewVisible()){
            return;
        }
        this._beforeVisit();
        this._super(parentCmd);
        this._afterVisit();
    },

    onEnter : function () {
        this._super();
        if ('mouse' in cc.sys.capabilities) {
            this._initMouseScrollEvent();
        }
    }
});

/* create render cmd */
(function () {
    if (!ccui.ProtectedNode.CanvasRenderCmd)
        return;
    newui.CustomScrollView.CanvasRenderCmd = function (renderable) {
        this._layoutCmdCtor(renderable);
        //this._needDraw = true;
        this._dirty = false;
    };

    var proto = newui.CustomScrollView.CanvasRenderCmd.prototype = Object.create(ccui.ScrollView.CanvasRenderCmd.prototype);
    proto.constructor = newui.CustomScrollView.CanvasRenderCmd;

    proto.rendering = function (ctx) {
        var currentID = this._node.__instanceId;
        var i, locCmds = cc.renderer._cacheToCanvasCmds[currentID], len,
            scaleX = cc.view.getScaleX(),
            scaleY = cc.view.getScaleY();
        var context = ctx || cc._renderContext;
        context.computeRealOffsetY();

        this._node._beforeRender();
        this._node.updateChildren();

        for (i = 0, len = locCmds.length; i < len; i++) {
            var checkNode = locCmds[i]._node;
            if (checkNode instanceof newui.CustomScrollView)
                continue;
            if (checkNode && checkNode._parent && checkNode._parent._inViewRect === false)
                continue;
            locCmds[i].rendering(context, scaleX, scaleY);
        }
        this._node._afterRender();
    };
})();


(function () {
    if (!ccui.ProtectedNode.WebGLRenderCmd)
        return;
    newui.CustomScrollView.WebGLRenderCmd = function (renderable) {
        this._layoutCmdCtor(renderable);
        this._needDraw = true;
        this._dirty = false;
    };

    var proto = newui.CustomScrollView.WebGLRenderCmd.prototype = Object.create(ccui.ScrollView.WebGLRenderCmd.prototype);
    proto.constructor = newui.CustomScrollView.WebGLRenderCmd;

    proto.rendering = function (ctx) {
        var currentID = this._node.__instanceId,
            locCmds = cc.renderer._cacheToBufferCmds[currentID],
            i, len, checkNode, cmd,
            context = ctx || cc._renderContext;
        if (!locCmds) {
            return;
        }

        this._node._beforeRender();
        this._node.updateChildren();

        // Reset buffer for rendering
        context.bindBuffer(gl.ARRAY_BUFFER, null);

        for (i = 0, len = locCmds.length; i < len; i++) {
            cmd = locCmds[i];
            checkNode = cmd._node;
            if (checkNode && checkNode._parent && checkNode._parent._inViewRect === false)
                continue;

            if (cmd.uploadData) {
                cc.renderer._uploadBufferData(cmd);
            }
            else {
                cc.renderer._batchRendering();
                if (cmd._batchingSize > 0) {
                    cc.renderer._batchRendering();
                }
                cmd.rendering(context);
            }
        }
        cc.renderer._batchRendering();
        this._node._afterRender();
    };
})();
