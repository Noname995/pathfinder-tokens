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

    const mechanicalItemTypes = ['melee', 'spellcastingEntry', 'spell', 'action', 'feat', 'lore', 'skill'];

    const itemsToDelete = targetActor.items.filter(i => mechanicalItemTypes.includes(i.type)).map(i => i.id);
    if (itemsToDelete.length > 0) {
        await targetActor.deleteEmbeddedDocuments("Item", itemsToDelete);
    }

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

    const originalNotes = {
        public: targetActor.system.details.publicNotes,
        private: targetActor.system.details.privateNotes
    };

    const actorUpdate = foundry.utils.deepClone(sourceClone);
    delete actorUpdate._id;
    delete actorUpdate.type;
    delete actorUpdate.items;
    delete actorUpdate.effects;
    delete actorUpdate.ownership;
    delete actorUpdate.folder;
    delete actorUpdate.sort;
    delete actorUpdate._stats;
    delete actorUpdate.flags;

    if (actorUpdate.system?.details) {
        actorUpdate.system.details.publicNotes = originalNotes.public;
        actorUpdate.system.details.privateNotes = originalNotes.private;
    }

    await targetActor.update(actorUpdate);

    if (sourceClone.system.attributes.hp) {
        await targetActor.update({'system.attributes.hp.value': sourceClone.system.attributes.hp.value});
    }

    const sourceMechanicalItems = sourceClone.items.filter(i => mechanicalItemTypes.includes(i.type));

    if (sourceMechanicalItems.length > 0) {
        const allItemsData = sourceMechanicalItems.map(foundry.utils.deepClone).map(i => {
            delete i._id; return i;
        });

        const spellsData = allItemsData.filter(i => i.type === 'spell');
        const otherItemsData = allItemsData.filter(i => i.type !== 'spell');

        const createdOtherItems = await targetActor.createEmbeddedDocuments("Item", otherItemsData);

        const entryIdMap = new Map();
        const sourceEntries = sourceMechanicalItems.filter(i => i.type === 'spellcastingEntry');
        const createdEntries = createdOtherItems.filter(i => i.type === 'spellcastingEntry');

        for (const sourceEntry of sourceEntries) {
            const newEntry = createdEntries.find(i => i.name === sourceEntry.name);
            if (newEntry) {
                entryIdMap.set(sourceEntry._id, newEntry.id);
            }
        }

        const updatedSpellsData = spellsData.map(spell => {
            const oldEntryId = spell.system.location.value;
            const newEntryId = entryIdMap.get(oldEntryId);
            if (newEntryId) {
                spell.system.location.value = newEntryId;
            }
            return spell;
        });

        const createdSpells = await targetActor.createEmbeddedDocuments("Item", updatedSpellsData);

        if (createdSpells.length > 0) {
            const spellIdMap = new Map();
            const sourceSpells = sourceMechanicalItems.filter(i => i.type === 'spell');
            for (const sourceSpell of sourceSpells) {
                const newSpell = createdSpells.find(s => s.name === sourceSpell.name && s.system.location.value === entryIdMap.get(sourceSpell.system.location.value));
                if (newSpell) {
                    spellIdMap.set(sourceSpell._id, newSpell.id);
                }
            }

            const updates = [];
            const preparedEntries = sourceEntries.filter(e => e.system.prepared?.value === 'prepared');

            for (const sourceEntry of preparedEntries) {
                const newEntryId = entryIdMap.get(sourceEntry._id);
                if (!newEntryId) continue;

                const newSlots = foundry.utils.deepClone(sourceEntry.system.slots);
                for (const slotKey in newSlots) {
                    const slot = newSlots[slotKey];
                    if (slot.prepared?.length > 0) {
                        slot.prepared = slot.prepared
                            .map(prep => {
                                const newSpellId = spellIdMap.get(prep.id);
                                return newSpellId ? { id: newSpellId } : null;
                            })
                            .filter(p => p !== null);
                    }
                }
                updates.push({ _id: newEntryId, 'system.slots': newSlots });
            }

            if (updates.length > 0) {
                await targetActor.updateEmbeddedDocuments("Item", updates);
            }
        }
    }

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

    if (game.combat && targetToken && targetActor.isOwner) {
        const combatant = game.combat.combatants.find(c => c.tokenId === targetToken.id);
        if (combatant) {
            await combatant.update({ img: targetActor.img, name: targetActor.name });
        }
    }

    await targetActor.setFlag('pf2e-token-pack', 'active_mode', 'full');
    const message = game.i18n.format("Disguise.AppliedSuccess", { name: sourceData.name });
    ui.notifications.info(message);
    if (sheet && sheet.rendered) setTimeout(() => sheet.render(true), 100);
}

