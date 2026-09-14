---
title: How I write CMake notes
description: Why keep a build-system journal, how this site is put together, and the smallest C++ project I start from.
date: 2026-09-01
tags:
  - cmake
  - workflow
  - cxx
---

CMake rarely fails loudly. More often it quietly does the wrong thing: a different generator, a different C++ standard, a surprising `CMAKE_BUILD_TYPE`. These notes are a journal of those cases, not a command encyclopedia.

I keep Russian and English versions of each article. Math is Markdown plus KaTeX; listings keep a file name and line markers. Six months later I still know which `CMakeLists.txt` a snippet came from.

## A minimal project

This is the skeleton I use for almost every C++20 library. The highlight marks the target and its language standard — those two lines are the ones that later migrate into `INTERFACE` libraries.

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

`cmake_minimum_required` is not decoration: it pins policies. Without a 3.20 floor you inherit older `FetchContent` and `target_link_libraries` behaviour.

The source is deliberately tiny. If this already fails to compile, the toolchain is wrong, not the project layout.

```cpp title="src/main.cpp" showLineNumbers=true {1-8}
#include <iostream>
#include <string_view>

int main() {
  constexpr std::string_view name{"CMake Notes"};
  std::cout << "hello from " << name << '\n';
  return 0;
}
```

Configure from the source tree, never from inside the build directory:

```bash title="configure.sh"
cmake -S . -B build -G Ninja
cmake --build build
```

## Why not a full LaTeX article

A `.tex` file is great for a paper and awkward for a build log. CMake listings lose highlighting, anchors, and one-click copy. Markdown plus KaTeX keeps formulas and stays out of the way of code.

Sometimes you still want a bound, not a spell. A clean rebuild of $N$ translation units costs about $T \approx \sum_{i=1}^{N} t_i$; an incremental Ninja run is closer to the sum over the dirty subgraph. That is enough to explain why generators are worth arguing about.

## Adding a note

1. Create a pair of files with the same name: `src/content/posts/ru/slug.md` and `src/content/posts/en/slug.md`.
2. Fill in frontmatter: `title`, `description`, `date`, `tags`.
3. Mark listings with a language (`cmake`, `cpp`, `diff`, `bash`) and `title="file"`.
4. Math uses `$inline$` and `$$display$$`.

A `draft: true` note is omitted from the production build.
