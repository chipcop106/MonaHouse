import React, { useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import { StyleSheet, View, ScrollView } from "react-native";
import {
    Input,
    Select,
    SelectItem,
    Icon,
    Text,
    Divider,
    IndexPath,
    Button,
} from "@ui-kitten/components";
import { color, sizes } from "~/config";
import UserInfo from "~/components/UserInfo";

const paymentMethod = ["Tiền mặt", "Chuyển khoản"];

const MoneyCollectScreen = () => {
    const [paymentTypeIndex, setPaymentTypeIndex] = useState(new IndexPath(0));
    const [actuallyReceived, setActuallyReceived] = useState("");
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const loadUserInfo = async () => {
            try {
                const userData = await AsyncStorage.getItem("userInfo");
                setUserInfo(JSON.parse(userData));
            } catch (err) {
                alert(JSON.stringify(err));
            }
        };
        loadUserInfo();
    }, []);

    return (
        <>
            <ScrollView>
                {userInfo ? (
                    <UserInfo
                        avatar={userInfo.Avatar}
                        name={userInfo.FullName}
                        phone={userInfo.Phone}
                    />
                ) : (
                    <Text>Loading...</Text>
                )}
                <View style={styles.mainWrap}>
                    <View style={styles.section}>
                        <Text
                            category="h6"
                            status="primary"
                            style={{ marginBottom: 20 }}
                        >
                            Phòng 02
                        </Text>
                        <View style={[styles.formWrap]}>
                            <View style={[styles.formRow, styles.rowInfo]}>
                                <Text style={styles.rowLabel}>Tiền phòng:</Text>
                                <Text
                                    status="basic"
                                    style={[
                                        styles.rowValue,
                                        { fontWeight: "600" },
                                    ]}
                                >
                                    3.000.000
                                </Text>
                            </View>
                            <View style={[styles.formRow, styles.rowInfo]}>
                                <Text style={styles.rowLabel}>
                                    Điện tháng này:
                                </Text>
                                <Text
                                    status="basic"
                                    style={[
                                        styles.rowValue,
                                        { fontWeight: "600" },
                                    ]}
                                >
                                    3.000.000
                                </Text>
                            </View>
                            <View style={[styles.formRow, styles.rowInfo]}>
                                <Text style={styles.rowLabel}>
                                    Nước tháng này:
                                </Text>
                                <Text
                                    status="basic"
                                    style={[
                                        styles.rowValue,
                                        { fontWeight: "600" },
                                    ]}
                                >
                                    3.000.000
                                </Text>
                            </View>
                            <View style={[styles.formRow, styles.rowInfo]}>
                                <Text style={styles.rowLabel}>
                                    Phí dịch vụ:
                                </Text>
                                <Text
                                    status="basic"
                                    style={[
                                        styles.rowValue,
                                        { fontWeight: "600" },
                                    ]}
                                >
                                    3.000.000
                                </Text>
                            </View>
                            <View style={[styles.formRow, styles.rowInfo]}>
                                <Text style={styles.rowLabel}>Tiền dư:</Text>
                                <Text
                                    status="basic"
                                    style={[
                                        styles.rowValue,
                                        { fontWeight: "600" },
                                    ]}
                                >
                                    3.000.000
                                </Text>
                            </View>
                            <Divider style={styles.divider} />
                            <View style={[styles.formRow, styles.rowInfo]}>
                                <Text style={{ fontWeight: "600" }}>
                                    Tổng thu:
                                </Text>
                                <Text
                                    status="basic"
                                    style={[
                                        styles.rowValue,
                                        { fontWeight: "600" },
                                    ]}
                                >
                                    3.000.000
                                </Text>
                            </View>

                            <View style={[styles.formRow, styles.rowInfo]}>
                                <Text style={styles.rowLabel}>Thực nhận:</Text>
                                <Input
                                    style={[
                                        styles.rowValue,
                                        styles.formControl,
                                    ]}
                                    placeholder="0"
                                    keyboardType="numeric"
                                    value={actuallyReceived}
                                    textStyle={{
                                        color: color.redColor,
                                        textAlign: "right",
                                    }}
                                    onChangeText={(nextValue) =>
                                        setActuallyReceived(nextValue)
                                    }
                                />
                            </View>

                            <View style={[styles.formRow, styles.rowInfo]}>
                                <Text style={styles.rowLabel}>Hình thức:</Text>
                                <Select
                                    style={[
                                        styles.rowValue,
                                        styles.formControl,
                                    ]}
                                    value={paymentMethod[paymentTypeIndex.row]}
                                    selectedIndex={paymentTypeIndex}
                                    onSelect={(index) =>
                                        setPaymentTypeIndex(index)
                                    }
                                >
                                    {paymentMethod
                                        ? paymentMethod.map((option) => (
                                              <SelectItem
                                                  key={(option) => option}
                                                  title={option}
                                              />
                                          ))
                                        : null}
                                </Select>
                            </View>
                        </View>
                    </View>
                    <Button
                        accessoryLeft={() => (
                            <Icon
                                name="credit-card-outline"
                                fill={color.whiteColor}
                                style={sizes.iconButtonSize}
                            />
                        )}
                        size="large"
                        status="success"
                    >
                        Thu tiền phòng này
                    </Button>
                </View>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    mainWrap: {
        paddingHorizontal: 15,
    },
    section: {
        paddingTop: 15,
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
    container: {
        flex: 1,
    },
    formWrap: {
        marginHorizontal: "-1%",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    formRow: {
        marginBottom: 20,
        flexGrow: 1,
        marginHorizontal: "1%",
        alignItems: "center",
    },
    halfCol: {
        flexBasis: "48%",
    },
    fullWidth: {
        flexBasis: "98%",
    },
    leftInput: {
        borderRightWidth: 1,
        borderRightColor: color.darkColor,
        paddingRight: 10,
    },
    rowInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "98%",
    },
    dangerValue: {
        color: color.redColor,
        fontWeight: "600",
    },
    leftInput: {
        borderRightWidth: 1,
        borderRightColor: color.darkColor,
        paddingRight: 10,
    },
    divider: {
        marginBottom: 15,
    },
    rowLabel: {
        color: color.labelColor,
    },
    rowValue: {
        fontWeight: "600",
        flexGrow: 1,
        textAlign: "right",
        paddingLeft: 30,
    },
    formControl: {
        width: "60%",
        flexGrow: 0,
    },
    divider: {
        flexGrow: 1,
        width: "98%",
        marginHorizontal: "1%",
        backgroundColor: color.grayColor,
        marginBottom: 20,
    },
});

export default MoneyCollectScreen;
