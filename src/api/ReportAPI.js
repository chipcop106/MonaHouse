import instance, { getAccessToken } from "./instanceAPI";
import { create_UUID } from "~/utils";
const path = `/ReportApi`;

export const getTypeRoomByMotelID = async (params) => {
  try {
    const token = await getAccessToken();
    let res = await instance.get(`${path}/ReportTypeRoom`, {
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

export const getRevenueByMotelID = async (params) => {
  try {
    const token = await getAccessToken();
    let res = await instance.get(`${path}/ReportRevenue`, {
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
