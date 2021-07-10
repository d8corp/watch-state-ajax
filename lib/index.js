'use strict';

var tslib = require('tslib');
var Async = require('@watch-state/async');
var watchState = require('watch-state');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Async__default = /*#__PURE__*/_interopDefaultLegacy(Async);

var Ajax = /** @class */ (function (_super) {
    tslib.__extends(Ajax, _super);
    function Ajax(url, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, tslib.__assign(tslib.__assign({}, options), { request: function (resolve, reject) {
                var e_1, _a;
                var _b = options.type, type = _b === void 0 ? 'text' : _b;
                var query = '';
                for (var key in _this.query) {
                    var value = _this.query[key];
                    if (!value)
                        continue;
                    if (Array.isArray(value)) {
                        try {
                            for (var value_1 = (e_1 = void 0, tslib.__values(value)), value_1_1 = value_1.next(); !value_1_1.done; value_1_1 = value_1.next()) {
                                var subValue = value_1_1.value;
                                query += (query && '&') + key + '[]=' + subValue;
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (value_1_1 && !value_1_1.done && (_a = value_1.return)) _a.call(value_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                    }
                    else {
                        query += (query && '&') + key + '=' + value;
                    }
                }
                if (query) {
                    query = '?' + query;
                }
                var answer;
                fetch(url.replace(/\{(\w+)\}/g, function (str, key) { return _this.data[key] + ''; }) + query, options).then(function (data) {
                    answer = data;
                    return data[type]();
                }).then(function (data) {
                    watchState.globalEvent.start();
                    _this.answer = answer;
                    answer.status > 399 ? reject(data) : resolve(data);
                    watchState.globalEvent.end();
                }, function (e) {
                    watchState.globalEvent.start();
                    _this.answer = answer;
                    reject(e);
                    watchState.globalEvent.end();
                });
            } })) || this;
        _this._answer = new watchState.State();
        _this.query = options.query || {};
        _this.data = options.data || {};
        return _this;
    }
    Object.defineProperty(Ajax.prototype, "answer", {
        get: function () {
            return this._answer.value;
        },
        set: function (value) {
            this._answer.value = value;
        },
        enumerable: false,
        configurable: true
    });
    return Ajax;
}(Async__default['default']));

module.exports = Ajax;
