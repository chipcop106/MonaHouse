import React, { useContext, useEffect, useState, useReducer } from "react";
import { Text, StyleSheet, View, ScrollView, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Layout, Button, Icon, Input } from "@ui-kitten/components";
import ImagePicker from "react-native-image-crop-picker";
// import { utils } from "@react-native-firebase/app";
// import vision from "@react-native-firebase/ml-vision";
import { Context as authCt } from "~/context/AuthContext";
import gbStyle from "~/GlobalStyleSheet";
import { sizes, color } from "~/config";
import { TouchableOpacity } from "react-native-gesture-handler";
import LinearGradient from "react-native-linear-gradient";

const SettingScreen = () => {
    const { state: authState, signOut , setIsNewPW } = useContext(authCt);
    const navidation = useNavigation();
	const route = useRoute();
	React.useLayoutEffect(() => {
        if(authState.isNewPW){
			setIsNewPW(false);
			navigation.navigate('ForgotPass', {});
			
		}
    }, [navigation, route]);
    const [stateData, dispatchData] = React.useReducer(
        (prevState, action) => {
            switch (action.type) {
                case "CHANGEIMG":
                    return {
                        ...prevState,
                        imgRecognition: action.value,
                    };
                case "CHANGETEXT":
                    return {
                        ...prevState,
                        textRecognitionValue: action.value,
                    };
                case "processed":
                    return {
                        ...prevState,
                        processedValue: action.value,
                    };
                case "IMG_SOURCE":
                    return {
                        ...prevState,
                        imgSource: action.value,
                    };
                default:
                    return { ...prevState };
            }
        },
        {
            textRecognitionValue: "",
            imgRecognition: [],
            processedValue: "",
            imgSource: "",
        }
    );
    const onPressWithParrams = (key = "SettingStack", params = {}) => {
        navidation.navigate(key, params);
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingVertical: 15 }}>
                <TouchableOpacity
                    onPress={() =>
                        onPressWithParrams("SettingUserDetail", { id: null })
                    }
                >
                    <View style={[styles.userInfo, styles.secWrap]}>
                        <View style={styles.avatar}>
                            <Image
                                source={{
                                    uri:
                                        "https://photo-1-baomoi.zadn.vn/w1000_r1/2019_03_06_251_29881209/fdd38a4374029d5cc413.jpg",
                                }}
                                style={styles.image}
                            />
                        </View>
                        <View style={styles.info}>
                            <View style={styles.userName}>
                                <Text style={[styles.name, styles.textColor]}>
                                    Lê Chân
                                </Text>
                                <View style={styles.badge}>
                                    <Text
                                        style={{
                                            color: color.darkColor,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Premium
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.metaWrap}>
                                <View style={[styles.meta]}>
                                    <Text style={styles.textColor}>
                                        Hết hạn:
                                    </Text>
                                    <View style={styles.expiredDate}>
                                        <Text
                                            style={{
                                                ...styles.textColor,
                                                fontWeight: "600",
                                            }}
                                        >
                                            20/04/2020
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={styles.caretWrap}>
                            <Icon
                                name="chevron-right"
                                fill={color.lightWeight}
                                style={styles.linkCarret}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        ...styles.secWrap,
                        paddingHorizontal: 15,
                        marginBottom: 30,
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
                <Text style={styles.subTitle}>Cấu hình hệ thống</Text>
                <View style={styles.secWrap}>
                    <View style={styles.itemWrap}>
                        <TouchableOpacity
                            style={styles.itemInner}
                            onPress={() =>
                                onPressWithParrams("SettingElectrict", {
                                    id: null,
                                })
                            }
                        >
                            <Icon
                                name="droplet-outline"
                                fill={color.iconSettingColor}
                                style={styles.settingIcon}
                            />
                            <View style={styles.linkText}>
                                <Text
                                    style={[
                                        styles.textColor,
                                        styles.textSettingSize,
                                    ]}
                                >
                                    Cấu hình điện nước
                                </Text>
                                <Icon
                                    name="chevron-right"
                                    fill={color.lightWeight}
                                    style={styles.linkCarret}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.itemWrap}>
                        <TouchableOpacity
                            style={styles.itemInner}
                            onPress={() =>
                                onPressWithParrams("SettingService", {
                                    id: null,
                                })
                            }
                        >
                            <Icon
                                name="grid-outline"
                                fill={color.iconSettingColor}
                                style={styles.settingIcon}
                            />
                            <View style={[styles.linkText]}>
                                <Text
                                    style={[
                                        styles.textColor,
                                        styles.textSettingSize,
                                    ]}
                                >
                                    Cấu hình tiện ích phòng
                                </Text>
                                <Icon
                                    name="chevron-right"
                                    fill={color.lightWeight}
                                    style={styles.linkCarret}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.itemWrap}>
                        <TouchableOpacity
                            style={styles.itemInner}
                            onPress={() =>
                                onPressWithParrams("SettingSMS", { id: null })
                            }
                        >
                            <Icon
                                name="email-outline"
                                fill={color.iconSettingColor}
                                style={styles.settingIcon}
                            />
                            <View style={styles.linkText}>
                                <Text
                                    style={[
                                        styles.textColor,
                                        styles.textSettingSize,
                                    ]}
                                >
                                    Cấu hình tin nhắn SMS
                                </Text>
                                <Icon
                                    name="chevron-right"
                                    fill={color.lightWeight}
                                    style={styles.linkCarret}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.itemWrap}>
                        <TouchableOpacity
                            style={styles.itemInner}
                            onPress={() =>
                                onPressWithParrams("SettingNotification", {
                                    id: null,
                                })
                            }
                        >
                            <Icon
                                name="bell-outline"
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
                                    Cấu hình thông báo
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
                <Text style={styles.subTitle}>Hướng dẫn sử dụng</Text>
                <View style={styles.secWrap}>
                    <View style={styles.itemWrap}>
                        <TouchableOpacity
                            style={styles.itemInner}
                            onPress={() => onPressWithParrams()}
                        >
                            <Icon
                                name="file-text-outline"
                                fill={color.iconSettingColor}
                                style={styles.settingIcon}
                            />
                            <View style={styles.linkText}>
                                <Text
                                    style={[
                                        styles.textColor,
                                        styles.textSettingSize,
                                    ]}
                                >
                                    Hướng dẫn cấu hình phòng
                                </Text>
                                <Icon
                                    name="chevron-right"
                                    fill={color.lightWeight}
                                    style={styles.linkCarret}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.itemWrap}>
                        <TouchableOpacity
                            style={styles.itemInner}
                            onPress={() => onPressWithParrams()}
                        >
                            <Icon
                                name="file-text-outline"
                                fill={color.iconSettingColor}
                                style={styles.settingIcon}
                            />
                            <View style={styles.linkText}>
                                <Text
                                    style={[
                                        styles.textColor,
                                        styles.textSettingSize,
                                    ]}
                                >
                                    Hướng dẫn thêm khách
                                </Text>
                                <Icon
                                    name="chevron-right"
                                    fill={color.lightWeight}
                                    style={styles.linkCarret}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.itemWrap}>
                        <TouchableOpacity
                            style={styles.itemInner}
                            onPress={() => onPressWithParrams()}
                        >
                            <Icon
                                name="file-text-outline"
                                fill={color.iconSettingColor}
                                style={styles.settingIcon}
                            />
                            <View style={styles.linkText}>
                                <Text
                                    style={[
                                        styles.textColor,
                                        styles.textSettingSize,
                                    ]}
                                >
                                    Hướng dẫn thu tiền tất cả
                                </Text>
                                <Icon
                                    name="chevron-right"
                                    fill={color.lightWeight}
                                    style={styles.linkCarret}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.itemWrap}>
                        <TouchableOpacity
                            style={styles.itemInner}
                            onPress={() => onPressWithParrams()}
                        >
                            <Icon
                                name="file-text-outline"
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
                                    Hướng dẫn ghi điện tất cả
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
            </ScrollView>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        backgroundColor: color.darkColor,
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
    badge: {
        paddingHorizontal: 5,
        paddingVertical: 3,
        backgroundColor: color.primary,
        borderRadius: 4,
        marginLeft: 5,
    },

    icon: {
        width: 25,
        height: 25,
        marginRight: 10,
    },
    expiredDate: {
        marginLeft: 5,
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        backgroundColor: "rgba(65,63,98,1)",
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
    metaWrap: {
        flexDirection: "row",
    },
    meta: {
        flexDirection: "row",
        alignItems: "center",
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
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
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
    subTitle: {
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        color: color.lightWeight,
        fontWeight: "600",
        textTransform: "uppercase",
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
    secWrap: {
        marginBottom: 30,
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
