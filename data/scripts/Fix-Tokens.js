// --- КЛАССЫ ИНТЕРФЕЙСА ---
class ExclusionForm extends FormApplication {
    static get defaultOptions() { 
        return mergeObject(super.defaultOptions, { 
            width: 550, 
            height: 'auto', 
            classes: ['pf2e-token-pack', 'exclusion-form'], 
            template: `modules/pf2e-token-pack/data/templates/Fix-Tokens.hbs`, 
            resizable: true, 
            closeOnSubmit: true, 
        }); 
    }
    activateListeners(html) { super.activateListeners(html); html.on('change', 'input[type="checkbox"]', (event) => { const checkbox = event.currentTarget; const details = $(checkbox).closest('details'); if(details.length) { details.find('.tree-node input[type="checkbox"]').prop('checked', checkbox.checked); } }); }
    async _updateObject(event, formData) { const selectedIds = Object.keys(formData).filter(key => formData[key]); await game.settings.set('pf2e-token-pack', this.options.setting, selectedIds); ui.notifications.info(game.i18n.localize("FixTokens.ExclusionsSaved")); }
}

class ExcludeTypesForm extends ExclusionForm {
    static get defaultOptions() { return mergeObject(super.defaultOptions, { id: 'fix-tokens-exclude-types', title: game.i18n.localize("FixTokens.ExcludeTypesTitle"), setting: 'fix-tokens-excluded-types', header: game.i18n.localize("FixTokens.ExcludeTypesHeader") }); }
    
    async getData() {
        const saved = game.settings.get('pf2e-token-pack', 'fix-tokens-excluded-types');
        // <<< ИСПРАВЛЕНИЕ: Добавлен фильтр, чтобы убрать 'party' из списка
        const allTypes = [...new Set(game.actors.map(a => a.type).filter(t => t && t !== 'party'))].sort();
        const getLocalizedType = (type) => game.i18n.localize(`FixTokens.ActorTypes.${type}`) ?? type;
        
        return { 
            title: this.options.title, 
            header: this.options.header, 
            options: allTypes.map(type => ({ 
                id: type, 
                name: getLocalizedType(type), 
                checked: saved.includes(type) 
            })) 
        };
    }
}

// Замените этот класс целиком
class ExcludeActorsForm extends ExclusionForm {
    static get defaultOptions() { return mergeObject(super.defaultOptions, { id: 'fix-tokens-exclude-actors', title: "Исключение по актерам", setting: 'fix-tokens-manual-excluded-actors', header: "Выберите актеров для исключения из обработки", height: 700 }); }
    
    buildActorTree() {
        // <<< ИСПРАВЛЕНИЕ: Аккуратно добавляем логику выбора по умолчанию в вашу рабочую версию
        let saved = game.settings.get('pf2e-token-pack', 'fix-tokens-manual-excluded-actors');
        const defaultSet = game.settings.get('pf2e-token-pack', 'actor-default-set');
        const partyForDefault = game.actors.find(a => a.type === 'party');

        if (!defaultSet && partyForDefault) {
            const idsToDefault = [partyForDefault.id, ...partyForDefault.members.map(m => m.id)];
            saved = Array.from(new Set([...saved, ...idsToDefault]));
        }
        // Конец блока по умолчанию. Дальше идет ваша оригинальная, рабочая логика.

        const nodeMap = new Map();
        const party = game.actors.find(a => a.type === 'party');
        const partyMemberIds = new Set(party ? party.members.map(m => m.id) : []);
        const folders = game.folders.filter(f => f.type === 'Actor');
        const actors = game.actors.filter(a => a.type !== "party" && !partyMemberIds.has(a.id));

        folders.forEach(f => nodeMap.set(f.id, { id: f.id, name: f.name, checked: saved.includes(f.id), children: [], isFolder: true, parentId: f.folder?.id || null, sort: f.sort }));
        actors.forEach(a => nodeMap.set(a.id, { id: a.id, name: a.name, checked: saved.includes(a.id), children: [], isActor: true, parentId: a.folder?.id || null, sort: a.sort }));
        
        if (party) {
            const partyNode = { id: party.id, name: party.name, checked: saved.includes(party.id), children: [], isFolder: true, parentId: null, sort: -1 };
            party.members.forEach(member => {
                const memberNode = { id: member.id, name: member.name, checked: saved.includes(member.id), children: [], isActor: true, parentId: party.id, sort: member.sort };
                partyNode.children.push(memberNode);
            });
            nodeMap.set(party.id, partyNode);
        }

        const tree = [];
        nodeMap.forEach(node => {
            const parent = node.parentId ? nodeMap.get(node.parentId) : null;
            if (parent) {
                parent.children.push(node);
            } else {
                tree.push(node);
            }
        });
        
        const sortRecursive = (nodes) => {
            nodes.sort((a, b) => (a.isFolder === b.isFolder ? 0 : a.isFolder ? -1 : 1) || a.sort - b.sort || a.name.localeCompare(b.name, "ru"));
            nodes.forEach(node => sortRecursive(node.children));
        };
        sortRecursive(tree);
        return tree;
    }

