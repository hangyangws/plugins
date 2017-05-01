/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2017-02-21.
 */

;
(function(win, undefined) {
  'use strict'; // 触发严格模式

  // 工具函数
  var inDateList = function(_day_string, _date_lists) { // 判断日期时是否在日期列表里面
      var _day = new Date(_day_string),
        _day_item,
        _l = _date_lists.length;
      while (_l--) {
        _day_item = _date_lists[_l];
        if (_day_item.getFullYear() === _day.getFullYear() && _day_item.getMonth() === _day.getMonth() && _day_item.getDate() === _day.getDate()) {
          return true;
        }
      }
      return false;
    },
    getMonthNum = function(_date) { // 获取当月的总天数
      var _month = _date.getMonth();
      if (_month === 11) { // 12月一定是31天
        return 31;
      }
      _date.setMonth(_month + 1);
      _date.setDate(0);
      return _date.getDate();
    },
    getEndSpace = function(_len, _space) {
      _space = 7 - (_len - (7 - _space)) % 7;
      if (_space === 7) {
        return 0;
      }
      return _space;
    };

  /**
   * [Calendar 日历插件]
   * @param {[type]} $parent  [日历父级元素，必需]
   * @param {[type]} timeList [需要高亮的日期列表，非必需]
   * 使用举例：new Calendar($dom，['2017-01-21']); 调用日历插件
   */
  function Calendar($parent, timeList) {
    var nowDate = new Date();
    nowDate.setDate(1);
    this.$parent = $parent; // 日历父元素
    this.isFirstOpt = true; // 是否是第一次初始化当前日历

    // 将需要高亮显示的日期转换为日期对象
    timeList = timeList || [];
    this.timeList = timeList.map(function(_time) {
      return new Date(_time);
    });

    // 当前月份
    this.now = {
      year: nowDate.getFullYear(), // 当前年
      month: nowDate.getMonth() + 1, // 当前月（getMonth函数返回的是0~11，所以需要加一）
      dayLength: getMonthNum(nowDate), // 当前月的总天数
      startSpace: nowDate.getDay() // 日历第一行左边的空白格
    };
    this.now.endSpace = getEndSpace(this.now.dayLength, this.now.startSpace); // 日历最后一行右边的空白格

    // 需要渲染的月份（默认为当前月份，可以通过方法改变此日期）
    this.nowRender = {
      year: this.now.year,
      month: this.now.month
    };

    // 渲染DOM
    this.render();
  }

  /**
   * 日历原型公共方法
   */
  Calendar.prototype.render = function() { // 渲染日历
    // 在渲染之前要重新计算一下_this.nowRender对象
    var renderDate = new Date(this.nowRender.year + '-' + this.nowRender.month);
    this.nowRender.startSpace = renderDate.getDay();
    this.nowRender.dayLength = getMonthNum(renderDate);
    this.nowRender.endSpace = getEndSpace(this.nowRender.dayLength, this.nowRender.startSpace);
    (this.nowRender.endSpace === 7) && (this.nowRender.endSpace = 0)

    var _this = this, // 由于在绑定事件的时候内部this指向为空，所以需要缓存this
      _cal_body = ['<tr>'],
      _length = 0,
      _tmp = _this.nowRender.startSpace,
      _i = _tmp; // 循环下标，判断是否要换行，默认从第一天的顺序开始

    // 日历第一行左边的空白格
    _tmp && _cal_body.push('<td colspan="' + _tmp + '"></td>');
    // 日历主体
    while (_length++ < _this.nowRender.dayLength) {
      // 判断当前日期时候需要高亮显示
      if (inDateList(_this.nowRender.year + '-' + _this.nowRender.month + '-' + _length, _this.timeList)) {
        _cal_body.push('<td class="hy-cal-use" data-num="' + _length + '"></td>');
      } else {
        _cal_body.push('<td>' + _length + '</td>');
      }

      if (++_i % 7 === 0) { // 该换行了
        _cal_body.push('</tr><tr>');
      }
    }
    // 日历最后一行右边的空白格
    _tmp = _this.nowRender.endSpace;
    _tmp && _cal_body.push('<td colspan="' + _tmp + '"></td>');
    // 结束
    _cal_body.push('</tr>');
    _cal_body = _cal_body.join('');

    if (_this.isFirstOpt) {
      _this.$parent.innerHTML = '<div class="hy-calender">\
                    <header class="hy-cld-head">\
                        <ul class="hy-cld-sel hy-cld-left">\
                            <li class="j-hy-cld-prev-year"></li>\
                            <li class="j-hy-cld-prev-month"></li>\
                        </ul>\
                        <span class="hy-cld-time j-hy-cld-time"></span>\
                        <ul class="hy-cld-sel hy-cld-right">\
                            <li class="j-hy-cld-next-month"></li>\
                            <li class="j-hy-cld-next-year"></li>\
                        </ul>\
                    </header>\
                    <table class="hy-cld-table">\
                        <thead>\
                            <tr>\
                                <th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th>\
                            </tr>\
                        </thead>\
                        <tbody class="hy-cld-body j-hy-cld-body"></tbody>\
                    </table>\
                </div>';
      _this.$title = _this.$parent.querySelector('.j-hy-cld-time');
      _this.$body = _this.$parent.querySelector('.j-hy-cld-body');
      _this.isFirstOpt = false;

      // 绑定事件
      _this.$parent.querySelector('.j-hy-cld-prev-year').tap(_this.prevYear.bind(_this));
      _this.$parent.querySelector('.j-hy-cld-prev-month').tap(_this.prevMonth.bind(_this));
      _this.$parent.querySelector('.j-hy-cld-next-year').tap(_this.nextYear.bind(_this));
      _this.$parent.querySelector('.j-hy-cld-next-month').tap(_this.nextMonth.bind(_this));
    }
    _this.$title.innerHTML = _this.nowRender.year + '年' + _this.nowRender.month + '月';
    _this.$body.innerHTML = _cal_body;
  };
  Calendar.prototype.prevYear = function() { // 上一年
    if (this.nowRender.year > 1970) {
      this.nowRender.year--;
      this.render();
    }
  };
  Calendar.prototype.prevMonth = function() { // 上一月
    if (this.nowRender.month === 1) {
      if (this.nowRender.year > 1970) {
        this.nowRender.year--;
        this.nowRender.month = 12;
      } else {
        return;
      }
    } else {
      this.nowRender.month--;
    }
    this.render();
  };
  Calendar.prototype.nextYear = function() { // 下一年
    if (this.nowRender.year < 2037) {
      this.nowRender.year++;
      this.render();
    }
  };
  Calendar.prototype.nextMonth = function() { // 下一月
    if (this.nowRender.month === 12) {
      if (this.nowRender.year < 2037) {
        this.nowRender.year++;
        this.nowRender.month = 1;
      } else {
        return;
      }
    } else {
      this.nowRender.month++;
    }
    this.render();
  };

  // 暴露日历构造函数给全局变量
  win.Calendar = Calendar;
})(window);
