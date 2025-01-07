export const typeChart: {
  [typeName: string]: {
    resist: string[];
    weak: string[];
    immune: string[];
  };
} = {
  '一般': {
    resist: [],
    weak: ['格斗'],
    immune: ['鬼'],
  },
  '虫': {
    resist: ['格斗', '草', '地面'],
    weak: ['火', '飞行', '岩石'],
    immune: [],
  },
  '龙': {
    resist: ['电', '火', '草', '水'],
    weak: ['龙', '冰', '妖精'],
    immune: [],
  },
  '电': {
    resist: ['电', '飞行', '钢'],
    weak: ['地面'],
    immune: [],
  },
  '格斗': {
    resist: ['虫', '岩石', '恶'],
    weak: ['飞行', '超能'],
    immune: ['鬼'],
  },
  '火': {
    resist: ['虫', '钢', '火', '草', '冰'],
    weak: ['地面', '岩石', '水'],
    immune: [],
  },
  '飞行': {
    resist: ['虫', '格斗', '草'],
    weak: ['电', '冰', '岩石'],
    immune: ['地面'],
  },
  '鬼': {
    resist: ['虫', '毒'],
    weak: ['鬼', '恶'],
    immune: ['一般', '格斗'],
  },
  '草': {
    resist: ['水', '草', '电', '地面'],
    weak: ['火', '冰', '毒', '飞行', '虫'],
    immune: [],
  },
  '地面': {
    resist: ['毒', '岩石'],
    weak: ['水', '草', '冰'],
    immune: ['电'],
  },
  '冰': {
    resist: ['冰'],
    weak: ['格斗', '岩石', '钢', '火'],
    immune: [],
  },
  '毒': {
    resist: ['格斗', '毒', '草', '妖精'],
    weak: ['地面', '超能'],
    immune: [],
  },
  '超能': {
    resist: ['格斗', '超能'],
    weak: ['虫', '鬼', '恶'],
    immune: [],
  },
  '岩石': {
    resist: ['一般', '火', '毒', '飞行'],
    weak: ['水', '草', '格斗', '地面', '钢'],
    immune: [],
  },
  '钢': {
    resist: ['一般', '草', '冰', '飞行', '超能', '虫', '岩石', '龙', '钢', '妖精'],
    weak: ['格斗', '地面', '火'],
    immune: ['毒'],
  },
  '水': {
    resist: ['钢', '火', '水', '冰'],
    weak: ['草', '电'],
    immune: [],
  }
};

export function calculateTypeAdvantage(
  attackerTypes: string[],
  defenderTypes: string[]
): {
  attackerBonus: number;
  defenderBonus: number;
  message: string;
} {
  if (!attackerTypes.length || !defenderTypes.length) {
    return { attackerBonus: 0, defenderBonus: 0, message: '' };
  }

  let attackerBonus = 0;
  let defenderBonus = 0;
  let messages: string[] = [];

  attackerTypes.forEach(atkType => {
    defenderTypes.forEach(defType => {
      const chart = typeChart[defType];
      if (!chart) return;

      if (chart.weak.includes(atkType)) {
        attackerBonus += 3;
        messages.push(`${atkType} → ${defType}: 进攻方克制 +3`);
      } else if (chart.resist.includes(atkType)) {
        defenderBonus += 3;
        messages.push(`${atkType} → ${defType}: 防守方抗性 +3`);
      } else if (chart.immune.includes(atkType)) {
        defenderBonus += 5;
        messages.push(`${atkType} → ${defType}: 防守方免疫 +5`);
      }
    });
  });

  return {
    attackerBonus,
    defenderBonus,
    message: messages.join('\n')
  };
} 