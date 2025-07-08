import React, { FC } from 'react';
import { Stack } from "react-bootstrap";
import classNames from "classnames";

import { IPerk } from "../../../services/SeedInfo/infoHandler/InfoProviders/Perk";
import { IShopItems } from "../../../services/SeedInfo/infoHandler/InfoProviders/Shop";
import { IItem } from "../../../services/SeedInfo/infoHandler/InfoProviders/ChestRandom";
import GameInfoProvider from "../../../services/SeedInfo/infoHandler";
import Perk from "../../Icons/Perk";
// Entity is used by PacifistChest, which is now imported
// import Entity from "../../Icons/Entity"; 
import PacifistChest from './PacifistChest';
import ShopComponent from './ShopComponent';
import RerollPane from './RerollPane'; // RerollPane was already refactored

// Temporary stubs for Shop and PacifistChest are removed.
// RerollPane placeholder was already removed in a previous step implicitly when it was refactored.
// const RerollPane: FC<any> = () => <div>RerollPane Placeholder</div>;


const perkWidth = "3rem";
const gamblePerkDiff = "-0.8rem";

interface IPerkRowProps {
  pickedPerks: string[];
  perkRerolls: number;
  nextRerollPrices: number; // Consider if this is still needed or comes from RerollPane context
  shop: IShopItems;
  perks: IPerk[];
  advanced: boolean;
  rerollsToFavorite?: number;
  favoritesInNextReroll?: number;
  showAllAlwaysCast?: boolean;
  infoProvider: GameInfoProvider; // This might be a large dependency to pass. Consider context.
  pacifistChestItems: IItem[];

  handleReroll: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleRerollUndo?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleClickPerk: (pos: number | string) => void;
  isRerollable: (i: number, perks: number) => boolean;
  handleOpenShopInfo: () => void;
  handleLoad: () => void; // Specific to advanced view?
  isPerkFavorite: (id: string) => boolean;
  isSpellFavorite: (id: string) => boolean;
  getAlwaysCast: (i: number, perks: number) => string;

  // Props that might come from a new RerollPane component later
  // rerollsForLevel: number; // This was part of RerollPane in original code
}
const PerkRow: FC<IPerkRowProps> = props => {
  const {
    pacifistChestItems,
    rerollsToFavorite,
    favoritesInNextReroll,
    advanced,
    pickedPerks,
    perkRerolls, // Used for RerollPane rerollsForLevel
    nextRerollPrices, // Used for RerollPane nextRerollPrices
    shop,
    perks,
    showAllAlwaysCast,
    infoProvider, // Used for getAlwaysCast, potentially others indirectly
    handleReroll, // Passed to RerollPane
    handleRerollUndo, // Passed to RerollPane
    handleClickPerk,
    isRerollable,
    getAlwaysCast,
    handleOpenShopInfo,
    handleLoad, // Passed to RerollPane
    isPerkFavorite,
    isSpellFavorite,
  } = props;
  const numberOfGambles = pickedPerks?.filter(p => p === "GAMBLE").length;
  const type = shop.type; // Used for Shop
  const rerollsForLevel = perkRerolls ? perkRerolls : 0; // For RerollPane
  const perksToShow = (numberOfGambles > 0 ? perks?.slice(0, -2 * numberOfGambles) : perks) || [];
  const gamblePerks = perks?.slice(-2 * numberOfGambles) || [];
  const spellIds: string[] =
    shop.type === "wand" // Assuming IShopType.wand is 'wand'
      ? shop.items.flatMap(i => [i.cards.permanentCard, ...i.cards.cards].filter(Boolean) as string[])
      : shop.items.map(i => i.spell.id);
  const favoriteSpells = spellIds.filter(id => isSpellFavorite(id)); // For Shop

  const rowHasAlwaysCast = perks.find(p => p.id === "ALWAYS_CAST");

  return (
    <tr>
      <td>
        <ShopComponent type={type} handleOpenShopInfo={handleOpenShopInfo} favoriteSpells={favoriteSpells} />
      </td>
      <td style={{ height: "4rem" }} className="d-flex align-content-center justify-content-around align-items-center">
        <PacifistChest items={pacifistChestItems} />
      </td>
      <td className="w-100">
        <Stack direction="horizontal" className="justify-content-center" gap={3}>
          {perksToShow &&
            perksToShow.map((perk, i) => {
              const rerollable = isRerollable(i, perksToShow.length);
              const alwaysCast =
                perk.id === "ALWAYS_CAST" || (rowHasAlwaysCast && showAllAlwaysCast)
                  ? getAlwaysCast(i, perksToShow.length)
                  : undefined;
              const fav = isPerkFavorite(perk.id);
              return (
                <Perk
                  className={classNames(fav && "border border-info border-3")}
                  highlight={fav}
                  rerollable={rerollable}
                  key={perk.ui_name + i}
                  onClick={() => handleClickPerk(advanced ? i : perk.id)}
                  clicked={!advanced ? pickedPerks?.includes(perk.id) : pickedPerks && !!pickedPerks[i]}
                  perk={perk}
                  alwaysCast={alwaysCast}
                />
              );
            })}
          {!!numberOfGambles &&
            new Array(numberOfGambles).fill("").map((_, i) => {
              return (
                <div key={i} className="d-flex ms-4 position-relative" style={{ width: "2rem" }}>
                  {/* Hard coded to make it more pretty */}
                  <div
                    className="position-absolute top-0 start-0 translate-middle"
                    style={{
                      marginRight: "-1rem",
                      marginTop: "-0.25rem",
                      zIndex: 1,
                    }}
                  >
                    <Perk
                      width={`calc(${perkWidth} + ${gamblePerkDiff})`}
                      key={gamblePerks[i * 2].ui_name}
                      perk={gamblePerks[i * 2]}
                    />
                  </div>
                  <div className="position-absolute top-50 start-100 translate-middle" style={{ marginTop: "0.25rem" }}>
                    <Perk
                      width={`calc(${perkWidth} + ${gamblePerkDiff})`}
                      key={gamblePerks[i * 2 + 1].ui_name}
                      perk={gamblePerks[i * 2 + 1]}
                    />
                  </div>
                </div>
              );
            })}
        </Stack>
      </td>
      <td>
        {/* Assuming RerollPane component will be imported or defined elsewhere */}
        <RerollPane
          rerollsToFavorite={rerollsToFavorite}
          favoritesInNextReroll={favoritesInNextReroll}
          handleReroll={handleReroll}
          handleRerollUndo={handleRerollUndo}
          loaded={!!perks?.length}
          advanced={advanced}
          rerollsForLevel={rerollsForLevel} // Was perkRerolls
          nextRerollPrices={nextRerollPrices} // This is the prop for RerollPane
          handleLoad={handleLoad}
        />
      </td>
    </tr>
  );
};

export default PerkRow;
export type { IPerkRowProps };
