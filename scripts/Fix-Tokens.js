async function showMyScriptDialog() {
  const actorsToSelect = game.actors.contents.filter(a => !["character", "hazard", "loot"].includes(a.type));

  if (actorsToSelect.length === 0) {
    ui.notifications.warn(game.i18n.localize("PF2E-TOKEN-PACK.FixTokensNoActorsFound"));
    return;
  }

  let dialogContent = `
    <p>${game.i18n.localize("PF2E-TOKEN-PACK.FixTokensDialogDescription")}</p>

    <div style="margin-bottom: 10px;">
        <input type="text" id="actor-search" placeholder="${game.i18n.localize("PF2E-TOKEN-PACK.FixTokensSearchPlaceholder")}" style="width: 100%; padding: 5px; border-radius: 3px; border: 1px solid #ccc;" />
    </div>

    <form>
        <div id="actor-list" style="height: 350px; overflow-y: scroll; border: 1px solid #ccc; padding: 10px; border-radius: 5px;">
  `;

  actorsToSelect.sort((a, b) => a.name.localeCompare(b.name)).forEach(actor => {
    dialogContent += `
        <div class="actor-item" style="padding: 2px; display: flex; align-items: center;">
            <input type="checkbox" id="${actor.id}" name="excluded-actors" value="${actor.id}" style="margin-right: 8px;">
            <label for="${actor.id}">${actor.name}</label>
        </div>
    `;
  });

  dialogContent += `</div></form>`;

  new Dialog({
    title: game.i18n.localize("PF2E-TOKEN-PACK.FixTokensDialogTitle"),
    content: dialogContent,
    buttons: {
      run: {
        icon: '<i class="fas fa-play"></i>',
        label: game.i18n.localize("PF2E-TOKEN-PACK.FixTokensRunButton"),
        callback: (html) => {
          const excludedActorIds = html.find('input[name="excluded-actors"]:checked').map((i, el) => $(el).val()).get();
          runUpdateScript(excludedActorIds);
        }
      },
      cancel: {
        icon: '<i class="fas fa-times"></i>',
        label: game.i18n.localize("PF2E-TOKEN-PACK.FixTokensCancelButton"),
        callback: () => {
          ui.notifications.info(game.i18n.localize("PF2E-TOKEN-PACK.FixTokensOperationCanceled"));
        }
      }
    },
    default: "run",
    render: html => {
      $(html).closest(".dialog").css("width", "400px");
      const searchInput = html.find('#actor-search');
      const actorList = html.find('#actor-list');

      searchInput.on('input', event => {
        const searchTerm = event.currentTarget.value.toLowerCase().trim();
        actorList.find('.actor-item').each((i, el) => {
          const actorName = $(el).find('label').text().toLowerCase();
          $(el).toggle(actorName.includes(searchTerm));
        });
      });
    }
  }).render(true);
}

