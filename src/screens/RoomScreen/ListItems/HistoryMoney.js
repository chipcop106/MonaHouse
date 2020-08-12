import React from "react";
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Dimensions,
    Image,
} from "react-native";
import { Icon, Text, Modal, Card } from "@ui-kitten/components";
import { color, shadowStyle } from "~/config";

const { height } = Dimensions.get("window");

const history = StyleSheet.create({
    name: {
        fontSize: 20,
        color: color.primary,
        fontWeight: "bold",
    },
    container: {
        backgroundColor: "#fff",
        marginBottom: 10,
        borderRadius: 6,
        ...shadowStyle
    },
    flexRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconLeft: {
        width: 45,
        height: 45,
    },
    roundIcon: {
        width: 60,
        height: 60,
        borderWidth: 1,
        borderColor: color.darkColor,
        borderRadius: 60 / 2,
        padding: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    leftPart: {
        flexBasis: 90,
        padding: 15,
    },
    rightPart: {
        flexGrow: 1,
        padding: 15,
        paddingLeft: 0,
        justifyContent: "space-between",
        flexBasis: 100,
    },
    title: {
        fontWeight: "600",
        marginBottom: 10,
    },
    money: {
        fontSize: 18,
        color: color.redColor,
        fontWeight: "bold",
    },
    date: {
        color: "#c0c0c0",
        fontWeight: "600",
    },
    meta: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
});

const HistoryRecord = ({ style, renterInfo = false, title = "Phòng 01" }) => {
    const [visible, setVisible] = React.useState(false);
    return (
        <View style={history.container}>
            <View style={history.flexRow}>
                <View style={history.leftPart}>
                    <View style={history.roundIcon}>
                        <Icon
                            name="credit-card"
                            fill={color.darkColor}
                            style={history.iconLeft}
                        />
                    </View>
                </View>
                <View style={history.rightPart}>
                    <Text style={history.name}>{title}</Text>
                    <Text style={history.title}>
                        Thanh toán tiền nhà tháng 5 hanh toán tiền
                        nhà tháng 5 hanh toán tiền nhà tháng 5
                    </Text>
                    <View style={history.meta}>
                        <Text style={history.money}>3.000.000</Text>
                        <Text style={history.date}>
                            20/10/2020 10:30
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default HistoryRecord;
