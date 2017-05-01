;
! function(g, doc, undefined) {
  'use strict';
  var cookie = {
    get: function(key) {
      if (doc.cookie.length > 0) {
        var c_start = doc.cookie.indexOf(c_name + '='),
          c_end;
        if (c_start !== -1) {
          c_start = c_start + c_name.length + 1;
          c_end = doc.cookie.indexOf(';', c_start);
          if (c_end === -1) {
            c_end = doc.cookie.length;
          }
          return doc.cookie.slice(c_start, c_end);
        }
      }
      return '';
    },
    del: function(key) {
      cookie.add(key, '', -1);
    },
    add: function(key, val, days) {
      var date = new Date();
      date.setTime(date.getTime() + (days || 1) * 86400000);
      doc.cookie = [g.escape(key),
        '=',
        g.escape(val),
        '; expires=',
        date.toGMTString(),
        '; path=/'
      ].join('');
    }
  };
  g.Cookie = g.Cookie || cookie;
}(this, document);
