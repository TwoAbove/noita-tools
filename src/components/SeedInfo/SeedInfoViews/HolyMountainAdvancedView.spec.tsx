import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HolyMountainAdvancedView from './HolyMountainAdvancedView';
import { GameInfoProvider } from '../../../services/SeedInfo/infoHandler';
// NoitaRandomItem import removed as loadRandom now provides the instance
import { loadRandom } from '../../../testHelpers'; 

// Mock PerkRow to simplify testing the view itself
jest.mock('./PerkRow', () => ({
  __esModule: true,
  default: () => <div data-testid="perk-row">Mocked PerkRow</div>,
}));

describe('HolyMountainAdvancedView', () => {
  it('renders without crashing and displays mocked PerkRows', async () => { 
    const randoms = await loadRandom(1); // Use seed 1
    // Casting to 'any' for simplicity in mock, as GameInfoProvider is complex
    const mockInfoProvider = new GameInfoProvider({} as any, {} as any, {} as any, randoms); 
    const mockProps = {
      shopData: [{} as any], // Provide minimal shop data for each row
      perkData: [[]], 
      pickedPerksData: [[]],
      perkRerollsData: [0], // Ensure this array matches perkData rows
      worldOffsetData: 0,
      pacifistChestItemsFn: jest.fn(() => []),
      infoProvider: mockInfoProvider,
      lotteriesData: 0,
      favoritesData: { isFavorite: jest.fn(() => false), rerollsToFavorite: 0, favoritesInNextReroll: 0 },
      isSpellFavoriteFn: jest.fn(() => false),
      onReroll: jest.fn(),
      onClickPerk: jest.fn(),
      onOpenShopInfo: jest.fn(),
      onLoadPerkRow: jest.fn(), // Specific to Advanced View
      showAlwaysCastRow: false,
      nextRerollPricesData: new Map(),
    };
    render(<HolyMountainAdvancedView {...mockProps} />);
    // Expect the table or a key part of it to be present
    expect(screen.getByRole('table')).toBeInTheDocument();
    // The number of PerkRows should be 7 - Number(!!mockProps.worldOffsetData)
    const expectedRowCount = 7 - Number(!!mockProps.worldOffsetData);
    expect(screen.getAllByTestId('perk-row').length).toBe(expectedRowCount);
  });
});
