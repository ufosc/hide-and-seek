import React from "react";
import { Pressable, Text, PressableProps } from "react-native";

interface ButtonProps extends PressableProps {
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <Pressable
      className={`rounded-lg bg-gray-800 px-4 py-4 ${props.disabled ? "opacity-50" : ""} ${className}`}
      {...props}
    >
      {typeof children === "string" ? (
        <Text className="text-white font-medium text-center text-sm">
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
};

export default Button;
