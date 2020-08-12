import {
    Alert
} from 'react-native';
import CreateDataContext from "~/context/CreateDataContext";
import {
    getRoomsByMotelId,
    createRoomSingle as createRoomAPI,
    updateRoom as updateRoomAPI,
    deleteRoom as deleteRoomAPI,
} from "../api/MotelAPI";

import { updateElectrictWater } from "~/api/RenterAPI";

const currentTime = new Date();
const currentMonth = currentTime.getMonth() + 1;
const currentYear = currentTime.getFullYear();

const roomReducer = (prevstate, { type, payload }) => {
    switch (type) {
        case "STATE_CHANGE":
            return {
                ...prevstate,
                [payload.field]: payload.value,
            };

        case "GET_ROOM": {
            return {
                ...prevstate,
                listRooms: payload,
            };
        }

        case "GET_ELECTRICT": {
            return {
                ...prevstate,
                listElectrictRooms: payload,
            };
        }

        case "GET_ELECTRICT_HISTORY": {
            return {
                ...prevstate,
                listElectrictHistory: payload,
            };
        }

        case "UPDATE_ELECTRICT_STATUS": {
            return {
                ...prevstate,
                listRooms: [...prevstate.listRooms].map((room) =>
                    room.id === payload.roomid ? (room.StatusWEID = 6) : room
                ),
            };
        }

        default:
            return prevstate;
    }
};

const errorHandle = (code, { signOut }) => {
    switch (code) {
        case 2:
            alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại !!");
            signOut && signOut();
            break;
        default:
            alert("Lỗi API !! Code hông tồn tại!!");
            return;
            break;
    }
};

const getListRooms = (dispatch) => async (
    {
        motelid = 0,
        month = currentMonth,
        year = currentYear,
        qsearch = "",
        sortby = 0,
        status = 0,
    },
    signOut
) => {

    try {
        const res = await getRoomsByMotelId({
            motelid,
            month,
            year,
            qsearch,
            sortby,
            status,
        });
        if (res.Code === 2) {
            Alert.alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại !!");
            if (signOut) signOut();
        }
        res.Code !== 1 && errorHandle(res.Code, { signOut });
        dispatch({ type: "GET_ROOM", payload: res.Data });
    } catch (error) {
        Alert.alert(JSON.stringify(error));
    }

};

const getListElectrict = (dispatch) => async (
    {
        motelid = 0,
        month = currentMonth,
        year = currentYear,
        qsearch = "",
        sortby = 0,
        status = 0,
    },
    signOut
) => {
    try {
        const res = await getRoomsByMotelId({
            motelid,
            month,
            year,
            qsearch,
            sortby,
            status,
        });
        if (res.Code === 2) {
            
            Alert.alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại !!");
            if (signOut) signOut();
        }
        res.Code !== 1 && errorHandle(res.Code, { signOut });
        dispatch({ type: "GET_ELECTRICT", payload: res.Data });
    } catch (error) {
        alert(JSON.stringify(error.message));
    }
};

const getElectrictHistory = (dispatch) => async (
    {
        motelid = 0,
        month = currentMonth,
        year = currentYear,
        qsearch = "",
        sortby = 0,
        status = 0,
    },
    signOut
) => {
    try {
        const res = await getRoomsByMotelId({
            motelid,
            month,
            year,
            qsearch,
            sortby,
            status,
        });
        if (res.Code === 2) {
            
            Alert.alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại !!");
            if (signOut) signOut();
        }
        res.Code !== 1 && errorHandle(res.Code, { signOut });
        dispatch({ type: "GET_ELECTRICT_HISTORY", payload: res.Data });
    } catch (error) {
        Alert.alert(JSON.stringify(error));
    }
};

const updateElectrict = (dispatch) => async (params, actions) => {
    const { navigation } = actions;
    try {
        const res = await updateElectrictWater(params);
        res.Code !== 1 && errorHandle(actions);
        Alert.alert("Thông báo !!", "Cập nhật điện nước thành công !", [
            {
                text: "Ok",
                onPress: () => {
                    dispatch({
                        type: "UPDATE_ELECTRICT_STATUS",
                        payload: { roomid: 1 },
                    });
                    navigation.pop();
                },
            },
        ]);
    } catch (err) {
        alert(JSON.stringify(err.message));
    }
};

const createRoom = (dispatch) => async (
    params,
    callback
) => {
    const { navigation, refreshList } = callback;

    try {
        const res = await createRoomAPI(params);
        res.Code !== 1 && errorHandle(res.Code, callback);
        
    } catch (error) {
        alert(JSON.stringify(error.message));
    }
};

const updateRoom = (dispatch) => async (
    {
        roomid = 0,
        roomname = "",
        priceroom = 0,
        electrictprice = 0,
        waterprice = 0,
        description = "",
    },
    callback
) => {
    const { navigation, refreshRoomInfo } = callback;
    const res = await updateRoomAPI({
        roomid: parseInt(roomid),
        roomname,
        priceroom: parseInt(priceroom),
        electrictprice: parseInt(electrictprice),
        waterprice: parseInt(waterprice),
        description,
    });
    console.log(res);
    res.Code !== 1 && errorHandle(res.Code, callback);
    Alert.alert("Thông báo", "Cập nhật thành công !", [
        {
            text: "Ok",
            onPress: () => {
                navigation.pop();
                refreshRoomInfo();
            },
        },
    ]);
};

const deleteRoom = (dispatch) => async ({ roomid = 0 }, callback) => {
    const { navigation } = callback;

    const res = await deleteRoomAPI({
        roomid: parseInt(roomid),
    });
    console.log(res);
    res.Code !== 1 && errorHandle(res.Code, callback);
    Alert.alert("Thông báo", "Xóa phòng thành công !", [
        {
            text: "Ok",
            onPress: () => {
                navigation.popToTop();
            },
        },
    ]);
};

const updateState = (dispatch) => (field, value) => {
    dispatch({ type: "STATE_CHANGE", payload: { field, value } });
};

export const { Context, Provider } = CreateDataContext(
    roomReducer,
    {
        getListRooms,
        getListElectrict,
        getElectrictHistory,
        updateElectrict,
        updateState,
        createRoom,
        updateRoom,
        deleteRoom,
    },
    {
        isLoading: false,
        filterStateDefault: {
            selectedMonthIndex: 0,
            selectedMotelIndex: 0,
            selectedYearIndex: 0,
            selectedSortIndex: 0,
            searchValue: "",
        },
        listRooms: [],
        listElectrictRooms: [],
        listElectrictHistory: [],
    }
);
