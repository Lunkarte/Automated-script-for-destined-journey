import { CurrencySystem } from './currency-system';
import { event_chain } from './event-chain-system-current';
import { event_chain_inject } from './event-chain-system-inject';
import { experiencegrowth } from './experience-level';
import { inforead } from './info-injection';
import { maintain } from './maintain';
import { Variables } from './types';
import { uninject } from './utils';
declare function eventOn(event: string, callback: (variables: Variables) => void): void;
declare function eventOnButton(button: string, callback: (variables: Variables) => void): void;
declare const tavern_events: {
  GENERATION_AFTER_COMMANDS: 'GENERATION_AFTER_COMMANDS';
  MESSAGE_SENT: 'message_sent';
  MESSAGE_UPDATED: 'message_updated';
};
function Main_processes(variables: Variables) {
  const user = variables.stat_data.角色;
  const currency = variables.stat_data.货币;
  const world = variables.stat_data.世界;
  const eventchain = variables.stat_data.事件链;
  const fatesystem = variables.stat_data.命定系统;

  if (!user || !currency || !world || !eventchain || !fatesystem) {
    console.error('核心数据缺失，脚本终止。缺失项:', {
      用户数据: !!user,
      货币系统: !!currency,
      世界数据: !!world,
      事件链: !!eventchain,
      命定系统: !!fatesystem
    });
    return;
  }
  // 按照顺序执行模块
  try {
    maintain(user, fatesystem);
  } catch (error) {
    console.error('执行 maintain 模块时出错', error);
  }
  try {
    uninject();
  } catch (error) {
    console.error('执行 uninject 模块时出错', error);
  }
  try {
    experiencegrowth(user);
  } catch (error) {
    console.error('执行 experiencegrowth 模块时出错', error);
  }
  try {
    CurrencySystem(currency);
  } catch (error) {
    console.error('执行 CurrencySystem 模块时出错', error);
  }
  try {
    inforead(world, fatesystem, user);
  } catch (error) {
    console.error('执行 inforead 模块时出错', error);
  }
  try {
    event_chain(eventchain, world);
  } catch (error) {
    console.error('执行 event_chain 模块时出错', error);
  }
  try {
    event_chain_inject();
  } catch (error) {
    console.error('执行 event_chain_inject 模块时出错', error);
  }
}

// ============================ [事件监听] ============================
eventOn('mag_variable_update_ended', Main_processes);
eventOn(tavern_events.GENERATION_AFTER_COMMANDS, event_chain_inject);
eventOn(tavern_events.MESSAGE_SENT, event_chain_inject);
eventOn(tavern_events.MESSAGE_UPDATED, event_chain_inject);
eventOnButton('重新处理变量', Main_processes);
