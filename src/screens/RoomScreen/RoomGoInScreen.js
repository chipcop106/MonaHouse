import React, { useLayoutEffect, useContext } from "react";
import {
  Text, StyleSheet, View, ScrollView, TouchableOpacity, KeyboardAvoidingView
} from "react-native";
import {
  Layout, Button, Icon,
} from "@ui-kitten/components";
import { sizes, color } from "../../config";
import RoomInfoForm from "../../components/GoInForm/RoomInfoForm";
import RenterInfoForm from "../../components/GoInForm/RenterInfoForm";
import CheckoutInfoForm from "../../components/GoInForm/CheckoutInfoForm";
import { Context as RoomGoInContext } from "../../context/RoomGoInContext";


const titleHeader = ["Thông tin phòng, ki ốt", "Thông tin người thuê", "Thanh toán"];

const RenderForm = () => {
  const { state: RoomGoinState, changeStateFormStep, stepStateChange } = useContext(RoomGoInContext);
  const { step, dataForm } = RoomGoinState;
  
  return (
    <>
      {step === 0
            && (
            <RoomInfoForm
              onChangeState={changeStateFormStep}
              initialState={dataForm[step]}
            />
            )}
      {step === 1
            && (
            <RenterInfoForm
              onChangeState={changeStateFormStep}
              initialState={dataForm[step]}
            />
            )}
      {step === 2
            && (
            <CheckoutInfoForm
              onChangeState={stepStateChange}
              initialState={dataForm[step]}
            />
            )}
    </>
  );
};

const RoomGoInScreen = ({ navigation }) => {
  const { state: RoomGoinState, changeStepForm, resetState } = useContext(RoomGoInContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => (RoomGoinState.step === 0 ? navigation.pop() : changeStepForm(-1))}
        >
          <Icon name="arrow-back-outline" fill={color.primary} style={sizes.iconButtonSize} />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      ),
      headerTitle: titleHeader[RoomGoinState.step],
    });
  }, [navigation, RoomGoinState]);

  const sendFormData = (state) => {
    const { dataForm } = state;
    alert(JSON.stringify(dataForm));
    navigation.pop();
    resetState();
  };


  return (

  <Layout style={styles.container} level="3">
    <KeyboardAvoidingView style={{flex: 1}} 
      behavior={Platform.OS === "ios" ? "position" : null} 
      // keyboardVerticalOffset={-44}
    >
      <ScrollView style={{}} contentContainerStyle={{
        justifyContent: "flex-end"
        }}>
        
        <RenderForm />
        <View
          style={styles.mainWrap}
        >
          {
                        RoomGoinState.step < 2 ? (
                          <Button
                          style={styles.btnFt}
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
                            {RoomGoinState.step === 0 ? "Cấu hình người thuê" : "Thông tin thanh toán"}
                          </Button>
                        )
                          : (
                            <Button
                              style={styles.btnFt}
                              onPress={() => sendFormData(RoomGoinState)}
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
                          )
                    }
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
  }
});

export default RoomGoInScreen;
