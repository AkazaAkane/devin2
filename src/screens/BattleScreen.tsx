import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  Card, 
  Title, 
  Text, 
  Button, 
  SegmentedButtons, 
  TextInput,
  Menu
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
// 你可以使用 react-native-collapsible 或者直接用一个布尔 state + 条件渲染来折叠/展开
import Collapsible from 'react-native-collapsible';
import PokemonSelector, { Pokemon, DEFAULT_POKEMON } from '../components/PokemonSelector';
import { typeChart, calculateTypeAdvantage } from '../data/typeChart';

// 示例自定义组件，示意属性选择（火、水、草等）
function TypeSelector({
  label,
  selectedTypes,
  onTypeSelect,
}: {
  label: string;
  selectedTypes: string[];
  onTypeSelect: (types: string[]) => void;
}) {
  const [visible, setVisible] = React.useState(false);
  const allTypes = Object.keys(typeChart);

  return (
    <View style={{ marginVertical: 8 }}>
      <Text style={{ marginBottom: 4 }}>{label}</Text>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <Button 
            mode="outlined" 
            onPress={() => setVisible(true)}
            style={{ justifyContent: 'flex-start' }}
          >
            {selectedTypes.length > 0 ? selectedTypes.join('/') : '选择属性'}
          </Button>
        }
      >
        {allTypes.map((type) => (
          <Menu.Item
            key={type}
            title={type}
            onPress={() => {
              onTypeSelect([type]);
              setVisible(false);
            }}
          />
        ))}
      </Menu>
    </View>
  );
}

// 示例头部组件
function ScreenHeader({ title }: { title: string }) {
  return (
    <View style={{ marginVertical: 8 }}>
      <Title>{title}</Title>
    </View>
  );
}

interface PokemonInfo {
  name?: string;
  baseStat: number;
  diceRoll: number;
  types: string[];
  extraBonus: number;
  hp: number;
}

interface BattleState {
  attacker: PokemonInfo;
  defender: PokemonInfo;
  diceMode: 'manual' | 'd6' | 'd4';
  isSpecialAttack: boolean;  // 区分物理/特殊
  // 简化属性克制，只保留最终的加成
  typeBonus: {
    attacker: number;
    defender: number;
  };
  battleLog: string[];
  attackerInputMode: 'saved' | 'manual';
  defenderInputMode: 'saved' | 'manual';
  // 折叠面板的开关
  showAdvancedOptionsAttacker: boolean;
  showAdvancedOptionsDefender: boolean;
}

