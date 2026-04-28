#include <stdint.h>
#include <stdlib.h>
#include <string.h>

#include "../noita_random.cpp"
#include "stb_hbwang.h"
#include "coalmine_hax.cpp"
#include "jps.hh"
#include "pix.cpp"
#include "search.cpp"
#include "png.cpp"
#include "MurmurHash3.cpp"

// TODO: Look into optimizing with <https://github.com/google/highway>

const bool DEBUG = false;

NollaPrng GetRNG(int width)
{
   NollaPrng rng;
   rng.SetRandomFromWorldSeed(world_seed);
   rng.Next();

   int iters = width + world_seed + 11 * (width / -11) - 12 * (world_seed / 12);

   if (iters > 0)
   {
      do
      {
         rng.Next();
         iters -= 1;
      } while (iters != 0);
   }
   return rng;
}

class ToFrom
{
public:
   unsigned int from;
   unsigned int *to;
   int to_count;
   NollaPrng rng;
};

// This needs to be sorted for binary search
static const unsigned long blockedColors[] = {
    0x00ac6e, // load_pixel_scene4_alt
    0x70d79e, // load_gunpowderpool_01
    0x70d79f, //???
    0x70d7a1, // load_gunpowderpool_04
    0x7868ff, // load_gunpowderpool_02
    0xc35700, // load_oiltank
    0xff0080, // load_pixel_scene2
    0xff00ff, //???
    0xff0aff, // load_pixel_scene
};

bool isBlockedColor(unsigned long color)
{
   for (uint i = 0; i < sizeof(blockedColors) / sizeof(blockedColors[0]); i++)
   {
      if (blockedColors[i] == color)
      {
         return true;
      }
   }
   return false;
}

const int BIOME_PATH_FIND_WORLD_POS_MIN_X = 159;
const int BIOME_PATH_FIND_WORLD_POS_MAX_X = 223;

const int WORLD_OFFSET_X = 35;
const int WORLD_OFFSET_Y = 14;

int GetWidthFromPix(const int a, const int b, const int offset)
{
   return (((b - offset) * 512) / 10 - ((a - offset) * 512) / 10);
}
int GetWidthFromPix(const int a, const int b)
{
   return GetWidthFromPix(a, b, 0);
}

static int floorDiv512(int value)
{
   if (value >= 0)
   {
      return value / 512;
   }
   return -(((-value) + 511) / 512);
}

int GetTilePosXValue(const int gx, const int gy)
{
   return floorDiv512(gx) + WORLD_OFFSET_X;
}

int GetTilePosYValue(const int gx, const int gy)
{
   return floorDiv512(gy) + WORLD_OFFSET_Y;
}

int GetGlobalPosXValue(const int x, const int y)
{
   return 512 * (x - WORLD_OFFSET_X);
}

int GetGlobalPosYValue(const int x, const int y)
{
   return 512 * (y - WORLD_OFFSET_Y);
}

double GetBiomeOffsetX()
{
   NollaPrng rng = NewNollaPrng(world_seed);
   double someRand = rng.Next() * 9999.0 + 1.0;
   double someRand2 = rng.Next() * 200000.0 - 100000.0;
   double offset = rng.Next() * 200000.0 - 100000.0;
   return offset;
}

void rgbaToRgb(const unsigned char *src, unsigned char *dest, uint w, uint h)
{
   unsigned long j = 0;
   unsigned long src_size = w * h;
   for (unsigned long i = 0; i < src_size; i++)
   {
      dest[j++] = src[i * 4];
      dest[j++] = src[i * 4 + 1];
      dest[j++] = src[i * 4 + 2];
   }
}

void rgbToRgba(const unsigned char *src, unsigned char *dest, uint w, uint h)
{
   unsigned long j = 0;
   unsigned long src_size = w * h;
   for (unsigned long i = 0; i < src_size; i++)
   {
      dest[j++] = src[i * 3];
      dest[j++] = src[i * 3 + 1];
      dest[j++] = src[i * 3 + 2];
      dest[j++] = 255;
   }
}

void whiteout(unsigned char *src, uint w, uint h)
{
   unsigned long src_size = w * h;
   for (unsigned long i = 0; i < src_size; i++)
   {
      src[i * 4] = 255;
      src[i * 4 + 1] = 255;
      src[i * 4 + 2] = 255;
      src[i * 4 + 3] = 255;
   }
}

