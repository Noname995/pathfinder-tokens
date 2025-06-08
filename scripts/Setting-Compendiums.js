// Класс для управления модулем токенов бестиария Pathfinder
class PathfinderBestiaryTokenPack {
  // Инициализация настроек модуля
  static async initSettings() {
    // Список всех поддерживаемых бестиариев и их метаданных
    this.keys = [
      { key: "pf2e.pathfinder-bestiary"                , name: game.i18n.localize("PF2E-TOKEN-PACK.Bestiary")                      , category: "bestiaries"    },
      { key: "pf2e.pathfinder-bestiary-2"              , name: game.i18n.localize("PF2E-TOKEN-PACK.Bestiary2")                     , category: "bestiaries"    },
      { key: "pf2e.pathfinder-bestiary-3"              , name: game.i18n.localize("PF2E-TOKEN-PACK.Bestiary3")                     , category: "bestiaries"    },
      { key: "pf2e.pathfinder-monster-core"            , name: game.i18n.localize("PF2E-TOKEN-PACK.MonsterCore")                   , category: "bestiaries"    },
      { key: "pf2e.pathfinder-npc-core"                , name: game.i18n.localize("PF2E-TOKEN-PACK.NPCCore")                       , category: "bestiaries"    },
      { key: "pf2e.abomination-vaults-bestiary"        , name: game.i18n.localize("PF2E-TOKEN-PACK.AbominationVaultsBestiary")     , category: "adventurePath" },
      { key: "pf2e.age-of-ashes-bestiary"              , name: game.i18n.localize("PF2E-TOKEN-PACK.AgeofAshesBestiary")            , category: "adventurePath" },
      { key: "pf2e.agents-of-edgewatch-bestiary"       , name: game.i18n.localize("PF2E-TOKEN-PACK.AgentsofEdgewatchBestiary")     , category: "adventurePath" },
      { key: "pf2e.blood-lords-bestiary"               , name: game.i18n.localize("PF2E-TOKEN-PACK.BloodLordsBestiary")            , category: "adventurePath" },
      { key: "pf2e.curtain-call-bestiary"              , name: game.i18n.localize("PF2E-TOKEN-PACK.CurtainCallBestiary")           , category: "adventurePath" },
      { key: "pf2e.extinction-curse-bestiary"          , name: game.i18n.localize("PF2E-TOKEN-PACK.ExtinctionCurseBestiary")       , category: "adventurePath" },
      { key: "pf2e.fists-of-the-ruby-phoenix-bestiary" , name: game.i18n.localize("PF2E-TOKEN-PACK.FistsoftheRubyPhoenixBestiary") , category: "adventurePath" },
      { key: "pf2e.gatewalkers-bestiary"               , name: game.i18n.localize("PF2E-TOKEN-PACK.GatewalkersBestiary")           , category: "adventurePath" },
      { key: "pf2e.outlaws-of-alkenstar-bestiary"      , name: game.i18n.localize("PF2E-TOKEN-PACK.OutlawsofAlkenstarBestiary")    , category: "adventurePath" },
      { key: "pf2e.kingmaker-bestiary"                 , name: game.i18n.localize("PF2E-TOKEN-PACK.KingmakerBestiary")             , category: "adventurePath" },
      { key: "pf2e.quest-for-the-frozen-flame-bestiary", name: game.i18n.localize("PF2E-TOKEN-PACK.QuestfortheFrozenFlameBestiary"), category: "adventurePath" },
      { key: "pf2e.season-of-ghosts-bestiary"          , name: game.i18n.localize("PF2E-TOKEN-PACK.SeasonofGhostsBestiary")        , category: "adventurePath" },
      { key: "pf2e.seven-dooms-for-sandpoint-bestiary" , name: game.i18n.localize("PF2E-TOKEN-PACK.SevenDoomsforSandpointBestiary"), category: "adventurePath" },
      { key: "pf2e.sky-kings-tomb-bestiary"            , name: game.i18n.localize("PF2E-TOKEN-PACK.SkyKingsTombBestiary")          , category: "adventurePath" },
      //{ key: "pf2e.spore-war-bestiary"                 , name: game.i18n.localize("PF2E-TOKEN-PACK.SporeWar")                      , category: "adventurePath" },
      { key: "pf2e.strength-of-thousands-bestiary"     , name: game.i18n.localize("PF2E-TOKEN-PACK.StrengthofThousandsBestiary")   , category: "adventurePath" },
      //{ key: "pf2e.triumph-of-the-tusk-bestiary"       , name: game.i18n.localize("PF2E-TOKEN-PACK.TriumphoftheTtusk")             , category: "adventurePath" },
      { key: "pf2e.stolen-fate-bestiary"               , name: game.i18n.localize("PF2E-TOKEN-PACK.StolenFateBestiary")            , category: "adventurePath" },
      { key: "pf2e.wardens-of-wildwood-bestiary"       , name: game.i18n.localize("PF2E-TOKEN-PACK.WardensofWildwoodBestiary")     , category: "adventurePath" },
      { key: "pf2e.book-of-the-dead-bestiary"          , name: game.i18n.localize("PF2E-TOKEN-PACK.BookoftheDeadBestiary")         , category: "rulebook"      },
      { key: "pf2e.blog-bestiary"                      , name: game.i18n.localize("PF2E-TOKEN-PACK.PaizoBlogBestiary")             , category: "rulebook"      },
      { key: "pf2e.howl-of-the-wild-bestiary"          , name: game.i18n.localize("PF2E-TOKEN-PACK.HowloftheWildBestiary")         , category: "rulebook"      },
      { key: "pf2e.lost-omens-bestiary"                , name: game.i18n.localize("PF2E-TOKEN-PACK.LostOmensBestiary")             , category: "rulebook"      },
      { key: "pf2e.npc-gallery"                        , name: game.i18n.localize("PF2E-TOKEN-PACK.NPCGallery")                    , category: "rulebook"      },
      { key: "pf2e.pathfinder-dark-archive"            , name: game.i18n.localize("PF2E-TOKEN-PACK.DarkArchive")                   , category: "rulebook"      },
      { key: "pf2e.rage-of-elements-bestiary"          , name: game.i18n.localize("PF2E-TOKEN-PACK.RageofElementsBestiary")        , category: "rulebook"      },
      { key: "pf2e.war-of-immortals-bestiary"          , name: game.i18n.localize("PF2E-TOKEN-PACK.WarofImmortalsBestiary")        , category: "rulebook"      },
      { key: "pf2e.claws-of-the-tyrant-bestiary"       , name: game.i18n.localize("PF2E-TOKEN-PACK.ClawsoftheTyrantBestiary")      , category: "standalone"    },
      { key: "pf2e.fall-of-plaguestone-bestiary"       , name: game.i18n.localize("PF2E-TOKEN-PACK.FallofPlaguestoneBestiary")     , category: "standalone"    },
      { key: "pf2e.malevolence-bestiary"               , name: game.i18n.localize("PF2E-TOKEN-PACK.MalevolenceBestiary")           , category: "standalone"    },
      { key: "pf2e.menace-under-otari-bestiary"        , name: game.i18n.localize("PF2E-TOKEN-PACK.MenaceUnderOtariBestiary")      , category: "standalone"    },
      { key: "pf2e.one-shot-bestiary"                  , name: game.i18n.localize("PF2E-TOKEN-PACK.OneShotBestiary")               , category: "standalone"    },
      { key: "pf2e.prey-for-death-bestiary"            , name: game.i18n.localize("PF2E-TOKEN-PACK.PreyforDeathBestiary")          , category: "standalone"    },
      { key: "pf2e.rusthenge-bestiary"                 , name: game.i18n.localize("PF2E-TOKEN-PACK.RusthengeBestiary")             , category: "standalone"    },
      { key: "pf2e.shadows-at-sundown-bestiary"        , name: game.i18n.localize("PF2E-TOKEN-PACK.ShadowsatSundownBestiary")      , category: "standalone"    },
      { key: "pf2e.the-enmity-cycle-bestiary"          , name: game.i18n.localize("PF2E-TOKEN-PACK.TheEnmityCycleBestiary")        , category: "standalone"    },
      { key: "pf2e.the-slithering-bestiary"            , name: game.i18n.localize("PF2E-TOKEN-PACK.TheSlitheringBestiary")         , category: "standalone"    },
      { key: "pf2e.troubles-in-otari-bestiary"         , name: game.i18n.localize("PF2E-TOKEN-PACK.TroublesinOtariBestiary")       , category: "standalone"    },
      { key: "pf2e.night-of-the-gray-death-bestiary"   , name: game.i18n.localize("PF2E-TOKEN-PACK.NightoftheGrayDeathBestiary")   , category: "standalone"    },
      { key: "pf2e.crown-of-the-kobold-king-bestiary"  , name: game.i18n.localize("PF2E-TOKEN-PACK.CrownoftheKoboldKingBestiary")  , category: "standalone"    },
      { key: "pf2e.paizo-pregens"                      , name: game.i18n.localize("PF2E-TOKEN-PACK.AdventurePregens")              , category: "pregens"       },
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
        console.log(game.i18n.localize("PF2E-TOKEN-PACK.SettingCompendiumsBestiariesSynced"));
      } else {
        console.warn(game.i18n.localize("PF2E-TOKEN-PACK.SettingCompendiumsBestiariesSyncFailed"));
      }
    }
  } catch (error) {
    console.error(game.i18n.localize("PF2E-TOKEN-PACK.SettingCompendiumsBestiariesSyncError"), error);
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
    if (!response.ok) throw new Error(game.i18n.localize("PF2E-TOKEN-PACK.SettingCompendiumsFailedToFetch"));
    return await response.json();
  }
  
  // Загрузка обновлённого файла bestiaries.json через FilePicker
  static async uploadBestiary(data, fileName) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const result = await FilePicker.upload("data", "modules/pf2e-token-pack", new File([blob], fileName), {});
    if (result.status !== "success") throw new Error(game.i18n.format("PF2E-TOKEN-PACK.SettingCompendiumsFailedToUpload", { file: fileName }));
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
      ui.notifications.warn(game.i18n.format("PF2E-TOKEN-PACK.SettingCompendiumsWarnNoDataForKey", { key }));
      return;
    }

    const pack = game.packs.get(key);
    if (!pack) {
      ui.notifications.error(game.i18n.format("PF2E-TOKEN-PACK.SettingCompendiumsErrorCompendiumNotLoaded", { packName: key }));
      return;
    }

    const index = await pack.getIndex();
    const sortedIndex = [...index].sort((a, b) => a.name.localeCompare(b.name, game.i18n.lang || undefined));

    const mismatches = [];
    const missingInModule = [];
    const deadIds = [];
    const reorderedBestiary = {};
    const usedFiles = new Set();
    const relatedDirs = new Set();

    for (const entry of sortedIndex) {
      const actorId = entry._id;
      if (bestiary[actorId]) reorderedBestiary[actorId] = bestiary[actorId];
    }

    async function fileExists(path) {
      if (!path) return false;
      const segments = path.split("/");
      const filename = segments.pop();
      const directory = segments.join("/");
      try {
        const result = await FilePicker.browse("data", directory);
        return result.files.some(f => f.endsWith(filename));
      } catch {
        return false;
      }
    }

    async function listAllFilesRecursive(dir) {
      const files = [];
      try {
        const result = await FilePicker.browse("data", dir);
        for (const file of result.files) {
          const relPath = file.replace(/^.*?modules\//, "modules/");
          files.push(relPath);
        }
        for (const subdir of result.dirs) {
          const subFiles = await listAllFilesRecursive(subdir);
          files.push(...subFiles);
        }
      } catch (err) {
        console.warn(`Ошибка при обходе ${dir}:`, err);
      }
      return files;
    }

    const collectPath = (p) => {
      if (p) {
        usedFiles.add(p);
        const dir = p.split("/").slice(0, -1).join("/");
        relatedDirs.add(dir);
      }
    };

    for (const entry of sortedIndex) {
      const actorId = entry._id;
      const actorName = entry.name;
      const actor = await pack.getDocument(actorId);
      if (actor.type === "hazard") continue;

      const expected = bestiary[actorId];
      if (!expected) {
        missingInModule.push(actorId);
        mismatches.push(`${actorName}: ${game.i18n.localize("PF2E-TOKEN-PACK.SettingCompendiumsMissingBestiaryKey")}`);
        continue;
      }

      const actorToken = actor.prototypeToken;
      const PLACEHOLDER = "icons/svg/mystery-man.svg";

      const tokenImg = actorToken.texture?.src ?? "";
      const ringImg = actorToken.ring?.subject?.texture ?? "";

      const hasTextureInExpected = !!expected.token?.texture?.src;
      const hasRingInExpected = !!expected.token?.ring?.subject?.texture;

      collectPath(expected.actor);
      collectPath(expected.token?.texture?.src);
      collectPath(expected.token?.ring?.subject?.texture);

      if (expected.actor && !(await fileExists(expected.actor))) {
        mismatches.push(`📁 ${actorName}: ${game.i18n.localize("PF2E-TOKEN-PACK.SettingCompendiumsActorImageNotFound")}`);
      }

      if (hasTextureInExpected) {
        const expectedImg = expected.token.texture.src;
        if (!(await fileExists(expectedImg))) {
          mismatches.push(`📁 ${actorName}: ${game.i18n.localize("PF2E-TOKEN-PACK.SettingCompendiumsTokenImageNotFound")}`);
        }
      }

      if (hasRingInExpected) {
        const expectedImg = expected.token.ring.subject.texture;
        if (!(await fileExists(expectedImg))) {
          mismatches.push(`📁 ${actorName}: ${game.i18n.localize("PF2E-TOKEN-PACK.SettingCompendiumsRingImageNotFound")}`);
        }
      }
    }

    const compendiumIds = new Set(sortedIndex.map(e => e._id));
    for (const [actorId, expected] of Object.entries(bestiary)) {
      if (!compendiumIds.has(actorId)) {
        deadIds.push(actorId);
        mismatches.push(`${actorId}: ${game.i18n.localize("PF2E-TOKEN-PACK.SettingCompendiumsInCompendium")}`);
      }
    }

    const orderedKeys = Object.keys(reorderedBestiary);
    if (JSON.stringify(orderedKeys) !== JSON.stringify(Object.keys(bestiary))) {
      originalData[key] = reorderedBestiary;
      const blob = new Blob([JSON.stringify(originalData, null, 2)], { type: "application/json" });
      const file = new File([blob], "bestiaries.json", { type: "application/json" });
      await FilePicker.upload("data", "modules/pf2e-token-pack", file, {});
    }

    const unusedFiles = [];
    for (const dir of relatedDirs) {
      const files = await listAllFilesRecursive(dir);
      for (const file of files) {
        if (!usedFiles.has(file)) unusedFiles.push(file);
      }
    }

    const showCleanupDialog = () => {
      if (unusedFiles.length === 0) return;

      const groupedList = unusedFiles.map(path => {
        const name = decodeURIComponent(path.split("/").pop());
        const type = path.includes("/portraits/") ? "portraits" :
                     path.includes("/tokens/")    ? "tokens" :
                     path.includes("/subjects/")  ? "subjects" : "unknown";
        return `🗂️ <strong>${type}</strong> — <code>${name}</code>`;
      }).join("<br>");

      new Dialog({
        title: ` ${game.i18n.localize("PF2E-TOKEN-PACK.SettingCompendiumsDeleteUnused")} ${keyObj?.name ?? key}`,
        content: `<p>${game.i18n.format("PF2E-TOKEN-PACK.SettingCompendiumsUnusedFiles", { count: unusedFiles.length })}</p>
                  <div style="max-height: 300px; overflow-y: auto; font-size: 0.9em;">${groupedList}</div>
                  <p><em>${game.i18n.localize("PF2E-TOKEN-PACK.SettingCompendiumsManualDeleteNote")}</em></p>`,
        buttons: { ok: { label: "OK" } },
        default: "ok"
      }, { width: 600 }).render(true);
    };

    const keyObj = PathfinderBestiaryTokenPack.keys.find(k => k.key === key);
    const title = game.i18n.format("PF2E-TOKEN-PACK.SettingCompendiumsCheckTitle", { name: keyObj?.name ?? key });

    const dialogData = {
      title,
      content: mismatches.length > 0
        ? `<p>${game.i18n.format("PF2E-TOKEN-PACK.SettingCompendiumsActorsNotFoundInCompendium", { count: deadIds.length })}</p>
           <p>${game.i18n.format("PF2E-TOKEN-PACK.SettingCompendiumsActorsNotFoundInModule", { count: missingInModule.length })}</p>
           <div id="mismatch-results" style="white-space: nowrap;">${mismatches.join("<br>")}</div>`
        : `<p> ${game.i18n.localize("PF2E-TOKEN-PACK.SettingCompendiumsAllValid")}</p>`,
      buttons: {
        ok: {
          label: "OK",
          callback: () => showCleanupDialog()
        }
      },
      default: "ok"
    };

    new Dialog(dialogData, { width: "auto" }).render(true);
  } catch (e) {
    console.error(e);
    ui.notifications.error(game.i18n.format("PF2E-TOKEN-PACK.SettingCompendiumsErrorCheckBestiaries", { message: e.message }));
  }
}





}

