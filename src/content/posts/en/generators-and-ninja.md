---
title: CMake generators and Ninja
description: How a generator differs from a compiler, what switching from Makefiles to Ninja looks like, and what CMakeCache.txt remembers.
date: 2026-09-08
tags:
  - cmake
  - ninja
  - generators
---

A generator is not a compiler. `cmake -G` chooses *which build files to write*: Ninja, Unix Makefiles, Visual Studio, Xcode. The compiler (`CMAKE_CXX_COMPILER`) is a separate axis. Mixing the two up explains half of the “CI is a different speed” threads.

## Why Ninja

Makefiles are nice because you can read them. Ninja is nice because you do not have to: the dependency graph is dense, startup is cheap, incremental builds are predictable.

If the critical path of tasks lasts $T_{\mathrm{crit}}$ and the total work is $T_{\Sigma}$, speedup is bounded by

$$
S \le \frac{T_{\Sigma}}{T_{\mathrm{crit}}}.
$$

Ninja does not shrink $T_{\mathrm{crit}}$ by itself. It spends less time walking the graph, so on large trees it gets closer to that ceiling.

Configure with an explicit generator:

```bash title="configure.sh" {2}
cmake -S . -B build \
  -G Ninja \
  -DCMAKE_BUILD_TYPE=RelWithDebInfo
```

Compared with the invocation I still find in 2018-era scripts, the change is one line:

```bash title="configure.sh" del={1} ins={2}
cmake -G "Unix Makefiles" -S . -B build
cmake -G Ninja -S . -B build
```

## What the cache records

After configure, the generator and compiler live in `CMakeCache.txt`. You do not commit that file, but you should open it when “it builds faster on their machine”.

```ini title="build/CMakeCache.txt" showLineNumbers=true {1-8}
CMAKE_GENERATOR:INTERNAL=Ninja
CMAKE_BUILD_TYPE:STRING=RelWithDebInfo
CMAKE_CXX_COMPILER:FILEPATH=/usr/bin/clang++
CMAKE_CXX_STANDARD:STRING=20
CMAKE_EXPORT_COMPILE_COMMANDS:BOOL=ON
```

If the generator changes, change the build directory. Running `cmake -G` over an already generated tree often leaves a half-alive cache and an error such as *“does not match the generator used previously”*.

## Generator expressions

When flags depend on the configuration I prefer generator expressions over `if(CMAKE_BUILD_TYPE)`. They work for single-config generators (Ninja) and multi-config ones (Visual Studio).

```cmake title="CMakeLists.txt" showLineNumbers=true {6-12} wrap
add_executable(app src/main.cpp)
target_compile_features(app PRIVATE cxx_std_20)

target_compile_options(app PRIVATE
  $<$<CXX_COMPILER_ID:GNU,Clang>:-Wall;-Wextra;-Wpedantic>
  $<$<AND:$<CXX_COMPILER_ID:GNU,Clang>,$<CONFIG:Release>>:-O3>
  $<$<CXX_COMPILER_ID:MSVC>:/W4>
)
```

Mark long `$<...>` fences with `wrap` so a phone does not have to pan across a single expression.

## A working rule

- Locally and on Linux/macOS CI — Ninja.
- Official `.sln` / `.xcodeproj` trees — the matching IDE generator, not “Ninja under Visual Studio and hope”.
- Compiler and generator move independently; I always record both in a note.
