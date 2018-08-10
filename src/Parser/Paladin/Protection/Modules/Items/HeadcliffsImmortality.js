import React from 'react';

import ITEMS from 'common/ITEMS';
import SPELLS from '../../SPELLS';
import Analyzer from 'Parser/Core/Analyzer';
import { formatPercentage } from 'common/format';

const DR_IN_CONSEC = 4;

/**
 * Legendary Ring
 * Gain 4% DR while standing in Consecration
*/
class HeadcliffsImmortality extends Analyzer {

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasFinger(ITEMS.HEATHCLIFFS_IMMORTALITY.id);
  }

  get uptime() {
    return this.selectedCombatant.getBuffUptime(SPELLS.IMMORTAL_OBJECT) / this.owner.fightDuration;
  }

  item() {
    return {
      item: ITEMS.HEATHCLIFFS_IMMORTALITY,
      result: (
        <dfn data-tip={`${ formatPercentage(this.uptime)}% uptime`}>
          average { (this.uptime * DR_IN_CONSEC).toFixed(2) }% DR
        </dfn>
      ),
    };
  }
}

export default HeadcliffsImmortality;
