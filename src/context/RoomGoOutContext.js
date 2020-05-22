import { IndexPath } from "@ui-kitten/components";
import CreateDataContext from "./CreateDataContext";
import AsyncStorage from '@react-native-community/async-storage';

const defaultState = {
  step: 0,
  dataForm: [{
    roomPrice: "",
    dateGoIn: new Date("10/20/2019"),
    dateGoOut: "",
    constract:"20/10/2020",
    roomInfo: {
      electrictNumber: '',
      electrictPrice: '5000',
      electrictPriceInclude: '',
      electrictImage: null,
      waterNumber: '',
      waterPrice: '3000',
      waterPriceInclude: '',
      waterImage: null,
    },
  },
  {
    moneyLastMonth: '',
    depositMoney:'',
    depositType:'', 
    checkoutDeposit: "",
    actuallyReceived: "",
    paymentTypeIndex: new IndexPath(0),
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
    case "RESET_STATE": {
      return defaultState;
    }
    default: {
      return prevstate;
    }
  }
};


const changeStepForm = (dispatch) => (stepValueChange) => {
  dispatch({ type: "UPDATE_STEP", payload: { stepValueChange } });
};

const changeStateFormStep = (dispatch) => (field, value) => {
  dispatch({ type: "STEP_STATE_CHANGE", payload: { field, value } });
};

const clearState = (dispatch) => () =>{
  dispatch({ type: "RESET_STATE"});
}


export const { Context, Provider } = CreateDataContext(
  goOutReducer,
  {
    changeStepForm, changeStateFormStep, clearState
  },{
    step: 0,
    dataForm: [{
      roomPrice: "",
      dateGoIn: new Date("10/20/2019"),
      dateGoOut: "",
      constract:"20/10/2020",
      roomInfo: {
        electrictNumber: '',
        electrictPrice: '5000',
        electrictPriceInclude: '',
        electrictImage: null,
        waterNumber: '',
        waterPrice: '3000',
        waterPriceInclude: '',
        waterImage: null,
      },
    },
    {
      moneyLastMonth: '',
      depositMoney:'',
      depositType:'', 
      checkoutDeposit: "",
      actuallyReceived: "",
      paymentTypeIndex: new IndexPath(0),
    }],
  },
);
