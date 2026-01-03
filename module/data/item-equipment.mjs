/**
 * Data model for Equipment items (accessories, rings, etc.) in the DCC World system.
 */
export default class DCCEquipmentData extends foundry.abstract.TypeDataModel {

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

      slot: new fields.StringField({
        initial: "none",
        choices: ["none", "ring", "necklace", "trinket", "back", "hands", "feet"]
      }),

      bonuses: new fields.SchemaField({
        attributes: new fields.ObjectField({ initial: {} }),
        resistances: new fields.ArrayField(new fields.StringField())
      }),

      requirements: new fields.SchemaField({
        level: new fields.NumberField({ ...requiredInteger, initial: 1, min: 1 }),
        attributes: new fields.ObjectField({ initial: {} })
      })
    };
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
