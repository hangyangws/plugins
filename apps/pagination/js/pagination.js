;
! function(g, doc, undefined) {
    // 对象克隆
    function cloneObj(obj) {
        if (typeof obj !== 'object') {
            return;
        }
        if (window.JSON) {
            return JSON.parse(JSON.stringify(obj));
        }
        var newobj = obj.constructor === Array ? [] : {};
        for (var i in obj) {
            newobj[i] = typeof obj[i] === 'object' ?
                cloneObj(obj[i]) : obj[i];
        }
        return newobj;
    }
    // 简单的对象融合
    function extendsObj(to, from) {
        to = cloneObj(to);
        for (var i in to) {
            from[i] && (to[i] = from[i]);
        }
        return to;
    };

    // 默认配置参数（这些参数都是可用户自定义）
    var defaults = {
        el: null, // 分页DOM容器（必须）

        totalNum: 0, // 总条数
        eachNum: 0, // 每页数，（总页数 = 总条数 / 每页数，向上取整）
        current: 1, // 当前页
        count: 2, // 当前页前后多做几个分页

        prevCls: 'p-prev', // 上一页class
        nextCls: 'p-next', // 下一页class
        disableCls: 'p-disable', // 禁用状态class，用于上一页下一页不可用
        txtCls: 'p-txt', // 间隔页class
        nowCls: 'p-now', // 当前页class

        // 下面2个参数以callback优先（有callback时href没有效果）
        href: '', // 点击超链接直接跳转的url，默认为空（点击不跳转），链接中使用${index}作为关键字
        callback: null, // 点击链接的毁掉函数，默认为null

        prevContent: '<', // 上一页内容
        nextContent: '>', // 下一页内容
        homeContent: '1', // 首页内容，默认为1
        endContent: '', // 尾页内容，默认为总页数

        isHide: false, // 总页数为0或1时不显示
        keepPageNav: true // 一直显示上一页下一页
    };

    // 分页构造函数
    function Pagination(options) {
        var _this = this; // 缓存this

        // 接受用户参数
        var _opt = _this.opts = extendsObj(defaults, options);
        // 总页数
        _opt.pageNum = Math.ceil(_opt.totalNum / _opt.eachNum);
        // 尾页内容判断
        _opt.endContent = _opt.endContent || _opt.pageNum;

        // 渲染节点
        _this.render();
    }

    // 原型对象
    var proto = Pagination.prototype;

    // 获取分页标签
    proto.getDom = function(_index) {
        var _opt = this.opts,
            _content =
            _index === 1 ?
            _opt.homeContent :
            (_index === _opt.pageNum ?
                _opt.endContent :
                (_index === _opt.current - 1 ?
                    _opt.prevContent :
                    (_index === _opt.current + 1 ?
                        _opt.nextContent :
                        _index
                    )
                )
            ),
            _class =
            _index === _opt.current - 1 ?
            _opt.prevCls :
            (_index === _opt.current + 1 ?
                _opt.nextCls :
                ''
            );

        if (((_index === _opt.current - 1) && _opt.current === 1) || ((_index === _opt.current + 1) && _opt.current === _opt.pageNum)) {
            _class += _opt.disableCls;
        }
        return '<a href="${href}" data-index="${index}" class="${class}">${content}</a>'
            .replace('${href}', _opt.href ? _opt.href.replace('${index}', _index) : 'javascript:;')
            .replace('${index}', _index)
            .replace('${class}', _class)
            .replace('${content}', _content);
    };

    // 根据参数获取总页数
    proto.render = function() {
        var _this = this,
            _opt = _this.opts,
            _pagination = []; // 临时数组，存放分页字符串
        // 判断是否展示
        if (_opt.isHide && _opt.pageNum < 2) {
            _opt.el.style.display = 'none';
            return;
        }
        // 上一页
        if (_opt.keepPageNav || _opt.current > 1) {
            _pagination.push(_this.getDom(_opt.current - 1));
        }
        // 首页
        // 当前页面和两边的页和省略号
        // 尾页
        // 下一页
        if (_opt.keepPageNav || _opt.current < _opt.pageNum) {
            _pagination.push(_this.getDom(_opt.current + 1));
        }

        // 渲染DOM
        _opt.el.innerHTML = _pagination.join('');
    };

    // 暴露给全局
    g.Pagination = Pagination;
}(this, document);
