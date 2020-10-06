import { IndexPath } from "@ui-kitten/components";
import CreateDataContext from "./CreateDataContext";
import AsyncStorage from "@react-native-community/async-storage";
import { settings } from "~/config";
import { updateWaterElectric } from "~/api/MotelAPI";
import { goOut } from "~/api/RenterAPI";
import Moment from "moment";
import { renderNumberByArray } from '~/utils';
const defaultState = {
  step: 0,
  isLoading: false,
  dataForm: [
    {
      roomPrice: "",
      dateGoIn: new Date("10/20/2019"),
      dateGoOut: "",
      constract: "20/10/2020",
      roomInfo: {
        electricNumber: "",
        electricPrice: "5000",
        electricPriceInclude: "",
        electricImage: null,
          electricImageID: '',
        waterNumber: "",
        waterPrice: "3000",
        waterPriceInclude: "",
        waterImage: null,
          waterImageID: ''
      },
    },
    {
      moneyLastMonth: "",
      depositMoney: "",
      depositType: "",
      checkoutDeposit: "",
      actuallyReceived: 0,
      paymentTypeIndex: new IndexPath(0),
      billInfo: {},
    },
  ],
};
const goOutReducer = (prevstate, action) => {
  switch (action.type) {
    case "STEP_STATE_CHANGE": {
      const newFormState = prevstate.dataForm.map((item, index) => {
        if (index === prevstate.step) {
          const changeItem = item;
          changeItem[action.payload.field] = action.payload.value;
          return changeItem;
        }
        return item;
      });
      return {
        ...prevstate,
        dataForm: newFormState,
      };
    }

    case "UPDATE_STEP": {
      const currentStep = prevstate.step;
      const stepChange = action.payload.stepValueChange;
      if (currentStep + stepChange > 2 || currentStep + stepChange < 0) {
        return prevstate;
      }
      return { ...prevstate, step: currentStep + stepChange };
    }

    case "SERVICE_CHANGE": {
      const newFormState = prevstate.dataForm.map((item, index) => {
        if (index === prevstate.step) {
          const { services } = item;
          return {
            ...item,
            services: services.map((service) =>
              service.id === action.payload.id
                ? { ...service, value: action.payload.value }
                : service
            ),
          };
        }
        return item;
      });
      return {
        ...prevstate,
        dataForm: newFormState,
      };
    }
    case "LOAD_DATA": {
      if (!!!action.payload[0].moneyLastMonth) {
        return {
          ...prevstate,
          dataForm: [
            {
              ...action.payload[0],
            },
            {
              ...prevstate.dataForm[1],
            },
          ],
        };
      } else if (!!!action.payload[0].roomInfo) {
        return {
          ...prevstate,
          dataForm: [
            {
              ...prevstate.dataForm[0],
            },
            {
              ...action.payload[0],
            },
          ],
        };
      } else {
        return {
          ...prevstate,
          dataForm: action.payload,
        };
      }
    }
    case "SET_BILL": {
      return {
        ...prevstate,
        dataForm: [
          {
            ...prevstate.dataForm[0],
          },
          {
            ...prevstate.dataForm[1],
            billInfo: action.payload[0],
          },
        ],
      };
    }
    case "SET_LOADING": {
      return {
        ...prevstate,
        isLoading: action.payload,
      };
    }
    case "RESET_STATE": {
      return defaultState;
    }
    default: {
      return prevstate;
    }
  }
};

const changeStepForm = (dispatch) => async (stepValueChange, data) => {
  if (stepValueChange === 1) {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await informElectrictWater(data);
      console.log("changeStepForm - updateWaterElectric", res);

      dispatch({ type: "SET_LOADING", payload: false });
      if (res.Code === 1) {
        dispatch({ type: "UPDATE_STEP", payload: { stepValueChange } });
      } else {
        console.log("res.Code susscess fail handle", res);
      }
    } catch (error) {
      console.log("changeStepForm - updateWaterElectric error: ", error);
      dispatch({ type: "SET_LOADING", payload: false });
    }
  } else {
    dispatch({ type: "UPDATE_STEP", payload: { stepValueChange } });
  }
  //dispatch({ type: "UPDATE_STEP", payload: { stepValueChange } });
};

const changeStateFormStep = (dispatch) => (field, value) => {
  dispatch({ type: "STEP_STATE_CHANGE", payload: { field, value } });
};

