/* eslint-disable react-native/no-color-literals */
import React, { useState, createRef, useContext, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import {
    Icon, Input, List, IndexPath, Text
} from "@ui-kitten/components";
import CustomSelect from "~/components/common/CustomSelect";
import RoomCard from "~/components/RoomCard";
import { color } from "~/config";
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import AddFeeModal from '~/components/AddFeeModal';
import { Context as RoomContext } from '~/context/RoomContext';
import { Context as MotelContext } from '~/context/MotelContext';
import { Context as AuthContext } from '~/context/AuthContext';
const monthOptions = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];


const RoomManagementScreen = (evaProps) => {
    const { signOut } = useContext(AuthContext)
    const { state: roomState, getListRooms } = useContext(RoomContext);
    const { state: modelState } = useContext(MotelContext);
    const [searchValue, setSearchValue] = useState("");
    const [selectedMotelIndex, setSelectedMotelIndex] = useState(new IndexPath(0));
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(new IndexPath(0));
    const {listMotels} = modelState;
    useEffect(() => {
        try {
            //console.log(listMotels);
            getListRooms({
                motelid:listMotels[selectedMotelIndex.row - 1]?.ID ?? 0,
                month:selectedMonthIndex.row + 1
            }, signOut)
        } catch (error) {
            console.log(error)
        }
     
    },[selectedMotelIndex, selectedMonthIndex])

    // useEffect(() => {
    //     console.log(roomState);
    // }, [roomState])

    const bsFee = createRef();

    const openAddFeeModal = () => {
        bsFee.current?.open();
    };
    return (
        <View style={styles.container}>
            <View style={styles.filterWrap}>
                <View style={styles.filterSelect}>
                    <View style={[styles.filter, styles.firstFilter]}>
                        <CustomSelect 
                        selectOptions={[{MotelName:"Tất cả"},...listMotels].map((motel) => motel.MotelName)} 
                        getSelectedIndex={(index) => setSelectedMotelIndex(index)} 
                        icon="home"
                        />
                    </View>
                    <View style={[styles.filter, styles.secondFilter]}>
                        <CustomSelect selectOptions={monthOptions} getSelectedIndex={(index) => setSelectedMonthIndex(index)} icon="calendar" />
                    </View>
                </View>
                <View style={styles.filterSearch}>
                    <Input
                        status="transparent"
                        placeholder="Tìm kiếm..."
                        value={searchValue}
                        onChangeText={setSearchValue}
                        accessoryLeft={() => <Icon name="search" fill={color.whiteColor} style={styles.searchIcon} />}
                    />
                </View>
            </View>

            <View style={styles.contentContainer}>
                <List
                    keyExtractor={(room) => `${room.RoomID}`}
                    style={styles.listContainer}
                    contentContainerStyle={styles.contentCard}
                    data={roomState.listRooms}
                    renderItem={(room) => <RoomCard roomInfo={room} addFee={openAddFeeModal} />}
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
    filterWrap: {
        padding: 10,
        backgroundColor: color.darkColor,
    },

    filterSelect: {
        flexDirection: "row",
    },

    filter: {
        flexGrow: 1,
    },

    firstFilter: {
        marginRight: 5,
    },

    secondFilter: {
        marginLeft: 5,
    },

    filterSearch: {
        marginTop: 10,
    },

    searchIcon: {
        width: 20,
        height: 20,
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
        paddingBottom: 60
    }
});

export default RoomManagementScreen;
