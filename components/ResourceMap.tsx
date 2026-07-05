"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl, { type Map as MapboxMap, type Marker, type Popup } from "mapbox-gl";
import {
  Crosshair,
  Filter,
  LocateFixed,
  Minus,
  Navigation,
  Plus,
  RotateCcw,
  ShieldCheck,
  View,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { localizedOption, localizedResource, type LanguageCode } from "@/lib/i18n";
import {
  type AgeGroupFilter,
  type CityFilter,
  type CostFilter,
  type LanguageFilter,
  type Resource,
  type ServiceTypeFilter,
  ageGroupOptions,
  cityOptions,
  costOptions,
  languageOptions,
  resources,
  serviceTypeOptions,
} from "@/lib/resources";

const center = { lat: 33.7743, lng: -117.9406 };
const initialZoom = 12;
const minZoom = 10;
const maxZoom = 17;
const resourceSourceId = "cau-noi-resources";
const citySourceId = "cau-noi-city-labels";
const terrainSourceId = "mapbox-dem";
const buildingsLayerId = "cau-noi-3d-buildings";

type MapMode = "explore" | "satellite";
type ViewMode = "2d" | "3d";

const cityLabels = [
  { name: "Fullerton", coordinates: [-117.9243, 33.8704] },
  { name: "La Mirada", coordinates: [-118.0107, 33.9172] },
  { name: "Buena Park", coordinates: [-117.9981, 33.8675] },
  { name: "Anaheim", coordinates: [-117.9145, 33.8366] },
  { name: "Garden Grove", coordinates: [-117.9414, 33.7739] },
  { name: "Santa Ana", coordinates: [-117.8677, 33.7455] },
  { name: "Westminster", coordinates: [-117.9931, 33.7592] },
  { name: "Fountain Valley", coordinates: [-117.9537, 33.7092] },
];

export function ResourceMap() {
  const { language, t } = useLanguage();
  const text = {
    filters: t("map.filters"),
    reset: t("common.reset"),
    language: t("resourceFinder.language"),
    insurance: t("map.insurance"),
    age: t("map.age"),
    service: t("map.service"),
    city: t("map.city"),
    explore: t("map.explore"),
    satellite: t("map.satellite"),
    view2d: t("map.view2d"),
    view3d: t("map.view3d"),
    mapTitle: t("map.mapTitle"),
    fallback: t("map.fallback"),
    satelliteUnavailable: t("map.satelliteUnavailable"),
    threeDUnavailable: t("map.threeDUnavailable"),
    note: t("map.note"),
    selected: t("map.selected"),
    noMatch: t("map.noMatch"),
    access: t("map.access"),
    phone: t("resourceFinder.phone"),
    languages: t("resourceFinder.languages"),
    zoomIn: t("map.zoomIn"),
    zoomOut: t("map.zoomOut"),
    resetCamera: t("map.resetCamera"),
    useArea: t("map.useArea"),
    flyToResource: t("map.flyToResource"),
    distance: t("map.distance"),
    cta: t("map.cta"),
    websiteComingSoon: t("common.websiteComingSoon"),
    urgent: t("map.urgent"),
  };
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const markerRef = useRef<Marker[]>([]);
  const popupRef = useRef<Popup | null>(null);
  const userMarkerRef = useRef<Marker | null>(null);
  const styleFallbackRef = useRef(false);
  const requestedModeRef = useRef<MapMode>("explore");
  const filteredRef = useRef<Resource[]>(resources);
  const viewModeRef = useRef<ViewMode>("2d");
  const [mode, setMode] = useState<MapMode>("explore");
  const [viewMode, setViewMode] = useState<ViewMode>("2d");
  const [mapMessage, setMapMessage] = useState("");
  const [supports3d] = useState(() => !shouldFallbackTo2d());
  const [languageFilter, setLanguageFilter] = useState<LanguageFilter>("All languages");
  const [costFilter, setCostFilter] = useState<CostFilter>("All costs");
  const [ageFilter, setAgeFilter] = useState<AgeGroupFilter>("All age groups");
  const [serviceFilter, setServiceFilter] = useState<ServiceTypeFilter>("All service types");
  const [cityFilter, setCityFilter] = useState<CityFilter>("All cities");
  const [selectedName, setSelectedName] = useState(resources[0].name);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const filtered = useMemo(
    () =>
      resources.filter((resource) => {
        const languageMatch = languageFilter === "All languages" || resource.languages.includes(languageFilter);
        const costMatch = costFilter === "All costs" || resource.costTypes.includes(costFilter);
        const ageMatch = ageFilter === "All age groups" || resource.ageGroups.includes(ageFilter) || resource.ageGroups.includes("All ages");
        const serviceMatch = serviceFilter === "All service types" || resource.serviceType === serviceFilter;
        const cityMatch = cityFilter === "All cities" || resource.city === cityFilter;
        return languageMatch && costMatch && ageMatch && serviceMatch && cityMatch;
      }),
    [ageFilter, cityFilter, costFilter, languageFilter, serviceFilter],
  );

  const selected = filtered.find((resource) => resource.name === selectedName) ?? filtered[0] ?? null;
  const popupResource = selectedResource && filtered.some((resource) => resource.name === selectedResource.name) ? selectedResource : null;
  const localizedSelected = selected ? localizedResource(language, selected) : null;

  const syncMarkers = () => {
    const map = mapRef.current;
    if (!map) return;
    const currentResources = filteredRef.current;

    if (viewModeRef.current === "3d") {
      markerRef.current.forEach((marker) => marker.remove());
      markerRef.current = [];
      syncClusteredResources(map, currentResources);
      return;
    }

    removeClusteredResources(map);

    markerRef.current.forEach((marker) => marker.remove());
    markerRef.current = currentResources.map((resource) => {
      const markerEl = document.createElement("button");
      markerEl.type = "button";
      markerEl.className = `group grid size-9 place-items-center rounded-full border-2 text-white shadow-lg shadow-black/25 transition hover:border-white hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40 ${
        isUrgent(resource) ? "border-rose-100 bg-rose-500" : "border-teal-100 bg-teal-500"
      }`;
      markerEl.setAttribute("aria-label", resource.name);
      markerEl.innerHTML = `<span class="size-3 rounded-full bg-white shadow-sm"></span>`;
      markerEl.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        setSelectedName(resource.name);
        setSelectedResource(resource);
      });

      return new mapboxgl.Marker({ element: markerEl, anchor: "center" })
        .setLngLat([resource.coordinates.lng, resource.coordinates.lat])
        .addTo(map);
    });
  };

  const applyMapView = (nextViewMode: ViewMode, animate = true) => {
    const map = mapRef.current;
    if (!map) return;

    if (nextViewMode === "3d") {
      add3dEnhancements(map);
      syncClusteredResources(map, filteredRef.current);
      map.easeTo({
        center: map.getCenter(),
        zoom: Math.max(map.getZoom(), 12.5),
        pitch: 56,
        bearing: -24,
        duration: animate ? 950 : 0,
      });
      return;
    }

    markerRef.current.forEach((marker) => marker.remove());
    markerRef.current = [];
    removeClusteredResources(map);
    remove3dEnhancements(map);
    map.easeTo({
      center: map.getCenter(),
      pitch: 0,
      bearing: 0,
      duration: animate ? 800 : 0,
    });
    syncMarkers();
  };

  const setRequestedViewMode = (nextViewMode: ViewMode) => {
    if (nextViewMode === "3d" && !supports3d) {
      setMapMessage("3d-unavailable");
      setViewMode("2d");
      return;
    }

    setMapMessage("");
    setViewMode(nextViewMode);
  };

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: getMapStyle("explore"),
      center: [center.lng, center.lat],
      zoom: initialZoom,
      minZoom,
      maxZoom,
      pitch: 0,
      bearing: 0,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right");
    map.on("click", (event) => {
      if (viewModeRef.current === "3d" && map.getLayer("resource-clusters")) {
        const features = map.queryRenderedFeatures(event.point, {
          layers: ["resource-clusters", "resource-unclustered", "resource-unclustered-inner"],
        });
        const feature = features[0];
        const featureProperties = feature ? (feature as { properties?: { cluster_id?: number; name?: string } }).properties : undefined;
        const featureGeometry = feature ? (feature as { geometry?: { coordinates?: [number, number] } }).geometry : undefined;

        if (feature?.layer?.id === "resource-clusters") {
          const source = map.getSource(resourceSourceId) as mapboxgl.GeoJSONSource | undefined;
          const clusterId = featureProperties?.cluster_id;
          const coordinates = featureGeometry?.coordinates;
          if (!coordinates || clusterId === undefined) return;
          source?.getClusterExpansionZoom(clusterId, (error, zoom) => {
            if (error || zoom == null) return;
            map.easeTo({ center: coordinates, zoom, pitch: 56, bearing: -24, duration: 850 });
          });
          return;
        }

        if (featureProperties?.name) {
          const resource = filteredRef.current.find((item) => item.name === featureProperties.name);
          if (resource) {
            setSelectedName(resource.name);
            setSelectedResource(resource);
            flyToResource(resource);
            return;
          }
        }
      }

      setSelectedResource(null);
    });
    map.on("mousemove", (event) => {
      if (viewModeRef.current !== "3d" || !map.getLayer("resource-clusters")) return;
      const features = map.queryRenderedFeatures(event.point, {
        layers: ["resource-clusters", "resource-unclustered", "resource-unclustered-inner"],
      });
      map.getCanvas().style.cursor = features.length > 0 ? "pointer" : "";
    });
    map.on("style.load", () => {
      styleFallbackRef.current = false;
      setMapMessage("");
      applyMapView(viewModeRef.current, false);
      syncMarkers();
    });
    map.on("error", () => {
      if (requestedModeRef.current === "satellite" && !styleFallbackRef.current) {
        styleFallbackRef.current = true;
        setMapMessage("satellite-unavailable");
        setMode("explore");
        map.setStyle(getMapStyle("explore"));
      }
    });
    mapRef.current = map;

    return () => {
      markerRef.current.forEach((marker) => marker.remove());
      popupRef.current?.remove();
      userMarkerRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
    // Initialize Mapbox once. Mode changes are handled by setStyle in a separate effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapboxToken]);

  useEffect(() => {
    if (!mapRef.current || !mapboxToken) return;
    requestedModeRef.current = mode;
    mapRef.current.setStyle(getMapStyle(mode));
  }, [mapboxToken, mode]);

  useEffect(() => {
    filteredRef.current = filtered;
  }, [filtered]);

  useEffect(() => {
    viewModeRef.current = viewMode;
    applyMapView(viewMode);
    // View changes are applied directly to the Mapbox instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode]);

  useEffect(() => {
    syncMarkers();
    // Markers live in HTML overlay state and are intentionally re-synced after filters/style changes.
  }, [filtered]);

  useEffect(() => {
    const map = mapRef.current;
    popupRef.current?.remove();
    popupRef.current = null;

    if (!map || !popupResource) return;

    const popup = new mapboxgl.Popup({
      offset: 20,
      closeButton: true,
      closeOnClick: false,
      className: "resource-map-popup",
      maxWidth: "340px",
    })
      .setLngLat([popupResource.coordinates.lng, popupResource.coordinates.lat])
      .setDOMContent(createResourcePopup(popupResource, language))
      .addTo(map);

    let isCleaningUp = false;
    popup.on("close", () => {
      if (isCleaningUp) return;
      popupRef.current = null;
      setSelectedResource(null);
    });
    popupRef.current = popup;

    return () => {
      isCleaningUp = true;
      popup.remove();
      if (popupRef.current === popup) {
        popupRef.current = null;
      }
    };
  }, [language, popupResource]);

  const resetFilters = () => {
    setLanguageFilter("All languages");
    setCostFilter("All costs");
    setAgeFilter("All age groups");
    setServiceFilter("All service types");
    setCityFilter("All cities");
  };

  const resetView = () => {
    mapRef.current?.flyTo({
      center: [center.lng, center.lat],
      zoom: initialZoom,
      pitch: viewModeRef.current === "3d" ? 56 : 0,
      bearing: viewModeRef.current === "3d" ? -24 : 0,
      duration: 900,
    });
  };

  function flyToResource(resource: Resource) {
    mapRef.current?.flyTo({
      center: [resource.coordinates.lng, resource.coordinates.lat],
      zoom: viewModeRef.current === "3d" ? 15.2 : 13.8,
      pitch: viewModeRef.current === "3d" ? 56 : 0,
      bearing: viewModeRef.current === "3d" ? -24 : 0,
      duration: 950,
    });
  }

  const useMyArea = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((position) => {
      const next = { lat: position.coords.latitude, lng: position.coords.longitude };
      setUserLocation(next);
      mapRef.current?.flyTo({
        center: [next.lng, next.lat],
        zoom: 12.5,
        pitch: viewModeRef.current === "3d" ? 56 : 0,
        bearing: viewModeRef.current === "3d" ? -24 : 0,
        duration: 900,
      });

      userMarkerRef.current?.remove();
      const el = document.createElement("div");
      el.className = "grid size-8 place-items-center rounded-full border-2 border-white bg-sky-500 shadow-lg";
      el.innerHTML = `<span class="size-2 rounded-full bg-white"></span>`;
      userMarkerRef.current = new mapboxgl.Marker({ element: el }).setLngLat([next.lng, next.lat]).addTo(mapRef.current!);
    });
  };

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(520px,1fr)_320px]">
      <aside className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
        <div className="mb-5 flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 font-semibold text-slate-950">
            <Filter size={18} className="text-teal-700" aria-hidden="true" />
            {text.filters}
          </p>
          <button type="button" onClick={resetFilters} className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-slate-200 px-2.5 text-xs font-semibold text-slate-700 hover:bg-teal-50">
            <RotateCcw size={14} aria-hidden="true" />
            {text.reset}
          </button>
        </div>
        <div className="grid gap-4">
          <Select label={text.language} value={languageFilter} options={languageOptions} onChange={setLanguageFilter} />
          <Select label={text.insurance} value={costFilter} options={costOptions} onChange={setCostFilter} />
          <Select label={text.age} value={ageFilter} options={ageGroupOptions} onChange={setAgeFilter} />
          <Select label={text.service} value={serviceFilter} options={serviceTypeOptions} onChange={setServiceFilter} />
          <Select label={text.city} value={cityFilter} options={cityOptions} onChange={setCityFilter} />
        </div>
        {!mapboxToken && <p className="mt-5 rounded-md bg-sky-50 p-3 text-sm leading-6 text-sky-950">{text.fallback}</p>}
        {mapMessage && (
          <p className="mt-5 rounded-md bg-rose-50 p-3 text-sm leading-6 text-rose-950">
            {mapMessage === "3d-unavailable" ? text.threeDUnavailable : text.satelliteUnavailable}
          </p>
        )}
      </aside>

      <div className="relative min-h-[560px] min-w-0 overflow-hidden rounded-lg border border-teal-900/30 bg-[#061d1b] p-3 text-white shadow-sm lg:min-h-[650px]">
        <div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-lg border border-white/15 bg-black/35 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-teal-50 backdrop-blur">
          <span>{text.mapTitle}</span>
          <span className="group relative inline-flex">
            <button
              type="button"
              aria-label={text.note}
              className="grid size-5 place-items-center rounded-full text-[13px] font-bold leading-none text-teal-50/90 outline-none transition hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white/50"
            >
              ⓘ
            </button>
            <span
              role="tooltip"
              className="pointer-events-none absolute left-0 top-7 z-40 hidden w-72 max-w-[calc(100vw-2rem)] rounded-md border border-white/15 bg-white px-3 py-2 text-left text-xs font-medium normal-case leading-5 tracking-normal text-slate-700 shadow-xl group-hover:block group-focus-within:block sm:w-80"
            >
              {text.note}
            </span>
          </span>
        </div>

        <div className="absolute right-4 top-4 z-20 grid max-w-[calc(100%-2rem)] gap-2 rounded-xl border border-white/15 bg-black/40 p-2 shadow-2xl shadow-black/20 backdrop-blur md:max-w-none">
          <div className="grid grid-cols-2 gap-1">
            {(["2d", "3d"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setRequestedViewMode(option)}
                disabled={option === "3d" && !supports3d}
                className={`min-h-9 rounded-md px-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-55 ${
                  viewMode === option ? "bg-white text-teal-950" : "text-white hover:bg-white/10"
                }`}
              >
                {option === "2d" ? text.view2d : text.view3d}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-1">
            {(["explore", "satellite"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setMode(option)}
                className={`min-h-9 rounded-md px-3 text-sm font-semibold transition ${
                  mode === option ? "bg-white text-teal-950" : "text-white hover:bg-white/10"
                }`}
              >
                {option === "explore" ? text.explore : text.satellite}
              </button>
            ))}
          </div>
          <div className="grid gap-1 sm:grid-cols-2">
            <button
              type="button"
              onClick={resetView}
              className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-white/15 px-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/25"
            >
              <Crosshair size={15} aria-hidden="true" />
              {text.resetCamera}
            </button>
            <button
              type="button"
              onClick={useMyArea}
              className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-white/15 px-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/25"
            >
              <LocateFixed size={15} aria-hidden="true" />
              {text.useArea}
            </button>
          </div>
        </div>

        {mapboxToken ? (
          <div ref={mapContainerRef} className="h-[540px] min-h-[560px] w-full rounded-lg lg:h-[650px] lg:min-h-[650px]" />
        ) : (
          <div className="grid h-[540px] min-h-[560px] w-full place-items-center rounded-lg border border-white/10 bg-teal-950/70 p-8 text-center lg:h-[650px] lg:min-h-[650px]">
            <div className="max-w-md">
              <p className="text-lg font-semibold text-white">{text.fallback}</p>
              <p className="mt-3 text-sm leading-6 text-teal-50">NEXT_PUBLIC_MAPBOX_TOKEN</p>
            </div>
          </div>
        )}

        <div className="absolute bottom-4 left-4 z-20 flex flex-wrap gap-2">
          <MapButton label={text.zoomIn} onClick={() => mapRef.current?.zoomIn()} icon={Plus} />
          <MapButton label={text.zoomOut} onClick={() => mapRef.current?.zoomOut()} icon={Minus} />
        </div>
      </div>

      <aside className="min-w-0 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto xl:col-span-1">
          {selected ? (
            <>
              <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${isUrgent(selected) ? "text-rose-700" : "text-teal-700"}`}>
                {isUrgent(selected) ? text.urgent : text.selected}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">{localizedSelected?.name}</h2>
              <p className="mt-2 text-sm font-medium text-slate-600">{selected.address ?? localizedSelected?.city}</p>
              {userLocation && (
                <p className="mt-2 text-sm font-semibold text-teal-800">
                  {text.distance}: {distanceMiles(userLocation, selected.coordinates).toFixed(1)} mi
                </p>
              )}
              <p className="mt-4 leading-7 text-slate-700">{localizedSelected?.description}</p>
              <dl className="mt-5 grid gap-2 text-sm text-slate-700">
                {hasUsablePhone(selected.phone) && (
                  <div>
                    <dt className="font-semibold text-slate-950">{text.phone}</dt>
                    <dd>{selected.phone}</dd>
                  </div>
                )}
                <div>
                  <dt className="font-semibold text-slate-950">{text.languages}</dt>
                  <dd>{selected.languages.map((tag) => localizedOption(language, tag)).join(", ")}</dd>
                </div>
              </dl>
              <div className="mt-5 flex flex-wrap gap-2">
                {[...selected.languages, ...selected.costTypes, ...selected.ageGroups].map((tag) => (
                  <span key={tag} className="rounded-md bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-900">
                    {localizedOption(language, tag)}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => flyToResource(selected)}
                className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-teal-200 bg-white px-4 text-sm font-semibold text-teal-800 transition hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-100"
              >
                <View size={16} aria-hidden="true" />
                {text.flyToResource}
              </button>
              <div className="mt-5 rounded-lg bg-[#f6faf7] p-4">
                <p className="flex items-center gap-2 font-semibold text-slate-950">
                  <ShieldCheck size={17} className="text-teal-700" aria-hidden="true" />
                  {text.access}
                </p>
                <ul className="mt-2 grid gap-2 text-sm leading-6 text-slate-600">
                  {selected.accessibility.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              {selected.websiteUrl ? (
                <a
                  href={selected.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold text-white transition focus-visible:outline-none focus-visible:ring-4 ${
                    isUrgent(selected)
                      ? "bg-rose-600 hover:bg-rose-700 focus-visible:ring-rose-200"
                      : "bg-teal-700 hover:bg-teal-800 focus-visible:ring-teal-200"
                  }`}
                >
                  <Navigation size={16} aria-hidden="true" />
                  {text.cta}
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="mt-5 inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-md bg-slate-200 px-4 text-sm font-semibold text-slate-500"
                >
                  {text.websiteComingSoon}
                </button>
              )}
            </>
          ) : (
            <p className="leading-7 text-slate-600">{text.noMatch}</p>
          )}
        </aside>
    </div>
  );
}

