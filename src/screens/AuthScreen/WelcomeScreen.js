import React, { useEffect, useContext } from "react";
import { Text, StyleSheet, View, ActivityIndicator, ImageBackground } from 'react-native'
import { Context as AuthContext } from "~/context/AuthContext";
import { settings } from "~/config";
import { getCity, getPhoneHelp } from "~/api/AccountAPI";
import { getRelationships } from "~/api/RenterAPI";
import { Context as MotelContext } from '~/context/MotelContext'

const WelcomeScreen = ({ navigation }) => {
  const { state, signInLocalToken } = useContext(AuthContext);
  const { getSortOptions } = useContext(MotelContext);
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
    <ImageBackground
	    resizeMode={'cover'}
	    source={ require('~/../assets/launch-screen.png') }
	    style={{ flex: 1, justifyContent: 'flex-start', alignItems: "center", position: 'relative' }}>

      <ActivityIndicator size="large" />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({});

export default WelcomeScreen;
