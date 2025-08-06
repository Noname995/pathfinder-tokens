/**
 * Класс для управления модулем токенов бестиария Pathfinder.
 * Отвечает за генерацию пользовательского файла бестиария на основе эталона,
 * управление настройками и проверку целостности данных.
 */
class PathfinderBestiaryTokenPack {
  // --- Константы путей к файлам ---
  // Путь к эталонному файлу, содержащему все компендиумы.
  static MASTER_FILE_PATH = "modules/pf2e-token-pack/data/_sources/bestiaries-master.json";
  // Путь к папке с исходными .json файлами для каждого компендиума.
  static SOURCE_FOLDER_PATH = "modules/pf2e-token-pack/data/_sources";
  // Путь, куда будет сохранен сгенерированный пользовательский bestiaries.json.
  static USER_BESTIARY_PATH = "modules/pf2e-token-pack";

  /**
   * Инициализирует настройки модуля при загрузке мира.
   * Регистрирует настройки для каждого компендиума и запускает сборку
   * пользовательского файла bestiaries.json.
   */
  static async initSettings() {
    // Список всех поддерживаемых бестиариев и их метаданных.
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
      { key: "pf2e.shades-of-blood-bestiary"           , name: game.i18n.localize("SettingCompendiums.ShadesofBlood")                 , category: "adventurePath" },
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

    // Регистрирует каждую настройку для каждого бестиария.
    this.keys.forEach(({key, name, hint}) => {
      game.settings.register("pf2e-token-pack", `enableOverwrite${key}`, {
        name: name,
        hint: hint,
        scope: "world",
        config: false,
        default: false, // ✅ ИЗМЕНЕНО: По умолчанию false (галочка снята).
        type: Boolean,
      });
    });

    // Запускаем сборку пользовательского файла при загрузке.
    await this.buildUserBestiary();
  }

/**
   * Собирает bestiaries.json на основе эталонного файла и настроек пользователя.
   * Выполняет перезапись файла только если обнаружены изменения.
   */
static async buildUserBestiary() {
    try {
        const masterResponse = await fetch(this.MASTER_FILE_PATH);
        if (!masterResponse.ok) {
            ui.notifications.warn(game.i18n.format("SettingCompendiums.WarnMasterNotFound", { path: this.MASTER_FILE_PATH }));
            return;
        }
        const masterData = await masterResponse.json();
        const idealUserData = {};

        for (const [key, content] of Object.entries(masterData)) {
            const settingKey = `enableOverwrite${key}`;
            if (!game.settings.get("pf2e-token-pack", settingKey)) {
                idealUserData[key] = content;
            }
        }

        let currentUserData = null;
        try {
            const userResponse = await fetch(`${this.USER_BESTIARY_PATH}/bestiaries.json?${Date.now()}`); 
            if (userResponse.ok) {
                currentUserData = await userResponse.json();
            }
        } catch (e) {
            console.log(`pf2e-token-pack | ${game.i18n.localize("SettingCompendiums.LogUserBestiaryNew")}`);
        }

        const idealDataString = JSON.stringify(idealUserData, null, 2);
        const currentDataString = JSON.stringify(currentUserData, null, 2);

        if (idealDataString === currentDataString) {
            console.log(`pf2e-token-pack | ${game.i18n.localize("SettingCompendiums.LogUserBestiaryUpToDate")}`);
            return; // Файл не менялся, выходим.
        }
        
        // --- Этот блок выполняется, только если файл был изменен ---
        console.log(`pf2e-token-pack | ${game.i18n.localize("SettingCompendiums.LogUserBestiaryRebuilding")}`);
        const blob = new Blob([idealDataString], { type: "application/json" });
        const file = new File([blob], "bestiaries.json", { type: "application/json" });
        await FilePicker.upload("data", this.USER_BESTIARY_PATH, file, {notify: false}); 
        console.log(`pf2e-token-pack | ${game.i18n.localize("SettingCompendiums.LogUserBestiaryRebuilt")}`);

        // ИЗМЕНЕНИЕ: Добавляем диалоговое окно с предложением перезагрузки.
        new Dialog({
          title: game.i18n.localize("SettingCompendiums.ReloadTitle"),
          content: `<p>${game.i18n.localize("SettingCompendiums.BestiaryUpdatedMessage")}</p>`,
          buttons: {
            ok: {
              label: game.i18n.localize("SettingCompendiums.ReloadButton"),
              callback: () => location.reload()
            }
          },
          default: "ok"
        }).render(true);

    } catch (error) {
        console.error(`pf2e-token-pack | ${game.i18n.localize("SettingCompendiums.BestiariesSyncError")}:`, error);
        ui.notifications.error(game.i18n.localize("SettingCompendiums.BestiariesSyncError"));
    }
  }

