import React, { useContext, useLayoutEffect, useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, ScrollView, Linking, ActivityIndicator } from "react-native";
import { Text, Layout, Button, Icon, Avatar } from '@ui-kitten/components';
import { useNavigation, useRoute } from "@react-navigation/native";
import GoOutInfo from "../../components/GoOutForm/GoOutInfo";
import GoOutCheckout from "../../components/GoOutForm/GoOutCheckout";
import { Context as RoomGoOutContext } from '../../context/RoomGoOutContext'
import { sizes, color } from '../../config'
import AsyncStorage from '@react-native-community/async-storage'
import UserInfo from '~/components/UserInfo';
import { getRoomById } from "~/api/MotelAPI";



const titleHeader = ["Thông tin phòng, ki ốt", "Thông tin thanh toán"];

const RenderForm = () => {
    const { state: RoomGoOutState, changeStateFormStep, changeStepForm } = useContext(RoomGoOutContext);
    const { step, dataForm } = RoomGoOutState;

    return (
        <>
            {step === 0
                && (
                    <GoOutInfo
                        onChangeState={changeStateFormStep}
                        initialState={dataForm[step]}
                    />
                )}
            {step === 1
                && (
                    <GoOutCheckout
                        onChangeState={changeStateFormStep}
                        initialState={dataForm[step]}
                    />
                )}
        </>
    );
};

const RoomGoOutScreen = ({ navigation }) => {
    const { state: RoomGoOutState, changeStepForm, clearState, loadDataForm } = useContext(RoomGoOutContext);
    const route = useRoute();
    const [userInfo, setUserInfo] = useState({});
    const [loading, setLoading] = useState(false);
    const loaddata = async () => {
        try {
            const res = await getRoomById({ roomid: route.params.roomId });
            console.log('getRoomById RES', res.Data);
            setUserInfo({
                ...res.Data.renter.renter
            })
            await loadDataForm(res.Data);

        } catch (err) {
            console.log('RoomGoOutScreen loaddata err', err);
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => (RoomGoOutState.step === 0 ? navigation.pop() : changeStepForm(-1))}
                >
                    <Icon name="arrow-back-outline" fill={color.primary} style={sizes.iconButtonSize} />
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
            ),
            headerTitle: titleHeader[RoomGoOutState.step],
        });
    }, [navigation, RoomGoOutState]);

    useEffect(() => {
        loaddata();
    }, [])

    const sendFormData = () =>{
        alert(JSON.stringify(RoomGoOutState));
        navigation.pop();
        clearState();
    }

    return (
        <Layout style={styles.container} level="3">
            <ScrollView>
            {userInfo ? (<UserInfo avatar={userInfo.Avatar} name={userInfo.FullName} phone={userInfo.Phone}/>) : <Text>Đang tải dữ liệu...</Text>}
                <RenderForm />
                <View
                    style={styles.mainWrap}
                >
                    {
                        RoomGoOutState.step < 1 ? (
                            <Button
                                onPress={() => changeStepForm(1, {...RoomGoOutState.dataForm, roomId: route.params.roomId})}
                                accessoryRight={RoomGoOutState.isLoading ? null : () => (
                                    <Icon
                                        name="arrow-right"
                                        fill={color.whiteColor}
                                        style={sizes.iconButtonSize}
                                    />
                                )}
                                size="large"
                                status="danger"
                            >
                                {
                                    RoomGoOutState.isLoading ? <ActivityIndicator color="#fff" size="small" /> : `Xem phí dọn ra`
                                }
                            </Button>
                        )
                            : (
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
                            )
                    }
                </View>
            </ScrollView>
        </Layout>
    )
}

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
    }
});

export default RoomGoOutScreen;
