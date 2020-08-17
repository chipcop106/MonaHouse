/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, memo } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Card } from "@ui-kitten/components";
import { color, shadowStyle } from "~/config";
import { useNavigation } from "@react-navigation/native";
import IncludeElectrictWater from "~/components/IncludeElectrictWater";
const noImageSrc = require("~/../assets/user.png");

const renderItemHeader = (headerprops, roomInfo, navigation) => {

    return (
        <View {...headerprops} style={styles.headerWrap}>
            <TouchableOpacity onPress={() => navigation.navigate("RoomDetail")}>
                <Text
                    style={styles.roomName}
                    ellipsizeMode="tail"
                    numberOfLines={1}
                >
                    {roomInfo.RoomName}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const ElectrictCard = ({ roomInfo, handleValueChange }) => {
    const navigation = useNavigation();
    return (
        <View style={styles.item}>
            <Card
                appearance="filled"
                
                status="basic"
                disabled
                header={(headerProps) =>
                    renderItemHeader(headerProps, roomInfo, navigation)
                }
            >
                <View style={styles.cardBody}>
                    <IncludeElectrictWater
                        waterTitle="Ghi số nước"
                        electrictTitle="Ghi số điện"
                        priceDisplay={false}
                        handleValueChange={handleValueChange}
                        initialState={{
                            electrictNumber: "",
                            electrictImage: null,
                            waterNumber: "",
                            waterImage: null,
                        }}
                    />
                </View>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    headerWrap: {
        backgroundColor: color.primary,
        flexDirection: "row",
        padding: 15,
        alignItems: "center",
        justifyContent: "space-between",
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        position: "relative",
        marginTop: -1,
        marginHorizontal: -1
    },
    roomName: {
        fontSize: 20,
        fontWeight: "700",
        color: color.whiteColor,
        paddingRight: 45,
    },
    item: {
        borderRadius: 6,
        ...shadowStyle

    },
    iconMenu: {
        width: 30,
        height: 30,
    },
    avatar: {
        margin: 10,
    },
    iconButton: {
        width: 20,
        height: 20,
    },
    space: {
        marginBottom: 20,
    },
    renter: {
        flexDirection: "row",
        alignItems: "center",
    },
    renterName: {
        marginLeft: 15,
        fontSize: 20,
        fontWeight: "600",
    },
    infoWrap: {
        marginHorizontal: -15,
        flexDirection: "row",
    },
    info: {
        paddingHorizontal: 15,
        flexGrow: 1,
        flexShrink: 0,
    },
    infoLabel: {
        fontSize: 13,
        color: color.darkColor,
        marginBottom: 5,
    },
    infoValue: {
        fontSize: 17,
        color: color.blackColor,
    },
    statusWrap: {
        flexDirection: "row",
        marginHorizontal: -5,
    },
    status: {
        marginHorizontal: 5,
    },
    badge: {
        padding: 5,
        borderRadius: 4,
    },
    badgeText: {
        color: color.whiteColor,
    },
    balanceInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    balanceText: {
        fontSize: 15,
        color: color.darkColor,
    },
    touchButton: {
        flexDirection: "row",
        alignItems: "center",
    },
    textButton: {
        color: color.darkColor,
        fontSize: 15,
        fontWeight: "600",
        marginLeft: 5,
    },
    balance: {
        fontSize: 15,
    },
    balanceValue: {
        color: color.greenColor,
    },
    footerAction: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 15,
    },
    actionButton: {
        padding: 5,
    },
    cardBody: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
});

export default memo(ElectrictCard);
