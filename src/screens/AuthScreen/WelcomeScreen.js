import React, { useEffect, useContext } from "react";
import { Text, StyleSheet, View, ActivityIndicator } from "react-native";
import { Context as AuthContext } from "../../context/AuthContext";
import { settings } from "~/config";
import { getCity, getPhoneHelp } from "~/api/AccountAPI";
import { getRelationships } from "~/api/RenterAPI";

const WelcomeScreen = ({ navigation }) => {
  const { state, signInLocalToken } = useContext(AuthContext);
  console.log("AuthContext", state);

  const loadOptions = async () => {
    const [resProvinces, resRelationships, resPhoneHelp] = await Promise.all([
      getCity(),
      getRelationships(),
      getPhoneHelp()
    ]);
    settings.cityLists = resProvinces?.Data ?? [];
    settings.relationLists = resRelationships?.Data ?? [];
    settings.phoneHelp =  resPhoneHelp?.Data.phone ?? [];
  };

  useEffect(() => {
    signInLocalToken();
    loadOptions();
  }, []);
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
};

const styles = StyleSheet.create({});

export default WelcomeScreen;
