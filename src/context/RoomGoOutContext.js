import { IndexPath } from "@ui-kitten/components";
import CreateDataContext from "./CreateDataContext";
import AsyncStorage from '@react-native-community/async-storage';
import {settings} from '~/config'
import { updateWaterElectric } from "~/api/MotelAPI";
import { goOut } from '~/api/RenterAPI'
const defaultState = {
    step: 0,
    isLoading: false,
    dataForm: [{
        roomPrice: "",
        dateGoIn: new Date("10/20/2019"),
        dateGoOut: "",
        constract: "20/10/2020",
        roomInfo: {
            electrictNumber: '',
            electrictPrice: '5000',
            electrictPriceInclude: '',
            electrictImage: null,
            electrictImageID: '',
            waterNumber: '',
            waterPrice: '3000',
            waterPriceInclude: '',
            waterImage: null,
            waterImageID: ''
        },
    },
    {
        moneyLastMonth: '',
        depositMoney: '',
        depositType: '',
        checkoutDeposit: "",
        actuallyReceived: "",
        paymentTypeIndex: new IndexPath(0),
        billInfo: {

        }
    }],
}

const goOutReducer = (prevstate, action) => {
    switch (action.type) {
        case "STEP_STATE_CHANGE": {
            const newFormState = prevstate.dataForm.map((item, index) => {
                if (index === prevstate.step) {
                    const changeItem = item;
                    changeItem[action.payload.field] = action.payload.value;
                    return changeItem;
                } return item;
            });
            return {
                ...prevstate,
                dataForm: newFormState,
            };
        }

        case "UPDATE_STEP": {
            const currentStep = prevstate.step;
            const stepChange = action.payload.stepValueChange;
            if (currentStep + stepChange > 2 || currentStep + stepChange < 0) { return prevstate; }
            return { ...prevstate, step: currentStep + stepChange };
        }

        case "SERVICE_CHANGE": {
            const newFormState = prevstate.dataForm.map((item, index) => {
                if (index === prevstate.step) {
                    const { services } = item;
                    return {
                        ...item,
                        services: services.map((service) => (service.id === action.payload.id ? { ...service, value: action.payload.value } : service)),
                    };
                } return item;
            });
            return {
                ...prevstate,
                dataForm: newFormState,
            };
        }
        case "LOAD_DATA": {
            if(!!!action.payload[0].moneyLastMonth){
                return {
                    ...prevstate,
                    dataForm: [{
                        ...action.payload[0]
                    }, {
                        ...prevstate.dataForm[1]
                    }],
                }
            } else if(!!!action.payload[0].roomInfo) {
                return {
                    ...prevstate,
                    dataForm: [{
                        ...prevstate.dataForm[0]
                    }, {
                        ...action.payload[0]
                    }],
                }
            } else {
                return {
                    ...prevstate,
                    dataForm: action.payload
                }
            }
            
        }
        case "SET_BILL": {
            return {
                ...prevstate,
                dataForm: [
                    {
                        ...prevstate.dataForm[0]
                    },
                    {
                        ...prevstate.dataForm[1],
                        billInfo: action.payload[0]
                    }
                ]
            }
        }
        case "SET_LOADING": {
            return {
                ...prevstate,
                isLoading: action.payload
            }
        }
        case "RESET_STATE": {
            return defaultState;
        }
        default: {
            return prevstate;
        }
    }
};


const changeStepForm = dispatch => async (stepValueChange, data) => {
   
    if (stepValueChange === 1){
        dispatch({type: "SET_LOADING", payload: true});
        try {
            const res = await informElectrictWater(data);
            console.log('changeStepForm - updateWaterElectric', res);

            dispatch({type: "SET_LOADING", payload: false});
            if(res.Code === 1){
                dispatch({ type: "UPDATE_STEP", payload: { stepValueChange } })
            } else {
                console.log('res.Code susscess fail handle', res);
            }
            

        } catch (error) {
            console.log('changeStepForm - updateWaterElectric error: ', error);
            dispatch({type: "SET_LOADING", payload: false});
        }
    } else {
        dispatch({ type: "UPDATE_STEP", payload: { stepValueChange } })
    }
    // dispatch({ type: "UPDATE_STEP", payload: { stepValueChange } });
};