enum mapToUse
{
   out,
   path
};

struct Block
{
   int startX;
   int startY;
   int endX;
   int endY;
};

struct BlockList
{
   Block *items;
   uint len;
   uint cap;
};

void blockListClear(BlockList *list)
{
   list->len = 0;
}

void blockListFree(BlockList *list)
{
   free(list->items);
   list->items = NULL;
   list->len = 0;
   list->cap = 0;
}

void blockListPush(BlockList *list, Block block)
{
   if (list->len == list->cap)
   {
      list->cap = list->cap == 0 ? 32 : list->cap * 2;
      list->items = (Block *)realloc(list->items, list->cap * sizeof(Block));
   }
   list->items[list->len++] = block;
}

class MapGen
{
public:
   unsigned char *out_map;
   unsigned char *path_map;
   uint width;
   uint height;
   bool isCoalMine;
   bool shouldBlockOutRooms;
   unsigned int *randomMaterials;
   int worldX;
   int worldY;

   mapToUse usemap = out;

   unsigned long endNode;
   unsigned long *parents;

   BlockList blockedOutRooms = {};

   MapGen(
       unsigned char *_map,
       uint _width,
       uint _height,
       bool _isCoalMine,
       bool _shouldBlockOutRooms,
       unsigned int *_randomMaterials,
       int _worldX,
       int _worldY) : width(_width),
                      height(_height),
                      out_map(_map),
                      isCoalMine(_isCoalMine),
                      shouldBlockOutRooms(_shouldBlockOutRooms),
                      randomMaterials(_randomMaterials),
                      worldX(_worldX),
                      worldY(_worldY)
   {
      path_map = (unsigned char *)malloc(3 * width * height);
      memcpy(path_map, out_map, 3 * width * height);
      parents = (unsigned long *)malloc(width * height * sizeof(unsigned long));
   }

   ~MapGen()
   {
      blockListFree(&blockedOutRooms);
      free(parents);
      free(path_map);
   }

   unsigned char *GetMap()
   {
      if (DEBUG)
      {
         return out_map;
      }
      switch (usemap)
      {
      case out:
         return out_map;
         break;
      case path:
         return path_map;
         break;

      default:
         return out_map;
         break;
      }
   }

   void reset()
   {
      blockListClear(&blockedOutRooms);
   }

   void resetParents()
   {
      unsigned long count = width * height;
      for (unsigned long i = 0; i < count; i++)
      {
         parents[i] = NO_PARENT;
      }
   }

   bool hasPath()
   {
      usemap = out;
      if (shouldBlockOutRooms)
      {
         blockOutRooms(COLOR_BLACK, COLOR_WHITE);
      }

      if (isCoalMine)
      {
         doCoalMineHax();
      }

      memcpy(path_map, out_map, 3 * width * height);

      usemap = path;
      return isValid();
   }

   void finalize()
   {
      usemap = out;
      // Generated, now to fix up the map
      bool mainPath = isMainPath();
      if (!isCoalMine && mainPath)
      {
         fillMainPath();
      }
      if (isCoalMine)
      {
         undoCoalMineHax();
      }
      if (shouldBlockOutRooms)
      {
         fillBlockedRooms(COLOR_BLACK);
      }
      ClearPath();
      fillC0ffee();
      fillRandomMaterials();
   }

   void undoCoalMineHax()
   {
      unsigned char *map = GetMap();
      for (int y = 0; y < height; y++)
      {
         for (int x = 0; x < width; x++)
         {
            long overlayPos = getPos(256, 3, x, y);
            long i = getPos(width, 3, x, y);
            long pix = createRGB(coalmine_overlay[overlayPos], coalmine_overlay[overlayPos + 1], coalmine_overlay[overlayPos + 2]);
            if (pix == 0x4000)
            {
               // pudy248 note: is not actually air, this is the main rock portion of the overlay
               map[i] = 0x00;
               map[i + 1] = 0x00;
               map[i + 2] = 0x00;
            }
            if (pix == 0x0040)
            { // blue. Looks like air?
               map[i] = 0x00;
               map[i + 1] = 0x00;
               map[i + 2] = 0x00;
            }
            if (pix == 0xFEFEFE)
            { // white. Stairs. rock_static_intro
               // In the debug it's not shown, but used in path finding.
               map[i] = 0x00;
               map[i + 1] = 0x00;
               map[i + 2] = 0x00;
            }
         }
      }
   }