  /**
   * Инициализация сокета для взаимодействия между клиентами (если потребуется).
   */
  static init() {
    game.socket.on("module.pf2e-token-pack", async data => {
      if (data.action === "overwriteBestiary" && game.user.isGM) {
        // Эта логика может быть расширена в будущем.
      }
    });
  }

/**
   * Проверяет целостность данных компендиума, сравнивая его с эталонным файлом.
   * Находит "мертвые" записи, отсутствующие файлы и другие несоответствия.
   * @param {string} key - Ключ проверяемого компендиума (например, "pf2e.pathfinder-bestiary").
   */
static async checkBestiaryArt(key) {
    try {
      const masterResponse = await fetch(this.MASTER_FILE_PATH);
      if (!masterResponse.ok) throw new Error(game.i18n.format("SettingCompendiums.ErrorLoadingMaster", { path: this.MASTER_FILE_PATH }));
      const masterData = await masterResponse.json();
      const bestiary = masterData[key];

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

      // --- Логика сортировки ---
      const processedIds = new Set();
      const sortedIndex = [];
      const folders = [...pack.folders].sort(naturalSort);
      
      const rootDocuments = index.filter(doc => !doc.folder);
      rootDocuments.sort(naturalSort);
      sortedIndex.push(...rootDocuments);
      rootDocuments.forEach(doc => processedIds.add(doc._id));

      for (const folder of folders) {
          const folderContents = index.filter(doc => doc.folder === folder.id);
          folderContents.sort(naturalSort);
          sortedIndex.push(...folderContents);
          folderContents.forEach(doc => processedIds.add(doc._id));
      }

      const orphanDocuments = index.filter(doc => !processedIds.has(doc._id));
      orphanDocuments.sort(naturalSort);
      sortedIndex.push(...orphanDocuments);
      
      // --- Подготовка к анализу ---
      const reorderedBestiary = {};
      const compendiumIds = new Set(index.map(e => e._id));

      // --- Анализ проблем ---
      const deadIdsData = Object.keys(bestiary).filter(id => !compendiumIds.has(id)).map(id => ({ id, name: bestiary[id]?.name || game.i18n.localize("SettingCompendiums.CheckNameNotFound") }));
      const deadIds = deadIdsData.map(d => d.id);
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

      const folderIdToNameMap = new Map(folders.map(f => [f.id, f.name]));
      const rootFolderName = game.i18n.localize("SettingCompendiums.CheckRootFolder");
      const orphanFolderName = game.i18n.localize("SettingCompendiums.CheckOrphanedFolder") || "Без папки / Потерянные";
      
      for (const entry of sortedIndex) {
        const { _id: actorId, name: actorName, type, folder } = entry;
        if (type === "hazard") continue;

        const groupName = folder ? (folderIdToNameMap.get(folder) || orphanFolderName) : rootFolderName;
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

      const unusedFilesByFolder = {};
      for (const path of unusedFiles) {
        const fullDir = path.substring(0, path.lastIndexOf('/'));
        const shortDirName = fullDir.split('/').pop();
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

      const keyObj = this.keys.find(k => k.key === key);
      const title = game.i18n.format("SettingCompendiums.CheckTitle", { name: keyObj?.name ?? key });

      // --- Отображение диалогового окна ---
      if (noProblems) {
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
                  // ✅ ИЗМЕНЕНИЕ: Эта логика была перенесена в общую кнопку "Fix" ниже,
                  // но оставлена здесь для случаев, когда других проблем нет.
                  // Она также будет обновлять оба файла.
                  const finalCompendiumData = reorderedBestiary;

                  // Обновляем мастер-файл
                  masterData[key] = finalCompendiumData;
                  const masterBlob = new Blob([JSON.stringify(masterData, null, 2)], { type: "application/json" });
                  await FilePicker.upload("data", this.SOURCE_FOLDER_PATH, new File([masterBlob], "bestiaries-master.json"), {});

                  // Обновляем исходный файл компендиума
                  const keyInfo = this.keys.find(k => k.key === key);
                  const category = keyInfo?.category;
                  const categoryToFolderMap = {
                    bestiaries: "bestiary",
                    adventurePath: "adventure-patch",
                    rulebook: "ruleboock",
                    standalone: "standalone-adventures",
                    season: "pathfinder-society",
                    pregens: "pregenerated-pCs"
                  };
                  const subfolder = category ? categoryToFolderMap[category] : undefined;
                  if (subfolder) {
                    const sourceFileName = `${key}.json`;
                    const sourceFileDirectory = `${this.SOURCE_FOLDER_PATH}/${subfolder}`;
                    const finalSourceData = { [key]: finalCompendiumData };
                    const sourceBlob = new Blob([JSON.stringify(finalSourceData, null, 2)], { type: "application/json" });
                    await FilePicker.upload("data", sourceFileDirectory, new File([sourceBlob], sourceFileName), {});
                  }
                  
                  await this.buildUserBestiary();
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
        // ... (код для генерации HTML-контента диалога остается без изменений) ...
        const allFoundGroups = new Set([
            ...Object.keys(missingInModuleByFolder), 
            ...Object.keys(missingImagesByFolder.art),
            ...Object.keys(missingImagesByFolder.token),
            ...Object.keys(missingImagesByFolder.ring)
        ]);

        const sortedDisplayGroups = [];
        if (allFoundGroups.has(rootFolderName)) sortedDisplayGroups.push(rootFolderName);
        folders.forEach(folder => {
            if (allFoundGroups.has(folder.name)) sortedDisplayGroups.push(folder.name);
        });
        if (allFoundGroups.has(orphanFolderName)) sortedDisplayGroups.push(orphanFolderName);
        
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
              <div class="content-wrapper"><ul>${createList(deadIdsData, 'id')}</ul></div>
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
            fix: {
              label: game.i18n.localize("SettingCompendiums.FixAndDeleteButton"),
              icon: "<i class='fas fa-trash-alt'></i>",
              // ✅ ИЗМЕНЕНИЕ: Полностью переписанная логика кнопки "Исправить"
              callback: async () => {
                const hasDeadIds = deadIds.length > 0;
                if (!hasDeadIds && !isOrderDifferent) {
                    ui.notifications.info(game.i18n.localize("SettingCompendiums.CheckNoChanges"));
                    return;
                }
                
                ui.notifications.info(game.i18n.localize("SettingCompendiums.CleaningStarted"));

                // 1. Определяем финальные, корректные данные для компендиума
                const finalCompendiumData = reorderedBestiary;
                if (hasDeadIds) {
                    // reorderedBestiary уже отфильтрован от "мертвых" ID, так как он строится на основе pack.getIndex
                }
                
                // 2. Обновляем `bestiaries-master.json`
                masterData[key] = finalCompendiumData;
                const masterBlob = new Blob([JSON.stringify(masterData, null, 2)], { type: "application/json" });
                await FilePicker.upload("data", this.SOURCE_FOLDER_PATH, new File([masterBlob], "bestiaries-master.json"), {});
                ui.notifications.info(game.i18n.format("SettingCompendiums.MasterCleaned", { file: "bestiaries-master.json" }));

                // 3. Обновляем индивидуальный исходный файл компендиума
                const keyInfo = this.keys.find(k => k.key === key);
                const category = keyInfo?.category;
                
                // Карта для сопоставления категории с именем папки
                const categoryToFolderMap = {
                    bestiaries: "bestiary",
                    adventurePath: "adventure-patch",
                    rulebook: "ruleboock", // Имя папки согласно вашему списку
                    standalone: "standalone-adventures",
                    season: "pathfinder-society",
                    pregens: "pregenerated-pCs"
                };

                const subfolder = category ? categoryToFolderMap[category] : undefined;

                if (subfolder) {
                    const sourceFileName = `${key}.json`;
                    const sourceFileDirectory = `${this.SOURCE_FOLDER_PATH}/${subfolder}`;
                    // Исходный файл должен иметь структуру { "ключ_компендиума": { ...данные... } }
                    const finalSourceData = { [key]: finalCompendiumData };
                    const sourceBlob = new Blob([JSON.stringify(finalSourceData, null, 2)], { type: "application/json" });
                    
                    try {
                        await FilePicker.upload("data", sourceFileDirectory, new File([sourceBlob], sourceFileName), {});
                        ui.notifications.info(game.i18n.format("SettingCompendiums.SourceCleaned", { file: sourceFileName }));
                    } catch (e) {
                        ui.notifications.error(game.i18n.format("SettingCompendiums.ErrorCleaningSource", { file: sourceFileName, message: e.message }));
                    }
                } else {
                    ui.notifications.warn(`Не удалось определить папку с исходниками для компендиума: ${key}`);
                }

                // 4. Запускаем пересборку пользовательского bestiaries.json и предлагаем перезагрузку
                await this.buildUserBestiary();
              }
            },
            cancel: {
              label: game.i18n.localize("SettingCompendiums.Cancel"),
              icon: "<i class='fas fa-times'></i>",
            }
          },
          default: "fix"
        }, { width: 800, height: 750, resizable: true, classes: ["dialog", "check-results-dialog"] }).render(true);
      }
    } catch (e) {
      console.error(e);
      ui.notifications.error(game.i18n.format("SettingCompendiums.ErrorCheckBestiaries", { message: e.message }));
    }
  }
}

