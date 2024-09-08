import { StyleSheet, TextInput, View } from "react-native";
import React from "react";
import { Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("screen").width;

const SearchBar = ({ value, onchangetext, onBackspacePress, on }) => {
  const handleKeyPress = (key) => {
    onBackspacePress();
  };
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={24} color="#aaa" style={styles.icon} />
      <TextInput
        value={value}
        onChangeText={onchangetext}
        style={styles.textinput}
        placeholder="Search City"
        placeholderTextColor="gray"
        onKeyPress={handleKeyPress}
      />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff33",
    width: screenWidth / 1.35,
    height: 40,
    borderRadius: 7,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  textinput: {
    flex: 1,
    height: "100%",
    color: "#fff",
  },
});
