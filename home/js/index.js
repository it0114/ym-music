$(function () {

    /*处理公共的头部内容区域*/
    $(".header").load("./../common/header.html",function(){
        //当加载的内容被添加后 ,执行
        let sc = document.createElement("script");
        sc.src = "./../common/js/header.js";
        document.body.appendChild(sc);
    });

    /*处理公共的底部内容区域*/
    $(".footer").load("./../common/footer.html",function(){
        //当加载的内容被添加后 ,执行
        let sc = document.createElement("script");
        sc.src = "./../common/js/footer.js";
        document.body.appendChild(sc);
    });



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
