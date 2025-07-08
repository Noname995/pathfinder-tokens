// ###################################################################################
// ##### ГЛАВНЫЕ ФУНКЦИИ ДЛЯ ПРИМЕНЕНИЯ МАСКИРОВКИ #####
// ###################################################################################

// Применяет ПОЛНЫЙ образ, полностью заменяя актера
async function applyFullDisguise(targetActor, sourceData, targetToken = null, sheet = null) {

    // ИСПРАВЛЕНИЕ: Перед превращением в полную копию, сохраняем последнее рабочее состояние.
    if (targetActor.getFlag('pf2e-token-pack', 'active_mode') !== 'full') {
        // Создаем копию данных актера
        const stateToSave = targetActor.toObject();
        
        // ##### ГЛАВНОЕ ИСПРАВЛЕНИЕ #####
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


            // ШАГ 1: Восстанавливаем данные актера, НЕ затрагивая его визуальные свойства.
            
            await targetActor.deleteEmbeddedDocuments("Item", [], {deleteAll: true});
            await targetActor.deleteEmbeddedDocuments("ActiveEffect", [], {deleteAll:true});

            const stateClone = foundry.utils.deepClone(lastHybridState);
            
            // КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ: Мы обновляем системные данные, но перед этим
            // явно удаляем из них свойство "размер". Размер будет установлен
            // на финальном шаге, что предотвратит "скачок".
            if (stateClone.system?.traits?.size) {
                delete stateClone.system.traits.size;
            }

            // Обновляем актера только данными, не трогая визуал.
            const actorDataUpdate = {
                system: stateClone.system,
            };
            await targetActor.update(actorDataUpdate);
            
            if (stateClone.items?.length) await targetActor.createEmbeddedDocuments("Item", stateClone.items);
            if (stateClone.effects?.length) await targetActor.createEmbeddedDocuments("ActiveEffect", stateClone.effects);

            if (stateClone.system.attributes.hp) {
                await targetActor.update({'system.attributes.hp.value': stateClone.system.attributes.hp.value});
            }
        }
    }
    
    // ШАГ 2: Теперь, когда данные верны, применяем ВСЕ визуальные изменения.
    
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
    
    // Готовим финальное визуальное обновление для актера, включая ПРАВИЛЬНЫЙ размер.
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
  static get defaultOptions() { return foundry.utils.mergeObject(super.defaultOptions, { id: "disguise-app", title: "Создать новый образ", width: 400, height: 300, resizable: true, classes: ["disguise-app-window"], dragDrop: [{ dragSelector: null, dropSelector: ".drop-target" }] }); }
  async _renderInner() {
    const template = `<style>.disguise-app-window .form-group{text-align:center;}.disguise-app-window .save-mode-switch{display:flex;align-items:center;justify-content:center;gap:10px;margin-top:5px;}.disguise-app-window .toggle-switch{position:relative;display:inline-block;width:50px;height:24px;}.disguise-app-window .toggle-switch input{opacity:0;width:0;height:0;}.disguise-app-window .slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc;transition:.4s;border-radius:24px;}.disguise-app-window .slider:before{position:absolute;content:"";height:16px;width:16px;left:4px;bottom:4px;background-color:white;transition:.4s;border-radius:50%;}.disguise-app-window input:checked+.slider{background-color:#3f9934;}.disguise-app-window input:checked+.slider:before{transform:translateX(26px);}</style><div style="display:flex;flex-direction:column;height:100%;"><div class="form-group"><label style="font-weight:bold;">${game.i18n.localize("Disguise.Step1Mode")}</label><div class="save-mode-switch"><span>${game.i18n.localize("Disguise.HybridMode")}</span><label class="toggle-switch"><input type="checkbox" id="save-mode-toggle" name="save-mode"/><span class="slider"></span></label><span>${game.i18n.localize("Disguise.FullCopyMode")}</span></div></div><p class="notes" style="text-align:center;margin:10px 0;">${game.i18n.localize("Disguise.SelectModeThenDrag")}</p><div class="drop-target" style="flex-grow:1;display:flex;flex-direction:column;justify-content:center;align-items:center;border:2px dashed #666;border-radius:5px;"><label style="font-weight:bold;font-size:14px;">${game.i18n.localize("Disguise.Step2DragActor")}</label><i class="fas fa-file-import fa-3x" style="color:#666;margin-top:10px;"></i></div></div>`;
    return $(template);
  }
