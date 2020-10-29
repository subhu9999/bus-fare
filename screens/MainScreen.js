import React, { useState,useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Share,
  Linking
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
import { Entypo } from "@expo/vector-icons";
import Toast from 'react-native-simple-toast';
import {AdMobBanner, setTestDeviceIDAsync,AdMobInterstitial} from 'expo-ads-admob';

const MainScreen = (props) => {
  const [loading, setLoading] = useState(false);
  const [fare, setFare] = useState("");
  const [fareAc, setFareAc] = useState("");

  const AD_URL = "https://wa.me/918369912192?text=I'm%20interested%20in%20reselling%20send%20me%20details.";
  
  const run = async()=>{
    await setTestDeviceIDAsync('EMULATOR');
  }

  useEffect(()=>{
   run() 
  })

  const { source, destination } = useSelector((state) => state.busStop);

  const disabled = source === null || destination === null;
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
    setFare("");
    props.navigation.navigate("Source");
  };

 

  const handleDestination = () => {
    setFare("");
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
        `http://dev.virtualearth.net/REST/v1/Routes?wayPoint.1=${wayPoint1}&waypoint.2=${wayPoint2}&optimize=distance&maxSolutions=1&key=${key}`
      );
      let responseJson = await response.json();
      // console.log(responseJson.resourceSets[0].resources[0].travelDistance);
      const distance = responseJson.resourceSets[0].resources[0].travelDistance;
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
          marginVertical: 10,
          justifyContent: "space-around",
          width:'100%'
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
          width:'100%'
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

      {fare.length !== 0 && (
        <View
          style={{
            alignSelf: "center",
            backgroundColor: Colors.accent,
            marginTop: 50,
            width: "95%",
            padding: 10,
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>Fare</Text>
          <Text style={{ fontSize: 18, marginVertical: 5 }}>
            Non AC - <Text style={{ fontWeight: "bold" }}>₹ {fare}</Text>
          </Text>
          <Text style={{ fontSize: 18, marginVertical: 5 }}>
            AC - <Text style={{ fontWeight: "bold" }}>₹ {fareAc}</Text>
          </Text>
        </View>
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
    
      Linking.openURL('mailto:swaptrofficial@gmail.com?subject=Bus%20Fare%20Calculator%20Help&body=This%20Feedback%20Is%20Regarding..')
  };

  const handleAbout = () => {
    Toast.show("Bus Fare Calculator")
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
      <View style={{marginRight:5}}>
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
  label: { color: Colors.accent, fontSize: 18, padding: 10 ,width:'40%'},
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
    bottom: 0
  }
});

export default MainScreen;
