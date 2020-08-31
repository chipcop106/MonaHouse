import instance, { getAccessToken } from "./instanceAPI";
import { string, number } from "yup";

const path = `/MotelApi`;

export const createMotel = async (params) => {
  try {
    const token = await getAccessToken();
    let res = await instance.get(`${path}/createmotel`, {
      params: {
        ...params,
        token,
      },
    });

    return res.data;
  } catch (error) {
    return error.message;
  }
};
export const createMotelByName = async (params) => {
  try {
    const token = await getAccessToken();
    let res = await instance.get(`${path}/createmotelbyname`, {
      params: {
        ...params,
        token,
      },
    });

    return res.data;
  } catch (error) {
    return error.message;
  }
};

export const updateMotel = async (params) => {
  try {
    const token = await getAccessToken();
    let res = await instance.get(`${path}/updatemotel`, {
      params: {
        ...params,
        token,
      },
    });
    return res.data;
  } catch (error) {
    return error.message;
  }
};

export const deleteMotel = async (params) => {
  try {
    const token = await getAccessToken();
    let res = await instance.get(`${path}/deletemotel`, {
      params: {
        ...params,
        token,
      },
    });
    return res;
  } catch (error) {
    return error.message;
  }
};

export const getMotels = async (params) => {
  let result = "";
  try {
    const token = await getAccessToken();
    let res = await instance.get(`${path}/getmotels`, {
      params: {
        token,
      },
    });
    result = res.data;
  } catch (error) {
    result = error;
  }
  return result;
};

export const getSortRoom = async (params) => {
  let result = "";
  try {
    // const token = await getAccessToken();
    let res = await instance.get(`${path}/getoptionsortroom`, {
      params: {
        // token,
      },
    });
    result = res.data;
  } catch (error) {
    result = error;
  }
  return result;
};

/* 
    int motelid || 0, 
    int month, 
    int year, 
    string qsearch || "", 
    int sortby || 0, 
    int status || 0
*/

export const getMotelById = async (params) => {
  try {
    const token = await getAccessToken();
    let res = await instance.get(`${path}/getmotelbyid`, {
      params: {
        ...params,
        token,
      },
    });
    return res.data;
  } catch (error) {
    return error.message;
  }
};

export const getRoomsByMotelId = async (params) => {
  try {
    const token = await getAccessToken();
    let res = await instance.get(`${path}/getroombymotelid`, {
      params: {
        ...params,
        token,
      },
    });
    return res.data;
  } catch (error) {
    return error.message;
  }
};

export const getRoomById = async (params) => {
  try {
    const token = await getAccessToken();
    let res = await instance.get(`${path}/getroombyid`, {
      params: {
        ...params,
        token,
      },
    });
    return res.data;
  } catch (error) {
    return error.message;
  }
};

export const createRoom = async (params) => {
  try {
    const token = await getAccessToken();
    let res = await instance.get(`${path}/createroom`, {
      params: {
        ...params,
        token,
      },
    });
    return res.data;
  } catch (error) {
    return error.message;
  }
};
export const createRoomSingle = async (params) => {
  try {
    const token = await getAccessToken();
    let res = await instance.get(`${path}/createroomone`, {
      params: {
        ...params,
        token,
      },
    });
    return res.data;
  } catch (error) {
    return error.message;
  }
};
/**
 *
 * @param string token
          int roomid
          string roomname
          int priceroom
          int electricprice
          int waterprice
          string description
 * @returns {Object Data}
 */
export const updateRoom = async (params) => {
  try {
    const token = await getAccessToken();
    let res = await instance.get(`${path}/updateroom`, {
      params: {
        ...params,
        token,
      },
    });
    return res.data;
  } catch (error) {
    return error.message;
  }
};

export const deleteRoom = async (params) => {
  try {
    const token = await getAccessToken();
    let res = await instance.get(`${path}/deleteroom`, {
      params: {
        ...params,
        token,
      },
    });
    return res.data;
  } catch (error) {
    return error.message;
  }
};

export const getOptionsSortRoom = async () => {
  try {
    let res = await instance.get(`${path}/getoptionsortroom`, {});
    return res.data;
  } catch (error) {
    return error.message;
  }
};
export const updateWaterElectric = async (params) => {
  try {
    const token = await getAccessToken();
    let res = await instance.get(`${path}/recordWaterElectric`, {
      params: {
        ...params,
        token,
      },
    });
    return res.data;
  } catch (error) {
    return error.message;
  }
};

export const getCustomerByMotelId = async (params) => {
  try {
    const token = await getAccessToken();
    let res = await instance.get(`${path}/GetCustomerByMotelId`, {
      params: {
        ...params,
        token,
      },
    });
    return res.data;
  } catch (error) {
    return error.message;
  }
};

export const insertRoomFee = async (
  params = {
    roomid: Number(),
    renterid: Number(),
    date: String(),
    note: String(),
    price: Number(),
  }
) => {
  try {
    const token = await getAccessToken();
    let res = await instance.get(`${path}/insertFee`, {
      params: {
        ...params,
        token,
      },
    });
    return res.data;
  } catch (error) {
    return error.message;
  }
};
