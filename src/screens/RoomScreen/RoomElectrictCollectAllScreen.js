
import React, { useContext, useReducer, useEffect, useCallback, useState } from "react";

import {
    StyleSheet,
    View,
    Alert,
    RefreshControl,
    KeyboardAvoidingView,
} from "react-native";
import { List, Button, Icon, IndexPath } from "@ui-kitten/components";
import { color, settings, sizes } from "~/config";
import { Context as RoomContext } from "~/context/RoomContext";
import { Context as MotelContext } from "~/context/MotelContext";
import { Context as AuthContext } from "~/context/AuthContext";
import FilterHeader from "~/components/FilterHeader";
import ElectrictCard from "~/components/ElectrictCard";
import NavLink from "~/components/common/NavLink";
import Loading from "~/components/common/Loading";

const initialState = {
    isLoading: true,
    refreshing: false,
    filterState: {
        selectedMonthIndex: 0,
        selectedMotelIndex: 0,
        selectedYearIndex: 0,
        searchValue: "",
    },
};

const reducer = (prevState, { type, payload }) => {
    switch (type) {
        case "STATE_CHANGE":
            return {
                ...prevState,
                [payload.key]: payload.value,
            };
            break;
        default:
            return prevState;
            break;
    }
};

const RoomElectrictCollectAllScreen = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { signOut } = useContext(AuthContext);
    const { state: roomState, getListElectrict } = useContext(RoomContext);
    const { listElectrictRooms } = roomState;
    const { state: modelState } = useContext(MotelContext);
    const { listMotels } = modelState;
    const [loading, setLoading] = useState(false);
    const updateState = (key, value) => {
        dispatch({ type: "STATE_CHANGE", payload: { key, value } });
    };

    const onFilterChange = async (filter) => {
        setLoading(true);
        const {
            selectedMonthIndex,
            selectedMotelIndex,
            selectedYearIndex,
            searchValue,
        } = filter || {
            selectedMonthIndex: 0,
            selectedMotelIndex: 0,
            selectedYearIndex: 0,
            searchValue: ""
        };
        try {
            //console.log(listMotels);
            await getListElectrict(
                {
                    motelid: listMotels[selectedMotelIndex - 1]?.ID ?? 0,
                    month: selectedMonthIndex + 1,
                    year: settings.yearLists[selectedYearIndex],
                    qsearch: `${searchValue}`,
                },
                signOut
            );
            setLoading(false);
            updateState("isLoading", false);
        } catch (error) {
            setLoading(false);
            updateState("isLoading", false);
            console.log(error);
        }
        setLoading(false);
    };
    const _onRefresh = () => {
        onFilterChange(state.filterState);
    }

    // const onFilterChange = async (filter) => {
    //     updateState("filterState", filter);
    // };

    const onChangeRoomInfo = (state) => {};

    const submitAllConfirm = () => {
        Alert.alert(
            "Cảnh báo",
            `Bạn có chắc chắn muốn ghi điện tất cả phòng trong tháng đã chọn ??`,
            [
                {
                    text: "Hủy thao tác",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                },
                {
                    text: "Tôi chắc chắn",
                    onPress: () => alert("Đã thu thành công"),
                },
            ],
            { cancelable: false }
        );
    };
    const _onValueChange = (filterFormvalue) => {
        
        onFilterChange(filterFormvalue);
    }
    useEffect(() => {
       
    }, [state.filterState]);

    return (
        <View style={styles.container}>
            <FilterHeader
                onValueChange={_onValueChange}
                initialState={state.filterState}
                advanceFilter={false}
                yearFilter={true}
            />

            <View style={styles.contentContainer}>
                <List
                    refreshControl={
                        <RefreshControl
                          onRefresh={_onRefresh}
                          refreshing={loading}
                        />
                    }
                    stickyHeaderIndices={[0]}
                    ListHeaderComponent={() => (
                        <View style={styles.linkCustom}>
                            <NavLink
                                title="Lịch sử ghi điện nước"
                                icon={{
                                    name: "file-text-outline",
                                    color: color.primary,
                                }}
                                routeName="ElectrictHistory"
                                borderBottom={false}
                            />
                        </View>
                    )}
                    keyExtractor={(room, index) => `${room.RoomID} - ${index}`}
                    style={styles.listContainer}
                    contentContainerStyle={styles.contentCard}
                    data={listElectrictRooms}
                    renderItem={(room) => (
                        <ElectrictCard
                            roomInfo={room}
                            handleValueChange={onChangeRoomInfo}
                        />
                    )}
                />
            </View>
        </View>
    );
};

export default RoomElectrictCollectAllScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0f0f0",
    },

    contentContainer: {
        flexGrow: 1,
    },

    contentCard: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        flexGrow: 1,
    },

    listContainer: {
        flexGrow: 1,
        backgroundColor: "#f0f0f0",
    },

    bottomSheetContent: {
        paddingHorizontal: 15,
        paddingVertical: 30,
        paddingBottom: 60,
    },
    linkCustom: {
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        marginVertical: 15,
        paddingLeft: 10,
        borderRadius: 4,
    },
});
