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
  const hasBackgroundColor = className.includes("bg-");
  return (
    <Pressable
      className={`rounded-lg px-4 py-4 ${props.disabled ? "opacity-80" : ""} ${!hasBackgroundColor ? "bg-secondary" : ""} ${className}`}
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
