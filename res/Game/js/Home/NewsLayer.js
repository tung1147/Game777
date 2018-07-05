/**
 * Created by Quyet Nguyen on 7/11/2016.
 */

var NewsSubLayer = cc.Node.extend({
    ctor: function () {
        this._super();
        var _top = 554.0;
        var _bottom = 100.0 * cc.winSize.screenScale;

        var itemList = new newui.TableView(cc.size(cc.winSize.width, _top - _bottom), 1);
        itemList.setDirection(ccui.ScrollView.DIR_VERTICAL);
        itemList.setScrollBarEnabled(false);
        itemList.setPadding(10);
        itemList.setMargin(10, 30, 0, 0);
        itemList.setPosition(cc.p(0, _bottom));
        this.addChild(itemList, 1);
        this.itemList = itemList;
    }
});

var NewsNotificationLayer = NewsSubLayer.extend({
    ctor: function () {
        this._super();
        this.newsType = "event";
        this.dialogTitle = "Thông báo";
        var titleLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "THÔNG BÁO");
        titleLabel.setPosition(489.0 * cc.winSize.screenScale, 576);
        var timeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "THỜI GIAN");
        timeLabel.setPosition(1070.0 * cc.winSize.screenScale, 576);
        titleLabel.setOpacity(0.2 * 255);
        timeLabel.setOpacity(0.2 * 255);
        this.addChild(titleLabel);
        this.addChild(timeLabel);
        this.titleLabel = titleLabel;

        LobbyClient.getInstance().addListener("getNews", this.onNewData, this);
    },

    onNewData: function (command, data) {
        data = data["data"];
        var events = data["event"];
        if (!events)
            return;
        for (var i = 0; i < events.length; i++) {
            this.addMessage(events[i]["title"], events[i]["createTime"], events[i]["content"]);
        }
    },

    setVisible : function (visible) {
        NewsSubLayer.prototype.setVisible.call(this, visible);
        if(visible){
            this.itemList.removeAllItems();
            LobbyClient.getInstance().send({command: "getNews", type: this.newsType});
        }
    },

    onExit: function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
    },

    addMessage: function (title, time, content) {
        var container = new ccui.Widget();
        container.setContentSize(cc.size(this.itemList.getContentSize().width, 80));
        this.itemList.pushItem(container);

        var bg1 = new ccui.Scale9Sprite("sublobby-cell-bg.png", cc.rect(10, 0, 4, 78));
        bg1.setPreferredSize(cc.size(858 * cc.winSize.screenScale, 80));
        bg1.setPosition(489.0 * cc.winSize.screenScale, bg1.getContentSize().height / 2);
        container.addChild(bg1);

        var bg2 = new ccui.Scale9Sprite("sublobby-cell-bg.png", cc.rect(10, 0, 4, 78));
        bg2.setPreferredSize(cc.size(300 * cc.winSize.screenScale, 80));
        bg2.setPosition(1070.0 * cc.winSize.screenScale, bg1.y);
        container.addChild(bg2);

        var titleLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, title);
        titleLabel.setPosition(bg1.getPosition());
        container.addChild(titleLabel);

        var d = new Date(time);
        var timeLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, cc.Global.DateToString(d), cc.TEXT_ALIGNMENT_CENTER, 1000);
        timeLabel.setPosition(bg2.getPosition());
        container.addChild(timeLabel);

        container.setTouchEnabled(true);
        var thiz = this;
        container.addClickEventListener(function () {
            var dialog = new MessageDialog();
            dialog.title.setString(thiz.dialogTitle);
            dialog.setMessage(content);
            dialog.showWithAnimationScale();
        });
    }
});

var NewsTutorialLayer = NewsNotificationLayer.extend({
    ctor: function () {
        this._super();
        this.newsType = "guide";
        this.dialogTitle = "Hướng dẫn";
        this.titleLabel.setString("HƯỚNG DẪN");
    },
    onNewData: function (command, data) {
        var guides = data["data"]["guide"];
        if (!guides)
            return;
        for (var i = 0;i<guides.length;i++){
            this.addMessage(guides[i]["title"], guides[i]["createTime"], guides[i]["content"]);
        }
    }
});

