import React from 'react';

import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import SpellIcon from 'common/SpellIcon';
import AbilityTracker from 'Parser/Core/Modules/AbilityTracker';
import Analyzer from 'Parser/Core/Analyzer';
import ItemDamageDone from 'Interface/Others/ItemDamageDone';

class T21_2set extends Analyzer {
  static dependencies = {
    abilityTracker: AbilityTracker,
  };

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasBuff(SPELLS.WARRIOR_FURY_T21_2P_BONUS.id);
  }

  item() {
    const slaughter = this.abilityTracker.getAbility(SPELLS.WARRIOR_FURY_T21_2P_BONUS_DEBUFF.id);
    const damage = slaughter.damageEffective;

    return {
      id: `spell-${SPELLS.WARRIOR_FURY_T21_2P_BONUS_DEBUFF.id}`,
      icon: <SpellIcon id={SPELLS.WARRIOR_FURY_T21_2P_BONUS_DEBUFF.id} />,
      title: <SpellLink id={SPELLS.WARRIOR_FURY_T21_2P_BONUS_DEBUFF.id} icon={false} />,
      result: <ItemDamageDone amount={damage} />,
    };
  }
}

export default T21_2set;
