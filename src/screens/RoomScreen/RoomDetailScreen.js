import React, { useContext, useReducer, useEffect } from "react";
import {
    StyleSheet,
    View,
    Image,
    Dimensions,
    ScrollView,
    KeyboardAvoidingView,
    Alert,
} from "react-native";
import {
    Card,
    Icon,
    Modal,
    Text,
    List,
    Spinner,
    Button,
    Avatar,
} from "@ui-kitten/components";
import UserInfo from "~/components/UserInfo";
import { color, settings } from "~/config";
import { TouchableOpacity } from "react-native-gesture-handler";
import gbStyle from "~/GlobalStyleSheet";
import NavLink from "~/components/common/NavLink";
import { getRoomById } from "~/api/MotelAPI";
import { currencyFormat as cf } from "~/utils";
import { Context as RoomContext } from "~/context/RoomContext";
const { height } = Dimensions.get("window");

const initialState = {
    visible: false,
    lightboxUrl: null,
    roomInfo: null,
};

const reducer = (prevstate, { type, payload }) => {
    switch (type) {
        case "STATE_CHANGE": {
            return {
                ...prevstate,
                [payload.key]: payload.value,
            };
        }
        default:
            return prevstate;
    }
};

const People = ({ phone = "", name = "", img }) => {
    return (
        <View style={styles.peopleContainer}>
            <View style={styles.flexRow}>
                <Avatar
                    size="giant"
                    source={
                        img
                            ? { uri: img }
                            : require("./../../../assets/user.png")
                    }
                />
                <View style={styles.peopleInfo}>
                    <Text style={styles.peopleName}>Trương Văn Lam</Text>
                    <View style={{ ...styles.flexRow, marginTop: 5 }}>
                        <Icon
                            name="phone"
                            style={{ width: 25, height: 25 }}
                            fill={color.darkColor}
                        />
                        <Text style={styles.phoneNumber}>0123456789</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const RoomDetailScreen = ({ navigation, route }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { deleteRoom } = useContext(RoomContext);
    const roomId = route.params?.roomId ?? null;
    const { roomInfo } = state;
    console.log(roomInfo);
    const updateState = (key, value) => {
        dispatch({ type: "STATE_CHANGE", payload: { key, value } });
    };

    const showLightBoxModal = (url) => {
        updateState("lightboxUrl", url);
        updateState("visible", true);
    };

    const loadRoomInfo = async () => {
        try {
            const res = await getRoomById({ roomid: roomId });
            navigation.setOptions({
                headerTitle: res.Data?.room.NameRoom ?? "Chi tiết phòng null",
            });
            dispatch({
                type: "STATE_CHANGE",
                payload: { key: "roomInfo", value: res.Data },
            });
        } catch (err) {
            alert(err.message);
        }
    };

    const _deleteRoom = () => {
        Alert.alert("Cảnh báo !!", "Bạn có chắc muốn xóa phòng này ??", [
            {
                text: "Xóa phòng này  ",
                onPress: () => {
                    deleteRoom({ roomid: roomId }, { navigation });
                },
            },
            {
                text: "Hủy bỏ",
                onPress: () => {
                    return;
                },
            },
        ]);
    };

    const _deletePeople = () => {
        alert("delete people");
    };

    useEffect(() => {
        loadRoomInfo();
    }, []);

    return (
        <>
            {!roomInfo ? (
                <View
                    style={{
                        flexGrow: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Spinner size="giant" status="primary" />
                </View>
            ) : (
                <>
                    <ScrollView>
                        <View style={styles.container}>
                            <View style={{ marginHorizontal: -15 }}>
                                <UserInfo
                                    name={
                                        roomInfo.renter.renter.FullName
                                            ? roomInfo.renter.renter.FullName
                                            : "Chưa có khách"
                                    }
                                    phone={roomInfo.renter.renter.Phone}
                                />
                            </View>

                            <View style={styles.secWrap}>
                                <View
                                    style={{
                                        ...styles.flexRow,
                                        alignItems: "center",
                                        marginBottom: 15,
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Text
                                        style={{
                                            ...styles.secTitle,
                                            marginBottom: 0,
                                        }}
                                    >
                                        Thông tin phòng
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() =>
                                            navigation.navigate("EditRoom", {
                                                roomInfo,
                                                onGoBack: () => loadRoomInfo(),
                                            })
                                        }
                                    >
                                        <View style={styles.flexRow}>
                                            <Icon
                                                name="edit-2"
                                                fill={color.primary}
                                                style={{
                                                    width: 25,
                                                    height: 25,
                                                    marginLeft: 15,
                                                    marginRight: 5,
                                                }}
                                            />
                                            <Text
                                                status="primary"
                                                category="s1"
                                            >
                                                Chỉnh sửa
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                                <View
                                    style={[
                                        styles.sec,
                                        { paddingHorizontal: 0 },
                                    ]}
                                >
                                    <View
                                        style={[
                                            styles.flexRow,
                                            {
                                                borderBottomWidth: 1,
                                                borderBottomColor:
                                                    color.grayColor,
                                                paddingBottom: 15,
                                            },
                                        ]}
                                    >
                                        <View style={styles.info}>
                                            <Text style={styles.labelInfo}>
                                                Giá phòng
                                            </Text>
                                            <Text style={styles.value}>
                                                {cf(roomInfo.room.PriceRoom)}
                                            </Text>
                                        </View>
                                        <View
                                            style={[
                                                styles.info,
                                                { flexGrow: 1 },
                                            ]}
                                        >
                                            <Text style={styles.labelInfo}>
                                                Giá điện / KW
                                            </Text>
                                            <Text style={styles.value}>
                                                {cf(
                                                    roomInfo.room.PriceElectric
                                                )}
                                            </Text>
                                        </View>
                                        <View
                                            style={[
                                                styles.info,
                                                { borderRightWidth: 0 },
                                            ]}
                                        >
                                            <Text style={styles.labelInfo}>
                                                Giá nước / m3
                                            </Text>
                                            <Text style={styles.value}>
                                                {cf(roomInfo.room.PriceWater)}
                                            </Text>
                                        </View>
                                    </View>
                                    <View
                                        style={[gbStyle.px15, gbStyle.mTop15]}
                                    >
                                        <View style={styles.rowInfo}>
                                            <Text style={styles.label}>
                                                Ngày dọn vào
                                            </Text>
                                            <Text style={styles.value}>
                                                20/01/2019
                                            </Text>
                                        </View>
                                        <View style={[styles.rowInfo]}>
                                            <Text style={styles.label}>
                                                Tiền dư tháng trước
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.value,
                                                    roomInfo.dept < 0
                                                        ? {
                                                              color:
                                                                  color.redColor,
                                                          }
                                                        : {
                                                              color:
                                                                  color.greenColor,
                                                          },
                                                ]}
                                            >
                                                {cf(roomInfo.dept)}
                                            </Text>
                                        </View>
                                        <View style={styles.rowInfo}>
                                            <Text style={styles.label}>
                                                Điện tháng trước
                                            </Text>
                                            <TouchableOpacity
                                                style={styles.flexRow}
                                                onPress={() =>
                                                    showLightBoxModal(
                                                        "https://i-ngoisao.vnecdn.net/2019/06/09/1-ngoc-trinh-9-8531-1560048529.jpg"
                                                    )
                                                }
                                            >
                                                <Icon
                                                    name="image-outline"
                                                    fill={color.primary}
                                                    style={{
                                                        width: 18,
                                                        height: 18,
                                                        marginRight: 3,
                                                    }}
                                                />
                                                <Text
                                                    style={[
                                                        styles.value,
                                                        {
                                                            color:
                                                                color.primary,
                                                        },
                                                    ]}
                                                >
                                                    33232112
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.rowInfo}>
                                            <Text style={styles.label}>
                                                Nước tháng trước
                                            </Text>
                                            <TouchableOpacity
                                                style={styles.flexRow}
                                                onPress={() =>
                                                    showLightBoxModal(
                                                        "https://i-ngoisao.vnecdn.net/2019/06/09/1-ngoc-trinh-9-8531-1560048529.jpg"
                                                    )
                                                }
                                            >
                                                <Icon
                                                    name="image-outline"
                                                    fill={color.primary}
                                                    style={{
                                                        width: 18,
                                                        height: 18,
                                                        marginRight: 3,
                                                    }}
                                                />
                                                <Text
                                                    style={[
                                                        styles.value,
                                                        {
                                                            color:
                                                                color.primary,
                                                        },
                                                    ]}
                                                >
                                                    33232112
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View>
                                            <Text style={styles.label}>
                                                Ảnh giấy tờ
                                            </Text>
                                            <List
                                                data={
                                                    roomInfo.renter.renterimage
                                                }
                                                style={styles.list}
                                                keyExtractor={(item, index) =>
                                                    `${item.ID}`
                                                }
                                                horizontal
                                                showsHorizontalScrollIndicator={
                                                    false
                                                }
                                                renderItem={({ item }) => {
                                                    const url = `${settings.homeURL}/${item.LinkIMG}`;
                                                    return (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                showLightBoxModal(
                                                                    url
                                                                )
                                                            }
                                                        >
                                                            <Image
                                                                source={{
                                                                    uri: url,
                                                                }}
                                                                style={[
                                                                    styles.imagePreview,
                                                                ]}
                                                            />
                                                        </TouchableOpacity>
                                                    );
                                                }}
                                            />
                                        </View>
                                    </View>
                                </View>
                                <Text style={styles.secTitle}>
                                    Dịch vụ phòng
                                </Text>
                                <View
                                    style={{ ...styles.sec, paddingBottom: 0 }}
                                >
                                    {roomInfo.service?.length > 0 ? (
                                        roomInfo.service.map((item) => (
                                            <View
                                                style={styles.rowInfo}
                                                key={item.ID}
                                            >
                                                <Text style={styles.label}>
                                                    {item.AddOnName}
                                                </Text>
                                                <Text style={styles.value}>
                                                    {cf(item.Price)}
                                                </Text>
                                            </View>
                                        ))
                                    ) : (
                                        <Text
                                            style={{
                                                color: color.redColor,
                                                textAlign: "center",
                                                marginBottom: 15,
                                            }}
                                        >
                                            Không có dịch vụ nào
                                        </Text>
                                    )}
                                </View>

                                <View
                                    style={{
                                        ...styles.sec,
                                        backgroundColor: "transparent",
                                        paddingHorizontal: 0,
                                    }}
                                >
                                    <View
                                        style={{
                                            ...styles.flexRow,
                                            alignItems: "center",
                                            marginBottom: 15,
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Text
                                            style={{
                                                ...styles.secTitle,
                                                marginBottom: 0,
                                            }}
                                        >
                                            Người ở cùng
                                        </Text>
                                        <TouchableOpacity
                                            onPress={
                                                () => alert("Chưa có API")
                                                // navigation.navigate(
                                                //     "AddPeople",
                                                //     {
                                                //         roomId,
                                                //     }
                                                // )
                                            }
                                        >
                                            <View style={styles.flexRow}>
                                                <Icon
                                                    name="plus"
                                                    fill={color.primary}
                                                    style={{
                                                        width: 25,
                                                        height: 25,
                                                        marginLeft: 15,
                                                        marginRight: 5,
                                                    }}
                                                />
                                                <Text
                                                    status="primary"
                                                    category="s1"
                                                >
                                                    Thêm người
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    {[
                                        {},
                                        {
                                            img:
                                                "https://giadinh.mediacdn.vn/thumb_w/640/2019/10/30/ngoc-trinh-5-1572423107231301246873-crop-15724237122011649225014.jpg",
                                        },
                                        {},
                                    ].map((people, index) => {
                                        if (index === 0) return;
                                        return (
                                            <UserInfo
                                                key={`${index}`}
                                                avatar={people.img}
                                                phone="0123456789"
                                                name="Trương Văn Lam"
                                                styleContainer={
                                                    styles.peopleContainer
                                                }
                                                styleCard={styles.peopleCard}
                                                deletePeople={_deletePeople}
                                            />
                                        );
                                    })}
                                </View>
                                <View style={styles.menuWrap}>
                                    <NavLink
                                        containerStyle={styles.navLink}
                                        title="Lịch sử thuê phòng"
                                        icon={{
                                            name: "people-outline",
                                            color: color.primary,
                                        }}
                                        routeName="RentHistory"
                                    />
                                    <NavLink
                                        containerStyle={styles.navLink}
                                        title="Lịch sử điện nước"
                                        icon={{
                                            name: "droplet-outline",
                                            color: color.primary,
                                        }}
                                        routeName="DetailElectrictHistory"
                                    />
                                    <NavLink
                                        containerStyle={styles.navLink}
                                        title="Lịch sử thanh toán"
                                        icon={{
                                            name: "credit-card-outline",
                                            color: color.primary,
                                        }}
                                        routeName="DetailMoneyHistory"
                                    />
                                </View>
                            </View>
                            <Button
                                onPress={_deleteRoom}
                                status="danger"
                                size="large"
                            >
                                Xóa phòng này
                            </Button>
                        </View>
                    </ScrollView>
                    <Modal
                        visible={state.visible}
                        backdropStyle={styles.backdrop}
                        onBackdropPress={() => updateState("visible", false)}
                        style={styles.modal}
                    >
                        <Card disabled={true}>
                            <View style={styles.slide}>
                                <Image
                                    style={styles.imageBox}
                                    source={{
                                        uri: state.lightboxUrl,
                                    }}
                                />
                            </View>
                        </Card>
                    </Modal>
                </>
            )}
        </>
    );
};

export default RoomDetailScreen;

const styles = StyleSheet.create({
    container: {
        padding: 15,
    },
    wrap: {
        backgroundColor: "red",
    },
    wrapper: {},
    backdrop: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    modal: {
        padding: 10,
        height: height / 3,
        width: "100%",
    },

    imageBox: {
        ...StyleSheet.absoluteFill,
        zIndex: -1,
    },
    slide: {
        width: "100%",
        height: "100%",
    },
    secWrap: {},
    sec: {
        padding: 15,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: color.grayColor,
        borderRadius: 8,
        marginBottom: 30,
    },
    rowInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
        alignItems: "center",
    },
    secTitle: {
        color: color.darkColor,
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 15,
    },
    label: {
        color: color.labelColor,
    },
    labelInfo: {
        color: color.labelColor,
        marginBottom: 5,
    },
    value: {
        color: color.blackColor,
        fontWeight: "600",
    },
    flexRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    info: {
        paddingHorizontal: 15,
        alignItems: "center",
        borderRightWidth: 1,
        borderRightColor: color.grayColor,
    },
    imagePreview: {
        aspectRatio: 1,
        height: 100,
        marginTop: 0,
        borderRadius: 4,
        marginRight: 10,
    },
    list: {
        marginTop: 10,
        paddingVertical: 10,
        backgroundColor: "transparent",
    },
    navLink: {
        backgroundColor: "#fff",
        paddingLeft: 15,
        borderRadius: 8,
        marginBottom: 15,
    },
    peopleInfo: {
        marginLeft: 10,
    },
    phoneNumber: {
        marginLeft: 5,
    },
    meta: {
        marginTop: 10,
    },
    peopleName: {
        fontSize: 16,
        fontWeight: "600",
    },
    peopleCard: {
        backgroundColor: "#fff",
        paddingHorizontal: 15,
        borderRadius: 8,
        marginTop: 0,
    },
    peopleContainer: {
        marginBottom: 10,
        marginTop: 0,
    },
    menuWrap: {
        marginBottom: 30,
    },
});
