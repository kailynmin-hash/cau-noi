"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl, { type Map as MapboxMap, type Marker, type Popup } from "mapbox-gl";
import {
  ExternalLink,
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
const coordinateBounds = {
  minLat: 33.3,
  maxLat: 34.1,
  minLng: -118.3,
  maxLng: -117.4,
};

type MapMode = "explore" | "satellite";
type NormalizedCoordinates = { lat: number; lng: number; source: string; swapped: boolean };

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
    mapTitle: t("map.mapTitle"),
    fallback: t("map.fallback"),
    satelliteUnavailable: t("map.satelliteUnavailable"),
    note: t("map.note"),
    selected: t("map.selected"),
    noMatch: t("map.noMatch"),
    access: t("map.access"),
    resources: t("resourceFinder.resources"),
    of: t("resourceFinder.of"),
    phone: t("resourceFinder.phone"),
    languages: t("resourceFinder.languages"),
    zoomIn: t("map.zoomIn"),
    zoomOut: t("map.zoomOut"),
    resetCamera: t("map.resetCamera"),
    useArea: t("map.useArea"),
    flyToResource: t("map.flyToResource"),
    distance: t("map.distance"),
    cta: t("map.cta"),
    website: t("common.website"),
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
  const [mode, setMode] = useState<MapMode>("explore");
  const [mapMessage, setMapMessage] = useState("");
  const [languageFilter, setLanguageFilter] = useState<LanguageFilter>("All languages");
  const [costFilter, setCostFilter] = useState<CostFilter>("All costs");
  const [ageFilter, setAgeFilter] = useState<AgeGroupFilter>("All age groups");
  const [serviceFilter, setServiceFilter] = useState<ServiceTypeFilter>("All service types");
  const [cityFilter, setCityFilter] = useState<CityFilter>("All cities");
  const [selectedName, setSelectedName] = useState(resources[0].name);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [markerCount, setMarkerCount] = useState(0);
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
  const coordinateAudit = useMemo(() => auditResourceCoordinates(resources), []);
  const validCoordinateCount = coordinateAudit.valid.length;
  const invalidCoordinateCount = coordinateAudit.invalid.length;
  const mappableFiltered = useMemo(() => filtered.filter(hasMappableCoordinates), [filtered]);
  const popupResource = selectedResource && hasMappableCoordinates(selectedResource) && filtered.some((resource) => resource.name === selectedResource.name) ? selectedResource : null;
  const localizedSelected = selected ? localizedResource(language, selected) : null;
  const selectedCoordinates = selected ? getResourceLngLat(selected) : null;

  const syncMarkers = () => {
    const map = mapRef.current;
    if (!map) return;
    const currentResources = filteredRef.current.filter(hasMappableCoordinates);
    const invalidResources = filteredRef.current.filter((resource) => !hasMappableCoordinates(resource));

    markerRef.current.forEach((marker) => marker.remove());
    const nextMarkers: Marker[] = [];
    const markerExamples: Array<{ name: string; lat: number; lng: number; source: string; swapped: boolean }> = [];

    currentResources.forEach((resource) => {
      const lngLat = getResourceLngLat(resource);
      if (!lngLat) return;

      const markerElement = createResourceMarkerElement(resource, resource.name === selectedName);
      markerElement.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        setSelectedName(resource.name);
        setSelectedResource(resource);
      });

      const marker = new mapboxgl.Marker({ element: markerElement, anchor: "bottom" })
        .setLngLat([lngLat.lng, lngLat.lat])
        .addTo(map);
      nextMarkers.push(marker);
      if (markerExamples.length < 5) {
        markerExamples.push({
          name: resource.name,
          lat: lngLat.lat,
          lng: lngLat.lng,
          source: lngLat.source,
          swapped: lngLat.swapped,
        });
      }
    });

    markerRef.current = nextMarkers;
    setMarkerCount(nextMarkers.length);
    if (invalidResources.length > 0) {
      console.warn(
        "resource map invalid coordinates skipped",
        invalidResources.map((resource) => ({
          name: resource.name,
          city: resource.city,
          coordinates: resource.coordinates,
          latitude: resource.latitude,
          longitude: resource.longitude,
        })),
      );
    }
    console.info("resource map markers synced", {
      mapExists: Boolean(mapRef.current),
      mapLoaded: map.loaded(),
      styleLoaded: map.isStyleLoaded(),
      attemptedMarkers: currentResources.length,
      markersRendered: nextMarkers.length,
      invalidCoordinates: invalidResources.length,
      markerExamples,
    });
  };

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    let map: MapboxMap;
    try {
      map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: getMapStyle("explore"),
        center: [center.lng, center.lat],
        zoom: initialZoom,
        minZoom,
        maxZoom,
        attributionControl: false,
      });
    } catch (error) {
      console.error("map initialization error", error);
      window.setTimeout(() => setMapMessage("map-unavailable"), 0);
      return;
    }

    mapRef.current = map;
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right");
    map.on("click", () => {
      setSelectedResource(null);
    });
    map.on("style.load", () => {
      styleFallbackRef.current = false;
      setMapMessage("");
      syncMarkers();
    });
    map.once("load", syncMarkers);
    map.on("error", (event) => {
      console.error("mapbox runtime error", event.error ?? event);
      if (requestedModeRef.current === "satellite" && !styleFallbackRef.current) {
        styleFallbackRef.current = true;
        setMapMessage("satellite-unavailable");
        setMode("explore");
        map.setStyle(getMapStyle("explore"));
      }
    });
    return () => {
      markerRef.current.forEach((marker) => marker.remove());
      markerRef.current = [];
      setMarkerCount(0);
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
    try {
      mapRef.current.setStyle(getMapStyle(mode));
    } catch (error) {
      console.error("map style switch error", error);
      if (mode === "satellite") {
        window.setTimeout(() => {
          setMapMessage("satellite-unavailable");
          setMode("explore");
        }, 0);
      }
    }
  }, [mapboxToken, mode]);

  useEffect(() => {
    filteredRef.current = filtered;
  }, [filtered]);

  useEffect(() => {
    syncMarkers();
    // Resource markers are intentionally re-synced after filters/style changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered, selectedName]);

  useEffect(() => {
    const map = mapRef.current;
    popupRef.current?.remove();
    popupRef.current = null;

    const popupCoordinates = popupResource ? getResourceLngLat(popupResource) : null;
    if (!map || !popupResource || !popupCoordinates) return;

    const popup = new mapboxgl.Popup({
      offset: 20,
      closeButton: true,
      closeOnClick: false,
      className: "resource-map-popup",
      maxWidth: "340px",
    })
      .setLngLat([popupCoordinates.lng, popupCoordinates.lat])
      .setDOMContent(createResourcePopup(popupResource, language, text.cta, text.websiteComingSoon))
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
  }, [language, popupResource, text.cta, text.websiteComingSoon]);

  const resetFilters = () => {
    setLanguageFilter("All languages");
    setCostFilter("All costs");
    setAgeFilter("All age groups");
    setServiceFilter("All service types");
    setCityFilter("All cities");
  };

  const resetView = () => {
    try {
      mapRef.current?.flyTo({
        center: [center.lng, center.lat],
        zoom: initialZoom,
        duration: 900,
      });
    } catch (error) {
      console.error("map reset camera error", error);
    }
  };

  function flyToResource(resource: Resource) {
    const lngLat = getResourceLngLat(resource);
    if (!lngLat) return;
    try {
      mapRef.current?.flyTo({
        center: [lngLat.lng, lngLat.lat],
        zoom: 13.8,
        duration: 950,
      });
    } catch (error) {
      console.error("map fly to resource error", error);
    }
  }

  const useMyArea = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((position) => {
      const next = { lat: position.coords.latitude, lng: position.coords.longitude };
      setUserLocation(next);
      try {
        mapRef.current?.flyTo({
          center: [next.lng, next.lat],
          zoom: 12.5,
          duration: 900,
        });
      } catch (error) {
        console.error("map use my area camera error", error);
      }

      userMarkerRef.current?.remove();
      const el = document.createElement("div");
      el.className = "grid size-8 place-items-center rounded-full border-2 border-white bg-sky-500 shadow-lg";
      el.innerHTML = `<span class="size-2 rounded-full bg-white"></span>`;
      if (mapRef.current) {
        userMarkerRef.current = new mapboxgl.Marker({ element: el }).setLngLat([next.lng, next.lat]).addTo(mapRef.current);
      }
    });
  };

  useEffect(() => {
    console.info("resource map marker pipeline", {
      totalResourcesLoaded: resources.length,
      validCoordinates: validCoordinateCount,
      invalidCoordinates: invalidCoordinateCount,
      resourcesFilteredOut: resources.length - filtered.length,
      markersRendered: markerCount,
      selectedMapStyle: mode,
      finalMarkerCoordinateExamples: coordinateAudit.valid.slice(0, 5).map(({ resource, coordinates }) => ({
        name: resource.name,
        lat: coordinates.lat,
        lng: coordinates.lng,
        source: coordinates.source,
        swapped: coordinates.swapped,
      })),
    });
  }, [coordinateAudit.valid, filtered.length, invalidCoordinateCount, markerCount, mode, validCoordinateCount]);

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(520px,1fr)_320px]">
      <aside
        id="map-filters-panel"
        className="min-w-0 overflow-y-auto rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition duration-300 lg:max-h-[calc(100vh-8rem)]"
      >
        <p className="mb-4 rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white">
          Resources loaded: {resources.length} · Valid coordinates: {validCoordinateCount} · Invalid coordinates: {invalidCoordinateCount} · Markers rendered: {markerCount}
          <span className="block pt-1 font-medium text-slate-300">
            Resources filtered out: {resources.length - filtered.length} · Selected map style: {mode}
          </span>
        </p>
        <div className="mb-5 flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 font-semibold text-slate-950">
            <Filter size={18} className="text-teal-700" aria-hidden="true" />
            {text.filters}
          </p>
          <div className="flex flex-wrap justify-end gap-2">
            <button type="button" onClick={resetFilters} className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-slate-200 px-2.5 text-xs font-semibold text-slate-700 hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-100">
              <RotateCcw size={14} aria-hidden="true" />
              {text.reset}
            </button>
          </div>
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
            {mapMessage === "satellite-unavailable" ? text.satelliteUnavailable : text.fallback}
          </p>
        )}

        <div className="mt-6 border-t border-slate-100 pt-5">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <h2 className="font-semibold text-slate-950">{text.resources}</h2>
              <p className="mt-1 text-xs font-medium text-slate-500">
                Showing {filtered.length} {text.resources.toLowerCase()} · {mappableFiltered.length} map pins · {resources.length} total
              </p>
            </div>
          </div>
          {filtered.length > 0 ? (
            <div className="grid gap-3">
              {filtered.map((resource) => (
                <MapResourceCard
                  key={resource.name}
                  resource={resource}
                  language={language}
                  selected={selected?.name === resource.name}
                  mapLabel={text.flyToResource}
                  websiteLabel={text.website}
                  onSelect={() => {
                    setSelectedName(resource.name);
                    setSelectedResource(resource);
                    if (hasMappableCoordinates(resource)) flyToResource(resource);
                  }}
                />
              ))}
            </div>
          ) : resources.length === 0 ? (
            <p className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-sm leading-6 text-slate-600">{text.noMatch}</p>
          ) : (
            <p className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-sm leading-6 text-slate-600">{text.noMatch}</p>
          )}
        </div>
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
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
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
            <button
              type="button"
              onClick={resetView}
              className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-white/15 px-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/25"
            >
              <RotateCcw size={15} aria-hidden="true" />
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

      <aside
        id="map-details-panel"
        className="min-w-0 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto xl:col-span-1"
      >
          {selected ? (
            <>
              <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${isUrgent(selected) ? "text-rose-700" : "text-teal-700"}`}>
                {isUrgent(selected) ? text.urgent : text.selected}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">{localizedSelected?.name}</h2>
              <p className="mt-2 text-sm font-medium text-slate-600">{selected.address ?? localizedSelected?.city}</p>
              {userLocation && selectedCoordinates && (
                <p className="mt-2 text-sm font-semibold text-teal-800">
                  {text.distance}: {distanceMiles(userLocation, selectedCoordinates).toFixed(1)} mi
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
                disabled={!hasMappableCoordinates(selected)}
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

function MapResourceCard({
  resource,
  language,
  selected,
  mapLabel,
  websiteLabel,
  onSelect,
}: {
  resource: Resource;
  language: LanguageCode;
  selected: boolean;
  mapLabel: string;
  websiteLabel: string;
  onSelect: () => void;
}) {
  const localized = localizedResource(language, resource);

  return (
    <article className={`rounded-lg border p-4 shadow-sm transition ${selected ? "border-teal-500 bg-teal-50" : "border-slate-200 bg-white hover:border-teal-200"}`}>
      <button type="button" onClick={onSelect} className="block w-full text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-100">
        <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${isUrgent(resource) ? "text-rose-700" : "text-teal-700"}`}>
          {localized.category}
        </p>
        <h3 className="mt-2 text-base font-semibold leading-snug text-slate-950">{localized.name}</h3>
        <p className="mt-2 text-xs font-medium text-slate-600">{resource.address ?? localized.city}</p>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{localized.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {[resource.mode, ...resource.languages.slice(0, 3)].map((tag) => (
            <span key={tag} className="rounded-md bg-white px-2 py-1 text-[11px] font-semibold text-teal-900 ring-1 ring-teal-100">
              {localizedOption(language, tag)}
            </span>
          ))}
        </div>
      </button>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onSelect}
          className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-md border border-teal-200 bg-white px-3 text-xs font-semibold text-teal-800 transition hover:bg-teal-50"
        >
          <View size={14} aria-hidden="true" />
          {mapLabel}
        </button>
        {resource.websiteUrl ? (
          <a
            href={resource.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-md bg-teal-700 px-3 text-xs font-semibold text-white transition hover:bg-teal-800"
          >
            <ExternalLink size={14} aria-hidden="true" />
            {websiteLabel}
          </a>
        ) : null}
      </div>
    </article>
  );
}

