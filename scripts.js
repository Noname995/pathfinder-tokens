class PathfinderBestiaryTokenPack {
  static async initSettings() {
    this.keys = [
    { key: "pathfinder-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.Bestiary"), packName: "pf2e.pathfinder-bestiary", category: "bestiaries" }, 
    { key: "pathfinder-bestiary-2", name: game.i18n.localize("PF2E-TOKEN-PACK.Bestiary2"), packName: "pf2e.pathfinder-bestiary-2", category: "bestiaries" }, 
    { key: "pathfinder-bestiary-3", name: game.i18n.localize("PF2E-TOKEN-PACK.Bestiary3"), packName: "pf2e.pathfinder-bestiary-3", category: "bestiaries" }, 
    { key: "pathfinder-monster-core", name: game.i18n.localize("PF2E-TOKEN-PACK.MonsterCore"), packName: "pf2e.pathfinder-monster-core", category: "bestiaries" }, 
    { key: "pathfinder-npc-core", name: game.i18n.localize("PF2E-TOKEN-PACK.NPCCore"), packName: "pf2e.pathfinder-npc-core", category: "bestiaries" }, 
    { key: "abomination-vaults-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.AbominationVaultsBestiary"), packName: "pf2e.abomination-vaults-bestiary", category: "adventurePath" },
    { key: "age-of-ashes-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.AgeofAshesBestiary"), packName: "pf2e.age-of-ashes-bestiary", category: "adventurePath" },
    { key: "agents-of-edgewatch-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.AgentsofEdgewatchBestiary"), packName: "pf2e.agents-of-edgewatch-bestiary", category: "adventurePath" },
    { key: "blood-lords-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.BloodLordsBestiary"), packName: "pf2e.blood-lords-bestiary", category: "adventurePath" },
    { key: "curtain-call-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.CurtainCallBestiary"), packName: "pf2e.curtain-call-bestiary", category: "adventurePath" },
    { key: "extinction-curse-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.ExtinctionCurseBestiary"), packName: "pf2e.extinction-curse-bestiary", category: "adventurePath" },
    { key: "fists-of-the-ruby-phoenix-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.FistsoftheRubyPhoenixBestiary"), packName: "pf2e.fists-of-the-ruby-phoenix-bestiary", category: "adventurePath" },
    { key: "gatewalkers-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.GatewalkersBestiary"), packName: "pf2e.gatewalkers-bestiary", category: "adventurePath" },
    { key: "outlaws-of-alkenstar-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.OutlawsofAlkenstarBestiary"), packName: "pf2e.outlaws-of-alkenstar-bestiary", category: "adventurePath" },
    { key: "kingmaker-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.KingmakerBestiary"), packName: "pf2e.kingmaker-bestiary", category: "adventurePath" },
    { key: "quest-for-the-frozen-flame-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.QuestfortheFrozenFlameBestiary"), packName: "pf2e.quest-for-the-frozen-flame-bestiary", category: "adventurePath" },
    { key: "season-of-ghosts-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.SeasonofGhostsBestiary"), packName: "pf2e.season-of-ghosts-bestiary", category: "adventurePath" },
    { key: "seven-dooms-for-sandpoint-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.SevenDoomsforSandpointBestiary"), packName: "pf2e.seven-dooms-for-sandpoint-bestiary", category: "adventurePath" },
    { key: "sky-kings-tomb-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.SkyKingsTombBestiary"), packName: "pf2e.sky-kings-tomb-bestiary", category: "adventurePath" },
    { key: "strength-of-thousands-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.StrengthofThousandsBestiary"), packName: "pf2e.strength-of-thousands-bestiary", category: "adventurePath" },
    { key: "stolen-fate-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.StolenFateBestiary"), packName: "pf2e.stolen-fate-bestiary", category: "adventurePath" },
    { key: "wardens-of-wildwood-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.WardensofWildwoodBestiary"), packName: "pf2e.wardens-of-wildwood-bestiary", category: "adventurePath" },
    { key: "book-of-the-dead-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.BookoftheDeadBestiary"), packName: "pf2e.book-of-the-dead-bestiary", category: "rulebook" },
    { key: "blog-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.PaizoBlogBestiary"), packName: "pf2e.blog-bestiary", category: "rulebook" },
    { key: "howl-of-the-wild-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.HowloftheWildBestiary"), packName: "pf2e.howl-of-the-wild-bestiary", category: "rulebook" },
    { key: "lost-omens-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.LostOmensBestiary"), packName: "pf2e.lost-omens-bestiary", category: "rulebook" },
    { key: "npc-gallery", name: game.i18n.localize("PF2E-TOKEN-PACK.NPCGallery"), packName: "pf2e.npc-gallery", category: "rulebook" },
    { key: "pathfinder-dark-archive", name: game.i18n.localize("PF2E-TOKEN-PACK.DarkArchive"), packName: "pf2e.pathfinder-dark-archive", category: "rulebook" },
    { key: "rage-of-elements-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.RageofElementsBestiary"), packName: "pf2e.rage-of-elements-bestiary", category: "rulebook" },
    { key: "war-of-immortals-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.WarofImmortalsBestiary"), packName: "pf2e.war-of-immortals-bestiary", category: "rulebook" },
    { key: "claws-of-the-tyrant-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.ClawsoftheTyrantBestiary"), packName: "pf2e.claws-of-the-tyrant-bestiary", category: "standalone" },
    { key: "fall-of-plaguestone-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.FallofPlaguestoneBestiary"), packName: "pf2e.fall-of-plaguestone-bestiary", category: "standalone" },
    { key: "malevolence-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.MalevolenceBestiary"), packName: "pf2e.malevolence-bestiary", category: "standalone" },
    { key: "menace-under-otari-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.MenaceUnderOtariBestiary"), packName: "pf2e.menace-under-otari-bestiary", category: "standalone" },
    { key: "one-shot-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.OneShotBestiary"), packName: "pf2e.one-shot-bestiary", category: "standalone" },
    { key: "prey-for-death-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.PreyforDeathBestiary"), packName: "pf2e.prey-for-death-bestiary", category: "standalone" },
    { key: "rusthenge-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.RusthengeBestiary"), packName: "pf2e.rusthenge-bestiary", category: "standalone" },
    { key: "shadows-at-sundown-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.ShadowsatSundownBestiary"), packName: "pf2e.shadows-at-sundown-bestiary", category: "standalone" },
    { key: "the-enmity-cycle-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.TheEnmityCycleBestiary"), packName: "pf2e.the-enmity-cycle-bestiary", category: "standalone" },
    { key: "the-slithering-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.TheSlitheringBestiary"), packName: "pf2e.the-slithering-bestiary", category: "standalone" },
    { key: "troubles-in-otari-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.TroublesinOtariBestiary"), packName: "pf2e.troubles-in-otari-bestiary", category: "standalone" },
    { key: "night-of-the-gray-death-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.NightoftheGrayDeathBestiary"), packName: "pf2e.night-of-the-gray-death-bestiary", category: "standalone" },
    { key: "crown-of-the-kobold-king-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.CrownoftheKoboldKingBestiary"), packName: "pf2e.crown-of-the-kobold-king-bestiary", category: "standalone" },
    { key: "paizo-pregens", name: game.i18n.localize("PF2E-TOKEN-PACK.AdventurePregens"), packName: "pf2e.paizo-pregens", category: "pregens" }
    ];
    
    this.previousSettings = {};
    this.settingsChanged = true;
    
    this.keys.forEach(({key, name, hint}) => {
      game.settings.register("pf2e-token-pack", `enableOverwrite${key}`, {
        name: name,
        hint: hint,
        scope: "world",
        config: false,
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
    if (!response.ok) throw new Error(game.i18n.localize("PF2E-TOKEN-PACK.FailedToFetch"));
    return await response.json();
  }
  
  static async uploadBestiary(data, fileName) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const result = await FilePicker.upload("data", "modules/pf2e-token-pack", new File([blob], fileName), {});
    if (result.status !== "success") throw new Error(game.i18n.format("PF2E-TOKEN-PACK.FailedToUpload", { file: fileName }));
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
        
for (const entry of index) {
  const actorId = entry._id;
  const actorName = entry.name;

  const actor = await pack.getDocument(actorId);

  // 💡 Пропускаем HAZARD-актеров
  if (actor.type === "hazard") continue;

  const expected = bestiary[actorId];
  if (!expected) {
    mismatches.push(`${actorName}: ${game.i18n.localize("PF2E-TOKEN-PACK.MissingBestiaryKey")}`);
    continue;
  }

  const expectedActorImg = expected.actor;
  const expectedTokenImg = typeof expected.token === "string" ? expected.token : expected.token?.img;
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
      mismatches.push(`📏 ${actorName}: ${game.i18n.localize("PF2E-TOKEN-PACK.TokenScaleDiffers")}\n🔺 ${actualScaleX}/${actualScaleY} ≠ ${expectedScale}`);
  }
}

// 2. Проверяем, есть ли в bestiaries.json записи, которых больше нет в компендиуме
const compendiumActorIds = new Set(index.map(e => e._id));

for (const [actorId, expected] of Object.entries(bestiary)) {
  if (!compendiumActorIds.has(actorId)) {
    mismatches.push(`${actorId}: ${game.i18n.localize("PF2E-TOKEN-PACK.InCompendium")}`);
    if (expected.actor) filesToDelete.add(expected.actor);
    const tokenPath = typeof expected.token === "string" ? expected.token : expected.token?.img;
    if (tokenPath) filesToDelete.add(tokenPath);
    deadIds.push(actorId);
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
  
  
Hooks.once("init", () => {
  game.settings.registerMenu("pf2e-token-pack", "tokenPackSettings", {
    name: game.i18n.localize("PF2E-TOKEN-PACK.TokenSettingsLabel"),
    label: game.i18n.localize("PF2E-TOKEN-PACK.TokenSettingsButton"),
    hint: game.i18n.localize("PF2E-TOKEN-PACK.TokenSettingsHint"),
    icon: "fas fa-dungeon",
    type: PathfinderBestiarySettingsMenu,
    restricted: true
  });
  game.settings.registerMenu("pf2e-token-pack", "restoreArtTokens", {
    name: game.i18n.localize("PF2E-TOKEN-PACK.RestoreArtLabel"),
    label: game.i18n.localize("PF2E-TOKEN-PACK.RestoreArtButton"),
    hint: game.i18n.localize("PF2E-TOKEN-PACK.RestoreArtHint"),
    icon: "fas fa-sync",
    type: RestoreArtTokenRunner,
    restricted: true
});

});

class PathfinderBestiarySettingsMenu extends FormApplication {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "pf2e-token-pack-settings",
      title: game.i18n.localize("PF2E-TOKEN-PACK.SettingsMenuTitle"),
      template: "modules/pf2e-token-pack/templates/settings-menu.html",
      width: 700,
      height: "auto",
      closeOnSubmit: false
    });
  }

async getData() {
  const groups = {
    bestiaries: [],
    adventurePath: [],
    rulebook: [],
    standalone: [],
    pregens: []
  };

  for (const { key, name, hint, category = "bestiaries" } of PathfinderBestiaryTokenPack.keys) {
    const settingKey = `enableOverwrite${key}`;

    if (!game.settings.settings.has(`pf2e-token-pack.${settingKey}`)) {
      game.settings.register("pf2e-token-pack", settingKey, {
        name,
        hint,
        scope: "world",
        config: false,
        default: false,
        type: Boolean,
        onChange: () => PathfinderBestiaryTokenPack.onSettingChange()
      });
    }

    const value = game.settings.get("pf2e-token-pack", settingKey);
    const entry = { key, settingKey, name, hint, value };

    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(entry);
  }

  return { groups };
}
}

class RestoreArtTokenRunner extends FormApplication {
  constructor(...args) {
    super(...args);
    // Сразу запускаем диалог при открытии меню
    new Dialog({
    title: game.i18n.localize("PF2E-TOKEN-PACK.RestoreDialogTitle"),
    content: `<p>${game.i18n.localize("PF2E-TOKEN-PACK.RestoreDialogPrompt")}</p>`,
      buttons: {
        active: {
          label: game.i18n.localize("PF2E-TOKEN-PACK.RestoreActiveScene"),
          callback: () => syncSceneTokens(true)
        },
        all: {
          label: game.i18n.localize("PF2E-TOKEN-PACK.RestoreAllScenes"),
          callback: () => syncSceneTokens(false)
        },
        cancel: { label: game.i18n.localize("PF2E-TOKEN-PACK.Cancel") }
      },
      default: "active"
    }).render(true);
  }

  // Не показываем форму вовсе
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "pf2e-token-restore-runner",
      template: "", // Пусто
      width: 0,
      height: 0,
      closeOnSubmit: true
    });
  }

  getData() {
    return {};
  }
}



