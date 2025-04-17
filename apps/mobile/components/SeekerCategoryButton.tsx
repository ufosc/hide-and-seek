import React from "react";
import { Pressable, View, Text } from "react-native";

type SeekerCategoryButtonProps = {
  icon: React.ReactNode;
  onPress?: () => void;
  size?: number;
  disabled?: boolean;
  className?: string;
  text?: string;
};

export default function SeekerCategoryButton({
  icon,
  onPress,
  size = 60,
  disabled = false,
  className = "",
  text = "",
}: SeekerCategoryButtonProps) {
  return (
    <View className="flex flex-col items-center justify-center">
      <Pressable
        className={`rounded-full  bg-[#1D162E] items-center justify-center p-6 flex ${
          disabled ? "opacity-50" : ""
        } ${className}`}
        style={{
          width: size,
          height: size,
        }}
        onPress={onPress}
        disabled={disabled}
      >
        {icon}
      </Pressable>
      <Text className="text-white">{text}</Text>
    </View>
  );
}
