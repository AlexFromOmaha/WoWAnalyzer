//import React from 'react';

import ITEMS from 'common/ITEMS';
import ISSUE_IMPORTANCE from 'Parser/Core/ISSUE_IMPORTANCE';
import CoreAbilities from 'Parser/Core/Modules/Abilities';

import SPELLS from '../SPELLS';

class Abilities extends CoreAbilities {
  spellbook() {
    const combatant = this.selectedCombatant;
    return [
      {
        spell: SPELLS.CONSECRATION_CAST,
        buffSpellId: SPELLS.CONSECRATION_BUFF,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: haste => 4.5 / (1 + haste),
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.BLESSED_HAMMER_TALENT,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: haste => 4.5 / (1 + haste),
        gcd: {
          base: 1500,
        },
        charges: 3,
        enabled: combatant.hasTalent(SPELLS.BLESSED_HAMMER_TALENT),
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.9,
        },
      },
      {
        spell: SPELLS.AVENGERS_SHIELD,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: haste => 15 / (1 + haste),
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.9,
        },
      },
      // Probably useless to try to count the number of casts
      //Note by yajinni: Since this is thier main source of damage mitigation, without it they get hit like by a truck.
      //And a main source of damage, it should be tracked somewhat. Keeping it at 80% for now.
      {
        spell: SPELLS.SHIELD_OF_THE_RIGHTEOUS,
        buffSpellId: SPELLS.SHIELD_OF_THE_RIGHTEOUS_BUFF,
        isDefensive: true,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: haste => 20 / (1 + haste),
        charges: 3,
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.8,
        },
      },
      { // T15: Holy Shield
        spell: SPELLS.HAMMER_OF_THE_RIGHTEOUS,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: haste => 4.5 / (1 + haste),
        charges: 2,
        gcd: {
          base: 1500,
        },
        enabled: !combatant.hasTalent(SPELLS.BLESSED_HAMMER_TALENT),
        castEfficiency: {
          suggestion: true,
        },
      },
      {
        spell: SPELLS.JUDGMENT_CAST_PROTECTION,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: haste => 12 / (1 + haste),
        charges: combatant.hasTalent(SPELLS.CRUSADERS_JUDGMENT_TALENT) ? 2 : 1,
        gcd: {
          base: 1500,
        },
        castEfficiency: {
          suggestion: true,
        },
      },
      {
        spell: SPELLS.LIGHT_OF_THE_PROTECTOR,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: haste => 20 / (1 + haste) * (combatant.hasHead(ITEMS.SARUANS_RESOLVE.id) ? 0.9 : 1),
        charges: 1 + (combatant.hasHead(ITEMS.SARUANS_RESOLVE.id) ? 1 : 0),
        gcd: {
          base: 1500,
        },
        enabled: !combatant.hasTalent(SPELLS.HAND_OF_THE_PROTECTOR_TALENT),
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.6,
          importance: ISSUE_IMPORTANCE.MINOR,
        },
      },
      {
        spell: SPELLS.HAND_OF_THE_PROTECTOR_TALENT,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: haste => 15 / (1 + haste) * (combatant.hasHead(ITEMS.SARUANS_RESOLVE.id) ? 0.9 : 1),
        charges: 1 + (combatant.hasHead(ITEMS.SARUANS_RESOLVE.id) ? 1 : 0),
        gcd: {
          base: 1500,
        },
        enabled: combatant.hasTalent(SPELLS.HAND_OF_THE_PROTECTOR_TALENT),
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.6,
          importance: ISSUE_IMPORTANCE.MINOR,
        },
      },
      //COOLDOWNS
      {
        spell: SPELLS.ARDENT_DEFENDER,
        buffSpellId: SPELLS.ARDENT_DEFENDER,
        category: Abilities.SPELL_CATEGORIES.DEFENSIVE,
        cooldown: 120 * (combatant.hasTalent(SPELLS.UNBREAKABLE_SPIRIT_TALENT) ? 0.7 : 1),
        castEfficiency: {
          suggestion: true,
        },
      },
      {
        spell: SPELLS.GUARDIAN_OF_ANCIENT_KINGS,
        buffSpellId: SPELLS.GUARDIAN_OF_ANCIENT_KINGS,
        category: Abilities.SPELL_CATEGORIES.DEFENSIVE,
        cooldown: 300,
        castEfficiency: {
          suggestion: true,
        },
      },
      {
        spell: SPELLS.SERAPHIM_TALENT,
        buffSpellId: SPELLS.SERAPHIM_TALENT,
        category: Abilities.SPELL_CATEGORIES.SEMI_DEFENSIVE,
        cooldown: 45,
        gcd: {
          base: 1500,
        },
        enabled: combatant.hasTalent(SPELLS.SERAPHIM_TALENT),
        castEfficiency: {
          suggestion: true,
        },
      },
      {
        spell: SPELLS.AVENGING_WRATH,
        buffSpellId: SPELLS.AVENGING_WRATH,
        category: Abilities.SPELL_CATEGORIES.SEMI_DEFENSIVE,
        gcd: {
          base: 1500,
        },
        cooldown: 120,
        // castEfficiency: {
        //   suggestion: true,
        //   recommendedEfficiency: 0.85,
        // },
      },
      {
        spell: SPELLS.LAY_ON_HANDS,
        isDefensive: true,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 600,
        castEfficiency: {
          suggestion: true,
          recommendedEfficiency: 0.1,
        },
      },
      {
        spell: SPELLS.FLASH_OF_LIGHT,
        category: Abilities.SPELL_CATEGORIES.OTHERS,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.DIVINE_STEED,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 45,
        charges: combatant.hasTalent(SPELLS.CAVALIER_TALENT) ? 2 : 1,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.BLESSING_OF_FREEDOM,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 25,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.BLESSING_OF_PROTECTION,
        isDefensive: true,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 5 * 60,
        gcd: {
          base: 1500,
        },
        enabled: !combatant.hasTalent(SPELLS.BLESSING_OF_SPELLWARDING_TALENT),
      },
      {
        spell: SPELLS.BLESSING_OF_SPELLWARDING_TALENT,
        category: Abilities.SPELL_CATEGORIES.COOLDOWNS,
        cooldown: 180,
        gcd: {
          base: 1500,
        },
        enabled: combatant.hasTalent(SPELLS.BLESSING_OF_SPELLWARDING_TALENT),
      },
      {
        spell: SPELLS.BLESSING_OF_SACRIFICE,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 2.5 * 60 - (combatant.traitsBySpellId[SPELLS.SACRIFICE_OF_THE_JUST] || 0) * 60,
        // castEfficiency: {
        //   suggestion: true,
        //   recommendedEfficiency: 0.85,
        // },
      },
      {
        spell: SPELLS.AEGIS_OF_LIGHT_TALENT,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 180,
        gcd: {
          base: 1500,
        },
        enabled: combatant.hasTalent(SPELLS.AEGIS_OF_LIGHT_TALENT),
      },
      {
        spell: SPELLS.CLEANSE_TOXINS,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 8,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.HAMMER_OF_JUSTICE,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 60,
        gcd: {
          base: 1500,
        },
      },
      {
        spell: SPELLS.HAND_OF_RECKONING,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 8,
      },
      {
        spell: SPELLS.REBUKE,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 15,
      },
      {
        spell: SPELLS.BLINDING_LIGHT_TALENT,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 90,
        gcd: {
          base: 1500,
        },
        enabled: combatant.hasTalent(SPELLS.BLINDING_LIGHT_TALENT),
      },
      {
        spell: SPELLS.REPENTANCE_TALENT,
        category: Abilities.SPELL_CATEGORIES.UTILITY,
        cooldown: 15,
        gcd: {
          base: 1500,
        },
        enabled: combatant.hasTalent(SPELLS.REPENTANCE_TALENT),
      },
      {
        spell: SPELLS.BASTION_OF_LIGHT_TALENT,
        category: Abilities.SPELL_CATEGORIES.ROTATIONAL,
        cooldown: 120,
        enabled: combatant.hasTalent(SPELLS.BASTION_OF_LIGHT_TALENT),
      },
    ];
  }
}

export default Abilities;
