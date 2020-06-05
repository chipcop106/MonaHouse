/* eslint-disable react-native/no-color-literals */
import React, {
    useState,
    createRef,
    useContext,
    useReducer,
    useCallback,
    useEffect,
} from "react";
import {
    StyleSheet,
    View,
    TouchableOpacity,
    KeyboardAvoidingView,
    RefreshControl,
    Dimensions,
} from "react-native";
import {
    List,
    Icon,
    IndexPath,
    Text,
    Spinner,
    Button,
} from "@ui-kitten/components";

import RoomCard from "~/components/RoomCard";
import { settings } from "~/config";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import AddFeeModal from "~/components/AddFeeModal";
import FilterHeader from "~/components/FilterHeader";
import { Context as RoomContext } from "~/context/RoomContext";
import { Context as MotelContext } from "~/context/MotelContext";
import { Context as AuthContext } from "~/context/AuthContext";
import { Context as FilterContext } from "~/context/FilterContext";
import { color } from "~/config";
import Loading from "~/components/common/Loading";
import LinearGradient from "react-native-linear-gradient";

const { height } = Dimensions.get("window");

const initialState = {
    refreshing: false,
    isLoading: true,
    filterState: {
        selectedMonthIndex: new IndexPath(0),
        selectedMotelIndex: new IndexPath(0),
        selectedYearIndex: new IndexPath(0),
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

const RoomManagementScreen = ({ navigation }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { signOut } = useContext(AuthContext);
    const { state: roomState, getListRooms } = useContext(RoomContext);
    const { state: motelState } = useContext(MotelContext);
    const { listRooms } = roomState;
    const { listMotels } = motelState;

    const updateState = (key, value) => {
        dispatch({ type: "STATE_CHANGE", payload: { key, value } });
    };

    const onFilterChange = async (filter) => {
        updateState("filterState", filter);
    };

    const loadRoomApi = async ({ loadingControl = true }, filter) => {
        loadingControl && updateState("isLoading", true);
        const {
            selectedMonthIndex,
            selectedMotelIndex,
            selectedYearIndex,
        } = filter ? filter : state.filterState;
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
            updateState("isLoading", false);
        } catch (error) {
            updateState("isLoading", false);
            console.log(error);
        }
    };

    const refreshApi = async () => {
        updateState("refreshing", true);
        await loadRoomApi({ loadingControl: false });
        updateState("refreshing", false);
    };

    const onRefresh = useCallback(() => {
        refreshApi();
    }, [state.refreshing, state.filterState]);

    const bsFee = createRef();

    const openAddFeeModal = () => {
        bsFee.current?.open();
    };

    useEffect(() => {
        loadRoomApi({ loadingControl: true });
    }, [state.filterState]);

    return (
        <View style={styles.container}>
            <FilterHeader
                onValueChange={onFilterChange}
                initialState={state.filterState}
                advanceFilter={true}
            />

            <View style={styles.contentContainer}>
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
                    <List
                        refreshControl={
                            <RefreshControl
                                refreshing={state.refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                        initialNumToRender={5}
                        removeClippedSubviews={false}
                        keyExtractor={(item, index) => `${item.RoomID}`}
                        style={styles.listContainer}
                        contentContainerStyle={styles.contentCard}
                        data={listRooms}
                        extraData={listRooms}
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

            <TouchableOpacity
                onPress={() =>
                    navigation.navigate("AddNewRoom", {
                        onGoBack: () => refreshApi(),
                    })
                }
                style={styles.addAction}
            >
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    useAngle={true}
                    angle={45}
                    angleCenter={{ x: 0.5, y: 0.25 }}
                    colors={color.gradients.primary}
                    style={{
                        borderRadius: 50,
                    }}
                >
                    <View style={styles.btnAdd}>
                        <Icon
                            name="plus"
                            fill={color.whiteColor}
                            style={styles.btnAddIcon}
                        />
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        </View>
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
        paddingHorizontal: 10,
        paddingVertical: 10,
        paddingBottom: 60,
        flexGrow: 1,
    },

    bottomSheetContent: {
        paddingHorizontal: 15,
        paddingVertical: 30,
        paddingBottom: 60,
    },
    addAction: {
        shadowColor: "#000",
        position: "absolute",
        right: 30,
        bottom: 30,
        shadowOffset: {
            width: 2,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4.27,

        elevation: 7,

        borderRadius: 60 / 2,
    },
    btnAdd: {
        justifyContent: "center",
        alignItems: "center",
        width: 60,
        height: 60,
    },
    btnAddIcon: {
        width: 30,
        height: 30,
    },
});

export default RoomManagementScreen;
