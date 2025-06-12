const COMPENDIUM_IDS = [
  "pf2e.pathfinder-bestiary",
  "pf2e.pathfinder-bestiary-2",
  "pf2e.pathfinder-bestiary-3",
  "pf2e.pathfinder-monster-core",
  "pf2e.pathfinder-npc-core",
  "pf2e.age-of-ashes-bestiary",
  //"pf2e.spore-war-bestiary",
  //"pf2e.triumph-of-the-tusk-bestiary",
  //"pf2e.pfs-introductions-bestiary",
  //"pf2e.pfs-season-1-bestiary"
];

function isFromAllowedCompendium(actor) {
  const compSource = actor.system?._stats?.compendiumSource || actor._stats?.compendiumSource;
  return compSource && COMPENDIUM_IDS.some(id => compSource.startsWith(`Compendium.${id}`));
}

function getTokenLists() {
  const enabled = [];
  const disabled = [];

  for (const token of canvas.tokens.placeables) {
    if (!token.actor || !isFromAllowedCompendium(token.actor)) continue;

    const ringEnabled = foundry.utils.getProperty(token.document, "ring.enabled") ?? false;
    if (ringEnabled) enabled.push(token);
    else disabled.push(token);
  }
  return { enabled, disabled };
}

async function updateRings(enabledChecked, disabledChecked) {
  for (const token of canvas.tokens.placeables) {
    if (!token.actor || !isFromAllowedCompendium(token.actor)) continue;

    const current = foundry.utils.getProperty(token.document, "ring.enabled") ?? false;
    try {
      if (current) {
        await token.document.update({ "ring.enabled": enabledChecked });
      } else {
        await token.document.update({ "ring.enabled": disabledChecked });
      }
    } catch (err) {
      console.error(game.i18n.format("PF2E-TOKEN-PACK.TokenRingManagerUpdateError", { error: err }));
    }
  }
}

// Настроечная форма
class TokenRingManagerForm extends FormApplication {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "token-ring-manager",
      title: game.i18n.localize("PF2E-TOKEN-PACK.TokenRingManagerTitle"),
      template: "modules/pf2e-token-pack/templates/Token-Ring-Manager.html",
      width: 400,
      height: "auto"
    });
  }

  getData() {
    const { enabled, disabled } = getTokenLists();
    return {
      enabledCount: enabled.length,
      disabledCount: disabled.length
    };
  }

activateListeners(html) {
  super.activateListeners(html);

  html.find(".token-ring-apply").on("click", async () => {
    const enabledChecked = html.find("#enabled-toggle")[0]?.checked ?? true;
    const disabledChecked = html.find("#disabled-toggle")[0]?.checked ?? false;

    await updateRings(enabledChecked, disabledChecked);

    // Закрываем форму после выполнения
    this.close();
  });
}
}

// Регистрируем меню
Hooks.once("init", () => {
  game.settings.registerMenu("pf2e-token-pack", "tokenRingManager", {
    name: game.i18n.localize("PF2E-TOKEN-PACK.TokenRingManagerName"),
    label: game.i18n.localize("PF2E-TOKEN-PACK.TokenRingManagerOpen"),
    hint: game.i18n.localize("PF2E-TOKEN-PACK.TokenRingManagerHint"),
    icon: "fas fa-ring",
    type: TokenRingManagerForm,
    restricted: true
  });
});