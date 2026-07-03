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
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
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

const copy = {
  en: {
    filters: "Map filters",
    reset: "Reset",
    language: "Language",
    insurance: "Insurance / cost",
    age: "Age group",
    service: "Service type",
    city: "City",
    explore: "Explore",
    satellite: "Satellite",
    mapTitle: "CA-45 live resource map",
    fallback:
      "Mapbox token is missing. Add NEXT_PUBLIC_MAPBOX_TOKEN in Vercel to load Explore and Satellite map styles.",
    satelliteUnavailable: "Satellite view is temporarily unavailable.",
    note: "Pins are approximate resource locations for demo planning. Verify details directly with providers.",
    selected: "Selected resource",
    noMatch: "No map resources match those filters.",
    access: "Accessibility",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    resetView: "Reset view",
    useArea: "Use my area",
    distance: "Distance",
    cta: "Open details",
    websiteComingSoon: "Website coming soon",
    urgent: "Urgent help",
  },
  vi: {
    filters: "Bộ lọc bản đồ",
    reset: "Đặt lại",
    language: "Ngôn ngữ",
    insurance: "Bảo hiểm / chi phí",
    age: "Nhóm tuổi",
    service: "Loại dịch vụ",
    city: "Thành phố",
    explore: "Khám phá",
    satellite: "Vệ tinh",
    mapTitle: "Bản đồ nguồn hỗ trợ CA-45",
    fallback:
      "Thiếu Mapbox token. Hãy thêm NEXT_PUBLIC_MAPBOX_TOKEN trong Vercel để tải bản đồ Explore và Satellite.",
    satelliteUnavailable: "Chế độ vệ tinh tạm thời không khả dụng.",
    note: "Các điểm ghim là vị trí nguồn hỗ trợ gần đúng cho bản demo. Hãy xác minh trực tiếp với nhà cung cấp.",
    selected: "Nguồn hỗ trợ đã chọn",
    noMatch: "Không có nguồn hỗ trợ phù hợp với bộ lọc.",
    access: "Tiếp cận",
    zoomIn: "Phóng to",
    zoomOut: "Thu nhỏ",
    resetView: "Đặt lại bản đồ",
    useArea: "Dùng vị trí của tôi",
    distance: "Khoảng cách",
    cta: "Xem chi tiết",
    websiteComingSoon: "Sắp có trang web",
    urgent: "Hỗ trợ khẩn cấp",
  },
} as const;

type MapMode = "explore" | "satellite";

