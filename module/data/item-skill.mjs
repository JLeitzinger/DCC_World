/**
 * Data model for Skill items in the DCC World system.
 * Skills level independently with use and can have cooldowns.
 */
export default class DCCSkillData extends foundry.abstract.TypeDataModel {

  /** @override */
  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };

    return {
      description: new fields.HTMLField(),

      skillType: new fields.StringField({
        initial: "active",
        choices: ["active", "passive"]
      }),

      level: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 1, min: 1, max: 10 }),
        max: new fields.NumberField({ ...requiredInteger, initial: 10, min: 1 })
      }),

      xp: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
        max: new fields.NumberField({ ...requiredInteger, initial: 100, min: 0 })
      }),

      cooldown: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
        max: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 })
      }),

      cost: new fields.SchemaField({
        stamina: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
        mana: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 })
      }),

      damage: new fields.SchemaField({
        base: new fields.StringField({ initial: "" }),
        type: new fields.StringField({
          initial: "physical",
          choices: ["physical", "fire", "ice", "lightning", "poison", "acid", "psychic", "holy", "dark"]
        })
      }),

      requirements: new fields.SchemaField({
        level: new fields.NumberField({ ...requiredInteger, initial: 1, min: 1 }),
        attributes: new fields.ObjectField({ initial: {} }),
        skills: new fields.ArrayField(new fields.StringField())
      }),

      effects: new fields.ArrayField(new fields.ObjectField())
    };
  }

  /**
   * Check if the skill is on cooldown.
   * @returns {boolean}
   */
  get isOnCooldown() {
    return this.cooldown.value > 0;
  }

  /**
   * Check if the skill is at max level.
   * @returns {boolean}
   */
  get isMaxLevel() {
    return this.level.value >= this.level.max;
  }

  /**
   * Calculate progress to next level as a percentage.
   * @returns {number} Percentage (0-100)
   */
  get levelProgress() {
    if (this.isMaxLevel) return 100;
    return Math.floor((this.xp.value / this.xp.max) * 100);
  }
}
