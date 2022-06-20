import axios from 'axios';
var root = "http://192.168.1.114:8280/zyt-http/"       //测试环境
//var root = "http://lw.54zyt.com/biz/"       //正式环境
// axios.defaults.headers.post['content-Type'] = 'application/json;charset=utf-8';

function toType(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
// 参数过滤函数
function filterNull(o) {
  for (var key in o) {
    if (o[key] === null) {
      delete o[key]
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
    }
  }
  return o
}


function apiAxios(method, url, params, success, failure) {
  // 还原成白底的

  if (document.getElementById('appMain')) {
    document.getElementById('BrokenNetwork').style.display = 'none';
  }

  // 登录页
  if (document.getElementById('BrokenNetwork1')) {
    document.getElementById('BrokenNetwork1').style.display = 'none';
  }


  if (params) {
    params = filterNull(params)
  }
  axios({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null,
    baseURL: root,
    withCredentials: false,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  })
    .then(function(res) {
      if (res.data.errorcode == 0) {
        if (success) {
          success(res.data)
        }
      } else {
        if (failure) {
          failure(res.data)
        } else {
          window.alert('error: ' + JSON.stringify(res.data))
        }
      }
    })
    .catch(function(err) {

      // 蒙版的
      if (document.querySelector('.el-loading-mask')) {
        document.getElementsByClassName('el-loading-mask')[0].innerHTML = '';
      }


      // 有 Box 的页面
      if (document.getElementById('appMain')) {
        document.getElementById('appMain').innerHTML = '';
        document.getElementById('appMain').removeAttribute('element-loading-text');
        if (document.querySelector('.el-loading-mask')) {
          document.getElementsByClassName('el-loading-mask')[0].innerHTML = '';
        }
        document.getElementById('BrokenNetwork').style.display = 'block';
      }

      // 登录页
      if (document.getElementById('BrokenNetwork1')) {
        document.getElementById('BrokenNetwork1').style.display = 'block';
        return;
      }

      return;
      // let res = err.response
      // if (err) {
      //     window.alert('api error, HTTP CODE: ' + res.status)
      //     return
      // }
    })
}

// 返回在vue模板中的调用接口
export default {
  get: function(url, params, success, failure) {
    return apiAxios('GET', url, params, success, failure)
  },
  post: function(url, params, success, failure) {
    return apiAxios('POST', url, params, success, failure)
  },
  put: function(url, params, success, failure) {
    return apiAxios('PUT', url, params, success, failure)
  },
  delete: function(url, params, success, failure) {
    return apiAxios('DELETE', url, params, success, failure)
  }
}
