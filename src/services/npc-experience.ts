/**
 * NPC 经验与升级服务
 *
 * NPC（命定之人）的经验系统：
 * - 经验数据存储在 date.npcs 中
 * - 经验增量跟随主角的累计经验值变化
 * - 只有「在场」（如果需要契约则「已缔结契约」）的 NPC 才能获得经验
 */

import { getRequiredXpForLevel, isMaxLevel, LevelXpTable } from '../config';
import type { MessageVariables, NpcExpData } from '../types';
import { injectMultiplePrompts } from '../utils';

/**
 * 处理所有 NPC 的经验与升级
 *
 * @param new_variables - 更新后的变量数据
 * @param old_variables - 更新前的变量数据（由 MVU 事件提供）
 */
export const processNPCExperienceAndLevel = (new_variables: MessageVariables, old_variables: MessageVariables): void => {
  const destined = new_variables.stat_data.命定系统.命定之人;
  const dateNpcs = new_variables.date.npcs;
  const requiresContract = new_variables.date.requiresContractForExp ?? true;

  // 计算主角经验增量
  const oldExp = old_variables?.stat_data?.角色?.累计经验值 ?? new_variables.stat_data.角色.累计经验值;
  const deltaExp = new_variables.stat_data.角色.累计经验值 - oldExp;

  // 同步：添加命定之人中存在但 date.npcs 中不存在的对象
  _.forEach(destined, (npc, name) => {
    if (!dateNpcs[name]) {
      dateNpcs[name] = {
        level: npc.等级,
        exp: 0,
        required_exp: getRequiredXpForLevel(npc.等级),
      };
    }
  });

  // 同步：删除 date.npcs 中存在但命定之人中不存在的对象
  _.forEach(_.keys(dateNpcs), (name) => {
    if (!destined[name]) {
      delete dateNpcs[name];
    }
  });

  // 升级提示收集
  const levelUpPrompts: string[] = [];

  // 处理每个 NPC
  _.forEach(dateNpcs, (npcData: NpcExpData, name: string) => {
    const npc = destined[name];
    if (!npc) return;

    // 同步等级
    npcData.level = npc.等级;
    npcData.required_exp = getRequiredXpForLevel(npcData.level);

    // 确保经验不低于前一级所需
    if (npcData.level > 1) {
      const prevRequired = LevelXpTable[npcData.level - 1] ?? 0;
      if (npcData.exp < prevRequired) {
        npcData.exp = prevRequired;
      }
    }

    // 经验增加：在场 + 经验增量 > 0 + （需要契约时要已缔结）
    const canGainExp = npc.是否在场 && deltaExp > 0 && (!requiresContract || npc.是否缔结契约);
    if (canGainExp) {
      npcData.exp += deltaExp;
    }

    // 升级检查
    const initialLevel = npc.等级;
    while (npcData.exp >= npcData.required_exp && !isMaxLevel(npcData.level)) {
      npcData.level += 1;
      npcData.required_exp = getRequiredXpForLevel(npcData.level);
    }

    // 同步升级后的等级回命定之人
    if (npc.等级 < npcData.level) {
      levelUpPrompts.push(`${name}从LV${initialLevel}提升到LV${npcData.level}`);
      npc.等级 = npcData.level;
    }
  });

  // 注入升级提示
  if (levelUpPrompts.length > 0) {
    injectMultiplePrompts([
      {
        id: 'NPC Level Up',
        content: `core_system: ${levelUpPrompts.join('; ')}`,
        position: 'none',
        role: 'system',
      },
    ]);
  }
};