    async getData() { return { title: this.options.title, header: this.options.header, options: this.buildActorTree(), isTree: true, isActors: true }; }
    
    // <<< ИСПРАВЛЕНИЕ: Добавляем метод для установки флага после первого сохранения
    async _updateObject(event, formData) {
        await super._updateObject(event, formData);
        if (!game.settings.get('pf2e-token-pack', 'actor-default-set')) {
            await game.settings.set('pf2e-token-pack', 'actor-default-set', true);
        }
    }

    activateListeners(html) {
        super.activateListeners(html);
        const searchInput = html.find('#actor-search');
        if (!searchInput.length) return;
        searchInput.on('input', (event) => {
            const searchTerm = $(event.currentTarget).val().toLowerCase().trim();
            const allNodes = html.find('.tree-node');
            if (!searchTerm) { allNodes.show(); return; }
            const visibleIds = new Set();
            allNodes.filter((i, el) => $(el).data('name').toLowerCase().includes(searchTerm) && $(el).find('input').length > 0 && !$(el).find('.tree-node').length).each((i, el) => {
                const node = $(el);
                visibleIds.add(node.data('id'));
                node.parents('.tree-node').each((i, parent) => { visibleIds.add($(parent).data('id')); });
            });
            allNodes.each((i, el) => {
                const node = $(el);
                if (visibleIds.has(node.data('id'))) { node.show(); node.parents('details').prop('open', true); } else { node.hide(); }
            });
        });
    }
}
class MainMenuForm extends FormApplication {
    static get defaultOptions() { return mergeObject(super.defaultOptions, { id: "fix-tokens-main-menu", title: game.i18n.localize("FixTokens.MainMenuTitle"), width: 550, height: "auto", classes: ["pf2e-token-pack"], template: `data:text/html,`, closeOnSubmit: false }); }
    
    _renderInner() {
        const menuItems = [ { key: 'ExcludedTypes', hint: 'ExcludedTypesHint', action: 'manage-types' }, { key: 'ExcludedActors', hint: 'ExcludedActorsHint', action: 'manage-actors' }];
        let content = `<div class="form-group"><h3>${game.i18n.localize("FixTokens.ManageExclusions")}</h3></div>`;
        menuItems.forEach(item => { content += `<div class="form-group main-menu-row"><label>${game.i18n.localize("FixTokens." + item.key) ?? item.key}</label><button type="button" data-action="${item.action}" title="${game.i18n.localize("FixTokens."+item.hint)}"><i class="fas fa-cogs"></i> ${game.i18n.localize("FixTokens.ButtonManage")}</button></div>`; });
        content += `<hr><div class="form-group main-menu-row"><label>${game.i18n.localize("FixTokens.MenuName")}</label><button type="button" class="run-button" data-action="run-fix" title="${game.i18n.localize("FixTokens.RunFixHint")}"><i class="fas fa-play"></i> ${game.i18n.localize("FixTokens.ButtonRun")}</button></div>`;
        const styles = `<style>.main-menu-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }.main-menu-row label { flex-grow: 1; margin: 0; }.main-menu-row button { flex-basis: 120px; }.run-button { background-color: #4caf50; color: white; }</style>`;
        return $(styles + content);
    }
    async render(force, options) { const content = this._renderInner(); const template = `<form>${content[1].outerHTML}</form>`; this.options.template = `data:text/html,${encodeURIComponent(template)}`; return super.render(force, options); }
    
    activateListeners(html) { super.activateListeners(html); html.on('click', 'button', this._onButtonClick.bind(this)); }
    
    async _onButtonClick(event) {
        event.preventDefault();
        const action = event.currentTarget.dataset.action;
        switch (action) {
            case 'manage-types': new ExcludeTypesForm().render(true); break;
            case 'manage-actors': new ExcludeActorsForm().render(true); break;
            case 'run-fix': this.close(); runUpdateScript(); break;
        }
    }
}

