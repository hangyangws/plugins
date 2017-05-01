;
! function(g, undefined) {
  'use strict';
  var number = {
    toThousands: function(n) {
      var _dot_index,
        fix = '', // 包括小数点后面的字符串
        result = '';
      n += '';
      _dot_index = n.indexOf('.');
      if (_dot_index > -1) {
        fix = n.slice(_dot_index);
        n = n.slice(0, _dot_index);
      };
      while (n.length > 3) {
        result = ',' + n.slice(-3) + result;
        n = n.slice(0, n.length - 3);
      };
      if (n) {
        result = n + result;
      };
      return result + fix;
    },
    addNum: function(n1, n2) {
      var s1, s2;
      try {
        s1 = n1.toString().split(".")[1].length;
      } catch (e) {
        s1 = 0;
      }
      try {
        s2 = n2.toString().split(".")[1].length;
      } catch (e) {
        s2 = 0;
      }
      s1 = Math.pow(10, Math.max(s1, s2));
      return (~~(n1 * s1) + ~~(n2 * s1)) / s1;
    },
    sunNum: function(n1, n2) {
      var l1, l2;
      try {
        l1 = n1.toString().split(".")[1].length;
      } catch (e) {
        l1 = 0;
      }
      try {
        l2 = n2.toString().split(".")[1].length;
      } catch (e) {
        l2 = 0;
      }
      l1 = Math.pow(10, Math.max(l1, l2)); // 该除的10次方数
      return ~~(~~(n1 * l1) * ~~(n2 * l1)) / (l1 * l1);
    }
  };
  g.Number = g.Number || number;
}(window || this);