// --- Восстановление токенов и артов на сценах ---
function getCompendiumNames() {
  return PathfinderBestiaryTokenPack.keys.map(k => k.packName);
}

function getActorNamesFromScenes(scenes) {
  const names = new Set();
  for (const scene of scenes) {
    for (const token of scene.tokens) {
      if (token.actor && token.actor.type !== "character") {
         names.add(token.actor.name);
      }
    }
  }
  return names;
}

async function fetchMatchingActorsFromCompendiums(actorNames) {
  const result = new Map();

  for (const compName of getCompendiumNames()) {
    const pack = game.packs.get(compName);
    if (!pack) continue;

    await pack.getIndex();
    for (const name of actorNames) {
      if (!result.has(name)) {
        const entry = pack.index.find(e => e.name === name);
        if (entry) {
          const actor = await pack.getDocument(entry._id);
          result.set(name, actor);
        }
      }
    }

    if (result.size === actorNames.size) break;
  }

  return result;
}

async function syncTokensOnScene(scene, compendiumActors) {
  const result = {
    sceneName: scene.name,
    actors: []
  };

  for (const tokenDoc of scene.tokens) {
    const tokenActor = tokenDoc.actor;
    if (!tokenActor || tokenActor.type === "character") continue;

    const actorName = tokenActor.name;
    const compActor = compendiumActors.get(actorName);

    const actorResult = {
      name: actorName,
      missing: false,
      changes: {
        art: false,
        token: false,
        size: false
      }
    };

    if (!compActor) {
      actorResult.missing = true;
      result.actors.push(actorResult);
      continue;
    }

    const tokenData = tokenDoc.toObject();
    const compProto = compActor.prototypeToken;

    const updates = {};

    if (tokenData.texture?.src !== compProto.texture?.src) {
      updates["texture.src"] = compProto.texture.src;
      actorResult.changes.token = true;
    }
    if (tokenData.width !== compProto.width || tokenData.height !== compProto.height) {
      updates["width"] = compProto.width;
      updates["height"] = compProto.height;
      actorResult.changes.size = true;
    }
    if (tokenData.texture.scaleX !== compProto.texture.scaleX) {
      updates["texture.scaleX"] = compProto.texture.scaleX;
      actorResult.changes.token = true;
    }
    if (tokenData.texture.scaleY !== compProto.texture.scaleY) {
      updates["texture.scaleY"] = compProto.texture.scaleY;
      actorResult.changes.token = true;
    }

    if (tokenActor.img !== compActor.img) {
      await tokenActor.update({ "img": compActor.img });
      actorResult.changes.art = true;
    }

    if (Object.keys(updates).length > 0) {
      await tokenDoc.update(updates);
    }

    result.actors.push(actorResult);
  }

  return result;
}

