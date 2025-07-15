// Класс для управления модулем токенов бестиария Pathfinder
class PathfinderBestiaryTokenPack {
  // Инициализация настроек модуля
  static async initSettings() {
    // Список всех поддерживаемых бестиариев и их метаданных
    this.keys = [
      { key: "pf2e.pathfinder-bestiary"                , name: game.i18n.localize("SettingCompendiums.Bestiary")                      , category: "bestiaries"    },
      { key: "pf2e.pathfinder-bestiary-2"              , name: game.i18n.localize("SettingCompendiums.Bestiary2")                     , category: "bestiaries"    },
      { key: "pf2e.pathfinder-bestiary-3"              , name: game.i18n.localize("SettingCompendiums.Bestiary3")                     , category: "bestiaries"    },
      { key: "pf2e.pathfinder-monster-core"            , name: game.i18n.localize("SettingCompendiums.MonsterCore")                   , category: "bestiaries"    },
      { key: "pf2e.pathfinder-npc-core"                , name: game.i18n.localize("SettingCompendiums.NPCCore")                       , category: "bestiaries"    },
      { key: "pf2e.abomination-vaults-bestiary"        , name: game.i18n.localize("SettingCompendiums.AbominationVaultsBestiary")     , category: "adventurePath" },
      { key: "pf2e.age-of-ashes-bestiary"              , name: game.i18n.localize("SettingCompendiums.AgeofAshesBestiary")            , category: "adventurePath" },
      { key: "pf2e.agents-of-edgewatch-bestiary"       , name: game.i18n.localize("SettingCompendiums.AgentsofEdgewatchBestiary")     , category: "adventurePath" },
      { key: "pf2e.blood-lords-bestiary"               , name: game.i18n.localize("SettingCompendiums.BloodLordsBestiary")            , category: "adventurePath" },
      { key: "pf2e.curtain-call-bestiary"              , name: game.i18n.localize("SettingCompendiums.CurtainCallBestiary")           , category: "adventurePath" },
      { key: "pf2e.extinction-curse-bestiary"          , name: game.i18n.localize("SettingCompendiums.ExtinctionCurseBestiary")       , category: "adventurePath" },
      { key: "pf2e.fists-of-the-ruby-phoenix-bestiary" , name: game.i18n.localize("SettingCompendiums.FistsoftheRubyPhoenixBestiary") , category: "adventurePath" },
      { key: "pf2e.gatewalkers-bestiary"               , name: game.i18n.localize("SettingCompendiums.GatewalkersBestiary")           , category: "adventurePath" },
      { key: "pf2e.outlaws-of-alkenstar-bestiary"      , name: game.i18n.localize("SettingCompendiums.OutlawsofAlkenstarBestiary")    , category: "adventurePath" },
      { key: "pf2e.kingmaker-bestiary"                 , name: game.i18n.localize("SettingCompendiums.KingmakerBestiary")             , category: "adventurePath" },
      { key: "pf2e.quest-for-the-frozen-flame-bestiary", name: game.i18n.localize("SettingCompendiums.QuestfortheFrozenFlameBestiary"), category: "adventurePath" },
      { key: "pf2e.season-of-ghosts-bestiary"          , name: game.i18n.localize("SettingCompendiums.SeasonofGhostsBestiary")        , category: "adventurePath" },
      { key: "pf2e.seven-dooms-for-sandpoint-bestiary" , name: game.i18n.localize("SettingCompendiums.SevenDoomsforSandpointBestiary"), category: "adventurePath" },
      { key: "pf2e.sky-kings-tomb-bestiary"            , name: game.i18n.localize("SettingCompendiums.SkyKingsTombBestiary")          , category: "adventurePath" },
      { key: "pf2e.spore-war-bestiary"                 , name: game.i18n.localize("SettingCompendiums.SporeWar")                      , category: "adventurePath" },
      { key: "pf2e.strength-of-thousands-bestiary"     , name: game.i18n.localize("SettingCompendiums.StrengthofThousandsBestiary")   , category: "adventurePath" },
      { key: "pf2e.triumph-of-the-tusk-bestiary"       , name: game.i18n.localize("SettingCompendiums.TriumphoftheTtusk")             , category: "adventurePath" },
      { key: "pf2e.shades-of-blood-bestiary"           , name: game.i18n.localize("SettingCompendiums.ShadesofBlood")             , category: "adventurePath" },
      { key: "pf2e.stolen-fate-bestiary"               , name: game.i18n.localize("SettingCompendiums.StolenFateBestiary")            , category: "adventurePath" },
      { key: "pf2e.wardens-of-wildwood-bestiary"       , name: game.i18n.localize("SettingCompendiums.WardensofWildwoodBestiary")     , category: "adventurePath" },
      { key: "pf2e.book-of-the-dead-bestiary"          , name: game.i18n.localize("SettingCompendiums.BookoftheDeadBestiary")         , category: "rulebook"      },
      { key: "pf2e.blog-bestiary"                      , name: game.i18n.localize("SettingCompendiums.PaizoBlogBestiary")             , category: "rulebook"      },
      { key: "pf2e.howl-of-the-wild-bestiary"          , name: game.i18n.localize("SettingCompendiums.HowloftheWildBestiary")         , category: "rulebook"      },
      { key: "pf2e.lost-omens-bestiary"                , name: game.i18n.localize("SettingCompendiums.LostOmensBestiary")             , category: "rulebook"      },
      { key: "pf2e.npc-gallery"                        , name: game.i18n.localize("SettingCompendiums.NPCGallery")                    , category: "rulebook"      },
      { key: "pf2e.pathfinder-dark-archive"            , name: game.i18n.localize("SettingCompendiums.DarkArchive")                   , category: "rulebook"      },
      { key: "pf2e.rage-of-elements-bestiary"          , name: game.i18n.localize("SettingCompendiums.RageofElementsBestiary")        , category: "rulebook"      },
      { key: "pf2e.war-of-immortals-bestiary"          , name: game.i18n.localize("SettingCompendiums.WarofImmortalsBestiary")        , category: "rulebook"      },
      { key: "pf2e.claws-of-the-tyrant-bestiary"       , name: game.i18n.localize("SettingCompendiums.ClawsoftheTyrantBestiary")      , category: "standalone"    },
      { key: "pf2e.fall-of-plaguestone-bestiary"       , name: game.i18n.localize("SettingCompendiums.FallofPlaguestoneBestiary")     , category: "standalone"    },
      { key: "pf2e.malevolence-bestiary"               , name: game.i18n.localize("SettingCompendiums.MalevolenceBestiary")           , category: "standalone"    },
      { key: "pf2e.menace-under-otari-bestiary"        , name: game.i18n.localize("SettingCompendiums.MenaceUnderOtariBestiary")      , category: "standalone"    },
      { key: "pf2e.one-shot-bestiary"                  , name: game.i18n.localize("SettingCompendiums.OneShotBestiary")               , category: "standalone"    },
      { key: "pf2e.prey-for-death-bestiary"            , name: game.i18n.localize("SettingCompendiums.PreyforDeathBestiary")          , category: "standalone"    },
      { key: "pf2e.rusthenge-bestiary"                 , name: game.i18n.localize("SettingCompendiums.RusthengeBestiary")             , category: "standalone"    },
      { key: "pf2e.shadows-at-sundown-bestiary"        , name: game.i18n.localize("SettingCompendiums.ShadowsatSundownBestiary")      , category: "standalone"    },
      { key: "pf2e.the-enmity-cycle-bestiary"          , name: game.i18n.localize("SettingCompendiums.TheEnmityCycleBestiary")        , category: "standalone"    },
      { key: "pf2e.the-slithering-bestiary"            , name: game.i18n.localize("SettingCompendiums.TheSlitheringBestiary")         , category: "standalone"    },
      { key: "pf2e.troubles-in-otari-bestiary"         , name: game.i18n.localize("SettingCompendiums.TroublesinOtariBestiary")       , category: "standalone"    },
      { key: "pf2e.night-of-the-gray-death-bestiary"   , name: game.i18n.localize("SettingCompendiums.NightoftheGrayDeathBestiary")   , category: "standalone"    },
      { key: "pf2e.crown-of-the-kobold-king-bestiary"  , name: game.i18n.localize("SettingCompendiums.CrownoftheKoboldKingBestiary")  , category: "standalone"    },
      { key: "pf2e.pfs-introductions-bestiary"         , name: game.i18n.localize("SettingCompendiums.Intro")                         , category: "season"        },
      { key: "pf2e.pfs-season-1-bestiary"              , name: game.i18n.localize("SettingCompendiums.Season1")                       , category: "season"        },
      { key: "pf2e.paizo-pregens"                      , name: game.i18n.localize("SettingCompendiums.AdventurePregens")              , category: "pregens"       }
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
      });
      
