import axios from 'axios';

axios.defaults.timeout=3000000;
axios.defaults.baseURL = 'http://127.0.0.1:40001/api/';
axios.defaults.headers.common['Authorization'] ={token:'TWFX_TOKEN'};

//Request拦截器
axios.interceptors.request.use(
  config=>{
    //文件上传类型为"multipart/form-data"，所以在这里过滤
    if(config.headers["Content-Type"]==null) {
      config.data = JSON.stringify(config.data);
      config.headers = {
        'Content-Type': 'application/json;charset=utf-8'
      };
    }
    var curUser = sessionStorage.getItem('twfxuser');
    if(curUser) {
      var jsonUser = JSON.parse(curUser);
      config.headers['Content-MKey'] = jsonUser.mKey;
      config.headers['Content-MInfo'] = jsonUser.mInfo;
    }
    return config;
  }, error => {
    return Promise.reject(error);
  }
);
//Response拦截器
axios.interceptors.response.use(
  response=>{
      return response;
  },error => {
    if (error.response) {
      //判断是否已登录
      switch (error.response.status) {
        case 401:
          sessionStorage.removeItem('twfxuser');
          window.location.href="/Login";
      }
    }
    return Promise.reject(error);
  }
);



//GET请求
export function http_Get(httpUrl,httpParms={}) {
  return new Promise((resolve, reject) => {
    axios.get(httpUrl, {params: httpParms})
      .then(response=> {
        resolve(response.data);
      })
      .catch(err => {
        reject(err);
      })
  });
};
//POST请求
export function http_Post(httpUrl,httpData={}) {
  return new Promise((resolve, reject) => {
    axios.post(httpUrl, httpData)
      .then(response=> {
        resolve(response.data);
      })
      .catch(err => {
        reject(err);
      })
  });
};

//POST请求（文件上传需要特殊Content-Type）
export function http_PostUp(httpUrl,httpData={},httpConfig) {
  return new Promise((resolve, reject) => {
    axios.post(httpUrl, httpData,httpConfig)
      .then(response=> {
        resolve(response.data);
      })
      .catch(err => {
        reject(err);
      })
  });
};


