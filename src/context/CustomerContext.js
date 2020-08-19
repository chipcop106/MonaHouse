import CreateDataContext from "./CreateDataContext";
import { getCustomerDebt, getCustomerRenting } from "~/api/RenterAPI";

const initialState = {
  motelLists: [],
  isLoading: true,
  activeMotel: 0,
  queryString: "",
  customers: [],
  filterCustomers: [],
  error: null,
};

const customerReducer = (prevState, { type, payload }) => {
  switch (type) {
    case "UPDATE_MOTEL": {
      return {
        ...prevState,
        motelLists: payload,
        isLoading: false,
      };
    }
    case "SET_LOADING": {
      return {
        ...prevState,
        isLoading: payload,
      };
    }
    case "SET_MOTEL": {
      return {
        ...prevState,
        activeMotel: payload,
      };
    }
    case "SET_HOUSE": {
      return {
        ...prevState,
        selectedHouse: payload,
      };
    }
    case "SEARCH_QUERY": {
      return {
        ...prevState,
        queryString: payload,
      };
    }
    case "SET_CUSTOMER": {
      return {
        ...prevState,
        customers: payload,
      };
    }
    case "UPDATE_FILTER": {
      return {
        ...prevState,
        filterCustomers: payload,
      };
    }
    case "SET_ERROR": {
      return {
        ...prevState,
        error: payload,
      };
    }
    default:
      return prevState;
  }
};

const setLoading = (dispatch) => (value) => {
  dispatch({ type: "SET_LOADING", payload: value });
};

const setError = (text) => {
  dispatch({ type: "SET_ERROR", payload: text });
};

const setQuerySearch = (dispatch) => (text) => {
  dispatch({ type: "SEARCH_QUERY", payload: text });
};

const setSelectedMotel = (dispatch) => (index) => {
  dispatch({ type: "SET_MOTEL", payload: index });
};

const setFilterData = (dispatch) => (filterData) => {
  dispatch({ type: "UPDATE_FILTER", payload: filterData });
};

const setMotelLists = (dispatch) => (motels) => {
  dispatch({
    type: "UPDATE_MOTEL",
    payload: motels,
  });
};

const getUserDebtByMotelId = (dispatch) => {
  return async (motelId) => {
    setLoading(true);
    try {
      const res = await getCustomerDebt({
        motelid: motelId,
        type: 1,
        search: "A",
        sort: 0,
        roomid: 0,
      }); //motelid
      res.Code === 1 &&
        dispatch({
          type: "SET_CUSTOMER",
          payload: res.Data.map((item) => {
            return {
              ...item,
              CustomerID: item.ID,
              Avatar: item.LinkIMGThumbnail,
              FullName: item.FullName,
              Debt: item.Money,
              Status: item.StatusRen,
              PhoneNumber: item.Phone,
            };
          }),
        });
      res.Code === 0 &&
        setError({
          code: res.Code,
          message: res?.message ?? "Lỗi gọi API không thành công",
        });
    } catch (e) {
      console.log(e?.message ?? "Lỗi");
    }
    setLoading(false);
  };
};

const getUserRentingByMotelId = (dispatch) => {
  return async (motelId) => {
    setLoading(true);
    try {
      const res = await getCustomerRenting({
        motelid: motelId,
      }); //motelid
      res.Code === 1 &&
        dispatch({
          type: "SET_CUSTOMER",
          payload: res.Data,
        });
      res.Code === 0 &&
        setError({
          code: res.Code,
          message: res?.message ?? "Lỗi gọi API không thành công",
        });
    } catch (e) {
      console.log(e?.message ?? "Lỗi");
    }
    setLoading(false);
  };
};

const getUserOldByMotelId = (dispatch) => {
  return async (motelId) => {
    setLoading(true);
    try {
      const res = await getCustomerRenting({
        motelid: motelId,
      }); //motelid
      res.Code === 1 &&
        dispatch({
          type: "SET_CUSTOMER",
          payload: res.Data.filter((item) => {
            return item.StatusRen === 2;
          }),
        });
      res.Code === 0 &&
        setError({
          code: res.Code,
          message: res?.message ?? "Lỗi gọi API không thành công",
        });
    } catch (e) {
      console.log(e?.message ?? "Lỗi");
    }
    setLoading(false);
  };
};

export const { Context, Provider } = CreateDataContext(
  customerReducer,
  {
    getUserRentingByMotelId,
    getUserDebtByMotelId,
    setQuerySearch,
    setLoading,
    setSelectedMotel,
    setFilterData,
    setMotelLists,
    getUserOldByMotelId,
  },
  initialState
);
