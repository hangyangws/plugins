;
! function(g, doc, undefined) {
  'use strict'; // 触发严格模式

  /**
   * 原生事件绑定
   * @param  {[HTMLElement]} e [需要绑定事件的DOM节点]
   * @param  {[string]}      t [需要绑定是事件]
   * @param  {[function]}    h [绑定的方法，内部this为绑定的DOM，第一个参数为事件e]
   */
  var on = (function() {
      if (doc.addEventListener) {
        return function(e, t, h) {
          e.addEventListener(t, h, false);
        }
      }
      if (doc.attachEvent) {
        return function(e, t, h) {
          e.attachEvent('on' + t, h);
        }
      }
      return function(e, t, h) {
        e['on' + t] = h;
      }
    })(),
    getE = function(e) {
      return e || g.event;
    };

  function tap(_dom, _child, _callback) {
    // 移动端
    if (/AppleWebKit.*Mobile.*/.test(navigator.userAgent)) {
      var tapStartTime = 0,
        tapEndTime = 0,

        // tap等待时间，在此时间内松开可触发tap
        tapTime = 500,
        tapStartClientX = 0,
        tapStartClientY = 0,
        tapEndClientX = 0,
        tapEndClientY = 0,

        // 水平或垂直方向移动超过15px测判定为取消
        // 根据chrome浏览器默认的判断取消点击的移动量
        tapScollHeight = 15,
        cancleClick = false;

      on(_dom, 'touchstart', function(e) {
        e = getE(e);
        var touch = e.changedTouches[0];
        tapStartTime = e.timeStamp;
        tapStartClientX = touch.clientX;
        tapStartClientY = touch.clientY;
        cancleClick = false;
      });
      on(_dom, 'touchmove', function(e) {
        var touch = getE(e).changedTouches[0];
        tapEndClientX = touch.clientX;
        tapEndClientY = touch.clientY;
        if ((Math.abs(tapEndClientX - tapStartClientX) > tapScollHeight) ||
          (Math.abs(tapEndClientY - tapStartClientY) > tapScollHeight)) {
          cancleClick = true;
        }
      });
      on(_dom, 'touchend', function(e) {
        e = getE(e);
        tapEndTime = e.timeStamp;
        if (!cancleClick && (tapEndTime - tapStartTime) < tapTime) {
          if (typeof _child === 'function') {
            _child.call(_dom, e);
            return;
          }

          var src = e.target || e.srcElement; // 得到当前点击的目标元素

          // 在元素内部找到子元素
          if ([].slice.call(_dom.querySelectorAll(_child)).indexOf(src) !== -1) {
            // 执行用户绑定的回调事件，绑定当前触发元素为this
            _callback.call(src, e);
          }
        }
      });
      return;
    }
    _dom.on('click', _child, _callback);
  }

  // DOM注册on事件
  HTMLElement.prototype.on = HTMLElement.prototype.on || function(_method, _child, _callback) {
    // tap事件
    if (_method === 'tap') {
      tap(this, _child, _callback);
      return;
    }

    // 不需要事件代理
    if (typeof _child === 'function') {
      on(this, _method, _child);
      return;
    };

    // 需要事件代理
    on(this, _method, function(e) {
      e = e || g.event;
      var src = e.target || e.srcElement; // 得到当前点击的目标元素

      // 在元素内部找到子元素
      if ([].slice.call(this.querySelectorAll(_child)).indexOf(src) !== -1) {
        // 执行用户绑定的回调事件，绑定当前触发元素为this
        _callback.call(src, e);
      }
    });
  };
}(this, document);
