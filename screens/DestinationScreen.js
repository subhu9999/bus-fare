import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from "react-native";
import BusStops from "../constants/BusStops";
import Colors from "../constants/Colors";
import { useDispatch } from "react-redux";
import { setDestination } from "../store/actions/busActions";
import {AdMobBanner, setTestDeviceIDAsync,AdMobInterstitial} from 'expo-ads-admob';

const DestinationScreen = (props) => {
  const [stops, setStops] = useState(BusStops);
  const [tempStops, setTempStops] = useState(BusStops);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const run = async()=>{
    await setTestDeviceIDAsync('EMULATOR');
  }

  useEffect(() => {
    run();

    return () => displayAd();
  }, []);

  const displayAd = async () => {
    // Display an interstitial
    await AdMobInterstitial.setAdUnitID(
      //test
      // "ca-app-pub-3940256099942544/1033173712"
      //production
      "ca-app-pub-7589498491080333/6559474302"
    ); // Test ID, Replace with your-admob-unit-id
    await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
    await AdMobInterstitial.showAdAsync();
  };

  const onSelect = (stop) => {
    //save to redux
    dispatch(setDestination(stop));
    props.navigation.popToTop();
  };

  //god logic - make sure to use in swaptr
  const search = (text) => {
    const filteredStops = tempStops.filter((stop) => {
      let stopLowerCase = stop.toLowerCase();

      let searchLowerCase = text.toLowerCase();

      return stopLowerCase.indexOf(searchLowerCase) > -1;
    });

    setStops(filteredStops);
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ backgroundColor: "#2f363c" }} />
      <TextInput
        style={styles.input}
        placeholder="Search"
        autoFocus={true}
        onChangeText={(text) => search(text)}
      />

      <View style={{ flex: 1, backgroundColor: "#2f363c" }}>
        {loading ? (
          <View
            style={{
              ...StyleSheet.absoluteFill,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size="large" color="#bad555" />
          </View>
        ) : null}
        <FlatList
          data={stops}
          renderItem={({ item, index }) => (
            <TouchableOpacity key={index} onPress={() => onSelect(item)}>
              <Text
                style={{
                  color: Colors.accent,
                  marginVertical: 5,
                  marginHorizontal: 4,
                }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={() => (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 50,
              }}
            >
              <Text style={{ color: "#bad555" }}>No Bus Stop Found</Text>
            </View>
          )}
          keyboardShouldPersistTaps="always"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  input: {
    backgroundColor: Colors.accent,
    fontSize: 22,
    padding: 8,
    marginVertical: 10,
  },
});

export default DestinationScreen;
