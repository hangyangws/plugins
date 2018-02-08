# verify.js

> 用于表单验证  
目前版本支持jquery、Zepto(不支持原生js)  

### 使用方式

在输入控件定义data-vname、data-vtype属性，如果是同一组radio、checkbox那么只需要给第一个定义  
注意：name只能为[A-Zz-z_0-9]

**例子**：```var data = new Verify($parentDom).go()```