// --- Регистрация хуков Foundry VTT ---

Hooks.once('init', () => {
  PathfinderBestiaryTokenPack.init();

  game.settings.registerMenu("pf2e-token-pack", "tokenPackSettings", {
    name: game.i18n.localize("SettingCompendiums.TokenSettingsLabel"),
    label: game.i18n.localize("SettingCompendiums.TokenSettingsButton"),
    hint: game.i18n.localize("SettingCompendiums.TokenSettingsHint"),
    icon: "fas fa-dungeon",
    type: PathfinderBestiarySettingsMenu,
    restricted: true
  });
});

Hooks.once('ready', () => {
  PathfinderBestiaryTokenPack.initSettings();
});


/**
 * Класс для отрисовки меню настроек модуля.
 * Наследуется от стандартного FormApplication.
 */
class PathfinderBestiarySettingsMenu extends FormApplication {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "pf2e-token-pack-settings",
      title: game.i18n.localize("SettingCompendiums.SettingsMenuTitle"),
      template: "modules/pf2e-token-pack/data/templates/Setting-Compendiums.hbs",
      width: 700,
      height: "auto",
      classes: ["pf2e-token-pack-settings-form"],
      closeOnSubmit: false,
      resizable: true
    });
  }

  /**
   * Готовит данные для отображения в шаблоне handlebars.
   */
  async getData() {
    const groups = {
      bestiaries: [], adventurePath: [], rulebook: [], standalone: [], season: [], pregens: []
    };

    for (const { key, name, hint, category = "bestiaries" } of PathfinderBestiaryTokenPack.keys) {
      const settingKey = `enableOverwrite${key}`;
      const value = game.settings.get("pf2e-token-pack", settingKey);
      const entry = { key, settingKey, name, hint, value };

      if (!groups[category]) groups[category] = [];
      groups[category].push(entry);
    }
    return { groups };
  }

  /**
   * Активирует слушатели событий для элементов формы (например, кнопок).
   */
  activateListeners(html) {
    super.activateListeners(html);
    const toggle = html.find("#toggle-check-buttons");
    const buttons = html.find(".check-button");

    const updateButtonVisibility = () => {
      buttons.css("display", toggle.prop("checked") ? "inline-block" : "none");
    };

    toggle.on("change", updateButtonVisibility);
    updateButtonVisibility();

    buttons.on("click", async function () {
      const key = this.dataset.key;
      if (key) {
        await PathfinderBestiaryTokenPack.checkBestiaryArt(key);
      }
    });
  }

  /**
   * Вызывается при отправке формы. Обновляет настройки и пересобирает bestiaries.json.
   */
  async _updateObject(event, formData) {
    let changed = false;
    for (const [key, value] of Object.entries(formData)) {
      // Обрабатываем только наши чекбоксы настроек.
      if (key.startsWith("enableOverwrite")) {
        const current = game.settings.get("pf2e-token-pack", key);
        if (current !== value) {
          changed = true;
          await game.settings.set("pf2e-token-pack", key, value);
        }
      }
    }

    if (!changed) {
      ui.notifications.info(game.i18n.localize("SettingCompendiums.NoSettingsChanged"));
      return this.close();
    }

    // Пересобираем пользовательский бестиарий с новыми настройками.
    await PathfinderBestiaryTokenPack.buildUserBestiary();
    await this.close();

    // Предлагаем пользователю перезагрузить мир.
    new Dialog({
      title: game.i18n.localize("SettingCompendiums.ReloadTitle"),
      content: `<p>${game.i18n.localize("SettingCompendiums.BestiaryUpdatedMessage")}</p>`,
      buttons: {
        ok: {
          label: game.i18n.localize("SettingCompendiums.ReloadButton"),
          callback: () => location.reload()
        }
      },
      default: "ok"
    }).render(true);
  }
}