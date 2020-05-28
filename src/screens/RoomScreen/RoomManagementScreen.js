/* eslint-disable react-native/no-color-literals */
import React, {
    useState,
    createRef,
    useContext,
    useEffect,
    useMemo,
} from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Icon, Input, List, IndexPath, Text } from "@ui-kitten/components";

import RoomCard from "~/components/RoomCard";
import { settings } from "~/config";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import AddFeeModal from "~/components/AddFeeModal";
import FilterHeader from "~/components/FilterHeader";
import { Context as RoomContext } from "~/context/RoomContext";
import { Context as MotelContext } from "~/context/MotelContext";
import { Context as AuthContext } from "~/context/AuthContext";

const RoomManagementScreen = (evaProps) => {
    const { signOut } = useContext(AuthContext);
    const { state: roomState, getListRooms } = useContext(RoomContext);
    const { state: motelState } = useContext(MotelContext);
    const { listRooms, filterStateDefault } = roomState;
    const { listMotels } = motelState;

    const onFilterChange = async (filter) => {
        const {
            selectedMonthIndex,
            selectedMotelIndex,
            selectedYearIndex,
        } = filter;
        try {
            //console.log(listMotels);
            await getListRooms(
                {
                    motelid: listMotels[selectedMotelIndex.row - 1]?.ID ?? 0,
                    month: selectedMonthIndex.row + 1,
                    year: settings.yearLists[selectedYearIndex],
                },
                signOut
            );
        } catch (error) {
            console.log(error);
        }
    };

    const bsFee = createRef();

    const openAddFeeModal = () => {
        bsFee.current?.open();
    };
    return (
        <>
            <View style={styles.container}>
                <FilterHeader
                    onValueChange={onFilterChange}
                    initialState={filterStateDefault}
                    advanceFilter={true}
                />
                <View style={styles.contentContainer}>
                    <List
                        keyExtractor={(room, index) => `${room.RoomID + index}`}
                        style={styles.listContainer}
                        contentContainerStyle={styles.contentCard}
                        data={listRooms}
                        renderItem={(room) => (
                            <RoomCard
                                roomInfo={room}
                                addFee={openAddFeeModal}
                            />
                        )}
                    />
                    <Portal>
                        <Modalize
                            ref={bsFee}
                            closeOnOverlayTap={false}
                            adjustToContentHeight={true}
                        >
                            <View style={styles.bottomSheetContent}>
                                <AddFeeModal />
                            </View>
                        </Modalize>
                    </Portal>
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    contentContainer: {
        flexGrow: 1,
        backgroundColor: "#ccc",
    },

    contentCard: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },

    listContainer: {
        flex: 1,
    },

    bottomSheetContent: {
        paddingHorizontal: 15,
        paddingVertical: 30,
        paddingBottom: 60,
    },
});

export default RoomManagementScreen;
