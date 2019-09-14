;(function () {
    //1. 封装 axios
    //配置axios默认路径
    axios.defaults.baseURL = 'http://music.it666.com:3666';
    //配置全局超时时间(毫秒)
    axios.defaults.timeout = 10000;
    //解决跨域问题 ( 添加请求头 )
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

    class YMHttp {
        //配置get请求
        static get(url = "", data = {},) {
            return new Promise(function (resolve, reject) {
                //地址就是你传入的地址, 参数就是你传入的参数
                axios.get(url + "?date" + Date.now(), {
                    params: data,
                })
                    .then(function (response) {
                        resolve(response.data)
                    })
                    .catch(function (error) {
                        reject(error)
                    });
            })
        }

        //配置post请求
        static post(url = "", data = {}) {
            return new Promise(function (resolve, reject) {
                //地址就是你传入的地址, 参数就是你传入的参数
                axios.post(url + "?date" + Date.now(), {
                    params: data
                })
                    .then(function (response) {
                        resolve(response.data)
                    })
                    .catch(function (error) {
                        reject(error)
                    });
            })
        }
    }

    //2. 首页数据
    class HomeApis {
        //获取轮播图数据
        static getHomeBanner() {
            // type:2 表示手机端数据
            return YMHttp.get("/banner", {type: 2});
        }

        //获取推荐歌单数据
        static getHomeRecommend() {
            return YMHttp.get("/personalized");
        }

        //获取独家放送数据
        static getHomeExclusive() {
            return YMHttp.get("/personalized/privatecontent");
        }

        //新歌新碟数据
        static getHomeAlbum() {
            return YMHttp.get("/top/album", {offset: 0, limit: 6});
        }

    }

    window.YMHttp = YMHttp;
    window.HomeApis = HomeApis;
})();