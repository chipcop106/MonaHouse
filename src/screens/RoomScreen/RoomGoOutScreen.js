import React, { useContext, useLayoutEffect, useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, ScrollView, Linking } from "react-native";
import { Text, Layout, Button, Icon, Avatar } from '@ui-kitten/components';
import GoOutInfo from "../../components/GoOutForm/GoOutInfo";
import GoOutCheckout from "../../components/GoOutForm/GoOutCheckout";
import { Context as RoomGoOutContext } from '../../context/RoomGoOutContext'
import { sizes, color } from '../../config'
import AsyncStorage from '@react-native-community/async-storage'
import UserInfo from '~/components/UserInfo';
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
    const { state: RoomGoOutState, changeStepForm, clearState } = useContext(RoomGoOutContext);
    const [userInfo, setUserInfo] = useState({})

    const loadUserInfo = async () => {
        try {
            const userData = await AsyncStorage.getItem('userInfo');
            setUserInfo(JSON.parse(userData));
        } catch(err) {
            console.log(err);
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
        loadUserInfo();
    }, [])

    const sendFormData = () =>{
        alert(JSON.stringify(RoomGoOutState));
        navigation.pop();
        clearState();
    }

    return (
        <Layout style={styles.container} level="3">
            <ScrollView>
            {userInfo ? (<UserInfo avatar={userInfo.Avatar} name={userInfo.FullName} phone={userInfo.Phone}/>) : <Text>Loading user info...</Text>}
                <RenderForm />
                <View
                    style={styles.mainWrap}
                >
                    {
                        RoomGoOutState.step < 1 ? (
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
