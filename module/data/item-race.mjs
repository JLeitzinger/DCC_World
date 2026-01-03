/**
 * Data model for Race items in the DCC World system.
 * Races provide base statistics and traits for characters.
 */
export default class DCCRaceData extends foundry.abstract.TypeDataModel {

  /** @override */
  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };

    return {
      description: new fields.HTMLField(),

      size: new fields.StringField({
        initial: "medium",
        choices: ["tiny", "small", "medium", "large", "huge", "gargantuan"]
      }),

      speed: new fields.NumberField({ ...requiredInteger, initial: 30, min: 0 }),

      bonuses: new fields.SchemaField({
        attributes: new fields.ObjectField({
          initial: {
            strength: 0,
            constitution: 0,
            dexterity: 0,
            intelligence: 0,
            wisdom: 0,
            charisma: 0
          }
        }),
        hp: new fields.NumberField({ ...requiredInteger, initial: 0 }),
        stamina: new fields.NumberField({ ...requiredInteger, initial: 0 }),
        mana: new fields.NumberField({ ...requiredInteger, initial: 0 })
      }),

      traits: new fields.ArrayField(new fields.StringField()),
      languages: new fields.ArrayField(new fields.StringField())
    };
  }

  /**
   * Apply racial bonuses to a character's attributes.
   * @param {object} attributes - Character attributes object
   * @returns {object} Modified attributes
   */
  applyBonuses(attributes) {
    const modified = foundry.utils.deepClone(attributes);
    for (const [attr, bonus] of Object.entries(this.bonuses.attributes)) {
      if (modified[attr]) {
        modified[attr].value += bonus;
      }
    }
    return modified;
  }
}