function getMapStyle(mode: MapMode) {
  return mode === "satellite"
    ? "mapbox://styles/mapbox/satellite-streets-v12"
    : "mapbox://styles/mapbox/streets-v12";
}

function resourceFeatureCollection(source: Resource[]) {
  return {
    type: "FeatureCollection" as const,
    features: source.map((resource) => ({
      type: "Feature" as const,
      geometry: {
        type: "Point" as const,
        coordinates: [resource.coordinates.lng, resource.coordinates.lat],
      },
      properties: {
        name: resource.name,
        urgent: isUrgent(resource),
        city: resource.city,
      },
    })),
  };
}

function cityFeatureCollection() {
  return {
    type: "FeatureCollection" as const,
    features: cityLabels.map((city) => ({
      type: "Feature" as const,
      geometry: {
        type: "Point" as const,
        coordinates: city.coordinates,
      },
      properties: {
        name: city.name,
      },
    })),
  };
}

function syncClusteredResources(map: MapboxMap, source: Resource[]) {
  const existingSource = map.getSource(resourceSourceId) as mapboxgl.GeoJSONSource | undefined;
  if (existingSource) {
    existingSource.setData(resourceFeatureCollection(source));
    return;
  }

  map.addSource(resourceSourceId, {
    type: "geojson",
    data: resourceFeatureCollection(source),
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 48,
  });

  map.addLayer({
    id: "resource-clusters",
    type: "circle",
    source: resourceSourceId,
    filter: ["has", "point_count"],
    paint: {
      "circle-color": ["step", ["get", "point_count"], "#14b8a6", 8, "#38bdf8", 18, "#f43f5e"],
      "circle-radius": ["step", ["get", "point_count"], 20, 8, 26, 18, 34],
      "circle-stroke-color": "#ffffff",
      "circle-stroke-width": 2,
      "circle-opacity": 0.92,
      "circle-emissive-strength": 0.8,
    },
  });

  map.addLayer({
    id: "resource-cluster-count",
    type: "symbol",
    source: resourceSourceId,
    filter: ["has", "point_count"],
    layout: {
      "text-field": ["get", "point_count_abbreviated"],
      "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
      "text-size": 13,
    },
    paint: {
      "text-color": "#ffffff",
      "text-halo-color": "rgba(0,0,0,0.35)",
      "text-halo-width": 1,
    },
  });

  map.addLayer({
    id: "resource-unclustered",
    type: "circle",
    source: resourceSourceId,
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": ["case", ["boolean", ["get", "urgent"], false], "#f43f5e", "#14b8a6"],
      "circle-radius": 13,
      "circle-stroke-color": "#ffffff",
      "circle-stroke-width": 2,
      "circle-opacity": 0.96,
      "circle-emissive-strength": 0.9,
    },
  });

  map.addLayer({
    id: "resource-unclustered-inner",
    type: "circle",
    source: resourceSourceId,
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": "#ffffff",
      "circle-radius": 4,
      "circle-opacity": 1,
    },
  });
}

