import React, {
  useContext,
  useReducer,
  useEffect,
  useState,
  useRef,
} from "react";
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  ScrollView,
  Alert,
  RefreshControl,
} from "react-native";
import {
  Card,
  Icon,
  Modal,
  Text,
  List,
  Spinner,
  Button,
} from "@ui-kitten/components";
import UserInfo from "~/components/UserInfo";
import { color, settings } from "~/config";
import { TouchableOpacity } from "react-native-gesture-handler";
import gbStyle from "~/GlobalStyleSheet";
import NavLink from "~/components/common/NavLink";
import { getRoomById } from "~/api/MotelAPI";
import { currencyFormat as cf } from "~/utils";
import { Context as RoomContext } from "~/context/RoomContext";
import Moment from "moment";
import ProgressiveImage from "~/components/common/ProgressiveImage";
import { useScrollToTop } from "@react-navigation/native";
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

const RoomDetailScreen = ({ navigation, route }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { deleteRoom } = useContext(RoomContext);
  const roomId = route.params?.roomId ?? null;
  const { roomInfo } = state;
  const [refreshing, setRefreshing] = useState(false);
  const updateState = (key, value) => {
    dispatch({ type: "STATE_CHANGE", payload: { key, value } });
  };

  const showLightBoxModal = (url) => {
    if (!!url) {
      updateState("lightboxUrl", url);
      updateState("visible", true);
    }
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

  const _onRefresh = async () => {
    setRefreshing(true);
    await loadRoomInfo();
    setRefreshing(false);
  };
  useEffect(() => {
    route.params?.updated === true && _onRefresh();
    navigation.setParams({
      ...route.params,
      updated: false,
    });
  }, [route.params?.updated]);

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
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={_onRefresh} />
            }
          >
            <View style={styles.container}>
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
                      <Text status="primary" category="s1">
                        Chỉnh sửa
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={[styles.sec, { paddingHorizontal: 0 }]}>
                  <View
                    style={[
                      styles.flexRow,
                      {
                        borderBottomWidth: 1,
                        borderBottomColor: color.grayColor,
                        paddingBottom: 15,
                      },
                    ]}
                  >
                    <View style={styles.info}>
                      <Text style={styles.labelInfo}>Giá phòng</Text>
                      <Text style={styles.value}>
                        {cf(roomInfo.room.PriceRoom)}
                      </Text>
                    </View>
                    <View style={[styles.info, { flexGrow: 1 }]}>
                      <Text style={styles.labelInfo}>Giá điện / KW</Text>
                      <Text style={styles.value}>
                        {cf(roomInfo.room.PriceElectric)}
                      </Text>
                    </View>
                    <View style={[styles.info, { borderRightWidth: 0 }]}>
                      <Text style={styles.labelInfo}>Giá nước / m3</Text>
                      <Text style={styles.value}>
                        {cf(roomInfo.room.PriceWater)}
                      </Text>
                    </View>
                  </View>
                  <View style={[gbStyle.px15, gbStyle.mTop15]}>
                    {!!roomInfo.renter?.renter?.ID && (
                      <>
                        <View style={styles.rowInfo}>
                          <Text style={styles.label}>Ngày dọn vào</Text>
                          <Text style={styles.value}>
                            {`${
                              Moment(roomInfo.renter.renter.Datein).format(
                                "DD/MM/YYYY"
                              ) || `Chưa có`
                            }`}
                          </Text>
                        </View>
                        <View style={[styles.rowInfo]}>
                          <Text style={styles.label}>Tiền còn lại</Text>
                          <Text
                            style={[
                              styles.value,
                              roomInfo?.dept > 0
                                ? {
                                    color: color.redColor,
                                  }
                                : {
                                    color: color.greenColor,
                                  },
                            ]}
                          >
                            {roomInfo?.dept > 0 && "nợ"}
                            {roomInfo?.dept < 0 && "dư"} {cf(roomInfo?.dept)}
                          </Text>
                        </View>
                      </>
                    )}

                    <View style={styles.rowInfo}>
                      <Text style={styles.label}>Số Điện</Text>
                      <TouchableOpacity
                        style={styles.flexRow}
                        onPress={() =>
                          showLightBoxModal(roomInfo?.electric.image)
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
                              color: color.primary,
                            },
                          ]}
                        >
                          {cf(roomInfo?.electric.number || 0)}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.rowInfo}>
                      <Text style={styles.label}>Số Nước</Text>
                      <TouchableOpacity
                        style={styles.flexRow}
                        onPress={() => showLightBoxModal(roomInfo?.water.image)}
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
                              color: color.primary,
                            },
                          ]}
                        >
                          {cf(roomInfo?.water.number || 0)}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {!!roomInfo.renter?.renter?.ID && (
                      <View>
                        <Text style={styles.label}>Ảnh giấy tờ</Text>
                        <List
                          data={roomInfo.renter.renterimage}
                          style={styles.list}
                          keyExtractor={(item, index) => `${item.ID}`}
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          renderItem={({ item }) => {
                            const url = item.LinkIMG;
                            return (
                              <TouchableOpacity
                                onPress={() => showLightBoxModal(url)}
                              >
                                <ProgressiveImage
                                  source={{
                                    uri: url,
                                  }}
                                  style={[styles.imagePreview]}
                                />
                              </TouchableOpacity>
                            );
                          }}
                          ListEmptyComponent={
                            <Text
                              style={{
                                color: color.redColor,
                                textAlign: "center",
                                marginBottom: 0,
                              }}
                            >
                              Không có ảnh giấy tờ
                            </Text>
                          }
                        />
                      </View>
                    )}
                  </View>
                </View>
                <Text style={styles.secTitle}>Dịch vụ phòng</Text>
                <View
                  style={{ ...styles.sec, paddingBottom: 0, marginBottom: 15 }}
                >
                  {roomInfo.addons?.length > 0 ? (
                    roomInfo.addons?.map((item) => (
                      <View
                        style={{ ...styles.rowInfo, marginBottom: 15 }}
                        key={item.ID}
                      >
                        <Text style={styles.label}>{item.AddOnName}</Text>
                        <Text style={styles.value}>{cf(item.Price)}</Text>
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

                {!!roomInfo.renter?.renter?.ID && (
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
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          ...styles.secTitle,
                          marginBottom: 0,
                        }}
                      >
                        Người thuê
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("RenterDetail", {
                            roomInfo,
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
                          <Text status="primary" category="s1">
                            Chỉnh sửa
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 15 }}>
                      <UserInfo
                        name={
                          roomInfo.renter.renter.FullName
                            ? roomInfo.renter.renter.FullName
                            : "Chưa có khách"
                        }
                        phone={roomInfo.renter.renter.Phone}
                        styleCard={styles.peopleCard}
                        styleContainer={{ marginBottom: 10 }}
                      />
                    </View>
                    {roomInfo?.OtherRenters?.length > 0 &&
                      [...roomInfo.OtherRenters].map((people, index) => {
                        return (
                          <UserInfo
                            key={`${index}`}
                            avatar={null}
                            phone={people?.Phone ?? ""}
                            name={people?.FullName ?? "Chưa có tên"}
                            styleContainer={styles.peopleContainer}
                            styleCard={styles.peopleCard}
                          />
                        );
                      })}
                  </View>
                )}
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
              <Button onPress={_deleteRoom} status="danger" size="large">
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
