import React, { useContext, useEffect, useState, useReducer } from "react";
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  Image,
  ActivityIndicator,
  Linking,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Layout, Button, Icon, Input, ListItem } from "@ui-kitten/components";
import ImagePicker from "react-native-image-crop-picker";
// import { utils } from "@react-native-firebase/app";
// import vision from "@react-native-firebase/ml-vision";
import { Context as authCt } from "~/context/AuthContext";
import AsyncStorage from "@react-native-community/async-storage";
import { sizes, color, shadowStyle } from "~/config";
import { TouchableOpacity } from "react-native-gesture-handler";
import LinearGradient from "react-native-linear-gradient";
import { getPhoneHelp } from "~/api/AccountAPI";

const SettingScreen = () => {
  const { state: authState, signOut, setIsNewPW } = useContext(authCt);
  const navigation = useNavigation();
  const route = useRoute();
  const [isLoading, setisLoading] = useState(false);
  const [phoneNumber, setphoneNumber] = useState(false);
  React.useLayoutEffect(() => {
    if (authState.isNewPW) {
      setIsNewPW(false);
      navigation.navigate("ForgotPass", {});
    }
  }, [navigation, route]);
  useEffect(() => {
    loadInitData();
    return () => {};
  }, []);
  const loadInitData = async () => {
    setisLoading(true);
    try {
      const rs = await getPhoneHelp();
      setphoneNumber(rs?.Data?.phone);
    } catch (error) {
      console.log("SettingScreen  loadInitData error:", error);
    }
    setisLoading(false);
  };

  const onPressWithParrams = (key = "SettingStack", params = {}) => {
    navigation.navigate(key, params);
  };
  const _pressLogout = () => {
    signOut();
  };
  const onPressContact = () => {
    !!phoneNumber && Linking.openURL(`tel:${phoneNumber}`);
  };
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingVertical: 30 }}>
        <UserSection />
        <FeatSection
          title="Cấu hình nhà/phòng"
          menuData={[
            {
              routerTitle: "Cấu hình nhà",
              routerName: "SettingHouse",
              routerParams: { id: null },
              leftIcon: (
                <Icon
                  name="home-outline"
                  fill={color.iconSettingColor}
                  style={styles.settingIcon}
                />
              ),
            },
            {
              routerTitle: "Cấu hình phòng",
              routerName: "RoomManagement",
              routerParams: {
                screen: "RoomManagement",
                params: {},
              },
              leftIcon: (
                <Icon
                  name="grid-outline"
                  fill={color.iconSettingColor}
                  style={styles.settingIcon}
                />
              ),
            },
            {
              routerTitle: "Dịch vụ kèm theo",
              routerName: "SettingService",
              routerParams: { id: null },
              leftIcon: (
                <Icon
                  name="layers-outline"
                  fill={color.iconSettingColor}
                  style={styles.settingIcon}
                />
              ),
            },
          ]}
        />
        <FeatSection
          title="Quản lý khách hàng"
          menuData={[
            {
              routerTitle: "Khách hàng đang thuê",
              routerName: "SettingCustomerStack",
              routerParams: {
                screen: "SettingCustomerRenting",
                params: {
                  title: "Khách hàng đang thuê",
                },
              },
              leftIcon: (
                <Icon
                  name="people-outline"
                  fill={color.iconSettingColor}
                  style={styles.settingIcon}
                />
              ),
            },
            {
              routerTitle: "Khách hàng cũ",
              routerName: "SettingCustomerStack",
              routerParams: {
                screen: "SettingCustomerOld",
                params: {
                  title: "Khách hàng cũ",
                },
              },
              leftIcon: (
                <Icon
                  name="person-delete-outline"
                  fill={color.iconSettingColor}
                  style={styles.settingIcon}
                />
              ),
            },
            {
              routerTitle: "Khách hàng đang nợ",
              routerName: "SettingCustomerStack",
              routerParams: {
                screen: "SettingCustomerDebt",
                params: {
                  title: "Khách hàng đang nợ",
                },
              },
              leftIcon: (
                <Icon
                  name="person-remove-outline"
                  fill={color.iconSettingColor}
                  style={styles.settingIcon}
                />
              ),
            },
          ]}
        />
        <FeatSection
          title="Thống kê"
          menuData={[
            {
              routerTitle: "Hiệu suất lấp đầy",
              routerName: "SettingFilledIndicator",
              routerParams: {},
              leftIcon: (
                <Icon
                  name="activity"
                  fill={color.iconSettingColor}
                  style={styles.settingIcon}
                />
              ),
            },
            {
              routerTitle: "Thống kê loại phòng",
              routerName: "SettingRoomType",
              routerParams: {},
              leftIcon: (
                <Icon
                  name="pie-chart-2"
                  fill={color.iconSettingColor}
                  style={styles.settingIcon}
                />
              ),
            },
          ]}
        />
        <FeatSection
          title="Báo cáo kinh doanh"
          menuData={[
            {
              routerTitle: "Doanh thu thực tế",
              routerName: "SettingRevenueIncome",
              routerParams: {},
              leftIcon: (
                <Icon
                  name="bar-chart-outline"
                  fill={color.iconSettingColor}
                  style={styles.settingIcon}
                />
              ),
            },
            {
              routerTitle: "Lợi nhuận thực tế",
              routerName: "SettingRevenueNet",
              routerParams: {},
              leftIcon: (
                <Icon
                  name="bar-chart-outline"
                  fill={color.iconSettingColor}
                  style={styles.settingIcon}
                />
              ),
            },
            {
              routerTitle: "Lợi nhuận dự kiến",
              routerName: "SettingExpectedProfit",
              routerParams: {},
              leftIcon: (
                <Icon
                  name="activity-outline"
                  fill={color.iconSettingColor}
                  style={styles.settingIcon}
                />
              ),
            },
            {
              routerTitle: "Thất thoát dự kiến",
              routerName: "SettingCollateralDamage",
              routerParams: {},
              leftIcon: (
                <Icon
                  name="alert-triangle-outline"
                  fill={color.iconSettingColor}
                  style={styles.settingIcon}
                />
              ),
            },
            {
              routerTitle: "Trễ thanh toán",
              routerName: "",
              routerParams: {},
              leftIcon: (
                <Icon
                  name="credit-card-outline"
                  fill={color.iconSettingColor}
                  style={styles.settingIcon}
                />
              ),
            },
            {
              routerTitle: "Thanh toán đúng hạn",
              routerName: "",
              routerParams: {},
              leftIcon: (
                <Icon
                  name="credit-card-outline"
                  fill={color.iconSettingColor}
                  style={styles.settingIcon}
                />
              ),
            },
          ]}
        />
        <View style={[{ paddingHorizontal: 15 }]}>
          <TouchableOpacity
            style={styles.btnContact}
            status="danger"
            onPress={onPressContact}
          >
            {!!!phoneNumber ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={{ flexDirection: "column", display: "flex" }}>
                <Text style={styles.btnContacttxt_lv1}>
                  Liên hệ với chúng tôi
                </Text>
                <Text style={styles.btnContacttxt_lv2}>{phoneNumber}</Text>
              </View>
            )}
          </TouchableOpacity>
          <Button style={styles.logoutBtn} onPress={_pressLogout}>
            {!!isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.logoutBtnTxt}>Đăng xuất</Text>
            )}
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};
const UserSection = (props) => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(null);
  // Address: "Hồ Chí Minh"
  // Avatar: "https://app.mona.house//Upload/img-user/53be09ee-6b7e-495a-bd39-da9127b1b689.jpg"
  // AvatarThumbnail: "https://app.mona.house//Upload/thumbnails/img-user/53be09ee-6b7e-495a-bd39-da9127b1b689.jpg"
  // Birthday: "2020-04-15T00:00:00"
  // CreatedBy: "register"
  // CreatedDate: "2020-05-05T00:07:42.137"
  // Email: "congthuc26@gmail.com"
  // FullName: "Cong Thuc Truong"
  // GenderID: 3
  // ID: 1034
  // ModifiedBy: "0979047573"
  // ModifiedDate: "2020-07-31T18:16:25.397"
  // NoteCustomer: "Khách đã gọi nhưng méo nghe máy
  // ↵khách có 150 phòng nhé"
  // Password: ""
  // Phone: "0979047573"
  // ProvincialCityID: 1
  // RoleID: 4
  // Status: 2
  // TokenApp: ""
  // TokenDeadline: "2020-07-31T21:47:57.8259954Z"
  // TypeAccount: null
  // UserName: "0979047573"
  useEffect(() => {
    (async () => {
      try {
        const userData = await AsyncStorage.getItem("userInfo");
        setUserInfo(JSON.parse(userData));
      } catch (err) {
        alert(JSON.stringify(err));
      }
    })();
  }, []);
  const onPressWithParrams = (key = "SettingStack", params = {}) => {
    try {
      navigation.navigate(key, params);
    } catch (error) {
      alert(error);
    }
  };
  return (
    <View style={styles.secWrap}>
      <View style={[styles.userInfo, { paddingBottom: 40 }]}>
        <TouchableOpacity
          style={{ alignItems: "center", flexDirection: "row" }}
          onPress={() =>
            onPressWithParrams("SettingUserDetail", { id: userInfo?.ID })
          }
        >
          <View style={[styles.avatar]}>
            <Image
              defaultSource={{}}
              source={{
                uri:
                  userInfo?.AvatarThumbnail ||
                  "https://photo-1-baomoi.zadn.vn/w1000_r1/2019_03_06_251_29881209/fdd38a4374029d5cc413.jpg",
              }}
              style={styles.image}
            />
          </View>
          <View style={[styles.info, {}]}>
            <View style={styles.userName}>
              <Text style={[styles.name, styles.textColor]}>
                {userInfo?.UserName}
              </Text>
              <View style={styles.badge}>
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  chưa có thông tin
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <Button
        style={{
          paddingHorizontal: 15,
          marginHorizontal: 15,
          marginTop: -20,
          borderRadius: 6,
          minHeight: 48,
          marginBottom: 10,
          backgroundColor: "#F8604C",
          borderColor: "#F8604C",
          ...shadowStyle,
        }}
        onPress={() =>
          onPressWithParrams("SettingPremiumPackage", {
            id: userInfo.ID,
          })
        }
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          Nâng cấp
        </Text>
      </Button>
      <ListItem
        onPress={() => {}}
        style={styles.listitem}
        accessoryLeft={(props) => (
          <Icon
            {...props}
            fill={"#8A8A8E"}
            style={[styles.settingIcon, { marginRight: 8 }]}
            name="person-outline"
          />
        )}
        title={(TextProps) => (
          <Text
            {...TextProps}
            style={[...TextProps.style, { fontSize: 14, color: "#8A8A8E" }]}
          >
            Họ Tên
          </Text>
        )}
        description={(TextProps) => (
          <Text
            {...TextProps}
            style={[...TextProps.style, { fontSize: 18, color: "#000" }]}
          >
            {userInfo?.FullName}
          </Text>
        )}
      />
      <ListItem
        onPress={() => {}}
        style={styles.listitem}
        accessoryLeft={(props) => (
          <Icon
            {...props}
            fill={"#8A8A8E"}
            style={[styles.settingIcon, { marginRight: 8 }]}
            name="smartphone-outline"
          />
        )}
        title={(TextProps) => (
          <Text
            {...TextProps}
            style={[...TextProps.style, { fontSize: 14, color: "#8A8A8E" }]}
          >
            Số điện thoại
          </Text>
        )}
        description={(TextProps) => (
          <Text
            {...TextProps}
            style={[...TextProps.style, { fontSize: 18, color: "#000" }]}
          >
            {userInfo?.Phone}
          </Text>
        )}
      />
      <ListItem
        onPress={() => {}}
        style={styles.listitem}
        accessoryLeft={(props) => (
          <Icon
            {...props}
            fill={"#8A8A8E"}
            style={[styles.settingIcon, { marginRight: 8 }]}
            name="email-outline"
          />
        )}
        title={(TextProps) => (
          <Text
            {...TextProps}
            style={[...TextProps.style, { fontSize: 14, color: "#8A8A8E" }]}
          >
            Email
          </Text>
        )}
        description={(TextProps) => (
          <Text
            {...TextProps}
            style={[...TextProps.style, { fontSize: 18, color: "#000" }]}
          >
            {userInfo?.Email}
          </Text>
        )}
      />
    </View>
  );
};
const FeatSection = (props) => {
  const navigation = useNavigation();
  const { menuData, title } = props;
  const listmenu = Array.from(menuData);
  const onPressWithParrams = (key = "SettingStack", params = {}) => {
    try {
      navigation.navigate(key, params);
    } catch (error) {
      alert(error);
    }
  };
  return (
    <>
      <Text style={styles.subTitle}>{title}</Text>
      <View style={styles.secWrap}>
        {listmenu.length > 0 &&
          listmenu.map((item, index) => (
            <View style={styles.itemWrap} key={`${item.routerName}-${index}`}>
              <TouchableOpacity
                style={styles.itemInner}
                onPress={() => {
                  !!item.routerName &&
                    onPressWithParrams(item.routerName, item.routerParams);
                }}
              >
                {!!item.leftIcon && item.leftIcon}

                <View style={styles.linkText}>
                  <Text style={[styles.textColor, styles.textSettingSize]}>
                    {item.routerTitle}
                  </Text>
                  <Icon
                    name="chevron-right"
                    fill={color.lightWeight}
                    style={styles.linkCarret}
                  />
                </View>
              </TouchableOpacity>
            </View>
          ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.bgmain,
    flex: 1,
  },
  imagePreview: {
    aspectRatio: 1,
    height: 100,
    marginTop: 0,
    marginBottom: 5,
    borderRadius: 4,
    marginRight: 5,
  },
  itemWrap: {
    backgroundColor: "#fff",
  },
  itemInner: {
    padding: 10,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  textColor: {
    color: "#000",
  },
  textSettingSize: {
    fontSize: 16,
  },
  badge: {
    paddingHorizontal: 5,
    paddingVertical: 3,
    backgroundColor: color.primary,
    borderRadius: 4,
    marginVertical: 4,
  },
  icon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  userInfo: {
    padding: 15,
    paddingHorizontal: 20,
    margin: -5,
    backgroundColor: "#D1D1D1",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  avatar: {
    marginRight: 15,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
  },
  info: {
    flexGrow: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 5,
  },
  linkCarret: {
    width: 30,
    height: 30,
  },
  caretWrap: {
    paddingLeft: 15,
    flexShrink: 0,
  },
  userName: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  subTitle: {
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
    color: "#3C3C43",
    textTransform: "uppercase",
    opacity: 0.6,
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
    paddingVertical: 10,
    minHeight: 40,
  },
  secWrap: {
    marginHorizontal: 15,
    marginBottom: 30,
    backgroundColor: "#fff",
    borderRadius: 6,
    minHeight: 40,
    padding: 5,
    ...shadowStyle,
  },
  logoutBtn: {
    backgroundColor: "#d1d1d1",
    borderRadius: 6,
    minHeight: 48,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#d1d1d1",
  },
  logoutBtnTxt: {
    color: "#fff",
    textTransform: "uppercase",
    fontWeight: "bold",
    fontSize: 16,
  },
  btnContact: {
    minHeight: 60,
    justifyContent: "center",
    marginBottom: 15,
    borderRadius: 6,
    alignItems: "center",
    textAlign: "center",
    backgroundColor: color.redColor,
    borderColor: color.redColor,
    paddingVertical: 10,
  },
  btnContacttxt_lv1: {
    textAlign: "center",
    color: "#fff",
    fontSize: 14,
  },
  btnContacttxt_lv2: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SettingScreen;

// const DemoMLKitVision = () => {
//     const { signOut } = useContext(authCt);
//     const navidation = useNavigation();
//     const [stateData, dispatchData] = React.useReducer(
//         (prevState, action) => {
//             switch (action.type) {
//                 case "CHANGEIMG":
//                     return {
//                         ...prevState,
//                         imgRecognition: action.value,
//                     };
//                 case "CHANGETEXT":
//                     return {
//                         ...prevState,
//                         textRecognitionValue: action.value,
//                     };
//                 case "processed":
//                     return {
//                         ...prevState,
//                         processedValue: action.value,
//                     };
//                 case "IMG_SOURCE":
//                     return {
//                         ...prevState,
//                         imgSource: action.value,
//                     };
//                 default:
//                     return { ...prevState };
//             }
//         },
//         {
//             textRecognitionValue: "",
//             imgRecognition: [],
//             processedValue: "",
//             imgSource: "",
//         }
//     );
//     const _onChangeText = (value) => {
//         dispatchData({ type: "CHANGETEXT", value });
//     };
//     const _onPressChoosePhoto = async () => {
//         const options = {
//             // multiple: true,
//             // maxFiles: 10,
//             compressImageMaxWidth: 1280,
//             compressImageMaxHeight: 768,
//             mediaType: "photo",
//         };
//         try {
//             const images = await ImagePicker.openPicker(options);
//             console.log(images);

//             // Local path to file on the device
//             const localFile = `${images.path}`;

//             const processed = await processDocument(localFile);
//             console.log("Finished processing file.");
//             dispatchData({ type: "processed", value: processed });
//             dispatchData({ type: "IMG_SOURCE", value: localFile });
//         } catch (error) {
//             alert(error);
//         }
//     };
//     const _onPressTakePhoto = async () => {
//         const options = {
//             // multiple: true,
//             // maxFiles: 10,
//             compressImageMaxWidth: 1280,
//             compressImageMaxHeight: 768,
//             mediaType: "photo",
//             cropping: true,
//         };
//         try {
//             const images = await ImagePicker.openCamera(options);
//             console.log(images);

//             // Local path to file on the device
//             const localFile = `${images.path}`;

//             const processed = await processDocument(localFile);
//             console.log("Finished processing file.");
//             dispatchData({ type: "processed", value: processed });
//             dispatchData({ type: "IMG_SOURCE", value: localFile });
//         } catch (error) {
//             alert(error);
//         }
//     };

//     return (
//         <View style={styles.container}>
//             <ScrollView contentContainerStyle={{ padding: 15 }}>
//                 <Button
//                     onPress={signOut}
//                     accessoryLeft={() => (
//                         <Icon
//                             name="camera-outline"
//                             fill={color.whiteColor}
//                             style={sizes.iconButtonSize}
//                         />
//                     )}
//                 >
//                     Logout
//                 </Button>
//                 <Input
//                     textStyle={styles.textInput}
//                     label="Ghi chú"
//                     placeholder=""
//                     value={stateData.textRecognitionValue}
//                     onChangeText={_onChangeText}
//                     textContentType="none"
//                     keyboardType="default"
//                     // multiline
//                 />
//                 {!!stateData.imgSource && (
//                     <Image
//                         source={{ uri: stateData.imgSource }}
//                         style={[styles.imagePreview]}
//                     />
//                 )}

//                 <Button
//                     onPress={_onPressChoosePhoto}
//                     accessoryLeft={() => (
//                         <Icon
//                             name="camera-outline"
//                             fill={color.whiteColor}
//                             style={sizes.iconButtonSize}
//                         />
//                     )}
//                 >
//                     Ảnh từ máy
//                 </Button>
//                 <Button
//                     onPress={_onPressTakePhoto}
//                     accessoryLeft={() => (
//                         <Icon
//                             name="camera-outline"
//                             fill={color.whiteColor}
//                             style={sizes.iconButtonSize}
//                         />
//                     )}
//                 >
//                     Chụp ảnh mới
//                 </Button>
//                 {!!stateData.processedValue && (
//                     <>
//                         <Text>{stateData.processedValue.text}</Text>

//                         {stateData.processedValue.blocks &&
//                             stateData.processedValue.blocks.map((block) => {
//                                 return <Text> {block.text} </Text>;
//                             })}
//                     </>
//                 )}
//             </ScrollView>
//         </View>
//     );
// };
// const DemoMLKitVision = () => {
//     const { signOut } = useContext(authCt);
//     const navidation = useNavigation();
//     const [stateData, dispatchData] = React.useReducer(
//         (prevState, action) => {
//             switch (action.type) {
//                 case "CHANGEIMG":
//                     return {
//                         ...prevState,
//                         imgRecognition: action.value,
//                     };
//                 case "CHANGETEXT":
//                     return {
//                         ...prevState,
//                         textRecognitionValue: action.value,
//                     };
//                 case "processed":
//                     return {
//                         ...prevState,
//                         processedValue: action.value,
//                     };
//                 case "IMG_SOURCE":
//                     return {
//                         ...prevState,
//                         imgSource: action.value,
//                     };
//                 default:
//                     return { ...prevState };
//             }
//         },
//         {
//             textRecognitionValue: "",
//             imgRecognition: [],
//             processedValue: "",
//             imgSource: "",
//         }
//     );
//     const _onChangeText = (value) => {
//         dispatchData({ type: "CHANGETEXT", value });
//     };
//     const _onPressChoosePhoto = async () => {
//         const options = {
//             // multiple: true,
//             // maxFiles: 10,
//             compressImageMaxWidth: 1280,
//             compressImageMaxHeight: 768,
//             mediaType: "photo",
//         };
//         try {
//             const images = await ImagePicker.openPicker(options);
//             console.log(images);

// const processDocument = async (localPath) => {
//     const processed = await vision().textRecognizerProcessImage(localPath);

//     console.log("Found text in document: ", processed.text);

//     processed.blocks.forEach((block) => {
//         console.log("Found block with text: ", block.text);
//         console.log("Confidence in block: ", block.confidence);
//         console.log("Languages found in block: ", block.recognizedLanguages);
//     });
//     return processed;
// };
