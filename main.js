var group = 4,
    ul = $("#main ul"),
    mainwidth = $("#main").width(),
    sequence = [],
    img_list = [],
    img_length,
    steps = 0;

var Puzzle = {
    initImgOrder: function () { //正常順序的圖片
        img_length = Math.pow(group, 2);
        ul.empty();
        sequence = [];
        
        let row_size = (mainwidth-100)/group
        var size = group * row_size + "px";

        for (let col = 0; col < img_length; col++) {
            var y_set = -((col / group) >>> 0)
            var x_set = -col % group
            img_list[col+1] = [x_set, y_set];
            let li = '<li style="background-position: ' + x_set * row_size + 'px ' + y_set * row_size + 'px;"></li>';
            ul.append(li);
            sequence.push(col + 1);
        }
        $("#main li").css({
            "backgroundSize": size + " " + size,
            "width": row_size,
            "height": row_size,
        });
    },
    showRandomImg: function (ary_data) {
        ul.empty();
        let row_size = (mainwidth-100)/group
        var size = group * row_size + "px";
        for (let i in ary_data) {
            var item = ary_data[i]
            var x = img_list[item][0]
            var y = img_list[item][1]
            var li = '<li data-index="' + item + '" style="background-position: ' + x * row_size + 'px ' + y * row_size + 'px;" ></li>';
            ul.append(li);
        }
        ul.append('<li id="block" data-index="' + img_length + '" style="background-image: none;background-color: #fff;"></li>'); //加上空白格
        $("#main li").css({
            "backgroundSize": size + " " + size,
            "width": row_size,
            "height": row_size,
        });
    },
    imgMove: function (e) {
        var row = ul.find("li")
        let mv_before = row.index($(e)) + 1
        let mv_after = row.index($("#block")) + 1
        console.info('移動前位置',mv_before)
        console.info('移動後位置',mv_after)
        if (mv_before - 1 == mv_after && (mv_before - 1) % group != 0) { //若是空白格在左邊
            $(e).after($("#block"));
            steps++;
        }
        if (mv_before + 1 == mv_after && (mv_before + 1) % group != 1) { //若是空白格在右邊
            $("#block").after($(e));
            steps++;
        }
        if (mv_before + group == mv_after && (mv_before + group) < img_length + 1) { //若是空白格在下邊    
            var p = $("#block").prev();
            $(e).next().before($("#block"));
            p.after($(e));
            steps++;
        }
        if (mv_before - group == mv_after && (mv_before - group) > 0) { //若是空白格在上邊
            var p = $("#block").next();
            $(e).prev().after($("#block"));
            p.before($(e));
            steps++;
        }

        Puzzle.isGameOver();
    },
    isGameOver: function () { //遊戲是否結束
        // 判斷data-index是否有照順序排
        var row = ul.find("li")
        var count = 0
        for (var col = 0; col < img_length; col++) {
            let idx = row.eq(col).data().index;
            if (idx == (col + 1)) {
                count++;
            }
        }

        if (count == img_length) {
            alert('Winner Winner ! ' + steps + ' 步完成');
            Puzzle.initImgOrder();
        }
    },
    randomImgOrder: function (main) { //隨機打亂圖片

        main.sort(function () {
            return 0.5 - Math.random();
        });
        var num = Puzzle.reverseCount(main);
        /** 檢測打亂後是否可解 */
        if (num % 2 != 0) {
            let len = main.length
            let t = main[len - 2]
            main[len - 2] = main[len - 3]
            main[len - 3] = t
        }
        return main
    },
    reverseCount: function (arr) { //計算逆序數
        var reverseAmount = 0;
        for (var i = 0; i < img_length - 1; i++) {
            var current = arr[i];
            console.info('current ', current)
            for (var j = i + 1; j < img_length - 1; j++) {
                var compared = arr[j];
                if (compared < current) {
                    reverseAmount++;
                    console.info('reverse amount', reverseAmount)
                }
            }
        }

        return reverseAmount;
    }
}


Puzzle.initImgOrder();
sequence.splice(img_length - 1, 1); //除開一個空白格
var randArr = Puzzle.randomImgOrder(sequence);
Puzzle.showRandomImg(randArr);


ul.on('click', 'li', function () {
    Puzzle.imgMove(this);
});
