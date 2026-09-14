---
title: Генераторы CMake и Ninja
description: Чем генератор отличается от компилятора, как выглядит переход с Makefiles на Ninja и что об этом помнит CMakeCache.txt.
date: 2026-09-08
tags:
  - cmake
  - ninja
  - generators
---

Генератор — это не компилятор. `cmake -G` выбирает, *какой файлы сборки написать*: Ninja, Unix Makefiles, Visual Studio, Xcode. Компилятор (`CMAKE_CXX_COMPILER`) живёт отдельно. Путаница этих двух осей объясняет половину «у меня на CI другая скорость».

## Зачем Ninja

Makefiles удобны тем, что их можно прочитать. Ninja удобен тем, что его не нужно читать: граф зависимостей плотный, запуск дешёвый, инкремент предсказуемый.

Если критический путь задач имеет длительность $T_{\mathrm{crit}}$, а сумма работ $T_{\Sigma}$, ускорение упирается в

$$
S \le \frac{T_{\Sigma}}{T_{\mathrm{crit}}}.
$$

Ninja не уменьшает $T_{\mathrm{crit}}$ сам по себе. Он меньше тратит на обход графа, поэтому на больших деревьях ближе подбирается к этому потолку.

Конфигурация с явным генератором:

```bash title="configure.sh" {2}
cmake -S . -B build \
  -G Ninja \
  -DCMAKE_BUILD_TYPE=RelWithDebInfo
```

Сравнение со старым вызовом — одна строка, которую я всё ещё нахожу в скриптах 2018 года:

```bash title="configure.sh" del={1} ins={2}
cmake -G "Unix Makefiles" -S . -B build
cmake -G Ninja -S . -B build
```

## Что пишет кэш

После конфигурации генератор и компилятор лежат в `CMakeCache.txt`. Это не тот файл, который коммитят, но тот, который стоит открыть, когда «у коллеги собирается быстрее».

```ini title="build/CMakeCache.txt" showLineNumbers=true {1-8}
CMAKE_GENERATOR:INTERNAL=Ninja
CMAKE_BUILD_TYPE:STRING=RelWithDebInfo
CMAKE_CXX_COMPILER:FILEPATH=/usr/bin/clang++
CMAKE_CXX_STANDARD:STRING=20
CMAKE_EXPORT_COMPILE_COMMANDS:BOOL=ON
```

Сменился генератор — смените каталог сборки. `cmake -G` поверх уже сгенерированного дерева часто заканчивается полуживым кэшем и ошибкой вроде *«does not match the generator used previously»*.

## Генераторные выражения

Когда флаги зависят от конфигурации, я предпочитаю generator expressions, а не `if(CMAKE_BUILD_TYPE)`. Они работают и с одноконфигурационными генераторами (Ninja), и с многоконфигурационными (Visual Studio).

```cmake title="CMakeLists.txt" showLineNumbers=true {6-12} wrap
add_executable(app src/main.cpp)
target_compile_features(app PRIVATE cxx_std_20)

target_compile_options(app PRIVATE
  $<$<CXX_COMPILER_ID:GNU,Clang>:-Wall;-Wextra;-Wpedantic>
  $<$<AND:$<CXX_COMPILER_ID:GNU,Clang>,$<CONFIG:Release>>:-O3>
  $<$<CXX_COMPILER_ID:MSVC>:/W4>
)
```

Длинные `$<...>` на узком экране лучше помечать `wrap` в ограждении блока — иначе придётся горизонтально скроллить одно выражение.

## Практическое правило

- Локально и на Linux/macOS CI — Ninja.
- Официальные `.sln` / `.xcodeproj` — соответствующий IDE-генератор, не «Ninja из-под Visual Studio наугад».
- Компилятор и генератор меняются независимо; в заметках я всегда фиксирую оба.
