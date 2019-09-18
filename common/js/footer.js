$(function(){
    //定义关联
    let pageArray = ["home", "video", "me", "friend", "account"];
    //底部导航
    $(".footer-in>ul>li").click(function () {
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
        $(".header-in").removeClass().addClass("header-in " + currentName);

        //切换界面
        window.location.href = "./../" + currentName + "/index.html#"+currentName;
    });
    //获取hash ,并且删掉前面的 #
    let hashStr = window.location.hash.substr(1);

    //判断是不是第一次打开 ,如果是 ,那么直接跳转到 home
    if(hashStr.length === 0){
        $(".home").click();
    }else{
        //覆盖上面点击方法
        $("."+hashStr).click();
    }
});