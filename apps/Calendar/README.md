# Calendar

### 作用和功能

- 支持上下翻年/月
- 支持自定义日期特殊显示

> 本日历插件使用场景比较单一  
在一个项目中，产品提出了这样的需求，就想着做成插件  
开发者可以自修修改`CSS`文件，直接修改样式，毕竟代码一共也才109行 ^_^

### 依赖

依赖于[touch.js](https://github.com/hangyangws/plugins/tree/master/apps/touch)、[base.css](https://github.com/hangyangws/baseCss)

### 使用方法

首先开发者要从[github](https://github.com/hangyangws/plugins/tree/master/apps/Calendar)上检出代码  
再引入相应的CSS、JS、依赖文件  
然后只需要写如下相关的代码即可

```javascript
// 得到一个DOM节点
var $calendarWrapWrap = document.querySelector('.calendar-wrap'),
  _timeList = [ // 需要特殊显示的时间列表
    '2017-02-12',
    '2017-02-13',
    '2017-02-14',
    '2017-02-15',
    '2017-02-16',
    '2017-02-17',
    '2017-02-28'
  ],
  calender = new Calendar($calendarWrapWrap, _timeList); // 调用实例，生成日历DOM
```

### DEMO

[点击查看](http://hangyangws.win/plugins/apps/Calendar/)