function removeClusteredResources(map: MapboxMap) {
  ["resource-unclustered-inner", "resource-unclustered", "resource-cluster-count", "resource-clusters"].forEach((layerId) => {
    if (map.getLayer(layerId)) map.removeLayer(layerId);
  });
  if (map.getSource(resourceSourceId)) map.removeSource(resourceSourceId);
}

function add3dEnhancements(map: MapboxMap) {
  if (!map.getSource(terrainSourceId)) {
    map.addSource(terrainSourceId, {
      type: "raster-dem",
      url: "mapbox://mapbox.mapbox-terrain-dem-v1",
      tileSize: 512,
      maxzoom: 14,
    });
  }

  map.setTerrain({ source: terrainSourceId, exaggeration: 1.15 });
  map.setFog({
    color: "rgb(232, 244, 240)",
    "high-color": "rgb(196, 231, 225)",
    "horizon-blend": 0.12,
  });

  const labelLayerId = findFirstSymbolLayer(map);
  if (!map.getLayer(buildingsLayerId)) {
    map.addLayer(
      {
        id: buildingsLayerId,
        source: "composite",
        "source-layer": "building",
        filter: ["==", ["get", "extrude"], "true"],
        type: "fill-extrusion",
        minzoom: 14,
        paint: {
          "fill-extrusion-color": "#8fb7ad",
          "fill-extrusion-height": ["interpolate", ["linear"], ["zoom"], 14, 0, 15.05, ["get", "height"]],
          "fill-extrusion-base": ["interpolate", ["linear"], ["zoom"], 14, 0, 15.05, ["get", "min_height"]],
          "fill-extrusion-opacity": 0.58,
        },
      },
      labelLayerId,
    );
  }

  addCityLabels(map);
}

