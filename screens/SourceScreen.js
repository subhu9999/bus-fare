import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Colors from "../constants/Colors";
import BusStops from "../constants/BusStops";

const SourceScreen = (props) => {
  const [stops, setStops] = useState(BusStops);

  const search = (text) => {
    // console.log(text)
  };

  return (
    <View style={styles.screen}>
      <TextInput
        style={{
          backgroundColor: Colors.accent,
          fontSize: 22,
          padding: 8,
          marginVertical: 10,
        }}
        placeholder="Search"
        autoFocus={true}
        onChangeText={(text) => search(text)}
      />
      {stops &&
        stops.map((stop, index) => (
              <TouchableOpacity 
              key={index}
              
              >
            <Text
              style={{ color: Colors.accent, marginVertical: 5,marginHorizontal:4 }}
            >
              {stop}
            </Text>
          </TouchableOpacity>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});

export default SourceScreen;
