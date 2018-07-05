/**
 * Created by anhvt on 12/1/2016.
 */

var TLMNSolo = TienLen.extend({
    ctor : function () {
        this._super();
        this._controller.isSolo = true;
    },
    initPlayer: function () {
        var playerMe = new GamePlayerMe();
        playerMe.setPosition(150, 50.0);
        this.sceneLayer.addChild(playerMe, 1);

        var player1 = new GamePlayer();
        player1.setPosition(cc.winSize.width / 2, cc.winSize.height - 140.0 / cc.winSize.screenScale);
        this.sceneLayer.addChild(player1, 1);
        player1.chatView.setAnchorPoint(cc.p(1.0,1.0));

        var cardRemaining1 = new CardRemaining();
        cardRemaining1.setPosition(130,70);
        player1.infoLayer.addChild(cardRemaining1);
        player1.cardRemaining = cardRemaining1;

        this.playerView = [playerMe, player1];
    }
});