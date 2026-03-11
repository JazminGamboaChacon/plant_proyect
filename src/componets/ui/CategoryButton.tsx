import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { Category } from "../../types-dtos/user.types";
import { createStyles } from "./CategoryButton.styles";

export default function CategoryButton({ imageUrl, name, count }: Category) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <TouchableOpacity style={styles.categoryBtn} activeOpacity={0.75}>
      <View style={styles.categoryIconBg}>
        <Image source={{ uri: imageUrl }} style={styles.categoryImage} />
      </View>
      <Text style={styles.categoryName}>{name}</Text>
      <Text style={styles.categoryCount}>{count}</Text>
    </TouchableOpacity>
  );
}
