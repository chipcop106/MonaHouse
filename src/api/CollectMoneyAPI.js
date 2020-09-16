import instance, { getAccessToken } from "./instanceAPI";

const path = `/CollectMoneyApi`;

/*Lấy list phương thức thanh toán*/

export const getPaymentMethod = async (params) => {
    let result;
    try {
        const token = await getAccessToken();
        let res = await instance.get(`${path}/getpaymentmethod`);
        result = res.data;
    } catch (error) {
        result = error;
    }
    return result;
};

/*Thu tiền khách
string token, 
int roomid, 
int renterid, 
int month, 
int year, 
int paid, 
int payment, 

*/

export const collectMoney = async (params) => {
    let result;
    try {
        const token = await getAccessToken();
        let res = await instance.get(`${path}/collectmoney`, {
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

/*Lấy lịch sử thanh toán khách đó, phòng đó

string token, 
int roomid, 

*/
export const getPaymentHistory = async (params) => {
    let result;
    try {
        const token = await getAccessToken();
        let res = await instance.get(`${path}/gethistorycolletmoney`, {
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

/*
Lấy lịch sử điện nước theo: nhà, phòng, tháng, năm

string token, 
int motelid,
int roomid, 
int month, 
int year, 
int sort

Ghi chú: Sort
0 ngày ghi tăng
1 ngày ghi giảm
2 tên nhà A-Z
3 tên phòng Z-A
4 Tên nhà A-Z
5 Tên nhà Z-Z

motelid:0, roomid:0 => tất cả
motelid:1, roomid:0 => lấy theo nhà
motelid:0, roomid:1 => lấy theo phòng
*/
export const getEWHistory = async (params) => {
    let result;
    try {
        const token = await getAccessToken();
        let res = await instance.get(`${path}/HistoryUtility`, {
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

// token người dùng
// motelid=0 lấy hết nhà trọ
// sort:1 Tiền phòng tăng,2 Tiền phòng giảm, 3 tiền nợ tăng, 4 tiền nợ giảm
export const getListBillByMotel = async (params) => {
    let result;
    try {
        const token = await getAccessToken();
        let res = await instance.get(`${path}/BeforeCollectMoneyAll`, {
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

// token người dùng
// data: [{"roomId":2398,"renterId":1155,"paid":2500000,"note":"Không có note gì hết trơn á"}]
export const submitMonthlyPayment = async (params) => {
    let result;
    try {
        const token = await getAccessToken();
        let res = await instance.get(`${path}/CollectMoneyAll`, {
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

// token:token người dùng
// motelid:0
// roomid:0
// month:8
// year:2020
// sort:0
export const historyCollectMoney = async (params) => {
    let result;
    try {
        const token = await getAccessToken();
        let res = await instance.get(`${path}/HistoryCollectMoney`, {
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

// token:token người dùng
// roomid:
export const getBillOneRoom = async (params = { roomid: 0 }) => {
    let result;
    try {
        const token = await getAccessToken();
        let res = await instance.get(`${path}/BeforeCollectMoneyOne`, {
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
