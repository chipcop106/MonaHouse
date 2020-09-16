import instance, { getAccessToken } from "./instanceAPI";
import { create_UUID } from "~/utils";
const path = `/RenterApi`;

export const getRelationships = async () => {
  try {
    let res = await instance.get(`${path}/getrelationship`);
    return res.data;
  } catch (error) {
    return error;
  }
};

/*Thêm người thuê vào phòng 

string token, 
int roomid, 
string fullname, 
string phone, 
string email, 
int quantity, -- so ngoi ơ
int relationship, -- moi quan he
int cityid, -- quen quan
string objimg, -- danh sach hinh
string datein, -- ngay don vao dinh dang dd/MM/yyyy
int month, -- so thang o
string note, -- ghi chu ve ng thue
int totalprice, -- so tien nhan
string notepaid, -- ghi chu thu tien
int monthpaid, -- so thang muon dong truoc
int priceroom, -- gia phong
int electrict, -- so dien
int electrictprice, -- gia dien
int water, -- so nuoc
int waterprice, -- gia nuoc
int monthdeposit, -- so thang coc nha
int typeew, -- loại tinh dien nuo
string addonservice – danh sach dich vu thang

*/

export const addRenterOnRoom = async (params) => {
  let result;
  try {
    const token = await getAccessToken();
    let res = await instance.get(`${path}/insertrenter`, {
      params: {
        ...params,
        token,
      },
    });
    result = res.data;
  } catch (error) {
    result = error;
  }
  return result;
};

/**
 * 
 * @param string token
 int renterid
 string phone
 string fullname
 int quantity
 int relationship
 int cityid
 int avatarid
 string note
 string job
 string otherRenter
 * @returns Object
 */
export const updateRenterOnRoom = async (params) => {
  let result;
  try {
    const token = await getAccessToken();
    let res = await instance.get(`${path}/updaterenter`, {
      params: {
        ...params,
        token,
      },
    });
    result = res.data;
  } catch (error) {
    result = error;
  }
  return result;
};

/*Thêm dịch vụ phòng

string token, 
int renterid, 
int roomid, 
string services, 
int price

*/

export const addService = async (params) => {
  let result;
  try {
    const token = await getAccessToken();
    let res = await instance.get(`${path}/insertservice`, {
      params: {
        ...params,
        token,
      },
    });
    result = res.data;
  } catch (error) {
    result = error;
  }
  return result;
};

/*Xóa dịch vụ phòng

int id  // id service

*/

export const deleteService = async (params) => {
  let result;
  try {
    const token = await getAccessToken();
    let res = await instance.get(`${path}/deleteservice`, {
      params: {
        ...params,
        token,
      },
    });
    result = res.data;
  } catch (error) {
    result = error;
  }
  return result;
};

/*Upload giấy tờ nhân viên
POST method
formData file

*/

export const uploadRenterImage = async (params) => {
  let result;
  try {
    const token = await getAccessToken();
    let formData = new FormData();
    if (!!params) {
      !Array.isArray(params) && (params = [params]);
      [...params].map((image) => {
        !!image.filename?.includes(".HEIC") &&
          (image.filename = `${image.filename.split(".")[0]}.JPG`);
        const file = {
          uri: image.path,
          name: image.filename || `${create_UUID()}.jpg`,
          type: image.mime,
        };
        console.log(file);
        formData.append("file", file);
      });
    }
    console.log(formData);
    let res = await instance.post(`${path}/uploadIMG`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        token,
      },
    });
    result = res.data;
  } catch (error) {
    console.log(error);
    result = error;
  }
  return result;
};

// export const uploadElectrictWaterImage = async (params) => {
//     let result;
//     try {
//         const token = await getAccessToken();
//         let formData = new FormData();
//         formData.append("file", params);
//         let res = await instance.post(
//             `${path}/uploadshotelectrictwater`,
//             formData,
//             {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//                 params: {
//                     token,
//                 },
//             }
//         );
//         result = res.data;
//     } catch (error) {
//         result = error;
//     }
//     return result;
// };

/*Ghi số điện nước

string token, 
int renterid, 
int roomid, 
int month, 
int year, 
int electrict, 
string imgelectrict, 
int water, 
string imgwater

*/

export const updateElectricWater = async (params) => {
    try {
        const token = await getAccessToken();
        let res = await instance.get(`${path}/writewaterelectrict`, {
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

export const goOut = async (params) => {
  // MoveOut(string token, int renterid, int roomid, int paid, int payment)
  try {
    const token = await getAccessToken();
    let res = await instance.get(`${path}/MoveOut`, {
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

export const getCustomerRenting = async (params) => {
  // Params: string token, int motelid
  try {
    const token = await getAccessToken();
    let res = await instance.get(`${path}/ListRenter`, {
      params: {
        ...params,
        token,
      },
    });
    return res.data;
  } catch (error) {
    return error?.message ?? "Lỗi api";
  }
};

export const getCustomerDebt = async (params) => {
  // type:1 //1 nợ 2 dư
  // search:
  // sort:0
  // motelid:0
  // roomid:0
  // //motel=0=> tất cả nhà, !=0 => list người thuê theo id nhà
  try {
    const token = await getAccessToken();
    let res = await instance.get(`${path}/ListRenterDebt`, {
      params: {
        ...params,
        token,
      },
    });
    return res.data;
  } catch (error) {
    return error?.message ?? "Lỗi api";
  }
};
export const ReadyGoOut = async (params) => {
  // MoveOut(string token, int renterid, int roomid)
  try {
    const token = await getAccessToken();
    let res = await instance.get(`${path}/ReadyMoveOut`, {
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
