<<<<<<< HEAD
import React, { useReducer, useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, 
    Alert, ActivityIndicator,
    TextInput
} from "react-native";
=======
import React, { useReducer, useEffect, useContext } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
>>>>>>> RoomManager
import { Text, Input, Button, Icon } from "@ui-kitten/components";
import UserInfo from "~/components/UserInfo";
import IncludeElectrictWater from "~/components/IncludeElectrictWater";
import { color, sizes } from "~/config";
import gbStyle from "~/GlobalStyleSheet";
<<<<<<< HEAD
import { getRoomById, updateWaterElectric } from "~/api/MotelAPI";
=======
import { getRoomById } from "~/api/MotelAPI";
import TextField from "~/components/common/TextField";
import { Context as RoomContext } from "~/context/RoomContext";
import { Context as AuthContext } from "~/context/AuthContext";
>>>>>>> RoomManager
const initialState = {
    electrictNumber: "",
    electrictImage: null,
    waterNumber: "",
    waterImage: null,
<<<<<<< HEAD
    oldElectrict: "",
    oldWater: "",
=======
    oldElectrict: "323232",
    oldWater: "232323",
    waterPrice: "5000",
    electrictPrice: "5000",
>>>>>>> RoomManager
};

const reducer = (prevstate, action) => {
    switch (action.type) {
        case "STATE_CHANGE": {
            return {
                ...prevstate,
                ...action.payload.newState,
            };
        }
        default:
            return prevstate;
    }
};
<<<<<<< HEAD
const renderZero = num => {
    if(num > 9) return `${num}`;
    return `0${num}`
}
const ElectrictCollectScreen = ({ route }, month) => {
=======

const ElectrictCollectScreen = ({ navigation, route }) => {
    const { updateElectrict } = useContext(RoomContext);
    const { signOut } = useContext(AuthContext);
>>>>>>> RoomManager
    const [state, dispatch] = useReducer(reducer, initialState);
    const roomId = route.params?.roomId ?? null;
    // const { renter, room, electric, water } = state;
    const [loading, setLoading] = useState(false);

    const onChangeValue = (newState) => {
        dispatch({ type: "STATE_CHANGE", payload: { newState } });
    };

    const _onSubmit = async () => {
        const params = {
            roomid: roomId,
            renterid: renter.renter.ID,
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            electrict: parseInt(state.electrictNumber),
            imgelectrict: state.electrictImage || "",
            water: parseInt(state.waterNumber),
            imgwater: state.waterImage || "",
        };
        await updateElectrict(params, { signOut, navigation });
    };

    useEffect(() => {
        (async () => {
       
            try {
                const res = await getRoomById({ roomid: roomId });
                console.log('getRoomById RES', res.Data);
                dispatch({
                    type: "STATE_CHANGE",
                    payload: { newState: res.Data },
                });
            } catch (err) {}
        })()
    }, []);
    useEffect(() => {
        console.log('state change', state);
    }, [state]);
    const _pressUpdate = async () => {
        setLoading(true);
        const {waterNumber, electrictNumber, waterImage, electrictImage} = state;
        
        const nowDate = new Date();
        
        try {
            const res = await updateWaterElectric({
                date: `${ renderZero(nowDate.getDate()) }/${ renderZero(nowDate.getMonth() + 1) }/${ nowDate.getFullYear() }`,
                data: JSON.stringify([{RoomID: roomId,
                    WaterNumber: waterNumber,
                    WaterIMG: waterImage || 0, 
                    ElectricNumber: electrictNumber,
                    ElectricIMG: electrictImage || 0}])

            });
            
            if(res.Code === 1){
                Alert.alert('Thành công!!', 'Số điện nước đã được cập nhật')
            } else {
                throw res;
            }

        } catch (error) {

            setLoading(false);
            Alert.alert('Oop!!', JSON.stringify(error))
        }
        setLoading(false);
        // electrictNumber, waterNumber
    }
    return (
        <>
            <ScrollView>
                <View style={styles.container}>
                    {
                       state.renter?.renter.FullName && <UserInfo
                            name={state.renter?.renter.FullName ?? "Đang tải..."}
                            phone={state.renter?.renter.Phone ?? "Đang tải"}
                            avatar={state.renter?.renter.LinkIMG ?? null}
                        />
                    }
                    <View style={styles.mainWrap}>
                        <View style={styles.section}>
                            <Text
                                status="primary"
                                category="h5"
<<<<<<< HEAD
                                style={{ marginBottom: 5 }}
                                disabled={loading}
=======
                                style={{ marginBottom: 15 }}
>>>>>>> RoomManager
                            >
                                {state.room && state.room.NameRoom
                                    ? state.room.NameRoom
                                    : loading && "Đang tải..."}
                            </Text>

                            <View style={styles.formWrap}>
                                <View style={[styles.formRow, styles.halfCol]}>
                                    <TextField
                                        textStyle={styles.textInput}
                                        label="Số điện cũ"
                                        placeholder={'0'}
                                        value={String(state.electric?.number || 0)}
                                        textContentType="none"
                                        keyboardType="numeric"
                                        disabled
                                    />
                                </View>
                                <View style={[styles.formRow, styles.halfCol]}>
                                    <TextField
                                        textStyle={styles.textInput}
                                        label="Số nước cũ"
                                        placeholder="0"
                                        value={String(state.water?.number || 0)}
                                        textContentType="none"
                                        keyboardType="numeric"
                                        disabled
                                    />
                                </View>
                                {!!!state.room && loading && <ActivityIndicator size="large" />}
                                {state.room && <IncludeElectrictWater
                                    initialState={initialState}
                                    roomData={state.room}
                                    handleValueChange={onChangeValue}
<<<<<<< HEAD
                                    waterTitle="Nước tháng này"
                                    electrictTitle="Điện tháng này"
                                />}
=======
                                    waterTitle="Số nước mới"
                                    electrictTitle="Số điện mới"
                                />
>>>>>>> RoomManager
                            </View>
                        </View>
                        <Button
                            onPress={_onSubmit}
                            accessoryLeft={() => (
                                <Icon
                                    name="sync"
                                    fill={color.whiteColor}
                                    style={sizes.iconButtonSize}
                                />
                            )}
                            size="large"
                            status="success"
                            disabled={loading}
                            onPress={_pressUpdate}
                        >
                            Cập nhật điện nước
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 15,
    },
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
    mb15: {
        marginBottom: 15,
    },
});

export default ElectrictCollectScreen;
