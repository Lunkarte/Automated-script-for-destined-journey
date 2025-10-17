/**
 * Automated Script for Destined Journey
 * 命定之旅自动化脚本
 * 
 * @version 1.0.3
 * @date 2025-10-17
 * @license MIT
 * 
 * 这是一个自动生成的合并文件，包含以下模块：
 * - utils.js
- config.js
- experience-level.js
- currency-system.js
- info-injection.js
- event-chain-system.js
- main-controller.js
 */

(function() {
  'use strict';

// ============================================================
// utils.js
// ============================================================
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeParseFloat = safeParseFloat;
exports.uninject = uninject;
/**
 * 安全的浮点数解析函数
 * @param {*} value - 要解析的值
 * @returns {number} - 解析后的数值，如果解析失败则返回0
 */
function safeParseFloat(value) {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
}
/**
 * 解除注入的提示信息
 * @param {Array<string>} idsToRemove - 要移除的ID数组
 */
function uninject() {
    const idsToRemove = ["AP+", "Location", "Time", "LV+"];
    uninjectPrompts(idsToRemove);
}


// ============================================================
// config.js
// ============================================================
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GAME_CONFIG = exports.JOB_LEVEL_XP_TABLE = exports.MILESTONE_LEVELS = void 0;
// 里程碑等级配置
exports.MILESTONE_LEVELS = {
    5: { strength: 1, agility: 1, constitution: 1, intelligence: 1, spirit: 1, tier: '第二层级/中坚' },
    9: { strength: 1, agility: 1, constitution: 1, intelligence: 1, spirit: 1, tier: '第三层级/精英' },
    13: { strength: 1, agility: 1, constitution: 1, intelligence: 1, spirit: 1, tier: '第四层级/史诗' },
    17: { strength: 1, agility: 1, constitution: 1, intelligence: 1, spirit: 1, tier: '第五层级/传说' },
    21: { strength: 1, agility: 1, constitution: 1, intelligence: 1, spirit: 1, tier: '第六层级/神话' },
    25: { strength: 1, agility: 1, constitution: 1, intelligence: 1, spirit: 1, tier: '第七层级/登神' }
};
// 职业等级经验表
exports.JOB_LEVEL_XP_TABLE = {
    0: 0, 1: 15, 2: 55, 3: 130, 4: 290, 5: 640, 6: 1120, 7: 1750, 8: 2710, 9: 3385,
    10: 4225, 11: 5215, 12: 6475, 13: 7515, 14: 8747, 15: 10187, 16: 11979, 17: 12574, 18: 13294, 19: 14149,
    20: 15349, 21: 15601, 22: 15865, 23: 16279, 24: 17500, 25: 1145141919810
};
// 核心游戏配置
exports.GAME_CONFIG = {
    PP_TO_GP: 100,
    GP_TO_SP: 100,
    SP_TO_CP: 100,
    AP_Acquisition_Level: 1,
};


// ============================================================
// experience-level.js
// ============================================================
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.experiencegrowth = experiencegrowth;
const config_1 = require("./config");
const utils_1 = require("./utils");
function experiencegrowth(user) {
    // 校准升级所需经验
    user.状态.升级所需经验 = config_1.JOB_LEVEL_XP_TABLE[user.状态.等级];
    const currentLevel = user.状态.等级;
    // 确保累计经验值不低于前一级的要求
    if (currentLevel > 0) {
        const requiredXpForPreviousLevel = config_1.JOB_LEVEL_XP_TABLE[currentLevel - 1];
        if ((0, utils_1.safeParseFloat)(user.状态.累计经验值) < requiredXpForPreviousLevel) {
            user.状态.累计经验值 = requiredXpForPreviousLevel;
        }
    }
    let hasLeveledUp = false;
    // 升级处理循环
    while ((0, utils_1.safeParseFloat)(user.状态.累计经验值) >=
        (0, utils_1.safeParseFloat)(user.状态.升级所需经验)) {
        if (!config_1.JOB_LEVEL_XP_TABLE[user.状态.等级]) {
            break;
        }
        user.状态.等级 = (0, utils_1.safeParseFloat)(user.状态.等级) + 1;
        hasLeveledUp = true;
        user.状态.升级所需经验 = config_1.JOB_LEVEL_XP_TABLE[user.状态.等级];
        // 检查是否获得属性点
        if (user.状态.等级 % config_1.GAME_CONFIG.AP_Acquisition_Level === 0) {
            user.属性.属性点 = (0, utils_1.safeParseFloat)(user.属性.属性点) + 1;
            injectPrompts([
                {
                    id: "AP+",
                    position: "in_chat",
                    role: "system",
                    depth: 0,
                    content: "core_system: The {{user}} has reached a specific level and obtained attribute points. Guide the {{user}} to use attribute points",
                    should_scan: true,
                },
            ]);
        }
        // 检查里程碑等级
        const milestone = config_1.MILESTONE_LEVELS[user.状态.等级];
        if (milestone) {
            user.属性.力量 = (0, utils_1.safeParseFloat)(user.属性.力量) + milestone.strength;
            user.属性.敏捷 = (0, utils_1.safeParseFloat)(user.属性.敏捷) + milestone.agility;
            user.属性.体质 = (0, utils_1.safeParseFloat)(user.属性.体质) + milestone.constitution;
            user.属性.智力 = (0, utils_1.safeParseFloat)(user.属性.智力) + milestone.intelligence;
            user.属性.精神 = (0, utils_1.safeParseFloat)(user.属性.精神) + milestone.spirit;
            user.状态.生命层级 = milestone.tier;
        }
    }
    // 如果升级了，注入升级提示
    if (hasLeveledUp) {
        injectPrompts([
            {
                id: "LV+",
                position: "in_chat",
                role: "system",
                depth: 0,
                content: `core_system: The {{user}} level increased from ${currentLevel} to ${user.状态.等级}`,
                should_scan: true,
            },
        ]);
    }
}


// ============================================================
// currency-system.js
// ============================================================
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencySystem = CurrencySystem;
const config_1 = require("./config");
const utils_1 = require("./utils");
/**
 * 货币系统模块
 * 当某种货币被扣成负数时，自动从更高层级的货币中换算抵扣
 * 如果所有货币都不足，则产生欠债（负CP）
 *
 * @param {Object} property - 财产对象，包含货币信息
 */
function CurrencySystem(property) {
    let PP = (0, utils_1.safeParseFloat)(property.货币.白金币);
    let GP = (0, utils_1.safeParseFloat)(property.货币.金币);
    let SP = (0, utils_1.safeParseFloat)(property.货币.银币);
    let CP = (0, utils_1.safeParseFloat)(property.货币.铜币);
    function handleCurrencyExchange() {
        let deficit = 0;
        let currencyCleared = false;
        // PP购买处理：PP被扣成负时的换算逻辑
        // 新逻辑：优先用GP抵扣 → SP转GP循环 → CP转SP循环
        if (PP < 0) {
            let ppDeficit = Math.abs(PP);
            // 阶段1：优先用GP抵扣 (1PP = 100GP)
            if (GP > 0) {
                let gpCanCover = GP / config_1.GAME_CONFIG.PP_TO_GP;
                if (gpCanCover >= ppDeficit) {
                    // GP足够抵扣
                    GP -= ppDeficit * config_1.GAME_CONFIG.PP_TO_GP;
                    PP = 0;
                    ppDeficit = 0;
                }
                else {
                    // GP不足，用完所有GP
                    ppDeficit -= gpCanCover;
                    GP = 0;
                }
            }
            // 阶段2：GP不足时，将SP转换为GP循环抵扣
            while (ppDeficit > 0 && SP > 0) {
                // 计算需要多少SP来换1PP (1PP = 100GP, 1GP = 100SP, 所以1PP = 10000SP)
                let spNeeded = config_1.GAME_CONFIG.PP_TO_GP * config_1.GAME_CONFIG.GP_TO_SP;
                if (SP >= spNeeded) {
                    // 将10000SP转换为1PP
                    SP -= spNeeded;
                    PP += 1;
                    ppDeficit -= 1;
                }
                else {
                    // SP不足以换1PP，将剩余SP转换为GP
                    GP = Math.floor(SP / config_1.GAME_CONFIG.GP_TO_SP);
                    SP = SP % config_1.GAME_CONFIG.GP_TO_SP;
                    // 用新获得的GP抵扣PP
                    let gpCanCover = GP / config_1.GAME_CONFIG.PP_TO_GP;
                    if (gpCanCover >= ppDeficit) {
                        GP -= ppDeficit * config_1.GAME_CONFIG.PP_TO_GP;
                        PP = 0;
                        ppDeficit = 0;
                    }
                    else {
                        ppDeficit -= gpCanCover;
                        GP = 0;
                    }
                    break; // SP已用完，退出循环
                }
            }
            // 阶段3：SP为0时若仍不足，将CP转换为SP，然后重复SP_TO_GP过程
            while (ppDeficit > 0 && CP > 0) {
                // 将CP转换为SP (每次转换尽可能多)
                let spFromCp = Math.floor(CP / config_1.GAME_CONFIG.SP_TO_CP);
                let remainingCp = CP % config_1.GAME_CONFIG.SP_TO_CP;
                if (spFromCp > 0) {
                    SP = spFromCp;
                    CP = remainingCp;
                    // 重复SP转GP转PP的过程
                    while (ppDeficit > 0 && SP > 0) {
                        let spNeeded = config_1.GAME_CONFIG.PP_TO_GP * config_1.GAME_CONFIG.GP_TO_SP;
                        if (SP >= spNeeded) {
                            SP -= spNeeded;
                            PP += 1;
                            ppDeficit -= 1;
                        }
                        else {
                            // SP不足以换1PP，将剩余SP转换为GP
                            GP = Math.floor(SP / config_1.GAME_CONFIG.GP_TO_SP);
                            SP = SP % config_1.GAME_CONFIG.GP_TO_SP;
                            let gpCanCover = GP / config_1.GAME_CONFIG.PP_TO_GP;
                            if (gpCanCover >= ppDeficit) {
                                GP -= ppDeficit * config_1.GAME_CONFIG.PP_TO_GP;
                                PP = 0;
                                ppDeficit = 0;
                            }
                            else {
                                ppDeficit -= gpCanCover;
                                GP = 0;
                            }
                            break;
                        }
                    }
                }
                // 如果仍有债务但CP不足以换SP，退出循环
                if (ppDeficit > 0 && CP < config_1.GAME_CONFIG.SP_TO_CP) {
                    break;
                }
            }
            // 阶段4：所有货币都耗尽，将PP债务转换为CP债务
            if (ppDeficit > 0) {
                CP = -(ppDeficit * config_1.GAME_CONFIG.PP_TO_GP * config_1.GAME_CONFIG.GP_TO_SP * config_1.GAME_CONFIG.SP_TO_CP);
                PP = 0;
                currencyCleared = true;
            }
        }
        // GP购买处理：GP被扣成负时的换算逻辑
        // 新逻辑：优先用PP抵扣 → SP转PP循环 → CP转SP循环
        if (GP < 0 && !currencyCleared) {
            let gpDeficit = Math.abs(GP);
            // 阶段1：优先用PP抵扣 (1PP = 100GP)
            if (PP > 0) {
                let ppCanCover = PP * config_1.GAME_CONFIG.PP_TO_GP;
                if (ppCanCover >= gpDeficit) {
                    // PP足够抵扣
                    let ppNeeded = Math.ceil(gpDeficit / config_1.GAME_CONFIG.PP_TO_GP);
                    PP -= ppNeeded;
                    GP = ppNeeded * config_1.GAME_CONFIG.PP_TO_GP - gpDeficit;
                    gpDeficit = 0;
                }
                else {
                    // PP不足，用完所有PP
                    gpDeficit -= ppCanCover;
                    PP = 0;
                }
            }
            // 阶段2：PP不足时，将SP转换为PP循环抵扣
            while (gpDeficit > 0 && SP > 0) {
                // 计算需要多少SP来换1PP (1PP = 100GP * 100SP = 10000SP)
                let spNeeded = config_1.GAME_CONFIG.PP_TO_GP * config_1.GAME_CONFIG.GP_TO_SP;
                if (SP >= spNeeded) {
                    // 将SP转换为PP
                    SP -= spNeeded;
                    PP = 1;
                    // 用新获得的PP转GP抵扣
                    let ppCanCover = PP * config_1.GAME_CONFIG.PP_TO_GP;
                    if (ppCanCover >= gpDeficit) {
                        let ppNeeded = Math.ceil(gpDeficit / config_1.GAME_CONFIG.PP_TO_GP);
                        PP -= ppNeeded;
                        GP = ppNeeded * config_1.GAME_CONFIG.PP_TO_GP - gpDeficit;
                        gpDeficit = 0;
                    }
                    else {
                        gpDeficit -= ppCanCover;
                        PP = 0;
                    }
                }
                else {
                    // SP不足以换1PP，退出循环
                    break;
                }
            }
            // 阶段3：SP为0时若仍不足，将CP转换为SP，然后重复SP_TO_PP过程
            while (gpDeficit > 0 && CP > 0) {
                // 计算需要多少CP来换1PP (1PP = 1000000CP)
                let cpNeeded = config_1.GAME_CONFIG.PP_TO_GP * config_1.GAME_CONFIG.GP_TO_SP * config_1.GAME_CONFIG.SP_TO_CP;
                if (CP >= cpNeeded) {
                    // 将CP转换为PP
                    CP -= cpNeeded;
                    PP = 1;
                    // 用新获得的PP抵扣GP
                    let ppCanCover = PP * config_1.GAME_CONFIG.PP_TO_GP;
                    if (ppCanCover >= gpDeficit) {
                        let ppNeeded = Math.ceil(gpDeficit / config_1.GAME_CONFIG.PP_TO_GP);
                        PP -= ppNeeded;
                        GP = ppNeeded * config_1.GAME_CONFIG.PP_TO_GP - gpDeficit;
                        gpDeficit = 0;
                    }
                    else {
                        gpDeficit -= ppCanCover;
                        PP = 0;
                    }
                }
                else {
                    // CP不足以换1PP，退出循环
                    break;
                }
            }
            // 阶段4：所有货币都耗尽，将GP债务转换为CP债务
            if (gpDeficit > 0) {
                CP = -(gpDeficit * config_1.GAME_CONFIG.GP_TO_SP * config_1.GAME_CONFIG.SP_TO_CP);
                GP = 0;
                currencyCleared = true;
            }
        }
        // SP购买处理：SP被扣成负时的换算逻辑
        // 新逻辑：优先用GP抵扣 → PP转GP循环 → CP转PP循环
        if (SP < 0 && !currencyCleared) {
            let spDeficit = Math.abs(SP);
            // 阶段1：优先用GP抵扣 (1GP = 100SP)
            if (GP > 0) {
                let gpCanCover = GP * config_1.GAME_CONFIG.GP_TO_SP;
                if (gpCanCover >= spDeficit) {
                    // GP足够抵扣
                    let gpNeeded = Math.ceil(spDeficit / config_1.GAME_CONFIG.GP_TO_SP);
                    GP -= gpNeeded;
                    SP = gpNeeded * config_1.GAME_CONFIG.GP_TO_SP - spDeficit;
                    spDeficit = 0;
                }
                else {
                    // GP不足，用完所有GP
                    spDeficit -= gpCanCover;
                    GP = 0;
                }
            }
            // 阶段2：GP不足时，将PP转换为GP循环抵扣
            while (spDeficit > 0 && PP > 0) {
                // 将1PP转换为100GP
                PP -= 1;
                GP = config_1.GAME_CONFIG.PP_TO_GP;
                // 用新获得的GP抵扣SP
                let gpCanCover = GP * config_1.GAME_CONFIG.GP_TO_SP;
                if (gpCanCover >= spDeficit) {
                    // 新获得的GP足够抵扣剩余债务
                    let gpNeeded = Math.ceil(spDeficit / config_1.GAME_CONFIG.GP_TO_SP);
                    GP -= gpNeeded;
                    SP = gpNeeded * config_1.GAME_CONFIG.GP_TO_SP - spDeficit;
                    spDeficit = 0;
                }
                else {
                    // 新获得的GP仍不足，用完后继续循环
                    spDeficit -= gpCanCover;
                    GP = 0;
                }
            }
            // 阶段3：PP为0时若仍不足，将CP转换为PP，然后重复PP_TO_GP过程
            while (spDeficit > 0 && CP > 0) {
                // 计算需要多少CP来换1PP (1PP = 1000000CP)
                let cpNeeded = config_1.GAME_CONFIG.PP_TO_GP * config_1.GAME_CONFIG.GP_TO_SP * config_1.GAME_CONFIG.SP_TO_CP;
                if (CP >= cpNeeded) {
                    // 将CP转换为PP
                    CP -= cpNeeded;
                    PP = 1;
                    // 用新获得的PP转GP抵扣SP
                    PP -= 1;
                    GP = config_1.GAME_CONFIG.PP_TO_GP;
                    let gpCanCover = GP * config_1.GAME_CONFIG.GP_TO_SP;
                    if (gpCanCover >= spDeficit) {
                        let gpNeeded = Math.ceil(spDeficit / config_1.GAME_CONFIG.GP_TO_SP);
                        GP -= gpNeeded;
                        SP = gpNeeded * config_1.GAME_CONFIG.GP_TO_SP - spDeficit;
                        spDeficit = 0;
                    }
                    else {
                        spDeficit -= gpCanCover;
                        GP = 0;
                    }
                }
                else {
                    // CP不足以换1PP，退出循环
                    break;
                }
            }
            // 阶段4：所有货币都耗尽，将SP债务转换为CP债务
            if (spDeficit > 0) {
                CP = -(spDeficit * config_1.GAME_CONFIG.SP_TO_CP);
                SP = 0;
                currencyCleared = true;
            }
        }
        // CP购买处理：CP被扣成负时的换算逻辑
        // 新逻辑：优先用SP抵扣 → GP转SP循环 → PP转GP循环
        if (CP < 0 && !currencyCleared) {
            let cpDeficit = Math.abs(CP);
            // 阶段1：优先用SP抵扣 (1SP = 100CP)
            if (SP > 0) {
                let spCanCover = SP * config_1.GAME_CONFIG.SP_TO_CP;
                if (spCanCover >= cpDeficit) {
                    // SP足够抵扣
                    let spNeeded = Math.ceil(cpDeficit / config_1.GAME_CONFIG.SP_TO_CP);
                    SP -= spNeeded;
                    CP = spNeeded * config_1.GAME_CONFIG.SP_TO_CP - cpDeficit;
                    cpDeficit = 0;
                }
                else {
                    // SP不足，用完所有SP
                    cpDeficit -= spCanCover;
                    SP = 0;
                }
            }
            // 阶段2：SP不足时，将GP转换为SP循环抵扣
            while (cpDeficit > 0 && GP > 0) {
                // 将1GP转换为100SP
                GP -= 1;
                SP = config_1.GAME_CONFIG.GP_TO_SP;
                // 用新获得的SP抵扣CP
                let spCanCover = SP * config_1.GAME_CONFIG.SP_TO_CP;
                if (spCanCover >= cpDeficit) {
                    // 新获得的SP足够抵扣剩余债务
                    let spNeeded = Math.ceil(cpDeficit / config_1.GAME_CONFIG.SP_TO_CP);
                    SP -= spNeeded;
                    CP = spNeeded * config_1.GAME_CONFIG.SP_TO_CP - cpDeficit;
                    cpDeficit = 0;
                }
                else {
                    // 新获得的SP仍不足，用完后继续循环
                    cpDeficit -= spCanCover;
                    SP = 0;
                }
            }
            // 阶段3：GP为0时若仍不足，将PP转换为GP，然后重复GP_TO_SP过程
            while (cpDeficit > 0 && PP > 0) {
                // 将1PP转换为100GP
                PP -= 1;
                GP = config_1.GAME_CONFIG.PP_TO_GP;
                // 重复GP转SP的过程
                while (cpDeficit > 0 && GP > 0) {
                    // 将1GP转换为100SP
                    GP -= 1;
                    SP = config_1.GAME_CONFIG.GP_TO_SP;
                    // 用新获得的SP抵扣CP
                    let spCanCover = SP * config_1.GAME_CONFIG.SP_TO_CP;
                    if (spCanCover >= cpDeficit) {
                        // 新获得的SP足够抵扣剩余债务
                        let spNeeded = Math.ceil(cpDeficit / config_1.GAME_CONFIG.SP_TO_CP);
                        SP -= spNeeded;
                        CP = spNeeded * config_1.GAME_CONFIG.SP_TO_CP - cpDeficit;
                        cpDeficit = 0;
                    }
                    else {
                        // 新获得的SP仍不足，用完后继续循环
                        cpDeficit -= spCanCover;
                        SP = 0;
                    }
                }
            }
            // 阶段4：所有货币都耗尽，CP保持负值表示欠债
            if (cpDeficit > 0) {
                CP = -cpDeficit;
                currencyCleared = true;
            }
        }
    }
    handleCurrencyExchange();
    property.货币.白金币 = Math.max(0, Math.floor(PP));
    property.货币.金币 = Math.max(0, Math.floor(GP));
    property.货币.银币 = Math.max(0, Math.floor(SP));
    property.货币.铜币 = Math.floor(CP);
}


// ============================================================
// info-injection.js
// ============================================================
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inforead = inforead;
/**
 * 信息读取与注入模块
 * @param {Object} world - 世界对象
 */
function inforead(world) {
    // 注入地点信息
    injectPrompts([
        {
            id: "Location",
            content: world.地点,
            position: "none",
            depth: 0,
            role: "system",
            should_scan: true,
        },
    ]);
    // 注入时间信息
    injectPrompts([
        {
            id: "Time",
            content: world.时间,
            position: "none",
            depth: 0,
            role: "system",
            should_scan: true,
        },
    ]);
}


// ============================================================
// event-chain-system.js
// ============================================================
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event_chain = event_chain;
function event_chain(eventchain, world) {
    uninjectPrompts(["event_chain_end"]);
    injectPrompts([
        {
            id: "event_chain_end",
            content: eventchain.已完成事件,
            position: "none",
            depth: 0,
            role: "system",
            should_scan: true,
        },
    ]);
    if (eventchain.开启 == true) {
        eventchain.开启 = true;
        localStorage.setItem("event_chain_time", `${world.时间}`);
        // 清除之前的事件链注入
        uninjectPrompts(["event_chain"]);
        uninjectPrompts(["event_chain_tips"]);
        const title = eventchain.标题;
        const step = eventchain.阶段;
        // 注入当前事件链状态
        injectPrompts([
            {
                id: "event_chain",
                content: `1145141919810当前事件为${title}，当前步骤为${step}`,
                position: "none",
                depth: 0,
                role: "system",
                should_scan: true,
            },
        ]);
        // 注入事件链激活提示
        injectPrompts([
            {
                id: "event_chain_tips",
                content: `core_system:The event chain has been activated, please note<event_chain>`,
                position: "in_chat",
                depth: 0,
                role: "system",
                should_scan: true,
            },
        ]);
    }
    // 检查是否结束事件链
    if (eventchain.结束 == true) {
        eventchain.结束 = true;
        const title = eventchain.标题;
        if (eventchain.琥珀事件 == true) {
            eventchain.琥珀事件 = true;
            let time = localStorage.getItem("event_chain_time");
            if (time !== null)
                world.时间 = time;
        }
        uninjectPrompts(["event_chain"]);
        uninjectPrompts(["event_chain_tips"]);
        eventchain.已完成事件.push(`已完成事件${title}`);
        eventchain.标题 = "";
        eventchain.阶段 = "";
        eventchain.结束 = false;
        eventchain.开启 = false;
        eventchain.琥珀事件 = false;
        localStorage.removeItem("event_chain_time");
    }
}


// ============================================================
// main-controller.js
// ============================================================
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const experience_level_1 = require("./experience-level");
const currency_system_1 = require("./currency-system");
const info_injection_1 = require("./info-injection");
const event_chain_system_1 = require("./event-chain-system");
function Main_processes(variables) {
    const user = variables.stat_data.角色;
    const property = variables.stat_data.财产;
    const world = variables.stat_data.世界;
    const eventchain = variables.stat_data.事件链;
    const fatesystem = variables.stat_data.命运系统;
    if (!user || !property || !world || !eventchain || !fatesystem) {
        console.error("Core data missing, script terminated");
        return;
    }
    // 按照顺序执行模块
    //Lock_favorability(fatesystem);
    (0, utils_1.uninject)();
    (0, experience_level_1.experiencegrowth)(user);
    (0, currency_system_1.CurrencySystem)(property);
    (0, info_injection_1.inforead)(world);
    (0, event_chain_system_1.event_chain)(eventchain, world);
}
// ============================ [事件监听] ============================
eventOn('mag_variable_update_ended', Main_processes);
eventOn("message_sent", Main_processes);
eventOnButton('重新处理变量', Main_processes);



})();