async _onDrop(event) {
    const data = TextEditor.getDragEventData(event);
    let sourceActor;
    let sourceData;

    if (data.type === "Actor") {
        sourceActor = await fromUuid(data.uuid);
        if (!sourceActor) return;
        sourceData = sourceActor.toObject(); // Данные из прототипа актера
    } else if (data.type === "Token") {
        const sourceTokenDoc = await fromUuid(data.uuid);
        if (!sourceTokenDoc || !sourceTokenDoc.actor) return;
        sourceActor = sourceTokenDoc.actor;
        sourceData = sourceActor.toObject(); // Берем данные актера за основу
        
        // ИСПРАВЛЕНИЕ: Перезаписываем масштаб в данных, используя значения
        // с конкретного перетаскиваемого токена.
        sourceData.prototypeToken.texture.scaleX = sourceTokenDoc.texture.scaleX;
        sourceData.prototypeToken.texture.scaleY = sourceTokenDoc.texture.scaleY;
        
    } else {
        return; // Игнорируем, если перетащили не актера и не токен.
    }
    
    if (!sourceActor || !sourceData) return;

    const isFullCopy = this.element.find('#save-mode-toggle').is(':checked');

    if (isFullCopy) {
        await applyFullDisguise(this.actor, sourceData, this.token, this.sheet);
    } else {
        await applyVisualDisguise(this.actor, sourceData, this.token, this.sheet);
    }
    // Передаем измененные данные в диалог сохранения
    this._promptToSaveDisguise(sourceActor, isFullCopy, sourceData);
    this.close();
}
  // И ЗАМЕНИТЕ ЭТУ ФУНКЦИЮ
