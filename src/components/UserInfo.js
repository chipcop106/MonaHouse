import React, { memo } from "react";
import { StyleSheet, View, TouchableOpacity, Linking } from "react-native";
import { Text, Avatar, Icon } from "@ui-kitten/components";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { color } from "~/config";
import gbStyle from "~/GlobalStyleSheet";

const LeftAction = (_deletePeople) => {
    return (
        <TouchableOpacity onPress={_deletePeople}>
            <View style={styles.leftAction}>
                <Icon
                    name="trash"
                    fill={color.redColor}
                    style={{ width: 30, height: 30 }}
                />
            </View>
        </TouchableOpacity>
    );
};

const UserInfo = ({
    avatar,
    name,
    phone,
    balance,
    styleContainer,
    styleCard,
    deletePeople,
}) => {
    return (
        <View style={styleContainer ? styleContainer : styles.userSection}>
            <Swipeable
                renderLeftActions={
                    deletePeople ? () => LeftAction(deletePeople) : null
                }
            >
                <View style={[styleCard ? styleCard : styles.section]}>
                    <View style={styles.userWrap}>
                        <View style={styles.userInfo}>
                            <Avatar
                                style={styles.avatar}
                                shape="round"
                                size="medium"
                                source={
                                    avatar
                                        ? { uri: avatar }
                                        : require("~/../assets/user.png")
                                }
                            />
                            <View style={gbStyle.mLeft10}>
                                <Text style={styles.userName}>{name}</Text>
                                <Text style={styles.phoneNumber}>
                                    {balance
                                        ? `Số dư: ${balance}`
                                        : phone
                                        ? phone
                                        : "Chưa có"}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => Linking.openURL(`tel:${phone}`)}
                        >
                            <Icon
                                name="phone-outline"
                                fill={color.primary}
                                style={{ width: 30, height: 30 }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </Swipeable>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        paddingHorizontal: 15,
        marginBottom: 30,
        backgroundColor: color.whiteColor,
        borderRadius: 8,
    },
    userWrap: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 0,
        marginBottom: 0,
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
    },
    userSection: {
        marginBottom: 0,
        paddingHorizontal: 15,
        marginTop: 15,
    },
    userName: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 5,
    },
    userPhone: {
        color: color.labelColor,
    },
    leftAction: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 15,
    },
});

export default memo(UserInfo);
