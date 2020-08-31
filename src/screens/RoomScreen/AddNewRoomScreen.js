import React, { useReducer, useContext, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    KeyboardAvoidingView,
    ScrollView,
    Alert,
    TouchableOpacity,
} from "react-native";
import {
    IndexPath,
    Icon,
    Button,
    Input,
    Select,
    SelectItem,
} from "@ui-kitten/components";
import { color, sizes } from "~/config";
import { currencyFormat as cf } from "~/utils";
import { Context as RoomContext } from "~/context/RoomContext";
import { Context as MotelContext } from "~/context/MotelContext";
import { Context as AuthContext } from "~/context/AuthContext";
import { create_UUID as randomId } from "~/utils";
import Service from "~/components/GoInForm/Service";
import { useNavigation, useRoute } from "@react-navigation/native";
import Spinner from 'react-native-loading-spinner-overlay';

const initialState = {
    isLoading: true,
    motelIndex: new IndexPath(0),
    roomName: "",
    roomPrice: "",
    waterPrice: "",
    electrictPrice: "",
    description: "",
    services: [],
};

const reducer = (state, { type, payload }) => {
    switch (type) {
        case "STATE_CHANGE":
            return {
                ...state,
                [payload.key]: payload.value,
            };

        default:
            return state;
    }
};

