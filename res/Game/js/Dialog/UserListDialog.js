/**
 * Created by Quyet Nguyen on 7/11/2016.
 */

var UserListDialog = Dialog.extend({
    ctor : function () {
        this._super();
        this.okButton.visible = false;
        this.cancelButton.visible = false;
        this.title.setString("Danh sách người chơi");
        this.initWithSize(cc.size(680, 450));
        this.userSelected = [];

        var top = this.getContentSize().height - 178.0;
        var bottom = 98.0;

        var listItem = new newui.TableView(cc.size(680.0, top - bottom), 2);
        listItem.setScrollBarEnabled(false);
        listItem.setMargin(20,20,0,0);
        listItem.setPadding(20.0);
        listItem.setAnchorPoint(cc.p(0.5, 0.5));
        listItem.setPosition(this.getContentSize().width/2, (top + bottom)/2);
        this.addChild(listItem);
        this.listItem = listItem;

        SmartfoxClient.getInstance().addListener(socket.SmartfoxClient.CallExtension, this.onSmartfoxExtension, this);
    },
    onSmartfoxExtension : function (event, data) {
        if(this.recvData){
            return;
        }

        if(data.c == "18"){
            var list = data["p"]["1"];
            for(var i=0;i<list.length;i++){
                this.addItem(list[i].avtUrl, list[i].u, parseInt(list[i]["1"]));
            }
        }
    },
    onEnter : function () {
        this._super();
        var request = {

        };
        this.recvData = false;
        SmartfoxClient.getInstance().sendExtensionRequestCurrentRoom("18", request);
    },
    onExit : function () {
        this._super();
        SmartfoxClient.getInstance().removeListener(this);
    },
    addItem : function (avt, username, gold) {
        var bg1 = new ccui.Scale9Sprite("dialob-invite-bg1.png", cc.rect(14,14,4,4));
        bg1.setPreferredSize(cc.size(286, 80));
        bg1.setPosition(bg1.getContentSize().width/2, bg1.getContentSize().height/2);
        bg1.visible = true;

        var container = new ccui.Widget();
        container.setContentSize(bg1.getContentSize());
        container.addChild(bg1);

        var avt = UserAvatar.createAvatarWithId(avt);
        avt.setScale(0.7);
        avt.setPosition(40, container.getContentSize().height/2);
        container.addChild(avt);

        if (username.length > 3 && (username != PlayerMe.username)) {
            username = username.substring(0, username.length - 3) + "***";
        }

        var userLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_CondensedBold_25, username, cc.TEXT_ALIGNMENT_LEFT);
        userLabel.setLineBreakWithoutSpace(true);
        userLabel.setDimensions(200, userLabel.getLineHeight());
        userLabel.setAnchorPoint(cc.p(0.0, 0.5));
        userLabel.setPosition(80, container.getContentSize().height/2 + 15);
        container.addChild(userLabel);

        var goldLabel = cc.Label.createWithBMFont(cc.res.font.Roboto_Condensed_25, cc.Global.NumberFormat1(gold) + " V");
        goldLabel.setColor(cc.color("#ffde00"));
        goldLabel.setAnchorPoint(cc.p(0.0, 0.5));
        goldLabel.setPosition(userLabel.x, container.getContentSize().height/2 - 15);
        container.addChild(goldLabel);

        this.listItem.pushItem(container);
    }
});