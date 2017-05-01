;
! function(g, undefined) {
  'use strict';
  var object = {
    // 对象克隆
    cloneObj: function(obj) {
      if (typeof obj !== 'object') {
        return;
      }
      if (window.JSON) {
        return JSON.parse(JSON.stringify(obj));
      }
      var newobj = obj.constructor === Array ? [] : {};
      for (var i in obj) {
        newobj[i] = typeof obj[i] === 'object' ?
          object.cloneObj(obj[i]) : obj[i];
      }
      return newobj;
    },
    // 简单的对象融合
    extendsObj: function(to, from) {
      to = object.cloneObj(to);
      for (var i in to) {
        (typeof from[i] !== 'undefined') && (to[i] = from[i]);
      }
      return to;
    }
  };

  g.OBJECT = g.OBJECT || object;
}(window || this);
