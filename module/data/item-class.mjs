/**
 * Data model for Class items in the DCC World system.
 * Classes define character archetypes and progression.
 */
export default class DCCClassData extends foundry.abstract.TypeDataModel {

  /** @override */
  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };

    return {
      description: new fields.HTMLField(),

      hitDie: new fields.StringField({
        initial: "d8",
        choices: ["d4", "d6", "d8", "d10", "d12"]
      }),

      primaryAttribute: new fields.StringField({
        initial: "strength",
        choices: ["strength", "constitution", "dexterity", "intelligence", "wisdom", "charisma"]
      }),

      startingHp: new fields.NumberField({ ...requiredInteger, initial: 10, min: 1 }),
      startingStamina: new fields.NumberField({ ...requiredInteger, initial: 10, min: 0 }),
      startingMana: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),

      skills: new fields.ArrayField(new fields.StringField()),
      equipment: new fields.ArrayField(new fields.StringField())
    };
  }

  /**
   * Calculate HP for a given level based on this class's hit die.
   * @param {number} level - Character level
   * @param {number} conMod - Constitution modifier
   * @returns {number} Max HP
   */
  calculateHpForLevel(level, conMod = 0) {
    const dieSize = parseInt(this.hitDie.substring(1));
    const avgRoll = Math.ceil(dieSize / 2) + 1;
    return this.startingHp + ((level - 1) * (avgRoll + conMod));
  }
}
