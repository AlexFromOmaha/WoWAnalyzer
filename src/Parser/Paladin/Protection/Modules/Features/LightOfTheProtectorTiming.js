import React from 'react';

import SelfHealTimingGraph from 'Parser/Core/Modules/Features/SelfHealTimingGraph';
import SPELLS from '../../SPELLS';

class LightOfTheProtectorTiming extends SelfHealTimingGraph {

  constructor(...args) {
    super(...args);
    this.selfHealSpell = this.selectedCombatant.hasTalent(SPELLS.HAND_OF_THE_PROTECTOR_TALENT) ?
      SPELLS.HAND_OF_THE_PROTECTOR_TALENT:
      SPELLS.LIGHT_OF_THE_PROTECTOR;
    this.tabTitle = "Selfheal Timing";
    this.tabURL = "selfheal-timings";
  }

  render() {
    return (
      <SelfHealTimingGraph />
    );
  }
}

export default LightOfTheProtectorTiming;
