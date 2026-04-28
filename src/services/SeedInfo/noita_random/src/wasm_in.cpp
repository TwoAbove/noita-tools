#include "noita_random.cpp"

#include "wang/wang.cpp"

#include <cstdint>

extern "C"
{
    void SetWorldSeedRaw(uint32_t seed)
    {
        SetWorldSeed(seed);
    }

    uint32_t GetWorldSeedRaw()
    {
        return GetWorldSeed();
    }

    int GetWidthFromPixRaw(int a, int b)
    {
        return GetWidthFromPix(a, b);
    }

    int GetWidthFromPixWithOffsetRaw(int a, int b, int offset)
    {
        return GetWidthFromPix(a, b, offset);
    }

    int GetGlobalPosX(int x, int y)
    {
        return GetGlobalPosXValue(x, y);
    }

    int GetGlobalPosY(int x, int y)
    {
        return GetGlobalPosYValue(x, y);
    }

    int GetTilePosX(int gx, int gy)
    {
        return GetTilePosXValue(gx, gy);
    }

    int GetTilePosY(int gx, int gy)
    {
        return GetTilePosYValue(gx, gy);
    }

    uintptr_t PngImageDecode(const unsigned char *pngData, uint32_t len)
    {
        image *img = (image *)malloc(sizeof(image));
        *img = load_png_bytes(pngData, len);
        return reinterpret_cast<uintptr_t>(img);
    }

    void PngImageDelete(uintptr_t handle)
    {
        image *img = reinterpret_cast<image *>(handle);
        free_png_image(img);
        free(img);
    }

    uintptr_t MapHandlerNew(
        uint32_t width,
        uint32_t height,
        uint32_t color,
        int isCoalMine,
        int shouldBlockOutRooms,
        uintptr_t randomMaterials,
        int worldX,
        int worldY)
    {
        MapHandler *handler = (MapHandler *)malloc(sizeof(MapHandler));
        handler->init(
            width,
            height,
            color,
            isCoalMine != 0,
            shouldBlockOutRooms != 0,
            randomMaterials,
            worldX,
            worldY);
        return reinterpret_cast<uintptr_t>(handler);
    }

    void MapHandlerDelete(uintptr_t handle)
    {
        MapHandler *handler = reinterpret_cast<MapHandler *>(handle);
        handler->destroy();
        free(handler);
    }

    uintptr_t MapHandlerMapPtr(uintptr_t handle)
    {
        return reinterpret_cast<uintptr_t>(reinterpret_cast<MapHandler *>(handle)->map);
    }

    uintptr_t MapHandlerBigMapPtr(uintptr_t handle)
    {
        return reinterpret_cast<uintptr_t>(reinterpret_cast<MapHandler *>(handle)->bigMap);
    }

    void MapHandlerGenerateMap(uintptr_t handle, const unsigned char *pngData, uint32_t len)
    {
        reinterpret_cast<MapHandler *>(handle)->generate_map(pngData, len);
    }

    void MapHandlerToBig(uintptr_t handle)
    {
        reinterpret_cast<MapHandler *>(handle)->toBig();
    }

    void MapHandlerDrawImageData(
        uintptr_t handle,
        uintptr_t imageHandle,
        int gx,
        int gy,
        uintptr_t colorToMaterialTable)
    {
        reinterpret_cast<MapHandler *>(handle)->drawImageData(
            reinterpret_cast<image *>(imageHandle),
            gx,
            gy,
            colorToMaterialTable);
    }

    void GenerateMapRaw(
        unsigned char *rgbaTiles,
        uint32_t color,
        uint32_t tilesWidth,
        uint32_t tilesHeight,
        unsigned char *result,
        uint32_t mapWidth,
        uint32_t mapHeight,
        int isCoalMine,
        int shouldBlockOutRooms,
        uintptr_t randomMaterials,
        int worldX,
        int worldY)
    {
        generate_map_from_rgba_tiles(
            rgbaTiles,
            tilesWidth,
            tilesHeight,
            result,
            mapWidth,
            mapHeight,
            color,
            isCoalMine != 0,
            shouldBlockOutRooms != 0,
            reinterpret_cast<unsigned int *>(randomMaterials),
            worldX - WORLD_OFFSET_X,
            worldY - WORLD_OFFSET_Y);
    }

    void GeneratePathMapRaw(
        unsigned char *map,
        uint32_t mapWidth,
        uint32_t mapHeight,
        unsigned char *result,
        int worldX,
        int worldY)
    {
        generate_path_map(map, mapWidth, mapHeight, result, worldX, worldY);
    }
}
