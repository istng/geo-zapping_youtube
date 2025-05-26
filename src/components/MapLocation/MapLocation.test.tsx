import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect, describe, it, vi, beforeEach } from 'vitest';
import { MapLocation } from './MapLocation';

// Mock leaflet's MapContainer and related hooks for test environment
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: any) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }: any) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }: any) => <div data-testid="popup">{children}</div>,
  useMap: () => ({
    setView: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    invalidateSize: vi.fn(),
  }),
}));


// Silence leaflet icon import
vi.mock('leaflet', async () => {
  const actual = await vi.importActual<any>('leaflet');
  return {
    ...actual,
    icon: vi.fn(() => ({})),
    Marker: { prototype: { options: {} } },
  };
});


describe('MapLocation', () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = undefined;
  });

  it('renders input, search button, and map', () => {
    render(<MapLocation lat={10} lon={20} />);
    expect(screen.getByPlaceholderText('Search for a place...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
    expect(screen.getByTestId('marker')).toBeInTheDocument();
  });

  it('calls onChange when mapCenter changes', () => {
    const onChange = vi.fn();
    render(<MapLocation lat={10} lon={20} onChange={onChange} />);
    // Initial call
    expect(onChange).toHaveBeenCalledWith({ lat: 10, lon: 20 });
  });

  it('shows error if search yields no results', async () => {
    // @ts-ignore
    global.fetch = vi.fn().mockResolvedValue({ json: async () => [] });
    render(<MapLocation lat={10} lon={20} />);
    fireEvent.change(screen.getByPlaceholderText('Search for a place...'), { target: { value: 'Nowhere' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    await waitFor(() => {
      expect(screen.getByText('Location not found')).toBeInTheDocument();
    });
  });

  it('updates mapCenter on successful search', async () => {
    // @ts-ignore
    global.fetch = vi.fn().mockResolvedValue({ json: async () => [{ lat: '50', lon: '60' }] });
    const onChange = vi.fn();
    render(<MapLocation lat={10} lon={20} onChange={onChange} />);
    fireEvent.change(screen.getByPlaceholderText('Search for a place...'), { target: { value: 'Somewhere' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    await waitFor(() => {
      // Should be called with new coordinates
      expect(onChange).toHaveBeenCalledWith({ lat: 50, lon: 60 });
    });
  });

  it('shows error on fetch failure', async () => {
    // @ts-ignore
    global.fetch = vi.fn().mockRejectedValue(new Error('fail'));
    render(<MapLocation lat={10} lon={20} />);
    fireEvent.change(screen.getByPlaceholderText('Search for a place...'), { target: { value: 'ErrorPlace' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    await waitFor(() => {
      expect(screen.getByText('Error searching location')).toBeInTheDocument();
    });
  });
});
