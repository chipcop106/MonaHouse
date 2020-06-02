import React, { useContext, useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { List, Button, Icon } from "@ui-kitten/components";
import { color, settings, sizes } from "~/config";
import { Context as RoomContext } from "~/context/RoomContext";
import { Context as MotelContext } from "~/context/MotelContext";
import { Context as AuthContext } from "~/context/AuthContext";
import FilterHeader from "~/components/FilterHeader";
import ElectrictCard from "~/components/ElectrictCard";
import NavLink from "~/components/common/NavLink";
import Loading from "~/components/common/Loading";
const RoomElectrictCollectAllScreen = () => {
    const { signOut } = useContext(AuthContext);
    const { state: roomState, getListElectrict } = useContext(RoomContext);
    const { listElectrictRooms, filterStateDefault } = roomState;
    const { state: modelState } = useContext(MotelContext);
    const { listMotels } = modelState;
    const [isLoading, setIsloading] = useState(false);

    const onFilterChange = async (filter) => {
        setIsloading(true);
        const {
            selectedMonthIndex,
            selectedMotelIndex,
            selectedYearIndex,
            searchValue,
        } = filter;
        try {
            //console.log(listMotels);
            await getListElectrict(
                {
                    motelid: listMotels[selectedMotelIndex.row - 1]?.ID ?? 0,
                    month: selectedMonthIndex.row + 1,
                    year: settings.yearLists[selectedYearIndex],
                    qsearch: `${searchValue}`,
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

    return (
        <View style={styles.container}>
            <FilterHeader
                onValueChange={onFilterChange}
                initialState={filterStateDefault}
                advanceFilter={false}
                yearFilter={true}
            />

            <View style={styles.contentContainer}>
                {isLoading ? (
                    <Loading />
                ) : (
                    <>
                        <List
                            ListHeaderComponent={() => (
                                <View style={styles.linkCustom}>
                                    <NavLink
                                        title="Lịch sử ghi điện | nước"
                                        icon={{
                                            name: "file-text-outline",
                                            color: color.primary,
                                        }}
                                        routeName="ElectrictHistory"
                                        borderBottom={false}
                                    />
                                </View>
                            )}
                            keyExtractor={(room, index) =>
                                `${room.RoomID + index}`
                            }
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
                        <Button
                            onPress={submitAllConfirm}
                            accessoryLeft={() => (
                                <Icon
                                    name="flash-outline"
                                    fill={color.whiteColor}
                                    style={sizes.iconButtonSize}
                                />
                            )}
                            size="large"
                            status="danger"
                        >
                            Ghi điện tất cả phòng
                        </Button>
                    </>
                )}
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
