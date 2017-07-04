/**
 * Created by hangyangws(hangyangws@foxmail.com) in 2017-02-22.
 */

;
(function(win, undefined) {
  'use strict'; // 触发严格模式

  // function Sector($sector, percent, _direct) {
  function Sector(_param) {
    this.direct = _param.direct || 'left'; // 正方向
    this.redirect = this.direct === 'left' ? 'right' : 'left'; // 反方向

    this.percent = _param.percent || 0;
    (this.percent > 100) && (this.percent = 100);

    this.loopTime = 1000 / this.percent;
    (this.loopTime > 100) && (this.loopTime = 50);

    this.$parent = _param.$dom;
    this.nowPercent = 0;
    this._time = null;

    // 动画运行
    this.go();
  }

  Sector.prototype.go = function() {
    this.$parent.innerHTML = '<div class="hy-sector">\
        <div class="hy-sector-content hy-sector-' + this.direct + '">\
          <div class="hy-sector-bar hy-sector-left j-hy-sector-left ' + (this.direct === 'left' && 'hy-sector-hidden') + '"></div>\
          <div class="hy-sector-bar hy-sector-right j-hy-sector-right ' + (this.direct === 'right' && 'hy-sector-hidden') + '"></div>\
        </div>\
        <div class="hy-sector-num"><span class="hy-sector-percent">0</span>%</div>\
      </div>';

    this.$content = this.$parent.querySelector('.hy-sector-content');
    this.$rotateBar = this.$parent.querySelector('.j-hy-sector-' + this.redirect);
    this.$fixedBar = this.$parent.querySelector('.j-hy-sector-' + this.direct);
    this.$percent = this.$parent.querySelector('.hy-sector-percent');

    if (this.loopTime !== Infinity) {
      var direct = this.direct === 'left' ? '-' : '+',
        rotate = function() {
          if (this.nowPercent < this.percent) {
            this.$percent.innerHTML = ++this.nowPercent;
            this.$rotateBar.style.cssText = '-webkit-transform: rotate({deg}deg);-ms-transform: rotate({deg}deg);-o-transform: rotate({deg}deg);transform: rotate({deg}deg);'.replace(/{deg}/g, direct + (this.nowPercent * 3.6));

            if (this.nowPercent === 50) {
              var _tmp = this.$fixedBar.className;
              this.$fixedBar.className = _tmp.replace('hy-sector-hidden', '');
              _tmp = this.$content.className;
              this.$content.className = _tmp.replace('hy-sector-' + this.direct, '');
            }
          } else {
            clearInterval(this._time);
          }
        };
      this._time = setInterval(rotate.bind(this), this.loopTime);
    }
  }

  // 暴露给全局
  win.Sector = Sector;
})(window);