const AddNewRoomScreen = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { signOut } = useContext(AuthContext);
    const { state: motelState } = useContext(MotelContext);
    const { createRoom } = useContext(RoomContext);
    const { listMotels } = motelState;
    const navigation = useNavigation();
    const route = useRoute();
    const [spinner, setSpinner] = useState(false);

    const refreshList = () => {
        route.params.onGoBack();
    };
    const updateState = (key, value) => {
        dispatch({ type: "STATE_CHANGE", payload: { key, value } });
    };

    const addService = () => {
        const newServices = [
            ...state.services,
            {
                id: randomId(),
                value: {
                    name: "",
                    price: "",
                },
            },
        ];
        updateState("services", newServices);
    };

    const deleteService = (id) => {
        const newServices = [...state.services].filter(
            (serviceItem) => serviceItem.id !== id
        );
        updateState("services", newServices);
    };

    const updateService = (id, nextState) => {
        const newServices = [...state.services].map((service) => {
            return service.id === id
                ? {
                      ...service,
                      value: nextState,
                  }
                : service;
        });
        updateState("services", newServices);
    };

    const createNewRoom = async () => {
        //     roomName: "",
        // roomPrice: "",
        // waterPrice: "",
        // electrictPrice: "",
        // description: "",
        // services: [],
        setSpinner(true);
        await new Promise(r => setTimeout(r, 100));
        try {
            await createRoom(
                {
                    motelid: listMotels[state.motelIndex.row]?.ID ?? null,
                    roomname: state.roomName,
                    priceroom: state.roomPrice,
                    quantityroom: 1,
                    electricprice: state.electrictPrice,
                    waterprice: state.waterPrice,
                    description: state.description
                },
                { navigation, signOut, refreshList }
            );
            setSpinner(false);
            await new Promise(r => setTimeout(r, 100));
            Alert.alert("Thông báo", "Tạo phòng mới thành công !", [
                {
                    text: "Ok",
                    onPress: () => {
                        navigation.pop();
                        refreshList();
                    },
                },
            ]);
            
        } catch (error) {
            setSpinner(false);
            await new Promise(r => setTimeout(r, 100));
            Alert.alert(JSON.stringify(error.message));
        }
        
    };

    return (
        <View style={styles.container}>
            <ScrollView style={{ flex: 1, paddingVertical: 15 }}>
                <View style={styles.section}>
                    <View style={styles.formGroup}>
                        <Select
                            label="Chọn nhà"
                            value={listMotels[state.motelIndex.row].MotelName}
                            selectedIndex={state.motelIndex}
                            onSelect={(index) =>
                                updateState("motelIndex", index)
                            }
                        >
                            {listMotels ? (
                                [...listMotels].map((motel) => (
                                    <SelectItem
                                        key={(item) => item.ID}
                                        title={motel.MotelName}
                                    />
                                ))
                            ) : (
                                <SelectItem title="Đang loading..." />
                            )}
                        </Select>
                    </View>
                    <View style={styles.formGroup}>
                        <Input
                            label="Tên phòng"
                            placeholder="Phòng 01"
                            value={state.roomName}
                            style={styles.input}
                            textStyle={styles.textInput}
                            onChangeText={(newValue) =>
                                updateState("roomName", newValue)
                            }
                        />
                    </View>
                    <View style={[styles.formGroup, styles.half]}>
                        <Input
                            label="Giá phòng / tháng"
                            placeholder="vd: 3,000,000"
                            value={cf(state.roomPrice)}
                            onChangeText={(newValue) =>{
                                    updateState("roomPrice", newValue.replace(/\./g,''))
                                }   
                            }
                            style={styles.input}
                            textStyle={styles.textInput}
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.formRow}>
                        <View style={[styles.formGroup, styles.col]}>
                            <Input
                                label="Giá điện / kW"
                                placeholder="3.500"
                                value={cf(state.electrictPrice)}
                                onChangeText={(newValue) =>
                                    updateState("electrictPrice", newValue.replace(/\./g,''))
                                }
                                style={styles.input}
                                textStyle={styles.textInput}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={[styles.formGroup, styles.col]}>
                            <Input
                                label="Giá nước / m3"
                                placeholder="5.000"
                                value={cf(state.waterPrice)}
                                onChangeText={(newValue) =>
                                    updateState("waterPrice", newValue.replace(/\./g,''))
                                }
                                style={styles.input}
                                textStyle={styles.textInput}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    <View style={styles.formGroup}>
                        <Input
                            label="Mô tả phòng"
                            placeholder="VD: Phòng có điều hòa"
                            value={state.description}
                            onChangeText={(newValue) =>
                                updateState("description", newValue)
                            }
                            style={styles.input}
                            textStyle={styles.textInput}
                            multiline={true}
                            numberOfLines={3}
                        />
                    </View>
                </View>
                <View style={styles.serviceTitle}>
                    <Text style={{ ...styles.secTitle, marginBottom: 0 }}>
                        Dịch vụ phòng
                    </Text>
                    <TouchableOpacity
                        onPress={addService}
                        style={styles.addServiceBtn}
                    >
                        <Icon
                            name="plus-circle-outline"
                            fill={color.primary}
                            style={sizes.iconButtonSize}
                        />
                        <Text style={styles.addServiceBtnText}>
                            Thêm dịch vụ
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <View style={[styles.section, styles.serviceWrap]}>
                        {state.services && state.services.length > 0 ? (
                            state.services.map((service) => (
                                <Service
                                    key={`${service.id}`}
                                    initialState={{
                                        name: service.value?.name ?? "",
                                        price: service.value?.price ?? "",
                                    }}
                                    onDelete={() => deleteService(service.id)}
                                    onChangeValue={(nextState) =>
                                        updateService(service.id, nextState)
                                    }
                                />
                            ))
                        ) : (
                            <Text style={styles.emptyText}>
                                Không có dịch vụ thêm
                            </Text>
                        )}
                    </View>
                </View>
                <Button onPress={createNewRoom} status="danger" size="large">
                    Thêm phòng mới
                </Button>
            </ScrollView>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "position" : null}
            />
            <Spinner
            visible={spinner}
            textContent={'Vui lòng chờ giây lát...'}
            textStyle={{ color: '#fff' }} />
        </View>
    );
};

export default AddNewRoomScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0f0f0",
        paddingHorizontal: 15,
    },
    section: {
        padding: 15,
        marginBottom: 30,
        backgroundColor: color.whiteColor,
        borderRadius: 8,
    },
    formGroup: {
        marginBottom: 20,
    },
    formRow: {
        flexDirection: "row",
        marginHorizontal: -10,
    },
    col: {
        flexGrow: 1,
        paddingHorizontal: 10,
    },
    secTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: color.darkColor,
    },
    serviceTitle: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    addServiceBtn: {
        flexDirection: "row",
        alignItems: "center",
    },
    addServiceBtnText: {
        marginLeft: 5,
        color: color.primary,
        fontSize: 16,
        fontWeight: "600",
    },
    serviceWrap: {
        paddingBottom: 0,
        marginBottom: 15,
        marginHorizontal: -20,
    },
    emptyText: {
        textAlign: "center",
        color: color.redColor,
        fontWeight: "600",
    },
});
