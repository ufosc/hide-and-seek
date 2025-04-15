import React, { useMemo } from "react";
import MapView, { Marker, Polygon, Circle, PROVIDER_GOOGLE } from "react-native-maps";
import useMapStore from "../store/mapStore";
import {
  MapMarker,
  MapPolygon,
  MapCircle,
  MapRegion,
} from "@repo/shared-types/maps";
import { useLocation } from "@/hooks/useLocation";

import { LatLng } from "react-native-maps";

interface MapComponentProps {
  onPress?: (event: any) => void;
  showsUserLocation?: boolean;
}

const MapComponent: React.FC<MapComponentProps> = ({ onPress, showsUserLocation = true }) => {
  const region = useMapStore((state) => state.region);
  const setRegion = useMapStore((state) => state.setRegion);
  const markers = useMapStore((state) => state.markers);
  const polygons = useMapStore((state) => state.polygons);
  const circles = useMapStore((state) => state.circles);
  const onMapReadyHandler = useMapStore((state) => state.onMapReadyHandler);
  const isDrawingPolygon = useMapStore((state) => state.isDrawingPolygon);
  const polygonDraftCoordinates = useMapStore(
    (state) => state.polygonDraftCoordinates
  );
  const userLocation = useMapStore((state) => state.userLocation);

  // Initialize location tracking
  useLocation();

  // THIS IS NEEDED DUE TO REACT NATIVE MAPS NOT SUPPORTING FABRIC (New Architecture used in Expo 52)
  // REMOVE mapKey WHEN MOVING TO DEV BUILDS
  const mapKey = useMemo(() => {
    return Date.now().toString();
  }, [
    markers,
    polygons,
    circles,
    isDrawingPolygon,
    polygonDraftCoordinates,
    userLocation,
  ]);

  // Center map on user location when it's available for the first time
  React.useEffect(() => {
    if (userLocation && userLocation.latitude && userLocation.longitude) {
      setRegion({
        ...region,
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      });
    }
  }, [userLocation?.latitude, userLocation?.longitude]);

  return (
    <MapView
      key={mapKey}
      style={{ flex: 1 }}
      region={region}
      onRegionChangeComplete={(newRegion: MapRegion) => setRegion(newRegion)}
      onMapReady={onMapReadyHandler}
      onPress={isDrawingPolygon && onPress ? onPress : undefined}
      userInterfaceStyle="dark"
      showsUserLocation={showsUserLocation}
      showsMyLocationButton={true}
      followsUserLocation={true}
    >
      {/* Existing Markers, Polygons, Circles rendering... */}
      {markers.map((marker: MapMarker, index) => (
        <Marker
          key={index}
          coordinate={marker.coordinate}
          title={marker.title?.toString() || ""}
          description={marker.description?.toString() || ""}
        />
      ))}
      {polygons.map((polygon: MapPolygon, index) => (
        <Polygon
          key={index}
          coordinates={polygon.coordinates}
          fillColor={polygon.fillColor}
          strokeColor={polygon.strokeColor}
          strokeWidth={polygon.strokeWidth}
        />
      ))}
      {circles.map((circle: MapCircle, index) => (
        <Circle
          key={index}
          center={circle.center}
          radius={circle.radius}
          fillColor={circle.fillColor}
          strokeColor={circle.strokeColor}
          strokeWidth={circle.strokeWidth}
        />
      ))}

      {/* Render the draft polygon itself (only if 3+ points) */}
      {polygonDraftCoordinates.length > 2 && (
        <Polygon
          coordinates={polygonDraftCoordinates}
          fillColor="rgba(255, 0, 0, 0.5)"
          strokeColor="red"
          strokeWidth={2}
        />
      )}

      {/* **Render Draft Points as Markers** */}
      {isDrawingPolygon &&
        polygonDraftCoordinates.map((coordinate: LatLng, index) => (
          <Marker // Render a Marker for each point in the draft
            key={`draft-point-${index}`}
            coordinate={coordinate}
            pinColor="blue" // Example: Blue markers for draft points
            opacity={0.8}
          />
        ))}
    </MapView>
  );
};

export default MapComponent;
