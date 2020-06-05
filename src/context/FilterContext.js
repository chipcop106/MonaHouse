import AsyncStorage from "@react-native-community/async-storage";
import CreateDataContext from "./CreateDataContext";
import { IndexPath } from "@ui-kitten/components";

const filterReducer = (prevstate, { type, payload }) => {
    switch (type) {
        case "UPDATE_STATE":
            return {
                ...prevstate,
                [payload.key]: payload.value,
            };
        default:
            return prevstate;
    }
};

const updateFilterState = (dispatch) => (value) => {
    dispatch({ type: "UPDATE_STATE", payload: { key: "roomFilter", value } });
};

export const { Context, Provider } = CreateDataContext(
    filterReducer,
    { updateFilterState },
    {
        roomFilter: {
            selectedMonthIndex: new IndexPath(0),
            selectedMotelIndex: new IndexPath(0),
            selectedYearIndex: new IndexPath(0),
            searchValue: "",
        },
    }
);