_promptToSaveDisguise(sourceActor, isFullCopy, dataForDisguise) {
    const dialogContent = game.i18n.format(
        isFullCopy ? "Disguise.SaveFullCopyPrompt" : "Disguise.SaveHybridPrompt",
        { name: sourceActor.name }
    );
    new Dialog({
        title: game.i18n.localize("Disguise.SaveNewPromptTitle"),
        content: `${dialogContent}<form><div class="form-group"><label>${game.i18n.localize("Disguise.NameLabel")}</label><input type="text" name="disguiseName" value="${sourceActor.name}"/></div></form>`,
        buttons: { yes: { icon: '<i class="fas fa-save"></i>', label: game.i18n.localize("Disguise.SaveButtonLabel"), callback: async (html) => {
            const name = html.find('[name="disguiseName"]').val();
            if (!name) return ui.notifications.warn(game.i18n.localize("Disguise.NameRequiredWarning"));
            let dataToSave;
            
            // ИСПРАВЛЕНИЕ: Используем переданные данные с правильным масштабом,
            // а не запрашиваем их заново из прототипа актера.
            const sourceData = dataForDisguise; 

            if (isFullCopy) { 
                dataToSave = sourceData; 
            } else { 
                dataToSave = { 
                    name: sourceData.name, 
                    img: sourceData.img, 
                    prototypeToken: sourceData.prototypeToken, // Здесь теперь корректный масштаб
                    system: { traits: { size: sourceData.system.traits.size } } 
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
  static get defaultOptions() { return foundry.utils.mergeObject(super.defaultOptions, { id: "phase-manager-app", title: game.i18n.localize("Disguise.ManagerTitle"), width: 400, height: 500, resizable: true }); }

  async getData() {
    let masterList = this.actor.getFlag('pf2e-token-pack', 'disguises') || [];
    const currentActorImg = this.actor.img;
    
    // Как и раньше, отфильтровываем оригинальный образ
    const visibleList = masterList.filter(d => !d.isOriginal);

    const partition = visibleList.reduce((acc, d) => {
        const type = d.type || 'hybrid';
        if (type === 'full') acc.fulls.push(d);
        else acc.hybrids.push(d);
        return acc;
    }, { fulls: [], hybrids: [] }); 

    partition.fulls.sort((a,b) => a.name.localeCompare(b.name));
    partition.hybrids.sort((a,b) => a.name.localeCompare(b.name));
    
    // Проверяем каждый видимый образ, активен ли он
    for (const disguise of [...partition.fulls, ...partition.hybrids]) {
        const flagKey = `data_${disguise.id}`;
        const data = this.actor.getFlag('pf2e-token-pack', flagKey);
        disguise.img = data?.img || CONST.DEFAULT_TOKEN;
        // Добавляем свойство для подсветки
        disguise.isActive = (disguise.img === currentActorImg);
    }
    return partition;
  }

  async _renderInner(data) {
    const renderList = (items, title) => {
        if (!items || !items.length) return '';
        let listHtml = `<h3 style="text-align:center;border-bottom:1px solid #ccc;margin:10px 0 5px 0;font-size:16px;">${title}</h3>`;
        items.forEach(d => {
            // Добавляем класс 'active' если образ активен
            const activeClass = d.isActive ? 'active' : '';
            listHtml += `<li class="phase-item ${activeClass}" data-id="${d.id}" data-type="${d.type}" style="display:flex;align-items:center;padding:5px;border-bottom:1px solid #ccc; border-left: 3px solid transparent;"><img src="${d.img}" style="width:36px;height:36px;object-fit:cover;margin-right:10px;border:none;"/><span style="flex-grow:1;">${d.name}</span><a class="apply-phase" title="${game.i18n.localize("Disguise.ApplyTitle")}" style="cursor:pointer;margin-left:10px;"><i class="fas fa-play"></i></a>`;
            if (!d.isOriginal && d.type === 'full') listHtml += `<a class="edit-phase" title="${game.i18n.localize("Disguise.EditTitle")}" style="cursor:pointer;margin-left:10px;"><i class="fas fa-edit"></i></a>`;
            if (!d.isOriginal) listHtml += `<a class="delete-phase" title="${game.i18n.localize("Disguise.DeleteTitle")}" style="margin-left:10px;cursor:pointer;"><i class="fas fa-trash"></i></a>`;
            listHtml += `</li>`;
        });
        return listHtml;
    };
    
    // Стили для подсветки
    const styles = `<style>
    .phase-list .phase-item.active {
        background-color: rgba(40, 167, 69, 0.5);
        border-left: 3px solid #28a745;
        font-weight: bold;
    }
</style>`;

    let content = `${styles}<ul class="phase-list" style="list-style:none;padding:0;margin:0;">`;
    content += renderList(data.hybrids, game.i18n.localize("Disguise.HybridSkinsHeader"));
    content += renderList(data.fulls, game.i18n.localize("Disguise.FullCopiesHeader"));
    if (!data.hybrids.length && !data.fulls.length) content += `<li style="padding:10px;text-align:center;">${game.i18n.localize("Disguise.NoSavedDisguises")}</li>`;
    content += `</ul>`;
    return $(`<div>${content}</div>`);
  }

  // Остальные функции без изменений, как в вашем исходном файле
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

    // Проверяем, активен ли сейчас какой-либо из сохраненных образов (кроме оригинального).
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

    // Перезаписываем оригинальный образ, если это первый запуск,
    // ИЛИ если ни один из образов-маскировок сейчас не активен.
    if (isFirstTime || !isDisguiseActive) {
        
        const originalSource = actor.toObject();
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

        // ##### ИЗМЕНЕНИЕ ЛОГИКИ УВЕДОМЛЕНИЙ #####
        if (isFirstTime) {
            const newList = [{ id: 'original', name: game.i18n.localize("Disguise.OriginalAppearance"), isOriginal: true, type: 'hybrid' }, ...masterList];
            await actor.setFlag('pf2e-token-pack', 'disguises', newList);
            await actor.setFlag('pf2e-token-pack', 'active_mode', 'hybrid');
            
            // Показываем уведомление только при первом сохранении.
            ui.notifications.info(game.i18n.localize("Disguise.OriginalAppearanceSaved"));
        } else {
            // При обновлении - выводим сообщение только в консоль (F12).
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

// Хук для добавления кнопки в заголовок листа актера
// Хук для добавления кнопки в заголовок листа актера
Hooks.on("getActorSheetHeaderButtons", (app, buttons) => {
  // Условие, чтобы кнопка была только на листах NPC.
  if (!game.user.isGM || app.object?.type !== 'npc') {
    return;
  }
  
  buttons.unshift({
    // Убираем 'label', чтобы на кнопке не было текста.
    label: game.i18n.localize("Disguise.MaskPhaseTitle"),
    
    class: "mask-phase",
    
    // Меняем иконку на 'fas fa-user-secret', как на HUD.
    icon: "fas fa-user-secret", 

    onclick: () => openMainMenu(app.object, app.token, app)
  });
});

// Хук для добавления иконки в HUD токена
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