import instance, { getAccessToken } from "./instanceAPI";
import { create_UUID } from "~/utils";
const path = `/ReportApi`;

export const getTypeRoomByMotelID = async (params) => {
  try {
    const token = await getAccessToken();
    let res = await instance.get(`${path}/ReportRoomType`, {
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

// token người dùng
// int MotelID - 0 lấy hết
// int RoomID - 0 lấy hết
// int Month - 0 lấy hết
// int Year - 0 lấy năm hiện tại
export const getRevenueByMotelID = async (params) => {
  try {
    const token = await getAccessToken();
    let res = await instance.get(`${path}/ReportRevenueInYear`, {
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

export const getReportOccupancyRatio = async (params) => {
  try {
    const token = await getAccessToken();
    let res = await instance.get(`${path}/ReportOccupancyRatio`, {
      params: {
        ...params,
        token,
      },
      //str token, int MotelID, int Year
    });
    return res.data;
  } catch (error) {
    return error.message;
  }
};

// string token
// int motel
export const getOverview = async (params = { motel: '' }) => {
  try {
    const token = await getAccessToken();
    let res = await instance.get(`${path}/OverView`, {
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

// string token
// int motelId
export const revenueInYear = async (params = { motelId: '' }) => {
  try {
    const token = await getAccessToken();
    let res = await instance.get(`${path}/ReportRevenueInYear`, {
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

// string token,
// int motelId = 0,
// int roomId=0,
// string search="",
// int pageIndex =1
export const getHistoryRenter = async (
  params = { motelId: 0, roomId: 0, search: '', pageIndex: 1 }
) => {
  try {
    const token = await getAccessToken();
    let res = await instance.get(`${path}/GetListOldRenter`, {
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
