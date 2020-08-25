
import React, { useLayoutEffect, useContext, useEffect } from "react";
import {
    Text,
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    NativeModules, Platform
} from "react-native";
import { Layout, Button, Icon } from "@ui-kitten/components";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import moment from "moment";
import { useHeaderHeight } from "@react-navigation/stack";
import { sizes, color } from "../../config";
import RoomInfoForm from "../../components/GoInForm/RoomInfoForm";
import RenterInfoForm from "../../components/GoInForm/RenterInfoForm";
import CheckoutInfoForm from "../../components/GoInForm/CheckoutInfoForm";
import { Context as RoomGoInContext } from "../../context/RoomGoInContext";
import { Context as AuthContext } from "../../context/AuthContext";
import { Context as RoomContext } from "~/context/RoomContext";
import Loading from "~/components/common/Loading";

const titleHeader = [
  "Thông tin phòng, ki ốt",
  "Thông tin người thuê",
  "Thanh toán",
];

const RenderForm = props => {
    const {
        state: RoomGoinState,
        changeStateFormStep,
        stepStateChange,
    } = useContext(RoomGoInContext);
    const { step, dataForm } = RoomGoinState;
    console.log('RenderForm step:', step);
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
    changeStateFormStep,
    resetState,
    addPeopleToRoom,
    stepStateChange,
    loadRoomInfo,
  } = useContext(RoomGoInContext);
  const { step, dataForm } = RoomGoinState;
  const { updateState: updateState_Room } = useContext(RoomContext);
  useEffect(() => {
    console.log("RoomGoinState", RoomGoinState);
    loadRoomInfo(route.params?.roomId);
    return () => {
      resetState();
    };
  }, []);
  const headerHeight = useHeaderHeight();
  const onPress_headerLeft = () => {
    step === 0 ? navigation.pop() : changeStepForm(-1);
  };
  useLayoutEffect(() => {
    !RoomGoinState.isLoading &&
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onPress_headerLeft}
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
  }, [RoomGoinState]);

    const sendFormData = async () => {
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
                Name: 'dong-ho-nuoc',
                DataIMG: !!room.roomInfo?.waterImage ?  !!room.waterImage?.ID ? [{
                    ID: room.waterImage.ID,
                    URL: room.waterImage.UrlIMG
                }] : [{
                    ID: 0,
                    URL: room.roomInfo?.waterImage
                }] : [],
            },
            {
                Name: 'dong-ho-dien',
                DataIMG: !!room.roomInfo?.electrictImage ?  !!room.electrictImage?.ID ? [{
                    ID: room.electrictImage.ID,
                    URL: room.electrictImage.UrlIMG
                }] : [{
                    ID: 0,
                    URL: room.roomInfo?.electrictImage
                }] : [],
            },
            {
                Name: 'giay-to',
                DataIMG: ( ()=>{
                    let rs = [];
                    try {
                        Array.isArray(renter?.licenseImages) && renter?.licenseImages.length > 0 && renter?.licenseImages.map( it =>  rs.push({ID: it.ID, URL: it.UrlIMG}))
                    } catch (error) {
                        console.log('giay-to DataIMG error', error);
                    }

                    return rs;
                } )() ,
            },
        ];
        console.log('imageArr', imageArr);

        try {
            let datein = moment(room.dateGoIn).format("DD/MM/yyyy");
            datein === "Invalid date" && ( datein = moment().format("DD/MM/yyyy") );
            await addPeopleToRoom(
                {
                    roomid: parseInt(route.params?.roomId || 0),
                    fullname: renter.fullName || "",
                    phone: renter.phoneNumber || "",
                    job: renter.job || "",
                    cityid: parseInt(renter.cityLists[renter.provinceIndex].ID),
                    objimg: JSON.stringify(imageArr),  // imageArr
                    datein: datein,
                    month: parseInt(room.timeRent),
                    note: renter.note,
                    totalprice: parseInt(checkout.actuallyReceived) || 0,
                    notepaid: checkout.paymentNote,
                    monthpaid: parseInt(checkout.prePaymentTimeIndex),
                    priceroom: parseInt(room.roomPrice) || 0,
                    electric: parseInt(room.roomInfo?.electrictNumber || 0),
                    electricprice: parseInt(
                        room.roomInfo?.electrictPrice || 0
                    ),
                    water: parseInt(room.roomInfo?.waterNumber || 0),
                    waterprice: parseInt(room.roomInfo?.waterPrice || 0),
                    monthdeposit: parseInt(checkout.preDepositTimeIndex) + 1,
                    addonservice: serviceArr.length > 0 ? JSON.stringify(serviceArr.map(item => {
                        return { ID: 0 , ...item }
                    })) || '' : '',
                    email: renter.email || "",
                    quantity: parseInt(renter.numberPeople) || 1,
                    relationship: parseInt(
                        renter.relationLists[renter.relationshipIndex.row].id
                    ),  
                    // deposit: parseInt(checkout.totalDeposit),
                    typeew: 1,
                },
                {
                    navigation,
                    signOut,
                    resetState,
                }
            );
            updateState_Room('isReload', true);
        } catch (error) {
            console.log('sendFormData error', error)
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
            {!!RoomGoinState.isLoading 
            ? <View style={{alignItems: "center", padding: 15,}}><Loading /></View> 
            : <KeyboardAwareScrollView
                style={{ flex: 1}}
                contentContainerStyle={{paddingVertical: 15}}
                extraScrollHeight={headerHeight}
                // viewIsInsideTabBar={true}
                keyboardOpeningTime={150}
            >
                <RenderForm 
                />
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
            </KeyboardAwareScrollView>}
            
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
