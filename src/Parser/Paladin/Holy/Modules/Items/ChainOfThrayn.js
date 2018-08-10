import React from 'react';

import SPELLS from '../../SPELLS';
import ITEMS from 'common/ITEMS';
import Analyzer from 'Parser/Core/Analyzer';
import ItemHealingDone from 'Interface/Others/ItemHealingDone';

import { ABILITIES_AFFECTED_BY_HEALING_INCREASES, AVENGING_WRATH_HEALING_INCREASE } from '../../Constants';

const CHAIN_OF_THRAYN_HEALING_INCREASE = 0.25;

class ChainOfThrayn extends Analyzer {
  healing = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasWaist(ITEMS.CHAIN_OF_THRAYN.id);
  }

  on_heal(event) {
    if (this.owner.byPlayer(event)) {
      this.processHeal(event);
    }
  }
  processHeal(event) {
    const spellId = event.ability.guid;
    if (!ABILITIES_AFFECTED_BY_HEALING_INCREASES.includes(spellId)) {
      return;
    }

    if (!this.selectedCombatant.hasBuff(SPELLS.AVENGING_WRATH, event.timestamp)) {
      return;
    }

    const amount = event.amount;
    const absorbed = event.absorbed || 0;
    const overheal = event.overheal || 0;
    const raw = amount + absorbed + overheal;
    const totalHealingIncreaseFactor = 1 + AVENGING_WRATH_HEALING_INCREASE + CHAIN_OF_THRAYN_HEALING_INCREASE;
    const totalHealingBeforeIncreases = raw / totalHealingIncreaseFactor;
    const regularAvengingWrathHealingIncreaseFactor = 1 + AVENGING_WRATH_HEALING_INCREASE;
    const totalHealingBeforeChainBonus = totalHealingBeforeIncreases * regularAvengingWrathHealingIncreaseFactor;
    const healingIncrease = raw - totalHealingBeforeChainBonus;

    const effectiveHealing = Math.max(0, healingIncrease - overheal);

    this.healing += effectiveHealing;
  }

  // Beacon transfer is included in `ABILITIES_AFFECTED_BY_HEALING_INCREASES`

  item() {
    return {
      item: ITEMS.CHAIN_OF_THRAYN,
      result: <ItemHealingDone amount={this.healing} />,
    };
  }
}

export default ChainOfThrayn;
