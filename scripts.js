class PathfinderBestiaryTokenPack {
  static async initSettings() {
    this.keys = [
    { key: "pathfinder-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.Pathfinder Bestiary"), packName: "pf2e.pathfinder-bestiary" },
    { key: "pathfinder-bestiary-2", name: game.i18n.localize("PF2E-TOKEN-PACK.Pathfinder Bestiary 2"), packName: "pf2e.pathfinder-bestiary-2"  },
    { key: "pathfinder-bestiary-3", name: game.i18n.localize("PF2E-TOKEN-PACK.Pathfinder Bestiary 3"), packName: "pf2e.pathfinder-bestiary-3"  },
    { key: "pathfinder-monster-core", name: game.i18n.localize("PF2E-TOKEN-PACK.Pathfinder Monster Core"), packName: "pf2e.pathfinder-monster-core"  },
    { key: "pathfinder-npc-core", name: game.i18n.localize("PF2E-TOKEN-PACK.Pathfinder NPC Core"), packName: "pf2e.pathfinder-npc-core"  },
    { key: "abomination-vaults-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.Abomination Vaults Bestiary"), packName: "pf2e.abomination-vaults-bestiary"  },
    { key: "age-of-ashes-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.Age of Ashes Bestiary"), packName: "pf2e.age-of-ashes-bestiary"  },
    { key: "agents-of-edgewatch-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.Agents of Edgewatch Bestiary"), packName: "pf2e.agents-of-edgewatch-bestiary"  },
    { key: "blood-lords-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.Blood Lords Bestiary"), packName: "pf2e.blood-lords-bestiary"  },
    { key: "curtain-call-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.Curtain Call Bestiary"), packName: "pf2e.curtain-call-bestiary"  },
    { key: "extinction-curse-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.Extinction Curse Bestiary"), packName: "pf2e.extinction-curse-bestiary"  },
    { key: "fists-of-the-ruby-phoenix-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.Fists of the Ruby Phoenix Bestiary"), packName: "pf2e.fists-of-the-ruby-phoenix-bestiary"  },
    { key: "gatewalkers-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.Gatewalkers Bestiary"), packName: "pf2e.gatewalkers-bestiary"  },
    { key: "outlaws-of-alkenstar-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.Outlaws of Alkenstar Bestiary"), packName: "pf2e.outlaws-of-alkenstar-bestiary"  },
    { key: "kingmaker-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.Kingmaker Bestiary"), packName: "pf2e.kingmaker-bestiary"  },
    { key: "quest-for-the-frozen-flame-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.Quest for the Frozen Flame Bestiary"), packName: "pf2e.quest-for-the-frozen-flame-bestiary"  },
    { key: "season-of-ghosts-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.Season of Ghosts Bestiary"), packName: "pf2e.season-of-ghosts-bestiary"  },
    { key: "seven-dooms-for-sandpoint-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.Seven Dooms for Sandpoint Bestiary"), packName: "pf2e.seven-dooms-for-sandpoint-bestiary"  },
    { key: "sky-kings-tomb-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.Sky King's Tomb Bestiary"), packName: "pf2e.sky-kings-tomb-bestiary"  },
    { key: "strength-of-thousands-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.Strength of Thousands Bestiary"), packName: "pf2e.strength-of-thousands-bestiary"   },
    { key: "stolen-fate-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.Stolen Fate Bestiary"), packName: "pf2e.stolen-fate-bestiary"  },
    { key: "wardens-of-wildwood-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.Wardens of Wildwood Bestiary"), packName: "pf2e.wardens-of-wildwood-bestiary"  },
    { key: "book-of-the-dead-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.Book of the Dead Bestiary"), packName: "pf2e.book-of-the-dead-bestiary"  },
    { key: "blog-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.Paizo Blog Bestiary"), packName: "pf2e.blog-bestiary"  },
    { key: "howl-of-the-wild-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.Howl of the Wild Bestiary"), packName: "pf2e.howl-of-the-wild-bestiary"  },
    { key: "lost-omens-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.Lost Omens Bestiary"), packName: "pf2e.lost-omens-bestiary"  },
    { key: "npc-gallery", name: game.i18n.localize("PF2E-TOKEN-PACK.NPC Gallery"), packName: "pf2e.npc-gallery"  },
    { key: "pathfinder-dark-archive", name: game.i18n.localize("PF2E-TOKEN-PACK.Pathfinder Dark Archive"), packName: "pf2e.pathfinder-dark-archive"  },
    { key: "rage-of-elements-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.Rage of Elements Bestiary"), packName: "pf2e.rage-of-elements-bestiary"  },
    { key: "war-of-immortals-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.War of Immortals Bestiary"), packName: "pf2e.war-of-immortals-bestiary"  },
    { key: "claws-of-the-tyrant-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.Claws of the Tyrant Bestiary"), packName: "pf2e.claws-of-the-tyrant-bestiary"  },
    { key: "fall-of-plaguestone-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.Fall of Plaguestone Bestiary"), packName: "pf2e.fall-of-plaguestone-bestiary"  },
    { key: "malevolence-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.Malevolence Bestiary"), packName: "pf2e.malevolence-bestiary"  },
    { key: "menace-under-otari-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.Menace Under Otari Bestiary"), packName: "pf2e.menace-under-otari-bestiary"  },
    { key: "one-shot-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.One Shot Bestiary"), packName: "pf2e.one-shot-bestiary"  },
    { key: "prey-for-death-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.Prey for Death Bestiary"), packName: "pf2e.prey-for-death-bestiary"  },
    { key: "rusthenge-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.Rusthenge Bestiary"), packName: "pf2e.rusthenge-bestiary"  },
    { key: "shadows-at-sundown-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.Shadows at Sundown Bestiary"), packName: "pf2e.shadows-at-sundown-bestiary"  },
    { key: "the-enmity-cycle-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.The Enmity Cycle Bestiary"), packName: "pf2e.the-enmity-cycle-bestiary"  },
    { key: "the-slithering-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.The Slithering Bestiary"), packName: "pf2e.the-slithering-bestiary"  },
    { key: "troubles-in-otari-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.Troubles in Otari Bestiary"), packName: "pf2e.troubles-in-otari-bestiary"  },
    { key: "night-of-the-gray-death-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.Night of the Gray Death Bestiary"), packName: "pf2e.night-of-the-gray-death-bestiary"  },
    { key: "crown-of-the-kobold-king-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.Crown of the Kobold King Bestiary"), packName: "pf2e.crown-of-the-kobold-king-bestiary"  },
    { key: "paizo-pregens", name: game.i18n.localize("PF2E-TOKEN-PACK.Paizo Pregens"), packName: "pf2e.paizo-pregens"  },
    { key: "iconics", name: game.i18n.localize("PF2E-TOKEN-PACK.Iconics"), packName: "pf2e.iconics"  }
    ];
    
    this.previousSettings = {};
    this.settingsChanged = true;
    
    this.keys.forEach(({key, name, hint}) => {
      game.settings.register("pf2e-token-pack", `enableOverwrite${key}`, {
        name: name,
        hint: hint,
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
        onChange: () => this.onSettingChange(),
      });
      
      this.previousSettings[`enableOverwrite${key}`] = game.settings.get("pf2e-token-pack", `enableOverwrite${key}`);
    });
  }
  
  
  static init() {
    
    game.socket.on("module.pf2e-token-pack", async data => {
      if (data.action === "overwriteBestiary" && game.user.isGM) {
        await this.updateBestiary(true);
      }
    });
  }
  
  static async fetchBestiaryData() {
    const response = await fetch('modules/pf2e-token-pack/bestiaries.json');
    if (!response.ok) throw new Error(game.i18n.localize("PF2E-TOKEN-PACK.Failed to fetch"));
    return await response.json();
  }
  
  static async uploadBestiary(data, fileName) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const result = await FilePicker.upload("data", "modules/pf2e-token-pack", new File([blob], fileName), {});
    if (result.status !== "success") throw new Error(game.i18n.format("PF2E-TOKEN-PACK.Failed to upload", { file: fileName }));
  }
  
  static async updateBestiary(reload = false) {
    try {
      let bestiaryData = await this.fetchBestiaryData();
      let modified = false;
      
      for (const { key } of this.keys) {
        const enableOverwrite = game.settings.get("pf2e-token-pack", `enableOverwrite${key}`);
        const keyedKey = `${key}Ю`;
        
        if (enableOverwrite && !(keyedKey in bestiaryData)) {
          bestiaryData = this.modifyKeys(bestiaryData, key, keyedKey);
          modified = true;
        } else if (!enableOverwrite && (keyedKey in bestiaryData)) {
          bestiaryData = this.modifyKeys(bestiaryData, keyedKey, key);
          modified = true;
        }
        
        this.previousSettings[`enableOverwrite${key}`] = enableOverwrite;
      }
      
      if (modified) {
        await this.uploadBestiary(bestiaryData, "bestiaries.json");
      }
      
      if (reload && modified) {
        window.location.reload();  // Перезагружаем страницу после изменения файла
      } else if (reload) {
        ui.notifications.info(game.i18n.localize("PF2E-TOKEN-PACK.NoChanges"));
      }
      
    } catch (error) {
      console.error(error);
      ui.notifications.error(game.i18n.format("PF2E-TOKEN-PACK.Error", { message: error.message }));
    }
  }
  
  static modifyKeys(data, oldKey, newKey) {
    if (oldKey in data) {
      data[newKey] = data[oldKey];
      delete data[oldKey];
    }
    return data;
  }
  
  static async onSettingChange() {
    this.settingsChanged = true;
    this.debouncedUpdateBestiary();
  }
  
  static debouncedUpdateBestiary() {
    clearTimeout(this.debouncedUpdateBestiaryTimeout);
    this.debouncedUpdateBestiaryTimeout = setTimeout(async () => {
      await this.updateBestiary(false);
      if (this.settingsChanged) {
        this.showReloadDialog();
        this.settingsChanged = false;
      }
    }, 300); // Задержка перед обновлением файла для предотвращения частых перезаписей
  }
  
  static async showReloadDialog() {
    new Dialog({
      title: game.i18n.localize("PF2E-TOKEN-PACK.ReloadDialogTitle"),
      content: `<p>${game.i18n.localize("PF2E-TOKEN-PACK.ReloadDialogContent")}</p>`,
      buttons: {
        ok: {
          label: game.i18n.localize("PF2E-TOKEN-PACK.ReloadButton"),
          callback: () => window.location.reload(),
        },
        cancel: {
          label: game.i18n.localize("PF2E-TOKEN-PACK.LaterButton"),
          callback: () => this.showPostponeDialog(),},
        },
        default: "ok",
      }).render(true);
    }
    
    static async showPostponeDialog() {
      new Dialog({
        title: game.i18n.localize("PF2E-TOKEN-PACK.PostponeDialogTitle"),
        content: `<p>${game.i18n.localize("PF2E-TOKEN-PACK.PostponeDialogContent")}</p>`,
        buttons: {
          ok: {
            label: game.i18n.localize("PF2E-TOKEN-PACK.UnderstoodButton"),
            callback: () => console.log(game.i18n.localize("PF2E-TOKEN-PACK.Settings notification"))
          },
        },
        default: "ok",
      }).render(true);
    }
    
    static async checkBestiaryArt(key) {
      try {
        const response = await fetch("modules/pf2e-token-pack/bestiaries.json");
        const data = await response.json();
        const bestiary = data[key];
        
        if (!bestiary) {
          ui.notifications.warn(game.i18n.format("PF2E-TOKEN-PACK.WarnNoDataForKey", { key }));
          return;
        }
        
        const keyObj = PathfinderBestiaryTokenPack.keys.find(k => k.key === key);
        if (!keyObj || !keyObj.packName) {
          ui.notifications.error(game.i18n.format("PF2E-TOKEN-PACK.ErrorCompendiumNotFound", { key }));
          return;
        }
        const packName = keyObj.packName;
        
        const pack = game.packs.get(packName);
        if (!pack) {
          ui.notifications.error(game.i18n.format("PF2E-TOKEN-PACK.ErrorCompendiumNotLoaded", {packName}));
          return;
        }
        
        const index = await pack.getIndex();
        
        const mismatches = [];
        const withoutImages = [];
        const deadIds = [];
        const filesToDelete = new Set();
        
        for (const [actorId, expected] of Object.entries(bestiary)) {
          const isUUID = /^[A-Za-z0-9]{16,}$/.test(actorId);
          if (!isUUID) {
            withoutImages.push(actorId);
            continue;
          }
          
          const entry = index.find(e => e._id === actorId);
          if (!entry) {
            mismatches.push(`${game.i18n.localize("PF2E-TOKEN-PACK.ActorNotFound")} ${actorId} ${game.i18n.localize("PF2E-TOKEN-PACK.InCompendium")} ${pack.metadata.label}`);
            if (expected.actor) filesToDelete.add(expected.actor);
            const tokenPath = typeof expected.token === "string" ? expected.token : expected.token?.img;
            if (tokenPath) filesToDelete.add(tokenPath);
            deadIds.push(actorId);
            continue;
          }
          
          const actor = await pack.getDocument(actorId);
          const actorName = actor.name;
          
          const expectedActorImg = expected.actor;
          const expectedTokenImg = typeof expected.token === "string" ? expected.token : expected.token.img;
          const expectedScale = typeof expected.token === "object" && expected.token.scale !== undefined
          ? expected.token.scale
          : 1;
          
          const actualActorImg = actor.img;
          const actualTokenImg = actor.prototypeToken.texture?.src ?? "";
          const actualScaleX = actor.prototypeToken.texture?.scaleX ?? 1;
          const actualScaleY = actor.prototypeToken.texture?.scaleY ?? 1;
          
          if (actualActorImg !== expectedActorImg)
          mismatches.push(`${actorName}: ${game.i18n.localize("PF2E-TOKEN-PACK.ArtDiffers")}\n🔺 ${actualActorImg}\n🔻 ${expectedActorImg}`);
          if (actualTokenImg !== expectedTokenImg)
          mismatches.push(`🧍 ${actorName}: ${game.i18n.localize("PF2E-TOKEN-PACK.TokenDiffers")}\n🔺 ${actualTokenImg}\n🔻 ${expectedTokenImg}`);
          if (expected.token?.scale !== undefined) {
            if (Math.abs(actualScaleX - expectedScale) > 0.01 || Math.abs(actualScaleY - expectedScale) > 0.01)
            mmismatches.push(`📏 ${actorName}: ${game.i18n.localize("PF2E-TOKEN-PACK.TokenScaleDiffers")}\n🔺 ${actualScaleX}/${actualScaleY} ≠ ${expectedScale}`);
          }
        }
        
        const notFoundCount = deadIds.length;
        
        const showMismatchDialog = () => {
          if (mismatches.length > 0) {
            new Dialog({
              title: game.i18n.format("PF2E-TOKEN-PACK.CheckTitle", { name: keyObj.name }),
              content: `<p>${game.i18n.format("PF2E-TOKEN-PACK.ActorsNotFoundInCompendium", { count: notFoundCount })}</p>
              <div style="max-height: 400px; overflow-y: auto;">${mismatches.join("<br><br>")}</div>`,
              buttons: {
                ok: {
                  label: "OK",
                  callback: () => {
                    new Dialog({
                      title: game.i18n.format("PF2E-TOKEN-PACK.CheckCompleteTitle", { name: keyObj.name }),
                      content: `<p>${game.i18n.localize("PF2E-TOKEN-PACK.AllValid")}</p>`,
                      buttons: { ok: { label: "OK" } },
                      default: "ok"
                    }).render(true);
                  }
                },
                generate: {
                  label: game.i18n.localize("PF2E-TOKEN-PACK.GenerateScript"),
                  callback: async () => {
                    const scriptContent = `
                    // cleanup-dead-actors-${key}.js
                    const fs = require('fs');
                    const path = require('path');
                    
                    const foundryDataPath = "C:/Users/Metof/AppData/Local/FoundryVTT/Data/modules/pf2e-token-pack";
                    
                    const jsonPath = path.join(foundryDataPath, 'bestiaries.json');
                    let data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
                    
                    const actorIds = ${JSON.stringify(deadIds, null, 2)};
                    const filePaths = ${JSON.stringify(Array.from(filesToDelete), null, 2)};
                    
                    if (!data['${key}']) {
                      console.error("❌ The key was not found '{key}' in bestiaries.json",); 
                      process.exit(1);
                    }
                    
                    for (const id of actorIds) {
                      delete data['${key}'][id];
                    }
                    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
                    console.log("✅ Updated bestiaries.json");
                    
                    for (const f of filePaths) {
                      const localPath = f.replace("modules/pf2e-token-pack/", "");
                      const fullPath = path.join(foundryDataPath, localPath);
                      
                      if (fs.existsSync(fullPath)) {
                        fs.unlinkSync(fullPath);
                        console.log("🗑 Deleted:", f);
                      } else {
                        console.warn("❗ File not found:", f);
                      }
                    }
                    `;
                    
                    new Dialog({
                      title: game.i18n.format("PF2E-TOKEN-PACK.CleanupScriptTitle", { key }),
                      content: `
                      <p>${game.i18n.format("PF2E-TOKEN-PACK.CleanupScriptInstruction", { key })}</p>
                      <textarea readonly style="width:100%; height:400px; font-family: monospace;">${scriptContent}</textarea>`,
                      buttons: {
                        ok: {
                          label: "OK",
                          callback: () => {
                            new Dialog({
                              title: game.i18n.format("PF2E-TOKEN-PACK.CheckCompleteTitle", { name: keyObj.name }),
                              content: `<p>${game.i18n.localize("PF2E-TOKEN-PACK.AllValid")}</p>`,
                              buttons: { ok: { label: "OK" } },
                              default: "ok"
                            }).render(true);
                          }
                        }
                      },
                      default: "ok"
                    }).render(true);
                  }
                }
              },
              default: "ok"
            }).render(true);
          } else {
            // Финальное подтверждение, если всё в порядке
            new Dialog({
              title: game.i18n.format("PF2E-TOKEN-PACK.CheckCompleteTitle", { name: keyObj.name }),
              content: `<p>${game.i18n.localize("PF2E-TOKEN-PACK.AllValid")}</p>`,
              buttons: { ok: { label: "OK" } },
              default: "ok"
            }).render(true);
          }
        };
        
        if (withoutImages.length > 0) {
          new Dialog({
            title: game.i18n.localize("PF2E-TOKEN-PACK.WithoutImageTitle"),
            content: `<p>${game.i18n.format("PF2E-TOKEN-PACK.ActorsWithoutID", { compendium: pack.metadata.label })}</p>
            <ul>${withoutImages.map(name => `<li>${name}</li>`).join("")}</ul>`,
            buttons: {
              ok: {
                label: "OK",
                callback: () => showMismatchDialog()
              }
            },
            default: "ok",
          }).render(true);
        } else {
          showMismatchDialog();
        }
        
      } catch (e) {
        console.error(e);
        ui.notifications.error(game.i18n.format("PF2E-TOKEN-PACK.ErrorCheckBestiaries", { message: e.message }));
      }
    }
    
  }
  
  
  
  
  // Инициализация модуля
  Hooks.once('init', () => PathfinderBestiaryTokenPack.init());
  Hooks.once('ready', () => PathfinderBestiaryTokenPack.initSettings());
  
  // Заголовки и доп.текст в настройках
  Hooks.on("renderSettingsConfig", (app, html, data) => {
    
    const button = $(`<button type="button" style="margin-left: 8px;">${game.i18n.localize("PF2E-TOKEN-PACK.CheckButtonLabel")}</button>`);
    // Текст
    $('<div>').addClass('form-group group-header').html(game.i18n.localize("PF2E-TOKEN-PACK.settingsMessage")).insertBefore('[data-setting-id="pf2e-token-pack.enableOverwritepathfinder-bestiary"]');
    
    // Доп заголовки
    $('<h2>').addClass('form-group group-header').html(game.i18n.localize("PF2E-TOKEN-PACK.bestiaries")).insertBefore('[data-setting-id="pf2e-token-pack.enableOverwritepathfinder-bestiary"]');
    $('<h2>').addClass('form-group group-header').html(game.i18n.localize("PF2E-TOKEN-PACK.adventure path")).insertBefore('[data-setting-id="pf2e-token-pack.enableOverwriteabomination-vaults-bestiary"]');
    $('<h2>').addClass('form-group group-header').html(game.i18n.localize("PF2E-TOKEN-PACK.rulebook")).insertBefore('[data-setting-id="pf2e-token-pack.enableOverwritebook-of-the-dead-bestiary"]');
    $('<h2>').addClass('form-group group-header').html(game.i18n.localize("PF2E-TOKEN-PACK.standalone adventure")).insertBefore('[data-setting-id="pf2e-token-pack.enableOverwriteclaws-of-the-tyrant-bestiary"]');
    $('<h2>').addClass('form-group group-header').html(game.i18n.localize("PF2E-TOKEN-PACK.pregenerated pcs")).insertBefore('[data-setting-id="pf2e-token-pack.enableOverwritepaizo-pregens"]');
    
    $('section[data-tab="pf2e-token-pack"] p.notes').css("min-height", 0).css("margin", 0);
    
    for (const { key } of PathfinderBestiaryTokenPack.keys) {
      const selector = `[data-setting-id="pf2e-token-pack.enableOverwrite${key}"]`;
      const input = html.find(selector);
      if (input.length) {
        const button = $(`<button type="button" class="check-button" style="margin-left: 8px; display: none;">${game.i18n.localize("PF2E-TOKEN-PACK.CheckButtonLabel")}</button>`);
        button.on("click", () => PathfinderBestiaryTokenPack.checkBestiaryArt(key));
        input.closest(".form-group").append(button);
      }
    }
    
    // Добавим глобальный чекбокс в начало секции
    const globalToggle = $(`
    <div class="form-group">
    <label><input type="checkbox" id="toggle-check-buttons"/> ${game.i18n.localize("PF2E-TOKEN-PACK.EnableCheckMode")}</label>
    </div>
    `);
    html.find('section[data-tab="pf2e-token-pack"]').prepend(globalToggle);
    
    // Обработчик на глобальный чекбокс
    html.find("#toggle-check-buttons").on("change", function () {
      const show = $(this).is(":checked");
      html.find(".check-button").css("display", show ? "inline-block" : "none");
    });
  })