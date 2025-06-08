export async function fixTokens() {
  // Весь твой код изначального скрипта без IIFE
  const getActorFromCompendium = async (source) => {
    const match = source.match(/^Compendium\.([^\.]+)\.([^\.]+)\.Actor\.([^\.]+)$/);
    if (!match) return null;
    const [_, scope, pack, id] = match;
    const compendium = game.packs.get(`${scope}.${pack}`);
    if (!compendium) return null;
    await compendium.getIndex();
    return await compendium.getDocument(id);
  };

  const tokens = canvas.tokens.placeables;
  const fixes = [];

  for (const token of tokens) {
    const actor = token.actor;
    if (!actor) continue;
    const source = actor?.system?._stats?.compendiumSource || actor?._stats?.compendiumSource;
    if (!source || !source.startsWith("Compendium.")) continue;
    const compActor = await getActorFromCompendium(source);
    if (!compActor) continue;
    const compRaw = compActor.toObject();
    const patchActor = {};
    const patchToken = {};
    const changes = [];
    const ringEnabled = foundry.utils.getProperty(actor, "prototypeToken.ring.enabled") ?? false;
    const actorFields = [
      "prototypeToken.texture.scaleX",
      "prototypeToken.texture.scaleY"
    ];
    if (ringEnabled) {
      actorFields.push("prototypeToken.ring.subject.texture");
      actorFields.push("prototypeToken.ring.subject.scale");
    }
    if (ringEnabled) {
      const actorImg = actor.img;
      const currVal = foundry.utils.getProperty(actor, "prototypeToken.texture.src");
      if (
        actorImg &&
        !actorImg.includes("mystery-man.svg") &&
        currVal !== actorImg
      ) {
        foundry.utils.setProperty(patchActor, "prototypeToken.texture.src", actorImg);
        changes.push({ path: "actor.prototypeToken.texture.src", from: currVal, to: actorImg });
      }
    } else {
      const origVal = foundry.utils.getProperty(compRaw, "prototypeToken.texture.src");
      const currVal = foundry.utils.getProperty(actor, "prototypeToken.texture.src");
      if (
        typeof origVal === "string" &&
        !origVal.includes("mystery-man.svg") &&
        origVal !== currVal
      ) {
        foundry.utils.setProperty(patchActor, "prototypeToken.texture.src", origVal);
        changes.push({ path: "actor.prototypeToken.texture.src", from: currVal, to: origVal });
      }
    }
    for (const path of actorFields) {
      const origVal = foundry.utils.getProperty(compRaw, path);
      const currVal = foundry.utils.getProperty(actor, path);
      if (typeof origVal === "string" && origVal.includes("mystery-man.svg")) continue;
      if (JSON.stringify(origVal) !== JSON.stringify(currVal)) {
        foundry.utils.setProperty(patchActor, path, origVal);
        changes.push({ path: `actor.${path}`, from: currVal, to: origVal });
      }
    }
    if (
      compRaw.img !== actor.img &&
      !(compRaw.img || "").includes("mystery-man.svg")
    ) {
      patchActor.img = compRaw.img;
      changes.push({ path: "actor.img", from: actor.img, to: compRaw.img });
    }
    const tokenFields = [
      "texture.src",
      "texture.scaleX",
      "texture.scaleY"
    ];
    if (ringEnabled) {
      tokenFields.push("ring.subject.texture");
      tokenFields.push("ring.subject.scale");
    }
    for (const path of tokenFields) {
      const expectedVal = foundry.utils.getProperty(actor.prototypeToken, path);
      const currentVal = foundry.utils.getProperty(token.document, path);
      if (typeof expectedVal === "string" && expectedVal.includes("mystery-man.svg")) continue;
      if (JSON.stringify(expectedVal) !== JSON.stringify(currentVal)) {
        foundry.utils.setProperty(patchToken, path, expectedVal);
        changes.push({ path: `token.${path}`, from: currentVal, to: expectedVal });
      }
    }
    if (changes.length > 0) {
      if (Object.keys(patchActor).length > 0) await actor.update(patchActor);
      if (Object.keys(patchToken).length > 0) await token.document.update(patchToken);
      fixes.push({ name: actor.name, changes });
    }
  }
  if (fixes.length > 0) {
    ui.notifications.info(game.i18n.format("PF2E-TOKEN-PACK.FixTokensTokensUpdated", {count: fixes.length}));
  } else {
    ui.notifications.info(game.i18n.localize("PF2E-TOKEN-PACK.FixTokensNoUpdatesNeeded"));
  }
}

// Кастомная форма настроек
class FixTokensSettings extends FormApplication {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "fix-tokens-settings",
      title: game.i18n.localize("PF2E-TOKEN-PACK.FixTokensTitle"),
      template: "modules/pf2e-token-pack/templates/Fix-Tokens.html",
      width: 400
    });
  }


  getData() {
    return {};
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find(".fix-tokens-run").on("click", async () => {
      await fixTokens(); // Без доп. уведомлений!
    });
  }
}

// Регистрируем меню в настройках модуля
Hooks.once("init", () => {
  game.settings.registerMenu("pf2e-token-pack", "fixTokensMenu", {
    name: game.i18n.localize("PF2E-TOKEN-PACK.FixTokensMenuName"),
    label: game.i18n.localize("PF2E-TOKEN-PACK.FixTokensOpen"),
    hint: game.i18n.localize("PF2E-TOKEN-PACK.FixTokensMenuHint"),
    icon: "fas fa-sync",
    type: FixTokensSettings,
    restricted: true
  });
});