   void doCoalMineHax()
   {
      unsigned char *map = GetMap();
      for (int y = 0; y < height; y++)
      {
         for (int x = 0; x < width; x++)
         {
            long overlayPos = getPos(256, 3, x, y);
            long i = getPos(width, 3, x, y);
            long pix = createRGB(coalmine_overlay[overlayPos], coalmine_overlay[overlayPos + 1], coalmine_overlay[overlayPos + 2]);
            if (pix == 0x4000)
            {
               // pudy248 note: is not actually air, this is the main rock portion of the overlay
               map[i] = 0xFF;
               map[i + 1] = 0xFF;
               map[i + 2] = 0xFF;
            }
            if (pix == 0x0040)
            { // blue. Looks like air?
               map[i] = 0x00;
               map[i + 1] = 0x00;
               map[i + 2] = 0x00;
            }
            if (pix == 0xFEFEFE)
            { // white. Stairs. rock_static_intro
               // In the debug it's not shown, but used in path finding.
               map[i] = 0x0a;
               map[i + 1] = 0x33;
               map[i + 2] = 0x44;
            }
         }
      }
   }

   void ClearPath()
   {
      unsigned char *map = GetMap();
      unsigned long current = endNode;
      unsigned long max = width * height;
      while (current != NO_PARENT && current < max)
      {
         int x = current % width;
         int y = current / width;
         long c = getPixelColor(map, width, x, y);
         if (c == COLOR_COFFEE)
         {
            floodFill(map, width, height, x, y, COLOR_COFFEE, COLOR_BLACK);
         }
         current = parents[current];
      }
   }

   bool HasPathToBottom(
       uint path_start_x,
       bool fixed_x)
   {
      unsigned char *map = GetMap();
      resetParents();
      Search s = Search(map, width, height, 0, height - 1, parents);

      if (fixed_x)
      {
         bool hasPath = s.findPath(path_start_x, 0);
         if (hasPath)
         {
            endNode = s.endPos;
            return true;
         }
         return false;
      }

      int x = path_start_x;

      while (x < width)
      {
         long c = getPixelColor(map, width, x, 0);
         if (c != COLOR_BLACK && c != COLOR_COFFEE)
         {
            x++;
            continue;
         }

         if (c == COLOR_COFFEE)
         {
            floodFill(map, width, height, x, 0, COLOR_COFFEE, COLOR_BLACK);
            continue;
         }

         bool hasPath = s.findPath(x, 0);
         if (hasPath)
         {
            endNode = s.endPos;
            return true;
         }
         x++;
      }
      return false;
   }

   bool isMainPath()
   {
      int fill_x_from = (BIOME_PATH_FIND_WORLD_POS_MIN_X - worldX * 512.0) / 10;
      int fill_x_to = fill_x_from + (BIOME_PATH_FIND_WORLD_POS_MAX_X - BIOME_PATH_FIND_WORLD_POS_MIN_X) / 10;
      return worldY < 29 && fill_x_to > 0 && fill_x_from > 0 && width > fill_x_from && fill_x_to < width + fill_x_from;
   }

   int fillMainPath()
   {
      unsigned char *map = GetMap();
      int fill_x_from = (BIOME_PATH_FIND_WORLD_POS_MIN_X - worldX * 512.0) / 10;
      int fill_x_to = fill_x_from + (BIOME_PATH_FIND_WORLD_POS_MAX_X - BIOME_PATH_FIND_WORLD_POS_MIN_X) / 10;
      fill(map, width, fill_x_from, fill_x_to, 0, 6, COLOR_BLACK);
      return fill_x_from;
   }

   void clearStartingArea()
   {
      unsigned char *map = GetMap();
      uint x = 0;

      for (uint x = 0; x < width; x++)
      {
         long c = getPixelColor(map, width, x, 0);
         if (c == COLOR_COFFEE)
         {
            floodFill(map, width, height, x, 0, COLOR_COFFEE, COLOR_BLACK);
         }
      }
   }

