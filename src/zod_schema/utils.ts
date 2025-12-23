/**
 * 布尔值转换
 */
export const coercedBoolean = (defaultVal: boolean = false) =>
  z
    .preprocess(val => (typeof val === 'string' ? val === '是' : val), z.boolean())
    .prefault(defaultVal);

/**
 * 范围限制数值 schema
 */
export const clampedNum = (defaultVal: number, min: number, max: number) =>
  z.coerce
    .number()
    .prefault(defaultVal)
    .transform(val => _.clamp(val, min, max));

// 基础物品描述 schema
export const BaseItemSchema = z.object({
  品质: z.string().prefault(''),
  标签: z.string().optional(),
  效果: z.string().prefault(''),
  描述: z.string().prefault(''),
});

// 技能 schema (扩展基础物品 + 类型/消耗)
export const SkillSchema = BaseItemSchema.extend({
  类型: z.string().prefault(''),
  消耗: z.string().prefault(''),
}).transform(data => _.pick(data, ['品质', '类型', '消耗', '标签', '效果', '描述']));

// 装备 schema (扩展基础物品 + 位置)
export const EquipmentSchema = BaseItemSchema.extend({
  位置: z.string().prefault(''),
});

// 命定之人装备 schema (扩展基础物品 + 类型)
export const DestinedEquipmentSchema = BaseItemSchema.extend({
  类型: z.string().prefault(''),
}).transform(data => _.pick(data, ['品质', '类型', '标签', '效果', '描述']));

// 背包物品 schema (扩展命定装备 + 数量)
export const InventoryItemSchema = BaseItemSchema.extend({
  数量: z.coerce.number().prefault(1),
  类型: z.string().prefault(''),
}).transform(data => _.pick(data, ['品质', '数量', '类型', '标签', '效果', '描述']));

// 基础属性默认值
const DefaultBaseAttributes = {
  力量: 0,
  敏捷: 0,
  体质: 0,
  智力: 0,
  精神: 0,
} as const;

// 基础属性 schema
export const BaseAttributeSchema = z
  .object(_.mapValues(DefaultBaseAttributes, () => z.coerce.number().prefault(0)))
  .prefault({});

// 角色属性 schema (扩展基础属性 + 属性点)
export const CharacterAttributeSchema = z
  .object({
    ..._.mapValues(DefaultBaseAttributes, () => z.coerce.number().prefault(0)),
    属性点: z.coerce.number().prefault(0),
  })
  .prefault({});

// 神国 schema
export const DivineRealmSchema = z
  .object({
    名称: z.string().prefault(''),
    描述: z.string().prefault(''),
  })
  .prefault({});

/** 截取 record 的前 n 个条目 */
const sliceRecord = <T>(record: Record<string, T>, limit: number): Record<string, T> =>
  _.fromPairs(_.take(_.toPairs(record), limit));

// 登神长阶 schema
// 要素限3个，权能限1个，法则限1个，神位不为空时，法则无上限
export const AscensionSchema = z
  .object({
    是否开启: coercedBoolean(false),
    要素: z.record(z.string(), z.string()).prefault({}),
    权能: z.record(z.string(), z.string()).prefault({}),
    法则: z.record(z.string(), z.string()).prefault({}),
    神位: z.string().prefault(''),
    神国: DivineRealmSchema,
  })
  .prefault({})
  .transform(data => ({
    ...data,
    要素: sliceRecord(data.要素, 3),
    权能: sliceRecord(data.权能, 1),
    法则: data.神位 ? data.法则 : sliceRecord(data.法则, 1),
  }));

// 任务 schema
export const QuestSchema = z.object({
  简介: z.string().prefault(''),
  目标: z.string().prefault(''),
  奖励: z.string().prefault(''),
});
