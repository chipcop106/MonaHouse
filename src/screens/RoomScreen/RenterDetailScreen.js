import React, {
  useEffect,
  useRef,
  useReducer,
  forwardRef,
  useState,
} from "react";
import { StyleSheet, View, ScrollView, FlatList, Alert } from "react-native";
import {
  Input,
  Select,
  SelectItem,
  Button,
  Icon,
  IndexPath,
  Text,
} from "@ui-kitten/components";
import ImagePicker from "react-native-image-crop-picker";
import { sizes, color, settings } from "~/config";
import {
  updateRenterOnRoom,
  uploadRenterImage,
} from "~/api/RenterAPI";
import { TouchableOpacity } from "react-native-gesture-handler";
import RBSheet from "react-native-raw-bottom-sheet";
import ProgressiveImage from "~/components/common/ProgressiveImage";
import UserInfo from "~/components/UserInfo";
import { create_UUID } from "~/utils";
import Swipeable from "react-native-gesture-handler/Swipeable";

const initialState = {
  fullName: "",
  phoneNumber: "",
  job: "",
  provinceIndexPath: new IndexPath(0),
  licenseImages: [],
  otherRenters: [
    {
      id: 1,
      keyID: create_UUID(),
      fullName: "Hoàng Văn Thụ",
      phoneNumber: "0123456789",
    },
    {
      id: 2,
      keyID: create_UUID(),
      fullName: "Trương Lực",
      phoneNumber: "0943872389",
    },
    {
      id: 3,
      keyID: create_UUID(),
      fullName: "Trần Thương",
      phoneNumber: "23545442",
    },
  ], // {FullName, Phone},
  cityLists: [],
  relationLists: [],
  relationshipIndex: new IndexPath(0),
  note: "",
  uploading: false,
  modalState: {
    id: 0,
    keyID: create_UUID(),
    action: "CREATE",
    fullName: "",
    phone: "",
  },
};

const reducer = (prevState, { type, payload }) => {
  switch (type) {
    case "SET_STATE":
      return {
        ...payload,
      };
    case "UPLOADING": {
      return {
        ...prevState,
        uploading: payload,
      };
    }
    case "UPDATE_OPTION":
      return {
        ...prevState,
        [payload.key]: payload.value,
      };
    case "UPDATE_LICENSE": {
      return {
        ...prevState,
        licenseImages: payload,
      };
    }
    case "DELETE_LICENSE_IMAGE": {
      return {
        ...prevState,
        licenseImages: [...prevState.licenseImages].filter(
          (image) => image.ID !== payload.imageID
        ),
      };
    }

    case "SET_LOADING":
      return {
        ...prevState,
        isLoading: payload,
      };
    case "UPDATE_RENTER_FIELD":
      return {
        ...prevState,
        [payload.key]: payload.value,
      };
    case "EDIT_OTHER_RENTER": {
      return {
        ...prevState,
        otherRenters: [...prevState.otherRenters].map((renter) =>
          renter.keyID === payload.keyID
            ? {
                ...renter,
                fullName: payload.name,
                phoneNumber: payload.phone,
              }
            : renter
        ),
      };
    }
    case "CREATE_OTHER_RENTER": {
      return {
        ...prevState,
        otherRenters: [
          {
            id: 0,
            keyID: create_UUID(),
            fullName: payload.fullName,
            phoneNumber: payload.phoneNumber,
          },
          ...prevState.otherRenters,
        ],
      };
    }
    case "DELETE_OTHER_RENTER": {
      return {
        ...prevState,
        otherRenters: [...prevState.otherRenters].filter(
          (renter) => renter.keyID !== payload.keyID
        ),
      };
    }
    case "MODAL_STATE":
      return {
        ...prevState,
        modalState: payload,
      };
    default:
      return prevState;
  }
};

