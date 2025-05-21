import React, { FC } from 'react';
import { Table } from 'react-bootstrap';
import PerkRow from './PerkRow';
import { IShopItems } from '../../../services/SeedInfo/infoHandler/InfoProviders/Shop';
import { IPerk } from '../../../services/SeedInfo/infoHandler/InfoProviders/Perk';
import { IItem } from '../../../services/SeedInfo/infoHandler/InfoProviders/ChestRandom';
import GameInfoProvider from '../../../services/SeedInfo/infoHandler';

interface IHolyMountainSimpleViewProps {
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
  onRerollUndo: (event: React.MouseEvent<HTMLButtonElement>, level: number) => void;
  onClickPerk: (level: number, perkId: string) => () => void;
  onOpenShopInfo: (level: number) => void;
  showAlwaysCastRow: boolean;
  nextRerollPricesData?: Map<number, number[]>; 
}

const HolyMountainSimpleView: FC<IHolyMountainSimpleViewProps> = props => {
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
    onRerollUndo,
    onClickPerk,
    onOpenShopInfo,
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
                advanced={false}
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
                handleRerollUndo={e => onRerollUndo(e, level)}
                handleReroll={e => onReroll(e, level)}
                handleClickPerk={id => onClickPerk(level, id as string)()}
                pacifistChestItems={pacifistChestItemsFn(level, worldOffsetData)}
                isRerollable={(i, l) =>
                  infoProvider.providers.lottery.provide(level, i, l, worldOffsetData, lotteriesData)
                }
                getAlwaysCast={(i, l) => infoProvider.providers.alwaysCast.provide(level, i, l, worldOffsetData)}
                handleOpenShopInfo={() => onOpenShopInfo(level)}
                handleLoad={() => {}} // No load button in simple view
              />
            );
          })}
      </tbody>
    </Table>
  );
};

export default HolyMountainSimpleView;
