import React, { useEffect, useContext } from "react";
import { Text, StyleSheet, View, ActivityIndicator } from "react-native";
import { Context as AuthContext } from "../../context/AuthContext";
import { settings } from "~/config";
import { getCity, getPhoneHelp } from "~/api/AccountAPI";
import { getRelationships } from "~/api/RenterAPI";
import { Context as MotelContext } from '~/context/MotelContext'

const WelcomeScreen = ({ navigation }) => {
  const { state, signInLocalToken } = useContext(AuthContext);
  const { getListMotels, getSortOptions } = useContext(MotelContext);
  console.log("AuthContext", state);

  const loadOptions = async () => {
    const [resProvinces, resRelationships, resPhoneHelp] = await Promise.all([
      getCity(),
      getRelationships(),
      getPhoneHelp(),
      getSortOptions(),
    ]);
    settings.cityLists = resProvinces?.Data ?? [];
    settings.relationLists = resRelationships?.Data ?? [];
    settings.phoneHelp =  resPhoneHelp?.Data.phone ?? [];
  };

  useEffect(() => {
    (async ()=> {
      await loadOptions();
      signInLocalToken();
    })()

  }, []);
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
};

const styles = StyleSheet.create({});

export default WelcomeScreen;