   bool isValid()
   {
      uint path_start_x = 0;
      bool mainPath = isMainPath();
      if (isCoalMine)
      {
         path_start_x = 0x8e;
      }
      else if (mainPath)
      {
         path_start_x = fillMainPath();
      }

      bool hasPath = HasPathToBottom(path_start_x, mainPath);

      return hasPath;
   }

   void blockOutRooms(unsigned long passableColor, unsigned long targetColor)
   {
      unsigned char *map = GetMap();
      unsigned long posMax = width * height;

      for (unsigned long pos = 0; pos < posMax; pos++)
      {
         long color = getPixelColor(map, pos * 3);
         // ~70% of pixels are black or white, so skip them
         if (color == COLOR_BLACK)
         {
            continue;
         }
         if (color == COLOR_WHITE)
         {
            continue;
         }
         if (!isBlockedColor(color))
         {
            continue;
         }
         uint x = pos % width;
         uint y = pos / width;

         int startX = x + 1;
         int endX = x + 1;
         int startY = y + 1;
         int endY = y + 1;
         bool foundEnd = false;
         while (!foundEnd && endX < width)
         {
            long c = getPixelColor(map, width, endX, startY);
            if (c == passableColor || ShadeOfGrey(c, 0x32))
            {
               endX += 1;
               continue;
            };
            endX -= 1;
            foundEnd = true;
         }
         if (endX >= width)
         {
            endX = width - 1;
         }
         foundEnd = false;
         while (!foundEnd && endY < height)
         {
            long c = getPixelColor(map, width, startX, endY);
            if (c == passableColor || ShadeOfGrey(c, 0x32))
            {
               endY += 1;
               continue;
            };
            endY -= 1;
            foundEnd = true;
         }
         if (endY >= height)
         {
            endY = height - 1;
         }
         blockListPush(&blockedOutRooms, Block{startX, startY, endX, endY});
         fill(map, width, startX, endX, startY, endY, targetColor);
      }
   }

   void fillBlockedRooms(unsigned long color)
   {
      unsigned char *map = GetMap();
      for (uint i = 0; i < blockedOutRooms.len; i++)
      {
         Block block = blockedOutRooms.items[i];
         fill(map, width, block.startX, block.endX, block.startY, block.endY, color);
      }
   }

   void fillC0ffee()
   {
      unsigned char *map = GetMap();
      NollaPrng rng = NewNollaPrng(0);
      rng.SetRandomFromWorldSeed(world_seed);
      rng.Next();

      unsigned long posMax = width * height;

      for (unsigned long pos = 0; pos < posMax; pos++)
      {
         long c = getPixelColor(map, pos * 3);
         if (c != COLOR_COFFEE)
         {
            continue;
         }

         long to = COLOR_BLACK;
         if (0.5f > (float)rng.Next()) // BIOME_RANDOM_BLOCK_CHANCE
         {
            to = COLOR_WHITE;
         }

         int x = pos % width;
         int y = pos / width;
         floodFill(map, width, height, x, y, COLOR_COFFEE, to);
      }
   }

   void fillRandomMaterials()
   {
      unsigned char *map = GetMap();
      int numberOfRandoms = randomMaterials[0];
      if (numberOfRandoms == 0)
      {
         return;
      }
      ToFrom *replacements = (ToFrom *)malloc(numberOfRandoms * sizeof(ToFrom));
      int pos = 1;

      for (int i = 0; i < numberOfRandoms; i++)
      {
         replacements[i].from = randomMaterials[pos];
         replacements[i].to_count = randomMaterials[pos + 1];
         replacements[i].to = &randomMaterials[pos + 2];
         replacements[i].rng = GetRNG(width);
         replacements[i].rng.Next();
         pos += 2 + replacements[i].to_count;
      }

      for (int i = 0; i < numberOfRandoms; i++)
      {
         ToFrom *rr = &replacements[i];
         unsigned long posMax = width * height;
         for (unsigned long pos = 0; pos < posMax; pos++)
         {
            long c = getPixelColor(map, pos * 3);
            if (c != rr->from)
            {
               continue;
            }
            int rand = rr->rng.Random(0, rr->to_count - 1);
            int x = pos % width;
            int y = pos / width;
            floodFill(map, width, height, x, y, rr->from, rr->to[rand]);
         }
      }
      free(replacements);
   }
};

