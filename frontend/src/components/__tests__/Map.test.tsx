import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Map from '../Map';

// Mocking Next.js client environment
vi.mock('next/dynamic', () => ({
  default: () => () => <div data-testid="mocked-map">Map</div>
}));

// Mock Leaflet (required to prevent jsdom errors with L.icon)
vi.mock('leaflet', () => {
  return {
    default: {
      icon: vi.fn().mockReturnValue({}),
      divIcon: vi.fn().mockReturnValue({}),
      Marker: {
        prototype: {
          options: {}
        }
      }
    }
  };
});

const mockMap = {
  getBounds: () => ({
    getWest: () => -52, getSouth: () => -31, getEast: () => -50, getNorth: () => -29
  }),
  getZoom: () => 12,
  setView: vi.fn()
};

// Mock react-leaflet components
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: any) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ eventHandlers, children }: any) => (
    <div data-testid="marker" onClick={eventHandlers?.click}>
      {children}
    </div>
  ),
  Popup: ({ children }: any) => <div data-testid="popup">{children}</div>,
  GeoJSON: () => <div data-testid="geojson" />,
  useMapEvents: () => mockMap
}));

const mockRequests: any[] = [
  {
    id: 'req-1',
    title: 'Flood at Main St',
    description: 'Need boat rescue',
    latitude: -30.0346,
    longitude: -51.2177,
    priority: 'CRITICAL',
    status: 'OPEN',
    type: 'RESCUE'
  },
  {
    id: 'req-2',
    title: 'Food needed',
    description: 'No supplies for 3 days',
    latitude: -30.0450,
    longitude: -51.2200,
    priority: 'MODERATE',
    status: 'IN_PROGRESS',
    type: 'SUPPLIES'
  }
];

describe('InteractiveMap Component', () => {
  const globalFetch = global.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock fetch for GeoJSON
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({
        type: 'FeatureCollection',
        features: []
      })
    });
  });

  afterEach(() => {
    global.fetch = globalFetch;
  });

  it('renders loading state initially, then the map container', async () => {
    render(<Map requests={[]} />);
    
    // React's useEffect runs immediately in testing-library unless there's an async boundary,
    // but the component checks `mounted` which is set in a useEffect. 
    // In JSDOM, useEffect fires synchronously after paint. 
    // Wait for the MapContainer to show up.
    await waitFor(() => {
      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });
  });

  it('renders correctly and fetches geojson', async () => {
    render(<Map requests={[]} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });
    
    // Check if fetch was called for the geojson
    expect(global.fetch).toHaveBeenCalledWith('/official-risk-zones.geojson');
  });

  it('renders markers for requests', async () => {
    render(<Map requests={mockRequests} />);
    
    await waitFor(() => {
      // Because we mock useMapEvents to return wide bounds, both points should render
      const markers = screen.getAllByTestId('marker');
      expect(markers.length).toBeGreaterThanOrEqual(2);
    });
    
    // Popups should contain the text from requests
    expect(screen.getByText('Flood at Main St')).toBeInTheDocument();
    expect(screen.getByText('Food needed')).toBeInTheDocument();
  });

  it('triggers onMarkerClick when a marker is clicked', async () => {
    const user = userEvent.setup();
    const handleMarkerClick = vi.fn();
    
    render(<Map requests={mockRequests} onMarkerClick={handleMarkerClick} />);
    
    await waitFor(() => {
      expect(screen.getAllByTestId('marker').length).toBeGreaterThan(0);
    });
    
    // Click the first marker
    const markers = screen.getAllByTestId('marker');
    await user.click(markers[0]);
    
    // Should be called with the first request
    expect(handleMarkerClick).toHaveBeenCalledTimes(1);
    expect(handleMarkerClick).toHaveBeenCalledWith(mockRequests[0]);
  });
});
