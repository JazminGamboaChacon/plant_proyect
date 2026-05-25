import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { Category } from "../../types-dtos/user.types";
import { createStyles } from "./CategoryButton.styles";

export default function CategoryButton({ imageUrl, name, count, icon }: Category) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [imageError, setImageError] = useState(false);
  const showIcon = !imageUrl || imageError;

  return (
    <TouchableOpacity style={styles.categoryBtn} activeOpacity={0.75}>
      <View style={styles.categoryIconBg}>
        {showIcon ? (
          <MaterialCommunityIcons name={icon as any} size={32} color={theme.colors.primary} />
        ) : (
          <Image
            source={{ uri: imageUrl }}
            style={styles.categoryImage}
            onError={() => setImageError(true)}
          />
        )}
      </View>
      <Text style={styles.categoryName}>{name}</Text>
      <Text style={styles.categoryCount}>{count}</Text>
    </TouchableOpacity>
  );
}
