import React, { useState, useContext } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Text, IndexPath, List } from "@ui-kitten/components";
import HistoryRecord from "~/components/HistoryRecord";
import FilterHeader from "~/components/FilterHeader";
import { Context as RoomContext } from "~/context/RoomContext";
import { Context as MotelContext } from "~/context/MotelContext";
import { Context as AuthContext } from "~/context/AuthContext";
const ElectrictHistoryScreen = () => {
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
                        motelState.listMotels[selectedMotelIndex.row - 1]?.ID ??
                        0,
                    month: selectedMonthIndex.row + 1,
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
                style={styles.listContainer}
                data={listElectrictHistory}
                keyExtractor={(item) => item.id}
                renderItem={() => <HistoryRecord style={styles.card} />}
                style={styles.container}
            ></List>
        </>
    );
};

export default ElectrictHistoryScreen;

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
