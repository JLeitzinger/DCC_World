/**
 * Data model for Weapon items in the DCC World system.
 */
export default class DCCWeaponData extends foundry.abstract.TypeDataModel {

  /** @override */
  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const requiredNumber = { required: true, nullable: false };

    return {
      description: new fields.HTMLField(),
      quantity: new fields.NumberField({ ...requiredInteger, initial: 1, min: 0 }),
      weight: new fields.NumberField({ ...requiredNumber, initial: 0, min: 0 }),
      rarity: new fields.StringField({
        initial: "common",
        choices: ["common", "uncommon", "rare", "epic", "legendary", "artifact"]
      }),
      equipped: new fields.BooleanField({ initial: false }),
      identified: new fields.BooleanField({ initial: true }),

      damage: new fields.SchemaField({
        base: new fields.StringField({ initial: "1d6" }),
        type: new fields.StringField({
          initial: "physical",
          choices: ["physical", "fire", "ice", "lightning", "poison", "acid", "psychic", "holy", "dark"]
        })
      }),

      attackBonus: new fields.NumberField({ ...requiredInteger, initial: 0 }),
      damageBonus: new fields.NumberField({ ...requiredInteger, initial: 0 }),

      properties: new fields.ArrayField(new fields.StringField()),

      range: new fields.SchemaField({
        normal: new fields.NumberField({ ...requiredInteger, initial: 5, min: 0 }),
        long: new fields.NumberField({ ...requiredInteger, initial: 5, min: 0 })
      }),

      requirements: new fields.SchemaField({
        level: new fields.NumberField({ ...requiredInteger, initial: 1, min: 1 }),
        attributes: new fields.ObjectField({ initial: {} })
      })
    };
  }

  /**
   * Check if this weapon is ranged.
   * @returns {boolean}
   */
  get isRanged() {
    return this.range.normal > 5;
  }

  /**
   * Get the rarity color for display purposes.
   * @returns {string} CSS color value
   */
  get rarityColor() {
    const colors = {
      common: "#ffffff",
      uncommon: "#1eff00",
      rare: "#0070dd",
      epic: "#a335ee",
      legendary: "#ff8000",
      artifact: "#e6cc80"
    };
    return colors[this.rarity] || colors.common;
  }
}
