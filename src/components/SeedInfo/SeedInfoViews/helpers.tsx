import { useLiveQuery } from "dexie-react-hooks";
import { db, FavoriteType, FavoriteItem } from "../../../services/db";
import { PerkInfoProvider, IPerk } from "../../../services/SeedInfo/infoHandler/InfoProviders/Perk";
import { IShopItems } from "../../../services/SeedInfo/infoHandler/InfoProviders/Shop";
import useLocalStorage from "../../../services/useLocalStorage";

export const useMaterialFavorite = () => {
  const favoriteSpells = (useLiveQuery(() => db.favorites.where({ type: FavoriteType.Material }).toArray(), [], []) as FavoriteItem[]).map(p => p.key);
  return {
    isFavorite: (id: string) => favoriteSpells.includes(id)
  }
}

export const useSpellFavorite = (shop?: IShopItems) => {
  const favoriteSpells = (useLiveQuery(() => db.favorites.where({ type: FavoriteType.Spell }).toArray(), [], []) as FavoriteItem[]).map(p => p.key);
  return {
    isFavorite: (id: string) => favoriteSpells.includes(id)
  }
}

export const useFavoritePerks = (perkInfoProvider: PerkInfoProvider, perkDeck: IPerk[]) => {
  const favoritePerks = (useLiveQuery(() => db.favorites.where({ type: FavoriteType.Perk }).toArray(), [], []) as FavoriteItem[]).map(p => p.key);
	const [rerollsToSearch] = useLocalStorage('favorite-perks-reroll', 2);
  const rerollPos = perkInfoProvider._G.GetValue("TEMPLE_REROLL_PERK_INDEX", perkDeck.length - 1);
  const perksPerReroll = perkInfoProvider._G.GetValue("TEMPLE_PERK_COUNT", 3);

  const perksInRerolls = perkDeck.slice(rerollPos - rerollsToSearch * perksPerReroll + 1, rerollPos + 1).map(p => p?.id).reverse() //
  const b = new Set(perksInRerolls);
  const intersection = new Set(
    favoritePerks.filter(x => b.has(x))
  );


  let rerollsToFavorite: number | undefined = undefined;
  let favoritesInNextReroll = 0;
  if (intersection.size) {
    const rerolls: string[][] = [];
    while (perksInRerolls.length) rerolls.push(perksInRerolls.splice(0, perksPerReroll));
    favoritesInNextReroll = (rerolls[0].filter(r => intersection.has(r))).length;
    RerollsToFavorite:
    for (let i = 0; i < rerolls.length; i++) {
      const r = rerolls[i];
      for (const id of r) {
        if (intersection.has(id)) {
          rerollsToFavorite = i + 1;
          break RerollsToFavorite;
        }
      }
    }
  }

  return {
    rerollsToFavorite,
    favoritesInNextReroll,
    isFavorite: (id: string) => favoritePerks.includes(id)
  }
}
