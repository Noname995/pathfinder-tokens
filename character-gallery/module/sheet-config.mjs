import {MODULE_ID} from "./constants.mjs";
import {GALLERY_DATA} from "./data.mjs";

/**
 * Save world and
 * @param {{element: HTMLElement}} dialog
 */
async function saveSettings(_event, _target, dialog) {
  const element = dialog.element;
  const rows = Array.from(element.querySelectorAll("table[data-sheets] tbody tr"));
  const excluded = rows
    .filter((r) => !r.querySelector("input[data-included]").checked)
    .map((row) => {
      const {moduleId, sheetId} = row.dataset;
      return {moduleId, sheetId};
    });

  // Update the user setting and rebuild/rerender if necessary
  const currentFlag = JSON.stringify(game.user.flags[MODULE_ID]?.excludedSheets ?? []);
  await game.user.update({[`flags.${MODULE_ID}.excludedSheets`]: excluded});
  const newFlag = JSON.stringify(game.user.flags[MODULE_ID]?.excludedSheets ?? []);
  if (newFlag !== currentFlag) await CharacterGallery.application.rebuildDatabase();

  if (game.user.isGM) {
    const restricted = rows
      .filter((r) => r.querySelector("input[data-restricted]").checked)
      .map((row) => {
        const {moduleId, sheetId} = row.dataset;
        return {moduleId, sheetId};
      });
    await game.settings.set(MODULE_ID, "restrictedSheets", restricted);
  }
}

/**
 * A function that opens a popout dialog window displaying a list of active sources in the world and allowing them to
 * be individually toggled on and off
 */
async function openGalleryConfigDialog() {
  const application = CharacterGallery.application;
  const excludedSheets = game.user.flags[MODULE_ID]?.excludedSheets ?? [];
  const restrictedSheets = game.settings.get(MODULE_ID, "restrictedSheets");
  const data = {
    playersHaveAccess: application.playersHaveAccess,
    user: game.user,
    sheets: Array.from(GALLERY_DATA.SOURCES).map((sheet) => ({
      ...sheet,
      included: !excludedSheets.some((e) => sheet.module.id === e.moduleId && sheet.id === e.sheetId),
      restricted: restrictedSheets.some((r) => sheet.module.id === r.moduleId && sheet.id === r.sheetId)
    }))
  };
  const content = await renderTemplate(`modules/${MODULE_ID}/character-gallery/templates/sheet-config.hbs`, data);
  return foundry.applications.api.DialogV2.wait({
    id: "character-gallery-sheet-config",
    window: {title: "CharacterGallery.BUTTON.configureDatasheets"},
    position: {width: 800},
    content,
    modal: true,
    buttons: [
      {
        label: game.i18n.localize("CharacterGallery.BUTTON.Cancel"),
        action: "cancel"
      },
      {
        label: game.i18n.localize("CharacterGallery.BUTTON.ResetToDefaults"),
        action: "reset",
        callback: async () => {
          await game.user.update({[`flags.${MODULE_ID}.excludedSheets`]: []});
          application.rebuildDatabase();
          if (game.user.isGM) {
            await game.settings.set(MODULE_ID, "restrictedSheets", []);
          }
        }
      },
      {
        label: game.i18n.localize("CharacterGallery.BUTTON.SaveChanges"),
        action: "saveSettings",
        callback: saveSettings
      }
    ]
  });
}

export {openGalleryConfigDialog};