const RenterModal = forwardRef(
  (
    {
      data: { id, keyID, fullName, phoneNumber, action = "CREATE" },
      _handleSubmitForm,
    },
    ref
  ) => {
    const [name, setName] = useState(fullName);
    const [phone, setPhone] = useState(phoneNumber);

    const _submitForm = () => {
      _handleSubmitForm({ id, keyID, phone, name, action });
    };

    useEffect(() => {
      setName(fullName);
      setPhone(phoneNumber);
    }, [fullName, keyID, phoneNumber, action, id]);

    return (
      <RBSheet
        ref={ref}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={350}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
          container: {
            backgroundColor: "#fff",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: 15,
          },
          draggableIcon: {
            backgroundColor: "#ccc",
          },
        }}
      >
        <View
          onLayout={() => {
            // alert(height);
          }}
        >
          <Text style={styles.secTitle}>
            {action === "CREATE" ? "Thêm người ở" : "Chỉnh sửa người ở"}
          </Text>
          <View style={styles.formRow}>
            <Input
              textStyle={styles.textInput}
              label="Họ và tên"
              placeholder="Họ tên"
              value={name}
              onChangeText={setName}
              textContentType="none"
            />
          </View>
          <View style={styles.formRow}>
            <Input
              textStyle={styles.textInput}
              label="Số điện thoại"
              placeholder="VD: 0969xxxxx"
              value={phone}
              onChangeText={setPhone}
              textContentType="none"
            />
          </View>
          <Button status="danger" onPress={_submitForm}>
            {action === "CREATE" ? "Thêm vào phòng" : "Cập nhật thông tin"}
          </Button>
        </View>
      </RBSheet>
    );
  }
);

const RightAction = (_deletePeople, _editPeople) => {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 15,
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      <TouchableOpacity onPress={_editPeople}>
        <View style={styles.leftAction}>
          <Icon
            name="edit-2"
            fill={color.redColor}
            style={{ width: 30, height: 30 }}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={_deletePeople}>
        <View style={styles.leftAction}>
          <Icon
            name="trash"
            fill={color.redColor}
            style={{ width: 30, height: 30 }}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};
