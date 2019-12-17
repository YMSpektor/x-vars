"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var $ = /** @class */ (function () {
    function $(initialValue) {
        this.listeners = new Map();
        this.subjects = new Set();
        this.currentValue = initialValue;
    }
    Object.defineProperty($.prototype, "$", {
        get: function () { return this.currentValue; },
        set: function (value) {
            this.currentValue = value;
            this.listeners.forEach(function (callbacks) { return (callbacks || []).forEach(function (callback) { return callback(); }); });
        },
        enumerable: true,
        configurable: true
    });
    $.prototype.subscribe = function (listener, callback) {
        listener.subjects.add(this);
        var callbacks = this.listeners.get(listener) || [];
        this.listeners.set(listener, callbacks.concat(callback));
    };
    $.prototype.unsubscribe = function (listener) {
        this.listeners.delete(listener);
        listener.subjects.delete(this);
    };
    $.prototype.release = function () {
        var _this = this;
        this.subjects.forEach(function (x) { return x.unsubscribe(_this); });
    };
    $.gen = function (initialValue, fn, result) {
        var res = result || new $(initialValue);
        fn(function (value) { return res.$ = value; });
        return res;
    };
    $.calc = function (callback, values, result) {
        var res = result || new $(callback.apply(void 0, values.map(function (x) { return x.$; })));
        values.forEach(function (x) { return x.subscribe(res, function () { return res.$ = callback.apply(void 0, __spreadArrays(values.map(function (x) { return x.$; }), [res.$])); }); });
        return res;
    };
    $.release = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        args.forEach(function (x) { return x.release(); });
    };
    return $;
}());
exports.default = $;
//# sourceMappingURL=index.js.map