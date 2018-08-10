import React from 'react';

import SPELLS from '../../SPELLS';
import SpellIcon from 'common/SpellIcon';
import SpellLink from 'common/SpellLink';
import { formatNumber } from 'common/format';

import Analyzer from 'Parser/Core/Analyzer';

class Tier21_4set extends Analyzer {
  holyPowerGained = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasBuff(SPELLS.RET_PALADIN_T21_4SET_BONUS);
  }

  on_byPlayer_removebuff(event) {
    const spellId = event.ability.guid;
    if (spellId !== SPELLS.RET_PALADIN_T21_4SET_BONUS_BUFF) {
      return;
    }
    this.holyPowerGained += 1;
  }

  item() {
    return {
      id: `spell-${SPELLS.RET_PALADIN_T21_4SET_BONUS}`,
      icon: <SpellIcon id={SPELLS.RET_PALADIN_T21_4SET_BONUS} />,
      title: <SpellLink id={SPELLS.RET_PALADIN_T21_4SET_BONUS} icon={false} />,
      result: (
        <dfn data-tip={`Total Holy Power Gained: ${formatNumber(this.holyPowerGained)}`}>
          {formatNumber(this.holyPowerGained / this.owner.fightDuration * 60000)} Holy Power gained per minute.
        </dfn>
      ),
    };
  }
}

export default Tier21_4set;
