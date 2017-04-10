;
! function(g, doc, undefined) {
    'use strict'; // 触发严格模式

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

    // 判断是否为空(0不能算空，空字符串算空)
    function notEmpty(_v) {
        if (typeof _v === 'number' || _v) {
            return true;
        }
        return false;
    }

    // 简单的对象融合
    function extendsObj(to, from) {
        to = cloneObj(to);
        for (var i in to) {
            notEmpty(from[i]) && (to[i] = from[i]);
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

        // 点击链接的回调函数，默认为null，函数一参数为跳转页标，参数二为当前点击dom，this指向当前实例，
        callback: null,

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

        // 事件绑定
        (!_opt.href && typeof _opt.callback === 'function') &&
        _opt.el.on('tap', 'a', function() {
            _opt.callback.apply(_this, [this.dataset.index, this]);
        });
    }

    // 原型对象
    var proto = Pagination.prototype;

    /**
     * [getDom 获取分页标签]
     * @param  {[unmber]} _index [页标]
     * @param  {[string]} _flip  [是否是翻页按钮]
     * @return {[string]}        [DOM字符串]
     */
    proto.getDom = function(_index, _flip) {
        var _opt = this.opts;

        // “当前页”或“省略页”
        if (_index === _opt.current || typeof _index === 'undefined') {
            return '<span class="${class}">${content}</span>'
                .replace('${class}', _opt[_index ? 'nowCls' : 'txtCls'])
                .replace('${content}', _index ? _opt.current : '…');
        }

        var _content =
            _flip ?
            (_index === _opt.current - 1 ?
                _opt.prevContent : // 上页
                _opt.nextContent // 尾页
            ) :
            (_index === 1 ?
                _opt.homeContent : // 首页
                (_index === _opt.pageNum ?
                    _opt.endContent : // 尾页
                    _index // 其他
                )
            ),
            _class =
            _flip ?
            (_index === _opt.current - 1 ?
                _opt.prevCls : // 上页
                _opt.nextCls // 下页
            ) :
            ''; // 其他

        // 是否添加“禁用类”
        if (
            // 当前为首页，并且渲染上一页
            ((_index === _opt.current - 1) && _opt.current === 1) ||
            // 当前为尾页，并且渲染下一页
            ((_index === _opt.current + 1) && _opt.current === _opt.pageNum)
        ) {
            _class += ' ' + _opt.disableCls;
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
            _pagination = [], // 临时数组，存放分页字符串
            _from,
            _to;

        // 判断是否展示
        if (_opt.isHide && _opt.pageNum < 2) {
            _opt.el.style.display = 'none';
            return;
        }

        // 上一页
        if (_opt.keepPageNav || _opt.current > 1) {
            _pagination.push(_this.getDom(_opt.current - 1, true));
        }

        // 首页
        _pagination.push(_this.getDom(1));

        // 左边省略
        if (_opt.current > _opt.count + 2) {
            // 左边省略标签
            _pagination.push(_this.getDom());
            // 其他导航
            _from = _opt.current - _opt.count;
            _to = _opt.current - 1;
            while (_from <= _to) {
                _pagination.push(_this.getDom(_from++));
            }
        } else {
            _from = 2;
            _to = _opt.current - 1;
            while (_from <= _to) {
                _pagination.push(_this.getDom(_from++));
            }
        }

        // 当前页(非第一页才显示)
        if (_opt.current !== 1 && _opt.current !== _opt.pageNum) {
            _pagination.push(_this.getDom(_opt.current));
        }

        // 右边省略
        if (_opt.current < _opt.pageNum - _opt.count - 1) {
            // 其他导航
            _from = _opt.current + 1;
            _to = _opt.current + _opt.count;
            while (_from <= _to) {
                _pagination.push(_this.getDom(_from++));
            }
            // 右边省略标签
            _pagination.push(_this.getDom());
        } else {
            _from = _opt.current + 1;
            _to = _opt.pageNum - 1;
            while (_from <= _to) {
                _pagination.push(_this.getDom(_from++));
            }
        }

        // 尾页
        _pagination.push(_this.getDom(_opt.pageNum));

        // 下一页
        if (_opt.keepPageNav || _opt.current < _opt.pageNum) {
            _pagination.push(_this.getDom(_opt.current + 1, true));
        }

        // 渲染DOM
        _opt.el.innerHTML = _pagination.join('');
    };

    // 跳转到多少页
    proto.jump = function(_index) {
        var _this = this,
            _opt = _this.opts;
        if (_index && _index > 0 && _index <= _opt.pageNum) {
            _opt.current = _index - 0;

            // 渲染节点
            _this.render();
        }
    };

    // 上一页
    proto.prev = function() {
        var _this = this,
            _opt = _this.opts;
        _this.jump(_opt.current - 1);
    };

    // 下一页
    proto.next = function() {
        var _this = this,
            _opt = _this.opts;
        _this.jump(_opt.current + 1);
    };

    // 暴露给全局
    g.Pagination = Pagination;
}(this, document);
