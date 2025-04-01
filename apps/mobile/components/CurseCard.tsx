import { View, Text } from "react-native";

export interface CurseCardProps {
  title?: string;
  description?: string;
  castingCost?: string;
}
export default function CurseCard({
  title,
  description,
  castingCost,
}: CurseCardProps) {
  return (
    <View className="flex flex-col items-start justify-center bg-white gap-y-10 px-10 py-10 rounded-2xl flex-grow h-5/6">
      <Text className="text-black text-3xl">{title}</Text>
      <Text className="text-black text-xl mt-2">{description}</Text>
      <Text className="text-black text-xl mt-2">
        Casting Cost: {castingCost}
      </Text>
    </View>
  );
}