function remove3dEnhancements(map: MapboxMap) {
  if (map.getLayer(buildingsLayerId)) map.removeLayer(buildingsLayerId);
  removeCityLabels(map);
  map.setTerrain(null);
  map.setFog(null);
}

function addCityLabels(map: MapboxMap) {
  if (!map.getSource(citySourceId)) {
    map.addSource(citySourceId, {
      type: "geojson",
      data: cityFeatureCollection(),
    });
  }

  if (!map.getLayer("ca45-city-labels")) {
    map.addLayer({
      id: "ca45-city-labels",
      type: "symbol",
      source: citySourceId,
      minzoom: 9.5,
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
        "text-size": ["interpolate", ["linear"], ["zoom"], 10, 12, 14, 16],
        "text-offset": [0, 1.25],
        "text-anchor": "top",
        "text-allow-overlap": false,
        "text-padding": 10,
      },
      paint: {
        "text-color": "#083b36",
        "text-halo-color": "rgba(255,255,255,0.92)",
        "text-halo-width": 1.5,
      },
    });
  }
}

function removeCityLabels(map: MapboxMap) {
  if (map.getLayer("ca45-city-labels")) map.removeLayer("ca45-city-labels");
  if (map.getSource(citySourceId)) map.removeSource(citySourceId);
}

