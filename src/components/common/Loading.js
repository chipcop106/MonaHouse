import React from "react";
import { StyleSheet, Text, View } from "react-native";
import LottieView from "lottie-react-native";

const Loading = () => {
    return (
        <View
            style={{
                flexGrow: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#fff",
            }}
        >
            <LottieView
                source={require("./../../../assets/lottie/monahouse-loading.json")}
                autoPlay
                loop
            />
        </View>
    );
};

export default Loading;

const styles = StyleSheet.create({});
