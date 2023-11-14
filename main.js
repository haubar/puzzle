var group = 4,
    ul = $("#main ul"),
    subCanvas = $("#compare"),
    mainwidth = $("#main").width(),
    sequence = [],
    img_list = [],
    img_length = Math.pow(group, 2),
    steps = 0;

var Puzzle = {
    //正常順序的圖片
    initImgOrder: function () { 
        ul.empty();
        let row_size = (mainwidth-100)/group
        let size = group * row_size + "px";

        for (let col = 0; col < img_length; col++) {
            let y_set = -((col / group) >>> 0)
            let x_set = -col % group
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
        subCanvas.css({
            "backgroundSize": size + " " + size,
            "width": row_size/2,
            "height": row_size/2,
        });
    },
    //打亂圖片
    showRandomImg: function (ary_data) {
        ul.empty();
        let row_size = (mainwidth-100)/group
        let size = group * row_size + "px";
        for (let i in ary_data) {
            let item = ary_data[i]
            let x = img_list[item][0]
            let y = img_list[item][1]
            let li = '<li data-index="' + item + '" style="background-position: ' + x * row_size + 'px ' + y * row_size + 'px;" ></li>';
            ul.append(li);
        }
        ul.append('<li id="block" data-index="' + img_length + '" style="background-image: none;background-color: #fff;"></li>'); //加上空白格
        $("#main li").css({
            "backgroundSize": size + " " + size,
            "width": row_size,
            "height": row_size,
        });
    },
    // 移動格子
    imgMove: function (e) {
        let row = ul.find("li")
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
            let p = $("#block").prev();
            $(e).next().before($("#block"));
            p.after($(e));
            steps++;
        }
        if (mv_before - group == mv_after && (mv_before - group) > 0) { //若是空白格在上邊
            let p = $("#block").next();
            $(e).prev().after($("#block"));
            p.before($(e));
            steps++;
        }

        Puzzle.isGameOver();
    },
    //遊戲是否結束
    isGameOver: function () { 
        // 判斷data-index是否有照順序排
        let row = ul.find("li")
        let count = 0
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
    //隨機打亂圖片
    randomImgOrder: function (main) { 

        main.sort(function () {
            return 0.5 - Math.random();
        });
        let num = Puzzle.reverseCount(main);
        /** 檢測打亂後是否可解 */
        if (num % 2 != 0) {
            let len = main.length
            let t = main[len - 2]
            main[len - 2] = main[len - 3]
            main[len - 3] = t
        }
        return main
    },
    //計算逆序數
    reverseCount: function (data) { 
        let reverseAmount = 0;
        for (let i = 0; i < img_length - 1; i++) {
            let current = data[i];
            console.info('current ', current)
            for (let j = i + 1; j < img_length - 1; j++) {
                let compared = data[j];
                if (compared < current) {
                    reverseAmount++;
                    console.info('reverse amount', reverseAmount)
                }
            }
        }
        return reverseAmount;
    }
}

//初始化圖片
Puzzle.initImgOrder();
//開一個空格
sequence.splice(img_length - 1, 1); 
var randArr = Puzzle.randomImgOrder(sequence);
Puzzle.showRandomImg(randArr);


ul.on('click', 'li', function () {
    Puzzle.imgMove(this);
});