function findFirstSymbolLayer(map: MapboxMap) {
  const layers = map.getStyle().layers ?? [];
  return layers.find((layer) => layer.type === "symbol")?.id;
}

function shouldFallbackTo2d() {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & { deviceMemory?: number };
  return (
    window.innerWidth < 640 ||
    (nav.hardwareConcurrency && nav.hardwareConcurrency <= 4) ||
    (nav.deviceMemory && nav.deviceMemory <= 4) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function MapButton({ label, onClick, icon: Icon }: { label: string; onClick: () => void; icon: typeof Plus }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid size-10 place-items-center rounded-md border border-white/15 bg-black/35 text-white backdrop-blur transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/25"
      title={label}
    >
      <Icon size={17} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </button>
  );
}

function Select<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="grid min-w-0 gap-2 text-sm font-semibold text-slate-800">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="min-h-11 w-full max-w-full rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function distanceMiles(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const radius = 3958.8;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * radius * Math.asin(Math.sqrt(h));
}

function toRad(value: number) {
  return (value * Math.PI) / 180;
}

function isUrgent(resource: Resource) {
  return resource.resourceType === "988 Suicide & Crisis Lifeline";
}

function createResourcePopup(resource: Resource, language: LanguageCode) {
  const localized = localizedResource(language, resource);
  const fallback = "Resource details unavailable";
  const name = localized.name || fallback;
  const description = localized.description || fallback;
  const city = resource.address || localized.city || fallback;
  const category = localized.category || fallback;
  const phone = hasUsablePhone(resource.phone) ? resource.phone : "";
  const websiteUrl = resource.websiteUrl || "";
  const languages = resource.languages.map((tag) => localizedOption(language, tag)).join(", ");

  const container = document.createElement("article");
  container.className = "resource-map-popup-card";
  container.addEventListener("click", (event) => event.stopPropagation());

  const eyebrow = document.createElement("p");
  eyebrow.className = "resource-map-popup-category";
  eyebrow.textContent = category;

  const title = document.createElement("h3");
  title.className = "resource-map-popup-title";
  title.textContent = name;

  const location = document.createElement("p");
  location.className = "resource-map-popup-location";
  location.textContent = city;

  const body = document.createElement("p");
  body.className = "resource-map-popup-description";
  body.textContent = description;

  container.append(eyebrow, title, location, body);

  if (phone) {
    const phoneLine = document.createElement("p");
    phoneLine.className = "resource-map-popup-phone";
    phoneLine.textContent = phone;
    container.append(phoneLine);
  }

  if (languages) {
    const languageLine = document.createElement("p");
    languageLine.className = "resource-map-popup-phone";
    languageLine.textContent = languages;
    container.append(languageLine);
  }

  if (websiteUrl.startsWith("http")) {
    const link = document.createElement("a");
    link.className = "resource-map-popup-link";
    link.href = websiteUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Visit website";
    link.addEventListener("click", (event) => event.stopPropagation());
    container.append(link);
  } else {
    const fallback = document.createElement("p");
    fallback.className = "resource-map-popup-fallback";
    fallback.textContent = localizedOption(language, "Website coming soon");
    container.append(fallback);
  }

  return container;
}

function hasUsablePhone(phone: string) {
  const normalized = phone.trim().toLowerCase();
  return normalized.length > 0 && !normalized.includes("placeholder") && !normalized.includes("ask school");
}
