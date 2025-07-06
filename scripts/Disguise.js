// ###################################################################################
// ##### ГЛАВНЫЕ ФУНКЦИИ ДЛЯ ПРИМЕНЕНИЯ МАСКИРОВКИ #####
// ###################################################################################

// Применяет ПОЛНЫЙ образ, полностью заменяя актера
async function applyFullDisguise(targetActor, sourceData, targetToken = null, sheet = null) {
    ui.notifications.info(`Применение полной фазы: ${sourceData.name}...`);
    
    // Перед превращением в полную копию, сохраняем последнее гибридное состояние
    if (targetActor.getFlag('pf2e-token-pack', 'active_mode') !== 'full') {
        await targetActor.setFlag('pf2e-token-pack', 'last_hybrid_state', targetActor.toObject());
    }
    
    await targetActor.deleteEmbeddedDocuments("Item", [], {deleteAll: true});
    await targetActor.deleteEmbeddedDocuments("ActiveEffect", [], {deleteAll: true});

    const sourceClone = foundry.utils.deepClone(sourceData);
    const actorUpdate = { img: sourceClone.img, system: sourceClone.system, prototypeToken: sourceClone.prototypeToken };
    await targetActor.update(actorUpdate);
    
    // ИСПРАВЛЕНИЕ: После основного обновления, принудительно устанавливаем точное значение текущего ХП.
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
    ui.notifications.info(`Образ "${sourceData.name}" успешно применен!`);
    if (sheet && sheet.rendered) sheet.render(true);
}

// Применяет ВИЗУАЛЬНЫЙ образ, восстанавливая гибридное состояние при необходимости
async function applyVisualDisguise(targetActor, visualData, targetToken = null, sheet = null) {
    ui.notifications.info(`Применение гибридного образа: ${visualData.name}...`);

    const activeMode = targetActor.getFlag('pf2e-token-pack', 'active_mode');
    
    // Если мы сейчас в режиме полной копии, нужно сначала восстановиться
    if (activeMode === 'full') {
        const lastHybridState = targetActor.getFlag('pf2e-token-pack', 'last_hybrid_state');
        if (lastHybridState) {
            ui.notifications.info("Восстановление гибридного состояния...");
            // Восстанавливаем актера до его последнего гибридного состояния
            await applyFullDisguise(targetActor, lastHybridState, targetToken, sheet);
            // Важно: applyFullDisguise снова установит active_mode в 'full', нужно это исправить ниже
        }
    }
    
    // Теперь, когда мы гарантированно в гибридном состоянии, применяем только визуал
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
    if (targetToken) await targetToken.update(tokenUpdate);

    const actorUpdate = { 'img': visualData.img, 'prototypeToken': visualData.prototypeToken, 'system.traits.size': visualData.system.traits.size };
    await targetActor.update(actorUpdate);

    await targetActor.setFlag('pf2e-token-pack', 'active_mode', 'hybrid');
    ui.notifications.info(`Образ "${visualData.name}" успешно применен!`);
    if (sheet && sheet.rendered) sheet.render(true);
}


// ###################################################################################
// ##### КЛАССЫ ПРИЛОЖЕНИЙ #####
// ###################################################################################

