import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  View,
  Modal,
  Text,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";

const Dice = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [diceType, setDiceType] = useState<string | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  // Handle closing the popup when clicking outside
  const handleOutsideClick = () => {
    setShowPopup(false);
  };

  // Function to roll dice with animation
  const rollDice = (sides: number, type: string) => {
    setIsRolling(true);
    setDiceType(type);

    // Simulate rolling animation with multiple values
    let rollCount = 0;
    const maxRolls = 10;
    rollIntervalRef.current = setInterval(() => {
      const tempResult = Math.floor(Math.random() * sides) + 1;
      setDiceResult(tempResult);

      rollCount++;
      if (rollCount >= maxRolls) {
        if (rollIntervalRef.current) {
          clearInterval(rollIntervalRef.current);
          rollIntervalRef.current = null;
        }
        setIsRolling(false);
      }
    }, 100);
  };

  // Cleanup interval on component unmount
  useEffect(() => {
    return () => {
      if (rollIntervalRef.current) {
        clearInterval(rollIntervalRef.current);
      }
    };
  }, []);
  // Reset result when popup closes
  useEffect(() => {
    if (!showPopup) {
      setDiceResult(null);
      setDiceType(null);
    }
  }, [showPopup]);

  return (
    <>
      {/* Toggle Button */}
      <TouchableOpacity
        className="absolute bottom-20 left-5 bg-blue-500 w-12 h-12 rounded-full items-center justify-center z-50 shadow-md"
        onPress={() => setShowPopup(!showPopup)}
      >
        <Text className="text-white text-2xl font-bold">🎲</Text>
      </TouchableOpacity>

      {/* Popup Modal */}
      <Modal
        transparent={true}
        visible={showPopup}
        animationType="fade"
        onRequestClose={() => setShowPopup(false)}
      >
        <TouchableWithoutFeedback onPress={handleOutsideClick}>
          <View className="flex-1 justify-center items-center bg-black/50">
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View className="bg-gray-800 rounded-lg p-5 items-center w-4/5 shadow-lg">
                <Text className="text-white text-lg mb-5">
                  Dice Roll Options
                </Text>

                {/* Dice result display */}
                {diceResult !== null && (
                  <View className="bg-gray-700 w-full py-3 px-4 rounded-lg mb-5 items-center">
                    <Text className="text-gray-400 text-sm">
                      {diceType} Result:
                    </Text>
                    <Text
                      className={`text-white text-3xl font-bold ${isRolling ? "opacity-70" : ""}`}
                    >
                      {diceResult}
                    </Text>
                  </View>
                )}

                <View className="flex-row justify-around w-full mb-4">
                  <TouchableOpacity
                    className={`bg-blue-500 p-3 rounded-md ${isRolling ? "opacity-50" : ""}`}
                    onPress={() => rollDice(6, "D6")}
                    disabled={isRolling}
                  >
                    <Text className="text-white font-bold">Roll D6</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className={`bg-purple-500 p-3 rounded-md ${isRolling ? "opacity-50" : ""}`}
                    onPress={() => rollDice(20, "D20")}
                    disabled={isRolling}
                  >
                    <Text className="text-white font-bold">Roll D20</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  className="bg-red-500 py-2 px-5 rounded-md mt-3"
                  onPress={() => setShowPopup(false)}
                >
                  <Text className="text-white font-bold">Close</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default Dice;
