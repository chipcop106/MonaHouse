import {
    Alert
} from 'react-native';
import CreateDataContext from "~/context/CreateDataContext";
import { getRoomsByMotelId } from "../api/MotelAPI";
import { IndexPath } from "@ui-kitten/components";
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
        default:
            return prevstate;
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
        dispatch({ type: "GET_ELECTRICT", payload: res.Data });
    } catch (error) {
        alert(JSON.stringify(error));
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
        dispatch({ type: "GET_ELECTRICT_HISTORY", payload: res.Data });
    } catch (error) {
        Alert.alert(JSON.stringify(error));
    }
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
        updateState,
    },
    {
        filterStateDefault: {
            selectedMonthIndex: 0,
            selectedMotelIndex: 0,
            selectedYearIndex: 0,
            searchValue: "",
        },
        listRooms: [],
        listElectrictRooms: [],
        listElectrictHistory: [],
    }
);
