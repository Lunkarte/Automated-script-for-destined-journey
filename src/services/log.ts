/**
 * 日志系统服务
 * 负责跟踪和记录游戏统计数据
 * 数据存储在 date.log 下
 */

import type { LogData, MessageVariables } from '@/types';
import { safeGet } from '@/utils';

/** 日志数据默认值 */
export const DefaultLogData: LogData = {
  deathCount: 0,
  maxCurrencyDebt: 0,
  bankruptcyCount: 0,
  illegalLevelUpId: [],
};

/**
 * 获取日志数据（从 date.log 获取，不存在则返回默认值的副本）
 */
const getLogData = (variables: MessageVariables): LogData => {
  const existingLog = safeGet(variables, 'date.log', null);
  if (existingLog) {
    return existingLog;
  } else {
    return { ...DefaultLogData };
  }
};

/**
 * 检测角色死亡
 * 当生命值从正数变为0或以下时计为死亡
 */
const checkDeath = (current: MessageVariables, old: MessageVariables, log: LogData): void => {
  const currentHp = safeGet(current, 'stat_data.角色.生命值', 1);
  const oldHp = safeGet(old, 'stat_data.角色.生命值', 1);

  if (oldHp > 0 && currentHp <= 0) {
    log.deathCount++;
  }
};

/**
 * 检测货币欠款
 * 当铜币为负数时，记录最大欠款额度
 */
const checkCurrencyDebt = (current: MessageVariables, log: LogData): void => {
  const 铜币 = safeGet(current, 'stat_data.货币.铜币', 0);

  if (铜币 < 0) {
    const debt = Math.abs(铜币);
    if (debt > log.maxCurrencyDebt) {
      log.maxCurrencyDebt = debt;
    }
  }
};

/**
 * 检测破产
 * 当所有货币都为0或负数且之前有正资产时计为破产
 */
const checkBankruptcy = (current: MessageVariables, old: MessageVariables, log: LogData): void => {
  const current金币 = safeGet(current, 'stat_data.货币.金币', 0);
  const current银币 = safeGet(current, 'stat_data.货币.银币', 0);
  const current铜币 = safeGet(current, 'stat_data.货币.铜币', 0);

  const old金币 = safeGet(old, 'stat_data.货币.金币', 0);
  const old银币 = safeGet(old, 'stat_data.货币.银币', 0);
  const old铜币 = safeGet(old, 'stat_data.货币.铜币', 0);

  // 计算总资产（转换为铜币单位）
  const currentTotal = current金币 * 10000 + current银币 * 100 + current铜币;
  const oldTotal = old金币 * 10000 + old银币 * 100 + old铜币;

  // 如果之前有正资产，现在总资产为负或为零，则计为破产
  if (oldTotal > 0 && currentTotal <= 0) {
    log.bankruptcyCount++;
  }
};

/**
 * 记录AI非法提升等级
 * 由 maintain.ts 调用，使用 getLastMessageId() 获取发生错误的楼层号
 */
export const recordIllegalLevelUp = (): void => {
  // 获取当前日志数据
  const variables = getVariables({ type: 'message' }) as MessageVariables;
  const log = getLogData(variables);

  // 获取发生错误的楼层ID
  const messageId = getLastMessageId();

  // 如果该楼层ID尚未记录，则添加到列表中
  if (!log.illegalLevelUpId.includes(messageId)) {
    log.illegalLevelUpId.push(messageId);
  }

  // 使用 insertOrAssignVariables 持久化
  insertOrAssignVariables({ date: { log: { illegalLevelUpId: log.illegalLevelUpId } } }, { type: 'message' });
};

/**
 * 日志系统主函数
 * 在变量更新时检测并记录各种统计数据
 */
export const logSystem = (
  new_variables: MessageVariables,
  old_variables: MessageVariables
): void => {
  // 获取现有的日志数据
  const log = getLogData(new_variables);

  // 检测各种事件
  checkDeath(new_variables, old_variables, log);
  checkCurrencyDebt(new_variables, log);
  checkBankruptcy(new_variables, old_variables, log);

  // 使用 insertOrAssignVariables 持久化 date.log 到消息楼层变量
  // 只更新本函数管理的字段，避免覆盖 recordIllegalLevelUp 更新的 illegalLevelUpCount
  insertOrAssignVariables({
    date: {
      log: {
        deathCount: log.deathCount,
        maxCurrencyDebt: log.maxCurrencyDebt,
        bankruptcyCount: log.bankruptcyCount,
      }
    }
  }, { type: 'message' });
};