const clearState = (dispatch) => () => {
  dispatch({ type: "RESET_STATE" });
};
const renderZero = (num) => {
  if (num > 9) return `${num}`;
  return `0${num}`;
};
const loadDataForm = (dispatch) => async (data) => {
  try {
    console.log("loadDataForm goOutReducer", data);
    const { renter, electric, water, room } = data;
    const contractDate = new Date(renter.renter.DateOutContract);
    const dataForm = [
      {
        roomID: room.ID,
        renterID: renter.renter.ID,
        roomPrice: renter.renter.PriceRent || 0,
        dateGoIn: new Date(renter.renter.Datein) || "",
        dateGoOut: new Date() || "",
        renterDeposit: renter?.renter?.Deposit ?? 0,
        constract:
          `${renderZero(contractDate.getDate())}/${renderZero(
            contractDate.getMonth() + 1
          )}/${contractDate.getFullYear()}` || "",
        roomInfo: {
          ...room,
          electricNumber: electric?.number ?? 0,
          electricPrice: renter?.renter?.ElectricPrice ?? 0,
          electricPriceInclude: "",
          electricImage: electric.image_thumbnails || "",
          waterNumber: water?.number ?? 0,
          waterPrice: renter?.renter?.WaterPrice ?? 0,
          waterPriceInclude: "",
          waterImage: water.image_thumbnails || "",
          oldElectricNumber: electric?.number ?? 0,
          oldWaterNumber: water?.number ?? 0,
          StatusRoomID: data?.StatusRoomID ?? 0,
          StatusCollectID: data?.StatusCollectID ?? 0,
          StatusWEID: data?.StatusCollectID ?? 0,
        },
      },
      // {
      //     moneyLastMonth: '',
      //     depositMoney: '',
      //     depositType: '',
      //     checkoutDeposit: "",
      //     actuallyReceived: "",
      //     paymentTypeIndex: new IndexPath(0),
      // }
    ];
    dispatch({ type: "LOAD_DATA", payload: dataForm });
    return true;
  } catch (error) {
    console.log("loadData goOutReducer error: ", error);
  }
  return false;
};
const loadDataBill = (dispatch) => async (data) => {
  try {
    console.log("loadDataBill goOutReducer", data);
    const priceByDate = (()=>{
      let rs = "";
      const endOfMonth = Moment().endOf("month").format("DD");
      try {
        rs = data?.priceRoom / parseInt(endOfMonth);
        rs = Math.ceil(data?.soNgayO * rs * 0.001) * 1000;

        return  rs
      } catch (e) {
          console.log("priceByDate error:" , e);
      }
      return rs
    })();
    const priceAddon  = renderNumberByArray(data?.dichVu ?? [], 'Price')
    const incurredFee = renderNumberByArray(data?.phiPhatSinh ?? [], 'Price');

    const dataBill = [
      {
        electricDiff: data?.soDienDaDung ?? 0,
        waterDiff: data?.soNuocDaDung ?? 0,
        electricDiffPrice: parseInt(data?.giaDien) * parseInt(data?.soDienDaDung) ?? 0,
        waterDiffPrice: parseInt(data?.giaNuoc) * parseInt(data?.soNuocDaDung) ?? 0,
        dateDiff: data?.soNgayO ?? 0,
        priceAddon: priceAddon || 0,
        priceRoomBase: data?.priceRoom ?? 0,
        priceRoomByDate: ( data?.tongTienO ?? priceByDate ) || 0,
        totalDebt: data?.TotalDebt ?? 0,
        incurredFee: incurredFee || 0,
        deposit: data?.tienCoc,
        dept: data?.tienNo ?? 0,
        changeMoney: data?.tienDu ?? 0,
        collectedMoneyInMonth: data?.tienNhaDaDong ?? 0,
        totalCollect: data?.tongTienCanThu ?? 0,
      },
    ];
    await dispatch({ type: "SET_BILL", payload: dataBill });
    return true;
  } catch (error) {
    console.log("loadDataBill goOutReducer error: ", error);
  }
  return false;
};
const informElectrictWater = async (data) => {
  try {
    const {
      waterNumber,
      electricNumber,
      waterImage,
      electricImage,
    } = data[0]?.roomInfo;
    const { roomId } = data;

    const nowDate = new Date();
    const res = await updateWaterElectric({
      date: `${renderZero(nowDate.getDate())}/${renderZero(
        nowDate.getMonth() + 1
      )}/${nowDate.getFullYear()}`,
      data: JSON.stringify([
        {
          RoomID: roomId,
          WaterNumber: parseInt(waterNumber) || 0,
          WaterIMG: parseInt(waterImage) || 0,
          ElectricNumber: parseInt(electricNumber) || 0,
          ElectricIMG: parseInt(electricImage) || 0,
        },
      ]),
    });

    if (res.Code === 1) {
      console.log("Thành công!!", res);
      return res;
    } else {
      throw res;
    }
  } catch (error) {
    console.log("informElectrictWater goOutReducer error: ", error);
    return error;
  }
};
const moveOut = (dispatch) => async (data) => {
  dispatch({ type: "SET_LOADING", payload: true });
  try {
    console.log("moveOut data:", data);
    const { dataForm } = data;
    //pararms: {
    // renterid:1065
    // roomid:2378
    // paid:0
    // payment:1,
    // dateout
    //}
    const res = await goOut({
      renterid: parseInt(dataForm[0].renterID, 10),
      roomid: parseInt(dataForm[0].roomID, 10),
      paid: parseInt(dataForm[1].actuallyReceived, 10),
      dateout: Moment(dataForm[0].dateGoOut).format('DD/MM/YYYY'),
      payment: dataForm[1].paymentTypeIndex.row + 1 || 1,
    });
    dispatch({ type: "SET_LOADING", payload: false });
    return  res;
  } catch (error) {
    console.log("goOut error:", error);
    dispatch({ type: "SET_LOADING", payload: false });
  }
};
export const { Context, Provider } = CreateDataContext(
  goOutReducer,
  {
    changeStepForm,
    changeStateFormStep,
    clearState,
    loadDataForm,
    loadDataBill,
    moveOut,
  },
  defaultState
);
