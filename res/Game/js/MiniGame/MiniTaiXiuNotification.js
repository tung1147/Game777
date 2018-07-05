/**
 * Created by Quyet Nguyen on 5/6/2017.
 */

var MiniTaiXiuNotification = cc.Node.extend({
    ctor :function () {
        this._super();

        this.timeRemaining = 0.0;

       // this.setContentSize(cc.size(50, 50));
        var _bg = cc.Sprite.create("#top_bar_news_bg.png");
       // _bg.setPosition(cc.p(this.getContentSize().width/2, this.getContentSize().height/2));
        _bg.setVisible(false);
        this.addChild(_bg);
        this.bg = _bg;

        var _lb_count = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_20, "", cc.TEXT_ALIGNMENT_CENTER);
        _lb_count.setColor(cc.color("#000000"));
        _lb_count.setPosition(cc.p(this.bg.getContentSize().width/2, this.bg.getContentSize().height/2));
        this.bg.addChild(_lb_count);
        this.lb_count = _lb_count;

    },
    update:function(dt) {
        if(this.timeRemaining >= 0){
            this.timeRemaining -= dt;
            //mod
            this.bg.setVisible(true);
            this.lb_count.setString(Math.round(this.timeRemaining));

        }
        else{
            this.bg.setVisible(false);
        }
    },

    onEnter: function () {
        this._super();
        LobbyClient.getInstance().addListener("updateMiniGameMetaData", this.updateMiniGameMetaData, this);
        this.scheduleUpdate();
    },

    onExit: function () {
        this._super();
        LobbyClient.getInstance().removeListener(this);
        this.unscheduleUpdate();
    },

    updateMiniGameMetaData : function(cmd, message){
        var data = message["data"];
        var game = data["game"];
        if (game === "mini.taixiu") {
            this.timeRemaining = data["remainTime"];
        }
    },



});