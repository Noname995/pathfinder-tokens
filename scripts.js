// Класс для управления модулем токенов бестиария Pathfinder
class PathfinderBestiaryTokenPack {
  // Инициализация настроек модуля
  static async initSettings() {
    // Список всех поддерживаемых бестиариев и их метаданных
    this.keys = [
      { key: "pathfinder-bestiary"                , name: game.i18n.localize("PF2E-TOKEN-PACK.Bestiary")                      , packName: "pf2e.pathfinder-bestiary"                , category: "bestiaries"    },
      { key: "pathfinder-bestiary-2"              , name: game.i18n.localize("PF2E-TOKEN-PACK.Bestiary2")                     , packName: "pf2e.pathfinder-bestiary-2"              , category: "bestiaries"    },
      { key: "pathfinder-bestiary-3"              , name: game.i18n.localize("PF2E-TOKEN-PACK.Bestiary3")                     , packName: "pf2e.pathfinder-bestiary-3"              , category: "bestiaries"    },
      { key: "pathfinder-monster-core"            , name: game.i18n.localize("PF2E-TOKEN-PACK.MonsterCore")                   , packName: "pf2e.pathfinder-monster-core"            , category: "bestiaries"    },
      { key: "pathfinder-npc-core"                , name: game.i18n.localize("PF2E-TOKEN-PACK.NPCCore")                       , packName: "pf2e.pathfinder-npc-core"                , category: "bestiaries"    },
      { key: "abomination-vaults-bestiary"        , name: game.i18n.localize("PF2E-TOKEN-PACK.AbominationVaultsBestiary")     , packName: "pf2e.abomination-vaults-bestiary"        , category: "adventurePath" },
      { key: "age-of-ashes-bestiary"              , name: game.i18n.localize("PF2E-TOKEN-PACK.AgeofAshesBestiary")            , packName: "pf2e.age-of-ashes-bestiary"              , category: "adventurePath" },
      { key: "agents-of-edgewatch-bestiary"       , name: game.i18n.localize("PF2E-TOKEN-PACK.AgentsofEdgewatchBestiary")     , packName: "pf2e.agents-of-edgewatch-bestiary"       , category: "adventurePath" },
      { key: "blood-lords-bestiary"               , name: game.i18n.localize("PF2E-TOKEN-PACK.BloodLordsBestiary")            , packName: "pf2e.blood-lords-bestiary"               , category: "adventurePath" },
      { key: "curtain-call-bestiary"              , name: game.i18n.localize("PF2E-TOKEN-PACK.CurtainCallBestiary")           , packName: "pf2e.curtain-call-bestiary"              , category: "adventurePath" },
      { key: "extinction-curse-bestiary"          , name: game.i18n.localize("PF2E-TOKEN-PACK.ExtinctionCurseBestiary")       , packName: "pf2e.extinction-curse-bestiary"          , category: "adventurePath" },
      { key: "fists-of-the-ruby-phoenix-bestiary" , name: game.i18n.localize("PF2E-TOKEN-PACK.FistsoftheRubyPhoenixBestiary") , packName: "pf2e.fists-of-the-ruby-phoenix-bestiary" , category: "adventurePath" },
      { key: "gatewalkers-bestiary"               , name: game.i18n.localize("PF2E-TOKEN-PACK.GatewalkersBestiary")           , packName: "pf2e.gatewalkers-bestiary"               , category: "adventurePath" },
      { key: "outlaws-of-alkenstar-bestiary"      , name: game.i18n.localize("PF2E-TOKEN-PACK.OutlawsofAlkenstarBestiary")    , packName: "pf2e.outlaws-of-alkenstar-bestiary"      , category: "adventurePath" },
      { key: "kingmaker-bestiary"                 , name: game.i18n.localize("PF2E-TOKEN-PACK.KingmakerBestiary")             , packName: "pf2e.kingmaker-bestiary"                 , category: "adventurePath" },
      { key: "quest-for-the-frozen-flame-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.QuestfortheFrozenFlameBestiary"), packName: "pf2e.quest-for-the-frozen-flame-bestiary", category: "adventurePath" },
      { key: "season-of-ghosts-bestiary"          , name: game.i18n.localize("PF2E-TOKEN-PACK.SeasonofGhostsBestiary")        , packName: "pf2e.season-of-ghosts-bestiary"          , category: "adventurePath" },
      { key: "seven-dooms-for-sandpoint-bestiary" , name: game.i18n.localize("PF2E-TOKEN-PACK.SevenDoomsforSandpointBestiary"), packName: "pf2e.seven-dooms-for-sandpoint-bestiary" , category: "adventurePath" },
      { key: "sky-kings-tomb-bestiary"            , name: game.i18n.localize("PF2E-TOKEN-PACK.SkyKingsTombBestiary")          , packName: "pf2e.sky-kings-tomb-bestiary"            , category: "adventurePath" },
      { key: "strength-of-thousands-bestiary"     , name: game.i18n.localize("PF2E-TOKEN-PACK.StrengthofThousandsBestiary")   , packName: "pf2e.strength-of-thousands-bestiary"     , category: "adventurePath" },
      { key: "stolen-fate-bestiary"               , name: game.i18n.localize("PF2E-TOKEN-PACK.StolenFateBestiary")            , packName: "pf2e.stolen-fate-bestiary"               , category: "adventurePath" },
      { key: "wardens-of-wildwood-bestiary"       , name: game.i18n.localize("PF2E-TOKEN-PACK.WardensofWildwoodBestiary")     , packName: "pf2e.wardens-of-wildwood-bestiary"       , category: "adventurePath" },
      { key: "book-of-the-dead-bestiary"          , name: game.i18n.localize("PF2E-TOKEN-PACK.BookoftheDeadBestiary")         , packName: "pf2e.book-of-the-dead-bestiary"          , category: "rulebook"      },
      { key: "blog-bestiary"                      , name: game.i18n.localize("PF2E-TOKEN-PACK.PaizoBlogBestiary")             , packName: "pf2e.blog-bestiary"                      , category: "rulebook"      },
      { key: "howl-of-the-wild-bestiary"          , name: game.i18n.localize("PF2E-TOKEN-PACK.HowloftheWildBestiary")         , packName: "pf2e.howl-of-the-wild-bestiary"          , category: "rulebook"      },
      { key: "lost-omens-bestiary"                , name: game.i18n.localize("PF2E-TOKEN-PACK.LostOmensBestiary")             , packName: "pf2e.lost-omens-bestiary"                , category: "rulebook"      },
      { key: "npc-gallery"                        , name: game.i18n.localize("PF2E-TOKEN-PACK.NPCGallery")                    , packName: "pf2e.npc-gallery"                        , category: "rulebook"      },
      { key: "pathfinder-dark-archive"            , name: game.i18n.localize("PF2E-TOKEN-PACK.DarkArchive")                   , packName: "pf2e.pathfinder-dark-archive"            , category: "rulebook"      },
      { key: "rage-of-elements-bestiary"          , name: game.i18n.localize("PF2E-TOKEN-PACK.RageofElementsBestiary")        , packName: "pf2e.rage-of-elements-bestiary"          , category: "rulebook"      },
      { key: "war-of-immortals-bestiary"          , name: game.i18n.localize("PF2E-TOKEN-PACK.WarofImmortalsBestiary")        , packName: "pf2e.war-of-immortals-bestiary"          , category: "rulebook"      },
      { key: "claws-of-the-tyrant-bestiary"       , name: game.i18n.localize("PF2E-TOKEN-PACK.ClawsoftheTyrantBestiary")      , packName: "pf2e.claws-of-the-tyrant-bestiary"       , category: "standalone"    },
      { key: "fall-of-plaguestone-bestiary"       , name: game.i18n.localize("PF2E-TOKEN-PACK.FallofPlaguestoneBestiary")     , packName: "pf2e.fall-of-plaguestone-bestiary"       , category: "standalone"    },
      { key: "malevolence-bestiary"               , name: game.i18n.localize("PF2E-TOKEN-PACK.MalevolenceBestiary")           , packName: "pf2e.malevolence-bestiary"               , category: "standalone"    },
      { key: "menace-under-otari-bestiary"        , name: game.i18n.localize("PF2E-TOKEN-PACK.MenaceUnderOtariBestiary")      , packName: "pf2e.menace-under-otari-bestiary"        , category: "standalone"    },
      { key: "one-shot-bestiary"                  , name: game.i18n.localize("PF2E-TOKEN-PACK.OneShotBestiary")               , packName: "pf2e.one-shot-bestiary"                  , category: "standalone"    },
      { key: "prey-for-death-bestiary"            , name: game.i18n.localize("PF2E-TOKEN-PACK.PreyforDeathBestiary")          , packName: "pf2e.prey-for-death-bestiary"            , category: "standalone"    },
      { key: "rusthenge-bestiary"                 , name: game.i18n.localize("PF2E-TOKEN-PACK.RusthengeBestiary")             , packName: "pf2e.rusthenge-bestiary"                 , category: "standalone"    },
      { key: "shadows-at-sundown-bestiary"        , name: game.i18n.localize("PF2E-TOKEN-PACK.ShadowsatSundownBestiary")      , packName: "pf2e.shadows-at-sundown-bestiary"        , category: "standalone"    },
      { key: "the-enmity-cycle-bestiary"          , name: game.i18n.localize("PF2E-TOKEN-PACK.TheEnmityCycleBestiary")        , packName: "pf2e.the-enmity-cycle-bestiary"          , category: "standalone"    },
      { key: "the-slithering-bestiary"            , name: game.i18n.localize("PF2E-TOKEN-PACK.TheSlitheringBestiary")         , packName: "pf2e.the-slithering-bestiary"            , category: "standalone"    },
      { key: "troubles-in-otari-bestiary"         , name: game.i18n.localize("PF2E-TOKEN-PACK.TroublesinOtariBestiary")       , packName: "pf2e.troubles-in-otari-bestiary"         , category: "standalone"    },
      { key: "night-of-the-gray-death-bestiary"   , name: game.i18n.localize("PF2E-TOKEN-PACK.NightoftheGrayDeathBestiary")   , packName: "pf2e.night-of-the-gray-death-bestiary"   , category: "standalone"    },
      { key: "crown-of-the-kobold-king-bestiary"  , name: game.i18n.localize("PF2E-TOKEN-PACK.CrownoftheKoboldKingBestiary")  , packName: "pf2e.crown-of-the-kobold-king-bestiary"  , category: "standalone"    },
      { key: "paizo-pregens"                      , name: game.i18n.localize("PF2E-TOKEN-PACK.AdventurePregens")              , packName: "pf2e.paizo-pregens"                      , category: "pregens"       },
    ];
    
