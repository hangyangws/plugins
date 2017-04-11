;
! function(g, doc, undefined) {
    'use strict'; // 触发严格模式

    var D = {
        id: function(_id) {
            return doc.getElementById(_id);
        },
        trim: function(_str) {
            return _str.replace(/^\s*|\s*$/g, '');
        }
    }

    HTMLElement.prototype.find = HTMLElement.prototype.find || function(_class) {
        return this.querySelectorAll(_class);
    }

    g.$ = D;
}(this, document);