// Инициализация модуля
Hooks.once('init', () => PathfinderBestiaryTokenPack.init()); // При событии 'init' (ранняя инициализация Foundry) вызывается метод init(), который настраивает сокеты для взаимодействия между клиентами

Hooks.once('ready', () => PathfinderBestiaryTokenPack.initSettings()); // При событии 'ready' (после полной загрузки Foundry) вызывается метод initSettings(), который регистрирует все настройки модуля

// Регистрируем меню настроек модуля
Hooks.once("init", () => {
  game.settings.registerMenu("pf2e-token-pack", "tokenPackSettings", {
    name: game.i18n.localize("PF2E-TOKEN-PACK.SettingCompendiumsTokenSettingsLabel"), // Название меню настроек
    label: game.i18n.localize("PF2E-TOKEN-PACK.SettingCompendiumsTokenSettingsButton"), // Текст кнопки меню
    hint: game.i18n.localize("PF2E-TOKEN-PACK.SettingCompendiumsTokenSettingsHint"), // Подсказка для меню
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
      title: game.i18n.localize("PF2E-TOKEN-PACK.SettingCompendiumsSettingsMenuTitle"), // Заголовок формы
      template: "modules/pf2e-token-pack/templates/Setting-Compendiums.html", // Путь к шаблону формы
      width: "700", // Ширина формы
      height: "1250", // Высота формы
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

    // Добавляем стили для закрепления кнопки
    const style = document.createElement("style");
    style.innerHTML = `
      .settings-form {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .scrollable-content {
        overflow-y: auto;
        flex: 1 1 auto;
        padding-right: 5px; /* чтобы не перекрывалось скроллбаром */
      }

      .form-footer {
        flex-shrink: 0;
        background: inherit;
        padding: 10px;
        text-align: right;
        z-index: 1;
        border-top: 1px solid #CCC;
      }

      .form-footer .button {
        margin: 0;
        width: 100%;
        border: none;
        border-radius: 0;
      }
    `;
    document.head.appendChild(style);
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
    ui.notifications.info(game.i18n.localize("PF2E-TOKEN-PACK.SettingCompendiumsNoSettingsChanged"));
    return;
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
      ui.notifications.error(game.i18n.localize("PF2E-TOKEN-PACK.SettingCompendiumsFailedToUpload"));
      return;
    }
  }
  // Сохдаем диалог об успешном обновлении
  new Dialog({
    title: game.i18n.localize("PF2E-TOKEN-PACK.SettingCompendiumsReloadTitle"),
    content: `<p>${game.i18n.localize("PF2E-TOKEN-PACK.SettingCompendiumsBestiaryUpdatedMessage")}</p>`,
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