    // Хранит предыдущие значения настроек
    this.previousSettings = {};
    // Флаг, что настройки были изменены
    this.settingsChanged = true;
    
    // Регистрирует каждую настройку для каждого бестиария
    this.keys.forEach(({key, name, hint}) => {
      game.settings.register("pf2e-token-pack", `enableOverwrite${key}`, {
        name: name, // Название настройки
        hint: hint, // Подсказка (может быть undefined)
        scope: "world", // Глобальная настройка для мира
        config: false, // Не показывать в стандартном меню настроек
        default: false, // Значение по умолчанию
        type: Boolean, // Тип значения
        onChange: () => this.onSettingChange(), // Колбэк при изменении
      });
      
      // Сохраняет текущее значение настройки
      this.previousSettings[`enableOverwrite${key}`] = game.settings.get("pf2e-token-pack", `enableOverwrite${key}`);
    });
  }
  
  
  // Инициализация сокета для взаимодействия между клиентами
  static init() {
    
    game.socket.on("module.pf2e-token-pack", async data => {
      // Если пришло действие перезаписи бестиария и пользователь — ГМ
      if (data.action === "overwriteBestiary" && game.user.isGM) {
        await this.updateBestiary(true); // Обновить бестиарий
      }
    });
  }
  
  // Получение данных бестиария из файла bestiaries.json
  static async fetchBestiaryData() {
    const response = await fetch('modules/pf2e-token-pack/bestiaries.json');
    if (!response.ok) throw new Error(game.i18n.localize("PF2E-TOKEN-PACK.FailedToFetch"));
    return await response.json();
  }
  
  // Загрузка обновлённого файла bestiaries.json через FilePicker
  static async uploadBestiary(data, fileName) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const result = await FilePicker.upload("data", "modules/pf2e-token-pack", new File([blob], fileName), {});
    if (result.status !== "success") throw new Error(game.i18n.format("PF2E-TOKEN-PACK.FailedToUpload", { file: fileName }));
  }
    
  // Переименование ключа в объекте данных
  static modifyKeys(data, oldKey, newKey) {
    if (oldKey in data) {
      data[newKey] = data[oldKey];
      delete data[oldKey];
    }
    return data;
  }
  
  // Колбэк при изменении любой настройки
  static async onSettingChange() {
    this.settingsChanged = true; // Помечаем, что настройки изменились
    this.debouncedUpdateBestiary(); // Запускаем обновление с задержкой
  }
  
  // Обновление бестиария с задержкой (debounce)
  static debouncedUpdateBestiary() {
    clearTimeout(this.debouncedUpdateBestiaryTimeout); // Сброс предыдущего таймера
    this.debouncedUpdateBestiaryTimeout = setTimeout(async () => {
      await this.updateBestiary(false); // Обновить бестиарий
      if (this.settingsChanged) {
        this.showReloadDialog(); // Показать диалог о необходимости перезагрузки
        this.settingsChanged = false;
      }
    }, 300); // 300 мс задержка для предотвращения частых обновлений
  }
    
  // Проверка соответствия артов и токенов в компендиуме и bestiaries.json
  static async checkBestiaryArt(key) {
    try {
      // Загружаем данные bestiaries.json
      const response = await fetch("modules/pf2e-token-pack/bestiaries.json");
      const data = await response.json();
      const bestiary = data[key];
      
      // Если данных по ключу нет — предупреждение
      if (!bestiary) {
        ui.notifications.warn(game.i18n.format("PF2E-TOKEN-PACK.WarnNoDataForKey", { key }));
        return;
      }
      
      // Находим объект ключа по ключу
      const keyObj = PathfinderBestiaryTokenPack.keys.find(k => k.key === key);
      if (!keyObj || !keyObj.packName) {
        ui.notifications.error(game.i18n.format("PF2E-TOKEN-PACK.ErrorCompendiumNotFound", { key }));
        return;
      }
      const packName = keyObj.packName;
      
      // Получаем компендиум по имени
      const pack = game.packs.get(packName);
      if (!pack) {
        ui.notifications.error(game.i18n.format("PF2E-TOKEN-PACK.ErrorCompendiumNotLoaded", {packName}));
        return;
      }
      
      // Получаем индекс всех актёров компендиума
      const index = await pack.getIndex();
      
      // Массивы для хранения различий и отсутствующих данных
      const mismatches = [];
      const withoutImages = [];
      const deadIds = [];
      const missingInModule = [];
      const filesToDelete = new Set();
      
      // Проверяем каждого актёра компендиума
      for (const entry of index) {
        const actorId = entry._id;
        const actorName = entry.name;

        const actor = await pack.getDocument(actorId);

        // Пропускаем актёров типа hazard
        if (actor.type === "hazard") continue;

        const expected = bestiary[actorId];
        if (!expected) {
          missingInModule.push(actorId);
          mismatches.push(`${actorName}: ${game.i18n.localize("PF2E-TOKEN-PACK.MissingBestiaryKey")}`);
          continue;
        }

        // Ожидаемые значения из bestiaries.json
        const expectedActorImg = expected.actor;
        const expectedTokenImg = typeof expected.token === "string" ? expected.token : expected.token?.img;
        const expectedScale = typeof expected.token === "object" && expected.token.scale !== undefined
          ? expected.token.scale
          : 1;

        // Фактические значения из компендиума
        const actualActorImg = actor.img;
        const actualTokenImg = actor.prototypeToken.texture?.src ?? "";
        const actualScaleX = actor.prototypeToken.texture?.scaleX ?? 1;
        const actualScaleY = actor.prototypeToken.texture?.scaleY ?? 1;

        // Проверяем различия в арте актёра
        if (actualActorImg !== expectedActorImg)
          mismatches.push(`${actorName}: ${game.i18n.localize("PF2E-TOKEN-PACK.ArtDiffers")}\n🔺 ${actualActorImg}\n🔻 ${expectedActorImg}`);
        // Проверяем различия в токене
        if (actualTokenImg !== expectedTokenImg)
          mismatches.push(`🧍 ${actorName}: ${game.i18n.localize("PF2E-TOKEN-PACK.TokenDiffers")}\n🔺 ${actualTokenImg}\n🔻 ${expectedTokenImg}`);
        // Проверяем различия в масштабе токена
        if (expected.token?.scale !== undefined) {
          if (Math.abs(actualScaleX - expectedScale) > 0.01 || Math.abs(actualScaleY - expectedScale) > 0.01)
            mismatches.push(`📏 ${actorName}: ${game.i18n.localize("PF2E-TOKEN-PACK.TokenScaleDiffers")}\n🔺 ${actualScaleX}/${actualScaleY} ≠ ${expectedScale}`);
        }
      }

      // Проверяем, есть ли в bestiaries.json записи, которых нет в компендиуме
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
      
      // Считаем количество отсутствующих актёров
      const notFoundCount = deadIds.length;
      const missingInModuleCount = missingInModule.length;
      
      // Функция для показа диалога с результатами проверки
      const showMismatchDialog = () => {
        if (mismatches.length > 0) {
          new Dialog({
            title: game.i18n.format("PF2E-TOKEN-PACK.CheckTitle", { name: keyObj.name }),
            content: `<p>${game.i18n.format("PF2E-TOKEN-PACK.ActorsNotFoundInCompendium", { count: notFoundCount })}</p>
                      <p>${game.i18n.format("PF2E-TOKEN-PACK.ActorsNotFoundInModule", { count: missingInModuleCount })}</p>
                      <div id="mismatch-results" style="white-space: nowrap;">${mismatches.join("<br>")}</div>`,
            buttons: {
              ok: {
                label: "OK",
                callback: () => {
                  new Dialog({
                    title: game.i18n.format("PF2E-TOKEN-PACK.CheckCompleteTitle", { name: keyObj.name }),
                    content: `<p>${game.i18n.localize("PF2E-TOKEN-PACK.AllValid")}</p>`,
                    buttons: { ok: { label: "OK" } },
                    default: "ok"
                  }, { width: "auto" }).render(true);
                }
              },
              // Кнопка для генерации скрипта очистки
              generate: {
                label: game.i18n.localize("PF2E-TOKEN-PACK.GenerateScript"),
                callback: async () => {
                  // Генерируем скрипт для удаления "мертвых" актёров и файлов
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
                  
                  // Показываем диалог с готовым скриптом для копирования
                  new Dialog({
                    title: game.i18n.format("PF2E-TOKEN-PACK.CleanupScriptTitle", { key: keyObj.name }),
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
                          }, { width: "auto" }).render(true);
                        }
                      }
                    },
                    default: "ok",
                  }, { width: "auto" }).render(true);
                }
              }
            },
            default: "ok"
          }, { width: "auto" }).render(true);
        } else {
          // Если различий нет — показываем подтверждение
          new Dialog({
            title: game.i18n.format("PF2E-TOKEN-PACK.CheckCompleteTitle", { name: keyObj.name }),
            content: `<p>${game.i18n.localize("PF2E-TOKEN-PACK.AllValid")}</p>`,
            buttons: { ok: { label: "OK" } },
            default: "ok"
          }, { width: "auto" }).render(true);
        }
      };
      
      // Если есть актёры без изображений — показываем отдельный диалог
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
          width: "auto"
        }).render(true);
      } else {
        showMismatchDialog();
      }
      
    } catch (e) {
      // В случае ошибки — выводим ошибку в консоль и уведомление
      console.error(e);
      ui.notifications.error(game.i18n.format("PF2E-TOKEN-PACK.ErrorCheckBestiaries", { message: e.message }));
    }
  }
}
  
  
  
  
  // Инициализация модуля
  Hooks.once('init', () => PathfinderBestiaryTokenPack.init()); // При событии 'init' (ранняя инициализация Foundry) вызывается метод init(), который настраивает сокеты для взаимодействия между клиентами

