# 圆形进度条加载插件

> made by [hangyangws](https://github.com/hangyangws/)

### 废话少说，上效果

[点我查看DEMO](http://hangyangws.win/DemoShow/apps/sector/)

### 还是废话^_^

设计师经常设计一些进度条  
我遇到的最常见之一就有圆形进度条  
这个可为难了我这个小前端了，要怎么实现，用canvas还是SVG  
开发者不用担心，原生DOM也可以实现这样的效果

实现效果的**灵魂代码**：

```css
.test {
    clip: rect(0, 5rem, 5rem, 2.5rem);
}
// clip属性好像已经被摒弃了，不过没有关系
// 开发者可以学习这个制作的想法，知道原理了其他方式都可以实现的
```

熟练掌握`clip`的使用，就可以了完成扇形图的制作  

### clip的使用方式

注意：clip只在absolute元素上起作用  
clip支持4个参数，参数顺序依次为长度单位（top, right, bottom, left)  
clip是裁剪的意思，类似于`PhotoShop`的蒙层  
clip的4个参数围起来的区域表示元素的可视区域  
[MDN-clip](https://developer.mozilla.org/zh-CN/docs/Web/CSS/clip)