      // Сохраняет текущее значение настройки
      this.previousSettings[`enableOverwrite${key}`] = game.settings.get("pf2e-token-pack", `enableOverwrite${key}`);
    });

    // 🧠 Автоматическая синхронизация bestiaries.json с настройками (добавление/удаление "Ю")
      try {
    const response = await fetch("modules/pf2e-token-pack/bestiaries.json");
    const originalData = await response.json();
    const syncedData = {};

    for (const [rawKey, content] of Object.entries(originalData)) {
      const baseKey = rawKey.endsWith("Ю") ? rawKey.slice(0, -1) : rawKey;
      const settingKey = `enableOverwrite${baseKey}`;
      const enabled = game.settings.get("pf2e-token-pack", settingKey);
      const newKey = enabled ? `${baseKey}Ю` : baseKey;
      syncedData[newKey] = content;
    }

    // Сравниваем старый и новый JSON, если есть отличия — сохраняем
    const originalStr = JSON.stringify(originalData, null, 2);
    const newStr = JSON.stringify(syncedData, null, 2);

    if (originalStr !== newStr) {
      const blob = new Blob([newStr], { type: "application/json" });
      const file = new File([blob], "bestiaries.json", { type: "application/json" });
      const result = await FilePicker.upload("data", "modules/pf2e-token-pack", file, {});
      if (result.status === "success") {
        console.log(game.i18n.localize("SettingCompendiums.BestiariesSynced"));
      } else {
        console.warn(game.i18n.localize("SettingCompendiums.BestiariesSyncFailed"));
      }
    }
  } catch (error) {
    console.error(game.i18n.localize("SettingCompendiums.BestiariesSyncError"), error);
  }
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
    if (!response.ok) throw new Error(game.i18n.localize("SettingCompendiums.FailedToFetch"));
    return await response.json();
  }
  
  // Загрузка обновлённого файла bestiaries.json через FilePicker
  static async uploadBestiary(data, fileName) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const result = await FilePicker.upload("data", "modules/pf2e-token-pack", new File([blob], fileName), {});
    if (result.status !== "success") throw new Error(game.i18n.format("SettingCompendiums.FailedToUpload", { file: fileName }));
  }
    
  // Переименование ключа в объекте данных
  static modifyKeys(data, oldKey, newKey) {
    if (oldKey in data) {
      data[newKey] = data[oldKey];
      delete data[oldKey];
    }
    return data;
  }
    


