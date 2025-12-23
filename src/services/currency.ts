/**
 * 货币兑换服务
 * 当某种货币被扣成负数时，自动从更高层级的货币中换算抵扣
 * 如果所有货币都不足，则产生欠债（负铜币）
 *
 * 核心思路：将所有货币转换为铜币（最小单位）统一计算，再分配回各级货币
 * 保守策略：只在有负数时才进行换算，正常情况保持原样
 *
 * 注意：货币的取整和非负约束由 zod schema 处理，此服务只处理兑换逻辑
 */

import { GameConfig } from '../config';
import type { MessageVariables } from '../types';

/** 兑换率配置 */
const ExchangeRates = {
  gpToSp: GameConfig.GpToSp,
  spToCp: GameConfig.SpToCp,
  gpToCp: GameConfig.GpToSp * GameConfig.SpToCp,
} as const;

/**
 * 将货币转换为统一的铜币单位
 */
const toCopper = (gold: number, silver: number, copper: number): number => {
  return gold * ExchangeRates.gpToCp + silver * ExchangeRates.spToCp + copper;
};

/**
 * 将铜币分配回各级货币
 * 如果总铜币为负，则保持负铜币（表示欠债）
 */
const fromCopper = (total_copper: number): { gold: number; silver: number; copper: number } => {
  if (total_copper < 0) {
    // 欠债情况：金银为0，铜币为负
    return { gold: 0, silver: 0, copper: total_copper };
  }

  // 正常情况：从高到低分配
  const gold = _.floor(total_copper / ExchangeRates.gpToCp);
  const remainingAfterGold = total_copper % ExchangeRates.gpToCp;

  const silver = _.floor(remainingAfterGold / ExchangeRates.spToCp);
  const copper = remainingAfterGold % ExchangeRates.spToCp;

  return { gold, silver, copper };
};

/**
 * 检查是否有任何货币为负数
 */
const hasNegativeCurrency = (gold: number, silver: number, copper: number): boolean => {
  return gold < 0 || silver < 0 || copper < 0;
};

/**
 * 处理货币兑换
 * 只在有负数时才进行换算，正常情况保持原样
 *
 * @param current_variables - 当前的变量数据
 */
export const processCurrencyExchange = (current_variables: MessageVariables): void => {
  const currency = current_variables.stat_data.货币;

  // 只在有负数时才进行换算
  if (!hasNegativeCurrency(currency.金币, currency.银币, currency.铜币)) {
    return;
  }

  // 转换为铜币统一计算
  const totalCopper = toCopper(currency.金币, currency.银币, currency.铜币);

  // 分配回各级货币
  const result = fromCopper(totalCopper);

  // 更新货币数据（约束由 schema 处理）
  currency.金币 = result.gold;
  currency.银币 = result.silver;
  currency.铜币 = result.copper;
};