# CMake Notes / Заметки о CMake

Двуязычный (RU/EN) статический блог про CMake: статьи в Markdown с KaTeX, листинги CMake/C++ через Expressive Code, публикация на GitHub Pages.

## Локально

Нужен Node.js 22.12+.

```bash
npm install
npm run dev
```

Сайт: http://127.0.0.1:43124 — сразу открывается русская главная (`/ru/`). Английская: `/en/`.

```bash
npm run build     # production + индекс поиска Pagefind
npm run preview
```

## GitHub Pages

1. Залейте репозиторий на GitHub.
2. Settings → Pages → **Source: GitHub Actions**.
3. Workflow `.github/workflows/deploy.yml` сам выставит `base`:
   - репозиторий `username.github.io` → сайт в корне;
   - любой другой → `https://username.github.io/<repo>/`.

## Как написать статью

Создайте пару файлов с **одинаковым именем** (slug):

- `src/content/posts/ru/my-note.md`
- `src/content/posts/en/my-note.md`

Frontmatter:

```yaml
---
title: Заголовок
description: Одно-два предложения для ленты и Open Graph.
date: 2026-09-14
updated: 2026-09-15   # необязательно
tags: [cmake, ninja]
draft: false          # true — не попадёт в production
---
```

Если перевода ещё нет, достаточно одного языка: на странице появится пометка и ссылка на ленту другого языка.

«Обо мне» правится в `src/content/about/ru.md` и `src/content/about/en.md`. Строки интерфейса — `src/i18n/ui.ts`.

### Листинги CMake и C++

Язык после тройных кавычек: `cmake`, `cpp`, `c`, `diff`, `bash`. Имя файла, номера строк, подсветка и маркеры «было / стало»:

````markdown
```cmake title="CMakeLists.txt" showLineNumbers=true {6-10}
add_executable(app src/main.cpp)
target_compile_features(app PRIVATE cxx_std_20)
```

```bash title="configure.sh" del={1} ins={2}
cmake -G "Unix Makefiles" -S . -B build
cmake -G Ninja -S . -B build
```
````

Длинные generator expressions: добавьте `wrap` в ту же строку ограждения, чтобы на телефоне текст переносился, а не сжимался.

### Формулы (KaTeX)

Inline: `$T_{\mathrm{crit}}$`. Выносная:

```markdown
$$
S \le \frac{T_{\Sigma}}{T_{\mathrm{crit}}}.
$$
```

Полные `.tex`-статьи сайт не компилирует: для заметок про сборку удобнее Markdown + KaTeX, иначе ломаются листинги.

## Структура

```
src/content/posts/{ru,en}/   статьи
src/content/about/           страница «Обо мне»
src/pages/[lang]/            маршруты /ru/ и /en/
src/i18n/ui.ts               название сайта и UI-строки
```
