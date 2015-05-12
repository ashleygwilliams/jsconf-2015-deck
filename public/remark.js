require=(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({"components/printing":[function(require,module,exports){
module.exports=require('dlghYq');
},{}],"dlghYq":[function(require,module,exports){
var EventEmitter = require('events').EventEmitter
  , styler = require('components/styler')
  ;

var LANDSCAPE = 'landscape'
  , PORTRAIT = 'portrait'
  , PAGE_HEIGHT = 681
  , PAGE_WIDTH = 908
  ;

function PrintComponent () {}

// Add eventing
PrintComponent.prototype = new EventEmitter();

// Sets up listener for printing
PrintComponent.prototype.init = function () {
  var self = this;

  this.setPageOrientation(LANDSCAPE);

  if (!window.matchMedia) {
    return false;
  }

  window.matchMedia('print').addListener(function (e) {
    self.onPrint(e);
  });
};

// Handles printing event
PrintComponent.prototype.onPrint = function (e) {
  var slideHeight;

  if (!e.matches) {
    return;
  }

  this.emit('print', {
    isPortrait: this._orientation === 'portrait'
  , pageHeight: this._pageHeight
  , pageWidth: this._pageWidth
  });
};

PrintComponent.prototype.setPageOrientation = function (orientation) {
  if (orientation === PORTRAIT) {
    // Flip dimensions for portrait orientation
    this._pageHeight = PAGE_WIDTH;
    this._pageWidth = PAGE_HEIGHT;
  }
  else if (orientation === LANDSCAPE) {
    this._pageHeight = PAGE_HEIGHT;
    this._pageWidth = PAGE_WIDTH;
  }
  else {
    throw new Error('Unknown print orientation: ' + orientation);
  }

  this._orientation = orientation;

  styler.setPageSize(this._pageWidth + 'px ' + this._pageHeight + 'px');
};

// Export singleton instance
module.exports = new PrintComponent();

},{"events":1,"components/styler":"Ya8ZqZ"}],"components/slide-number":[function(require,module,exports){
module.exports=require('AhfaJU');
},{}],"AhfaJU":[function(require,module,exports){
module.exports = SlideNumberViewModel;

function SlideNumberViewModel (slide, slideshow) {
  var self = this;

  self.slide = slide;
  self.slideshow = slideshow;

  self.element = document.createElement('div');
  self.element.className = 'remark-slide-number';
  self.element.innerHTML = formatSlideNumber(self.slide, self.slideshow);
}

function formatSlideNumber (slide, slideshow) {
  var format = slideshow.getSlideNumberFormat()
    , slides = slideshow.getSlides()
    , current = getSlideNo(slide, slideshow)
    , total = getSlideNo(slides[slides.length - 1], slideshow)
    ;

  if (typeof format === 'function') {
    return format.call(slideshow, current, total);
  }

  return format
      .replace('%current%', current)
      .replace('%total%', total);
}

function getSlideNo (slide, slideshow) {
  var slides = slideshow.getSlides(), i, slideNo = 0;

  for (i = 0; i <= slide.getSlideIndex() && i < slides.length; ++i) {
    if (slides[i].properties.count !== 'false') {
      slideNo += 1;
    }
  }

  return Math.max(1, slideNo);
}

},{}],2:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],1:[function(require,module,exports){
(function(process){if (!process.EventEmitter) process.EventEmitter = function () {};

var EventEmitter = exports.EventEmitter = process.EventEmitter;
var isArray = typeof Array.isArray === 'function'
    ? Array.isArray
    : function (xs) {
        return Object.prototype.toString.call(xs) === '[object Array]'
    }
;
function indexOf (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0; i < xs.length; i++) {
        if (x === xs[i]) return i;
    }
    return -1;
}

// By default EventEmitters will print a warning if more than
// 10 listeners are added to it. This is a useful default which
// helps finding memory leaks.
//
// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
var defaultMaxListeners = 10;
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!this._events) this._events = {};
  this._events.maxListeners = n;
};


EventEmitter.prototype.emit = function(type) {
  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events || !this._events.error ||
        (isArray(this._events.error) && !this._events.error.length))
    {
      if (arguments[1] instanceof Error) {
        throw arguments[1]; // Unhandled 'error' event
      } else {
        throw new Error("Uncaught, unspecified 'error' event.");
      }
      return false;
    }
  }

  if (!this._events) return false;
  var handler = this._events[type];
  if (!handler) return false;

  if (typeof handler == 'function') {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        var args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
    return true;

  } else if (isArray(handler)) {
    var args = Array.prototype.slice.call(arguments, 1);

    var listeners = handler.slice();
    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i].apply(this, args);
    }
    return true;

  } else {
    return false;
  }
};

// EventEmitter is defined in src/node_events.cc
// EventEmitter.prototype.emit() is also defined there.
EventEmitter.prototype.addListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('addListener only takes instances of Function');
  }

  if (!this._events) this._events = {};

  // To avoid recursion in the case that type == "newListeners"! Before
  // adding it to the listeners, first emit "newListeners".
  this.emit('newListener', type, listener);

  if (!this._events[type]) {
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  } else if (isArray(this._events[type])) {

    // Check for listener leak
    if (!this._events[type].warned) {
      var m;
      if (this._events.maxListeners !== undefined) {
        m = this._events.maxListeners;
      } else {
        m = defaultMaxListeners;
      }

      if (m && m > 0 && this._events[type].length > m) {
        this._events[type].warned = true;
        console.error('(node) warning: possible EventEmitter memory ' +
                      'leak detected. %d listeners added. ' +
                      'Use emitter.setMaxListeners() to increase limit.',
                      this._events[type].length);
        console.trace();
      }
    }

    // If we've already got an array, just append.
    this._events[type].push(listener);
  } else {
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  var self = this;
  self.on(type, function g() {
    self.removeListener(type, g);
    listener.apply(this, arguments);
  });

  return this;
};

EventEmitter.prototype.removeListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('removeListener only takes instances of Function');
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (!this._events || !this._events[type]) return this;

  var list = this._events[type];

  if (isArray(list)) {
    var i = indexOf(list, listener);
    if (i < 0) return this;
    list.splice(i, 1);
    if (list.length == 0)
      delete this._events[type];
  } else if (this._events[type] === listener) {
    delete this._events[type];
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  if (arguments.length === 0) {
    this._events = {};
    return this;
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (type && this._events && this._events[type]) this._events[type] = null;
  return this;
};

EventEmitter.prototype.listeners = function(type) {
  if (!this._events) this._events = {};
  if (!this._events[type]) this._events[type] = [];
  if (!isArray(this._events[type])) {
    this._events[type] = [this._events[type]];
  }
  return this._events[type];
};

})(require("__browserify_process"))
},{"__browserify_process":2}],3:[function(require,module,exports){
var Api = require('./remark/api')
  , polyfills = require('./polyfills')
  , styler = require('components/styler')
  ;

// Expose API as `remark`
window.remark = new Api();

// Apply polyfills as needed
polyfills.apply();

// Apply embedded styles to document
styler.styleDocument();

},{"components/styler":"Ya8ZqZ","./remark/api":4,"./polyfills":5}],"components/styler":[function(require,module,exports){
module.exports=require('Ya8ZqZ');
},{}],"Ya8ZqZ":[function(require,module,exports){
var resources = require('../../resources')
  , highlighter = require('../../highlighter')
  ;

module.exports = {
  styleDocument: styleDocument
, setPageSize: setPageSize
};

// Applies bundled styles to document
function styleDocument () {
  var headElement, styleElement, style;

  // Bail out if document has already been styled
  if (getRemarkStylesheet()) {
    return;
  }

  headElement = document.getElementsByTagName('head')[0];
  styleElement = document.createElement('style');
  styleElement.type = 'text/css';

  // Set title in order to enable lookup
  styleElement.title = 'remark';

  // Set document styles
  styleElement.innerHTML = resources.documentStyles;

  // Append highlighting styles
  for (style in highlighter.styles) {
    if (highlighter.styles.hasOwnProperty(style)) {
      styleElement.innerHTML = styleElement.innerHTML +
        highlighter.styles[style];
    }
  }

  // Put element first to prevent overriding user styles
  headElement.insertBefore(styleElement, headElement.firstChild);
}

function setPageSize (size) {
  var stylesheet = getRemarkStylesheet()
    , pageRule = getPageRule(stylesheet)
    ;

  pageRule.style.size = size;
}

// Locates the embedded remark stylesheet
function getRemarkStylesheet () {
  var i, l = document.styleSheets.length;

  for (i = 0; i < l; ++i) {
    if (document.styleSheets[i].title === 'remark') {
      return document.styleSheets[i];
    }
  }
}

// Locates the CSS @page rule
function getPageRule (stylesheet) {
  var i, l = stylesheet.cssRules.length;

  for (i = 0; i < l; ++i) {
    if (stylesheet.cssRules[i] instanceof window.CSSPageRule) {
      return stylesheet.cssRules[i];
    }
  }
}

},{"../../resources":6,"../../highlighter":7}],"components/timer":[function(require,module,exports){
module.exports=require('yNa1UP');
},{}],"yNa1UP":[function(require,module,exports){
var utils = require('../../utils');

module.exports = TimerViewModel;

function TimerViewModel (events, element) {
  var self = this;

  self.events = events;
  self.element = element;

  self.startTime = null;
  self.pauseStart = null;
  self.pauseLength = 0;

  element.innerHTML = '0:00:00';

  setInterval(function() {
      self.updateTimer();
    }, 100);

  events.on('start', function () {
    // When we do the first slide change, start the clock.
    self.startTime = new Date();
  });

  events.on('resetTimer', function () {
    // If we reset the timer, clear everything.
    self.startTime = null;
    self.pauseStart = null;
    self.pauseLength = 0;
    self.element.innerHTML = '0:00:00';
  });

  events.on('pause', function () {
    self.pauseStart = new Date();
  });

  events.on('resume', function () {
    self.pauseLength += new Date() - self.pauseStart;
    self.pauseStart = null;
  });
}

TimerViewModel.prototype.updateTimer = function () {
  var self = this;

  if (self.startTime) {
    var millis;
    // If we're currently paused, measure elapsed time from the pauseStart.
    // Otherwise, use "now".
    if (self.pauseStart) {
      millis = self.pauseStart - self.startTime - self.pauseLength;
    } else {
      millis = new Date() - self.startTime - self.pauseLength;
    }

    var seconds = Math.floor(millis / 1000) % 60;
    var minutes = Math.floor(millis / 60000) % 60;
    var hours = Math.floor(millis / 3600000);

    self.element.innerHTML = hours + (minutes > 9 ? ':' : ':0') + minutes + (seconds > 9 ? ':' : ':0') + seconds;
  }
};

},{"../../utils":8}],5:[function(require,module,exports){
exports.apply = function () {
  forEach([Array, window.NodeList, window.HTMLCollection], extend);
};

function forEach (list, f) {
  var i;

  for (i = 0; i < list.length; ++i) {
    f(list[i], i);
  }
}

function extend (object) {
  var prototype = object && object.prototype;

  if (!prototype) {
    return;
  }

  prototype.forEach = prototype.forEach || function (f) {
    forEach(this, f);
  };

  prototype.filter = prototype.filter || function (f) {
    var result = [];

    this.forEach(function (element) {
      if (f(element, result.length)) {
        result.push(element);
      }
    });

    return result;
  };

  prototype.map = prototype.map || function (f) {
    var result = [];

    this.forEach(function (element) {
      result.push(f(element, result.length));
    });

    return result;
  };
}
},{}],6:[function(require,module,exports){
/* Automatically generated */

module.exports = {
  version: "0.10.2",
  documentStyles: "html.remark-container,body.remark-container{height:100%;width:100%;-webkit-print-color-adjust:exact;}.remark-container{background:#d7d8d2;margin:0;overflow:hidden;}.remark-container:focus{outline-style:solid;outline-width:1px;}:-webkit-full-screen .remark-container{width:100%;height:100%;}.remark-slides-area{position:relative;height:100%;width:100%;}.remark-slide-container{display:none;position:absolute;height:100%;width:100%;page-break-after:always;}.remark-slide-scaler{background-color:transparent;overflow:hidden;position:absolute;-webkit-transform-origin:top left;-moz-transform-origin:top left;transform-origin:top-left;-moz-box-shadow:0 0 30px #888;-webkit-box-shadow:0 0 30px #888;box-shadow:0 0 30px #888;}.remark-slide{height:100%;width:100%;display:table;table-layout:fixed;}.remark-slide>.left{text-align:left;}.remark-slide>.center{text-align:center;}.remark-slide>.right{text-align:right;}.remark-slide>.top{vertical-align:top;}.remark-slide>.middle{vertical-align:middle;}.remark-slide>.bottom{vertical-align:bottom;}.remark-slide-content{background-color:#fff;background-position:center;background-repeat:no-repeat;display:table-cell;font-size:20px;padding:1em 4em 1em 4em;}.remark-slide-content h1{font-size:55px;}.remark-slide-content h2{font-size:45px;}.remark-slide-content h3{font-size:35px;}.remark-slide-content .left{display:block;text-align:left;}.remark-slide-content .center{display:block;text-align:center;}.remark-slide-content .right{display:block;text-align:right;}.remark-slide-number{bottom:12px;opacity:0.5;position:absolute;right:20px;}.remark-slide-notes{border-top:3px solid black;position:absolute;display:none;}.remark-code{font-size:18px;}.remark-code-line{min-height:1em;}.remark-code-line-highlighted{background-color:rgba(255, 255, 0, 0.5);}.remark-code-span-highlighted{background-color:rgba(255, 255, 0, 0.5);padding:1px 2px 2px 2px;}.remark-visible{display:block;z-index:2;}.remark-fading{display:block;z-index:1;}.remark-fading .remark-slide-scaler{-moz-box-shadow:none;-webkit-box-shadow:none;box-shadow:none;}.remark-backdrop{position:absolute;top:0;bottom:0;left:0;right:0;display:none;background:#000;z-index:2;}.remark-pause{bottom:0;top:0;right:0;left:0;display:none;position:absolute;z-index:1000;}.remark-pause .remark-pause-lozenge{margin-top:30%;text-align:center;}.remark-pause .remark-pause-lozenge span{color:white;background:black;border:2px solid black;border-radius:20px;padding:20px 30px;font-family:Helvetica,arial,freesans,clean,sans-serif;font-size:42pt;font-weight:bold;}.remark-container.remark-presenter-mode.remark-pause-mode .remark-pause{display:block;}.remark-container.remark-presenter-mode.remark-pause-mode .remark-backdrop{display:block;opacity:0.5;}.remark-help{bottom:0;top:0;right:0;left:0;display:none;position:absolute;z-index:1000;-webkit-transform-origin:top left;-moz-transform-origin:top left;transform-origin:top-left;}.remark-help .remark-help-content{color:white;font-family:Helvetica,arial,freesans,clean,sans-serif;font-size:12pt;position:absolute;top:5%;bottom:10%;height:10%;left:5%;width:90%;}.remark-help .remark-help-content h1{font-size:36px;}.remark-help .remark-help-content td{color:white;font-size:12pt;padding:10px;}.remark-help .remark-help-content td:first-child{padding-left:0;}.remark-help .remark-help-content .key{background:white;color:black;min-width:1em;display:inline-block;padding:3px 6px;text-align:center;border-radius:4px;font-size:14px;}.remark-help .dismiss{top:85%;}.remark-container.remark-help-mode .remark-help{display:block;}.remark-container.remark-help-mode .remark-backdrop{display:block;opacity:0.95;}.remark-preview-area{bottom:2%;left:2%;display:none;opacity:0.5;position:absolute;height:47.25%;width:48%;}.remark-preview-area .remark-slide-container{display:block;}.remark-notes-area{background:#e7e8e2;bottom:0;color:black;display:none;left:52%;overflow:hidden;position:absolute;right:0;top:0;}.remark-notes-area .remark-top-area{height:50px;left:20px;position:absolute;right:10px;top:10px;}.remark-notes-area .remark-bottom-area{position:absolute;top:75px;bottom:10px;left:20px;right:10px;}.remark-notes-area .remark-bottom-area .remark-toggle{display:block;text-decoration:none;font-family:Helvetica,arial,freesans,clean,sans-serif;border-bottom:1px solid #ccc;height:21px;font-size:0.75em;font-weight:bold;text-transform:uppercase;color:#666;text-shadow:#f5f5f5 1px 1px 1px;}.remark-notes-area .remark-bottom-area .remark-notes-current-area{height:70%;position:relative;}.remark-notes-area .remark-bottom-area .remark-notes-current-area .remark-notes{clear:both;border-top:1px solid #f5f5f5;position:absolute;top:22px;bottom:0px;left:0px;right:0px;overflow-y:auto;margin-bottom:20px;}.remark-notes-area .remark-bottom-area .remark-notes-preview-area{height:30%;position:relative;}.remark-notes-area .remark-bottom-area .remark-notes-preview-area .remark-notes-preview{border-top:1px solid #f5f5f5;position:absolute;top:22px;bottom:0px;left:0px;right:0px;overflow-y:auto;}.remark-notes-area .remark-bottom-area .remark-notes>*:first-child,.remark-notes-area .remark-bottom-area .remark-notes-preview>*:first-child{margin-top:5px;}.remark-notes-area .remark-bottom-area .remark-notes>*:last-child,.remark-notes-area .remark-bottom-area .remark-notes-preview>*:last-child{margin-bottom:0;}.remark-toolbar{color:#979892;vertical-align:middle;}.remark-toolbar .remark-toolbar-link{border:2px solid #d7d8d2;color:#979892;display:inline-block;padding:2px 2px;text-decoration:none;text-align:center;min-width:20px;}.remark-toolbar .remark-toolbar-link:hover{border-color:#979892;color:#676862;}.remark-toolbar .remark-toolbar-timer{border:2px solid black;border-radius:10px;background:black;color:white;display:inline-block;float:right;padding:5px 10px;font-family:sans-serif;font-weight:bold;font-size:175%;text-decoration:none;text-align:center;}.remark-container.remark-presenter-mode .remark-slides-area{top:2%;left:2%;height:47.25%;width:48%;}.remark-container.remark-presenter-mode .remark-preview-area{display:block;}.remark-container.remark-presenter-mode .remark-notes-area{display:block;}.remark-container.remark-blackout-mode:not(.remark-presenter-mode) .remark-backdrop{display:block;opacity:0.99;}.remark-container.remark-mirrored-mode:not(.remark-presenter-mode) .remark-slides-area{-webkit-transform:scaleX(-1);-moz-transform:scaleX(-1);-ms-transform:scaleX(-1);-o-transform:scaleX(-1);}@media print{.remark-container{overflow:visible;background-color:#fff;} .remark-container.remark-presenter-mode .remark-slides-area{top:0px;left:0px;height:100%;width:681px;} .remark-container.remark-presenter-mode .remark-preview-area,.remark-container.remark-presenter-mode .remark-notes-area{display:none;} .remark-container.remark-presenter-mode .remark-slide-notes{display:block;margin-left:30px;width:621px;} .remark-slide-container{display:block;position:relative;} .remark-slide-scaler{-moz-box-shadow:none;-webkit-box-shadow:none;box-shadow:none;}}@page {margin:0;}",
  containerLayout: "<div class=\"remark-notes-area\">\n  <div class=\"remark-top-area\">\n    <div class=\"remark-toolbar\">\n      <a class=\"remark-toolbar-link\" href=\"#increase\">+</a>\n      <a class=\"remark-toolbar-link\" href=\"#decrease\">-</a>\n      <span class=\"remark-toolbar-timer\"></span>\n    </div>\n  </div>\n  <div class=\"remark-bottom-area\">\n    <div class=\"remark-notes-current-area\">\n      <div class=\"remark-toggle\">Notes for current slide</div>\n      <div class=\"remark-notes\"></div>\n    </div>\n    <div class=\"remark-notes-preview-area\">\n      <div class=\"remark-toggle\">Notes for next slide</div>\n      <div class=\"remark-notes-preview\"></div>\n    </div>\n  </div>\n</div>\n<div class=\"remark-slides-area\"></div>\n<div class=\"remark-preview-area\"></div>\n<div class=\"remark-backdrop\"></div>\n<div class=\"remark-pause\">\n  <div class=\"remark-pause-lozenge\">\n    <span>Paused</span>\n  </div>\n</div>\n<div class=\"remark-help\">\n  <div class=\"remark-help-content\">\n    <h1>Help</h1>\n    <p><b>Keyboard shortcuts</b></p>\n    <table class=\"light-keys\">\n      <tr>\n        <td>\n          <span class=\"key\"><b>&uarr;</b></span>,\n          <span class=\"key\"><b>&larr;</b></span>,\n          <span class=\"key\">Pg Up</span>,\n          <span class=\"key\">k</span>\n        </td>\n        <td>Go to previous slide</td>\n      </tr>\n      <tr>\n        <td>\n          <span class=\"key\"><b>&darr;</b></span>,\n          <span class=\"key\"><b>&rarr;</b></span>,\n          <span class=\"key\">Pg Dn</span>,\n          <span class=\"key\">Space</span>,\n          <span class=\"key\">j</span>\n        </td>\n        <td>Go to next slide</td>\n      </tr>\n      <tr>\n        <td>\n          <span class=\"key\">Home</span>\n        </td>\n        <td>Go to first slide</td>\n      </tr>\n      <tr>\n        <td>\n          <span class=\"key\">End</span>\n        </td>\n        <td>Go to last slide</td>\n      </tr>\n      <tr>\n        <td>\n          <span class=\"key\">b</span>&nbsp;/\n          <span class=\"key\">m</span>&nbsp;/\n          <span class=\"key\">f</span>\n        </td>\n        <td>Toggle blackout / mirrored / fullscreen mode</td>\n      </tr>\n      <tr>\n        <td>\n          <span class=\"key\">c</span>\n        </td>\n        <td>Clone slideshow</td>\n      </tr>\n      <tr>\n        <td>\n          <span class=\"key\">p</span>\n        </td>\n        <td>Toggle presenter mode</td>\n      </tr>\n      <tr>\n        <td>\n          <span class=\"key\">t</span>\n        </td>\n        <td>Restart the presentation timer</td>\n      </tr>\n      <tr>\n        <td>\n          <span class=\"key\">?</span>,\n          <span class=\"key\">h</span>\n        </td>\n        <td>Toggle this help</td>\n      </tr>\n    </table>\n  </div>\n  <div class=\"content dismiss\">\n    <table class=\"light-keys\">\n      <tr>\n        <td>\n          <span class=\"key\">Esc</span>\n        </td>\n        <td>Back to slideshow</td>\n      </tr>\n    </table>\n  </div>\n</div>\n"
};

},{}],8:[function(require,module,exports){
exports.addClass = function (element, className) {
  element.className = exports.getClasses(element)
    .concat([className])
    .join(' ');
};

exports.removeClass = function (element, className) {
  element.className = exports.getClasses(element)
    .filter(function (klass) { return klass !== className; })
    .join(' ');
};

exports.toggleClass = function (element, className) {
  var classes = exports.getClasses(element),
      index = classes.indexOf(className);

  if (index !== -1) {
    classes.splice(index, 1);
  }
  else {
    classes.push(className);
  }

  element.className = classes.join(' ');
};

exports.getClasses = function (element) {
  return element.className
    .split(' ')
    .filter(function (s) { return s !== ''; });
};

exports.hasClass = function (element, className) {
  return exports.getClasses(element).indexOf(className) !== -1;
};

exports.getPrefixedProperty = function (element, propertyName) {
  var capitalizedPropertName = propertyName[0].toUpperCase() +
    propertyName.slice(1);

  return element[propertyName] || element['moz' + capitalizedPropertName] ||
    element['webkit' + capitalizedPropertName];
};

},{}],7:[function(require,module,exports){
(function(){/* Automatically generated */

var hljs = (function() {
      var exports = {};
      /*
Syntax highlighting with language autodetection.
https://highlightjs.org/
*/

(function(factory) {

  // Setup highlight.js for different environments. First is Node.js or
  // CommonJS.
  if(typeof exports !== 'undefined') {
    factory(exports);
  } else {
    // Export hljs globally even when using AMD for cases when this script
    // is loaded with others that may still expect a global hljs.
    window.hljs = factory({});

    // Finally register the global hljs with AMD.
    if(typeof define === 'function' && define.amd) {
      define([], function() {
        return window.hljs;
      });
    }
  }

}(function(hljs) {

  /* Utility functions */

  function escape(value) {
    return value.replace(/&/gm, '&amp;').replace(/</gm, '&lt;').replace(/>/gm, '&gt;');
  }

  function tag(node) {
    return node.nodeName.toLowerCase();
  }

  function testRe(re, lexeme) {
    var match = re && re.exec(lexeme);
    return match && match.index == 0;
  }

  function blockLanguage(block) {
    var classes = (block.className + ' ' + (block.parentNode ? block.parentNode.className : '')).split(/\s+/);
    classes = classes.map(function(c) {return c.replace(/^lang(uage)?-/, '');});
    return classes.filter(function(c) {return getLanguage(c) || /no(-?)highlight|plain|text/.test(c);})[0];
  }

  function inherit(parent, obj) {
    var result = {}, key;
    for (key in parent)
      result[key] = parent[key];
    if (obj)
      for (key in obj)
        result[key] = obj[key];
    return result;
  }

  /* Stream merging */

  function nodeStream(node) {
    var result = [];
    (function _nodeStream(node, offset) {
      for (var child = node.firstChild; child; child = child.nextSibling) {
        if (child.nodeType == 3)
          offset += child.nodeValue.length;
        else if (child.nodeType == 1) {
          result.push({
            event: 'start',
            offset: offset,
            node: child
          });
          offset = _nodeStream(child, offset);
          // Prevent void elements from having an end tag that would actually
          // double them in the output. There are more void elements in HTML
          // but we list only those realistically expected in code display.
          if (!tag(child).match(/br|hr|img|input/)) {
            result.push({
              event: 'stop',
              offset: offset,
              node: child
            });
          }
        }
      }
      return offset;
    })(node, 0);
    return result;
  }

  function mergeStreams(original, highlighted, value) {
    var processed = 0;
    var result = '';
    var nodeStack = [];

    function selectStream() {
      if (!original.length || !highlighted.length) {
        return original.length ? original : highlighted;
      }
      if (original[0].offset != highlighted[0].offset) {
        return (original[0].offset < highlighted[0].offset) ? original : highlighted;
      }

      /*
      To avoid starting the stream just before it should stop the order is
      ensured that original always starts first and closes last:

      if (event1 == 'start' && event2 == 'start')
        return original;
      if (event1 == 'start' && event2 == 'stop')
        return highlighted;
      if (event1 == 'stop' && event2 == 'start')
        return original;
      if (event1 == 'stop' && event2 == 'stop')
        return highlighted;

      ... which is collapsed to:
      */
      return highlighted[0].event == 'start' ? original : highlighted;
    }

    function open(node) {
      function attr_str(a) {return ' ' + a.nodeName + '="' + escape(a.value) + '"';}
      result += '<' + tag(node) + Array.prototype.map.call(node.attributes, attr_str).join('') + '>';
    }

    function close(node) {
      result += '</' + tag(node) + '>';
    }

    function render(event) {
      (event.event == 'start' ? open : close)(event.node);
    }

    while (original.length || highlighted.length) {
      var stream = selectStream();
      result += escape(value.substr(processed, stream[0].offset - processed));
      processed = stream[0].offset;
      if (stream == original) {
        /*
        On any opening or closing tag of the original markup we first close
        the entire highlighted node stack, then render the original tag along
        with all the following original tags at the same offset and then
        reopen all the tags on the highlighted stack.
        */
        nodeStack.reverse().forEach(close);
        do {
          render(stream.splice(0, 1)[0]);
          stream = selectStream();
        } while (stream == original && stream.length && stream[0].offset == processed);
        nodeStack.reverse().forEach(open);
      } else {
        if (stream[0].event == 'start') {
          nodeStack.push(stream[0].node);
        } else {
          nodeStack.pop();
        }
        render(stream.splice(0, 1)[0]);
      }
    }
    return result + escape(value.substr(processed));
  }

  /* Initialization */

  function compileLanguage(language) {

    function reStr(re) {
        return (re && re.source) || re;
    }

    function langRe(value, global) {
      return new RegExp(
        reStr(value),
        'm' + (language.case_insensitive ? 'i' : '') + (global ? 'g' : '')
      );
    }

    function compileMode(mode, parent) {
      if (mode.compiled)
        return;
      mode.compiled = true;

      mode.keywords = mode.keywords || mode.beginKeywords;
      if (mode.keywords) {
        var compiled_keywords = {};

        var flatten = function(className, str) {
          if (language.case_insensitive) {
            str = str.toLowerCase();
          }
          str.split(' ').forEach(function(kw) {
            var pair = kw.split('|');
            compiled_keywords[pair[0]] = [className, pair[1] ? Number(pair[1]) : 1];
          });
        };

        if (typeof mode.keywords == 'string') { // string
          flatten('keyword', mode.keywords);
        } else {
          Object.keys(mode.keywords).forEach(function (className) {
            flatten(className, mode.keywords[className]);
          });
        }
        mode.keywords = compiled_keywords;
      }
      mode.lexemesRe = langRe(mode.lexemes || /\b\w+\b/, true);

      if (parent) {
        if (mode.beginKeywords) {
          mode.begin = '\\b(' + mode.beginKeywords.split(' ').join('|') + ')\\b';
        }
        if (!mode.begin)
          mode.begin = /\B|\b/;
        mode.beginRe = langRe(mode.begin);
        if (!mode.end && !mode.endsWithParent)
          mode.end = /\B|\b/;
        if (mode.end)
          mode.endRe = langRe(mode.end);
        mode.terminator_end = reStr(mode.end) || '';
        if (mode.endsWithParent && parent.terminator_end)
          mode.terminator_end += (mode.end ? '|' : '') + parent.terminator_end;
      }
      if (mode.illegal)
        mode.illegalRe = langRe(mode.illegal);
      if (mode.relevance === undefined)
        mode.relevance = 1;
      if (!mode.contains) {
        mode.contains = [];
      }
      var expanded_contains = [];
      mode.contains.forEach(function(c) {
        if (c.variants) {
          c.variants.forEach(function(v) {expanded_contains.push(inherit(c, v));});
        } else {
          expanded_contains.push(c == 'self' ? mode : c);
        }
      });
      mode.contains = expanded_contains;
      mode.contains.forEach(function(c) {compileMode(c, mode);});

      if (mode.starts) {
        compileMode(mode.starts, parent);
      }

      var terminators =
        mode.contains.map(function(c) {
          return c.beginKeywords ? '\\.?(' + c.begin + ')\\.?' : c.begin;
        })
        .concat([mode.terminator_end, mode.illegal])
        .map(reStr)
        .filter(Boolean);
      mode.terminators = terminators.length ? langRe(terminators.join('|'), true) : {exec: function(/*s*/) {return null;}};
    }

    compileMode(language);
  }

  /*
  Core highlighting function. Accepts a language name, or an alias, and a
  string with the code to highlight. Returns an object with the following
  properties:

  - relevance (int)
  - value (an HTML string with highlighting markup)

  */
  function highlight(name, value, ignore_illegals, continuation) {

    function subMode(lexeme, mode) {
      for (var i = 0; i < mode.contains.length; i++) {
        if (testRe(mode.contains[i].beginRe, lexeme)) {
          return mode.contains[i];
        }
      }
    }

    function endOfMode(mode, lexeme) {
      if (testRe(mode.endRe, lexeme)) {
        while (mode.endsParent && mode.parent) {
          mode = mode.parent;
        }
        return mode;
      }
      if (mode.endsWithParent) {
        return endOfMode(mode.parent, lexeme);
      }
    }

    function isIllegal(lexeme, mode) {
      return !ignore_illegals && testRe(mode.illegalRe, lexeme);
    }

    function keywordMatch(mode, match) {
      var match_str = language.case_insensitive ? match[0].toLowerCase() : match[0];
      return mode.keywords.hasOwnProperty(match_str) && mode.keywords[match_str];
    }

    function buildSpan(classname, insideSpan, leaveOpen, noPrefix) {
      var classPrefix = noPrefix ? '' : options.classPrefix,
          openSpan    = '<span class="' + classPrefix,
          closeSpan   = leaveOpen ? '' : '</span>';

      openSpan += classname + '">';

      return openSpan + insideSpan + closeSpan;
    }

    function processKeywords() {
      if (!top.keywords)
        return escape(mode_buffer);
      var result = '';
      var last_index = 0;
      top.lexemesRe.lastIndex = 0;
      var match = top.lexemesRe.exec(mode_buffer);
      while (match) {
        result += escape(mode_buffer.substr(last_index, match.index - last_index));
        var keyword_match = keywordMatch(top, match);
        if (keyword_match) {
          relevance += keyword_match[1];
          result += buildSpan(keyword_match[0], escape(match[0]));
        } else {
          result += escape(match[0]);
        }
        last_index = top.lexemesRe.lastIndex;
        match = top.lexemesRe.exec(mode_buffer);
      }
      return result + escape(mode_buffer.substr(last_index));
    }

    function processSubLanguage() {
      if (top.subLanguage && !languages[top.subLanguage]) {
        return escape(mode_buffer);
      }
      var result = top.subLanguage ? highlight(top.subLanguage, mode_buffer, true, continuations[top.subLanguage]) : highlightAuto(mode_buffer);
      // Counting embedded language score towards the host language may be disabled
      // with zeroing the containing mode relevance. Usecase in point is Markdown that
      // allows XML everywhere and makes every XML snippet to have a much larger Markdown
      // score.
      if (top.relevance > 0) {
        relevance += result.relevance;
      }
      if (top.subLanguageMode == 'continuous') {
        continuations[top.subLanguage] = result.top;
      }
      return buildSpan(result.language, result.value, false, true);
    }

    function processBuffer() {
      return top.subLanguage !== undefined ? processSubLanguage() : processKeywords();
    }

    function startNewMode(mode, lexeme) {
      var markup = mode.className? buildSpan(mode.className, '', true): '';
      if (mode.returnBegin) {
        result += markup;
        mode_buffer = '';
      } else if (mode.excludeBegin) {
        result += escape(lexeme) + markup;
        mode_buffer = '';
      } else {
        result += markup;
        mode_buffer = lexeme;
      }
      top = Object.create(mode, {parent: {value: top}});
    }

    function processLexeme(buffer, lexeme) {

      mode_buffer += buffer;
      if (lexeme === undefined) {
        result += processBuffer();
        return 0;
      }

      var new_mode = subMode(lexeme, top);
      if (new_mode) {
        result += processBuffer();
        startNewMode(new_mode, lexeme);
        return new_mode.returnBegin ? 0 : lexeme.length;
      }

      var end_mode = endOfMode(top, lexeme);
      if (end_mode) {
        var origin = top;
        if (!(origin.returnEnd || origin.excludeEnd)) {
          mode_buffer += lexeme;
        }
        result += processBuffer();
        do {
          if (top.className) {
            result += '</span>';
          }
          relevance += top.relevance;
          top = top.parent;
        } while (top != end_mode.parent);
        if (origin.excludeEnd) {
          result += escape(lexeme);
        }
        mode_buffer = '';
        if (end_mode.starts) {
          startNewMode(end_mode.starts, '');
        }
        return origin.returnEnd ? 0 : lexeme.length;
      }

      if (isIllegal(lexeme, top))
        throw new Error('Illegal lexeme "' + lexeme + '" for mode "' + (top.className || '<unnamed>') + '"');

      /*
      Parser should not reach this point as all types of lexemes should be caught
      earlier, but if it does due to some bug make sure it advances at least one
      character forward to prevent infinite looping.
      */
      mode_buffer += lexeme;
      return lexeme.length || 1;
    }

    var language = getLanguage(name);
    if (!language) {
      throw new Error('Unknown language: "' + name + '"');
    }

    compileLanguage(language);
    var top = continuation || language;
    var continuations = {}; // keep continuations for sub-languages
    var result = '', current;
    for(current = top; current != language; current = current.parent) {
      if (current.className) {
        result = buildSpan(current.className, '', true) + result;
      }
    }
    var mode_buffer = '';
    var relevance = 0;
    try {
      var match, count, index = 0;
      while (true) {
        top.terminators.lastIndex = index;
        match = top.terminators.exec(value);
        if (!match)
          break;
        count = processLexeme(value.substr(index, match.index - index), match[0]);
        index = match.index + count;
      }
      processLexeme(value.substr(index));
      for(current = top; current.parent; current = current.parent) { // close dangling modes
        if (current.className) {
          result += '</span>';
        }
      }
      return {
        relevance: relevance,
        value: result,
        language: name,
        top: top
      };
    } catch (e) {
      if (e.message.indexOf('Illegal') != -1) {
        return {
          relevance: 0,
          value: escape(value)
        };
      } else {
        throw e;
      }
    }
  }

  /*
  Highlighting with language detection. Accepts a string with the code to
  highlight. Returns an object with the following properties:

  - language (detected language)
  - relevance (int)
  - value (an HTML string with highlighting markup)
  - second_best (object with the same structure for second-best heuristically
    detected language, may be absent)

  */
  function highlightAuto(text, languageSubset) {
    languageSubset = languageSubset || options.languages || Object.keys(languages);
    var result = {
      relevance: 0,
      value: escape(text)
    };
    var second_best = result;
    languageSubset.forEach(function(name) {
      if (!getLanguage(name)) {
        return;
      }
      var current = highlight(name, text, false);
      current.language = name;
      if (current.relevance > second_best.relevance) {
        second_best = current;
      }
      if (current.relevance > result.relevance) {
        second_best = result;
        result = current;
      }
    });
    if (second_best.language) {
      result.second_best = second_best;
    }
    return result;
  }

  /*
  Post-processing of the highlighted markup:

  - replace TABs with something more useful
  - replace real line-breaks with '<br>' for non-pre containers

  */
  function fixMarkup(value) {
    if (options.tabReplace) {
      value = value.replace(/^((<[^>]+>|\t)+)/gm, function(match, p1 /*..., offset, s*/) {
        return p1.replace(/\t/g, options.tabReplace);
      });
    }
    if (options.useBR) {
      value = value.replace(/\n/g, '<br>');
    }
    return value;
  }

  function buildClassName(prevClassName, currentLang, resultLang) {
    var language = currentLang ? aliases[currentLang] : resultLang,
        result   = [prevClassName.trim()];

    if (!prevClassName.match(/\bhljs\b/)) {
      result.push('hljs');
    }

    if (prevClassName.indexOf(language) === -1) {
      result.push(language);
    }

    return result.join(' ').trim();
  }

  /*
  Applies highlighting to a DOM node containing code. Accepts a DOM node and
  two optional parameters for fixMarkup.
  */
  function highlightBlock(block) {
    var language = blockLanguage(block);
    if (/no(-?)highlight|plain|text/.test(language))
        return;

    var node;
    if (options.useBR) {
      node = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
      node.innerHTML = block.innerHTML.replace(/\n/g, '').replace(/<br[ \/]*>/g, '\n');
    } else {
      node = block;
    }
    var text = node.textContent;
    var result = language ? highlight(language, text, true) : highlightAuto(text);

    var originalStream = nodeStream(node);
    if (originalStream.length) {
      var resultNode = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
      resultNode.innerHTML = result.value;
      result.value = mergeStreams(originalStream, nodeStream(resultNode), text);
    }
    result.value = fixMarkup(result.value);

    block.innerHTML = result.value;
    block.className = buildClassName(block.className, language, result.language);
    block.result = {
      language: result.language,
      re: result.relevance
    };
    if (result.second_best) {
      block.second_best = {
        language: result.second_best.language,
        re: result.second_best.relevance
      };
    }
  }

  var options = {
    classPrefix: 'hljs-',
    tabReplace: null,
    useBR: false,
    languages: undefined
  };

  /*
  Updates highlight.js global options with values passed in the form of an object
  */
  function configure(user_options) {
    options = inherit(options, user_options);
  }

  /*
  Applies highlighting to all <pre><code>..</code></pre> blocks on a page.
  */
  function initHighlighting() {
    if (initHighlighting.called)
      return;
    initHighlighting.called = true;

    var blocks = document.querySelectorAll('pre code');
    Array.prototype.forEach.call(blocks, highlightBlock);
  }

  /*
  Attaches highlighting to the page load event.
  */
  function initHighlightingOnLoad() {
    addEventListener('DOMContentLoaded', initHighlighting, false);
    addEventListener('load', initHighlighting, false);
  }

  var languages = {};
  var aliases = {};

  function registerLanguage(name, language) {
    var lang = languages[name] = language(hljs);
    if (lang.aliases) {
      lang.aliases.forEach(function(alias) {aliases[alias] = name;});
    }
  }

  function listLanguages() {
    return Object.keys(languages);
  }

  function getLanguage(name) {
    return languages[name] || languages[aliases[name]];
  }

  /* Interface definition */

  hljs.highlight = highlight;
  hljs.highlightAuto = highlightAuto;
  hljs.fixMarkup = fixMarkup;
  hljs.highlightBlock = highlightBlock;
  hljs.configure = configure;
  hljs.initHighlighting = initHighlighting;
  hljs.initHighlightingOnLoad = initHighlightingOnLoad;
  hljs.registerLanguage = registerLanguage;
  hljs.listLanguages = listLanguages;
  hljs.getLanguage = getLanguage;
  hljs.inherit = inherit;

  // Common regexps
  hljs.IDENT_RE = '[a-zA-Z]\\w*';
  hljs.UNDERSCORE_IDENT_RE = '[a-zA-Z_]\\w*';
  hljs.NUMBER_RE = '\\b\\d+(\\.\\d+)?';
  hljs.C_NUMBER_RE = '\\b(0[xX][a-fA-F0-9]+|(\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)'; // 0x..., 0..., decimal, float
  hljs.BINARY_NUMBER_RE = '\\b(0b[01]+)'; // 0b...
  hljs.RE_STARTERS_RE = '!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~';

  // Common modes
  hljs.BACKSLASH_ESCAPE = {
    begin: '\\\\[\\s\\S]', relevance: 0
  };
  hljs.APOS_STRING_MODE = {
    className: 'string',
    begin: '\'', end: '\'',
    illegal: '\\n',
    contains: [hljs.BACKSLASH_ESCAPE]
  };
  hljs.QUOTE_STRING_MODE = {
    className: 'string',
    begin: '"', end: '"',
    illegal: '\\n',
    contains: [hljs.BACKSLASH_ESCAPE]
  };
  hljs.PHRASAL_WORDS_MODE = {
    begin: /\b(a|an|the|are|I|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such)\b/
  };
  hljs.COMMENT = function (begin, end, inherits) {
    var mode = hljs.inherit(
      {
        className: 'comment',
        begin: begin, end: end,
        contains: []
      },
      inherits || {}
    );
    mode.contains.push(hljs.PHRASAL_WORDS_MODE);
    return mode;
  };
  hljs.C_LINE_COMMENT_MODE = hljs.COMMENT('//', '$');
  hljs.C_BLOCK_COMMENT_MODE = hljs.COMMENT('/\\*', '\\*/');
  hljs.HASH_COMMENT_MODE = hljs.COMMENT('#', '$');
  hljs.NUMBER_MODE = {
    className: 'number',
    begin: hljs.NUMBER_RE,
    relevance: 0
  };
  hljs.C_NUMBER_MODE = {
    className: 'number',
    begin: hljs.C_NUMBER_RE,
    relevance: 0
  };
  hljs.BINARY_NUMBER_MODE = {
    className: 'number',
    begin: hljs.BINARY_NUMBER_RE,
    relevance: 0
  };
  hljs.CSS_NUMBER_MODE = {
    className: 'number',
    begin: hljs.NUMBER_RE + '(' +
      '%|em|ex|ch|rem'  +
      '|vw|vh|vmin|vmax' +
      '|cm|mm|in|pt|pc|px' +
      '|deg|grad|rad|turn' +
      '|s|ms' +
      '|Hz|kHz' +
      '|dpi|dpcm|dppx' +
      ')?',
    relevance: 0
  };
  hljs.REGEXP_MODE = {
    className: 'regexp',
    begin: /\//, end: /\/[gimuy]*/,
    illegal: /\n/,
    contains: [
      hljs.BACKSLASH_ESCAPE,
      {
        begin: /\[/, end: /\]/,
        relevance: 0,
        contains: [hljs.BACKSLASH_ESCAPE]
      }
    ]
  };
  hljs.TITLE_MODE = {
    className: 'title',
    begin: hljs.IDENT_RE,
    relevance: 0
  };
  hljs.UNDERSCORE_TITLE_MODE = {
    className: 'title',
    begin: hljs.UNDERSCORE_IDENT_RE,
    relevance: 0
  };

  return hljs;
}));
;
      return exports;
    }())
  , languages = [{name:"javascript",create:/*
Language: JavaScript
Category: common, scripting
*/

function(hljs) {
  return {
    aliases: ['js'],
    keywords: {
      keyword:
        'in of if for while finally var new function do return void else break catch ' +
        'instanceof with throw case default try this switch continue typeof delete ' +
        'let yield const export super debugger as await',
      literal:
        'true false null undefined NaN Infinity',
      built_in:
        'eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent ' +
        'encodeURI encodeURIComponent escape unescape Object Function Boolean Error ' +
        'EvalError InternalError RangeError ReferenceError StopIteration SyntaxError ' +
        'TypeError URIError Number Math Date String RegExp Array Float32Array ' +
        'Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array ' +
        'Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require ' +
        'module console window document Symbol Set Map WeakSet WeakMap Proxy Reflect ' +
        'Promise'
    },
    contains: [
      {
        className: 'pi',
        relevance: 10,
        variants: [
          {begin: /^\s*('|")use strict('|")/},
          {begin: /^\s*('|")use asm('|")/}
        ]
      },
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      { // template string
        className: 'string',
        begin: '`', end: '`',
        contains: [
          hljs.BACKSLASH_ESCAPE,
          {
            className: 'subst',
            begin: '\\$\\{', end: '\\}'
          }
        ]
      },
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      {
        className: 'number',
        begin: '\\b(0[xXbBoO][a-fA-F0-9]+|(\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)', // 0x..., 0..., 0b..., 0o..., decimal, float
        relevance: 0
      },
      { // "value" container
        begin: '(' + hljs.RE_STARTERS_RE + '|\\b(case|return|throw)\\b)\\s*',
        keywords: 'return throw case',
        contains: [
          hljs.C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE,
          hljs.REGEXP_MODE,
          { // E4X / JSX
            begin: /</, end: />\s*[);\]]/,
            relevance: 0,
            subLanguage: 'xml'
          }
        ],
        relevance: 0
      },
      {
        className: 'function',
        beginKeywords: 'function', end: /\{/, excludeEnd: true,
        contains: [
          hljs.inherit(hljs.TITLE_MODE, {begin: /[A-Za-z$_][0-9A-Za-z$_]*/}),
          {
            className: 'params',
            begin: /\(/, end: /\)/,
            contains: [
              hljs.C_LINE_COMMENT_MODE,
              hljs.C_BLOCK_COMMENT_MODE
            ],
            illegal: /["'\(]/
          }
        ],
        illegal: /\[|%/
      },
      {
        begin: /\$[(.]/ // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
      },
      {
        begin: '\\.' + hljs.IDENT_RE, relevance: 0 // hack: prevents detection of keywords after dots
      },
      // ECMAScript 6 modules import
      {
        beginKeywords: 'import', end: '[;$]',
        keywords: 'import from as',
        contains: [
          hljs.APOS_STRING_MODE,
          hljs.QUOTE_STRING_MODE
        ]
      },
      { // ES6 class
        className: 'class',
        beginKeywords: 'class', end: /[{;=]/, excludeEnd: true,
        illegal: /[:"\[\]]/,
        contains: [
          {beginKeywords: 'extends'},
          hljs.UNDERSCORE_TITLE_MODE
        ]
      }
    ]
  };
}
},{name:"ruby",create:/*
Language: Ruby
Author: Anton Kovalyov <anton@kovalyov.net>
Contributors: Peter Leonov <gojpeg@yandex.ru>, Vasily Polovnyov <vast@whiteants.net>, Loren Segal <lsegal@soen.ca>, Pascal Hurni <phi@ruby-reactive.org>, Cedric Sohrauer <sohrauer@googlemail.com>
Category: common
*/

function(hljs) {
  var RUBY_METHOD_RE = '[a-zA-Z_]\\w*[!?=]?|[-+~]\\@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?';
  var RUBY_KEYWORDS =
    'and false then defined module in return redo if BEGIN retry end for true self when ' +
    'next until do begin unless END rescue nil else break undef not super class case ' +
    'require yield alias while ensure elsif or include attr_reader attr_writer attr_accessor';
  var YARDOCTAG = {
    className: 'yardoctag',
    begin: '@[A-Za-z]+'
  };
  var IRB_OBJECT = {
    className: 'value',
    begin: '#<', end: '>'
  };
  var COMMENT_MODES = [
    hljs.COMMENT(
      '#',
      '$',
      {
        contains: [YARDOCTAG]
      }
    ),
    hljs.COMMENT(
      '^\\=begin',
      '^\\=end',
      {
        contains: [YARDOCTAG],
        relevance: 10
      }
    ),
    hljs.COMMENT('^__END__', '\\n$')
  ];
  var SUBST = {
    className: 'subst',
    begin: '#\\{', end: '}',
    keywords: RUBY_KEYWORDS
  };
  var STRING = {
    className: 'string',
    contains: [hljs.BACKSLASH_ESCAPE, SUBST],
    variants: [
      {begin: /'/, end: /'/},
      {begin: /"/, end: /"/},
      {begin: /`/, end: /`/},
      {begin: '%[qQwWx]?\\(', end: '\\)'},
      {begin: '%[qQwWx]?\\[', end: '\\]'},
      {begin: '%[qQwWx]?{', end: '}'},
      {begin: '%[qQwWx]?<', end: '>'},
      {begin: '%[qQwWx]?/', end: '/'},
      {begin: '%[qQwWx]?%', end: '%'},
      {begin: '%[qQwWx]?-', end: '-'},
      {begin: '%[qQwWx]?\\|', end: '\\|'},
      {
        // \B in the beginning suppresses recognition of ?-sequences where ?
        // is the last character of a preceding identifier, as in: `func?4`
        begin: /\B\?(\\\d{1,3}|\\x[A-Fa-f0-9]{1,2}|\\u[A-Fa-f0-9]{4}|\\?\S)\b/
      }
    ]
  };
  var PARAMS = {
    className: 'params',
    begin: '\\(', end: '\\)',
    keywords: RUBY_KEYWORDS
  };

  var RUBY_DEFAULT_CONTAINS = [
    STRING,
    IRB_OBJECT,
    {
      className: 'class',
      beginKeywords: 'class module', end: '$|;',
      illegal: /=/,
      contains: [
        hljs.inherit(hljs.TITLE_MODE, {begin: '[A-Za-z_]\\w*(::\\w+)*(\\?|\\!)?'}),
        {
          className: 'inheritance',
          begin: '<\\s*',
          contains: [{
            className: 'parent',
            begin: '(' + hljs.IDENT_RE + '::)?' + hljs.IDENT_RE
          }]
        }
      ].concat(COMMENT_MODES)
    },
    {
      className: 'function',
      beginKeywords: 'def', end: ' |$|;',
      relevance: 0,
      contains: [
        hljs.inherit(hljs.TITLE_MODE, {begin: RUBY_METHOD_RE}),
        PARAMS
      ].concat(COMMENT_MODES)
    },
    {
      className: 'constant',
      begin: '(::)?(\\b[A-Z]\\w*(::)?)+',
      relevance: 0
    },
    {
      className: 'symbol',
      begin: hljs.UNDERSCORE_IDENT_RE + '(\\!|\\?)?:',
      relevance: 0
    },
    {
      className: 'symbol',
      begin: ':',
      contains: [STRING, {begin: RUBY_METHOD_RE}],
      relevance: 0
    },
    {
      className: 'number',
      begin: '(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b',
      relevance: 0
    },
    {
      className: 'variable',
      begin: '(\\$\\W)|((\\$|\\@\\@?)(\\w+))'
    },
    { // regexp container
      begin: '(' + hljs.RE_STARTERS_RE + ')\\s*',
      contains: [
        IRB_OBJECT,
        {
          className: 'regexp',
          contains: [hljs.BACKSLASH_ESCAPE, SUBST],
          illegal: /\n/,
          variants: [
            {begin: '/', end: '/[a-z]*'},
            {begin: '%r{', end: '}[a-z]*'},
            {begin: '%r\\(', end: '\\)[a-z]*'},
            {begin: '%r!', end: '![a-z]*'},
            {begin: '%r\\[', end: '\\][a-z]*'}
          ]
        }
      ].concat(COMMENT_MODES),
      relevance: 0
    }
  ].concat(COMMENT_MODES);

  SUBST.contains = RUBY_DEFAULT_CONTAINS;
  PARAMS.contains = RUBY_DEFAULT_CONTAINS;

  var SIMPLE_PROMPT = "[>?]>";
  var DEFAULT_PROMPT = "[\\w#]+\\(\\w+\\):\\d+:\\d+>";
  var RVM_PROMPT = "(\\w+-)?\\d+\\.\\d+\\.\\d(p\\d+)?[^>]+>";

  var IRB_DEFAULT = [
    {
      begin: /^\s*=>/,
      className: 'status',
      starts: {
        end: '$', contains: RUBY_DEFAULT_CONTAINS
      }
    },
    {
      className: 'prompt',
      begin: '^('+SIMPLE_PROMPT+"|"+DEFAULT_PROMPT+'|'+RVM_PROMPT+')',
      starts: {
        end: '$', contains: RUBY_DEFAULT_CONTAINS
      }
    }
  ];

  return {
    aliases: ['rb', 'gemspec', 'podspec', 'thor', 'irb'],
    keywords: RUBY_KEYWORDS,
    contains: COMMENT_MODES.concat(IRB_DEFAULT).concat(RUBY_DEFAULT_CONTAINS)
  };
}
},{name:"python",create:/*
Language: Python
Category: common
*/

function(hljs) {
  var PROMPT = {
    className: 'prompt',  begin: /^(>>>|\.\.\.) /
  };
  var STRING = {
    className: 'string',
    contains: [hljs.BACKSLASH_ESCAPE],
    variants: [
      {
        begin: /(u|b)?r?'''/, end: /'''/,
        contains: [PROMPT],
        relevance: 10
      },
      {
        begin: /(u|b)?r?"""/, end: /"""/,
        contains: [PROMPT],
        relevance: 10
      },
      {
        begin: /(u|r|ur)'/, end: /'/,
        relevance: 10
      },
      {
        begin: /(u|r|ur)"/, end: /"/,
        relevance: 10
      },
      {
        begin: /(b|br)'/, end: /'/
      },
      {
        begin: /(b|br)"/, end: /"/
      },
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE
    ]
  };
  var NUMBER = {
    className: 'number', relevance: 0,
    variants: [
      {begin: hljs.BINARY_NUMBER_RE + '[lLjJ]?'},
      {begin: '\\b(0o[0-7]+)[lLjJ]?'},
      {begin: hljs.C_NUMBER_RE + '[lLjJ]?'}
    ]
  };
  var PARAMS = {
    className: 'params',
    begin: /\(/, end: /\)/,
    contains: ['self', PROMPT, NUMBER, STRING]
  };
  return {
    aliases: ['py', 'gyp'],
    keywords: {
      keyword:
        'and elif is global as in if from raise for except finally print import pass return ' +
        'exec else break not with class assert yield try while continue del or def lambda ' +
        'nonlocal|10 None True False',
      built_in:
        'Ellipsis NotImplemented'
    },
    illegal: /(<\/|->|\?)/,
    contains: [
      PROMPT,
      NUMBER,
      STRING,
      hljs.HASH_COMMENT_MODE,
      {
        variants: [
          {className: 'function', beginKeywords: 'def', relevance: 10},
          {className: 'class', beginKeywords: 'class'}
        ],
        end: /:/,
        illegal: /[${=;\n,]/,
        contains: [hljs.UNDERSCORE_TITLE_MODE, PARAMS]
      },
      {
        className: 'decorator',
        begin: /@/, end: /$/
      },
      {
        begin: /\b(print|exec)\(/ // don’t highlight keywords-turned-functions in Python 3
      }
    ]
  };
}
},{name:"bash",create:/*
Language: Bash
Author: vah <vahtenberg@gmail.com>
Contributrors: Benjamin Pannell <contact@sierrasoftworks.com>
Category: common
*/

function(hljs) {
  var VAR = {
    className: 'variable',
    variants: [
      {begin: /\$[\w\d#@][\w\d_]*/},
      {begin: /\$\{(.*?)}/}
    ]
  };
  var QUOTE_STRING = {
    className: 'string',
    begin: /"/, end: /"/,
    contains: [
      hljs.BACKSLASH_ESCAPE,
      VAR,
      {
        className: 'variable',
        begin: /\$\(/, end: /\)/,
        contains: [hljs.BACKSLASH_ESCAPE]
      }
    ]
  };
  var APOS_STRING = {
    className: 'string',
    begin: /'/, end: /'/
  };

  return {
    aliases: ['sh', 'zsh'],
    lexemes: /-?[a-z\.]+/,
    keywords: {
      keyword:
        'if then else elif fi for while in do done case esac function',
      literal:
        'true false',
      built_in:
        // Shell built-ins
        // http://www.gnu.org/software/bash/manual/html_node/Shell-Builtin-Commands.html
        'break cd continue eval exec exit export getopts hash pwd readonly return shift test times ' +
        'trap umask unset ' +
        // Bash built-ins
        'alias bind builtin caller command declare echo enable help let local logout mapfile printf ' +
        'read readarray source type typeset ulimit unalias ' +
        // Shell modifiers
        'set shopt ' +
        // Zsh built-ins
        'autoload bg bindkey bye cap chdir clone comparguments compcall compctl compdescribe compfiles ' +
        'compgroups compquote comptags comptry compvalues dirs disable disown echotc echoti emulate ' +
        'fc fg float functions getcap getln history integer jobs kill limit log noglob popd print ' +
        'pushd pushln rehash sched setcap setopt stat suspend ttyctl unfunction unhash unlimit ' +
        'unsetopt vared wait whence where which zcompile zformat zftp zle zmodload zparseopts zprof ' +
        'zpty zregexparse zsocket zstyle ztcp',
      operator:
        '-ne -eq -lt -gt -f -d -e -s -l -a' // relevance booster
    },
    contains: [
      {
        className: 'shebang',
        begin: /^#![^\n]+sh\s*$/,
        relevance: 10
      },
      {
        className: 'function',
        begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
        returnBegin: true,
        contains: [hljs.inherit(hljs.TITLE_MODE, {begin: /\w[\w\d_]*/})],
        relevance: 0
      },
      hljs.HASH_COMMENT_MODE,
      hljs.NUMBER_MODE,
      QUOTE_STRING,
      APOS_STRING,
      VAR
    ]
  };
}
},{name:"java",create:/*
Language: Java
Author: Vsevolod Solovyov <vsevolod.solovyov@gmail.com>
Category: common, enterprise
*/

function(hljs) {
  var GENERIC_IDENT_RE = hljs.UNDERSCORE_IDENT_RE + '(<' + hljs.UNDERSCORE_IDENT_RE + '>)?';
  var KEYWORDS =
    'false synchronized int abstract float private char boolean static null if const ' +
    'for true while long strictfp finally protected import native final void ' +
    'enum else break transient catch instanceof byte super volatile case assert short ' +
    'package default double public try this switch continue throws protected public private';

  // https://docs.oracle.com/javase/7/docs/technotes/guides/language/underscores-literals.html
  var JAVA_NUMBER_RE = '(\\b(0b[01_]+)|\\b0[xX][a-fA-F0-9_]+|(\\b[\\d_]+(\\.[\\d_]*)?|\\.[\\d_]+)([eE][-+]?\\d+)?)[lLfF]?'; // 0b..., 0x..., 0..., decimal, float
  var JAVA_NUMBER_MODE = {
    className: 'number',
    begin: JAVA_NUMBER_RE,
    relevance: 0
  };

  return {
    aliases: ['jsp'],
    keywords: KEYWORDS,
    illegal: /<\//,
    contains: [
      {
        className: 'javadoc',
        begin: '/\\*\\*', end: '\\*/',
        relevance: 0,
        contains: [{
          className: 'javadoctag', begin: '(^|\\s)@[A-Za-z]+'
        }]
      },
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      {
        className: 'class',
        beginKeywords: 'class interface', end: /[{;=]/, excludeEnd: true,
        keywords: 'class interface',
        illegal: /[:"\[\]]/,
        contains: [
          {beginKeywords: 'extends implements'},
          hljs.UNDERSCORE_TITLE_MODE
        ]
      },
      {
        // Expression keywords prevent 'keyword Name(...)' from being
        // recognized as a function definition
        beginKeywords: 'new throw return',
        relevance: 0
      },
      {
        className: 'function',
        begin: '(' + GENERIC_IDENT_RE + '\\s+)+' + hljs.UNDERSCORE_IDENT_RE + '\\s*\\(', returnBegin: true, end: /[{;=]/,
        excludeEnd: true,
        keywords: KEYWORDS,
        contains: [
          {
            begin: hljs.UNDERSCORE_IDENT_RE + '\\s*\\(', returnBegin: true,
            relevance: 0,
            contains: [hljs.UNDERSCORE_TITLE_MODE]
          },
          {
            className: 'params',
            begin: /\(/, end: /\)/,
            keywords: KEYWORDS,
            relevance: 0,
            contains: [
              hljs.APOS_STRING_MODE,
              hljs.QUOTE_STRING_MODE,
              hljs.C_NUMBER_MODE,
              hljs.C_BLOCK_COMMENT_MODE
            ]
          },
          hljs.C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE
        ]
      },
      JAVA_NUMBER_MODE,
      {
        className: 'annotation', begin: '@[A-Za-z]+'
      }
    ]
  };
}
},{name:"php",create:/*
Language: PHP
Author: Victor Karamzin <Victor.Karamzin@enterra-inc.com>
Contributors: Evgeny Stepanischev <imbolk@gmail.com>, Ivan Sagalaev <maniac@softwaremaniacs.org>
Category: common
*/

function(hljs) {
  var VARIABLE = {
    className: 'variable', begin: '\\$+[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*'
  };
  var PREPROCESSOR = {
    className: 'preprocessor', begin: /<\?(php)?|\?>/
  };
  var STRING = {
    className: 'string',
    contains: [hljs.BACKSLASH_ESCAPE, PREPROCESSOR],
    variants: [
      {
        begin: 'b"', end: '"'
      },
      {
        begin: 'b\'', end: '\''
      },
      hljs.inherit(hljs.APOS_STRING_MODE, {illegal: null}),
      hljs.inherit(hljs.QUOTE_STRING_MODE, {illegal: null})
    ]
  };
  var NUMBER = {variants: [hljs.BINARY_NUMBER_MODE, hljs.C_NUMBER_MODE]};
  return {
    aliases: ['php3', 'php4', 'php5', 'php6'],
    case_insensitive: true,
    keywords:
      'and include_once list abstract global private echo interface as static endswitch ' +
      'array null if endwhile or const for endforeach self var while isset public ' +
      'protected exit foreach throw elseif include __FILE__ empty require_once do xor ' +
      'return parent clone use __CLASS__ __LINE__ else break print eval new ' +
      'catch __METHOD__ case exception default die require __FUNCTION__ ' +
      'enddeclare final try switch continue endfor endif declare unset true false ' +
      'trait goto instanceof insteadof __DIR__ __NAMESPACE__ ' +
      'yield finally',
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.HASH_COMMENT_MODE,
      hljs.COMMENT(
        '/\\*',
        '\\*/',
        {
          contains: [
            {
              className: 'phpdoc',
              begin: '\\s@[A-Za-z]+'
            },
            PREPROCESSOR
          ]
        }
      ),
      hljs.COMMENT(
        '__halt_compiler.+?;',
        false,
        {
          endsWithParent: true,
          keywords: '__halt_compiler',
          lexemes: hljs.UNDERSCORE_IDENT_RE
        }
      ),
      {
        className: 'string',
        begin: '<<<[\'"]?\\w+[\'"]?$', end: '^\\w+;',
        contains: [hljs.BACKSLASH_ESCAPE]
      },
      PREPROCESSOR,
      VARIABLE,
      {
        // swallow composed identifiers to avoid parsing them as keywords
        begin: /(::|->)+[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/
      },
      {
        className: 'function',
        beginKeywords: 'function', end: /[;{]/, excludeEnd: true,
        illegal: '\\$|\\[|%',
        contains: [
          hljs.UNDERSCORE_TITLE_MODE,
          {
            className: 'params',
            begin: '\\(', end: '\\)',
            contains: [
              'self',
              VARIABLE,
              hljs.C_BLOCK_COMMENT_MODE,
              STRING,
              NUMBER
            ]
          }
        ]
      },
      {
        className: 'class',
        beginKeywords: 'class interface', end: '{', excludeEnd: true,
        illegal: /[:\(\$"]/,
        contains: [
          {beginKeywords: 'extends implements'},
          hljs.UNDERSCORE_TITLE_MODE
        ]
      },
      {
        beginKeywords: 'namespace', end: ';',
        illegal: /[\.']/,
        contains: [hljs.UNDERSCORE_TITLE_MODE]
      },
      {
        beginKeywords: 'use', end: ';',
        contains: [hljs.UNDERSCORE_TITLE_MODE]
      },
      {
        begin: '=>' // No markup, just a relevance booster
      },
      STRING,
      NUMBER
    ]
  };
}
},{name:"perl",create:/*
Language: Perl
Author: Peter Leonov <gojpeg@yandex.ru>
Category: common
*/

function(hljs) {
  var PERL_KEYWORDS = 'getpwent getservent quotemeta msgrcv scalar kill dbmclose undef lc ' +
    'ma syswrite tr send umask sysopen shmwrite vec qx utime local oct semctl localtime ' +
    'readpipe do return format read sprintf dbmopen pop getpgrp not getpwnam rewinddir qq' +
    'fileno qw endprotoent wait sethostent bless s|0 opendir continue each sleep endgrent ' +
    'shutdown dump chomp connect getsockname die socketpair close flock exists index shmget' +
    'sub for endpwent redo lstat msgctl setpgrp abs exit select print ref gethostbyaddr ' +
    'unshift fcntl syscall goto getnetbyaddr join gmtime symlink semget splice x|0 ' +
    'getpeername recv log setsockopt cos last reverse gethostbyname getgrnam study formline ' +
    'endhostent times chop length gethostent getnetent pack getprotoent getservbyname rand ' +
    'mkdir pos chmod y|0 substr endnetent printf next open msgsnd readdir use unlink ' +
    'getsockopt getpriority rindex wantarray hex system getservbyport endservent int chr ' +
    'untie rmdir prototype tell listen fork shmread ucfirst setprotoent else sysseek link ' +
    'getgrgid shmctl waitpid unpack getnetbyname reset chdir grep split require caller ' +
    'lcfirst until warn while values shift telldir getpwuid my getprotobynumber delete and ' +
    'sort uc defined srand accept package seekdir getprotobyname semop our rename seek if q|0 ' +
    'chroot sysread setpwent no crypt getc chown sqrt write setnetent setpriority foreach ' +
    'tie sin msgget map stat getlogin unless elsif truncate exec keys glob tied closedir' +
    'ioctl socket readlink eval xor readline binmode setservent eof ord bind alarm pipe ' +
    'atan2 getgrent exp time push setgrent gt lt or ne m|0 break given say state when';
  var SUBST = {
    className: 'subst',
    begin: '[$@]\\{', end: '\\}',
    keywords: PERL_KEYWORDS
  };
  var METHOD = {
    begin: '->{', end: '}'
    // contains defined later
  };
  var VAR = {
    className: 'variable',
    variants: [
      {begin: /\$\d/},
      {begin: /[\$%@](\^\w\b|#\w+(::\w+)*|{\w+}|\w+(::\w*)*)/},
      {begin: /[\$%@][^\s\w{]/, relevance: 0}
    ]
  };
  var COMMENT = hljs.COMMENT(
    '^(__END__|__DATA__)',
    '\\n$',
    {
      relevance: 5
    }
  );
  var STRING_CONTAINS = [hljs.BACKSLASH_ESCAPE, SUBST, VAR];
  var PERL_DEFAULT_CONTAINS = [
    VAR,
    hljs.HASH_COMMENT_MODE,
    COMMENT,
    hljs.COMMENT(
      '^\\=\\w',
      '\\=cut',
      {
        endsWithParent: true
      }
    ),
    METHOD,
    {
      className: 'string',
      contains: STRING_CONTAINS,
      variants: [
        {
          begin: 'q[qwxr]?\\s*\\(', end: '\\)',
          relevance: 5
        },
        {
          begin: 'q[qwxr]?\\s*\\[', end: '\\]',
          relevance: 5
        },
        {
          begin: 'q[qwxr]?\\s*\\{', end: '\\}',
          relevance: 5
        },
        {
          begin: 'q[qwxr]?\\s*\\|', end: '\\|',
          relevance: 5
        },
        {
          begin: 'q[qwxr]?\\s*\\<', end: '\\>',
          relevance: 5
        },
        {
          begin: 'qw\\s+q', end: 'q',
          relevance: 5
        },
        {
          begin: '\'', end: '\'',
          contains: [hljs.BACKSLASH_ESCAPE]
        },
        {
          begin: '"', end: '"'
        },
        {
          begin: '`', end: '`',
          contains: [hljs.BACKSLASH_ESCAPE]
        },
        {
          begin: '{\\w+}',
          contains: [],
          relevance: 0
        },
        {
          begin: '\-?\\w+\\s*\\=\\>',
          contains: [],
          relevance: 0
        }
      ]
    },
    {
      className: 'number',
      begin: '(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b',
      relevance: 0
    },
    { // regexp container
      begin: '(\\/\\/|' + hljs.RE_STARTERS_RE + '|\\b(split|return|print|reverse|grep)\\b)\\s*',
      keywords: 'split return print reverse grep',
      relevance: 0,
      contains: [
        hljs.HASH_COMMENT_MODE,
        COMMENT,
        {
          className: 'regexp',
          begin: '(s|tr|y)/(\\\\.|[^/])*/(\\\\.|[^/])*/[a-z]*',
          relevance: 10
        },
        {
          className: 'regexp',
          begin: '(m|qr)?/', end: '/[a-z]*',
          contains: [hljs.BACKSLASH_ESCAPE],
          relevance: 0 // allows empty "//" which is a common comment delimiter in other languages
        }
      ]
    },
    {
      className: 'sub',
      beginKeywords: 'sub', end: '(\\s*\\(.*?\\))?[;{]',
      relevance: 5
    },
    {
      className: 'operator',
      begin: '-\\w\\b',
      relevance: 0
    }
  ];
  SUBST.contains = PERL_DEFAULT_CONTAINS;
  METHOD.contains = PERL_DEFAULT_CONTAINS;

  return {
    aliases: ['pl'],
    keywords: PERL_KEYWORDS,
    contains: PERL_DEFAULT_CONTAINS
  };
}
},{name:"cpp",create:/*
Language: C++
Author: Ivan Sagalaev <maniac@softwaremaniacs.org>
Contributors: Evgeny Stepanischev <imbolk@gmail.com>, Zaven Muradyan <megalivoithos@gmail.com>, Roel Deckers <admin@codingcat.nl>
Category: common, system
*/

function(hljs) {
  var CPP_KEYWORDS = {
    keyword: 'false int float while private char catch export virtual operator sizeof ' +
      'dynamic_cast|10 typedef const_cast|10 const struct for static_cast|10 union namespace ' +
      'unsigned long volatile static protected bool template mutable if public friend ' +
      'do goto auto void enum else break extern using true class asm case typeid ' +
      'short reinterpret_cast|10 default double register explicit signed typename try this ' +
      'switch continue wchar_t inline delete alignof char16_t char32_t constexpr decltype ' +
      'noexcept nullptr static_assert thread_local restrict _Bool complex _Complex _Imaginary ' +
      'intmax_t uintmax_t int8_t uint8_t int16_t uint16_t int32_t uint32_t  int64_t uint64_t ' +
      'int_least8_t uint_least8_t int_least16_t uint_least16_t int_least32_t uint_least32_t ' +
      'int_least64_t uint_least64_t int_fast8_t uint_fast8_t int_fast16_t uint_fast16_t int_fast32_t ' +
      'uint_fast32_t int_fast64_t uint_fast64_t intptr_t uintptr_t atomic_bool atomic_char atomic_schar ' +
      'atomic_uchar atomic_short atomic_ushort atomic_int atomic_uint atomic_long atomic_ulong atomic_llong ' +
      'atomic_ullong atomic_wchar_t atomic_char16_t atomic_char32_t atomic_intmax_t atomic_uintmax_t ' +
      'atomic_intptr_t atomic_uintptr_t atomic_size_t atomic_ptrdiff_t atomic_int_least8_t atomic_int_least16_t ' +
      'atomic_int_least32_t atomic_int_least64_t atomic_uint_least8_t atomic_uint_least16_t atomic_uint_least32_t ' +
      'atomic_uint_least64_t atomic_int_fast8_t atomic_int_fast16_t atomic_int_fast32_t atomic_int_fast64_t ' +
      'atomic_uint_fast8_t atomic_uint_fast16_t atomic_uint_fast32_t atomic_uint_fast64_t',
    built_in: 'std string cin cout cerr clog stringstream istringstream ostringstream ' +
      'auto_ptr deque list queue stack vector map set bitset multiset multimap unordered_set ' +
      'unordered_map unordered_multiset unordered_multimap array shared_ptr abort abs acos ' +
      'asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp ' +
      'fscanf isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper ' +
      'isxdigit tolower toupper labs ldexp log10 log malloc memchr memcmp memcpy memset modf pow ' +
      'printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp ' +
      'strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan ' +
      'vfprintf vprintf vsprintf'
  };
  return {
    aliases: ['c', 'cc', 'h', 'c++', 'h++', 'hpp'],
    keywords: CPP_KEYWORDS,
    illegal: '</',
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.QUOTE_STRING_MODE,
      {
        className: 'string',
        begin: '\'\\\\?.', end: '\'',
        illegal: '.'
      },
      {
        className: 'number',
        begin: '\\b(\\d+(\\.\\d*)?|\\.\\d+)(u|U|l|L|ul|UL|f|F)'
      },
      hljs.C_NUMBER_MODE,
      {
        className: 'preprocessor',
        begin: '#', end: '$',
        keywords: 'if else elif endif define undef warning error line pragma',
        contains: [
          {
            begin: /\\\n/, relevance: 0
          },
          {
            begin: 'include\\s*[<"]', end: '[>"]',
            keywords: 'include',
            illegal: '\\n'
          },
          hljs.C_LINE_COMMENT_MODE
        ]
      },
      {
        begin: '\\b(deque|list|queue|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array)\\s*<', end: '>',
        keywords: CPP_KEYWORDS,
        contains: ['self']
      },
      {
        begin: hljs.IDENT_RE + '::',
        keywords: CPP_KEYWORDS
      },
      {
        // Expression keywords prevent 'keyword Name(...) or else if(...)' from
        // being recognized as a function definition
        beginKeywords: 'new throw return else',
        relevance: 0
      },
      {
        className: 'function',
        begin: '(' + hljs.IDENT_RE + '\\s+)+' + hljs.IDENT_RE + '\\s*\\(', returnBegin: true, end: /[{;=]/,
        excludeEnd: true,
        keywords: CPP_KEYWORDS,
        contains: [
          {
            begin: hljs.IDENT_RE + '\\s*\\(', returnBegin: true,
            contains: [hljs.TITLE_MODE],
            relevance: 0
          },
          {
            className: 'params',
            begin: /\(/, end: /\)/,
            keywords: CPP_KEYWORDS,
            relevance: 0,
            contains: [
              hljs.C_BLOCK_COMMENT_MODE
            ]
          },
          hljs.C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE
        ]
      }
    ]
  };
}
},{name:"objectivec",create:/*
Language: Objective C
Author: Valerii Hiora <valerii.hiora@gmail.com>
Contributors: Angel G. Olloqui <angelgarcia.mail@gmail.com>, Matt Diephouse <matt@diephouse.com>, Andrew Farmer <ahfarmer@gmail.com>
Category: common
*/

function(hljs) {
  var API_CLASS = {
    className: 'built_in',
    begin: '(AV|CA|CF|CG|CI|MK|MP|NS|UI)\\w+',
  };
  var OBJC_KEYWORDS = {
    keyword:
      'int float while char export sizeof typedef const struct for union ' +
      'unsigned long volatile static bool mutable if do return goto void ' +
      'enum else break extern asm case short default double register explicit ' +
      'signed typename this switch continue wchar_t inline readonly assign ' +
      'readwrite self @synchronized id typeof ' +
      'nonatomic super unichar IBOutlet IBAction strong weak copy ' +
      'in out inout bycopy byref oneway __strong __weak __block __autoreleasing ' +
      '@private @protected @public @try @property @end @throw @catch @finally ' +
      '@autoreleasepool @synthesize @dynamic @selector @optional @required',
    literal:
      'false true FALSE TRUE nil YES NO NULL',
    built_in:
      'BOOL dispatch_once_t dispatch_queue_t dispatch_sync dispatch_async dispatch_once'
  };
  var LEXEMES = /[a-zA-Z@][a-zA-Z0-9_]*/;
  var CLASS_KEYWORDS = '@interface @class @protocol @implementation';
  return {
    aliases: ['m', 'mm', 'objc', 'obj-c'],
    keywords: OBJC_KEYWORDS,
    lexemes: LEXEMES,
    illegal: '</',
    contains: [
      API_CLASS,
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.C_NUMBER_MODE,
      hljs.QUOTE_STRING_MODE,
      {
        className: 'string',
        variants: [
          {
            begin: '@"', end: '"',
            illegal: '\\n',
            contains: [hljs.BACKSLASH_ESCAPE]
          },
          {
            begin: '\'', end: '[^\\\\]\'',
            illegal: '[^\\\\][^\']'
          }
        ]
      },
      {
        className: 'preprocessor',
        begin: '#',
        end: '$',
        contains: [
          {
            className: 'title',
            variants: [
              { begin: '\"', end: '\"' },
              { begin: '<', end: '>' }
            ]
          }
        ]
      },
      {
        className: 'class',
        begin: '(' + CLASS_KEYWORDS.split(' ').join('|') + ')\\b', end: '({|$)', excludeEnd: true,
        keywords: CLASS_KEYWORDS, lexemes: LEXEMES,
        contains: [
          hljs.UNDERSCORE_TITLE_MODE
        ]
      },
      {
        className: 'variable',
        begin: '\\.'+hljs.UNDERSCORE_IDENT_RE,
        relevance: 0
      }
    ]
  };
}
},{name:"cs",create:/*
Language: C#
Author: Jason Diamond <jason@diamond.name>
Category: common
*/

function(hljs) {
  var KEYWORDS =
    // Normal keywords.
    'abstract as base bool break byte case catch char checked const continue decimal dynamic ' +
    'default delegate do double else enum event explicit extern false finally fixed float ' +
    'for foreach goto if implicit in int interface internal is lock long null when ' +
    'object operator out override params private protected public readonly ref sbyte ' +
    'sealed short sizeof stackalloc static string struct switch this true try typeof ' +
    'uint ulong unchecked unsafe ushort using virtual volatile void while async ' +
    'protected public private internal ' +
    // Contextual keywords.
    'ascending descending from get group into join let orderby partial select set value var ' +
    'where yield';
  var GENERIC_IDENT_RE = hljs.IDENT_RE + '(<' + hljs.IDENT_RE + '>)?';
  return {
    aliases: ['csharp'],
    keywords: KEYWORDS,
    illegal: /::/,
    contains: [
      hljs.COMMENT(
        '///',
        '$',
        {
          returnBegin: true,
          contains: [
            {
              className: 'xmlDocTag',
              variants: [
                {
                  begin: '///', relevance: 0
                },
                {
                  begin: '<!--|-->'
                },
                {
                  begin: '</?', end: '>'
                }
              ]
            }
          ]
        }
      ),
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      {
        className: 'preprocessor',
        begin: '#', end: '$',
        keywords: 'if else elif endif define undef warning error line region endregion pragma checksum'
      },
      {
        className: 'string',
        begin: '@"', end: '"',
        contains: [{begin: '""'}]
      },
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.C_NUMBER_MODE,
      {
        beginKeywords: 'class namespace interface', end: /[{;=]/,
        illegal: /[^\s:]/,
        contains: [
          hljs.TITLE_MODE,
          hljs.C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE
        ]
      },
      {
        // Expression keywords prevent 'keyword Name(...)' from being
        // recognized as a function definition
        beginKeywords: 'new return throw await',
        relevance: 0
      },
      {
        className: 'function',
        begin: '(' + GENERIC_IDENT_RE + '\\s+)+' + hljs.IDENT_RE + '\\s*\\(', returnBegin: true, end: /[{;=]/,
        excludeEnd: true,
        keywords: KEYWORDS,
        contains: [
          {
            begin: hljs.IDENT_RE + '\\s*\\(', returnBegin: true,
            contains: [hljs.TITLE_MODE],
            relevance: 0
          },
          {
            className: 'params',
            begin: /\(/, end: /\)/,
            keywords: KEYWORDS,
            relevance: 0,
            contains: [
              hljs.APOS_STRING_MODE,
              hljs.QUOTE_STRING_MODE,
              hljs.C_NUMBER_MODE,
              hljs.C_BLOCK_COMMENT_MODE
            ]
          },
          hljs.C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE
        ]
      }
    ]
  };
}
},{name:"sql",create:/*
 Language: SQL
 Contributors: Nikolay Lisienko <info@neor.ru>, Heiko August <post@auge8472.de>, Travis Odom <travis.a.odom@gmail.com>
 Category: common
 */

function(hljs) {
  var COMMENT_MODE = hljs.COMMENT('--', '$');
  return {
    case_insensitive: true,
    illegal: /[<>]/,
    contains: [
      {
        className: 'operator',
        beginKeywords:
          'begin end start commit rollback savepoint lock alter create drop rename call '+
          'delete do handler insert load replace select truncate update set show pragma grant '+
          'merge describe use explain help declare prepare execute deallocate savepoint release '+
          'unlock purge reset change stop analyze cache flush optimize repair kill '+
          'install uninstall checksum restore check backup revoke',
        end: /;/, endsWithParent: true,
        keywords: {
          keyword:
            'abs absolute acos action add adddate addtime aes_decrypt aes_encrypt after aggregate all allocate alter ' +
            'analyze and any are as asc ascii asin assertion at atan atan2 atn2 authorization authors avg backup ' +
            'before begin benchmark between bin binlog bit_and bit_count bit_length bit_or bit_xor both by ' +
            'cache call cascade cascaded case cast catalog ceil ceiling chain change changed char_length ' +
            'character_length charindex charset check checksum checksum_agg choose close coalesce ' +
            'coercibility collate collation collationproperty column columns columns_updated commit compress concat ' +
            'concat_ws concurrent connect connection connection_id consistent constraint constraints continue ' +
            'contributors conv convert convert_tz corresponding cos cot count count_big crc32 create cross cume_dist ' +
            'curdate current current_date current_time current_timestamp current_user cursor curtime data database ' +
            'databases datalength date_add date_format date_sub dateadd datediff datefromparts datename ' +
            'datepart datetime2fromparts datetimeoffsetfromparts day dayname dayofmonth dayofweek dayofyear ' +
            'deallocate declare decode default deferrable deferred degrees delayed delete des_decrypt ' +
            'des_encrypt des_key_file desc describe descriptor diagnostics difference disconnect distinct ' +
            'distinctrow div do domain double drop dumpfile each else elt enclosed encode encrypt end end-exec ' +
            'engine engines eomonth errors escape escaped event eventdata events except exception exec execute ' +
            'exists exp explain export_set extended external extract fast fetch field fields find_in_set ' +
            'first first_value floor flush for force foreign format found found_rows from from_base64 ' +
            'from_days from_unixtime full function get get_format get_lock getdate getutcdate global go goto grant ' +
            'grants greatest group group_concat grouping grouping_id gtid_subset gtid_subtract handler having help ' +
            'hex high_priority hosts hour ident_current ident_incr ident_seed identified identity if ifnull ignore ' +
            'iif ilike immediate in index indicator inet6_aton inet6_ntoa inet_aton inet_ntoa infile initially inner ' +
            'innodb input insert install instr intersect into is is_free_lock is_ipv4 ' +
            'is_ipv4_compat is_ipv4_mapped is_not is_not_null is_used_lock isdate isnull isolation join key kill ' +
            'language last last_day last_insert_id last_value lcase lead leading least leaves left len lenght level ' +
            'like limit lines ln load load_file local localtime localtimestamp locate lock log log10 log2 logfile ' +
            'logs low_priority lower lpad ltrim make_set makedate maketime master master_pos_wait match matched max ' +
            'md5 medium merge microsecond mid min minute mod mode module month monthname mutex name_const names ' +
            'national natural nchar next no no_write_to_binlog not now nullif nvarchar oct ' +
            'octet_length of old_password on only open optimize option optionally or ord order outer outfile output ' +
            'pad parse partial partition password patindex percent_rank percentile_cont percentile_disc period_add ' +
            'period_diff pi plugin position pow power pragma precision prepare preserve primary prior privileges ' +
            'procedure procedure_analyze processlist profile profiles public publishingservername purge quarter ' +
            'query quick quote quotename radians rand read references regexp relative relaylog release ' +
            'release_lock rename repair repeat replace replicate reset restore restrict return returns reverse ' +
            'revoke right rlike rollback rollup round row row_count rows rpad rtrim savepoint schema scroll ' +
            'sec_to_time second section select serializable server session session_user set sha sha1 sha2 share ' +
            'show sign sin size slave sleep smalldatetimefromparts snapshot some soname soundex ' +
            'sounds_like space sql sql_big_result sql_buffer_result sql_cache sql_calc_found_rows sql_no_cache ' +
            'sql_small_result sql_variant_property sqlstate sqrt square start starting status std ' +
            'stddev stddev_pop stddev_samp stdev stdevp stop str str_to_date straight_join strcmp string stuff ' +
            'subdate substr substring subtime subtring_index sum switchoffset sysdate sysdatetime sysdatetimeoffset ' +
            'system_user sysutcdatetime table tables tablespace tan temporary terminated tertiary_weights then time ' +
            'time_format time_to_sec timediff timefromparts timestamp timestampadd timestampdiff timezone_hour ' +
            'timezone_minute to to_base64 to_days to_seconds todatetimeoffset trailing transaction translation ' +
            'trigger trigger_nestlevel triggers trim truncate try_cast try_convert try_parse ucase uncompress ' +
            'uncompressed_length unhex unicode uninstall union unique unix_timestamp unknown unlock update upgrade ' +
            'upped upper usage use user user_resources using utc_date utc_time utc_timestamp uuid uuid_short ' +
            'validate_password_strength value values var var_pop var_samp variables variance varp ' +
            'version view warnings week weekday weekofyear weight_string when whenever where with work write xml ' +
            'xor year yearweek zon',
          literal:
            'true false null',
          built_in:
            'array bigint binary bit blob boolean char character date dec decimal float int integer interval number ' +
            'numeric real serial smallint varchar varying int8 serial8 text'
        },
        contains: [
          {
            className: 'string',
            begin: '\'', end: '\'',
            contains: [hljs.BACKSLASH_ESCAPE, {begin: '\'\''}]
          },
          {
            className: 'string',
            begin: '"', end: '"',
            contains: [hljs.BACKSLASH_ESCAPE, {begin: '""'}]
          },
          {
            className: 'string',
            begin: '`', end: '`',
            contains: [hljs.BACKSLASH_ESCAPE]
          },
          hljs.C_NUMBER_MODE,
          hljs.C_BLOCK_COMMENT_MODE,
          COMMENT_MODE
        ]
      },
      hljs.C_BLOCK_COMMENT_MODE,
      COMMENT_MODE
    ]
  };
}
},{name:"xml",create:/*
Language: HTML, XML
Category: common
*/

function(hljs) {
  var XML_IDENT_RE = '[A-Za-z0-9\\._:-]+';
  var PHP = {
    begin: /<\?(php)?(?!\w)/, end: /\?>/,
    subLanguage: 'php', subLanguageMode: 'continuous'
  };
  var TAG_INTERNALS = {
    endsWithParent: true,
    illegal: /</,
    relevance: 0,
    contains: [
      PHP,
      {
        className: 'attribute',
        begin: XML_IDENT_RE,
        relevance: 0
      },
      {
        begin: '=',
        relevance: 0,
        contains: [
          {
            className: 'value',
            contains: [PHP],
            variants: [
              {begin: /"/, end: /"/},
              {begin: /'/, end: /'/},
              {begin: /[^\s\/>]+/}
            ]
          }
        ]
      }
    ]
  };
  return {
    aliases: ['html', 'xhtml', 'rss', 'atom', 'xsl', 'plist'],
    case_insensitive: true,
    contains: [
      {
        className: 'doctype',
        begin: '<!DOCTYPE', end: '>',
        relevance: 10,
        contains: [{begin: '\\[', end: '\\]'}]
      },
      hljs.COMMENT(
        '<!--',
        '-->',
        {
          relevance: 10
        }
      ),
      {
        className: 'cdata',
        begin: '<\\!\\[CDATA\\[', end: '\\]\\]>',
        relevance: 10
      },
      {
        className: 'tag',
        /*
        The lookahead pattern (?=...) ensures that 'begin' only matches
        '<style' as a single word, followed by a whitespace or an
        ending braket. The '$' is needed for the lexeme to be recognized
        by hljs.subMode() that tests lexemes outside the stream.
        */
        begin: '<style(?=\\s|>|$)', end: '>',
        keywords: {title: 'style'},
        contains: [TAG_INTERNALS],
        starts: {
          end: '</style>', returnEnd: true,
          subLanguage: 'css'
        }
      },
      {
        className: 'tag',
        // See the comment in the <style tag about the lookahead pattern
        begin: '<script(?=\\s|>|$)', end: '>',
        keywords: {title: 'script'},
        contains: [TAG_INTERNALS],
        starts: {
          end: '</script>', returnEnd: true,
          subLanguage: ''
        }
      },
      PHP,
      {
        className: 'pi',
        begin: /<\?\w+/, end: /\?>/,
        relevance: 10
      },
      {
        className: 'tag',
        begin: '</?', end: '/?>',
        contains: [
          {
            className: 'title', begin: /[^ \/><\n\t]+/, relevance: 0
          },
          TAG_INTERNALS
        ]
      }
    ]
  };
}
},{name:"css",create:/*
Language: CSS
Category: common, css
*/

function(hljs) {
  var IDENT_RE = '[a-zA-Z-][a-zA-Z0-9_-]*';
  var FUNCTION = {
    className: 'function',
    begin: IDENT_RE + '\\(',
    returnBegin: true,
    excludeEnd: true,
    end: '\\('
  };
  var RULE = {
    className: 'rule',
    begin: /[A-Z\_\.\-]+\s*:/, returnBegin: true, end: ';', endsWithParent: true,
    contains: [
      {
        className: 'attribute',
        begin: /\S/, end: ':', excludeEnd: true,
        starts: {
          className: 'value',
          endsWithParent: true, excludeEnd: true,
          contains: [
            FUNCTION,
            hljs.CSS_NUMBER_MODE,
            hljs.QUOTE_STRING_MODE,
            hljs.APOS_STRING_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            {
              className: 'hexcolor', begin: '#[0-9A-Fa-f]+'
            },
            {
              className: 'important', begin: '!important'
            }
          ]
        }
      }
    ]
  };

  return {
    case_insensitive: true,
    illegal: /[=\/|']/,
    contains: [
      hljs.C_BLOCK_COMMENT_MODE,
      RULE,
      {
        className: 'id', begin: /\#[A-Za-z0-9_-]+/
      },
      {
        className: 'class', begin: /\.[A-Za-z0-9_-]+/,
        relevance: 0
      },
      {
        className: 'attr_selector',
        begin: /\[/, end: /\]/,
        illegal: '$'
      },
      {
        className: 'pseudo',
        begin: /:(:)?[a-zA-Z0-9\_\-\+\(\)"']+/
      },
      {
        className: 'at_rule',
        begin: '@(font-face|page)',
        lexemes: '[a-z-]+',
        keywords: 'font-face page'
      },
      {
        className: 'at_rule',
        begin: '@', end: '[{;]', // at_rule eating first "{" is a good thing
                                 // because it doesn’t let it to be parsed as
                                 // a rule set but instead drops parser into
                                 // the default mode which is how it should be.
        contains: [
          {
            className: 'keyword',
            begin: /\S+/
          },
          {
            begin: /\s/, endsWithParent: true, excludeEnd: true,
            relevance: 0,
            contains: [
              FUNCTION,
              hljs.APOS_STRING_MODE, hljs.QUOTE_STRING_MODE,
              hljs.CSS_NUMBER_MODE
            ]
          }
        ]
      },
      {
        className: 'tag', begin: IDENT_RE,
        relevance: 0
      },
      {
        className: 'rules',
        begin: '{', end: '}',
        illegal: /\S/,
        relevance: 0,
        contains: [
          hljs.C_BLOCK_COMMENT_MODE,
          RULE,
        ]
      }
    ]
  };
}
},{name:"scala",create:/*
Language: Scala
Author: Jan Berkel <jan.berkel@gmail.com>
Contributors: Erik Osheim <d_m@plastic-idolatry.com>
*/

function(hljs) {

  var ANNOTATION = {
    className: 'annotation', begin: '@[A-Za-z]+'
  };

  var STRING = {
    className: 'string',
    begin: 'u?r?"""', end: '"""',
    relevance: 10
  };

  var SYMBOL = {
    className: 'symbol',
    begin: '\'\\w[\\w\\d_]*(?!\')'
  };

  var TYPE = {
    className: 'type',
    begin: '\\b[A-Z][A-Za-z0-9_]*',
    relevance: 0
  };

  var NAME = {
    className: 'title',
    begin: /[^0-9\n\t "'(),.`{}\[\]:;][^\n\t "'(),.`{}\[\]:;]+|[^0-9\n\t "'(),.`{}\[\]:;=]/,
    relevance: 0
  };

  var CLASS = {
    className: 'class',
    beginKeywords: 'class object trait type',
    end: /[:={\[(\n;]/,
    contains: [{className: 'keyword', beginKeywords: 'extends with', relevance: 10}, NAME]
  };

  var METHOD = {
    className: 'function',
    beginKeywords: 'def val',
    end: /[:={\[(\n;]/,
    contains: [NAME]
  };

  var JAVADOC = {
    className: 'javadoc',
    begin: '/\\*\\*', end: '\\*/',
    contains: [{
      className: 'javadoctag',
      begin: '@[A-Za-z]+'
    }],
    relevance: 10
  };

  return {
    keywords: {
      literal: 'true false null',
      keyword: 'type yield lazy override def with val var sealed abstract private trait object if forSome for while throw finally protected extends import final return else break new catch super class case package default try this match continue throws implicit'
    },
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      STRING,
      hljs.QUOTE_STRING_MODE,
      SYMBOL,
      TYPE,
      METHOD,
      CLASS,
      hljs.C_NUMBER_MODE,
      ANNOTATION
    ]
  };
}
},{name:"coffeescript",create:/*
Language: CoffeeScript
Author: Dmytrii Nagirniak <dnagir@gmail.com>
Contributors: Oleg Efimov <efimovov@gmail.com>, Cédric Néhémie <cedric.nehemie@gmail.com>
Description: CoffeeScript is a programming language that transcompiles to JavaScript. For info about language see http://coffeescript.org/
Category: common, scripting
*/

function(hljs) {
  var KEYWORDS = {
    keyword:
      // JS keywords
      'in if for while finally new do return else break catch instanceof throw try this ' +
      'switch continue typeof delete debugger super ' +
      // Coffee keywords
      'then unless until loop of by when and or is isnt not',
    literal:
      // JS literals
      'true false null undefined ' +
      // Coffee literals
      'yes no on off',
    reserved:
      'case default function var void with const let enum export import native ' +
      '__hasProp __extends __slice __bind __indexOf',
    built_in:
      'npm require console print module global window document'
  };
  var JS_IDENT_RE = '[A-Za-z$_][0-9A-Za-z$_]*';
  var SUBST = {
    className: 'subst',
    begin: /#\{/, end: /}/,
    keywords: KEYWORDS
  };
  var EXPRESSIONS = [
    hljs.BINARY_NUMBER_MODE,
    hljs.inherit(hljs.C_NUMBER_MODE, {starts: {end: '(\\s*/)?', relevance: 0}}), // a number tries to eat the following slash to prevent treating it as a regexp
    {
      className: 'string',
      variants: [
        {
          begin: /'''/, end: /'''/,
          contains: [hljs.BACKSLASH_ESCAPE]
        },
        {
          begin: /'/, end: /'/,
          contains: [hljs.BACKSLASH_ESCAPE]
        },
        {
          begin: /"""/, end: /"""/,
          contains: [hljs.BACKSLASH_ESCAPE, SUBST]
        },
        {
          begin: /"/, end: /"/,
          contains: [hljs.BACKSLASH_ESCAPE, SUBST]
        }
      ]
    },
    {
      className: 'regexp',
      variants: [
        {
          begin: '///', end: '///',
          contains: [SUBST, hljs.HASH_COMMENT_MODE]
        },
        {
          begin: '//[gim]*',
          relevance: 0
        },
        {
          // regex can't start with space to parse x / 2 / 3 as two divisions
          // regex can't start with *, and it supports an "illegal" in the main mode
          begin: /\/(?![ *])(\\\/|.)*?\/[gim]*(?=\W|$)/
        }
      ]
    },
    {
      className: 'property',
      begin: '@' + JS_IDENT_RE
    },
    {
      begin: '`', end: '`',
      excludeBegin: true, excludeEnd: true,
      subLanguage: 'javascript'
    }
  ];
  SUBST.contains = EXPRESSIONS;

  var TITLE = hljs.inherit(hljs.TITLE_MODE, {begin: JS_IDENT_RE});
  var PARAMS_RE = '(\\(.*\\))?\\s*\\B[-=]>';
  var PARAMS = {
    className: 'params',
    begin: '\\([^\\(]', returnBegin: true,
    /* We need another contained nameless mode to not have every nested
    pair of parens to be called "params" */
    contains: [{
      begin: /\(/, end: /\)/,
      keywords: KEYWORDS,
      contains: ['self'].concat(EXPRESSIONS)
    }]
  };

  return {
    aliases: ['coffee', 'cson', 'iced'],
    keywords: KEYWORDS,
    illegal: /\/\*/,
    contains: EXPRESSIONS.concat([
      hljs.COMMENT('###', '###'),
      hljs.HASH_COMMENT_MODE,
      {
        className: 'function',
        begin: '^\\s*' + JS_IDENT_RE + '\\s*=\\s*' + PARAMS_RE, end: '[-=]>',
        returnBegin: true,
        contains: [TITLE, PARAMS]
      },
      {
        // anonymous function start
        begin: /[:\(,=]\s*/,
        relevance: 0,
        contains: [
          {
            className: 'function',
            begin: PARAMS_RE, end: '[-=]>',
            returnBegin: true,
            contains: [PARAMS]
          }
        ]
      },
      {
        className: 'class',
        beginKeywords: 'class',
        end: '$',
        illegal: /[:="\[\]]/,
        contains: [
          {
            beginKeywords: 'extends',
            endsWithParent: true,
            illegal: /[:="\[\]]/,
            contains: [TITLE]
          },
          TITLE
        ]
      },
      {
        className: 'attribute',
        begin: JS_IDENT_RE + ':', end: ':',
        returnBegin: true, returnEnd: true,
        relevance: 0
      }
    ])
  };
}
},{name:"lisp",create:/*
Language: Lisp
Description: Generic lisp syntax
Author: Vasily Polovnyov <vast@whiteants.net>
Category: lisp
*/

function(hljs) {
  var LISP_IDENT_RE = '[a-zA-Z_\\-\\+\\*\\/\\<\\=\\>\\&\\#][a-zA-Z0-9_\\-\\+\\*\\/\\<\\=\\>\\&\\#!]*';
  var MEC_RE = '\\|[^]*?\\|';
  var LISP_SIMPLE_NUMBER_RE = '(\\-|\\+)?\\d+(\\.\\d+|\\/\\d+)?((d|e|f|l|s|D|E|F|L|S)(\\+|\\-)?\\d+)?';
  var SHEBANG = {
    className: 'shebang',
    begin: '^#!', end: '$'
  };
  var LITERAL = {
    className: 'literal',
    begin: '\\b(t{1}|nil)\\b'
  };
  var NUMBER = {
    className: 'number',
    variants: [
      {begin: LISP_SIMPLE_NUMBER_RE, relevance: 0},
      {begin: '#(b|B)[0-1]+(/[0-1]+)?'},
      {begin: '#(o|O)[0-7]+(/[0-7]+)?'},
      {begin: '#(x|X)[0-9a-fA-F]+(/[0-9a-fA-F]+)?'},
      {begin: '#(c|C)\\(' + LISP_SIMPLE_NUMBER_RE + ' +' + LISP_SIMPLE_NUMBER_RE, end: '\\)'}
    ]
  };
  var STRING = hljs.inherit(hljs.QUOTE_STRING_MODE, {illegal: null});
  var COMMENT = hljs.COMMENT(
    ';', '$',
    {
      relevance: 0
    }
  );
  var VARIABLE = {
    className: 'variable',
    begin: '\\*', end: '\\*'
  };
  var KEYWORD = {
    className: 'keyword',
    begin: '[:&]' + LISP_IDENT_RE
  };
  var IDENT = {
    begin: LISP_IDENT_RE,
    relevance: 0
  };
  var MEC = {
    begin: MEC_RE
  };
  var QUOTED_LIST = {
    begin: '\\(', end: '\\)',
    contains: ['self', LITERAL, STRING, NUMBER, IDENT]
  };
  var QUOTED = {
    className: 'quoted',
    contains: [NUMBER, STRING, VARIABLE, KEYWORD, QUOTED_LIST, IDENT],
    variants: [
      {
        begin: '[\'`]\\(', end: '\\)'
      },
      {
        begin: '\\(quote ', end: '\\)',
        keywords: 'quote'
      },
      {
        begin: '\'' + MEC_RE
      }
    ]
  };
  var QUOTED_ATOM = {
    className: 'quoted',
    variants: [
      {begin: '\'' + LISP_IDENT_RE},
      {begin: '#\'' + LISP_IDENT_RE + '(::' + LISP_IDENT_RE + ')*'}
    ]
  };
  var LIST = {
    className: 'list',
    begin: '\\(\\s*', end: '\\)'
  };
  var BODY = {
    endsWithParent: true,
    relevance: 0
  };
  LIST.contains = [
    {
      className: 'keyword',
      variants: [
        {begin: LISP_IDENT_RE},
        {begin: MEC_RE}
      ]
    },
    BODY
  ];
  BODY.contains = [QUOTED, QUOTED_ATOM, LIST, LITERAL, NUMBER, STRING, COMMENT, VARIABLE, KEYWORD, MEC, IDENT];

  return {
    illegal: /\S/,
    contains: [
      NUMBER,
      SHEBANG,
      LITERAL,
      STRING,
      COMMENT,
      QUOTED,
      QUOTED_ATOM,
      LIST,
      IDENT
    ]
  };
}
},{name:"clojure",create:/*
Language: Clojure
Description: Clojure syntax (based on lisp.js)
Author: mfornos
Category: lisp
*/

function(hljs) {
  var keywords = {
    built_in:
      // Clojure keywords
      'def cond apply if-not if-let if not not= = < > <= >= == + / * - rem '+
      'quot neg? pos? delay? symbol? keyword? true? false? integer? empty? coll? list? '+
      'set? ifn? fn? associative? sequential? sorted? counted? reversible? number? decimal? '+
      'class? distinct? isa? float? rational? reduced? ratio? odd? even? char? seq? vector? '+
      'string? map? nil? contains? zero? instance? not-every? not-any? libspec? -> ->> .. . '+
      'inc compare do dotimes mapcat take remove take-while drop letfn drop-last take-last '+
      'drop-while while intern condp case reduced cycle split-at split-with repeat replicate '+
      'iterate range merge zipmap declare line-seq sort comparator sort-by dorun doall nthnext '+
      'nthrest partition eval doseq await await-for let agent atom send send-off release-pending-sends '+
      'add-watch mapv filterv remove-watch agent-error restart-agent set-error-handler error-handler '+
      'set-error-mode! error-mode shutdown-agents quote var fn loop recur throw try monitor-enter '+
      'monitor-exit defmacro defn defn- macroexpand macroexpand-1 for dosync and or '+
      'when when-not when-let comp juxt partial sequence memoize constantly complement identity assert '+
      'peek pop doto proxy defstruct first rest cons defprotocol cast coll deftype defrecord last butlast '+
      'sigs reify second ffirst fnext nfirst nnext defmulti defmethod meta with-meta ns in-ns create-ns import '+
      'refer keys select-keys vals key val rseq name namespace promise into transient persistent! conj! '+
      'assoc! dissoc! pop! disj! use class type num float double short byte boolean bigint biginteger '+
      'bigdec print-method print-dup throw-if printf format load compile get-in update-in pr pr-on newline '+
      'flush read slurp read-line subvec with-open memfn time re-find re-groups rand-int rand mod locking '+
      'assert-valid-fdecl alias resolve ref deref refset swap! reset! set-validator! compare-and-set! alter-meta! '+
      'reset-meta! commute get-validator alter ref-set ref-history-count ref-min-history ref-max-history ensure sync io! '+
      'new next conj set! to-array future future-call into-array aset gen-class reduce map filter find empty '+
      'hash-map hash-set sorted-map sorted-map-by sorted-set sorted-set-by vec vector seq flatten reverse assoc dissoc list '+
      'disj get union difference intersection extend extend-type extend-protocol int nth delay count concat chunk chunk-buffer '+
      'chunk-append chunk-first chunk-rest max min dec unchecked-inc-int unchecked-inc unchecked-dec-inc unchecked-dec unchecked-negate '+
      'unchecked-add-int unchecked-add unchecked-subtract-int unchecked-subtract chunk-next chunk-cons chunked-seq? prn vary-meta '+
      'lazy-seq spread list* str find-keyword keyword symbol gensym force rationalize'
   };

  var SYMBOLSTART = 'a-zA-Z_\\-!.?+*=<>&#\'';
  var SYMBOL_RE = '[' + SYMBOLSTART + '][' + SYMBOLSTART + '0-9/;:]*';
  var SIMPLE_NUMBER_RE = '[-+]?\\d+(\\.\\d+)?';

  var SYMBOL = {
    begin: SYMBOL_RE,
    relevance: 0
  };
  var NUMBER = {
    className: 'number', begin: SIMPLE_NUMBER_RE,
    relevance: 0
  };
  var STRING = hljs.inherit(hljs.QUOTE_STRING_MODE, {illegal: null});
  var COMMENT = hljs.COMMENT(
    ';',
    '$',
    {
      relevance: 0
    }
  );
  var LITERAL = {
    className: 'literal',
    begin: /\b(true|false|nil)\b/
  };
  var COLLECTION = {
    className: 'collection',
    begin: '[\\[\\{]', end: '[\\]\\}]'
  };
  var HINT = {
    className: 'comment',
    begin: '\\^' + SYMBOL_RE
  };
  var HINT_COL = hljs.COMMENT('\\^\\{', '\\}');
  var KEY = {
    className: 'attribute',
    begin: '[:]' + SYMBOL_RE
  };
  var LIST = {
    className: 'list',
    begin: '\\(', end: '\\)'
  };
  var BODY = {
    endsWithParent: true,
    relevance: 0
  };
  var NAME = {
    keywords: keywords,
    lexemes: SYMBOL_RE,
    className: 'keyword', begin: SYMBOL_RE,
    starts: BODY
  };
  var DEFAULT_CONTAINS = [LIST, STRING, HINT, HINT_COL, COMMENT, KEY, COLLECTION, NUMBER, LITERAL, SYMBOL];

  LIST.contains = [hljs.COMMENT('comment', ''), NAME, BODY];
  BODY.contains = DEFAULT_CONTAINS;
  COLLECTION.contains = DEFAULT_CONTAINS;

  return {
    aliases: ['clj'],
    illegal: /\S/,
    contains: [LIST, STRING, HINT, HINT_COL, COMMENT, KEY, COLLECTION, NUMBER, LITERAL]
  }
}
},{name:"http",create:/*
Language: HTTP
Description: HTTP request and response headers with automatic body highlighting
Author: Ivan Sagalaev <maniac@softwaremaniacs.org>
Category: common, protocols
*/

function(hljs) {
  return {
    aliases: ['https'],
    illegal: '\\S',
    contains: [
      {
        className: 'status',
        begin: '^HTTP/[0-9\\.]+', end: '$',
        contains: [{className: 'number', begin: '\\b\\d{3}\\b'}]
      },
      {
        className: 'request',
        begin: '^[A-Z]+ (.*?) HTTP/[0-9\\.]+$', returnBegin: true, end: '$',
        contains: [
          {
            className: 'string',
            begin: ' ', end: ' ',
            excludeBegin: true, excludeEnd: true
          }
        ]
      },
      {
        className: 'attribute',
        begin: '^\\w', end: ': ', excludeEnd: true,
        illegal: '\\n|\\s|=',
        starts: {className: 'string', end: '$'}
      },
      {
        begin: '\\n\\n',
        starts: {subLanguage: '', endsWithParent: true}
      }
    ]
  };
}
},{name:"haskell",create:/*
Language: Haskell
Author: Jeremy Hull <sourdrums@gmail.com>
Contributors: Zena Treep <zena.treep@gmail.com>
Category: functional
*/

function(hljs) {
  var COMMENT_MODES = [
    hljs.COMMENT('--', '$'),
    hljs.COMMENT(
      '{-',
      '-}',
      {
        contains: ['self']
      }
    )
  ];

  var PRAGMA = {
    className: 'pragma',
    begin: '{-#', end: '#-}'
  };

  var PREPROCESSOR = {
    className: 'preprocessor',
    begin: '^#', end: '$'
  };

  var CONSTRUCTOR = {
    className: 'type',
    begin: '\\b[A-Z][\\w\']*', // TODO: other constructors (build-in, infix).
    relevance: 0
  };

  var LIST = {
    className: 'container',
    begin: '\\(', end: '\\)',
    illegal: '"',
    contains: [
      PRAGMA,
      PREPROCESSOR,
      {className: 'type', begin: '\\b[A-Z][\\w]*(\\((\\.\\.|,|\\w+)\\))?'},
      hljs.inherit(hljs.TITLE_MODE, {begin: '[_a-z][\\w\']*'})
    ].concat(COMMENT_MODES)
  };

  var RECORD = {
    className: 'container',
    begin: '{', end: '}',
    contains: LIST.contains
  };

  return {
    aliases: ['hs'],
    keywords:
      'let in if then else case of where do module import hiding ' +
      'qualified type data newtype deriving class instance as default ' +
      'infix infixl infixr foreign export ccall stdcall cplusplus ' +
      'jvm dotnet safe unsafe family forall mdo proc rec',
    contains: [

      // Top-level constructions.

      {
        className: 'module',
        begin: '\\bmodule\\b', end: 'where',
        keywords: 'module where',
        contains: [LIST].concat(COMMENT_MODES),
        illegal: '\\W\\.|;'
      },
      {
        className: 'import',
        begin: '\\bimport\\b', end: '$',
        keywords: 'import|0 qualified as hiding',
        contains: [LIST].concat(COMMENT_MODES),
        illegal: '\\W\\.|;'
      },

      {
        className: 'class',
        begin: '^(\\s*)?(class|instance)\\b', end: 'where',
        keywords: 'class family instance where',
        contains: [CONSTRUCTOR, LIST].concat(COMMENT_MODES)
      },
      {
        className: 'typedef',
        begin: '\\b(data|(new)?type)\\b', end: '$',
        keywords: 'data family type newtype deriving',
        contains: [PRAGMA, CONSTRUCTOR, LIST, RECORD].concat(COMMENT_MODES)
      },
      {
        className: 'default',
        beginKeywords: 'default', end: '$',
        contains: [CONSTRUCTOR, LIST].concat(COMMENT_MODES)
      },
      {
        className: 'infix',
        beginKeywords: 'infix infixl infixr', end: '$',
        contains: [hljs.C_NUMBER_MODE].concat(COMMENT_MODES)
      },
      {
        className: 'foreign',
        begin: '\\bforeign\\b', end: '$',
        keywords: 'foreign import export ccall stdcall cplusplus jvm ' +
                  'dotnet safe unsafe',
        contains: [CONSTRUCTOR, hljs.QUOTE_STRING_MODE].concat(COMMENT_MODES)
      },
      {
        className: 'shebang',
        begin: '#!\\/usr\\/bin\\/env\ runhaskell', end: '$'
      },

      // "Whitespaces".

      PRAGMA,
      PREPROCESSOR,

      // Literals and names.

      // TODO: characters.
      hljs.QUOTE_STRING_MODE,
      hljs.C_NUMBER_MODE,
      CONSTRUCTOR,
      hljs.inherit(hljs.TITLE_MODE, {begin: '^[_a-z][\\w\']*'}),

      {begin: '->|<-'} // No markup, relevance booster
    ].concat(COMMENT_MODES)
  };
}
}]
  ;

for (var i = 0; i < languages.length; ++i) {
  hljs.registerLanguage(languages[i].name, languages[i].create);
}

module.exports = {
  styles: {"agate":".hljs-agate{}.hljs-agate .hljs{display:block;overflow-x:auto;padding:.5em;background:#333;color:white;-webkit-text-size-adjust:none;}.hljs-agate .asciidoc .hljs-title,.hljs-agate .hljs-label,.hljs-agate .hljs-tag .hljs-title,.hljs-agate .hljs-prompt,.hljs-agate .http .hljs-request{font-weight:bold;}.hljs-agate .hljs-change,.hljs-agate .hljs-code{font-style:italic;}.hljs-agate .hljs-tag,.hljs-agate .ini .hljs-title{color:#62c8f3;}.hljs-agate .hljs-id,.hljs-agate .hljs-cbracket,.hljs-agate .hljs-tag .hljs-value{color:#ade5fc;}.hljs-agate .hljs-string,.hljs-agate .hljs-bullet{color:#a2fca2;}.hljs-agate .hljs-type,.hljs-agate .hljs-variable,.hljs-agate .hljs-name,.hljs-agate .actionscript .hljs-title,.hljs-agate .aspectj .hljs-annotation,.hljs-agate .aspectj .hljs-title,.hljs-agate .hljs-attribute,.hljs-agate .hljs-change,.hljs-agate .hljs-blockquote,.hljs-agate .hljs-built_in{color:#ffa;}.hljs-agate .hljs-number,.hljs-agate .hljs-hexcolor,.hljs-agate .hljs-link_label,.hljs-agate .hljs-link_reference{color:#d36363;}.hljs-agate .hljs-keyword,.hljs-agate .hljs-literal,.hljs-agate .hljs-constant,.hljs-agate .css .hljs-tag,.hljs-agate .hljs-typename,.hljs-agate .hljs-winutils{color:#fcc28c;}.hljs-agate .hljs-comment,.hljs-agate .hljs-cdata,.hljs-agate .hljs-preprocessor,.hljs-agate .hljs-annotation,.hljs-agate .hljs-decorator,.hljs-agate .hljs-doctype,.hljs-agate .hljs-deletion,.hljs-agate .hljs-shebang,.hljs-agate .apache .hljs-sqbracket,.hljs-agate .tex .hljs-formula,.hljs-agate .hljs-header,.hljs-agate .hljs-horizontal_rule,.hljs-agate .hljs-code,.hljs-agate .hljs-javadoc{color:#888;}.hljs-agate .hljs-regexp,.hljs-agate .hljs-attr_selector{color:#c6b4f0;}.hljs-agate .hljs-important,.hljs-agate .hljs-doctype,.hljs-agate .hljs-pi,.hljs-agate .hljs-chunk,.hljs-agate .actionscript .hljs-type,.hljs-agate .hljs-shebang,.hljs-agate .hljs-pragma,.hljs-agate .http .hljs-attribute{color:#fc9b9b;}.hljs-agate .hljs-deletion{background-color:#fc9b9b;color:#333;}.hljs-agate .hljs-addition{background-color:#a2fca2;color:#333;}.hljs-agate .hljs a,.hljs-agate .hljs-tag .hljs-attribute{color:inherit;}.hljs-agate .hljs a:focus,.hljs-agate .hljs a:hover{color:inherit;text-decoration:underline;}","androidstudio":".hljs-androidstudio{}.hljs-androidstudio .hljs{color:#A9B7C6;background:#282b2e;display:block;overflow-x:auto;padding:0.5em;webkit-text-size-adjust:none;}.hljs-androidstudio .hljs-number{color:#6897BB;}.hljs-androidstudio .hljs-keyword,.hljs-androidstudio .hljs-deletion{color:#CC7832;}.hljs-androidstudio .hljs-javadoc{color:#629755;}.hljs-androidstudio .hljs-comment{color:#808080;}.hljs-androidstudio .hljs-annotation{color:#BBB529;}.hljs-androidstudio .hljs-string,.hljs-androidstudio .hljs-addition{color:#6A8759;}.hljs-androidstudio .hljs-function .hljs-title,.hljs-androidstudio .hljs-change{color:#FFC66D;}.hljs-androidstudio .hljs-tag .hljs-title,.hljs-androidstudio .hljs-doctype{color:#E8BF6A;}.hljs-androidstudio .hljs-tag .hljs-attribute{color:#BABABA;}.hljs-androidstudio .hljs-tag .hljs-value{color:#A5C261;}","arta":".hljs-arta{}.hljs-arta .hljs{display:block;overflow-x:auto;padding:0.5em;background:#222;-webkit-text-size-adjust:none;}.hljs-arta .profile .hljs-header *,.hljs-arta .ini .hljs-title,.hljs-arta .nginx .hljs-title{color:#fff;}.hljs-arta .hljs-comment,.hljs-arta .hljs-javadoc,.hljs-arta .hljs-preprocessor,.hljs-arta .hljs-preprocessor .hljs-title,.hljs-arta .hljs-pragma,.hljs-arta .hljs-shebang,.hljs-arta .profile .hljs-summary,.hljs-arta .diff,.hljs-arta .hljs-pi,.hljs-arta .hljs-doctype,.hljs-arta .hljs-tag,.hljs-arta .css .hljs-rule,.hljs-arta .tex .hljs-special{color:#444;}.hljs-arta .hljs-string,.hljs-arta .hljs-symbol,.hljs-arta .diff .hljs-change,.hljs-arta .hljs-regexp,.hljs-arta .xml .hljs-attribute,.hljs-arta .smalltalk .hljs-char,.hljs-arta .xml .hljs-value,.hljs-arta .ini .hljs-value,.hljs-arta .clojure .hljs-attribute,.hljs-arta .coffeescript .hljs-attribute{color:#ffcc33;}.hljs-arta .hljs-number,.hljs-arta .hljs-addition{color:#00cc66;}.hljs-arta .hljs-built_in,.hljs-arta .hljs-literal,.hljs-arta .hljs-type,.hljs-arta .hljs-typename,.hljs-arta .go .hljs-constant,.hljs-arta .ini .hljs-keyword,.hljs-arta .lua .hljs-title,.hljs-arta .perl .hljs-variable,.hljs-arta .php .hljs-variable,.hljs-arta .mel .hljs-variable,.hljs-arta .django .hljs-variable,.hljs-arta .css .funtion,.hljs-arta .smalltalk .method,.hljs-arta .hljs-hexcolor,.hljs-arta .hljs-important,.hljs-arta .hljs-flow,.hljs-arta .hljs-inheritance,.hljs-arta .hljs-name,.hljs-arta .parser3 .hljs-variable{color:#32aaee;}.hljs-arta .hljs-keyword,.hljs-arta .hljs-tag .hljs-title,.hljs-arta .css .hljs-tag,.hljs-arta .css .hljs-class,.hljs-arta .css .hljs-id,.hljs-arta .css .hljs-pseudo,.hljs-arta .css .hljs-attr_selector,.hljs-arta .hljs-winutils,.hljs-arta .tex .hljs-command,.hljs-arta .hljs-request,.hljs-arta .hljs-status{color:#6644aa;}.hljs-arta .hljs-title,.hljs-arta .ruby .hljs-constant,.hljs-arta .vala .hljs-constant,.hljs-arta .hljs-parent,.hljs-arta .hljs-deletion,.hljs-arta .hljs-template_tag,.hljs-arta .css .hljs-keyword,.hljs-arta .objectivec .hljs-class .hljs-id,.hljs-arta .smalltalk .hljs-class,.hljs-arta .lisp .hljs-keyword,.hljs-arta .apache .hljs-tag,.hljs-arta .nginx .hljs-variable,.hljs-arta .hljs-envvar,.hljs-arta .bash .hljs-variable,.hljs-arta .go .hljs-built_in,.hljs-arta .vbscript .hljs-built_in,.hljs-arta .lua .hljs-built_in,.hljs-arta .rsl .hljs-built_in,.hljs-arta .tail,.hljs-arta .avrasm .hljs-label,.hljs-arta .tex .hljs-formula,.hljs-arta .tex .hljs-formula *{color:#bb1166;}.hljs-arta .hljs-yardoctag,.hljs-arta .hljs-phpdoc,.hljs-arta .hljs-dartdoc,.hljs-arta .profile .hljs-header,.hljs-arta .ini .hljs-title,.hljs-arta .apache .hljs-tag,.hljs-arta .parser3 .hljs-title{font-weight:bold;}.hljs-arta .coffeescript .javascript,.hljs-arta .javascript .xml,.hljs-arta .tex .hljs-formula,.hljs-arta .xml .javascript,.hljs-arta .xml .vbscript,.hljs-arta .xml .css,.hljs-arta .xml .hljs-cdata{opacity:0.6;}.hljs-arta .hljs,.hljs-arta .hljs-subst,.hljs-arta .diff .hljs-chunk,.hljs-arta .css .hljs-value,.hljs-arta .css .hljs-attribute{color:#aaa;}","ascetic":".hljs-ascetic{}.hljs-ascetic .hljs{display:block;overflow-x:auto;padding:0.5em;background:white;color:black;-webkit-text-size-adjust:none;}.hljs-ascetic .hljs-string,.hljs-ascetic .hljs-tag .hljs-value,.hljs-ascetic .hljs-filter .hljs-argument,.hljs-ascetic .hljs-addition,.hljs-ascetic .hljs-change,.hljs-ascetic .hljs-name,.hljs-ascetic .apache .hljs-tag,.hljs-ascetic .apache .hljs-cbracket,.hljs-ascetic .nginx .hljs-built_in,.hljs-ascetic .tex .hljs-formula{color:#888;}.hljs-ascetic .hljs-comment,.hljs-ascetic .hljs-shebang,.hljs-ascetic .hljs-doctype,.hljs-ascetic .hljs-pi,.hljs-ascetic .hljs-javadoc,.hljs-ascetic .hljs-deletion,.hljs-ascetic .apache .hljs-sqbracket{color:#ccc;}.hljs-ascetic .hljs-keyword,.hljs-ascetic .hljs-tag .hljs-title,.hljs-ascetic .ini .hljs-title,.hljs-ascetic .lisp .hljs-title,.hljs-ascetic .http .hljs-title,.hljs-ascetic .nginx .hljs-title,.hljs-ascetic .css .hljs-tag,.hljs-ascetic .hljs-winutils,.hljs-ascetic .hljs-flow,.hljs-ascetic .apache .hljs-tag,.hljs-ascetic .tex .hljs-command,.hljs-ascetic .hljs-request,.hljs-ascetic .hljs-status{font-weight:bold;}","atelier-dune.dark":".hljs-atelier-dune.dark{}.hljs-atelier-dune.dark .hljs-comment{color:#999580;}.hljs-atelier-dune.dark .hljs-variable,.hljs-atelier-dune.dark .hljs-attribute,.hljs-atelier-dune.dark .hljs-tag,.hljs-atelier-dune.dark .hljs-regexp,.hljs-atelier-dune.dark .hljs-name,.hljs-atelier-dune.dark .ruby .hljs-constant,.hljs-atelier-dune.dark .xml .hljs-tag .hljs-title,.hljs-atelier-dune.dark .xml .hljs-pi,.hljs-atelier-dune.dark .xml .hljs-doctype,.hljs-atelier-dune.dark .html .hljs-doctype,.hljs-atelier-dune.dark .css .hljs-id,.hljs-atelier-dune.dark .css .hljs-class,.hljs-atelier-dune.dark .css .hljs-pseudo{color:#d73737;}.hljs-atelier-dune.dark .hljs-number,.hljs-atelier-dune.dark .hljs-preprocessor,.hljs-atelier-dune.dark .hljs-built_in,.hljs-atelier-dune.dark .hljs-literal,.hljs-atelier-dune.dark .hljs-params,.hljs-atelier-dune.dark .hljs-constant{color:#b65611;}.hljs-atelier-dune.dark .ruby .hljs-class .hljs-title,.hljs-atelier-dune.dark .css .hljs-rule .hljs-attribute{color:#ae9513;}.hljs-atelier-dune.dark .hljs-string,.hljs-atelier-dune.dark .hljs-value,.hljs-atelier-dune.dark .hljs-inheritance,.hljs-atelier-dune.dark .hljs-header,.hljs-atelier-dune.dark .ruby .hljs-symbol,.hljs-atelier-dune.dark .xml .hljs-cdata{color:#60ac39;}.hljs-atelier-dune.dark .hljs-title,.hljs-atelier-dune.dark .css .hljs-hexcolor{color:#1fad83;}.hljs-atelier-dune.dark .hljs-function,.hljs-atelier-dune.dark .python .hljs-decorator,.hljs-atelier-dune.dark .python .hljs-title,.hljs-atelier-dune.dark .ruby .hljs-function .hljs-title,.hljs-atelier-dune.dark .ruby .hljs-title .hljs-keyword,.hljs-atelier-dune.dark .perl .hljs-sub,.hljs-atelier-dune.dark .javascript .hljs-title,.hljs-atelier-dune.dark .coffeescript .hljs-title{color:#6684e1;}.hljs-atelier-dune.dark .hljs-keyword,.hljs-atelier-dune.dark .javascript .hljs-function{color:#b854d4;}.hljs-atelier-dune.dark .hljs{display:block;overflow-x:auto;background:#20201d;color:#a6a28c;padding:0.5em;-webkit-text-size-adjust:none;}.hljs-atelier-dune.dark .coffeescript .javascript,.hljs-atelier-dune.dark .javascript .xml,.hljs-atelier-dune.dark .tex .hljs-formula,.hljs-atelier-dune.dark .xml .javascript,.hljs-atelier-dune.dark .xml .vbscript,.hljs-atelier-dune.dark .xml .css,.hljs-atelier-dune.dark .xml .hljs-cdata{opacity:0.5;}","atelier-dune.light":".hljs-atelier-dune.light{}.hljs-atelier-dune.light .hljs-comment{color:#7d7a68;}.hljs-atelier-dune.light .hljs-variable,.hljs-atelier-dune.light .hljs-attribute,.hljs-atelier-dune.light .hljs-tag,.hljs-atelier-dune.light .hljs-regexp,.hljs-atelier-dune.light .hljs-name,.hljs-atelier-dune.light .ruby .hljs-constant,.hljs-atelier-dune.light .xml .hljs-tag .hljs-title,.hljs-atelier-dune.light .xml .hljs-pi,.hljs-atelier-dune.light .xml .hljs-doctype,.hljs-atelier-dune.light .html .hljs-doctype,.hljs-atelier-dune.light .css .hljs-id,.hljs-atelier-dune.light .css .hljs-class,.hljs-atelier-dune.light .css .hljs-pseudo{color:#d73737;}.hljs-atelier-dune.light .hljs-number,.hljs-atelier-dune.light .hljs-preprocessor,.hljs-atelier-dune.light .hljs-built_in,.hljs-atelier-dune.light .hljs-literal,.hljs-atelier-dune.light .hljs-params,.hljs-atelier-dune.light .hljs-constant{color:#b65611;}.hljs-atelier-dune.light .ruby .hljs-class .hljs-title,.hljs-atelier-dune.light .css .hljs-rule .hljs-attribute{color:#ae9513;}.hljs-atelier-dune.light .hljs-string,.hljs-atelier-dune.light .hljs-value,.hljs-atelier-dune.light .hljs-inheritance,.hljs-atelier-dune.light .hljs-header,.hljs-atelier-dune.light .ruby .hljs-symbol,.hljs-atelier-dune.light .xml .hljs-cdata{color:#60ac39;}.hljs-atelier-dune.light .hljs-title,.hljs-atelier-dune.light .css .hljs-hexcolor{color:#1fad83;}.hljs-atelier-dune.light .hljs-function,.hljs-atelier-dune.light .python .hljs-decorator,.hljs-atelier-dune.light .python .hljs-title,.hljs-atelier-dune.light .ruby .hljs-function .hljs-title,.hljs-atelier-dune.light .ruby .hljs-title .hljs-keyword,.hljs-atelier-dune.light .perl .hljs-sub,.hljs-atelier-dune.light .javascript .hljs-title,.hljs-atelier-dune.light .coffeescript .hljs-title{color:#6684e1;}.hljs-atelier-dune.light .hljs-keyword,.hljs-atelier-dune.light .javascript .hljs-function{color:#b854d4;}.hljs-atelier-dune.light .hljs{display:block;overflow-x:auto;background:#fefbec;color:#6e6b5e;padding:0.5em;-webkit-text-size-adjust:none;}.hljs-atelier-dune.light .coffeescript .javascript,.hljs-atelier-dune.light .javascript .xml,.hljs-atelier-dune.light .tex .hljs-formula,.hljs-atelier-dune.light .xml .javascript,.hljs-atelier-dune.light .xml .vbscript,.hljs-atelier-dune.light .xml .css,.hljs-atelier-dune.light .xml .hljs-cdata{opacity:0.5;}","atelier-forest.dark":".hljs-atelier-forest.dark{}.hljs-atelier-forest.dark .hljs-comment{color:#9c9491;}.hljs-atelier-forest.dark .hljs-variable,.hljs-atelier-forest.dark .hljs-attribute,.hljs-atelier-forest.dark .hljs-tag,.hljs-atelier-forest.dark .hljs-regexp,.hljs-atelier-forest.dark .hljs-name,.hljs-atelier-forest.dark .ruby .hljs-constant,.hljs-atelier-forest.dark .xml .hljs-tag .hljs-title,.hljs-atelier-forest.dark .xml .hljs-pi,.hljs-atelier-forest.dark .xml .hljs-doctype,.hljs-atelier-forest.dark .html .hljs-doctype,.hljs-atelier-forest.dark .css .hljs-id,.hljs-atelier-forest.dark .css .hljs-class,.hljs-atelier-forest.dark .css .hljs-pseudo{color:#f22c40;}.hljs-atelier-forest.dark .hljs-number,.hljs-atelier-forest.dark .hljs-preprocessor,.hljs-atelier-forest.dark .hljs-built_in,.hljs-atelier-forest.dark .hljs-literal,.hljs-atelier-forest.dark .hljs-params,.hljs-atelier-forest.dark .hljs-constant{color:#df5320;}.hljs-atelier-forest.dark .ruby .hljs-class .hljs-title,.hljs-atelier-forest.dark .css .hljs-rule .hljs-attribute{color:#c38418;}.hljs-atelier-forest.dark .hljs-string,.hljs-atelier-forest.dark .hljs-value,.hljs-atelier-forest.dark .hljs-inheritance,.hljs-atelier-forest.dark .hljs-header,.hljs-atelier-forest.dark .ruby .hljs-symbol,.hljs-atelier-forest.dark .xml .hljs-cdata{color:#7b9726;}.hljs-atelier-forest.dark .hljs-title,.hljs-atelier-forest.dark .css .hljs-hexcolor{color:#3d97b8;}.hljs-atelier-forest.dark .hljs-function,.hljs-atelier-forest.dark .python .hljs-decorator,.hljs-atelier-forest.dark .python .hljs-title,.hljs-atelier-forest.dark .ruby .hljs-function .hljs-title,.hljs-atelier-forest.dark .ruby .hljs-title .hljs-keyword,.hljs-atelier-forest.dark .perl .hljs-sub,.hljs-atelier-forest.dark .javascript .hljs-title,.hljs-atelier-forest.dark .coffeescript .hljs-title{color:#407ee7;}.hljs-atelier-forest.dark .hljs-keyword,.hljs-atelier-forest.dark .javascript .hljs-function{color:#6666ea;}.hljs-atelier-forest.dark .hljs{display:block;overflow-x:auto;background:#1b1918;color:#a8a19f;padding:0.5em;-webkit-text-size-adjust:none;}.hljs-atelier-forest.dark .coffeescript .javascript,.hljs-atelier-forest.dark .javascript .xml,.hljs-atelier-forest.dark .tex .hljs-formula,.hljs-atelier-forest.dark .xml .javascript,.hljs-atelier-forest.dark .xml .vbscript,.hljs-atelier-forest.dark .xml .css,.hljs-atelier-forest.dark .xml .hljs-cdata{opacity:0.5;}","atelier-forest.light":".hljs-atelier-forest.light{}.hljs-atelier-forest.light .hljs-comment{color:#766e6b;}.hljs-atelier-forest.light .hljs-variable,.hljs-atelier-forest.light .hljs-attribute,.hljs-atelier-forest.light .hljs-tag,.hljs-atelier-forest.light .hljs-regexp,.hljs-atelier-forest.light .hljs-name,.hljs-atelier-forest.light .ruby .hljs-constant,.hljs-atelier-forest.light .xml .hljs-tag .hljs-title,.hljs-atelier-forest.light .xml .hljs-pi,.hljs-atelier-forest.light .xml .hljs-doctype,.hljs-atelier-forest.light .html .hljs-doctype,.hljs-atelier-forest.light .css .hljs-id,.hljs-atelier-forest.light .css .hljs-class,.hljs-atelier-forest.light .css .hljs-pseudo{color:#f22c40;}.hljs-atelier-forest.light .hljs-number,.hljs-atelier-forest.light .hljs-preprocessor,.hljs-atelier-forest.light .hljs-built_in,.hljs-atelier-forest.light .hljs-literal,.hljs-atelier-forest.light .hljs-params,.hljs-atelier-forest.light .hljs-constant{color:#df5320;}.hljs-atelier-forest.light .ruby .hljs-class .hljs-title,.hljs-atelier-forest.light .css .hljs-rule .hljs-attribute{color:#c38418;}.hljs-atelier-forest.light .hljs-string,.hljs-atelier-forest.light .hljs-value,.hljs-atelier-forest.light .hljs-inheritance,.hljs-atelier-forest.light .hljs-header,.hljs-atelier-forest.light .ruby .hljs-symbol,.hljs-atelier-forest.light .xml .hljs-cdata{color:#7b9726;}.hljs-atelier-forest.light .hljs-title,.hljs-atelier-forest.light .css .hljs-hexcolor{color:#3d97b8;}.hljs-atelier-forest.light .hljs-function,.hljs-atelier-forest.light .python .hljs-decorator,.hljs-atelier-forest.light .python .hljs-title,.hljs-atelier-forest.light .ruby .hljs-function .hljs-title,.hljs-atelier-forest.light .ruby .hljs-title .hljs-keyword,.hljs-atelier-forest.light .perl .hljs-sub,.hljs-atelier-forest.light .javascript .hljs-title,.hljs-atelier-forest.light .coffeescript .hljs-title{color:#407ee7;}.hljs-atelier-forest.light .hljs-keyword,.hljs-atelier-forest.light .javascript .hljs-function{color:#6666ea;}.hljs-atelier-forest.light .hljs{display:block;overflow-x:auto;background:#f1efee;color:#68615e;padding:0.5em;-webkit-text-size-adjust:none;}.hljs-atelier-forest.light .coffeescript .javascript,.hljs-atelier-forest.light .javascript .xml,.hljs-atelier-forest.light .tex .hljs-formula,.hljs-atelier-forest.light .xml .javascript,.hljs-atelier-forest.light .xml .vbscript,.hljs-atelier-forest.light .xml .css,.hljs-atelier-forest.light .xml .hljs-cdata{opacity:0.5;}","atelier-heath.dark":".hljs-atelier-heath.dark{}.hljs-atelier-heath.dark .hljs-comment{color:#9e8f9e;}.hljs-atelier-heath.dark .hljs-variable,.hljs-atelier-heath.dark .hljs-attribute,.hljs-atelier-heath.dark .hljs-tag,.hljs-atelier-heath.dark .hljs-regexp,.hljs-atelier-heath.dark .hljs-name,.hljs-atelier-heath.dark .ruby .hljs-constant,.hljs-atelier-heath.dark .xml .hljs-tag .hljs-title,.hljs-atelier-heath.dark .xml .hljs-pi,.hljs-atelier-heath.dark .xml .hljs-doctype,.hljs-atelier-heath.dark .html .hljs-doctype,.hljs-atelier-heath.dark .css .hljs-id,.hljs-atelier-heath.dark .css .hljs-class,.hljs-atelier-heath.dark .css .hljs-pseudo{color:#ca402b;}.hljs-atelier-heath.dark .hljs-number,.hljs-atelier-heath.dark .hljs-preprocessor,.hljs-atelier-heath.dark .hljs-built_in,.hljs-atelier-heath.dark .hljs-literal,.hljs-atelier-heath.dark .hljs-params,.hljs-atelier-heath.dark .hljs-constant{color:#a65926;}.hljs-atelier-heath.dark .ruby .hljs-class .hljs-title,.hljs-atelier-heath.dark .css .hljs-rule .hljs-attribute{color:#bb8a35;}.hljs-atelier-heath.dark .hljs-string,.hljs-atelier-heath.dark .hljs-value,.hljs-atelier-heath.dark .hljs-inheritance,.hljs-atelier-heath.dark .hljs-header,.hljs-atelier-heath.dark .ruby .hljs-symbol,.hljs-atelier-heath.dark .xml .hljs-cdata{color:#918b3b;}.hljs-atelier-heath.dark .hljs-title,.hljs-atelier-heath.dark .css .hljs-hexcolor{color:#159393;}.hljs-atelier-heath.dark .hljs-function,.hljs-atelier-heath.dark .python .hljs-decorator,.hljs-atelier-heath.dark .python .hljs-title,.hljs-atelier-heath.dark .ruby .hljs-function .hljs-title,.hljs-atelier-heath.dark .ruby .hljs-title .hljs-keyword,.hljs-atelier-heath.dark .perl .hljs-sub,.hljs-atelier-heath.dark .javascript .hljs-title,.hljs-atelier-heath.dark .coffeescript .hljs-title{color:#516aec;}.hljs-atelier-heath.dark .hljs-keyword,.hljs-atelier-heath.dark .javascript .hljs-function{color:#7b59c0;}.hljs-atelier-heath.dark .hljs{display:block;overflow-x:auto;background:#1b181b;color:#ab9bab;padding:0.5em;-webkit-text-size-adjust:none;}.hljs-atelier-heath.dark .coffeescript .javascript,.hljs-atelier-heath.dark .javascript .xml,.hljs-atelier-heath.dark .tex .hljs-formula,.hljs-atelier-heath.dark .xml .javascript,.hljs-atelier-heath.dark .xml .vbscript,.hljs-atelier-heath.dark .xml .css,.hljs-atelier-heath.dark .xml .hljs-cdata{opacity:0.5;}","atelier-heath.light":".hljs-atelier-heath.light{}.hljs-atelier-heath.light .hljs-comment{color:#776977;}.hljs-atelier-heath.light .hljs-variable,.hljs-atelier-heath.light .hljs-attribute,.hljs-atelier-heath.light .hljs-tag,.hljs-atelier-heath.light .hljs-regexp,.hljs-atelier-heath.light .hljs-name,.hljs-atelier-heath.light .ruby .hljs-constant,.hljs-atelier-heath.light .xml .hljs-tag .hljs-title,.hljs-atelier-heath.light .xml .hljs-pi,.hljs-atelier-heath.light .xml .hljs-doctype,.hljs-atelier-heath.light .html .hljs-doctype,.hljs-atelier-heath.light .css .hljs-id,.hljs-atelier-heath.light .css .hljs-class,.hljs-atelier-heath.light .css .hljs-pseudo{color:#ca402b;}.hljs-atelier-heath.light .hljs-number,.hljs-atelier-heath.light .hljs-preprocessor,.hljs-atelier-heath.light .hljs-built_in,.hljs-atelier-heath.light .hljs-literal,.hljs-atelier-heath.light .hljs-params,.hljs-atelier-heath.light .hljs-constant{color:#a65926;}.hljs-atelier-heath.light .ruby .hljs-class .hljs-title,.hljs-atelier-heath.light .css .hljs-rule .hljs-attribute{color:#bb8a35;}.hljs-atelier-heath.light .hljs-string,.hljs-atelier-heath.light .hljs-value,.hljs-atelier-heath.light .hljs-inheritance,.hljs-atelier-heath.light .hljs-header,.hljs-atelier-heath.light .ruby .hljs-symbol,.hljs-atelier-heath.light .xml .hljs-cdata{color:#918b3b;}.hljs-atelier-heath.light .hljs-title,.hljs-atelier-heath.light .css .hljs-hexcolor{color:#159393;}.hljs-atelier-heath.light .hljs-function,.hljs-atelier-heath.light .python .hljs-decorator,.hljs-atelier-heath.light .python .hljs-title,.hljs-atelier-heath.light .ruby .hljs-function .hljs-title,.hljs-atelier-heath.light .ruby .hljs-title .hljs-keyword,.hljs-atelier-heath.light .perl .hljs-sub,.hljs-atelier-heath.light .javascript .hljs-title,.hljs-atelier-heath.light .coffeescript .hljs-title{color:#516aec;}.hljs-atelier-heath.light .hljs-keyword,.hljs-atelier-heath.light .javascript .hljs-function{color:#7b59c0;}.hljs-atelier-heath.light .hljs{display:block;overflow-x:auto;background:#f7f3f7;color:#695d69;padding:0.5em;-webkit-text-size-adjust:none;}.hljs-atelier-heath.light .coffeescript .javascript,.hljs-atelier-heath.light .javascript .xml,.hljs-atelier-heath.light .tex .hljs-formula,.hljs-atelier-heath.light .xml .javascript,.hljs-atelier-heath.light .xml .vbscript,.hljs-atelier-heath.light .xml .css,.hljs-atelier-heath.light .xml .hljs-cdata{opacity:0.5;}","atelier-lakeside.dark":".hljs-atelier-lakeside.dark{}.hljs-atelier-lakeside.dark .hljs-comment{color:#7195a8;}.hljs-atelier-lakeside.dark .hljs-variable,.hljs-atelier-lakeside.dark .hljs-attribute,.hljs-atelier-lakeside.dark .hljs-tag,.hljs-atelier-lakeside.dark .hljs-regexp,.hljs-atelier-lakeside.dark .hljs-name,.hljs-atelier-lakeside.dark .ruby .hljs-constant,.hljs-atelier-lakeside.dark .xml .hljs-tag .hljs-title,.hljs-atelier-lakeside.dark .xml .hljs-pi,.hljs-atelier-lakeside.dark .xml .hljs-doctype,.hljs-atelier-lakeside.dark .html .hljs-doctype,.hljs-atelier-lakeside.dark .css .hljs-id,.hljs-atelier-lakeside.dark .css .hljs-class,.hljs-atelier-lakeside.dark .css .hljs-pseudo{color:#d22d72;}.hljs-atelier-lakeside.dark .hljs-number,.hljs-atelier-lakeside.dark .hljs-preprocessor,.hljs-atelier-lakeside.dark .hljs-built_in,.hljs-atelier-lakeside.dark .hljs-literal,.hljs-atelier-lakeside.dark .hljs-params,.hljs-atelier-lakeside.dark .hljs-constant{color:#935c25;}.hljs-atelier-lakeside.dark .ruby .hljs-class .hljs-title,.hljs-atelier-lakeside.dark .css .hljs-rule .hljs-attribute{color:#8a8a0f;}.hljs-atelier-lakeside.dark .hljs-string,.hljs-atelier-lakeside.dark .hljs-value,.hljs-atelier-lakeside.dark .hljs-inheritance,.hljs-atelier-lakeside.dark .hljs-header,.hljs-atelier-lakeside.dark .ruby .hljs-symbol,.hljs-atelier-lakeside.dark .xml .hljs-cdata{color:#568c3b;}.hljs-atelier-lakeside.dark .hljs-title,.hljs-atelier-lakeside.dark .css .hljs-hexcolor{color:#2d8f6f;}.hljs-atelier-lakeside.dark .hljs-function,.hljs-atelier-lakeside.dark .python .hljs-decorator,.hljs-atelier-lakeside.dark .python .hljs-title,.hljs-atelier-lakeside.dark .ruby .hljs-function .hljs-title,.hljs-atelier-lakeside.dark .ruby .hljs-title .hljs-keyword,.hljs-atelier-lakeside.dark .perl .hljs-sub,.hljs-atelier-lakeside.dark .javascript .hljs-title,.hljs-atelier-lakeside.dark .coffeescript .hljs-title{color:#257fad;}.hljs-atelier-lakeside.dark .hljs-keyword,.hljs-atelier-lakeside.dark .javascript .hljs-function{color:#6b6bb8;}.hljs-atelier-lakeside.dark .hljs{display:block;overflow-x:auto;background:#161b1d;color:#7ea2b4;padding:0.5em;-webkit-text-size-adjust:none;}.hljs-atelier-lakeside.dark .coffeescript .javascript,.hljs-atelier-lakeside.dark .javascript .xml,.hljs-atelier-lakeside.dark .tex .hljs-formula,.hljs-atelier-lakeside.dark .xml .javascript,.hljs-atelier-lakeside.dark .xml .vbscript,.hljs-atelier-lakeside.dark .xml .css,.hljs-atelier-lakeside.dark .xml .hljs-cdata{opacity:0.5;}","atelier-lakeside.light":".hljs-atelier-lakeside.light{}.hljs-atelier-lakeside.light .hljs-comment{color:#5a7b8c;}.hljs-atelier-lakeside.light .hljs-variable,.hljs-atelier-lakeside.light .hljs-attribute,.hljs-atelier-lakeside.light .hljs-tag,.hljs-atelier-lakeside.light .hljs-regexp,.hljs-atelier-lakeside.light .hljs-name,.hljs-atelier-lakeside.light .ruby .hljs-constant,.hljs-atelier-lakeside.light .xml .hljs-tag .hljs-title,.hljs-atelier-lakeside.light .xml .hljs-pi,.hljs-atelier-lakeside.light .xml .hljs-doctype,.hljs-atelier-lakeside.light .html .hljs-doctype,.hljs-atelier-lakeside.light .css .hljs-id,.hljs-atelier-lakeside.light .css .hljs-class,.hljs-atelier-lakeside.light .css .hljs-pseudo{color:#d22d72;}.hljs-atelier-lakeside.light .hljs-number,.hljs-atelier-lakeside.light .hljs-preprocessor,.hljs-atelier-lakeside.light .hljs-built_in,.hljs-atelier-lakeside.light .hljs-literal,.hljs-atelier-lakeside.light .hljs-params,.hljs-atelier-lakeside.light .hljs-constant{color:#935c25;}.hljs-atelier-lakeside.light .ruby .hljs-class .hljs-title,.hljs-atelier-lakeside.light .css .hljs-rule .hljs-attribute{color:#8a8a0f;}.hljs-atelier-lakeside.light .hljs-string,.hljs-atelier-lakeside.light .hljs-value,.hljs-atelier-lakeside.light .hljs-inheritance,.hljs-atelier-lakeside.light .hljs-header,.hljs-atelier-lakeside.light .ruby .hljs-symbol,.hljs-atelier-lakeside.light .xml .hljs-cdata{color:#568c3b;}.hljs-atelier-lakeside.light .hljs-title,.hljs-atelier-lakeside.light .css .hljs-hexcolor{color:#2d8f6f;}.hljs-atelier-lakeside.light .hljs-function,.hljs-atelier-lakeside.light .python .hljs-decorator,.hljs-atelier-lakeside.light .python .hljs-title,.hljs-atelier-lakeside.light .ruby .hljs-function .hljs-title,.hljs-atelier-lakeside.light .ruby .hljs-title .hljs-keyword,.hljs-atelier-lakeside.light .perl .hljs-sub,.hljs-atelier-lakeside.light .javascript .hljs-title,.hljs-atelier-lakeside.light .coffeescript .hljs-title{color:#257fad;}.hljs-atelier-lakeside.light .hljs-keyword,.hljs-atelier-lakeside.light .javascript .hljs-function{color:#6b6bb8;}.hljs-atelier-lakeside.light .hljs{display:block;overflow-x:auto;background:#ebf8ff;color:#516d7b;padding:0.5em;-webkit-text-size-adjust:none;}.hljs-atelier-lakeside.light .coffeescript .javascript,.hljs-atelier-lakeside.light .javascript .xml,.hljs-atelier-lakeside.light .tex .hljs-formula,.hljs-atelier-lakeside.light .xml .javascript,.hljs-atelier-lakeside.light .xml .vbscript,.hljs-atelier-lakeside.light .xml .css,.hljs-atelier-lakeside.light .xml .hljs-cdata{opacity:0.5;}","atelier-seaside.dark":".hljs-atelier-seaside.dark{}.hljs-atelier-seaside.dark .hljs-comment{color:#809980;}.hljs-atelier-seaside.dark .hljs-variable,.hljs-atelier-seaside.dark .hljs-attribute,.hljs-atelier-seaside.dark .hljs-tag,.hljs-atelier-seaside.dark .hljs-regexp,.hljs-atelier-seaside.dark .hljs-name,.hljs-atelier-seaside.dark .ruby .hljs-constant,.hljs-atelier-seaside.dark .xml .hljs-tag .hljs-title,.hljs-atelier-seaside.dark .xml .hljs-pi,.hljs-atelier-seaside.dark .xml .hljs-doctype,.hljs-atelier-seaside.dark .html .hljs-doctype,.hljs-atelier-seaside.dark .css .hljs-id,.hljs-atelier-seaside.dark .css .hljs-class,.hljs-atelier-seaside.dark .css .hljs-pseudo{color:#e6193c;}.hljs-atelier-seaside.dark .hljs-number,.hljs-atelier-seaside.dark .hljs-preprocessor,.hljs-atelier-seaside.dark .hljs-built_in,.hljs-atelier-seaside.dark .hljs-literal,.hljs-atelier-seaside.dark .hljs-params,.hljs-atelier-seaside.dark .hljs-constant{color:#87711d;}.hljs-atelier-seaside.dark .ruby .hljs-class .hljs-title,.hljs-atelier-seaside.dark .css .hljs-rule .hljs-attribute{color:#98981b;}.hljs-atelier-seaside.dark .hljs-string,.hljs-atelier-seaside.dark .hljs-value,.hljs-atelier-seaside.dark .hljs-inheritance,.hljs-atelier-seaside.dark .hljs-header,.hljs-atelier-seaside.dark .ruby .hljs-symbol,.hljs-atelier-seaside.dark .xml .hljs-cdata{color:#29a329;}.hljs-atelier-seaside.dark .hljs-title,.hljs-atelier-seaside.dark .css .hljs-hexcolor{color:#1999b3;}.hljs-atelier-seaside.dark .hljs-function,.hljs-atelier-seaside.dark .python .hljs-decorator,.hljs-atelier-seaside.dark .python .hljs-title,.hljs-atelier-seaside.dark .ruby .hljs-function .hljs-title,.hljs-atelier-seaside.dark .ruby .hljs-title .hljs-keyword,.hljs-atelier-seaside.dark .perl .hljs-sub,.hljs-atelier-seaside.dark .javascript .hljs-title,.hljs-atelier-seaside.dark .coffeescript .hljs-title{color:#3d62f5;}.hljs-atelier-seaside.dark .hljs-keyword,.hljs-atelier-seaside.dark .javascript .hljs-function{color:#ad2bee;}.hljs-atelier-seaside.dark .hljs{display:block;overflow-x:auto;background:#131513;color:#8ca68c;padding:0.5em;-webkit-text-size-adjust:none;}.hljs-atelier-seaside.dark .coffeescript .javascript,.hljs-atelier-seaside.dark .javascript .xml,.hljs-atelier-seaside.dark .tex .hljs-formula,.hljs-atelier-seaside.dark .xml .javascript,.hljs-atelier-seaside.dark .xml .vbscript,.hljs-atelier-seaside.dark .xml .css,.hljs-atelier-seaside.dark .xml .hljs-cdata{opacity:0.5;}","atelier-seaside.light":".hljs-atelier-seaside.light{}.hljs-atelier-seaside.light .hljs-comment{color:#687d68;}.hljs-atelier-seaside.light .hljs-variable,.hljs-atelier-seaside.light .hljs-attribute,.hljs-atelier-seaside.light .hljs-tag,.hljs-atelier-seaside.light .hljs-regexp,.hljs-atelier-seaside.light .hljs-name,.hljs-atelier-seaside.light .ruby .hljs-constant,.hljs-atelier-seaside.light .xml .hljs-tag .hljs-title,.hljs-atelier-seaside.light .xml .hljs-pi,.hljs-atelier-seaside.light .xml .hljs-doctype,.hljs-atelier-seaside.light .html .hljs-doctype,.hljs-atelier-seaside.light .css .hljs-id,.hljs-atelier-seaside.light .css .hljs-class,.hljs-atelier-seaside.light .css .hljs-pseudo{color:#e6193c;}.hljs-atelier-seaside.light .hljs-number,.hljs-atelier-seaside.light .hljs-preprocessor,.hljs-atelier-seaside.light .hljs-built_in,.hljs-atelier-seaside.light .hljs-literal,.hljs-atelier-seaside.light .hljs-params,.hljs-atelier-seaside.light .hljs-constant{color:#87711d;}.hljs-atelier-seaside.light .ruby .hljs-class .hljs-title,.hljs-atelier-seaside.light .css .hljs-rule .hljs-attribute{color:#98981b;}.hljs-atelier-seaside.light .hljs-string,.hljs-atelier-seaside.light .hljs-value,.hljs-atelier-seaside.light .hljs-inheritance,.hljs-atelier-seaside.light .hljs-header,.hljs-atelier-seaside.light .ruby .hljs-symbol,.hljs-atelier-seaside.light .xml .hljs-cdata{color:#29a329;}.hljs-atelier-seaside.light .hljs-title,.hljs-atelier-seaside.light .css .hljs-hexcolor{color:#1999b3;}.hljs-atelier-seaside.light .hljs-function,.hljs-atelier-seaside.light .python .hljs-decorator,.hljs-atelier-seaside.light .python .hljs-title,.hljs-atelier-seaside.light .ruby .hljs-function .hljs-title,.hljs-atelier-seaside.light .ruby .hljs-title .hljs-keyword,.hljs-atelier-seaside.light .perl .hljs-sub,.hljs-atelier-seaside.light .javascript .hljs-title,.hljs-atelier-seaside.light .coffeescript .hljs-title{color:#3d62f5;}.hljs-atelier-seaside.light .hljs-keyword,.hljs-atelier-seaside.light .javascript .hljs-function{color:#ad2bee;}.hljs-atelier-seaside.light .hljs{display:block;overflow-x:auto;background:#f4fbf4;color:#5e6e5e;padding:0.5em;-webkit-text-size-adjust:none;}.hljs-atelier-seaside.light .coffeescript .javascript,.hljs-atelier-seaside.light .javascript .xml,.hljs-atelier-seaside.light .tex .hljs-formula,.hljs-atelier-seaside.light .xml .javascript,.hljs-atelier-seaside.light .xml .vbscript,.hljs-atelier-seaside.light .xml .css,.hljs-atelier-seaside.light .xml .hljs-cdata{opacity:0.5;}","atelier-sulphurpool.dark":".hljs-atelier-sulphurpool.dark{}.hljs-atelier-sulphurpool.dark .hljs-comment{color:#898ea4;}.hljs-atelier-sulphurpool.dark .hljs-variable,.hljs-atelier-sulphurpool.dark .hljs-attribute,.hljs-atelier-sulphurpool.dark .hljs-tag,.hljs-atelier-sulphurpool.dark .hljs-regexp,.hljs-atelier-sulphurpool.dark .hljs-name,.hljs-atelier-sulphurpool.dark .ruby .hljs-constant,.hljs-atelier-sulphurpool.dark .xml .hljs-tag .hljs-title,.hljs-atelier-sulphurpool.dark .xml .hljs-pi,.hljs-atelier-sulphurpool.dark .xml .hljs-doctype,.hljs-atelier-sulphurpool.dark .html .hljs-doctype,.hljs-atelier-sulphurpool.dark .css .hljs-id,.hljs-atelier-sulphurpool.dark .css .hljs-class,.hljs-atelier-sulphurpool.dark .css .hljs-pseudo{color:#c94922;}.hljs-atelier-sulphurpool.dark .hljs-number,.hljs-atelier-sulphurpool.dark .hljs-preprocessor,.hljs-atelier-sulphurpool.dark .hljs-built_in,.hljs-atelier-sulphurpool.dark .hljs-literal,.hljs-atelier-sulphurpool.dark .hljs-params,.hljs-atelier-sulphurpool.dark .hljs-constant{color:#c76b29;}.hljs-atelier-sulphurpool.dark .ruby .hljs-class .hljs-title,.hljs-atelier-sulphurpool.dark .css .hljs-rule .hljs-attribute{color:#c08b30;}.hljs-atelier-sulphurpool.dark .hljs-string,.hljs-atelier-sulphurpool.dark .hljs-value,.hljs-atelier-sulphurpool.dark .hljs-inheritance,.hljs-atelier-sulphurpool.dark .hljs-header,.hljs-atelier-sulphurpool.dark .ruby .hljs-symbol,.hljs-atelier-sulphurpool.dark .xml .hljs-cdata{color:#ac9739;}.hljs-atelier-sulphurpool.dark .hljs-title,.hljs-atelier-sulphurpool.dark .css .hljs-hexcolor{color:#22a2c9;}.hljs-atelier-sulphurpool.dark .hljs-function,.hljs-atelier-sulphurpool.dark .python .hljs-decorator,.hljs-atelier-sulphurpool.dark .python .hljs-title,.hljs-atelier-sulphurpool.dark .ruby .hljs-function .hljs-title,.hljs-atelier-sulphurpool.dark .ruby .hljs-title .hljs-keyword,.hljs-atelier-sulphurpool.dark .perl .hljs-sub,.hljs-atelier-sulphurpool.dark .javascript .hljs-title,.hljs-atelier-sulphurpool.dark .coffeescript .hljs-title{color:#3d8fd1;}.hljs-atelier-sulphurpool.dark .hljs-keyword,.hljs-atelier-sulphurpool.dark .javascript .hljs-function{color:#6679cc;}.hljs-atelier-sulphurpool.dark .hljs{display:block;overflow-x:auto;background:#202746;color:#979db4;padding:0.5em;-webkit-text-size-adjust:none;}.hljs-atelier-sulphurpool.dark .coffeescript .javascript,.hljs-atelier-sulphurpool.dark .javascript .xml,.hljs-atelier-sulphurpool.dark .tex .hljs-formula,.hljs-atelier-sulphurpool.dark .xml .javascript,.hljs-atelier-sulphurpool.dark .xml .vbscript,.hljs-atelier-sulphurpool.dark .xml .css,.hljs-atelier-sulphurpool.dark .xml .hljs-cdata{opacity:0.5;}","atelier-sulphurpool.light":".hljs-atelier-sulphurpool.light{}.hljs-atelier-sulphurpool.light .hljs-comment{color:#6b7394;}.hljs-atelier-sulphurpool.light .hljs-variable,.hljs-atelier-sulphurpool.light .hljs-attribute,.hljs-atelier-sulphurpool.light .hljs-tag,.hljs-atelier-sulphurpool.light .hljs-regexp,.hljs-atelier-sulphurpool.light .hljs-name,.hljs-atelier-sulphurpool.light .ruby .hljs-constant,.hljs-atelier-sulphurpool.light .xml .hljs-tag .hljs-title,.hljs-atelier-sulphurpool.light .xml .hljs-pi,.hljs-atelier-sulphurpool.light .xml .hljs-doctype,.hljs-atelier-sulphurpool.light .html .hljs-doctype,.hljs-atelier-sulphurpool.light .css .hljs-id,.hljs-atelier-sulphurpool.light .css .hljs-class,.hljs-atelier-sulphurpool.light .css .hljs-pseudo{color:#c94922;}.hljs-atelier-sulphurpool.light .hljs-number,.hljs-atelier-sulphurpool.light .hljs-preprocessor,.hljs-atelier-sulphurpool.light .hljs-built_in,.hljs-atelier-sulphurpool.light .hljs-literal,.hljs-atelier-sulphurpool.light .hljs-params,.hljs-atelier-sulphurpool.light .hljs-constant{color:#c76b29;}.hljs-atelier-sulphurpool.light .ruby .hljs-class .hljs-title,.hljs-atelier-sulphurpool.light .css .hljs-rule .hljs-attribute{color:#c08b30;}.hljs-atelier-sulphurpool.light .hljs-string,.hljs-atelier-sulphurpool.light .hljs-value,.hljs-atelier-sulphurpool.light .hljs-inheritance,.hljs-atelier-sulphurpool.light .hljs-header,.hljs-atelier-sulphurpool.light .ruby .hljs-symbol,.hljs-atelier-sulphurpool.light .xml .hljs-cdata{color:#ac9739;}.hljs-atelier-sulphurpool.light .hljs-title,.hljs-atelier-sulphurpool.light .css .hljs-hexcolor{color:#22a2c9;}.hljs-atelier-sulphurpool.light .hljs-function,.hljs-atelier-sulphurpool.light .python .hljs-decorator,.hljs-atelier-sulphurpool.light .python .hljs-title,.hljs-atelier-sulphurpool.light .ruby .hljs-function .hljs-title,.hljs-atelier-sulphurpool.light .ruby .hljs-title .hljs-keyword,.hljs-atelier-sulphurpool.light .perl .hljs-sub,.hljs-atelier-sulphurpool.light .javascript .hljs-title,.hljs-atelier-sulphurpool.light .coffeescript .hljs-title{color:#3d8fd1;}.hljs-atelier-sulphurpool.light .hljs-keyword,.hljs-atelier-sulphurpool.light .javascript .hljs-function{color:#6679cc;}.hljs-atelier-sulphurpool.light .hljs{display:block;overflow-x:auto;background:#f5f7ff;color:#5e6687;padding:0.5em;-webkit-text-size-adjust:none;}.hljs-atelier-sulphurpool.light .coffeescript .javascript,.hljs-atelier-sulphurpool.light .javascript .xml,.hljs-atelier-sulphurpool.light .tex .hljs-formula,.hljs-atelier-sulphurpool.light .xml .javascript,.hljs-atelier-sulphurpool.light .xml .vbscript,.hljs-atelier-sulphurpool.light .xml .css,.hljs-atelier-sulphurpool.light .xml .hljs-cdata{opacity:0.5;}","codepen-embed":".hljs-codepen-embed{}.hljs-codepen-embed .hljs{display:block;overflow-x:auto;padding:0.5em;background:#222;color:#fff;font-family:Menlo,Monaco,'Andale Mono','Lucida Console','Courier New',monospace;-webkit-text-size-adjust:none;}.hljs-codepen-embed .hljs-comment,.hljs-codepen-embed .hljs-title{color:#777;}.hljs-codepen-embed .hljs-variable,.hljs-codepen-embed .hljs-attribute,.hljs-codepen-embed .hljs-tag,.hljs-codepen-embed .hljs-regexp,.hljs-codepen-embed .hljs-name,.hljs-codepen-embed .ruby .constant,.hljs-codepen-embed .xml .tag .title,.hljs-codepen-embed .xml .pi,.hljs-codepen-embed .xml .doctype,.hljs-codepen-embed .html .doctype{color:#ab875d;}.hljs-codepen-embed .css .value{color:#cd6a51;}.hljs-codepen-embed .css .value .function,.hljs-codepen-embed .css .value .string{color:#a67f59;}.hljs-codepen-embed .css .value .number{color:#9b869c;}.hljs-codepen-embed .css .id,.hljs-codepen-embed .css .class,.hljs-codepen-embed .css-pseudo,.hljs-codepen-embed .css .selector,.hljs-codepen-embed .css .tag{color:#dfc48c;}.hljs-codepen-embed .hljs-number,.hljs-codepen-embed .hljs-preprocessor,.hljs-codepen-embed .hljs-built_in,.hljs-codepen-embed .hljs-literal,.hljs-codepen-embed .hljs-params,.hljs-codepen-embed .hljs-constant{color:#ab875d;}.hljs-codepen-embed .ruby .class .title,.hljs-codepen-embed .css .rules .attribute{color:#9b869b;}.hljs-codepen-embed .hljs-string,.hljs-codepen-embed .hljs-value,.hljs-codepen-embed .hljs-inheritance,.hljs-codepen-embed .hljs-header,.hljs-codepen-embed .ruby .symbol,.hljs-codepen-embed .xml .cdata{color:#8f9c6c;}.hljs-codepen-embed .css .hexcolor{color:#cd6a51;}.hljs-codepen-embed .function,.hljs-codepen-embed .python .decorator,.hljs-codepen-embed .python .title,.hljs-codepen-embed .ruby .function .title,.hljs-codepen-embed .ruby .title .keyword,.hljs-codepen-embed .perl .sub,.hljs-codepen-embed .javascript .title,.hljs-codepen-embed .coffeescript .title{color:#fff;}.hljs-codepen-embed .hljs-keyword,.hljs-codepen-embed .javascript .function{color:#8f9c6c;}","color-brewer":".hljs-color-brewer{}.hljs-color-brewer .hljs{display:block;overflow-x:auto;padding:0.5em;background:#fff;-webkit-text-size-adjust:none;}.hljs-color-brewer .hljs,.hljs-color-brewer .hljs-subst,.hljs-color-brewer .hljs-tag .hljs-title,.hljs-color-brewer .nginx .hljs-title{color:#000;}.hljs-color-brewer .hljs-string,.hljs-color-brewer .hljs-title,.hljs-color-brewer .hljs-constant,.hljs-color-brewer .hljs-parent,.hljs-color-brewer .hljs-tag .hljs-value,.hljs-color-brewer .hljs-rule .hljs-value,.hljs-color-brewer .hljs-preprocessor,.hljs-color-brewer .hljs-pragma,.hljs-color-brewer .haml .hljs-symbol,.hljs-color-brewer .ruby .hljs-symbol,.hljs-color-brewer .ruby .hljs-symbol .hljs-string,.hljs-color-brewer .hljs-template_tag,.hljs-color-brewer .django .hljs-variable,.hljs-color-brewer .smalltalk .hljs-class,.hljs-color-brewer .hljs-addition,.hljs-color-brewer .hljs-flow,.hljs-color-brewer .hljs-stream,.hljs-color-brewer .bash .hljs-variable,.hljs-color-brewer .apache .hljs-tag,.hljs-color-brewer .apache .hljs-cbracket,.hljs-color-brewer .tex .hljs-command,.hljs-color-brewer .tex .hljs-special,.hljs-color-brewer .erlang_repl .hljs-function_or_atom,.hljs-color-brewer .asciidoc .hljs-header,.hljs-color-brewer .markdown .hljs-header,.hljs-color-brewer .coffeescript .hljs-attribute,.hljs-color-brewer .hljs-name{color:#756bb1;}.hljs-color-brewer .smartquote,.hljs-color-brewer .hljs-comment,.hljs-color-brewer .hljs-annotation,.hljs-color-brewer .diff .hljs-header,.hljs-color-brewer .hljs-chunk,.hljs-color-brewer .asciidoc .hljs-blockquote,.hljs-color-brewer .markdown .hljs-blockquote{color:#636363;}.hljs-color-brewer .hljs-number,.hljs-color-brewer .hljs-date,.hljs-color-brewer .hljs-regexp,.hljs-color-brewer .hljs-literal,.hljs-color-brewer .hljs-hexcolor,.hljs-color-brewer .smalltalk .hljs-symbol,.hljs-color-brewer .smalltalk .hljs-char,.hljs-color-brewer .go .hljs-constant,.hljs-color-brewer .hljs-change,.hljs-color-brewer .lasso .hljs-variable,.hljs-color-brewer .makefile .hljs-variable,.hljs-color-brewer .asciidoc .hljs-bullet,.hljs-color-brewer .markdown .hljs-bullet,.hljs-color-brewer .asciidoc .hljs-link_url,.hljs-color-brewer .markdown .hljs-link_url{color:#31a354;}.hljs-color-brewer .hljs-label,.hljs-color-brewer .hljs-javadoc,.hljs-color-brewer .ruby .hljs-string,.hljs-color-brewer .hljs-decorator,.hljs-color-brewer .hljs-filter .hljs-argument,.hljs-color-brewer .hljs-localvars,.hljs-color-brewer .hljs-array,.hljs-color-brewer .hljs-attr_selector,.hljs-color-brewer .hljs-important,.hljs-color-brewer .hljs-pseudo,.hljs-color-brewer .hljs-pi,.hljs-color-brewer .haml .hljs-bullet,.hljs-color-brewer .hljs-doctype,.hljs-color-brewer .hljs-deletion,.hljs-color-brewer .hljs-envvar,.hljs-color-brewer .hljs-shebang,.hljs-color-brewer .apache .hljs-sqbracket,.hljs-color-brewer .nginx .hljs-built_in,.hljs-color-brewer .hljs-list .hljs-built_in,.hljs-color-brewer .tex .hljs-formula,.hljs-color-brewer .erlang_repl .hljs-reserved,.hljs-color-brewer .hljs-prompt,.hljs-color-brewer .asciidoc .hljs-link_label,.hljs-color-brewer .markdown .hljs-link_label,.hljs-color-brewer .vhdl .hljs-attribute,.hljs-color-brewer .clojure .hljs-attribute,.hljs-color-brewer .asciidoc .hljs-attribute,.hljs-color-brewer .lasso .hljs-attribute,.hljs-color-brewer .coffeescript .hljs-property,.hljs-color-brewer .hljs-phony{color:#88f;}.hljs-color-brewer .hljs-keyword,.hljs-color-brewer .hljs-id,.hljs-color-brewer .hljs-title,.hljs-color-brewer .hljs-built_in,.hljs-color-brewer .css .hljs-tag,.hljs-color-brewer .hljs-javadoctag,.hljs-color-brewer .hljs-phpdoc,.hljs-color-brewer .hljs-dartdoc,.hljs-color-brewer .hljs-yardoctag,.hljs-color-brewer .smalltalk .hljs-class,.hljs-color-brewer .hljs-winutils,.hljs-color-brewer .bash .hljs-variable,.hljs-color-brewer .apache .hljs-tag,.hljs-color-brewer .hljs-type,.hljs-color-brewer .hljs-typename,.hljs-color-brewer .tex .hljs-command,.hljs-color-brewer .asciidoc .hljs-strong,.hljs-color-brewer .markdown .hljs-strong,.hljs-color-brewer .hljs-request,.hljs-color-brewer .hljs-status{color:#3182bd;}.hljs-color-brewer .asciidoc .hljs-emphasis,.hljs-color-brewer .markdown .hljs-emphasis{font-style:italic;}.hljs-color-brewer .nginx .hljs-built_in{font-weight:normal;}.hljs-color-brewer .coffeescript .javascript,.hljs-color-brewer .javascript .xml,.hljs-color-brewer .lasso .markup,.hljs-color-brewer .tex .hljs-formula,.hljs-color-brewer .xml .javascript,.hljs-color-brewer .xml .vbscript,.hljs-color-brewer .xml .css,.hljs-color-brewer .xml .hljs-cdata{opacity:0.5;}.hljs-color-brewer .css .hljs-attribute,.hljs-color-brewer .html .hljs-attribute{color:#e6550d;}.hljs-color-brewer .css .hljs-class,.hljs-color-brewer .html .hljs-tag,.hljs-color-brewer .html .hljs-title{color:#3182bd;}","dark":".hljs-dark{}.hljs-dark .hljs{display:block;overflow-x:auto;padding:0.5em;background:#444;-webkit-text-size-adjust:none;}.hljs-dark .hljs-keyword,.hljs-dark .hljs-literal,.hljs-dark .hljs-change,.hljs-dark .hljs-winutils,.hljs-dark .hljs-flow,.hljs-dark .nginx .hljs-title,.hljs-dark .tex .hljs-special{color:white;}.hljs-dark .hljs,.hljs-dark .hljs-subst{color:#ddd;}.hljs-dark .hljs-string,.hljs-dark .hljs-title,.hljs-dark .hljs-type,.hljs-dark .ini .hljs-title,.hljs-dark .hljs-tag .hljs-value,.hljs-dark .css .hljs-rule .hljs-value,.hljs-dark .hljs-preprocessor,.hljs-dark .hljs-pragma,.hljs-dark .ruby .hljs-symbol,.hljs-dark .ruby .hljs-symbol .hljs-string,.hljs-dark .ruby .hljs-class .hljs-parent,.hljs-dark .hljs-built_in,.hljs-dark .django .hljs-template_tag,.hljs-dark .django .hljs-variable,.hljs-dark .smalltalk .hljs-class,.hljs-dark .hljs-javadoc,.hljs-dark .ruby .hljs-string,.hljs-dark .django .hljs-filter .hljs-argument,.hljs-dark .smalltalk .hljs-localvars,.hljs-dark .smalltalk .hljs-array,.hljs-dark .hljs-attr_selector,.hljs-dark .hljs-pseudo,.hljs-dark .hljs-addition,.hljs-dark .hljs-stream,.hljs-dark .hljs-envvar,.hljs-dark .apache .hljs-tag,.hljs-dark .apache .hljs-cbracket,.hljs-dark .tex .hljs-command,.hljs-dark .hljs-prompt,.hljs-dark .coffeescript .hljs-attribute,.hljs-dark .hljs-name{color:#d88;}.hljs-dark .hljs-comment,.hljs-dark .hljs-annotation,.hljs-dark .hljs-decorator,.hljs-dark .hljs-pi,.hljs-dark .hljs-doctype,.hljs-dark .hljs-deletion,.hljs-dark .hljs-shebang,.hljs-dark .apache .hljs-sqbracket,.hljs-dark .tex .hljs-formula{color:#777;}.hljs-dark .hljs-keyword,.hljs-dark .hljs-literal,.hljs-dark .hljs-title,.hljs-dark .css .hljs-id,.hljs-dark .hljs-phpdoc,.hljs-dark .hljs-dartdoc,.hljs-dark .hljs-type,.hljs-dark .vbscript .hljs-built_in,.hljs-dark .rsl .hljs-built_in,.hljs-dark .smalltalk .hljs-class,.hljs-dark .diff .hljs-header,.hljs-dark .hljs-chunk,.hljs-dark .hljs-winutils,.hljs-dark .bash .hljs-variable,.hljs-dark .apache .hljs-tag,.hljs-dark .tex .hljs-special,.hljs-dark .hljs-request,.hljs-dark .hljs-status{font-weight:bold;}.hljs-dark .coffeescript .javascript,.hljs-dark .javascript .xml,.hljs-dark .tex .hljs-formula,.hljs-dark .xml .javascript,.hljs-dark .xml .vbscript,.hljs-dark .xml .css,.hljs-dark .xml .hljs-cdata{opacity:0.5;}","darkula":".hljs-darkula{}.hljs-darkula .hljs{display:block;overflow-x:auto;padding:0.5em;background:#2b2b2b;-webkit-text-size-adjust:none;}.hljs-darkula .hljs,.hljs-darkula .hljs-tag,.hljs-darkula .hljs-title,.hljs-darkula .css .hljs-rule,.hljs-darkula .css .hljs-value,.hljs-darkula .aspectj .hljs-function,.hljs-darkula .css .hljs-function .hljs-preprocessor,.hljs-darkula .hljs-pragma{color:#bababa;}.hljs-darkula .hljs-strongemphasis,.hljs-darkula .hljs-strong,.hljs-darkula .hljs-emphasis{color:#a8a8a2;}.hljs-darkula .hljs-bullet,.hljs-darkula .hljs-blockquote,.hljs-darkula .hljs-horizontal_rule,.hljs-darkula .hljs-number,.hljs-darkula .hljs-regexp,.hljs-darkula .alias .hljs-keyword,.hljs-darkula .hljs-literal,.hljs-darkula .hljs-hexcolor{color:#6896ba;}.hljs-darkula .hljs-tag .hljs-value,.hljs-darkula .hljs-code,.hljs-darkula .css .hljs-class,.hljs-darkula .hljs-class .hljs-title:last-child{color:#a6e22e;}.hljs-darkula .hljs-link_url{font-size:80%;}.hljs-darkula .hljs-emphasis,.hljs-darkula .hljs-strongemphasis,.hljs-darkula .hljs-class .hljs-title:last-child,.hljs-darkula .hljs-typename{font-style:italic;}.hljs-darkula .hljs-keyword,.hljs-darkula .ruby .hljs-class .hljs-keyword:first-child,.hljs-darkula .ruby .hljs-function .hljs-keyword,.hljs-darkula .hljs-function,.hljs-darkula .hljs-change,.hljs-darkula .hljs-winutils,.hljs-darkula .hljs-flow,.hljs-darkula .nginx .hljs-title,.hljs-darkula .tex .hljs-special,.hljs-darkula .hljs-header,.hljs-darkula .hljs-attribute,.hljs-darkula .hljs-symbol,.hljs-darkula .hljs-symbol .hljs-string,.hljs-darkula .hljs-tag .hljs-title,.hljs-darkula .hljs-value,.hljs-darkula .alias .hljs-keyword:first-child,.hljs-darkula .css .hljs-tag,.hljs-darkula .css .unit,.hljs-darkula .css .hljs-important{color:#cb7832;}.hljs-darkula .hljs-function .hljs-keyword,.hljs-darkula .hljs-class .hljs-keyword:first-child,.hljs-darkula .hljs-aspect .hljs-keyword:first-child,.hljs-darkula .hljs-constant,.hljs-darkula .hljs-typename,.hljs-darkula .css .hljs-attribute{color:#cb7832;}.hljs-darkula .hljs-variable,.hljs-darkula .hljs-params,.hljs-darkula .hljs-class .hljs-title,.hljs-darkula .hljs-aspect .hljs-title{color:#b9b9b9;}.hljs-darkula .hljs-string,.hljs-darkula .css .hljs-id,.hljs-darkula .hljs-subst,.hljs-darkula .hljs-type,.hljs-darkula .ruby .hljs-class .hljs-parent,.hljs-darkula .hljs-built_in,.hljs-darkula .django .hljs-template_tag,.hljs-darkula .django .hljs-variable,.hljs-darkula .smalltalk .hljs-class,.hljs-darkula .django .hljs-filter .hljs-argument,.hljs-darkula .smalltalk .hljs-localvars,.hljs-darkula .smalltalk .hljs-array,.hljs-darkula .hljs-attr_selector,.hljs-darkula .hljs-pseudo,.hljs-darkula .hljs-addition,.hljs-darkula .hljs-stream,.hljs-darkula .hljs-envvar,.hljs-darkula .apache .hljs-tag,.hljs-darkula .apache .hljs-cbracket,.hljs-darkula .tex .hljs-command,.hljs-darkula .hljs-prompt,.hljs-darkula .hljs-link_label,.hljs-darkula .hljs-link_url,.hljs-darkula .hljs-name{color:#e0c46c;}.hljs-darkula .hljs-comment,.hljs-darkula .hljs-javadoc,.hljs-darkula .hljs-annotation,.hljs-darkula .hljs-pi,.hljs-darkula .hljs-doctype,.hljs-darkula .hljs-deletion,.hljs-darkula .hljs-shebang,.hljs-darkula .apache .hljs-sqbracket,.hljs-darkula .tex .hljs-formula{color:#7f7f7f;}.hljs-darkula .hljs-decorator{color:#bab429;}.hljs-darkula .coffeescript .javascript,.hljs-darkula .javascript .xml,.hljs-darkula .tex .hljs-formula,.hljs-darkula .xml .javascript,.hljs-darkula .xml .vbscript,.hljs-darkula .xml .css,.hljs-darkula .xml .hljs-cdata,.hljs-darkula .xml .php,.hljs-darkula .php .xml{opacity:0.5;}","default":".hljs-default{}.hljs-default .hljs{display:block;overflow-x:auto;padding:0.5em;background:#f0f0f0;-webkit-text-size-adjust:none;}.hljs-default .hljs,.hljs-default .hljs-subst,.hljs-default .hljs-tag .hljs-title,.hljs-default .nginx .hljs-title{color:black;}.hljs-default .hljs-string,.hljs-default .hljs-title,.hljs-default .hljs-constant,.hljs-default .hljs-parent,.hljs-default .hljs-tag .hljs-value,.hljs-default .hljs-rule .hljs-value,.hljs-default .hljs-preprocessor,.hljs-default .hljs-pragma,.hljs-default .hljs-name,.hljs-default .haml .hljs-symbol,.hljs-default .ruby .hljs-symbol,.hljs-default .ruby .hljs-symbol .hljs-string,.hljs-default .hljs-template_tag,.hljs-default .django .hljs-variable,.hljs-default .smalltalk .hljs-class,.hljs-default .hljs-addition,.hljs-default .hljs-flow,.hljs-default .hljs-stream,.hljs-default .bash .hljs-variable,.hljs-default .pf .hljs-variable,.hljs-default .apache .hljs-tag,.hljs-default .apache .hljs-cbracket,.hljs-default .tex .hljs-command,.hljs-default .tex .hljs-special,.hljs-default .erlang_repl .hljs-function_or_atom,.hljs-default .asciidoc .hljs-header,.hljs-default .markdown .hljs-header,.hljs-default .coffeescript .hljs-attribute{color:#800;}.hljs-default .smartquote,.hljs-default .hljs-comment,.hljs-default .hljs-annotation,.hljs-default .diff .hljs-header,.hljs-default .hljs-chunk,.hljs-default .asciidoc .hljs-blockquote,.hljs-default .markdown .hljs-blockquote{color:#888;}.hljs-default .hljs-number,.hljs-default .hljs-date,.hljs-default .hljs-regexp,.hljs-default .hljs-literal,.hljs-default .hljs-hexcolor,.hljs-default .smalltalk .hljs-symbol,.hljs-default .smalltalk .hljs-char,.hljs-default .go .hljs-constant,.hljs-default .hljs-change,.hljs-default .lasso .hljs-variable,.hljs-default .makefile .hljs-variable,.hljs-default .asciidoc .hljs-bullet,.hljs-default .markdown .hljs-bullet,.hljs-default .asciidoc .hljs-link_url,.hljs-default .markdown .hljs-link_url{color:#080;}.hljs-default .hljs-label,.hljs-default .hljs-javadoc,.hljs-default .ruby .hljs-string,.hljs-default .hljs-decorator,.hljs-default .hljs-filter .hljs-argument,.hljs-default .hljs-localvars,.hljs-default .hljs-array,.hljs-default .hljs-attr_selector,.hljs-default .hljs-important,.hljs-default .hljs-pseudo,.hljs-default .hljs-pi,.hljs-default .haml .hljs-bullet,.hljs-default .hljs-doctype,.hljs-default .hljs-deletion,.hljs-default .hljs-envvar,.hljs-default .hljs-shebang,.hljs-default .apache .hljs-sqbracket,.hljs-default .nginx .hljs-built_in,.hljs-default .tex .hljs-formula,.hljs-default .erlang_repl .hljs-reserved,.hljs-default .hljs-prompt,.hljs-default .asciidoc .hljs-link_label,.hljs-default .markdown .hljs-link_label,.hljs-default .vhdl .hljs-attribute,.hljs-default .clojure .hljs-attribute,.hljs-default .asciidoc .hljs-attribute,.hljs-default .lasso .hljs-attribute,.hljs-default .coffeescript .hljs-property,.hljs-default .hljs-phony{color:#88f;}.hljs-default .hljs-keyword,.hljs-default .hljs-id,.hljs-default .hljs-title,.hljs-default .hljs-built_in,.hljs-default .css .hljs-tag,.hljs-default .hljs-javadoctag,.hljs-default .hljs-phpdoc,.hljs-default .hljs-dartdoc,.hljs-default .hljs-yardoctag,.hljs-default .smalltalk .hljs-class,.hljs-default .hljs-winutils,.hljs-default .bash .hljs-variable,.hljs-default .pf .hljs-variable,.hljs-default .apache .hljs-tag,.hljs-default .hljs-type,.hljs-default .hljs-typename,.hljs-default .tex .hljs-command,.hljs-default .asciidoc .hljs-strong,.hljs-default .markdown .hljs-strong,.hljs-default .hljs-request,.hljs-default .hljs-status{font-weight:bold;}.hljs-default .asciidoc .hljs-emphasis,.hljs-default .markdown .hljs-emphasis{font-style:italic;}.hljs-default .nginx .hljs-built_in{font-weight:normal;}.hljs-default .coffeescript .javascript,.hljs-default .javascript .xml,.hljs-default .lasso .markup,.hljs-default .tex .hljs-formula,.hljs-default .xml .javascript,.hljs-default .xml .vbscript,.hljs-default .xml .css,.hljs-default .xml .hljs-cdata{opacity:0.5;}","docco":".hljs-docco{}.hljs-docco .hljs{display:block;overflow-x:auto;padding:0.5em;color:#000;background:#f8f8ff;-webkit-text-size-adjust:none;}.hljs-docco .hljs-comment,.hljs-docco .diff .hljs-header,.hljs-docco .hljs-javadoc{color:#408080;font-style:italic;}.hljs-docco .hljs-keyword,.hljs-docco .assignment,.hljs-docco .hljs-literal,.hljs-docco .css .rule .hljs-keyword,.hljs-docco .hljs-winutils,.hljs-docco .javascript .hljs-title,.hljs-docco .lisp .hljs-title,.hljs-docco .hljs-subst{color:#954121;}.hljs-docco .hljs-number,.hljs-docco .hljs-hexcolor{color:#40a070;}.hljs-docco .hljs-string,.hljs-docco .hljs-tag .hljs-value,.hljs-docco .hljs-phpdoc,.hljs-docco .hljs-dartdoc,.hljs-docco .tex .hljs-formula,.hljs-docco .hljs-name{color:#219161;}.hljs-docco .hljs-title,.hljs-docco .hljs-id{color:#19469d;}.hljs-docco .hljs-params{color:#00f;}.hljs-docco .javascript .hljs-title,.hljs-docco .lisp .hljs-title,.hljs-docco .hljs-subst{font-weight:normal;}.hljs-docco .hljs-class .hljs-title,.hljs-docco .haskell .hljs-label,.hljs-docco .tex .hljs-command{color:#458;font-weight:bold;}.hljs-docco .hljs-tag,.hljs-docco .hljs-tag .hljs-title,.hljs-docco .hljs-rule .hljs-property,.hljs-docco .django .hljs-tag .hljs-keyword{color:#000080;font-weight:normal;}.hljs-docco .hljs-attribute,.hljs-docco .hljs-variable,.hljs-docco .instancevar,.hljs-docco .lisp .hljs-body{color:#008080;}.hljs-docco .hljs-regexp{color:#b68;}.hljs-docco .hljs-class{color:#458;font-weight:bold;}.hljs-docco .hljs-symbol,.hljs-docco .ruby .hljs-symbol .hljs-string,.hljs-docco .ruby .hljs-symbol .hljs-keyword,.hljs-docco .ruby .hljs-symbol .keymethods,.hljs-docco .lisp .hljs-keyword,.hljs-docco .tex .hljs-special,.hljs-docco .input_number{color:#990073;}.hljs-docco .builtin,.hljs-docco .constructor,.hljs-docco .hljs-built_in,.hljs-docco .lisp .hljs-title{color:#0086b3;}.hljs-docco .hljs-preprocessor,.hljs-docco .hljs-pragma,.hljs-docco .hljs-pi,.hljs-docco .hljs-doctype,.hljs-docco .hljs-shebang,.hljs-docco .hljs-cdata{color:#999;font-weight:bold;}.hljs-docco .hljs-deletion{background:#fdd;}.hljs-docco .hljs-addition{background:#dfd;}.hljs-docco .diff .hljs-change{background:#0086b3;}.hljs-docco .hljs-chunk{color:#aaa;}.hljs-docco .tex .hljs-formula{opacity:0.5;}","far":".hljs-far{}.hljs-far .hljs{display:block;overflow-x:auto;padding:0.5em;background:#000080;-webkit-text-size-adjust:none;}.hljs-far .hljs,.hljs-far .hljs-subst{color:#0ff;}.hljs-far .hljs-string,.hljs-far .ruby .hljs-string,.hljs-far .haskell .hljs-type,.hljs-far .hljs-tag .hljs-value,.hljs-far .hljs-rule .hljs-value,.hljs-far .hljs-rule .hljs-value .hljs-number,.hljs-far .hljs-preprocessor,.hljs-far .hljs-pragma,.hljs-far .ruby .hljs-symbol,.hljs-far .ruby .hljs-symbol .hljs-string,.hljs-far .hljs-built_in,.hljs-far .django .hljs-template_tag,.hljs-far .django .hljs-variable,.hljs-far .smalltalk .hljs-class,.hljs-far .hljs-addition,.hljs-far .apache .hljs-tag,.hljs-far .apache .hljs-cbracket,.hljs-far .tex .hljs-command,.hljs-far .coffeescript .hljs-attribute{color:#ff0;}.hljs-far .hljs-keyword,.hljs-far .css .hljs-id,.hljs-far .hljs-title,.hljs-far .hljs-type,.hljs-far .vbscript .hljs-built_in,.hljs-far .rsl .hljs-built_in,.hljs-far .smalltalk .hljs-class,.hljs-far .xml .hljs-tag .hljs-title,.hljs-far .hljs-winutils,.hljs-far .hljs-flow,.hljs-far .hljs-change,.hljs-far .hljs-envvar,.hljs-far .bash .hljs-variable,.hljs-far .tex .hljs-special,.hljs-far .hljs-name{color:#fff;}.hljs-far .hljs-comment,.hljs-far .hljs-phpdoc,.hljs-far .hljs-dartdoc,.hljs-far .hljs-javadoc,.hljs-far .hljs-annotation,.hljs-far .hljs-deletion,.hljs-far .apache .hljs-sqbracket,.hljs-far .tex .hljs-formula{color:#888;}.hljs-far .hljs-number,.hljs-far .hljs-date,.hljs-far .hljs-regexp,.hljs-far .hljs-literal,.hljs-far .smalltalk .hljs-symbol,.hljs-far .smalltalk .hljs-char,.hljs-far .clojure .hljs-attribute{color:#0f0;}.hljs-far .hljs-decorator,.hljs-far .django .hljs-filter .hljs-argument,.hljs-far .smalltalk .hljs-localvars,.hljs-far .smalltalk .hljs-array,.hljs-far .hljs-attr_selector,.hljs-far .hljs-pseudo,.hljs-far .xml .hljs-pi,.hljs-far .diff .hljs-header,.hljs-far .hljs-chunk,.hljs-far .hljs-shebang,.hljs-far .nginx .hljs-built_in,.hljs-far .hljs-prompt{color:#008080;}.hljs-far .hljs-keyword,.hljs-far .css .hljs-id,.hljs-far .hljs-title,.hljs-far .hljs-type,.hljs-far .vbscript .hljs-built_in,.hljs-far .rsl .hljs-built_in,.hljs-far .smalltalk .hljs-class,.hljs-far .hljs-winutils,.hljs-far .hljs-flow,.hljs-far .apache .hljs-tag,.hljs-far .nginx .hljs-built_in,.hljs-far .tex .hljs-command,.hljs-far .tex .hljs-special,.hljs-far .hljs-request,.hljs-far .hljs-status{font-weight:bold;}","foundation":".hljs-foundation{}.hljs-foundation .hljs{display:block;overflow-x:auto;padding:0.5em;background:#eee;-webkit-text-size-adjust:none;}.hljs-foundation .hljs-header,.hljs-foundation .hljs-decorator,.hljs-foundation .hljs-annotation{color:#000077;}.hljs-foundation .hljs-horizontal_rule,.hljs-foundation .hljs-link_url,.hljs-foundation .hljs-emphasis,.hljs-foundation .hljs-attribute{color:#070;}.hljs-foundation .hljs-emphasis{font-style:italic;}.hljs-foundation .hljs-link_label,.hljs-foundation .hljs-strong,.hljs-foundation .hljs-value,.hljs-foundation .hljs-string,.hljs-foundation .scss .hljs-value .hljs-string{color:#d14;}.hljs-foundation .hljs-strong{font-weight:bold;}.hljs-foundation .hljs-blockquote,.hljs-foundation .hljs-comment{color:#998;font-style:italic;}.hljs-foundation .asciidoc .hljs-title,.hljs-foundation .hljs-function .hljs-title{color:#900;}.hljs-foundation .hljs-class{color:#458;}.hljs-foundation .hljs-id,.hljs-foundation .hljs-pseudo,.hljs-foundation .hljs-constant,.hljs-foundation .hljs-hexcolor{color:teal;}.hljs-foundation .hljs-variable{color:#336699;}.hljs-foundation .hljs-bullet,.hljs-foundation .hljs-javadoc{color:#997700;}.hljs-foundation .hljs-pi,.hljs-foundation .hljs-doctype{color:#3344bb;}.hljs-foundation .hljs-code,.hljs-foundation .hljs-number{color:#099;}.hljs-foundation .hljs-important{color:#f00;}.hljs-foundation .smartquote,.hljs-foundation .hljs-label{color:#970;}.hljs-foundation .hljs-preprocessor,.hljs-foundation .hljs-pragma{color:#579;}.hljs-foundation .hljs-reserved,.hljs-foundation .hljs-keyword,.hljs-foundation .scss .hljs-value{color:#000;}.hljs-foundation .hljs-regexp{background-color:#fff0ff;color:#880088;}.hljs-foundation .hljs-symbol{color:#990073;}.hljs-foundation .hljs-symbol .hljs-string{color:#a60;}.hljs-foundation .hljs-tag{color:#007700;}.hljs-foundation .hljs-at_rule,.hljs-foundation .hljs-at_rule .hljs-keyword{color:#088;}.hljs-foundation .hljs-at_rule .hljs-preprocessor{color:#808;}.hljs-foundation .scss .hljs-tag,.hljs-foundation .scss .hljs-attribute{color:#339;}","github":".hljs-github{}.hljs-github .hljs{display:block;overflow-x:auto;padding:0.5em;color:#333;background:#f8f8f8;-webkit-text-size-adjust:none;}.hljs-github .hljs-comment,.hljs-github .diff .hljs-header,.hljs-github .hljs-javadoc{color:#998;font-style:italic;}.hljs-github .hljs-keyword,.hljs-github .css .rule .hljs-keyword,.hljs-github .hljs-winutils,.hljs-github .nginx .hljs-title,.hljs-github .hljs-subst,.hljs-github .hljs-request,.hljs-github .hljs-status{color:#333;font-weight:bold;}.hljs-github .hljs-number,.hljs-github .hljs-hexcolor,.hljs-github .ruby .hljs-constant{color:#008080;}.hljs-github .hljs-string,.hljs-github .hljs-tag .hljs-value,.hljs-github .hljs-phpdoc,.hljs-github .hljs-dartdoc,.hljs-github .tex .hljs-formula{color:#d14;}.hljs-github .hljs-title,.hljs-github .hljs-id,.hljs-github .scss .hljs-preprocessor{color:#900;font-weight:bold;}.hljs-github .hljs-list .hljs-keyword,.hljs-github .hljs-subst{font-weight:normal;}.hljs-github .hljs-class .hljs-title,.hljs-github .hljs-type,.hljs-github .vhdl .hljs-literal,.hljs-github .tex .hljs-command{color:#458;font-weight:bold;}.hljs-github .hljs-tag,.hljs-github .hljs-tag .hljs-title,.hljs-github .hljs-rule .hljs-property,.hljs-github .django .hljs-tag .hljs-keyword{color:#000080;font-weight:normal;}.hljs-github .hljs-attribute,.hljs-github .hljs-variable,.hljs-github .lisp .hljs-body,.hljs-github .hljs-name{color:#008080;}.hljs-github .hljs-regexp{color:#009926;}.hljs-github .hljs-symbol,.hljs-github .ruby .hljs-symbol .hljs-string,.hljs-github .lisp .hljs-keyword,.hljs-github .clojure .hljs-keyword,.hljs-github .scheme .hljs-keyword,.hljs-github .tex .hljs-special,.hljs-github .hljs-prompt{color:#990073;}.hljs-github .hljs-built_in{color:#0086b3;}.hljs-github .hljs-preprocessor,.hljs-github .hljs-pragma,.hljs-github .hljs-pi,.hljs-github .hljs-doctype,.hljs-github .hljs-shebang,.hljs-github .hljs-cdata{color:#999;font-weight:bold;}.hljs-github .hljs-deletion{background:#fdd;}.hljs-github .hljs-addition{background:#dfd;}.hljs-github .diff .hljs-change{background:#0086b3;}.hljs-github .hljs-chunk{color:#aaa;}","googlecode":".hljs-googlecode{}.hljs-googlecode .hljs{display:block;overflow-x:auto;padding:0.5em;background:white;color:black;-webkit-text-size-adjust:none;}.hljs-googlecode .hljs-comment,.hljs-googlecode .hljs-javadoc{color:#800;}.hljs-googlecode .hljs-keyword,.hljs-googlecode .method,.hljs-googlecode .hljs-list .hljs-keyword,.hljs-googlecode .nginx .hljs-title,.hljs-googlecode .hljs-tag .hljs-title,.hljs-googlecode .setting .hljs-value,.hljs-googlecode .hljs-winutils,.hljs-googlecode .tex .hljs-command,.hljs-googlecode .http .hljs-title,.hljs-googlecode .hljs-request,.hljs-googlecode .hljs-status{color:#008;}.hljs-googlecode .hljs-envvar,.hljs-googlecode .tex .hljs-special{color:#660;}.hljs-googlecode .hljs-string,.hljs-googlecode .hljs-tag .hljs-value,.hljs-googlecode .hljs-cdata,.hljs-googlecode .hljs-filter .hljs-argument,.hljs-googlecode .hljs-attr_selector,.hljs-googlecode .apache .hljs-cbracket,.hljs-googlecode .hljs-date,.hljs-googlecode .hljs-regexp,.hljs-googlecode .coffeescript .hljs-attribute{color:#080;}.hljs-googlecode .hljs-sub .hljs-identifier,.hljs-googlecode .hljs-pi,.hljs-googlecode .hljs-tag,.hljs-googlecode .hljs-tag .hljs-keyword,.hljs-googlecode .hljs-decorator,.hljs-googlecode .ini .hljs-title,.hljs-googlecode .hljs-shebang,.hljs-googlecode .hljs-prompt,.hljs-googlecode .hljs-hexcolor,.hljs-googlecode .hljs-rule .hljs-value,.hljs-googlecode .hljs-literal,.hljs-googlecode .hljs-symbol,.hljs-googlecode .ruby .hljs-symbol .hljs-string,.hljs-googlecode .hljs-number,.hljs-googlecode .css .hljs-function,.hljs-googlecode .clojure .hljs-attribute{color:#066;}.hljs-googlecode .hljs-class .hljs-title,.hljs-googlecode .smalltalk .hljs-class,.hljs-googlecode .hljs-javadoctag,.hljs-googlecode .hljs-yardoctag,.hljs-googlecode .hljs-phpdoc,.hljs-googlecode .hljs-dartdoc,.hljs-googlecode .hljs-type,.hljs-googlecode .hljs-typename,.hljs-googlecode .hljs-tag .hljs-attribute,.hljs-googlecode .hljs-doctype,.hljs-googlecode .hljs-class .hljs-id,.hljs-googlecode .hljs-built_in,.hljs-googlecode .setting,.hljs-googlecode .hljs-params,.hljs-googlecode .hljs-variable,.hljs-googlecode .hljs-name{color:#606;}.hljs-googlecode .css .hljs-tag,.hljs-googlecode .hljs-rule .hljs-property,.hljs-googlecode .hljs-pseudo,.hljs-googlecode .hljs-subst{color:#000;}.hljs-googlecode .css .hljs-class,.hljs-googlecode .css .hljs-id{color:#9b703f;}.hljs-googlecode .hljs-value .hljs-important{color:#ff7700;font-weight:bold;}.hljs-googlecode .hljs-rule .hljs-keyword{color:#c5af75;}.hljs-googlecode .hljs-annotation,.hljs-googlecode .apache .hljs-sqbracket,.hljs-googlecode .nginx .hljs-built_in{color:#9b859d;}.hljs-googlecode .hljs-preprocessor,.hljs-googlecode .hljs-preprocessor *,.hljs-googlecode .hljs-pragma{color:#444;}.hljs-googlecode .tex .hljs-formula{background-color:#eee;font-style:italic;}.hljs-googlecode .diff .hljs-header,.hljs-googlecode .hljs-chunk{color:#808080;font-weight:bold;}.hljs-googlecode .diff .hljs-change{background-color:#bccff9;}.hljs-googlecode .hljs-addition{background-color:#baeeba;}.hljs-googlecode .hljs-deletion{background-color:#ffc8bd;}.hljs-googlecode .hljs-comment .hljs-yardoctag{font-weight:bold;}","hybrid":".hljs-hybrid{}.hljs-hybrid .hljs{display:block;overflow-x:auto;padding:0.5em;background:#1d1f21;-webkit-text-size-adjust:none;}.hljs-hybrid .hljs::selection,.hljs-hybrid .hljs span::selection{background:#373b41;}.hljs-hybrid .hljs::-moz-selection,.hljs-hybrid .hljs span::-moz-selection{background:#373b41;}.hljs-hybrid .hljs,.hljs-hybrid .hljs-setting .hljs-value,.hljs-hybrid .hljs-expression .hljs-variable,.hljs-hybrid .hljs-expression .hljs-begin-block,.hljs-hybrid .hljs-expression .hljs-end-block,.hljs-hybrid .hljs-class .hljs-params,.hljs-hybrid .hljs-function .hljs-params,.hljs-hybrid .hljs-at_rule .hljs-preprocessor{color:#c5c8c6;}.hljs-hybrid .hljs-title,.hljs-hybrid .hljs-function .hljs-title,.hljs-hybrid .hljs-keyword .hljs-common,.hljs-hybrid .hljs-class .hljs-title,.hljs-hybrid .hljs-decorator,.hljs-hybrid .hljs-tag .hljs-title,.hljs-hybrid .hljs-header,.hljs-hybrid .hljs-sub,.hljs-hybrid .hljs-function{color:#f0c674;}.hljs-hybrid .hljs-comment,.hljs-hybrid .hljs-javadoc,.hljs-hybrid .hljs-output .hljs-value,.hljs-hybrid .hljs-pi,.hljs-hybrid .hljs-shebang,.hljs-hybrid .hljs-doctype{color:#707880;}.hljs-hybrid .hljs-number,.hljs-hybrid .hljs-symbol,.hljs-hybrid .hljs-literal,.hljs-hybrid .hljs-deletion,.hljs-hybrid .hljs-link_url,.hljs-hybrid .hljs-symbol .hljs-string,.hljs-hybrid .hljs-argument,.hljs-hybrid .hljs-hexcolor,.hljs-hybrid .hljs-input .hljs-prompt,.hljs-hybrid .hljs-char{color:#cc6666;}.hljs-hybrid .hljs-string,.hljs-hybrid .hljs-special,.hljs-hybrid .hljs-javadoctag,.hljs-hybrid .hljs-addition,.hljs-hybrid .hljs-important,.hljs-hybrid .hljs-tag .hljs-value,.hljs-hybrid .hljs-at.rule .hljs-keyword,.hljs-hybrid .hljs-regexp,.hljs-hybrid .hljs-attr_selector{color:#b5bd68;}.hljs-hybrid .hljs-variable,.hljs-hybrid .hljs-property,.hljs-hybrid .hljs-envar,.hljs-hybrid .hljs-code,.hljs-hybrid .hljs-expression,.hljs-hybrid .hljs-localvars,.hljs-hybrid .hljs-id,.hljs-hybrid .hljs-variable .hljs-filter,.hljs-hybrid .hljs-variable .hljs-filter .hljs-keyword,.hljs-hybrid .hljs-template_tag .hljs-filter .hljs-keyword,.hljs-hybrid .hljs-name{color:#b294bb;}.hljs-hybrid .hljs-statement,.hljs-hybrid .hljs-label,.hljs-hybrid .hljs-keyword,.hljs-hybrid .hljs-xmlDocTag,.hljs-hybrid .hljs-function .hljs-keyword,.hljs-hybrid .hljs-chunk,.hljs-hybrid .hljs-cdata,.hljs-hybrid .hljs-link_label,.hljs-hybrid .hljs-bullet,.hljs-hybrid .hljs-class .hljs-keyword,.hljs-hybrid .hljs-smartquote,.hljs-hybrid .hljs-method,.hljs-hybrid .hljs-list .hljs-title,.hljs-hybrid .hljs-tag{color:#81a2be;}.hljs-hybrid .hljs-pseudo,.hljs-hybrid .hljs-exception,.hljs-hybrid .hljs-annotation,.hljs-hybrid .hljs-subst,.hljs-hybrid .hljs-change,.hljs-hybrid .hljs-cbracket,.hljs-hybrid .hljs-operator,.hljs-hybrid .hljs-horizontal_rule,.hljs-hybrid .hljs-preprocessor .hljs-keyword,.hljs-hybrid .hljs-typedef,.hljs-hybrid .hljs-template_tag,.hljs-hybrid .hljs-variable,.hljs-hybrid .hljs-variable .hljs-filter .hljs-argument,.hljs-hybrid .hljs-at_rule,.hljs-hybrid .hljs-at_rule .hljs-string,.hljs-hybrid .hljs-at_rule .hljs-keyword{color:#8abeb7;}.hljs-hybrid .hljs-type,.hljs-hybrid .hljs-typename,.hljs-hybrid .hljs-inheritance .hljs-parent,.hljs-hybrid .hljs-constant,.hljs-hybrid .hljs-built_in,.hljs-hybrid .hljs-setting,.hljs-hybrid .hljs-structure,.hljs-hybrid .hljs-link_reference,.hljs-hybrid .hljs-attribute,.hljs-hybrid .hljs-blockquote,.hljs-hybrid .hljs-quoted,.hljs-hybrid .hljs-class,.hljs-hybrid .hljs-header{color:#de935f;}.hljs-hybrid .hljs-emphasis{font-style:italic;}.hljs-hybrid .hljs-strong{font-weight:bold;}","idea":".hljs-idea{}.hljs-idea .hljs{display:block;overflow-x:auto;padding:0.5em;color:#000;background:#fff;-webkit-text-size-adjust:none;}.hljs-idea .hljs-subst,.hljs-idea .hljs-title,.hljs-idea .json .hljs-value{font-weight:normal;color:#000;}.hljs-idea .hljs-comment,.hljs-idea .hljs-javadoc,.hljs-idea .diff .hljs-header{color:#808080;font-style:italic;}.hljs-idea .hljs-annotation,.hljs-idea .hljs-decorator,.hljs-idea .hljs-preprocessor,.hljs-idea .hljs-pragma,.hljs-idea .hljs-doctype,.hljs-idea .hljs-pi,.hljs-idea .hljs-chunk,.hljs-idea .hljs-shebang,.hljs-idea .apache .hljs-cbracket,.hljs-idea .hljs-prompt,.hljs-idea .http .hljs-title{color:#808000;}.hljs-idea .hljs-tag,.hljs-idea .hljs-pi{background:#efefef;}.hljs-idea .hljs-tag .hljs-title,.hljs-idea .hljs-id,.hljs-idea .hljs-attr_selector,.hljs-idea .hljs-pseudo,.hljs-idea .hljs-literal,.hljs-idea .hljs-keyword,.hljs-idea .hljs-hexcolor,.hljs-idea .css .hljs-function,.hljs-idea .ini .hljs-title,.hljs-idea .css .hljs-class,.hljs-idea .hljs-list .hljs-keyword,.hljs-idea .nginx .hljs-title,.hljs-idea .tex .hljs-command,.hljs-idea .hljs-request,.hljs-idea .hljs-status{font-weight:bold;color:#000080;}.hljs-idea .hljs-attribute,.hljs-idea .hljs-rule .hljs-keyword,.hljs-idea .hljs-number,.hljs-idea .hljs-date,.hljs-idea .hljs-regexp,.hljs-idea .tex .hljs-special{font-weight:bold;color:#0000ff;}.hljs-idea .hljs-number,.hljs-idea .hljs-regexp{font-weight:normal;}.hljs-idea .hljs-string,.hljs-idea .hljs-value,.hljs-idea .hljs-filter .hljs-argument,.hljs-idea .css .hljs-function .hljs-params,.hljs-idea .apache .hljs-tag{color:#008000;font-weight:bold;}.hljs-idea .hljs-symbol,.hljs-idea .ruby .hljs-symbol .hljs-string,.hljs-idea .hljs-char,.hljs-idea .tex .hljs-formula{color:#000;background:#d0eded;font-style:italic;}.hljs-idea .hljs-phpdoc,.hljs-idea .hljs-dartdoc,.hljs-idea .hljs-yardoctag,.hljs-idea .hljs-javadoctag{text-decoration:underline;}.hljs-idea .hljs-variable,.hljs-idea .hljs-envvar,.hljs-idea .apache .hljs-sqbracket,.hljs-idea .nginx .hljs-built_in,.hljs-idea .hljs-name{color:#660e7a;}.hljs-idea .hljs-addition{background:#baeeba;}.hljs-idea .hljs-deletion{background:#ffc8bd;}.hljs-idea .diff .hljs-change{background:#bccff9;}","ir_black":".hljs-ir_black{}.hljs-ir_black .hljs{display:block;overflow-x:auto;padding:0.5em;background:#000;color:#f8f8f8;-webkit-text-size-adjust:none;}.hljs-ir_black .hljs-shebang,.hljs-ir_black .hljs-comment,.hljs-ir_black .hljs-javadoc{color:#7c7c7c;}.hljs-ir_black .hljs-keyword,.hljs-ir_black .hljs-tag,.hljs-ir_black .tex .hljs-command,.hljs-ir_black .hljs-request,.hljs-ir_black .hljs-status,.hljs-ir_black .clojure .hljs-attribute{color:#96cbfe;}.hljs-ir_black .hljs-sub .hljs-keyword,.hljs-ir_black .method,.hljs-ir_black .hljs-list .hljs-title,.hljs-ir_black .nginx .hljs-title{color:#ffffb6;}.hljs-ir_black .hljs-string,.hljs-ir_black .hljs-tag .hljs-value,.hljs-ir_black .hljs-cdata,.hljs-ir_black .hljs-filter .hljs-argument,.hljs-ir_black .hljs-attr_selector,.hljs-ir_black .apache .hljs-cbracket,.hljs-ir_black .hljs-date,.hljs-ir_black .coffeescript .hljs-attribute{color:#a8ff60;}.hljs-ir_black .hljs-subst{color:#daefa3;}.hljs-ir_black .hljs-regexp{color:#e9c062;}.hljs-ir_black .hljs-title,.hljs-ir_black .hljs-sub .hljs-identifier,.hljs-ir_black .hljs-pi,.hljs-ir_black .hljs-decorator,.hljs-ir_black .tex .hljs-special,.hljs-ir_black .hljs-type,.hljs-ir_black .hljs-constant,.hljs-ir_black .smalltalk .hljs-class,.hljs-ir_black .hljs-javadoctag,.hljs-ir_black .hljs-yardoctag,.hljs-ir_black .hljs-phpdoc,.hljs-ir_black .hljs-dartdoc,.hljs-ir_black .nginx .hljs-built_in{color:#ffffb6;}.hljs-ir_black .hljs-symbol,.hljs-ir_black .ruby .hljs-symbol .hljs-string,.hljs-ir_black .hljs-number,.hljs-ir_black .hljs-variable,.hljs-ir_black .vbscript,.hljs-ir_black .hljs-literal,.hljs-ir_black .hljs-name{color:#c6c5fe;}.hljs-ir_black .css .hljs-tag{color:#96cbfe;}.hljs-ir_black .css .hljs-rule .hljs-property,.hljs-ir_black .css .hljs-id{color:#ffffb6;}.hljs-ir_black .css .hljs-class{color:#fff;}.hljs-ir_black .hljs-hexcolor{color:#c6c5fe;}.hljs-ir_black .hljs-number{color:#ff73fd;}.hljs-ir_black .coffeescript .javascript,.hljs-ir_black .javascript .xml,.hljs-ir_black .tex .hljs-formula,.hljs-ir_black .xml .javascript,.hljs-ir_black .xml .vbscript,.hljs-ir_black .xml .css,.hljs-ir_black .xml .hljs-cdata{opacity:0.7;}","kimbie.dark":".hljs-kimbie.dark{}.hljs-kimbie.dark .hljs-comment,.hljs-kimbie.dark .hljs-title{color:#d6baad;}.hljs-kimbie.dark .hljs-variable,.hljs-kimbie.dark .hljs-attribute,.hljs-kimbie.dark .hljs-tag,.hljs-kimbie.dark .hljs-regexp,.hljs-kimbie.dark .hljs-name,.hljs-kimbie.dark .ruby .hljs-constant,.hljs-kimbie.dark .xml .hljs-tag .hljs-title,.hljs-kimbie.dark .xml .hljs-pi,.hljs-kimbie.dark .xml .hljs-doctype,.hljs-kimbie.dark .html .hljs-doctype,.hljs-kimbie.dark .css .hljs-id,.hljs-kimbie.dark .css .hljs-class,.hljs-kimbie.dark .css .hljs-pseudo{color:#dc3958;}.hljs-kimbie.dark .hljs-number,.hljs-kimbie.dark .hljs-preprocessor,.hljs-kimbie.dark .hljs-built_in,.hljs-kimbie.dark .hljs-literal,.hljs-kimbie.dark .hljs-params,.hljs-kimbie.dark .hljs-constant{color:#f79a32;}.hljs-kimbie.dark .ruby .hljs-class .hljs-title,.hljs-kimbie.dark .css .hljs-rule .hljs-attribute{color:#f06431;}.hljs-kimbie.dark .hljs-string,.hljs-kimbie.dark .hljs-value,.hljs-kimbie.dark .hljs-inheritance,.hljs-kimbie.dark .hljs-header,.hljs-kimbie.dark .ruby .hljs-symbol,.hljs-kimbie.dark .xml .hljs-cdata{color:#889b4a;}.hljs-kimbie.dark .css .hljs-hexcolor{color:#088649;}.hljs-kimbie.dark .hljs-function,.hljs-kimbie.dark .python .hljs-decorator,.hljs-kimbie.dark .python .hljs-title,.hljs-kimbie.dark .ruby .hljs-function .hljs-title,.hljs-kimbie.dark .ruby .hljs-title .hljs-keyword,.hljs-kimbie.dark .perl .hljs-sub,.hljs-kimbie.dark .javascript .hljs-title,.hljs-kimbie.dark .coffeescript .hljs-title{color:#8ab1b0;}.hljs-kimbie.dark .hljs-keyword,.hljs-kimbie.dark .javascript .hljs-function{color:#98676a;}.hljs-kimbie.dark .hljs{display:block;overflow-x:auto;background:#221a0f;color:#d3af86;padding:0.5em;-webkit-text-size-adjust:none;}.hljs-kimbie.dark .coffeescript .javascript,.hljs-kimbie.dark .javascript .xml,.hljs-kimbie.dark .tex .hljs-formula,.hljs-kimbie.dark .xml .javascript,.hljs-kimbie.dark .xml .vbscript,.hljs-kimbie.dark .xml .css,.hljs-kimbie.dark .xml .hljs-cdata{opacity:0.5;}","kimbie.light":".hljs-kimbie.light{}.hljs-kimbie.light .hljs-comment,.hljs-kimbie.light .hljs-title{color:#a57a4c;}.hljs-kimbie.light .hljs-variable,.hljs-kimbie.light .hljs-attribute,.hljs-kimbie.light .hljs-tag,.hljs-kimbie.light .hljs-regexp,.hljs-kimbie.light .hljs-name,.hljs-kimbie.light .ruby .hljs-constant,.hljs-kimbie.light .xml .hljs-tag .hljs-title,.hljs-kimbie.light .xml .hljs-pi,.hljs-kimbie.light .xml .hljs-doctype,.hljs-kimbie.light .html .hljs-doctype,.hljs-kimbie.light .css .hljs-id,.hljs-kimbie.light .css .hljs-class,.hljs-kimbie.light .css .hljs-pseudo{color:#dc3958;}.hljs-kimbie.light .hljs-number,.hljs-kimbie.light .hljs-preprocessor,.hljs-kimbie.light .hljs-built_in,.hljs-kimbie.light .hljs-literal,.hljs-kimbie.light .hljs-params,.hljs-kimbie.light .hljs-constant{color:#f79a32;}.hljs-kimbie.light .ruby .hljs-class .hljs-title,.hljs-kimbie.light .css .hljs-rule .hljs-attribute{color:#f06431;}.hljs-kimbie.light .hljs-string,.hljs-kimbie.light .hljs-value,.hljs-kimbie.light .hljs-inheritance,.hljs-kimbie.light .hljs-header,.hljs-kimbie.light .ruby .hljs-symbol,.hljs-kimbie.light .xml .hljs-cdata{color:#889b4a;}.hljs-kimbie.light .css .hljs-hexcolor{color:#088649;}.hljs-kimbie.light .hljs-function,.hljs-kimbie.light .python .hljs-decorator,.hljs-kimbie.light .python .hljs-title,.hljs-kimbie.light .ruby .hljs-function .hljs-title,.hljs-kimbie.light .ruby .hljs-title .hljs-keyword,.hljs-kimbie.light .perl .hljs-sub,.hljs-kimbie.light .javascript .hljs-title,.hljs-kimbie.light .coffeescript .hljs-title{color:#8ab1b0;}.hljs-kimbie.light .hljs-keyword,.hljs-kimbie.light .javascript .hljs-function{color:#98676a;}.hljs-kimbie.light .hljs{display:block;overflow-x:auto;background:#fbebd4;color:#84613d;padding:0.5em;-webkit-text-size-adjust:none;}.hljs-kimbie.light .coffeescript .javascript,.hljs-kimbie.light .javascript .xml,.hljs-kimbie.light .tex .hljs-formula,.hljs-kimbie.light .xml .javascript,.hljs-kimbie.light .xml .vbscript,.hljs-kimbie.light .xml .css,.hljs-kimbie.light .xml .hljs-cdata{opacity:0.5;}","magula":".hljs-magula{}.hljs-magula .hljs{display:block;overflow-x:auto;padding:0.5em;background-color:#f4f4f4;-webkit-text-size-adjust:none;}.hljs-magula .hljs,.hljs-magula .hljs-subst{color:black;}.hljs-magula .hljs-string,.hljs-magula .hljs-title,.hljs-magula .hljs-parent,.hljs-magula .hljs-tag .hljs-value,.hljs-magula .hljs-rule .hljs-value,.hljs-magula .hljs-preprocessor,.hljs-magula .hljs-pragma,.hljs-magula .ruby .hljs-symbol,.hljs-magula .ruby .hljs-symbol .hljs-string,.hljs-magula .hljs-template_tag,.hljs-magula .django .hljs-variable,.hljs-magula .smalltalk .hljs-class,.hljs-magula .hljs-addition,.hljs-magula .hljs-flow,.hljs-magula .hljs-stream,.hljs-magula .bash .hljs-variable,.hljs-magula .apache .hljs-cbracket,.hljs-magula .coffeescript .hljs-attribute{color:#050;}.hljs-magula .hljs-comment,.hljs-magula .hljs-annotation,.hljs-magula .diff .hljs-header,.hljs-magula .hljs-chunk{color:#777;}.hljs-magula .hljs-number,.hljs-magula .hljs-date,.hljs-magula .hljs-regexp,.hljs-magula .hljs-literal,.hljs-magula .hljs-name,.hljs-magula .smalltalk .hljs-symbol,.hljs-magula .smalltalk .hljs-char,.hljs-magula .hljs-change,.hljs-magula .tex .hljs-special{color:#800;}.hljs-magula .hljs-label,.hljs-magula .hljs-javadoc,.hljs-magula .ruby .hljs-string,.hljs-magula .hljs-decorator,.hljs-magula .hljs-filter .hljs-argument,.hljs-magula .hljs-localvars,.hljs-magula .hljs-array,.hljs-magula .hljs-attr_selector,.hljs-magula .hljs-pseudo,.hljs-magula .hljs-pi,.hljs-magula .hljs-doctype,.hljs-magula .hljs-deletion,.hljs-magula .hljs-envvar,.hljs-magula .hljs-shebang,.hljs-magula .apache .hljs-sqbracket,.hljs-magula .nginx .hljs-built_in,.hljs-magula .tex .hljs-formula,.hljs-magula .hljs-prompt,.hljs-magula .clojure .hljs-attribute{color:#00e;}.hljs-magula .hljs-keyword,.hljs-magula .hljs-id,.hljs-magula .hljs-phpdoc,.hljs-magula .hljs-dartdoc,.hljs-magula .hljs-title,.hljs-magula .hljs-built_in,.hljs-magula .smalltalk .hljs-class,.hljs-magula .hljs-winutils,.hljs-magula .bash .hljs-variable,.hljs-magula .apache .hljs-tag,.hljs-magula .xml .hljs-tag,.hljs-magula .tex .hljs-command,.hljs-magula .hljs-request,.hljs-magula .hljs-status{font-weight:bold;color:navy;}.hljs-magula .nginx .hljs-built_in{font-weight:normal;}.hljs-magula .coffeescript .javascript,.hljs-magula .javascript .xml,.hljs-magula .tex .hljs-formula,.hljs-magula .xml .javascript,.hljs-magula .xml .vbscript,.hljs-magula .xml .css,.hljs-magula .xml .hljs-cdata{opacity:0.5;}.hljs-magula .apache .hljs-tag{font-weight:bold;color:blue;}","mono-blue":".hljs-mono-blue{}.hljs-mono-blue .hljs{display:block;overflow-x:auto;padding:0.5em;background:#eaeef3;-webkit-text-size-adjust:none;}.hljs-mono-blue .hljs,.hljs-mono-blue .hljs-list .hljs-built_in{color:#00193a;}.hljs-mono-blue .hljs-keyword,.hljs-mono-blue .hljs-title,.hljs-mono-blue .hljs-important,.hljs-mono-blue .hljs-request,.hljs-mono-blue .hljs-header,.hljs-mono-blue .hljs-javadoctag{font-weight:bold;}.hljs-mono-blue .hljs-comment,.hljs-mono-blue .hljs-chunk{color:#738191;}.hljs-mono-blue .hljs-string,.hljs-mono-blue .hljs-title,.hljs-mono-blue .hljs-parent,.hljs-mono-blue .hljs-built_in,.hljs-mono-blue .hljs-literal,.hljs-mono-blue .hljs-filename,.hljs-mono-blue .hljs-value,.hljs-mono-blue .hljs-addition,.hljs-mono-blue .hljs-tag,.hljs-mono-blue .hljs-argument,.hljs-mono-blue .hljs-link_label,.hljs-mono-blue .hljs-blockquote,.hljs-mono-blue .hljs-header,.hljs-mono-blue .hljs-name{color:#0048ab;}.hljs-mono-blue .hljs-decorator,.hljs-mono-blue .hljs-prompt,.hljs-mono-blue .hljs-yardoctag,.hljs-mono-blue .hljs-subst,.hljs-mono-blue .hljs-symbol,.hljs-mono-blue .hljs-doctype,.hljs-mono-blue .hljs-regexp,.hljs-mono-blue .hljs-preprocessor,.hljs-mono-blue .hljs-pragma,.hljs-mono-blue .hljs-pi,.hljs-mono-blue .hljs-attribute,.hljs-mono-blue .hljs-attr_selector,.hljs-mono-blue .hljs-javadoc,.hljs-mono-blue .hljs-xmlDocTag,.hljs-mono-blue .hljs-deletion,.hljs-mono-blue .hljs-shebang,.hljs-mono-blue .hljs-string .hljs-variable,.hljs-mono-blue .hljs-link_url,.hljs-mono-blue .hljs-bullet,.hljs-mono-blue .hljs-sqbracket,.hljs-mono-blue .hljs-phony{color:#4c81c9;}","monokai":".hljs-monokai{}.hljs-monokai .hljs{display:block;overflow-x:auto;padding:0.5em;background:#272822;-webkit-text-size-adjust:none;}.hljs-monokai .hljs-tag,.hljs-monokai .hljs-tag .hljs-title,.hljs-monokai .hljs-keyword,.hljs-monokai .hljs-literal,.hljs-monokai .hljs-strong,.hljs-monokai .hljs-change,.hljs-monokai .hljs-winutils,.hljs-monokai .hljs-flow,.hljs-monokai .nginx .hljs-title,.hljs-monokai .tex .hljs-special{color:#f92672;}.hljs-monokai .hljs{color:#ddd;}.hljs-monokai .hljs .hljs-constant,.hljs-monokai .asciidoc .hljs-code,.hljs-monokai .markdown .hljs-code{color:#66d9ef;}.hljs-monokai .hljs-code,.hljs-monokai .hljs-class .hljs-title,.hljs-monokai .hljs-header{color:white;}.hljs-monokai .hljs-link_label,.hljs-monokai .hljs-attribute,.hljs-monokai .hljs-symbol,.hljs-monokai .hljs-symbol .hljs-string,.hljs-monokai .hljs-value,.hljs-monokai .hljs-regexp{color:#bf79db;}.hljs-monokai .hljs-link_url,.hljs-monokai .hljs-tag .hljs-value,.hljs-monokai .hljs-string,.hljs-monokai .hljs-bullet,.hljs-monokai .hljs-subst,.hljs-monokai .hljs-title,.hljs-monokai .hljs-emphasis,.hljs-monokai .hljs-type,.hljs-monokai .hljs-preprocessor,.hljs-monokai .hljs-pragma,.hljs-monokai .ruby .hljs-class .hljs-parent,.hljs-monokai .hljs-built_in,.hljs-monokai .django .hljs-template_tag,.hljs-monokai .django .hljs-variable,.hljs-monokai .smalltalk .hljs-class,.hljs-monokai .hljs-javadoc,.hljs-monokai .django .hljs-filter .hljs-argument,.hljs-monokai .smalltalk .hljs-localvars,.hljs-monokai .smalltalk .hljs-array,.hljs-monokai .hljs-attr_selector,.hljs-monokai .hljs-pseudo,.hljs-monokai .hljs-addition,.hljs-monokai .hljs-stream,.hljs-monokai .hljs-envvar,.hljs-monokai .apache .hljs-tag,.hljs-monokai .apache .hljs-cbracket,.hljs-monokai .tex .hljs-command,.hljs-monokai .hljs-prompt,.hljs-monokai .hljs-name{color:#a6e22e;}.hljs-monokai .hljs-comment,.hljs-monokai .hljs-annotation,.hljs-monokai .smartquote,.hljs-monokai .hljs-blockquote,.hljs-monokai .hljs-horizontal_rule,.hljs-monokai .hljs-decorator,.hljs-monokai .hljs-pi,.hljs-monokai .hljs-doctype,.hljs-monokai .hljs-deletion,.hljs-monokai .hljs-shebang,.hljs-monokai .apache .hljs-sqbracket,.hljs-monokai .tex .hljs-formula{color:#75715e;}.hljs-monokai .hljs-keyword,.hljs-monokai .hljs-literal,.hljs-monokai .css .hljs-id,.hljs-monokai .hljs-phpdoc,.hljs-monokai .hljs-dartdoc,.hljs-monokai .hljs-title,.hljs-monokai .hljs-header,.hljs-monokai .hljs-type,.hljs-monokai .vbscript .hljs-built_in,.hljs-monokai .rsl .hljs-built_in,.hljs-monokai .smalltalk .hljs-class,.hljs-monokai .diff .hljs-header,.hljs-monokai .hljs-chunk,.hljs-monokai .hljs-winutils,.hljs-monokai .bash .hljs-variable,.hljs-monokai .apache .hljs-tag,.hljs-monokai .tex .hljs-special,.hljs-monokai .hljs-request,.hljs-monokai .hljs-status{font-weight:bold;}.hljs-monokai .coffeescript .javascript,.hljs-monokai .javascript .xml,.hljs-monokai .tex .hljs-formula,.hljs-monokai .xml .javascript,.hljs-monokai .xml .vbscript,.hljs-monokai .xml .css,.hljs-monokai .xml .hljs-cdata{opacity:0.5;}","monokai_sublime":".hljs-monokai_sublime{}.hljs-monokai_sublime .hljs{display:block;overflow-x:auto;padding:0.5em;background:#23241f;-webkit-text-size-adjust:none;}.hljs-monokai_sublime .hljs,.hljs-monokai_sublime .hljs-tag,.hljs-monokai_sublime .css .hljs-rule,.hljs-monokai_sublime .css .hljs-value,.hljs-monokai_sublime .aspectj .hljs-function,.hljs-monokai_sublime .css .hljs-function .hljs-preprocessor,.hljs-monokai_sublime .hljs-pragma{color:#f8f8f2;}.hljs-monokai_sublime .hljs-strongemphasis,.hljs-monokai_sublime .hljs-strong,.hljs-monokai_sublime .hljs-emphasis{color:#a8a8a2;}.hljs-monokai_sublime .hljs-bullet,.hljs-monokai_sublime .hljs-blockquote,.hljs-monokai_sublime .hljs-horizontal_rule,.hljs-monokai_sublime .hljs-number,.hljs-monokai_sublime .hljs-regexp,.hljs-monokai_sublime .alias .hljs-keyword,.hljs-monokai_sublime .hljs-literal,.hljs-monokai_sublime .hljs-hexcolor{color:#ae81ff;}.hljs-monokai_sublime .hljs-tag .hljs-value,.hljs-monokai_sublime .hljs-code,.hljs-monokai_sublime .hljs-title,.hljs-monokai_sublime .css .hljs-class,.hljs-monokai_sublime .hljs-class .hljs-title:last-child{color:#a6e22e;}.hljs-monokai_sublime .hljs-link_url{font-size:80%;}.hljs-monokai_sublime .hljs-strong,.hljs-monokai_sublime .hljs-strongemphasis{font-weight:bold;}.hljs-monokai_sublime .hljs-emphasis,.hljs-monokai_sublime .hljs-strongemphasis,.hljs-monokai_sublime .hljs-class .hljs-title:last-child,.hljs-monokai_sublime .hljs-typename{font-style:italic;}.hljs-monokai_sublime .hljs-keyword,.hljs-monokai_sublime .ruby .hljs-class .hljs-keyword:first-child,.hljs-monokai_sublime .ruby .hljs-function .hljs-keyword,.hljs-monokai_sublime .hljs-function,.hljs-monokai_sublime .hljs-change,.hljs-monokai_sublime .hljs-winutils,.hljs-monokai_sublime .hljs-flow,.hljs-monokai_sublime .nginx .hljs-title,.hljs-monokai_sublime .tex .hljs-special,.hljs-monokai_sublime .hljs-header,.hljs-monokai_sublime .hljs-attribute,.hljs-monokai_sublime .hljs-symbol,.hljs-monokai_sublime .hljs-symbol .hljs-string,.hljs-monokai_sublime .hljs-tag .hljs-title,.hljs-monokai_sublime .hljs-value,.hljs-monokai_sublime .alias .hljs-keyword:first-child,.hljs-monokai_sublime .css .hljs-tag,.hljs-monokai_sublime .css .unit,.hljs-monokai_sublime .css .hljs-important{color:#f92672;}.hljs-monokai_sublime .hljs-function .hljs-keyword,.hljs-monokai_sublime .hljs-class .hljs-keyword:first-child,.hljs-monokai_sublime .hljs-aspect .hljs-keyword:first-child,.hljs-monokai_sublime .hljs-constant,.hljs-monokai_sublime .hljs-typename,.hljs-monokai_sublime .hljs-name,.hljs-monokai_sublime .css .hljs-attribute{color:#66d9ef;}.hljs-monokai_sublime .hljs-variable,.hljs-monokai_sublime .hljs-params,.hljs-monokai_sublime .hljs-class .hljs-title,.hljs-monokai_sublime .hljs-aspect .hljs-title{color:#f8f8f2;}.hljs-monokai_sublime .hljs-string,.hljs-monokai_sublime .css .hljs-id,.hljs-monokai_sublime .hljs-subst,.hljs-monokai_sublime .hljs-type,.hljs-monokai_sublime .ruby .hljs-class .hljs-parent,.hljs-monokai_sublime .hljs-built_in,.hljs-monokai_sublime .django .hljs-template_tag,.hljs-monokai_sublime .django .hljs-variable,.hljs-monokai_sublime .smalltalk .hljs-class,.hljs-monokai_sublime .django .hljs-filter .hljs-argument,.hljs-monokai_sublime .smalltalk .hljs-localvars,.hljs-monokai_sublime .smalltalk .hljs-array,.hljs-monokai_sublime .hljs-attr_selector,.hljs-monokai_sublime .hljs-pseudo,.hljs-monokai_sublime .hljs-addition,.hljs-monokai_sublime .hljs-stream,.hljs-monokai_sublime .hljs-envvar,.hljs-monokai_sublime .apache .hljs-tag,.hljs-monokai_sublime .apache .hljs-cbracket,.hljs-monokai_sublime .tex .hljs-command,.hljs-monokai_sublime .hljs-prompt,.hljs-monokai_sublime .hljs-link_label,.hljs-monokai_sublime .hljs-link_url{color:#e6db74;}.hljs-monokai_sublime .hljs-comment,.hljs-monokai_sublime .hljs-javadoc,.hljs-monokai_sublime .hljs-annotation,.hljs-monokai_sublime .hljs-decorator,.hljs-monokai_sublime .hljs-pi,.hljs-monokai_sublime .hljs-doctype,.hljs-monokai_sublime .hljs-deletion,.hljs-monokai_sublime .hljs-shebang,.hljs-monokai_sublime .apache .hljs-sqbracket,.hljs-monokai_sublime .tex .hljs-formula{color:#75715e;}.hljs-monokai_sublime .coffeescript .javascript,.hljs-monokai_sublime .javascript .xml,.hljs-monokai_sublime .tex .hljs-formula,.hljs-monokai_sublime .xml .javascript,.hljs-monokai_sublime .xml .vbscript,.hljs-monokai_sublime .xml .css,.hljs-monokai_sublime .xml .hljs-cdata,.hljs-monokai_sublime .xml .php,.hljs-monokai_sublime .php .xml{opacity:0.5;}","obsidian":".hljs-obsidian{}.hljs-obsidian .hljs{display:block;overflow-x:auto;padding:0.5em;background:#282b2e;-webkit-text-size-adjust:none;}.hljs-obsidian .hljs-keyword,.hljs-obsidian .hljs-literal,.hljs-obsidian .hljs-change,.hljs-obsidian .hljs-winutils,.hljs-obsidian .hljs-flow,.hljs-obsidian .nginx .hljs-title,.hljs-obsidian .css .hljs-id,.hljs-obsidian .tex .hljs-special{color:#93c763;}.hljs-obsidian .hljs-number{color:#ffcd22;}.hljs-obsidian .hljs{color:#e0e2e4;}.hljs-obsidian .css .hljs-tag,.hljs-obsidian .css .hljs-pseudo{color:#d0d2b5;}.hljs-obsidian .hljs-attribute,.hljs-obsidian .hljs .hljs-constant{color:#668bb0;}.hljs-obsidian .xml .hljs-attribute{color:#b3b689;}.hljs-obsidian .xml .hljs-tag .hljs-value{color:#e8e2b7;}.hljs-obsidian .hljs-code,.hljs-obsidian .hljs-class .hljs-title,.hljs-obsidian .hljs-header{color:white;}.hljs-obsidian .hljs-class,.hljs-obsidian .hljs-hexcolor{color:#93c763;}.hljs-obsidian .hljs-regexp{color:#d39745;}.hljs-obsidian .hljs-at_rule,.hljs-obsidian .hljs-at_rule .hljs-keyword{color:#a082bd;}.hljs-obsidian .hljs-doctype{color:#557182;}.hljs-obsidian .hljs-link_url,.hljs-obsidian .hljs-tag,.hljs-obsidian .hljs-tag .hljs-title,.hljs-obsidian .hljs-bullet,.hljs-obsidian .hljs-subst,.hljs-obsidian .hljs-emphasis,.hljs-obsidian .hljs-type,.hljs-obsidian .hljs-preprocessor,.hljs-obsidian .hljs-pragma,.hljs-obsidian .ruby .hljs-class .hljs-parent,.hljs-obsidian .hljs-built_in,.hljs-obsidian .django .hljs-template_tag,.hljs-obsidian .django .hljs-variable,.hljs-obsidian .smalltalk .hljs-class,.hljs-obsidian .hljs-javadoc,.hljs-obsidian .django .hljs-filter .hljs-argument,.hljs-obsidian .smalltalk .hljs-localvars,.hljs-obsidian .smalltalk .hljs-array,.hljs-obsidian .hljs-attr_selector,.hljs-obsidian .hljs-pseudo,.hljs-obsidian .hljs-addition,.hljs-obsidian .hljs-stream,.hljs-obsidian .hljs-envvar,.hljs-obsidian .apache .hljs-tag,.hljs-obsidian .apache .hljs-cbracket,.hljs-obsidian .tex .hljs-command,.hljs-obsidian .hljs-prompt,.hljs-obsidian .hljs-name{color:#8cbbad;}.hljs-obsidian .hljs-string{color:#ec7600;}.hljs-obsidian .hljs-comment,.hljs-obsidian .hljs-annotation,.hljs-obsidian .hljs-blockquote,.hljs-obsidian .hljs-horizontal_rule,.hljs-obsidian .hljs-decorator,.hljs-obsidian .hljs-pi,.hljs-obsidian .hljs-deletion,.hljs-obsidian .hljs-shebang,.hljs-obsidian .apache .hljs-sqbracket,.hljs-obsidian .tex .hljs-formula{color:#818e96;}.hljs-obsidian .hljs-keyword,.hljs-obsidian .hljs-literal,.hljs-obsidian .css .hljs-id,.hljs-obsidian .hljs-phpdoc,.hljs-obsidian .hljs-dartdoc,.hljs-obsidian .hljs-title,.hljs-obsidian .hljs-header,.hljs-obsidian .hljs-type,.hljs-obsidian .vbscript .hljs-built_in,.hljs-obsidian .rsl .hljs-built_in,.hljs-obsidian .smalltalk .hljs-class,.hljs-obsidian .diff .hljs-header,.hljs-obsidian .hljs-chunk,.hljs-obsidian .hljs-winutils,.hljs-obsidian .bash .hljs-variable,.hljs-obsidian .apache .hljs-tag,.hljs-obsidian .tex .hljs-special,.hljs-obsidian .hljs-request,.hljs-obsidian .hljs-at_rule .hljs-keyword,.hljs-obsidian .hljs-status{font-weight:bold;}.hljs-obsidian .coffeescript .javascript,.hljs-obsidian .javascript .xml,.hljs-obsidian .tex .hljs-formula,.hljs-obsidian .xml .javascript,.hljs-obsidian .xml .vbscript,.hljs-obsidian .xml .css,.hljs-obsidian .xml .hljs-cdata{opacity:0.5;}","paraiso.dark":".hljs-paraiso.dark{}.hljs-paraiso.dark .hljs-comment,.hljs-paraiso.dark .hljs-title{color:#8d8687;}.hljs-paraiso.dark .hljs-variable,.hljs-paraiso.dark .hljs-attribute,.hljs-paraiso.dark .hljs-tag,.hljs-paraiso.dark .hljs-regexp,.hljs-paraiso.dark .hljs-name,.hljs-paraiso.dark .ruby .hljs-constant,.hljs-paraiso.dark .xml .hljs-tag .hljs-title,.hljs-paraiso.dark .xml .hljs-pi,.hljs-paraiso.dark .xml .hljs-doctype,.hljs-paraiso.dark .html .hljs-doctype,.hljs-paraiso.dark .css .hljs-id,.hljs-paraiso.dark .css .hljs-class,.hljs-paraiso.dark .css .hljs-pseudo{color:#ef6155;}.hljs-paraiso.dark .hljs-number,.hljs-paraiso.dark .hljs-preprocessor,.hljs-paraiso.dark .hljs-built_in,.hljs-paraiso.dark .hljs-literal,.hljs-paraiso.dark .hljs-params,.hljs-paraiso.dark .hljs-constant{color:#f99b15;}.hljs-paraiso.dark .ruby .hljs-class .hljs-title,.hljs-paraiso.dark .css .hljs-rule .hljs-attribute{color:#fec418;}.hljs-paraiso.dark .hljs-string,.hljs-paraiso.dark .hljs-value,.hljs-paraiso.dark .hljs-inheritance,.hljs-paraiso.dark .hljs-header,.hljs-paraiso.dark .ruby .hljs-symbol,.hljs-paraiso.dark .xml .hljs-cdata{color:#48b685;}.hljs-paraiso.dark .css .hljs-hexcolor{color:#5bc4bf;}.hljs-paraiso.dark .hljs-function,.hljs-paraiso.dark .python .hljs-decorator,.hljs-paraiso.dark .python .hljs-title,.hljs-paraiso.dark .ruby .hljs-function .hljs-title,.hljs-paraiso.dark .ruby .hljs-title .hljs-keyword,.hljs-paraiso.dark .perl .hljs-sub,.hljs-paraiso.dark .javascript .hljs-title,.hljs-paraiso.dark .coffeescript .hljs-title{color:#06b6ef;}.hljs-paraiso.dark .hljs-keyword,.hljs-paraiso.dark .javascript .hljs-function{color:#815ba4;}.hljs-paraiso.dark .hljs{display:block;overflow-x:auto;background:#2f1e2e;color:#a39e9b;padding:0.5em;-webkit-text-size-adjust:none;}.hljs-paraiso.dark .coffeescript .javascript,.hljs-paraiso.dark .javascript .xml,.hljs-paraiso.dark .tex .hljs-formula,.hljs-paraiso.dark .xml .javascript,.hljs-paraiso.dark .xml .vbscript,.hljs-paraiso.dark .xml .css,.hljs-paraiso.dark .xml .hljs-cdata{opacity:0.5;}","paraiso.light":".hljs-paraiso.light{}.hljs-paraiso.light .hljs-comment,.hljs-paraiso.light .hljs-title{color:#776e71;}.hljs-paraiso.light .hljs-variable,.hljs-paraiso.light .hljs-attribute,.hljs-paraiso.light .hljs-tag,.hljs-paraiso.light .hljs-regexp,.hljs-paraiso.light .hljs-name,.hljs-paraiso.light .ruby .hljs-constant,.hljs-paraiso.light .xml .hljs-tag .hljs-title,.hljs-paraiso.light .xml .hljs-pi,.hljs-paraiso.light .xml .hljs-doctype,.hljs-paraiso.light .html .hljs-doctype,.hljs-paraiso.light .css .hljs-id,.hljs-paraiso.light .css .hljs-class,.hljs-paraiso.light .css .hljs-pseudo{color:#ef6155;}.hljs-paraiso.light .hljs-number,.hljs-paraiso.light .hljs-preprocessor,.hljs-paraiso.light .hljs-built_in,.hljs-paraiso.light .hljs-literal,.hljs-paraiso.light .hljs-params,.hljs-paraiso.light .hljs-constant{color:#f99b15;}.hljs-paraiso.light .ruby .hljs-class .hljs-title,.hljs-paraiso.light .css .hljs-rule .hljs-attribute{color:#fec418;}.hljs-paraiso.light .hljs-string,.hljs-paraiso.light .hljs-value,.hljs-paraiso.light .hljs-inheritance,.hljs-paraiso.light .hljs-header,.hljs-paraiso.light .ruby .hljs-symbol,.hljs-paraiso.light .xml .hljs-cdata{color:#48b685;}.hljs-paraiso.light .css .hljs-hexcolor{color:#5bc4bf;}.hljs-paraiso.light .hljs-function,.hljs-paraiso.light .python .hljs-decorator,.hljs-paraiso.light .python .hljs-title,.hljs-paraiso.light .ruby .hljs-function .hljs-title,.hljs-paraiso.light .ruby .hljs-title .hljs-keyword,.hljs-paraiso.light .perl .hljs-sub,.hljs-paraiso.light .javascript .hljs-title,.hljs-paraiso.light .coffeescript .hljs-title{color:#06b6ef;}.hljs-paraiso.light .hljs-keyword,.hljs-paraiso.light .javascript .hljs-function{color:#815ba4;}.hljs-paraiso.light .hljs{display:block;overflow-x:auto;background:#e7e9db;color:#4f424c;padding:0.5em;-webkit-text-size-adjust:none;}.hljs-paraiso.light .coffeescript .javascript,.hljs-paraiso.light .javascript .xml,.hljs-paraiso.light .tex .hljs-formula,.hljs-paraiso.light .xml .javascript,.hljs-paraiso.light .xml .vbscript,.hljs-paraiso.light .xml .css,.hljs-paraiso.light .xml .hljs-cdata{opacity:0.5;}","railscasts":".hljs-railscasts{}.hljs-railscasts .hljs{display:block;overflow-x:auto;padding:0.5em;background:#232323;color:#e6e1dc;-webkit-text-size-adjust:none;}.hljs-railscasts .hljs-comment,.hljs-railscasts .hljs-javadoc,.hljs-railscasts .hljs-shebang{color:#bc9458;font-style:italic;}.hljs-railscasts .hljs-keyword,.hljs-railscasts .ruby .hljs-function .hljs-keyword,.hljs-railscasts .hljs-request,.hljs-railscasts .hljs-status,.hljs-railscasts .nginx .hljs-title,.hljs-railscasts .method,.hljs-railscasts .hljs-list .hljs-title{color:#c26230;}.hljs-railscasts .hljs-string,.hljs-railscasts .hljs-number,.hljs-railscasts .hljs-regexp,.hljs-railscasts .hljs-tag .hljs-value,.hljs-railscasts .hljs-cdata,.hljs-railscasts .hljs-filter .hljs-argument,.hljs-railscasts .hljs-attr_selector,.hljs-railscasts .apache .hljs-cbracket,.hljs-railscasts .hljs-date,.hljs-railscasts .tex .hljs-command,.hljs-railscasts .asciidoc .hljs-link_label,.hljs-railscasts .markdown .hljs-link_label{color:#a5c261;}.hljs-railscasts .hljs-subst{color:#519f50;}.hljs-railscasts .hljs-tag,.hljs-railscasts .hljs-tag .hljs-keyword,.hljs-railscasts .hljs-tag .hljs-title,.hljs-railscasts .hljs-doctype,.hljs-railscasts .hljs-sub .hljs-identifier,.hljs-railscasts .hljs-pi,.hljs-railscasts .input_number{color:#e8bf6a;}.hljs-railscasts .hljs-identifier{color:#d0d0ff;}.hljs-railscasts .hljs-class .hljs-title,.hljs-railscasts .hljs-type,.hljs-railscasts .smalltalk .hljs-class,.hljs-railscasts .hljs-javadoctag,.hljs-railscasts .hljs-yardoctag,.hljs-railscasts .hljs-phpdoc,.hljs-railscasts .hljs-dartdoc{text-decoration:none;}.hljs-railscasts .hljs-constant,.hljs-railscasts .hljs-name{color:#da4939;}.hljs-railscasts .hljs-symbol,.hljs-railscasts .hljs-built_in,.hljs-railscasts .ruby .hljs-symbol .hljs-string,.hljs-railscasts .ruby .hljs-symbol .hljs-identifier,.hljs-railscasts .asciidoc .hljs-link_url,.hljs-railscasts .markdown .hljs-link_url,.hljs-railscasts .hljs-attribute{color:#6d9cbe;}.hljs-railscasts .asciidoc .hljs-link_url,.hljs-railscasts .markdown .hljs-link_url{text-decoration:underline;}.hljs-railscasts .hljs-params,.hljs-railscasts .hljs-variable,.hljs-railscasts .clojure .hljs-attribute{color:#d0d0ff;}.hljs-railscasts .css .hljs-tag,.hljs-railscasts .hljs-rule .hljs-property,.hljs-railscasts .hljs-pseudo,.hljs-railscasts .tex .hljs-special{color:#cda869;}.hljs-railscasts .css .hljs-class{color:#9b703f;}.hljs-railscasts .hljs-rule .hljs-keyword{color:#c5af75;}.hljs-railscasts .hljs-rule .hljs-value{color:#cf6a4c;}.hljs-railscasts .css .hljs-id{color:#8b98ab;}.hljs-railscasts .hljs-annotation,.hljs-railscasts .apache .hljs-sqbracket,.hljs-railscasts .nginx .hljs-built_in{color:#9b859d;}.hljs-railscasts .hljs-preprocessor,.hljs-railscasts .hljs-preprocessor *,.hljs-railscasts .hljs-pragma{color:#8996a8 !important;}.hljs-railscasts .hljs-hexcolor,.hljs-railscasts .css .hljs-value .hljs-number{color:#a5c261;}.hljs-railscasts .hljs-title,.hljs-railscasts .hljs-decorator,.hljs-railscasts .css .hljs-function{color:#ffc66d;}.hljs-railscasts .diff .hljs-header,.hljs-railscasts .hljs-chunk{background-color:#2f33ab;color:#e6e1dc;display:inline-block;width:100%;}.hljs-railscasts .diff .hljs-change{background-color:#4a410d;color:#f8f8f8;display:inline-block;width:100%;}.hljs-railscasts .hljs-addition{background-color:#144212;color:#e6e1dc;display:inline-block;width:100%;}.hljs-railscasts .hljs-deletion{background-color:#600;color:#e6e1dc;display:inline-block;width:100%;}.hljs-railscasts .coffeescript .javascript,.hljs-railscasts .javascript .xml,.hljs-railscasts .tex .hljs-formula,.hljs-railscasts .xml .javascript,.hljs-railscasts .xml .vbscript,.hljs-railscasts .xml .css,.hljs-railscasts .xml .hljs-cdata{opacity:0.7;}","rainbow":".hljs-rainbow{}.hljs-rainbow .hljs{display:block;overflow-x:auto;padding:0.5em;background:#474949;color:#d1d9e1;-webkit-text-size-adjust:none;}.hljs-rainbow .hljs-body,.hljs-rainbow .hljs-collection{color:#d1d9e1;}.hljs-rainbow .hljs-comment,.hljs-rainbow .diff .hljs-header,.hljs-rainbow .hljs-doctype,.hljs-rainbow .lisp .hljs-string,.hljs-rainbow .hljs-javadoc{color:#969896;font-style:italic;}.hljs-rainbow .hljs-keyword,.hljs-rainbow .clojure .hljs-attribute,.hljs-rainbow .hljs-winutils,.hljs-rainbow .javascript .hljs-title,.hljs-rainbow .hljs-addition,.hljs-rainbow .css .hljs-tag{color:#cc99cc;}.hljs-rainbow .hljs-number{color:#f99157;}.hljs-rainbow .hljs-command,.hljs-rainbow .hljs-string,.hljs-rainbow .hljs-tag .hljs-value,.hljs-rainbow .hljs-phpdoc,.hljs-rainbow .hljs-dartdoc,.hljs-rainbow .tex .hljs-formula,.hljs-rainbow .hljs-regexp,.hljs-rainbow .hljs-hexcolor{color:#8abeb7;}.hljs-rainbow .hljs-title,.hljs-rainbow .hljs-localvars,.hljs-rainbow .hljs-function .hljs-title,.hljs-rainbow .hljs-chunk,.hljs-rainbow .hljs-decorator,.hljs-rainbow .hljs-built_in,.hljs-rainbow .hljs-identifier{color:#b5bd68;}.hljs-rainbow .hljs-class .hljs-keyword{color:#f2777a;}.hljs-rainbow .hljs-variable,.hljs-rainbow .smalltalk .hljs-number,.hljs-rainbow .hljs-constant,.hljs-rainbow .hljs-class .hljs-title,.hljs-rainbow .hljs-parent,.hljs-rainbow .haskell .hljs-label,.hljs-rainbow .hljs-id,.hljs-rainbow .hljs-name{color:#ffcc66;}.hljs-rainbow .hljs-tag .hljs-title,.hljs-rainbow .hljs-rule .hljs-property,.hljs-rainbow .django .hljs-tag .hljs-keyword{font-weight:bold;}.hljs-rainbow .hljs-attribute{color:#81a2be;}.hljs-rainbow .hljs-preprocessor,.hljs-rainbow .hljs-pragma,.hljs-rainbow .hljs-pi,.hljs-rainbow .hljs-shebang,.hljs-rainbow .hljs-symbol,.hljs-rainbow .hljs-symbol .hljs-string,.hljs-rainbow .diff .hljs-change,.hljs-rainbow .hljs-special,.hljs-rainbow .hljs-attr_selector,.hljs-rainbow .hljs-important,.hljs-rainbow .hljs-subst,.hljs-rainbow .hljs-cdata{color:#f99157;}.hljs-rainbow .hljs-deletion{color:#dc322f;}.hljs-rainbow .tex .hljs-formula{background:#eee8d5;}","solarized_dark":".hljs-solarized_dark{}.hljs-solarized_dark .hljs{display:block;overflow-x:auto;padding:0.5em;background:#002b36;color:#839496;-webkit-text-size-adjust:none;}.hljs-solarized_dark .hljs-comment,.hljs-solarized_dark .diff .hljs-header,.hljs-solarized_dark .hljs-doctype,.hljs-solarized_dark .hljs-pi,.hljs-solarized_dark .lisp .hljs-string,.hljs-solarized_dark .hljs-javadoc{color:#586e75;}.hljs-solarized_dark .hljs-keyword,.hljs-solarized_dark .hljs-winutils,.hljs-solarized_dark .method,.hljs-solarized_dark .hljs-addition,.hljs-solarized_dark .css .hljs-tag,.hljs-solarized_dark .hljs-request,.hljs-solarized_dark .hljs-status,.hljs-solarized_dark .nginx .hljs-title{color:#859900;}.hljs-solarized_dark .hljs-number,.hljs-solarized_dark .hljs-command,.hljs-solarized_dark .hljs-string,.hljs-solarized_dark .hljs-tag .hljs-value,.hljs-solarized_dark .hljs-rule .hljs-value,.hljs-solarized_dark .hljs-phpdoc,.hljs-solarized_dark .hljs-dartdoc,.hljs-solarized_dark .tex .hljs-formula,.hljs-solarized_dark .hljs-regexp,.hljs-solarized_dark .hljs-hexcolor,.hljs-solarized_dark .hljs-link_url{color:#2aa198;}.hljs-solarized_dark .hljs-title,.hljs-solarized_dark .hljs-localvars,.hljs-solarized_dark .hljs-chunk,.hljs-solarized_dark .hljs-decorator,.hljs-solarized_dark .hljs-built_in,.hljs-solarized_dark .hljs-identifier,.hljs-solarized_dark .vhdl .hljs-literal,.hljs-solarized_dark .hljs-id,.hljs-solarized_dark .css .hljs-function,.hljs-solarized_dark .hljs-name{color:#268bd2;}.hljs-solarized_dark .hljs-attribute,.hljs-solarized_dark .hljs-variable,.hljs-solarized_dark .lisp .hljs-body,.hljs-solarized_dark .smalltalk .hljs-number,.hljs-solarized_dark .hljs-constant,.hljs-solarized_dark .hljs-class .hljs-title,.hljs-solarized_dark .hljs-parent,.hljs-solarized_dark .hljs-type,.hljs-solarized_dark .hljs-link_reference{color:#b58900;}.hljs-solarized_dark .hljs-preprocessor,.hljs-solarized_dark .hljs-preprocessor .hljs-keyword,.hljs-solarized_dark .hljs-pragma,.hljs-solarized_dark .hljs-shebang,.hljs-solarized_dark .hljs-symbol,.hljs-solarized_dark .hljs-symbol .hljs-string,.hljs-solarized_dark .diff .hljs-change,.hljs-solarized_dark .hljs-special,.hljs-solarized_dark .hljs-attr_selector,.hljs-solarized_dark .hljs-subst,.hljs-solarized_dark .hljs-cdata,.hljs-solarized_dark .css .hljs-pseudo,.hljs-solarized_dark .hljs-header{color:#cb4b16;}.hljs-solarized_dark .hljs-deletion,.hljs-solarized_dark .hljs-important{color:#dc322f;}.hljs-solarized_dark .hljs-link_label{color:#6c71c4;}.hljs-solarized_dark .tex .hljs-formula{background:#073642;}","solarized_light":".hljs-solarized_light{}.hljs-solarized_light .hljs{display:block;overflow-x:auto;padding:0.5em;background:#fdf6e3;color:#657b83;-webkit-text-size-adjust:none;}.hljs-solarized_light .hljs-comment,.hljs-solarized_light .diff .hljs-header,.hljs-solarized_light .hljs-doctype,.hljs-solarized_light .hljs-pi,.hljs-solarized_light .lisp .hljs-string,.hljs-solarized_light .hljs-javadoc{color:#93a1a1;}.hljs-solarized_light .hljs-keyword,.hljs-solarized_light .hljs-winutils,.hljs-solarized_light .method,.hljs-solarized_light .hljs-addition,.hljs-solarized_light .css .hljs-tag,.hljs-solarized_light .hljs-request,.hljs-solarized_light .hljs-status,.hljs-solarized_light .nginx .hljs-title{color:#859900;}.hljs-solarized_light .hljs-number,.hljs-solarized_light .hljs-command,.hljs-solarized_light .hljs-string,.hljs-solarized_light .hljs-tag .hljs-value,.hljs-solarized_light .hljs-rule .hljs-value,.hljs-solarized_light .hljs-phpdoc,.hljs-solarized_light .hljs-dartdoc,.hljs-solarized_light .tex .hljs-formula,.hljs-solarized_light .hljs-regexp,.hljs-solarized_light .hljs-hexcolor,.hljs-solarized_light .hljs-link_url{color:#2aa198;}.hljs-solarized_light .hljs-title,.hljs-solarized_light .hljs-localvars,.hljs-solarized_light .hljs-chunk,.hljs-solarized_light .hljs-decorator,.hljs-solarized_light .hljs-built_in,.hljs-solarized_light .hljs-identifier,.hljs-solarized_light .vhdl .hljs-literal,.hljs-solarized_light .hljs-id,.hljs-solarized_light .css .hljs-function,.hljs-solarized_light .hljs-name{color:#268bd2;}.hljs-solarized_light .hljs-attribute,.hljs-solarized_light .hljs-variable,.hljs-solarized_light .lisp .hljs-body,.hljs-solarized_light .smalltalk .hljs-number,.hljs-solarized_light .hljs-constant,.hljs-solarized_light .hljs-class .hljs-title,.hljs-solarized_light .hljs-parent,.hljs-solarized_light .hljs-type,.hljs-solarized_light .hljs-link_reference{color:#b58900;}.hljs-solarized_light .hljs-preprocessor,.hljs-solarized_light .hljs-preprocessor .hljs-keyword,.hljs-solarized_light .hljs-pragma,.hljs-solarized_light .hljs-shebang,.hljs-solarized_light .hljs-symbol,.hljs-solarized_light .hljs-symbol .hljs-string,.hljs-solarized_light .diff .hljs-change,.hljs-solarized_light .hljs-special,.hljs-solarized_light .hljs-attr_selector,.hljs-solarized_light .hljs-subst,.hljs-solarized_light .hljs-cdata,.hljs-solarized_light .css .hljs-pseudo,.hljs-solarized_light .hljs-header{color:#cb4b16;}.hljs-solarized_light .hljs-deletion,.hljs-solarized_light .hljs-important{color:#dc322f;}.hljs-solarized_light .hljs-link_label{color:#6c71c4;}.hljs-solarized_light .tex .hljs-formula{background:#eee8d5;}","sunburst":".hljs-sunburst{}.hljs-sunburst .hljs{display:block;overflow-x:auto;padding:0.5em;background:#000;color:#f8f8f8;-webkit-text-size-adjust:none;}.hljs-sunburst .hljs-comment,.hljs-sunburst .hljs-javadoc{color:#aeaeae;font-style:italic;}.hljs-sunburst .hljs-keyword,.hljs-sunburst .ruby .hljs-function .hljs-keyword,.hljs-sunburst .hljs-request,.hljs-sunburst .hljs-status,.hljs-sunburst .nginx .hljs-title{color:#e28964;}.hljs-sunburst .hljs-function .hljs-keyword,.hljs-sunburst .hljs-sub .hljs-keyword,.hljs-sunburst .method,.hljs-sunburst .hljs-list .hljs-title{color:#99cf50;}.hljs-sunburst .hljs-string,.hljs-sunburst .hljs-tag .hljs-value,.hljs-sunburst .hljs-cdata,.hljs-sunburst .hljs-filter .hljs-argument,.hljs-sunburst .hljs-attr_selector,.hljs-sunburst .apache .hljs-cbracket,.hljs-sunburst .hljs-date,.hljs-sunburst .tex .hljs-command,.hljs-sunburst .coffeescript .hljs-attribute,.hljs-sunburst .hljs-name{color:#65b042;}.hljs-sunburst .hljs-subst{color:#daefa3;}.hljs-sunburst .hljs-regexp{color:#e9c062;}.hljs-sunburst .hljs-title,.hljs-sunburst .hljs-sub .hljs-identifier,.hljs-sunburst .hljs-pi,.hljs-sunburst .hljs-tag,.hljs-sunburst .hljs-tag .hljs-keyword,.hljs-sunburst .hljs-decorator,.hljs-sunburst .hljs-shebang,.hljs-sunburst .hljs-prompt{color:#89bdff;}.hljs-sunburst .hljs-class .hljs-title,.hljs-sunburst .hljs-type,.hljs-sunburst .smalltalk .hljs-class,.hljs-sunburst .hljs-javadoctag,.hljs-sunburst .hljs-yardoctag,.hljs-sunburst .hljs-phpdoc,.hljs-sunburst .hljs-dartdoc{text-decoration:underline;}.hljs-sunburst .hljs-symbol,.hljs-sunburst .ruby .hljs-symbol .hljs-string,.hljs-sunburst .hljs-number{color:#3387cc;}.hljs-sunburst .hljs-params,.hljs-sunburst .hljs-variable,.hljs-sunburst .clojure .hljs-attribute{color:#3e87e3;}.hljs-sunburst .css .hljs-tag,.hljs-sunburst .hljs-rule .hljs-property,.hljs-sunburst .hljs-pseudo,.hljs-sunburst .tex .hljs-special{color:#cda869;}.hljs-sunburst .css .hljs-class{color:#9b703f;}.hljs-sunburst .hljs-rule .hljs-keyword{color:#c5af75;}.hljs-sunburst .hljs-rule .hljs-value{color:#cf6a4c;}.hljs-sunburst .css .hljs-id{color:#8b98ab;}.hljs-sunburst .hljs-annotation,.hljs-sunburst .apache .hljs-sqbracket,.hljs-sunburst .nginx .hljs-built_in{color:#9b859d;}.hljs-sunburst .hljs-preprocessor,.hljs-sunburst .hljs-pragma{color:#8996a8;}.hljs-sunburst .hljs-hexcolor,.hljs-sunburst .css .hljs-value .hljs-number{color:#dd7b3b;}.hljs-sunburst .css .hljs-function{color:#dad085;}.hljs-sunburst .diff .hljs-header,.hljs-sunburst .hljs-chunk,.hljs-sunburst .tex .hljs-formula{background-color:#0e2231;color:#f8f8f8;font-style:italic;}.hljs-sunburst .diff .hljs-change{background-color:#4a410d;color:#f8f8f8;}.hljs-sunburst .hljs-addition{background-color:#253b22;color:#f8f8f8;}.hljs-sunburst .hljs-deletion{background-color:#420e09;color:#f8f8f8;}.hljs-sunburst .coffeescript .javascript,.hljs-sunburst .javascript .xml,.hljs-sunburst .tex .hljs-formula,.hljs-sunburst .xml .javascript,.hljs-sunburst .xml .vbscript,.hljs-sunburst .xml .css,.hljs-sunburst .xml .hljs-cdata{opacity:0.5;}","tomorrow-night-blue":".hljs-tomorrow-night-blue{}.hljs-tomorrow-night-blue .hljs-comment{color:#7285b7;}.hljs-tomorrow-night-blue .hljs-variable,.hljs-tomorrow-night-blue .hljs-attribute,.hljs-tomorrow-night-blue .hljs-tag,.hljs-tomorrow-night-blue .hljs-regexp,.hljs-tomorrow-night-blue .ruby .hljs-constant,.hljs-tomorrow-night-blue .xml .hljs-tag .hljs-title,.hljs-tomorrow-night-blue .xml .hljs-pi,.hljs-tomorrow-night-blue .xml .hljs-doctype,.hljs-tomorrow-night-blue .html .hljs-doctype,.hljs-tomorrow-night-blue .css .hljs-id,.hljs-tomorrow-night-blue .css .hljs-class,.hljs-tomorrow-night-blue .css .hljs-pseudo{color:#ff9da4;}.hljs-tomorrow-night-blue .hljs-number,.hljs-tomorrow-night-blue .hljs-preprocessor,.hljs-tomorrow-night-blue .hljs-pragma,.hljs-tomorrow-night-blue .hljs-built_in,.hljs-tomorrow-night-blue .hljs-literal,.hljs-tomorrow-night-blue .hljs-params,.hljs-tomorrow-night-blue .hljs-constant{color:#ffc58f;}.hljs-tomorrow-night-blue .ruby .hljs-class .hljs-title,.hljs-tomorrow-night-blue .css .hljs-rule .hljs-attribute{color:#ffeead;}.hljs-tomorrow-night-blue .hljs-string,.hljs-tomorrow-night-blue .hljs-value,.hljs-tomorrow-night-blue .hljs-inheritance,.hljs-tomorrow-night-blue .hljs-header,.hljs-tomorrow-night-blue .hljs-name,.hljs-tomorrow-night-blue .ruby .hljs-symbol,.hljs-tomorrow-night-blue .xml .hljs-cdata{color:#d1f1a9;}.hljs-tomorrow-night-blue .hljs-title,.hljs-tomorrow-night-blue .css .hljs-hexcolor{color:#99ffff;}.hljs-tomorrow-night-blue .hljs-function,.hljs-tomorrow-night-blue .python .hljs-decorator,.hljs-tomorrow-night-blue .python .hljs-title,.hljs-tomorrow-night-blue .ruby .hljs-function .hljs-title,.hljs-tomorrow-night-blue .ruby .hljs-title .hljs-keyword,.hljs-tomorrow-night-blue .perl .hljs-sub,.hljs-tomorrow-night-blue .javascript .hljs-title,.hljs-tomorrow-night-blue .coffeescript .hljs-title{color:#bbdaff;}.hljs-tomorrow-night-blue .hljs-keyword,.hljs-tomorrow-night-blue .javascript .hljs-function{color:#ebbbff;}.hljs-tomorrow-night-blue .hljs{display:block;overflow-x:auto;background:#002451;color:white;padding:0.5em;-webkit-text-size-adjust:none;}.hljs-tomorrow-night-blue .coffeescript .javascript,.hljs-tomorrow-night-blue .javascript .xml,.hljs-tomorrow-night-blue .tex .hljs-formula,.hljs-tomorrow-night-blue .xml .javascript,.hljs-tomorrow-night-blue .xml .vbscript,.hljs-tomorrow-night-blue .xml .css,.hljs-tomorrow-night-blue .xml .hljs-cdata{opacity:0.5;}","tomorrow-night-bright":".hljs-tomorrow-night-bright{}.hljs-tomorrow-night-bright .hljs-comment{color:#969896;}.hljs-tomorrow-night-bright .hljs-variable,.hljs-tomorrow-night-bright .hljs-attribute,.hljs-tomorrow-night-bright .hljs-tag,.hljs-tomorrow-night-bright .hljs-regexp,.hljs-tomorrow-night-bright .ruby .hljs-constant,.hljs-tomorrow-night-bright .xml .hljs-tag .hljs-title,.hljs-tomorrow-night-bright .xml .hljs-pi,.hljs-tomorrow-night-bright .xml .hljs-doctype,.hljs-tomorrow-night-bright .html .hljs-doctype,.hljs-tomorrow-night-bright .css .hljs-id,.hljs-tomorrow-night-bright .css .hljs-class,.hljs-tomorrow-night-bright .css .hljs-pseudo{color:#d54e53;}.hljs-tomorrow-night-bright .hljs-number,.hljs-tomorrow-night-bright .hljs-preprocessor,.hljs-tomorrow-night-bright .hljs-pragma,.hljs-tomorrow-night-bright .hljs-built_in,.hljs-tomorrow-night-bright .hljs-literal,.hljs-tomorrow-night-bright .hljs-params,.hljs-tomorrow-night-bright .hljs-constant{color:#e78c45;}.hljs-tomorrow-night-bright .ruby .hljs-class .hljs-title,.hljs-tomorrow-night-bright .css .hljs-rule .hljs-attribute{color:#e7c547;}.hljs-tomorrow-night-bright .hljs-string,.hljs-tomorrow-night-bright .hljs-value,.hljs-tomorrow-night-bright .hljs-inheritance,.hljs-tomorrow-night-bright .hljs-header,.hljs-tomorrow-night-bright .hljs-name,.hljs-tomorrow-night-bright .ruby .hljs-symbol,.hljs-tomorrow-night-bright .xml .hljs-cdata{color:#b9ca4a;}.hljs-tomorrow-night-bright .hljs-title,.hljs-tomorrow-night-bright .css .hljs-hexcolor{color:#70c0b1;}.hljs-tomorrow-night-bright .hljs-function,.hljs-tomorrow-night-bright .python .hljs-decorator,.hljs-tomorrow-night-bright .python .hljs-title,.hljs-tomorrow-night-bright .ruby .hljs-function .hljs-title,.hljs-tomorrow-night-bright .ruby .hljs-title .hljs-keyword,.hljs-tomorrow-night-bright .perl .hljs-sub,.hljs-tomorrow-night-bright .javascript .hljs-title,.hljs-tomorrow-night-bright .coffeescript .hljs-title{color:#7aa6da;}.hljs-tomorrow-night-bright .hljs-keyword,.hljs-tomorrow-night-bright .javascript .hljs-function{color:#c397d8;}.hljs-tomorrow-night-bright .hljs{display:block;overflow-x:auto;background:black;color:#eaeaea;padding:0.5em;-webkit-text-size-adjust:none;}.hljs-tomorrow-night-bright .coffeescript .javascript,.hljs-tomorrow-night-bright .javascript .xml,.hljs-tomorrow-night-bright .tex .hljs-formula,.hljs-tomorrow-night-bright .xml .javascript,.hljs-tomorrow-night-bright .xml .vbscript,.hljs-tomorrow-night-bright .xml .css,.hljs-tomorrow-night-bright .xml .hljs-cdata{opacity:0.5;}","tomorrow-night-eighties":".hljs-tomorrow-night-eighties{}.hljs-tomorrow-night-eighties .hljs-comment{color:#999999;}.hljs-tomorrow-night-eighties .hljs-variable,.hljs-tomorrow-night-eighties .hljs-attribute,.hljs-tomorrow-night-eighties .hljs-tag,.hljs-tomorrow-night-eighties .hljs-regexp,.hljs-tomorrow-night-eighties .ruby .hljs-constant,.hljs-tomorrow-night-eighties .xml .hljs-tag .hljs-title,.hljs-tomorrow-night-eighties .xml .hljs-pi,.hljs-tomorrow-night-eighties .xml .hljs-doctype,.hljs-tomorrow-night-eighties .html .hljs-doctype,.hljs-tomorrow-night-eighties .css .hljs-id,.hljs-tomorrow-night-eighties .css .hljs-class,.hljs-tomorrow-night-eighties .css .hljs-pseudo{color:#f2777a;}.hljs-tomorrow-night-eighties .hljs-number,.hljs-tomorrow-night-eighties .hljs-preprocessor,.hljs-tomorrow-night-eighties .hljs-pragma,.hljs-tomorrow-night-eighties .hljs-built_in,.hljs-tomorrow-night-eighties .hljs-literal,.hljs-tomorrow-night-eighties .hljs-params,.hljs-tomorrow-night-eighties .hljs-constant{color:#f99157;}.hljs-tomorrow-night-eighties .ruby .hljs-class .hljs-title,.hljs-tomorrow-night-eighties .css .hljs-rule .hljs-attribute{color:#ffcc66;}.hljs-tomorrow-night-eighties .hljs-string,.hljs-tomorrow-night-eighties .hljs-value,.hljs-tomorrow-night-eighties .hljs-inheritance,.hljs-tomorrow-night-eighties .hljs-header,.hljs-tomorrow-night-eighties .hljs-name,.hljs-tomorrow-night-eighties .ruby .hljs-symbol,.hljs-tomorrow-night-eighties .xml .hljs-cdata{color:#99cc99;}.hljs-tomorrow-night-eighties .hljs-title,.hljs-tomorrow-night-eighties .css .hljs-hexcolor{color:#66cccc;}.hljs-tomorrow-night-eighties .hljs-function,.hljs-tomorrow-night-eighties .python .hljs-decorator,.hljs-tomorrow-night-eighties .python .hljs-title,.hljs-tomorrow-night-eighties .ruby .hljs-function .hljs-title,.hljs-tomorrow-night-eighties .ruby .hljs-title .hljs-keyword,.hljs-tomorrow-night-eighties .perl .hljs-sub,.hljs-tomorrow-night-eighties .javascript .hljs-title,.hljs-tomorrow-night-eighties .coffeescript .hljs-title{color:#6699cc;}.hljs-tomorrow-night-eighties .hljs-keyword,.hljs-tomorrow-night-eighties .javascript .hljs-function{color:#cc99cc;}.hljs-tomorrow-night-eighties .hljs{display:block;overflow-x:auto;background:#2d2d2d;color:#cccccc;padding:0.5em;-webkit-text-size-adjust:none;}.hljs-tomorrow-night-eighties .coffeescript .javascript,.hljs-tomorrow-night-eighties .javascript .xml,.hljs-tomorrow-night-eighties .tex .hljs-formula,.hljs-tomorrow-night-eighties .xml .javascript,.hljs-tomorrow-night-eighties .xml .vbscript,.hljs-tomorrow-night-eighties .xml .css,.hljs-tomorrow-night-eighties .xml .hljs-cdata{opacity:0.5;}","tomorrow-night":".hljs-tomorrow-night{}.hljs-tomorrow-night .hljs-comment{color:#969896;}.hljs-tomorrow-night .hljs-variable,.hljs-tomorrow-night .hljs-attribute,.hljs-tomorrow-night .hljs-tag,.hljs-tomorrow-night .hljs-regexp,.hljs-tomorrow-night .ruby .hljs-constant,.hljs-tomorrow-night .xml .hljs-tag .hljs-title,.hljs-tomorrow-night .xml .hljs-pi,.hljs-tomorrow-night .xml .hljs-doctype,.hljs-tomorrow-night .html .hljs-doctype,.hljs-tomorrow-night .css .hljs-id,.hljs-tomorrow-night .css .hljs-class,.hljs-tomorrow-night .css .hljs-pseudo{color:#cc6666;}.hljs-tomorrow-night .hljs-number,.hljs-tomorrow-night .hljs-preprocessor,.hljs-tomorrow-night .hljs-pragma,.hljs-tomorrow-night .hljs-built_in,.hljs-tomorrow-night .hljs-literal,.hljs-tomorrow-night .hljs-params,.hljs-tomorrow-night .hljs-constant{color:#de935f;}.hljs-tomorrow-night .ruby .hljs-class .hljs-title,.hljs-tomorrow-night .css .hljs-rule .hljs-attribute{color:#f0c674;}.hljs-tomorrow-night .hljs-string,.hljs-tomorrow-night .hljs-value,.hljs-tomorrow-night .hljs-inheritance,.hljs-tomorrow-night .hljs-header,.hljs-tomorrow-night .hljs-name,.hljs-tomorrow-night .ruby .hljs-symbol,.hljs-tomorrow-night .xml .hljs-cdata{color:#b5bd68;}.hljs-tomorrow-night .hljs-title,.hljs-tomorrow-night .css .hljs-hexcolor{color:#8abeb7;}.hljs-tomorrow-night .hljs-function,.hljs-tomorrow-night .python .hljs-decorator,.hljs-tomorrow-night .python .hljs-title,.hljs-tomorrow-night .ruby .hljs-function .hljs-title,.hljs-tomorrow-night .ruby .hljs-title .hljs-keyword,.hljs-tomorrow-night .perl .hljs-sub,.hljs-tomorrow-night .javascript .hljs-title,.hljs-tomorrow-night .coffeescript .hljs-title{color:#81a2be;}.hljs-tomorrow-night .hljs-keyword,.hljs-tomorrow-night .javascript .hljs-function{color:#b294bb;}.hljs-tomorrow-night .hljs{display:block;overflow-x:auto;background:#1d1f21;color:#c5c8c6;padding:0.5em;-webkit-text-size-adjust:none;}.hljs-tomorrow-night .coffeescript .javascript,.hljs-tomorrow-night .javascript .xml,.hljs-tomorrow-night .tex .hljs-formula,.hljs-tomorrow-night .xml .javascript,.hljs-tomorrow-night .xml .vbscript,.hljs-tomorrow-night .xml .css,.hljs-tomorrow-night .xml .hljs-cdata{opacity:0.5;}","tomorrow":".hljs-tomorrow{}.hljs-tomorrow .hljs-comment{color:#8e908c;}.hljs-tomorrow .hljs-variable,.hljs-tomorrow .hljs-attribute,.hljs-tomorrow .hljs-tag,.hljs-tomorrow .hljs-regexp,.hljs-tomorrow .ruby .hljs-constant,.hljs-tomorrow .xml .hljs-tag .hljs-title,.hljs-tomorrow .xml .hljs-pi,.hljs-tomorrow .xml .hljs-doctype,.hljs-tomorrow .html .hljs-doctype,.hljs-tomorrow .css .hljs-id,.hljs-tomorrow .css .hljs-class,.hljs-tomorrow .css .hljs-pseudo{color:#c82829;}.hljs-tomorrow .hljs-number,.hljs-tomorrow .hljs-preprocessor,.hljs-tomorrow .hljs-pragma,.hljs-tomorrow .hljs-built_in,.hljs-tomorrow .hljs-literal,.hljs-tomorrow .hljs-params,.hljs-tomorrow .hljs-constant{color:#f5871f;}.hljs-tomorrow .ruby .hljs-class .hljs-title,.hljs-tomorrow .css .hljs-rule .hljs-attribute{color:#eab700;}.hljs-tomorrow .hljs-string,.hljs-tomorrow .hljs-value,.hljs-tomorrow .hljs-inheritance,.hljs-tomorrow .hljs-header,.hljs-tomorrow .hljs-name,.hljs-tomorrow .ruby .hljs-symbol,.hljs-tomorrow .xml .hljs-cdata{color:#718c00;}.hljs-tomorrow .hljs-title,.hljs-tomorrow .css .hljs-hexcolor{color:#3e999f;}.hljs-tomorrow .hljs-function,.hljs-tomorrow .python .hljs-decorator,.hljs-tomorrow .python .hljs-title,.hljs-tomorrow .ruby .hljs-function .hljs-title,.hljs-tomorrow .ruby .hljs-title .hljs-keyword,.hljs-tomorrow .perl .hljs-sub,.hljs-tomorrow .javascript .hljs-title,.hljs-tomorrow .coffeescript .hljs-title{color:#4271ae;}.hljs-tomorrow .hljs-keyword,.hljs-tomorrow .javascript .hljs-function{color:#8959a8;}.hljs-tomorrow .hljs{display:block;overflow-x:auto;background:white;color:#4d4d4c;padding:0.5em;-webkit-text-size-adjust:none;}.hljs-tomorrow .coffeescript .javascript,.hljs-tomorrow .javascript .xml,.hljs-tomorrow .tex .hljs-formula,.hljs-tomorrow .xml .javascript,.hljs-tomorrow .xml .vbscript,.hljs-tomorrow .xml .css,.hljs-tomorrow .xml .hljs-cdata{opacity:0.5;}","vs":".hljs-vs{}.hljs-vs .hljs{display:block;overflow-x:auto;padding:0.5em;background:white;color:black;-webkit-text-size-adjust:none;}.hljs-vs .hljs-comment,.hljs-vs .hljs-annotation,.hljs-vs .diff .hljs-header,.hljs-vs .hljs-chunk,.hljs-vs .apache .hljs-cbracket{color:#008000;}.hljs-vs .hljs-keyword,.hljs-vs .hljs-id,.hljs-vs .hljs-built_in,.hljs-vs .css .smalltalk .hljs-class,.hljs-vs .hljs-winutils,.hljs-vs .bash .hljs-variable,.hljs-vs .tex .hljs-command,.hljs-vs .hljs-request,.hljs-vs .hljs-status,.hljs-vs .nginx .hljs-title,.hljs-vs .xml .hljs-tag,.hljs-vs .xml .hljs-tag .hljs-value{color:#00f;}.hljs-vs .hljs-string,.hljs-vs .hljs-title,.hljs-vs .hljs-parent,.hljs-vs .hljs-tag .hljs-value,.hljs-vs .hljs-rule .hljs-value,.hljs-vs .ruby .hljs-symbol,.hljs-vs .ruby .hljs-symbol .hljs-string,.hljs-vs .hljs-template_tag,.hljs-vs .django .hljs-variable,.hljs-vs .hljs-addition,.hljs-vs .hljs-flow,.hljs-vs .hljs-stream,.hljs-vs .apache .hljs-tag,.hljs-vs .hljs-date,.hljs-vs .tex .hljs-formula,.hljs-vs .coffeescript .hljs-attribute,.hljs-vs .hljs-name{color:#a31515;}.hljs-vs .ruby .hljs-string,.hljs-vs .hljs-decorator,.hljs-vs .hljs-filter .hljs-argument,.hljs-vs .hljs-localvars,.hljs-vs .hljs-array,.hljs-vs .hljs-attr_selector,.hljs-vs .hljs-pseudo,.hljs-vs .hljs-pi,.hljs-vs .hljs-doctype,.hljs-vs .hljs-deletion,.hljs-vs .hljs-envvar,.hljs-vs .hljs-shebang,.hljs-vs .hljs-preprocessor,.hljs-vs .hljs-pragma,.hljs-vs .userType,.hljs-vs .apache .hljs-sqbracket,.hljs-vs .nginx .hljs-built_in,.hljs-vs .tex .hljs-special,.hljs-vs .hljs-prompt{color:#2b91af;}.hljs-vs .hljs-phpdoc,.hljs-vs .hljs-dartdoc,.hljs-vs .hljs-javadoc,.hljs-vs .hljs-xmlDocTag{color:#808080;}.hljs-vs .hljs-type,.hljs-vs .hljs-typename{font-weight:bold;}.hljs-vs .vhdl .hljs-string{color:#666666;}.hljs-vs .vhdl .hljs-literal{color:#a31515;}.hljs-vs .vhdl .hljs-attribute{color:#00b0e8;}.hljs-vs .xml .hljs-attribute{color:#f00;}","xcode":".hljs-xcode{}.hljs-xcode .hljs{display:block;overflow-x:auto;padding:0.5em;background:#fff;color:black;-webkit-text-size-adjust:none;}.hljs-xcode .hljs-comment,.hljs-xcode .hljs-javadoc{color:#006a00;}.hljs-xcode .hljs-keyword,.hljs-xcode .hljs-literal,.hljs-xcode .nginx .hljs-title{color:#aa0d91;}.hljs-xcode .method,.hljs-xcode .hljs-list .hljs-title,.hljs-xcode .hljs-tag .hljs-title,.hljs-xcode .setting .hljs-value,.hljs-xcode .hljs-winutils,.hljs-xcode .tex .hljs-command,.hljs-xcode .http .hljs-title,.hljs-xcode .hljs-request,.hljs-xcode .hljs-status,.hljs-xcode .hljs-name{color:#008;}.hljs-xcode .hljs-envvar,.hljs-xcode .tex .hljs-special{color:#660;}.hljs-xcode .hljs-string{color:#c41a16;}.hljs-xcode .hljs-tag .hljs-value,.hljs-xcode .hljs-cdata,.hljs-xcode .hljs-filter .hljs-argument,.hljs-xcode .hljs-attr_selector,.hljs-xcode .apache .hljs-cbracket,.hljs-xcode .hljs-date,.hljs-xcode .hljs-regexp{color:#080;}.hljs-xcode .hljs-sub .hljs-identifier,.hljs-xcode .hljs-pi,.hljs-xcode .hljs-tag,.hljs-xcode .hljs-tag .hljs-keyword,.hljs-xcode .hljs-decorator,.hljs-xcode .ini .hljs-title,.hljs-xcode .hljs-shebang,.hljs-xcode .hljs-prompt,.hljs-xcode .hljs-hexcolor,.hljs-xcode .hljs-rule .hljs-value,.hljs-xcode .hljs-symbol,.hljs-xcode .hljs-symbol .hljs-string,.hljs-xcode .hljs-number,.hljs-xcode .css .hljs-function,.hljs-xcode .hljs-function .hljs-title,.hljs-xcode .coffeescript .hljs-attribute{color:#1c00cf;}.hljs-xcode .hljs-class .hljs-title,.hljs-xcode .smalltalk .hljs-class,.hljs-xcode .hljs-javadoctag,.hljs-xcode .hljs-yardoctag,.hljs-xcode .hljs-phpdoc,.hljs-xcode .hljs-dartdoc,.hljs-xcode .hljs-type,.hljs-xcode .hljs-typename,.hljs-xcode .hljs-tag .hljs-attribute,.hljs-xcode .hljs-doctype,.hljs-xcode .hljs-class .hljs-id,.hljs-xcode .hljs-built_in,.hljs-xcode .setting,.hljs-xcode .hljs-params,.hljs-xcode .clojure .hljs-attribute{color:#5c2699;}.hljs-xcode .hljs-variable{color:#3f6e74;}.hljs-xcode .css .hljs-tag,.hljs-xcode .hljs-rule .hljs-property,.hljs-xcode .hljs-pseudo,.hljs-xcode .hljs-subst{color:#000;}.hljs-xcode .css .hljs-class,.hljs-xcode .css .hljs-id{color:#9b703f;}.hljs-xcode .hljs-value .hljs-important{color:#ff7700;font-weight:bold;}.hljs-xcode .hljs-rule .hljs-keyword{color:#c5af75;}.hljs-xcode .hljs-annotation,.hljs-xcode .apache .hljs-sqbracket,.hljs-xcode .nginx .hljs-built_in{color:#9b859d;}.hljs-xcode .hljs-preprocessor,.hljs-xcode .hljs-preprocessor *,.hljs-xcode .hljs-pragma{color:#643820;}.hljs-xcode .tex .hljs-formula{background-color:#eee;font-style:italic;}.hljs-xcode .diff .hljs-header,.hljs-xcode .hljs-chunk{color:#808080;font-weight:bold;}.hljs-xcode .diff .hljs-change{background-color:#bccff9;}.hljs-xcode .hljs-addition{background-color:#baeeba;}.hljs-xcode .hljs-deletion{background-color:#ffc8bd;}.hljs-xcode .hljs-comment .hljs-yardoctag{font-weight:bold;}.hljs-xcode .method .hljs-id{color:#000;}","zenburn":".hljs-zenburn{}.hljs-zenburn .hljs{display:block;overflow-x:auto;padding:0.5em;background:#3f3f3f;color:#dcdcdc;-webkit-text-size-adjust:none;}.hljs-zenburn .hljs-keyword,.hljs-zenburn .hljs-tag,.hljs-zenburn .css .hljs-class,.hljs-zenburn .css .hljs-id,.hljs-zenburn .lisp .hljs-title,.hljs-zenburn .nginx .hljs-title,.hljs-zenburn .hljs-request,.hljs-zenburn .hljs-status,.hljs-zenburn .clojure .hljs-attribute{color:#e3ceab;}.hljs-zenburn .django .hljs-template_tag,.hljs-zenburn .django .hljs-variable,.hljs-zenburn .django .hljs-filter .hljs-argument{color:#dcdcdc;}.hljs-zenburn .hljs-number,.hljs-zenburn .hljs-date{color:#8cd0d3;}.hljs-zenburn .dos .hljs-envvar,.hljs-zenburn .dos .hljs-stream,.hljs-zenburn .hljs-variable,.hljs-zenburn .apache .hljs-sqbracket,.hljs-zenburn .hljs-name{color:#efdcbc;}.hljs-zenburn .dos .hljs-flow,.hljs-zenburn .diff .hljs-change,.hljs-zenburn .python .exception,.hljs-zenburn .python .hljs-built_in,.hljs-zenburn .hljs-literal,.hljs-zenburn .tex .hljs-special{color:#efefaf;}.hljs-zenburn .diff .hljs-chunk,.hljs-zenburn .hljs-subst{color:#8f8f8f;}.hljs-zenburn .dos .hljs-keyword,.hljs-zenburn .hljs-decorator,.hljs-zenburn .hljs-title,.hljs-zenburn .hljs-type,.hljs-zenburn .diff .hljs-header,.hljs-zenburn .ruby .hljs-class .hljs-parent,.hljs-zenburn .apache .hljs-tag,.hljs-zenburn .nginx .hljs-built_in,.hljs-zenburn .tex .hljs-command,.hljs-zenburn .hljs-prompt{color:#efef8f;}.hljs-zenburn .dos .hljs-winutils,.hljs-zenburn .ruby .hljs-symbol,.hljs-zenburn .ruby .hljs-symbol .hljs-string,.hljs-zenburn .ruby .hljs-string{color:#dca3a3;}.hljs-zenburn .diff .hljs-deletion,.hljs-zenburn .hljs-string,.hljs-zenburn .hljs-tag .hljs-value,.hljs-zenburn .hljs-preprocessor,.hljs-zenburn .hljs-pragma,.hljs-zenburn .hljs-built_in,.hljs-zenburn .hljs-javadoc,.hljs-zenburn .smalltalk .hljs-class,.hljs-zenburn .smalltalk .hljs-localvars,.hljs-zenburn .smalltalk .hljs-array,.hljs-zenburn .css .hljs-rule .hljs-value,.hljs-zenburn .hljs-attr_selector,.hljs-zenburn .hljs-pseudo,.hljs-zenburn .apache .hljs-cbracket,.hljs-zenburn .tex .hljs-formula,.hljs-zenburn .coffeescript .hljs-attribute{color:#cc9393;}.hljs-zenburn .hljs-shebang,.hljs-zenburn .diff .hljs-addition,.hljs-zenburn .hljs-comment,.hljs-zenburn .hljs-annotation,.hljs-zenburn .hljs-pi,.hljs-zenburn .hljs-doctype{color:#7f9f7f;}.hljs-zenburn .coffeescript .javascript,.hljs-zenburn .javascript .xml,.hljs-zenburn .tex .hljs-formula,.hljs-zenburn .xml .javascript,.hljs-zenburn .xml .vbscript,.hljs-zenburn .xml .css,.hljs-zenburn .xml .hljs-cdata{opacity:0.5;}"},
  engine: hljs
};

})()
},{}],4:[function(require,module,exports){
var EventEmitter = require('events').EventEmitter
  , highlighter = require('./highlighter')
  , converter = require('./converter')
  , resources = require('./resources')
  , Parser = require('./parser')
  , Slideshow = require('./models/slideshow')
  , SlideshowView = require('./views/slideshowView')
  , DefaultController = require('./controllers/defaultController')
  , Dom = require('./dom')
  , macros = require('./macros')
  ;

module.exports = Api;

function Api (dom) {
  this.dom = dom || new Dom();
  this.macros = macros;
  this.version = resources.version;
}

// Expose highlighter to allow enumerating available styles and
// including external language grammars
Api.prototype.highlighter = highlighter;

Api.prototype.convert = function (markdown) {
  var parser = new Parser()
    , content = parser.parse(markdown || '', macros)[0].content
    ;

  return converter.convertMarkdown(content, {}, true);
};

// Creates slideshow initialized from options
Api.prototype.create = function (options) {
  var events
    , slideshow
    , slideshowView
    , controller
    ;

  options = applyDefaults(this.dom, options);

  events = new EventEmitter();
  events.setMaxListeners(0);

  slideshow = new Slideshow(events, options);
  slideshowView = new SlideshowView(events, this.dom, options.container, slideshow);
  controller = options.controller || new DefaultController(events, this.dom, slideshowView, options.navigation);

  return slideshow;
};

function applyDefaults (dom, options) {
  var sourceElement;

  options = options || {};

  if (options.hasOwnProperty('sourceUrl')) {
    var req = new dom.XMLHttpRequest();
    req.open('GET', options.sourceUrl, false);
    req.send();
    options.source = req.responseText.replace(/\r\n/g, '\n');
  }
  else if (!options.hasOwnProperty('source')) {
    sourceElement = dom.getElementById('source');
    if (sourceElement) {
      options.source = unescape(sourceElement.innerHTML);
      sourceElement.style.display = 'none';
    }
  }

  if (!(options.container instanceof window.HTMLElement)) {
    options.container = dom.getBodyElement();
  }

  return options;
}

function unescape (source) {
  source = source.replace(/&[l|g]t;/g,
    function (match) {
      return match === '&lt;' ? '<' : '>';
    });

  source = source.replace(/&amp;/g, '&');
  source = source.replace(/&quot;/g, '"');

  return source;
}

},{"events":1,"./highlighter":7,"./converter":9,"./resources":6,"./parser":10,"./models/slideshow":11,"./views/slideshowView":12,"./controllers/defaultController":13,"./dom":14,"./macros":15}],14:[function(require,module,exports){
module.exports = Dom;

function Dom () { }

Dom.prototype.XMLHttpRequest = XMLHttpRequest;

Dom.prototype.getHTMLElement = function () {
  return document.getElementsByTagName('html')[0];
};

Dom.prototype.getBodyElement = function () {
  return document.body;
};

Dom.prototype.getElementById = function (id) {
  return document.getElementById(id);
};

Dom.prototype.getLocationHash = function () {
  return window.location.hash;
};

Dom.prototype.setLocationHash = function (hash) {
  if (typeof window.history.replaceState === 'function') {
    window.history.replaceState(undefined, undefined, hash);
  }
  else {
    window.location.hash = hash;
  }
};

},{}],15:[function(require,module,exports){
var macros = module.exports = {};

macros.hello = function () {
  return 'hello!';
};

},{}],10:[function(require,module,exports){
(function(){var Lexer = require('./lexer');

module.exports = Parser;

function Parser () { }

/*
 *  Parses source string into list of slides.
 *
 *  Output format:
 *
 *  [
 *    // Per slide
 *    {
 *      // Properties
 *      properties: {
 *        name: 'value'
 *      },
 *      // Notes (optional, same format as content list)
 *      notes: [...],
 *      // Link definitions
 *      links: {
 *        id: { href: 'url', title: 'optional title' },
 *        ...
 *      ],
 *      content: [
 *        // Any content but content classes are represented as strings
 *        'plain text ',
 *        // Content classes are represented as objects
 *        { block: false, class: 'the-class', content: [...] },
 *        { block: true, class: 'the-class', content: [...] },
 *        ...
 *      ]
 *    },
 *    ...
 *  ]
 */
Parser.prototype.parse = function (src, macros) {
  var self = this,
      lexer = new Lexer(),
      tokens = lexer.lex(cleanInput(src)),
      slides = [],

      // The last item on the stack contains the current slide or
      // content class we're currently appending content to.
      stack = [createSlide()];

  macros = macros || {};

  tokens.forEach(function (token) {
    switch (token.type) {
      case 'text':
      case 'code':
      case 'fences':
        // Text, code and fenced code tokens are appended to their
        // respective parents as string literals, and are only included
        // in the parse process in order to reason about structure
        // (like ignoring a slide separator inside fenced code).
        appendTo(stack[stack.length - 1], token.text);
        break;
      case 'def':
        // Link definition
        stack[0].links[token.id] = {
          href: token.href,
          title: token.title
        };
        break;
      case 'macro':
        // Macro
        var macro = macros[token.name];
        if (typeof macro !== 'function') {
          throw new Error('Macro "' + token.name + '" not found. ' +
              'You need to define macro using remark.macros[\'' +
              token.name + '\'] = function () { ... };');
        }
        var value = macro.apply(token.obj, token.args);
        if (typeof value === 'string') {
          value = self.parse(value, macros);
          appendTo(stack[stack.length - 1], value[0].content[0]);
        }
        else {
          appendTo(stack[stack.length - 1], value === undefined ?
              '' : value.toString());
        }
        break;
      case 'content_start':
        // Entering content class, so create stack entry for appending
        // upcoming content to.
        //
        // Lexer handles open/close bracket balance, so there's no need
        // to worry about there being a matching closing bracket.
        stack.push(createContentClass(token));
        break;
      case 'content_end':
        // Exiting content class, so remove entry from stack and
        // append to previous item (outer content class or slide).
        appendTo(stack[stack.length - 2], stack[stack.length - 1]);
        stack.pop();
        break;
      case 'separator':
        // Slide separator (--- or --), so add current slide to list of
        // slides and re-initialize stack with new, blank slide.
        slides.push(stack[0]);
        stack = [createSlide()];
        // Tag the new slide as a continued slide if the separator
        // used was -- instead of --- (2 vs. 3 dashes).
        stack[0].properties.continued = (token.text === '--').toString();
        break;
      case 'notes_separator':
        // Notes separator (???), so create empty content list on slide
        // in which all remaining slide content will be put.
        stack[0].notes = [];
        break;
    }
  });

  // Push current slide to list of slides.
  slides.push(stack[0]);

  slides.forEach(function (slide) {
    slide.content[0] = extractProperties(slide.content[0] || '', slide.properties);
  });

  return slides.filter(function (slide) {
    var exclude = (slide.properties.exclude || '').toLowerCase();

    if (exclude === 'true') {
      return false;
    }

    return true;
  });
};

function createSlide () {
  return {
    content: [],
    properties: {
      continued: 'false'
    },
    links: {}
  };
}

function createContentClass (token) {
  return {
    class: token.classes.join(' '),
    block: token.block,
    content: []
  };
}

function appendTo (element, content) {
  var target = element.content;

  if (element.notes !== undefined) {
    target = element.notes;
  }

  // If two string are added after one another, we can just as well
  // go ahead and concatenate them into a single string.
  var lastIdx = target.length - 1;
  if (typeof target[lastIdx] === 'string' && typeof content === 'string') {
    target[lastIdx] += content;
  }
  else {
    target.push(content);
  }
}

function extractProperties (source, properties) {
  var propertyFinder = /^\n*([-\w]+):([^$\n]*)|\n*(?:<!--\s*)([-\w]+):([^$\n]*?)(?:\s*-->)/i
    , match
    ;

  while ((match = propertyFinder.exec(source)) !== null) {
    source = source.substr(0, match.index) +
      source.substr(match.index + match[0].length);

    if (match[1] !== undefined) {
      properties[match[1].trim()] = match[2].trim();
    }
    else {
      properties[match[3].trim()] = match[4].trim();
    }

    propertyFinder.lastIndex = match.index;
  }

  return source;
}

function cleanInput(source) {
  // If all lines are indented, we should trim them all to the same point so that code doesn't
  // need to start at column 0 in the source (see GitHub Issue #105)

  // Helper to extract captures from the regex
  var getMatchCaptures = function (source, pattern) {
    var results = [], match;
    while ((match = pattern.exec(source)) !== null)
      results.push(match[1]);
    return results;
  };

  // Calculate the minimum leading whitespace
  // Ensure there's at least one char that's not newline nor whitespace to ignore empty and blank lines
  var leadingWhitespacePattern = /^([ \t]*)[^ \t\n]/gm;
  var whitespace = getMatchCaptures(source, leadingWhitespacePattern).map(function (s) { return s.length; });
  var minWhitespace = Math.min.apply(Math, whitespace);

  // Trim off the exact amount of whitespace, or less for blank lines (non-empty)
  var trimWhitespacePattern = new RegExp('^[ \\t]{0,' + minWhitespace + '}', 'gm');
  return source.replace(trimWhitespacePattern, '');
}

})()
},{"./lexer":16}],11:[function(require,module,exports){
var Navigation = require('./slideshow/navigation')
  , Events = require('./slideshow/events')
  , utils = require('../utils')
  , Slide = require('./slide')
  , Parser = require('../parser')
  , macros = require('../macros')
  ;

module.exports = Slideshow;

function Slideshow (events, options) {
  var self = this
    , slides = []
    , links = {}
    ;

  options = options || {};

  // Extend slideshow functionality
  Events.call(self, events);
  Navigation.call(self, events);

  self.loadFromString = loadFromString;
  self.update = update;
  self.getLinks = getLinks;
  self.getSlides = getSlides;
  self.getSlideCount = getSlideCount;
  self.getSlideByName = getSlideByName;

  self.togglePresenterMode = togglePresenterMode;
  self.toggleHelp = toggleHelp;
  self.toggleBlackout = toggleBlackout;
  self.toggleMirrored = toggleMirrored;
  self.toggleFullscreen = toggleFullscreen;
  self.createClone = createClone;

  self.resetTimer = resetTimer;

  self.getRatio = getOrDefault('ratio', '4:3');
  self.getHighlightStyle = getOrDefault('highlightStyle', 'default');
  self.getHighlightLanguage = getOrDefault('highlightLanguage', '');
  self.getSlideNumberFormat = getOrDefault('slideNumberFormat', '%current% / %total%');

  loadFromString(options.source);

  events.on('toggleBlackout', function () {
    if (self.clone && !self.clone.closed) {
      self.clone.postMessage('toggleBlackout', '*');
    }
  });

  function loadFromString (source) {
    source = source || '';

    slides = createSlides(source, options);
    expandVariables(slides);

    links = {};
    slides.forEach(function (slide) {
      for (var id in slide.links) {
        if (slide.links.hasOwnProperty(id)) {
          links[id] = slide.links[id];
        }
      }
    });

    events.emit('slidesChanged');
  }

  function update () {
    events.emit('resize');
  }

  function getLinks () {
    return links;
  }

  function getSlides () {
    return slides.map(function (slide) { return slide; });
  }

  function getSlideCount () {
    return slides.length;
  }

  function getSlideByName (name) {
    return slides.byName[name];
  }

  function togglePresenterMode () {
    events.emit('togglePresenterMode');
  }

  function toggleHelp () {
    events.emit('toggleHelp');
  }

  function toggleBlackout () {
    events.emit('toggleBlackout');
  }

  function toggleMirrored() {
    events.emit('toggleMirrored');
  }

  function toggleFullscreen () {
    events.emit('toggleFullscreen');
  }

  function createClone () {
    events.emit('createClone');
  }

  function resetTimer () {
    events.emit('resetTimer');
  }

  function getOrDefault (key, defaultValue) {
    return function () {
      if (options[key] === undefined) {
        return defaultValue;
      }

      return options[key];
    };
  }
}

function createSlides (slideshowSource, options) {
  var parser = new Parser()
   ,  parsedSlides = parser.parse(slideshowSource, macros)
    , slides = []
    , byName = {}
    , layoutSlide
    ;

  slides.byName = {};

  parsedSlides.forEach(function (slide, i) {
    var template, slideViewModel;

    if (slide.properties.continued === 'true' && i > 0) {
      template = slides[slides.length - 1];
    }
    else if (byName[slide.properties.template]) {
      template = byName[slide.properties.template];
    }
    else if (slide.properties.layout === 'false') {
      layoutSlide = undefined;
    }
    else if (layoutSlide && slide.properties.layout !== 'true') {
      template = layoutSlide;
    }

    if (slide.properties.continued === 'true' &&
        options.countIncrementalSlides === false &&
        slide.properties.count === undefined) {
      slide.properties.count = 'false';
    }

    slideViewModel = new Slide(slides.length, slide, template);

    if (slide.properties.layout === 'true') {
      layoutSlide = slideViewModel;
    }

    if (slide.properties.name) {
      byName[slide.properties.name] = slideViewModel;
    }

    if (slide.properties.layout !== 'true') {
      slides.push(slideViewModel);
      if (slide.properties.name) {
        slides.byName[slide.properties.name] = slideViewModel;
      }
    }
  });

  return slides;
}

function expandVariables (slides) {
  slides.forEach(function (slide) {
    slide.expandVariables();
  });
}

},{"./slideshow/navigation":17,"./slideshow/events":18,"../utils":8,"./slide":19,"../parser":10,"../macros":15}],12:[function(require,module,exports){
var SlideView = require('./slideView')
  , Timer = require('components/timer')
  , NotesView = require('./notesView')
  , Scaler = require('../scaler')
  , resources = require('../resources')
  , utils = require('../utils')
  , printing = require('components/printing')
  ;

module.exports = SlideshowView;

function SlideshowView (events, dom, containerElement, slideshow) {
  var self = this;

  self.events = events;
  self.dom = dom;
  self.slideshow = slideshow;
  self.scaler = new Scaler(events, slideshow);
  self.slideViews = [];

  self.configureContainerElement(containerElement);
  self.configureChildElements();

  self.updateDimensions();
  self.scaleElements();
  self.updateSlideViews();

  self.timer = new Timer(events, self.timerElement);

  events.on('slidesChanged', function () {
    self.updateSlideViews();
  });

  events.on('hideSlide', function (slideIndex) {
    // To make sure that there is only one element fading at a time,
    // remove the fading class from all slides before hiding
    // the new slide.
    self.elementArea.getElementsByClassName('remark-fading').forEach(function (slide) {
      utils.removeClass(slide, 'remark-fading');
    });
    self.hideSlide(slideIndex);
  });

  events.on('showSlide', function (slideIndex) {
    self.showSlide(slideIndex);
  });

  events.on('forcePresenterMode', function () {

    if (!utils.hasClass(self.containerElement, 'remark-presenter-mode')) {
      utils.toggleClass(self.containerElement, 'remark-presenter-mode');
      self.scaleElements();
      printing.setPageOrientation('landscape');
    }
  });

  events.on('togglePresenterMode', function () {
    utils.toggleClass(self.containerElement, 'remark-presenter-mode');
    self.scaleElements();

    if (utils.hasClass(self.containerElement, 'remark-presenter-mode')) {
      printing.setPageOrientation('portrait');
    }
    else {
      printing.setPageOrientation('landscape');
    }
  });

  events.on('toggleHelp', function () {
    utils.toggleClass(self.containerElement, 'remark-help-mode');
  });

  events.on('toggleBlackout', function () {
    utils.toggleClass(self.containerElement, 'remark-blackout-mode');
  });

  events.on('toggleMirrored', function () {
    utils.toggleClass(self.containerElement, 'remark-mirrored-mode');
  });

  events.on('hideOverlay', function () {
    utils.removeClass(self.containerElement, 'remark-blackout-mode');
    utils.removeClass(self.containerElement, 'remark-help-mode');
  });

  events.on('pause', function () {
    utils.toggleClass(self.containerElement, 'remark-pause-mode');
  });

  events.on('resume', function () {
    utils.toggleClass(self.containerElement, 'remark-pause-mode');
  });

  handleFullscreen(self);
}

function handleFullscreen(self) {
  var requestFullscreen = utils.getPrefixedProperty(self.containerElement, 'requestFullScreen')
    , cancelFullscreen = utils.getPrefixedProperty(document, 'cancelFullScreen')
    ;

  self.events.on('toggleFullscreen', function () {
    var fullscreenElement = utils.getPrefixedProperty(document, 'fullscreenElement') ||
      utils.getPrefixedProperty(document, 'fullScreenElement');

    if (!fullscreenElement && requestFullscreen) {
      requestFullscreen.call(self.containerElement, Element.ALLOW_KEYBOARD_INPUT);
    }
    else if (cancelFullscreen) {
      cancelFullscreen.call(document);
    }
    self.scaleElements();
  });
}

SlideshowView.prototype.isEmbedded = function () {
  return this.containerElement !== this.dom.getBodyElement();
};

SlideshowView.prototype.configureContainerElement = function (element) {
  var self = this;

  self.containerElement = element;

  utils.addClass(element, 'remark-container');

  if (element === self.dom.getBodyElement()) {
    utils.addClass(self.dom.getHTMLElement(), 'remark-container');

    forwardEvents(self.events, window, [
      'hashchange', 'resize', 'keydown', 'keypress', 'mousewheel',
      'message', 'DOMMouseScroll'
    ]);
    forwardEvents(self.events, self.containerElement, [
      'touchstart', 'touchmove', 'touchend', 'click', 'contextmenu'
    ]);
  }
  else {
    element.style.position = 'absolute';
    element.tabIndex = -1;

    forwardEvents(self.events, window, ['resize']);
    forwardEvents(self.events, element, [
      'keydown', 'keypress', 'mousewheel',
      'touchstart', 'touchmove', 'touchend'
    ]);
  }

  // Tap event is handled in slideshow view
  // rather than controller as knowledge of
  // container width is needed to determine
  // whether to move backwards or forwards
  self.events.on('tap', function (endX) {
    if (endX < self.getContainerWidth() / 2) {
      self.slideshow.gotoPreviousSlide();
    }
    else {
      self.slideshow.gotoNextSlide();
    }
  });
};

function forwardEvents (target, source, events) {
  events.forEach(function (eventName) {
    source.addEventListener(eventName, function () {
      var args = Array.prototype.slice.call(arguments);
      target.emit.apply(target, [eventName].concat(args));
    });
  });
}

SlideshowView.prototype.configureChildElements = function () {
  var self = this;

  self.containerElement.innerHTML += resources.containerLayout;

  self.elementArea = self.containerElement.getElementsByClassName('remark-slides-area')[0];
  self.previewArea = self.containerElement.getElementsByClassName('remark-preview-area')[0];
  self.notesArea = self.containerElement.getElementsByClassName('remark-notes-area')[0];

  self.notesView = new NotesView (self.events, self.notesArea, function () {
    return self.slideViews;
  });

  self.backdropElement = self.containerElement.getElementsByClassName('remark-backdrop')[0];
  self.helpElement = self.containerElement.getElementsByClassName('remark-help')[0];

  self.timerElement = self.notesArea.getElementsByClassName('remark-toolbar-timer')[0];
  self.pauseElement = self.containerElement.getElementsByClassName('remark-pause')[0];

  self.events.on('propertiesChanged', function (changes) {
    if (changes.hasOwnProperty('ratio')) {
      self.updateDimensions();
    }
  });

  self.events.on('resize', onResize);

  printing.init();
  printing.on('print', onPrint);

  function onResize () {
    self.scaleElements();
  }

  function onPrint (e) {
    var slideHeight;

    if (e.isPortrait) {
      slideHeight = e.pageHeight * 0.4;
    }
    else {
      slideHeight = e.pageHeight;
    }

    self.slideViews.forEach(function (slideView) {
      slideView.scale({
        clientWidth: e.pageWidth,
        clientHeight: slideHeight
      });

      if (e.isPortrait) {
        slideView.scalingElement.style.top = '20px';
        slideView.notesElement.style.top = slideHeight + 40 + 'px';
      }
    });
  }
};

SlideshowView.prototype.updateSlideViews = function () {
  var self = this;

  self.slideViews.forEach(function (slideView) {
    self.elementArea.removeChild(slideView.containerElement);
  });

  self.slideViews = self.slideshow.getSlides().map(function (slide) {
    return new SlideView(self.events, self.slideshow, self.scaler, slide);
  });

  self.slideViews.forEach(function (slideView) {
    self.elementArea.appendChild(slideView.containerElement);
  });

  self.updateDimensions();

  if (self.slideshow.getCurrentSlideIndex() > -1) {
    self.showSlide(self.slideshow.getCurrentSlideIndex());
  }
};

SlideshowView.prototype.scaleSlideBackgroundImages = function (dimensions) {
  var self = this;

  self.slideViews.forEach(function (slideView) {
    slideView.scaleBackgroundImage(dimensions);
  });
};

SlideshowView.prototype.showSlide =  function (slideIndex) {
  var self = this
    , slideView = self.slideViews[slideIndex]
    , nextSlideView = self.slideViews[slideIndex + 1]
    ;

  self.events.emit("beforeShowSlide", slideIndex);

  slideView.show();

  if (nextSlideView) {
    self.previewArea.innerHTML = nextSlideView.containerElement.outerHTML;
  }
  else {
    self.previewArea.innerHTML = '';
  }

  self.events.emit("afterShowSlide", slideIndex);
};

SlideshowView.prototype.hideSlide = function (slideIndex) {
  var self = this
    , slideView = self.slideViews[slideIndex]
    ;

  self.events.emit("beforeHideSlide", slideIndex);
  slideView.hide();
  self.events.emit("afterHideSlide", slideIndex);

};

SlideshowView.prototype.updateDimensions = function () {
  var self = this
    , dimensions = self.scaler.dimensions
    ;

  self.helpElement.style.width = dimensions.width + 'px';
  self.helpElement.style.height = dimensions.height + 'px';

  self.scaleSlideBackgroundImages(dimensions);
  self.scaleElements();
};

SlideshowView.prototype.scaleElements = function () {
  var self = this;

  self.slideViews.forEach(function (slideView) {
    slideView.scale(self.elementArea);
  });

  if (self.previewArea.children.length) {
    self.scaler.scaleToFit(self.previewArea.children[0].children[0], self.previewArea);
  }
  self.scaler.scaleToFit(self.helpElement, self.containerElement);
  self.scaler.scaleToFit(self.pauseElement, self.containerElement);
};

},{"components/timer":"yNa1UP","components/printing":"dlghYq","./slideView":20,"./notesView":21,"../scaler":22,"../resources":6,"../utils":8}],13:[function(require,module,exports){
(function(){// Allow override of global `location`
/* global location:true */

module.exports = Controller;

var keyboard = require('./inputs/keyboard')
  , mouse = require('./inputs/mouse')
  , touch = require('./inputs/touch')
  , message = require('./inputs/message')
  , location = require('./inputs/location')
  ;

function Controller (events, dom, slideshowView, options) {
  options = options || {};

  message.register(events);
  location.register(events, dom, slideshowView);
  keyboard.register(events);
  mouse.register(events, options);
  touch.register(events, options);

  addApiEventListeners(events, slideshowView, options);
}

function addApiEventListeners(events, slideshowView, options) {
  events.on('pause', function(event) {
    keyboard.unregister(events);
    mouse.unregister(events);
    touch.unregister(events);
  });

  events.on('resume',  function(event) {
    keyboard.register(events);
    mouse.register(events, options);
    touch.register(events, options);
  });
}

})()
},{"./inputs/keyboard":23,"./inputs/mouse":24,"./inputs/touch":25,"./inputs/message":26,"./inputs/location":27}],16:[function(require,module,exports){
module.exports = Lexer;

var CODE = 1,
    INLINE_CODE = 2,
    CONTENT = 3,
    FENCES = 4,
    DEF = 5,
    DEF_HREF = 6,
    DEF_TITLE = 7,
    MACRO = 8,
    MACRO_ARGS = 9,
    MACRO_OBJ = 10,
    SEPARATOR = 11,
    NOTES_SEPARATOR = 12;

var regexByName = {
    CODE: /(?:^|\n)( {4}[^\n]+\n*)+/,
    INLINE_CODE: /`([^`]+?)`/,
    CONTENT: /(?:\\)?((?:\.[a-zA-Z_\-][a-zA-Z\-_0-9]*)+)\[/,
    FENCES: /(?:^|\n) *(`{3,}|~{3,}) *(?:\S+)? *\n(?:[\s\S]+?)\s*\4 *(?:\n+|$)/,
    DEF: /(?:^|\n) *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
    MACRO: /!\[:([^\] ]+)([^\]]*)\](?:\(([^\)]*)\))?/,
    SEPARATOR: /(?:^|\n)(---?)(?:\n|$)/,
    NOTES_SEPARATOR: /(?:^|\n)(\?{3})(?:\n|$)/
  };

var block = replace(/CODE|INLINE_CODE|CONTENT|FENCES|DEF|MACRO|SEPARATOR|NOTES_SEPARATOR/, regexByName),
    inline = replace(/CODE|INLINE_CODE|CONTENT|FENCES|DEF|MACRO/, regexByName);

function Lexer () { }

Lexer.prototype.lex = function (src) {
  var tokens = lex(src, block),
      i;

  for (i = tokens.length - 2; i >= 0; i--) {
    if (tokens[i].type === 'text' && tokens[i+1].type === 'text') {
      tokens[i].text += tokens[i+1].text;
      tokens.splice(i+1, 1);
    }
  }

  return tokens;
};

function lex (src, regex, tokens) {
  var cap, text;

  tokens = tokens || [];

  while ((cap = regex.exec(src)) !== null) {
    if (cap.index > 0) {
      tokens.push({
        type: 'text',
        text: src.substring(0, cap.index)
      });
    }

    if (cap[CODE]) {
      tokens.push({
        type: 'code',
        text: cap[0]
      });
    }
    else if (cap[INLINE_CODE]) {
      tokens.push({
        type: 'text',
        text: cap[0]
      });
    }
    else if (cap[FENCES]) {
      tokens.push({
        type: 'fences',
        text: cap[0]
      });
    }
    else if (cap[DEF]) {
      tokens.push({
        type: 'def',
        id: cap[DEF],
        href: cap[DEF_HREF],
        title: cap[DEF_TITLE]
      });
    }
    else if (cap[MACRO]) {
      tokens.push({
        type: 'macro',
        name: cap[MACRO],
        args: (cap[MACRO_ARGS] || '').split(',').map(trim),
        obj: cap[MACRO_OBJ]
      });
    }
    else if (cap[SEPARATOR]) {
      tokens.push({
        type: 'separator',
        text: cap[SEPARATOR]
      });
    }
    else if (cap[NOTES_SEPARATOR]) {
      tokens.push({
        type: 'notes_separator',
        text: cap[NOTES_SEPARATOR]
      });
    }
    else if (cap[CONTENT]) {
      text = getTextInBrackets(src, cap.index + cap[0].length);
      if (text !== undefined) {
        src = src.substring(text.length + 1);

        if (cap[0][0] !== '\\') {
          tokens.push({
            type: 'content_start',
            classes: cap[CONTENT].substring(1).split('.'),
            block: text.indexOf('\n') !== -1
          });
          lex(text, inline, tokens);
          tokens.push({
            type: 'content_end',
            block: text.indexOf('\n') !== -1
          });
        }
        else {
          tokens.push({
            type: 'text',
            text: cap[0].substring(1) + text + ']'
          });
        }
      }
      else {
        tokens.push({
          type: 'text',
          text: cap[0]
        });
      }
    }

    src = src.substring(cap.index + cap[0].length);
  }

  if (src || (!src && tokens.length === 0)) {
    tokens.push({
      type: 'text',
      text: src
    });
  }

  return tokens;
}

function replace (regex, replacements) {
  return new RegExp(regex.source.replace(/\w{2,}/g, function (key) {
    return replacements[key].source;
  }));
}

function trim (text) {
  if (typeof text === 'string') {
    return text.trim();
  }

  return text;
}

function getTextInBrackets (src, offset) {
  var depth = 1,
      pos = offset,
      chr;

  while (depth > 0 && pos < src.length) {
    chr = src[pos++];
    depth += (chr === '[' && 1) || (chr === ']' && -1) || 0;
  }

  if (depth === 0) {
    src = src.substr(offset, pos - offset - 1);
    return src;
  }
}

},{}],17:[function(require,module,exports){
module.exports = Navigation;

function Navigation (events) {
  var self = this
    , currentSlideIndex = -1
    , started = null
    ;

  self.getCurrentSlideIndex = getCurrentSlideIndex;
  self.gotoSlide = gotoSlide;
  self.gotoPreviousSlide = gotoPreviousSlide;
  self.gotoNextSlide = gotoNextSlide;
  self.gotoFirstSlide = gotoFirstSlide;
  self.gotoLastSlide = gotoLastSlide;
  self.pause = pause;
  self.resume = resume;

  events.on('gotoSlide', gotoSlide);
  events.on('gotoPreviousSlide', gotoPreviousSlide);
  events.on('gotoNextSlide', gotoNextSlide);
  events.on('gotoFirstSlide', gotoFirstSlide);
  events.on('gotoLastSlide', gotoLastSlide);

  events.on('slidesChanged', function () {
    if (currentSlideIndex > self.getSlideCount()) {
      currentSlideIndex = self.getSlideCount();
    }
  });

  events.on('createClone', function () {
    if (!self.clone || self.clone.closed) {
      self.clone = window.open(location.href, '_blank', 'location=no');
    }
    else {
      self.clone.focus();
    }
  });

  events.on('resetTimer', function() {
    started = false;
  });

  function pause () {
    events.emit('pause');
  }

  function resume () {
    events.emit('resume');
  }

  function getCurrentSlideIndex () {
    return currentSlideIndex;
  }

  function gotoSlideByIndex(slideIndex, noMessage) {
    var alreadyOnSlide = slideIndex === currentSlideIndex
      , slideOutOfRange = slideIndex < 0 || slideIndex > self.getSlideCount()-1
      ;

    if (noMessage === undefined) noMessage = false;

    if (alreadyOnSlide || slideOutOfRange) {
      return;
    }

    if (currentSlideIndex !== -1) {
      events.emit('hideSlide', currentSlideIndex, false);
    }

    // Use some tri-state logic here.
    // null = We haven't shown the first slide yet.
    // false = We've shown the initial slide, but we haven't progressed beyond that.
    // true = We've issued the first slide change command.
    if (started === null) {
      started = false;
    } else if (started === false) {
      // We've shown the initial slide previously - that means this is a
      // genuine move to a new slide.
      events.emit('start');
      started = true;
    }

    events.emit('showSlide', slideIndex);

    currentSlideIndex = slideIndex;

    events.emit('slideChanged', slideIndex + 1);

    if (!noMessage) {
      if (self.clone && !self.clone.closed) {
        self.clone.postMessage('gotoSlide:' + (currentSlideIndex + 1), '*');
      }

      if (window.opener) {
        window.opener.postMessage('gotoSlide:' + (currentSlideIndex + 1), '*');
      }
    }
  }

  function gotoSlide (slideNoOrName, noMessage) {
    var slideIndex = getSlideIndex(slideNoOrName);

    gotoSlideByIndex(slideIndex, noMessage);
  }

  function gotoPreviousSlide() {
    gotoSlideByIndex(currentSlideIndex - 1);
  }

  function gotoNextSlide() {
    gotoSlideByIndex(currentSlideIndex + 1);
  }

  function gotoFirstSlide () {
    gotoSlideByIndex(0);
  }

  function gotoLastSlide () {
    gotoSlideByIndex(self.getSlideCount() - 1);
  }

  function getSlideIndex (slideNoOrName) {
    var slideNo
      , slide
      ;

    if (typeof slideNoOrName === 'number') {
      return slideNoOrName - 1;
    }

    slideNo = parseInt(slideNoOrName, 10);
    if (slideNo.toString() === slideNoOrName) {
      return slideNo - 1;
    }

    if(slideNoOrName.match(/^p\d+$/)){
      events.emit('forcePresenterMode');
      return parseInt(slideNoOrName.substr(1), 10)-1;
    }

    slide = self.getSlideByName(slideNoOrName);
    if (slide) {
      return slide.getSlideIndex();
    }

    return 0;
  }
}

},{}],18:[function(require,module,exports){
var EventEmitter = require('events').EventEmitter;

module.exports = Events;

function Events (events) {
  var self = this
    , externalEvents = new EventEmitter()
    ;

  externalEvents.setMaxListeners(0);

  self.on = function () {
    externalEvents.on.apply(externalEvents, arguments);
    return self;
  };

  ['showSlide', 'hideSlide', 'beforeShowSlide', 'afterShowSlide', 'beforeHideSlide', 'afterHideSlide'].map(function (eventName) {
    events.on(eventName, function (slideIndex) {
      var slide = self.getSlides()[slideIndex];
      externalEvents.emit(eventName, slide);
    });
  });
}

},{"events":1}],19:[function(require,module,exports){
module.exports = Slide;

function Slide (slideIndex, slide, template) {
  var self = this;

  self.properties = slide.properties || {};
  self.links = slide.links || {};
  self.content = slide.content || [];
  self.notes = slide.notes || '';

  self.getSlideIndex = function () { return slideIndex; };

  if (template) {
    inherit(self, template);
  }
}

function inherit (slide, template) {
  inheritProperties(slide, template);
  inheritContent(slide, template);
  inheritNotes(slide, template);
}

function inheritProperties (slide, template) {
  var property
    , value
    ;

  for (property in template.properties) {
    if (!template.properties.hasOwnProperty(property) ||
        ignoreProperty(property)) {
      continue;
    }

    value = [template.properties[property]];

    if (property === 'class' && slide.properties[property]) {
      value.push(slide.properties[property]);
    }

    if (property === 'class' || slide.properties[property] === undefined) {
      slide.properties[property] = value.join(', ');
    }
  }
}

function ignoreProperty (property) {
  return property === 'name' ||
    property === 'layout' ||
    property === 'count';
}

function inheritContent (slide, template) {
  var expandedVariables;

  slide.properties.content = slide.content.slice();
  slide.content = template.content.slice();

  expandedVariables = slide.expandVariables(/* contentOnly: */ true);

  if (expandedVariables.content === undefined) {
    slide.content = slide.content.concat(slide.properties.content);
  }

  delete slide.properties.content;
}

function inheritNotes (slide, template) {
  if (template.notes) {
    slide.notes = template.notes + '\n\n' + slide.notes;
  }
}

Slide.prototype.expandVariables = function (contentOnly, content, expandResult) {
  var properties = this.properties
    , i
    ;

  content = content !== undefined ? content : this.content;
  expandResult = expandResult || {};

  for (i = 0; i < content.length; ++i) {
    if (typeof content[i] === 'string') {
      content[i] = content[i].replace(/(\\)?(\{\{([^\}\n]+)\}\})/g, expand);
    }
    else {
      this.expandVariables(contentOnly, content[i].content, expandResult);
    }
  }

  function expand (match, escaped, unescapedMatch, property) {
    var propertyName = property.trim()
      , propertyValue
      ;

    if (escaped) {
      return contentOnly ? match[0] : unescapedMatch;
    }

    if (contentOnly && propertyName !== 'content') {
      return match;
    }

    propertyValue = properties[propertyName];

    if (propertyValue !== undefined) {
      expandResult[propertyName] = propertyValue;
      return propertyValue;
    }

    return propertyName === 'content' ? '' : unescapedMatch;
  }

  return expandResult;
};

},{}],22:[function(require,module,exports){
var referenceWidth = 908
  , referenceHeight = 681
  , referenceRatio = referenceWidth / referenceHeight
  ;

module.exports = Scaler;

function Scaler (events, slideshow) {
  var self = this;

  self.events = events;
  self.slideshow = slideshow;
  self.ratio = getRatio(slideshow);
  self.dimensions = getDimensions(self.ratio);

  self.events.on('propertiesChanged', function (changes) {
    if (changes.hasOwnProperty('ratio')) {
      self.ratio = getRatio(slideshow);
      self.dimensions = getDimensions(self.ratio);
    }
  });
}

Scaler.prototype.scaleToFit = function (element, container) {
  var self = this
    , containerHeight = container.clientHeight
    , containerWidth = container.clientWidth
    , scale
    , scaledWidth
    , scaledHeight
    , ratio = self.ratio
    , dimensions = self.dimensions
    , direction
    , left
    , top
    ;

  if (containerWidth / ratio.width > containerHeight / ratio.height) {
    scale = containerHeight / dimensions.height;
  }
  else {
    scale = containerWidth / dimensions.width;
  }

  scaledWidth = dimensions.width * scale;
  scaledHeight = dimensions.height * scale;

  left = (containerWidth - scaledWidth) / 2;
  top = (containerHeight - scaledHeight) / 2;

  element.style['-webkit-transform'] = 'scale(' + scale + ')';
  element.style.MozTransform = 'scale(' + scale + ')';
  element.style.left = Math.max(left, 0) + 'px';
  element.style.top = Math.max(top, 0) + 'px';
};

function getRatio (slideshow) {
  var ratioComponents = slideshow.getRatio().split(':')
    , ratio
    ;

  ratio = {
    width: parseInt(ratioComponents[0], 10)
  , height: parseInt(ratioComponents[1], 10)
  };

  ratio.ratio = ratio.width / ratio.height;

  return ratio;
}

function getDimensions (ratio) {
  return {
    width: Math.floor(referenceWidth / referenceRatio * ratio.ratio)
  , height: referenceHeight
  };
}

},{}],23:[function(require,module,exports){
exports.register = function (events) {
  addKeyboardEventListeners(events);
};

exports.unregister = function (events) {
  removeKeyboardEventListeners(events);
};

function addKeyboardEventListeners (events) {
  events.on('keydown', function (event) {
    if (event.metaKey || event.ctrlKey) {
      // Bail out if meta or ctrl key was pressed
      return;
    }

    switch (event.keyCode) {
      case 33: // Page up
      case 37: // Left
      case 38: // Up
        events.emit('gotoPreviousSlide');
        break;
      case 32: // Space
      case 34: // Page down
      case 39: // Right
      case 40: // Down
        events.emit('gotoNextSlide');
        break;
      case 36: // Home
        events.emit('gotoFirstSlide');
        break;
      case 35: // End
        events.emit('gotoLastSlide');
        break;
      case 27: // Escape
        events.emit('hideOverlay');
        break;
    }
  });

  events.on('keypress', function (event) {
    if (event.metaKey || event.ctrlKey) {
      // Bail out if meta or ctrl key was pressed
      return;
    }

    switch (String.fromCharCode(event.which)) {
      case 'j':
        events.emit('gotoNextSlide');
        break;
      case 'k':
        events.emit('gotoPreviousSlide');
        break;
      case 'b':
        events.emit('toggleBlackout');
        break;
      case 'm':
        events.emit('toggleMirrored');
        break;
      case 'c':
        events.emit('createClone');
        break;
      case 'p':
        events.emit('togglePresenterMode');
        break;
      case 'f':
        events.emit('toggleFullscreen');
        break;
      case 't':
        events.emit('resetTimer');
        break;
      case 'h':
      case '?':
        events.emit('toggleHelp');
        break;
    }
  });
}

function removeKeyboardEventListeners(events) {
  events.removeAllListeners("keydown");
  events.removeAllListeners("keypress");
}

},{}],24:[function(require,module,exports){
exports.register = function (events, options) {
  addMouseEventListeners(events, options);
};

exports.unregister = function (events) {
  removeMouseEventListeners(events);
};

function addMouseEventListeners (events, options) {
  if (options.click) {
    events.on('click', function (event) {
      if (event.target.nodeName === 'A') {
        // Don't interfere when clicking link
        return;
      }
      else if (event.button === 0) {
        events.emit('gotoNextSlide');
      }
    });
    events.on('contextmenu', function (event) {
      if (event.target.nodeName === 'A') {
        // Don't interfere when right-clicking link
        return;
      }
      event.preventDefault();
      events.emit('gotoPreviousSlide');
    });
  }

  if (options.scroll !== false) {
    var scrollHandler = function (event) {
      if (event.wheelDeltaY > 0 || event.detail < 0) {
        events.emit('gotoPreviousSlide');
      }
      else if (event.wheelDeltaY < 0 || event.detail > 0) {
        events.emit('gotoNextSlide');
      }
    };

    // IE9, Chrome, Safari, Opera
    events.on('mousewheel', scrollHandler);
    // Firefox
    events.on('DOMMouseScroll', scrollHandler);
  }
}

function removeMouseEventListeners(events) {
  events.removeAllListeners('click');
  events.removeAllListeners('contextmenu');
  events.removeAllListeners('mousewheel');
}

},{}],25:[function(require,module,exports){
exports.register = function (events, options) {
  addTouchEventListeners(events, options);
};

exports.unregister = function (events) {
  removeTouchEventListeners(events);
};

function addTouchEventListeners (events, options) {
  var touch
    , startX
    , endX
    ;

  if (options.touch === false) {
    return;
  }

  var isTap = function () {
    return Math.abs(startX - endX) < 10;
  };

  var handleTap = function () {
    events.emit('tap', endX);
  };

  var handleSwipe = function () {
    if (startX > endX) {
      events.emit('gotoNextSlide');
    }
    else {
      events.emit('gotoPreviousSlide');
    }
  };

  events.on('touchstart', function (event) {
    touch = event.touches[0];
    startX = touch.clientX;
  });

  events.on('touchend', function (event) {
    if (event.target.nodeName.toUpperCase() === 'A') {
      return;
    }

    touch = event.changedTouches[0];
    endX = touch.clientX;

    if (isTap()) {
      handleTap();
    }
    else {
      handleSwipe();
    }
  });

  events.on('touchmove', function (event) {
    event.preventDefault();
  });
}

function removeTouchEventListeners(events) {
  events.removeAllListeners("touchstart");
  events.removeAllListeners("touchend");
  events.removeAllListeners("touchmove");
}

},{}],26:[function(require,module,exports){
exports.register = function (events) {
  addMessageEventListeners(events);
};

function addMessageEventListeners (events) {
  events.on('message', navigateByMessage);

  function navigateByMessage(message) {
    var cap;

    if ((cap = /^gotoSlide:(\d+)$/.exec(message.data)) !== null) {
      events.emit('gotoSlide', parseInt(cap[1], 10), true);
    }
    else if (message.data === 'toggleBlackout') {
      events.emit('toggleBlackout');
    }
  }
}

},{}],27:[function(require,module,exports){
exports.register = function (events, dom, slideshowView) {
  addLocationEventListeners(events, dom, slideshowView);
};

function addLocationEventListeners (events, dom, slideshowView) {
  // If slideshow is embedded into custom DOM element, we don't
  // hook up to location hash changes, so just go to first slide.
  if (slideshowView.isEmbedded()) {
    events.emit('gotoSlide', 1);
  }
  // When slideshow is not embedded into custom DOM element, but
  // rather hosted directly inside document.body, we hook up to
  // location hash changes, and trigger initial navigation.
  else {
    events.on('hashchange', navigateByHash);
    events.on('slideChanged', updateHash);

    navigateByHash();
  }

  function navigateByHash () {
    var slideNoOrName = (dom.getLocationHash() || '').substr(1);
    events.emit('gotoSlide', slideNoOrName);
  }

  function updateHash (slideNoOrName) {
    dom.setLocationHash('#' + slideNoOrName);
  }
}

},{}],20:[function(require,module,exports){
var SlideNumber = require('components/slide-number')
  , converter = require('../converter')
  , highlighter = require('../highlighter')
  , utils = require('../utils')
  ;

module.exports = SlideView;

function SlideView (events, slideshow, scaler, slide) {
  var self = this;

  self.events = events;
  self.slideshow = slideshow;
  self.scaler = scaler;
  self.slide = slide;

  self.slideNumber = new SlideNumber(slide, slideshow);

  self.configureElements();
  self.updateDimensions();

  self.events.on('propertiesChanged', function (changes) {
    if (changes.hasOwnProperty('ratio')) {
      self.updateDimensions();
    }
  });
}

SlideView.prototype.updateDimensions = function () {
  var self = this
    , dimensions = self.scaler.dimensions
    ;

  self.scalingElement.style.width = dimensions.width + 'px';
  self.scalingElement.style.height = dimensions.height + 'px';
};

SlideView.prototype.scale = function (containerElement) {
  var self = this;

  self.scaler.scaleToFit(self.scalingElement, containerElement);
};

SlideView.prototype.show = function () {
  utils.addClass(this.containerElement, 'remark-visible');
  utils.removeClass(this.containerElement, 'remark-fading');
};

SlideView.prototype.hide = function () {
  var self = this;
  utils.removeClass(this.containerElement, 'remark-visible');
  // Don't just disappear the slide. Mark it as fading, which
  // keeps it on the screen, but at a reduced z-index.
  // Then set a timer to remove the fading state in 1s.
  utils.addClass(this.containerElement, 'remark-fading');
  setTimeout(function(){
      utils.removeClass(self.containerElement, 'remark-fading');
  }, 1000);
};

SlideView.prototype.configureElements = function () {
  var self = this;

  self.containerElement = document.createElement('div');
  self.containerElement.className = 'remark-slide-container';

  self.scalingElement = document.createElement('div');
  self.scalingElement.className = 'remark-slide-scaler';

  self.element = document.createElement('div');
  self.element.className = 'remark-slide';

  self.contentElement = createContentElement(self.events, self.slideshow, self.slide);
  self.notesElement = createNotesElement(self.slideshow, self.slide.notes);

  self.contentElement.appendChild(self.slideNumber.element);
  self.element.appendChild(self.contentElement);
  self.scalingElement.appendChild(self.element);
  self.containerElement.appendChild(self.scalingElement);
  self.containerElement.appendChild(self.notesElement);
};

SlideView.prototype.scaleBackgroundImage = function (dimensions) {
  var self = this
    , styles = window.getComputedStyle(this.contentElement)
    , backgroundImage = styles.backgroundImage
    , match
    , image
    , scale
    ;

  if ((match = /^url\(("?)([^\)]+?)\1\)/.exec(backgroundImage)) !== null) {
    image = new Image();
    image.onload = function () {
      if (image.width > dimensions.width ||
          image.height > dimensions.height) {
        // Background image is larger than slide
        if (!self.originalBackgroundSize) {
          // No custom background size has been set
          self.originalBackgroundSize = self.contentElement.style.backgroundSize;
          self.originalBackgroundPosition = self.contentElement.style.backgroundPosition;
          self.backgroundSizeSet = true;

          if (dimensions.width / image.width < dimensions.height / image.height) {
            scale = dimensions.width / image.width;
          }
          else {
            scale = dimensions.height / image.height;
          }

          self.contentElement.style.backgroundSize = image.width * scale +
            'px ' + image.height * scale + 'px';
          self.contentElement.style.backgroundPosition = '50% ' +
            ((dimensions.height - (image.height * scale)) / 2) + 'px';
        }
      }
      else {
        // Revert to previous background size setting
        if (self.backgroundSizeSet) {
          self.contentElement.style.backgroundSize = self.originalBackgroundSize;
          self.contentElement.style.backgroundPosition = self.originalBackgroundPosition;
          self.backgroundSizeSet = false;
        }
      }
    };
    image.src = match[2];
  }
};

function createContentElement (events, slideshow, slide) {
  var element = document.createElement('div');

  if (slide.properties.name) {
    element.id = 'slide-' + slide.properties.name;
  }

  styleContentElement(slideshow, element, slide.properties);

  element.innerHTML = converter.convertMarkdown(slide.content, slideshow.getLinks());

  highlightCodeBlocks(element, slideshow);

  return element;
}

function styleContentElement (slideshow, element, properties) {
  element.className = '';

  setClassFromProperties(element, properties);
  setHighlightStyleFromProperties(element, properties, slideshow);
  setBackgroundFromProperties(element, properties);
}

function createNotesElement (slideshow, notes) {
  var element = document.createElement('div');

  element.className = 'remark-slide-notes';

  element.innerHTML = converter.convertMarkdown(notes);

  highlightCodeBlocks(element, slideshow);

  return element;
}

function setBackgroundFromProperties (element, properties) {
  var backgroundImage = properties['background-image'];
  var backgroundColor = properties['background-color'];

  if (backgroundImage) {
    element.style.backgroundImage = backgroundImage;
  }
  if (backgroundColor) {
    element.style.backgroundColor = backgroundColor;
  }
}

function setHighlightStyleFromProperties (element, properties, slideshow) {
  var highlightStyle = properties['highlight-style'] ||
      slideshow.getHighlightStyle();

  if (highlightStyle) {
    utils.addClass(element, 'hljs-' + highlightStyle);
  }
}

function setClassFromProperties (element, properties) {
  utils.addClass(element, 'remark-slide-content');

  (properties['class'] || '').split(/,| /)
    .filter(function (s) { return s !== ''; })
    .forEach(function (c) { utils.addClass(element, c); });
}

function highlightCodeBlocks (content, slideshow) {
  var codeBlocks = content.getElementsByTagName('code')
    ;

  codeBlocks.forEach(function (block) {
    if (block.parentElement.tagName !== 'PRE') {
      utils.addClass(block, 'remark-inline-code');
      return;
    }

    if (block.className === '') {
      block.className = slideshow.getHighlightLanguage();
    }

    var meta = extractMetadata(block);

    if (block.className !== '') {
      highlighter.engine.highlightBlock(block, '  ');
    }

    wrapLines(block);
    highlightBlockLines(block, meta.highlightedLines);
    highlightBlockSpans(block);

    utils.addClass(block, 'remark-code');
  });
}

function extractMetadata (block) {
  var highlightedLines = [];

  block.innerHTML = block.innerHTML.split(/\r?\n/).map(function (line, i) {
    if (line.indexOf('*') === 0) {
      highlightedLines.push(i);
      return line.replace(/^\*( )?/, '$1$1');
    }

    return line;
  }).join('\n');

  return {
    highlightedLines: highlightedLines
  };
}

function wrapLines (block) {
  var lines = block.innerHTML.split(/\r?\n/).map(function (line) {
    return '<div class="remark-code-line">' + line + '</div>';
  });

  // Remove empty last line (due to last \n)
  if (lines.length && lines[lines.length - 1].indexOf('><') !== -1) {
    lines.pop();
  }

  block.innerHTML = lines.join('');
}

function highlightBlockLines (block, lines) {
  lines.forEach(function (i) {
    utils.addClass(block.childNodes[i], 'remark-code-line-highlighted');
  });
}

function highlightBlockSpans (block) {
  var pattern = /([^`])`([^`]+?)`/g ;

  block.childNodes.forEach(function (element) {
    element.innerHTML = element.innerHTML.replace(pattern,
      function (m,e,c) {
        if (e === '\\') {
          return m.substr(1);
        }
        return e + '<span class="remark-code-span-highlighted">' +
          c + '</span>';
      });
  });
}

},{"components/slide-number":"AhfaJU","../converter":9,"../highlighter":7,"../utils":8}],21:[function(require,module,exports){
var converter = require('../converter');

module.exports = NotesView;

function NotesView (events, element, slideViewsAccessor) {
  var self = this;

  self.events = events;
  self.element = element;
  self.slideViewsAccessor = slideViewsAccessor;

  self.configureElements();

  events.on('showSlide', function (slideIndex) {
    self.showSlide(slideIndex);
  });
}

NotesView.prototype.showSlide = function (slideIndex) {
  var self = this
    , slideViews = self.slideViewsAccessor()
    , slideView = slideViews[slideIndex]
    , nextSlideView = slideViews[slideIndex + 1]
    ;

  self.notesElement.innerHTML = slideView.notesElement.innerHTML;

  if (nextSlideView) {
    self.notesPreviewElement.innerHTML = nextSlideView.notesElement.innerHTML;
  }
  else {
    self.notesPreviewElement.innerHTML = '';
  }
};

NotesView.prototype.configureElements = function () {
  var self = this;

  self.notesElement = self.element.getElementsByClassName('remark-notes')[0];
  self.notesPreviewElement = self.element.getElementsByClassName('remark-notes-preview')[0];

  self.notesElement.addEventListener('mousewheel', function (event) {
    event.stopPropagation();
  });

  self.notesPreviewElement.addEventListener('mousewheel', function (event) {
    event.stopPropagation();
  });

  self.toolbarElement = self.element.getElementsByClassName('remark-toolbar')[0];

  var commands = {
    increase: function () {
      self.notesElement.style.fontSize = (parseFloat(self.notesElement.style.fontSize) || 1) + 0.1 + 'em';
      self.notesPreviewElement.style.fontsize = self.notesElement.style.fontSize;
    },
    decrease: function () {
      self.notesElement.style.fontSize = (parseFloat(self.notesElement.style.fontSize) || 1) - 0.1 + 'em';
      self.notesPreviewElement.style.fontsize = self.notesElement.style.fontSize;
    }
  };

  self.toolbarElement.getElementsByTagName('a').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var command = e.target.hash.substr(1);
      commands[command]();
      e.preventDefault();
    });
  });
};

},{"../converter":9}],9:[function(require,module,exports){
var marked = require('marked')
  , converter = module.exports = {}
  , element = document.createElement('div')
  ;

marked.setOptions({
  gfm: true,
  tables: true,
  breaks: false,

  // Without this set to true, converting something like
  // <p>*</p><p>*</p> will become <p><em></p><p></em></p>
  pedantic: true,

  sanitize: false,
  smartLists: true,
  langPrefix: ''
});

converter.convertMarkdown = function (content, links, inline) {
  element.innerHTML = convertMarkdown(content, links || {}, inline);
  element.innerHTML = element.innerHTML.replace(/<p>\s*<\/p>/g, '');
  return element.innerHTML.replace(/\n\r?$/, '');
};

function convertMarkdown (content, links, insideContentClass) {
  var i, tag, markdown = '', html;

  for (i = 0; i < content.length; ++i) {
    if (typeof content[i] === 'string') {
      markdown += content[i];
    }
    else {
      tag = content[i].block ? 'div' : 'span';
      markdown += '<' + tag + ' class="' + content[i].class + '">';
      markdown += convertMarkdown(content[i].content, links, true);
      markdown += '</' + tag + '>';
    }
  }

  var tokens = marked.Lexer.lex(markdown.replace(/^\s+/, ''));
  tokens.links = links;
  html = marked.Parser.parse(tokens);

  if (insideContentClass) {
    element.innerHTML = html;
    if (element.children.length === 1 && element.children[0].tagName === 'P') {
      html = element.children[0].innerHTML;
    }
  }

  return html;
}

},{"marked":28}],28:[function(require,module,exports){
(function(global){/**
 * marked - a markdown parser
 * Copyright (c) 2011-2013, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 */

;(function() {

/**
 * Block-Level Grammar
 */

var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: noop,
  hr: /^( *[-*_]){3,} *(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
  nptable: noop,
  lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
  blockquote: /^( *>[^\n]+(\n[^\n]+)*\n*)+/,
  list: /^( *)(bull) [\s\S]+?(?:hr|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: /^ *(?:comment|closed|closing) *(?:\n{2,}|\s*$)/,
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
  table: noop,
  paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
  text: /^[^\n]+/
};

block.bullet = /(?:[*+-]|\d+\.)/;
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.item = replace(block.item, 'gm')
  (/bull/g, block.bullet)
  ();

block.list = replace(block.list)
  (/bull/g, block.bullet)
  ('hr', /\n+(?=(?: *[-*_]){3,} *(?:\n+|$))/)
  ();

block._tag = '(?!(?:'
  + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
  + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
  + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';

block.html = replace(block.html)
  ('comment', /<!--[\s\S]*?-->/)
  ('closed', /<(tag)[\s\S]+?<\/\1>/)
  ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
  (/tag/g, block._tag)
  ();

block.paragraph = replace(block.paragraph)
  ('hr', block.hr)
  ('heading', block.heading)
  ('lheading', block.lheading)
  ('blockquote', block.blockquote)
  ('tag', '<' + block._tag)
  ('def', block.def)
  ();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  fences: /^ *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/,
  paragraph: /^/
});

block.gfm.paragraph = replace(block.paragraph)
  ('(?!', '(?!'
    + block.gfm.fences.source.replace('\\1', '\\2') + '|'
    + block.list.source.replace('\\1', '\\3') + '|')
  ();

/**
 * GFM + Tables Block Grammar
 */

block.tables = merge({}, block.gfm, {
  nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
  table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
});

/**
 * Block Lexer
 */

function Lexer(options) {
  this.tokens = [];
  this.tokens.links = {};
  this.options = options || marked.defaults;
  this.rules = block.normal;

  if (this.options.gfm) {
    if (this.options.tables) {
      this.rules = block.tables;
    } else {
      this.rules = block.gfm;
    }
  }
}

/**
 * Expose Block Rules
 */

Lexer.rules = block;

/**
 * Static Lex Method
 */

Lexer.lex = function(src, options) {
  var lexer = new Lexer(options);
  return lexer.lex(src);
};

/**
 * Preprocessing
 */

Lexer.prototype.lex = function(src) {
  src = src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n');

  return this.token(src, true);
};

/**
 * Lexing
 */

Lexer.prototype.token = function(src, top) {
  var src = src.replace(/^ +$/gm, '')
    , next
    , loose
    , cap
    , bull
    , b
    , item
    , space
    , i
    , l;

  while (src) {
    // newline
    if (cap = this.rules.newline.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[0].length > 1) {
        this.tokens.push({
          type: 'space'
        });
      }
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      cap = cap[0].replace(/^ {4}/gm, '');
      this.tokens.push({
        type: 'code',
        text: !this.options.pedantic
          ? cap.replace(/\n+$/, '')
          : cap
      });
      continue;
    }

    // fences (gfm)
    if (cap = this.rules.fences.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'code',
        lang: cap[2],
        text: cap[3]
      });
      continue;
    }

    // heading
    if (cap = this.rules.heading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[1].length,
        text: cap[2]
      });
      continue;
    }

    // table no leading pipe (gfm)
    if (top && (cap = this.rules.nptable.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i].split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // lheading
    if (cap = this.rules.lheading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[2] === '=' ? 1 : 2,
        text: cap[1]
      });
      continue;
    }

    // hr
    if (cap = this.rules.hr.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'hr'
      });
      continue;
    }

    // blockquote
    if (cap = this.rules.blockquote.exec(src)) {
      src = src.substring(cap[0].length);

      this.tokens.push({
        type: 'blockquote_start'
      });

      cap = cap[0].replace(/^ *> ?/gm, '');

      // Pass `top` to keep the current
      // "toplevel" state. This is exactly
      // how markdown.pl works.
      this.token(cap, top);

      this.tokens.push({
        type: 'blockquote_end'
      });

      continue;
    }

    // list
    if (cap = this.rules.list.exec(src)) {
      src = src.substring(cap[0].length);
      bull = cap[2];

      this.tokens.push({
        type: 'list_start',
        ordered: bull.length > 1
      });

      // Get each top-level item.
      cap = cap[0].match(this.rules.item);

      next = false;
      l = cap.length;
      i = 0;

      for (; i < l; i++) {
        item = cap[i];

        // Remove the list item's bullet
        // so it is seen as the next token.
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+\.) +/, '');

        // Outdent whatever the
        // list item contains. Hacky.
        if (~item.indexOf('\n ')) {
          space -= item.length;
          item = !this.options.pedantic
            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
            : item.replace(/^ {1,4}/gm, '');
        }

        // Determine whether the next list item belongs here.
        // Backpedal if it does not belong in this list.
        if (this.options.smartLists && i !== l - 1) {
          b = block.bullet.exec(cap[i + 1])[0];
          if (bull !== b && !(bull.length > 1 && b.length > 1)) {
            src = cap.slice(i + 1).join('\n') + src;
            i = l - 1;
          }
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$)/.test(item);
        if (i !== l - 1) {
          next = item.charAt(item.length - 1) === '\n';
          if (!loose) loose = next;
        }

        this.tokens.push({
          type: loose
            ? 'loose_item_start'
            : 'list_item_start'
        });

        // Recurse.
        this.token(item, false);

        this.tokens.push({
          type: 'list_item_end'
        });
      }

      this.tokens.push({
        type: 'list_end'
      });

      continue;
    }

    // html
    if (cap = this.rules.html.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: this.options.sanitize
          ? 'paragraph'
          : 'html',
        pre: cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style',
        text: cap[0]
      });
      continue;
    }

    // def
    if (top && (cap = this.rules.def.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.links[cap[1].toLowerCase()] = {
        href: cap[2],
        title: cap[3]
      };
      continue;
    }

    // table (gfm)
    if (top && (cap = this.rules.table.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i]
          .replace(/^ *\| *| *\| *$/g, '')
          .split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // top-level paragraph
    if (top && (cap = this.rules.paragraph.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'paragraph',
        text: cap[1].charAt(cap[1].length - 1) === '\n'
          ? cap[1].slice(0, -1)
          : cap[1]
      });
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      // Top-level should never reach here.
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'text',
        text: cap[0]
      });
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return this.tokens;
};

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
  autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
  url: noop,
  tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
  link: /^!?\[(inside)\]\(href\)/,
  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  em: /^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  del: noop,
  text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
};

inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

inline.link = replace(inline.link)
  ('inside', inline._inside)
  ('href', inline._href)
  ();

inline.reflink = replace(inline.reflink)
  ('inside', inline._inside)
  ();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: replace(inline.escape)('])', '~|])')(),
  url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
  del: /^~~(?=\S)([\s\S]*?\S)~~/,
  text: replace(inline.text)
    (']|', '~]|')
    ('|', '|https?://|')
    ()
});

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: replace(inline.br)('{2,}', '*')(),
  text: replace(inline.gfm.text)('{2,}', '*')()
});

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options) {
  this.options = options || marked.defaults;
  this.links = links;
  this.rules = inline.normal;
  this.renderer = this.options.renderer || new Renderer;
  this.renderer.options = this.options;

  if (!this.links) {
    throw new
      Error('Tokens array requires a `links` property.');
  }

  if (this.options.gfm) {
    if (this.options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  } else if (this.options.pedantic) {
    this.rules = inline.pedantic;
  }
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline;

/**
 * Static Lexing/Compiling Method
 */

InlineLexer.output = function(src, links, options) {
  var inline = new InlineLexer(links, options);
  return inline.output(src);
};

/**
 * Lexing/Compiling
 */

InlineLexer.prototype.output = function(src) {
  var out = ''
    , link
    , text
    , href
    , cap;

  while (src) {
    // escape
    if (cap = this.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += cap[1];
      continue;
    }

    // autolink
    if (cap = this.rules.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = cap[1].charAt(6) === ':'
          ? this.mangle(cap[1].substring(7))
          : this.mangle(cap[1]);
        href = this.mangle('mailto:') + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += this.renderer.link(href, null, text);
      continue;
    }

    // url (gfm)
    if (cap = this.rules.url.exec(src)) {
      src = src.substring(cap[0].length);
      text = escape(cap[1]);
      href = text;
      out += this.renderer.link(href, null, text);
      continue;
    }

    // tag
    if (cap = this.rules.tag.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.options.sanitize
        ? escape(cap[0])
        : cap[0];
      continue;
    }

    // link
    if (cap = this.rules.link.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.outputLink(cap, {
        href: cap[2],
        title: cap[3]
      });
      continue;
    }

    // reflink, nolink
    if ((cap = this.rules.reflink.exec(src))
        || (cap = this.rules.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = this.links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0].charAt(0);
        src = cap[0].substring(1) + src;
        continue;
      }
      out += this.outputLink(cap, link);
      continue;
    }

    // strong
    if (cap = this.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.strong(this.output(cap[2] || cap[1]));
      continue;
    }

    // em
    if (cap = this.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.em(this.output(cap[2] || cap[1]));
      continue;
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.codespan(escape(cap[2], true));
      continue;
    }

    // br
    if (cap = this.rules.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.br();
      continue;
    }

    // del (gfm)
    if (cap = this.rules.del.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.del(this.output(cap[1]));
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      out += escape(this.smartypants(cap[0]));
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function(cap, link) {
  var href = escape(link.href)
    , title = link.title ? escape(link.title) : null;

  return cap[0].charAt(0) !== '!'
    ? this.renderer.link(href, title, this.output(cap[1]))
    : this.renderer.image(href, title, escape(cap[1]));
};

/**
 * Smartypants Transformations
 */

InlineLexer.prototype.smartypants = function(text) {
  if (!this.options.smartypants) return text;
  return text
    // em-dashes
    .replace(/--/g, '\u2014')
    // opening singles
    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
    // closing singles & apostrophes
    .replace(/'/g, '\u2019')
    // opening doubles
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
    // closing doubles
    .replace(/"/g, '\u201d')
    // ellipses
    .replace(/\.{3}/g, '\u2026');
};

/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function(text) {
  var out = ''
    , l = text.length
    , i = 0
    , ch;

  for (; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
};

/**
 * Renderer
 */

function Renderer(options) {
  this.options = options || {};
}

Renderer.prototype.code = function(code, lang, escaped) {
  if (this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  if (!lang) {
    return '<pre><code>'
      + (escaped ? code : escape(code, true))
      + '\n</code></pre>';
  }

  return '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '">'
    + (escaped ? code : escape(code, true))
    + '\n</code></pre>\n';
};

Renderer.prototype.blockquote = function(quote) {
  return '<blockquote>\n' + quote + '</blockquote>\n';
};

Renderer.prototype.html = function(html) {
  return html;
};

Renderer.prototype.heading = function(text, level, raw) {
  return '<h'
    + level
    + ' id="'
    + this.options.headerPrefix
    + raw.toLowerCase().replace(/[^\w]+/g, '-')
    + '">'
    + text
    + '</h'
    + level
    + '>\n';
};

Renderer.prototype.hr = function() {
  return '<hr>\n';
};

Renderer.prototype.list = function(body, ordered) {
  var type = ordered ? 'ol' : 'ul';
  return '<' + type + '>\n' + body + '</' + type + '>\n';
};

Renderer.prototype.listitem = function(text) {
  return '<li>' + text + '</li>\n';
};

Renderer.prototype.paragraph = function(text) {
  return '<p>' + text + '</p>\n';
};

Renderer.prototype.table = function(header, body) {
  return '<table>\n'
    + '<thead>\n'
    + header
    + '</thead>\n'
    + '<tbody>\n'
    + body
    + '</tbody>\n'
    + '</table>\n';
};

Renderer.prototype.tablerow = function(content) {
  return '<tr>\n' + content + '</tr>\n';
};

Renderer.prototype.tablecell = function(content, flags) {
  var type = flags.header ? 'th' : 'td';
  var tag = flags.align
    ? '<' + type + ' style="text-align:' + flags.align + '">'
    : '<' + type + '>';
  return tag + content + '</' + type + '>\n';
};

// span level renderer
Renderer.prototype.strong = function(text) {
  return '<strong>' + text + '</strong>';
};

Renderer.prototype.em = function(text) {
  return '<em>' + text + '</em>';
};

Renderer.prototype.codespan = function(text) {
  return '<code>' + text + '</code>';
};

Renderer.prototype.br = function() {
  return '<br>';
};

Renderer.prototype.del = function(text) {
  return '<del>' + text + '</del>';
};

Renderer.prototype.link = function(href, title, text) {
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return '';
    }
    if (prot.indexOf('javascript:') === 0) {
      return '';
    }
  }
  var out = '<a href="' + href + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>' + text + '</a>';
  return out;
};

Renderer.prototype.image = function(href, title, text) {
  var out = '<img src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>';
  return out;
};

/**
 * Parsing & Compiling
 */

function Parser(options) {
  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
  this.options.renderer = this.options.renderer || new Renderer;
  this.renderer = this.options.renderer;
  this.renderer.options = this.options;
}

/**
 * Static Parse Method
 */

Parser.parse = function(src, options, renderer) {
  var parser = new Parser(options, renderer);
  return parser.parse(src);
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  this.inline = new InlineLexer(src.links, this.options, this.renderer);
  this.tokens = src.reverse();

  var out = '';
  while (this.next()) {
    out += this.tok();
  }

  return out;
};

/**
 * Next Token
 */

Parser.prototype.next = function() {
  return this.token = this.tokens.pop();
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length - 1] || 0;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function() {
  var body = this.token.text;

  while (this.peek().type === 'text') {
    body += '\n' + this.next().text;
  }

  return this.inline.output(body);
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function() {
  switch (this.token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return this.renderer.hr();
    }
    case 'heading': {
      return this.renderer.heading(
        this.inline.output(this.token.text),
        this.token.depth,
        this.token.text);
    }
    case 'code': {
      return this.renderer.code(this.token.text,
        this.token.lang,
        this.token.escaped);
    }
    case 'table': {
      var header = ''
        , body = ''
        , i
        , row
        , cell
        , flags
        , j;

      // header
      cell = '';
      for (i = 0; i < this.token.header.length; i++) {
        flags = { header: true, align: this.token.align[i] };
        cell += this.renderer.tablecell(
          this.inline.output(this.token.header[i]),
          { header: true, align: this.token.align[i] }
        );
      }
      header += this.renderer.tablerow(cell);

      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i];

        cell = '';
        for (j = 0; j < row.length; j++) {
          cell += this.renderer.tablecell(
            this.inline.output(row[j]),
            { header: false, align: this.token.align[j] }
          );
        }

        body += this.renderer.tablerow(cell);
      }
      return this.renderer.table(header, body);
    }
    case 'blockquote_start': {
      var body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this.tok();
      }

      return this.renderer.blockquote(body);
    }
    case 'list_start': {
      var body = ''
        , ordered = this.token.ordered;

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return this.renderer.list(body, ordered);
    }
    case 'list_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'loose_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'html': {
      var html = !this.token.pre && !this.options.pedantic
        ? this.inline.output(this.token.text)
        : this.token.text;
      return this.renderer.html(html);
    }
    case 'paragraph': {
      return this.renderer.paragraph(this.inline.output(this.token.text));
    }
    case 'text': {
      return this.renderer.paragraph(this.parseText());
    }
  }
};

/**
 * Helpers
 */

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function unescape(html) {
  return html.replace(/&([#\w]+);/g, function(_, n) {
    n = n.toLowerCase();
    if (n === 'colon') return ':';
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
}

function replace(regex, opt) {
  regex = regex.source;
  opt = opt || '';
  return function self(name, val) {
    if (!name) return new RegExp(regex, opt);
    val = val.source || val;
    val = val.replace(/(^|[^\[])\^/g, '$1');
    regex = regex.replace(name, val);
    return self;
  };
}

function noop() {}
noop.exec = noop;

function merge(obj) {
  var i = 1
    , target
    , key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}


/**
 * Marked
 */

function marked(src, opt, callback) {
  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt;
      opt = null;
    }

    opt = merge({}, marked.defaults, opt || {});

    var highlight = opt.highlight
      , tokens
      , pending
      , i = 0;

    try {
      tokens = Lexer.lex(src, opt)
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    var done = function() {
      var out, err;

      try {
        out = Parser.parse(tokens, opt);
      } catch (e) {
        err = e;
      }

      opt.highlight = highlight;

      return err
        ? callback(err)
        : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done();
    }

    delete opt.highlight;

    if (!pending) return done();

    for (; i < tokens.length; i++) {
      (function(token) {
        if (token.type !== 'code') {
          return --pending || done();
        }
        return highlight(token.text, token.lang, function(err, code) {
          if (code == null || code === token.text) {
            return --pending || done();
          }
          token.text = code;
          token.escaped = true;
          --pending || done();
        });
      })(tokens[i]);
    }

    return;
  }
  try {
    if (opt) opt = merge({}, marked.defaults, opt);
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/chjj/marked.';
    if ((opt || marked.defaults).silent) {
      return '<p>An error occured:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }
}

/**
 * Options
 */

marked.options =
marked.setOptions = function(opt) {
  merge(marked.defaults, opt);
  return marked;
};

marked.defaults = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: false,
  silent: false,
  highlight: null,
  langPrefix: 'lang-',
  smartypants: false,
  headerPrefix: '',
  renderer: new Renderer
};

/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Renderer = Renderer;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.parse = marked;

if (typeof exports === 'object') {
  module.exports = marked;
} else if (typeof define === 'function' && define.amd) {
  define(function() { return marked; });
} else {
  this.marked = marked;
}

}).call(function() {
  return this || (typeof window !== 'undefined' ? window : global);
}());

})(window)
},{}]},{},[3])
;