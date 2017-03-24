;
/**
 * [friday.js 提供可供复用的组件]
 * @Author:  hangyangws(hangyangws@foxmail.com)
 * friday JavaScript Library v0.0.1
 * upDate: 2016-05-09
 */
! function(win, factory, undefined) {
    'use strict';
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(win);
    } else {
        win.friday = win.F = factory(win);
    }
}(window || this, function(window) {
    var cookie = {
            get: function(key) {
                if (document.cookie.length > 0) {
                    var c_start = document.cookie.indexOf(c_name + "="),
                        c_end;
                    if (c_start !== -1) {
                        c_start = c_start + c_name.length + 1;
                        c_end = document.cookie.indexOf(";", c_start);
                        if (c_end === -1) {
                            c_end = document.cookie.length;
                        };
                        return document.cookie.slice(c_start, c_end);
                    };
                };
                return '';
            },
            del: function(key) {
                cookie.add(key, "", -1);
            },
            add: function(key, val, days) {
                var date = new Date();
                date.setTime(date.getTime() + (days || 1) * 86400000);
                document.cookie = escape(key) + "=" + escape(val) + "; expires=" + date.toGMTString() + "; path=/";
            }
        },
        F = {
            getCookie: cookie.get,
            addCookie: cookie.add,
            delCookie: cookie.del,
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
            },
            //判断js对象是否为空
            isEmptyObject: function(_obj) {
                // 返回true表示空对象
                var i;
                for (i in _obj) {
                    return false;
                };
                return true;
            }
        };
    return F;
});
