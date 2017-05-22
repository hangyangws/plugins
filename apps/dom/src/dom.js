! function(g, doc, undefined) {
  'use strict'

  var dataToUrl = function(_obj) {
    var _url = [],
      i
    if (_obj && typeof _obj === 'object') {
      for (i in _obj) {
        _url.push(i + '=' + _obj[i])
      }
    }
    return _url.join('&')
  }

  var dom = {
    id: function(_id) {
      return doc.getElementById(_id)
    },
    trim: function(_str) {
      return _str.replace(/^\s*|\s*$/g, '')
    },
    ajax: function(_opt) {
      // 参数
      _opt = g.OBJECT.extendsObj({
        method: 'GET', // 默认GET
        url: '',
        data: null,
        success: null,
        async: true, // 是否异步，默认true
        error: null,
        headers: null
      }, _opt)

      if (_opt.data && typeof _opt.data === 'object') {
        _opt.method === 'GET' && (_opt.url = _opt.url + '?' + dataToUrl(_opt.data))
        _opt.data = JSON.stringify(_opt.data)
      }

      var xhrObj = new XMLHttpRequest(),
        dataWatch = function() {
          try {
            if (xhrObj.readyState === XMLHttpRequest.DONE) {
              if ((xhrObj.status >= 200 && xhrObj.status < 300) || xhrObj.status == 304) {
                _opt.success && _opt.success(xhrObj.responseText)
              } else {
                _opt.error && _opt.error(xhrObj.status)
              }
            }
          } catch (e) {
            _opt.error && _opt.error(e.description)
          }
        }

      xhrObj.open(_opt.method, _opt.url, _opt.async)

      // 请求头设置
      if (_opt.method === 'POST') {
        // POST传递表单数据
        xhrObj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
          // 接受与发送都是json格式
        xhrObj.setRequestHeader('Accept', 'application/json')
        xhrObj.setRequestHeader('Content-Type', 'application/json')
      }
      if (_opt.headers && typeof _opt.headers === 'object') {
        var i
        for (i in _opt.headers) {
          xhrObj.setRequestHeader(i, _opt.headers[i])
        }
      }

      xhrObj.onreadystatechange = dataWatch
      xhrObj.send(_opt.data)
    }
  }

  HTMLElement.prototype.find = HTMLElement.prototype.find || function(_class) {
    return this.querySelectorAll(_class)
  }

  g.$ = dom
}(this, document)
