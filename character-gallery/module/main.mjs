import {MODULE_ID} from "./constants.mjs";
import GalleryApplication from "./gallery.mjs";
import {importDatasheets} from "./helpers.mjs";
import {registerSettings, registerSettingsMenu} from "./settings.mjs";

/** @import from "./types.d.mjs"; */

/* -------------------------------------------- */
/*  Hooks                                       */
/* -------------------------------------------- */

Hooks.once("init", () => {
  registerSettings();
  // Create references to data & settings for easier access
  globalThis.CharacterGallery = game.modules.get(MODULE_ID);
});

Hooks.once("ready", async () => {
  // Initialize the gallery application
  await importDatasheets();
  CharacterGallery.application = new GalleryApplication();
});

Hooks.on("renderActorDirectory", (app) => {
  // Application isn't yet available on initial load
  const minimumRole = game.settings.get(MODULE_ID, "galleryAccess");
  if (!game.user.hasRole(minimumRole)) return;
  // Check if button already exists
  if (document.getElementById("characterGalleryButton")) return;
  // Create button
  const button = document.createElement("button");
  button.innerHTML = '<i class="fa-solid fa-palette fa-fw"></i> <span>Character Gallery</span>';
  button.id = "characterGalleryButton"
  button.addEventListener("click", () => {
    CharacterGallery.application.render({force: true});
  });
  const footer = app.element.querySelector("footer.directory-footer");
  footer?.append(button);
});

/** Wait for the actor sheet render hook, add a header button that opens the NPC gallery */
Hooks.on("getActorSheetHeaderButtons", (app, buttons) => {
  if (CharacterGallery.application.userHasAccess && game.settings.get(MODULE_ID, "headerButton")) {
    buttons.unshift({
      class: "render-gallery",
      icon: "fa-solid fa-palette",
      label: game.i18n.localize("CharacterGallery.GalleryLabel"),
      onclick: () => {
        const gallery = CharacterGallery.application;
        gallery.session.targetActor = app.actor;
        gallery.render({force: true});
      }
    });
  }
});

Hooks.once("init", () => {
  // Сначала регистрируем настройки
  registerSettings();
  // Затем регистрируем кнопку меню для этих настроек
  registerSettingsMenu(); // <-- Добавьте эту строку

  // Create references to data & settings for easier access
  globalThis.CharacterGallery = game.modules.get(MODULE_ID);
});