const RenterDetailScreen = ({ navigation, route }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { renter, OtherRenters } = route.params?.roomInfo;
  const { relationLists, cityLists } = settings;

  const refRBSheet = useRef(true);
  const refCURDRenter = useRef(true);

  const setLoading = (value) =>
    dispatch({ type: "SET_LOADING", payload: value });

  const updateLicenses = (data) => {
    dispatch({ type: "UPDATE_LICENSE", payload: data });
  };

  const updateRenterField = (key, value) => {
    console.log({ key, value });
    dispatch({ type: "UPDATE_RENTER_FIELD", payload: { key, value } });
  };

  const deleteLicenseImage = (imageID) => {
    dispatch({ type: "DELETE_LICENSE_IMAGE", payload: { imageID } });
  };

  const setUploading = (value) => {
    dispatch({ type: "UPLOADING", payload: value });
  };

  const setModalState = (mdState) => {
    dispatch({ type: "MODAL_STATE", payload: mdState });
  };

  const loadDataInfo = async () => {
    setLoading(true);
    try {
      const {
        Phone,
        Job,
        Note,
        FullName,
        CityID,
        ID,
        RelationshipID,
      } = renter.renter;
      const { renterimage } = renter;
      const provinceIndex = cityLists
        ? cityLists.findIndex((item) => item.ID === CityID)
        : 0;
      const relationshipIndex = relationLists
        ? relationLists.findIndex((item) => item.id === RelationshipID)
        : 0;

      dispatch({
        type: "SET_STATE",
        payload: {
          ...state,
          renterID: ID,
          fullName: FullName || "",
          phoneNumber: Phone || "",
          job: Job || "",
          provinceIndexPath: new IndexPath(provinceIndex),
          relationshipIndex: new IndexPath(relationshipIndex),
          licenseImages: renterimage || [],
          otherRenters: OtherRenters || [],
          note: Note || "",
        },
      });
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  const cleanUpComponent = () => {
    if (refRBSheet.current) refRBSheet.current = false;
    if (refCURDRenter.current) refCURDRenter.current = false;
  };

  const handleIMG_RS = async (images) => {
    setUploading(true);
    try {
      const res = await uploadRenterImage(images);
      res.Code === 1 &&
        state.licenseImages.length === 1 &&
        updateLicenses([...state.licenseImages, res?.Data[0]] ?? []);
      res.Code === 1 &&
        state.licenseImages.length !== 1 &&
        updateLicenses(res?.Data ?? []);
    } catch (error) {
      throw error;
    }
    setUploading(false);
    return true;
  };

  const _onPressTakePhotos = async () => {
    refRBSheet.current.close();
    await new Promise((a) => setTimeout(a, 250));
    try {
      const options = {
        cropping: true,
        forceJpg: true,
        cropperToolbarTitle: "Chỉnh sửa ảnh",
        compressImageMaxWidth: 1280,
        compressImageMaxHeight: 768,
      };
      const images = await ImagePicker.openCamera(options);
      await handleIMG_RS(images);
    } catch (error) {
      console.log("ImagePicker.openPicker error", error.message);
      alert(error.message);
      updateLicenses([]);
    }
  };
  const _onPressGetPhotos = async () => {
    refRBSheet.current.close();
    await new Promise((a) => setTimeout(a, 250));
    try {
      const options = {
        cropping: true,
        forceJpg: true,
        cropperToolbarTitle: "Chỉnh sửa ảnh",
        multiple: true,
        maxFiles:
          state.licenseImages?.length >= 2
            ? 2
            : 2 - state.licenseImages?.length,
        compressImageMaxWidth: 1280,
        compressImageMaxHeight: 768,
        mediaType: "photo",
      };
      const images = await ImagePicker.openPicker(options);
      await handleIMG_RS(images);
    } catch (error) {
      console.log("ImagePicker.openPicker error", error.message);
      updateLicenses([]);
    }
  };
  const _onCloseRBSheet = () => {};
  const handleChoosePhoto = (key) => {
    console.log({ key });
    refRBSheet.current.open();
  };

  const _addPeople = () => {
    setModalState({
      id: 0,
      keyID: create_UUID(),
      fullName: "",
      phoneNumber: "",
      action: "CREATE",
    });
    refCURDRenter.current.open();
  };
  const _editPeople = (people) => {
    setModalState({
      id: people.id,
      keyID: people.keyID,
      fullName: people.fullName,
      phoneNumber: people.phoneNumber,
      action: "EDIT",
    });
    refCURDRenter.current.open();
  };
  const _deletePeople = (keyID) => {
    dispatch({ type: "DELETE_OTHER_RENTER", payload: { keyID } });
  };

  const _handleSubmitRenterModal = ({ keyID, name, phone, action }) => {
    action === "CREATE" &&
      dispatch({
        type: "CREATE_OTHER_RENTER",
        payload: { fullName: name, phoneNumber: phone },
      });
    action === "EDIT" &&
      dispatch({ type: "EDIT_OTHER_RENTER", payload: { keyID, name, phone } });
    refCURDRenter.current.close();
  };

  const _onSaveInforMation = async () => {
    //Fetch API
    try {
      const otherRenterArr = state.otherRenters.map((item) => ({
        id: item.id,
        name: item.fullName,
        phone: item.phoneNumber,
      }));
      const licenseRenterArr = state.licenseImages.map((image) => ({
        ID: image.ID,
        URL: image.UrlIMG,
      }));
      const res = await updateRenterOnRoom({
        renterid: state.renterID,
        phone: state?.phoneNumber ?? "",
        fullname: state?.FullName ?? "",
        quantity: state.otherRenters?.length ?? 0,
        relationship: relationLists[state.relationshipIndex.row].id,
        cityid: cityLists[state.relationshipIndex.row].ID,
        avatarid: 0,
        note: state?.note ?? "",
        job: state?.job ?? "",
        otherRenter: JSON.stringify(otherRenterArr),
        objimg: JSON.stringify([
          {
            Name: "giay-to",
            DatatIMG: licenseRenterArr,
          },
        ]),
      });
      res.Code === 1 &&
        Alert.alert("Thông báo", "Cập nhật thông tin thành công !!", [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate("RoomDetail", { updated: true });
            },
          },
        ]);
      res.Code === 0 &&
        Alert.alert("Lỗi cập nhật !!", JSON.stringify(res), [
          {
            text: "OK",
            onPress: () => {},
          },
        ]);
    } catch (e) {
      console.log("Lỗi gọi api", e);
    }
  };

  useEffect(() => {
    loadDataInfo();
    return cleanUpComponent;
  }, []);

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.mainWrap}>
        <Text style={styles.secTitle}>Khách đại diện thuê</Text>
        <View style={{ ...styles.section, paddingBottom: 0 }}>
          <View style={styles.formWrap}>
            <View style={[styles.formRow]}>
              <Input
                textStyle={styles.textInput}
                label="Họ và tên"
                placeholder=""
                value={state.fullName}
                onChangeText={(nextValue) =>
                  updateRenterField("fullName", nextValue)
                }
                textContentType="none"
                keyboardType="default"
                disabled={state.isLoading}
              />
            </View>
            <View style={[styles.formRow]}>
              <Input
                textStyle={styles.textInput}
                label="Số điện thoại"
                placeholder="09xxxxxx"
                value={state.phoneNumber}
                onChangeText={(nextValue) =>
                  updateRenterField("phoneNumber", nextValue)
                }
                textContentType="none"
                keyboardType="numeric"
                disabled={state.isLoading}
              />
            </View>
            {/* <View style={[styles.formRow]}>
                            <Input
                                textStyle={styles.textInput}
                                label="Địa chỉ email"
                                placeholder=""
                                value={stateRenterInfo.email}
                                onChangeText={(nextValue) =>
                                    changeStateFormStep("email", nextValue)
                                }
                                textContentType="none"
                                keyboardType="email-address"
                            />
                        </View> */}
            <View style={[styles.formRow]}>
              <Input
                textStyle={styles.textInput}
                label="Công việc hiện tại"
                placeholder="Văn phòng, sinh viên, phổ thông, khác"
                value={state.job}
                onChangeText={(nextValue) =>
                  updateRenterField("job", nextValue)
                }
                textContentType="none"
                keyboardType="default"
                disabled={state.isLoading}
              />
            </View>

            <View style={[styles.formRow, styles.halfCol]}>
              <Select
                label="Quê quán"
                value={
                  state.isLoading
                    ? "Đang tải..."
                    : (cityLists.length &&
                        cityLists[state.provinceIndexPath.row].CityName) ||
                      "Chọn tỉnh thành"
                }
                selectedIndex={state.provinceIndexPath}
                onSelect={(indexPath) =>
                  updateRenterField("provinceIndexPath", indexPath)
                }
              >
                {!state.isLoading &&
                  cityLists.length > 0 &&
                  cityLists.map((option) => (
                    <SelectItem
                      key={option.ID}
                      title={option?.CityName ?? ""}
                    />
                  ))}
              </Select>
            </View>
            <View style={[styles.formRow, styles.halfCol]}>
              <Select
                label="Quan hệ"
                value={
                  relationLists[state.relationshipIndex.row]?.text ??
                  "Chọn quan hệ"
                }
                selectedIndex={state.relationshipIndex}
                onSelect={(index) =>
                  updateRenterField("relationshipIndex", index)
                }
              >
                {relationLists
                  ? relationLists.map((option) => (
                      <SelectItem key={option.id} title={option.text} />
                    ))
                  : null}
              </Select>
            </View>
            <View style={[styles.formRow]}>
              <Input
                textStyle={styles.textInput}
                label="Ghi chú"
                placeholder=""
                value={state.note}
                onChangeText={(nextValue) => {
                  updateRenterField("note", nextValue);
                }}
                textContentType="none"
                keyboardType="default"
                multiline
              />
            </View>
            <View style={[styles.formRow]}>
              <View style={{ marginBottom: 20 }}>
                <Button
                  disabled={state.uploading}
                  onPress={() => handleChoosePhoto("licensesImages")}
                  accessoryLeft={() => (
                    <Icon
                      name="camera-outline"
                      fill={color.whiteColor}
                      style={sizes.iconButtonSize}
                    />
                  )}
                >
                  {state.uploading ? "Đang tải ảnh..." : "Ảnh giấy tờ"}
                </Button>
              </View>

              {state.licenseImages && state.licenseImages.length > 0 && (
                <FlatList
                  data={state.licenseImages}
                  keyExtractor={(item, index) => `${index}`}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <View style={styles.imageWrap}>
                      <ProgressiveImage
                        source={{
                          uri: item?.LinkIMGThumbnail ?? "",
                        }}
                        style={[styles.imagePreview]}
                      />
                      <View style={styles.deleteImage}>
                        <TouchableOpacity
                          onPress={() => deleteLicenseImage(item.ID)}
                        >
                          <Icon
                            name="minus"
                            style={{
                              width: 25,
                              height: 30,
                            }}
                            fill={color.redColor}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                />
              )}
            </View>
          </View>
        </View>
        <View style={{ ...styles.flexRow, marginBottom: 15 }}>
          <Text style={{ ...styles.secTitle, marginBottom: 0 }}>
            Khách ở chung
          </Text>
          <TouchableOpacity
            onPress={_addPeople}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Icon
              name="plus"
              style={{ ...sizes.iconButtonSize, marginRight: 5 }}
              fill={color.primary}
            />
            <Text status="primary">Thêm người ở</Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginBottom: 30 }}>
          {state.otherRenters?.length > 0 ? (
            state.otherRenters.map((people) => {
              return (
                <View key={`${people.keyID}`} style={{ marginBottom: 10 }}>
                  <Swipeable
                    renderRightActions={() =>
                      RightAction(
                        () => _deletePeople(people.keyID),
                        () => _editPeople(people)
                      )
                    }
                  >
                    <UserInfo
                      key={`${people.keyID}`}
                      name={people.fullName}
                      phone={people.phoneNumber}
                      styleContainer={{ marginBottom: 0 }}
                    />
                  </Swipeable>
                </View>
              );
            })
          ) : (
            <View style={{ ...styles.section, marginBottom: 0 }}>
              <View style={{ alignItems: "center" }}>
                <Text style={{ color: color.redColor }}>
                  Không có người ở chung
                </Text>
              </View>
            </View>
          )}
        </View>
        <Button
          style={{ borderRadius: 0, marginBottom: 30 }}
          onPress={_onSaveInforMation}
          accessoryLeft={() => (
            <Icon
              name="save-outline"
              fill={color.whiteColor}
              style={sizes.iconButtonSize}
            />
          )}
          size="large"
          status="danger"
        >
          Lưu tất cả thông tin
        </Button>
      </View>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        onClose={_onCloseRBSheet}
        height={300}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
          container: {
            backgroundColor: "transparent",
            padding: 15,
          },
          draggableIcon: {
            backgroundColor: "transparent",
          },
        }}
      >
        <View
          onLayout={() => {
            // alert(height);
          }}
        >
          <View style={styles.listButtonWrap}>
            <TouchableOpacity
              style={styles.listButton}
              onPress={_onPressTakePhotos}
            >
              <Text style={[styles.listButton_txt]}>Chụp ảnh</Text>
              <View style={styles.listButton_icon}>
                <Icon
                  name="camera-outline"
                  fill={color.primary}
                  style={{ width: 24, height: 24 }}
                />
              </View>
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: "#e1e1e1" }} />
            <TouchableOpacity
              style={styles.listButton}
              onPress={_onPressGetPhotos}
            >
              <Text style={[styles.listButton_txt]}>Thư viện ảnh</Text>
              <View style={styles.listButton_icon}>
                <Icon
                  name="image-outline"
                  fill={color.primary}
                  style={{ width: 24, height: 24 }}
                />
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.listButton, styles.btnClose]}
            onPress={() => refRBSheet.current.close()}
          >
            <Text
              style={[
                styles.listButton_txt,
                { color: "#147AFC", textAlign: "center" },
              ]}
            >
              Trở lại
            </Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
      <RenterModal
        ref={refCURDRenter}
        data={state.modalState}
        _handleSubmitForm={_handleSubmitRenterModal}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  listButtonWrap: {
    borderRadius: 15,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 15,
    backgroundColor: "#fff",
    minHeight: 50,
    justifyContent: "center",
    position: "relative",
    paddingHorizontal: 15,
  },
  listButton_txt: {
    fontSize: 20,
    flex: 1,
    color: "#797B7F",
  },
  listButton_icon: {
    width: 30,
    height: 30,
    // position: "absolute",
    // borderRadius: 15,
    // borderWidth: 1,
    // left: 10,
    // top: 10,
    borderColor: color.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  btnClose: {
    flexDirection: "row",
    alignItems: "center",
  },
  mainWrap: {
    padding: 15,
  },
  section: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 30,
    backgroundColor: color.whiteColor,
    borderRadius: 8,
  },
  secTitle: {
    color: color.darkColor,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  formWrap: {
    paddingHorizontal: 10,
    marginHorizontal: -10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  formRow: {
    marginBottom: 15,
    width: "98%",
    marginHorizontal: "1%",
  },
  halfCol: {
    width: "48%",
  },
  imagePreview: {
    aspectRatio: 1,
    height: 100,
    marginTop: 0,
    marginBottom: 15,
    borderRadius: 4,
    marginHorizontal: 10,
    zIndex: 1,
  },
  imageWrap: {
    position: "relative",
    zIndex: 1,
  },
  deleteImage: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: "rgba(255,255,255,.8)",
    top: 5,
    right: 15,
    zIndex: 100,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  peopleContainer: {
    padding: 10,
    marginBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
  },
  leftAction: {
    justifyContent: "center",
    paddingHorizontal: 15,
    height: "100%",
  },
});

export default RenterDetailScreen;
