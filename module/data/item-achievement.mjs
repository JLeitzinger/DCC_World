/**
 * Data model for Achievement items in the DCC World system.
 * Achievements track special accomplishments and provide rewards.
 */
export default class DCCAchievementData extends foundry.abstract.TypeDataModel {

  /** @override */
  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };

    return {
      description: new fields.HTMLField(),

      category: new fields.StringField({
        initial: "combat",
        choices: ["combat", "exploration", "social", "crafting", "special"]
      }),

      completed: new fields.BooleanField({ initial: false }),
      dateCompleted: new fields.NumberField({ initial: null }),

      rewards: new fields.SchemaField({
        xp: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
        reputation: new fields.NumberField({ ...requiredInteger, initial: 0 }),
        items: new fields.ArrayField(new fields.StringField())
      })
    };
  }

  /**
   * Mark this achievement as completed.
   */
  complete() {
    this.completed = true;
    this.dateCompleted = Date.now();
  }

  /**
   * Get a formatted completion date.
   * @returns {string}
   */
  get completionDate() {
    if (!this.dateCompleted) return "Not completed";
    return new Date(this.dateCompleted).toLocaleDateString();
  }
}
