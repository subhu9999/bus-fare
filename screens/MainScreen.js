import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  ActivityIndicator,
  Image,
  Share,
  Linking,
  ScrollView,
  Modal,
} from "react-native";
import Colors from "../constants/Colors";
import { useSelector } from "react-redux";
import Constants from "expo-constants";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import Toast from "react-native-simple-toast";
import {
  AdMobBanner,
  setTestDeviceIDAsync,
  AdMobInterstitial,
} from "expo-ads-admob";
import { GOOGLE_KEY, BING_KEY } from "../api";

import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { AntDesign, Feather, Entypo } from "@expo/vector-icons";

import { TouchableNativeFeedback } from "react-native-gesture-handler";
import { LATEST_DB } from "../constants/Strings";

//set false to use bing api
const useGoogle = true;

const MainScreen = (props) => {
  const [loading, setLoading] = useState(false);
  const [fare, setFare] = useState("");
  const [fareAc, setFareAc] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [fullRoute, setFullRoute] = useState([]);
  const [towards, setTowards] = useState("");
  const [routes, setRoutes] = useState([]);

  const db = SQLite.openDatabase("bus_details.db");

  const AD_URL =
    "https://wa.me/918369912192?text=I'm%20interested%20in%20reselling%20send%20me%20details.";

  const run = async () => {
    await setTestDeviceIDAsync("EMULATOR");
  };

  useEffect(() => {
    run();
    getDataBase();
    // downloadBackupAndReplace();
  }, []);

  const getDataBase = async () => {
    //copy db from assets to android mobile folder

    //change db name when db is updated
    const internalDbName = LATEST_DB; // Call whatever you want
    const sqlDir = FileSystem.documentDirectory + "SQLite/";
    if (!(await FileSystem.getInfoAsync(sqlDir + internalDbName)).exists) {
      console.log("inside");
      await FileSystem.makeDirectoryAsync(sqlDir, { intermediates: true });
      const asset = Asset.fromModule(require("../assets/db/BUS_DETAILS.db"));
      await FileSystem.downloadAsync(asset.uri, sqlDir + internalDbName);
    }
  };

  const { source, destination } = useSelector((state) => state.busStop);

  const disabled = source === null || destination === null;
  let sourceLabel;
  let destinationLabel;
  let route1, route2;

  if (source) {
    let testing = source.split(",").splice(-3);
    sourceLabel = testing[0] + " " + testing[1];
    route1 = testing[0];
    // console.log(testing)
  }
  //extract last 2 words i.e town name & state
  if (destination) {
    let testing = destination.split(",").splice(-3);
    destinationLabel = testing[0] + " " + testing[1];
    route2 = testing[0];
    // console.log(filterCity)
  }

  const handleSource = () => {
    setFare("");
    props.navigation.navigate("Source");
  };

  const handleDestination = () => {
    setFare("");
    props.navigation.navigate("Destination");
  };

  const findRoutes = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT Route FROM ROUTES WHERE Stop like '%COLABA BUS STATION%' AND Route in (SELECT Route FROM ROUTES WHERE Stop like '%SASOON DOCK%')`,
        [],
        // (_, { rows: { _array } }) => console.log(_array)
        (_, { rows: { _array } }) => setRoutes(_array.map((obj) => obj.Route))
        // (_, { rows: { _array } }) => setStops(_array)
      );
    });
  };

  const handleRoute = (route) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM ROUTES WHERE Route="${route}"`,
        [],
        // (_, { rows: { _array } }) => console.log(_array)
        // (_, { rows: { _array } }) => setRoutes(_array.map((obj) => obj.Route))
        (_, { rows: { _array } }) => {
          setFullRoute(_array);
          // setTowards(_array.filter(obj => obj.Order == 1))
          setTowards(_array.filter((obj) => obj.Order == _array.length)[0]);
        }
      );
    });
    setModalVisible(true);
  };

  const calculate = async () => {
    setLoading(true);

    findRoutes();

    const wayPoint1 = encodeURI(source);
    // console.log(wayPoint1);
    const wayPoint2 = encodeURI(destination);

    // console.log(sourceLabel);
    // console.log(route2);

    if (useGoogle) {
      try {
        let response = await fetch(
          //directions api
          `https://maps.googleapis.com/maps/api/directions/json?origin=${wayPoint1}&destination=${wayPoint2}&key=${GOOGLE_KEY}`
        );
        let responseJson = await response.json();
        if (responseJson.status == "OK") {
          // console.log(responseJson.routes[0].legs[0].distance.value);
          const distance = responseJson.routes[0].legs[0].distance.value / 1000;
          let fare;
          let fareAc;
          if (distance > 0 && distance <= 5) {
            fare = 5;
            fareAc = 6;
          } else if (distance > 5 && distance <= 10) {
            fare = 10;
            fareAc = 13;
          } else if (distance > 10 && distance <= 15) {
            fare = 15;
            fareAc = 19;
          } else if (distance > 15) {
            fare = 20;
            fareAc = 25;
          } else {
            fare = 0;
            fareAc = 0;
          }

          setFare(fare);
          setFareAc(fareAc);
          setLoading(false);
        } else {
          setLoading(false);
          Toast.show("No Data Found !");
        }

        return responseJson;
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    } else {
      try {
        let response = await fetch(
          //bing api
          `http://dev.virtualearth.net/REST/v1/Routes?wayPoint.1=${wayPoint1}&waypoint.2=${wayPoint2}&optimize=distance&maxSolutions=1&key=${BING_KEY}`
        );
        let responseJson = await response.json();
        // console.log(responseJson.resourceSets[0].resources[0].travelDistance);
        const distance =
          responseJson.resourceSets[0].resources[0].travelDistance;
        let fare;
        let fareAc;
        if (distance > 0 && distance <= 7) {
          fare = 5;
          fareAc = 6;
        } else if (distance > 7 && distance <= 12) {
          fare = 10;
          fareAc = 13;
        } else if (distance > 12 && distance <= 17) {
          fare = 15;
          fareAc = 19;
        } else if (distance > 17) {
          fare = 20;
          fareAc = 25;
        } else {
          fare = 0;
          fareAc = 0;
        }

        setFare(fare);
        setFareAc(fareAc);
        setLoading(false);
        return responseJson;
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    }

    //     Upto 5 km: Non-AC Rs 5 | AC Rs 6
    // Upto 10 km: Non-AC Rs 10 | AC Rs 13
    // Upto 15 km: Non-AC Rs 15 | AC Rs 19
    // More than 15 km: Non-AC Rs 20 | AC Rs 25
  };

  const modal = (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableHighlight
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginRight: -20,
                marginTop: -20,
              }}
            >
              <AntDesign
                style={{ flexWrap: "wrap" }}
                name="closecircle"
                size={28}
                color="red"
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              />
            </TouchableHighlight>

            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                if (towards == fullRoute[0]) {
                  setTowards(fullRoute[fullRoute.length - 1]);
                } else {
                  setTowards(fullRoute[0]);
                }

                setFullRoute([...fullRoute].reverse());
              }}
            >
              <React.Fragment>
                <Text style={styles.textStyle}>Towards </Text>
                <Text style={styles.textStyle}>
                  <Feather name="chevrons-down" size={20} color="white" />
                  {towards.Stop}
                  <Feather name="chevrons-down" size={20} color="white" />
                </Text>
              </React.Fragment>
            </TouchableHighlight>

            <ScrollView style={{ width: "100%" }}>
              {fullRoute &&
                fullRoute.map((obj, i) => (
                  <Text key={i} style={styles.modalText}>
                    {obj.Stop}
                  </Text>
                ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );

  return (
    <View style={styles.screen}>
      <View
        style={{
          flexDirection: "row",
          marginVertical: 10,
          justifyContent: "space-around",
          width: "100%",
        }}
      >
        <Text style={styles.label}>Source</Text>
        <TouchableOpacity onPress={handleSource} style={{ width: "60%" }}>
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
          // margin: 10,
          justifyContent: "space-around",
          width: "100%",
        }}
      >
        <Text style={styles.label}>Destination</Text>
        <TouchableOpacity onPress={handleDestination} style={{ width: "60%" }}>
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
        <Button
          title="Find Fare"
          color="green"
          onPress={calculate}
          disabled={disabled}
        />
      </View>

      {loading && (
        <ActivityIndicator
          size="large"
          style={{ color: "white", marginVertical: 10 }}
        />
      )}

      {fare.length !== 0 && routes.length > 0 && (
        <ScrollView
          style={{
            alignSelf: "center",
            backgroundColor: Colors.accent,
            marginTop: 50,
            marginBottom: 100,
            width: "95%",
            padding: 15,
          }}
        >
          <View>
            <Text style={styles.title}>Fare</Text>
            <Text style={{ fontSize: 18, marginVertical: 5 }}>
              Non AC - <Text style={styles.fare}>₹ {fare}</Text>
            </Text>
            <Text style={{ fontSize: 18, marginVertical: 5 }}>
              AC - <Text style={styles.fare}>₹ {fareAc}</Text>
            </Text>
          </View>

          {/* <Text style={styles.title}>Available Bus</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {routes &&
              routes.map((route, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.btnRoute}
                  onPress={() => handleRoute(route)}
                >
                  <Text style={styles.route}> {route} </Text>
                </TouchableOpacity>
              ))}
          </View>
          <View
            style={{
              height: 50,
            }}
          ></View> */}
        </ScrollView>
      )}

      {/* <View style={styles.bottomBanner}>
      <AdMobBanner
        bannerSize='fullBanner'
        adUnitID='ca-app-pub-7589498491080333/3846583079'
        servePersonalizedAds={false}
        onDidFailToReceiveAdWithError={(a)=> console.log(a)}
      />
      
      <Text>Ads</Text> 
      </View>*/}

      <TouchableOpacity
        style={{
          ...styles.bottomBanner,
          borderColor: "yellow",
          borderWidth: 1,
          width: "100%",
          height: 90,
        }}
        onPress={() =>
          Linking.openURL(AD_URL).catch((err) =>
            console.error("An error occurred", err)
          )
        }
      >
        <Image
          source={require("../assets/gift_ad.png")}
          style={{ resizeMode: "stretch", width: "100%" }}
        />
      </TouchableOpacity>
      {modal}
    </View>
  );
};

