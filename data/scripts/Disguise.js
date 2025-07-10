// ###################################################################################
// ##### ГЛАВНЫЕ ФУНКЦИИ ДЛЯ ПРИМЕНЕНИЯ МАСКИРОВКИ #####
// ###################################################################################

// Применяет ПОЛНЫЙ образ, полностью заменяя актера
async function applyFullDisguise(targetActor, sourceData, targetToken = null, sheet = null) {
    // Перед превращением в полную копию, сохраняем последнее рабочее состояние.
    if (targetActor.getFlag('pf2e-token-pack', 'active_mode') !== 'full') {
        const stateToSave = targetActor.toObject();
        // Удаляем свойство flags из сохраняемых данных, чтобы избежать циклической ссылки.
        delete stateToSave.flags;
        // Сохраняем "чистые" данные без флагов.
        await targetActor.setFlag('pf2e-token-pack', 'last_hybrid_state', stateToSave);
    }
    
    await targetActor.deleteEmbeddedDocuments("Item", [], {deleteAll: true});
    await targetActor.deleteEmbeddedDocuments("ActiveEffect", [], {deleteAll: true});

    const sourceClone = foundry.utils.deepClone(sourceData);
    const actorUpdate = { img: sourceClone.img, system: sourceClone.system, prototypeToken: sourceClone.prototypeToken };
    await targetActor.update(actorUpdate);
    
    if (sourceClone.system.attributes.hp) {
        await targetActor.update({'system.attributes.hp.value': sourceClone.system.attributes.hp.value});
    }
    
    if (sourceClone.items?.length) await targetActor.createEmbeddedDocuments("Item", sourceClone.items);
    if (sourceClone.effects?.length) await targetActor.createEmbeddedDocuments("ActiveEffect", sourceClone.effects);

    if (targetToken) {
        const tokenUpdate = {
            'flags.pf2e.linkToActorSize': foundry.utils.getProperty(sourceClone.prototypeToken, "flags.pf2e.linkToActorSize"),
            'flags.pf2e.autoscale': false, 'texture.scaleX': sourceClone.prototypeToken.texture.scaleX, 'texture.scaleY': sourceClone.prototypeToken.texture.scaleY,
        };
        if (sourceClone.prototypeToken.ring.enabled) {
            tokenUpdate.ring = sourceClone.prototypeToken.ring;
            tokenUpdate['texture.src'] = CONST.DEFAULT_TOKEN;
        } else {
            tokenUpdate['ring.enabled'] = false;
            tokenUpdate['texture.src'] = sourceClone.prototypeToken.texture.src;
        }
        await targetToken.update(tokenUpdate);
        if (targetToken.object) targetToken.object.refresh();
    }
    
    await targetActor.setFlag('pf2e-token-pack', 'active_mode', 'full');
    const message = game.i18n.format("Disguise.Applied", { name: sourceData.name });
    ui.notifications.info(message);
    if (sheet && sheet.rendered) sheet.render(true);
}

// Применяет ВИЗУАЛЬНЫЙ образ, восстанавливая гибридное состояние при необходимости
async function applyVisualDisguise(targetActor, visualData, targetToken = null, sheet = null) {
    const activeMode = targetActor.getFlag('pf2e-token-pack', 'active_mode');
    
    if (activeMode === 'full') {
        const lastHybridState = targetActor.getFlag('pf2e-token-pack', 'last_hybrid_state');
        if (lastHybridState) {
            await targetActor.deleteEmbeddedDocuments("Item", [], {deleteAll: true});
            await targetActor.deleteEmbeddedDocuments("ActiveEffect", [], {deleteAll:true});

            const stateClone = foundry.utils.deepClone(lastHybridState);
            
            if (stateClone.system?.traits?.size) {
                delete stateClone.system.traits.size;
            }

            const actorDataUpdate = { system: stateClone.system };
            await targetActor.update(actorDataUpdate);
            
            if (stateClone.items?.length) await targetActor.createEmbeddedDocuments("Item", stateClone.items);
            if (stateClone.effects?.length) await targetActor.createEmbeddedDocuments("ActiveEffect", stateClone.effects);

            if (stateClone.system.attributes.hp) {
                await targetActor.update({'system.attributes.hp.value': stateClone.system.attributes.hp.value});
            }
        }
    }
    
    const tokenUpdate = {
        'flags.pf2e.linkToActorSize': foundry.utils.getProperty(visualData.prototypeToken, "flags.pf2e.linkToActorSize"),
        'flags.pf2e.autoscale': false, 'texture.scaleX': visualData.prototypeToken.texture.scaleX, 'texture.scaleY': visualData.prototypeToken.texture.scaleY,
    };
    if (visualData.prototypeToken.ring.enabled) {
        tokenUpdate.ring = visualData.prototypeToken.ring;
        tokenUpdate['texture.src'] = CONST.DEFAULT_TOKEN;
    } else {
        tokenUpdate['ring.enabled'] = false;
        tokenUpdate['texture.src'] = visualData.prototypeToken.texture.src;
    }
    
    const actorVisualUpdate = {
        'img': visualData.img,
        'prototypeToken': visualData.prototypeToken,
        'system.traits.size': visualData.system.traits.size
    };

    if (targetToken) {
        await targetToken.update(tokenUpdate);
        if (targetToken.object) targetToken.object.refresh();
    }
    await targetActor.update(actorVisualUpdate);

    await targetActor.setFlag('pf2e-token-pack', 'active_mode', 'hybrid');
    ui.notifications.info(game.i18n.format("Disguise.AppliedSuccess", { name: visualData.name }));
    if (sheet && sheet.rendered) sheet.render(true);
}

