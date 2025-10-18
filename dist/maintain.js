"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maintain = maintain;
const utils_1 = require("./utils");
function maintain(user) {
    user.资源.生命值 = Math.min(Math.max((0, utils_1.safeParseFloat)(user.资源.生命值), 0), (0, utils_1.safeParseFloat)(user.资源.生命值上限));
    user.资源.法力值 = Math.min(Math.max((0, utils_1.safeParseFloat)(user.资源.法力值), 0), (0, utils_1.safeParseFloat)(user.资源.法力值上限));
    user.资源.体力值 = Math.min(Math.max((0, utils_1.safeParseFloat)(user.资源.体力值), 0), (0, utils_1.safeParseFloat)(user.资源.体力值上限));
    user.属性.力量 = Math.min(Math.max((0, utils_1.safeParseFloat)(user.属性.力量), 0), 20);
    user.属性.敏捷 = Math.min(Math.max((0, utils_1.safeParseFloat)(user.属性.敏捷), 0), 20);
    user.属性.体质 = Math.min(Math.max((0, utils_1.safeParseFloat)(user.属性.体质), 0), 20);
    user.属性.智力 = Math.min(Math.max((0, utils_1.safeParseFloat)(user.属性.智力), 0), 20);
    user.属性.精神 = Math.min(Math.max((0, utils_1.safeParseFloat)(user.属性.精神), 0), 20);
}
