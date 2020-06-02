import React, { useReducer, useEffect } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Text, Input, Button, Icon } from "@ui-kitten/components";
import UserInfo from "~/components/UserInfo";
import IncludeElectrictWater from "~/components/IncludeElectrictWater";
import { color, sizes } from "~/config";
import gbStyle from "~/GlobalStyleSheet";
import { getRoomById } from "~/api/MotelAPI";
const initialState = {
    electrictNumber: "",
    electrictImage: null,
    waterNumber: "",
    waterImage: null,
    oldElectrict: "323232",
    oldWater: "232323",
};

const reducer = (prevstate, action) => {
    switch (action.type) {
        case "STATE_CHANGE": {
            return {
                ...prevstate,
                ...action.payload.newState,
            };
        }
        default:
            return prevstate;
    }
};

const ElectrictCollectScreen = ({ route }, month) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const roomId = route.params?.roomId ?? null;
    const { renter, room } = state;

    const onChangeValue = (newState) => {
        dispatch({ type: "STATE_CHANGE", payload: { newState } });
    };

    useEffect(() => {
        const loadRoomInfo = async () => {
            try {
                const res = await getRoomById({ roomid: roomId });
                dispatch({
                    type: "STATE_CHANGE",
                    payload: { newState: res.Data },
                });
            } catch (err) {}
        };
        loadRoomInfo();
    }, []);

    useEffect(() => {
        console.log(state);
    }, [state]);
    return (
        <>
            <ScrollView>
                <View style={styles.container}>
                    <UserInfo
                        name={renter?.renter.FullName ?? "Đang tải..."}
                        phone={renter?.renter.Phone ?? "Đang tải"}
                        avatar={renter?.renter.LinkIMG ?? null}
                    />
                    <View style={styles.mainWrap}>
                        <View style={styles.section}>
                            <Text
                                status="primary"
                                category="h5"
                                style={{ marginBottom: 5 }}
                            >
                                {room && room.NameRoom
                                    ? room.NameRoom
                                    : "Đang tải..."}
                            </Text>
                            <Text style={gbStyle.mBottom15}>
                                Điện nước tháng 04
                            </Text>
                            <View style={styles.formWrap}>
                                <View style={[styles.formRow, styles.halfCol]}>
                                    <Input
                                        textStyle={styles.textInput}
                                        label="Số điện cũ"
                                        placeholder="0"
                                        disabled
                                        value={state.oldElectrict}
                                        textContentType="none"
                                        keyboardType="numeric"
                                    />
                                </View>
                                <View style={[styles.formRow, styles.halfCol]}>
                                    <Input
                                        textStyle={styles.textInput}
                                        label="Số nước cũ"
                                        placeholder="0"
                                        disabled
                                        value={state.oldWater}
                                        textContentType="none"
                                        keyboardType="numeric"
                                    />
                                </View>
                                <IncludeElectrictWater
                                    initialState={initialState}
                                    handleValueChange={onChangeValue}
                                    waterTitle="Nước tháng này"
                                    electrictTitle="Điện tháng này"
                                />
                            </View>
                        </View>
                        <Button
                            accessoryLeft={() => (
                                <Icon
                                    name="sync"
                                    fill={color.whiteColor}
                                    style={sizes.iconButtonSize}
                                />
                            )}
                            size="large"
                            status="success"
                        >
                            Cập nhật điện nước
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    mainWrap: {
        paddingHorizontal: 15,
    },
    section: {
        paddingTop: 15,
        paddingHorizontal: 15,
        marginBottom: 30,
        backgroundColor: color.whiteColor,
        borderRadius: 8,
    },
    secTitle: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 15,
    },
    container: {
        flex: 1,
    },
    formWrap: {
        marginHorizontal: "-1%",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    formRow: {
        marginBottom: 20,
        flexGrow: 1,
        marginHorizontal: "1%",
        alignItems: "center",
    },
    halfCol: {
        flexBasis: "48%",
    },
    fullWidth: {
        flexBasis: "98%",
    },
    mb15: {
        marginBottom: 15,
    },
});

export default ElectrictCollectScreen;
