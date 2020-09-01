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
import { getEWHistory } from '~/api/CollectMoneyAPI'
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
        case "SET_RELOAD": {
            return {
                ...prevstate,
                isReload: payload
            }
        }
        default:
            return prevstate;
    }
};

const errorHandle = (code, { signOut } , res = null) => {
    switch (code) {
        case 2:
            alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại !!");
            signOut && signOut();
            break;
        default:
            throw res;
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
    const hasRenterRooms = Array.from(res.Data).filter((item) => item.RenterID);
    dispatch({ type: "GET_ELECTRICT", payload: hasRenterRooms });
  } catch (error) {
    alert(JSON.stringify(error.message));
  }
};

const getElectrictHistory = (dispatch) => async (
  {
    motelid = 0,
    roomid = 0,
    month = currentMonth,
    year = currentYear,
    sort = 0,
    status = 0,
  },
  signOut
) => {
  try {
    const res = await getEWHistory({
      motelid,
      roomid,
      month,
      year,
      sort,
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

    try {
        const res = await createRoomAPI(params);
        return res;
    } catch (error) {
        return error
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
    isReload: false,
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