// ###################################################################################
// ##### КЛАССЫ ПРИЛОЖЕНИЙ #####
// ###################################################################################

class DisguiseApp extends Application {
  constructor(actor, token, sheet) { super(); this.actor = actor; this.token = token; this.sheet = sheet; }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "disguise-app",
      title: game.i18n.localize("Disguise.App.CreateNewDisguise"),
      template: "modules/pf2e-token-pack/data/templates/Disguise.hbs",
      width: 400,
      height: "auto",
      resizable: true,
      classes: ["disguise-app-window"],
      dragDrop: [{ dragSelector: null, dropSelector: ".drop-target" }]
    });
  }

  async _onDrop(event) {
    const data = TextEditor.getDragEventData(event);
    let sourceActor;
    let sourceData;

    if (data.type === "Actor") {
        sourceActor = await fromUuid(data.uuid);
        if (!sourceActor) return;
        sourceData = sourceActor.toObject();
    } else if (data.type === "Token") {
        const sourceTokenDoc = await fromUuid(data.uuid);
        if (!sourceTokenDoc || !sourceTokenDoc.actor) return;
        sourceActor = sourceTokenDoc.actor;
        sourceData = sourceActor.toObject();
        sourceData.prototypeToken.texture.scaleX = sourceTokenDoc.texture.scaleX;
        sourceData.prototypeToken.texture.scaleY = sourceTokenDoc.texture.scaleY;
    } else {
        return;
    }
    
    if (!sourceActor || !sourceData) return;

    const isFullCopy = this.element.find('#save-mode-toggle').is(':checked');

    if (isFullCopy) {
        await applyFullDisguise(this.actor, sourceData, this.token, this.sheet);
    } else {
        await applyVisualDisguise(this.actor, sourceData, this.token, this.sheet);
    }

    this._promptToSaveDisguise(sourceActor, isFullCopy, sourceData);
    this.close();
  }

  async _promptToSaveDisguise(sourceActor, isFullCopy, dataForDisguise) {
    const dialogText = game.i18n.format(
        isFullCopy ? "Disguise.SaveFullCopyPrompt" : "Disguise.SaveHybridPrompt",
        { name: sourceActor.name }
    );
    
    const content = await renderTemplate("modules/pf2e-token-pack/data/templates/Disguise.hbs", {
        isPrompt: true,
        dialogText: dialogText,
        disguiseName: sourceActor.name
    });

    new Dialog({
        title: game.i18n.localize("Disguise.SaveNewPromptTitle"),
        content: content,
        buttons: { yes: { icon: '<i class="fas fa-save"></i>', label: game.i18n.localize("Disguise.SaveButtonLabel"), callback: async (html) => {
            const name = html.find('[name="disguiseName"]').val();
            if (!name) return ui.notifications.warn(game.i18n.localize("Disguise.NameRequiredWarning"));
            
            let dataToSave = dataForDisguise;
            if (!isFullCopy) { 
                dataToSave = { 
                    name: dataForDisguise.name, 
                    img: dataForDisguise.img, 
                    prototypeToken: dataForDisguise.prototypeToken,
                    system: { traits: { size: dataForDisguise.system.traits.size } } 
                }; 
            }
            dataToSave.name = name;
            let masterList = this.actor.getFlag('pf2e-token-pack', 'disguises') || [];
            const newId = foundry.utils.randomID();
            const flagKey = `data_${newId}`;
            masterList.push({ id: newId, name: name, type: isFullCopy ? 'full' : 'hybrid' });
            await this.actor.setFlag('pf2e-token-pack', flagKey, dataToSave);
            await this.actor.setFlag('pf2e-token-pack', 'disguises', masterList);
            ui.notifications.info(game.i18n.format("Disguise.SaveSuccess", { name: name }));
        }}, no: { icon: '<i class="fas fa-times"></i>', label: game.i18n.localize("Disguise.DoNotSaveButtonLabel") } },
        default: "yes"
    }).render(true);
  }
}

