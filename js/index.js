$(function () {
    /*切换头部状态*/
    //监听input的 focus事件
    $(".header-center-box>input").focus(function () {
        $(".header").addClass("active");
    });
    $(".header-cancle").click(function () {
        $(".header").removeClass("active");
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
    let isPullUp = false;
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
        } else if (this.y <= maxOffsetY) {    //上拉加载更多
            console.log("能够看到上拉加载更多");
            $(".pull-up>p>span").text("松手加载更多...");
            this.maxScrollY = maxOffsetY;
            isPullUp = true;
        }
        // console.log(this.y, this.maxScrollY);
    });
    myScroll.on("scrollEnd", function () {
        //下拉刷新
        if (isPullDowm && !isRefresh) {
            isRefresh = true;
            console.log("去网络刷新数据");
            refreshDown();
        }
        //上拉加载
        else if (isPullUp && !isRefresh) {
            $(".pull-up>p>span").text("正在加载中...");
            isRefresh = true;
            console.log("去网络刷新数据");
            refreshUp();
        }

        //模拟下拉刷新
        function refreshDown() {
            setTimeout(function () {
                console.log("数据刷新完毕");
                isPullDowm = false;
                isRefresh = false;
                myScroll.minScrollY = 0;
                myScroll.scrollTo(0, 0)
                $("#refreshLogo").css({"stroke-dashoffset": length});
            }, 1000)
        }

        //模拟上拉加载
        function refreshUp() {
            setTimeout(function () {
                console.log("数据刷新完毕");
                isPullUp = false;
                isRefresh = false;
                myScroll.maxScrollY = maxOffsetY + bottomHergit;
                myScroll.scrollTo(0,myScroll.maxScrollY);
                $(".pull-up>p>span").text("下拉加载更多...");
            }, 1000)
        }
    });
    //获取网络数据
    HomeApis.getHomeBanner()
        .then(function(data){
            if(data.code === 200){
                let html = template('bannerSlide',data);
                $('.swiper-wrapper').html(html);

                //设置首页banner
                let mySwiper = new Swiper ('.swiper-container',{
                    loop: true, // 循环模式选项
                    //自动轮播
                    autoplay:{
                        delay:3000,
                        stopOnLastSlide: false,
                        disableOnInteraction: false,
                    },
                    // 如果需要分页器
                    pagination: {
                        el: '.swiper-pagination',
                        //设置分页器指标样式
                        bulletClass : 'my-bullet',//需设置.my-bullet样式
                        //配置分页器活动指标
                        bulletActiveClass: 'my-bullet-active',
                    },
                    //解决网络加载图片而不能滑动 不出现指示器的问题
                    observer:true,
                    observeParents:true,
                    observeSlideChildren:true,
                });

            }
        })
        .catch(function(err){
            console.log(err);
        })
});
