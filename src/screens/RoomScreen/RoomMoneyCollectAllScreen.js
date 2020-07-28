import React, { useContext, useReducer, useCallback, useEffect } from "react";
import { StyleSheet, View, Alert, RefreshControl } from "react-native";
import { Icon, List, Button, IndexPath } from "@ui-kitten/components";
import { color, sizes, settings } from "~/config";
import { Context as RoomContext } from "~/context/RoomContext";
import { Context as MotelContext } from "~/context/MotelContext";
import { Context as AuthContext } from "~/context/AuthContext";
import FilterHeader from "~/components/FilterHeader";
import MoneyCard from "~/components/MoneyCard";
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

const RoomMoneyCollectAllScreen = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { signOut } = useContext(AuthContext);
    const { state: roomState, getListElectrict } = useContext(RoomContext);
    const { listElectrictRooms } = roomState;
    const { state: modelState } = useContext(MotelContext);
    const { listMotels } = modelState;

    const updateState = (key, value) => {
        dispatch({ type: "STATE_CHANGE", payload: { key, value } });
    };

    const refreshApi = async () => {
        updateState("refreshing", true);
        await loadRoomApi({ loadingControl: false });
        updateState("refreshing", false);
    };

    const onRefresh = useCallback(() => {
        refreshApi();
    }, [state.refreshing, state.filterState]);

    const loadRoomApi = async ({ loadingControl = true }, filter) => {
        loadingControl && updateState("isLoading", true);
        const {
            selectedMonthIndex,
            selectedMotelIndex,
            selectedYearIndex,
            searchValue,
        } = filter ? filter : state.filterState;
        try {
            await getListElectrict(
                {
                    motelid: listMotels[selectedMotelIndex - 1]?.ID ?? 0,
                    month: selectedMonthIndex + 1,
                    year: settings.yearLists[selectedYearIndex],
                    qsearch: `${searchValue}`,
                },
                signOut
            );
            updateState("isLoading", false);
        } catch (error) {
            updateState("isLoading", false);
            console.log(error);
        }
    };

    const onFilterChange = (filter) => {
        updateState("filterState", filter);
    };

    useEffect(() => {
        loadRoomApi({ loadingControl: true });
    }, [state.filterState]);

    const submitAllConfirm = () => {
        Alert.alert(
            "Cảnh báo",
            `Bạn có chắc chắn muốn thu tiền tất cả phòng trong tháng đã chọn ??`,
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

    const onChangeRoomInfo = (state) => {};

    useEffect(() => {
        loadRoomApi({ loadingControl: true });
    }, [state.filterState]);

    return (
        <View style={styles.container}>
            <FilterHeader
                onValueChange={onFilterChange}
                initialState={state.filterState}
                advanceFilter={false}
                yearFilter={true}
            />
            {state.isLoading ? (
                <View
                    style={{
                        flexGrow: 1,
                        alignItems: "center",
                        paddingTop: 30,
                    }}
                >
                    <Loading />
                </View>
            ) : (
                <View style={styles.contentContainer}>
                    <>
                        <List
                            refreshControl={
                                <RefreshControl
                                    refreshing={state.refreshing}
                                    onRefresh={onRefresh}
                                />
                            }
                            ListHeaderComponent={() => (
                                <View style={styles.linkCustom}>
                                    <NavLink
                                        title="Lịch sử thu tiền"
                                        icon={{
                                            name: "file-text-outline",
                                            color: color.primary,
                                        }}
                                        routeName="MoneyHistory"
                                        borderBottom={false}
                                    />
                                </View>
                            )}
                            keyExtractor={(room, index) =>
                                `${room.RoomID}-${index}`
                            }
                            style={styles.listContainer}
                            contentContainerStyle={styles.contentCard}
                            data={listElectrictRooms}
                            initialNumToRender={5}
                            removeClippedSubviews={false}
                            extraData={listElectrictRooms}
                            renderItem={(room) => (
                                <MoneyCard
                                    roomInfo={room}
                                    handleValueChange={onChangeRoomInfo}
                                />
                            )}
                        />
                        <Button
                            onPress={submitAllConfirm}
                            accessoryLeft={() => (
                                <Icon
                                    name="credit-card-outline"
                                    fill={color.whiteColor}
                                    style={sizes.iconButtonSize}
                                />
                            )}
                            size="large"
                            status="danger"
                        >
                            Thu tiền tất cả phòng
                        </Button>
                    </>
                </View>
            )}
        </View>
    );
};

export default RoomMoneyCollectAllScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    contentContainer: {
        flexGrow: 1,
        backgroundColor: color.bgmain,
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
    backdrop: {
        backgroundColor: "rgba(0,0,0,.35)",
    },
});
