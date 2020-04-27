import React from "react";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { Platform } from "react-native";
import Colors from "../constants/Colors";
import MainScreen from "../screens/MainScreen";
import SourceScreen from "../screens/SourceScreen";
import DestinationScreen from "../screens/DestinationScreen";

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? Colors.primary : "",
  },
  headerTintColor: Platform.OS === "android" ? Colors.accent : Colors.primary,
};

const MainNavigator = createStackNavigator(
  {
    Main: {
      screen: MainScreen,
      navigationOptions: {
        title: "Bus Fare Calculator",
      },
    },
    Source: {
      screen: SourceScreen
     
    },
    Destination: DestinationScreen,
  },
  {
    defaultNavigationOptions: defaultNavOptions,
  }
);

export default createAppContainer(MainNavigator);
