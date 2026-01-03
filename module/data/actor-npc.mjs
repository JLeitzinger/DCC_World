/**
 * Data model for NPC actors in the DCC World system.
 * NPCs have a simplified data structure compared to player characters.
 */
export default class DCCNPCData extends foundry.abstract.TypeDataModel {

  /** @override */
  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };

    return {
      // Biography
      biography: new fields.HTMLField(),

      // Level and Experience
      level: new fields.NumberField({ ...requiredInteger, initial: 1, min: 1, max: 100 }),
      xp: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
        max: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 })
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

      // Resources
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

      // NPC Details
      details: new fields.SchemaField({
        type: new fields.StringField({ initial: "humanoid" }),
        environment: new fields.StringField({ initial: "" })
      }),

      // Physical Traits
      traits: new fields.SchemaField({
        size: new fields.StringField({ initial: "medium" }),
        speed: new fields.NumberField({ ...requiredInteger, initial: 30, min: 0 })
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
        })
      })
    };
  }

  /**
   * Prepare derived data for the NPC.
   * Calculate attribute modifiers and other derived values.
   */
  prepareDerivedData() {
    // Calculate attribute modifiers
    for (const [key, attribute] of Object.entries(this.attributes)) {
      attribute.mod = Math.floor((attribute.value - 10) / 2);
    }

    // Calculate initiative from dexterity
    this.combat.initiative.value = this.attributes.dexterity.mod + this.combat.initiative.bonus;
  }
}
