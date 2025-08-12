// ###################################################################################
// #####                            DISGUISE SCRIPT                            #####
// #####                  VERSION: USER STABLE BASE + HUD FEATURES MERGED      #####
// ###################################################################################

// ===================================================================================
// === MAIN DISGUISE APPLICATION FUNCTIONS
// ===================================================================================

async function applyFullDisguise(targetActor, sourceData, targetToken = null, sheet = null, options = { applySize: true }) {
    if (targetActor.getFlag('pf2e-token-pack', 'active_mode') !== 'full') {
        const stateToSave = targetActor.toObject();
        delete stateToSave.flags;
        await targetActor.setFlag('pf2e-token-pack', 'last_hybrid_state', stateToSave);
    }
    
    await targetActor.deleteEmbeddedDocuments("Item", [], {deleteAll: true});
    await targetActor.deleteEmbeddedDocuments("ActiveEffect", [], {deleteAll: true});

    const sourceClone = foundry.utils.deepClone(sourceData);

    if (!options.applySize) {
        const originalVisuals = targetActor.getFlag('pf2e-token-pack', 'data_original_visuals');
        if (originalVisuals) {
            const originalSize = originalVisuals.system?.traits?.size;
            if (originalSize && sourceClone.system?.traits) {
                sourceClone.system.traits.size = originalSize;
            }
        }
    }
    
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
            'flags.pf2e.autoscale': false, 
            'texture.scaleX': sourceClone.prototypeToken.texture.scaleX, 
            'texture.scaleY': sourceClone.prototypeToken.texture.scaleY,
        };

        if (sourceClone.prototypeToken.ring.enabled) {
            tokenUpdate.ring = sourceClone.prototypeToken.ring;
            tokenUpdate['texture.src'] = sourceClone.img;
        } else {
            tokenUpdate['ring.enabled'] = false;
            tokenUpdate['texture.src'] = sourceClone.prototypeToken.texture.src;
        }
        await targetToken.update(tokenUpdate);
        if (targetToken.object) targetToken.object.refresh();
    }
    
    if (game.combat) {
        const combatant = game.combat.combatants.find(c => c.actor.id === targetActor.id);
        if (combatant) {
            await combatant.update({ img: targetActor.img, name: targetActor.name });
            ui.combat.render();
        }
    }

    await targetActor.setFlag('pf2e-token-pack', 'active_mode', 'full');
    // СТРОКА УДАЛЕНА: await targetActor.setFlag('pf2e-token-pack', 'isDisguised', true);
    const message = game.i18n.format("Disguise.Applied", { name: sourceData.name });
    ui.notifications.info(message);
    if (sheet && sheet.rendered) sheet.render(true);
}

