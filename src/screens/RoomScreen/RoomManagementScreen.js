/* eslint-disable react-native/no-color-literals */
import React, { useState, createRef, useContext } from "react";
import { StyleSheet, View } from "react-native";
import { List, Spinner } from "@ui-kitten/components";

import RoomCard from "~/components/RoomCard";
import { settings } from "~/config";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import AddFeeModal from "~/components/AddFeeModal";
import FilterHeader from "~/components/FilterHeader";
import { Context as RoomContext } from "~/context/RoomContext";
import { Context as MotelContext } from "~/context/MotelContext";
import { Context as AuthContext } from "~/context/AuthContext";
import Loading from "~/components/common/Loading";
const RoomManagementScreen = (evaProps) => {
    const { signOut } = useContext(AuthContext);
    const { state: roomState, getListRooms } = useContext(RoomContext);
    const { state: motelState } = useContext(MotelContext);
    const { listRooms, filterStateDefault } = roomState;
    const { listMotels } = motelState;
    const [isLoading, setIsloading] = useState(false);

    const onFilterChange = async (filter) => {
        setIsloading(true);
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
            setTimeout(function () {
                setIsloading(false);
            }, 1500);
        } catch (error) {
            setIsloading(false);
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
                    {isLoading ? (
                        <Loading />
                    ) : (
                        <List
                            keyExtractor={(item, index) => `${item.RoomID}`}
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
                    )}

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
        backgroundColor: "#f0f0f0",
    },

    contentContainer: {
        flexGrow: 1,
    },

    contentCard: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: "#f0f0f0",
        flexGrow: 1,
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
