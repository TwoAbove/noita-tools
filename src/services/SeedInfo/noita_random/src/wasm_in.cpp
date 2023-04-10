#include "noita_random.cpp"

int Randomi(double a, double b)
{
    return g_rng.Random((int)RoundHalfOfEven(a), (int)RoundHalfOfEven(b));
}

int Randomi(int a, int b)
{
    return g_rng.Random(a, b);
}

int Randomi(double a)
{
    return (int)g_rng.Random((int)0, (int)RoundHalfOfEven(a));
}

float Random()
{
    return g_rng.Next();
}

void SetRandomSeed(double x, double y)
{
    g_rng.SetRandomSeed(world_seed, x, y);
}

float ProceduralRandomf(double x, double y, double a, double b)
{
    g_rng.SetRandomSeed(world_seed, x, y);
    return a + ((b - a) * g_rng.Next());
}

int ProceduralRandomi(double x, double y, double a, double b)
{
    g_rng.SetRandomSeed(world_seed, x, y);
    return g_rng.Random((int)RoundHalfOfEven(a), (int)RoundHalfOfEven(b));
}

string _GetRandomActionWithType(double x, double y, int level, int type, int offset = 0)
{
    Spell s = GetRandomActionWithType(x, y, level, type, offset);
    return s.id;
}

string _GetRandomAction(double x, double y, int level, int offset = 0)
{
    Spell s = GetRandomAction(x, y, level, offset);
    return s.id;
}

#include "wang/wang.cpp"

#include <emscripten/bind.h>

using namespace emscripten;

EMSCRIPTEN_BINDINGS(my_module)
{
    register_map<uint, uint>("MapUIntUInt");

    emscripten::function<int, int, int>("Random", &Randomi);
    emscripten::function<int, double, double>("Random", &Randomi);
    emscripten::function<int, double>("Random", &Randomi);
    emscripten::function<float>("Random", &Random);
    emscripten::function<float>("Randomf", &Random);
    emscripten::function("ProceduralRandomf", &ProceduralRandomf);
    emscripten::function("ProceduralRandomi", &ProceduralRandomi);
    emscripten::function("SetRandomSeed", &SetRandomSeed);
    emscripten::function("SetWorldSeed", &SetWorldSeed);
    emscripten::function<string>("PickForSeed", &PickForSeed);
    emscripten::function("RandomDistributionf", &RandomDistributionf);
    emscripten::function("RandomDistribution", &RandomDistribution);
    emscripten::function<string>("GetRandomActionWithType", &_GetRandomActionWithType);
    emscripten::function<string>("GetRandomAction", &_GetRandomAction);
    emscripten::function("RoundHalfOfEven", &RoundHalfOfEven);
    emscripten::function<int, int, int>("GetWidthFromPix", &GetWidthFromPix);
    emscripten::function<int, int, int, int>("GetWidthFromPixWithOffset", &GetWidthFromPix);
    register_vector<int>("IntVector");
    emscripten::function("GetGlobalPos", &GetGlobalPos);
    emscripten::function("GetTilePos", &GetTilePos);
    emscripten::function("SetUnlockedSpells", &SetUnlockedSpells, allow_raw_pointers());
    // emscripten::function("GenerateMap", &generate_map, allow_raw_pointers());
    emscripten::class_<MapHandler>("MapHandler")
        .constructor<uint, uint, unsigned long, bool, bool, int, int, int>(emscripten::allow_raw_pointers())
        .function("generate_map", &MapHandler::generate_map, emscripten::allow_raw_pointers())
        .function("iterateMap", &MapHandler::iterateMap, emscripten::allow_raw_pointers())
        .function("somePixels", &MapHandler::somePixels, emscripten::allow_raw_pointers())
        .function("getMap", &MapHandler::getMap)
        .function("toBig", &MapHandler::toBig)
        .function("drawImageData", &MapHandler::drawImageData, emscripten::allow_raw_pointers())
        .property("width", &MapHandler::width)
        .property("height", &MapHandler::height)
        .property<int>(
            "map",
            [](const MapHandler &self) -> uintptr_t
            {
                return reinterpret_cast<uintptr_t>(self.map);
            },
            [](MapHandler &self, const uintptr_t ptr)
            {
                self.map = reinterpret_cast<unsigned char *>(ptr);
            })
        .property<int>(
            "bigMap",
            [](const MapHandler &self) -> uintptr_t
            {
                return reinterpret_cast<uintptr_t>(self.bigMap);
            },
            [](MapHandler &self, const uintptr_t ptr)
            {
                self.bigMap = reinterpret_cast<unsigned char *>(ptr);
            });
}
