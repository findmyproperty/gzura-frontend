'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { Building2, Loader2, MapPin, Navigation, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type LocationSelection = {
  location: string;
  latitude: number;
  longitude: number;
  venue?: string;
};

type LocationMapPickerProps = {
  location: string;
  venue?: string;
  latitude?: number | null;
  longitude?: number | null;
  /** Set when the picker is shown (e.g. dialog open) so the map can resize and recenter. */
  visible?: boolean;
  onLocationChange: (value: LocationSelection) => void;
  onVenueChange?: (venue: string) => void;
};

type PlacePrediction = google.maps.places.AutocompletePrediction;

const libraries: ('places' | 'marker')[] = ['places', 'marker'];
const DEFAULT_CENTER = { lat: 12.9716, lng: 77.5946 };
const MAP_STYLE = { width: '100%', height: '260px', borderRadius: '1rem' };
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAP_ID || 'DEMO_MAP_ID';

export default function LocationMapPicker({
  location,
  venue = '',
  latitude,
  longitude,
  visible = true,
  onLocationChange,
  onVenueChange,
}: LocationMapPickerProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const autocompleteServiceRef =
    useRef<google.maps.places.AutocompleteService | null>(null);
  const sessionTokenRef =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const placesHostRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const advancedMarkerRef =
    useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const skipNextSearchRef = useRef(false);

  const initialCenter = useMemo(
    () =>
      latitude != null && longitude != null
        ? { lat: latitude, lng: longitude }
        : DEFAULT_CENTER,
    [latitude, longitude],
  );

  const [searchQuery, setSearchQuery] = useState(location);
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [searching, setSearching] = useState(false);
  const [mapCenter, setMapCenter] = useState(initialCenter);
  const [mapZoom, setMapZoom] = useState(
    latitude != null && longitude != null ? 15 : 11,
  );
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(
    latitude != null && longitude != null
      ? { lat: latitude, lng: longitude }
      : null,
  );
  const [resolving, setResolving] = useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'gzura-google-maps',
    googleMapsApiKey: apiKey,
    libraries,
  });

  const syncMarker = useCallback(
    async (position: google.maps.LatLngLiteral | null, title?: string) => {
      const map = mapRef.current;
      if (!map || !isLoaded) return;

      if (!position) {
        if (advancedMarkerRef.current) {
          advancedMarkerRef.current.map = null;
        }
        return;
      }

      const { AdvancedMarkerElement, PinElement } =
        (await google.maps.importLibrary('marker')) as google.maps.MarkerLibrary;

      if (!advancedMarkerRef.current) {
        const pin = new PinElement({
          background: '#EA4335',
          borderColor: '#B31412',
          glyphColor: '#FFFFFF',
          scale: 1.25,
        });
        advancedMarkerRef.current = new AdvancedMarkerElement({
          map,
          position,
          content: pin.element,
          title: title || 'Event location',
        });
      } else {
        advancedMarkerRef.current.position = position;
        advancedMarkerRef.current.map = map;
        if (title) {
          advancedMarkerRef.current.title = title;
        }
      }
    },
    [isLoaded],
  );

  const focusMapOn = useCallback(
    (
      position: google.maps.LatLngLiteral,
      zoom = 15,
      viewport?: google.maps.LatLngBounds,
      title?: string,
    ) => {
      setMarkerPosition(position);
      setMapCenter(position);
      setMapZoom(zoom);

      const apply = () => {
        const map = mapRef.current;
        if (!map) return;

        google.maps.event.trigger(map, 'resize');
        if (viewport) {
          map.fitBounds(viewport);
        } else {
          map.setCenter(position);
          map.setZoom(zoom);
        }
        void syncMarker(position, title);
      };

      apply();
      requestAnimationFrame(apply);
      window.setTimeout(apply, 150);
    },
    [syncMarker],
  );

  useEffect(() => {
    if (!isLoaded) return;

    if (!geocoderRef.current) {
      geocoderRef.current = new google.maps.Geocoder();
    }
    if (!autocompleteServiceRef.current) {
      autocompleteServiceRef.current = new google.maps.places.AutocompleteService();
    }
    if (!sessionTokenRef.current) {
      sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
    }
    if (!placesServiceRef.current && placesHostRef.current) {
      placesServiceRef.current = new google.maps.places.PlacesService(
        placesHostRef.current,
      );
    }
  }, [isLoaded]);

  useEffect(() => {
    skipNextSearchRef.current = true;
    setSearchQuery(location);
  }, [location]);

  useEffect(() => {
    if (latitude == null || longitude == null) return;
    focusMapOn({ lat: latitude, lng: longitude }, 15, undefined, venue);
  }, [latitude, longitude, venue, focusMapOn]);

  useEffect(() => {
    if (!visible || !mapRef.current) return;

    const timer = window.setTimeout(() => {
      const map = mapRef.current;
      if (!map) return;

      google.maps.event.trigger(map, 'resize');
      if (markerPosition) {
        map.setCenter(markerPosition);
        map.setZoom(mapZoom);
        void syncMarker(markerPosition, venue || 'Event location');
      }
    }, 200);

    return () => window.clearTimeout(timer);
  }, [visible, markerPosition, mapZoom, venue, syncMarker]);

  useEffect(() => {
    return () => {
      if (advancedMarkerRef.current) {
        advancedMarkerRef.current.map = null;
        advancedMarkerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowPredictions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const applySelection = useCallback(
    (
      selection: LocationSelection,
      viewport?: google.maps.LatLngBounds,
    ) => {
      const position = { lat: selection.latitude, lng: selection.longitude };
      skipNextSearchRef.current = true;
      setSearchQuery(selection.location);
      setPredictions([]);
      setShowPredictions(false);
      focusMapOn(position, 15, viewport, selection.venue);
      onLocationChange(selection);
    },
    [focusMapOn, onLocationChange],
  );

  const reverseGeocode = useCallback(
    async (position: google.maps.LatLngLiteral) => {
      if (!geocoderRef.current) return;

      setResolving(true);
      try {
        const response = await geocoderRef.current.geocode({ location: position });
        const result = response.results[0];
        const displayName = result?.formatted_address || location;
        const venueName =
          result?.address_components?.find((component) =>
            component.types.includes('establishment'),
          )?.long_name ||
          result?.address_components?.find((component) =>
            component.types.includes('point_of_interest'),
          )?.long_name ||
          venue;

        applySelection({
          location: displayName,
          latitude: position.lat,
          longitude: position.lng,
          venue: venueName || venue,
        });
      } finally {
        setResolving(false);
      }
    },
    [applySelection, location, venue],
  );

  const fetchPredictions = useCallback((query: string) => {
    if (!autocompleteServiceRef.current || !query.trim()) {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    setSearching(true);
    autocompleteServiceRef.current.getPlacePredictions(
      {
        input: query,
        componentRestrictions: { country: 'in' },
        sessionToken: sessionTokenRef.current ?? undefined,
      },
      (nextPredictions, status) => {
        setSearching(false);
        if (
          status !== google.maps.places.PlacesServiceStatus.OK ||
          !nextPredictions?.length
        ) {
          setPredictions([]);
          setShowPredictions(false);
          return;
        }

        setPredictions(nextPredictions);
        setShowPredictions(true);
      },
    );
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false;
      return;
    }

    const timer = window.setTimeout(() => {
      fetchPredictions(searchQuery);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [searchQuery, isLoaded, fetchPredictions]);

  const selectPrediction = (prediction: PlacePrediction) => {
    if (!placesServiceRef.current) return;

    setSearching(true);
    placesServiceRef.current.getDetails(
      {
        placeId: prediction.place_id,
        fields: ['formatted_address', 'geometry', 'name', 'address_components'],
        sessionToken: sessionTokenRef.current ?? undefined,
      },
      (place, status) => {
        setSearching(false);
        sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();

        if (status !== google.maps.places.PlacesServiceStatus.OK || !place?.geometry?.location) {
          return;
        }

        const position = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };

        applySelection(
          {
            location: place.formatted_address || prediction.description,
            latitude: position.lat,
            longitude: position.lng,
            venue: place.name || prediction.structured_formatting.main_text || venue,
          },
          place.geometry.viewport ?? undefined,
        );
      },
    );
  };

  const onMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      const lat = event.latLng?.lat();
      const lng = event.latLng?.lng();
      if (lat == null || lng == null) return;
      void reverseGeocode({ lat, lng });
    },
    [reverseGeocode],
  );

  if (!apiKey) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Add <code className="font-mono">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to your
        frontend <code className="font-mono">.env</code> file to enable Google Maps.
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Google Maps failed to load. Check that Maps JavaScript API and Places API are
        enabled for your API key.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/50 to-white text-sm text-purple-deep/70">
        <Loader2 className="mr-2 h-5 w-5 animate-spin text-purple-deep" />
        Loading map…
      </div>
    );
  }

  const hasPin = markerPosition != null && location.trim().length > 0;

  return (
    <div className="space-y-4">
      <div ref={placesHostRef} className="hidden" aria-hidden />

      <div className="space-y-2" ref={searchContainerRef}>
        <div className="flex items-center justify-between gap-2">
          <Label className="text-purple-deep/80">Search location</Label>
          {hasPin ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-200/80">
              <Navigation className="h-3 w-3" />
              Pinned
            </span>
          ) : null}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
          <div className="relative min-w-0 flex-1">
            <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-300" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (predictions.length > 0) setShowPredictions(true);
              }}
              placeholder="Search business, address, or landmark"
              className="h-11 border-purple-100 bg-white pl-10 shadow-sm transition-all focus-visible:border-purple-300 focus-visible:ring-purple-deep/15"
            />
            {showPredictions && predictions.length > 0 ? (
              <div className="absolute z-[200] mt-2 w-full overflow-hidden rounded-xl border border-purple-100 bg-white shadow-xl shadow-purple-500/10 max-h-56 overflow-y-auto">
                {predictions.map((prediction) => (
                  <button
                    key={prediction.place_id}
                    type="button"
                    className="group w-full border-b border-purple-50 text-left px-3.5 py-3 text-sm transition-colors last:border-b-0 hover:bg-purple-50/80"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => selectPrediction(prediction)}
                  >
                    <span className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-deep/5 text-purple-deep transition-colors group-hover:bg-purple-deep/10">
                        <MapPin className="h-3.5 w-3.5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-gray-900">
                          {prediction.structured_formatting.main_text}
                        </span>
                        <span className="block truncate text-xs text-gray-500">
                          {prediction.structured_formatting.secondary_text}
                        </span>
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <Button
            type="button"
            onClick={() => fetchPredictions(searchQuery)}
            disabled={searching}
            className="h-11 w-full shrink-0 bg-gradient-to-r from-purple-deep to-purple-700 px-4 text-white shadow-md shadow-purple-500/20 hover:from-purple-800 hover:to-purple-900 sm:w-auto"
          >
            {searching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl ring-2 ring-purple-100/80 shadow-inner shadow-purple-900/5">
        {resolving ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/75 backdrop-blur-[2px]">
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-lg ring-1 ring-purple-100">
              <Loader2 className="h-4 w-4 animate-spin text-purple-deep" />
              <span className="text-xs font-medium text-purple-deep">Placing pin…</span>
            </div>
          </div>
        ) : null}
        <GoogleMap
          mapContainerStyle={MAP_STYLE}
          center={mapCenter}
          zoom={mapZoom}
          onLoad={(map) => {
            mapRef.current = map;
            if (markerPosition) {
              google.maps.event.trigger(map, 'resize');
              map.setCenter(markerPosition);
              map.setZoom(mapZoom);
              void syncMarker(markerPosition, venue || 'Event location');
            }
          }}
          onClick={onMapClick}
          options={{
            mapId: MAP_ID,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-purple-deep/25 to-transparent px-4 py-3">
          <p className="flex items-center gap-1.5 text-[11px] font-medium text-white drop-shadow-sm">
            <MapPin className="h-3.5 w-3.5 text-gold-300" />
            Tap the map or pick a search result to drop your pin
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-purple-100/80 bg-white/80 p-3 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-deep/10">
              <MapPin className="h-3.5 w-3.5 text-purple-deep" />
            </div>
            <Label className="text-xs font-semibold uppercase tracking-wide text-purple-deep/70">
              Location
            </Label>
          </div>
          <Input
            value={location}
            readOnly
            placeholder="Select on map"
            className="border-transparent bg-purple-50/50 text-sm text-gray-800 shadow-none focus-visible:ring-0"
            required
          />
        </div>
        <div className="rounded-xl border border-purple-100/80 bg-white/80 p-3 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gold-400/15">
              <Building2 className="h-3.5 w-3.5 text-gold-600" />
            </div>
            <Label className="text-xs font-semibold uppercase tracking-wide text-purple-deep/70">
              Venue
            </Label>
          </div>
          <Input
            value={venue}
            onChange={(e) => onVenueChange?.(e.target.value)}
            placeholder="Venue name"
            className="border-purple-100 bg-white text-sm shadow-none focus-visible:border-purple-300 focus-visible:ring-purple-deep/15"
          />
        </div>
      </div>
    </div>
  );
}