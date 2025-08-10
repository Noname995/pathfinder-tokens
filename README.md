# Pathfinder 2E: Token Pack от Metofay

[![Version (latest)](https://img.shields.io/github/v/release/Metofay/pf2e-token-pack)](https://github.com/Metofay/pf2e-token-pack/releases/latest)
![Data-release](https://img.shields.io/github/release-date/Metofay/pf2e-token-pack)
[![Boosty](https://img.shields.io/badge/Boosty-Metofay?logo=boosty&color=%23FFFFFF)](https://boosty.to/metofay)
[![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/Metofay/pf2e-token-pack/blob/master/README-en.md)

![Баннер модуля](./data/assets/Banner.png)

## 🐲 О модуле

Этот модуль для **Foundry VTT** добавляет в систему **Pathfinder 2e** большую коллекцию токенов и артов, а также предоставляет инструменты для управления вашим контентом.

## ⚙️ Функционал модуля

Помимо простого добавления контента, модуль предлагает несколько мощных инструментов:

### 1. Настройка компендиумов
Позволяет проверять пути к артам и токенам, удалять лишние файлы, видеть количество пропущенных актеров и отключать загрузку ненужных компендиумов.

![Настройка компендиумов](./data/assets/compendium-settings.png)

### 2. Восстановление актеров
Восстанавливает актеров в боковой панели и на сцене до их состояния в компендиуме. Можно настроить исключения по типам актеров и папкам.

![Восстановление актеров](./data/assets/actor-restoration.png)

### 3. Маскировка NPC
Позволяет менять внешность актера, создавать "фазы" (полностью отдельные, редактируемые листы персонажа), а также легко переключаться между ними и возвращаться к оригинальному виду актера.

![Маскировка NPC](./data/assets/npc-disguise.png)

Теперь есть дополнительный функционал:
1. Быстрый доступ для смены
2. Применять или нет размер при создании образа
3. Как для NPC, так и для других типов актёров(только Визуал)
4. Подсветка токена, если у него есть образы (виден только для ГМ), с функцией отключения этой подсветки для токена
5. В настройках теперь вы можете управлять цветом подсветки токена
6. Можно поменять имя оригинального образа
7. Настройка расположения HUD элемента на токене
![Маскировка NPC-2](./data/assets/npc-disguise-2.png)
![Маскировка NPC-3](./data/assets/npc-disguise-3.png)

### 4. Галерея персонажей
Добавляет новую функцию — большую, полностью локализованную библиотеку артов "Character Gallery" для изображений, которых нет в стандартных компендиумах.
Требуется установить дополнительный модуль [**Pathfinder 2E: Token Pack (Character Gallery)**](https://github.com/Metofay/pf2e-token-pack-character-gallery). Этот дополнительный модуль работает как отдельно, так и с интеграцией в основной, в будущем будут добавлены и арты из компендиума, и Character Gallery будет зависим от основного модуля.

![Галерея персонажей](./data/assets/character-gallery.png)

## 📥 Установка

1.  В меню настройки модулей Foundry VTT нажмите **"Install Module"**.
2.  В поле "Manifest URL" вставьте следующую ссылку:
    ```
    https://raw.githubusercontent.com/Metofay/pf2e-token-pack//main/module.json
    ```
3.  Нажмите **"Install"** и дождитесь окончания установки.
4.  Активируйте модуль в настройках вашего игрового мира.

## 📚 Покрытие контента

* ✅ - Есть динамические токены.
* ❌ - Есть недостающие арты (указано количество).

### Бестиарий

| Источник | Статус |
| :--- | :---: |
| Bestiary 1 | ✅ |
| Bestiary 2 | ✅ |
| Bestiary 3 | ✅ |
| Monster Core | ✅ |
| NPC Core | ✅ |

### Пути Приключений

| Источник | Статус | Примечания |
| :--- | :---: | :--- |
| Abomination Vaults | ✅ | |
| Age of Ashes | ✅❌ | Отсутствует 1 арт |
| Agents of Edgewatch | ✅❌ | Отсутствует 6 артов |
| Blood Lords | ✅❌ | Отсутствует 2 арта |
| Curtain Call | ✅ | |
| Extinction Curse | ✅❌ | Отсутствует 8 артов |
| Fist of the Ruby Phoenix | ✅ | |
| Gatewalkers | ✅❌ | Отсутствует 10 арт |
| Outlaws of Alkenstar | | |
| Kingmaker | ✅ | |
| Quest for the Frozen | ✅ | |
| Season of Ghosts | ✅ | |
| Seven Dooms for Sandpoint | ✅ | |
| Sky King's Tomb | ✅❌ | Отсутствует 2 арта |
| Spore War | ✅ | |
| Strength of Thousands | ❌ | Отсутствует 14 артов |
| Triumph of the Tusk | ✅❌ | Отсутствует 10 арта |
| Shades of Blood | ✅ |  |
| Stolen Fate | | |
| Wardens of Wildwood | ❌ | Отсутствует 1 арт |

### Книга правил

| Источник | Статус | Примечания |
| :--- | :---: | :--- |
| Book of the Dead | | |
| Paizo Blog | ❌ | Отсутствует 3 арта |
| Howl of the Wild | ❌ | Отсутствует 16 артов |
| Lost Omens Bestiary | ✅❌ | Отсутствует 22 арта |
| NPC Gallery | ❌ | Отсутствует 3 арта |
| Dark Archive | ❌ | Отсутствует 1 арт |
| Rage of Elements | ❌ | Отсутствует 17 артов |
| War of Immortals | | |

### Приключения

| Источник | Статус | Примечания |
| :--- | :---: | :--- |
| Claws of the Tyrant | ❌ | Отсутствует 11 артов |
| Fall of Plaguestone | ❌ | Отсутствует 1 арт |
| Malevolence | ❌ | Отсутствует 3 арта |
| Menace Under Otari | | |
| One-Shots | ❌ | Отсутствует 9 артов |
| Prey for Death | | |
| Rusthenge | | |
| Shadows at Sundown | | |
| The Enmity Cycle | | |
| The Slithering | | |
| Troubles in Otari | | |
| Night of the Gray Death | ❌ | Отсутствует 3 арта |
| Crown of the Kobold King | ❌ | Отсутствует 2 арта |

### Pathfinder Society

| Источник | Статус | Примечания |
| :--- | :---: | :--- |
| Intro | ✅ | |
| Season 1 | ✅❌ | Отсутствует 67 артов |

### Pregenerated PCs

| Источник | Статус |
| :--- | :---: |
| Adventure Pregens | ✅ |

---

## ❤️ Поддержать автора

Если вам нравится моя работа, вы можете поддержать меня на Boosty. Это очень мотивирует на дальнейшее развитие модуля!

[![Boosty](https://img.shields.io/badge/Поддержать%20на%20Boosty-Metofay?logo=boosty&color=%23FFFFFF)](https://boosty.to/metofay)
![Баннер модуля](./data/assets/metofay.png)
