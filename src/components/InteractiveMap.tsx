import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { SportsFacility, WardData } from '../types';

interface InteractiveMapProps {
  facilities: SportsFacility[];
  wards: WardData[];
  selectedFacility: SportsFacility | null;
  onSelectFacility: (facility: SportsFacility) => void;
  onOpenReportForFacility: (facility: SportsFacility) => void;
  showWardsChoropleth?: boolean;
  highlightedCoordinates?: [number, number] | null;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  facilities,
  wards,
  selectedFacility,
  onSelectFacility,
  onOpenReportForFacility,
  showWardsChoropleth = false,
  highlightedCoordinates = null
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const wardsLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center on Delhi NCT sports cluster (28.6139, 77.2090)
      const map = L.map(mapContainerRef.current, {
        center: [28.6250, 77.2150],
        zoom: 11,
        zoomControl: true,
        attributionControl: false
      });

      // Add CartoDB Positron / OSM clean tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
      }).addTo(map);

      // Attribution
      L.control.attribution({ position: 'bottomright' })
        .addAttribution('Bhuvan / ISRO / OpenStreetMap')
        .addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      const wardsGroup = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = markersGroup;
      wardsLayerRef.current = wardsGroup;
    }

    return () => {
      // Keep map instance alive across rerenders or clean up on unmount
    };
  }, []);

  // Update Ward Choropleth Polygons
  useEffect(() => {
    if (!mapInstanceRef.current || !wardsLayerRef.current) return;
    wardsLayerRef.current.clearLayers();

    if (showWardsChoropleth) {
      wards.forEach((ward) => {
        // Color based on Activity Equity Score (AES)
        let fillColor = '#10B981'; // Green (Healthy)
        if (ward.aesScore < 50) {
          fillColor = '#EF4444'; // Red (Severe Desert)
        } else if (ward.aesScore < 70) {
          fillColor = '#F59E0B'; // Amber (Moderate)
        }

        const latLngs = ward.boundaryGeoJson.coordinates[0].map(([lng, lat]) => [lat, lng] as [number, number]);

        const polygon = L.polygon(latLngs, {
          color: fillColor,
          weight: 2.5,
          opacity: 0.85,
          fillColor: fillColor,
          fillOpacity: ward.isDesert ? 0.35 : 0.2,
          dashArray: ward.isDesert ? '5, 5' : undefined
        });

        polygon.bindTooltip(
          `<strong>${ward.name}</strong><br/>AES Score: <b>${ward.aesScore}/100</b> ${ward.isDesert ? '⚠️ (Activity Desert)' : ''}<br/>Density: ${ward.populationDensity.toLocaleString()} / km²`,
          { sticky: true }
        );

        wardsLayerRef.current?.addLayer(polygon);
      });
    }
  }, [wards, showWardsChoropleth]);

  // Update Facility Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    facilities.forEach((facility) => {
      // Modern SVG Pin
      const isCritical = facility.conditionStatus === 'Critical Repair Needed';
      const isExcellent = facility.conditionStatus === 'Excellent';
      
      const pinColor = isCritical ? '#EF4444' : isExcellent ? '#10B981' : '#3B82F6';
      const isSelected = selectedFacility?.id === facility.id;

      const customIcon = L.divIcon({
        className: 'custom-facility-marker',
        html: `
          <div style="
            transform: translate(-50%, -100%) scale(${isSelected ? 1.3 : 1});
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            position: relative;
          ">
            <div style="
              background: ${pinColor};
              width: 32px;
              height: 32px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 12px rgba(0,0,0,0.25);
              border: 2px solid white;
            ">
              <div style="
                transform: rotate(45deg);
                color: white;
                font-size: 11px;
                font-weight: 800;
              ">
                ${facility.conditionScore}
              </div>
            </div>
            ${isCritical ? '<div style="position:absolute; top:-4px; right:-4px; width:10px; height:10px; background:#DC2626; border-radius:50%; border:2px solid white; animation: ping 1.5s infinite;"></div>' : ''}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });

      const marker = L.marker([facility.lat, facility.lng], { icon: customIcon });

      // Build popup DOM
      const popupContent = document.createElement('div');
      popupContent.className = 'facility-popup-inner text-slate-800 text-xs';
      popupContent.innerHTML = `
        <div class="font-bold text-sm text-slate-900 leading-tight mb-1">
          ${facility.name}
        </div>
        ${facility.nameHindi ? `<div class="text-[11px] text-slate-500 font-medium mb-1.5">${facility.nameHindi}</div>` : ''}
        
        <div class="flex items-center gap-1.5 mb-2 flex-wrap">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${
            isCritical ? 'bg-red-100 text-red-700' : isExcellent ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
          }">
            Condition: ${facility.conditionScore}% (${facility.conditionStatus})
          </span>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${facility.isFree ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}">
            ${facility.isFree ? '100% FREE' : 'PAID PASS'}
          </span>
        </div>

        <div class="text-[11px] text-slate-600 mb-2">
          <b>Sports:</b> ${facility.sports.join(', ')}<br/>
          <b>Ward:</b> ${facility.wardName}<br/>
          <b>Active Citizens:</b> ${facility.activeUsersNow} currently
        </div>

        <div class="flex items-center gap-2 pt-1 border-t border-slate-100 mt-2">
          <button id="btn-select-${facility.id}" class="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-1 px-2 rounded-md text-[11px]">
            View Details
          </button>
          <button id="btn-report-${facility.id}" class="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-semibold py-1 px-2 rounded-md text-[11px]">
            Report Fix
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 280 });

      marker.on('click', () => {
        onSelectFacility(facility);
      });

      marker.on('popupopen', () => {
        const selectBtn = document.getElementById(`btn-select-${facility.id}`);
        const reportBtn = document.getElementById(`btn-report-${facility.id}`);

        if (selectBtn) {
          selectBtn.onclick = () => onSelectFacility(facility);
        }
        if (reportBtn) {
          reportBtn.onclick = () => onOpenReportForFacility(facility);
        }
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [facilities, selectedFacility]);

  // Handle Highlighted Coordinates (e.g. AI Suggested New Facility Coordinate)
  useEffect(() => {
    if (!mapInstanceRef.current || !highlightedCoordinates) return;

    const [lat, lng] = highlightedCoordinates;
    mapInstanceRef.current.flyTo([lat, lng], 13, { duration: 1.5 });

    // Highlight beacon
    const beaconIcon = L.divIcon({
      className: 'ai-beacon-marker',
      html: `
        <div style="position:relative; width:40px; height:40px;">
          <div style="position:absolute; width:40px; height:40px; background:#10B981; border-radius:50%; opacity:0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position:absolute; top:8px; left:8px; width:24px; height:24px; background:#047857; border:3px solid white; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-size:12px; font-weight:bold; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
            ★
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    const beaconMarker = L.marker([lat, lng], { icon: beaconIcon })
      .bindPopup('<strong>🎯 AI Recommended Site</strong><br/>Optimal location to resolve physical activity desert.')
      .addTo(mapInstanceRef.current);
    
    beaconMarker.openPopup();

    return () => {
      mapInstanceRef.current?.removeLayer(beaconMarker);
    };
  }, [highlightedCoordinates]);

  // Center on selected facility
  useEffect(() => {
    if (selectedFacility && mapInstanceRef.current) {
      mapInstanceRef.current.panTo([selectedFacility.lat, selectedFacility.lng], {
        animate: true,
        duration: 0.8
      });
    }
  }, [selectedFacility]);

  return (
    <div className="relative w-full h-full min-h-[380px] rounded-2xl overflow-hidden shadow-inner border border-slate-200">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Map Legend Overlay */}
      <div className="absolute top-3 right-3 z-[400] bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl shadow-md border border-slate-200 text-[11px] text-slate-700 pointer-events-auto">
        <div className="font-bold text-slate-900 mb-1 text-[11px] flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-orange-500"></span>
          Facility Condition
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Excellent (85-100)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span>Good / Fair (60-84)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <span>Critical Repair (&lt;60)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
