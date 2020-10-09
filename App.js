import "react-native-gesture-handler";
import React from "react";
import { KeyboardAvoidingView, Platform, StatusBar } from "react-native";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import RootStack from "./src/routes";
import { Provider as AuthProvider } from "./src/context/AuthContext";
import { Provider as MotelProvider } from "./src/context/MotelContext";
import { default as mapping } from "./custom-mapping.json";
import { default as themeCustom } from "./light-theme-custom.json";
import { Provider as RoomGoInProvider } from "./src/context/RoomGoInContext";
import { Provider as RoomGoOutProvider } from "./src/context/RoomGoOutContext";
import { Provider as RoomProvider } from "./src/context/RoomContext";
import OneSignal from 'react-native-onesignal'
import { settings } from '~/config';

const App = () => <RootStack />;
export default () => {

  React.useEffect(() => {
    OneSignal.init(settings.oneSignalKey);
    OneSignal.addEventListener('received', _onReceived);
    OneSignal.addEventListener('opened', _onOpened);
    OneSignal.addEventListener('ids', _onIds);
  }, []);

  function _onReceived(notification) {
    console.log("Notification received: ", notification);
  }

  function _onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
    if(openResult.notification.payload.additionalData){
      const newURL = openResult.notification.payload.additionalData.url
      // console.log( );
      // navigationRef.current?.navigate('DashboardDetail', {targetUrl: newURL})

      // navigation.navigate('DashboardDetail', {targetUrl: newURL})
    }
  }
  function _onIds(device) {
    console.log('Device info: ', device);
    let {pushToken , userId} = device;
    settings.pushToken = pushToken;
    settings.userId = userId;
  }


    return (<>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider
            {...eva}
            theme={themeCustom}
            customMapping={mapping}
        >
            <AuthProvider>
                <MotelProvider>
                    <RoomProvider>
                        <RoomGoInProvider>
                            <RoomGoOutProvider>
                                <App />
                            </RoomGoOutProvider>
                        </RoomGoInProvider>
                    </RoomProvider>
                    <StatusBar barStyle="light-content" />
                </MotelProvider>
            </AuthProvider>
        </ApplicationProvider>
    </>)
};
