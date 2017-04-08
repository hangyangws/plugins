# Touch.js

### 功能简介

支持浏览器默认的常见事件，比如`click`、`focus`…  
另外还支持移动端的`tap`事件

### 使用方法

```javascript
element.on('method', '.child-class', callbackFunc);
// 或者
element.on('click', callbackFunc);
```

本插件在HTML元素对象的原型链上绑定注册一了个`on`方法  
`on`方法可以传入三个参数

- 第一个参数

元素响应事件名  
如比如`click`、`focus`、`blur`、`touchstart`…等浏览器自带的事件  
另外还支持移动端的`tap`事件

- 第二个参数

如果第二个参数是函数类型  
那么第二个参数就是`事件回调函数`，且忽略第三个参数

如果第二个参数是字符串类型  
那么第二个参数就是`事件代理`的子元素的`css查询语句`

- 第三个参数

事件回调函数