Hooks.once('ready', () => PathfinderBestiaryTokenPack.initSettings()); // При событии 'ready' (после полной загрузки Foundry) вызывается метод initSettings(), который регистрирует все настройки модуля

// Регистрируем меню настроек модуля
Hooks.once("init", () => {
  game.settings.registerMenu("pf2e-token-pack", "tokenPackSettings", {
    name: game.i18n.localize("PF2E-TOKEN-PACK.TokenSettingsLabel"), // Название меню настроек
    label: game.i18n.localize("PF2E-TOKEN-PACK.TokenSettingsButton"), // Текст кнопки меню
    hint: game.i18n.localize("PF2E-TOKEN-PACK.TokenSettingsHint"), // Подсказка для меню
    icon: "fas fa-dungeon", // Иконка меню
    type: PathfinderBestiarySettingsMenu, // Класс формы настроек
    restricted: true // Только для GM
  });
  // Регистрируем меню восстановления артов токенов
  game.settings.registerMenu("pf2e-token-pack", "restoreArtTokens", {
    name: game.i18n.localize("PF2E-TOKEN-PACK.RestoreArtLabel"), // Название меню восстановления
    label: game.i18n.localize("PF2E-TOKEN-PACK.RestoreArtButton"), // Текст кнопки меню
    hint: game.i18n.localize("PF2E-TOKEN-PACK.RestoreArtHint"), // Подсказка для меню
    icon: "fas fa-sync", // Иконка меню
    type: RestoreArtTokenRunner, // Класс формы восстановления
    restricted: true // Только для GM
  });
});

