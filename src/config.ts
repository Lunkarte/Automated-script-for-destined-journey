// 里程碑等级配置
export const MILESTONE_LEVELS: { [key: number]: { strength: number; agility: number; constitution: number; intelligence: number; spirit: number; tier: string; } } = {
    5: { strength: 1, agility: 1, constitution: 1, intelligence: 1, spirit: 1, tier: '第二层级/中坚' },
    9: { strength: 1, agility: 1, constitution: 1, intelligence: 1, spirit: 1, tier: '第三层级/精英' },
    13: { strength: 1, agility: 1, constitution: 1, intelligence: 1, spirit: 1, tier: '第四层级/史诗' },
    17: { strength: 1, agility: 1, constitution: 1, intelligence: 1, spirit: 1, tier: '第五层级/传说' },
    21: { strength: 1, agility: 1, constitution: 1, intelligence: 1, spirit: 1, tier: '第六层级/神话' },
    25: { strength: 1, agility: 1, constitution: 1, intelligence: 1, spirit: 1, tier: '第七层级/登神' }
};
// 职业等级经验表
export const JOB_LEVEL_XP_TABLE: { [key: number]: number } = {
    0: 0, 1: 15, 2: 55, 3: 130, 4: 290, 5: 640, 6: 1120, 7: 1750, 8: 2710, 9: 3385,
    10: 4225, 11: 5215, 12: 6475, 13: 7515, 14: 8747, 15: 10187, 16: 11979, 17: 12574, 18: 13294, 19: 14149,
    20: 15349, 21: 15601, 22: 15865, 23: 16279, 24: 17500, 25: 1145141919810
};
// 核心游戏配置
export const GAME_CONFIG = {
    GP_TO_SP: 100,
    SP_TO_CP: 100,
    AP_Acquisition_Level: 1,
};
