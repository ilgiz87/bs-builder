# bs-builder — минимальная сборка Bootstrap

Проект для тех, кто **не знает JavaScript** и немного знает SCSS.
Всё, что нужно менять — файл цветов. Сборка — одной командой.

## Быстрый старт

```bash
npm install     # один раз, ставит bootstrap и sass
npm run build   # собрать CSS из src/scss в dist/css
npm start       # (опционально) следить за файлами и пересобирать автоматически
```

## Что где лежит

| Файл | Для чего |
|---|---|
| `src/scss/colors.scss` | **Единственный файл, который нужно править** — основные цвета |
| `src/scss/grid.scss` | Вариант 1: только сетка Bootstrap → `dist/css/bootstrap-grid.min.css` |
| `src/scss/base.scss` | Вариант 2: сетка + цвета + базовое оформление (кнопки, формы, карточки, таблицы, алерты) без JS-компонентов → `dist/css/bootstrap-base.min.css` |
| `build.js` | Скрипт сборки (трогать не нужно) |
| `dist/css/` | Готовые CSS-файлы — их подключаете в HTML |

## Как сменить цвета

1. Откройте `src/scss/colors.scss`.
2. Поменяйте HEX-коды, например `$primary: #ff6600;`.
3. Выполните `npm run build`.

Bootstrap сам пересчитает все оттенки (hover, active, «мягкие» фоны, текст).

## Подключение в HTML

```html
<link rel="stylesheet" href="dist/css/bootstrap-base.min.css">
```

## Как добавить новый вариант сборки

1. Создайте `src/scss/имя.scss` (скопируйте `base.scss` и удалите ненужные строки `@import`).
2. Добавьте строку в `build.js` в блок `targets`, например: `"моё": "my-theme"`.
3. `npm run build`.

## Примечания

- JavaScript-компоненты Bootstrap (модалки, тултипы, Dropdown, Collapse) сюда **не входят** — они требуют JS. Если понадобятся, обсудим отдельно.
- В `.gitignore` исключены `node_modules/` и `dist/`.