// Класс меню настроек модуля
class PathfinderBestiarySettingsMenu extends FormApplication {
  static get defaultOptions() {
    // Опции по умолчанию для формы настроек
    return mergeObject(super.defaultOptions, {
      id: "pf2e-token-pack-settings", // ID формы
      title: game.i18n.localize("PF2E-TOKEN-PACK.SettingsMenuTitle"), // Заголовок формы
      template: "modules/pf2e-token-pack/templates/settings-menu.html", // Путь к шаблону формы
      width: "700", // Ширина формы
      height: "auto", // Автоматическая высота
      closeOnSubmit: false // Не закрывать форму после отправки
    });
  }

  async getData() {
    // Группируем ключи по категориям для отображения в форме
    const groups = {
      bestiaries: [],
      adventurePath: [],
      rulebook: [],
      standalone: [],
      pregens: []
    };

    // Для каждого ключа — добавляем в нужную группу
    for (const { key, name, hint, category = "bestiaries" } of PathfinderBestiaryTokenPack.keys) {
      const settingKey = `enableOverwrite${key}`;

      // Если настройка не зарегистрирована — регистрируем её
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

      // Получаем текущее значение настройки
      const value = game.settings.get("pf2e-token-pack", settingKey);
      const entry = { key, settingKey, name, hint, value };

      // Добавляем в соответствующую группу
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(entry);
    }

    return { groups }; // Возвращаем сгруппированные данные для шаблона
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Переключатель отображения кнопок проверки
    const toggle = html.find("#toggle-check-buttons");
    const buttons = html.find(".check-button");

    // Функция для обновления видимости кнопок
    const updateButtonVisibility = () => {
      const show = toggle.prop("checked");
      buttons.css("display", show ? "inline-block" : "none");
    };

    toggle.on("change", updateButtonVisibility); // Слушатель изменения чекбокса
    updateButtonVisibility(); // Первичная установка видимости

    // Обработчик нажатия на кнопку проверки
    buttons.on("click", async function () {
      const key = this.dataset.key;
      if (key) {
        await PathfinderBestiaryTokenPack.checkBestiaryArt(key); // Проверка артов и токенов для выбранного бестиария
      }
    });
  }
}