export default function BattleScreen() {
  const navigation = useNavigation();

  const [battleState, setBattleState] = useState<BattleState>({
    attacker: {
      baseStat: 10,
      diceRoll: 0,
      types: [],
      extraBonus: 0,
      hp: 50,
    },
    defender: {
      baseStat: 10,
      diceRoll: 0,
      types: [],
      extraBonus: 0,
      hp: 50,
    },
    diceMode: 'manual',
    isSpecialAttack: false,
    typeBonus: {
      attacker: 0,
      defender: 0,
    },
    battleLog: [],
    attackerInputMode: 'saved',
    defenderInputMode: 'saved',
    showAdvancedOptionsAttacker: false,
    showAdvancedOptionsDefender: false,
  });

  // 根据 diceMode 随机生成骰点
  const rollDice = (side: 'attacker' | 'defender') => {
    if (battleState.diceMode === 'manual') return;
    const maxValue = battleState.diceMode === 'd6' ? 6 : 4;
    const roll = Math.floor(Math.random() * maxValue) + 1;

    setBattleState((prev) => ({
      ...prev,
      [side]: {
        ...prev[side],
        diceRoll: roll,
      },
      battleLog: [
        `${side === 'attacker' ? '攻击方' : '防守方'} 掷出 ${roll} 点`,
        ...prev.battleLog,
      ],
    }));
  };

  // 简化属性克制计算
  const updateTypeBonus = () => {
    const { attackerBonus, defenderBonus, message } = calculateTypeAdvantage(
      battleState.attacker.types,
      battleState.defender.types
    );

    setBattleState(prev => ({
      ...prev,
      typeBonus: {
        attacker: attackerBonus,
        defender: defenderBonus,
      },
      battleLog: message ? [message, ...prev.battleLog] : prev.battleLog
    }));
  };

  // 计算伤害
  const calculateDamage = () => {
    const { attacker, defender, typeBonus } = battleState;
    const attackerTotal =
      attacker.baseStat + attacker.diceRoll + typeBonus.attacker + attacker.extraBonus;
    const defenderTotal =
      defender.baseStat + defender.diceRoll + typeBonus.defender + defender.extraBonus;

    if (attackerTotal > defenderTotal) {
      const damage = attackerTotal - defenderTotal;
      // 减去防守方 HP
      const newDefHp = Math.max(0, defender.hp - damage);
      setBattleState((prev) => ({
        ...prev,
        defender: {
          ...prev.defender,
          hp: newDefHp,
        },
        battleLog: [`造成 ${damage} 点破防伤害 (防守方剩余 HP: ${newDefHp})`, ...prev.battleLog],
      }));
    } else {
      // 反伤示例：若防守方比进攻方高出 x，则反伤 x-1
      const reflect = Math.max(0, defenderTotal - attackerTotal - 1);
      const newAttHp = Math.max(0, attacker.hp - reflect);
      setBattleState((prev) => ({
        ...prev,
        attacker: {
          ...prev.attacker,
          hp: newAttHp,
        },
        battleLog: [
          reflect > 0
            ? `未破防, 反伤 ${reflect} 点 (进攻方剩余 HP: ${newAttHp})`
            : '未破防, 无反伤',
          ...prev.battleLog,
        ],
      }));
    }
  };

  // 重置当前回合（骰点、加成清空，保留宝可梦数据与 HP）
  const resetRound = () => {
    setBattleState((prev) => ({
      ...prev,
      attacker: {
        ...prev.attacker,
        diceRoll: 0,
        extraBonus: 0,
      },
      defender: {
        ...prev.defender,
        diceRoll: 0,
        extraBonus: 0,
      },
      typeBonus: { attacker: 0, defender: 0 },
      // 这里 battleLog 如果不想清空，可以去掉
      // battleLog: [],
    }));
  };

  const handlePokemonSelect = (side: 'attacker' | 'defender', pokemon: Pokemon) => {
    setBattleState(prev => ({
      ...prev,
      [side]: {
        ...prev[side],
        baseStat: battleState.isSpecialAttack ? pokemon.spAtk : pokemon.attack,
        types: [pokemon.type],
        hp: pokemon.hp,
      }
    }));
  };

  const swapAttackerDefender = () => {
    setBattleState(prev => ({
      ...prev,
      attacker: prev.defender,
      defender: prev.attacker,
      attackerInputMode: prev.defenderInputMode,
      defenderInputMode: prev.attackerInputMode,
      showAdvancedOptionsAttacker: prev.showAdvancedOptionsDefender,
      showAdvancedOptionsDefender: prev.showAdvancedOptionsAttacker,
    }));
  };

  const handleAttackTypeChange = (isSpecial: boolean) => {
    setBattleState(prev => ({
      ...prev,
      isSpecialAttack: isSpecial,
      attacker: {
        ...prev.attacker,
        baseStat: isSpecial ? 
          (DEFAULT_POKEMON.find((p: Pokemon) => p.name === prev.attacker.name)?.spAtk || prev.attacker.baseStat) :
          (DEFAULT_POKEMON.find((p: Pokemon) => p.name === prev.attacker.name)?.attack || prev.attacker.baseStat)
      }
    }));
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="快速战斗计算" />

      <Button
        mode="outlined"
        icon="arrow-left"
        onPress={() => navigation.goBack()}
        style={styles.returnButton}
      >
        返回主页
      </Button>

      <ScrollView style={styles.content}>
        {/* 上方布局 - 进攻方 */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>攻击方</Title>

            {/* 选择"从已保存宝可梦"或"手动输入" */}
            <SegmentedButtons
              value={battleState.attackerInputMode}
              onValueChange={(value) =>
                setBattleState((prev) => ({
                  ...prev,
                  attackerInputMode: value as 'saved' | 'manual',
                }))
              }
              buttons={[
                { value: 'saved', label: '从已保存选择' },
                { value: 'manual', label: '手动输入' },
              ]}
            />

            {/* 根据模式显示不同的输入（这里仅作示例，实际可以使用下拉、搜索框等） */}
            {battleState.attackerInputMode === 'manual' ? (
              <>
                <TextInput
                  label="进攻基础值 (物攻/特攻)"
                  keyboardType="numeric"
                  value={String(battleState.attacker.baseStat)}
                  onChangeText={(text) =>
                    setBattleState((prev) => ({
                      ...prev,
                      attacker: {
                        ...prev.attacker,
                        baseStat: parseInt(text) || 0,
                      },
                    }))
                  }
                  style={{ marginVertical: 8 }}
                />
                <TextInput
                  label="当前HP (可选)"
                  keyboardType="numeric"
                  value={String(battleState.attacker.hp)}
                  onChangeText={(text) =>
                    setBattleState((prev) => ({
                      ...prev,
                      attacker: {
                        ...prev.attacker,
                        hp: parseInt(text) || 0,
                      },
                    }))
                  }
                  style={{ marginVertical: 8 }}
                />
              </>
            ) : (
              <PokemonSelector 
                onSelect={(pokemon) => handlePokemonSelect('attacker', pokemon)} 
              />
            )}

            {/* 物理/特殊 攻击 */}
            <SegmentedButtons
              value={battleState.isSpecialAttack ? 'special' : 'physical'}
              onValueChange={(value) =>
                setBattleState((prev) => ({
                  ...prev,
                  isSpecialAttack: value === 'special',
                }))
              }
              buttons={[
                { value: 'physical', label: '物理攻击' },
                { value: 'special', label: '特殊攻击' },
              ]}
            />

            {/* 属性选择（火、水、草...） */}
            <TypeSelector
              label="属性"
              selectedTypes={battleState.attacker.types}
              onTypeSelect={(types) => {
                setBattleState((prev) => ({
                  ...prev,
                  attacker: { ...prev.attacker, types },
                }));
                updateTypeBonus();
              }}
            />

            {/* 骰子模式切换 */}
            <SegmentedButtons
              value={battleState.diceMode}
              onValueChange={(value: string) =>
                setBattleState((prev) => ({
                  ...prev,
                  diceMode: value as 'manual' | 'd6' | 'd4',
                }))
              }
              buttons={[
                { value: 'manual', label: '手动' },
                { value: 'd6', label: 'D6' },
                { value: 'd4', label: 'D4' },
              ]}
            />

            {/* 骰子部分：若不是手动则显示掷骰按钮 */}
            {battleState.diceMode !== 'manual' && (
              <Button onPress={() => rollDice('attacker')} style={{ marginTop: 8 }}>
                掷骰
              </Button>
            )}

            {/* 无论是否手动，都显示当前点数供查看或输入 */}
            <TextInput
              label="当前骰点"
              keyboardType="numeric"
              value={String(battleState.attacker.diceRoll)}
              onChangeText={(text) =>
                setBattleState((prev) => ({
                  ...prev,
                  attacker: {
                    ...prev.attacker,
                    diceRoll: parseInt(text) || 0,
                  },
                }))
              }
              style={{ marginVertical: 8 }}
            />

            {/* 折叠高级选项：额外特性、道具加成等 */}
            <Button
              mode="outlined"
              onPress={() =>
                setBattleState((prev) => ({
                  ...prev,
                  showAdvancedOptionsAttacker: !prev.showAdvancedOptionsAttacker,
                }))
              }
            >
              {battleState.showAdvancedOptionsAttacker ? '收起' : '更多选项'}
            </Button>
            <Collapsible collapsed={!battleState.showAdvancedOptionsAttacker}>
              <TextInput
                label="额外加成（特性 / 道具等）"
                keyboardType="numeric"
                value={String(battleState.attacker.extraBonus)}
                onChangeText={(text) =>
                  setBattleState((prev) => ({
                    ...prev,
                    attacker: {
                      ...prev.attacker,
                      extraBonus: parseInt(text) || 0,
                    },
                  }))
                }
                style={{ marginVertical: 8 }}
              />
              <Text style={{ color: '#888' }}>这里可以放更多可选的加成或技能效果</Text>
            </Collapsible>
          </Card.Content>
        </Card>

        {/* 添加交换按钮 */}
        <Button 
          mode="contained"
          icon="swap-horizontal"
          onPress={swapAttackerDefender}
          style={styles.swapButton}
        >
          交换攻守
        </Button>

        {/* 中间或右侧布局 - 防守方 */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>防守方</Title>

            <SegmentedButtons
              value={battleState.defenderInputMode}
              onValueChange={(value) =>
                setBattleState((prev) => ({
                  ...prev,
                  defenderInputMode: value as 'saved' | 'manual',
                }))
              }
              buttons={[
                { value: 'saved', label: '从已保存选择' },
                { value: 'manual', label: '手动输入' },
              ]}
            />

            {battleState.defenderInputMode === 'manual' ? (
              <>
                <TextInput
                  label="防御基础值 (物防/特防)"
                  keyboardType="numeric"
                  value={String(battleState.defender.baseStat)}
                  onChangeText={(text) =>
                    setBattleState((prev) => ({
                      ...prev,
                      defender: {
                        ...prev.defender,
                        baseStat: parseInt(text) || 0,
                      },
                    }))
                  }
                  style={{ marginVertical: 8 }}
                />
                <TextInput
                  label="当前HP (可选)"
                  keyboardType="numeric"
                  value={String(battleState.defender.hp)}
                  onChangeText={(text) =>
                    setBattleState((prev) => ({
                      ...prev,
                      defender: {
                        ...prev.defender,
                        hp: parseInt(text) || 0,
                      },
                    }))
                  }
                  style={{ marginVertical: 8 }}
                />
              </>
            ) : (
              <PokemonSelector 
                onSelect={(pokemon) => handlePokemonSelect('defender', pokemon)} 
              />
            )}

            <TypeSelector
              label="属性"
              selectedTypes={battleState.defender.types}
              onTypeSelect={(types) => {
                setBattleState((prev) => ({
                  ...prev,
                  defender: { ...prev.defender, types },
                }));
                updateTypeBonus();
              }}
            />

            {/* 同样的骰子模式与掷骰逻辑，共用 battleState.diceMode */}
            {battleState.diceMode !== 'manual' && (
              <Button onPress={() => rollDice('defender')} style={{ marginTop: 8 }}>
                掷骰
              </Button>
            )}
            <TextInput
              label="当前骰点"
              keyboardType="numeric"
              value={String(battleState.defender.diceRoll)}
              onChangeText={(text) =>
                setBattleState((prev) => ({
                  ...prev,
                  defender: {
                    ...prev.defender,
                    diceRoll: parseInt(text) || 0,
                  },
                }))
              }
              style={{ marginVertical: 8 }}
            />

            {/* 防守方同样的高级选项 */}
            <Button
              mode="outlined"
              onPress={() =>
                setBattleState((prev) => ({
                  ...prev,
                  showAdvancedOptionsDefender: !prev.showAdvancedOptionsDefender,
                }))
              }
            >
              {battleState.showAdvancedOptionsDefender ? '收起' : '更多选项'}
            </Button>
            <Collapsible collapsed={!battleState.showAdvancedOptionsDefender}>
              <TextInput
                label="额外加成（特性 / 道具等）"
                keyboardType="numeric"
                value={String(battleState.defender.extraBonus)}
                onChangeText={(text) =>
                  setBattleState((prev) => ({
                    ...prev,
                    defender: {
                      ...prev.defender,
                      extraBonus: parseInt(text) || 0,
                    },
                  }))
                }
                style={{ marginVertical: 8 }}
              />
              <Text style={{ color: '#888' }}>这里可以放更多可选的加成或技能效果</Text>
            </Collapsible>
          </Card.Content>
        </Card>

        {/* 下方 - 伤害计算与战斗日志 */}
        <Button mode="contained" onPress={calculateDamage} style={styles.calculateButton}>
          计算伤害
        </Button>

        <Card style={styles.card}>
          <Card.Content>
            <Title>战斗记录</Title>
            {battleState.battleLog.map((log, index) => (
              <Text key={index}>{log}</Text>
            ))}
          </Card.Content>
        </Card>

        {/* 复位 / 下一回合 按钮 */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <Button mode="outlined" onPress={resetRound}>
            重置本回合
          </Button>
          <Button 
            mode="outlined"
            onPress={() => {
              // 这里可自定义"下一回合"逻辑，与重置类似，也可保留或清空 battleLog
              resetRound();
              setBattleState((prev) => ({
                ...prev,
                battleLog: [
                  '--- 下一回合 ---',
                  ...prev.battleLog,
                ],
              }));
            }}
          >
            下一回合
          </Button>
        </View>

      </ScrollView>
    </View>
  );
}

// 样式示例
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  content: {
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
    padding: 8,
  },
  calculateButton: {
    marginVertical: 16,
  },
  returnButton: {
    margin: 16,
  },
  swapButton: {
    marginVertical: 8,
    backgroundColor: '#666',  // 使用不同的颜色区分
  },
});
