import React, { useState ,useEffect} from "react";
import { View, StyleSheet, Text, FlatList,TouchableOpacity ,TextInput,SafeAreaView} from "react-native";
import BusStops from "../constants/BusStops";
import Colors from '../constants/Colors'
import {useDispatch} from 'react-redux';
import { setSource } from "../store/actions/busActions";
import * as SQLite from "expo-sqlite";

const SourceScreen = (props) => {
  const [stops, setStops] = useState([]);
  const [tempStops,setTempStops] = useState(BusStops);
  const [loading,setLoading] = useState(false);

  const dispatch = useDispatch()

  const db = SQLite.openDatabase("bus_details.db");
  const run = async()=>{
    // await setTestDeviceIDAsync('EMULATOR');
  }

  useEffect(()=>{
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
  },[])

  const onSelect = (stop) => {
    //save to redux
    dispatch(setSource(stop))
    props.navigation.popToTop()
  }

  //god logic - make sure to use in swaptr
  const search = (text) => {
    // const filteredStops = tempStops.filter(stop => {
    //   let stopLowerCase = stop.toLowerCase();

    //   let searchLowerCase = text.toLowerCase();

    //   return stopLowerCase.indexOf(searchLowerCase) > -1;
    // })

    // setStops(filteredStops)

    db.transaction(tx => {
      tx.executeSql(
        `SELECT * from STOPS_TABLE WHERE Stop like '%${text}%';`,
        [],
        // (_, { rows: { _array } }) => console.log( _array ),
      // (_, { rows: { _array } }) => setStops(_array.map(obj => obj.stop_names))
      (_, { rows: { _array } }) => setStops(_array)
      );
    });
  };

  return (
    <View style={{ flex: 1 }}>
    <SafeAreaView style={{ backgroundColor: '#2f363c' }} />
    <TextInput
        style={styles.input}
        placeholder="Search"
        autoFocus={true}
        onChangeText={(text) => search(text)}
      />

    
    <View style={{ flex: 1, backgroundColor: '#2f363c' }}>
      {loading ? (
        <View
          style={{
            ...StyleSheet.absoluteFill,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ActivityIndicator size="large" color="#bad555" />
        </View>
      ) : null}
      <FlatList
        data={stops}
        renderItem={({ item,index }) => (
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
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 50
            }}
          >
            <Text style={{ color: '#bad555' }}>No Bus Stop Found</Text>
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
  input:{
    backgroundColor: Colors.accent,
    fontSize: 22,
    padding: 8,
    marginVertical: 10,
  }
});

export default SourceScreen;