class DisguiseApp extends Application {
  constructor(actor, token, sheet) { super(); this.actor = actor; this.token = token; this.sheet = sheet; }
  static get defaultOptions() { return foundry.utils.mergeObject(super.defaultOptions, { id: "disguise-app", title: "Создать новый образ", width: 400, height: 300, resizable: true, classes: ["disguise-app-window"], dragDrop: [{ dragSelector: null, dropSelector: ".drop-target" }] }); }
  async _renderInner() {
    const template = `<style>.disguise-app-window .form-group{text-align:center;}.disguise-app-window .save-mode-switch{display:flex;align-items:center;justify-content:center;gap:10px;margin-top:5px;}.disguise-app-window .toggle-switch{position:relative;display:inline-block;width:50px;height:24px;}.disguise-app-window .toggle-switch input{opacity:0;width:0;height:0;}.disguise-app-window .slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc;transition:.4s;border-radius:24px;}.disguise-app-window .slider:before{position:absolute;content:"";height:16px;width:16px;left:4px;bottom:4px;background-color:white;transition:.4s;border-radius:50%;}.disguise-app-window input:checked+.slider{background-color:#3f9934;}.disguise-app-window input:checked+.slider:before{transform:translateX(26px);}</style><div style="display:flex;flex-direction:column;height:100%;"><div class="form-group"><label style="font-weight:bold;">1. Режим:</label><div class="save-mode-switch"><span>Гибрид</span><label class="toggle-switch"><input type="checkbox" id="save-mode-toggle" name="save-mode"/><span class="slider"></span></label><span>Полная копия</span></div></div><p class="notes" style="text-align:center;margin:10px 0;">Сначала выберите режим, затем перетащите актера.</p><div class="drop-target" style="flex-grow:1;display:flex;flex-direction:column;justify-content:center;align-items:center;border:2px dashed #666;border-radius:5px;"><label style="font-weight:bold;font-size:14px;">2. Перенесите актера сюда</label><i class="fas fa-file-import fa-3x" style="color:#666;margin-top:10px;"></i></div></div>`;
    return $(template);
  }
async _onDrop(event) {
    const data = TextEditor.getDragEventData(event);
    if (data.type !== "Actor" || !data.uuid) return ui.notifications.warn("Можно перетаскивать только актеров!");

    const sourceActor = await fromUuid(data.uuid);
    if (!sourceActor) return;

    // Проблемная строка была удалена. Теперь мы просто берем данные из актера,
    // не создавая его временную копию, которая и вызывала ошибку.
    
    const isFullCopy = this.element.find('#save-mode-toggle').is(':checked');
    const sourceData = sourceActor.toObject(); // Получаем чистые данные напрямую

    if (isFullCopy) {
        await applyFullDisguise(this.actor, sourceData, this.token, this.sheet);
    } else {
        await applyVisualDisguise(this.actor, sourceData, this.token, this.sheet);
    }
    this._promptToSaveDisguise(sourceActor, isFullCopy);
    this.close();
}
  _promptToSaveDisguise(sourceActor, isFullCopy) {
    const dialogContent = isFullCopy ? `<p>Будет сохранена <b>полная копия</b> ${sourceActor.name}.</p>` : `<p>Будет сохранен <b>гибридный образ</b> (только внешность) от ${sourceActor.name}.</p>`;
    new Dialog({
        title: "Сохранить новый образ?",
        content: `${dialogContent}<form><div class="form-group"><label>Название образа:</label><input type="text" name="disguiseName" value="${sourceActor.name}"/></div></form>`,
        buttons: { yes: { icon: '<i class="fas fa-save"></i>', label: "Сохранить", callback: async (html) => {
            const name = html.find('[name="disguiseName"]').val();
            if (!name) return ui.notifications.warn("Необходимо ввести имя!");
            let dataToSave;
            const sourceData = sourceActor.toObject();
            if (isFullCopy) { dataToSave = sourceData; } 
            else { dataToSave = { name: sourceData.name, img: sourceData.img, prototypeToken: sourceData.prototypeToken, system: { traits: { size: sourceData.system.traits.size } } }; }
            dataToSave.name = name;
            let masterList = this.actor.getFlag('pf2e-token-pack', 'disguises') || [];
            const newId = foundry.utils.randomID();
            const flagKey = `data_${newId}`;
            masterList.push({ id: newId, name: name, type: isFullCopy ? 'full' : 'hybrid' });
            await this.actor.setFlag('pf2e-token-pack', flagKey, dataToSave);
            await this.actor.setFlag('pf2e-token-pack', 'disguises', masterList);
            ui.notifications.info(`Образ "${name}" сохранен!`);
        }}, no: { icon: '<i class="fas fa-times"></i>', label: "Не сохранять" } },
        default: "yes"
    }).render(true);
  }
}

