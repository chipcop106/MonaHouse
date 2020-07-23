import React, { useReducer } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Alert,
    Image,
} from "react-native";
import { Avatar, Input, Icon, Button } from "@ui-kitten/components";
import { color, sizes } from "~/config";
import LinearGradient from "react-native-linear-gradient";
import ImagePicker from "react-native-image-crop-picker";

const initialState = {
    avatar: null,
    fullName: "Lê Chân",
    phoneNumber: "0886706289",
    email: "vietdat106@gmail.com",
    address: "319 c16, Lý Thường Kiệt, Phường 15, quậ 11, tp HCM",
    oldPassword: "",
    newPassword: "",
    renewPassword: "",
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

const SettingUserDetailScreen = ({ navigation }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const _onSubmit = () => {
        Alert.alert("Thông báo", "Cập nhật thành công !!");
    };

    const onPressWithParrams = (key, params = {}) => {
        navigation.navigate(key, params);
    };

    const updateState = (field, value) => {
        dispatch({ type: "STATE_CHANGE", payload: { field, value } });
    };

    const handleChoosePhoto = async (key) => {
        try {
            const options = {
                cropping: true,
                cropperToolbarTitle: "Chỉnh sửa ảnh",
                maxFiles: 10,
                compressImageMaxWidth: 1280,
                compressImageMaxHeight: 768,
                mediaType: "photo",
            };
            ImagePicker.openPicker(options).then((images) => {
                updateState(key, images);
            });
        } catch (error) {}
    };

    React.useEffect(() => {
        // console.log(state);
    });

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.secWrap}>
                    <View style={styles.userInfo}>
                        <TouchableOpacity
                            onPress={() => handleChoosePhoto("avatar")}
                        >
                            <Avatar
                                source={{
                                    uri:
                                        state.avatar?.path ??
                                        "https://photo-1-baomoi.zadn.vn/w1000_r1/2019_03_06_251_29881209/fdd38a4374029d5cc413.jpg",
                                }}
                                shape="round"
                                size="giant"
                                style={styles.avatar}
                            />
                        </TouchableOpacity>
                        <View style={styles.userName}>
                            <Text style={[styles.name, styles.textColor]}>
                                Lê Chân
                            </Text>
                            <View style={styles.badge}>
                                <Text
                                    style={{
                                        fontWeight: "bold",
                                        color: color.darkColor,
                                    }}
                                >
                                    Premium
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.expiredDate}>
                            Hết hạn:{" "}
                            <Text style={{ fontWeight: "bold" }}>
                                03/02/2020
                            </Text>
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={{
                            ...styles.secWrap,
                            paddingHorizontal: 15,
                            marginTop: 15,
                            marginBottom: 0,
                        }}
                        onPress={() =>
                            onPressWithParrams("SettingPremiumPackage", {
                                id: null,
                            })
                        }
                    >
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            useAngle={true}
                            angle={45}
                            angleCenter={{ x: 0.5, y: 0.25 }}
                            colors={color.gradients.primary}
                            style={{
                                borderRadius: 50,
                            }}
                        >
                            <View style={styles.upgradeBtn}>
                                <Text style={styles.upgradeText}>
                                    Nâng cấp Premium
                                </Text>
                                <Image
                                    style={styles.upgradeIcon}
                                    source={require("./../../../assets/upgrade.png")}
                                />
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
                <View style={styles.secWrap}>
                    <View style={styles.formGroup}>
                        <Input
                            label="Họ và tên"
                            placeholder="Full name"
                            style={styles.inputControl}
                            textStyle={styles.inputText}
                            value={state.fullName}
                            onChangeText={(value) =>
                                updateState("fullName", value)
                            }
                        />
                    </View>
                    <View style={styles.formGroup}>
                        <Input
                            disabled
                            label="Số điện thoại"
                            placeholder="Phone"
                            style={[styles.inputControl, styles.disabledInput]}
                            textStyle={[
                                styles.inputText,
                                { color: color.primary },
                            ]}
                            value={state.phoneNumber}
                            keyboardType="numeric"
                            accessoryRight={() => (
                                <>
                                    <Icon
                                        name="lock"
                                        fill={color.primary}
                                        style={{
                                            width: 25,
                                            height: 25,
                                        }}
                                    />
                                </>
                            )}
                        />
                    </View>
                    <View style={styles.formGroup}>
                        <Input
                            label="Email"
                            placeholder="Email address"
                            style={styles.inputControl}
                            textStyle={styles.inputText}
                            value={state.email}
                            onChangeText={(value) =>
                                updateState("email", value)
                            }
                            keyboardType="email-address"
                        />
                    </View>
                    <View style={[styles.formGroup, { paddingBottom: 15 }]}>
                        <Input
                            label="Địa chỉ"
                            placeholder="Address"
                            style={styles.inputControl}
                            textStyle={styles.inputText}
                            value={state.address}
                            onChangeText={(value) =>
                                updateState("address", value)
                            }
                            keyboardType="default"
                        />
                    </View>
                </View>
                <View style={styles.secWrap}>
                    <View style={styles.itemWrap}>
                        <TouchableOpacity
                            style={styles.itemInner}
                            onPress={() =>
                                onPressWithParrams(
                                    "SettingChangePassword",
                                    initialState
                                )
                            }
                        >
                            <Icon
                                name="shield-outline"
                                fill={color.iconSettingColor}
                                style={styles.settingIcon}
                            />
                            <View
                                style={[
                                    styles.linkText,
                                    { borderBottomWidth: 0 },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.textColor,
                                        styles.textSettingSize,
                                    ]}
                                >
                                    Thay đổi mật khẩu
                                </Text>
                                <Icon
                                    name="chevron-right"
                                    fill={color.lightWeight}
                                    style={styles.linkCarret}
                                />
                            </View>
                        </TouchableOpacity>
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
                        Cập nhật tài khoản
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
};

export default SettingUserDetailScreen;

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
    disabledInput: {
        backgroundColor: color.darkShadowColor,
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
