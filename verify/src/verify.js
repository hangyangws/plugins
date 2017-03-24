/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2016-12-30.
 */

;
/**
 * @param  {[function]}  $         [Zepto || jquery || 浏览器报错]
 * @param  {[undefined]} undefined [undefined内部缓存]
 */
! function(g, $, undefined) {
    // 构造函数定义
    function Verify($parent) {
        if (!$parent) { // 为了规范与性能，必须传入父级节点
            throw new Error('No parent node selected');
        }
        // 私有变量
        var _this = this;
        _this.ipts = {};
        // 其他变量
        var $this,
            _name;
        // 获取所有的输入控件
        $parent.find('input, select, textarea').each(function() {
            // this 指向输入控件
            $this = $(this);
            _name = $this.prop('name');
            if (_this.ipts[_name]) { // 当控件为radio、checkbox时
                _this.ipts[_name].dom.push($this);
            } else {
                /**
                 * 在初始化的时候就定义了name、type、vName、vType的字段是为安全考虑：以防用户在初始化后修改字段属性而绕过验证
                 */
                _this.ipts[_name] = {
                    dom: [$this], // 包含同一个name的所有输入控件
                    name: _name, // 当前控件name属性
                    type: $this.prop('type'), // 当前控件的type属性
                    vName: $this.data('vname'), // 当前控件的验证名字
                    // 当前控件的验证类型（数组，最多两种验证类型，第一种为require，第二种为this.reg里面的任意一个属性。注意：验证类型以一个或多个空格分开）
                    vType: ($this.data('vtype') && $this.data('vtype').split(/\s+/))
                };
            }
        });
    };
    // 构造函数原型定义
    Verify.prototype = {
        reg: {
            tel: /^1[34578]\d{9}$/, // 手机号
            phone: /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/, // 电话
            code: /^\d{6}$/, // 验证码
            password: /^\d{6}$/, // 密码
            bank: /^\d{16}|\d{19}$/, // 银行
            idcard: /(^\d{15}$)|(^\d{17}([0-9]|(X|x))$)/, // 身份证
            email: /^[A-Za-z\d]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/, // 邮箱
            name: /^[\u4e00-\u9fa5·]{2,20}$/, // 姓名
            positivenumber: /^\d+(\.\d+)?$/ // 大于等于0的所有数
        },
        getIptVal: function(ipt) {
            var _l = ipt.dom.length;
            switch (ipt.type) {
                case 'radio':
                    while (_l--) {
                        if (ipt.dom[_l].is(':checked')) {
                            return ipt.name + '=' + ipt.dom[_l].val();
                        }
                    }
                    return undefined;
                    break;
                case 'checkbox':
                    var _checkbox_val = [];
                    while (_l--) {
                        if (ipt.dom[_l].is(':checked')) {
                            _checkbox_val.push(ipt.name + '=' + ipt.dom[_l].val());
                        }
                    }
                    return _checkbox_val.length ? _checkbox_val.join('&') : undefined;
                    break;
                default:
                    var _v = $.trim(ipt.dom[0].val());
                    return _v ? (ipt.name + '=' + _v) : undefined;
            }
        },
        /**
         * [go description]
         * @return {[string OR Object]} [
         * 在返回之前，函数内部会根据用户自定义的验证属性对所有输入控件进行相应的取值与验证
         * 传入参数typeType === 'json' 时候-->返回：json数据，如果有checkbox数据，则为数组（还未实现，敬请期待）
         * 其它参数情况-->返回：类似于serialize()函数一样的字符串
         * ]
         */
        go: function(dataType) {
            // 依次验证每一个需要验证的字段
            var _ipt,
                _data = [],
                _val_str, // 当前输入控件的带name值（如'gender=male'）
                _val, // 当前输入控件的值（如：'male'）
                _require_index,
                _index_obj = {
                    '0': 1,
                    '1': 0
                };
            for (var _ipt_key in this.ipts) {
                _ipt = this.ipts[_ipt_key];
                _val_str = this.getIptVal(_ipt); // 当前输入控件（组）的值
                _val = (_val_str && _val_str.replace(/^\w+=/, ''));
                // 是否有定义vtype属性
                if (_ipt.vType) {
                    // 是否定义require属性
                    _require_index = _ipt.vType.indexOf('require');
                    if (_require_index !== -1) {
                        // 是否有值
                        if (_val_str) {
                            // 是否定义第二验证
                            if (_ipt.vType.length > 1) {
                                // 验证是否通过
                                if (this.reg[_ipt.vType[_index_obj[_require_index]]].test(_val)) {
                                    // 数据填充
                                    _data.push(_val_str);
                                } else {
                                    // 提示错误信息
                                    layer.open({ content: '请输入正确的' + _ipt.vName });
                                    return;
                                }
                            } else {
                                // 数据填充
                                _data.push(_val_str);
                            }
                        } else {
                            // 提示错误信息
                            layer.open({ content: _ipt.vName + '不能为空' });
                            return;
                        }
                    } else {
                        // 是否有值
                        if (_val_str) {
                            // 验证是否通过
                            if (this.reg[_ipt.vType[0]].test(_val)) {
                                // 数据填充
                                _data.push(_val_str);
                            } else {
                                // 提示错误信息
                                layer.open({ content: '请输入正确的' + _ipt.vName });
                                return;
                            }
                        }
                    }
                } else {
                    // 有值时(数据填充)
                    _val_str && _data.push(_val_str);
                }
            }
            return _data.join('&');
        }
    };

    // 暴露给F || global
    (g.F || g).Verify = Verify;
}(gdow || this, Zepto || jQuery);