// Проверка соответствия артов и токенов в компендиуме и bestiaries.json
static async checkBestiaryArt(key) {
  try {
    const response = await fetch("modules/pf2e-token-pack/bestiaries.json");
    const originalData = await response.json();
    const bestiary = originalData[key];

    if (!bestiary) {
      ui.notifications.warn(game.i18n.format("SettingCompendiums.WarnNoDataForKey", { key }));
      return;
    }

    const pack = game.packs.get(key);
    if (!pack) {
      ui.notifications.error(game.i18n.format("SettingCompendiums.ErrorCompendiumNotLoaded", { packName: key }));
      return;
    }

    // --- Сбор и сортировка данных из компендиума ---
    const index = await pack.getIndex({ fields: ["name", "type", "folder", "sort"] });
    const naturalSort = (a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });

    let sortedIndex = [];
    const rootDocuments = index.filter(doc => doc.folder === null || doc.folder === undefined);
    rootDocuments.sort(naturalSort);
    sortedIndex.push(...rootDocuments);

    const folders = [...pack.folders].sort(naturalSort);
    for (const folder of folders) {
        const folderContents = index.filter(doc => doc.folder === folder.id);
        folderContents.sort(naturalSort);
        sortedIndex.push(...folderContents);
    }

    // --- Подготовка к анализу ---
    const reorderedBestiary = {};
    const compendiumIds = new Set(sortedIndex.map(e => e._id));

    // --- Анализ проблем ---
    const deadIds = Object.keys(bestiary).filter(id => !compendiumIds.has(id)).map(id => ({ id, name: bestiary[id]?.name || 'Имя не найдено' }));
    const missingInModuleByFolder = {};
    const missingImagesByFolder = { art: {}, token: {}, ring: {} };
    const usedFiles = new Set();
    const relatedDirs = new Set();

    const collectPath = (p) => {
      if (p) {
        usedFiles.add(p);
        const dir = p.split("/").slice(0, -1).join("/");
        if (dir.startsWith("modules/pf2e-token-pack")) relatedDirs.add(dir);
      }
    };
    
    async function fileExists(path) {
      if (!path) return false;
      try {
        const dir = path.substring(0, path.lastIndexOf('/'));
        return (await FilePicker.browse("data", dir)).files.some(f => f === path);
      } catch { return false; }
    }

    const folderIdToNameMap = new Map();
    folders.forEach(f => folderIdToNameMap.set(f.id, f.name));
    const rootFolderName = game.i18n.localize("SettingCompendiums.CheckRootFolder");
    
    for (const entry of sortedIndex) {
      const { _id: actorId, name: actorName, type, folder } = entry;
      if (type === "hazard") continue;

      const groupName = folderIdToNameMap.get(folder) || rootFolderName;
      const expected = bestiary[actorId];

      if (expected) {
        reorderedBestiary[actorId] = expected;
        collectPath(expected.actor);
        collectPath(expected.token?.texture?.src);
        collectPath(expected.token?.ring?.subject?.texture);
        
        const addMissingImage = (imgType, path) => {
          if (!missingImagesByFolder[imgType][groupName]) missingImagesByFolder[imgType][groupName] = [];
          missingImagesByFolder[imgType][groupName].push({ name: actorName, path });
        };

        if (expected.actor && !(await fileExists(expected.actor))) addMissingImage('art', expected.actor);
        if (expected.token?.texture?.src && !(await fileExists(expected.token.texture.src))) addMissingImage('token', expected.token.texture.src);
        if (expected.token?.ring?.subject?.texture && !(await fileExists(expected.token.ring.subject.texture))) addMissingImage('ring', expected.token.ring.subject.texture);
      } else {
        if (!missingInModuleByFolder[groupName]) missingInModuleByFolder[groupName] = [];
        missingInModuleByFolder[groupName].push({ id: actorId, name: actorName });
      }
    }
    
    // --- Финальные вычисления и проверки ---
    let allModuleFiles = new Set();
    async function listAllFilesRecursive(dir) {
      const files = [];
      try {
        const result = await FilePicker.browse("data", dir);
        files.push(...result.files);
        for (const subdir of result.dirs) {
          files.push(...await listAllFilesRecursive(subdir));
        }
      } catch (err) {}
      return files;
    }
    for (const dir of relatedDirs) {
        const filesInDir = await listAllFilesRecursive(dir);
        filesInDir.forEach(f => allModuleFiles.add(f));
    }
    const unusedFiles = [...allModuleFiles].filter(f => !usedFiles.has(f));

    // --- Группируем неиспользуемые файлы по их родительской папке ---
    const unusedFilesByFolder = {};
    for (const path of unusedFiles) {
      const fullDir = path.substring(0, path.lastIndexOf('/'));
      const shortDirName = fullDir.split('/').pop(); // Получаем только имя последней папки
      if (!unusedFilesByFolder[shortDirName]) {
        unusedFilesByFolder[shortDirName] = [];
      }
      unusedFilesByFolder[shortDirName].push(path);
    }
    
    const totalMissingInModule = Object.values(missingInModuleByFolder).flat().length;
    const totalMissingArt = Object.values(missingImagesByFolder.art).flat().length;
    const totalMissingToken = Object.values(missingImagesByFolder.token).flat().length;
    const totalMissingRing = Object.values(missingImagesByFolder.ring).flat().length;
    const totalMissingImages = totalMissingArt + totalMissingToken + totalMissingRing;
    const noProblems = deadIds.length === 0 && totalMissingInModule === 0 && unusedFiles.length === 0 && totalMissingImages === 0;

    const originalValidKeys = Object.keys(bestiary).filter(id => compendiumIds.has(id));
    const isOrderDifferent = JSON.stringify(originalValidKeys) !== JSON.stringify(Object.keys(reorderedBestiary));
    
    const keyObj = PathfinderBestiaryTokenPack.keys.find(k => k.key === key);
    const title = game.i18n.format("SettingCompendiums.CheckTitle", { name: keyObj?.name ?? key });

    // --- ЛОГИКА ВЫБОРА ОКНА ---
    if (noProblems) {
      // СЛУЧАЙ 1: Проблем с файлами нет, показываем простое окно
      new Dialog({
        title: title,
        content: `<p style="text-align: center; font-size: 1.2em;">${game.i18n.localize("SettingCompendiums.AllValid")}</p>` +
                 (isOrderDifferent ? `<p style="text-align: center; color: var(--color-text-dark-primary);">${game.i18n.localize("SettingCompendiums.CheckSortNeeded")}</p>` : ''),
        buttons: {
          ok: {
            label: game.i18n.localize("SettingCompendiums.CheckOk"),
            icon: "<i class='fas fa-check'></i>",
            callback: async () => {
              if (isOrderDifferent) {
                originalData[key] = reorderedBestiary;
                const blob = new Blob([JSON.stringify(originalData, null, 2)], { type: "application/json" });
                const file = new File([blob], "bestiaries.json", { type: "application/json" });
                await FilePicker.upload("data", "modules/pf2e-token-pack", file, {});
                ui.notifications.info(game.i18n.localize("SettingCompendiums.CheckFileUpdated"));
              } else {
                ui.notifications.info(game.i18n.localize("SettingCompendiums.CheckNoChanges"));
              }
            }
          },
          cancel: {
            label: game.i18n.localize("SettingCompendiums.Cancel"),
            icon: "<i class='fas fa-times'></i>",
          }
        },
        default: "ok"
      }).render(true);

    } else {
      // СЛУЧАЙ 2: Есть проблемы, показываем детализированный отчет
      const sortedDisplayGroups = [];
      if (rootDocuments.length > 0) sortedDisplayGroups.push(rootFolderName);
      folders.forEach(folder => {
        if (index.some(doc => doc.folder === folder.id)) sortedDisplayGroups.push(folder.name);
      });
      
      const createList = (items, type) => {
          if (items.length === 0) return `<li>${game.i18n.localize("SettingCompendiums.CheckNoIssues")}</li>`;
          return items.map(item => {
              let details = '';
              if (type === 'id') details = `<br><small>(${item.id})</small>`;
              else if (type === 'path') details = `<br><small>(${item.path || item})</small>`;
              return `<li><strong>${item.name || 'File'}</strong>${details}</li>`;
          }).join('');
      };
      
      const createFolderizedList = (dataByFolder, sortedGroups, type) => {
          if (Object.keys(dataByFolder).length === 0) return `<li>${game.i18n.localize("SettingCompendiums.CheckNoIssues")}</li>`;
          let html = '';
          for (const groupName of sortedGroups) {
              if (dataByFolder[groupName] && dataByFolder[groupName].length > 0) {
                  html += `<li class="folder-header"><h3>${Handlebars.escapeExpression(groupName)}</h3></li>`;
                  html += createList(dataByFolder[groupName], type);
              }
          }
          return html || `<li>${game.i18n.localize("SettingCompendiums.CheckNoIssues")}</li>`;
      };
  
      const createUnusedList = (filesByFolder) => {
      const sortedFolders = Object.keys(filesByFolder).sort();
      if (sortedFolders.length === 0) {
        return `<li>${game.i18n.localize("SettingCompendiums.CheckNoUnused")}</li>`;
      }

      let html = '';
      for (const folder of sortedFolders) {
        html += `<li class="folder-header"><h3>${Handlebars.escapeExpression(folder)}</h3></li>`;
        const files = filesByFolder[folder].sort();
        html += files.map(path => {
          const name = decodeURIComponent(path.split("/").pop());
          return `<li><strong>${name}</strong><br><small>(${path})</small></li>`;
        }).join('');
      }
      return html;
    };
  
      const dialogContent = `
        <style>
          .check-results-dialog .window-content { display: flex; flex-direction: column; height: 100%; }
          .check-results-dialog .dialog-content { flex-grow: 1; overflow-y: auto; }
          .check-results-dialog .dialog-buttons { flex-shrink: 0; flex: 0}
          .check-results-container details { border: 1px solid #ccc; border-radius: 4px; margin-bottom: 10px; }
          .check-results-container summary { font-weight: bold; padding: 10px; background-color: rgba(0, 0, 0, 0.1); cursor: pointer; }
          .check-results-container .content-wrapper, .check-results-container .image-sub-content { max-height: 450px; overflow-y: auto; padding: 5px 10px; }
          .check-results-container .image-sub-container { padding: 5px; border-top: 1px solid #444; margin-top: 5px; }
          .check-results-container .image-sub-container details { border-color: #555; margin-left: 10px; }
          .check-results-container .image-sub-container summary { background-color: rgba(0, 0, 0, 0.2); padding: 8px; }
          .check-results-container .image-sub-content { max-height: 250px; }
          .check-results-container ul { list-style-type: none; padding-left: 0; margin: 0; }
          .check-results-container li { padding: 5px 0; border-bottom: 1px solid #282828; }
          .check-results-container li:last-child { border-bottom: none; }
          .check-results-container li.folder-header {
              padding: 8px 4px; background-color: rgba(0, 0, 0, 0.3);
              border-top: 1px solid #444; border-bottom: 1px solid #444;
              margin-top: 10px;
          }
          .check-results-container ul > li.folder-header:first-child { margin-top: 0; }
          .check-results-container li.folder-header h3 { margin: 0; font-size: 1.1em; }
        </style>
        <div class="check-results-container">
          <details>
            <summary>${game.i18n.localize("SettingCompendiums.CheckSummaryDead")} (${deadIds.length})</summary>
            <div class="content-wrapper"><ul>${createList(deadIds, 'id')}</ul></div>
          </details>
          <details>
            <summary>${game.i18n.localize("SettingCompendiums.CheckSummaryMissingModule")} (${totalMissingInModule})</summary>
            <div class="content-wrapper"><ul>${createFolderizedList(missingInModuleByFolder, sortedDisplayGroups, 'id')}</ul></div>
          </details>
          <details>
            <summary>${game.i18n.localize("SettingCompendiums.CheckSummaryMissingImages")} (${totalMissingImages})</summary>
            <div class="image-sub-container">
              <details>
                  <summary>${game.i18n.localize("SettingCompendiums.CheckImgTypeArt")} (${totalMissingArt})</summary>
                  <div class="image-sub-content"><ul>${createFolderizedList(missingImagesByFolder.art, sortedDisplayGroups, 'path')}</ul></div>
              </details>
              <details>
                  <summary>${game.i18n.localize("SettingCompendiums.CheckImgTypeToken")} (${totalMissingToken})</summary>
                  <div class="image-sub-content"><ul>${createFolderizedList(missingImagesByFolder.token, sortedDisplayGroups, 'path')}</ul></div>
              </details>
              <details>
                  <summary>${game.i18n.localize("SettingCompendiums.CheckImgTypeRing")} (${totalMissingRing})</summary>
                  <div class="image-sub-content"><ul>${createFolderizedList(missingImagesByFolder.ring, sortedDisplayGroups, 'path')}</ul></div>
              </details>
            </div>
          </details>
          <details>
              <summary>${game.i18n.localize("SettingCompendiums.CheckSummaryUnused")} (${unusedFiles.length})</summary>
              <div class="content-wrapper">
                  <p><em><small>${game.i18n.localize("SettingCompendiums.ManualDeleteNote")}</small></em></p>
                  <ul>${createUnusedList(unusedFilesByFolder)}</ul>
              </div>
          </details>
        </div>
      `;

      new Dialog({
        title,
        content: dialogContent,
        buttons: {
          ok: {
            label: game.i18n.localize("SettingCompendiums.CheckOk"),
            icon: "<i class='fas fa-check'></i>",
            callback: async () => {
              const needsUpdate = deadIds.length > 0 || isOrderDifferent;
              if (needsUpdate) {
                originalData[key] = reorderedBestiary;
                const blob = new Blob([JSON.stringify(originalData, null, 2)], { type: "application/json" });
                const file = new File([blob], "bestiaries.json", { type: "application/json" });
                await FilePicker.upload("data", "modules/pf2e-token-pack", file, {});
                ui.notifications.info(game.i18n.localize("SettingCompendiums.CheckFileUpdated"));
              } else {
                ui.notifications.info(game.i18n.localize("SettingCompendiums.CheckNoChanges"));
              }
            }
          },
          cancel: {
            label: game.i18n.localize("SettingCompendiums.Cancel"),
            icon: "<i class='fas fa-times'></i>",
            callback: () => {
              ui.notifications.info(game.i18n.localize("SettingCompendiums.CheckCancelled"));
            }
          }
        },
        default: "cancel"
      }, {
          width: 800,
          height: 750,
          resizable: true,
          classes: ["dialog", "check-results-dialog"]
      }).render(true);
    }
  } catch (e) {
    console.error(e);
    ui.notifications.error(game.i18n.format("SettingCompendiums.ErrorCheckBestiaries", { message: e.message }));
  }
}
}