class PhaseManagerApp extends Application {
  constructor(actor, token, sheet) { super(); this.actor = actor; this.token = token; this.sheet = sheet; }
  static get defaultOptions() { return foundry.utils.mergeObject(super.defaultOptions, { id: "phase-manager-app", title: "Менеджер Образов", width: 400, height: 500, resizable: true }); }
async getData() {
    let masterList = this.actor.getFlag('pf2e-token-pack', 'disguises') || [];
    
    // ИСПРАВЛЕНИЕ #1: Фильтруем "Оригинальный вид", чтобы он не отображался в списке
    const visibleList = masterList.filter(d => !d.isOriginal);

    // ИСПРАВЛЕНИЕ #2: Работаем с отфильтрованным списком, что решает ошибку
    const partition = visibleList.reduce((acc, d) => {
        const type = d.type || 'hybrid'; // Безопасное определение типа по умолчанию
        if (type === 'full') {
            acc.fulls.push(d);
        } else {
            acc.hybrids.push(d);
        }
        return acc;
    }, { fulls: [], hybrids: [] }); // Инициализируем с обоими ключами, чтобы избежать ошибки

    partition.fulls.sort((a,b) => a.name.localeCompare(b.name));
    partition.hybrids.sort((a,b) => a.name.localeCompare(b.name));
    
    // Загружаем картинки для отображения
    for (const disguise of [...partition.fulls, ...partition.hybrids]) {
        const flagKey = `data_${disguise.id}`;
        const data = this.actor.getFlag('pf2e-token-pack', flagKey);
        disguise.img = data?.img || CONST.DEFAULT_TOKEN;
    }
    return partition;
  }
  async _renderInner(data) {
    const renderList = (items, title) => {
        if (!items || !items.length) return '';
        let listHtml = `<h3 style="text-align:center;border-bottom:1px solid #ccc;margin:10px 0 5px 0;font-size:16px;">${title}</h3>`;
        items.forEach(d => {
            listHtml += `<li class="phase-item" data-id="${d.id}" data-type="${d.type}" style="display:flex;align-items:center;padding:5px;border-bottom:1px solid #ccc;"><img src="${d.img}" style="width:36px;height:36px;object-fit:cover;margin-right:10px;border:none;"/><span style="flex-grow:1;">${d.name}</span><a class="apply-phase" title="Применить" style="cursor:pointer;margin-left:10px;"><i class="fas fa-play"></i></a>`;
            if (!d.isOriginal && d.type === 'full') listHtml += `<a class="edit-phase" title="Редактировать" style="cursor:pointer;margin-left:10px;"><i class="fas fa-edit"></i></a>`;
            if (!d.isOriginal) listHtml += `<a class="delete-phase" title="Удалить" style="margin-left:10px;cursor:pointer;"><i class="fas fa-trash"></i></a>`;
            listHtml += `</li>`;
        });
        return listHtml;
    };
    let content = `<ul class="phase-list" style="list-style:none;padding:0;margin:0;">`;
    content += renderList(data.hybrids, "Гибридные образы (Скины)");
    content += renderList(data.fulls, "Полные копии (Фазы)");
    if (!data.hybrids.length && !data.fulls.length) content += `<li style="padding:10px;text-align:center;">Нет сохраненных образов.</li>`;
    content += `</ul>`;
    return $(`<div>${content}</div>`);
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
      if (!tempActor) return ui.notifications.error("Не удалось создать актера для редактирования.");
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
              ui.notifications.info(`Образ "${updatedSource.name}" сохранен!`);
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
    if (!masterList.some(d => d.isOriginal)) {
        const originalSource = actor.toObject();
        const originalVisualData = { name: originalSource.name, img: originalSource.img, prototypeToken: originalSource.prototypeToken, system: { traits: { size: originalSource.system.traits.size }}};
        const newList = [{ id: 'original', name: "Оригинальный вид", isOriginal: true, type: 'hybrid' }, ...masterList];
        
        await actor.setFlag('pf2e-token-pack', 'data_original', originalSource);
        await actor.setFlag('pf2e-token-pack', 'data_original_visuals', originalVisualData);
        await actor.setFlag('pf2e-token-pack', 'disguises', newList);
        await actor.setFlag('pf2e-token-pack', 'active_mode', 'hybrid');
        ui.notifications.info("Оригинальный вид актера сохранен.");
    }
    new Dialog({
        title: "Маск-Фаза", content: `<p>Выберите необходимое действие:</p>`,
        buttons: {
            disguise: { icon: '<i class="fas fa-user-plus"></i>', label: "Новый образ", callback: () => new DisguiseApp(actor, token, sheet).render(true) },
            phases: { icon: '<i class="fas fa-layer-group"></i>', label: "Сохраненные образы", callback: () => new PhaseManagerApp(actor, token, sheet).render(true) },
            reset: { icon: '<i class="fas fa-undo"></i>', label: "Сброс к оригиналу",
                callback: async () => {
                    const originalVisualData = actor.getFlag('pf2e-token-pack', 'data_original_visuals');
                    if (originalVisualData) await applyVisualDisguise(actor, originalVisualData, token, sheet);
                    else ui.notifications.warn("Оригинальный вид не найден для сброса!");
                }
            }
        }
    }, { width: 600, classes: ["dialog", "mask-phase-dialog"] }).render(true);
}

// Хук для добавления кнопки в заголовок листа актера
Hooks.on("getActorSheetHeaderButtons", (app, buttons) => {
  // Выполнять только для ГМ и только для актеров типа 'npc'
  if (!game.user.isGM || app.object?.type !== 'npc') {
    return;
  }
  
  buttons.unshift({
    label: "Маск-Фаза",
    class: "mask-phase",
    icon: "fas fa-user-mask",
    onclick: () => openMainMenu(app.object, app.token, app)
  });
});

// Хук для добавления иконки в HUD токена
Hooks.on("renderTokenHUD", (hud, html) => {
    const token = hud.object;

    // Выполнять только для ГМ и только если токен связан с актером типа 'npc'
    if (!game.user.isGM || token.actor?.type !== 'npc') {
        return;
    }

    const button = $(`<div class="control-icon" title="Маск-Фаза"><i class="fas fa-user-secret"></i></div>`);
    button.on('click', (event) => {
        event.stopPropagation();
        openMainMenu(token.actor, token.document, token.actor.sheet);
    });
    $(html).find('.col.right').prepend(button);
});