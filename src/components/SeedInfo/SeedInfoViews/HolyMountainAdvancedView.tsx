import React, { FC } from 'react';
import { Table } from 'react-bootstrap';
import PerkRow from './PerkRow';
import { IShopItems } from '../../../services/SeedInfo/infoHandler/InfoProviders/Shop';
import { IPerk } from '../../../services/SeedInfo/infoHandler/InfoProviders/Perk';
import { IItem } from '../../../services/SeedInfo/infoHandler/InfoProviders/ChestRandom';
import GameInfoProvider from '../../../services/SeedInfo/infoHandler';

interface IHolyMountainAdvancedViewProps {
  shopData: IShopItems[];
  perkData: IPerk[][];
  pickedPerksData: string[][];
  perkRerollsData: number[];
  worldOffsetData: number;
  pacifistChestItemsFn: (level: number, worldOffset: number) => IItem[];
  infoProvider: GameInfoProvider;
  lotteriesData: number;
  favoritesData: {
    rerollsToFavorite?: number;
    favoritesInNextReroll?: number;
    isFavorite: (id: string) => boolean;
  };
  isSpellFavoriteFn: (id: string) => boolean;
  onReroll: (event: React.MouseEvent<HTMLButtonElement>, level: number) => void;
  onClickPerk: (level: number, perkIndex: number) => () => void;
  onOpenShopInfo: (level: number) => void;
  onLoadPerkRow: (level: number) => void;
  showAlwaysCastRow: boolean;
  nextRerollPricesData?: Map<number, number[]>;
}

const HolyMountainAdvancedView: FC<IHolyMountainAdvancedViewProps> = props => {
  const {
    shopData,
    perkData,
    pickedPerksData,
    perkRerollsData,
    worldOffsetData,
    pacifistChestItemsFn,
    infoProvider,
    lotteriesData,
    favoritesData,
    isSpellFavoriteFn,
    onReroll,
    onClickPerk,
    onOpenShopInfo,
    onLoadPerkRow,
    showAlwaysCastRow,
    nextRerollPricesData,
  } = props;

  return (
    <Table borderless responsive="xs" size="sm">
      <thead className="text-center text-nowrap">
        <tr>
          <th>Shop</th>
          <th>Pacifist Chest</th>
          <th>Perks</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {Array(7 - Number(!!worldOffsetData))
          .fill("")
          .map((_, level) => {
            const rowPerks = perkData[level] || [];
            return (
              <PerkRow
                key={`${worldOffsetData}-${level}`}
                advanced={true}
                pickedPerks={pickedPerksData[level]}
                perkRerolls={perkRerollsData[level]}
                perks={rowPerks}
                shop={shopData[level]}
                rerollsToFavorite={favoritesData.rerollsToFavorite}
                favoritesInNextReroll={favoritesData.favoritesInNextReroll}
                nextRerollPrices={nextRerollPricesData?.get(worldOffsetData)?.[level]}
                isPerkFavorite={favoritesData.isFavorite}
                showAllAlwaysCast={showAlwaysCastRow}
                infoProvider={infoProvider}
                isSpellFavorite={isSpellFavoriteFn}
                // handleRerollUndo is not used in advanced view
                handleReroll={e => onReroll(e, level)}
                handleClickPerk={pos => onClickPerk(level, pos as number)()}
                pacifistChestItems={pacifistChestItemsFn(level, worldOffsetData)}
                isRerollable={(i, l) =>
                  infoProvider.providers.lottery.provide(level, i, l, worldOffsetData, lotteriesData)
                }
                getAlwaysCast={(i, l) => infoProvider.providers.alwaysCast.provide(level, i, l, worldOffsetData)}
                handleOpenShopInfo={() => onOpenShopInfo(level)}
                handleLoad={() => onLoadPerkRow(level)}
              />
            );
          })}
      </tbody>
    </Table>
  );
};

export default HolyMountainAdvancedView;
