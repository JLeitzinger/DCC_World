/**
 * Character sheet for DCC World system.
 * Extends FormApplication for traditional Foundry sheet functionality.
 */
export default class DCCActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["dcc-world", "sheet", "actor"],
      width: 600,
      height: 700,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "stats" }],
      dragDrop: [{ dragSelector: ".item-list .item", dropSelector: null }]
    });
  }

  /** @override */
  get template() {
    return `systems/dcc-world/templates/actor/${this.actor.type}-sheet.hbs`;
  }

  /** @override */
  getData() {
    const context = super.getData();

    // Add the actor's data to context
    context.system = this.actor.system;
    context.flags = this.actor.flags;

    // Prepare items organized by type
    context.items = this.actor.items.reduce((obj, item) => {
      if (!obj[item.type]) obj[item.type] = [];
      obj[item.type].push(item);
      return obj;
    }, {});

    // Add config data
    context.config = CONFIG.DCC;

    return context;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Roll handlers
    html.find(".rollable").click(this._onRoll.bind(this));

    // Item management
    html.find(".item-create").click(this._onItemCreate.bind(this));
    html.find(".item-edit").click(this._onItemEdit.bind(this));
    html.find(".item-delete").click(this._onItemDelete.bind(this));
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    // Handle different roll types
    if (dataset.rollType) {
      if (dataset.rollType === "attribute") {
        const attr = dataset.attribute;
        const mod = this.actor.system.attributes[attr].mod;
        const roll = await new Roll("1d20 + @mod", { mod }).roll();

        roll.toMessage({
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          flavor: `${attr.charAt(0).toUpperCase() + attr.slice(1)} Check`
        });
      }
    }
  }

  /**
   * Handle creating a new owned item.
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    const type = header.dataset.type;

    const itemData = {
      name: `New ${type.capitalize()}`,
      type: type,
      system: {}
    };

    return await Item.create(itemData, { parent: this.actor });
  }

  /**
   * Handle editing an item.
   * @param {Event} event   The originating click event
   * @private
   */
  _onItemEdit(event) {
    event.preventDefault();
    const li = $(event.currentTarget).parents(".item");
    const item = this.actor.items.get(li.data("itemId"));
    item.sheet.render(true);
  }

  /**
   * Handle deleting an item.
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemDelete(event) {
    event.preventDefault();
    const li = $(event.currentTarget).parents(".item");
    const item = this.actor.items.get(li.data("itemId"));
    if (item) {
      return item.delete();
    }
  }
}
