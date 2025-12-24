/**
 * 货币兑换服务
 * 当某种货币被扣成负数时，进行借位换算
 * 如果所有货币都不足，则产生欠债（负铜币）
 *
 * 核心思路：借位后偿还
 * 1. 向上借位：铜负→借银，银负→借金
 * 2. 向下偿还：金负→传递给银，银负→传递给铜
 *
 * 注意：货币的取整和非负约束由 zod schema 处理，此服务只处理兑换逻辑
 */

import { GameConfig } from '../config';
import type { MessageVariables } from '../types';
import { safeGet } from '../utils';

/** 兑换率配置 */
const ExchangeRates = {
  gpToSp: GameConfig.GpToSp,
  spToCp: GameConfig.SpToCp,
} as const;

/**
 * 处理货币兑换
 * 使用借位后偿还策略，直接操作路径确保写入
 */
export const processCurrencyExchange = (current_variables: MessageVariables): void => {
  // 直接获取各货币值
  let 金币 = safeGet(current_variables, 'stat_data.货币.金币', 0);
  let 银币 = safeGet(current_variables, 'stat_data.货币.银币', 0);
  let 铜币 = safeGet(current_variables, 'stat_data.货币.铜币', 0);

  // 向上借位：铜币负 → 借银币
  if (铜币 < 0) {
    const borrow = _.ceil(Math.abs(铜币) / ExchangeRates.spToCp);
    银币 -= borrow;
    铜币 += borrow * ExchangeRates.spToCp;
  }

  // 向上借位：银币负 → 借金币
  if (银币 < 0) {
    const borrow = _.ceil(Math.abs(银币) / ExchangeRates.gpToSp);
    金币 -= borrow;
    银币 += borrow * ExchangeRates.gpToSp;
  }

  // 向下偿还：金币负 → 传给银币
  if (金币 < 0) {
    银币 += 金币 * ExchangeRates.gpToSp;
    金币 = 0;
  }

  // 向下偿还：银币负 → 传给铜币（可能产生欠债）
  if (银币 < 0) {
    铜币 += 银币 * ExchangeRates.spToCp;
    银币 = 0;
  }

  // 直接写回路径，确保数据持久化
  _.set(current_variables, 'stat_data.货币.金币', 金币);
  _.set(current_variables, 'stat_data.货币.银币', 银币);
  _.set(current_variables, 'stat_data.货币.铜币', 铜币);
};