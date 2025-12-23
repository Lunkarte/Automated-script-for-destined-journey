/**
 * 游戏信息注入模块
 * 向上下文注入当前游戏状态信息
 */

import type { MessageVariables } from '../types';
import { injectMultiplePrompts } from '../utils';

/**
 * 收集在场命定之人的种族列表
 */
const collectPresentDestinedOnesSpecies = (destined_ones: MessageVariables['stat_data']['命定系统']['命定之人']): string[] => {
  return _.chain(destined_ones)
    .pickBy(npc => npc.是否在场)
    .map(npc => npc.种族)
    .filter(species => !_.isEmpty(species))
    .value();
};

/**
 * 注入游戏信息
 * - 在场命定之人的种族列表
 * - 用户角色种族
 * - 当前地点
 * - 当前时间
 *
 * @param current_variables - 当前的变量数据
 */
export const injectGameInfo = (current_variables: MessageVariables): void => {
  const world = current_variables.stat_data.世界;
  const character = current_variables.stat_data.角色;
  const destinySystem = current_variables.stat_data.命定系统;

  // 收集在场命定之人的种族
  const presentSpecies = collectPresentDestinedOnesSpecies(destinySystem.命定之人);

  // 批量注入游戏信息
  injectMultiplePrompts([
    {
      id: '同伴种族',
      content: presentSpecies.join(', '),
      position: 'none',
      depth: 0,
      role: 'system',
    },
    {
      id: '主角种族',
      content: character.种族,
      position: 'none',
      depth: 0,
      role: 'system',
    },
    {
      id: '当前所在地点',
      content: world.地点,
      position: 'none',
      depth: 0,
      role: 'system',
    },
    {
      id: '当前时间',
      content: world.时间,
      position: 'none',
      depth: 0,
      role: 'system',
    },
  ]);
};