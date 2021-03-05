import axios from "axios";
import router from "@/router/index.js";

// 默认超时设置
axios.defaults.timeout = 5000;

// 相对路径设置
axios.defaults.baseURL = "http://localhost:8002";

//http request 拦截器
axios.interceptors.request.use(
    (config) => {
        // 获取token
        const token = localStorage.getItem("accessToken");
        // 设置参数格式
        if (!config.headers["Content-Type"]) {
            config.headers = {
                "Content-Type": "application/x-www-form-urlencoded",
                // application/json
            };
        }
        // 添加token到headers
        if (token) {
            config.headers.token = token;
        }
        // 鉴权参数设置
        if (config.method === "get") {
            //get请求下 参数在params中，其他请求在data中
            config.params = config.params || {};
            let json = JSON.parse(JSON.stringify(config.params));
            //一些参数处理
        } else {
            config.data = config.data || {};
            //一些参数处理
        }
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);

//http response 拦截器
axios.interceptors.response.use(
    (response) => {
      console.log(response);
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axios