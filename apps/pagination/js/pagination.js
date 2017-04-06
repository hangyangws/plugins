var Pagination = function(element, options) {
    //全局变量
    var opts = options, //配置
        current, //当前页
        $document = $(document),
        $obj = $(element); //容器



    this.getCurrent = function() {
        return current;
    };


    this.filling = function(index) {
        var html = '';
        current = index || opts.current; //当前页码
        var pageCount = this.getPageCount(); //获取的总页数

        if (opts.keepShowPN || current > 1) { //上一页
            html += '<a href="javascript:;" class="' + opts.prevCls + '">' + opts.prevContent + '</a>';
        } else {
            if (opts.keepShowPN == false) {
                $obj.find('.' + opts.prevCls) && $obj.find('.' + opts.prevCls).remove();
            }
        }

        // 首页
        if (current != 1 && current >= opts.count + 2 && pageCount != opts.count) {
            var home =
                (opts.coping && opts.homePage) ? opts.homePage : '1';
            html +=
                opts.coping ?
                '<a href="javascript:;" data-page="1">' + home + '</a><span>...</span>' :
                '';
        }
        var end = current + opts.count;
        var start = '';
        //修复到最后一页时比第一页少显示两页
        start = current === pageCount ? current - opts.count - 2 : current - opts.count;
        ((start > 1 && current < opts.count) || current == 1) && end++;
        (current > pageCount - opts.count && current >= pageCount) && start++;
        for (; start <= end; start++) {
            if (start <= pageCount && start >= 1) {
                if (start != current) {
                    html += '<a href="javascript:;" data-page="' + start + '">' + start + '</a>';
                } else {
                    html += '<span class="' + opts.activeCls + '">' + start + '</span>';
                }
            }
        }
        if (current + opts.count < pageCount && current >= 1 && pageCount > opts.count) {
            var end = opts.coping && opts.endPage ? opts.endPage : pageCount;
            html += opts.coping ? '<span>...</span><a href="javascript:;" data-page="' + pageCount + '">' + end + '</a>' : '';
        }
        if (opts.keepShowPN || current < pageCount) { //下一页
            html += '<a href="javascript:;" class="' + opts.nextCls + '">' + opts.nextContent + '</a>'
        } else {
            if (opts.keepShowPN == false) {
                $obj.find('.' + opts.nextCls) && $obj.find('.' + opts.nextCls).remove();
            }
        }
        html += opts.jump ? '<input type="text" class="' + opts.jumpIptCls + '"><a href="javascript:;" class="' + opts.jumpBtnCls + '">' + opts.jumpBtn + '</a>' : '';
        $obj.empty().html(html);
    };

    this.eventBind = function() {
        var that = this;
        var pageCount = that.getPageCount(); //总页数
        var index = 1;
        $obj.off().on('click', 'a', function() {
            if ($(this).hasClass(opts.nextCls)) {
                if ($obj.find('.' + opts.activeCls).text() >= pageCount) {
                    $(this).addClass('disabled');
                    return false;
                } else {
                    index = parseInt($obj.find('.' + opts.activeCls).text()) + 1;
                }
            } else if ($(this).hasClass(opts.prevCls)) {
                if ($obj.find('.' + opts.activeCls).text() <= 1) {
                    $(this).addClass('disabled');
                    return false;
                } else {
                    index = parseInt($obj.find('.' + opts.activeCls).text()) - 1;
                }
            } else if ($(this).hasClass(opts.jumpBtnCls)) {
                if ($obj.find('.' + opts.jumpIptCls).val() !== '') {
                    index = parseInt($obj.find('.' + opts.jumpIptCls).val());
                } else {
                    return;
                }
            } else {
                index = parseInt($(this).data('page'));
            }
            that.filling(index);
            typeof opts.callback === 'function' && opts.callback(that);
        });
        //输入跳转的页码
        $obj.on('input propertychange', '.' + opts.jumpIptCls, function() {
            var $this = $(this);
            var val = $this.val();
            var reg = /[^\d]/g;
            if (reg.test(val)) {
                $this.val(val.replace(reg, ''));
            }
            (parseInt(val) > pageCount) && $this.val(pageCount);
            if (parseInt(val) === 0) { //最小值为1
                $this.val(1);
            }
        });
        //回车跳转指定页码
        $document.keydown(function(e) {
            if (e.keyCode == 13 && $obj.find('.' + opts.jumpIptCls).val()) {
                var index = parseInt($obj.find('.' + opts.jumpIptCls).val());
                that.filling(index);
                typeof opts.callback === 'function' && opts.callback(that);
            }
        });
    };

    this.init = function() {
        this.filling(opts.current);
        this.eventBind();
        if (opts.isHide && (this.getPageCount() == '1' || this.getPageCount() == '0')) $obj.hide();
    };
    this.init();
};

;
! function(g, doc, undefined) {
    // 对象克隆
    function cloneObj(obj) {
        var newobj = obj.constructor === Array ? [] : {};
        if (typeof obj !== 'object') {
            return;
        }
        if (window.JSON) {
            return JSON.parse(JSON.stringify(obj));
        }
        for (var i in obj) {
            newobj[i] = typeof obj[i] === 'object' ?
                cloneObj(obj[i]) : obj[i];
        }
        return newobj;
    }
    // 简单的对象融合
    function extendsObj(to, from) {
        to = g.cloneObj(to);
        for (var i in to) {
            from[i] && (to[i] = from[i]);
        }
        return to;
    };
    // 默认配置参数
    var defaults = {
        el: null, // 分页DOM容器（必须）
        totalData: 0, // 数据总条数
        showData: 0, // 每页显示的条数
        current: 1, // 当前第几页
        prevCls: 'prev', // 上一页class
        nextCls: 'next', // 下一页class
        prevContent: '<', // 上一页内容
        nextContent: '>', // 下一页内容
        activeCls: 'active', // 当前页选中状态
        coping: false, // 首页和尾页
        isHide: false, // 当前页数为0页或者1页时不显示分页
        homePage: '', // 首页节点内容
        endPage: '', // 尾页节点内容
        keepShowPN: false, // 是否一直显示上一页下一页
        count: 3, // 当前页前后分页个数
        jump: false, // 跳转到指定页数
        jumpIptCls: 'jump-ipt', // 文本框内容
        jumpBtnCls: 'jump-btn', // 跳转按钮
        jumpBtn: '跳转' // 跳转按钮文本
    };
    // 分页构造函数
    function Pagination(options) {
        this.opts = extendsObj(defaults, options);
    }

    // 原型对象
    var proto = Pagination.prototype;

    // 根据参数获取总页数
    proto.getPageCount = function() {
        var _this = this;
        return Math.ceil(_this.opts.totalData / _this.opts.showData);
    };

    g.Pagination = Pagination;
}(this, document);
