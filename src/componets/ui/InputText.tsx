import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  type TextInputProps,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { createStyles } from "./InputText.styles";

type InputTextProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  leftIcon?: React.ComponentProps<typeof Feather>["name"];
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps["keyboardType"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
  editable?: boolean;
  returnKeyType?: TextInputProps["returnKeyType"];
  onSubmitEditing?: () => void;
};

export default function InputText({
  label,
  value,
  onChangeText,
  onBlur,
  error,
  placeholder,
  leftIcon,
  multiline = false,
  numberOfLines = 4,
  secureTextEntry = false,
  keyboardType,
  autoCapitalize,
  editable = true,
  returnKeyType,
  onSubmitEditing,
}: InputTextProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [focused, setFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const wrapperStyles = [
    styles.inputWrapper,
    multiline && styles.inputWrapperMultiline,
    focused && styles.inputWrapperFocused,
    !!error && styles.inputWrapperError,
    !editable && styles.inputWrapperDisabled,
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={wrapperStyles}>
        {leftIcon && (
          <Feather
            name={leftIcon}
            size={theme.iconSize.lg}
            color={error ? theme.colors.error : theme.colors.textSecondary}
            style={styles.inputIcon}
          />
        )}
        <TextInput
          style={[styles.input, multiline && styles.inputMultiline]}
          value={value}
          onChangeText={onChangeText}
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          secureTextEntry={secureTextEntry && !passwordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Feather
              name={passwordVisible ? "eye" : "eye-off"}
              size={theme.iconSize.lg}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}
