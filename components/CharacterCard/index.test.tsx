import { render, screen, fireEvent } from '@testing-library/react-native';
import React from 'react';

import { CharacterCard } from '.';

// --- Mocks ---
jest.mock('expo-image', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Image: (props: Record<string, unknown>) => React.createElement(View, props),
  };
});

jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock')
);

jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: jest.fn((_props: unknown, colorName: string) => {
    const defaults: Record<string, string> = {
      background: '#FFFFFF',
      text: '#11181C',
      icon: '#687076',
    };
    return defaults[colorName] ?? '#687076';
  }),
}));

const mockToggleFavorite = jest.fn();
jest.mock('@/store/characterStore', () => ({
  useCharacterStore: jest.fn((selector: (state: unknown) => unknown) => {
    const state = {
      favorites: [],
      toggleFavorite: mockToggleFavorite,
    };
    return selector(state);
  }),
}));

// --- Helpers ---
const defaultProps = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive' as const,
  species: 'Human',
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  originName: 'Earth (C-137)',
  index: 0,
};

const renderComponent = (overrides = {}) =>
  render(<CharacterCard {...defaultProps} {...overrides} />);

// --- Tests ---
describe('CharacterCard', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('rendering', () => {
    it('renders the character name', () => {
      renderComponent();
      expect(screen.getByText('Rick Sanchez')).toBeTruthy();
    });

    it('renders the species', () => {
      renderComponent();
      expect(screen.getByText(/Human/)).toBeTruthy();
    });

    it('renders the origin name', () => {
      renderComponent();
      expect(screen.getByText(/Earth \(C-137\)/)).toBeTruthy();
    });

    it('renders the status indicator', () => {
      renderComponent();
      expect(screen.getByText(/Alive/)).toBeTruthy();
    });

    it('has proper accessibility props', () => {
      renderComponent();
      const button = screen.getByRole('button', { name: /Rick Sanchez/ });
      expect(button).toBeTruthy();
      expect(button.props.accessibilityLabel).toContain('Rick Sanchez');
      expect(button.props.accessibilityLabel).toContain('Alive');
    });
  });

  describe('status variants', () => {
    it('renders Dead status', () => {
      renderComponent({ status: 'Dead' });
      expect(screen.getByText(/Dead/)).toBeTruthy();
    });

    it('renders unknown status', () => {
      renderComponent({ status: 'unknown' });
      expect(screen.getByText(/unknown/)).toBeTruthy();
    });
  });

  describe('interactions', () => {
    it('renders the favorite button', () => {
      renderComponent();
      const favButton = screen.getByLabelText('Add to favorites');
      expect(favButton).toBeTruthy();
    });

    it('calls toggleFavorite when heart is pressed', () => {
      renderComponent();
      const favButton = screen.getByLabelText('Add to favorites');
      fireEvent.press(favButton);
      expect(mockToggleFavorite).toHaveBeenCalledWith(1);
    });
  });
});
