import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';

// Fix default icon issue in Leaflet when using with React
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

function InvalidateSizeOnMount() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100); // Delay to ensure modal is visible
  }, [map]);
  return null;
}

function MoveMapTo({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export function MapLocation({ lat = -34.6089399, lon = -58.3896266, zoom = 13, onChange }: {
  lat?: number;
  lon?: number;
  zoom?: number;
  onChange?: (coords: { lat: number; lon: number }) => void;
}) {
  // Use controlled state from parent, fallback to props for initial value
  const [mapCenter, setMapCenter] = useState<[number, number]>([lat, lon]);
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep mapCenter in sync with props
  useEffect(() => {
    setMapCenter([lat, lon]);
  }, [lat, lon]);

  // Notify parent on change
  useEffect(() => {
    if (onChange) {
      onChange({ lat: mapCenter[0], lon: mapCenter[1] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapCenter]);

  // Geocode search handler
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search) return;
    setSearching(true);
    setError(null);
    try {
      // Use Nominatim OpenStreetMap API for geocoding
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newCenter: [number, number] = [parseFloat(lat), parseFloat(lon)];
        setMapCenter(newCenter);
        // Move the map to the new center
      } else {
        setError('Location not found');
      }
    } catch (err) {
      setError('Error searching location');
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    // This is just to ensure leaflet CSS is loaded if not already
  }, []);

  // Handler for clicking on the map to select a point
  function MapClickHandler() {
    const map = useMap();
    useEffect(() => {
      const handleClick = (e: any) => {
        setMapCenter([e.latlng.lat, e.latlng.lng]);
      };
      map.on('click', handleClick);
      return () => {
        map.off('click', handleClick);
      };
    }, [map]);
    return null;
  }

  return (
    <div style={{ width: '100%' }}>
      <form onSubmit={handleSearch} style={{ marginBottom: 8, display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search for a place..."
          style={{ flex: 1, padding: 4 }}
        />
        <button type="submit" disabled={searching} style={{ padding: '4px 12px' }}>
          {searching ? 'Searching...' : 'Search'}
        </button>
      </form>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: '300px', width: '100%' }}
      >
        <InvalidateSizeOnMount />
        <MoveMapTo center={mapCenter} />
        <MapClickHandler />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={mapCenter}>
          <Popup>
            {search ? `Searched location: ${search}` : 'You are here'}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
