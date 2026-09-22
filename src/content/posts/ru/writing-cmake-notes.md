---
title: Зачем нужны заметки о CMake?
date: 2026-09-16
description: Зачем отдельный журнал по CMake, если уже есть документация и книги.
tags:
  - cmake
---

CMake — кроссплатформенная система сборки. Она покрывает не только C и C++, но и [другие языки](https://cmake.org/cmake/help/latest/command/enable_language.html), а также широкий набор [генераторов](https://cmake.org/cmake/help/latest/manual/cmake-generators.7.html) под [разные платформы](https://cmake.org/cmake/help/latest/variable/CMAKE_SYSTEM_NAME.html), архитектуры (зачастую это работа генератора, однако CMake'у также приходится знать об архитектуре, например для [`CMAKE_<LANG>_LIBRARY_ARCHITECTURE`](https://cmake.org/cmake/help/latest/variable/CMAKE_LANG_LIBRARY_ARCHITECTURE.html#variable:CMAKE_%3CLANG%3E_LIBRARY_ARCHITECTURE)) и [IDE](https://cmake.org/cmake/help/latest/guide/ide-integration/index.html). Из‑за этого охвата в документации много деталей, которые легко пропустить на фоне полной документации.

Есть хорошие руководства: [Professional CMake: A Practical Guide](https://crascit.com/professional-cmake/) и [Mastering CMake](https://cmake.org/cmake/help/book/mastering-cmake/). Они объясняют, как пользоваться CMake в сценариях, которые сама система хорошо описывает.

На практике часто встречаются задачи, которые не сводятся к вызову одной магической команды: интеграция с пакетными менеджерами, ограничения платформ, проекты с большим объёмом ресурсов, мультитаргетная упаковка релиза и другие мелкие нюансы. Готовых ответов на такие случаи в открытых источниках обычно мало и зачастую приходится писать огромные объемы вспомогательного функционала или вовсе создавать MR'ы в репозиторий CMake.

В последующих статьях я разберу все проблемы, с которыми мне пришлось встретиться при переносе большого проекта на современный CMake, а также те проблемы, с которыми еще придется встретиться