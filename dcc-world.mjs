/**
 * Dungeon Crawler Carl World System
 * Main initialization script for Foundry VTT v13
 * Author: Your Name
 * Software License: MIT
 */

// Import data models
import * as models from "./module/data/_module.mjs";

// Import applications
import DCCActorSheet from "./module/applications/actor-sheet.mjs";

/**
 * Initialize the DCC World system.
 * This hook runs once when Foundry first initializes.
 */
Hooks.once("init", function() {
  console.log("DCC World | Initializing Dungeon Crawler Carl World System");

  // Create a namespace for the system
  game.dccworld = {
    models
  };

  // Register custom data models with Foundry's CONFIG
  // This tells Foundry which data model class to use for each actor/item type
  CONFIG.Actor.dataModels = {
    character: models.DCCCharacterData,
    npc: models.DCCNPCData
  };

  CONFIG.Item.dataModels = {
    weapon: models.DCCWeaponData,
    armor: models.DCCArmorData,
    equipment: models.DCCEquipmentData,
    consumable: models.DCCConsumableData,
    skill: models.DCCSkillData,
    achievement: models.DCCAchievementData,
    class: models.DCCClassData,
    race: models.DCCRaceData
  };

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("dcc-world", DCCActorSheet, {
    types: ["character", "npc"],
    makeDefault: true,
    label: "DCC.SheetLabels.Actor"
  });

  // Preload Handlebars templates
  preloadHandlebarsTemplates();

  // Register Handlebars helpers
  registerHandlebarsHelpers();

  console.log("DCC World | System initialization complete");
});

/**
 * Ready hook - runs when Foundry is fully loaded and ready.
 */
Hooks.once("ready", function() {
  console.log("DCC World | System ready");

  // Display welcome message to GM
  if (game.user.isGM) {
    ui.notifications.info("Dungeon Crawler Carl World System loaded successfully!");
  }
});

/**
 * Preload Handlebars templates for character and item sheets.
 * This improves performance by loading templates before they're needed.
 * @returns {Promise}
 */
async function preloadHandlebarsTemplates() {
  const templatePaths = [
    // Actor sheet templates
    "systems/dcc-world/templates/actor/character-sheet.hbs",
    "systems/dcc-world/templates/actor/npc-sheet.hbs",
    "systems/dcc-world/templates/actor/parts/character-header.hbs",
    "systems/dcc-world/templates/actor/parts/character-attributes.hbs",
    "systems/dcc-world/templates/actor/parts/character-resources.hbs",
    "systems/dcc-world/templates/actor/parts/character-skills.hbs",
    "systems/dcc-world/templates/actor/parts/character-inventory.hbs",
    "systems/dcc-world/templates/actor/parts/character-achievements.hbs",

    // Item sheet templates
    "systems/dcc-world/templates/item/weapon-sheet.hbs",
    "systems/dcc-world/templates/item/armor-sheet.hbs",
    "systems/dcc-world/templates/item/equipment-sheet.hbs",
    "systems/dcc-world/templates/item/consumable-sheet.hbs",
    "systems/dcc-world/templates/item/skill-sheet.hbs",
    "systems/dcc-world/templates/item/achievement-sheet.hbs",
    "systems/dcc-world/templates/item/class-sheet.hbs",
    "systems/dcc-world/templates/item/race-sheet.hbs"
  ];

  return loadTemplates(templatePaths);
}

/**
 * Register custom Handlebars helpers.
 */
function registerHandlebarsHelpers() {
  Handlebars.registerHelper("capitalize", function(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  });

  Handlebars.registerHelper("concat", function(...args) {
    args.pop(); // Remove the Handlebars options object
    return args.join("");
  });

  Handlebars.registerHelper("toLowerCase", function(str) {
    return str.toLowerCase();
  });

  Handlebars.registerHelper("times", function(n, block) {
    let result = "";
    for (let i = 0; i < n; i++) {
      result += block.fn(i);
    }
    return result;
  });

  Handlebars.registerHelper("eq", function(a, b) {
    return a === b;
  });

  Handlebars.registerHelper("ne", function(a, b) {
    return a !== b;
  });

  Handlebars.registerHelper("gt", function(a, b) {
    return a > b;
  });

  Handlebars.registerHelper("lt", function(a, b) {
    return a < b;
  });

  Handlebars.registerHelper("add", function(a, b) {
    return a + b;
  });

  Handlebars.registerHelper("subtract", function(a, b) {
    return a - b;
  });

  Handlebars.registerHelper("multiply", function(a, b) {
    return a * b;
  });

  Handlebars.registerHelper("divide", function(a, b) {
    return a / b;
  });

  Handlebars.registerHelper("abs", function(value) {
    return Math.abs(value);
  });

  Handlebars.registerHelper("numberFormat", function(value) {
    if (value >= 0) return `+${value}`;
    return value.toString();
  });
}
