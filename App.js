import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MainNavigator from "./navigation/MainNavigator";
import { enableScreens } from "react-native-screens";
import { createStore, combineReducers } from "redux";
import busReducer from "./store/reducers/busReducer";
import { Provider } from "react-redux";
import { MenuProvider } from "react-native-popup-menu";

enableScreens();

const rootReducer = combineReducers({
  busStop: busReducer,
});

const store = createStore(rootReducer);

export default function App() {
  return (
    <Provider store={store}>
      <MenuProvider>
        <MainNavigator />
      </MenuProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
