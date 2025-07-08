import { MODULE_ID } from "./constants.mjs";

// Класс для нового меню настроек
class CharacterGallerySettingsMenu extends FormApplication {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "character-gallery-settings-menu",
      title: game.i18n.localize("CharacterGallery.MenuName"), // Заголовок окна
      template: `modules/${MODULE_ID}/character-gallery/templates/settings-menu.hbs`, // Путь к новому шаблону
      width: 600,
      height: "auto",
      classes: ["sheet"],
      tabs: [{ navSelector: ".tabs", contentSelector: "form", initial: "general" }],
      closeOnSubmit: true,
    });
  }


  /**
   * Передает данные в шаблон.
   * @returns {object} Данные для рендеринга.
   */
  getData(options) {
    const data = super.getData(options);
    const settings = game.settings.settings;

    // Получаем данные для настроек, которые мы хотим отобразить
    // Локализация будет происходить прямо в шаблоне
    data.settings = {
      galleryAccess: {
        ...settings.get(`${MODULE_ID}.galleryAccess`),
        value: game.settings.get(MODULE_ID, "galleryAccess"),
      },
      activeColor: {
        ...settings.get(`${MODULE_ID}.activeColor`),
        value: game.settings.get(MODULE_ID, "activeColor"),
      },
      headerButton: {
        ...settings.get(`${MODULE_ID}.headerButton`),
        value: game.settings.get(MODULE_ID, "headerButton"),
      },
    };

    return data;
  }

  /**
   * Обрабатывает отправку формы и сохраняет настройки.
   * @param {Event} event - Событие отправки.
   * @param {object} formData - Данные из формы.
   */
  async _updateObject(event, formData) {
    for (const [key, value] of Object.entries(formData)) {
      await game.settings.set(MODULE_ID, key, value);
    }
    this.render();
  }
}


/**
 * Регистрирует кнопку меню настроек.
 * Эту функцию нужно вызывать в хуке 'init'.
 */
export function registerSettingsMenu() {
    game.settings.registerMenu(MODULE_ID, "settingsMenu", {
        name: game.i18n.localize("CharacterGallery.MenuName"),      // Название меню
        label: game.i18n.localize("CharacterGallery.MenuLabel"),    // Текст на кнопке
        hint: game.i18n.localize("CharacterGallery.MenuHint"),      // Подсказка
        icon: "fas fa-users-cog",                 // Иконка
        type: CharacterGallerySettingsMenu,       // Класс, который будет рендерить меню
        restricted: true                          // Только для GM
    });
}

/**
 * Register all settings for the module.
 * @returns {void}
 */
export function registerSettings() {
  // Настройка доступа к галерее
  game.settings.register(MODULE_ID, "galleryAccess", {
    name: "CharacterGallery.AccessName",
    hint: "CharacterGallery.AccessHint",
    scope: "world",
    config: false, // <-- Изменено: теперь настраивается через меню
    type: Number,
    choices: {
      1: "USER.RolePlayer",
      2: "USER.RoleTrusted",
      3: "USER.RoleAssistant",
      4: "USER.RoleGamemaster"
    },
    default: CONST.USER_ROLES.ASSISTANT
  });

  // Настройка цвета
  game.settings.register(MODULE_ID, "activeColor", {
    name: "CharacterGallery.ColorName",
    hint: "CharacterGallery.ColorHint",
    scope: "client",
    config: false, // <-- Изменено: теперь настраивается через меню
    type: String,
    choices: {
      red: "CharacterGallery.ColorRed",
      green: "CharacterGallery.ColorGreen",
      blue: "CharacterGallery.ColorBlue"
    },
    default: "red",
    onChange: () => {
      // Убедитесь, что CharacterGallery.application существует
      if (window.CharacterGallery?.application) {
        CharacterGallery.application.render({parts: ["tags", "grid"]});
      }
    }
  });

  // Кнопка в заголовке листа актера
  game.settings.register(MODULE_ID, "headerButton", {
    name: "CharacterGallery.HeaderButtonName",
    hint: "CharacterGallery.HeaderButtonHint",
    scope: "world",
    config: false, // <-- Изменено: теперь настраивается через меню
    type: Boolean,
    default: true
  });

  // --- Остальные настройки остаются без изменений, так как они уже скрыты (config: false) ---

  const fields = foundry.data.fields;
  const schemaField = new fields.SchemaField(
    {
      moduleId: new fields.StringField({required: true, nullable: false, blank: false, initial: undefined}),
      sheetId: new fields.StringField({required: true, nullable: false, blank: false, initial: undefined})
    },
    {initial: undefined}
  );
  game.settings.register(MODULE_ID, "restrictedSheets", {
    name: "CharacterGallery.DatasheetConfigName",
    hint: "",
    scope: "world",
    config: false,
    type: new fields.ArrayField(schemaField),
    default: [],
    onChange: () => {
      if (!game.user.isGM && window.CharacterGallery?.application) {
          CharacterGallery.application.rebuildDatabase();
      }
    }
  });

  const actorTypes = /** @type {string[]} */ (Actor.TYPES.filter((t) => t !== "base").sort());
  const defaultType = actorTypes.find((t) => ["adversary", "npc"].includes(t.toLocaleLowerCase("en"))) ?? actorTypes[0];
  game.settings.register(MODULE_ID, "actorType", {
    name: "CharacterGallery.ActorTypeName",
    hint: "CharacterGallery.ActorTypeHint",
    scope: "world",
    config: !["adversary", "npc"].includes(defaultType.toLocaleLowerCase("en")),
    default: defaultType
  });
}