

TYPE_SANH_NO_SANH = -1;
TYPE_SANH_NORMAL = 0;
TYPE_SANH_HA = 1;
TYPE_SANH_THUONG = 2;
TYPE_BAOLANG   = ["Rồng cuốn", "Sảnh rồng", "13 lá đồng màu", "12 lá đồng màu","5 đôi 1 sám","Lục phé bôn", "3 thùng","3 sảnh"];
NAME_BINH  = ["Sảnh chúa","Thùng phá sảnh ","Thùng phá sảnh","Tứ quý","Cù lũ","Thùng","Sảnh","Xám chi","Thú","Đôi", "Mầu thầu"];

var LibMB = cc.Class.extend({
    convertNameToValue:function (nameCard) {
        // var aa = [1,4,3,36,8,5];
        // var bb = [1,4,3];
        // bb.splice(1,1);
        // aa.push.apply(aa, bb);
        // aa.concat(bb);
        // aa.splice(5,1);
       // var k = this.indexCard10(aa);


        // cc.log("nhu cuc shit",aa);
        var rank = (parseInt(nameCard.substring(0, nameCard.length-1)) - 1)*4;
        var strSuit = nameCard.substring(nameCard.length-1,nameCard.length);
        var suit = 0;
        if(strSuit == "t"){
            suit = 1;
        } else if(strSuit == "r"){
            suit = 2;
        }
        else if(strSuit == "c"){
            suit = 3;
        }
       return rank+suit;
    },
    convertToName:function (number) {
        var du = number % 4;
        chat = "c";
        if (du == 0) {
            chat = "b";
        }
        else if (du == 1) {
            chat = "t";
        }
        else if (du == 3) {
            chat = "c";
        }
        else if (du == 2) {
            chat = "r";
        }
        rank = Math.floor(number / 4) + 1;
        return  rank.toString() + chat;
    },
    checkIsColor:function(arrValue){
            var chat = arrValue[0]%4;
            for(var i = 1; i< arrValue.length;i++)
            {
                if(arrValue[i]%4 !=chat)
                {
                    // break;
                    return false;
                }
            }
            return true;
        },
    getRankSanh:function (numberPair) {
        if(Math.floor(numberPair[0]/4)==0)//chua at
        {
            return 100+numberPair[0];
        }
        else {
            return numberPair[numberPair.length-1];
        }
    },
    getRankPair:function (numberPair) {
        var sub = numberPair[0];
        if(sub[0]/4==0)//chua at
        {
            return 100+sub[sub.length-1];
        }
        else {
            var subCuoi = numberPair[numberPair.length-1];
            return subCuoi[subCuoi.length-1];
        }
    },
    checkLungThung:function (arr1,arr2) {
        arr1.sort(function (a,b) {
            if(Math.floor(a/4) == 0 || Math.floor(b/4) == 0){
                return a-b;
            }
            return b-a;
        });
        arr2.sort(function (a,b) {
            if(Math.floor(a/4) == 0 || Math.floor(b/4) == 0){
                return a-b;
            }
            return b-a;
        });
        for (var  i= 0; i< arr2.length; i++) {
            var rank2 = Math.floor(arr2[i]/4);
            if (rank2 ==0) {
                rank2 = 100;
            }
            var rank1 = Math.floor(arr1[i]/4);

            if (rank1 ==0) {
                rank1 = 100;
            }
            if(rank2>rank1)
            {
                return true;
            }
            else if(rank2 <rank1)
            {
                return false;
            }

        }
        return false;
    },
    setBinhLung:function ( arr1, arr2, arr3) {
        var nameChiDau = this.caculateBinh(arr1);
        var nameChiGiua = this.caculateBinh(arr2);
        var nameChiCuoi = this.caculateBinh(arr3);
        var isBinhLung = false;
        if (nameChiDau.type_chi > nameChiGiua.type_chi || nameChiGiua.type_chi > nameChiCuoi.type_chi  ) {
            //bing lung
            isBinhLung = true;
        }
        if (nameChiDau.type_chi == nameChiGiua.type_chi )  {

            if(nameChiDau.type_chi == 8  || nameChiDau.type_chi == 9)//truong hop 2 thu
            {

                isBinhLung = this.checkLungDoi_Thu(arr1,arr2);
            }

            if (nameChiDau.type_chi ==5) {
                isBinhLung = this.checkLungThung(arr1,arr2);
            }
            if (nameChiDau.rank_chi < nameChiGiua.rank_chi && nameChiDau.type_chi != 6) {
                isBinhLung = true;
            }
            if (nameChiDau.type_chi == 6 && nameChiGiua.type_chi == 6&&  nameChiDau.rank_chi < nameChiGiua.rank_chi ) {
                isBinhLung = true;
            }
        }
        if(!isBinhLung)
        {
            if (nameChiGiua.type_chi == nameChiCuoi.type_chi ) {
                if(nameChiGiua.type_chi == 9 )
                {
                    isBinhLung = this.checkLungDoi_Thu(arr2,arr3);
                }
                if (nameChiGiua.rank_chi < nameChiCuoi.rank_chi) {
                    isBinhLung = true;
                }
            }
        }
        if (isBinhLung) {

            return ["","Binh Lủng",""];
        }
        else
        {
            if(nameChiDau.type_chi == nameChiGiua.type_chi){
                if(nameChiDau.type_chi == 5)//thung
                {
                    var isColor =  this.checkIsColor(arr3);
                    if(isColor)
                    {
                        return ["","3 " + NAME_BINH[nameChiGiua.type_chi],""];
                    }
                    //check thung chi cuoi
                }else if (nameChiDau.type_chi == 6){ // sang
                    var isSanh = this.checkSanhChiCuoi(arr3);
                    if(isSanh){
                        return ["","3 " + NAME_BINH[nameChiGiua.type_chi],""];
                    }
                }

            }
            return [NAME_BINH[nameChiDau.type_chi],NAME_BINH[nameChiGiua.type_chi],NAME_BINH[nameChiCuoi.type_chi]];
        }
    },
    checkLungDoi_Thu:function ( arr1,arr2) {
        arr1.sort(function (a,b) {
            if(Math.floor(a/4) == 0 || Math.floor(b/4) == 0){
                return a-b;
            }
            return b-a;
        });
        arr2.sort(function (a,b) {
                if(Math.floor(a/4) == 0 || Math.floor(b/4) == 0){
                    return a-b;
                }
                return b-a;
            });
        var pair1 = this.findNumBerpair32(arr1);
        var pair2 = this.findNumBerpair32(arr2);

        for (var  i= 0; i< pair2.length; i++) {
            var rank2 = pair2[i][0];
            if (Math.floor(rank2/4) ==0) {
                rank2 = 100;
            }
            var rank1 = pair1[i][0];

            if (Math.floor(rank1/4) ==0) {
                rank1 = 100;
            }
            if(rank2>rank1)
            {
                return true;
            }
            else if(rank2 <rank1)
            {
                return false;
            }

        }
        return false;
    },

    caculateBinh:function (arrValue) {
        arrValue.sort(function (a,b) {
            return a-b;
        });
        var chi_maubinh = {
            type_chi:-1,
            rank_chi:-1,
            name_chi:""
        };
        var isColor =  this.checkIsColor(arrValue);

        if(isColor && arrValue.length == 5) // check có phải loại thùng phá sanh nào ko
        {
            var typeThungPhaSanh = this.findThungPhaSanh(arrValue);
            var rankSanh = this.getRankSanh(arrValue);
            if(typeThungPhaSanh==2)
            {
                chi_maubinh.type_chi = 0;
                chi_maubinh.rank_chi = arrValue[0];
                return chi_maubinh;
            }
            else if(typeThungPhaSanh==1)
            {
                chi_maubinh.type_chi = 2;
                chi_maubinh.rank_chi = arrValue[arrValue.length-1];
                return chi_maubinh;
            }
            else if(typeThungPhaSanh==0)
            {
                chi_maubinh.type_chi = 2;
                chi_maubinh.rank_chi = arrValue[arrValue.length-1];
                return chi_maubinh;
            }
        }


        var numberPair = this.findNumBerpair(arrValue);

        var rankPair = 0;
        if(numberPair.length>0)
        {
            rankPair = this.getRankPair(numberPair);
        }
        // check tứ quý
        if(numberPair.length==1 && numberPair[0].length == 4)
        {
            chi_maubinh.type_chi = 3;
            if (Math.floor(numberPair[0][0]/4)==0) {
                chi_maubinh.rank_chi = 100;
            }
            else
            {
                chi_maubinh.rank_chi = numberPair[0][0];
            }

            return chi_maubinh;
        }

        //check cu lu
        if(numberPair.length==2 && (numberPair[0].length+ numberPair[1].length) == 5)
        {
            chi_maubinh.type_chi = 4;
            if(numberPair[0].length == 2)
            {
                var rank = numberPair[1][2];
                if (Math.floor(rank/4) ==0) {
                    rank = 100;
                }
                chi_maubinh.rank_chi = rank;
            }
            else
            {
                var rank = numberPair[0][2];
                if (Math.floor(rank/4) ==0) {
                    rank = 100;
                }
                chi_maubinh.rank_chi = rank;
            }
            return chi_maubinh;
        }

        //check thung
        if(isColor && arrValue.length==5)
        {
            chi_maubinh.type_chi = 5;
            var rankSanh = 0;
            chi_maubinh.rank_chi = rankSanh;
            return chi_maubinh;
        }

        //check sanh
        if(!isColor && arrValue.length==5 )
        {
            var typeThungPhaSanh = this.findThungPhaSanh(arrValue);
            if(typeThungPhaSanh >-1)
            {
                chi_maubinh.type_chi = 6;
                if(typeThungPhaSanh==2)
                {
                    chi_maubinh.rank_chi = 100;
                }
                else
                {
                    chi_maubinh.rank_chi = arrValue[arrValue.length-1];
                }

                return chi_maubinh;
            }
        }

        //check xam chi
        if(numberPair.length==1 && numberPair[0].length == 3)
        {
            chi_maubinh.type_chi = 7;
            chi_maubinh.rank_chi = rankPair;
            return chi_maubinh;
        }

        //check thu
        if(numberPair.length==2 && (numberPair[0].length+ numberPair[1].length) == 4)
        {
            chi_maubinh.type_chi = 8;//so sau
            chi_maubinh.rank_chi = 0;
            return chi_maubinh;
        }
        //check doi
        if(numberPair.length==1 && numberPair[0].length == 2)
        {
            chi_maubinh.type_chi = 9;
            chi_maubinh.rank_chi = 0;
            return chi_maubinh;
        }

        chi_maubinh.type_chi = 10;
        chi_maubinh.rank_chi = this.getRankSanh(arrValue);
        return chi_maubinh;
    },

    findNumBerpair:function (arrValue) {
        var resulft = [];
        var item = Math.floor(arrValue[0]/4);
        var indexItemNext = 0;
        var isFinish = true;
        while (isFinish){
            // (function () {
            var sub = [];
            for(var i = indexItemNext;i< arrValue.length;i++){
                // (function () {
                    var iNew = i;
                    if(Math.floor(arrValue[iNew]/4) == item){
                        sub.push(arrValue[iNew]);
                        if(iNew == arrValue.length -1){
                            isFinish = false;
                        }
                    }
                    else {
                        item = Math.floor(arrValue[iNew]/4);
                        indexItemNext = iNew;
                        break;
                    }
                // })();
            }

            if(sub.length>1)
            {
                resulft.push(sub);
            }
            // })();
        }
        return resulft;
    },
    findNumBerpair3:function (arrValue) {
         var resulft = [];
         var item = Math.floor(arrValue[0]/4);
         var indexItemNext = 0;
         var isFinish = true;
         while (isFinish){

                 var sub = [];
                 for(var i = indexItemNext;i< arrValue.length;i++){
                     // (function () {
                     var iNew = i;
                     if(Math.floor(arrValue[iNew]/4) == item){
                         sub.push(arrValue[iNew]);
                         if(i == arrValue.length -1){
                             isFinish = false;
                         }
                     }
                     else {
                         item = Math.floor(arrValue[iNew]/4);
                         indexItemNext = i;
                         break;
                     }
                     // })();
                 }
                 resulft.push(sub);


         }
         return resulft;
     },
    findNumBerpair32:function (arrValue) {
        var resulft = [];
        var item = Math.floor(arrValue[0]/4);
        var indexItemNext = 0;
        var isFinish = true;
        while (isFinish){

                var sub = [];
                for(var i = indexItemNext;i< arrValue.length;i++){
                    // (function () {
                    var iNew = i;
                    if(Math.floor(arrValue[iNew]/4) == item){
                        sub.push(arrValue[iNew]);
                        if(i == arrValue.length -1){
                            isFinish = false;
                        }
                    }
                    else {
                        item = Math.floor(arrValue[iNew]/4);
                        indexItemNext = i;
                        break;
                    }
                    // })();
                }
            if(sub.length>1)
            {
                resulft.push(sub);
            }

        }
        return resulft;
    },
    getarrColor:function  (arrValue){
        var resulft = [] ;
        for(var i = 0; i < 4; i++){
            var sub = [];
            for(var j = 0; j < arrValue.length; j++){
                if(arrValue[j]%4 == i){
                    sub.push(arrValue[j]);
                }
            }
            if(sub.length>1)
                {
                    resulft.push(sub);
                }
        }
        return resulft;
        // var resulft = [] ;
        // var item = Math.floor(arrValue[0]/4);
        // var indexItemNext = 1;
        // var isFinish = true;
        // while (isFinish){
        //
        //     var sub = [];
        //     sub.push(arrValue[indexItemNext-1]);
        //     var numberItem = 1;
        //     if(indexItemNext >= arrValue.length-1)
        //     {
        //         isFinish = false;
        //     }
        //
        //     for(var i = indexItemNext;i< arrValue.length;i++){
        //         // (function () {
        //         //     var iNew = i;
        //
        //             if (i == arrValue.length-1) {
        //                 isFinish = false;
        //             }
        //             if(Math.floor(arrValue[i]%4) == item){
        //                 numberItem++;
        //                 sub.push(arrValue[i]);
        //             }
        //             else {
        //                 item == Math.floor(arrValue[i]%4);
        //                 indexItemNext = i+1;
        //                 break;
        //             }
        //         // })();
        //     }
        //     if(sub.length>1)
        //     {
        //         resulft.push(sub);
        //     }
        //
        // }
        //
        // // tiep
        // return resulft;
    },
    findSanh13:function (arrValue,index, value) {
        var resuft= [];
        var item = 0;
        for(var i = index;i < arrValue.length;i++)
        {
            (function () {
                var inew = i;
                if( Math.floor(arrValue[inew]/4) != value )
                {
                    return resuft;
                }
                else
                {
                    item++;
                    resuft.push(arrValue[inew]);
                }
                if(item == 4)
                {
                    return  resuft;
                }
                value++;
            })();

        }
        if(item<4)
        {
            return  resuft;
        }
        return resuft;
    },
    logName:function (arrValue) {
        for (var i=0; i<arrValue.length; i++) {

            (function () {

                var number = arrValue[i];
                var du = number % 4;
                var  chat = "c";
                if (du == 0) {
                    chat = "b";
                }
                else if (du == 1) {
                    chat = "t";
                }
                else if (du == 3) {
                    chat = "c";
                }
                else if (du == 2) {
                    chat = "r";
                }
                var  rank = Math.floor(number / 4) + 1;
                cc.log("card: " + rank + chat);
            })();

        }
    },

    findSanh13Nomarl:function (arrValue) {
        arrValue.sort(function (a,b) {
            return b-a;
        });
        var resuft = [];
        var item = 0;
        var value = Math.floor(arrValue[0]/4);
        for(var i = 0 ;i < arrValue.length;i++)
        {
            // (function () {
                // var inew = i;
                if( Math.floor(arrValue[i]/4) != value )
                {
                    resuft = [];
                    value = Math.floor(arrValue[i]/4);
                    item = 1;
                    resuft.push(arrValue[i]);

                }
                else
                {
                    item++;
                    resuft.push(arrValue[i]);
                }
                if(item == 5)
                {
                    return  resuft;
                }
                value--;
            // })();

        }
        if(item<4)
        {
            return  resuft;
        }
        return resuft;
    },
    indexCard10:function (arrValue) {
        for (var i=0; i<arrValue.length; i++) {
            if (Math.floor(arrValue[i]/4) ==9) {
                return i;
            }
        }
        return -1;
    },
    getThungMax:function (thung1,thung2) {
        var zz = thung1;
        for (var  i= 0; i< thung1.length; i++) {
            // (function () {
                var rank1 = Math.floor(thung1[i]/4);
                if( rank1 == 0)
                {
                    rank1 = 100;
                }
                var rank2 = Math.floor(thung2[i]/4);
                if(rank2 == 0)
                {
                    rank2 = 100;
                }
                if(rank2>rank1)
                {
                    zz = thung2;
                    break;
                }
                else if(rank2<rank1)
                {
                    zz = thung1;
                    break;
                }

            // })();
        }
        return zz;
    },
    findThungPhaSanh:function (arrValue) {
        if(Math.floor(arrValue[0]/4) == 0 )// có át
        {
            if(Math.floor(arrValue[1]/4) == 9  ) // tim sanh thuong
            {
                var isSanh = this.findSanh(arrValue, 2,10);
                if(isSanh)
                {
                    return 2;// sanh thyowng
                }
            }
            // ko có thì tìm  thung phá sanh hạ
            var isSanh =  this.findSanh(arrValue, 1,Math.floor(arrValue[0]/4)+1);
            if(isSanh)
            {
                return 1;// thung phu sanh hạ
            }

        }

        //thung phá sanh nỏnal
        var isSanh =  this.findSanh(arrValue, 1,Math.floor(arrValue[0]/4)+1);
        if(isSanh)
        {
            return 0;//
        }
        return -1;// ko phai thung pha sanh

    },
    findSanh:function (arrValue, index,  value) {
        var isSanh = true;
        for(var i = index;i < arrValue.length;i++)
        {
            if(Math.floor(arrValue[i]/4) != value )
            {
                isSanh = false;
                break;
            }
            value++;
        }
        return isSanh;
    },
    findThungPhaSanh13:function (arrValue) {
        var tem = [];
        var indexC10 = this.indexCard10(arrValue);
        if( Math.floor(arrValue[0]/4) == 0 && indexC10 > -1)// có át
        {

            var arrsanh = this.findSanh13(arrValue, indexC10+1,10);
            if(arrsanh.length==3)
            {
                arrsanh.splice(0,0,arrValue[indexC10]);
                arrsanh.splice(0,0,arrValue[0]);
                arrsanh.push(111);
                return arrsanh;
            }
        }

        //thung phá sanh nỏnal
        var arrsanh =  this.findSanh13Nomarl(arrValue);
        if(arrsanh.length==5)
        {
          // std::sort(arrsanh.begin(), arrsanh.end(), [](int a, int b){return (a < b); });
            arrsanh.sort(function (a,b) {
                return a-b;
            });
            return arrsanh;
        }
        return tem;// ko phai thung pha sanh
    },
    findColorpair:function (arrValue) {
        var resuftdsd = [];
        //std::vector<int > resuft;
        var item = arrValue[0]%4;
        var indexItemNext = 0;
        var isFinish =  true;


        while (isFinish) {
            var sub = [];

            for(var i = indexItemNext ;i < arrValue.length;i++)
            {

                if(arrValue[i]%4 == item)
                {
                    if(sub.length<5)
                    {
                        sub.push(arrValue[i]);
                    }
                    if (i == arrValue.length-1) {
                        isFinish = false;
                    }

                }
                else
                {
                    item = arrValue[i]%4;//SETLAI TIEM MOI
                    indexItemNext = i;
                    break;
                }
            }
            if(sub.length>=5)
            {
                resuftdsd.push(sub);
            }

        }

        return resuftdsd;
    },
    find5Card:function (arrValue) {
        var temp = [] ;
        arrValue.sort(function (a,b) {
           // cc.log("clgt"+ a%4 + " ," + b%4 );
            return b%4 - a%4;
        });

        //    return (a%4 > b%4);

        //find chi dau
        var arrColor = this.getarrColor(arrValue);
        var  mangThung  = [] ; //thung nao to nhat thi lay
        if(arrValue.length>=5)
        {
            //find thung pha sanh
            for(var i = 0; i< arrColor.length; i++)
            {
                var arrItem = arrColor[i];
                if (arrItem.length >= 5) {
                    arrItem.sort(function (a,b) {
                        return a-b;
                    });
                    var temp2 =  this.findThungPhaSanh13(arrItem);
                    if (temp2.length>=5) {

                        mangThung.push(temp2);
                    }
                }
            }
            if(mangThung.length>0)
            {
                temp = mangThung[0];
                for (var i = 1; i< mangThung.length; i++) {
                if(mangThung[i].length==6)
                {
                    temp =  mangThung[i];
                }

            }
                if(temp.length==6)
                {
                    temp.splice(5,1);
                }
                return temp;
            }
            arrValue.sort(function (a,b) {
                if(Math.floor(a/4) == 0 || Math.floor(b/4) == 0){
                    return a-b;
                }
                // else if(Math.floor(b/4) == 0)
                // {
                //     return b-a;
                // }
                return b-a;
            });
        //     std::sort(arrValue.begin(), arrValue.end(), [](int a, int b){
        //     if(a/4==0)
        //     {
        //         return true;
        //     }
        //     else if(b/4 ==0){
        //         return false;
        //     }
        //     return (a > b);
        // });

        }
        cc.log("check thung pha sanh");
        // get tứ quý to nhat
        var numberPair = this.findNumBerpair(arrValue);
        if(arrValue.length>=5)
        {
            for (var i = 0; i< numberPair.length; i++) {

            if(numberPair[i].length == 4)
            {
                return numberPair[i];
            }
        }
        }
        cc.log("check tu quy");

        //get cu lu 3sam 1 đôi ..
        if(arrValue.length>=5)
        {
            var numberPairRemain;

            for (var i = 0; i< numberPair.length; i++) {

            if(numberPair[i].length == 3 )
            {
                var culu = [];
                culu.push.apply(culu, numberPair[i]);

                for (var j=numberPair.length - 1; j >=0; j--) {
                if(numberPair[j].length == 2 )
                {
                    culu.push.apply(culu, numberPair[j]);
                    return culu;
                }
            }
                for (var j=numberPair.length - 1; j > i; j--) {
                if(numberPair[j].length == 3 )
                {
                    numberPair[j].splice(1,1);
                    culu.push.apply(culu, numberPair[j]);
                    return culu;
                }
            }

            }
        }
        }
        cc.log("xamco");
        arrValue.sort(function (a,b) {
            if(a%4 != b%4)
            {
                return ( b%4 - a%4);
            }

            if(Math.floor(a/4)==0 || Math.floor(b/4) ==0)
            {
                return a-b;
            }
            // else if(Math.floor(b/4) ==0){
            //     return a-b;
            // }
            return (b - a);
        });



        //3,2,1,0 thung
        if(arrValue.length>=5)
        {
            var arrColor2 = this.findColorpair(arrValue) ;



            if(arrColor2.length>0)
            {
                if(arrColor2.length==1)
                {
                    return arrColor2[0] ;

                }
                else
                {
                    var thung = this.getThungMax(arrColor2[0],arrColor2[1]);
                    return thung ;
                }
            }
        }
        //get sanh

        arrValue.sort(function (a,b) {
            return b-a;
        })




        var  numberPair3 =    this.findNumBerpair3(arrValue);

        if(numberPair3.length>=5)
        {
            if( Math.floor(numberPair3[numberPair3.length-1][0]/4) == 0){//co at va sanh thuong
                var item = 9;
                var sanhThuong = [];
                sanhThuong.push(numberPair3[numberPair3.length-1][0]);
                for (var i = numberPair3.length-2; i >=0 ; i--) {

                    if(Math.floor(numberPair3[i][0]/4)==item)
                    {
                        item++;
                        sanhThuong.push(numberPair3[i][0]);
                    }
                }
                if (item ==13) {
                    return sanhThuong;
                }
            }


            //check sanh thuong max
            for (var i = 0; i< numberPair3.length - 4;i++ ) {
                var rank1 = Math.floor(numberPair3[i][0]/4);
                var rank2 = Math.floor(numberPair3[i+4][0]/4);
            if(rank1 - rank2 == 4){
                var sanhThuong2 = [];
                for(var j=i;j<i+5;j++){
                    sanhThuong2.push(numberPair3[j][0]);
                }
                return sanhThuong2;
            }
           }

        }
        //    //check xam co
        for (var i = 0; i< numberPair.length;i++ ) {

            if(numberPair[i].length == 3)
            {
                var xamco = [] ;
                xamco.push.apply(xamco, numberPair[i]);

                return xamco;
            }
        }

        // 2 doi
        for (var i = 0; i< numberPair.length ;i++ ) {

            if(numberPair[i].length == 2)
            {
                var xamco = [] ;
                xamco.push.apply(xamco, numberPair[i]);
                for (var j = numberPair.length - 1; j > i;j-- ) {
                if(numberPair[j].length == 2 )
                {
                    xamco.push.apply(xamco, numberPair[j]);
                   return xamco;
                }
            }
                return xamco;
            }
        }
        cc.log("xong");
        return temp;
    },
    checkSanhChiCuoi:function (arr3) {
        if(arr3.length == 3){
            arr3.sort(function (a,b) {
                return a-b;
            });
            if(Math.floor(arr3[0]/4)+1 == Math.floor(arr3[1]/4) && Math.floor(arr3[1]/4)+1 == Math.floor(arr3[2]/4)){
                return true;
            }
            if(Math.floor(arr3[0]/4) == 0 && Math.floor(arr3[1]/4) == 12 &&  Math.floor(arr3[2]/4) == 13){
                return true;
            }//co at
        }

        return false;
    },
    _remove_value:function(arr1,arr2){
    for(var i=0;i<arr2.length;i++){
       for(var j=0;j<arr1.length;j++){
           if(arr2[i]  == arr1[j]){
               arr1.splice(j,1);
               break;
           }
       }
    }
    },
    autoSapXep:function (arrValue) {
        var resulft = [];

        var arr11 = arrValue.slice(0, arrValue.length);
        var chidau = this.find5Card(arr11);
        this._remove_value(arrValue, chidau);

        var arr22 = arrValue.slice(0, arrValue.length);
        var chigiua = this.find5Card(arr22);
        this._remove_value(arrValue, chigiua);

        var arr33 = arrValue.slice(0, arrValue.length);
        var chicuoi= this.find5Card(arr33);
        this._remove_value(arrValue, chicuoi);

        arrValue.sort(function (a,b) {
            if(Math.floor(a/4) == 0 || Math.floor(b/4) == 0){
                return a - b;
            }
            // else  if(Math.floor(b/4) == 0 ){
            //     return b- a;
            // }
            return b-a;
        });

        //check rong push max tu duoi dit len
        if (chidau.length == 0) {
            var aaa =  arrValue[0];
            chidau.push(arrValue[0]);
            arrValue.splice(0,1);
        }

        if (chigiua.length==0) {
            chigiua.push(arrValue[0]);
            arrValue.splice(0,1);
        }
        if (chicuoi.length==0) {
            chicuoi.push(arrValue[0]);
            arrValue.splice(0,1);
        }
        var index = 0;
        for(var i=0;i<arrValue.length;){
            if(index%3 == 0){
                if(chicuoi.length < 3){
                    chicuoi.push(arrValue[i]);
                    index++;
                    i++;
                    continue;
                }
                else{
                    index++;
                }


            }
            if(index%3 == 1){
                if(chigiua.length < 5){
                    chigiua.push(arrValue[i]);
                    index++;
                    i++;
                    continue;
                }
                else{
                    index++;
                }
            }

            if(index%3 == 2){
                if(chidau.length < 5){
                    chidau.push(arrValue[i]);
                    index++;
                    i++;
                    continue;
                }
                else{
                    index++;
                }
            }


        }
        if(chidau.length < 5)
        {
            chidau.push(chicuoi[0]);
            chicuoi.splice(0,1);
        }
        if(chigiua.length < 5)
        {
            chigiua.push(chicuoi[0]);
            chicuoi.splice(0,1);
        }
        //

        resulft.push.apply(resulft,chidau);
        resulft.push.apply(resulft,chigiua);
        resulft.push.apply(resulft,chicuoi);
        // resulft.push(chidau);
        // resulft.push(chigiua);
        // resulft.push(chicuoi);
        return resulft;
    }
});