async function runUpdateScript(excludedActorIds = []) {
    ui.notifications.info("Приступаем к проверке...");

    const updatedActors = [];
    const notUpdatedActors = [];
    const updatedTokens = [];
    const notUpdatedTokens = [];

    for (const actor of game.actors.contents) {
        // Пропускаем персонажей игроков, ловушки, добычу и актеров, выбранных для исключения.
        if (["character", "hazard", "loot"].includes(actor.type) || excludedActorIds.includes(actor.id)) {
            continue;
        }

        let original = null;
        let actorId = null;
        let reasonForFailure = "";

        // --- Поиск Method 1: По ID из compendiumSource ---
        const source = actor._stats?.compendiumSource;
        const match = source?.match(/\.([A-Za-z0-9]{16})$/);

        if (match) {
            actorId = match[1];
            for (const pack of game.packs.values()) {
                if (pack.documentName !== "Actor") continue;
                if (pack.index.size === 0) await pack.getIndex();
                if (pack.index.get(actorId)) {
                    original = await pack.getDocument(actorId);
                    break;
                }
            }
        }

        // --- Поиск Method 2: Резервный поиск по имени из флагов Babele ---
        if (!original) {
            const babeleName = actor.flags?.babele?.originalName;
            if (babeleName) {
                reasonForFailure = game.i18n.format("PF2E-TOKEN-PACK.FixTokensBabeleNameNotFound", { actorId: actorId || game.i18n.localize("PF2E-TOKEN-PACK.FixTokensNotFound"), babeleName });
                for (const pack of game.packs.values()) {
                    if (pack.documentName !== "Actor") continue;
                    if (pack.index.size === 0) await pack.getIndex();
                    const entry = pack.index.find(i => i.name === babeleName);
                    if (entry) {
                        original = await pack.getDocument(entry._id);
                        break;
                    }
                }
            }
        }

        // Если оригинал не найден — логируем и пропускаем
        if (!original) {
            if (!reasonForFailure) {
                reasonForFailure = game.i18n.format("PF2E-TOKEN-PACK.FixTokensInvalidCompendiumSource", { source });
            }
            notUpdatedActors.push({ name: actor.name, reason: reasonForFailure });
            continue;
        }

        // --- Сравнение и подготовка данных для обновления актера ---
        const currentPT = actor.prototypeToken.toObject();
        const originalPT = original.prototypeToken.toObject();
        const updatedPT = foundry.utils.deepClone(currentPT);
        let needsUpdate = false;
        let actorImgUpdate = null;

        // Масштаб токена
        if (currentPT.texture.scaleX !== originalPT.texture.scaleX) {
            updatedPT.texture.scaleX = originalPT.texture.scaleX;
            needsUpdate = true;
        }
        if (currentPT.texture.scaleY !== originalPT.texture.scaleY) {
            updatedPT.texture.scaleY = originalPT.texture.scaleY;
            needsUpdate = true;
        }

        // Обновление изображения актёра
        if (actor.img !== original.img) {
            actorImgUpdate = original.img;
        }

        // Восстановление ring.enabled
        if (originalPT.ring?.enabled !== undefined && updatedPT.ring?.enabled !== originalPT.ring.enabled) {
            foundry.utils.setProperty(updatedPT, "ring.enabled", originalPT.ring.enabled);
            needsUpdate = true;
        }

        // Обновление свойств кольца и текстуры
        if (originalPT.ring?.enabled) {
            if (currentPT.ring?.subject?.scale !== originalPT.ring.subject.scale) {
                foundry.utils.setProperty(updatedPT, "ring.subject.scale", originalPT.ring.subject.scale);
                needsUpdate = true;
            }
            if (currentPT.ring?.subject?.texture !== originalPT.ring.subject.texture) {
                foundry.utils.setProperty(updatedPT, "ring.subject.texture", originalPT.ring.subject.texture);
                needsUpdate = true;
            }
            if (currentPT.texture.src !== original.img) {
                updatedPT.texture.src = original.img;
                needsUpdate = true;
            }
        } else {
            // Если ring отключён — восстанавливаем оригинальную текстуру
            if (currentPT.texture.src !== originalPT.texture.src) {
                updatedPT.texture.src = originalPT.texture.src;
                needsUpdate = true;
            }
        }

        // Автоматическое масштабирование выключаем
        if (foundry.utils.getProperty(updatedPT, "flags.pf2e.autoscale") !== false) {
            foundry.utils.setProperty(updatedPT, "flags.pf2e.autoscale", false);
            needsUpdate = true;
        }

        // --- Применение изменений к актеру ---
        if (actorImgUpdate || needsUpdate) {
            let updateData = {};
            if (actorImgUpdate) updateData.img = actorImgUpdate;
            if (needsUpdate) updateData.prototypeToken = updatedPT;
            await actor.update(updateData);
            updatedActors.push(actor.name);
        }

        // === Обработка токенов на сценах ===
        for (const scene of game.scenes.contents) {
            for (const tokenDoc of scene.tokens.filter(t => t.actorId === actor.id)) {
                if (!tokenDoc.actor) continue;

                // --- Сравнение и обновление токена ---
                const current = tokenDoc.toObject();
                const originalForToken = original; // Используем уже найденный оригинал
                const originalPTToken = originalForToken.prototypeToken.toObject();
                let tokenUpdateData = {};

                const patch = (path, currentVal, originalVal) => {
                    if (currentVal !== originalVal) {
                        tokenUpdateData[path] = originalVal;
                    }
                };
                
                patch("texture.scaleX", current.texture.scaleX, originalPTToken.texture.scaleX);
                patch("texture.scaleY", current.texture.scaleY, originalPTToken.texture.scaleY);
                patch("ring.enabled", current.ring?.enabled, originalPTToken.ring?.enabled);

                if (originalPTToken.ring?.enabled) {
                    patch("ring.subject.scale", current.ring?.subject?.scale, originalPTToken.ring?.subject?.scale);
                    patch("ring.subject.texture", current.ring?.subject?.texture, originalPTToken.ring?.subject?.texture);
                    patch("texture.src", current.texture.src, originalForToken.img);
                } else {
                    patch("texture.src", current.texture.src, originalPTToken.texture.src);
                }

                patch("flags.pf2e.autoscale", current.flags?.pf2e?.autoscale, false);

                if (Object.keys(tokenUpdateData).length > 0) {
                    try {
                        await tokenDoc.update(tokenUpdateData);
                        if (tokenDoc.object) tokenDoc.object.refresh();
                        updatedTokens.push(`${tokenDoc.name} (${scene.name})`);
                    } catch (err) {
                        notUpdatedTokens.push({
                            name: tokenDoc.name, scene: scene.name, reason: game.i18n.format("PF2E-TOKEN-PACK.FixTokensUpdateTokenError", { error: err.message })
                        });
                    }
                }
            }
        }
    }

  console.groupCollapsed("%cPathfinder 2E: Token Pack", "color: #4CAF50; font-weight: bold; font-size: 14px;");
  if (updatedActors.length) {
    console.groupCollapsed(`✅ ${game.i18n.format("PF2E-TOKEN-PACK.FixTokensUpdatedActors", { count: updatedActors.length })}`);
    updatedActors.forEach(name => console.log(name));
    console.groupEnd();
  }
  if (notUpdatedActors.length) {
    console.groupCollapsed(`❌ ${game.i18n.format("PF2E-TOKEN-PACK.FixTokensFailedActors", { count: notUpdatedActors.length })}`);
    notUpdatedActors.forEach(({ name, reason }) => console.log(`${name}: ${reason}`));
    console.groupEnd();
  }
  if (updatedTokens.length) {
    console.groupCollapsed(`✅ ${game.i18n.format("PF2E-TOKEN-PACK.FixTokensUpdatedTokens", { count: updatedTokens.length })}`);
    updatedTokens.forEach(name => console.log(name));
    console.groupEnd();
  }
  if (notUpdatedTokens.length) {
    console.groupCollapsed(`❌ ${game.i18n.format("PF2E-TOKEN-PACK.FixTokensFailedTokens", { count: notUpdatedTokens.length })}`);
    notUpdatedTokens.forEach(({ name, scene, reason }) => console.log(`${name} (${scene}): ${reason}`));
    console.groupEnd();
  }
  console.groupEnd();

  ui.notifications.info(game.i18n.localize("PF2E-TOKEN-PACK.FixTokensCheckComplete"));

  new Dialog({
    title: game.i18n.localize("PF2E-TOKEN-PACK.FixTokensReloadDialogTitle"),
    content: `<p>${game.i18n.localize("PF2E-TOKEN-PACK.FixTokensReloadDialogContent")}</p>`,
    buttons: {
      cancel: {
        icon: '<i class="fas fa-check"></i>',
        label: "Ок"
      }
    },
    default: "cancel"
  }).render(true);
}

class MyScriptDialog extends FormApplication {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "my-script-dialog",
      title: game.i18n.localize("PF2E-TOKEN-PACK.FixTokensDialogTitle"),
      template: null,
      width: 420,
      height: "auto",
      closeOnSubmit: true
    });
  }

  async render(force = true, options = {}) {
    await showMyScriptDialog();
    this.close();
  }
}

Hooks.once("init", () => {
  game.settings.registerMenu("pf2e-token-pack", "myScriptMenu", {
    name: game.i18n.localize("PF2E-TOKEN-PACK.FixTokensMenuName"),
    label: game.i18n.localize("PF2E-TOKEN-PACK.FixTokensMenuLabel"),
    hint: game.i18n.localize("PF2E-TOKEN-PACK.FixTokensMenuHint"),
    icon: "fas fa-play-circle",
    type: MyScriptDialog,
    restricted: true
  });
});
