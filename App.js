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
const App = () => <RootStack />;
export default () => (
    <>
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
    </>
);
