/**
 * Data model for Consumable items (potions, scrolls, etc.) in the DCC World system.
 */
export default class DCCConsumableData extends foundry.abstract.TypeDataModel {

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
      identified: new fields.BooleanField({ initial: true }),

      consumableType: new fields.StringField({
        initial: "potion",
        choices: ["potion", "scroll", "food", "other"]
      }),

      uses: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 1, min: 0 }),
        max: new fields.NumberField({ ...requiredInteger, initial: 1, min: 1 }),
        autoDestroy: new fields.BooleanField({ initial: true })
      }),

      effects: new fields.ArrayField(new fields.ObjectField())
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
