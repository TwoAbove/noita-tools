#pragma once

#include <array>
#include <queue>
#include <stack>
#include <memory>
#include <vector>
#include <map>

#include "pix.cpp"

void fill(unsigned char *map,
          int w,
          int x1,
          int x2,
          int y1,
          int y2,
          long color)
{
  for (int x = x1; x <= x2; x++)
  {
    for (int y = y1; y <= y2; y++)
    {
      setPixelColor(map, w, x, y, color);
    }
  }
}

void floodFill(unsigned char *map,
               uint width,
               uint height,
               uint initialX,
               uint initialY,
               unsigned long fromColor,
               unsigned long toColor)
{
  stack<pair<uint, uint>> s;
  unsigned char *visited = (unsigned char *)calloc(width * height, 1);

  if (initialX < 0 || initialX >= width || initialY < 0 || initialY >= height)
  {
    return;
  }

  s.push(std::make_pair(initialX, initialY));
  visited[getPos(width, 1, initialX, initialY)] = true;

  int filled = 0;

  auto tryNext = [&map, &width, &height, &s, &visited, &fromColor, &toColor](uint nx, uint ny)
  {
    if (nx < 0 || nx >= width || ny < 0 || ny >= height)
    {
      return;
    }

    unsigned long p = getPos(width, 1, nx, ny);
    if (visited[p] == true)
    {
      return;
    }

    unsigned long nc = getPixelColor(map, p * 3);
    if (nc != fromColor || nc == toColor)
    {
      return;
    }

    visited[p] = true;
    s.push(std::make_pair(nx, ny));
  };

  while (!s.empty())
  {
    auto pos = s.top();
    const int x = pos.first;
    const int y = pos.second;
    s.pop();

    setPixelColor(map, width, x, y, toColor);
    filled++;

    tryNext(x - 1, y);
    tryNext(x + 1, y);
    tryNext(x, y - 1);
    tryNext(x, y + 1);
  }
  free(visited);
}

struct Node
{
  int x;
  int y;

  int targetX;
  int targetY;

  unsigned long parentPos;

  Node(int _x, int _y)
  {
    x = _x;
    y = _y;
  }

  Node(int _x, int _y, int _targetX, int _targetY, unsigned long _parentPos = -1)
  {
    x = _x;
    y = _y;
    targetX = _targetX;
    targetY = _targetY;
    parentPos = _parentPos;
  }

  // Node(int _x, int _y, int _targetX, int _targetY)
  // {
  //   x = _x;
  //   y = _y;
  //   targetX = _targetX;
  //   targetY = _targetY;
  // }

  bool operator<(const Node &b) const
  {
    const int h = Manhattan();
    const int hb = b.Manhattan();
    return h < hb;
  }
  bool operator>(const Node &b) const
  {
    const int h = Manhattan();
    const int hb = b.Manhattan();
    return h > hb;
  }

  int H() const
  {
    return ManhattanDown();
  }

  int Manhattan() const
  {
    const int dx = abs(x - targetX);
    const int dy = abs(y - targetY);
    return (dx + dy);
  }

  int ManhattanDown() const
  {
    const int dy = abs(y - targetY);
    return (dy);
  }
  int Chebyshev() const
  {
    const int dx = abs(x - targetX);
    const int dy = abs(y - targetY);
    return max(dx, dy);
  }
  int Euclidean() const
  {
    const int dx = abs(x - targetX);
    const int dy = abs(y - targetY);
    return (int)sqrt(dx * dx + dy * dy);
  }
};

struct NodeComparator
{
  bool operator()(const shared_ptr<Node> &a, const shared_ptr<Node> &b) const
  {
    return a->H() >= b->H();
  }
};

class Search
{
public:
  unsigned char *map;
  int width;
  int height;
  int targetX;
  int targetY;
  char *visited;
  std::unordered_map<unsigned long, shared_ptr<Node>> nodeList;

  priority_queue<shared_ptr<Node>, vector<shared_ptr<Node>>, NodeComparator> pq;

  Search(unsigned char _map[], int _width, int _height, int _targetX, int _targetY)
  {
    map = _map;
    width = _width;
    height = _height;
    targetX = _targetX;
    targetY = _targetY;
    visited = (char *)calloc(width * height, 1);
  }

  ~Search()
  {
    free(visited);
  }

  bool findPath(int x, int y)
  {
    setVisited(x, y);
    shared_ptr<Node> _n = make_shared<Node>(x, y, targetX, targetY);
    nodeList[pos(x, y)] = _n;
    pq.push(_n);
    while (!pq.empty())
    {
      shared_ptr<Node> n = pq.top();
      if (atTarget(n))
      {
        return true;
      }
      int x = n->x;
      int y = n->y;
      pq.pop();
      tryNext(x, y - 1, n);
      tryNext(x - 1, y, n);
      tryNext(x + 1, y, n);
      tryNext(x, y + 1, n);
    }
    return false;
  }

  // pos() roughly caches the result of getPos to avoid cache misses.
  // see One-place cache: https://en.wikibooks.org/wiki/Optimizing_C%2B%2B/General_optimization_techniques/Memoization
  // This is not thread safe, but we don't need it to be.
  // If WASM ever supports threads, we would still thread on the map gen level.
  unsigned long pos(int x, int y) const
  {
    static int prev_x = 0;
    static int prev_y = 0;
    static unsigned long result = 0;
    if (x == prev_x && y == prev_y)
    {
      return result;
    }
    prev_x = x;
    prev_y = y;
    result = getPos(width, 1, x, y);
    return result;
  }

private:
  bool tryNext(int x, int y, shared_ptr<Node> n)
  {
    if (isVisited(x, y))
    {
      return false;
    }
    if (!valid(x, y)) {
      return false;
    }
    if (!traversable(x, y))
    {
      return false;
    }

    setVisited(x, y);
    unsigned long p = pos(x, y);
    shared_ptr<Node> _n = make_shared<Node>(x, y, targetX, targetY, pos(n->x, n->y));
    nodeList[p] = _n;
    pq.push(_n);
    return true;
  }

  void setVisited(int x, int y)
  {
    unsigned long p = pos(x, y);

    setPixelColor(map, p * 3, COLOR_PURPLE);
    visited[p] = true;
  }

  bool isVisited(int x, int y)
  {
    return visited[pos(x, y)];
  }

  bool valid(int x, int y) const
  {
    return x >= 0 && y >= 0 && x < width && y < height;
  }

  bool traversable(int x, int y) const
  {
    unsigned long p = pos(x, y);
    long c = getPixelColor(map, p * 3);

    return c == COLOR_BLACK || c == COLOR_COFFEE || c == COLOR_FROZEN_VAULT_MINT || c == COLOR_HELL_GREEN;
  }

  bool atTarget(shared_ptr<Node> n) const
  {
    return targetY == n->y;
  }
};
