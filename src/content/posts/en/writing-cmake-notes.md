---
title: Why keep notes on CMake?
date: 2026-09-16
description: Why keep a separate CMake journal when documentation and books already exist.
tags:
  - cmake
---

CMake is a cross-platform build system. It covers more than C and C++: it supports [other languages](https://cmake.org/cmake/help/latest/command/enable_language.html) and a wide set of [generators](https://cmake.org/cmake/help/latest/manual/cmake-generators.7.html) for [different platforms](https://cmake.org/cmake/help/latest/variable/CMAKE_SYSTEM_NAME.html), architectures (often handled by the generator, though CMake also needs to know about the architecture — for example via [`CMAKE_<LANG>_LIBRARY_ARCHITECTURE`](https://cmake.org/cmake/help/latest/variable/CMAKE_LANG_LIBRARY_ARCHITECTURE.html#variable:CMAKE_%3CLANG%3E_LIBRARY_ARCHITECTURE)), and [IDEs](https://cmake.org/cmake/help/latest/guide/ide-integration/index.html). That breadth leaves many details easy to miss against the full documentation.

There are solid guides, including [Professional CMake: A Practical Guide](https://crascit.com/professional-cmake/) and [Mastering CMake](https://cmake.org/cmake/help/book/mastering-cmake/). They explain how to use CMake in the scenarios the tool itself documents well.

In practice, problems often do not reduce to one magic command: package-manager integration, platform limits, projects with large resource trees, multi-target release packaging, and other small edge cases. Public answers for those situations are scarce, and you often end up writing large amounts of supporting logic — or opening merge requests against CMake itself.

In later articles I will walk through the problems I hit while moving a large project to modern CMake, and the ones still ahead.
