import { r as require$$0 } from "./node-fetch.mjs";
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
function getAugmentedNamespace(n) {
  if (Object.prototype.hasOwnProperty.call(n, "__esModule")) return n;
  var f = n.default;
  if (typeof f == "function") {
    var a = function a2() {
      var isInstance = false;
      try {
        isInstance = this instanceof a2;
      } catch {
      }
      if (isInstance) {
        return Reflect.construct(f, arguments, this.constructor);
      }
      return f.apply(this, arguments);
    };
    a.prototype = f.prototype;
  } else a = {};
  Object.defineProperty(a, "__esModule", { value: true });
  Object.keys(n).forEach(function(k) {
    var d = Object.getOwnPropertyDescriptor(n, k);
    Object.defineProperty(a, k, d.get ? d : {
      enumerable: true,
      get: function() {
        return n[k];
      }
    });
  });
  return a;
}
var nodePonyfill = { exports: {} };
var hasRequiredNodePonyfill;
function requireNodePonyfill() {
  if (hasRequiredNodePonyfill) return nodePonyfill.exports;
  hasRequiredNodePonyfill = 1;
  (function(module, exports$1) {
    const nodeFetch = require$$0;
    const realFetch = nodeFetch.default || nodeFetch;
    const fetch = function(url, options) {
      if (/^\/\//.test(url)) {
        url = "https:" + url;
      }
      return realFetch.call(this, url, options);
    };
    fetch.ponyfill = true;
    module.exports = exports$1 = fetch;
    exports$1.fetch = fetch;
    exports$1.Headers = nodeFetch.Headers;
    exports$1.Request = nodeFetch.Request;
    exports$1.Response = nodeFetch.Response;
    exports$1.default = fetch;
  })(nodePonyfill, nodePonyfill.exports);
  return nodePonyfill.exports;
}
var nodePonyfillExports = /* @__PURE__ */ requireNodePonyfill();
export {
  getDefaultExportFromCjs as a,
  getAugmentedNamespace as g,
  nodePonyfillExports as n
};