async function applyVisualDisguise(targetActor, visualData, targetToken = null, sheet = null, options = { applySize: true }) {
    const activeMode = targetActor.getFlag('pf2e-token-pack', 'active_mode');
    
    if (activeMode === 'full') {
        const lastHybridState = targetActor.getFlag('pf2e-token-pack', 'last_hybrid_state');
        if (lastHybridState) {
            await targetActor.deleteEmbeddedDocuments("Item", [], {deleteAll: true});
            await targetActor.deleteEmbeddedDocuments("ActiveEffect", [], {deleteAll:true});

            const stateClone = foundry.utils.deepClone(lastHybridState);
            if (stateClone.system?.traits?.size) delete stateClone.system.traits.size;

            const actorDataUpdate = { system: stateClone.system, name: stateClone.name };
            await targetActor.update(actorDataUpdate);
            
            if (stateClone.items?.length) await targetActor.createEmbeddedDocuments("Item", stateClone.items);
            if (stateClone.effects?.length) await targetActor.createEmbeddedDocuments("ActiveEffect", stateClone.effects);

            if (stateClone.system.attributes.hp) {
                await targetActor.update({'system.attributes.hp.value': stateClone.system.attributes.hp.value});
            }
        }
    }
    
    const tokenUpdate = {
        'flags.pf2e.autoscale': false, 
        'texture.scaleX': visualData.prototypeToken.texture.scaleX, 
        'texture.scaleY': visualData.prototypeToken.texture.scaleY,
    };

    if (visualData.prototypeToken.ring.enabled) {
        tokenUpdate.ring = visualData.prototypeToken.ring;
        tokenUpdate['texture.src'] = visualData.img;
    } else {
        tokenUpdate['ring.enabled'] = false;
        tokenUpdate['texture.src'] = visualData.prototypeToken.texture.src;
    }
    
    const actorVisualUpdate = {
        'img': visualData.img,
        'prototypeToken': visualData.prototypeToken
    };

    if (options.applySize) {
        const sourceSizeValue = visualData.system?.traits?.size?.value;
        if (targetActor.type === 'npc') {
             if (visualData.system?.traits?.size) {
                actorVisualUpdate['system.traits.size'] = visualData.system.traits.size;
             }
        } 
        
        if (targetToken) {
            const sizeMap = { tiny: 0.5, sm: 1, med: 1, lg: 2, huge: 3, grg: 4 };
            const newDimension = sizeMap[sourceSizeValue];

            if (newDimension !== undefined) {
                tokenUpdate.height = newDimension;
                tokenUpdate.width = newDimension;
                tokenUpdate['flags.pf2e.linkToActorSize'] = false;
            } else {
                tokenUpdate.height = visualData.prototypeToken.height;
                tokenUpdate.width = visualData.prototypeToken.width;
                tokenUpdate['flags.pf2e.linkToActorSize'] = true;
            }
        }
    }

    if (targetToken) {
        await targetToken.update(tokenUpdate);
        if (targetToken.object) targetToken.object.refresh();
    }
    await targetActor.update(actorVisualUpdate);

    if (game.combat) {
        const combatant = game.combat.combatants.find(c => c.actor.id === targetActor.id);
        if (combatant) {
            const combatantImg = visualData.prototypeToken.ring.enabled ? visualData.img : visualData.prototypeToken.texture.src;
            await combatant.update({ img: combatantImg, name: targetActor.name });
            ui.combat.render();
        }
    }

    await targetActor.setFlag('pf2e-token-pack', 'active_mode', 'hybrid');
    ui.notifications.info(game.i18n.format("Disguise.AppliedSuccess", { name: visualData.name }));
    if (sheet && sheet.rendered) sheet.render(true);
}

// ===================================================================================
// === APPLICATION CLASSES
// ===================================================================================

