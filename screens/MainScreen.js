import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Colors from "../constants/Colors";
import { useSelector } from "react-redux";

const MainScreen = (props) => {
  const [loading, setLoading] = useState(false);

  const { source, destination } = useSelector((state) => state.busStop);

  let sourceLabel;
  let destinationLabel;

  if (source) {
    let testing = source.split(",").splice(-3);
    sourceLabel = testing[0] + " " + testing[1];
    // console.log(filterCity)
  }
  //extract last 2 words i.e town name & state
  if (destination) {
    let testing = destination.split(",").splice(-3);
    destinationLabel = testing[0] + " " + testing[1];
    // console.log(filterCity)
  }

  const handleSource = () => {
    props.navigation.navigate("Source");
  };

  const handleDestination = () => {
    props.navigation.navigate("Destination");
  };

  const calculate = async () => {
    setLoading(true);

    const key =
      "AnPSIKEpw6oTQZGAOVik_RSMIDsa6FhOwRpzSa__hHFs3sZCxhIWSKl7spFcw4KI";
    const wayPoint1 = encodeURI(source);
    // console.log(wayPoint1);
    const wayPoint2 = encodeURI(destination);

    try {
      let response = await fetch(
        `http://dev.virtualearth.net/REST/v1/Routes?wayPoint.1=${wayPoint1}&waypoint.2=${wayPoint2}&maxSolutions=1&key=${key}`
      );
      let responseJson = await response.json();
      console.log(responseJson.resourceSets[0].resources[0].travelDistance);
      setLoading(false);
      return responseJson;
    } catch (error) {
      setLoading(false);
      console.error(error);
    }

//     Upto 5 km: Non-AC Rs 5 | AC Rs 6
// Upto 10 km: Non-AC Rs 10 | AC Rs 13
// Upto 15 km: Non-AC Rs 15 | AC Rs 19
// More than 15 km: Non-AC Rs 20 | AC Rs 25
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
            value={sourceLabel}
            selection={{ start: 0 }}
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
            value={destinationLabel}
            selection={{ start: 0 }}
          />
        </TouchableOpacity>
      </View>

      <View style={{ width: "50%", alignSelf: "center", marginTop: 50 }}>
        <Button title="Find Fare" color="green" onPress={calculate} />
      </View>

      {loading && (
        <ActivityIndicator
          size="large"
          style={{ color: "white", marginVertical: 10 }}
        />
      )}
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
    fontSize: 16,
    padding: 5,
  },
});

export default MainScreen;
