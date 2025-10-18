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
    let GP = (0, utils_1.safeParseFloat)(property.货币.金币);
    let SP = (0, utils_1.safeParseFloat)(property.货币.银币);
    let CP = (0, utils_1.safeParseFloat)(property.货币.铜币);
    function handleCurrencyExchange() {
        let currencyCleared = false;
        // GP购买处理：GP被扣成负时的换算逻辑
        // 逻辑：优先用SP抵扣 → CP转SP循环
        if (GP < 0 && !currencyCleared) {
            let gpDeficit = Math.abs(GP);
            // 阶段1：优先用SP抵扣 (1GP = 100SP)
            if (SP > 0) {
                let spCanCover = Math.floor(SP / config_1.GAME_CONFIG.GP_TO_SP);
                if (spCanCover >= gpDeficit) {
                    // SP足够抵扣
                    SP -= gpDeficit * config_1.GAME_CONFIG.GP_TO_SP;
                    GP = 0;
                    gpDeficit = 0;
                }
                else {
                    // SP不足，用完所有SP
                    gpDeficit -= spCanCover;
                    SP = SP % config_1.GAME_CONFIG.GP_TO_SP;
                }
            }
            // 阶段2：SP不足时，将CP转换为SP循环抵扣
            while (gpDeficit > 0 && CP > 0) {
                // 计算需要多少CP来换1GP (1GP = 100SP * 100CP = 10000CP)
                let cpNeeded = config_1.GAME_CONFIG.GP_TO_SP * config_1.GAME_CONFIG.SP_TO_CP;
                if (CP >= cpNeeded) {
                    // 将CP转换为GP
                    CP -= cpNeeded;
                    GP += 1;
                    gpDeficit -= 1;
                }
                else {
                    // CP不足以换1GP，将剩余CP转换为SP
                    SP = Math.floor(CP / config_1.GAME_CONFIG.SP_TO_CP);
                    CP = CP % config_1.GAME_CONFIG.SP_TO_CP;
                    // 用新获得的SP抵扣GP
                    let spCanCover = Math.floor(SP / config_1.GAME_CONFIG.GP_TO_SP);
                    if (spCanCover >= gpDeficit) {
                        SP -= gpDeficit * config_1.GAME_CONFIG.GP_TO_SP;
                        GP = 0;
                        gpDeficit = 0;
                    }
                    else {
                        gpDeficit -= spCanCover;
                        SP = SP % config_1.GAME_CONFIG.GP_TO_SP;
                    }
                    break; // CP已用完，退出循环
                }
            }
            // 阶段3：所有货币都耗尽，将GP债务转换为CP债务
            if (gpDeficit > 0) {
                CP = -(gpDeficit * config_1.GAME_CONFIG.GP_TO_SP * config_1.GAME_CONFIG.SP_TO_CP);
                GP = 0;
                currencyCleared = true;
            }
        }
        // SP购买处理：SP被扣成负时的换算逻辑
        // 逻辑：优先用GP抵扣 → CP转GP循环
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
            // 阶段2：GP不足时，将CP转换为GP循环抵扣
            while (spDeficit > 0 && CP > 0) {
                // 计算需要多少CP来换1GP (1GP = 100SP * 100CP = 10000CP)
                let cpNeeded = config_1.GAME_CONFIG.GP_TO_SP * config_1.GAME_CONFIG.SP_TO_CP;
                if (CP >= cpNeeded) {
                    // 将CP转换为GP
                    CP -= cpNeeded;
                    GP = 1;
                    // 用新获得的GP抵扣SP
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
                    // CP不足以换1GP，退出循环
                    break;
                }
            }
            // 阶段3：所有货币都耗尽，将SP债务转换为CP债务
            if (spDeficit > 0) {
                CP = -(spDeficit * config_1.GAME_CONFIG.SP_TO_CP);
                SP = 0;
                currencyCleared = true;
            }
        }
        // CP购买处理：CP被扣成负时的换算逻辑
        // 逻辑：优先用SP抵扣 → GP转SP循环
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
            // 阶段3：所有货币都耗尽，CP保持负值表示欠债
            if (cpDeficit > 0) {
                CP = -cpDeficit;
                currencyCleared = true;
            }
        }
    }
    handleCurrencyExchange();
    property.货币.金币 = Math.max(0, Math.floor(GP));
    property.货币.银币 = Math.max(0, Math.floor(SP));
    property.货币.铜币 = Math.floor(CP);
}