// Класс меню восстановления артов токенов
class RestoreArtTokenRunner extends FormApplication {
  constructor(...args) {
    super(...args);
    // Сразу запускаем диалог при открытии меню
    new Dialog({
      title: game.i18n.localize("PF2E-TOKEN-PACK.RestoreDialogTitle"), // Заголовок диалога
      content: `<p>${game.i18n.localize("PF2E-TOKEN-PACK.RestoreDialogPrompt")}</p>`, // Текст диалога
      buttons: {
        active: {
          label: game.i18n.localize("PF2E-TOKEN-PACK.RestoreActiveScene"), // Кнопка для восстановления только на активной сцене
          callback: () => syncSceneTokens(true)
        },
        all: {
          label: game.i18n.localize("PF2E-TOKEN-PACK.RestoreAllScenes"), // Кнопка для восстановления на всех сценах
          callback: () => syncSceneTokens(false)
        },
        cancel: { label: game.i18n.localize("PF2E-TOKEN-PACK.Cancel") } // Кнопка отмены
      },
      default: "active"
    }).render(true);
  }

  // Не показываем форму вовсе
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "pf2e-token-restore-runner",
      template: "", // Пусто, форма не используется
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

// Получить список имён компендиумов из ключей
function getCompendiumNames() {
  return PathfinderBestiaryTokenPack.keys.map(k => k.packName); // Возвращает массив имён компендиумов для поиска актёров
}

// Получить имена актёров (не персонажей) со всех токенов на сценах
function getActorNamesFromScenes(scenes) {
  const names = new Set();
  for (const scene of scenes) {
    for (const token of scene.tokens) {
      if (token.actor && token.actor.type !== "character") {
         names.add(token.actor.name); // Добавляем имя актёра, если это не персонаж
      }
    }
  }
  return names;
}

// Найти актёров с совпадающими именами в компендиумах
async function fetchMatchingActorsFromCompendiums(actorNames) {
  const result = new Map();

  for (const compName of getCompendiumNames()) {
    const pack = game.packs.get(compName);
    if (!pack) continue;

    await pack.getIndex(); // Загружаем индекс компендиума
    for (const name of actorNames) {
      if (!result.has(name)) {
        const entry = pack.index.find(e => e.name === name);
        if (entry) {
          const actor = await pack.getDocument(entry._id); // Получаем документ актёра
          result.set(name, actor);
        }
      }
    }

    if (result.size === actorNames.size) break; // Если нашли всех — выходим
  }

  return result; // Возвращаем Map имя → актёр
}

// Синхронизировать токены на сцене с данными из компендиума
async function syncTokensOnScene(scene, compendiumActors) {
  const result = {
    sceneName: scene.name,
    actors: []
  };

  for (const tokenDoc of scene.tokens) {
    const tokenActor = tokenDoc.actor;
    if (!tokenActor || tokenActor.type === "character") continue; // Пропускаем персонажей

    const actorName = tokenActor.name;
    const compActor = compendiumActors.get(actorName);

    const actorResult = {
      name: actorName,
      missing: false,
      changes: {
        art: false,
        token: false,
        scale: false
      }
    };

    if (!compActor) {
      actorResult.missing = true; // Не найден в компендиумах
      result.actors.push(actorResult);
      continue;
    }

    const tokenData = tokenDoc.toObject();
    const compProto = compActor.prototypeToken;

    const updates = {};

    // Проверяем различия в изображении токена
    if (tokenData.texture?.src !== compProto.texture?.src) {
      updates["texture.src"] = compProto.texture.src;
      actorResult.changes.token = true;
    }
    // Проверяем различия в масштабе токена
    if (tokenData.texture.scaleX !== compProto.texture.scaleX) {
      updates["texture.scaleX"] = compProto.texture.scaleX;
      actorResult.changes.scale = true;
    }
    if (tokenData.texture.scaleY !== compProto.texture.scaleY) {
      updates["texture.scaleY"] = compProto.texture.scaleY;
      actorResult.changes.scale = true;
    }

    // Проверяем различия в арте актёра
    if (tokenActor.img !== compActor.img) {
      await tokenActor.update({ "img": compActor.img });
      actorResult.changes.art = true;
    }

    // Если есть изменения — обновляем токен
    if (Object.keys(updates).length > 0) {
      await tokenDoc.update(updates);
    }

    result.actors.push(actorResult);
  }

  return result; // Возвращаем результат по сцене
}

// Генерирует HTML-отчёт по результатам синхронизации
function generateReportHTML(reportData) {
  let html = `<style>
      details summary { cursor: pointer; font-weight: bold; margin: 4px 0; color: black; }
      .actor-item { margin-left: 1em; color: black; }
      .change-modified { margin-left: 1em; color: black; }
      .change-missing { margin-left: 1em; color: black; }
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
    const actorsWithChanges = scene.actors.filter(actor => actor.missing || actor.changes.art || actor.changes.token || actor.changes.scale);

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
        if (actor.changes.scale) html += `<li class="change-modified">${game.i18n.localize("PF2E-TOKEN-PACK.ScaleChanged")}</li>`;
      }
      html += `</ul></details>`;
    }

    html += `</details>`;
  }

  return html;
}

// Основная функция синхронизации токенов на сценах
async function syncSceneTokens(activeOnly = true) {
  const scenesToCheck = activeOnly ? [game.scenes.active] : game.scenes; // Определяем, какие сцены проверять
  const actorNames = getActorNamesFromScenes(scenesToCheck); // Получаем имена актёров на сценах
  const compendiumActors = await fetchMatchingActorsFromCompendiums(actorNames); // Получаем актёров из компендиумов

  let reportData = [];

  for (const scene of scenesToCheck) {
    const data = await syncTokensOnScene(scene, compendiumActors); // Синхронизируем токены на сцене
    reportData.push(data);
  }

  const content = generateReportHTML(reportData); // Генерируем HTML-отчёт

  const dlg = new Dialog({
    title: game.i18n.localize(activeOnly ? "PF2E-TOKEN-PACK.SyncTitleActive" : "PF2E-TOKEN-PACK.SyncTitleAll"), // Заголовок диалога
    content: `<div id="sync-report" style="overflow-y: auto; max-height: 500px;">${content}</div>`, // Содержимое диалога
    buttons: { ok: { label: "OK" } }, // Кнопка закрытия
    render: html => {
      const dialog = dlg;
      html[0].querySelector("#expand-all").addEventListener("click", () => {
        html[0].querySelectorAll("details").forEach(det => det.open = true); // Открыть все details
        dialog.setPosition({ height: "auto" });
      });
      html[0].querySelectorAll("details").forEach(det => {
        det.addEventListener("toggle", () => dialog.setPosition({ height: "auto" })); // Корректировка высоты при открытии/закрытии details
      });
    },
    width: 600 // Ширина диалога
  });

  dlg.render(true); // Показываем диалог
}