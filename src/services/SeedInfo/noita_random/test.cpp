#include "noita_random.cpp"

int main()
{

  SetWorldSeed(457440497);

  int y = 10581;
  int y2 = 10611;
  cout << GetRandomAction(-331, y, 4, 0).id << endl;
  cout << GetRandomAction(-331, y2, 4, 0).id << endl;

  cout << GetRandomAction(-304.6, y, 4, 0).id << endl;
  cout << GetRandomAction(-304.6, y2, 4, 0).id << endl;

  cout << GetRandomAction(-278.2, y, 4, 0).id << endl;
  cout << GetRandomAction(-278.2, y2, 4, 0).id << endl;

  cout << GetRandomAction(-251.8, y, 4, 0).id << endl;
  cout << GetRandomAction(-251.8, y2, 4, 0).id << endl;

  cout << GetRandomAction(-255.4, y, 4, 0).id << endl;
  cout << GetRandomAction(-255.4, y2, 4, 0).id << endl;

  return 0;
};
