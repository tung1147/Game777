/**
 * Created by Quyet Nguyen on 7/11/2016.
 */

var subLayer_icon_img1 = ["#lobby-clubs-1.png", "#lobby-hearts-1.png", "#lobby-diamonds-1.png", "#lobby-spades-1.png", "#lobby-start-1.png"];
var subLayer_icon_img2 = ["#lobby-clubs-2.png", "#lobby-hearts-2.png", "#lobby-diamonds-2.png", "#lobby-spades-2.png", "#lobby-start-2.png"];

var LobbySubLayer = cc.Node.extend({
    ctor : function (titleFrameName) {
        this._super();

        var topBar = new cc.Node();
        topBar.setContentSize(cc.size(1280.0, 720.0));
        topBar.setPosition(cc.p(0.0, 720.0));
        topBar.setAnchorPoint(cc.p(0.0, 1.0));
        this.addChild(topBar);
        topBar.setScale(cc.winSize.screenScale);

        this.backBt = new ccui.Button("top_bar_backBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        this.backBt.setPosition(54, 660);
        topBar.addChild(this.backBt);

        this.settingBt = new ccui.Button("top_bar_settingBt.png", "", "", ccui.Widget.PLIST_TEXTURE);
        this.settingBt.setPosition(1224, this.backBt.y);
        topBar.addChild(this.settingBt);

        if(titleFrameName){
            var title = new cc.Sprite(titleFrameName);
            title.setPosition(640, this.backBt.y);
            topBar.addChild(title);
        }
    },
    
    _initTab : function (normalFrame, selectedFrame, allLayer) {
        var thiz = this;

        var bottomBar = new cc.Node();
        bottomBar.setPosition(0, 30);
        this.addChild(bottomBar);
        bottomBar.setScale(cc.winSize.screenScale);

        var gameNav = new ccui.Scale9Sprite("sublobby-tab-bg.png", cc.rect(20, 0, 4, 49));
        gameNav.setPreferredSize(cc.size(960, 49));
        gameNav.setPosition(640, gameNav.getContentSize().height/2);
        bottomBar.addChild(gameNav);

        var dx = gameNav.getContentSize().width / normalFrame.length;
        var x = gameNav.x - gameNav.getContentSize().width / 2 + dx / 2;

        var selectedSprite = new ccui.Scale9Sprite("home-gameNav-selected.png", cc.rect(4,4,4,4));
        selectedSprite.setPreferredSize(cc.size(dx, gameNav.getContentSize().height));
        selectedSprite.setPosition(0, gameNav.y);
        bottomBar.addChild(selectedSprite, 1);

        var mToggle = new ToggleNodeGroup();
        bottomBar.addChild(mToggle);

        for (var i = 0; i < normalFrame.length; i++) {
            (function () {
                var icon1 = new cc.Sprite(subLayer_icon_img1[i]);
                icon1.setPosition(x + dx * i, gameNav.y);
                bottomBar.addChild(icon1);

                var icon2 = new cc.Sprite(subLayer_icon_img2[i]);
                icon2.setPosition(icon1.getPosition());
                bottomBar.addChild(icon2);

                var tabName1 = new cc.Sprite(normalFrame[i]);
                tabName1.setPosition(icon1.getPosition());
                bottomBar.addChild(tabName1);

                var tabName2 = new cc.Sprite(selectedFrame[i]);
                tabName2.setPosition(icon1.getPosition());
                bottomBar.addChild(tabName2);

                var mNode = allLayer[i];

                var toggleItem = new ToggleNodeItem(icon1.getContentSize());
                toggleItem.setPosition(icon1.x, selectedSprite.y);
                mToggle.addItem(toggleItem);
                
                toggleItem.onSelect = function (force) {
                    icon1.visible = false;
                    icon2.visible = true;
                    tabName1.visible = false;
                    tabName2.visible = true;
                    mNode.setVisible(false);

                    selectedSprite.stopAllActions();
                    if(force){
                        selectedSprite.x = icon1.x;
                    }
                    else{

                        selectedSprite.runAction(new cc.MoveTo(0.1, cc.p(icon1.x, selectedSprite.y)));
                    }
                    thiz._onSelectTabLayer(mNode);
                };
                toggleItem.onUnSelect = function () {
                    icon1.visible = true;
                    icon2.visible = false;
                    tabName1.visible = true;
                    tabName2.visible = false;
                    mNode.setVisible(false);
                }
            })();
        }

        this.mToggle = mToggle;

        return bottomBar;
    },

    _onSelectTabLayer : function (layer) {
        layer.setVisible(true);
    }
});