function generateReportHTML(reportData) {
  let html = `<style>
      details summary { cursor: pointer; font-weight: bold; margin: 4px 0; }
      .actor-item { margin-left: 1em; }
      .change-modified { color: orange; }
      .change-missing { color: red; }
      #expand-all {
        margin: 10px 0;
        display: inline-block;
        cursor: pointer;
        color: #007bff;
        text-decoration: none;
      }
      #expand-all:hover {
        text-decoration: underline;
      }
      .no-changes {
        margin-left: 1em;
        font-style: italic;
        color: gray;
      }
    </style>
    <div id="expand-all">📂 ${game.i18n.localize("PF2E-TOKEN-PACK.ExpandAll")}</div>`;

  for (const scene of reportData) {
    const actorsWithChanges = scene.actors.filter(actor => actor.missing || actor.changes.art || actor.changes.token || actor.changes.size);

    html += `<details><summary>📁 ${game.i18n.format("PF2E-TOKEN-PACK.SceneLabel", { name: scene.sceneName })}</summary>`;
    if (actorsWithChanges.length === 0) {
      html += `<div class="no-changes">${game.i18n.localize("PF2E-TOKEN-PACK.ActorsOK")}</div>`;
      continue;
    }

    for (const actor of actorsWithChanges) {
      html += `<details class="actor-item"><summary>${actor.missing ? '❓' : '🎭'} ${actor.name}</summary><ul>`;
      if (actor.missing) {
        html += `<li class="change-missing">${game.i18n.localize("PF2E-TOKEN-PACK.ActorMissing")}</li>`;
      } else {
if (actor.changes.art) html += `<li class="change-modified">${game.i18n.localize("PF2E-TOKEN-PACK.ArtChanged")}</li>`;
if (actor.changes.token) html += `<li class="change-modified">${game.i18n.localize("PF2E-TOKEN-PACK.TokenChanged")}</li>`;
if (actor.changes.size) html += `<li class="change-modified">${game.i18n.localize("PF2E-TOKEN-PACK.SizeChanged")}</li>`;
      }
      html += `</ul></details>`;
    }

    html += `</details>`;
  }

  return html;
}

async function syncSceneTokens(activeOnly = true) {
  const scenesToCheck = activeOnly ? [game.scenes.active] : game.scenes;
  const actorNames = getActorNamesFromScenes(scenesToCheck);
  const compendiumActors = await fetchMatchingActorsFromCompendiums(actorNames);

  let reportData = [];

  for (const scene of scenesToCheck) {
    const data = await syncTokensOnScene(scene, compendiumActors);
    reportData.push(data);
  }

  const content = generateReportHTML(reportData);

  const dlg = new Dialog({
    title: `Результат синхронизации (${activeOnly ? "активная сцена" : "все сцены"})`,
    content: `<div id="sync-report" style="overflow-y: auto; max-height: 500px;">${content}</div>`,
    buttons: { ok: { label: "OK" } },
    render: html => {
      const dialog = dlg;
      html[0].querySelector("#expand-all").addEventListener("click", () => {
        html[0].querySelectorAll("details").forEach(det => det.open = true);
        dialog.setPosition({ height: "auto" });
      });
      html[0].querySelectorAll("details").forEach(det => {
        det.addEventListener("toggle", () => dialog.setPosition({ height: "auto" }));
      });
    },
    width: 600
  });

  dlg.render(true);
}