function getMapStyle(mode: MapMode) {
  return mode === "satellite"
    ? "mapbox://styles/mapbox/satellite-streets-v12"
    : "mapbox://styles/mapbox/streets-v12";
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

function getResourceLngLat(resource: Resource): NormalizedCoordinates | null {
  const coordinateRecord = resource as Resource & {
    lat?: number;
    lng?: number;
    coordinates?: { lat?: number; lng?: number } | [number, number];
  };

  if (Array.isArray(coordinateRecord.coordinates)) {
    const [first, second] = coordinateRecord.coordinates;
    return normalizeCoordinatePair(first, second, "coordinates-array");
  }

  const objectCoordinates = normalizeLatLng(
    coordinateRecord.coordinates?.lat,
    coordinateRecord.coordinates?.lng,
    "coordinates-object",
  );
  if (objectCoordinates) return objectCoordinates;

  const latitudeLongitude = normalizeLatLng(resource.latitude, resource.longitude, "latitude-longitude");
  if (latitudeLongitude) return latitudeLongitude;

  return normalizeLatLng(coordinateRecord.lat, coordinateRecord.lng, "lat-lng");
}

function hasMappableCoordinates(resource: Resource) {
  return getResourceLngLat(resource) !== null;
}

function auditResourceCoordinates(resourceList: Resource[]) {
  return resourceList.reduce(
    (audit, resource) => {
      const coordinates = getResourceLngLat(resource);
      if (coordinates) {
        audit.valid.push({ resource, coordinates });
      } else {
        audit.invalid.push(resource);
      }
      return audit;
    },
    {
      valid: [] as Array<{ resource: Resource; coordinates: NormalizedCoordinates }>,
      invalid: [] as Resource[],
    },
  );
}

function normalizeCoordinatePair(first: number | null | undefined, second: number | null | undefined, source: string): NormalizedCoordinates | null {
  if (!isFiniteCoordinate(first) || !isFiniteCoordinate(second)) return null;

  // GeoJSON-style arrays are [longitude, latitude]. If a future resource is
  // accidentally entered as [latitude, longitude], the bounds check swaps it.
  const lngLat = normalizeLatLng(second, first, source);
  if (lngLat) return lngLat;

  return normalizeLatLng(first, second, source);
}

function normalizeLatLng(lat: number | null | undefined, lng: number | null | undefined, source: string): NormalizedCoordinates | null {
  if (!isFiniteCoordinate(lat) || !isFiniteCoordinate(lng)) return null;

  if (isInCa45MapBounds(lat, lng)) {
    return { lat, lng, source, swapped: false };
  }

  if (isInCa45MapBounds(lng, lat)) {
    return { lat: lng, lng: lat, source, swapped: true };
  }

  return null;
}

function isFiniteCoordinate(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isInCa45MapBounds(lat: number, lng: number) {
  return (
    lat >= coordinateBounds.minLat &&
    lat <= coordinateBounds.maxLat &&
    lng >= coordinateBounds.minLng &&
    lng <= coordinateBounds.maxLng
  );
}

function createResourceMarkerElement(resource: Resource, selected: boolean) {
  const marker = document.createElement("button");
  marker.type = "button";
  marker.title = resource.name;
  marker.setAttribute("aria-label", resource.name);
  marker.className = `resource-pin-marker ${selected ? "resource-pin-marker-selected" : ""} ${isUrgent(resource) ? "resource-pin-marker-urgent" : ""}`;
  marker.innerHTML = '<span class="resource-pin-dot" aria-hidden="true"></span>';
  return marker;
}

function createResourcePopup(resource: Resource, language: LanguageCode, visitWebsiteLabel: string, websiteComingSoonLabel: string) {
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
    link.textContent = visitWebsiteLabel;
    link.addEventListener("click", (event) => event.stopPropagation());
    container.append(link);
  } else {
    const fallback = document.createElement("p");
    fallback.className = "resource-map-popup-fallback";
    fallback.textContent = websiteComingSoonLabel;
    container.append(fallback);
  }

  return container;
}

function hasUsablePhone(phone: string) {
  const normalized = phone.trim().toLowerCase();
  return normalized.length > 0 && !normalized.includes("placeholder") && !normalized.includes("ask school");
}