struct TilesetCacheEntry
{
   unsigned long color;
   stbhw_tileset *tileset;
};

static TilesetCacheEntry *tilesetCache = NULL;
static uint tilesetCacheLen = 0;
static uint tilesetCacheCap = 0;

static uint nextWangRandom(void *user)
{
   return ((NollaPrng *)user)->NextU();
}

stbhw_tileset *get_tileset(unsigned long color, const unsigned char *rgba_tiles_data, uint tiles_width, uint tiles_height)
{
   for (uint i = 0; i < tilesetCacheLen; i++)
   {
      if (tilesetCache[i].color == color)
      {
         return tilesetCache[i].tileset;
      }
   }

   stbhw_tileset *ts = (stbhw_tileset *)malloc(sizeof(stbhw_tileset));
   memset(ts, 0, sizeof(stbhw_tileset));
   unsigned char *rgb_tiles_data = (unsigned char *)malloc(3 * tiles_width * tiles_height);
   rgbaToRgb(rgba_tiles_data, rgb_tiles_data, tiles_width, tiles_height);
   int success = stbhw_build_tileset_from_image(ts, rgb_tiles_data, tiles_width * 3, tiles_width, tiles_height);
   free(rgb_tiles_data);
   if (!success)
   {
      free(ts);
      return NULL;
   }

   if (tilesetCacheLen == tilesetCacheCap)
   {
      tilesetCacheCap = tilesetCacheCap == 0 ? 16 : tilesetCacheCap * 2;
      tilesetCache = (TilesetCacheEntry *)realloc(tilesetCache, tilesetCacheCap * sizeof(TilesetCacheEntry));
   }
   tilesetCache[tilesetCacheLen++] = TilesetCacheEntry{color, ts};
   return ts;
}

void generate_map_from_rgba_tiles(
    unsigned char *rgba_tiles_data,
    uint tiles_width,
    uint tiles_height,
    unsigned char *result,
    uint width,
    uint height,
    unsigned long color,
    bool isCoalMine,
    bool shouldBlockOutRooms,
    unsigned int *randomMaterials,
    int worldX,
    int worldY)
{
   if (rgba_tiles_data == NULL || tiles_width == 0 || tiles_height == 0)
   {
      whiteout(result, width, height);
      return;
   }

   stbhw_tileset *ts = get_tileset(color, rgba_tiles_data, tiles_width, tiles_height);
   if (ts == NULL)
   {
      return;
   }

   NollaPrng rng = GetRNG(width);

   int tries = 0;
   long mod_malloc_amount = 3 * width * (height + 4);
   unsigned char *res = (unsigned char *)malloc(mod_malloc_amount);
   long malloc_amount = 3 * width * height;

   unsigned char *rgb_result = (unsigned char *)malloc(malloc_amount);

   bool hasPath = false;
   do
   {
      if (tries >= 100)
      {
         break;
      }

      NollaPrng rng2 = NewNollaPrng(rng.NextU());

      int success = stbhw_generate_image(ts, NULL, res, width * 3, width, height + 4, nextWangRandom, &rng2);
      if (!success)
      {
         free(res);
         free(rgb_result);
         return;
      }

      int num_bytes = 4 * 3 * width;
      memcpy(rgb_result, &res[num_bytes], mod_malloc_amount - num_bytes);

      MapGen mg = MapGen(rgb_result, width, height, isCoalMine, shouldBlockOutRooms, randomMaterials, worldX, worldY);

      hasPath = mg.hasPath();
      if (hasPath)
      {
         mg.finalize();
      }
      mg.reset();
      tries++;
   } while (hasPath == false);

   free(res);
   rgbToRgba(rgb_result, result, width, height);
   free(rgb_result);
}

class MapHandler
{
public:
   uint width;
   uint height;
   unsigned long color;
   bool isCoalMine;
   bool shouldBlockOutRooms;
   unsigned int *randomMaterials;
   int worldX;
   int worldY;

   unsigned char *map;
   unsigned char *bigMap;

