#include "./wang.cpp"

#include <emscripten/bind.h>

using namespace emscripten;

EMSCRIPTEN_BINDINGS(noitool_map)
{
  emscripten::function<void, int, int, int, string, string, bool>("wang_main", &wang_main);
}
