;(function () {
    //1. 封装 axios
    //配置axios默认路径
    axios.defaults.baseURL = 'http://music.it666.com:3666';
    //配置全局超时时间(毫秒)
    axios.defaults.timeout = 10000;

    class YMHttp {
        //配置get请求
        static get(url = "", data = {},) {
            return new Promise(function (resolve, reject) {
                //地址就是你传入的地址, 参数就是你传入的参数
                axios.get(url, {
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
                axios.post(url, {
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
        static getHomeBanner() {
            // type:2 表示手机端数据
            return YMHttp.get("/banner", {type: 2});

        }
    }

    window.YMHttp = YMHttp;
    window.HomeApis = HomeApis;
})();