   void init(
       uint _width,
       uint _height,
       unsigned long _color,
       bool _isCoalMine,
       bool _shouldBlockOutRooms,
       uintptr_t _randomMaterials,
       int _worldX,
       int _worldY)
   {
      width = _width;
      height = _height;
      color = _color;
      isCoalMine = _isCoalMine;
      shouldBlockOutRooms = _shouldBlockOutRooms;
      randomMaterials = reinterpret_cast<unsigned int *>(_randomMaterials);
      worldX = _worldX - WORLD_OFFSET_X;
      worldY = _worldY - WORLD_OFFSET_Y;
      map = (unsigned char *)malloc(_width * _height * 4);
      bigMap = (unsigned char *)malloc(_width * 10 * _height * 10 * 4);
   }

   void destroy()
   {
      free(map);
      free(bigMap);
   }

   void generate_map(const unsigned char *png_data, uint32_t png_len)
   {
      if (png_data == NULL || png_len == 0)
      {
         whiteout(map, width, height);
         return;
      }
      image tiles = load_png_bytes(png_data, png_len);
      generate_map_from_rgba_tiles(
          tiles.image,
          tiles.width,
          tiles.height,
          map,
          width,
          height,
          color,
          isCoalMine,
          shouldBlockOutRooms,
          randomMaterials,
          worldX,
          worldY);
      free_png_image(&tiles);
   }

   void toBig()
   {
      scaleImage(map, width, height, bigMap, 10);
   }

   void drawImageData(image *img, int gx, int gy, uintptr_t _colorToMaterialTable)
   {
      if (img == NULL || img->image == NULL)
      {
         return;
      }

      // int tx = (gx) / 512;
      int tx = (gx + 5) / 512;
      // int rx = (gx) % 512;
      int rx = (gx + 5) % 512;

      // int ty = (gy) / 512;
      int ty = (gy + 13) / 512;
      // int ry = (gy) % 512;
      int ry = (gy + 13) % 512;

      int old_px = (tx - worldX) * 512 + rx;
      int old_py = (ty - worldY) * 512 + ry;

      int px = gx - worldX * 512;
      int py = gy - worldY * 512;

      // printf("drawImageData path: %s, gx: %i, gy: %i, px: %i, py: %i, old_px: %i, old_py: %i\n", path.c_str(), gx, gy, px, py, old_px, old_py);

      const unsigned int *colorToMaterialTable = reinterpret_cast<unsigned int *>(_colorToMaterialTable);

      // Check that the image won't go out of bounds
      // if (px + img.width > width * 10 || py + img.height > height * 10)
      // {
      //    printf("drawImageData out of bounds %i %i %i %i\n", px, py, img.width, img.height);
      //    return;
      // }
      // if (px < 0 || py < 0)
      // {
      //    printf("drawImageData out of bounds %i %i %i %i\n", px, py, img.width, img.height);
      //    return;
      // }

      for (int y = 0; y < img->height; y++)
      {
         for (int x = 0; x < img->width; x++)
         {
            unsigned long offset = getPos(img->width, img->channels, x, y);
            unsigned long pixel = getRGBAPixelColor(img->image, offset);
            bool isTransparent = isRGBATransparent(pixel);
            if (pixel == 0xFF || isTransparent) // 0x000000FF (black)
            {
               continue;
            }

            unsigned long toColor = pixel;
            for (int i = 0; i < colorToMaterialTable[0]; i++)
            {
               int offset = 1 + i * 2;
               if (colorToMaterialTable[offset] == pixel)
               {
                  toColor = colorToMaterialTable[offset + 1];
                  break;
               }
            }
            setRGBAPixelColor(bigMap, width * 10, px + x, py + y, toColor);
         }
      }
   }
};

// map and result are allocated and freed in js.
// Only used in coalmines?
STBHW_EXTERN void generate_path_map(
    unsigned char map[],
    uint map_w,
    uint map_h,
    unsigned char result[],
    int worldX,
    int worldY)
{
   long malloc_amount = 3 * map_w * map_h;
   memcpy(result, map, malloc_amount);
   uint path_start_x = 0x8e;
   floodFill(result, map_w, map_h, path_start_x, 1, COLOR_BLACK, COLOR_PURPLE);
}
