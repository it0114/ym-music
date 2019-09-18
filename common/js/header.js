$(function () {
    /*切换头部状态*/
    //监听input的 focus事件
    $(".header-center-box>input").focus(function () {
        $(".header-in").addClass("active");
        //显示搜索页面
        $(".header-container").show();
        //当输入框获取焦点的时候 ,触发该事件,获取历史搜索
        let historyArray = getHistory();
        // 2. 进来之后获取数据 ,判断是否有数据
        //先删除
        $(".history-bottom>li").remove();
        //后添加
        if (historyArray.length === 0) {
            $(".search-history").hide();
        } else {
            $(".search-history").show();
            //搜索按钮垃圾桶
            $(".history-top>img").click(function () {
                localStorage.removeItem("history");
                //隐藏搜索历史框
                $(".search-history").hide();
            });
            //动态创建数据
            historyArray.forEach(function (item) {
                let oLi = $("<li>" + item + "</li>");
                $(".history-bottom").append(oLi);
            })
        }
        //重新刷新 iScroll
        searchScroll.refresh();
    });
    $(".header-cancle").click(function () {
        $(".header-in").removeClass("active");
        //隐藏搜索页面
        $(".header-container").hide();
        //手动触发该设置 ,让搜索相关再每次进来都正常
        $(".header-center-box>input")[0].oninput();
    });
    //1 .删除广告
    $(".search-ad>span").click(function () {
        $(".search-ad").remove();
    });

    //2. 封装获取搜素历史
    function getHistory() {
        let historyArray = localStorage.getItem("history");
        //判断是否有数据
        if (!historyArray) {
            historyArray = [];
        } else {
            // 如果获取到有数据
            historyArray = JSON.parse(historyArray);
        }
        return historyArray
    }

    //3. 处理热搜榜
    HomeApis.getHomeHotDetail()
        .then(function (data) {
            if (data.code === 200) {
                // console.log(data);
                let html = template('hotDetail', data);
                $('.hot-bottom').html(html);
                //重新刷新 iScroll
                searchScroll.refresh()
            }
        })
        .catch(function (err) {
            console.log(err);
        });
    //4. 创建 IScroll
    let searchScroll = new IScroll('.header-container', {
        mouseWheel: false,
        scrollbars: false,
        /* 需要使用iscrol-probe.js才能生效probeType
            1. 滚动不繁忙的时候触发
            2. 滚动时每隔一定时间触发
            3. 每滚动一像素触发
        */
        probeType: 3,
        //让iscroll不阻止其他事件
        preventDefault: false,
        preventDefaultException: {tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|A)$/},
    });
    //监听 失去焦点
    $(".header-center-box>input").blur(function () {
        // console.log(this.value);
        //判断用户是否输入内容
        let historyArray = getHistory();
        if (this.value.length === 0) {
            return;
        } else {
            //如果不等于0 ,那么则先获取数据
            //插入数据到第一条
            historyArray.unshift(this.value);
            //清空当前用户框的数据
            this.value = "";
            //把数据存到本地
            //因为localStorage只能存字符串, 所以得转为字符串再存
            localStorage.setItem("history", JSON.stringify(historyArray));
        }
    });
    // 处理搜索相关内容
    // throttle 自已封装的工具类中的 函数节流
    $(".header-center-box>input")[0].oninput = throttle(function () {
        // console.log(this.value);
        if (this.value.length === 0) {
            $(".search-ad").show();
            // $(".search-history").show();
            $(".search-hot").show();
            $(".search-current").hide();
        } else {
            $(".search-ad").hide();
            $(".search-history").hide();
            $(".search-hot").hide();
            $(".search-current").show();
            HomeApis.getHomeSearchSuggest(this.value)
                .then(function (data) {
                    // console.log(data);
                    //清空上次li的内容
                    $(".current-bottom>li").remove();
                    //根据服务器返回的数据创建新的内容
                    data.result.allMatch.forEach(function (obj) {
                        let oLi = $(`
                                 <li>
                                    <img src="./../common/images/topbar-it666-search.png">
                                    <p>${obj.keyword}</p>
                                </li>
                                  `);
                        $(".current-bottom").append(oLi)
                    });
                    //重新刷新 iScroll
                    searchScroll.refresh();
                })
                .catch(function (err) {
                    console.log(err);
                })
        }
        $(".current-top").text(`搜索 "${this.value}"`);
        //重新刷新 iScroll
        searchScroll.refresh();
    }, 1000);
    //切换 friend 界面头部背景
    $(".header-switch>span").click(function () {
        // console.log(this.offsetLeft);
        //添加动画
        $(".header-switch>i").animate({
            left: this.offsetLeft
        }, 100);
        $(this).addClass("active").siblings().removeClass("active");
    });
});