const changeStateFormStep = (dispatch) => (field, value) => {
    dispatch({ type: "STEP_STATE_CHANGE", payload: { field, value } });
};

const clearState = (dispatch) => () => {
    dispatch({ type: "RESET_STATE" });
}
const renderZero = num => {
    
    if(num > 9) return `${num}`;
    return `0${num}`
}
const loadDataForm = (dispatch) => async (data) => {
    try {
        console.log('loadDataForm goOutReducer', data);
        const { renter, electric, water, room } = data;
        const contractDate = new Date(renter.renter.DateOutContract);
        const dataForm = [
            {
                roomID: room.ID,
                renterID: renter.renter.ID,
                roomPrice: renter.renter.PriceRent || 0,
                dateGoIn: new Date(renter.renter.Datein) || '',
                dateGoOut:  new Date() || '',
                constract: `${ renderZero(contractDate.getDate()) }/${ renderZero(contractDate.getMonth() + 1) }/${ contractDate.getFullYear() }` || '',
                roomInfo: {
                    electrictNumber: electric.number || '',
                    electrictPrice: room.PriceElectric || 0,
                    electrictPriceInclude: '',
                    electrictImage: electric.image_thumbnails || '',
                    waterNumber: water.number || '',
                    waterPrice: room.PriceWater || 0,
                    waterPriceInclude: '',
                    waterImage: water.image_thumbnails || '',
                    
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
        dispatch({type: "LOAD_DATA", payload: dataForm});
        return true;
    } catch (error) {
        console.log('loadData goOutReducer error: ', error);
    }
    return false;
}
const loadDataBill = (dispatch) => async (data) => {
    try {
        console.log('loadDataBill goOutReducer', data);
        const dataBill = [{
            electricDiff: data?.ElectricNumber || 0,
            waterDiff: data?.WaterNumber || 0,
            electricDiffPrice: data?.ElectricPrice || 0,
            waterDiffPrice: data?.WaterPrice || 0,
            dateDiff: data?.Days || 0,
            priceRoomBase: data?.PriceRoom || 0,
            priceRoomByDate: data?.PriceMustCollect || 0,
            totalPrice: data?.TotalDebt || 0
        }]
        await dispatch({type: "SET_BILL", payload: dataBill});
        return true;
    } catch (error) {
        console.log('loadDataBill goOutReducer error: ', error);
    }
    return false;
}
const informElectrictWater = async (data) => {
    
    try {
      
        const {waterNumber, electrictNumber, waterImage, electrictImage} = data[0]?.roomInfo;
        const {roomId} = data
        
        const nowDate = new Date();
        const res = await updateWaterElectric({
            date: `${ renderZero(nowDate.getDate()) }/${ renderZero(nowDate.getMonth() + 1) }/${ nowDate.getFullYear() }`,
            data: JSON.stringify([{RoomID: roomId,
                WaterNumber: waterNumber || 0,
                WaterIMG: waterImage || 0, 
                ElectricNumber: electrictNumber || 0,
                ElectricIMG: electrictImage || 0}])
        });
       
        if(res.Code === 1){
            console.log('Thành công!!', res);
            return res;
           
        } else {
            throw res;
        }
    } catch (error) {
        console.log('informElectrictWater goOutReducer error: ' ,error);
        return error;        
        
    }
}
const moveOut = (dispatch) => async (data) => {
    dispatch({type: "SET_LOADING", payload: true});
    try {
        console.log('moveOut data:', data);
        const { dataForm } = data;
        //pararms: {
        // renterid:1065
        // roomid:2378
        // paid:0
        // payment:1
        //}

        const res = await goOut({
            renterid: dataForm[0].renterID,
            roomid: dataForm[0].roomID,
            paid: 0,
            payment: ( dataForm[1].paymentTypeIndex.row + 1 ) || 1 
        });

        dispatch({type: "SET_LOADING", payload: false});
    } catch (error) {
        console.log('goOut error:', error);
        dispatch({type: "SET_LOADING", payload: false});
    }
    
}
export const { Context, Provider } = CreateDataContext(
    goOutReducer,
    {
        changeStepForm, changeStateFormStep, clearState, loadDataForm, loadDataBill, moveOut
    }, defaultState
);