class DisguiseApp extends Application {
  constructor(actor, token, sheet, options = {}) { 
      super(); this.actor = actor; this.token = token; this.sheet = sheet; this.isHybridOnly = options.isHybridOnly ?? false;
  }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "disguise-app", title: game.i18n.localize("Disguise.App.CreateNewDisguise"),
      template: "modules/pf2e-token-pack/data/templates/Disguise.hbs",
      width: 400, height: "auto", resizable: true, classes: ["disguise-app-window"],
      dragDrop: [{ dragSelector: null, dropSelector: ".drop-target" }]
    });
  }
  getData() { return { isHybridOnly: this.isHybridOnly }; }
  async _onDrop(event) {
    const data = TextEditor.getDragEventData(event); let sourceActor, sourceData;
    if (data.type === "Actor") { sourceActor = await fromUuid(data.uuid); if (!sourceActor) return; sourceData = sourceActor.toObject(); }
    else if (data.type === "Token") {
        const sourceTokenDoc = await fromUuid(data.uuid); if (!sourceTokenDoc || !sourceTokenDoc.actor) return;
        sourceActor = sourceTokenDoc.actor; sourceData = sourceActor.toObject();
        sourceData.prototypeToken.texture.scaleX = sourceTokenDoc.texture.scaleX;
        sourceData.prototypeToken.texture.scaleY = sourceTokenDoc.texture.scaleY;
        sourceData.prototypeToken.texture.src = sourceTokenDoc.texture.src;
        sourceData.prototypeToken.ring = sourceTokenDoc.ring;
    } else { return; }
    if (!sourceActor || !sourceData) return;
    const isFullCopy = !this.isHybridOnly && this.element.find('#save-mode-toggle').is(':checked');
    const applySize = this.element.find('#apply-size-toggle').is(':checked');

    await requestDisguiseChange({
        actor: this.actor,
        token: this.token,
        sheet: this.sheet,
        sourceType: 'actor',
        sourceId: sourceActor.uuid, // Отправляем UUID актера, которого перетащили
        type: isFullCopy ? 'full' : 'hybrid',
        options: { applySize }
    });
    if(game.user.isGM) this._promptToSaveDisguise(sourceActor, isFullCopy, sourceData, { applySize });
    this.close();
  }
  async _promptToSaveDisguise(sourceActor, isFullCopy, dataForDisguise, options = { applySize: true }) {
    const dialogText = game.i18n.format(isFullCopy ? "Disguise.SaveFullCopyPrompt" : "Disguise.SaveHybridPrompt", { name: sourceActor.name });
    const content = await renderTemplate("modules/pf2e-token-pack/data/templates/Disguise.hbs", { isPrompt: true, dialogText: dialogText, disguiseName: sourceActor.name });
    new Dialog({
        title: game.i18n.localize("Disguise.SaveNewPromptTitle"), content: content,
        buttons: { yes: { icon: '<i class="fas fa-save"></i>', label: game.i18n.localize("Disguise.SaveButtonLabel"), callback: async (html) => {
            const name = html.find('[name="disguiseName"]').val(); if (!name) return ui.notifications.warn(game.i18n.localize("Disguise.NameRequiredWarning"));
            let dataToSave = dataForDisguise;
            if (!isFullCopy) { 
                const visualDataToSave = { 
                    name: dataForDisguise.name, 
                    img: dataForDisguise.img, 
                    prototypeToken: dataForDisguise.prototypeToken,
                    system: { }
                };
                if (options.applySize) {
                    const size = dataForDisguise.system?.traits?.size;
                    if(size) {
                        visualDataToSave.system.traits = { size: size };
                    }
                }
                dataToSave = visualDataToSave;
            }
            dataToSave.name = name; let masterList = this.actor.getFlag('pf2e-token-pack', 'disguises') || [];
            const newId = foundry.utils.randomID(); const flagKey = `data_${newId}`;
            masterList.push({ id: newId, name: name, type: isFullCopy ? 'full' : 'hybrid', shouldApplySize: options.applySize });
            await this.actor.setFlag('pf2e-token-pack', flagKey, dataToSave);
            await this.actor.setFlag('pf2e-token-pack', 'disguises', masterList);
            ui.notifications.info(game.i18n.format("Disguise.SaveSuccess", { name: name }));
        }}, no: { icon: '<i class="fas fa-times"></i>', label: game.i18n.localize("Disguise.DoNotSaveButtonLabel") } },
        default: "yes"
    }).render(true);
  }
}
class PhaseManagerApp extends Application {
  constructor(actor, token, sheet, options = {}) { super(); this.actor = actor; this.token = token; this.sheet = sheet; this.isHybridOnly = options.isHybridOnly ?? false; }
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "phase-manager-app", title: game.i18n.localize("Disguise.ManagerTitle"),
      template: "modules/pf2e-token-pack/data/templates/Disguise.hbs",
      width: 400, height: 500, resizable: true
    });
  }
  async getData() {
    let masterList = this.actor.getFlag('pf2e-token-pack', 'disguises') || [];
    const visibleList = masterList.filter(d => !d.isOriginal);
    const partition = visibleList.reduce((acc, d) => {
        const type = d.type || 'hybrid';
        if (this.isHybridOnly && type === 'full') return acc;
        if (type === 'full') acc.fulls.push(d); else acc.hybrids.push(d); return acc;
    }, { fulls: [], hybrids: [] });
    partition.fulls.sort((a,b) => a.name.localeCompare(b.name)); partition.hybrids.sort((a,b) => a.name.localeCompare(b.name));
    for (const disguise of [...partition.fulls, ...partition.hybrids]) {
        const flagKey = `data_${disguise.id}`; const data = this.actor.getFlag('pf2e-token-pack', flagKey);
        disguise.img = data?.img || CONST.DEFAULT_TOKEN;
        disguise.isActive = (disguise.img === this.actor.img);
    }
    partition.isManager = true; return partition;
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
    const applySize = target.data('apply-size') ?? true;
    
    const flagKey = `data_${id}`; 
    const sourceData = this.actor.getFlag('pf2e-token-pack', flagKey);
    if (!sourceData) return;
    
    await requestDisguiseChange({
        actor: this.actor,
        token: this.token,
        sheet: this.sheet,
        sourceType: 'flag',
        sourceId: id, // Отправляем ID сохраненной маскировки
        type: type,
        options: { applySize }
    });
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

// ===================================================================================
// === CORE LOGIC & FOUNDRY VTT HOOKS
// ===================================================================================

async function saveOriginalState(actor, token) {
    let masterList = actor.getFlag('pf2e-token-pack', 'disguises') || [];
    if (masterList.some(d => d.isOriginal)) return;

    const originalSource = actor.toObject();
    delete originalSource.flags['pf2e-token-pack'];
    
    const protoTokenData = foundry.utils.deepClone(originalSource.prototypeToken);

    if (token) {
        protoTokenData.ring = token.ring;
        protoTokenData.texture.scaleX = token.texture.scaleX;
        protoTokenData.texture.scaleY = token.texture.scaleY;
        protoTokenData.texture.src = token.texture.src; 
        protoTokenData.height = token.height;
        protoTokenData.width = token.width;
    }
    
    const visualSystemData = {};
    const size = originalSource.system?.traits?.size;
    if (size) {
        visualSystemData.traits = { size: size };
    }

    const newOriginalVisualData = {
        name: originalSource.name,
        img: originalSource.img,
        prototypeToken: protoTokenData,
        system: visualSystemData
    };
    
    originalSource.prototypeToken = protoTokenData;

    await actor.setFlag('pf2e-token-pack', 'data_original', originalSource);
    await actor.setFlag('pf2e-token-pack', 'data_original_visuals', newOriginalVisualData);

    let newList = masterList.filter(d => !d.isOriginal);
    newList.unshift({ id: 'original', name: originalSource.name, isOriginal: true, type: 'hybrid', shouldApplySize: true });
    await actor.setFlag('pf2e-token-pack', 'disguises', newList);
    await actor.setFlag('pf2e-token-pack', 'active_mode', 'hybrid');
    // СТРОКА УДАЛЕНА: await actor.setFlag('pf2e-token-pack', 'isDisguised', false);
    ui.notifications.info(game.i18n.format("Disguise.OriginalAppearanceSaved", {name: originalSource.name}));
}

async function openDisguiseMenu(actor, token, sheet) {
    await saveOriginalState(actor, token);

    const highlightDisabled = actor.getFlag('pf2e-token-pack', 'highlightDisabled') ?? false;

    // --- НОВАЯ ЛОГИКА ---
    // 1. Сначала создаем набор кнопок, которые видят все (игроки и ГМ)
    const commonButtons = {
        phases: {
            icon: '<i class="fas fa-layer-group"></i>',
            label: game.i18n.localize("Disguise.SavedDisguisesButton"),
            callback: () => new PhaseManagerApp(actor, token, sheet, {isHybridOnly: actor.type !== 'npc'}).render(true)
        },
        rename: {
            icon: '<i class="fas fa-i-cursor"></i>',
            label: game.i18n.localize("Disguise.RenameButtonLabel"),
            callback: () => {
                const originalVisuals = actor.getFlag('pf2e-token-pack', 'data_original_visuals');
                const defaultName = originalVisuals ? originalVisuals.name : actor.name;
                const currentCustomName = actor.getFlag('pf2e-token-pack', 'originalDisplayName') || "";
                const prompt1 = game.i18n.format("Disguise.RenameDialogPrompt1", { name: defaultName });
                const prompt2 = game.i18n.localize("Disguise.RenameDialogPrompt2");
                const dialogContent = `<p>${prompt1}</p><p>${prompt2}</p><form><div class="form-group"><input type="text" name="newName" value="${currentCustomName}"/></form></div>`;
                new Dialog({
                    title: game.i18n.localize("Disguise.RenameDialogTitle"),
                    content: dialogContent,
                    buttons: { save: { icon: '<i class="fas fa-save"></i>', label: game.i18n.localize("Disguise.RenameSaveButton"), callback: async (html) => {
                        const newName = html.find('input[name="newName"]').val();
                        await actor.setFlag('pf2e-token-pack', 'originalDisplayName', newName);
                        ui.notifications.info(game.i18n.localize("Disguise.RenameNotificationSuccess"));
                    }}},
                    default: "save",
                    render: (html) => html.find('input[name="newName"]').focus()
                }).render(true);
            }
        },
        highlight: {
            icon: `<i class="fas fa-${highlightDisabled ? 'eye' : 'eye-slash'}"></i>`,
            label: highlightDisabled ? game.i18n.localize("Disguise.EnableHighlight") : game.i18n.localize("Disguise.DisableHighlight"),
            callback: async () => {
                await actor.setFlag('pf2e-token-pack', 'highlightDisabled', !highlightDisabled);
                canvas.tokens.placeables.filter(t => t.document.actorId === actor.id).forEach(t => t.draw());
                const messageKey = !highlightDisabled ? "Disguise.HighlightDisabledFor" : "Disguise.HighlightEnabledFor";
                ui.notifications.info(game.i18n.format(messageKey, { name: actor.name }));
            }
        },
        reset: {
            icon: '<i class="fas fa-undo"></i>',
            label: game.i18n.localize("Disguise.ResetToOriginalButton"),
            callback: async () => {
                const originalVisualData = actor.getFlag('pf2e-token-pack', 'data_original_visuals');
                if (originalVisualData) await requestDisguiseChange({ actor, token, sheet, sourceType: 'flag', sourceId: 'original', type: 'hybrid', options: { applySize: true }});
                else ui.notifications.warn(game.i18n.localize("Disguise.OriginalNotFoundWarning"));
            }
        }
    };

    // 2. Если текущий пользователь - Мастер, добавляем кнопку "Создать новый образ" в начало
    let finalButtons = commonButtons;
    if (game.user.isGM) {
        finalButtons = {
            disguise: {
                icon: '<i class="fas fa-user-plus"></i>',
                label: game.i18n.localize("Disguise.NewDisguiseButton"),
                callback: () => new DisguiseApp(actor, token, sheet, {isHybridOnly: actor.type !== 'npc'}).render(true)
            },
            ...commonButtons // Добавляем остальные кнопки после
        };
    }

    // 3. Создаем диалоговое окно с финальным набором кнопок
    
    // Определяем ширину окна в зависимости от роли
    const dialogWidth = game.user.isGM ? 700 : 550; // Шире для ГМ (4+ кнопки), уже для игрока (3 кнопки)

    new Dialog({
        title: game.i18n.localize("Disguise.MaskPhaseTitle"),
        content: `<p>${game.i18n.localize("Disguise.ChooseActionPrompt")}</p>`,
        buttons: finalButtons
    }, { 
        width: dialogWidth, // Используем нашу динамическую ширину
        classes: ["dialog", "mask-phase-dialog"] 
    }).render(true);
}

Hooks.on("getActorSheetHeaderButtons", (app, buttons) => {
  const actor = app.object;
  if (!actor || (!game.user.isGM && !actor.isOwner)) return;
  
  buttons.unshift({
    label: "", 
    title: game.i18n.localize("Disguise.MaskPhaseTitle"),
    class: "mask-phase", 
    icon: "fas fa-user-secret", 
    onclick: () => openDisguiseMenu(app.object, app.token, app)
  });
});

Hooks.on("renderTokenHUD", (hud, html, data) => {
    const tokenDoc = hud.object.document;
    const actor = tokenDoc.actor;
    if (!actor || (!game.user.isGM && !actor.isOwner)) return;
    
    const hudPosition = game.settings.get('pf2e-token-pack', 'hudPosition') || 'top-right';
    const [vertical, horizontal] = hudPosition.split('-');

    const targetColumnClass = horizontal === 'left' ? '.col.left' : '.col.right';
    const targetColumn = $(html).find(targetColumnClass);
    
    if (!targetColumn.length) return;

    const button = $(`<div class="control-icon" title="${game.i18n.localize("Disguise.MaskPhaseTitle")}"><i class="fas fa-user-secret"></i></div>`);
    
    if (vertical === 'top') {
        targetColumn.prepend(button);
    } else {
        targetColumn.append(button);
    }
    
    let menu = null;
    let hideTimeout;
    let hoverDisabled = false;

    button.on('click', (e) => {
        e.stopPropagation();
        if (menu) {
            menu.remove();
            menu = null;
        }
        
        hoverDisabled = true;
        setTimeout(() => { hoverDisabled = false; }, 500);

        openDisguiseMenu(actor, tokenDoc, actor.sheet);
    });

    button.on('mouseenter', async () => {
        if (hoverDisabled) return;

        const masterList = actor.getFlag('pf2e-token-pack', 'disguises') || [];
        const hasCustomDisguises = masterList.some(d => !d.isOriginal);
        if (!hasCustomDisguises) return;

        if (menu) return;
        clearTimeout(hideTimeout);
        
        menu = $('<div class="disguise-hud-menu"></div>');

        const originalVisuals = actor.getFlag('pf2e-token-pack', 'data_original_visuals');
        const hybrids = [];
        const fulls = [];

        for (const disguise of masterList.filter(d => !d.isOriginal)) {
            if (disguise.type === 'full') {
                fulls.push(disguise);
            } else {
                hybrids.push(disguise);
            }
        }
        
        const createMenuItem = (disguise, isOriginal = false) => {
            const flagKey = `data_${disguise.id}`;
            const disguiseData = isOriginal ? originalVisuals : actor.getFlag('pf2e-token-pack', flagKey);
            if (!disguiseData) return null;

            let displayName;
            if (isOriginal) {
                const customName = actor.getFlag('pf2e-token-pack', 'originalDisplayName');
                const nameToShow = customName || (originalVisuals ? originalVisuals.name : "Оригинал");
                displayName = game.i18n.format("Disguise.OriginalActor", { name: nameToShow });
            } else {
                displayName = disguiseData.name;
            }
            
            const item = $(`<div class="disguise-hud-item" data-id="${disguise.id}" data-type="${disguise.type}"><img src="${disguiseData.img}"/><span>${displayName}</span></div>`);
            
            item.on('click', async (e) => {
                e.stopPropagation();
                if (menu) { menu.remove(); menu = null; }

                const applySize = isOriginal ? true : (disguise.shouldApplySize ?? true);
                let requestType = 'hybrid';
                if (!isOriginal && disguise.type === 'full' && actor.type === 'npc') {
                    requestType = 'full';
                }
                
                await requestDisguiseChange({
                    actor: actor,
                    token: tokenDoc,
                    sheet: actor.sheet,
                    sourceType: 'flag',
                    sourceId: disguise.id, // Отправляем ID маскировки из меню (напр. 'original')
                    type: requestType,
                    options: { applySize }
                });

                hud.clear();
            });
            return item;
        };
        
        if (originalVisuals) {
            menu.append(createMenuItem({ id: 'original' }, true));
        }

        if (hybrids.length > 0) {
            menu.append($(`<div class="disguise-hud-header">${game.i18n.localize("Disguise.HybridSkinsHeader")}</div>`));
            for (const disguise of hybrids) {
                menu.append(createMenuItem(disguise));
            }
        }

        if (fulls.length > 0) {
            menu.append($(`<div class="disguise-hud-header">${game.i18n.localize("Disguise.FullCopiesHeader")}</div>`));
            for (const disguise of fulls) {
                menu.append(createMenuItem(disguise));
            }
        }

        // --- ИЗМЕНЕННЫЙ БЛОК ПОЗИЦИОНИРОВАНИЯ МЕНЮ ---
        const buttonRect = button[0].getBoundingClientRect();
        $('body').append(menu);

        // Получаем настройку горизонтального положения
        const currentHudPosition = game.settings.get('pf2e-token-pack', 'hudPosition') || 'top-right';
        const [, currentHorizontal] = currentHudPosition.split('-');

        // Вычисляем позицию 'left' в зависимости от положения иконки
        const menuLeftPosition = currentHorizontal === 'left' 
            ? `${buttonRect.left - menu.outerWidth() - 5}px`  // Слева от иконки
            : `${buttonRect.right + 5}px`;                      // Справа от иконки

        menu.css({
            position: 'fixed',
            top: `${buttonRect.top}px`,
            left: menuLeftPosition,
            zIndex: 101
        });
        // --- КОНЕЦ ИЗМЕНЕННОГО БЛОКА ---

        menu.on('mouseenter', () => clearTimeout(hideTimeout));
        menu.on('mouseleave', () => {
            menu.remove();
            menu = null;
        });
    });

    button.on('mouseleave', () => {
        hideTimeout = setTimeout(() => {
            if (menu) {
                menu.remove();
                menu = null;
            }
        }, 200);
    });
});

Hooks.on('init', () => {
    const styles = `
        <style id="disguise-hud-styles">
            .disguise-hud-menu {
                background: rgba(0, 0, 0, 0.85);
                border: 1px solid #f0f0e0;
                border-radius: 5px;
                padding: 5px;
                width: 220px;
                max-height: 250px;
                display: flex;
                flex-direction: column;
                gap: 4px;
                overflow-y: auto;
            }
             .disguise-hud-header {
                color: #c9c7b8;
                font-size: 12px;
                font-weight: bold;
                text-align: center;
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                margin: 5px 0 3px 0;
                padding-bottom: 2px;
            }
            .disguise-hud-item {
                display: flex;
                align-items: center;
                padding: 4px;
                cursor: pointer;
                border-radius: 3px;
            }
            .disguise-hud-item:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            .disguise-hud-item img {
                width: 36px;
                height: 36px;
                margin-right: 8px;
                border: none;
                object-fit: cover;
                flex-shrink: 0;
            }
            .disguise-hud-item span {
                color: #f0f0e0;
                font-size: 14px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        </style>
    `;
    if (!document.getElementById('disguise-hud-styles')) {
        document.head.insertAdjacentHTML('beforeend', styles);
    }
});

Hooks.on("refreshToken", (token) => {
    const actor = token.document?.actor;
    if (!actor) return;

    // Новая проверка прав
    if (!game.user.isGM && !actor.isOwner) {
        const oldMarker = token.getChildByName("disguiseMarker");
        if (oldMarker) oldMarker.destroy();
        return;
    }

    const oldMarker = token.getChildByName("disguiseMarker");
    if (oldMarker) {
        oldMarker.destroy();
    }

    const masterList = actor.getFlag('pf2e-token-pack', 'disguises') || [];
    const hasCustomDisguises = masterList.some(d => !d.isOriginal);
    const highlightDisabled = actor.getFlag('pf2e-token-pack', 'highlightDisabled') ?? false;

    if (hasCustomDisguises && !highlightDisabled) {
        const marker = new PIXI.Graphics();
        marker.name = "disguiseMarker";
        
        // Получаем цвет из настроек модуля
        const colorSetting = game.settings.get('pf2e-token-pack', 'highlightColor') || "#9400D3";
        // Преобразуем строку HEX (напр. "#FFFFFF") в число (напр. 0xFFFFFF)
        const borderColor = parseInt(colorSetting.replace("#", ""), 16);
        
        const borderWidth = 4;

        marker.lineStyle(borderWidth, borderColor, 1, 0)
              .drawRoundedRect(
                  -borderWidth / 2, 
                  -borderWidth / 2, 
                  token.w + borderWidth, 
                  token.h + borderWidth, 
                  10
              );
        
        marker.zIndex = 1000;
        token.addChild(marker);
    }
});

Hooks.on('init', () => {
    // Настройка для выбора цвета подсветки
    game.settings.register('pf2e-token-pack', 'highlightColor', {
        name: game.i18n.localize("Disguise.HighlightColorName"),
        hint: game.i18n.localize("Disguise.HighlightColorHint"),
        scope: 'world',
        config: true,
        type: String,
        default: "#9400D3",
        onChange: value => {
            if (canvas?.ready) {
                canvas.tokens.placeables.forEach(token => token.draw());
            }
        }
    });

    // ИЗМЕНЕНО: Настройка для выбора расположения иконки на HUD с 4 вариантами
    game.settings.register('pf2e-token-pack', 'hudPosition', {
        name: game.i18n.localize("Disguise.HUDPositionName"), // "Расположение иконки на HUD"
        hint: game.i18n.localize("Disguise.HUDPositionHint"), // "Выберите, где будет отображаться иконка модуля маскировки."
        scope: 'world',
        config: true,
        type: String,
        default: "top-right", // Значение по умолчанию
        choices: {
            "top-right":    game.i18n.localize("Disguise.TopRight"),    // "Справа сверху"
            "bottom-right": game.i18n.localize("Disguise.BottomRight"), // "Справа снизу"
            "top-left":     game.i18n.localize("Disguise.TopLeft"),     // "Слева сверху"
            "bottom-left":  game.i18n.localize("Disguise.BottomLeft")   // "Слева снизу"
        }
    });
});

Hooks.on("renderSettingsConfig", (app, html) => {
    const colorInput = $(html).find('[name="pf2e-token-pack.highlightColor"]');
    if (!colorInput.length) return;

    // Меняем тип текстового поля на поле выбора цвета
    colorInput.attr('type', 'color');

    // Добавляем обработчик, чтобы цвет на токенах менялся сразу при выборе в круге
    colorInput.on('input', () => {
        if (canvas?.ready) {
            canvas.tokens.placeables.forEach(token => token.draw());
        }
    });
});

// ===================================================================================
// === АВТОМАТИЧЕСКАЯ СИНХРОНИЗАЦИЯ ТРЕКЕРА БОЯ (ДЛЯ ИГРОКОВ) - v3 (РОБАСТНЫЙ)
// ===================================================================================
Hooks.on('init', () => {
    game.socket.on('module.pf2e-token-pack-combatsync', (data) => {
        if (game.user.isGM && game.combat) {
            const combatant = game.combat.combatants.find(c => c.actorId === data.actorId);
            // Получаем самые свежие данные актера с сервера
            const actor = game.actors.get(data.actorId);

            if (combatant && actor) {
                console.log(`Disguise Sync v3 | GM получил сигнал для ${actor.name}. Обновляю трекер.`);

                // Определяем правильную иконку на основе свежих данных актера
                const latestImg = actor.prototypeToken.ring.enabled ? actor.img : actor.prototypeToken.texture.src;

                combatant.update({ img: latestImg, name: actor.name }).then(() => {
                    ui.combat.render();
                });
            }
        }
    });
});

// ===================================================================================
// === ДИСПЕТЧЕР И ОБРАБОТЧИК СОКЕТОВ (ЧИСТАЯ ВЕРСИЯ)
// ===================================================================================

async function requestDisguiseChange(request) {
    let sourceData;
    if (request.sourceType === 'actor') {
        const sourceActor = await fromUuid(request.sourceId);
        if (sourceActor) sourceData = sourceActor.toObject();
    } else if (request.sourceType === 'flag') {
        sourceData = request.actor.getFlag('pf2e-token-pack', `data_${request.sourceId}`);
    }

    if (!sourceData) return ui.notifications.error("Не удалось найти данные для маскировки.");

    if (game.user.isGM) {
        if (request.type === 'full') {
            await applyFullDisguise(request.actor, sourceData, request.token, request.sheet, request.options);
        } else {
            await applyVisualDisguise(request.actor, sourceData, request.token, request.sheet, request.options);
        }
    } else {
        ui.notifications.info("Запрос на смену облика отправлен Мастеру...");
        game.socket.emit('module.pf2e-token-pack', {
            actorId: request.actor.id,
            tokenId: request.token?.id,
            sourceData: sourceData,
            type: request.type,
            options: request.options
        });
    }
}

Hooks.on('init', () => {
    game.socket.on('module.pf2e-token-pack', async (data) => {
        if (game.user.isGM) {
            const targetActor = game.actors.get(data.actorId);
            if (!targetActor) return;

            const scene = game.scenes.active;
            const targetToken = data.tokenId ? scene?.tokens.get(data.tokenId) : null;
            const sourceData = data.sourceData;

            if (data.type === 'full') {
                await applyFullDisguise(targetActor, sourceData, targetToken, targetActor.sheet, data.options);
            } else {
                await applyVisualDisguise(targetActor, sourceData, targetToken, targetActor.sheet, data.options);
            }
        }
    });
});