import { User } from "./types";
import { safeParseFloat } from './utils';

export function maintain(user: User){
    user.资源.生命值 = Math.min(Math.max(safeParseFloat(user.资源.生命值), 0), safeParseFloat(user.资源.生命值上限));
    user.资源.法力值 = Math.min(Math.max(safeParseFloat(user.资源.法力值), 0), safeParseFloat(user.资源.法力值上限));
    user.资源.体力值 = Math.min(Math.max(safeParseFloat(user.资源.体力值), 0), safeParseFloat(user.资源.体力值上限));
    user.属性.力量 = Math.min(Math.max(safeParseFloat(user.属性.力量), 0), 20)
    user.属性.敏捷 = Math.min(Math.max(safeParseFloat(user.属性.敏捷), 0), 20)
    user.属性.体质 = Math.min(Math.max(safeParseFloat(user.属性.体质), 0), 20)
    user.属性.智力 = Math.min(Math.max(safeParseFloat(user.属性.智力), 0), 20)
    user.属性.精神 = Math.min(Math.max(safeParseFloat(user.属性.精神), 0), 20)
}