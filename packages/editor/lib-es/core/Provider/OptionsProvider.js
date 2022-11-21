var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { useRef } from 'react';
import deepEquals from '../utils/deepEquals';
import { OptionsContext } from '../components/hooks';
import { DEFAULT_OPTIONS } from '../defaultOptions';
/*
we memoize the options, so that if you access them, you won't get a fresh object every time.
*/
var OptionsProvider = function (_a) {
    var children = _a.children, options = __rest(_a, ["children"]);
    var lastOptions = useRef();
    var fullOptions = __assign(__assign({}, DEFAULT_OPTIONS), options);
    var isEqual = lastOptions.current
        ? deepEquals(lastOptions.current, fullOptions)
        : false;
    if (!isEqual) {
        lastOptions.current = fullOptions;
    }
    return lastOptions.current ? (React.createElement(OptionsContext.Provider, { value: lastOptions.current }, children)) : null;
};
export default OptionsProvider;
//# sourceMappingURL=OptionsProvider.js.map