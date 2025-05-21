import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HolyMountainSimpleView from './HolyMountainSimpleView';
import { GameInfoProvider } from '../../../services/SeedInfo/infoHandler';
import NoitaRandomItem from '../../../services/SeedInfo/random'; // Corrected import path

// Mock PerkRow to simplify testing the view itself
jest.mock('./PerkRow', () => ({
  __esModule: true,
  default: () => <div data-testid="perk-row">Mocked PerkRow</div>,
}));

describe('HolyMountainSimpleView', () => {
  it('renders without crashing and displays mocked PerkRows', () => {
    // Casting to 'any' for simplicity in mock, as GameInfoProvider is complex
    const mockInfoProvider = new GameInfoProvider({} as any, {} as any, {} as any, new NoitaRandomItem(1)); 
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
      onRerollUndo: jest.fn(),
      onClickPerk: jest.fn(),
      onOpenShopInfo: jest.fn(),
      showAlwaysCastRow: false,
      nextRerollPricesData: new Map(),
    };
    render(<HolyMountainSimpleView {...mockProps} />);
    // Expect the table or a key part of it to be present
    expect(screen.getByRole('table')).toBeInTheDocument();
    // Check if mocked PerkRow is rendered (at least one, due to loop structure)
    // The loop runs 7 - Number(!!worldOffsetData) times. For worldOffsetData=0, it's 7 times.
    // If perkData has only one row, it will try to access perkData[level] which might be undefined for level > 0
    // Let's ensure perkData has enough rows for the loop or adjust loop for test
    // For this test, Array(7).fill([]) for perkData if we want 7 rows.
    // Or, more simply, since perkData[level] || [] is used, it won't crash.
    // The number of PerkRows should be 7 - Number(!!mockProps.worldOffsetData)
    const expectedRowCount = 7 - Number(!!mockProps.worldOffsetData);
    expect(screen.getAllByTestId('perk-row').length).toBe(expectedRowCount);
  });
});
