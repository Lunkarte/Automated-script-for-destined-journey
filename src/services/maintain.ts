/**
 * 数据维护服务
 * 负责维护角色数据的完整性和一致性
 */

import { GameConfig, getRequiredXpForLevel, getTierForLevel } from '../config';
import type { MessageVariables } from '../types';

/**
 * 维护角色数据的完整性
 *
 * @param new_variables - 更新后的变量数据
 * @param old_variables - 更新前的变量数据（由 MVU 事件提供）
 */
export const maintainCharacterData = (new_variables: MessageVariables, old_variables: MessageVariables): void => {
  const character = new_variables.stat_data.角色;
  const oldLevel = old_variables?.stat_data?.角色?.等级 ?? 1;

  // 登神长阶开启条件
  new_variables.stat_data.登神长阶.是否开启 = character.等级 >= GameConfig.AscensionUnlockLevel;

  // 防止等级被非法提升
  if (oldLevel < character.等级 && oldLevel !== 1) {
    character.等级 = oldLevel;
  }

  // 更新升级所需经验
  character.升级所需经验 = getRequiredXpForLevel(character.等级);

  // 确保累计经验值不低于当前等级的最低要求
  if (character.等级 > 0) {
    const minExp = getRequiredXpForLevel(character.等级 - 1);
    if (character.累计经验值 < minExp) {
      character.累计经验值 = minExp;
    }
  }

  // 更新生命层级
  character.生命层级 = getTierForLevel(character.等级);
};