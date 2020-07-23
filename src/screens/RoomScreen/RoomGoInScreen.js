import React, { useLayoutEffect, useContext } from "react";
import {
    Text,
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
} from "react-native";
import { Layout, Button, Icon } from "@ui-kitten/components";
import { sizes, color } from "../../config";
import RoomInfoForm from "../../components/GoInForm/RoomInfoForm";
import RenterInfoForm from "../../components/GoInForm/RenterInfoForm";
import CheckoutInfoForm from "../../components/GoInForm/CheckoutInfoForm";
import { Context as RoomGoInContext } from "../../context/RoomGoInContext";
import { Context as AuthContext } from "../../context/AuthContext";
import moment from "moment";

const titleHeader = [
    "Thông tin phòng, ki ốt",
    "Thông tin người thuê",
    "Thanh toán",
];

const RenderForm = () => {
    const {
        state: RoomGoinState,
        changeStateFormStep,
        stepStateChange,
    } = useContext(RoomGoInContext);
    const { step, dataForm } = RoomGoinState;

    return (
        <>
            {step === 0 && (
                <RoomInfoForm
                    onChangeState={changeStateFormStep}
                    initialState={dataForm[step]}
                />
            )}
            {step === 1 && (
                <RenterInfoForm
                    onChangeState={changeStateFormStep}
                    initialState={dataForm[step]}
                />
            )}
            {step === 2 && (
                <CheckoutInfoForm
                    onChangeState={stepStateChange}
                    initialState={dataForm[step]}
                />
            )}
        </>
    );
};

const RoomGoInScreen = ({ navigation, route }) => {
    const { signOut } = useContext(AuthContext);
    const {
        state: RoomGoinState,
        changeStepForm,
        resetState,
        addPeopleToRoom,
    } = useContext(RoomGoInContext);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() =>
                        RoomGoinState.step === 0
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
            headerTitle: titleHeader[RoomGoinState.step],
        });
    }, [navigation, RoomGoinState]);

    const sendFormData = async () => {
        const { dataForm } = RoomGoinState;
        const room = dataForm[0];
        const renter = dataForm[1];
        const checkout = dataForm[2];
        const serviceArr = [...room.services].map((service) => {
            return {
                Name: service.value.name,
                Price: service.value.price,
            };
        });
        const imageArr = [
            {
                Name: "dong-ho-nuoc",
                DataIMG: room.roomInfo?.waterImage || [],
            },
            {
                Name: "dong-ho-dien",
                DataIMG: room.roomInfo?.electrictWater || [],
            },
            {
                Name: "giay-to",
                DataIMG: renter.licenseImages || [],
            },
        ];

        try {
            await addPeopleToRoom(
                {
                    roomid: parseInt(route.params?.roomid),
                    fullname: renter.fullName || "",
                    phone: renter.phoneNumber || "",
                    email: renter.email || "",
                    quantity: parseInt(renter.numberPeople) || 1,
                    relationship: parseInt(
                        renter.relationLists[renter.relationshipIndex].id
                    ),
                    cityid: parseInt(renter.cityLists[renter.provinceIndex].ID),
                    objimg: JSON.stringify(imageArr), //Thay đổi sau khi sửa API
                    datein: moment(room.dateGoIn).format("DD/MM/yyyy"),
                    month: parseInt(room.timeRent),
                    note: renter.note,
                    totalprice: parseInt(checkout.actuallyReceived) || 0,
                    notepaid: checkout.paymentNote,
                    monthpaid: parseInt(checkout.prePaymentTimeIndex),
                    priceroom: parseInt(room.roomPrice) || 0,
                    electrict: parseInt(room.roomInfo?.electrictNumber ?? 0),
                    electrictprice: parseInt(
                        room.roomInfo?.electrictPrice ?? 0
                    ),
                    water: parseInt(room.roomInfo?.waterNumber ?? 0),
                    waterprice: parseInt(room.roomInfo?.waterPrice ?? 0),
                    deposit: parseInt(checkout.totalDeposit),
                    monthdeposit: parseInt(checkout.preDepositTimeIndex) + 1,
                    typeew: 1,
                    addonservice: JSON.stringify(serviceArr),
                },
                {
                    navigation,
                    signOut,
                    resetState,
                }
            );
        } catch (error) {
            alert(JSON.stringify(error.message));
        }

        // navigation.pop();
        // resetState();
    };

    const changeNextStep = () => {
        changeStepForm(1);
    };

    return (
        <Layout style={styles.container} level="3">
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "position" : null}
                // keyboardVerticalOffset={-44}
            >
                <ScrollView
                    style={{}}
                    contentContainerStyle={{
                        justifyContent: "flex-end",
                    }}
                >
                    <RenderForm />
                    <View style={styles.mainWrap}>
                        {RoomGoinState.step < 2 ? (
                            <Button
                                style={styles.btnFt}
                                onPress={changeNextStep}
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
                                {RoomGoinState.step === 0
                                    ? "Cấu hình người thuê"
                                    : "Thông tin thanh toán"}
                            </Button>
                        ) : (
                            <Button
                                style={styles.btnFt}
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
                                Lưu thông tin phòng
                            </Button>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Layout>
    );
};

const styles = StyleSheet.create({
    mainWrap: {
        paddingHorizontal: 15,
        paddingBottom: 15,
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
    btnFt: {
        // borderRadius: 0,
    },
});

export default RoomGoInScreen;
