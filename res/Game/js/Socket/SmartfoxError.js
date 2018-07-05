/**
 * Created by Quyet Nguyen on 5/11/2017.
 */

var s_sfs_error_msg = s_sfs_error_msg || [];
SmartfoxClient.errorHandler = function (data) {
    if(data["message"]){
        MessageNode.getInstance().show(data["message"]);
        return;
    }

    var ec = data["code"];
    var msg = s_sfs_error_msg[ec];
    if (msg) {
        MessageNode.getInstance().show(msg);
    }
    else{
        MessageNode.getInstance().show("Mã lỗi không xác định[" + ec + "]");
    }
};