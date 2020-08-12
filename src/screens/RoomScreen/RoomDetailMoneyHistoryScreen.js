import React, { useState, useContext } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Text, IndexPath, List, Icon } from "@ui-kitten/components";
import HistoryRecord from "~/components/HistoryRecord";
import FilterHeader from "~/components/FilterHeader";
import { Context as RoomContext } from "~/context/RoomContext";
import { Context as MotelContext } from "~/context/MotelContext";
import { Context as AuthContext } from "~/context/AuthContext";
import { color } from "~/config";
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 15,
        paddingHorizontal: 10,
    },
    card: {
        marginVertical: 10,
    },
    contentCard: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },

    listContainer: {
        flex: 1,
    },
});

const history = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        marginBottom: 10,
        borderRadius: 8,
        shadowColor: "rgba(0,0,0,.35)",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    flexRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconLeft: {
        width: 45,
        height: 45,
    },
    roundIcon: {
        width: 60,
        height: 60,
        borderWidth: 1,
        borderColor: color.darkColor,
        borderRadius: 60 / 2,
        padding: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    leftPart: {
        flexBasis: 90,
        padding: 15,
    },
    rightPart: {
        flexGrow: 1,
        padding: 15,
        paddingLeft: 0,
        justifyContent: "space-between",
        flexBasis: 100,
    },
    title: {
        fontWeight: "600",
        marginBottom: 10,
    },
    money: {
        fontSize: 18,
        color: color.redColor,
        fontWeight: "bold",
    },
    date: {
        color: "#c0c0c0",
        fontWeight: "600",
    },
    meta: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
});

const RoomDetailMoneyHistoryScreen = () => {
    const { state: roomState, getElectrictHistory } = useContext(RoomContext);
    const { state: motelState } = useContext(MotelContext);
    const { signOut } = useContext(AuthContext);
    const { listElectrictHistory, filterStateDefault } = roomState;

    const onFilterChange = (filter) => {
        const { selectedMonthIndex, selectedMotelIndex } = filter;
        try {
            //console.log(listMotels);
            getElectrictHistory(
                {
                    motelid:
                        motelState.listMotels[selectedMotelIndex - 1]?.ID ??
                        0,
                    month: selectedMonthIndex + 1,
                },
                signOut
            );
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <FilterHeader
                onValueChange={onFilterChange}
                initialState={filterStateDefault}
                advanceFilter={false}
            />
            <List
                contentContainerStyle={styles.contentCard}
                style={styles.container}
                data={listElectrictHistory}
                keyExtractor={(item) => item.id}
                renderItem={(item) => (
                    <View style={history.container}>
                        <View style={history.flexRow}>
                            <View style={history.leftPart}>
                                <View style={history.roundIcon}>
                                    <Icon
                                        name="credit-card"
                                        fill={color.darkColor}
                                        style={history.iconLeft}
                                    />
                                </View>
                            </View>
                            <View style={history.rightPart}>
                                <Text style={history.title}>
                                    Thanh toán tiền nhà tháng 5 hanh toán tiền
                                    nhà tháng 5 hanh toán tiền nhà tháng 5
                                </Text>
                                <View style={history.meta}>
                                    <Text style={history.money}>3.000.000</Text>
                                    <Text style={history.date}>
                                        20/10/2020 10:30
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            />
        </>
    );
};

export default RoomDetailMoneyHistoryScreen;
