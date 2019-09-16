$(function () {
    /*切换头部状态*/
    //监听input的 focus事件
    $(".header-center-box>input").focus(function () {
        $(".header").addClass("active");
        //显示搜索页面
        $(".header-container").show();
        //重新刷新 iScroll
        searchScroll.refresh();
        //让软键盘不要重复弹
        setTimeout(function(){
            $(".header-center-box>input").blur();
        },5000)
    });
    $(".header-cancle").click(function () {
        $(".header").removeClass("active");
        //隐藏搜索页面
        $(".header-container").hide();
    });
    //1 .删除广告
    $(".search-ad>span").click(function () {
        $(".search-ad").remove();
    });

    let historyArray = getHistory();

    //封装获取搜素历史
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

    // 2. 进来之后获取数据 ,判断是否有数据
    if (historyArray.length === 0) {
        $(".search-history").hide();
    } else {
        $(".search-history").show();
        //搜索按钮垃圾桶
        $(".history-top>img").click(function () {
            localStorage.removeItem("history");
        });
        //动态创建数据
        historyArray.forEach(function (item) {
            let oLi = $("<li>" + item + "</li>");
            $(".history-bottom").append(oLi);
        })
    }

    //3. 处理热搜榜
    HomeApis.getHomeHotDetail()
        .then(function (data) {
            if (data.code === 200) {
                console.log(data);
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
        preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|A)$/ },
    });

    //监听 失去焦点
    $(".header-center-box>input").blur(function () {
        // console.log(this.value);
        //判断用户是否输入内容
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


    //切换 friend 界面头部背景
    $(".header-switch>span").click(function () {
        // console.log(this.offsetLeft);
        //添加动画
        $(".header-switch>i").animate({
            left: this.offsetLeft
        }, 100);
        $(this).addClass("active").siblings().removeClass("active");
    });
    //定义关联
    let pageArray = ["home", "video", "me", "friend", "account"];
    //底部导航
    $(".footer>ul>li").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
        // find 找到 下面的所有 img 元素, 并且使用 attr 改变它的src属性
        // attr 是 设置或者返回选中的属性值  全称呼 :attribute
        let url = $(this).find("img").attr("src");
        //replace  第一个属性是查找 ,如果找到就返回
        //replace  第二个属性是替换， 可设置 可不设置
        url = url.replace("normal", "selected");
        $(this).find("img").attr("src", url);
        //排他
        // forEach 循环遍历
        $(this).siblings().find("img").forEach(function (oImg) {
            oImg.src = oImg.src.replace("selected", "normal");
        });
        //底部关联头部
        let currentName = pageArray[$(this).index()];
        $(".header").removeClass().addClass("header " + currentName);
    });
    /*处理公共的内容区域*/
    // 1. 获取SVG路径的长度
    let length = $("#refreshLogo")[0].getTotalLength();
    // 2. 默认先隐藏路径
    $("#refreshLogo").css({"stroke-dasharray": length});
    $("#refreshLogo").css({"stroke-dashoffset": length});
    //3. 创建 IScroll
    let myScroll = new IScroll('.main', {
        mouseWheel: false,
        scrollbars: false,
        /* 需要使用iscrol-probe.js才能生效probeType
            1. 滚动不繁忙的时候触发
            2. 滚动时每隔一定时间触发
            3. 每滚动一像素触发
        */
        probeType: 3
    });
    //4. 监听滚动
    let logoHergit = $(".pull-down").height();
    let bottomHergit = $(".pull-up").height();
    let maxOffsetY = myScroll.maxScrollY - bottomHergit;
    //是否允许重复刷新
    let isPullDowm = false;
    //是否允许重复刷新
    let isRefresh = false;
    myScroll.on("scroll", function () {
        //下拉刷新
        if (this.y >= logoHergit) {
            // console.log("开始绘制");
            if (((this.y - logoHergit) * 3) <= length) {
                $("#refreshLogo").css({"stroke-dashoffset": length - (this.y - logoHergit) * 2});
            } else {
                this.minScrollY = 170;
                isPullDowm = true;
            }
        }
    });
    myScroll.on("scrollEnd", function () {
        //下拉刷新
        if (isPullDowm && !isRefresh) {
            isRefresh = true;
            console.log("去网络刷新数据");
            refreshDown();
        }

        //模拟下拉刷新
        function refreshDown() {
            setTimeout(function () {
                console.log("数据刷新完毕");
                isPullDowm = false;
                isRefresh = false;
                myScroll.minScrollY = 0;
                myScroll.scrollTo(0, 0);
                $("#refreshLogo").css({"stroke-dashoffset": length});
            }, 1000)
        }
    });
    //获取网络数据
    HomeApis.getHomeBanner()
        .then(function (data) {
            if (data.code === 200) {
                let html = template('bannerSlide', data);
                $('.swiper-wrapper').html(html);
                // iScroll重新刷新方法
                myScroll.refresh();

                //设置首页banner
                let mySwiper = new Swiper('.swiper-container', {
                    loop: true, // 循环模式选项
                    //自动轮播
                    autoplay: {
                        delay: 3000,
                        stopOnLastSlide: false,
                        disableOnInteraction: false,
                    },
                    // 如果需要分页器
                    pagination: {
                        el: '.swiper-pagination',
                        //设置分页器指标样式
                        bulletClass: 'my-bullet',//需设置.my-bullet样式
                        //配置分页器活动指标
                        bulletActiveClass: 'my-bullet-active',
                    },
                    //解决网络加载图片而不能滑动 不出现指示器的问题
                    observer: true,
                    observeParents: true,
                    observeSlideChildren: true,
                });
            }
        })
        .catch(function (err) {
            console.log(err);
        });
    /*创建首页导航*/
    $(".nav i").text(new Date().getDate());
    /*创建推荐歌单*/
    HomeApis.getHomeRecommend()
        .then(function (data) {
            if (data.code === 200) {
                data.title = "推荐歌单";
                data.subTitle = "歌单广场";
                //创建宽度
                data.result.forEach(function (obj) {
                    obj.width = 216 / 100;
                    //处理播放量
                    obj.playCount = formatNum(obj.playCount);
                });
                let html = template('category', data);
                $('.recommend').html(html);
                //如果创建成功 ,
                //..超出两行显示 省略号(...)
                $(".recommend .category-title").forEach(function (ele, index) {
                    $clamp(ele, {clamp: 2})
                });
                // iScroll重新刷新方法
                myScroll.refresh();
            }
        })
        .catch(function (err) {
            console.log(err);
        });
    /*创建独家放送*/
    HomeApis.getHomeExclusive()
        .then(function (data) {
            if (data.code === 200) {
                data.title = "独家放送";
                data.subTitle = "独家剧场";
                //创建宽度
                data.result.forEach(function (obj, index) {
                    obj.width = 334 / 100;
                    if (index === 2) {
                        obj.width = 690 / 100;
                    }
                });
                let html = template('category', data);
                $('.exclusive').html(html);
                //如果创建成功 ,
                //..超出两行显示 省略号(...)
                $(".exclusive .category-title").forEach(function (ele, index) {
                    $clamp(ele, {clamp: 2})
                });
                // iScroll重新刷新方法
                myScroll.refresh();
            }
        })
        .catch(function (err) {
            console.log(err);
        });
    /*创建新歌新碟*/
    HomeApis.getHomeAlbum()
        .then(function (data) {
            if (data.code === 200) {
                data.title = "新碟新歌";
                data.subTitle = "更多新歌";
                data.result = data["albums"];
                data.result.forEach(function (obj) {
                    obj.artistName = obj.artist.name;
                    //创建宽度
                    obj.width = 216 / 100;
                });
                let html = template('category', data);
                $('.album').html(html);
                //如果创建成功 ,
                //..超出两行显示 省略号(...)
                $(".album .category-title").forEach(function (ele, index) {
                    $clamp(ele, {clamp: 1})
                });
                $(".album .category-img-text").forEach(function (ele, index) {
                    $clamp(ele, {clamp: 1})
                });
                // iScroll重新刷新方法
                myScroll.refresh();
            }
        })
        .catch(function (err) {
            console.log(err);
        });
    //创建mv
    HomeApis.getHomeMv()
        .then(function (data) {
            if (data.code === 200) {
                data.title = "推荐MV";
                data.subTitle = "更多MV";
                data.result.forEach(function (obj, index) {
                    obj.width = 334 / 100;
                });
                let html = template('category', data);
                $('.mv').html(html);
                //如果创建成功 ,
                //..超出两行显示 省略号(...)
                $(".mv .category-title").forEach(function (ele, index) {
                    $clamp(ele, {clamp: 1})
                });
                $(".mv .category-singer").forEach(function (ele, index) {
                    $clamp(ele, {clamp: 1})
                });
                // iScroll重新刷新方法
                myScroll.refresh();
            }
        })
        .catch(function (err) {
            console.log(err);
        });
    //创建dj
    HomeApis.getHomeDj()
        .then(function (data) {
            if (data.code === 200) {
                data.title = "主播电台";
                data.subTitle = "更多主播";
                data.result.forEach(function (obj, index) {
                    obj.width = 216 / 100;
                });
                let html = template('category', data);
                $('.dj').html(html);
                //如果创建成功 ,
                //..超出两行显示 省略号(...)
                $(".dj .category-title").forEach(function (ele, index) {
                    $clamp(ele, {clamp: 1})
                });
                $(".dj .category-img-text").forEach(function (ele, index) {
                    $clamp(ele, {clamp: 1})
                });
                // iScroll重新刷新方法
                myScroll.refresh();
            }
        })
        .catch(function (err) {
            console.log(err);
        });

    //处理播放量
    function formatNum(num) {
        //处理播放量
        //处理 亿
        let res = 0;
        if (num / 100000000 > 1) {
            let temp = num / 100000000 + "";
            //判断整除后的数是否包含 .
            if (temp.indexOf(".") === -1) {
                res = (num / 100000000) + "亿";
            } else {
                //如果不包含 . ,那么则保留一位小数
                res = (num / 100000000).toFixed(1) + "亿";
            }
            //处理 万
        } else if (num / 10000 > 1) {
            let temp = num / 10000 + "";
            //判断整除后的数是否包含 .
            if (temp.indexOf(".") === -1) {
                res = (num / 10000) + "万";
            } else {
                //如果不包含 . ,那么则保留一位小数
                res = (num / 10000).toFixed(1) + "万";
            }
        } else {
            res = num;
        }
        return res;
    }
});
