"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lock_favorability = Lock_favorability;
function Lock_favorability(fatesystem) {
    var _a, _b;
    const { 红线对象 } = fatesystem;
    if (((_a = 红线对象 === null || 红线对象 === void 0 ? void 0 : 红线对象.希洛西娅) === null || _a === void 0 ? void 0 : _a.好感度) && 红线对象.希洛西娅.好感度 >= 40) {
        红线对象.希洛西娅.好感度 = 39;
    }
    if (((_b = 红线对象 === null || 红线对象 === void 0 ? void 0 : 红线对象.希尔薇娅) === null || _b === void 0 ? void 0 : _b.好感度) && 红线对象.希尔薇娅.好感度 >= 40) {
        红线对象.希尔薇娅.好感度 = 39;
    }
}
