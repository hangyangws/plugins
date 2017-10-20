# dom.js

### 依赖

[object.js](https://github.com/hangyangws/plugins/tree/master/apps/object)


### $.ajax

```js
$.ajax({
  url: '', // 请求地址，（必须）
  method: 'GET', // 默认GET
  data: null, // 请求数据，可以为json；可以为字符，类似“a=123&b=456”
  success: null, // 请求成功的回调函数
  error: null, // 请求失败的回调函数
  headers: null, // 请求头设置，如：{'Content-Type': 'application/json'}
  async: true, // 是否异步，默认true
});
```