// Инициализация модуля
Hooks.once('init', () => PathfinderBestiaryTokenPack.init()); // При событии 'init' (ранняя инициализация Foundry) вызывается метод init(), который настраивает сокеты для взаимодействия между клиентами

Hooks.once('ready', () => PathfinderBestiaryTokenPack.initSettings()); // При событии 'ready' (после полной загрузки Foundry) вызывается метод initSettings(), который регистрирует все настройки модуля

// Регистрируем меню настроек модуля
Hooks.once("init", () => {
  game.settings.registerMenu("pf2e-token-pack", "tokenPackSettings", {
    name: game.i18n.localize("SettingCompendiums.TokenSettingsLabel"), // Название меню настроек
    label: game.i18n.localize("SettingCompendiums.TokenSettingsButton"), // Текст кнопки меню
    hint: game.i18n.localize("SettingCompendiums.TokenSettingsHint"), // Подсказка для меню
    icon: "fas fa-dungeon", // Иконка меню
    type: PathfinderBestiarySettingsMenu, // Класс формы настроек
    restricted: true // Только для GM
  });
});

// Класс меню настроек модуля
class PathfinderBestiarySettingsMenu extends FormApplication {
  static get defaultOptions() {
    // Опции по умолчанию для формы настроек
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "pf2e-token-pack-settings", // ID формы
      title: game.i18n.localize("SettingCompendiums.SettingsMenuTitle"), // Заголовок формы
      template: "modules/pf2e-token-pack/data/templates/Setting-Compendiums.hbs", // Путь к шаблону формы
      width: "700", // Ширина формы
      height: "1200", // Высота теперь автоматическая
      classes: ["pf2e-token-pack-settings-form"],
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
      season: [],
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

    // Добавляем стили для закрепления кнопки
    // Этот блок стилей больше не нужен, так как высота окна 'auto'
  }

