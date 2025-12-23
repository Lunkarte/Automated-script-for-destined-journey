/**
 * 事件提示注入模块
 * 向上下文注入事件相关的提示信息
 */

import type { MessageVariables } from '../types';
import { createPromptInjection, safeGet } from '../utils';

/**
 * 注入事件提示
 * - 已完成事件列表
 * - 当前事件缓存信息
 * - 事件链激活提示
 *
 * @param _new_variables - 更新后的变量数据（未使用）
 * @param old_variables - 更新前的变量数据（由 MVU 事件提供）
 */
export const injectEventPrompts = (_new_variables: MessageVariables, old_variables: MessageVariables): void => {
  // 获取已完成事件列表
  const completedEvents: string[] = safeGet(old_variables, 'date.event.completed_events', []);

  // 注入已完成事件
  if (completedEvents.length > 0) {
    const prompt = createPromptInjection('已完成事件', completedEvents.join('; '), {
      position: 'none',
      depth: 0,
      role: 'system',
    });
    injectPrompts([prompt]);
  }

  // 获取事件缓存信息
  const eventCache: string | null = safeGet(old_variables, 'date.event.cache', null);

  // 如果有活跃事件，注入事件信息和提示
  if (!_.isNil(eventCache) && !_.isEmpty(eventCache)) {
    // 注入事件缓存
    const eventPrompt = createPromptInjection('事件', eventCache, {
      position: 'none',
      depth: 0,
      role: 'system',
    });
    injectPrompts([eventPrompt]);

    // 注入事件链激活提示
    const tipsPrompt = createPromptInjection(
      '事件提示',
      '（IMPORTANT: 当前剧情事件进行中，你必须按照<event>中内容发展剧情，不得太过偏离剧情事件）',
      {
        position: 'in_chat',
        depth: 0,
        role: 'system',
      },
    );
    injectPrompts([tipsPrompt]);
  }
};