async function applyVisualDisguise(targetActor, visualData, targetToken = null, sheet = null, options = { applySize: true }) {
    const activeMode = targetActor.getFlag('pf2e-token-pack', 'active_mode');
    
    if (activeMode === 'full') {
        let lastHybridState = targetActor.getFlag('pf2e-token-pack', 'last_hybrid_state');
        if (lastHybridState) {
            
            const mechanicalItemTypes = ['melee', 'spellcastingEntry', 'spell', 'action', 'feat', 'lore', 'skill'];
            const inventoryItemTypes = ['weapon', 'armor', 'shield', 'equipment', 'consumable', 'treasure', 'backpack'];

            // 1. Синхронизируем инвентарь и заметки (эффекты больше не трогаем)
            const currentInventoryItems = targetActor.items.filter(i => inventoryItemTypes.includes(i.type)).map(i => i.toObject());
            const currentNotes = {
                public: targetActor.system.details.publicNotes,
                private: targetActor.system.details.privateNotes
            };
            const originalMechanicalItems = lastHybridState.items.filter(i => mechanicalItemTypes.includes(i.type));

            const syncedHybridState = foundry.utils.deepClone(lastHybridState);
            syncedHybridState.items = [...originalMechanicalItems, ...currentInventoryItems];
            if (syncedHybridState.system?.details) {
                syncedHybridState.system.details.publicNotes = currentNotes.public;
                syncedHybridState.system.details.privateNotes = currentNotes.private;
            }
            await targetActor.setFlag('pf2e-token-pack', 'last_hybrid_state', syncedHybridState);

            // 2. "Хирургически" удаляем только механику от маскировки
            const itemsToDelete = targetActor.items.filter(i => mechanicalItemTypes.includes(i.type)).map(i => i.id);
            if (itemsToDelete.length > 0) {
                await targetActor.deleteEmbeddedDocuments("Item", itemsToDelete);
            }

            // 3. Восстанавливаем актера, но пока без предметов
            const stateClone = foundry.utils.deepClone(syncedHybridState);
            if (stateClone.system?.traits?.size) delete stateClone.system.traits.size;
            const actorDataUpdate = { system: stateClone.system, name: stateClone.name };
            await targetActor.update(actorDataUpdate);

            // 4. Создаем только механические предметы из сохраненного состояния
            const itemsToCreateFromState = stateClone.items.filter(i => mechanicalItemTypes.includes(i.type));
            if (itemsToCreateFromState.length > 0) {
                const allItemsData = itemsToCreateFromState.map(foundry.utils.deepClone).map(i => {
                    delete i._id; return i;
                });

                const spellsData = allItemsData.filter(i => i.type === 'spell');
                const otherItemsData = allItemsData.filter(i => i.type !== 'spell');

                const createdOtherItems = await targetActor.createEmbeddedDocuments("Item", otherItemsData);

                const entryIdMap = new Map();
                const sourceEntries = itemsToCreateFromState.filter(i => i.type === 'spellcastingEntry');
                const createdEntries = createdOtherItems.filter(i => i.type === 'spellcastingEntry');

                for (const sourceEntry of sourceEntries) {
                    const newEntry = createdEntries.find(i => i.name === sourceEntry.name);
                    if (newEntry) {
                        entryIdMap.set(sourceEntry._id, newEntry.id);
                    }
                }
                
                const updatedSpellsData = spellsData.map(spell => {
                    const oldEntryId = spell.system.location.value;
                    const newEntryId = entryIdMap.get(oldEntryId);
                    if (newEntryId) {
                        spell.system.location.value = newEntryId;
                    }
                    return spell;
                });

                const createdSpells = await targetActor.createEmbeddedDocuments("Item", updatedSpellsData);

                if (createdSpells.length > 0) {
                    const spellIdMap = new Map();
                    const sourceSpells = itemsToCreateFromState.filter(i => i.type === 'spell');
                    for (const sourceSpell of sourceSpells) {
                         const newSpell = createdSpells.find(s => s.name === sourceSpell.name && s.system.location.value === entryIdMap.get(sourceSpell.system.location.value));
                        if (newSpell) {
                            spellIdMap.set(sourceSpell._id, newSpell.id);
                        }
                    }

                    const updates = [];
                    const preparedEntries = sourceEntries.filter(e => e.system.prepared?.value === 'prepared');

                    for (const sourceEntry of preparedEntries) {
                        const newEntryId = entryIdMap.get(sourceEntry._id);
                        if (!newEntryId) continue;

                        const newSlots = foundry.utils.deepClone(sourceEntry.system.slots);
                        for (const slotKey in newSlots) {
                            const slot = newSlots[slotKey];
                            if (slot.prepared?.length > 0) {
                                slot.prepared = slot.prepared
                                    .map(prep => {
                                        const newSpellId = spellIdMap.get(prep.id);
                                        return newSpellId ? { id: newSpellId } : null;
                                    })
                                    .filter(p => p !== null);
                            }
                        }
                        updates.push({ _id: newEntryId, 'system.slots': newSlots });
                    }

                    if (updates.length > 0) {
                        await targetActor.updateEmbeddedDocuments("Item", updates);
                    }
                }
            }

            if (stateClone.system.attributes.hp) {
                await targetActor.update({'system.attributes.hp.value': stateClone.system.attributes.hp.value});
            }
        }
    }
    
    // --- Остальная часть функции для гибрид -> гибрид остается без изменений ---
    const originalVisuals = targetActor.getFlag('pf2e-token-pack', 'data_original_visuals');
    
    const newPrototype = foundry.utils.deepClone(originalVisuals.prototypeToken);

    const disguiseProto = visualData.prototypeToken;
    newPrototype.texture = disguiseProto.texture;
    newPrototype.ring = disguiseProto.ring;
    
    const actorVisualUpdate = {
        'img': visualData.img,
        'prototypeToken': newPrototype
    };

    const tokenUpdate = {
        'flags.pf2e.linkToActorSize': foundry.utils.getProperty(disguiseProto, "flags.pf2e.linkToActorSize"),
        'flags.pf2e.autoscale': false, 
        'texture.scaleX': disguiseProto.texture.scaleX, 
        'texture.scaleY': disguiseProto.texture.scaleY,
    };

    if (disguiseProto.ring.enabled) {
        tokenUpdate.ring = disguiseProto.ring;
        tokenUpdate['texture.src'] = visualData.img;
    } else {
        tokenUpdate['ring.enabled'] = false;
        tokenUpdate['texture.src'] = disguiseProto.texture.src;
    }
    
    if (options.applySize) {
        let sourceSizeValue;
        if (visualData.system?.traits?.size?.value) {
            sourceSizeValue = visualData.system.traits.size.value;
        } else {
            const ancestry = visualData.items?.find(i => i.type === 'ancestry');
            if (ancestry?.system?.size) {
                sourceSizeValue = ancestry.system.size;
            }
        }

        if (sourceSizeValue) {
            const sourceSizeObject = { value: sourceSizeValue };
            if (targetActor.type === 'npc') {
                actorVisualUpdate['system.traits.size'] = sourceSizeObject;
            } else if (targetToken) {
                const sizeMap = { tiny: 0.5, sm: 1, med: 1, lg: 2, huge: 3, grg: 4 };
                const newDimension = sizeMap[sourceSizeValue];
                if (newDimension !== undefined) {
                    tokenUpdate.height = newDimension;
                    tokenUpdate.width = newDimension;
                    tokenUpdate['flags.pf2e.linkToActorSize'] = false;
                    if (targetActor.type === 'character') {
                        actorVisualUpdate.prototypeToken.height = newDimension;
                        actorVisualUpdate.prototypeToken.width = newDimension;
                        if (!actorVisualUpdate.prototypeToken.flags.pf2e) actorVisualUpdate.prototypeToken.flags.pf2e = {};
                        actorVisualUpdate.prototypeToken.flags.pf2e.linkToActorSize = false;
                    }
                } else {
                    tokenUpdate.height = disguiseProto.height;
                    tokenUpdate.width = disguiseProto.width;
                    tokenUpdate['flags.pf2e.linkToActorSize'] = true;
                }
            }
        }
    } else {
        if (originalVisuals) {
            if (targetActor.type === 'npc') {
                if (originalVisuals.system?.traits?.size) {
                    actorVisualUpdate['system.traits.size'] = originalVisuals.system.traits.size;
                }
            } else if (targetToken) {
                tokenUpdate.height = originalVisuals.prototypeToken.height;
                tokenUpdate.width = originalVisuals.prototypeToken.width;
                tokenUpdate['flags.pf2e.linkToActorSize'] = true;
            }
        }
    }

    if (targetToken) {
        await targetToken.update(tokenUpdate);
        if (targetToken.object) targetToken.object.refresh();
    }
    
    let actorToUpdate = targetActor;
    if (targetActor.type === 'character') {
        const canonicalActor = game.actors.get(targetActor.id);
        if (canonicalActor) {
            actorToUpdate = canonicalActor;
        }
    }
    await actorToUpdate.update(actorVisualUpdate);

    if (game.combat && targetToken && actorToUpdate.isOwner) {
        const combatant = game.combat.combatants.find(c => c.tokenId === targetToken.id);
        if (combatant) {
            const combatantImg = disguiseProto.ring.enabled 
                ? visualData.img 
                : disguiseProto.texture.src;
            await combatant.update({ img: combatantImg, name: actorToUpdate.name });
        }
    }

    await actorToUpdate.setFlag('pf2e-token-pack', 'active_mode', 'hybrid');
    ui.notifications.info(game.i18n.format("Disguise.AppliedSuccess", { name: visualData.name }));
    if (sheet && sheet.rendered) setTimeout(() => sheet.render(true), 100);
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
      id: "disguise-app", title: game.i18n.localize("Disguise.CreateNewDisguise"),
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
                    let sourceSizeValue;

                    // Ищем размер у NPC
                    if (dataForDisguise.system?.traits?.size?.value) {
                        sourceSizeValue = dataForDisguise.system.traits.size.value;
                    } 
                    // Иначе ищем у PC в родословной
                    else {
                        const ancestry = dataForDisguise.items?.find(i => i.type === 'ancestry');
                        if (ancestry?.system?.size) {
                            sourceSizeValue = ancestry.system.size;
                        }
                    }

                    // Если нашли, сохраняем в формате, который понятен для NPC, для единообразия
                    if (sourceSizeValue) {
                        visualDataToSave.system.traits = { size: { value: sourceSizeValue } };
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
      id: "phase-manager-app", title: game.i18n.localize("Disguise.SavedDisguisesButton"),
      template: "modules/pf2e-token-pack/data/templates/Disguise.hbs",
      width: 400, height: 500, resizable: true
    });
  }
  async getData() {
    let masterList = this.actor.getFlag('pf2e-token-pack', 'disguises') || [];
    
    // Теперь мы не фильтруем список, а обрабатываем его целиком
    const partition = masterList.reduce((acc, d) => {
        const type = d.type || 'hybrid';
        if (this.isHybridOnly && type === 'full') return acc;
        if (type === 'full') acc.fulls.push(d); else acc.hybrids.push(d); return acc;
    }, { fulls: [], hybrids: [] });

    // Сортируем полные копии как обычно
    partition.fulls.sort((a,b) => a.name.localeCompare(b.name)); 
    
    // Гибридные образы сортируем так, чтобы оригинальный всегда был первым
    partition.hybrids.sort((a, b) => {
        if (a.isOriginal) return -1;
        if (b.isOriginal) return 1;
        return a.name.localeCompare(b.name);
    });

    // Заполняем данные для отображения
    for (const disguise of [...partition.fulls, ...partition.hybrids]) {
        let data;
        let displayName;

        if (disguise.isOriginal) {
            // Особая логика для оригинального образа
            data = this.actor.getFlag('pf2e-token-pack', 'data_original_visuals');
            if (data) {
                const customName = this.actor.getFlag('pf2e-token-pack', 'originalDisplayName');
                displayName = game.i18n.format("Disguise.OriginalActor", { name: customName || data.name });
            }
        } else {
            // Стандартная логика для сохраненных маскировок
            const flagKey = `data_${disguise.id}`;
            data = this.actor.getFlag('pf2e-token-pack', flagKey);
            displayName = data?.name;
        }

        if (data) {
            disguise.img = data.img || CONST.DEFAULT_TOKEN;
            disguise.name = displayName; // Обновляем имя для отображения
            disguise.isActive = (this.actor.img === data.img && (disguise.isOriginal || this.actor.name === data.name));
        }
    }
    
    partition.isManager = true; 
    return partition;
  }

  activateListeners(html) {
      super.activateListeners(html);
      html.on('click', '.apply-phase', this._onApplyPhase.bind(this));
      html.on('click', '.edit-phase', this._onEditPhase.bind(this));
      html.on('click', '.rename-phase', this._onRenamePhase.bind(this));
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

  async _onRenamePhase(event) {
    const id = $(event.currentTarget).closest('.phase-item').data('id');
    const masterList = this.actor.getFlag('pf2e-token-pack', 'disguises') || [];
    const disguiseInList = masterList.find(d => d.id === id);
    if (!disguiseInList) return;

    let currentName, promptTitle, callback;

    if (disguiseInList.isOriginal) {
        // Логика для переименования ОРИГИНАЛЬНОГО образа (псевдоним)
        promptTitle = game.i18n.localize("Disguise.RenameOriginalTitle");
        currentName = this.actor.getFlag('pf2e-token-pack', 'originalDisplayName') || "";
        callback = async (newName) => {
            await this.actor.setFlag('pf2e-token-pack', 'originalDisplayName', newName);
        };
    } else {
        // Логика для переименования СОХРАНЕННОГО образа
        promptTitle = game.i18n.localize("Disguise.RenameSavedTitle");
        const flagKey = `data_${id}`;
        const data = this.actor.getFlag('pf2e-token-pack', flagKey);
        currentName = data.name;
        callback = async (newName) => {
            data.name = newName;
            disguiseInList.name = newName;
            await this.actor.setFlag('pf2e-token-pack', flagKey, data);
            await this.actor.setFlag('pf2e-token-pack', 'disguises', masterList);
        };
    }

    const content = `
        <form autocomplete="off">
            <div class="form-group">
                <label>${game.i18n.localize("Disguise.NewNameLabel")}</label>
                <div class="form-fields">
                    <input type="text" name="newName" value="${currentName}" autofocus/>
                </div>
            </div>
        </form>`;

    new Dialog({
        title: promptTitle,
        content: content,
        buttons: {
            save: {
                icon: '<i class="fas fa-save"></i>',
                label: game.i18n.localize("Disguise.SaveButtonLabel"),
                callback: async (html) => {
                    const newName = html.find('[name="newName"]').val();
                    await callback(newName);
                    this.render(true); // Обновляем окно менеджера
                }
            }
        },
        default: 'save'
    }).render(true);
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
    ui.notifications.info(game.i18n.format("Disguise.OriginalAppearanceSaved", {name: originalSource.name}));
}

async function openDisguiseMenu(actor, token, sheet) {
    await saveOriginalState(actor, token);

    const highlightDisabled = actor.getFlag('pf2e-token-pack', 'highlightDisabled') ?? false;

    // Определяем кнопки, которые доступны игрокам
    const playerButtons = {
        phases: {
            icon: '<i class="fas fa-layer-group"></i>',
            label: game.i18n.localize("Disguise.SavedDisguisesButton"),
            callback: () => new PhaseManagerApp(actor, token, sheet, {isHybridOnly: actor.type !== 'npc'}).render(true)
        }
    };

    let finalButtons;
    if (game.user.isGM) {
        // Для Мастера собираем кнопки в строгом порядке
        finalButtons = {
            disguise: {
                icon: '<i class="fas fa-user-plus"></i>',
                label: game.i18n.localize("Disguise.NewDisguiseButton"),
                callback: () => new DisguiseApp(actor, token, sheet, {isHybridOnly: actor.type !== 'npc'}).render(true)
            },
            phases: playerButtons.phases,
            highlight: {
                icon: `<i class="fas fa-${highlightDisabled ? 'eye' : 'eye-slash'}"></i>`,
                label: highlightDisabled ? game.i18n.localize("Disguise.EnableHighlight") : game.i18n.localize("Disguise.DisableHighlight"),
                callback: async () => {
                    await actor.setFlag('pf2e-token-pack', 'highlightDisabled', !highlightDisabled);
                    canvas.tokens.placeables.filter(t => t.document.actorId === actor.id).forEach(t => t.draw());
                    const messageKey = !highlightDisabled ? "Disguise.HighlightDisabledFor" : "Disguise.HighlightEnabledFor";
                    ui.notifications.info(game.i18n.format(messageKey, { name: actor.name }));
                }
            }
        };
    } else {
        finalButtons = playerButtons;
    }

    const dialogWidth = game.user.isGM ? 440 : 250; 

    new Dialog({
        title: game.i18n.localize("Disguise.MaskPhaseTitle"),
        content: `<p>${game.i18n.localize("Disguise.ChooseActionPrompt")}</p>`,
        buttons: finalButtons
    }, { 
        width: dialogWidth,
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

        if (fulls.length > 0 && actor.type === 'npc') {
            menu.append($(`<div class="disguise-hud-header">${game.i18n.localize("Disguise.FullCopiesHeader")}</div>`));
            for (const disguise of fulls) {
                menu.append(createMenuItem(disguise));
            }
        }

        const buttonRect = button[0].getBoundingClientRect();
        $('body').append(menu);

        const currentHudPosition = game.settings.get('pf2e-token-pack', 'hudPosition') || 'top-right';
        const [, currentHorizontal] = currentHudPosition.split('-');

        const menuLeftPosition = currentHorizontal === 'left' 
            ? `${buttonRect.left - menu.outerWidth() - 5}px`
            : `${buttonRect.right + 5}px`;

        menu.css({
            position: 'fixed',
            top: `${buttonRect.top}px`,
            left: menuLeftPosition,
            zIndex: 101
        });

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

    if (!game.user.isGM) {
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
        
        const colorSetting = game.settings.get('pf2e-token-pack', 'highlightColor') || "#9400D3";
        const borderColor = parseInt(colorSetting.replace("#", ""), 16);
        const borderWidth = 4;

        marker.lineStyle(borderWidth, borderColor, 1, 0);

        const style = game.settings.get('pf2e-token-pack', 'highlightStyle') || 'rounded-rect';
        const w = token.w;
        const h = token.h;
        const halfBorder = borderWidth / 2;

        switch (style) {
            case 'square':
                marker.drawRect(-halfBorder, -halfBorder, w + borderWidth, h + borderWidth);
                break;
            case 'circle':
                marker.drawEllipse(w / 2, h / 2, w / 2 + halfBorder, h / 2 + halfBorder);
                break;
            case 'corners':
                const cornerLength = Math.min(w, h) * 0.25;
                marker.moveTo(-halfBorder, cornerLength).lineTo(-halfBorder, -halfBorder).lineTo(cornerLength, -halfBorder);
                marker.moveTo(w + halfBorder - cornerLength, -halfBorder).lineTo(w + halfBorder, -halfBorder).lineTo(w + halfBorder, cornerLength);
                marker.moveTo(w + halfBorder, h + halfBorder - cornerLength).lineTo(w + halfBorder, h + halfBorder).lineTo(w + halfBorder - cornerLength, h + halfBorder);
                marker.moveTo(cornerLength, h + halfBorder).lineTo(-halfBorder, h + halfBorder).lineTo(-halfBorder, h + halfBorder - cornerLength);
                break;
            case 'ticks': // ИСПРАВЛЕНА ЛОГИКА
                const tickLength = Math.min(w, h) * 0.15;
                // Верхняя засечка (наружу)
                marker.moveTo(w / 2, 0 - halfBorder).lineTo(w / 2, 0 - halfBorder - tickLength);
                // Нижняя засечка (наружу)
                marker.moveTo(w / 2, h + halfBorder).lineTo(w / 2, h + halfBorder + tickLength);
                // Левая засечка (наружу)
                marker.moveTo(0 - halfBorder, h / 2).lineTo(0 - halfBorder - tickLength, h / 2);
                // Правая засечка (наружу)
                marker.moveTo(w + halfBorder, h / 2).lineTo(w + halfBorder + tickLength, h / 2);
                break;
            case 'corner-ticks': // ИСПРАВЛЕНА ЛОГИКА
                const cornerTickLength = Math.min(w, h) * 0.15;
                const delta = cornerTickLength / Math.sqrt(2);
                // Верхний левый (наружу)
                marker.moveTo(0, 0).lineTo(-delta, -delta);
                // Верхний правый (наружу)
                marker.moveTo(w, 0).lineTo(w + delta, -delta);
                // Нижний правый (наружу)
                marker.moveTo(w, h).lineTo(w + delta, h + delta);
                // Нижний левый (наружу)
                marker.moveTo(0, h).lineTo(-delta, h + delta);
                break;
            case 'rounded-rect':
            default:
                marker.drawRoundedRect(-halfBorder, -halfBorder, w + borderWidth, h + borderWidth, 10);
                break;
        }
        
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

    game.settings.register('pf2e-token-pack', 'highlightStyle', {
    name: game.i18n.localize("Disguise.HighlightStyleName"),
    hint: game.i18n.localize("Disguise.HighlightStyleHint"),
    scope: 'world',
    config: true,
    type: String,
    default: "rounded-rect",
    choices: {
        "rounded-rect": game.i18n.localize("Disguise.HighlightStyleRoundedRect"),
        "square":       game.i18n.localize("Disguise.HighlightStyleSquare"),
        "circle":       game.i18n.localize("Disguise.HighlightStyleCircle"),
        "corners":      game.i18n.localize("Disguise.HighlightStyleCorners"),
        "ticks":        game.i18n.localize("Disguise.HighlightStyleTicks"),
        "corner-ticks": game.i18n.localize("Disguise.HighlightStyleCornerTicks")
    },
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
// === АВТОМАТИЧЕСКАЯ СИНХРОНИЗАЦИЯ ТРЕКЕРА БОЯ (ДЛЯ ИГРОКОВ)
// ===================================================================================
Hooks.on('init', () => {
    game.socket.on('module.pf2e-token-pack-combatsync', (data) => {
        if (game.user.isGM && game.combat) {
            const combatant = game.combat.combatants.find(c => c.actorId === data.actorId);
            const actor = game.actors.get(data.actorId);

            if (combatant && actor) {
                const latestImg = actor.prototypeToken.ring.enabled ? actor.img : actor.prototypeToken.texture.src;
                combatant.update({ img: latestImg, name: actor.name }).then(() => {
                    ui.combat.render();
                });
            }
        }
    });
});

// ===================================================================================
// === ДИСПЕТЧЕР И ОБРАБОТЧИК СОКЕТОВ
// ===================================================================================

async function requestDisguiseChange(request) {
    let sourceData;
    if (request.sourceType === 'actor') {
        const sourceActor = await fromUuid(request.sourceId);
        if (sourceActor) sourceData = sourceActor.toObject();
    } else if (request.sourceType === 'flag') {
        sourceData = request.actor.getFlag('pf2e-token-pack', `data_${request.sourceId}`);
    }

    if (!sourceData) return ui.notifications.error(game.i18n.localize("Disguise.SourceDataNotFound"));

    if (game.user.isGM) {
        if (request.type === 'full') {
            await applyFullDisguise(request.actor, sourceData, request.token, request.sheet, request.options);
        } else {
            await applyVisualDisguise(request.actor, sourceData, request.token, request.sheet, request.options);
        }
    } else {
        ui.notifications.info(game.i18n.localize("Disguise.RequestSentToGM"));
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
