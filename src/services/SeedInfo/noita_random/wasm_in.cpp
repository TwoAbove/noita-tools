#include "noita_random.cpp"

int Randomi(double a, double b)
{
    return Random((int)a, (int)b);
}

int Randomi(double a)
{
    return (int)Random((int)0, (int)a);
}

float ProceduralRandomf(double x, double y, double a, double b)
{
    SetRandomSeed(x, y);
    return a - (((b - a) + 1.) * -Randomf());
}

int ProceduralRandomi(double x, double y, double a, double b)
{
    SetRandomSeed(x, y);
    return Random(a, b);
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

#include <emscripten/bind.h>

using namespace emscripten;

EMSCRIPTEN_BINDINGS(my_module)
{
    emscripten::function<int, double, double>("Random", &Randomi);
    emscripten::function<int, double>("Random", &Randomi);
    emscripten::function<double>("Random", &Randomf);
    emscripten::function<double>("Randomf", &Randomf);
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
}
