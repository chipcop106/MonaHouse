/* eslint-disable react-native/no-color-literals */
import React, {
    useState,
    createRef,
    useContext,
    useEffect,
    useMemo,
} from "react";
import { StyleSheet, View, Alert,
    TouchableOpacity, ActivityIndicator, RefreshControl
} from "react-native";
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
    //local screen state
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        loadData();
    },[])
  
    const loadData = async (filterList) => {
        console.log('filterList', filterList);
        setLoading(true);
        const {
            selectedMonthIndex,
            selectedMotelIndex,
            selectedYearIndex,
        } = filterList || {
            selectedMonthIndex: 0,
            selectedMotelIndex: 0,
            selectedYearIndex: 0,
            searchValue: ""
        };
        
        try {
            // console.log(listMotels);
            
            await getListRooms(
                {
                    motelid: listMotels[selectedMotelIndex - 1]?.ID ?? 0,
                    month: selectedMonthIndex + 1,
                    year: settings.yearLists[selectedYearIndex],
                },
                signOut
            );
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };
    const _onValueChange = (filterFormvalue) => {
        
        loadData(filterFormvalue);
    }
    
    const _onRefresh = () =>{
        loadData();
    }

    const bsFee = createRef();

    const openAddFeeModal = () => {
        bsFee.current?.open();
    };
    return (
        <>
            <View style={styles.container}>
                
                <FilterHeader
                    onValueChange={_onValueChange}
                    initialState={filterStateDefault}
                    advanceFilter={true}
                    loading={loading}
                />

                <View style={styles.contentContainer}>
                    <List
                        refreshControl={
                            <RefreshControl
                              onRefresh={_onRefresh}
                              refreshing={loading}
                            />
                        }
                        
                        keyExtractor={(room, index) => `${room.RoomID}-${index}`}
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
                    <Portal >
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
