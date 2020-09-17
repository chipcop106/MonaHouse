import React, { useReducer } from "react";
import { StyleSheet, View, ScrollView, Alert } from "react-native";

import { Input, Icon, Button } from "@ui-kitten/components";
import { color, sizes } from "~/config";

const initialState = {
    waterPrice: "5000",
    electrictPrice: "3500",
    roomPrice: "500000",
};

const reducer = (state, { type, payload }) => {
    switch (type) {
        case "STATE_CHANGE": {
            return {
                ...state,
                [payload.field]: payload.value,
            };
            break;
        }

        default:
            return state;
            break;
    }
};

const SettingElectrictScreen = ({ navigation }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const _onSubmit = () => {
        Alert.alert("Thông báo", "Cập nhật thành công !!", [
            { text: "OK", onPress: () => navigation.pop() },
        ]);
    };

    const onPressWithParrams = (key, params = {}) => {
        navigation.navigate(key, params);
    };

    const updateState = (field, value) => {
        dispatch({ type: "STATE_CHANGE", payload: { field, value } });
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.secWrap}>
                    <View style={styles.formGroup}>
                        <Input
                          returnKeyType={"done"}
                            label="Giá phòng mặc định"
                            placeholder="0"
                            style={styles.inputControl}
                            textStyle={styles.inputText}
                            value={state.roomPrice}
                            onChangeText={(value) =>
                                updateState("roomPrice", value)
                            }
                        />
                    </View>
                    <View style={styles.formGroup}>
                        <Input
                          returnKeyType={"done"}
                            label="Giá nước / m3"
                            placeholder="0"
                            style={styles.inputControl}
                            textStyle={styles.inputText}
                            value={state.waterPrice}
                            onChangeText={(value) =>
                                updateState("waterPrice", value)
                            }
                        />
                    </View>
                    <View style={[styles.formGroup, { paddingBottom: 15 }]}>
                        <Input
                          returnKeyType={"done"}
                            label="Giá điện / kW"
                            placeholder="0"
                            style={styles.inputControl}
                            textStyle={styles.inputText}
                            value={state.electrictPrice}
                            onChangeText={(value) =>
                                updateState("electrictPrice", value)
                            }
                        />
                    </View>
                </View>
                <View style={styles.submitButton}>
                    <Button
                        onPress={_onSubmit}
                        status="danger"
                        size="giant"
                        accessoryLeft={() => (
                            <Icon
                                name="sync"
                                fill={color.whiteColor}
                                style={sizes.iconButtonSize}
                            />
                        )}
                        style={{ borderRadius: 0 }}
                        textStyle={{ fontSize: 18 }}
                    >
                        Cập nhật
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
};

export default SettingElectrictScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: color.darkColor,
        flex: 1,
    },
    secWrap: {
        marginBottom: 30,
    },
    avatar: {
        width: 75,
        height: 75,
    },
    linkCarret: {
        width: 30,
        height: 30,
    },
    inputControl: {
        backgroundColor: "transparent",
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 0,
        borderBottomColor: color.lightWeight,
    },
    inputText: {
        color: color.whiteColor,
        marginLeft: 0,
    },
    formGroup: {
        backgroundColor: color.darkShadowColor,
        padding: 15,
        paddingBottom: 0,
    },
    upgradeBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 15,
        position: "relative",
    },
    upgradeText: {
        fontSize: 24,
        color: color.darkColor,
    },
    upgradeIcon: {
        width: 45,
        height: 45,
        transform: [{ rotate: "-45deg" }],
        position: "absolute",
        right: 30,
    },
    userInfo: {
        alignItems: "center",
        paddingTop: 15,
    },
    userName: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
    },
    badge: {
        paddingHorizontal: 5,
        paddingVertical: 3,
        backgroundColor: color.primary,
        borderRadius: 4,
        marginLeft: 5,
    },
    name: {
        color: color.whiteColor,
        fontWeight: "600",
        fontSize: 18,
    },
    expiredDate: {
        color: color.whiteColor,
    },
    itemWrap: {
        backgroundColor: "rgba(65,63,98,1)",
    },
    itemInner: {
        paddingHorizontal: 15,
        minHeight: 50,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
    },
    textColor: {
        color: "#fff",
    },
    textSettingSize: {
        fontSize: 16,
    },
    settingIcon: {
        width: 35,
        height: 35,
    },
    linkText: {
        flexGrow: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginLeft: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: color.lightWeight,

        paddingVertical: 15,
    },
    submitButton: {
        marginBottom: 30,
    },
});
