;
! function(g, doc, undefined) {
  'use strict'; // 触发严格模式

  var getXHR = function() {
    // Mozilla, Safari, IE7+ ...
    if (g.XMLHttpRequest) {
      return new XMLHttpRequest();
    }
    // IE 6 and older
    return new ActiveXObject("Microsoft.XMLHTTP");
  };

  var dom = {
    id: function(_id) {
      return doc.getElementById(_id);
    },
    trim: function(_str) {
      return _str.replace(/^\s*|\s*$/g, '');
    },
    ajax: function(_opt) {
      // _opt = { // 默认参数
      // };
      // 继承用户参数
      var xhrObj = getXHR();
      xhrObj.onreadystatechange = alertContents;
      xhrObj.open('GET', url);
      xhrObj.send();
    }
  }

  HTMLElement.prototype.find = HTMLElement.prototype.find || function(_class) {
    return this.querySelectorAll(_class);
  }

  g.$ = dom;
}(this, document);
