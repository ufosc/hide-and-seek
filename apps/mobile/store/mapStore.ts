import { create } from "zustand";
import {
  MapRegion,
  MapMarker,
  MapPolygon,
  MapCircle,
} from "@repo/shared-types/mapTypes";

import { LatLng } from "react-native-maps";

interface MapState {
  region: MapRegion;
  markers: MapMarker[];
  polygons: MapPolygon[];
  circles: MapCircle[];
  userLocation: { latitude: number | null; longitude: number | null } | null;
  isMapReady: boolean;

  isDrawingPolygon: boolean; // New state: Flag to indicate if drawing polygon
  polygonDraftCoordinates: LatLng[]; // New state: Coordinates of polygon being drawn
}

interface MapActions {
  setRegion: (newRegion: MapRegion) => void;
  setMarkers: (newMarkers: MapMarker[]) => void;
  addMarker: (newMarker: MapMarker) => void;
  removeMarker: (markerToRemove: MapMarker) => void;
  setPolygons: (newPolygons: MapPolygon[]) => void;
  addPolygon: (newPolygon: MapPolygon) => void;
  removePolygon: (polygonToRemove: MapPolygon) => void;
  setCircles: (newCircles: MapCircle[]) => void;
  addCircle: (newCircle: MapCircle) => void;
  removeCircle: (circleToRemove: MapCircle) => void;
  setUserLocation: (
    location: { latitude: number; longitude: number } | null,
  ) => void;
  setIsMapReady: (ready: boolean) => void;
  onMapReadyHandler: () => void;

  // New actions for polygon drawing
  startDrawingPolygon: () => void;
  stopDrawingPolygon: () => void;
  addCoordinateToPolygonDraft: (coordinate: LatLng) => void;
  removeLastCoordinateFromPolygonDraft: () => void;
  clearPolygonDraft: () => void;
  setFinalPolygon: (finalPolygon: MapPolygon[]) => void; // Action to set the finalized polygon (if needed)
}

const useMapStore = create<MapState & MapActions>((set, get) => ({
  region: {
    latitude: 29.43946,
    longitude: -82.355659,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  markers: [],
  polygons: [],
  circles: [],
  userLocation: null,
  isMapReady: false,

  isDrawingPolygon: false, // Initial state for polygon drawing
  polygonDraftCoordinates: [], // Initial state for polygon draft coordinates

  setRegion: (newRegion) => set({ region: newRegion }),
  setMarkers: (newMarkers) => set({ markers: newMarkers }),
  addMarker: (newMarker) =>
    set((state) => ({ markers: [...state.markers, newMarker] })),
  removeMarker: (markerToRemove) =>
    set((state) => ({
      markers: state.markers.filter((marker) => marker !== markerToRemove),
    })),
  setPolygons: (newPolygons) => set({ polygons: newPolygons }),
  addPolygon: (newPolygon) =>
    set((state) => ({ polygons: [...state.polygons, newPolygon] })),
  removePolygon: (polygonToRemove) =>
    set((state) => ({
      polygons: state.polygons.filter((marker) => marker !== polygonToRemove),
    })),
  setCircles: (newCircles) => set({ circles: newCircles }),
  addCircle: (newCircle) =>
    set((state) => ({ circles: [...state.circles, newCircle] })),
  removeCircle: (circleToRemove) =>
    set((state) => ({
      circles: state.circles.filter((circle) => circle !== circleToRemove),
    })),
  setUserLocation: (location) => set({ userLocation: location }),
  setIsMapReady: (ready) => set({ isMapReady: ready }),
  onMapReadyHandler: () => {
    set({ isMapReady: true });
    console.log("Map is ready!");
  },

  // Polygon Drawing Actions
  startDrawingPolygon: () =>
    set({ isDrawingPolygon: true, polygonDraftCoordinates: [] }), // Start drawing, clear old draft
  stopDrawingPolygon: () => set({ isDrawingPolygon: false }),
  addCoordinateToPolygonDraft: (coordinate) =>
    set((state) => {
      if (state.isDrawingPolygon) {
        // Only add if drawing is active
        return {
          polygonDraftCoordinates: [
            ...state.polygonDraftCoordinates,
            coordinate,
          ],
        };
      }
      return {}; // Otherwise, don't change state
    }),
  removeLastCoordinateFromPolygonDraft: () =>
    set((state) => ({
      polygonDraftCoordinates: state.polygonDraftCoordinates.slice(0, -1), // Remove last element
    })),
  clearPolygonDraft: () => set({ polygonDraftCoordinates: [] }),
  setFinalPolygon: (finalPolygons) => set({ polygons: finalPolygons }), // If you want to finalize and store polygon
}));

export default useMapStore;
