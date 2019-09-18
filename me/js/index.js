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

    /*处理公共内容区域*/




});
