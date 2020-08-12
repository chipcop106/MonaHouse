import { IndexPath } from "@ui-kitten/components";
import CreateDataContext from "./CreateDataContext";
import { addRenterOnRoom } from "~/api/RenterAPI";
import { Alert } from "react-native";

const initialState = {
    step: 0,
    dataForm: [
        {
            roomPrice: "",
            dateGoIn: "",
            timeRent: "12",
            timeTypeIndex: new IndexPath(0),
            roomInfo: {
                electrictNumber: "",
                electrictPrice: "",
                electrictPriceInclude: "",
                electrictImage: null,
                waterNumber: "",
                waterPrice: "",
                waterPriceInclude: "",
                waterImage: null,
            },
            electrictIndex: new IndexPath(0),
            services: [],
        },
        {
            fullName: "",
            phoneNumber: "",
            email: "",
            job: "",
            provinceIndex: new IndexPath(0),
            numberPeople: "",
            relationshipIndex: new IndexPath(0),
            note: "",
            licenseImages: [],
            cityLists: [],
        },
        {
            depositTypeIndex: new IndexPath(0),
            preDepositTimeIndex: new IndexPath(0),
            totalDeposit: "3.000.000",
            prePaymentTimeIndex: new IndexPath(0),
            totalPrepay: "30.000.000",
            actuallyReceived: "4.000.000",
            paymentTypeIndex: new IndexPath(0),
            paymentNote: "Đây là ghi chú",
        },
    ],
};

const goInReducer = (prevstate, action) => {
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

        case "RESET_STATE": {
            return initialState;
        }

        default: {
            return prevstate;
        }
    }
};

const errorHandle = (code, { signOut }) => {
    switch (code) {
        case 2:
            alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại !!");
            signOut && signOut();
            break;
        default:
            alert("Lỗi API !!");
            return;
            break;
    }
};

const changeStepForm = (dispatch) => (stepValueChange) => {
    dispatch({ type: "UPDATE_STEP", payload: { stepValueChange } });
};

const changeStateFormStep = (dispatch) => (field, value) => {
    dispatch({ type: "STEP_STATE_CHANGE", payload: { field, value } });
};

const onChangeService = (dispatch) => (value) => {
    dispatch({ type: "SERVICE_CHANGE", payload: value });
};

const addPeopleToRoom = (dispatch) => async (params, actions) => {
    try {
        const res = await addRenterOnRoom(params);
        res.Code !== 1 && errorHandle(res.Code, actions);
        Alert.alert("Thông báo", "Thêm thành công !", [
            {
                text: "Ok",
                onPress: () => {
                    actions.resetState();
                    actions.navigation.popToTop();
                },
            },
        ]);
    } catch (error) {
        alert(JSON.stringify(error.message));
    }
};

const resetState = (dispatch) => (value) => {
    dispatch({ type: "RESET_STATE" });
};

export const { Context, Provider } = CreateDataContext(
    goInReducer,
    {
        changeStepForm,
        changeStateFormStep,
        onChangeService,
        resetState,
        addPeopleToRoom,
    },
    {
        step: 0,
        dataForm: [
            {
                roomPrice: "3000000",
                dateGoIn: "",
                timeRent: "12",
                timeTypeIndex: new IndexPath(1),
                roomInfo: {
                    electrictNumber: "",
                    electrictPrice: "",
                    electrictPriceInclude: "",
                    electrictImage: null,
                    waterNumber: "",
                    waterPrice: "",
                    waterPriceInclude: "",
                    waterImage: null,
                },
                electrictIndex: new IndexPath(0),
                services: [],
            },
            {
                fullName: "",
                phoneNumber: "",
                email: "",
                provinceIndex: new IndexPath(0),
                numberPeople: "1",
                relationshipIndex: new IndexPath(0),
                note: "",
                licenseImages: null,
                cityLists: [],
                relationLists: [],
            },
            {
                depositTypeIndex: new IndexPath(0),
                preDepositTimeIndex: new IndexPath(0),
                totalDeposit: "",
                prePaymentTimeIndex: new IndexPath(0),
                totalPrepay: "",
                actuallyReceived: "",
                paymentTypeIndex: new IndexPath(0),
                paymentNote: "",
                paymentType: [],
            },
        ],
    }
);
