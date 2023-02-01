#include "noita_random.cpp"
#include "coalmine_hax.cpp"

int main()
{
  uint world_seed = 1674055821;
  {
    NollaPrng rng = NollaPrng(0);
    rng.SetRandomFromWorldSeed(world_seed);
    // rng.Next();

    for (int i = 0; i < 10; i++)
    {
      cout << rng.Next() << " \t";
    }
    cout << endl;
  }
  {
    NollaPrng rng = NollaPrng(0);
    rng.SetRandomFromWorldSeed(world_seed);
    // rng.Next();

    for (int i = 0; i < 10; i++)
    {
      cout << (0.5f > rng.Next()) << "\t\t";
    }
    cout << endl;
  }
};
