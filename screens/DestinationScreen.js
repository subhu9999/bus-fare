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
import Colors from "../constants/Colors";
import { useDispatch } from "react-redux";
import { setDestination } from "../store/actions/busActions";
import {AdMobBanner, setTestDeviceIDAsync,AdMobInterstitial} from 'expo-ads-admob';
import * as SQLite from "expo-sqlite";
import { LATEST_DB } from "../constants/Strings";

const DestinationScreen = (props) => {
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  //change db name when update db 
  const db = SQLite.openDatabase(LATEST_DB);

  const run = async()=>{
    await setTestDeviceIDAsync('EMULATOR');
  }

  useEffect(() => {
    run();
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * from STOPS_TABLE WHERE Stop like '%%';`,
        [],
        (_, { rows: { _array } }) => setStops(_array)
        // (_, { rows: { _array } }) => console.log(_array)
        );
    });

    // return () => displayAd();
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
 
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * from STOPS_TABLE WHERE Stop like '%${text}%';`,
        [],
      (_, { rows: { _array } }) => setStops(_array)
      );
    });
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
            <TouchableOpacity key={index} onPress={() => onSelect(item.Stop)}>
              <Text
                style={{
                  color: Colors.accent,
                  marginVertical: 5,
                  marginHorizontal: 4,
                }}
              >
                {item.Stop}
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
