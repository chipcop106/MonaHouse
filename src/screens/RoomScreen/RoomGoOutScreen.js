import React, { useContext, useLayoutEffect, useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    TouchableOpacity,
    ScrollView,
    Linking,
} from "react-native";
import { Text, Layout, Button, Icon, Avatar } from "@ui-kitten/components";
import GoOutInfo from "../../components/GoOutForm/GoOutInfo";
import GoOutCheckout from "../../components/GoOutForm/GoOutCheckout";
import { Context as RoomGoOutContext } from "../../context/RoomGoOutContext";
import { sizes, color } from "../../config";
import AsyncStorage from "@react-native-community/async-storage";
import UserInfo from "~/components/UserInfo";
const titleHeader = ["Thông tin phòng, ki ốt", "Thông tin thanh toán"];
import { getRoomById } from "~/api/MotelAPI";
const RenderForm = () => {
    const {
        state: RoomGoOutState,
        changeStateFormStep,
        changeStepForm,
    } = useContext(RoomGoOutContext);
    const { step, dataForm } = RoomGoOutState;

    return (
        <>
            {step === 0 && (
                <GoOutInfo
                    onChangeState={changeStateFormStep}
                    initialState={dataForm[step]}
                />
            )}
            {step === 1 && (
                <GoOutCheckout
                    onChangeState={changeStateFormStep}
                    initialState={dataForm[step]}
                />
            )}
        </>
    );
};

const RoomGoOutScreen = ({ navigation, route }) => {
    const {
        state: RoomGoOutState,
        changeStepForm,
        clearState,
        roomInfoChange,
    } = useContext(RoomGoOutContext);
    const { roomid } = route.params;
    const { roomInfo } = RoomGoOutState;

    const loadRoomInfo = async () => {
        try {
            const res = await getRoomById({ roomid });
            if (res.Code === 1) {
                roomInfoChange(res.Data);
            }
        } catch (err) {
            alert(err.message);
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() =>
                        RoomGoOutState.step === 0
                            ? navigation.pop()
                            : changeStepForm(-1)
                    }
                >
                    <Icon
                        name="arrow-back-outline"
                        fill={color.primary}
                        style={sizes.iconButtonSize}
                    />
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
            ),
            headerTitle: titleHeader[RoomGoOutState.step],
        });
    }, [navigation, RoomGoOutState]);

    useEffect(() => {
        //  console.log(RoomGoOutState.roomInfo);
    }, [RoomGoOutState]);

    useEffect(() => {
        loadRoomInfo();
    }, []);

    const sendFormData = () => {
        alert(JSON.stringify(RoomGoOutState));
        navigation.pop();
        clearState();
    };

    return (
        <Layout style={styles.container} level="3">
            <ScrollView>
                {roomInfo ? (
                    <UserInfo
                        avatar={roomInfo.renter.renter.Avatar}
                        name={roomInfo.renter.renter.FullName}
                        phone={roomInfo.renter.renter.Phone}
                    />
                ) : (
                    <Text>Loading user info...</Text>
                )}
                <RenderForm />
                <View style={styles.mainWrap}>
                    {RoomGoOutState.step < 1 ? (
                        <Button
                            onPress={() => changeStepForm(1)}
                            accessoryRight={() => (
                                <Icon
                                    name="arrow-right"
                                    fill={color.whiteColor}
                                    style={sizes.iconButtonSize}
                                />
                            )}
                            size="large"
                            status="danger"
                        >
                            Xem phí dọn ra
                        </Button>
                    ) : (
                        <Button
                            onPress={sendFormData}
                            accessoryLeft={() => (
                                <Icon
                                    name="save"
                                    fill={color.whiteColor}
                                    style={sizes.iconButtonSize}
                                />
                            )}
                            size="large"
                            status="success"
                        >
                            Tiến hành dọn ra
                        </Button>
                    )}
                </View>
            </ScrollView>
        </Layout>
    );
};

const styles = StyleSheet.create({
    mainWrap: {
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    container: {
        flex: 1,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
    },
    backButtonText: {
        color: color.primary,
        marginLeft: 5,
        fontSize: 16,
    },
    section: {
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
});

export default RoomGoOutScreen;