  // Работа с перезаписью файла bestiaries.json
async _updateObject(event, formData) {
  let changed = false;
  for (const [key, value] of Object.entries(formData)) {
    const current = game.settings.get("pf2e-token-pack", key);
    if (current !== value) changed = true;
    await game.settings.set("pf2e-token-pack", key, value);
  }

  if (!changed) {
    ui.notifications.info(game.i18n.localize("SettingCompendiums.NoSettingsChanged"));
    return this.close();
  }

  // Загружаем bestiaries.json
  const response = await fetch("modules/pf2e-token-pack/bestiaries.json");
  const originalData = await response.json();
  const newData = {};

  for (const [rawKey, content] of Object.entries(originalData)) {
    // Удаляем Ю если есть
    const baseKey = rawKey.endsWith("Ю") ? rawKey.slice(0, -1) : rawKey;
    const settingKey = `enableOverwrite${baseKey}`;
    const enabled = formData[settingKey];

    // Добавляем Ю только если чекбокс включен
    const newKey = enabled ? `${baseKey}Ю` : baseKey;
    newData[newKey] = content;
  }

  // Перезаписываем файл только если данные изменились
  const originalStr = JSON.stringify(originalData, null, 2);
  const newStr = JSON.stringify(newData, null, 2);

  if (originalStr !== newStr) {
    const blob = new Blob([newStr], { type: "application/json" });
    const file = new File([blob], "bestiaries.json", { type: "application/json" });

    const result = await FilePicker.upload("data", "modules/pf2e-token-pack", file, {});
    if (result.status !== "success") {
      ui.notifications.error(game.i18n.localize("SettingCompendiums.FailedToUpload"));
      return;
    }
  }
  // Закрываем текущее окно настроек
  await this.close();
  
  // Создаем диалог об успешном обновлении и требовании перезагрузки
  new Dialog({
    title: game.i18n.localize("SettingCompendiums.ReloadTitle"),
    content: `<p>${game.i18n.localize("SettingCompendiums.BestiaryUpdatedMessage")}</p>`,
    buttons: {
      ok: {
        label: "OK",
        callback: () => location.reload()
      }
    },
    default: "ok"
  }).render(true);
}

}