import React, { useEffect } from "react";
import { View, StyleSheet, Button } from "react-native";
import MapComponent from "@/components/MapComponent";
import useMapStore from "@/store/mapStore";
import { MapMarker, MapPolygon, MapCircle, MapRegion } from "@/types/mapTypes";

const GameMapScreen: React.FC = () => {
  // Type GameMapScreen as a functional component
  const setMarkers = useMapStore((state) => state.setMarkers);
  const setPolygons = useMapStore((state) => state.setPolygons);
  const setCircles = useMapStore((state) => state.setCircles);
  const setRegion = useMapStore((state) => state.setRegion);
  const addMarker = useMapStore((state) => state.addMarker);
  const isDrawingPolygon = useMapStore((state) => state.isDrawingPolygon);
  const startDrawingPolygon = useMapStore((state) => state.startDrawingPolygon);
  const stopDrawingPolygon = useMapStore((state) => state.stopDrawingPolygon);
  const addCoordinateToPolygonDraft = useMapStore(
    (state) => state.addCoordinateToPolygonDraft,
  );

  const removeLastCoordinateFromPolygonDraft = useMapStore(
    (state) => state.removeLastCoordinateFromPolygonDraft,
  );
  const clearPolygonDraft = useMapStore((state) => state.clearPolygonDraft);
  const setFinalPolygon = useMapStore((state) => state.setFinalPolygon);
  const polygonDraftCoordinates = useMapStore(
    (state) => state.polygonDraftCoordinates,
  );

  useEffect(() => {
    // Filled with hard coded defaults for now
    const initialMarkers: MapMarker[] = [
      // Type the array of markers
      {
        coordinate: { latitude: 29.643946, longitude: -82.355659 },
        title: "Marker 1",
        description: "This is UF Campus",
      },
    ];
    setMarkers(initialMarkers);

    const initialPolygons: MapPolygon[] = [
      // Type the array of polygons
      { coordinates: [], fillColor: "rgba(100,200,200,0.3)" }, // Replace with actual coordinates
    ];
    setPolygons(initialPolygons);

    const initialCircles: MapCircle[] = [
      // Type the array of circles
      {
        center: { latitude: 37.78825, longitude: -122.4324 },
        radius: 500,
        fillColor: "rgba(200,100,100,0.3)",
      },
    ];
    setCircles(initialCircles);

    const initialRegion: MapRegion = {
      // Type the region object
      latitude: 29.643946,
      longitude: -82.355659,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
    setRegion(initialRegion);
  }, [setMarkers, setPolygons, setCircles, setRegion]);

  const handleAddMarker = () => {
    const newMarker: MapMarker = {
      // Add a random new coordinate around UF (example purposes only)
      coordinate: {
        latitude: 29.643946 + (0.0125 - Math.random() * 0.025),
        longitude: -82.355659 + (0.0125 - Math.random() * 0.025),
      },
      title: "Dynamic Marker",
      description: "Added dynamically!",
    };
    addMarker(newMarker);
  };

  const handleMapPress = (event: any) => {
    if (isDrawingPolygon) {
      const coordinate = event.nativeEvent.coordinate;
      addCoordinateToPolygonDraft(coordinate);
    }
  };

  const handleStartDrawing = () => {
    startDrawingPolygon();
  };

  const handleStopDrawing = () => {
    stopDrawingPolygon();
    // Optionally finalize the polygon and store it in 'polygons' state
    if (polygonDraftCoordinates.length >= 3) {
      const newPolygon: MapPolygon = {
        coordinates: polygonDraftCoordinates,
        fillColor: "rgba(0, 255, 0, 0.3)",
        strokeColor: "green",
        strokeWidth: 3,
      }; // Example final polygon style
      setFinalPolygon([newPolygon]); // Or use addPolygon if you want to keep existing polygons
    }
  };

  const handleClearDraft = () => {
    clearPolygonDraft();
  };

  const handleRemoveLastPoint = () => {
    removeLastCoordinateFromPolygonDraft();
  };

  return (
    <View style={styles.container}>
      <MapComponent onPress={handleMapPress} />
      {/* Pass handleMapPress to MapComponent */}
      <View style={styles.buttonContainer}>
        <Button
          title={isDrawingPolygon ? "Stop Drawing" : "Start Drawing Polygon"}
          onPress={isDrawingPolygon ? handleStopDrawing : handleStartDrawing}
        />
        {isDrawingPolygon && (
          <>
            <Button title="Clear Draft" onPress={handleClearDraft} />
            <Button title="Remove Last Point" onPress={handleRemoveLastPoint} />
          </>
        )}
      </View>
      <Button title="Add Marker" onPress={handleAddMarker} />
      {/* Keep the add marker button for testing */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
  },
});

export default GameMapScreen;