class PhaseManagerApp extends Application {
  constructor(actor, token, sheet) { super(); this.actor = actor; this.token = token; this.sheet = sheet; }
  
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "phase-manager-app",
      title: game.i18n.localize("Disguise.ManagerTitle"),
      template: "modules/pf2e-token-pack/data/templates/Disguise.hbs",
      width: 400,
      height: 500,
      resizable: true
    });
  }

  async getData() {
    let masterList = this.actor.getFlag('pf2e-token-pack', 'disguises') || [];
    const currentActorImg = this.actor.img;
    const visibleList = masterList.filter(d => !d.isOriginal);

    const partition = visibleList.reduce((acc, d) => {
        const type = d.type || 'hybrid';
        if (type === 'full') acc.fulls.push(d);
        else acc.hybrids.push(d);
        return acc;
    }, { fulls: [], hybrids: [] }); 

    partition.fulls.sort((a,b) => a.name.localeCompare(b.name));
    partition.hybrids.sort((a,b) => a.name.localeCompare(b.name));
    
    for (const disguise of [...partition.fulls, ...partition.hybrids]) {
        const flagKey = `data_${disguise.id}`;
        const data = this.actor.getFlag('pf2e-token-pack', flagKey);
        disguise.img = data?.img || CONST.DEFAULT_TOKEN;
        disguise.isActive = (disguise.img === currentActorImg);
    }
    
    partition.isManager = true; 
    return partition;
  }

  activateListeners(html) {
      super.activateListeners(html);
      html.on('click', '.apply-phase', this._onApplyPhase.bind(this));
      html.on('click', '.edit-phase', this._onEditPhase.bind(this));
      html.on('click', '.delete-phase', this._onDeletePhase.bind(this));
  }

  async _onApplyPhase(event) {
    const target = $(event.currentTarget).closest('.phase-item');
    const id = target.data('id');
    const type = target.data('type');
    const flagKey = id === 'original' ? 'data_original' : `data_${id}`;
    const sourceData = this.actor.getFlag('pf2e-token-pack', flagKey);
    if (!sourceData) return;
    if (type === 'full') { await applyFullDisguise(this.actor, sourceData, this.token, this.sheet); } 
    else { await applyVisualDisguise(this.actor, sourceData, this.token, this.sheet); }
    this.close();
  }

  async _onEditPhase(event) {
      const id = $(event.currentTarget).closest('.phase-item').data('id');
      const flagKey = `data_${id}`;
      const savedData = this.actor.getFlag('pf2e-token-pack', flagKey);
      if (!savedData) return;
      const tempActor = await Actor.create(savedData);
      if (!tempActor) return ui.notifications.error(game.i18n.localize("Disguise.ActorCreationError"));
      const tempSheet = tempActor.sheet;
      const originalClose = tempSheet.close.bind(tempSheet);
      tempSheet.close = async (options) => {
          const result = await originalClose(options);
          if (!options?.force) {
              const updatedSource = tempActor.toObject();
              let masterList = this.actor.getFlag('pf2e-token-pack', 'disguises') || [];
              let disguiseToEdit = masterList.find(d => d.id === id);
              if(disguiseToEdit) disguiseToEdit.name = updatedSource.name;
              await this.actor.setFlag('pf2e-token-pack', flagKey, updatedSource);
              await this.actor.setFlag('pf2e-token-pack', 'disguises', masterList);
              ui.notifications.info(game.i18n.format("Disguise.UpdateSuccess", { name: updatedSource.name }));
              setTimeout(async () => {
                  if (game.actors.get(tempActor.id)) await tempActor.delete();
                  this.render(true);
              }, 100);
          } else { if (game.actors.get(tempActor.id)) await tempActor.delete(); }
          return result;
      };
      tempSheet.render(true);
      this.close();
  }
  
  async _onDeletePhase(event) {
    const id = $(event.currentTarget).closest('.phase-item').data('id');
    let masterList = this.actor.getFlag('pf2e-token-pack', 'disguises') || [];
    masterList = masterList.filter(d => d.id !== id);
    const flagKey = `data_${id}`;
    await this.actor.setFlag('pf2e-token-pack', 'disguises', masterList);
    await this.actor.unsetFlag('pf2e-token-pack', flagKey);
    this.render(true);
  }
}

