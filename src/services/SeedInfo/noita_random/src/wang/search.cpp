#pragma once

#include <stdlib.h>
#include <string.h>

#include "pix.cpp"

const unsigned long NO_PARENT = (unsigned long)-1;

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

struct FloodPoint
{
  unsigned int x;
  unsigned int y;
};

struct FloodStack
{
  FloodPoint *items;
  unsigned long len;
  unsigned long cap;
};

static void flood_stack_push(FloodStack *stack, unsigned int x, unsigned int y)
{
  if (stack->len == stack->cap)
  {
    stack->cap = stack->cap == 0 ? 256 : stack->cap * 2;
    stack->items = (FloodPoint *)realloc(stack->items, stack->cap * sizeof(FloodPoint));
  }
  stack->items[stack->len++] = FloodPoint{x, y};
}

static FloodPoint flood_stack_pop(FloodStack *stack)
{
  return stack->items[--stack->len];
}

void floodFill(unsigned char *map,
               uint width,
               uint height,
               uint initialX,
               uint initialY,
               unsigned long fromColor,
               unsigned long toColor)
{
  if (initialX >= width || initialY >= height)
  {
    return;
  }

  unsigned char *visited = (unsigned char *)calloc(width * height, 1);
  FloodStack stack = {};

  flood_stack_push(&stack, initialX, initialY);
  visited[getPos(width, 1, initialX, initialY)] = true;

  while (stack.len > 0)
  {
    FloodPoint pos = flood_stack_pop(&stack);
    const int x = pos.x;
    const int y = pos.y;

    setPixelColor(map, width, x, y, toColor);

    const int next[4][2] = {
        {x - 1, y},
        {x + 1, y},
        {x, y - 1},
        {x, y + 1},
    };

    for (int i = 0; i < 4; i++)
    {
      int nx = next[i][0];
      int ny = next[i][1];
      if (nx < 0 || ny < 0 || (uint)nx >= width || (uint)ny >= height)
      {
        continue;
      }

      unsigned long p = getPos(width, 1, nx, ny);
      if (visited[p])
      {
        continue;
      }

      unsigned long nc = getPixelColor(map, p * 3);
      if (nc != fromColor || nc == toColor)
      {
        continue;
      }

      visited[p] = true;
      flood_stack_push(&stack, nx, ny);
    }
  }

  free(stack.items);
  free(visited);
}

struct SearchNode
{
  int x;
  int y;
  unsigned long parent;
  unsigned long order;
};

struct NodeHeap
{
  SearchNode *items;
  unsigned long len;
  unsigned long cap;
  int targetY;
};

static int node_priority(const NodeHeap *heap, const SearchNode *node)
{
  int dy = node->y - heap->targetY;
  return dy < 0 ? -dy : dy;
}

static bool node_less(const NodeHeap *heap, const SearchNode *a, const SearchNode *b)
{
  int ap = node_priority(heap, a);
  int bp = node_priority(heap, b);
  if (ap != bp)
  {
    return ap < bp;
  }
  return a->order < b->order;
}

static void heap_swap(SearchNode *a, SearchNode *b)
{
  SearchNode tmp = *a;
  *a = *b;
  *b = tmp;
}

static void heap_push(NodeHeap *heap, SearchNode node)
{
  if (heap->len == heap->cap)
  {
    heap->cap = heap->cap == 0 ? 256 : heap->cap * 2;
    heap->items = (SearchNode *)realloc(heap->items, heap->cap * sizeof(SearchNode));
  }

  unsigned long i = heap->len++;
  heap->items[i] = node;
  while (i > 0)
  {
    unsigned long parent = (i - 1) / 2;
    if (!node_less(heap, &heap->items[i], &heap->items[parent]))
    {
      break;
    }
    heap_swap(&heap->items[i], &heap->items[parent]);
    i = parent;
  }
}

static SearchNode heap_pop(NodeHeap *heap)
{
  SearchNode result = heap->items[0];
  heap->items[0] = heap->items[--heap->len];

  unsigned long i = 0;
  while (true)
  {
    unsigned long left = i * 2 + 1;
    unsigned long right = left + 1;
    unsigned long best = i;

    if (left < heap->len && node_less(heap, &heap->items[left], &heap->items[best]))
    {
      best = left;
    }
    if (right < heap->len && node_less(heap, &heap->items[right], &heap->items[best]))
    {
      best = right;
    }
    if (best == i)
    {
      break;
    }
    heap_swap(&heap->items[i], &heap->items[best]);
    i = best;
  }

  return result;
}

class Search
{
public:
  unsigned char *map;
  int width;
  int height;
  int targetX;
  int targetY;
  char *visited;
  unsigned long *parents;
  unsigned long endPos = NO_PARENT;

  NodeHeap heap = {};
  unsigned long order = 0;

  Search(unsigned char _map[], int _width, int _height, int _targetX, int _targetY, unsigned long *_parents)
  {
    map = _map;
    width = _width;
    height = _height;
    targetX = _targetX;
    targetY = _targetY;
    parents = _parents;
    visited = (char *)calloc(width * height, 1);
    heap.targetY = targetY;
  }

  ~Search()
  {
    free(heap.items);
    free(visited);
  }

  bool findPath(int x, int y)
  {
    unsigned long start = pos(x, y);
    setVisited(x, y);
    parents[start] = NO_PARENT;
    heap_push(&heap, SearchNode{x, y, NO_PARENT, order++});

    while (heap.len > 0)
    {
      SearchNode n = heap_pop(&heap);
      if (atTarget(&n))
      {
        endPos = pos(n.x, n.y);
        return true;
      }

      tryNext(n.x, n.y - 1, &n);
      tryNext(n.x - 1, n.y, &n);
      tryNext(n.x + 1, n.y, &n);
      tryNext(n.x, n.y + 1, &n);
    }
    return false;
  }

  unsigned long pos(int x, int y) const
  {
    return getPos(width, 1, x, y);
  }

private:
  bool tryNext(int x, int y, SearchNode *n)
  {
    if (!valid(x, y))
    {
      return false;
    }
    if (isVisited(x, y))
    {
      return false;
    }
    if (!traversable(x, y))
    {
      return false;
    }

    unsigned long p = pos(x, y);
    unsigned long parent = pos(n->x, n->y);
    setVisited(x, y);
    parents[p] = parent;
    heap_push(&heap, SearchNode{x, y, parent, order++});
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

  bool atTarget(SearchNode *n) const
  {
    return targetY == n->y;
  }
};
