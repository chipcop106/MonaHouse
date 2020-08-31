import React, { useReducer } from "react";
import { StyleSheet, View, ScrollView, Alert } from "react-native";

import { Input, Icon, Button } from "@ui-kitten/components";
import { color, sizes } from "~/config";

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

const SettingChangePasswordScreen = ({ navigation, route = {} }) => {
    const [state, dispatch] = useReducer(reducer, route.params);
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
                            label="Mật khẩu cũ"
                            placeholder="Nhập mật khẩu cũ"
                            style={styles.inputControl}
                            textStyle={styles.inputText}
                            value={state.oldPassword}
                            secureTextEntry={true}
                            autoCapitalize={false}
                            onChangeText={(value) =>
                                updateState("oldPassword", value)
                            }
                        />
                    </View>
                    <View style={styles.formGroup}>
                        <Input
                            label="Mật khẩu mới"
                            placeholder="Nhập mật khẩu mới"
                            style={styles.inputControl}
                            textStyle={styles.inputText}
                            value={state.newPassword}
                            autoCapitalize={false}
                            secureTextEntry={true}
                            onChangeText={(value) =>
                                updateState("newPassword", value)
                            }
                        />
                    </View>
                    <View style={[styles.formGroup, { paddingBottom: 15 }]}>
                        <Input
                            label="Nhập lại khẩu mới"
                            placeholder="Nhập lại mật khẩu mới"
                            style={[styles.inputControl]}
                            textStyle={styles.inputText}
                            autoCapitalize={false}
                            value={state.renewPassword}
                            secureTextEntry={true}
                            onChangeText={(value) =>
                                updateState("renewPassword", value)
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
                        Thay đổi mật khẩu
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
};

export default SettingChangePasswordScreen;

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