MainScreen.navigationOptions = (navigationData) => {
  const handleShare = () => {
    const text =
      `Only App to find B.E.S.T Bus Fare in Mumbai \n` +
      `\n\n Install App Here - https://play.google.com/store/apps/details?id=com.mumbai.busfarecalculator&hl=en_IN`;

    Share.share({
      message: text,
    });
  };

  const handleFeedback = () => {
    Linking.openURL(
      "mailto:swaptrofficial@gmail.com?subject=Bus%20Fare%20Calculator%20Help&body=This%20Feedback%20Is%20Regarding.."
    );
  };

  const handleAbout = () => {
    Toast.show("Bus Fare Calculator");
  };

  return {
    headerTitle: () => (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Image
          source={require("../assets/icon.png")}
          style={{
            width: 50,
            height: Constants.statusBarHeight + 20,
            resizeMode: "contain",
            marginRight: 5,
          }}
        />
        <Text style={{ color: Colors.accent, fontSize: 22 }}>
          Bus Fare Calculator
        </Text>
      </View>
    ),
    headerRight: () => (
      <View style={{ marginRight: 5 }}>
        <Menu>
          <MenuTrigger>
            <Entypo
              name="dots-three-vertical"
              size={18}
              color={Colors.accent}
            />
          </MenuTrigger>

          <MenuOptions>
            <MenuOption onSelect={handleShare}>
              <Text style={styles.menuOption}>Share App</Text>
            </MenuOption>

            <MenuOption onSelect={handleFeedback}>
              <Text style={styles.menuOption}>Feedback</Text>
            </MenuOption>

            <MenuOption onSelect={handleAbout}>
              <Text style={styles.menuOption}>About</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </View>
    ),
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  label: { color: Colors.accent, fontSize: 18, padding: 10, width: "40%" },
  input: {
    color: Colors.accent,
    borderBottomWidth: 2,
    borderColor: Colors.accent,
    fontSize: 16,
    padding: 5,
  },
  menuOption: { margin: 5 },
  bottomBanner: {
    position: "absolute",
    bottom: 0,
  },
  title: { fontSize: 22, fontWeight: "bold" },
  fare: { fontWeight: "bold", color: "green" },
  route: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 2,
    color: "white",
    alignSelf: "center",
  },
  btnRoute: {
    width: "30%",
    backgroundColor: "#FF4500",
    padding: 4,
    borderRadius: 8,
    marginVertical: 4,
    marginHorizontal: 4,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    width: "80%",
    height: 650,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default MainScreen;
