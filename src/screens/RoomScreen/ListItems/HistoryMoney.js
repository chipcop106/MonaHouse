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
import Swiper from "react-native-swiper";

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
    wrapCard: {
        flexDirection: "row",
        backgroundColor: "#fff",
        flexGrow: 1,
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: "center",
        ...shadowStyle
        // shadowColor: "rgba(0,0,0,.35)",
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,

        // elevation: 5,
    },
    datetime: {
        textAlign: "center",
        paddingRight: 15,
    },
    date: {
        fontSize: 18,
        color: "#ccc",
        fontWeight: "600",
        textAlign: "center",
    },
    year: {
        textAlign: "center",
        fontWeight: "600",
        color: "#ccc",
        fontSize: 24
    },
    metaIcon: {
        width: 20,
        height: 20,
        marginRight: 3,
    },
    info: {
        justifyContent: "space-between",
        flexGrow: 1,
    },
    metaWrap: {
        flexDirection: "row",
        marginTop: 5,
    },
    meta: {
        flex: 1,
        flexDirection: "row",
        marginRight: 30,
        alignItems: "center",
    },
    name: {
        fontSize: 20,
        color: color.primary,
        fontWeight: "bold",
    },
    textNumber: {
        letterSpacing: 1,
        color: color.darkColor,
        margin: 0,
        fontSize: 16,
    },
});

const HistoryRecord = ({ style, renterInfo = false, title = "Phòng 01" }) => {
    const [visible, setVisible] = React.useState(false);
    return (
        <>
            <View style={style}>
                <View style={styles.wrapCard}>
                    {!renterInfo && (
                        <View style={styles.datetime}>
                            <Text style={styles.date}>05/08</Text>
                            <Text style={styles.year}>2020</Text>
                        </View>
                    )}

                    <View style={styles.info}>
                        <Text style={styles.name}>{title}</Text>
                        <View style={styles.metaWrap}>
                            {renterInfo ? (
                                <>
                                    <View style={styles.meta}>
                                        <Icon
                                            name="log-in-outline"
                                            fill={color.darkColor}
                                            style={styles.metaIcon}
                                        />
                                        <Text style={styles.textNumber}>
                                            20/04/2020
                                        </Text>
                                    </View>
                                    <View style={styles.meta}>
                                        <Icon
                                            name="log-out-outline"
                                            fill={color.darkColor}
                                            style={styles.metaIcon}
                                        />
                                        <Text style={styles.textNumber}>
                                            20/06/2020
                                        </Text>
                                    </View>
                                </>
                            ) : (
                                <>
                                    <View style={styles.meta}>
                                        <Icon
                                            name="droplet-outline"
                                            fill={color.darkColor}
                                            style={styles.metaIcon}
                                        />
                                        <Text style={styles.textNumber}>
                                            8879909
                                        </Text>
                                    </View>
                                    <View style={styles.meta}>
                                        <Icon
                                            name="flash-outline"
                                            fill={color.darkColor}
                                            style={styles.metaIcon}
                                        />
                                        <Text style={styles.textNumber}>
                                            3355542
                                        </Text>
                                    </View>
                                </>
                            )}
                        </View>
                    </View>
                    {/* <TouchableOpacity
                        onPress={() => setVisible(!visible)}
                        style={styles.action}
                    >
                        <Icon
                            name="image-outline"
                            fill={color.darkColor}
                            style={{
                                width: 30,
                                height: 30,
                                textAlign: "center",
                                marginBottom: 3,
                            }}
                        />
                        <Text
                            style={{
                                textAlign: "center",
                            }}
                        >
                            Ảnh
                        </Text>
                    </TouchableOpacity> */}
                </View>
            </View>
        </>
    );
};

export default HistoryRecord;
