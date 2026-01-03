/**
 * Data model for Character actors in the DCC World system.
 * Uses Foundry v13's TypeDataModel for proper data validation and computed properties.
 */
export default class DCCCharacterData extends foundry.abstract.TypeDataModel {

  /** @override */
  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const requiredNumber = { required: true, nullable: false };

    return {
      // Biography
      biography: new fields.HTMLField(),

      // Level and Experience
      level: new fields.NumberField({ ...requiredInteger, initial: 1, min: 1, max: 100 }),
      xp: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
        max: new fields.NumberField({ ...requiredInteger, initial: 1000, min: 0 })
      }),

      // Core Attributes
      attributes: new fields.SchemaField({
        strength: new fields.SchemaField({
          value: new fields.NumberField({ ...requiredInteger, initial: 10, min: 1, max: 30 }),
          mod: new fields.NumberField({ ...requiredInteger, initial: 0 })
        }),
        constitution: new fields.SchemaField({
          value: new fields.NumberField({ ...requiredInteger, initial: 10, min: 1, max: 30 }),
          mod: new fields.NumberField({ ...requiredInteger, initial: 0 })
        }),
        dexterity: new fields.SchemaField({
          value: new fields.NumberField({ ...requiredInteger, initial: 10, min: 1, max: 30 }),
          mod: new fields.NumberField({ ...requiredInteger, initial: 0 })
        }),
        intelligence: new fields.SchemaField({
          value: new fields.NumberField({ ...requiredInteger, initial: 10, min: 1, max: 30 }),
          mod: new fields.NumberField({ ...requiredInteger, initial: 0 })
        }),
        wisdom: new fields.SchemaField({
          value: new fields.NumberField({ ...requiredInteger, initial: 10, min: 1, max: 30 }),
          mod: new fields.NumberField({ ...requiredInteger, initial: 0 })
        }),
        charisma: new fields.SchemaField({
          value: new fields.NumberField({ ...requiredInteger, initial: 10, min: 1, max: 30 }),
          mod: new fields.NumberField({ ...requiredInteger, initial: 0 })
        })
      }),

      // Resources (HP, Stamina, Mana)
      resources: new fields.SchemaField({
        hp: new fields.SchemaField({
          value: new fields.NumberField({ ...requiredInteger, initial: 10, min: 0 }),
          max: new fields.NumberField({ ...requiredInteger, initial: 10, min: 0 }),
          temp: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 })
        }),
        stamina: new fields.SchemaField({
          value: new fields.NumberField({ ...requiredInteger, initial: 10, min: 0 }),
          max: new fields.NumberField({ ...requiredInteger, initial: 10, min: 0 })
        }),
        mana: new fields.SchemaField({
          value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
          max: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 })
        })
      }),

      // Character Details
      details: new fields.SchemaField({
        race: new fields.StringField({ initial: "" }),
        class: new fields.StringField({ initial: "" }),
        subclass: new fields.StringField({ initial: "" }),
        background: new fields.StringField({ initial: "" })
      }),

      // Physical Traits
      traits: new fields.SchemaField({
        size: new fields.StringField({ initial: "medium" }),
        speed: new fields.NumberField({ ...requiredInteger, initial: 30, min: 0 }),
        carryingCapacity: new fields.SchemaField({
          value: new fields.NumberField({ ...requiredNumber, initial: 0, min: 0 }),
          max: new fields.NumberField({ ...requiredNumber, initial: 150, min: 0 })
        })
      }),

      // Combat Stats
      combat: new fields.SchemaField({
        initiative: new fields.SchemaField({
          value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
          bonus: new fields.NumberField({ ...requiredInteger, initial: 0 })
        }),
        armor: new fields.SchemaField({
          value: new fields.NumberField({ ...requiredInteger, initial: 10, min: 0 }),
          type: new fields.StringField({ initial: "none" })
        }),
        attackBonus: new fields.NumberField({ ...requiredInteger, initial: 0 }),
        damageBonus: new fields.NumberField({ ...requiredInteger, initial: 0 })
      }),

      // Dungeon Crawler Carl Specific Features
      crawler: new fields.SchemaField({
        reputation: new fields.NumberField({ ...requiredInteger, initial: 0 }),
        sponsors: new fields.ArrayField(new fields.StringField()),
        achievements: new fields.ArrayField(new fields.StringField())
      })
    };
  }

  /**
   * Prepare derived data for the character.
   * This is called automatically by Foundry after data is updated.
   * Calculate attribute modifiers and other derived values.
   */
  prepareDerivedData() {
    // Calculate attribute modifiers (standard d20 style: (value - 10) / 2)
    for (const [key, attribute] of Object.entries(this.attributes)) {
      attribute.mod = Math.floor((attribute.value - 10) / 2);
    }

    // Calculate initiative from dexterity
    this.combat.initiative.value = this.attributes.dexterity.mod + this.combat.initiative.bonus;

    // Calculate carrying capacity from strength (15 * STR)
    this.traits.carryingCapacity.max = this.attributes.strength.value * 15;
  }

  /**
   * Calculate the total weight of all items carried by this character.
   * @returns {number} Total weight carried
   */
  get totalWeight() {
    return this.parent.items.reduce((total, item) => {
      const weight = item.system.weight || 0;
      const quantity = item.system.quantity || 1;
      return total + (weight * quantity);
    }, 0);
  }

  /**
   * Check if the character is encumbered.
   * @returns {boolean} True if over carrying capacity
   */
  get isEncumbered() {
    return this.totalWeight > this.traits.carryingCapacity.max;
  }
}