var NewsLevelLayer = NewsSubLayer.extend({
    ctor: function () {
        this._super();

        var _left = 60.0 * cc.winSize.screenScale;
        var _padding = 2.0;
        this.width1 = 80.0;
        this.width2 = 180.0;
        this.width3 = cc.winSize.width - this.width1 - this.width2 - _padding * 2 - _left * 2;

        var levelLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "CẤP");
        levelLabel.setPosition(_left + this.width1 / 2, 576);
        levelLabel.setOpacity(0.2 * 255);
        this.addChild(levelLabel);
        this.levelLabel = levelLabel;

        var scoreLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "ĐIỂM");
        scoreLabel.setPosition(_left + this.width1 + this.width2 / 2 + _padding, 576);
        scoreLabel.setOpacity(0.2 * 255);
        this.addChild(scoreLabel);
        this.scoreLabel = scoreLabel;

        var contentLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "NỘI DUNG");
        contentLabel.setPosition(_left + this.width1 + this.width2 + this.width3 / 2 + _padding * 2, 576);
        contentLabel.setOpacity(0.2 * 255);
        this.addChild(contentLabel);
        this.contentLabel = contentLabel;

        this.initData();
    },

    addItem: function (level, score, content) {
        var contentlabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, content, cc.TEXT_ALIGNMENT_CENTER, this.width3 - 10.0);
        var container = new ccui.Widget();
        this.itemList.pushItem(container);
        var containerHeight = contentlabel.getContentSize().height + 10;
        if (containerHeight < 80.0) {
            containerHeight = 80.0;
        }
        container.setContentSize(cc.size(this.itemList.getContentSize().width, containerHeight));

        var bg1 = new ccui.Scale9Sprite("sublobby-cell-bg.png", cc.rect(10, 0, 4, 78));
        bg1.setPreferredSize(cc.size(this.width1, container.getContentSize().height));

        var bg2 = new ccui.Scale9Sprite("sublobby-cell-bg.png", cc.rect(10, 0, 4, 78));
        bg2.setPreferredSize(cc.size(this.width2, container.getContentSize().height));

        var bg3 = new ccui.Scale9Sprite("sublobby-cell-bg.png", cc.rect(10, 0, 4, 78));
        bg3.setPreferredSize(cc.size(this.width3, container.getContentSize().height));

        bg1.setPosition(this.levelLabel.x, bg1.getContentSize().height / 2);
        container.addChild(bg1);
        bg2.setPosition(this.scoreLabel.x, bg1.y);
        container.addChild(bg2);
        bg3.setPosition(this.contentLabel.x, bg1.y);
        container.addChild(bg3);

        var levelLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, level.toString());
        levelLabel.setPosition(bg1.getPosition());
        container.addChild(levelLabel);

        var scoreLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, cc.Global.NumberFormat1(score));
        scoreLabel.setPosition(bg2.getPosition());
        container.addChild(scoreLabel);

        contentlabel.setPosition(bg3.getPosition());
        container.addChild(contentlabel);
    },
    initData: function () {
        for (var i = 0; i < LevelData.length; i++) {
            this.addItem(i, LevelData[i].exp, LevelData[i].content);
        }
    }
});

var NewsVipLayer = NewsLevelLayer.extend({
    ctor: function () {
        this._super();
        this.levelLabel.setString("VIP");
    },
    initData: function () {
        for (var i = 0; i < VipData.length; i++) {
            this.addItem(i, VipData[i].exp, VipData[i].content);
        }
    }
});

var news_tab_1 = news_tab_1 || [
    "#news-tab-1.png",
    "#news-tab-2.png",
    "#news-tab-3.png",
    "#news-tab-4.png"
];

var news_tab_2 = news_tab_2 || [
    "#news-tab-selected-1.png",
    "#news-tab-selected-2.png",
    "#news-tab-selected-3.png",
    "#news-tab-selected-4.png"
];

var NewsLayer = LobbySubLayer.extend({
    ctor: function () {
        this._super("#lobby-title-news.png");

        this.allLayer = [new NewsNotificationLayer(), new NewsLevelLayer(), new NewsVipLayer(), new NewsTutorialLayer()];
        for (var i = 0; i < this.allLayer.length; i++) {
            this.addChild(this.allLayer[i], 1);
        }

        this._initTab(news_tab_1, news_tab_2, this.allLayer);
    },

    onEnter: function () {
        this._super();
        this.mToggle.selectItem(0);
    }
});