export function ResourceMap() {
  const { language } = useLanguage();
  const text = copy[language as keyof typeof copy] ?? copy.en;
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const markerRef = useRef<Marker[]>([]);
  const popupRef = useRef<Popup | null>(null);
  const userMarkerRef = useRef<Marker | null>(null);
  const styleFallbackRef = useRef(false);
  const requestedModeRef = useRef<MapMode>("explore");
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

  const syncMarkers = () => {
    const map = mapRef.current;
    if (!map) return;

    markerRef.current.forEach((marker) => marker.remove());
    markerRef.current = filtered.map((resource) => {
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
      pitch: 42,
      bearing: -18,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right");
    map.on("click", () => {
      setSelectedResource(null);
    });
    map.on("style.load", () => {
      styleFallbackRef.current = false;
      setMapMessage("");
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
    syncMarkers();
    // Markers live in HTML overlay state and are intentionally re-synced after filters/style changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      .setDOMContent(createResourcePopup(popupResource))
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
  }, [popupResource]);

  const resetFilters = () => {
    setLanguageFilter("All languages");
    setCostFilter("All costs");
    setAgeFilter("All age groups");
    setServiceFilter("All service types");
    setCityFilter("All cities");
  };

  const resetView = () => {
    mapRef.current?.flyTo({ center: [center.lng, center.lat], zoom: initialZoom, pitch: 42, bearing: -18, duration: 900 });
  };

  const useMyArea = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((position) => {
      const next = { lat: position.coords.latitude, lng: position.coords.longitude };
      setUserLocation(next);
      mapRef.current?.flyTo({ center: [next.lng, next.lat], zoom: 12.5, duration: 900 });

      userMarkerRef.current?.remove();
      const el = document.createElement("div");
      el.className = "grid size-8 place-items-center rounded-full border-2 border-white bg-sky-500 shadow-lg";
      el.innerHTML = `<span class="size-2 rounded-full bg-white"></span>`;
      userMarkerRef.current = new mapboxgl.Marker({ element: el }).setLngLat([next.lng, next.lat]).addTo(mapRef.current!);
    });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
      <aside className="h-fit rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
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
        {mapMessage && <p className="mt-5 rounded-md bg-rose-50 p-3 text-sm leading-6 text-rose-950">{text.satelliteUnavailable}</p>}
        <p className="mt-3 rounded-md bg-amber-50 p-3 text-sm leading-6 text-amber-950">{text.note}</p>
      </aside>

      <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="relative min-h-[620px] overflow-hidden rounded-lg border border-teal-900/30 bg-[#061d1b] p-3 text-white shadow-sm">
          <div className="absolute left-4 top-4 z-20 rounded-lg border border-white/15 bg-black/35 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-teal-50 backdrop-blur">
            {text.mapTitle}
          </div>

          <div className="absolute right-4 top-4 z-20 flex rounded-lg border border-white/15 bg-black/35 p-1 backdrop-blur">
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

          {mapboxToken ? (
            <div ref={mapContainerRef} className="h-[590px] min-h-[70vh] rounded-lg" />
          ) : (
            <div className="grid h-[590px] min-h-[70vh] place-items-center rounded-lg border border-white/10 bg-teal-950/70 p-8 text-center">
              <div className="max-w-md">
                <p className="text-lg font-semibold text-white">{text.fallback}</p>
                <p className="mt-3 text-sm leading-6 text-teal-50">NEXT_PUBLIC_MAPBOX_TOKEN</p>
              </div>
            </div>
          )}

          <div className="absolute bottom-4 left-4 z-20 flex flex-wrap gap-2">
            <MapButton label={text.zoomIn} onClick={() => mapRef.current?.zoomIn()} icon={Plus} />
            <MapButton label={text.zoomOut} onClick={() => mapRef.current?.zoomOut()} icon={Minus} />
            <MapButton label={text.resetView} onClick={resetView} icon={Crosshair} />
            <button
              type="button"
              onClick={useMyArea}
              className="inline-flex min-h-10 items-center gap-2 rounded-md border border-white/15 bg-black/35 px-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/25"
            >
              <LocateFixed size={16} aria-hidden="true" />
              {text.useArea}
            </button>
          </div>
        </div>

        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          {selected ? (
            <>
              <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${isUrgent(selected) ? "text-rose-700" : "text-teal-700"}`}>
                {isUrgent(selected) ? text.urgent : text.selected}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">{selected.name}</h2>
              <p className="mt-2 text-sm font-medium text-slate-600">{selected.city}</p>
              {userLocation && (
                <p className="mt-2 text-sm font-semibold text-teal-800">
                  {text.distance}: {distanceMiles(userLocation, selected.coordinates).toFixed(1)} mi
                </p>
              )}
              <p className="mt-4 leading-7 text-slate-700">{selected.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {[...selected.languages, ...selected.costTypes, ...selected.ageGroups].map((tag) => (
                  <span key={tag} className="rounded-md bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-900">
                    {tag}
                  </span>
                ))}
              </div>
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
      </section>
    </div>
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
    <label className="grid gap-2 text-sm font-semibold text-slate-800">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="min-h-11 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
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

function createResourcePopup(resource: Resource) {
  const fallback = "Resource details unavailable";
  const name = resource.name || fallback;
  const description = resource.description || fallback;
  const city = resource.city || fallback;
  const category = resource.resourceType || resource.serviceType || fallback;
  const phone = hasUsablePhone(resource.phone) ? resource.phone : "";
  const websiteUrl = resource.websiteUrl || "";

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
    fallback.textContent = "Website coming soon";
    container.append(fallback);
  }

  return container;
}

function hasUsablePhone(phone: string) {
  const normalized = phone.trim().toLowerCase();
  return normalized.length > 0 && !normalized.includes("placeholder") && !normalized.includes("ask school");
}
