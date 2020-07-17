import React, { useContext, useState } from "react";
import { StyleSheet, View,
    ActivityIndicator, RefreshControl
} from "react-native";
import { List } from "@ui-kitten/components";
import { color, settings } from "~/config";
import { Context as RoomContext } from "~/context/RoomContext";
import { Context as MotelContext } from "~/context/MotelContext";
import { Context as AuthContext } from "~/context/AuthContext";
import FilterHeader from "~/components/FilterHeader";
import ElectrictCard from "~/components/ElectrictCard";
import NavLink from "~/components/common/NavLink";

const RoomElectrictCollectAllScreen = () => {
    const { signOut } = useContext(AuthContext);
    const { state: roomState, getListElectrict } = useContext(RoomContext);
    const { listElectrictRooms, filterStateDefault } = roomState;
    const { state: modelState } = useContext(MotelContext);
    const { listMotels } = modelState;
    const [loading, setLoading] = useState(false);

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
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };
    const _onRefresh = () => {
        onFilterChange();
    }

    const onChangeRoomInfo = (state) => {};

    return (
        <View style={styles.container}>
            <FilterHeader
                onValueChange={onFilterChange}
                initialState={filterStateDefault}
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
