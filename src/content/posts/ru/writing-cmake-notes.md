---
title: Как я веду заметки по CMake
description: Зачем записывать сборку, как устроен этот блог и минимальный CMake-проект, с которого обычно всё начинается.
date: 2026-09-01
tags:
  - cmake
  - workflow
  - cxx
---

CMake редко ломается эффектно. Чаще он тихо делает не то, что вы имели в виду: другой генератор, другой стандарт C++, другой `CMAKE_BUILD_TYPE`. Эти заметки — журнал таких случаев, а не справочник по каждой команде.

Пишу сразу на русском и английском. Формулы — обычный Markdown с KaTeX, код — блоки с именем файла и подсветкой строк. Так проще вернуться к примеру через полгода и не гадать, из какого `CMakeLists.txt` он вырезан.

## Минимальный проект

Ниже тот каркас, с которого я начинаю почти любую библиотеку на C++20. Подсветка отмечает цель и её стандарт — именно их потом чаще всего растаскивают по `INTERFACE`-библиотекам.

```cmake title="CMakeLists.txt" showLineNumbers=true {6-10}
cmake_minimum_required(VERSION 3.20)

project(demo
  VERSION 0.1.0
  LANGUAGES CXX)

add_executable(app src/main.cpp)
target_compile_features(app PRIVATE cxx_std_20)

if(NOT CMAKE_BUILD_TYPE AND NOT CMAKE_CONFIGURATION_TYPES)
  set(CMAKE_BUILD_TYPE RelWithDebInfo CACHE STRING "Build type" FORCE)
endif()
```

`cmake_minimum_required` здесь не декорация: он задаёт политики. Без нижней границы 3.20 легко получить старое поведение `FetchContent` или `target_link_libraries`.

Исходник нарочно короткий. Если «hello world» уже не собирается, проблема в тулчейне, а не в архитектуре проекта.

```cpp title="src/main.cpp" showLineNumbers=true {1-8}
#include <iostream>
#include <string_view>

int main() {
  constexpr std::string_view name{"CMake Notes"};
  std::cout << "hello from " << name << '\n';
  return 0;
}
```

Конфигурация — всегда из исходников, не из подкаталога сборки:

```bash title="configure.sh"
cmake -S . -B build -G Ninja
cmake --build build
```

## Почему не «голый» LaTeX

Полный `.tex` хорошо живёт в статье с формулами и плохо — в статье про сборку. Листинги CMake начинают жить своей жизнью: пропадают подсветка, якоря, копирование. Markdown + KaTeX оставляет формулы на месте и не мешает коду.

Иногда всё же нужна оценка, а не заклинание. Например, полный пересбор $N$ единиц трансляции стоит примерно $T \approx \sum_{i=1}^{N} t_i$, а инкрементальный прогон Ninja ближе к сумме по изменённому подграфу. Этого достаточно, чтобы объяснить, зачем вообще спорить про генераторы.

## Как добавлять заметку

1. Создайте пару файлов с одним именем: `src/content/posts/ru/slug.md` и `src/content/posts/en/slug.md`.
2. Заполните frontmatter: `title`, `description`, `date`, `tags`.
3. Для кода указывайте язык (`cmake`, `cpp`, `diff`, `bash`) и `title="файл"`.
4. Формулы: `$inline$` и `$$display$$`.

Черновик прячется полем `draft: true` и не попадает в production-сборку.
