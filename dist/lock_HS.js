"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lock_favorability = Lock_favorability;
function Lock_favorability(fatesystem) {
    var _a, _b, _c, _d;
    if (((_b = (_a = fatesystem.命定之人) === null || _a === void 0 ? void 0 : _a.希洛西娅) === null || _b === void 0 ? void 0 : _b.好感度) && fatesystem.命定之人.希洛西娅.好感度 >= 40) {
        fatesystem.命定之人.希洛西娅.好感度 = 39;
    }
    if (((_d = (_c = fatesystem.命定之人) === null || _c === void 0 ? void 0 : _c.希尔薇娅) === null || _d === void 0 ? void 0 : _d.好感度) && fatesystem.命定之人.希尔薇娅.好感度 >= 40) {
        fatesystem.命定之人.希尔薇娅.好感度 = 39;
    }
}
