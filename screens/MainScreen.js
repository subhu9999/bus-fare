import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Colors from "../constants/Colors";

const MainScreen = (props) => {
  const handleSource = () => {
    props.navigation.navigate("Source");
  };

  const handleDestination = () => {
    props.navigation.navigate("Destination");
  };

  return (
    <View style={styles.screen}>
      <View
        style={{
          flexDirection: "row",
          margin: 10,
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.label}>Source</Text>
        <TouchableOpacity onPress={handleSource} style={{ width: "70%" }}>
          <TextInput
            placeholder="Select Bus Stop"
            placeholderTextColor={Colors.secondaryText}
            style={styles.input}
            editable={false}
          />
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: "row",
          margin: 10,
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.label}>Destination</Text>
        <TouchableOpacity onPress={handleDestination} style={{ width: "70%" }}>
          <TextInput
            placeholder="Select Bus Stop"
            placeholderTextColor={Colors.secondaryText}
            style={styles.input}
            editable={false}
          />
        </TouchableOpacity>
      </View>

      <View style={{ width: "50%", alignSelf: "center", marginTop: 50 }}>
        <Button title="Find Fare" color="green" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  label: { color: Colors.accent, fontSize: 18, padding: 10 },
  input: {
    color: Colors.accent,
    borderBottomWidth: 2,
    borderColor: Colors.accent,
    fontSize: 22,
    padding: 5,
  },
});

export default MainScreen;
