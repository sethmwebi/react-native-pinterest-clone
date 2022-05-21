import { StyleSheet, Image, ScrollView, useWindowDimensions } from "react-native";
import { useState } from "react"

import Pin from "./Pin";
import { View } from "./Themed";

interface IMasonryList {
  pins: {
    id: string;
    image: string;
    title: string;
  }[];
}
const MasonryList = ({ pins }: IMasonryList) => {
  const { width } = useWindowDimensions()
  const numColumns = Math.ceil(width / 350);

  console.log(width)

  return (
    <ScrollView>
      <View style={styles.container}>
        {Array.from(Array(numColumns)).map((_, colIndex) => (
          <View style={styles.column} key={colIndex}>
            {pins
              .filter((_, index) => index % numColumns === colIndex)
              .map((pin) => (
                <Pin pin={pin} key={pin.id} />
              ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default MasonryList;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: "row",
  },
  column: {
    flex: 1,
  },
});
