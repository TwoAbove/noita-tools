#pragma once

#include <stdint.h>

typedef unsigned int uint;
typedef uint8_t byte;
typedef int8_t int8;
typedef int16_t int16;
typedef int32_t int32;
typedef int64_t int64;
typedef uint8_t uint8;
typedef uint16_t uint16;
typedef uint32_t uint32;
typedef uint64_t uint64;
typedef uint8 bool8;

uint world_seed = 0;

class NollaPrng
{
public:
    double Seed;

    void SetRandomFromWorldSeed(uint s)
    {
        Seed = s;
        if (2147483647.0 <= Seed)
        {
            Seed = s * 0.5;
        }
    }

    uint NextU()
    {
        Next();
        return Seed * 4.656612875e-10 * 2147483645.0;
    }

    double Next()
    {
        int v4 = 0x41a7 * (int)Seed - 0x7FFFFFFF * ((int)Seed / 0x1f31d);
        if (v4 <= 0)
        {
            v4 += 0x7fffffff;
        }
        Seed = (double)v4;
        return Seed / 0x7fffffff;
    }

    int Random(int a, int b)
    {
        return a + (int)((double)(b + 1 - a) * Next());
    }
};

NollaPrng NewNollaPrng(double seed)
{
    NollaPrng rng;
    rng.Seed = seed;
    rng.Next();
    return rng;
}

void SetWorldSeed(uint worldseed)
{
    world_seed = worldseed;
}

uint GetWorldSeed()
{
    return world_seed;
}
