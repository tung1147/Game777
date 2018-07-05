/**
 * Created by Quyet Nguyen on 7/11/2016.
 */

var ResultDialog = Dialog.extend({
    ctor : function (size) {
        this._super();
        this.okButton.visible = false;
        this.cancelButton.visible = false;
        this.title.setString("Kết quả");

        var n = size;
        if(n < 3){
            n = 3;
        }
        this.componentHeight = 80.0;
        this.componentPadding = 10.0;
        var height = 80.0 + (this.componentHeight * n) + this.componentPadding*(n+1);
        this.initWithSize(cc.size(600, height));

        this.initComponent(size);
    },
    initComponent : function (size) {
        var padding = this.componentPadding;
        var top = this.dialogBg.getContentSize().height - 178.0 - padding;

        var h = this.componentHeight;
        var w = this.dialogBg.getContentSize().width - 240.0;
        var x = this.dialogBg.getContentSize().width/2;
        var y = top - h/2;

        var userLabel = [];
        var contentLabel = [];
        var goldLabel = [];
        var cardList = [];
        for(var i=0;i<size;i++){
            var bg = cc.Scale9Sprite.createWithSpriteFrameName("dialog-cardList-bg.png", cc.rect(8,8,4,4));
            bg.setPreferredSize(cc.size(w, h));
            bg.setPosition(x,y);
            this.dialogBg.addChild(bg);

            var label1 = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "username");
            label1.setAnchorPoint(cc.p(0.0, 0.5));
            label1.setPosition(130, y + h/2 - 15);
            this.dialogBg.addChild(label1, 1);
            userLabel.push(label1);

            var label2 = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "Thắng trắng");
            label2.setAnchorPoint(cc.p(0.0, 0.5));
            label2.setPosition(420, y + h/2 - 15);
            this.dialogBg.addChild(label2, 1);
            contentLabel.push(label2);

            var label3 = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, "+8.888.888");
            label3.setAnchorPoint(cc.p(0.0, 0.5));
            label3.setPosition(label1.x, y - 15);
            this.dialogBg.addChild(label3, 1);
            goldLabel.push(label3);

            var cards = new CardList(cc.size(400,40));
            cards.setTouchEnable(false);
           // cards.addNewCard(cardTest);
            cards.setAnchorPoint(cc.p(0.5, 0.5));
            cards.setPosition(x + 70, y - 15);
            this.dialogBg.addChild(cards, 2);
            cardList.push(cards);

            y -= (h + padding);
        }

        this.userLabel = userLabel;
        this.contentLabel = contentLabel;
        this.goldLabel = goldLabel;
        this.cardList = cardList;
    }
});