import { LatLng, Region } from "react-native-maps";

export interface MapRegion extends Region {} // Re-export Region type for convenience and potential extension

export interface MapMarker {
  coordinate: LatLng;
  title?: string;
  description?: string;
  // Add any other properties Marker might need
}

export interface MapPolygon {
  coordinates: LatLng[];
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  // Add any other Polygon specific properties
}

export interface MapCircle {
  center: LatLng;
  radius: number;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  // Add any other Circle specific properties
}
