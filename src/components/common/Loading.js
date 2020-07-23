import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Spinner } from "@ui-kitten/components";

const Loading = () => {
    return <Spinner size="giant" />;
};

export default memo(Loading);

const styles = StyleSheet.create({});