// --- ОСНОВНАЯ ЛОГИКА ---
function isActorExcludedBySettings(actor) {
    const excludedTypes = game.settings.get('pf2e-token-pack', 'fix-tokens-excluded-types');
    if (excludedTypes.includes(actor.type)) return true;
    return false;
}

async function runUpdateScript() {
    ui.notifications.info(game.i18n.localize("FixTokens.CheckStarted"));
    const manualExcludedIds = game.settings.get('pf2e-token-pack', 'fix-tokens-manual-excluded-actors');
    const updatedActors = [], notUpdatedActors = [], updatedTokens = [];

    for (const actor of game.actors.contents) {
        if (isActorExcludedBySettings(actor) || manualExcludedIds.includes(actor.id) || actor.type === 'party') continue;
        
        let original = null;
        const source = actor._stats?.compendiumSource;
        if (source) { const doc = await fromUuid(source); if (doc?.pack) original = doc; }
        if (!original && source) { const match = source.match(/^Actor\.(\w{16})$/); if (match) { const actorId = match[1]; for (const pack of game.packs.filter(p => p.documentName === "Actor")) { if (pack.index.size === 0) await pack.getIndex({ fields: ["_id"] }); if (pack.index.has(actorId)) { original = await pack.getDocument(actorId); break; } } } }
        if (!original) { const babeleName = actor.flags?.babele?.originalName; if (babeleName) { for (const pack of game.packs.filter(p => p.documentName === "Actor")) { if (pack.index.size === 0) await pack.getIndex({ fields: ["name"] }); const entry = pack.index.find(i => i.name === babeleName); if (entry) { original = await pack.getDocument(entry._id); break; } } } }
        if (!original) {
            notUpdatedActors.push({ name: actor.name, reason: game.i18n.localize("FixTokens.SourceNotFound") });
            continue;
        }

        // --- ЛОГИКА ОБНОВЛЕНИЯ, ОСНОВАННАЯ НА ВАШЕМ ОРИГИНАЛЬНОМ СКРИПТЕ ---

        // 1. Обновление прототипа токена актера
        const currentPT = actor.prototypeToken.toObject();
        const originalPT = original.prototypeToken.toObject();
        const updatedPT = foundry.utils.deepClone(currentPT);
        let needsPrototypeUpdate = false;
        
        if (currentPT.texture.scaleX !== originalPT.texture.scaleX) { updatedPT.texture.scaleX = originalPT.texture.scaleX; needsPrototypeUpdate = true; }
        if (currentPT.texture.scaleY !== originalPT.texture.scaleY) { updatedPT.texture.scaleY = originalPT.texture.scaleY; needsPrototypeUpdate = true; }
        if (originalPT.ring?.enabled !== undefined && updatedPT.ring?.enabled !== originalPT.ring.enabled) { foundry.utils.setProperty(updatedPT, "ring.enabled", originalPT.ring.enabled); needsPrototypeUpdate = true; }
        if (originalPT.ring?.enabled) {
            if (currentPT.ring?.subject?.scale !== originalPT.ring.subject.scale) { foundry.utils.setProperty(updatedPT, "ring.subject.scale", originalPT.ring.subject.scale); needsPrototypeUpdate = true; }
            if (currentPT.ring?.subject?.texture !== originalPT.ring.subject.texture) { foundry.utils.setProperty(updatedPT, "ring.subject.texture", originalPT.ring.subject.texture); needsPrototypeUpdate = true; }
            if (currentPT.texture.src !== original.img) { updatedPT.texture.src = original.img; needsPrototypeUpdate = true; }
        } else {
            if (currentPT.texture.src !== originalPT.texture.src) { updatedPT.texture.src = originalPT.texture.src; needsPrototypeUpdate = true; }
        }
        if (foundry.utils.getProperty(updatedPT, "flags.pf2e.autoscale") !== false) { foundry.utils.setProperty(updatedPT, "flags.pf2e.autoscale", false); needsPrototypeUpdate = true; }
        
        const actorUpdateData = {};
        if (actor.img !== original.img) { actorUpdateData.img = original.img; }
        if (needsPrototypeUpdate) { actorUpdateData.prototypeToken = updatedPT; }

        if (Object.keys(actorUpdateData).length > 0) {
            await actor.update(actorUpdateData);
            updatedActors.push(actor.name);
        }

        // 2. Обновление токенов на сценах
        for (const scene of game.scenes) {
            for (const tokenDoc of scene.tokens.filter(t => t.actorId === actor.id && !t.isLinked)) {
                const currentToken = tokenDoc.toObject();
                const tokenUpdateData = {};
                const patch = (path, currentVal, originalVal) => { if (currentVal !== originalVal) tokenUpdateData[path] = originalVal; };
                
                patch("texture.scaleX", currentToken.texture.scaleX, originalPT.texture.scaleX);
                patch("texture.scaleY", currentToken.texture.scaleY, originalPT.texture.scaleY);
                patch("ring.enabled", currentToken.ring?.enabled, originalPT.ring?.enabled);

                if (originalPT.ring?.enabled) {
                    patch("ring.subject.scale", currentToken.ring?.subject?.scale, originalPT.ring?.subject?.scale);
                    patch("ring.subject.texture", currentToken.ring?.subject?.texture, originalPT.ring?.subject?.texture);
                    patch("texture.src", currentToken.texture.src, original.img);
                } else {
                    patch("texture.src", currentToken.texture.src, originalPT.texture.src);
                }
                patch("flags.pf2e.autoscale", currentToken.flags?.pf2e?.autoscale, false);

                if (Object.keys(tokenUpdateData).length > 0) {
                    await tokenDoc.update(tokenUpdateData);
                    if (!updatedTokens.find(t => t.startsWith(actor.name))) {
                        updatedTokens.push(`${actor.name} ${game.i18n.localize("FixTokens.OnScenes")}`);
                    }
                }
            }
        }
    }

    // Финальный отчет
    if (updatedActors.length === 0 && updatedTokens.length === 0 && notUpdatedActors.length === 0) {
        const style = "color: #4CAF50; font-weight: bold;";
        console.log(`%c[PF2E-TOKEN-PACK]`, style, game.i18n.localize("FixTokens.AllOk")); 
        ui.notifications.info(game.i18n.localize("FixTokens.AllOk"));
        return;
    }

    const reportTitle = game.i18n.localize("FixTokens.ReportTitle");
    console.groupCollapsed(`%c[PF2E-TOKEN-PACK] ${reportTitle}`, "color: #4CAF50; font-weight: bold; font-size: 14px;");

    if (updatedActors.length) { console.groupCollapsed(`✅ ${game.i18n.format("FixTokens.UpdatedActors", { count: updatedActors.length })}`); updatedActors.forEach(name => console.log(name)); console.groupEnd(); }
    if (notUpdatedActors.length) { console.groupCollapsed(`❌ ${game.i18n.format("FixTokens.FailedActors", { count: notUpdatedActors.length })}`); notUpdatedActors.forEach(({ name, reason }) => console.log(`${name}: ${reason}`)); console.groupEnd(); }
    if (updatedTokens.length) { console.groupCollapsed(`✅ ${game.i18n.format("FixTokens.UpdatedTokens", { count: updatedTokens.length })}`); updatedTokens.forEach(name => console.log(name)); console.groupEnd(); }
    console.groupEnd();
    ui.notifications.info(game.i18n.localize("FixTokens.CheckComplete"));
    new Dialog({ title: game.i18n.localize("FixTokens.ReloadDialogTitle"), content: `<p>${game.i18n.localize("FixTokens.ReloadDialogContent")}</p>`, buttons: { cancel: { icon: '<i class="fas fa-check"></i>', label: "Ок" } }, default: "cancel" }).render(true);
}

// --- РЕГИСТРАЦИЯ В FOUNDRY ---
Hooks.once("init", () => {
    game.settings.register("pf2e-token-pack", "fix-tokens-excluded-types", { 
        scope: "world", 
        config: false, 
        type: Array, 
        default: ["character", "hazard", "loot", "familiar", "vehicle"] 
    });

    game.settings.register("pf2e-token-pack", "fix-tokens-manual-excluded-actors", { 
        scope: "world", 
        config: false, 
        type: Array, 
        default: [] 
    });
    
    // <<< ДОБАВЛЕНА НАСТРОЙКА-ФЛАГ
    game.settings.register("pf2e-token-pack", "actor-default-set", { 
        scope: "world", 
        config: false, 
        type: Boolean, 
        default: false 
    });

    game.settings.registerMenu("pf2e-token-pack", "myScriptMenu", { 
        name: game.i18n.localize("FixTokens.MenuName"), 
        label: game.i18n.localize("FixTokens.MenuLabel"), 
        hint: game.i18n.localize("FixTokens.MenuHint"), 
        icon: "fas fa-cogs", 
        type: MainMenuForm, 
        restricted: true 
    });
});