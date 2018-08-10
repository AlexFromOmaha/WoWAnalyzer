import React from 'react';

import ITEMS from 'common/ITEMS';
import SPELLS from '../../SPELLS';
import SpellLink from 'common/SpellLink';
import ItemLink from 'common/ItemLink';
import { formatPercentage } from 'common/format';
import Analyzer from 'Parser/Core/Analyzer';
import calculateEffectiveHealing from 'Parser/Core/calculateEffectiveHealing';
import ItemHealingDone from 'Interface/Others/ItemHealingDone';

import { ABILITIES_AFFECTED_BY_HEALING_INCREASES } from '../../Constants';

const LEGENDARY_ILTERENDI_HEALING_INCREASE = 0.15;

class Ilterendi extends Analyzer {
  healing = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasFinger(ITEMS.ILTERENDI_CROWN_JEWEL_OF_SILVERMOON.id);
  }

  on_byPlayer_heal(event) {
    const spellId = event.ability.guid;
    if (!ABILITIES_AFFECTED_BY_HEALING_INCREASES.includes(spellId)) {
      return;
    }
    if (!this.selectedCombatant.hasBuff(SPELLS.ILTERENDI_BUFF, event.timestamp)) {
      return;
    }

    this.healing += calculateEffectiveHealing(event, LEGENDARY_ILTERENDI_HEALING_INCREASE);
  }

  // Beacon transfer is included in `ABILITIES_AFFECTED_BY_HEALING_INCREASES`

  item() {
    return {
      item: ITEMS.ILTERENDI_CROWN_JEWEL_OF_SILVERMOON,
      result: <ItemHealingDone amount={this.healing} />,
    };
  }

  get suggestionThresholds() {
    return {
      actual: this.owner.getPercentageOfTotalHealingDone(this.healing),
      isLessThan: {
        minor: 0.04,
        average: 0.035,
        major: 0.025,
      },
      style: 'percentage',
    };
  }
  suggestions(when) {
    when(this.suggestionThresholds).addSuggestion((suggest, actual, recommended) => {
      return suggest(<React.Fragment>Your usage of <ItemLink id={ITEMS.ILTERENDI_CROWN_JEWEL_OF_SILVERMOON.id} /> can be improved. Try to line up <SpellLink id={SPELLS.LIGHT_OF_DAWN_CAST} /> and <SpellLink id={SPELLS.HOLY_SHOCK_CAST} /> with the buff or consider using an easier legendary.</React.Fragment>)
        .icon(ITEMS.ILTERENDI_CROWN_JEWEL_OF_SILVERMOON.icon)
        .actual(`${formatPercentage(actual)}% healing contributed`)
        .recommended(`>${formatPercentage(recommended)}% is recommended`);
    });
  }
}

export default Ilterendi;