// ###################################################################################
// ##### ХУКИ FOUNDRY VTT #####
// ###################################################################################

async function openMainMenu(actor, token, sheet) {
    let masterList = actor.getFlag('pf2e-token-pack', 'disguises') || [];
    let isDisguiseActive = false;

    const allDisguises = masterList.filter(d => d.id !== 'original');
    for (const disguise of allDisguises) {
        const flagKey = `data_${disguise.id}`;
        const disguiseData = actor.getFlag('pf2e-token-pack', flagKey);
        if (disguiseData && actor.img === disguiseData.img) {
            isDisguiseActive = true;
            break; 
        }
    }

    const isFirstTime = !masterList.some(d => d.isOriginal);

    if (isFirstTime || !isDisguiseActive) {
        const originalSource = actor.toObject();
        delete originalSource.flags;
        
        const protoTokenData = foundry.utils.deepClone(originalSource.prototypeToken);

        if (token) {
            protoTokenData.ring = token.ring;
            protoTokenData.texture.scaleX = token.texture.scaleX;
            protoTokenData.texture.scaleY = token.texture.scaleY;
        }
        
        const newOriginalVisualData = {
            name: originalSource.name,
            img: originalSource.img,
            prototypeToken: protoTokenData,
            system: { traits: { size: originalSource.system.traits.size } }
        };
        
        originalSource.prototypeToken = protoTokenData;

        await actor.setFlag('pf2e-token-pack', 'data_original', originalSource);
        await actor.setFlag('pf2e-token-pack', 'data_original_visuals', newOriginalVisualData);

        if (isFirstTime) {
            const newList = [{ id: 'original', name: game.i18n.localize("Disguise.OriginalAppearance"), isOriginal: true, type: 'hybrid' }, ...masterList];
            await actor.setFlag('pf2e-token-pack', 'disguises', newList);
            await actor.setFlag('pf2e-token-pack', 'active_mode', 'hybrid');
            
            ui.notifications.info(game.i18n.localize("Disguise.OriginalAppearanceSaved"));
        } else {
            console.log(`${game.i18n.localize("Disguise.MaskPhaseTitle")} | ${game.i18n.localize("Disguise.OriginalAppearanceUpdated")}`);
        }
    }

    new Dialog({
        title: game.i18n.localize("Disguise.MaskPhaseTitle"), content: `<p>${game.i18n.localize("Disguise.ChooseActionPrompt")}</p>`,
        buttons: {
            disguise: { icon: '<i class="fas fa-user-plus"></i>', label: game.i18n.localize("Disguise.NewDisguiseButton"), callback: () => new DisguiseApp(actor, token, sheet).render(true) },
            phases: { icon: '<i class="fas fa-layer-group"></i>', label: game.i18n.localize("Disguise.SavedDisguisesButton"), callback: () => new PhaseManagerApp(actor, token, sheet).render(true) },
            reset: { icon: '<i class="fas fa-undo"></i>', label: game.i18n.localize("Disguise.ResetToOriginalButton"),
                callback: async () => {
                    const originalVisualData = actor.getFlag('pf2e-token-pack', 'data_original_visuals');
                    if (originalVisualData) await applyVisualDisguise(actor, originalVisualData, token, sheet);
                    else ui.notifications.warn(game.i18n.localize("Disguise.OriginalNotFoundWarning"));
                }
            }
        }
    }, { width: 600, classes: ["dialog", "mask-phase-dialog"] }).render(true);
}

Hooks.on("getActorSheetHeaderButtons", (app, buttons) => {
  if (!game.user.isGM || app.object?.type !== 'npc') {
    return;
  }
  buttons.unshift({
    label: game.i18n.localize("Disguise.MaskPhaseTitle"),
    class: "mask-phase",
    icon: "fas fa-user-secret", 
    onclick: () => openMainMenu(app.object, app.token, app)
  });
});

Hooks.on("renderTokenHUD", (hud, html) => {
    const token = hud.object;
    if (!game.user.isGM || token.actor?.type !== 'npc') {
        return;
    }
    const button = $(`<div class="control-icon" title="Маск-Фаза"><i class="fas fa-user-secret"></i></div>`);
    button.on('click', (event) => {
        event.stopPropagation();
        openMainMenu(token.actor, hud.object.document, token.actor.sheet);
    });
    $(html).find('.col.right').prepend(button);
});