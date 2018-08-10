import React from 'react';

import SPELLS from '../../SPELLS';
import ITEMS from 'common/ITEMS';
import Analyzer from 'Parser/Core/Analyzer';
import calculateEffectiveDamage from 'Parser/Core/calculateEffectiveDamage';
import calculateEffectiveHealing from 'Parser/Core/calculateEffectiveHealing';
import ItemDamageDone from 'Interface/Others/ItemDamageDone';
import ItemHealingDone from 'Interface/Others/ItemHealingDone';

/*
* Equip: Avenger's Shield deals 20% increased damage and jumps to 2 additional targets.
*/

const debug = false;

const TYELCA_MODIFIER = 0.2;
const TYELCA_EXTRA_JUMPS = 2;
const AVENGERS_SHIELD_JUMPS = 3;

class TyelcaFerrenMarcussStature extends Analyzer {
	damageDone = 0;
	healingDone = 0;

	constructor(...args) {
    super(...args);
		this.active = this.selectedCombatant.hasLegs(ITEMS.TYELCA_FERREN_MARCUSS_STATURE.id);
	}

	on_byPlayer_cast(event) {
		const spellId = event.ability.guid;
		if (spellId !== SPELLS.AVENGERS_SHIELD) {
			return;
		}
		this.targetsHit = 0;
	}

	on_byPlayer_damage(event) {
		const spellId = event.ability.guid;
		if (spellId !== SPELLS.AVENGERS_SHIELD) {
			return;
		}
		if(this.targetsHit > AVENGERS_SHIELD_JUMPS + TYELCA_EXTRA_JUMPS) {
			debug && console.log('this is a bug');
		}
		//If you hit a 4th or 5th target because of the pants all that damage should be attributed to them
		if(this.targetsHit > AVENGERS_SHIELD_JUMPS) {
			this.damageDone += (event.amount || 0) + (event.absorbed || 0);
			this.targetsHit += 1;
			this.extraJumps = true;
		}
		else {
			this.damageDone += calculateEffectiveDamage(event, TYELCA_MODIFIER);
			this.targetsHit += 1;
		}
	}

	on_byPlayer_absorbed(event) {
    const spellId = event.ability.guid;
    if (spellId !== SPELLS.BULWARK_OF_ORDER_SHIELD) {
      return;
    }
    this.healingDone += calculateEffectiveHealing(event, TYELCA_MODIFIER);
  }

	item() {
		const tyelcaHealing = this.extraJumps ? <ItemHealingDone amount={this.healingDone} greaterThan /> : <ItemHealingDone amount={this.healingDone} />;
		const healingText = this.extraJumps ? 'The full bonus sheild from hitting 3+ targets is not taken into account' : '';
		return {
			item: ITEMS.TYELCA_FERREN_MARCUSS_STATURE,
			result: (
				<React.Fragment>
					<ItemDamageDone amount={this.damageDone} />
					<br />
					<dfn data-tip={`The healing is attributed from the extra sheild from the Bulwark of Order trait <br/> ${healingText}`}>
						{tyelcaHealing}
					</dfn>
				</React.Fragment>
			),
		};
	}
}

export default TyelcaFerrenMarcussStature;
