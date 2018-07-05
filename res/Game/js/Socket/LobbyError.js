/**
 * Created by Quyet Nguyen on 7/20/2016.
 */
//var LobbyClient = LobbyClient || {};
LobbyClient.Error = {
    1 : {
        message: "Lỗi không xác định",
        logout : false,
    },
    6 : {
        message : "Tài khoản không tồn tại",
        logout : true,
    },
    7 : {
        message : "Sai mật khẩu", //change password
        logout : false,
    },
    9 : {
        message : "Không đủ tiền",
        logout : false,
    },
    10 : {
        message : "Tài khoản đã tồn tại",
        logout : true,
    },
    11 : {
        message : "Bạn phải cập nhật phiên bản",
        logout : true,
    },
    12 : {
        message : "Đăng nhập phòng chơi thất bại",
        logout : false,
    },
    13 : {
        message : "Đăng nhập facebook hết hạn",
        logout : true,
    },
    14 : {
        message : "Số điện thoại không hợp lệ",
        logout : false,
    },
    15 : {
        message : "Bạn không thể gửi yêu cầu trong 5 phút",
        logout : false,
    },
    19 : {
        message : "Tài khoản chưa được xác thực", //đổi thưởng
        logout : false,
    },
    20 : {
        message : "Sai số điện thoại",
        logout : false,
    },
    21 : {
        message : "Nhập code sai quá 5 lần", //đổi thưởng
        logout : false,
    },
    25 : {
        message : "Số điện thoại đã được sử dụng",
        logout : false,
    },
    27 : {
        message : "Bạn không đủ tiền",
        logout : false,
    },
    28 : {
        message : "Bạn nhập sai mật khẩu", //login
        logout : true,
    },
    29 : {
        message : "Tài khoản không được chứa ký tự đặc biệt",
        logout : true,
    },
    30 : {
        message : "Tài khoản phải dài từ 6-32 kí tự",
        logout : true,
    },
    31 : {
        message : "Bạn đăng ký quá nhiều tài khoản",
        logout : true,
    },
    32 : {
        message : "Mật khẩu không hợp lệ",
        logout : true,
    },
    36 : {
        message : "Tên tài khoản và mật khẩu trùng nhau",
        logout : true,
    },
    300 : {
        message : "Không đủ tiền đổi thưởng",
        logout : false,
    },
    301 : {
        message : "Sai product id",
        logout : false,
    },
    302 : {
        message : "Sai cashin type",
        logout : false,
    },
    303 : {
        message : "Sai telco id",
        logout : false,
    },
    304 : {
        message : "Sai mã nhà mạng",
        logout : false,
    },
    305 : {
        message : "Không tìm thấy thông tin thẻ",
        logout : false,
    },
    306 : {
        message : "Lỗi nhà cung cấp thẻ",
        logout : false,
    },
    307 : {
        message : "Thẻ đã được sử dụng",
        logout : false,
    },
    308 : {
        message : "Độ dài code ko hợp lệ",
        logout : false,
    },
    309 : {
        message : "Độ dài serial không hợp lệ",
        logout : false,
    },
    310 : {
        message : "Bạn chưa đủ điều kiện đổi thưởng",
        logout : false,
    },
    311 : {
        message : "Vượt quá mức đổi thưởng trong ngày",
        logout : false,
    },
    312 : {
        message : "Mã thẻ đã được sử dụng",
        logout : false,
    },
    313 : {
        message : "Mã giao dịch không tồn tại",
        logout : false,
    },
    314 : {
        message : "Trùng mã giao dịch",
        logout : false,
    },
    315 : {
        message : "Thẻ không hợp lệ",
        logout : false,
    },
    316 : {
        message : "Thẻ đã bị khóa",
        logout : false,
    },
    317 : {
        message : "Bạn vượt quá số lần nạp cho phép",
        logout : false,
    },
    318 : {
        message : "Lỗi nhà phát hành thẻ",
        logout : false,
    },
    319 : {
        message : "Thẻ đang chờ xử lý",
        logout : false,
    },
    320 : {
        message : "Thẻ hết hạn sử dụng",
        logout : false,
    },
    321 : {
        message : "Thẻ chưa được kích hoạt",
        logout : false,
    },
    322 : {
        message : "Không kết nối được nhà phát hành thẻ",
        logout : false,
    },
    323 : {
        message : "Độ dài serial không hợp lệ",
        logout : false,
    },
    324 : {
        message : "Độ dài code không hợp lệ",
        logout : false,
    },
    325 : {
        message : "Thẻ chưa được sử dụng",
        logout : false,
    },
    326 : {
        message : "Thẻ sử dụng không thành công",
        logout : false,
    },
    327 : {
        message : "Thẻ không tồn tại",
        logout : false,
    },
    328 : {
        message : "Nhà phát hành thẻ không tồn tại",
        logout : false,
    },
    329 : {
        message : "Thẻ tạm thời bị khóa",
        logout : false,
    },
    340 : {
        message : "Lỗi hệ thống cung cấp thẻ",
        logout : false,
    },
    341 : {
        message : "Giao dịch thành công",
        logout : false,
    },
    342 : {
        message : "Giao dịch đã hoàn thành",
        logout : false,
    },
    350 : {
        message : "Giftcode không hợp lệ",
        logout : false,
    },
    351 : {
        message : "Giftcode chưa được kích hoạt",
        logout : false,
    },
    352 : {
        message : "Giftcode hết hạn sử dụng",
        logout : false,
    },
    353 : {
        message : "Giftcode đã được sử dụng",
        logout : false,
    },
    360 : {
        message : "Thông tin ngân hàng không hợp lệ",
        logout : false,
    },
    361 : {
        message : "Sai tên chủ thẻ",
        logout : false,
    },
    362 : {
        message : "Mã thẻ không hợp lệ", //thẻ ngân hàng
        logout : false,
    }
};

LobbyClient.ErrorHandle = function (errorCode) {
    LoadingDialog.getInstance().hide();
    var errorHandler = LobbyClient.Error[errorCode];
    if(!errorHandler){
        errorHandler = {
            message : "Có lỗi xảy ra [" + errorCode +"]",
            logout : true
        }
    }
    if(errorHandler.logout){
        SceneNavigator.toHome(errorHandler.message);
    }
    else{
        MessageNode.getInstance().show(errorHandler.message);
    }
};

