import React from 'react';

import SPELLS from '../../SPELLS';
import ITEMS from 'common/ITEMS';
import SpellLink from 'common/SpellLink';
import ItemLink from 'common/ItemLink';
import getSpellIcon from 'common/getSpellIcon';
import Analyzer from 'Parser/Core/Analyzer';
import SpellUsable from 'Parser/Core/Modules/SpellUsable';

import AbilityTracker from './PaladinAbilityTracker';
import MaraadsDyingBreath from '../Items/MaraadsDyingBreath';

/** @type {number} (ms) When Holy Shock has less than this as cooldown remaining you should wait and still not cast that filler FoL. */
const HOLY_SHOCK_COOLDOWN_WAIT_TIME = 200;

class FillerLightOfTheMartyrs extends Analyzer {
  static dependencies = {
    abilityTracker: AbilityTracker,
    maraadsDyingBreath: MaraadsDyingBreath,
    spellUsable: SpellUsable,
  };

  casts = 0;
  inefficientCasts = [];
  on_byPlayer_cast(event) {
    const spellId = event.ability.guid;
    if (spellId !== SPELLS.LIGHT_OF_THE_MARTYR) {
      return;
    }
    if (this.selectedCombatant.hasBuff(SPELLS.MARAADS_DYING_BREATH_BUFF, event.timestamp)) {
      // Not a filler
      return;
    }

    this.casts += 1;

    const hasHolyShockAvailable = this.spellUsable.isAvailable(SPELLS.HOLY_SHOCK_CAST);
    if (!hasHolyShockAvailable) {
      // We can't cast it, but check how long until it comes off cooldown. We should wait instead of casting a filler if it becomes available really soon.
      const cooldownRemaining = this.spellUsable.cooldownRemaining(SPELLS.HOLY_SHOCK_CAST);
      if (cooldownRemaining > HOLY_SHOCK_COOLDOWN_WAIT_TIME) {
        return;
      }
    }
    this.inefficientCasts.push(event);
  }

  get cpm() {
    return this.casts / (this.owner.fightDuration / 1000) * 60;
  }
  get inefficientCpm() {
    return this.inefficientCasts.length / (this.owner.fightDuration / 1000) * 60;
  }

  get cpmSuggestionThresholds() {
    return {
      actual: this.cpm,
      isGreaterThan: {
        minor: 1.5,
        average: 2,
        major: 3,
      },
      style: 'number',
    };
  }
  get inefficientCpmSuggestionThresholds() {
    return {
      actual: this.inefficientCpm,
      isGreaterThan: {
        minor: 0,
        average: 0.25,
        major: 0.5,
      },
      style: 'number',
    };
  }

  suggestions(when) {
    when(this.cpmSuggestionThresholds).addSuggestion((suggest, actual, recommended) => {
      let suggestionText;
      let actualText;
      if (this.maraadsDyingBreath.active) {
        suggestionText = (
          <React.Fragment>
            With <ItemLink id={ITEMS.MARAADS_DYING_BREATH.id} /> you should only cast <b>one</b> <SpellLink id={SPELLS.LIGHT_OF_THE_MARTYR} /> per <SpellLink id={SPELLS.LIGHT_OF_DAWN_CAST} />. Without the buff <SpellLink id={SPELLS.LIGHT_OF_THE_MARTYR} /> is a very inefficient spell to cast. Try to only cast Light of the Martyr when it will save someone's life or when moving and all other instant cast spells are on cooldown.
          </React.Fragment>
        );
        actualText = `${this.cpm.toFixed(2)} Casts Per Minute - ${this.casts} casts total (unbuffed only)`;
      } else {
        suggestionText = (
          <React.Fragment>
            You cast many <SpellLink id={SPELLS.LIGHT_OF_THE_MARTYR} />s. Light of the Martyr is an inefficient spell to cast, try to only cast Light of the Martyr when it will save someone's life or when moving and all other instant cast spells are on cooldown.
          </React.Fragment>
        );
        actualText = `${this.cpm.toFixed(2)} Casts Per Minute - ${this.casts} casts total`;
      }
      return suggest(suggestionText)
        .icon(getSpellIcon(SPELLS.LIGHT_OF_THE_MARTYR))
        .actual(actualText)
        .recommended(`<${recommended} Casts Per Minute is recommended`);
    });

    when(this.inefficientCpmSuggestionThresholds).addSuggestion((suggest, actual) => {
      return suggest(
        <React.Fragment>
          You cast {this.inefficientCasts.length} <SpellLink id={SPELLS.LIGHT_OF_THE_MARTYR} />s while <SpellLink id={SPELLS.HOLY_SHOCK_CAST} /> was <dfn data-tip={`It was either already available or going to be available within ${HOLY_SHOCK_COOLDOWN_WAIT_TIME}ms.`}>available</dfn> (at {this.inefficientCasts.map(event => this.owner.formatTimestamp(event.timestamp)).join(', ')}). Try to <b>never</b> cast <SpellLink id={SPELLS.LIGHT_OF_THE_MARTYR} /> when something else is available<dfn data-tip="There are very rare exceptions to this. For example it may be worth saving Holy Shock when you know you're going to be moving soon and you may have to heal yourself.">*</dfn>.
        </React.Fragment>
      )
        .icon(getSpellIcon(SPELLS.LIGHT_OF_THE_MARTYR))
        .actual(`${this.inefficientCasts.length} casts while Holy Shock was available`)
        .recommended(`No inefficient casts is recommended`);
    });
  }
}

export default FillerLightOfTheMartyrs;
